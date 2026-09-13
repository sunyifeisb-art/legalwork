from __future__ import annotations

import csv
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt

try:
    from openai import OpenAI
except Exception:  # pragma: no cover - optional until enhanced mode is selected
    OpenAI = None

try:
    from scripts.preprocess_input import has_meaningful_text, normalize, read_text
except ModuleNotFoundError:  # Allows importing as web.desensitize_engine in checks.
    from web.scripts.preprocess_input import has_meaningful_text, normalize, read_text

try:
    from scripts.ocr_text import (
        OcrUnavailable,
        ensure_ocr_available,
        extract_pdf_ocr_text,
        ocr_image_to_data,
    )
except ModuleNotFoundError:  # Allows importing as web.desensitize_engine in checks.
    from web.scripts.ocr_text import (
        OcrUnavailable,
        ensure_ocr_available,
        extract_pdf_ocr_text,
        ocr_image_to_data,
    )

try:
    from pptx import Presentation
except Exception:  # pragma: no cover - optional dependency
    Presentation = None

try:
    import fitz  # PyMuPDF
except Exception:  # pragma: no cover - optional dependency
    fitz = None

try:
    import pandas as pd
except Exception:  # pragma: no cover - optional dependency
    pd = None

try:
    from PIL import Image, ImageDraw
except Exception:  # pragma: no cover - optional dependency
    Image = None
    ImageDraw = None

try:
    from presidio_analyzer import AnalyzerEngine
except Exception:  # pragma: no cover - optional dependency
    AnalyzerEngine = None


def _ensure_redaction_in_path() -> None:
    """将 legalwork 根目录加入 sys.path，以便导入 redaction 包。"""
    current = Path(__file__).resolve()
    for parent in current.parents:
        if (parent / 'redaction' / '__init__.py').exists():
            parent_str = str(parent)
            if parent_str not in sys.path:
                sys.path.insert(0, parent_str)
            break


_ensure_redaction_in_path()

try:
    from redaction.detector import RedactionDetector

    REDACTION_AVAILABLE = True
except Exception as _redaction_import_error:  # pragma: no cover - optional dependency
    RedactionDetector = None  # type: ignore[misc, assignment]
    REDACTION_AVAILABLE = False

LEGAL_SUBJECT_TYPES = ['person_name', 'company_name', 'law_firm', 'institution_name']
FAST_SUBJECT_TYPES = ['company_name']

CHINESE_SURNAMES = set(
    '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜'
    '戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳鲍史唐费'
    '廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和'
    '穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋庞熊纪舒屈项祝董梁杜阮'
    '蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田胡凌霍虞万支'
    '柯昝管卢莫经房裘缪干解应宗丁宣邓郁单杭洪包诸左石崔吉龚程邢裴陆荣'
    '翁荀羊於惠甄曲家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓'
    '蓬全郗班仰秋仲伊宫宁仇栾暴甘斜厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟'
    '薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阳胥能苍双闻莘党翟谭贡劳逄'
    '姬申扶堵冉宰郦雍却璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎连'
    '习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧利师'
    '巩聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺'
    '权逯盖益桓公'
)
CHINESE_SURNAMES.add('兰')

PERSON_CONTEXT_PATTERN = re.compile(
    r'(?:委托诉讼代理人|委托代理人|诉讼代理人|法定代表人|出庭负责人|负责人|联系人|姓名|'
    r'审判长|审判员|人民陪审员|法官助理|书记员)'
    r'[：:\s，,、]*((?:[\u4e00-\u9fa5][ \t]*){2,4})'
    r'(?=\s*(?:[，,。；;、]|$|审判长|审判员|人民陪审员|法官助理|书记员|总经理|经理|局长|律师|男|女))'
)
PERSON_LIST_PATTERN = re.compile(
    r'(?<![\u4e00-\u9fa5])([\u4e00-\u9fa5]{2,4})(?:、|和|与)([\u4e00-\u9fa5]{2,4})(?![\u4e00-\u9fa5])'
)
PERSON_LIST_CONTEXT_PATTERN = re.compile(
    r'(?:委托诉讼代理人|委托代理人|诉讼代理人|法定代表人|出庭负责人|负责人|联系人)[：:\s，,、]*'
    r'([\u4e00-\u9fa5]{2,4})(?:、|和|与)([\u4e00-\u9fa5]{2,4})'
)
PERSON_ROLE_INLINE_PATTERN = re.compile(
    r'(?:委托诉讼代理人|委托代理人|诉讼代理人|法定代表人|出庭负责人|负责人|联系人|'
    r'副区长|区长|董事长|总经理|经理|审判长|审判员|人民陪审员|法官助理|书记员)'
    r'[：:\s，,、的]*'
    r'(?P<names>[\u4e00-\u9fa5]{2,4}(?:[、和与及]\s*[\u4e00-\u9fa5]{2,4})*)'
)
PARTY_PERSON_PATTERN = re.compile(
    r'(?:原告|被告|第三人|上诉人|被上诉人|申请人|被申请人|申请执行人|被执行人)'
    r'\s*(?:[（(][^）)]{0,50}[）)])?\s*[：:]\s*'
    r'(?P<name>[\u4e00-\u9fa5]{2,4})(?=\s*[，,（(])'
)
ORG_SUFFIX_PATTERN = (
    r'有限责任公司|股份有限公司|有限公司|股份公司|集团有限公司|集团公司|科技有限公司|'
    r'文化产业(?:（?[\u4e00-\u9fa5]{0,6}）?)?有限公司|律师事务所|事务所|'
    r'人民政府|人民法院|人民检察院|仲裁委员会|公证处|公安局|管理局|监管局|委员会|'
    r'银行|支行|分行|集团|公司|企业|中心'
)
ORG_NAME_CHARS = r'[\u4e00-\u9fa5A-Za-z0-9（）()·\-\s]'
PARTY_ROLE_PATTERN = (
    r'原告|被告|第三人|上诉人|被上诉人|申请人|被申请人|申请执行人|被执行人|'
    r'甲方|乙方|丙方|丁方|委托人|受托人'
)
PARTY_ORG_PATTERN = re.compile(
    rf'(?m)^(?:{PARTY_ROLE_PATTERN})\s*(?:[（(][^）)\n]{{0,50}}[）)])?\s*[：:]\s*'
    r'(?P<org>[^\n，,。；;]{2,120})'
)
ALIAS_ORG_PATTERN = re.compile(
    r'(?P<org>[^\n，,。；;、]{2,120}?)\s*'
    r'[（(]\s*(?:以下简称|下文简称|简称)\s*(?P<alias>[^）)\n]{2,40})\s*[）)]'
)
PRIVATE_ORG_SUFFIX_PATTERN = (
    r'有限责任公司|股份有限公司|集团有限公司|有限公司|律师事务所'
)
PRIVATE_ORG_PATTERN = re.compile(
    rf'(?P<org>[\u4e00-\u9fa5A-Za-z0-9·\- \t]{{2,70}}?'
    rf'(?:[（(][\u4e00-\u9fa5A-Za-z0-9·\-]{{1,16}}[）)])?'
    rf'[\u4e00-\u9fa5A-Za-z0-9·\- \t]{{0,40}}?(?:{PRIVATE_ORG_SUFFIX_PATTERN})'
    r'(?:[\u4e00-\u9fa5]{1,12}(?:分公司|支公司))?)'
)
SHORT_ORG_PATTERN = re.compile(
    r'(?P<org>(?:(?![与和及])[\u4e00-\u9fa5A-Za-z0-9·\-]){2,30}(?:分公司|支公司|公司|集团|银行|支行|分行))'
)
PUBLIC_INSTITUTION_SUFFIXES = (
    '税务局', '人民政府', '人民法院', '人民检察院', '仲裁委员会', '公证处',
    '公安局', '管理局', '监管局', '委员会',
)
GENERIC_ORG_TERMS = {
    '合作公司', '乙方合作公司', '商业管理公司', '地产开发公司', '房地产开发公司',
    '项目公司', '法人公司', '公司', '新设立的公司', '新注册成立的两家公司',
    '注册公司', '管理公司', '开发公司', '法人公司', '两家公司', '合作公司在丰满区分别注册成立商业管理公司',
}
LEGAL_NORM_TITLE_PATTERN = re.compile(r'(法|法律|法典|条例|规定|办法|规则|细则|解释|决定|意见|通知)$')
ENGLISH_LEGAL_NORM_FOLLOWING_PATTERN = re.compile(r'^\s+(?:Law|Act|Code|Regulation|Regulations|Rules)\b', re.IGNORECASE)


@dataclass(frozen=True)
class SubjectMapping:
    entity_type: str
    original: str
    redacted: str
    location: str
    confidence: float

    def to_dict(self) -> dict[str, Any]:
        return {
            'entity_type': self.entity_type,
            'original': self.original,
            'redacted': self.redacted,
            'location': self.location,
            'confidence': round(self.confidence, 3),
        }


TEXT_EXTENSIONS = {
    '.txt',
    '.md',
    '.markdown',
    '.log',
    '.rtf',
    '.html',
    '.htm',
    '.xml',
    '.yaml',
    '.yml',
    '.toml',
    '.ini',
    '.cfg',
    '.conf',
    '.env',
}
DOC_EXTENSIONS = {'.docx', '.doc'}
PDF_EXTENSIONS = {'.pdf'}
TABLE_EXTENSIONS = {'.csv', '.tsv', '.xlsx', '.xls', '.ods'}
JSON_EXTENSIONS = {'.json', '.jsonl', '.ndjson'}
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tif', '.tiff'}
PRESENTATION_EXTENSIONS = {'.pptx'}
LEGAL_DOCUMENT_FONT = 'STSong' if sys.platform == 'darwin' else ('SimSun' if sys.platform == 'win32' else 'Noto Serif CJK SC')


@dataclass(frozen=True)
class Finding:
    entity_type: str
    start: int
    end: int
    score: float
    replacement: str
    surface: str
    locator: str
    preview: str

    def to_dict(self) -> dict[str, Any]:
        return {
            'entity_type': self.entity_type,
            'start': self.start,
            'end': self.end,
            'score': round(self.score, 3),
            'replacement': self.replacement,
            'surface': self.surface,
            'locator': self.locator,
            'preview': self.preview,
        }


def _clean_company_name(original: str) -> str:
    """从 detector 识别的公司名文本中尽量提取核心名称。"""
    name = original.strip()

    # 去掉尾部常见公司后缀。
    suffixes = [
        '有限责任公司', '股份有限公司', '有限公司', '股份公司',
        '集团有限公司', '集团公司', '集团', '科技有限公司',
        '合伙企业', '有限合伙企业', '有限合伙', '事务所',
        '研究院', '研究所', '学会', '协会', '委员会',
        '人民政府', '管理局', '监管局', '人民法院', '人民检察院',
        '仲裁委员会', '公证处', '公安局', '银行', '支行', '分行',
        '公司', '企业', '中心',
    ]
    for suffix in sorted(suffixes, key=len, reverse=True):
        if name.endswith(suffix):
            name = name[:-len(suffix)]
            break

    # 按常见分隔符切分，取最后一段作为核心名称。
    parts = re.split(r'[^一-龥]+|与|和|及|同|向|对|为|的|被|将|因|就|由|自|至|在|从|跟|是|属|于', name)
    core = parts[-1] if parts else name
    core = core.strip('"“”‘’「『』】）()（')

    # 去掉开头常见地名前缀。
    city_prefixes = [
        '北京', '上海', '广州', '深圳', '天津', '重庆',
        '杭州', '南京', '武汉', '成都', '西安', '苏州',
        '无锡', '宁波', '青岛', '大连', '厦门', '长沙',
        '济南市', '青岛市', '石家庄市', '太原市', '沈阳市',
        '长春市', '哈尔滨市', '合肥市', '福州市', '南昌市',
        '郑州市', '武汉市', '长沙市', '南宁市', '海口市',
        '贵阳市', '昆明市', '拉萨市', '兰州市', '西宁市',
        '银川市', '乌鲁木齐市', '呼和浩特市',
    ]
    for prefix in city_prefixes:
        if core.startswith(prefix):
            core = core[len(prefix):]
            break

    # 去掉开头常见非主体前缀（时间词、国别等）。
    non_subject_prefixes = ['年月日', '年月', '中国', '国家']
    for prefix in non_subject_prefixes:
        if core.startswith(prefix):
            core = core[len(prefix):]
            break

    return core


def _private_org_identity(original: str, *, is_law_firm: bool = False) -> tuple[str, str]:
    """提取机构品牌核心和规范后缀，用于合并全称、简称并生成稳定代称。"""
    compact = re.sub(r'\s+', '', original.strip())
    if not compact:
        return '', '律师事务所' if is_law_firm else '公司'

    law_firm = is_law_firm or compact.endswith(('律师事务所', '律师所'))
    if law_firm:
        core = re.sub(r'(?:律师事务所|律师所)$', '', compact)
        normalized_suffix = '律师事务所'
    elif compact.endswith(PUBLIC_INSTITUTION_SUFFIXES):
        suffix = next(suffix for suffix in PUBLIC_INSTITUTION_SUFFIXES if compact.endswith(suffix))
        # Public bodies that are litigating parties retain only their functional
        # category. Keeping the administrative hierarchy would disclose the party.
        core = ''
        normalized_suffix = suffix
    else:
        branch_match = re.search(
            r'(?:(?:河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|'
            r'广东|海南|四川|贵州|云南|陕西|甘肃|青海|北京|上海|天津|重庆)(?:省|市)?|'
            r'[\u4e00-\u9fa5]{2,6}(?:市|区|县))?(?:分公司|支公司)$',
            compact,
        )
        if branch_match:
            compact = compact[:branch_match.start()]
        core = re.sub(
            r'(?:有限责任公司|股份有限公司|集团有限公司|有限公司|股份公司|集团公司|'
            r'有限合伙企业|合伙企业|有限合伙|集团|公司|企业)$',
            '',
            compact,
        )
        if core.endswith('银行'):
            core = core[:-2]
            normalized_suffix = '银行'
        elif compact.endswith(('银行', '支行', '分行')):
            suffix = next(suffix for suffix in ('支行', '分行', '银行') if compact.endswith(suffix))
            core = compact[:-len(suffix)]
            normalized_suffix = suffix
        else:
            normalized_suffix = '公司'

    # 登记名称中的行政区划不承担主体区分作用，不应被保留为识别线索。
    geo_prefixes = (
        '内蒙古自治区', '广西壮族自治区', '宁夏回族自治区', '新疆维吾尔自治区', '西藏自治区',
        '北京市', '上海市', '天津市', '重庆市', '内蒙古', '广西', '宁夏', '新疆', '西藏',
        '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省',
        '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省',
        '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省',
        '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西',
        '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西',
        '甘肃', '青海', '北京', '上海', '天津', '重庆', '中国', '国家',
        '济南', '青岛', '石家庄', '太原', '沈阳', '长春', '哈尔滨', '合肥', '福州',
        '南昌', '郑州', '武汉', '长沙', '南宁', '海口', '贵阳', '昆明', '拉萨',
        '兰州', '西宁', '银川', '乌鲁木齐', '呼和浩特', '上饶', '章丘',
        '大连', '杭州', '南京', '成都', '西安', '苏州', '无锡', '宁波', '厦门',
    )
    for prefix in sorted(geo_prefixes, key=len, reverse=True):
        if core.startswith(prefix) and len(core) > len(prefix) + 1:
            core = core[len(prefix):]
            break
    core = re.sub(r'^[\u4e00-\u9fa5]{2,10}(?:自治州|自治县|地区|盟|市|区|县)', '', core)

    # 行业词只说明经营范围；留下品牌名除首字外的部分，形成“某米公司”式稳定别名。
    industry_terms = (
        '房地产开发', '建筑工程', '建设工程', '装饰工程', '工程建设', '信息技术', '网络科技',
        '科技发展', '文化产业', '商业管理', '企业管理', '投资管理', '资产管理', '物业管理',
        '房地产发展', '房地产', '担保', '置业', '园林工程', '园林',
        '建筑', '建设', '工程', '商贸', '贸易', '科技', '实业', '投资', '咨询', '服务', '发展',
    )
    changed = True
    while changed:
        changed = False
        for term in sorted(industry_terms, key=len, reverse=True):
            if core.endswith(term) and len(core) > len(term):
                core = core[:-len(term)]
                changed = True
                break

    core = core.strip('·-—_')
    return core, normalized_suffix


def _private_org_token(original: str, *, is_law_firm: bool = False) -> str:
    """生成保留品牌指向、隐藏完整登记名称的机构别名。"""
    core, normalized_suffix = _private_org_identity(original, is_law_firm=is_law_firm)
    if not core:
        return f'某{normalized_suffix}'
    brand_alias = '某' if len(core) == 1 else f'某{core[1:]}'
    return f'{brand_alias}{normalized_suffix}'


def _generate_subject_token(entity_type: str, original: str) -> str:
    """生成有稳定指向但不能还原完整主体名称的脱敏 token。"""
    if not original:
        return original
    if entity_type in {'company_name', 'law_firm', 'institution_name'}:
        return _private_org_token(original, is_law_firm=entity_type == 'law_firm')
    if entity_type == 'person_name':
        # 保留姓，名替换为"某"。
        compact = re.sub(r'\s+', '', original)
        if len(compact) <= 1:
            return compact
        return compact[0] + '某' * (len(compact) - 1)
    return original


def _with_subject_discriminator(token: str, entity_type: str, index: int) -> str:
    markers = '甲乙丙丁戊己庚辛壬癸'
    marker = markers[index] if index < len(markers) else str(index + 1)
    if entity_type == 'person_name':
        return f'{token}{marker}'
    for suffix in ('律师事务所', *PUBLIC_INSTITUTION_SUFFIXES, '银行', '支行', '分行', '公司'):
        if token.endswith(suffix):
            return f'{token[:-len(suffix)]}{marker}{suffix}'
    return f'{token}{marker}'


def _looks_like_person_name(value: str, *, require_known_surname: bool = True) -> bool:
    value = re.sub(r'\s+', '', value)
    if not 2 <= len(value) <= 6:
        return False
    if '某' in value or '*' in value:
        return False
    noise = {
        '公司', '企业', '集团', '法院', '银行', '合同', '协议', '数据', '用户', '个人', '信息',
        '政府', '项目', '投资', '实际', '继续', '协商', '承担', '提出', '原因', '支付',
        '权利', '义务', '责任', '违约', '资金', '商业', '地块', '按照', '收到', '作出',
        '履行', '申请', '被告', '原告', '第三', '行政', '诉讼', '审理', '判决',
        '原本', '核对', '本件', '小件', '与原本', '到庭', '董事长', '总经理', '兼总经理',
    }
    if value in noise or value.startswith(('与', '及', '和')) or any(word in value for word in noise):
        return False
    return not require_known_surname or value[0] in CHINESE_SURNAMES


def _normalize_org_name(value: str) -> str:
    name = value.strip().strip('，,。；;：:、 \t\r\n"“”‘’')
    name = re.sub(r'\s+', '', name)
    name = re.sub(
        r'^(?:原告|被告|第三人|上诉人|被上诉人|申请人|被申请人|申请执行人|被执行人|'
        r'甲方|乙方|丙方|丁方|委托人|受托人|住所地|住址|地址|因诉|诉|与|向|由|及|和|同|在|为|的)+',
        '',
        name,
    )
    trim_markers = [
        '由乙方及乙方', '由乙方', '乙方及乙方', '分别注册成立', '注册成立',
        '新设立的', '新注册成立的', '以下简称', '因诉',
    ]
    for marker in trim_markers:
        if marker in name:
            name = name.split(marker)[-1]
    return name.strip().strip('，,。；;：:、 \t\r\n"“”‘’')


def _looks_like_legal_org(value: str) -> bool:
    name = _normalize_org_name(value)
    if len(name) < 4 or len(name) > 80:
        return False
    if '某' in name or '*' in name:
        return False
    if name in GENERIC_ORG_TERMS:
        return False
    generic_phrases = {
        '合作公司', '乙方合作公司', '商业管理公司', '地产开发公司', '房地产开发公司',
        '项目公司', '法人公司', '新设立的公司', '新注册成立的两家公司',
        '注册公司', '两家公司', '独立法人项目公司',
    }
    if any(generic in name for generic in generic_phrases):
        return False
    if any(generic in name for generic in {'分别注册成立商业管理公司', '乙方合作公司在', '本协议', '通过土地'}):
        return False
    if re.search(r'(注册成立|新设立|新注册成立|合作|项目|法人|商业管理|地产开发|房地产开发).{0,8}公司', name):
        return False
    return bool(re.search(ORG_SUFFIX_PATTERN, name))


def _is_public_legal_norm_subject(text: str, entity: Any) -> bool:
    """公开法律规范名称不作为案件主体替换。"""
    start = int(getattr(entity, 'start', 0))
    end = int(getattr(entity, 'end', 0))
    original = str(getattr(entity, 'text', ''))
    if not original or end <= start:
        return False

    following = text[end:end + 24]
    if ENGLISH_LEGAL_NORM_FOLLOWING_PATTERN.match(following):
        return True

    left = text.rfind('《', 0, start + 1)
    right = text.find('》', end)
    if left >= 0 and right >= 0 and text.find('》', left, start) < 0:
        title = text[left + 1:right]
        if LEGAL_NORM_TITLE_PATTERN.search(re.sub(r'\s+', '', title)):
            return True

    context = re.sub(r'\s+', '', text[max(0, start - 8):end + 12])
    if any(marker in context for marker in ('根据', '依据', '适用', '依照')) and LEGAL_NORM_TITLE_PATTERN.search(context):
        return True
    return False


def _detect_person_subjects(text: str) -> list[Any]:
    """用轻量规则识别常见中文自然人姓名，避免为人名加载重型 NER。"""
    entities: list[Any] = []
    if not text:
        return entities

    class _Entity:
        def __init__(self, original: str, start: int, end: int, confidence: float, canonical: str | None = None) -> None:
            self.entity_type = 'person_name'
            self.text = original
            self.start = start
            self.end = end
            self.confidence = confidence
            self.canonical = canonical or re.sub(r'\s+', '', original)

    known_names: set[str] = set()

    def add_name(
        original: str,
        start: int,
        end: int,
        confidence: float,
        *,
        explicit_role: bool = False,
    ) -> None:
        compact = re.sub(r'\s+', '', original)
        for artifact in ('小件与原本', '本件与原本', '小件', '本件', '书记员', '审判员', '审判长'):
            if artifact in compact:
                compact = compact.split(artifact, 1)[0]
                end = start + len(compact)
                original = text[start:end]
                break
        if _looks_like_person_name(compact, require_known_surname=not explicit_role):
            known_names.add(compact)
            entities.append(_Entity(original, start, end, confidence, canonical=compact))

    for match in PERSON_CONTEXT_PATTERN.finditer(text):
        original = match.group(1)
        add_name(original, match.start(1), match.end(1), 0.9, explicit_role=True)

    for match in PARTY_PERSON_PATTERN.finditer(text):
        original = match.group('name')
        add_name(original, match.start('name'), match.end('name'), 0.92)

    for match in PERSON_LIST_CONTEXT_PATTERN.finditer(text):
        for group_index in (1, 2):
            original = match.group(group_index)
            add_name(original, match.start(group_index), match.end(group_index), 0.82, explicit_role=True)

    for match in PERSON_ROLE_INLINE_PATTERN.finditer(text):
        names_text = match.group('names')
        names_start = match.start('names')
        cursor = 0
        for part in re.finditer(r'[\u4e00-\u9fa5]{2,4}', names_text):
            original = part.group(0)
            add_name(original, names_start + part.start(), names_start + part.end(), 0.86, explicit_role=True)
            cursor = part.end()
        del cursor

    for name in sorted(known_names, key=len, reverse=True):
        pattern = r'\s*'.join(re.escape(char) for char in name)
        for match in re.finditer(pattern, text):
            add_name(match.group(0), match.start(), match.end(), 0.8)

    return entities


ORG_CONTEXT_MARKERS = (
    '一审法院依法扣划在', '依法扣划在', '除去其持有的', '申请评估拍卖', '申请拍卖',
    '案涉股权由', '股权由', '转让给', '持有的', '竞买人为', '买受人为', '系由',
    '因与被上诉人', '与被上诉人', '因与', '以下简称', '下文简称', '简称',
    '上诉人', '被上诉人', '申请执行人',
    '被执行人', '原审第三人', '第三人', '原告', '被告', '甲方', '乙方', '丙方',
    '丁方',
)
ORG_SURFACE_NOISE = {
    '企业法人', '经营过程中', '应当依法', '判令', '撤销', '驳回', '如果', '按照',
    '本案', '案涉', '申请拍卖', '依法扣划', '除去其', '持有的', '取得的', '产生的',
    '未缴的', '欠缴', '符合企业', '人民法院对', '恳请', '原审法院', '二审法院',
    '认为', '主张', '请求', '辩称', '述称', '答辩',
}


def _normalize_legal_role_spacing(text: str) -> str:
    """Collapse decorative spacing in legal role labels without touching body prose."""
    labels = (
        '委托诉讼代理人', '委托代理人', '诉讼代理人', '法定代表人', '出庭负责人',
        '负责人', '联系人', '审判长', '审判员', '人民陪审员', '法官助理', '书记员',
        '律师事务所', '有限责任公司', '股份有限公司', '集团有限公司',
    )
    for label in labels:
        text = re.sub(r'[ \t\r\n]*'.join(re.escape(char) for char in label), label, text)
    return text


def _org_entity_type(value: str, *, allow_public: bool) -> str | None:
    compact = re.sub(r'\s+', '', value)
    if compact.endswith(('律师事务所', '律师所')):
        return 'law_firm'
    if compact.endswith(PUBLIC_INSTITUTION_SUFFIXES):
        return 'institution_name' if allow_public else None
    if compact.endswith((
        '有限责任公司', '股份有限公司', '集团有限公司', '有限公司', '股份公司',
        '集团公司', '分公司', '支公司', '公司', '集团', '银行', '支行', '分行',
    )):
        return 'company_name'
    return None


def _trim_org_surface(value: str, absolute_start: int) -> tuple[str, int, int]:
    """Return the exact organization surface and keep its source offsets aligned."""
    raw = value
    left = len(raw) - len(raw.lstrip())
    raw = raw.lstrip()
    absolute_start += left
    raw = re.sub(r'\s+$', '', raw)
    raw = re.sub(r'^[—\-]*\s*第\s*\d+\s*页\s*[—\-]*\s*', '', raw)

    cut = 0
    for marker in ORG_CONTEXT_MARKERS:
        marker_end = raw.rfind(marker)
        if marker_end >= 0 and marker_end + len(marker) < len(raw):
            cut = max(cut, marker_end + len(marker))
    if cut:
        raw = raw[cut:]
        absolute_start += cut

    leading = re.match(r'^[：:\s的]+', raw)
    if leading:
        raw = raw[leading.end():]
        absolute_start += leading.end()
    connector = re.match(r'^(?:由|向|对|与|和|及|同|将|给)', raw)
    if connector and connector.end() + 3 < len(raw):
        raw = raw[connector.end():]
        absolute_start += connector.end()
    raw = raw.rstrip('，,。；;：:、 \t')
    return raw, absolute_start, absolute_start + len(raw)


def _valid_org_surface(value: str, *, allow_public: bool, short: bool = False) -> bool:
    compact = re.sub(r'\s+', '', value)
    entity_type = _org_entity_type(compact, allow_public=allow_public)
    if entity_type is None or not 4 <= len(compact) <= 80:
        return False
    if '某' in compact or '*' in compact or compact in GENERIC_ORG_TERMS:
        return False
    if any(noise in compact for noise in ORG_SURFACE_NOISE):
        return False
    if compact.startswith(('全国银行', '人民银行', '最高人民法院', '中华人民共和国')):
        return False
    if short:
        if entity_type == 'institution_name':
            return True
        core, _ = _private_org_identity(compact, is_law_firm=entity_type == 'law_firm')
        if not 2 <= len(core) <= 18:
            return False
        if any(word in core for word in ('企业法人', '过程中', '所以', '或者', '依据', '应当')):
            return False
    return True


def _org_alias_signature(value: str) -> str:
    compact = re.sub(r'\s+', '', value)
    entity_type = _org_entity_type(compact, allow_public=True) or 'company_name'
    core, _ = _private_org_identity(compact, is_law_firm=entity_type == 'law_firm')
    return core


def _common_prefix_length(left: str, right: str) -> int:
    size = 0
    for lchar, rchar in zip(left, right):
        if lchar != rchar:
            break
        size += 1
    return size


def _infer_org_alias(alias: str, primary_names: list[str]) -> str | None:
    signature = _org_alias_signature(alias)
    if len(signature) < 2:
        return None
    scored: list[tuple[int, str]] = []
    alias_compact = re.sub(r'\s+', '', alias)
    for canonical in primary_names:
        canonical_signature = _org_alias_signature(canonical)
        if not canonical_signature:
            continue
        if signature == canonical_signature:
            score = 100
        elif signature in canonical_signature or canonical_signature in signature:
            score = 70 + min(len(signature), len(canonical_signature))
        else:
            continue
        score += min(20, _common_prefix_length(alias_compact, canonical) * 4)
        scored.append((score, canonical))
    if not scored:
        return None
    scored.sort(key=lambda item: item[0], reverse=True)
    if len(scored) > 1 and scored[0][0] == scored[1][0]:
        return None
    return scored[0][1]


def _detect_legal_org_subjects(text: str) -> list[Any]:
    """Build a document-wide organization ledger before applying any replacement."""
    entities: list[Any] = []
    if not text:
        return entities

    class _Entity:
        def __init__(
            self,
            original: str,
            start: int,
            end: int,
            confidence: float,
            canonical: str,
            entity_type: str,
        ) -> None:
            self.entity_type = entity_type
            self.text = original
            self.start = start
            self.end = end
            self.confidence = confidence
            self.canonical = canonical

    primary_names: list[str] = []
    primary_entity_types: dict[str, str] = {}
    seen_surfaces: set[tuple[str, str]] = set()

    def add_span(
        value: str,
        start: int,
        *,
        confidence: float,
        canonical: str | None = None,
        allow_public: bool = False,
        primary: bool = False,
        short: bool = False,
    ) -> str | None:
        surface, surface_start, surface_end = _trim_org_surface(value, start)
        if not _valid_org_surface(surface, allow_public=allow_public, short=short):
            return None
        compact = re.sub(r'\s+', '', surface)
        normalized_canonical = re.sub(r'\s+', '', canonical or compact)
        entity_type = _org_entity_type(compact, allow_public=allow_public)
        if entity_type is None:
            return None
        if canonical and normalized_canonical in primary_entity_types:
            entity_type = primary_entity_types[normalized_canonical]
        key = (compact, normalized_canonical)
        if key not in seen_surfaces:
            seen_surfaces.add(key)
            entities.append(_Entity(
                surface,
                surface_start,
                surface_end,
                confidence,
                normalized_canonical,
                entity_type,
            ))
        if primary and normalized_canonical not in primary_names:
            primary_names.append(normalized_canonical)
            primary_entity_types[normalized_canonical] = entity_type
        return normalized_canonical

    # Party headers are authoritative. A public body is redacted here only when it
    # is itself a litigating subject; adjudicating/cited courts remain public.
    for match in PARTY_ORG_PATTERN.finditer(text):
        value = re.split(r'[（(]\s*(?:以下简称|下文简称|简称)', match.group('org'), maxsplit=1)[0]
        add_span(
            value,
            match.start('org'),
            confidence=0.98,
            allow_public=True,
            primary=True,
        )

    # Registered private organizations and law firms are strong identity anchors.
    for match in PRIVATE_ORG_PATTERN.finditer(text):
        add_span(
            match.group('org'),
            match.start('org'),
            confidence=0.94,
            primary=True,
        )

    # Explicit "以下简称" declarations bind the alias to the exact full identity.
    for match in ALIAS_ORG_PATTERN.finditer(text):
        canonical = add_span(
            match.group('org'),
            match.start('org'),
            confidence=0.97,
            allow_public=True,
            primary=True,
        )
        if canonical:
            add_span(
                match.group('alias'),
                match.start('alias'),
                confidence=0.97,
                canonical=canonical,
                allow_public=True,
                short=True,
            )

    # Short forms are accepted only when they can be linked to a primary identity,
    # or when the same concrete name repeats. This prevents prose ending in “公司”
    # or “银行” from becoming a fabricated subject.
    short_candidates: list[tuple[str, int]] = []
    short_counts: Counter[str] = Counter()
    for match in SHORT_ORG_PATTERN.finditer(text):
        surface, surface_start, _ = _trim_org_surface(match.group('org'), match.start('org'))
        if not _valid_org_surface(surface, allow_public=False, short=True):
            continue
        compact = re.sub(r'\s+', '', surface)
        if any(ending in compact for ending in ('有限责任公司', '股份有限公司', '集团有限公司', '有限公司', '律师事务所')):
            continue
        short_candidates.append((surface, surface_start))
        short_counts[compact] += 1

    for surface, start in short_candidates:
        compact = re.sub(r'\s+', '', surface)
        canonical = _infer_org_alias(compact, primary_names)
        if canonical is None and short_counts[compact] < 2:
            continue
        add_span(
            surface,
            start,
            confidence=0.9 if canonical else 0.84,
            canonical=canonical or compact,
            short=True,
        )

    return entities


def redact_legal_subjects(
    text: str,
    locator: str = '',
    *,
    cluster_counters: dict[str, int] | None = None,
    detector: Any | None = None,
) -> tuple[str, list[SubjectMapping]]:
    """识别并替换法律主体（自然人、公司），返回替换后文本与可逆映射表。"""
    if not text or not text.strip():
        return text, []

    entities: list[Any] = []
    # Organization replacement is driven by the deterministic document ledger.
    # Broad detector spans can absorb adjacent legal prose (for example two parties
    # separated by “因与”), so they are deliberately not mixed into this pass.
    del detector
    entities.extend(_detect_legal_org_subjects(text))
    entities.extend(_detect_person_subjects(text))
    entities = [entity for entity in entities if not _is_public_legal_norm_subject(text, entity)]
    if not entities:
        return text, []

    # Filter out low-confidence company/organization matches where the text only
    # ends with a broad suffix like "区" / "中心" without a concrete institution word.
    concrete_institution_words = {
        '公司', '集团', '企业', '事务所', '银行', '政府', '委员会',
        '协会', '学会', '研究院', '管理局', '监管局', '人民法院',
        '人民检察院', '仲裁委员会', '公证处', '公安局', '税务局',
    }
    filtered_entities: list[Any] = []
    for entity in entities:
        entity_type = getattr(entity, 'entity_type', '')
        original = getattr(entity, 'text', '')
        compact_original = re.sub(r'\s+', '', original)
        if entity_type == 'company_name' and not compact_original.endswith(
            ('有限责任公司', '股份有限公司', '有限公司', '股份公司', '集团公司', '集团',
             '分公司', '支公司', '公司', '企业', '银行', '支行', '分行')
        ):
            continue
        if entity_type in {'company_name', 'law_firm', 'institution_name'} and not any(
            word in compact_original for word in concrete_institution_words
        ):
            continue
        filtered_entities.append(entity)
    entities = filtered_entities

    # 按实体文本聚类，保证同一主体对应同一 token。
    # token 保留首尾字，中间替换为"某"，使脱敏结果与原名称保持可感知关联。
    clusters: dict[str, dict[str, Any]] = {}

    for entity in entities:
        entity_type = getattr(entity, 'entity_type', '')
        original = getattr(entity, 'text', '')
        canonical = getattr(entity, 'canonical', original)
        if entity_type not in LEGAL_SUBJECT_TYPES or not original:
            continue
        if canonical not in clusters:
            clusters[canonical] = {
                'entity_type': entity_type,
                'token': _generate_subject_token(entity_type, canonical),
                'first_start': int(getattr(entity, 'start', 0)),
            }

    # Full names and aliases already share an exact canonical ledger id. Distinct
    # registered subjects must never be merged merely because their brands overlap.
    identities: dict[str, dict[str, Any]] = {}
    cluster_identity_keys: dict[str, str] = {}
    for canonical, cluster in clusters.items():
        entity_type = str(cluster['entity_type'])
        canonical_compact = re.sub(r'\s+', '', canonical)
        identity_key = f'{entity_type}:{canonical_compact}'
        cluster_identity_keys[canonical] = identity_key
        identity = identities.setdefault(identity_key, {
            'entity_type': entity_type,
            'token': cluster['token'],
            'first_start': cluster['first_start'],
        })
        identity['first_start'] = min(int(identity['first_start']), int(cluster['first_start']))

    token_groups: dict[str, list[tuple[str, dict[str, Any]]]] = defaultdict(list)
    for identity_key, identity in identities.items():
        token_groups[str(identity['token'])].append((identity_key, identity))
    for group in token_groups.values():
        if len(group) <= 1:
            continue
        for index, (_, identity) in enumerate(sorted(group, key=lambda item: item[1]['first_start'])):
            identity['token'] = _with_subject_discriminator(
                str(identity['token']),
                str(identity['entity_type']),
                index,
            )
    for canonical, cluster in clusters.items():
        cluster['token'] = identities[cluster_identity_keys[canonical]]['token']

    if not clusters:
        return text, []

    redacted_text = text
    subject_mappings: list[SubjectMapping] = []
    surface_mappings: dict[tuple[str, str], SubjectMapping] = {}
    for entity in entities:
        original = getattr(entity, 'text', '')
        entity_type = getattr(entity, 'entity_type', '')
        canonical = getattr(entity, 'canonical', original)
        if canonical not in clusters:
            continue
        token = clusters[canonical]['token']
        compact_original = re.sub(r'\s+', '', original)
        if not compact_original or '某' in compact_original or '*' in compact_original:
            continue
        surface_mappings.setdefault((entity_type, compact_original), SubjectMapping(
            entity_type=entity_type,
            original=original,
            redacted=token,
            location=locator,
            confidence=float(getattr(entity, 'confidence', 0.0)),
        ))

    # Apply the completed ledger globally, longest surface first. Replacement does
    # not depend on the first detector span, so OCR spacing and later short forms
    # cannot produce front-redacted/back-unredacted inconsistencies.
    for (_, compact_original), mapping in sorted(
        surface_mappings.items(),
        key=lambda item: len(item[0][1]),
        reverse=True,
    ):
        flexible_pattern = r'\s*'.join(re.escape(char) for char in compact_original)
        redacted_text = re.sub(flexible_pattern, mapping.redacted, redacted_text)
        subject_mappings.append(mapping)

    return redacted_text, subject_mappings


def sanitize_text_and_subjects(
    text: str,
    engine: Desensitizer,
    *,
    surface: str = 'text',
    locator: str = '',
) -> tuple[str, list[Finding], list[SubjectMapping]]:
    """先执行隐私信息脱敏，再对法律主体进行可逆替换。"""
    text = _normalize_legal_role_spacing(text)
    sanitized, findings = engine.sanitize_text(text, surface=surface, locator=locator)
    redacted, subject_mappings = redact_legal_subjects(
        sanitized,
        locator=locator,
        detector=engine._subject_detector,
    )
    return redacted, findings, subject_mappings


REGEX_RULES: list[tuple[str, re.Pattern[str], float]] = [
    (
        'EMAIL_ADDRESS',
        re.compile(r'(?<![\w.+-])[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?![\w.-])'),
        0.95,
    ),
    (
        'PHONE_NUMBER',
        re.compile(r'(?<!\d)(?:\+?86[-\s]?)?1[3-9](?:[ -]?\d){9}(?!\d)'),
        0.96,
    ),
    (
        'ID_CARD',
        re.compile(r'(?<![0-9A-Za-z])\d(?:[ -]?\d){16}[ -]?[\dXx](?![0-9A-Za-z])'),
        0.96,
    ),
    (
        'BANK_CARD',
        re.compile(r'(?<!\d)\d(?:[ -]?\d){14,18}(?!\d)'),
        0.8,
    ),
    (
        'IP_ADDRESS',
        re.compile(r'(?<!\d)(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}(?!\d)'),
        0.9,
    ),
    (
        'API_KEY',
        re.compile(r'(?i)\b(?:api[_-]?key|secret|token|password|passwd|access[_-]?key)\s*[:=]\s*[\'"][^\'"]{8,}[\'"]'),
        0.9,
    ),
    (
        'PRIVATE_KEY',
        re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH |)?PRIVATE KEY-----[\s\S]+?-----END (?:RSA |EC |OPENSSH |)?PRIVATE KEY-----'),
        0.99,
    ),
    (
        'ADDRESS',
        re.compile(
            r'(?<![\u4e00-\u9fa5])(?:住所地|住址|居住地|联系地址|地址|住)[：:\s，,、]*'
            r'[^\n，,。；;]{6,140}'
            r'|(?:[\u4e00-\u9fa5]{1,12}(?:路|街|巷|弄)\d+(?:号|室|层|单元|栋|座)?)'
        ),
        0.72,
    ),
    (
        'BIRTH_DATE',
        re.compile(r'(?<!\d)(?:18|19|20)\d{2}\s*年\s*(?:0?[1-9]|1[0-2])\s*月\s*(?:0?[1-9]|[12]\d|3[01])\s*日\s*出生'),
        0.9,
    ),
]

PRESIDIO_ENTITY_MAP = {
    'EMAIL_ADDRESS': 'EMAIL_ADDRESS',
    'PHONE_NUMBER': 'PHONE_NUMBER',
    'CREDIT_CARD': 'BANK_CARD',
    'IP_ADDRESS': 'IP_ADDRESS',
    'PERSON': 'PERSON',
    'LOCATION': 'ADDRESS',
    'US_SSN': 'ID_NUMBER',
    'IBAN_CODE': 'BANK_CARD',
    'CRYPTO': 'API_KEY',
}


class Desensitizer:
    def __init__(self) -> None:
        self._analyzer: Any | None = None
        self._subject_detector: Any | None = None
        self.presidio_available = False
        self.subject_detector_available = False
        use_presidio = os.environ.get('COMPLIANCEAI_USE_PRESIDIO', '').lower() in {'1', 'true', 'yes'}
        if use_presidio and AnalyzerEngine is not None and importlib.util.find_spec('en_core_web_sm') is not None:
            try:
                self._analyzer = AnalyzerEngine()
                self.presidio_available = True
            except Exception:
                self._analyzer = None
        if REDACTION_AVAILABLE:
            try:
                self._subject_detector = RedactionDetector()
                self.subject_detector_available = True
            except Exception:
                self._subject_detector = None

    def sanitize_text(self, text: str, *, surface: str = 'text', locator: str = '') -> tuple[str, list[Finding]]:
        findings = self._detect(text, surface=surface, locator=locator)
        sanitized = replace_spans(text, findings)
        return sanitized, findings

    def _detect(self, text: str, *, surface: str, locator: str) -> list[Finding]:
        findings: list[Finding] = []
        for entity_type, pattern, score in REGEX_RULES:
            for match in pattern.finditer(text):
                value = match.group(0)
                if value.count('*') >= 2:
                    continue
                if entity_type == 'ADDRESS' and '某地址' in value:
                    continue
                if entity_type == 'BANK_CARD' and len(re.sub(r'\D', '', value)) < 15:
                    continue
                if entity_type == 'BANK_CARD' and looks_like_id_card(value):
                    continue
                findings.append(make_finding(entity_type, match.start(), match.end(), score, surface, locator, value))

        if self._analyzer is not None and text.strip():
            try:
                for result in self._analyzer.analyze(text=text[:100_000], language='en'):
                    entity_type = PRESIDIO_ENTITY_MAP.get(result.entity_type, result.entity_type)
                    value = text[result.start:result.end]
                    findings.append(
                        make_finding(
                            entity_type,
                            result.start,
                            result.end,
                            float(result.score),
                            surface,
                            locator,
                            value,
                        )
                    )
            except Exception:
                pass

        return dedupe_findings(findings)


def make_finding(
    entity_type: str,
    start: int,
    end: int,
    score: float,
    surface: str,
    locator: str,
    value: str,
) -> Finding:
    return Finding(
        entity_type=entity_type,
        start=start,
        end=end,
        score=score,
        replacement=desensitize_value(entity_type, value),
        surface=surface,
        locator=locator,
        preview=mask_preview(value),
    )


def dedupe_findings(findings: list[Finding]) -> list[Finding]:
    ordered = sorted(findings, key=lambda item: (item.start, -(item.end - item.start), -item.score))
    kept: list[Finding] = []
    for finding in ordered:
        if any(not (finding.end <= current.start or finding.start >= current.end) for current in kept):
            continue
        kept.append(finding)
    return sorted(kept, key=lambda item: item.start)


def replace_spans(text: str, findings: list[Finding]) -> str:
    output: list[str] = []
    cursor = 0
    for finding in sorted(findings, key=lambda item: item.start):
        if finding.start < cursor:
            continue
        output.append(text[cursor:finding.start])
        output.append(finding.replacement)
        cursor = finding.end
    output.append(text[cursor:])
    return ''.join(output)


def desensitize_value(entity_type: str, value: str) -> str:
    compact = re.sub(r'\s+', '', value)
    if entity_type == 'PHONE_NUMBER':
        digits = re.sub(r'\D', '', value)
        if digits.startswith('86') and len(digits) == 13:
            digits = digits[2:]
        if len(digits) >= 7:
            return f'{digits[:3]}****{digits[-4:]}'
        return mask_middle(compact, left=2, right=2)

    if entity_type == 'EMAIL_ADDRESS' and '@' in value:
        local, domain = value.split('@', 1)
        visible = local[:2] if len(local) > 2 else local[:1]
        return f'{visible}***@{domain}'

    if entity_type in {'ID_CARD', 'ID_NUMBER'}:
        return mask_middle(compact, left=3, right=4)

    if entity_type == 'BANK_CARD':
        digits = re.sub(r'\D', '', value)
        return mask_middle(digits, left=6, right=4)

    if entity_type == 'IP_ADDRESS':
        parts = value.split('.')
        if len(parts) == 4:
            return f'{parts[0]}.***.***.{parts[-1]}'
        return mask_middle(compact, left=2, right=2)

    if entity_type == 'ADDRESS':
        role_match = re.match(r'\s*(住所地|住址|居住地|联系地址|地址|住所|住)', value)
        role = role_match.group(1) if role_match else '地址'
        normalized_role = '住所地' if role in {'住所', '住所地', '住'} else role
        return f'{normalized_role}：某地址'

    if entity_type == 'BIRTH_DATE':
        return '****年**月**日出生' if value.strip().endswith('出生') else '****年**月**日'

    if entity_type == 'PERSON':
        return value[:1] + '*' * max(1, len(value) - 1)

    if entity_type in {'API_KEY', 'PRIVATE_KEY'}:
        return f'[{entity_type}]'

    return mask_middle(compact, left=2, right=2)


def mask_middle(value: str, *, left: int, right: int) -> str:
    if not value:
        return ''
    if len(value) <= left + right:
        if len(value) <= 2:
            return value[:1] + '*'
        return value[:1] + '*' * (len(value) - 2) + value[-1:]
    return value[:left] + '*' * (len(value) - left - right) + value[-right:]


def mask_preview(value: str) -> str:
    compact = re.sub(r'\s+', ' ', value).strip()
    if not compact:
        return ''
    if len(compact) <= 4:
        return '*' * len(compact)
    return f'{compact[:2]}***{compact[-2:]}'


def looks_like_id_card(value: str) -> bool:
    compact = re.sub(r'\s+', '', value)
    return bool(re.fullmatch(r'\d{6}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]', compact))


def read_text_file(path: Path) -> str:
    if path.suffix.lower() in {'.rtf', '.doc'} and shutil.which('textutil'):
        run = subprocess.run(
            ['textutil', '-convert', 'txt', '-stdout', str(path)],
            capture_output=True,
            text=True,
            check=False,
        )
        if run.returncode == 0 and run.stdout.strip():
            return run.stdout

    data = path.read_bytes()
    for encoding in ('utf-8', 'utf-8-sig', 'gb18030', 'latin-1'):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    return data.decode('utf-8', errors='replace')


def text_output_suffix(input_path: Path) -> str:
    suffix = input_path.suffix.lower()
    if suffix in {'.rtf', '.doc'}:
        return '.txt'
    return suffix or '.txt'


def build_report(
    *,
    task_id: str,
    document_name: str,
    input_name: str,
    input_type: str,
    output_file: Path | None,
    findings: list[Finding],
    subject_mappings: list[SubjectMapping],
    warnings: list[str],
    engine: Desensitizer,
) -> dict[str, Any]:
    counts = Counter(item.entity_type for item in findings)
    surfaces = defaultdict(int)
    for item in findings:
        surfaces[item.surface] += 1

    # Convert legal subject mappings into report findings so they show up in the UI.
    subject_findings: list[Finding] = []
    for mapping in subject_mappings:
        preview = mask_preview(mapping.original)
        subject_findings.append(
            Finding(
                entity_type=mapping.entity_type,
                start=0,
                end=len(preview),
                score=mapping.confidence,
                replacement=mapping.redacted,
                surface='subject',
                locator=mapping.location,
                preview=preview,
            )
        )
        counts[mapping.entity_type] += 1
        surfaces['subject'] += 1

    return {
        'task_id': task_id,
        'document_name': document_name,
        'input_name': input_name,
        'input_type': input_type,
        'status': 'completed',
        'strategy': 'standardized_legal_document',
        'engine': {
            'presidio_available': engine.presidio_available,
            'presidio_default_enabled': os.environ.get('COMPLIANCEAI_USE_PRESIDIO', '').lower() in {'1', 'true', 'yes'},
            'custom_chinese_rules_enabled': True,
            'legal_subject_detector_available': engine.subject_detector_available,
        },
        'summary': {
            'total_findings': len(findings) + len(subject_findings),
            'entity_counts': dict(sorted(counts.items())),
            'surface_counts': dict(sorted(surfaces.items())),
        },
        'output': {
            'file_name': output_file.name if output_file else '',
            'relative_name': output_file.name if output_file else '',
        },
        'findings': [item.to_dict() for item in (findings + subject_findings)[:500]],
        'warnings': warnings,
        'residual_risk': '系统已完成规则识别、全文一致性处理与残留敏感信息自动复检。',
    }


def render_report_markdown(report: dict[str, Any]) -> str:
    lines = [
        f'# {report.get("document_name", "数据脱敏处理")} 脱敏报告',
        '',
        f'- 输入文件：{report.get("input_name", "")}',
        f'- 输入类型：{report.get("input_type", "")}',
        '- 脱敏策略：全文一致替换并按法律文档样式重新排版',
        f'- 命中总数：{report.get("summary", {}).get("total_findings", 0)}',
        '',
        '## 命中类型统计',
    ]
    counts = report.get('summary', {}).get('entity_counts', {})
    if counts:
        for key, value in counts.items():
            lines.append(f'- {key}: {value}')
    else:
        lines.append('- 未命中敏感信息')
    lines.extend(['', '## 处理说明'])
    lines.append(report.get('residual_risk', ''))
    warnings = report.get('warnings') or []
    if warnings:
        lines.extend(['', '## 注意事项'])
        for warning in warnings:
            lines.append(f'- {warning}')
    return '\n'.join(lines).rstrip() + '\n'


def write_retention_note(path: Path) -> None:
    path.write_text(
        '\n'.join(
            [
                '原始文件仅保存在本地任务目录，用于完成本次数据脱敏处理。',
                '系统输出全文一致替换并按法律文档样式重新排版的脱敏文件和处理报告。',
                '输出前已执行残留敏感信息自动复检。',
                '',
            ]
        ),
        encoding='utf-8',
    )


def render_subject_mapping_markdown(
    task_id: str,
    document_name: str,
    mappings: list[SubjectMapping],
) -> str:
    """生成主体逆向映射 Markdown 文档。"""
    lines = [
        '# 主体逆向映射表',
        '',
        f'- 任务编号：{task_id}',
        f'- 材料名称：{document_name or "未命名材料"}',
        f'- 生成时间：{datetime.now().isoformat()}',
        f'- 主体数量：{len(mappings)}',
        '',
        '## 说明',
        '',
        '本文件记录材料脱敏中影响案件法律主要事实的主体（自然人、公司等）的原始值与脱敏值的对应关系。',
        '手机号、身份证号、银行卡号、地址、邮箱等个人隐私信息已完全脱敏，不在本表中。',
        '',
        '## 主体映射',
        '',
        '| 原始值 | 脱敏值 | 实体类型 | 位置 | 置信度 |',
        '|--------|--------|----------|------|--------|',
    ]
    for m in mappings:
        entity_type_label = {
            'person_name': '人名',
            'company_name': '公司名称',
            'law_firm': '律师事务所',
            'institution_name': '机关或公共机构',
        }.get(m.entity_type, m.entity_type)
        lines.append(
            f'| {m.original} | {m.redacted} | {entity_type_label} | {m.location} | {m.confidence} |'
        )
    lines.extend([
        '',
        '## 还原说明',
        '',
        '如需还原原始文本，请将上表中的「脱敏值」替换回「原始值」。同一主体在原文中可能出现多次，均已统一替换。',
        '',
    ])
    return '\n'.join(lines)


def build_subject_mapping_json(
    task_id: str,
    document_name: str,
    mappings: list[SubjectMapping],
) -> dict[str, Any]:
    """生成主体逆向映射 JSON 数据。"""
    return {
        'task_id': task_id,
        'document_name': document_name or '未命名材料',
        'generated_at': datetime.now().isoformat(),
        'subject_count': len(mappings),
        'legal_subjects': [m.to_dict() for m in mappings],
        'notes': (
            '本文件记录影响案件法律主要事实的主体（自然人、公司等）的原始值与脱敏值对应关系。'
            '手机号、身份证号、银行卡号、地址、邮箱等个人隐私信息已完全脱敏，不在本表中。'
        ),
    }


def copy_outputs_to_directory(
    output_dir: Path,
    output_file: Path,
    subject_mapping_md: Path,
    subject_mapping_json: Path,
    document_name: str,
) -> None:
    """将脱敏产物复制到用户指定的输出目录，仅保留最终 Markdown 和主体映射 Markdown。"""
    output_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(output_file, output_dir / output_file.name)
    shutil.copy2(subject_mapping_md, output_dir / subject_mapping_md.name)


def _extract_source_text(input_path: Path, *, is_text: bool) -> tuple[str, bool]:
    """Extract one canonical text stream. PDF/image inputs use OCR when needed."""
    if is_text:
        return normalize(read_text_file(input_path)), False

    used_ocr = input_path.suffix.lower() in IMAGE_EXTENSIONS
    if input_path.suffix.lower() == '.pdf':
        native_text = ''
        if fitz is not None:
            try:
                with fitz.open(str(input_path)) as document:
                    native_text = '\n'.join(page.get_text('text') or '' for page in document)
            except Exception:
                native_text = ''
        used_ocr = not has_meaningful_text(native_text)

    try:
        text = read_text(str(input_path), '')
    except SystemExit as exc:
        raise RuntimeError(str(exc)) from exc
    normalized = normalize(text)
    if not normalized:
        raise RuntimeError('未能从材料中提取到可脱敏文本。')
    return normalized, used_ocr


def _has_pdf_character_spacing(text: str) -> bool:
    """识别 PDF 文本层常见的“每个汉字之间一个空格”排版。"""
    chinese_count = len(re.findall(r'[\u4e00-\u9fff]', text))
    spaced_pairs = len(re.findall(r'(?<=[\u4e00-\u9fff])[ \t]+(?=[\u4e00-\u9fff])', text))
    return chinese_count >= 40 and spaced_pairs >= 20 and spaced_pairs / chinese_count >= 0.12


def _normalize_pdf_character_spacing(text: str) -> str:
    """消除 PDF 字形定位产生的字符间距，并保留重新排版所需的段落边界。"""
    if not _has_pdf_character_spacing(text):
        return text

    text = re.sub(r'-\s*\d+\s*[-一—](?=\s*(?:\n|[\u4e00-\u9fff]))', '', text)
    compact_lines: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            compact_lines.append('')
            continue
        # 反复处理，确保“杨 俊 生”中的两个间隔都被移除。
        previous = None
        while previous != line:
            previous = line
            line = re.sub(r'(?<=[\u4e00-\u9fff])[ \t]+(?=[\u4e00-\u9fff])', '', line)
        line = re.sub(r'[ \t]+(?=[，。；：！？、）】》])', '', line)
        line = re.sub(r'(?<=[（【《])[ \t]+', '', line)
        compact_lines.append(line)

    # PDF 的单行换行是视觉折行；复用法律文书结构规则恢复真实段落。
    return '\n'.join(_reflow_extracted_lines(compact_lines))


def _looks_like_document_title(value: str) -> bool:
    compact = value.strip().strip('#').strip()
    if not compact or len(compact) > 80:
        return False
    return bool(re.search(r'(判决书|裁定书|决定书|调解书|起诉状|答辩状|代理词|合同|协议|报告|意见书|函)$', compact))


def _is_structural_legal_line(value: str) -> bool:
    line = value.strip()
    if not line:
        return False
    if _looks_like_document_title(line):
        return True
    return bool(re.match(
        r'^(?:原告|被告|第三人|上诉人|被上诉人|申请人|被申请人|'
        r'法定代表人|委托诉讼代理人|审判长|审判员|人民陪审员|书记员|'
        r'[一二三四五六七八九十百]+、|（[一二三四五六七八九十百]+）|'
        r'\d+[．.、]|（\d+）|\(\d+\)|'
        r'（?\d{4}）?[\u4e00-\u9fa5A-Za-z0-9]+号$)',
        line,
    ))


def _reflow_extracted_lines(lines: list[str]) -> list[str]:
    """Join visual line wraps while retaining legal-document paragraph boundaries."""
    result: list[str] = []
    buffer = ''

    def flush() -> None:
        nonlocal buffer
        if buffer.strip():
            result.append(buffer.strip())
        buffer = ''

    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            if buffer and re.search(r'[。！？!?；;：:]$', buffer):
                flush()
            continue
        if line.startswith('|') and line.endswith('|'):
            flush()
            result.append(line)
            continue
        if _is_structural_legal_line(line):
            flush()
            buffer = line
        elif not buffer:
            buffer = line
        else:
            separator = ' ' if re.search(r'[A-Za-z0-9]$', buffer) and re.match(r'^[A-Za-z0-9]', line) else ''
            buffer += separator + line
        if _looks_like_document_title(buffer) or re.search(r'[。！？!?；;]$', buffer):
            flush()
    flush()
    return result


def _canonicalize_markdown(text: str, document_name: str) -> str:
    """Normalize extracted/OCR text into a stable, layout-independent Markdown source."""
    cleaned = normalize(text)
    cleaned = re.sub(r'(?m)^\s*---\s*(?:OCR\s*)?第\s*\d+\s*页\s*---\s*$', '', cleaned)
    cleaned = re.sub(r'(?m)^\s*第\s*\d+\s*页\s*/\s*共\s*\d+\s*页\s*$', '', cleaned)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned).strip()
    source_lines = cleaned.splitlines()
    title_index = next(
        (index for index, line in enumerate(source_lines[:40]) if _looks_like_document_title(line)),
        None,
    )
    if title_index is not None and title_index > 0:
        source_lines = source_lines[title_index:]
    source_lines = _reflow_extracted_lines(source_lines)
    output: list[str] = []
    first_content_seen = False
    for raw_line in source_lines:
        line = raw_line.strip()
        if not line:
            if output and output[-1] != '':
                output.append('')
            continue
        if re.fullmatch(r'\|?[\s:|-]+\|?', line):
            output.append(line)
            continue
        if not first_content_seen:
            first_content_seen = True
            if _looks_like_document_title(line):
                preferred_title = document_name.strip() if document_name and len(document_name.strip()) <= 80 else line
                output.extend([f'# {preferred_title.strip("# ").strip()}', ''])
                continue
        if re.match(r'^[一二三四五六七八九十百]+、', line):
            output.append(f'## {line}')
        elif re.match(r'^（[一二三四五六七八九十百]+）', line):
            output.append(f'### {line}')
        else:
            output.append(line)

    if not output:
        output = [f'# {document_name or "脱敏材料"}']
    elif not any(line.startswith('# ') for line in output[:3]):
        output = [f'# {document_name or "脱敏材料"}', '', *output]
    return '\n'.join(output).strip() + '\n'


def _markdown_to_plain_text(markdown: str) -> str:
    lines: list[str] = []
    for raw_line in markdown.splitlines():
        line = re.sub(r'^#{1,6}\s+', '', raw_line).strip()
        if re.fullmatch(r'\|?[\s:|-]+\|?', line):
            continue
        if line.startswith('|') and line.endswith('|'):
            cells = [cell.strip().replace(r'\|', '|') for cell in line.strip('|').split('|')]
            line = '\t'.join(cells)
        lines.append(line)
    return re.sub(r'\n{3,}', '\n\n', '\n'.join(lines)).strip() + '\n'


def _set_run_font(run: Any, *, size: float, bold: bool = False) -> None:
    run.font.name = LEGAL_DOCUMENT_FONT
    run.font.size = Pt(size)
    run.font.bold = bold
    run._element.rPr.rFonts.set(qn('w:eastAsia'), LEGAL_DOCUMENT_FONT)
    run._element.rPr.rFonts.set(qn('w:ascii'), LEGAL_DOCUMENT_FONT)
    run._element.rPr.rFonts.set(qn('w:hAnsi'), LEGAL_DOCUMENT_FONT)


def _set_cell_borders(cell: Any) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = tc_pr.first_child_found_in('w:tcBorders')
    if borders is None:
        borders = OxmlElement('w:tcBorders')
        tc_pr.append(borders)
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        tag = f'w:{edge}'
        element = borders.find(qn(tag))
        if element is None:
            element = OxmlElement(tag)
            borders.append(element)
        element.set(qn('w:val'), 'single')
        element.set(qn('w:sz'), '4')
        element.set(qn('w:color'), '000000')


def _add_standard_paragraph(document: Document, text: str, *, kind: str = 'body') -> None:
    paragraph = document.add_paragraph()
    fmt = paragraph.paragraph_format
    if kind == 'title':
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        fmt.space_after = Pt(12)
        fmt.line_spacing = 1.5
        _set_run_font(paragraph.add_run(text), size=18, bold=True)
        return
    if kind in {'heading2', 'heading3'}:
        paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
        fmt.space_before = Pt(6)
        fmt.space_after = Pt(6)
        fmt.line_spacing = 1.5
        _set_run_font(paragraph.add_run(text), size=12, bold=kind == 'heading2')
        return
    paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    fmt.first_line_indent = Cm(0.85)
    fmt.space_after = Pt(6)
    fmt.line_spacing = 1.5
    _set_run_font(paragraph.add_run(text), size=12)
    if re.match(r'^(审判长|审判员|人民陪审员|书记员|法定代表人|委托诉讼代理人)', text.strip()):
        paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        fmt.first_line_indent = None


def _parse_markdown_table(lines: list[str], start: int) -> tuple[list[list[str]], int] | None:
    if start + 1 >= len(lines):
        return None
    first = lines[start].strip()
    separator = lines[start + 1].strip()
    if not (first.startswith('|') and first.endswith('|') and re.fullmatch(r'\|?[\s:|-]+\|?', separator)):
        return None
    rows: list[list[str]] = []
    index = start
    while index < len(lines):
        line = lines[index].strip()
        if not (line.startswith('|') and line.endswith('|')):
            break
        if index != start + 1:
            rows.append([cell.strip().replace(r'\|', '|') for cell in line.strip('|').split('|')])
        index += 1
    return rows, index


def _write_legal_docx(markdown: str, output_path: Path) -> None:
    document = Document()
    section = document.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(3.175)
    section.right_margin = Cm(3.175)
    section.header_distance = Cm(1.5)
    section.footer_distance = Cm(1.75)
    normal = document.styles['Normal']
    normal.font.name = LEGAL_DOCUMENT_FONT
    normal.font.size = Pt(12)
    normal._element.rPr.rFonts.set(qn('w:eastAsia'), LEGAL_DOCUMENT_FONT)

    lines = markdown.splitlines()
    index = 0
    while index < len(lines):
        table_result = _parse_markdown_table(lines, index)
        if table_result is not None:
            rows, next_index = table_result
            if rows:
                width = max(len(row) for row in rows)
                table = document.add_table(rows=len(rows), cols=width)
                table.alignment = WD_TABLE_ALIGNMENT.CENTER
                table.autofit = True
                for row_index, row in enumerate(rows):
                    for col_index in range(width):
                        cell = table.cell(row_index, col_index)
                        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
                        cell.text = row[col_index] if col_index < len(row) else ''
                        _set_cell_borders(cell)
                        for paragraph in cell.paragraphs:
                            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER if row_index == 0 else WD_ALIGN_PARAGRAPH.LEFT
                            paragraph.paragraph_format.space_after = Pt(0)
                            for run in paragraph.runs:
                                _set_run_font(run, size=10.5, bold=row_index == 0)
                document.add_paragraph()
            index = next_index
            continue
        line = lines[index].strip()
        index += 1
        if not line:
            continue
        if line.startswith('# '):
            _add_standard_paragraph(document, line[2:].strip(), kind='title')
        elif line.startswith('## '):
            _add_standard_paragraph(document, line[3:].strip(), kind='heading2')
        elif line.startswith('### '):
            _add_standard_paragraph(document, line[4:].strip(), kind='heading3')
        else:
            _add_standard_paragraph(document, line, kind='body')
    document.save(str(output_path))


def _find_soffice() -> str | None:
    candidates = [
        shutil.which('soffice'),
        shutil.which('libreoffice'),
        '/Applications/LibreOffice.app/Contents/MacOS/soffice',
        '/usr/bin/libreoffice',
        r'C:\Program Files\LibreOffice\program\soffice.exe',
    ]
    return next((str(candidate) for candidate in candidates if candidate and Path(candidate).exists()), None)


def _write_pdf_fallback(markdown: str, output_path: Path) -> None:
    if fitz is None:
        raise RuntimeError('生成 PDF 需要 LibreOffice 或 PyMuPDF。')
    document = fitz.open()
    page = document.new_page(width=595, height=842)
    y = 72.0
    left = 90.0
    page_bottom = 770.0
    for raw_line in _markdown_to_plain_text(markdown).splitlines():
        text = raw_line.strip()
        if not text:
            y += 10
            continue
        font_size = 12
        line_height = font_size * 1.8
        estimated_chars = 32
        chunks = [text[i:i + estimated_chars] for i in range(0, len(text), estimated_chars)] or ['']
        for chunk in chunks:
            if y + line_height > page_bottom:
                page = document.new_page(width=595, height=842)
                y = 72.0
            page.insert_text((left, y), chunk, fontname='china-s', fontsize=font_size, color=(0, 0, 0))
            y += line_height
        y += 3
    document.save(str(output_path))
    document.close()


def _write_legal_pdf(markdown: str, output_path: Path) -> None:
    soffice = _find_soffice()
    if soffice is None:
        _write_pdf_fallback(markdown, output_path)
        return
    with tempfile.TemporaryDirectory(prefix='legalwork-redaction-pdf-') as temp_name:
        temp_dir = Path(temp_name)
        source_docx = temp_dir / 'desensitized_output.docx'
        profile_dir = temp_dir / 'lo-profile'
        _write_legal_docx(markdown, source_docx)
        run = subprocess.run(
            [
                soffice,
                '--headless',
                f'-env:UserInstallation={profile_dir.as_uri()}',
                '--convert-to',
                'pdf',
                '--outdir',
                str(temp_dir),
                str(source_docx),
            ],
            capture_output=True,
            text=True,
            check=False,
            timeout=120,
        )
        converted = temp_dir / 'desensitized_output.pdf'
        if run.returncode != 0 or not converted.exists():
            _write_pdf_fallback(markdown, output_path)
            return
        shutil.copy2(converted, output_path)


def _chunk_for_model(text: str, max_chars: int = 45_000) -> list[str]:
    paragraphs = text.split('\n\n')
    chunks: list[str] = []
    current = ''
    for paragraph in paragraphs:
        if len(paragraph) > max_chars:
            if current:
                chunks.append(current)
                current = ''
            chunks.extend(paragraph[i:i + max_chars] for i in range(0, len(paragraph), max_chars))
        elif not current:
            current = paragraph
        elif len(current) + len(paragraph) + 2 <= max_chars:
            current += '\n\n' + paragraph
        else:
            chunks.append(current)
            current = paragraph
    if current:
        chunks.append(current)
    return chunks or ['']


def _parse_agent_json(content: str) -> dict[str, Any]:
    stripped = content.strip()
    fence = chr(96) * 3
    if stripped.startswith(fence):
        stripped = stripped[len(fence):].lstrip()
        if stripped.lower().startswith('json'):
            stripped = stripped[4:].lstrip()
        if stripped.endswith(fence):
            stripped = stripped[:-len(fence)].rstrip()
    try:
        payload = json.loads(stripped)
    except json.JSONDecodeError:
        match = re.search(r'\{[\s\S]*\}', stripped)
        if not match:
            raise RuntimeError('增强识别返回了无法解析的结果。')
        payload = json.loads(match.group(0))
    if not isinstance(payload, dict):
        raise RuntimeError('增强识别返回格式不正确。')
    return payload


def _agent_json_request(system_prompt: str, user_prompt: str) -> dict[str, Any]:
    try:
        from scripts.legalwork_agent_client import generate_model_text, runtime_model_available
        if runtime_model_available():
            model = os.environ.get('LEGALWORK_MODEL', '').strip() or 'deepseek-flash'
            return _parse_agent_json(generate_model_text(
                system_prompt,
                user_prompt,
                model=model,
                max_tokens=4096,
            ))
    except ImportError:
        pass
    api_key = os.environ.get('LEGALWORK_API_KEY', '').strip() or os.environ.get('DEEPSEEK_API_KEY', '').strip()
    if not api_key:
        raise RuntimeError('增强脱敏模式需要先在设置中配置可用的模型 API Key。')
    if OpenAI is None:
        raise RuntimeError('增强脱敏模式缺少智能模型运行依赖。')
    base_url = os.environ.get('LEGALWORK_BASE_URL', '').strip() or 'https://api.deepseek.com'
    model = os.environ.get('LEGALWORK_MODEL', '').strip() or 'deepseek-flash'
    client = OpenAI(api_key=api_key, base_url=base_url)
    response = client.chat.completions.create(
        model=model,
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt},
        ],
        temperature=0,
    )
    return _parse_agent_json(response.choices[0].message.content or '')


def _valid_agent_replacements(payload: dict[str, Any], source: str) -> list[dict[str, str]]:
    raw_items = payload.get('replacements')
    if not isinstance(raw_items, list):
        return []
    allowed_types = {
        'PERSON', 'ORGANIZATION', 'ADDRESS', 'PHONE_NUMBER', 'ID_CARD',
        'BANK_CARD', 'EMAIL_ADDRESS', 'ACCOUNT', 'OTHER_IDENTIFIER',
    }
    replacements: list[dict[str, str]] = []
    for item in raw_items:
        if not isinstance(item, dict):
            continue
        original = str(item.get('original') or '').strip()
        replacement = str(item.get('replacement') or '').strip()
        entity_type = str(item.get('entity_type') or 'OTHER_IDENTIFIER').upper().strip()
        type_aliases = {
            'PERSON_NAME': 'PERSON', 'NAME': 'PERSON', 'NATURAL_PERSON': 'PERSON', '姓名': 'PERSON', '人名': 'PERSON',
            'ORG': 'ORGANIZATION', 'COMPANY': 'ORGANIZATION', 'COMPANY_NAME': 'ORGANIZATION',
            'LAW_FIRM': 'ORGANIZATION', 'INSTITUTION': 'ORGANIZATION', '企业': 'ORGANIZATION',
            '公司': 'ORGANIZATION', '律所': 'ORGANIZATION', '机构': 'ORGANIZATION',
            'PHONE': 'PHONE_NUMBER', 'MOBILE': 'PHONE_NUMBER', '手机号': 'PHONE_NUMBER', '电话号码': 'PHONE_NUMBER',
            'ID_NUMBER': 'ID_CARD', '身份证号': 'ID_CARD', 'BANK_ACCOUNT': 'BANK_CARD', '银行卡号': 'BANK_CARD',
            'EMAIL': 'EMAIL_ADDRESS', '邮箱': 'EMAIL_ADDRESS', '住址': 'ADDRESS', '地址': 'ADDRESS',
        }
        entity_type = type_aliases.get(entity_type, entity_type)
        compact_original = re.sub(r'\s+', '', original)
        if entity_type not in allowed_types:
            if compact_original.endswith(('公司', '集团', '企业', '律师事务所', '律师所')):
                entity_type = 'ORGANIZATION'
            elif _looks_like_person_name(compact_original, require_known_surname=True):
                entity_type = 'PERSON'
        if entity_type not in allowed_types:
            entity_type = 'OTHER_IDENTIFIER'
        if entity_type == 'OTHER_IDENTIFIER' and not re.search(r'[A-Za-z0-9]', compact_original):
            continue
        if not original or original not in source or len(original) > 200:
            continue
        if not replacement or replacement == original or original in replacement:
            continue
        if '某' in compact_original or '*' in compact_original:
            continue
        # 模型只负责补充识别，最终替换格式仍由程序统一，避免同一类实体出现 XXX、星号等多种样式。
        if entity_type == 'PERSON':
            if not _looks_like_person_name(compact_original, require_known_surname=False):
                continue
            replacement = _generate_subject_token('person_name', original)
        elif entity_type == 'ORGANIZATION':
            trimmed, _, _ = _trim_org_surface(original, 0)
            if re.sub(r'\s+', '', trimmed) != compact_original:
                continue
            mapping_type = _agent_subject_mapping_type(original, entity_type)
            if not _valid_org_surface(original, allow_public=mapping_type == 'institution_name', short=True):
                continue
            replacement = _generate_subject_token(mapping_type, original)
        elif entity_type == 'ADDRESS':
            replacement = desensitize_value('ADDRESS', original)
        replacements.append({
            'original': original,
            'replacement': replacement,
            'entity_type': entity_type,
        })
    return replacements


def _agent_subject_mapping_type(original: str, entity_type: str) -> str:
    if entity_type == 'PERSON':
        return 'person_name'
    compact = re.sub(r'\s+', '', original)
    if compact.endswith(('律师事务所', '律师所')):
        return 'law_firm'
    if compact.endswith(PUBLIC_INSTITUTION_SUFFIXES):
        return 'institution_name'
    return 'company_name'


def _agent_subject_replacement_plan(
    items: list[dict[str, str]],
    current_text: str,
    existing_mappings: list[SubjectMapping] | None = None,
) -> dict[str, str]:
    """为模型补识别主体分配不冲突的代称，并合并同一机构的全称与简称。"""
    identities: dict[str, dict[str, Any]] = {}
    original_identity: dict[str, str] = {}
    organization_primary_names = [
        re.sub(r'\s+', '', item['original'])
        for item in items
        if item['entity_type'] == 'ORGANIZATION'
        and re.sub(r'\s+', '', item['original']).endswith((
            '有限责任公司', '股份有限公司', '集团有限公司', '有限公司', '律师事务所',
        ))
    ]
    for order, item in enumerate(items):
        entity_type = item['entity_type']
        original = item['original']
        if entity_type not in {'PERSON', 'ORGANIZATION'} or original not in current_text:
            continue
        mapping_type = _agent_subject_mapping_type(original, entity_type)
        if mapping_type in {'company_name', 'law_firm', 'institution_name'}:
            compact_original = re.sub(r'\s+', '', original)
            canonical = _infer_org_alias(compact_original, organization_primary_names) or compact_original
            identity_key = f'{mapping_type}:{canonical}'
        else:
            compact_original = re.sub(r'\s+', '', original)
            identity_key = f'{mapping_type}:{compact_original}'
        original_identity[original] = identity_key
        identities.setdefault(identity_key, {
            'mapping_type': mapping_type,
            'base_token': _generate_subject_token(mapping_type, original),
            'order': order,
        })

    token_groups: dict[str, list[tuple[str, dict[str, Any]]]] = defaultdict(list)
    for identity_key, identity in identities.items():
        token_groups[str(identity['base_token'])].append((identity_key, identity))

    identity_tokens: dict[str, str] = {}
    for base_token, group in token_groups.items():
        ordered = sorted(group, key=lambda entry: int(entry[1]['order']))
        token_is_taken = base_token in current_text
        for index, (identity_key, identity) in enumerate(ordered):
            if not token_is_taken and len(ordered) == 1:
                token = base_token
            else:
                marker_index = index if not token_is_taken else index
                token = _with_subject_discriminator(
                    base_token,
                    str(identity['mapping_type']),
                    marker_index,
                )
                while token in current_text or token in identity_tokens.values():
                    marker_index += 1
                    token = _with_subject_discriminator(
                        base_token,
                        str(identity['mapping_type']),
                        marker_index,
                    )
            identity_tokens[identity_key] = token

    plan = {
        original: identity_tokens[identity_key]
        for original, identity_key in original_identity.items()
    }
    if existing_mappings:
        existing_orgs = [
            mapping for mapping in existing_mappings
            if mapping.entity_type in {'company_name', 'law_firm', 'institution_name'}
        ]
        existing_names = [re.sub(r'\s+', '', mapping.original) for mapping in existing_orgs]
        existing_by_name = {
            re.sub(r'\s+', '', mapping.original): mapping.redacted
            for mapping in existing_orgs
        }
        for item in items:
            if item['entity_type'] != 'ORGANIZATION':
                continue
            original = item['original']
            compact = re.sub(r'\s+', '', original)
            canonical = _infer_org_alias(compact, existing_names)
            if canonical:
                plan[original] = existing_by_name[canonical]
                continue
            mapping_type = _agent_subject_mapping_type(original, item['entity_type'])
            if mapping_type == 'institution_name':
                suffix = next((value for value in PUBLIC_INSTITUTION_SUFFIXES if compact.endswith(value)), None)
                same_kind = [
                    mapping.redacted for mapping in existing_orgs
                    if mapping.entity_type == 'institution_name'
                    and suffix
                    and re.sub(r'\s+', '', mapping.original).endswith(suffix)
                ]
                if len(set(same_kind)) == 1:
                    plan[original] = same_kind[0]
    return plan


def _agent_is_configured() -> bool:
    try:
        from scripts.legalwork_agent_client import runtime_model_available
        if runtime_model_available():
            return True
    except ImportError:
        pass
    api_key = os.environ.get('LEGALWORK_API_KEY', '').strip() or os.environ.get('DEEPSEEK_API_KEY', '').strip()
    return bool(api_key and OpenAI is not None)


def _standard_limited_enhancement(
    rule_redacted_text: str,
    existing_mappings: list[SubjectMapping] | None = None,
) -> tuple[str, list[Finding], list[SubjectMapping]]:
    """Use only small, pre-redacted legal-role snippets; never send the complete source."""
    if not _agent_is_configured():
        return rule_redacted_text, [], []
    candidate_pattern = re.compile(
        r'(?:原告|被告|第三人|上诉人|被上诉人|申请人|被申请人|法定代表人|'
        r'委托诉讼代理人|联系人|以下简称|住所地|住址|联系地址|账号)'
    )
    snippets: list[str] = []
    total_chars = 0
    for paragraph in re.split(r'\n{2,}', rule_redacted_text):
        compact = paragraph.strip()
        if not compact or not candidate_pattern.search(compact):
            continue
        snippet = compact[:800]
        if total_chars + len(snippet) > 8_000:
            break
        snippets.append(snippet)
        total_chars += len(snippet)
        if len(snippets) >= 12:
            break
    if not snippets:
        return rule_redacted_text, [], []

    joined = '\n\n--- 片段分隔 ---\n\n'.join(snippets)
    prompt = (
        '你是法律材料的受限脱敏校验器。以下仅为程序预脱敏后裁剪出的少量局部片段，不是完整材料。'
        '识别其中仍残留的自然人姓名、私人企业或机构名称、具体住址、账号或联系方式。'
        '人民法院、检察院、人民政府、法律法规、案号等公共司法信息保留。'
        '只返回 JSON，根字段为 replacements，每项包含 original、replacement、entity_type；不得补充或改写其他文字。'
    )
    try:
        payload = _agent_json_request(prompt, joined)
    except Exception:
        return rule_redacted_text, [], []

    redacted = rule_redacted_text
    findings: list[Finding] = []
    subjects: list[SubjectMapping] = []
    items = _valid_agent_replacements(payload, joined)
    subject_plan = _agent_subject_replacement_plan(items, redacted, existing_mappings)
    for item in sorted(items, key=lambda value: len(value['original']), reverse=True):
        original = item['original']
        if original not in redacted:
            continue
        replacement = subject_plan.get(original, item['replacement'])
        start = redacted.find(original)
        redacted = redacted.replace(original, replacement)
        if item['entity_type'] in {'PERSON', 'ORGANIZATION'}:
            subjects.append(SubjectMapping(
                entity_type=_agent_subject_mapping_type(original, item['entity_type']),
                original=original,
                redacted=replacement,
                location='局部语义校验',
                confidence=0.95,
            ))
        else:
            findings.append(Finding(
                entity_type=item['entity_type'],
                start=start,
                end=start + len(original),
                score=0.95,
                replacement=item['replacement'],
                surface='limited_semantic_check',
                locator='局部片段',
                preview=mask_preview(original),
            ))
    return redacted, findings, subjects


def _agent_enhance_redaction(
    original_text: str,
    rule_redacted_text: str,
    existing_mappings: list[SubjectMapping] | None = None,
) -> tuple[str, list[Finding], list[SubjectMapping]]:
    system_prompt = (
        '你是法律材料脱敏引擎。逐字阅读材料，识别规则容易漏掉但外发时应脱敏的信息。'
        '重点包括自然人姓名及别名、非公开企业或机构全称及简称、具体住址、账号、证件号、联系方式和其他可定位个人的标识。'
        '人民法院、检察院、行政机关、公开法律法规名称、案号等公共司法信息通常保留。'
        '同一主体必须使用完全相同的替换值；人物保留姓、其余字替换为“某”，企业和律所保留品牌指向并隐藏完整登记名称。'
        '只返回 JSON，根字段为 replacements，每项包含 original、replacement、entity_type。'
        '不得改写事实、金额、日期、法律条文或非敏感内容。'
    )
    consolidated: dict[str, dict[str, str]] = {}
    for index, chunk in enumerate(_chunk_for_model(original_text), start=1):
        payload = _agent_json_request(
            system_prompt,
            f'这是材料第 {index} 个连续片段。请识别所有需要脱敏的精确原文：\n\n{chunk}',
        )
        for item in _valid_agent_replacements(payload, chunk):
            consolidated.setdefault(item['original'], item)

    redacted = rule_redacted_text
    findings: list[Finding] = []
    subject_mappings: list[SubjectMapping] = []
    consolidated_items = list(consolidated.values())
    subject_plan = _agent_subject_replacement_plan(consolidated_items, redacted, existing_mappings)
    for item in sorted(consolidated_items, key=lambda value: len(value['original']), reverse=True):
        original = item['original']
        if original not in redacted:
            continue
        replacement = subject_plan.get(original, item['replacement'])
        start = redacted.find(original)
        redacted = redacted.replace(original, replacement)
        entity_type = item['entity_type']
        if entity_type in {'PERSON', 'ORGANIZATION'}:
            subject_mappings.append(SubjectMapping(
                entity_type=_agent_subject_mapping_type(original, entity_type),
                original=original,
                redacted=replacement,
                location='全文',
                confidence=0.98,
            ))
        else:
            findings.append(Finding(
                entity_type=entity_type,
                start=start,
                end=start + len(original),
                score=0.98,
                replacement=item['replacement'],
                surface='enhanced',
                locator='全文',
                preview=mask_preview(original),
            ))

    verification_prompt = (
        '你是脱敏结果安全复检器。阅读脱敏后文本，只找仍然残留的自然人姓名、私人机构名称、'
        '精确地址、联系方式、证件号、银行账号或可识别个人的标识。公共法院、行政机关、法律名称、案号无需处理。'
        '只返回 JSON，根字段为 replacements，每项包含 original、replacement、entity_type。不得改写其他内容。'
    )
    verification_items_by_original: dict[str, dict[str, str]] = {}
    for index, chunk in enumerate(_chunk_for_model(redacted), start=1):
        payload = _agent_json_request(
            verification_prompt,
            f'这是待复检文本第 {index} 个连续片段：\n\n{chunk}',
        )
        for item in _valid_agent_replacements(payload, chunk):
            verification_items_by_original.setdefault(item['original'], item)

    verification_items = list(verification_items_by_original.values())
    verification_plan = _agent_subject_replacement_plan(
        verification_items,
        redacted,
        [*(existing_mappings or []), *subject_mappings],
    )
    for item in sorted(verification_items, key=lambda value: len(value['original']), reverse=True):
        original = item['original']
        if original not in redacted:
            continue
        replacement = verification_plan.get(original, item['replacement'])
        start = redacted.find(original)
        redacted = redacted.replace(original, replacement)
        entity_type = item['entity_type']
        if entity_type in {'PERSON', 'ORGANIZATION'}:
            subject_mappings.append(SubjectMapping(
                entity_type=_agent_subject_mapping_type(original, entity_type),
                original=original,
                redacted=replacement,
                location='自动复检',
                confidence=0.99,
            ))
        else:
            findings.append(Finding(
                entity_type=entity_type,
                start=start,
                end=start + len(original),
                score=0.99,
                replacement=replacement,
                surface='verification',
                locator='全文',
                preview=mask_preview(original),
            ))
    return redacted, findings, subject_mappings


def _dedupe_subject_mappings(mappings: list[SubjectMapping]) -> list[SubjectMapping]:
    best: dict[tuple[str, str], SubjectMapping] = {}
    for mapping in mappings:
        original_compact = re.sub(r'\s+', '', mapping.original)
        redacted_compact = re.sub(r'\s+', '', mapping.redacted)
        if not original_compact or original_compact == redacted_compact or '某' in original_compact or '*' in original_compact:
            continue
        key = (mapping.entity_type, original_compact)
        current = best.get(key)
        normalized_mapping = SubjectMapping(
            entity_type=mapping.entity_type,
            original=original_compact,
            redacted=redacted_compact,
            location=mapping.location,
            confidence=mapping.confidence,
        )
        if current is None or normalized_mapping.confidence > current.confidence:
            best[key] = normalized_mapping
    return list(best.values())


def _render_standard_output(markdown: str, output_file: Path, output_format: str) -> None:
    if output_format == 'md':
        output_file.write_text(markdown, encoding='utf-8')
    elif output_format == 'txt':
        output_file.write_text(_markdown_to_plain_text(markdown), encoding='utf-8')
    elif output_format == 'pdf':
        _write_legal_pdf(markdown, output_file)
    else:
        _write_legal_docx(markdown, output_file)


def process_desensitization(
    *,
    task_id: str,
    input_path: Path,
    document_name: str,
    work_dir: Path,
    is_text: bool = False,
    output_dir: Path | None = None,
    output_format: str | None = None,
    redaction_mode: str = 'standard',
) -> dict[str, Path | dict[str, Any]]:
    work_dir.mkdir(parents=True, exist_ok=True)
    engine = Desensitizer()
    findings: list[Finding] = []
    subject_mappings: list[SubjectMapping] = []
    warnings: list[str] = []
    suffix = '.txt' if is_text else input_path.suffix.lower()
    input_name = input_path.name
    supported_extensions = (
        TEXT_EXTENSIONS | DOC_EXTENSIONS | PDF_EXTENSIONS | TABLE_EXTENSIONS
        | JSON_EXTENSIONS | PRESENTATION_EXTENSIONS | IMAGE_EXTENSIONS
    )
    if not is_text and suffix not in supported_extensions:
        raise ValueError(f'暂不支持该文件类型：{suffix or "无扩展名"}')

    effective_format = output_format if output_format in {'md', 'docx', 'pdf', 'txt'} else 'docx'
    base_name = (document_name or Path(input_name).stem or '脱敏材料').rstrip('_').strip()

    if suffix in DOC_EXTENSIONS and effective_format == 'docx':
        # A 方案：docx 输入 + Word 输出 → 保格式原位替换。
        # 不再走“统一提取文字/OCR → markdown → 重建 docx”的压平流程，
        # 避免丢失原文档结构、页脚脚注、文本框、表格与段落格式。
        # 仅对扫描型 PDF / 图片等无文本层的材料才需要 OCR 与重排版。
        used_ocr = False
        output_file, doc_findings, doc_subjects = process_docx(
            input_path, work_dir, engine, warnings, output_format=output_format,
        )
        findings.extend(doc_findings)
        subject_mappings.extend(doc_subjects)
        subject_mappings = _dedupe_subject_mappings(subject_mappings)

        # 输出文件名对齐 {base_name}_脱敏.docx（process_docx 默认 desensitized_output.docx）
        marker = '_脱敏'
        output_stem = _safe_output_stem(f'{base_name}{marker}')
        named_output = work_dir / f'{output_stem}.docx'
        if named_output != output_file:
            os.replace(str(output_file), str(named_output))
            output_file = named_output
    else:
        raw_text, used_ocr = _extract_source_text(input_path, is_text=is_text)
        raw_text = _normalize_pdf_character_spacing(raw_text)
        redacted, text_findings, text_subjects = sanitize_text_and_subjects(
            raw_text,
            engine,
            surface='ocr_text' if used_ocr else 'document_text',
            locator='全文',
        )
        findings.extend(text_findings)
        subject_mappings.extend(text_subjects)

        if redaction_mode == 'agent_enhanced':
            redacted, enhanced_findings, enhanced_subjects = _agent_enhance_redaction(
                raw_text,
                redacted,
                subject_mappings,
            )
            findings.extend(enhanced_findings)
            subject_mappings.extend(enhanced_subjects)
        else:
            redacted, limited_findings, limited_subjects = _standard_limited_enhancement(
                redacted,
                subject_mappings,
            )
            findings.extend(limited_findings)
            subject_mappings.extend(limited_subjects)

        # A second deterministic pass catches values exposed by OCR whitespace normalization
        # and guarantees that one global subject map is applied across the complete document.
        redacted, residual_findings, residual_subjects = sanitize_text_and_subjects(
            redacted,
            engine,
            surface='verification',
            locator='全文',
        )
        findings.extend(residual_findings)
        subject_mappings.extend(residual_subjects)
        subject_mappings = _dedupe_subject_mappings(subject_mappings)

        canonical_markdown = _canonicalize_markdown(redacted, document_name)
        canonical_source = work_dir / 'canonical_redacted.md'
        canonical_source.write_text(canonical_markdown, encoding='utf-8')

        marker = '_OCR脱敏' if used_ocr else '_脱敏'
        output_stem = _safe_output_stem(f'{base_name}{marker}')
        output_file = work_dir / f'{output_stem}.{effective_format}'
        _render_standard_output(canonical_markdown, output_file, effective_format)

    if used_ocr:
        warnings.append('材料通过 OCR 提取文字后重新排版输出；系统已对识别结果执行全文脱敏和自动复检。')

    if is_text or suffix in TEXT_EXTENSIONS:
        input_type = 'text'
    elif suffix in DOC_EXTENSIONS:
        input_type = 'document'
    elif suffix in PDF_EXTENSIONS:
        input_type = 'pdf'
    elif suffix in TABLE_EXTENSIONS:
        input_type = 'table'
    elif suffix in JSON_EXTENSIONS:
        input_type = 'json'
    elif suffix in PRESENTATION_EXTENSIONS:
        input_type = 'presentation'
    else:
        input_type = 'image'

    report = build_report(
        task_id=task_id,
        document_name=document_name,
        input_name=input_name,
        input_type=input_type,
        output_file=output_file,
        findings=findings,
        subject_mappings=subject_mappings,
        warnings=warnings,
        engine=engine,
    )
    report_json = work_dir / 'desensitization_report.json'
    report_md = work_dir / 'desensitization_report.md'
    note = work_dir / 'original_retention_note.txt'
    subject_mapping_md = work_dir / 'subject_mapping.md'
    subject_mapping_json = work_dir / 'subject_mapping.json'
    report_json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    report_md.write_text(render_report_markdown(report), encoding='utf-8')
    write_retention_note(note)
    subject_mapping_md.write_text(
        render_subject_mapping_markdown(task_id, document_name, subject_mappings),
        encoding='utf-8',
    )
    subject_mapping_json.write_text(
        json.dumps(build_subject_mapping_json(task_id, document_name, subject_mappings), ensure_ascii=False, indent=2),
        encoding='utf-8',
    )

    if output_dir is not None:
        copy_outputs_to_directory(
            output_dir,
            output_file,
            subject_mapping_md,
            subject_mapping_json,
            document_name,
        )

    return {
        'output_file': output_file,
        'report_json': report_json,
        'report_md': report_md,
        'retention_note': note,
        'subject_mapping_md': subject_mapping_md,
        'subject_mapping_json': subject_mapping_json,
        'report': report,
    }


def process_docx(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
    output_format: str | None = None,
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []

    if input_path.suffix.lower() == '.doc':
        text = read_text_file(input_path)
        redacted, findings, subjects = sanitize_text_and_subjects(
            text, engine, surface='doc', locator='全文'
        )
        all_findings.extend(findings)
        all_subjects.extend(subjects)
        suffix = '.md' if output_format == 'md' else '.txt'
        output_file = work_dir / f'desensitized_output{suffix}'
        output_file.write_text(redacted, encoding='utf-8')
        warnings.append('.doc 文件按纯文本兜底解析，复杂格式可能无法保留。')
        return output_file, all_findings, all_subjects

    document = Document(str(input_path))

    if output_format == 'md':
        md_lines: list[str] = []
        for index, paragraph in enumerate(document.paragraphs, start=1):
            if not paragraph.text:
                md_lines.append('')
                continue
            redacted, findings, subjects = sanitize_text_and_subjects(
                paragraph.text, engine, surface='docx', locator=f'段落 {index}'
            )
            all_findings.extend(findings)
            all_subjects.extend(subjects)
            md_lines.append(redacted)

        for table_index, table in enumerate(document.tables, start=1):
            md_lines.append('')
            headers: list[str] = []
            rows: list[list[str]] = []
            for row_index, row in enumerate(table.rows, start=1):
                cells: list[str] = []
                for col_index, cell in enumerate(row.cells, start=1):
                    locator = f'表格 {table_index} 行 {row_index} 列 {col_index}'
                    redacted, findings, subjects = sanitize_text_and_subjects(
                        cell.text, engine, surface='docx_table', locator=locator
                    )
                    all_findings.extend(findings)
                    all_subjects.extend(subjects)
                    cells.append(redacted.replace('|', '\\|'))
                if row_index == 1:
                    headers = cells
                else:
                    rows.append(cells)
            if headers:
                md_lines.append('| ' + ' | '.join(headers) + ' |')
                md_lines.append('| ' + ' | '.join(['---'] * len(headers)) + ' |')
            for cells in rows:
                md_lines.append('| ' + ' | '.join(cells) + ' |')
            md_lines.append('')

        output_file = work_dir / 'desensitized_output.md'
        output_file.write_text('\n'.join(md_lines).rstrip() + '\n', encoding='utf-8')
        return output_file, all_findings, all_subjects

    for index, paragraph in enumerate(document.paragraphs, start=1):
        if not paragraph.text:
            continue
        redacted, findings, subjects = sanitize_text_and_subjects(
            paragraph.text, engine, surface='docx', locator=f'段落 {index}'
        )
        all_findings.extend(findings)
        all_subjects.extend(subjects)
        if findings or subjects:
            paragraph.text = redacted

    for table_index, table in enumerate(document.tables, start=1):
        for row_index, row in enumerate(table.rows, start=1):
            for col_index, cell in enumerate(row.cells, start=1):
                if not cell.text:
                    continue
                locator = f'表格 {table_index} 行 {row_index} 列 {col_index}'
                redacted, findings, subjects = sanitize_text_and_subjects(
                    cell.text, engine, surface='docx_table', locator=locator
                )
                all_findings.extend(findings)
                all_subjects.extend(subjects)
                if findings or subjects:
                    cell.text = redacted

    output_file = work_dir / 'desensitized_output.docx'
    document.save(str(output_file))
    return output_file, all_findings, all_subjects


def process_pdf(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
    output_stem: str = 'desensitized_output',
    output_format: str | None = None,
) -> tuple[Path, list[Finding], list[SubjectMapping], bool]:
    """对 PDF 执行脱敏：优先提取文本层，否则 OCR 提取，最终按 output_format 输出。"""
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    text_parts: list[str] = []
    used_ocr = False

    if fitz is not None:
        pdf = fitz.open(str(input_path))
        for page_index, page in enumerate(pdf, start=1):
            page_text = page.get_text('text') or ''
            if page_text.strip():
                text_parts.append(f'--- 第 {page_index} 页 ---\n{page_text.strip()}')
        pdf.close()

    if not text_parts:
        warnings.append('PDF 未提取到可复制文本，使用 OCR 提取后脱敏。')
        if fitz is None:
            raise RuntimeError('OCR 需要 PyMuPDF 才能渲染页面。')
        try:
            ensure_ocr_available(require_pdf=True)
        except OcrUnavailable as exc:
            raise RuntimeError(str(exc)) from exc
        ocr_text = extract_pdf_ocr_text(input_path)
        used_ocr = True
        # extract_pdf_ocr_text returns pages joined by form feed.
        for page_index, page_text in enumerate(ocr_text.split('\f'), start=1):
            body = '\n'.join(
                line for line in page_text.splitlines()
                if not line.strip().startswith('--- OCR 第')
            ).strip()
            if body:
                text_parts.append(f'--- 第 {page_index} 页 ---\n{body}')

    if not text_parts:
        raise RuntimeError('未能从 PDF 中提取到可脱敏文本。')

    full_text = '\n\n'.join(text_parts)
    redacted, findings, subjects = sanitize_text_and_subjects(
        full_text, engine, surface='pdf', locator='全文'
    )
    all_findings.extend(findings)
    all_subjects.extend(subjects)

    effective_format = output_format if output_format in {'md', 'txt', 'docx'} else 'md'
    output_file = work_dir / f'{output_stem}.{effective_format}'
    if effective_format == 'docx':
        _write_docx_from_text(redacted, output_file)
    else:
        output_file.write_text(redacted, encoding='utf-8')

    if used_ocr:
        warnings.append('OCR 脱敏结果已保存，可复制编辑，但 OCR 识别可能存在误差。')
    return output_file, all_findings, all_subjects, used_ocr


def _write_docx_from_text(text: str, output_path: Path) -> None:
    """将纯文本按段落写入新的 DOCX 文档。"""
    doc = Document()
    for line in text.splitlines():
        if line.strip():
            doc.add_paragraph(line)
        else:
            # 空行不添加额外段落，保留自然分段
            pass
    doc.save(str(output_path))


def _safe_output_stem(name: str) -> str:
    """从材料名称生成安全的文件 stem。"""
    stem = re.sub(r'[\\/:*?"<>|]', '_', name or 'desensitized_output').strip()
    return stem or 'desensitized_output'


def process_table(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    if input_path.suffix.lower() == '.csv':
        return process_csv(input_path, work_dir, engine, delimiter=',', output_suffix='.csv')
    if input_path.suffix.lower() == '.tsv':
        return process_csv(input_path, work_dir, engine, delimiter='\t', output_suffix='.tsv')
    if pd is None:
        raise RuntimeError('处理 xlsx/xls/ods 需要安装 pandas、openpyxl、xlrd 或 odfpy。')

    sheets = pd.read_excel(input_path, sheet_name=None, dtype=str)
    output_file = work_dir / 'desensitized_output.xlsx'
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        for sheet_name, frame in sheets.items():
            sanitized_frame = frame.copy()
            for row_index, row in sanitized_frame.iterrows():
                for column in sanitized_frame.columns:
                    value = '' if row[column] is None else str(row[column])
                    if not value or value == 'nan':
                        continue
                    locator = f'{sheet_name}!{column}{row_index + 2}'
                    redacted, findings, subjects = sanitize_text_and_subjects(
                        value, engine, surface='xlsx_cell', locator=locator
                    )
                    if findings or subjects:
                        sanitized_frame.at[row_index, column] = redacted
                        all_findings.extend(findings)
                        all_subjects.extend(subjects)
            sanitized_frame.to_excel(writer, sheet_name=str(sheet_name)[:31], index=False)
    return output_file, all_findings, all_subjects


def process_csv(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    *,
    delimiter: str,
    output_suffix: str,
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    output_file = work_dir / f'desensitized_output{output_suffix}'
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    with input_path.open('r', encoding='utf-8-sig', newline='') as source:
        reader = csv.reader(source, delimiter=delimiter)
        rows = list(reader)
    for row_index, row in enumerate(rows, start=1):
        for col_index, value in enumerate(row, start=1):
            redacted, findings, subjects = sanitize_text_and_subjects(
                value, engine, surface='csv_cell', locator=f'R{row_index}C{col_index}'
            )
            if findings or subjects:
                row[col_index - 1] = redacted
                all_findings.extend(findings)
                all_subjects.extend(subjects)
    with output_file.open('w', encoding='utf-8-sig', newline='') as target:
        writer = csv.writer(target, delimiter=delimiter)
        writer.writerows(rows)
    return output_file, all_findings, all_subjects


def process_json(input_path: Path, work_dir: Path, engine: Desensitizer, warnings: list[str]) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    if input_path.suffix.lower() in {'.jsonl', '.ndjson'}:
        return process_json_lines(input_path, work_dir, engine, warnings)

    payload = json.loads(input_path.read_text(encoding='utf-8'))
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []

    def walk(value: Any, path: str) -> Any:
        if isinstance(value, str):
            redacted, findings, subjects = sanitize_text_and_subjects(
                value, engine, surface='json_value', locator=path
            )
            all_findings.extend(findings)
            all_subjects.extend(subjects)
            return redacted
        if isinstance(value, list):
            return [walk(item, f'{path}[{index}]') for index, item in enumerate(value)]
        if isinstance(value, dict):
            return {key: walk(item, f'{path}.{key}' if path else str(key)) for key, item in value.items()}
        return value

    sanitized_payload = walk(payload, '')
    output_file = work_dir / 'desensitized_output.json'
    output_file.write_text(json.dumps(sanitized_payload, ensure_ascii=False, indent=2), encoding='utf-8')
    return output_file, all_findings, all_subjects


def process_json_lines(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    output_lines: list[str] = []

    def walk(value: Any, path: str) -> Any:
        if isinstance(value, str):
            redacted, findings, subjects = sanitize_text_and_subjects(
                value, engine, surface='jsonl_value', locator=path
            )
            all_findings.extend(findings)
            all_subjects.extend(subjects)
            return redacted
        if isinstance(value, list):
            return [walk(item, f'{path}[{index}]') for index, item in enumerate(value)]
        if isinstance(value, dict):
            return {key: walk(item, f'{path}.{key}' if path else str(key)) for key, item in value.items()}
        return value

    for line_index, line in enumerate(input_path.read_text(encoding='utf-8').splitlines(), start=1):
        if not line.strip():
            output_lines.append(line)
            continue
        try:
            payload = json.loads(line)
        except json.JSONDecodeError:
            redacted, findings, subjects = sanitize_text_and_subjects(
                line, engine, surface='jsonl_line', locator=f'行 {line_index}'
            )
            all_findings.extend(findings)
            all_subjects.extend(subjects)
            output_lines.append(redacted)
            warnings.append(f'第 {line_index} 行不是合法 JSON，已按普通文本脱敏。')
            continue
        output_lines.append(json.dumps(walk(payload, f'行 {line_index}'), ensure_ascii=False))

    output_file = work_dir / f'desensitized_output{input_path.suffix.lower()}'
    output_file.write_text('\n'.join(output_lines) + ('\n' if output_lines else ''), encoding='utf-8')
    return output_file, all_findings, all_subjects


def process_pptx(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    if Presentation is None:
        raise RuntimeError('处理 pptx 需要安装 python-pptx。')

    presentation = Presentation(str(input_path))
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    for slide_index, slide in enumerate(presentation.slides, start=1):
        for shape_index, shape in enumerate(slide.shapes, start=1):
            if getattr(shape, 'has_text_frame', False) and shape.text:
                locator = f'幻灯片 {slide_index} 文本框 {shape_index}'
                redacted, findings, subjects = sanitize_text_and_subjects(
                    shape.text, engine, surface='pptx_text', locator=locator
                )
                if findings or subjects:
                    shape.text = redacted
                    all_findings.extend(findings)
                    all_subjects.extend(subjects)
            if getattr(shape, 'has_table', False):
                for row_index, row in enumerate(shape.table.rows, start=1):
                    for col_index, cell in enumerate(row.cells, start=1):
                        if not cell.text:
                            continue
                        locator = f'幻灯片 {slide_index} 表格 {shape_index} 行 {row_index} 列 {col_index}'
                        redacted, findings, subjects = sanitize_text_and_subjects(
                            cell.text, engine, surface='pptx_table', locator=locator
                        )
                        if findings or subjects:
                            cell.text = redacted
                            all_findings.extend(findings)
                            all_subjects.extend(subjects)

    output_file = work_dir / 'desensitized_output.pptx'
    presentation.save(str(output_file))
    warnings.append('PPTX 脱敏会尽量保留结构，但命中文本框的局部字体样式可能被重置。')
    return output_file, all_findings, all_subjects


def process_image(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    if Image is None or ImageDraw is None:
        raise RuntimeError('图片脱敏需要安装 Pillow。')
    try:
        ensure_ocr_available()
    except OcrUnavailable as exc:
        raise RuntimeError(str(exc)) from exc
    output_file = work_dir / f'desensitized_output{input_path.suffix.lower()}'
    output_file, image_findings, image_subjects, _visible_words = redact_image(input_path, output_file, engine, '图片')
    return output_file, image_findings, image_subjects


def redact_image(input_path: Path, output_file: Path, engine: Desensitizer, locator_prefix: str) -> tuple[Path, list[Finding], list[SubjectMapping], list[dict[str, Any]]]:
    image = Image.open(input_path).convert('RGB')
    data = ocr_image_to_data(image)
    draw = ImageDraw.Draw(image)
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []

    # Group by (block, paragraph, line) because line_num alone is reset per block.
    words = [
        {
            'text': (data['text'][i] or '').strip(),
            'left': int(data['left'][i]),
            'top': int(data['top'][i]),
            'width': int(data['width'][i]),
            'height': int(data['height'][i]),
            'line': int(data['line_num'][i]),
            'word': int(data['word_num'][i]),
            'block': int(data['block_num'][i]),
            'par': int(data['par_num'][i]),
        }
        for i in range(len(data.get('text', [])))
    ]
    lines: dict[tuple[int, int, int], list[dict[str, Any]]] = {}
    for w in words:
        if not w['text']:
            continue
        key = (w['block'], w['par'], w['line'])
        lines.setdefault(key, []).append(w)

    blacked_out_word_keys: set[tuple[int, int, int, int]] = set()

    def _blackout_word_indices(indices: set[int], word_spans: list[tuple[int, int, dict[str, Any]]]) -> None:
        if not indices:
            return
        left = min(word_spans[i][2]['left'] for i in indices)
        top = min(word_spans[i][2]['top'] for i in indices)
        right = max(word_spans[i][2]['left'] + word_spans[i][2]['width'] for i in indices)
        bottom = max(word_spans[i][2]['top'] + word_spans[i][2]['height'] for i in indices)
        draw.rectangle([left, top, right, bottom], fill='black')
        for i in indices:
            w = word_spans[i][2]
            blacked_out_word_keys.add((w['block'], w['par'], w['line'], w['word']))

    # Share subject token counters across all lines so the same company/person gets
    # the same replacement label everywhere in the document.
    subject_counters: dict[str, int] = {'person_name': 0, 'company_name': 0}

    for line_key, line_words in sorted(lines.items()):
        line_words.sort(key=lambda w: (w['left'], w['top']))
        word_spans: list[tuple[int, int, dict[str, Any]]] = []
        compact_chunks: list[str] = []
        compact_to_line: list[int] = []
        line_pos = 0
        for w in line_words:
            word_start = line_pos
            word_end = line_pos + len(w['text'])
            word_spans.append((word_start, word_end, w))
            for offset, _ch in enumerate(w['text']):
                compact_to_line.append(word_start + offset)
            compact_chunks.append(w['text'])
            line_pos = word_end + 1  # +1 for the space between words
        compact_text = ''.join(compact_chunks)
        if not compact_text.strip():
            continue

        # Detect privacy entities (phone, id card, etc.) on compact text.
        compact_sanitized, findings = engine.sanitize_text(
            compact_text, surface='image_text', locator=f'{locator_prefix} 行 {line_key}'
        )
        # Detect legal subjects (person/company names) on the original compact text,
        # not on the privacy-redacted text, to avoid double-redaction artifacts.
        compact_redacted, subjects = redact_legal_subjects(
            compact_text, locator=f'{locator_prefix} 行 {line_key}', cluster_counters=subject_counters
        )

        all_findings.extend(findings)
        all_subjects.extend(subjects)

        # Collect compact character indices that need to be blacked out.
        covered_compact_chars: set[int] = set()

        # 1. Privacy findings.
        for finding in findings:
            for idx in range(finding.start, finding.end):
                covered_compact_chars.add(idx)

        # 2. Legal subject replacements.
        for subject in subjects:
            original = subject.original
            if not original:
                continue
            start = 0
            while True:
                pos = compact_text.find(original, start)
                if pos == -1:
                    break
                for idx in range(pos, pos + len(original)):
                    covered_compact_chars.add(idx)
                start = pos + len(original)

        # 3. Fallback: any compact character that changed after subject redaction.
        for idx, (orig, red) in enumerate(zip(compact_text, compact_redacted)):
            if orig != red:
                covered_compact_chars.add(idx)

        # Map compact character indices back to word indices.
        covered_word_indices: set[int] = set()
        for compact_idx in covered_compact_chars:
            if compact_idx >= len(compact_to_line):
                continue
            line_idx = compact_to_line[compact_idx]
            for word_idx, (start, end, _w) in enumerate(word_spans):
                if start <= line_idx < end:
                    covered_word_indices.add(word_idx)
                    break

        _blackout_word_indices(covered_word_indices, word_spans)

    image.save(output_file)
    visible_words = [
        {
            'text': w['text'],
            'left': w['left'],
            'top': w['top'],
            'width': w['width'],
            'height': w['height'],
        }
        for w in words
        if (w['block'], w['par'], w['line'], w['word']) not in blacked_out_word_keys
    ]
    return output_file, all_findings, all_subjects, visible_words
