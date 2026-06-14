#!/usr/bin/env python3
from __future__ import annotations
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

RISK_LEVEL_ORDER = {
    '无': 0,
    '建议优化': 1,
    '中风险': 2,
    '高风险': 3,
}

RISK_RULES = {
    'outbound_transfer_check': {
        'trigger_terms': ['境外接收方', '跨境', '出境', '标准合同', '安全评估', '境外'],
        'required_groups': [
            {
                'name': '境外接收方身份',
                'terms': ['境外接收方', '接收方', '接收主体', '主体名称', '公司名称'],
                'suggestion': '明确境外接收方名称、身份或主体信息',
            },
            {
                'name': '联系方式',
                'terms': ['联系方式', '联系邮箱', '联系电话', '联系地址'],
                'suggestion': '补充境外接收方联系方式或联系渠道',
            },
            {
                'name': '出境场景与必要性',
                'terms': ['出境场景', '跨境场景', '为实现', '业务需要', '必要性', '必要'],
                'suggestion': '说明出境场景、业务目的与必要性边界',
            },
            {
                'name': '保障机制',
                'terms': ['标准合同', '安全评估', '认证', '保护措施', '保障机制'],
                'suggestion': '说明已采取的保障机制，如标准合同、安全评估或其他保护措施',
            },
        ],
        'ambiguity_terms': ['相关方', '必要时', '可能', '等', '包括但不限于'],
        'risk_point': '数据出境相关披露可能不足',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '补充境外接收方信息、出境场景、必要性说明及保障机制。',
    },
    'third_party_sharing_check': {
        'trigger_terms': ['第三方', '合作方', '合作伙伴', '委托处理', '共享', 'SDK', '受托方'],
        'required_groups': [
            {
                'name': '第三方身份或类别',
                'terms': ['第三方', '合作方', '合作伙伴', '受托方', '委托处理方', 'SDK', '服务商', '接收方'],
                'suggestion': '明确第三方、受托方或 SDK 的身份、名称或类别',
            },
            {
                'name': '共享信息范围',
                'terms': ['信息类型', '字段', '范围', '类别', '手机号', '设备标识', '位置信息', '个人信息类型'],
                'suggestion': '列明共享或委托处理的信息类型、字段范围',
            },
            {
                'name': '共享目的',
                'terms': ['目的', '用于', '为实现', '共享目的'],
                'suggestion': '说明共享或委托处理的业务目的',
            },
            {
                'name': '处理方式或管理要求',
                'terms': ['方式', '委托处理', '接口传输', '匿名化', '去标识化', '协议', '管理要求'],
                'suggestion': '说明共享方式、委托处理安排及管理要求',
            },
        ],
        'ambiguity_terms': ['合作伙伴', '相关方', '必要时', '可能', '等', '包括但不限于', '相关服务'],
        'risk_point': '第三方共享或委托处理披露可能不足',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '补充第三方类别、共享范围、目的及处理方式。',
    },
    'disclosure_check': {
        'trigger_terms': ['收集', '使用', '处理', '个人信息', '信息类型'],
        'required_groups': [
            {
                'name': '处理目的',
                'terms': ['目的', '用于', '为了', '为实现'],
                'suggestion': '补充处理目的或业务场景说明',
            },
            {
                'name': '处理方式',
                'terms': ['方式', '如何', '通过', '处理方式'],
                'suggestion': '说明具体处理方式，而不是只写收集或使用',
            },
            {
                'name': '信息范围',
                'terms': ['信息类型', '个人信息', '类别', '范围', '手机号', '设备标识', '位置信息'],
                'suggestion': '列明处理的信息类型、类别或范围',
            },
            {
                'name': '用户权利与联系方式',
                'terms': ['用户权利', '查询', '更正', '删除', '撤回同意', '联系我们', '联系方式'],
                'suggestion': '补充用户权利、联系方式与权利行使渠道',
            },
        ],
        'ambiguity_terms': ['相关信息', '必要信息', '等', '包括但不限于', '适当', '必要时'],
        'risk_point': '重要处理事项披露可能不充分',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '补充处理目的、方式、范围及用户权利告知。',
    },
    'lawful_basis_check': {
        'trigger_terms': ['同意', '授权', '必要', '处理', '推荐', '营销', '画像'],
        'required_groups': [
            {
                'name': '合法性基础',
                'terms': ['同意', '单独同意', '授权', '履行合同', '法定义务', '法定职责', '公共利益'],
                'suggestion': '明确对应的合法性基础，如同意、履行合同、法定义务等',
            },
            {
                'name': '必要性边界',
                'terms': ['必要', '最小', '最少', '仅限', '限于', '必要性'],
                'suggestion': '说明必要性边界与最小必要范围',
            },
            {
                'name': '授权范围',
                'terms': ['授权范围', '处理范围', '适用范围', '使用范围'],
                'suggestion': '明确授权或处理范围，避免范围过宽',
            },
        ],
        'ambiguity_terms': ['为提升服务', '服务优化', '体验优化', '必要时', '可能'],
        'overreach_terms': ['营销', '推荐', '画像', '个性化', '精准', '广告'],
        'risk_point': '合法性基础与必要性表达可能不足',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '明确同意/授权基础及必要性边界。',
    },
    'purpose_scope_check': {
        'trigger_terms': ['位置信息', '设备标识', '浏览记录', '通讯录', '联系人', '身份证', '银行卡', '相册', '麦克风', '剪贴板', '营销推荐', '个性化推荐', '商业分析', '服务优化', '用户画像'],
        'required_groups': [
            {
                'name': '具体业务目的',
                'terms': ['用于', '为了', '为实现', '业务目的', '具体目的'],
                'suggestion': '把处理目的写具体，不要只写服务优化、体验提升等宽泛表述',
            },
            {
                'name': '信息与目的对应关系',
                'terms': ['分别用于', '对应', '与上述目的相关', '信息类型', '字段'],
                'suggestion': '说明每类信息分别对应什么目的，避免目的与范围脱节',
            },
            {
                'name': '必要性边界或最小化说明',
                'terms': ['必要', '最小必要', '仅限', '最少', '范围'],
                'suggestion': '说明为何属于实现目的所必需，以及最小必要边界',
            },
            {
                'name': '可选性或替代方案',
                'terms': ['可选', '关闭', '拒绝', '不影响基本功能', '替代方案'],
                'suggestion': '对非核心场景说明可选性、关闭方式或不授权的影响',
            },
        ],
        'ambiguity_terms': ['服务优化', '体验提升', '商业分析', '相关服务', '包括但不限于', '等信息', '其他信息'],
        'broad_purpose_terms': ['服务优化', '体验提升', '营销推荐', '个性化推荐', '商业分析', '用户画像', '精准营销'],
        'data_terms': ['位置信息', '精准定位', '设备标识', '浏览记录', '通讯录', '联系人', '身份证', '银行卡', '相册', '麦克风', '剪贴板', '交易记录'],
        'sensitive_data_terms': ['精准定位', '通讯录', '联系人', '身份证', '银行卡', '相册', '麦克风', '剪贴板'],
        'risk_point': '处理目的与信息范围匹配性可能不足',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '说明每类信息与具体目的的对应关系，压缩非必要范围，并补充可选性或替代方案。',
    },
    'sensitive_personal_info_check': {
        'trigger_terms': ['生物识别', '指纹', '人脸', '面部识别', '医疗健康', '病历', '银行卡', '金融账户', '财产信息', '行踪轨迹', '精准定位', '通讯录', '未成年人', '十四周岁', '14周岁', '儿童'],
        'required_groups': [
            {
                'name': '单独同意或明示授权',
                'terms': ['单独同意', '明示同意', '单独授权', '明确同意'],
                'suggestion': '补充敏感个人信息处理所需的单独同意或等效授权安排',
            },
            {
                'name': '处理必要性与具体目的',
                'terms': ['必要', '为实现', '用于', '具体目的', '业务需要'],
                'suggestion': '说明处理敏感个人信息的具体目的及必要性，避免宽泛使用',
            },
            {
                'name': '严格保护措施',
                'terms': ['加密', '访问控制', '严格保护', '安全措施', '脱敏', '权限控制'],
                'suggestion': '说明针对敏感个人信息采取的严格保护措施',
            },
            {
                'name': '未成年人/监护人安排',
                'terms': ['监护人', '父母', '监护人同意', '未成年人保护', '儿童隐私'],
                'suggestion': '如涉及未成年人信息，补充监护人同意与专门保护安排',
            },
        ],
        'ambiguity_terms': ['服务优化', '体验提升', '商业分析', '必要时', '相关功能', '等'],
        'minor_terms': ['未成年人', '十四周岁', '14周岁', '儿童'],
        'sensitive_terms': ['生物识别', '指纹', '人脸', '面部识别', '医疗健康', '病历', '银行卡', '金融账户', '财产信息', '行踪轨迹', '精准定位', '通讯录'],
        'broad_purpose_terms': ['服务优化', '体验提升', '商业分析', '营销推荐', '个性化推荐', '用户画像'],
        'risk_point': '敏感个人信息处理条件与保护安排可能不足',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '补充单独同意、处理必要性、严格保护措施；如涉及未成年人，再补充监护人同意与专门保护安排。',
    },
    'consent_feature_coupling_check': {
        'trigger_terms': ['单独同意', '同意', '授权', '开启定位', '开启相机', '开启麦克风', '开启通讯录', '个性化推荐', '营销推荐', '广告', '附近门店', '附近服务', '通讯录匹配', '刷脸登录'],
        'required_groups': [
            {
                'name': '独立同意机制',
                'terms': ['单独同意', '明确同意', '自主选择', '单独授权'],
                'suggestion': '对基于同意的可选功能明确设置独立同意或自主选择机制',
            },
            {
                'name': '可选功能说明',
                'terms': ['个性化推荐', '营销推荐', '广告', '附近门店', '附近服务', '刷脸登录', '通讯录匹配', '扩展功能', '可选功能'],
                'suggestion': '说明该处理仅对应可选功能或增强功能，而不是泛化成全部主功能',
            },
            {
                'name': '关闭或拒绝路径',
                'terms': ['可关闭', '可拒绝', '可撤回', '随时关闭', '关闭方式', '拒绝后', '关闭后', '可不开启'],
                'suggestion': '补充关闭、拒绝或撤回同意的路径说明',
            },
            {
                'name': '不影响基础功能',
                'terms': ['不影响基本功能', '不影响基础功能', '不影响核心功能', '仍可使用基础功能', '不影响基础浏览', '不影响下单功能', '不影响浏览和下单功能', '不影响基础浏览和下单功能'],
                'suggestion': '明确拒绝或关闭该授权后，不影响产品/服务的基础功能',
            },
        ],
        'ambiguity_terms': ['相关功能', '必要时', '经同意后', '授权后使用', '等'],
        'optional_feature_terms': ['个性化推荐', '营销推荐', '广告', '附近门店', '附近服务', '刷脸登录', '通讯录匹配', '扩展功能', '增强服务'],
        'permission_terms': ['定位', '相机', '麦克风', '通讯录', '相册', '人脸'],
        'bundling_terms': ['不同意则无法使用', '拒绝后将无法使用', '不开启将无法使用', '未授权将无法使用', '否则无法使用', '否则无法继续使用', '否则将无法继续使用', '需授权后方可使用', '必须同意'],
        'risk_point': '基于同意的可选功能与基础功能绑定关系可能不清',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '把可选功能、同意机制、关闭路径与基础功能影响拆开说明，避免把非必要授权绑成主功能前提。',
    },
    'field_purpose_legal_basis_check': {
        'trigger_terms': ['手机号', '位置信息', '精准定位', '设备标识', '浏览记录', '通讯录', '人脸', '银行卡', '用于', '为实现', '个性化推荐', '营销推荐', '商业分析', '登录验证', '履行合同', '同意', '单独同意', '法定义务'],
        'required_groups': [
            {
                'name': '字段信息',
                'terms': ['手机号', '位置信息', '精准定位', '设备标识', '浏览记录', '通讯录', '人脸', '银行卡', '个人信息类型', '字段'],
                'suggestion': '明确具体处理的字段或信息类型，避免只写笼统的个人信息',
            },
            {
                'name': '处理目的',
                'terms': ['用于', '为了', '为实现', '登录验证', '个性化推荐', '营销推荐', '商业分析', '附近门店', '风控'],
                'suggestion': '明确每类字段对应的处理目的或业务场景',
            },
            {
                'name': '法律基础',
                'terms': ['同意', '单独同意', '履行合同', '法定义务', '法定职责', '公共利益'],
                'suggestion': '明确该处理活动对应的法律基础，不要只写目的不写依据',
            },
            {
                'name': '字段-目的-依据对应关系',
                'terms': ['分别用于', '分别基于', '基于上述同意', '上述处理基于', '对应关系'],
                'suggestion': '把字段、目的和法律基础一一对应写清，不要混成一团',
            }
        ],
        'ambiguity_terms': ['等信息', '相关信息', '服务优化', '必要时', '经授权后'],
        'data_terms': ['手机号', '位置信息', '精准定位', '设备标识', '浏览记录', '通讯录', '人脸', '银行卡'],
        'purpose_terms': ['登录验证', '个性化推荐', '营销推荐', '商业分析', '附近门店', '风控'],
        'basis_terms': ['同意', '单独同意', '履行合同', '法定义务', '法定职责', '公共利益'],
        'high_risk_purpose_terms': ['营销推荐', '个性化推荐', '商业分析'],
        'risk_point': '字段、处理目的与法律基础之间的对应关系可能不足',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '把具体字段、处理目的、法律基础以及三者的对应关系拆开写清，避免出现“知道收了什么、也知道拿去干嘛，但不知道凭什么处理”的情况。',
    },
    'contract_obligation_check': {
        'trigger_terms': ['甲方', '乙方', '合同', '协议', '责任', '违约', '委托处理'],
        'required_groups': [
            {
                'name': '双方义务边界',
                'terms': ['义务', '责任', '边界', '甲方', '乙方'],
                'suggestion': '明确双方的数据处理义务、责任与边界',
            },
            {
                'name': '保密与安全措施',
                'terms': ['保密', '安全措施', '技术措施', '管理措施'],
                'suggestion': '补充保密义务与安全措施要求',
            },
            {
                'name': '终止后处理',
                'terms': ['终止', '返还', '删除', '销毁', '到期'],
                'suggestion': '说明合同终止、到期后的返还、删除或销毁安排',
            },
        ],
        'ambiguity_terms': ['另行约定', '必要时', '合理', '适当'],
        'risk_point': '合同中的数据处理义务或责任边界可能不清',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '明确双方义务、责任边界、保密要求及终止后处理。',
    },
    'retention_deletion_check': {
        'trigger_terms': ['保存', '删除', '注销', '退出', '期限', '保留'],
        'required_groups': [
            {
                'name': '保存期限',
                'terms': ['保存期限', '保留期限', '保存期间', '留存期限', '天', '日', '个月', '年'],
                'suggestion': '写明保存期限或可识别的留存时长',
            },
            {
                'name': '删除触发条件',
                'terms': ['删除', '注销', '停止服务', '期限届满', '删除条件'],
                'suggestion': '说明何时删除、注销后的删除条件或触发点',
            },
            {
                'name': '删除方式',
                'terms': ['匿名化', '去标识化', '删除方式', '销毁'],
                'suggestion': '说明删除、匿名化或去标识化处理方式',
            },
        ],
        'ambiguity_terms': ['长期', '永久', '视业务需要', '在必要期间', '适当期限'],
        'risk_point': '保存期限或删除机制表达可能不足',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '明确保存期限、删除条件与注销退出后的处理机制。',
    },
    'consistency_check': {
        'trigger_terms': ['共享', '第三方', '删除', '保存', '必要', '最小必要', '包括但不限于'],
        'required_groups': [],
        'ambiguity_terms': [],
        'risk_point': '文本前后关于数据处理边界的表述可能存在冲突',
        'legal_basis': '待外部规范数据库补充具体依据',
        'default_suggestion': '统一前后表述，避免在共享、保存期限、必要性范围等关键问题上出现互相冲突或边界不清。',
    },
}

CONSISTENCY_PATTERNS = [
    {
        'name': '共享口径冲突',
        'left_terms': ['不会共享', '不会向第三方共享', '不向第三方共享', '不向第三方提供', '不会向第三方提供', '未经同意不会共享'],
        'right_terms': ['共享', '第三方', '合作伙伴', '委托处理', 'SDK'],
        'risk_level': '高风险',
        'suggestion': '统一是否共享、向谁共享以及共享条件的表述，避免既写不共享又写合作伙伴共享。',
    },
    {
        'name': '保存删除口径冲突',
        'left_terms': ['删除', '注销后删除', '期限届满后删除', '及时删除'],
        'right_terms': ['长期保存', '永久保存', '长期保留', '无限期保存'],
        'risk_level': '高风险',
        'suggestion': '统一保存期限与删除机制口径，明确何时删除、何时仅因法定义务继续保存。',
    },
    {
        'name': '最小必要与范围口径冲突',
        'left_terms': ['最小必要', '仅限必要', '必要范围', '最少范围'],
        'right_terms': ['包括但不限于', '等信息', '其他信息', '相关信息'],
        'risk_level': '中风险',
        'suggestion': '把最小必要范围写具体，避免一边强调最小必要，一边又用“包括但不限于”等兜底表述放大范围。',
    },
]


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def unique_keep_order(items: list[str]) -> list[str]:
    seen = set()
    out = []
    for item in items:
        if item and item not in seen:
            seen.add(item)
            out.append(item)
    return out


def contains_any(text: str, words: list[str]) -> list[str]:
    return [w for w in unique_keep_order(words) if w in text]


def split_sentences(text: str) -> list[str]:
    chunks = re.split(r'(?<=[。！？；\n])', text)
    return [c.strip() for c in chunks if c.strip()]


def find_relevant_snippets(text: str, trigger_terms: list[str], extra_terms: list[str] | None = None, limit: int = 2) -> list[str]:
    extra_terms = extra_terms or []
    sentences = split_sentences(text)
    scored = []
    for sentence in sentences:
        score = len(contains_any(sentence, trigger_terms)) * 3 + len(contains_any(sentence, extra_terms))
        if score > 0:
            scored.append((score, sentence))
    scored.sort(key=lambda item: (-item[0], len(item[1])))

    snippets: list[str] = []
    for _, sentence in scored:
        snippet = sentence.replace('\n', ' ')
        if len(snippet) > 80:
            snippet = snippet[:77] + '...'
        if snippet not in snippets:
            snippets.append(snippet)
        if len(snippets) >= limit:
            break
    return snippets


def infer_segment_label(segment: str, index: int) -> str:
    first_line = segment.strip().splitlines()[0].strip() if segment.strip() else ''
    patterns = [
        r'^(第[一二三四五六七八九十百千万零两0-9]+条(?:\s*[^，。；\n]{0,20})?)',
        r'^(第[一二三四五六七八九十百千万零两0-9]+款(?:\s*[^，。；\n]{0,20})?)',
        r'^([一二三四五六七八九十]+[、.．][^。；\n]{0,24})',
        r'^([0-9]+[、.．][^。；\n]{0,24})',
    ]
    for pattern in patterns:
        match = re.match(pattern, first_line)
        if match:
            return match.group(1)
    return first_line[:24] if first_line else f'第{index + 1}段'


def locate_source_sections(segment_contexts: list[dict], item: dict, limit: int = 3) -> list[dict]:
    evidence = item.get('evidence', []) or []
    trigger_hits = item.get('trigger_hits', []) or []
    candidates: list[tuple[int, dict]] = []
    for idx, context in enumerate(segment_contexts):
        segment = context.get('text', '')
        score = 0
        for ev in evidence:
            if ev and ev in segment:
                score += 10
        for hit in trigger_hits:
            if hit and hit in segment:
                score += 2
        if score <= 0:
            continue
        candidates.append((
            score,
            {
                'page': context.get('page'),
                'segment_index': context.get('segment_index', idx + 1),
                'label': context.get('label') or infer_segment_label(segment, idx),
                'snippet': segment[:180].replace('\n', ' ').strip(),
            }
        ))

    candidates.sort(key=lambda pair: (-pair[0], pair[1]['segment_index']))
    result: list[dict] = []
    seen: set[int] = set()
    for _, payload in candidates:
        if payload['segment_index'] in seen:
            continue
        seen.add(payload['segment_index'])
        result.append(payload)
        if len(result) >= limit:
            break
    return result


def group_coverage(text: str, groups: list[dict]) -> tuple[list[dict], list[dict]]:
    present = []
    missing = []
    for group in groups:
        hits = contains_any(text, group['terms'])
        payload = {'name': group['name'], 'hits': hits, 'suggestion': group['suggestion']}
        if hits:
            present.append(payload)
        else:
            missing.append(payload)
    return present, missing


def highest_risk_level(items: list[dict]) -> str:
    highest = '无'
    for item in items:
        level = item.get('risk_level', '无')
        if RISK_LEVEL_ORDER.get(level, 0) > RISK_LEVEL_ORDER.get(highest, 0):
            highest = level
    return highest


def build_suggestion(spec: dict, missing_groups: list[dict], extra_notes: list[str] | None = None) -> str:
    extra_notes = extra_notes or []
    suggestions = [group['suggestion'] for group in missing_groups[:4]]
    suggestions.extend(extra_notes)
    suggestions = unique_keep_order(suggestions)
    if not suggestions:
        return spec['default_suggestion']
    return '；'.join(suggestions) + '。'


def classify_risk_level(path_id: str, full_text: str, trigger_hits: list[str], missing_groups: list[dict], ambiguity_hits: list[str], adequacy_ratio: float) -> str:
    overreach_hits = contains_any(full_text, RISK_RULES.get(path_id, {}).get('overreach_terms', []))
    consent_hits = contains_any(full_text, ['同意', '单独同意', '明确同意', '授权'])

    if path_id == 'lawful_basis_check' and overreach_hits and not consent_hits:
        return '高风险'
    if path_id == 'retention_deletion_check':
        long_keep_hits = contains_any(full_text, ['长期保存', '永久保存', '长期保留', '永久保留', '无限期保存'])
        deletion_hits = contains_any(full_text, ['删除', '注销', '匿名化', '去标识化', '销毁'])
        if long_keep_hits and not deletion_hits:
            return '高风险'
    if path_id == 'outbound_transfer_check':
        has_cross_border_core = bool(contains_any(full_text, ['跨境', '出境', '境外接收方', '境外']))
        has_safeguard = bool(contains_any(full_text, ['标准合同', '安全评估', '认证', '保护措施']))
        if has_cross_border_core and len(missing_groups) >= 3 and not has_safeguard:
            return '高风险'

    score = len(missing_groups) + min(2, len(ambiguity_hits))
    if adequacy_ratio >= 0.75:
        score -= 2
    elif adequacy_ratio >= 0.5:
        score -= 1
    if len(trigger_hits) >= 2:
        score += 1

    if score >= 4:
        return '中风险'
    return '建议优化'


def assess_purpose_scope(text: str, segments: list[str]) -> dict:
    spec = RISK_RULES['purpose_scope_check']
    data_hits = contains_any(text, spec['data_terms'])
    purpose_hits = contains_any(text, spec['broad_purpose_terms'] + ['用于', '为了', '为实现'])
    if not data_hits or not purpose_hits:
        return {
            'path_id': 'purpose_scope_check',
            'summary': '未发现明显的“信息范围—处理目的”匹配性风险信号。',
            'items': []
        }

    relevant_terms = unique_keep_order(data_hits + purpose_hits)
    relevant_segments = [seg for seg in segments if contains_any(seg, relevant_terms)]
    relevant_text = '\n'.join(relevant_segments) if relevant_segments else text

    present_groups, missing_groups = group_coverage(text, spec['required_groups'])
    ambiguity_hits = contains_any(relevant_text, spec['ambiguity_terms'])
    adequacy_ratio = len(present_groups) / len(spec['required_groups']) if spec['required_groups'] else 1
    broad_purpose_hits = contains_any(relevant_text, spec['broad_purpose_terms'])
    sensitive_hits = contains_any(relevant_text, spec['sensitive_data_terms'])
    evidence = find_relevant_snippets(relevant_text, relevant_terms, broad_purpose_hits + sensitive_hits)

    if adequacy_ratio >= 0.85 and not ambiguity_hits and not broad_purpose_hits:
        return {
            'path_id': 'purpose_scope_check',
            'summary': f"命中主题：{', '.join(relevant_terms[:4])}；目的与信息范围对应关系较清晰，暂未形成明确风险。",
            'items': []
        }

    risk_level = '建议优化'
    if broad_purpose_hits and len(missing_groups) >= 2:
        risk_level = '中风险'
    if sensitive_hits and broad_purpose_hits and len(missing_groups) >= 2:
        risk_level = '高风险'
    auto_recheck = risk_level in {'中风险', '高风险'}

    present_names = [group['name'] for group in present_groups]
    missing_names = [group['name'] for group in missing_groups]
    extra_notes = []
    if sensitive_hits and broad_purpose_hits:
        extra_notes.append('对高敏感或高侵入性信息，进一步论证与目的的对应关系，并压缩到最小必要范围')

    reason_parts = [
        f"涉及信息：{', '.join(data_hits[:5])}",
        f"涉及目的：{', '.join(purpose_hits[:4])}",
        f"已识别要素：{', '.join(present_names[:4]) if present_names else '无明显充分说明'}",
    ]
    if missing_names:
        reason_parts.append(f"待补要素：{', '.join(missing_names[:4])}")
    if ambiguity_hits:
        reason_parts.append(f"宽泛表述：{', '.join(ambiguity_hits[:4])}")
    if evidence:
        reason_parts.append('证据片段：' + ' / '.join(evidence))

    return {
        'path_id': 'purpose_scope_check',
        'summary': f"命中 {len(relevant_terms)} 个相关信号；关键要素覆盖 {len(present_groups)}/{len(spec['required_groups'])}；宽泛表述 {len(ambiguity_hits)} 处。",
        'items': [
            {
                'risk_point': spec['risk_point'],
                'risk_level': risk_level,
                'legal_basis': spec['legal_basis'],
                'reason': '；'.join(reason_parts) + '。',
                'suggestion': build_suggestion(spec, missing_groups, extra_notes),
                'auto_recheck': auto_recheck,
                'evidence': evidence,
                'coverage_ratio': round(adequacy_ratio, 2),
                'trigger_hits': relevant_terms,
                'missing_groups': missing_names,
                'ambiguity_hits': ambiguity_hits,
            }
        ]
    }


def assess_consistency(text: str, segments: list[str]) -> dict:
    spec = RISK_RULES['consistency_check']
    items = []
    notes = []

    for pattern in CONSISTENCY_PATTERNS:
        left_hits = contains_any(text, pattern['left_terms'])
        right_hits = contains_any(text, pattern['right_terms'])
        if not left_hits or not right_hits:
            continue
        evidence = find_relevant_snippets(text, unique_keep_order(left_hits + right_hits))
        items.append({
            'risk_point': spec['risk_point'],
            'risk_level': pattern['risk_level'],
            'legal_basis': spec['legal_basis'],
            'reason': f"发现“{pattern['name']}”：前文命中 {', '.join(left_hits[:3])}，同时又出现 {', '.join(right_hits[:3])}；证据片段：{' / '.join(evidence) if evidence else '见原文'}。",
            'suggestion': pattern['suggestion'],
            'auto_recheck': pattern['risk_level'] in {'中风险', '高风险'},
            'evidence': evidence,
            'trigger_hits': unique_keep_order(left_hits + right_hits),
            'missing_groups': [],
            'ambiguity_hits': [],
        })
        notes.append(pattern['name'])

    if not items:
        return {
            'path_id': 'consistency_check',
            'summary': '未发现明显的前后表述冲突。',
            'items': []
        }

    return {
        'path_id': 'consistency_check',
        'summary': f"发现 {len(items)} 处一致性风险：{', '.join(notes)}。",
        'items': items,
    }


def assess_sensitive_personal_info(text: str, segments: list[str]) -> dict:
    spec = RISK_RULES['sensitive_personal_info_check']
    sensitive_hits = contains_any(text, spec['sensitive_terms'])
    minor_hits = contains_any(text, spec['minor_terms'])
    trigger_hits = unique_keep_order(sensitive_hits + minor_hits)
    if not trigger_hits:
        return {
            'path_id': 'sensitive_personal_info_check',
            'summary': '未发现明显的敏感个人信息处理信号。',
            'items': []
        }

    relevant_terms = unique_keep_order(trigger_hits + spec['broad_purpose_terms'])
    relevant_segments = [seg for seg in segments if contains_any(seg, relevant_terms)]
    relevant_text = '\n'.join(relevant_segments) if relevant_segments else text

    present_groups, missing_groups = group_coverage(text, spec['required_groups'])
    if not minor_hits:
        present_groups = [group for group in present_groups if group['name'] != '未成年人/监护人安排']
        missing_groups = [group for group in missing_groups if group['name'] != '未成年人/监护人安排']
    ambiguity_hits = contains_any(relevant_text, spec['ambiguity_terms'])
    applicable_group_count = len(spec['required_groups']) if minor_hits else len(spec['required_groups']) - 1
    adequacy_ratio = len(present_groups) / applicable_group_count if applicable_group_count > 0 else 1
    broad_purpose_hits = contains_any(relevant_text, spec['broad_purpose_terms'])
    consent_hits = contains_any(text, ['单独同意', '明示同意', '单独授权', '明确同意'])
    guardian_hits = contains_any(text, ['监护人', '监护人同意', '父母'])
    evidence = find_relevant_snippets(relevant_text, relevant_terms, broad_purpose_hits)

    if adequacy_ratio >= 0.85 and not ambiguity_hits and (not minor_hits or guardian_hits):
        return {
            'path_id': 'sensitive_personal_info_check',
            'summary': f"命中主题：{', '.join(trigger_hits[:4])}；敏感信息处理条件说明较完整，暂未形成明确风险。",
            'items': []
        }

    risk_level = '建议优化'
    if minor_hits and not guardian_hits:
        risk_level = '高风险'
    elif sensitive_hits and not consent_hits and broad_purpose_hits:
        risk_level = '高风险'
    elif sensitive_hits and len(missing_groups) >= 2:
        risk_level = '中风险'

    auto_recheck = risk_level in {'中风险', '高风险'}
    present_names = [group['name'] for group in present_groups]
    missing_names = [group['name'] for group in missing_groups]
    extra_notes = []
    if sensitive_hits and not consent_hits:
        extra_notes.append('补充针对敏感个人信息处理的单独同意或其他明确授权机制')
    if minor_hits and not guardian_hits:
        extra_notes.append('如涉及未成年人信息，补充监护人同意与专门规则')

    reason_parts = [
        f"涉及敏感主题：{', '.join(trigger_hits[:5])}",
        f"已识别要素：{', '.join(present_names[:4]) if present_names else '无明显充分说明'}",
    ]
    if missing_names:
        reason_parts.append(f"待补要素：{', '.join(missing_names[:4])}")
    if broad_purpose_hits:
        reason_parts.append(f"宽泛目的：{', '.join(broad_purpose_hits[:4])}")
    if ambiguity_hits:
        reason_parts.append(f"模糊表述：{', '.join(ambiguity_hits[:4])}")
    if evidence:
        reason_parts.append('证据片段：' + ' / '.join(evidence))

    return {
        'path_id': 'sensitive_personal_info_check',
        'summary': f"命中 {len(trigger_hits)} 个敏感信息相关信号；关键要素覆盖 {len(present_groups)}/{len(spec['required_groups'])}；模糊表述 {len(ambiguity_hits)} 处。",
        'items': [
            {
                'risk_point': spec['risk_point'],
                'risk_level': risk_level,
                'legal_basis': spec['legal_basis'],
                'reason': '；'.join(reason_parts) + '。',
                'suggestion': build_suggestion(spec, missing_groups, extra_notes),
                'auto_recheck': auto_recheck,
                'evidence': evidence,
                'coverage_ratio': round(adequacy_ratio, 2),
                'trigger_hits': trigger_hits,
                'missing_groups': missing_names,
                'ambiguity_hits': ambiguity_hits,
            }
        ]
    }


def assess_field_purpose_legal_basis(text: str, segments: list[str]) -> dict:
    spec = RISK_RULES['field_purpose_legal_basis_check']
    data_hits = contains_any(text, spec['data_terms'])
    purpose_hits = contains_any(text, spec['purpose_terms'])
    basis_hits = contains_any(text, spec['basis_terms'])
    trigger_hits = unique_keep_order(data_hits + purpose_hits + basis_hits)
    if not data_hits or not purpose_hits:
        return {
            'path_id': 'field_purpose_legal_basis_check',
            'summary': '未发现明显的“字段—目的—法律基础”联动信号。',
            'items': []
        }

    relevant_terms = unique_keep_order(trigger_hits)
    relevant_segments = [seg for seg in segments if contains_any(seg, relevant_terms)]
    relevant_text = '\n'.join(relevant_segments) if relevant_segments else text

    present_groups, missing_groups = group_coverage(text, spec['required_groups'])
    ambiguity_hits = contains_any(relevant_text, spec['ambiguity_terms'])
    adequacy_ratio = len(present_groups) / len(spec['required_groups']) if spec['required_groups'] else 1
    high_risk_purpose_hits = contains_any(relevant_text, spec['high_risk_purpose_terms'])
    relation_hits = contains_any(text, ['分别用于', '分别基于', '基于上述同意', '上述处理基于', '对应关系'])
    evidence = find_relevant_snippets(relevant_text, relevant_terms, high_risk_purpose_hits)

    if adequacy_ratio >= 0.85 and relation_hits and basis_hits:
        return {
            'path_id': 'field_purpose_legal_basis_check',
            'summary': f"命中主题：{', '.join(trigger_hits[:5])}；字段、目的与法律基础对应关系较完整，暂未形成明确风险。",
            'items': []
        }

    risk_level = '建议优化'
    if high_risk_purpose_hits and not basis_hits:
        risk_level = '高风险'
    elif len(missing_groups) >= 2 or (data_hits and purpose_hits and not basis_hits):
        risk_level = '中风险'

    auto_recheck = risk_level in {'中风险', '高风险'}
    present_names = [group['name'] for group in present_groups]
    missing_names = [group['name'] for group in missing_groups]
    extra_notes = []
    if not basis_hits:
        extra_notes.append('补充该处理活动的法律基础，不要只写字段和目的')
    if not relation_hits:
        extra_notes.append('把字段、目的、法律基础做一一对应说明，避免混合表述')

    reason_parts = [
        f"涉及字段：{', '.join(data_hits[:5])}",
        f"涉及目的：{', '.join(purpose_hits[:4])}",
        f"已识别法律基础：{', '.join(basis_hits[:4]) if basis_hits else '未明确写出'}",
        f"已识别要素：{', '.join(present_names[:4]) if present_names else '无明显充分说明'}",
    ]
    if missing_names:
        reason_parts.append(f"待补要素：{', '.join(missing_names[:4])}")
    if high_risk_purpose_hits:
        reason_parts.append(f"高风险目的：{', '.join(high_risk_purpose_hits[:4])}")
    if ambiguity_hits:
        reason_parts.append(f"模糊表述：{', '.join(ambiguity_hits[:4])}")
    if evidence:
        reason_parts.append('证据片段：' + ' / '.join(evidence))

    return {
        'path_id': 'field_purpose_legal_basis_check',
        'summary': f"命中 {len(trigger_hits)} 个联动信号；关键要素覆盖 {len(present_groups)}/{len(spec['required_groups'])}；模糊表述 {len(ambiguity_hits)} 处。",
        'items': [
            {
                'risk_point': spec['risk_point'],
                'risk_level': risk_level,
                'legal_basis': spec['legal_basis'],
                'reason': '；'.join(reason_parts) + '。',
                'suggestion': build_suggestion(spec, missing_groups, extra_notes),
                'auto_recheck': auto_recheck,
                'evidence': evidence,
                'coverage_ratio': round(adequacy_ratio, 2),
                'trigger_hits': trigger_hits,
                'missing_groups': missing_names,
                'ambiguity_hits': ambiguity_hits,
            }
        ]
    }


def assess_consent_feature_coupling(text: str, segments: list[str]) -> dict:
    spec = RISK_RULES['consent_feature_coupling_check']
    optional_hits = contains_any(text, spec['optional_feature_terms'])
    permission_hits = contains_any(text, spec['permission_terms'])
    bundling_hits = contains_any(text, spec['bundling_terms'])
    consent_hits = contains_any(text, ['单独同意', '明确同意', '同意', '授权'])
    trigger_hits = unique_keep_order(optional_hits + permission_hits + bundling_hits + consent_hits)
    if not trigger_hits or not (optional_hits or permission_hits):
        return {
            'path_id': 'consent_feature_coupling_check',
            'summary': '未发现明显的“同意—可选功能—基础功能影响”风险信号。',
            'items': []
        }

    relevant_terms = unique_keep_order(trigger_hits)
    relevant_segments = [seg for seg in segments if contains_any(seg, relevant_terms)]
    relevant_text = '\n'.join(relevant_segments) if relevant_segments else text

    present_groups, missing_groups = group_coverage(text, spec['required_groups'])
    ambiguity_hits = contains_any(relevant_text, spec['ambiguity_terms'])
    adequacy_ratio = len(present_groups) / len(spec['required_groups']) if spec['required_groups'] else 1
    base_unaffected_hits = contains_any(text, ['不影响基本功能', '不影响基础功能', '不影响核心功能', '仍可使用基础功能', '不影响基础浏览', '不影响下单功能', '不影响浏览和下单功能', '不影响基础浏览和下单功能'])
    evidence = find_relevant_snippets(relevant_text, relevant_terms, bundling_hits)

    if adequacy_ratio >= 0.75 and not bundling_hits and base_unaffected_hits:
        return {
            'path_id': 'consent_feature_coupling_check',
            'summary': f"命中主题：{', '.join(trigger_hits[:4])}；可选功能与同意关系说明较完整，暂未形成明确风险。",
            'items': []
        }

    risk_level = '建议优化'
    if bundling_hits and not base_unaffected_hits:
        risk_level = '高风险'
    elif len(missing_groups) >= 2 or (consent_hits and (not contains_any(text, ['可关闭', '可拒绝', '可撤回', '随时关闭', '关闭后', '可不开启']) or not base_unaffected_hits)):
        risk_level = '中风险'

    auto_recheck = risk_level in {'中风险', '高风险'}
    present_names = [group['name'] for group in present_groups]
    missing_names = [group['name'] for group in missing_groups]
    extra_notes = []
    if bundling_hits and not base_unaffected_hits:
        extra_notes.append('避免把基于同意的非必要授权绑定为主功能使用前提')
    if not contains_any(text, ['可关闭', '可拒绝', '可撤回', '随时关闭', '关闭后', '可不开启']):
        extra_notes.append('补充关闭、拒绝或撤回同意的操作路径')

    reason_parts = [
        f"涉及功能/权限：{', '.join(unique_keep_order(optional_hits + permission_hits)[:5])}",
        f"已识别要素：{', '.join(present_names[:4]) if present_names else '无明显充分说明'}",
    ]
    if missing_names:
        reason_parts.append(f"待补要素：{', '.join(missing_names[:4])}")
    if bundling_hits:
        reason_parts.append(f"绑定表述：{', '.join(bundling_hits[:4])}")
    if ambiguity_hits:
        reason_parts.append(f"模糊表述：{', '.join(ambiguity_hits[:4])}")
    if evidence:
        reason_parts.append('证据片段：' + ' / '.join(evidence))

    return {
        'path_id': 'consent_feature_coupling_check',
        'summary': f"命中 {len(trigger_hits)} 个相关信号；关键要素覆盖 {len(present_groups)}/{len(spec['required_groups'])}；模糊表述 {len(ambiguity_hits)} 处。",
        'items': [
            {
                'risk_point': spec['risk_point'],
                'risk_level': risk_level,
                'legal_basis': spec['legal_basis'],
                'reason': '；'.join(reason_parts) + '。',
                'suggestion': build_suggestion(spec, missing_groups, extra_notes),
                'auto_recheck': auto_recheck,
                'evidence': evidence,
                'coverage_ratio': round(adequacy_ratio, 2),
                'trigger_hits': trigger_hits,
                'missing_groups': missing_names,
                'ambiguity_hits': ambiguity_hits,
            }
        ]
    }


def assess_one(path_id: str, text: str, segments: list[str] | None = None) -> dict:
    spec = RISK_RULES.get(path_id)
    if not spec:
        return {'path_id': path_id, 'summary': '当前无内置规则。', 'items': []}

    segments = segments or [text]
    if path_id == 'purpose_scope_check':
        return assess_purpose_scope(text, segments)
    if path_id == 'sensitive_personal_info_check':
        return assess_sensitive_personal_info(text, segments)
    if path_id == 'field_purpose_legal_basis_check':
        return assess_field_purpose_legal_basis(text, segments)
    if path_id == 'consent_feature_coupling_check':
        return assess_consent_feature_coupling(text, segments)
    if path_id == 'consistency_check':
        return assess_consistency(text, segments)

    trigger_hits = contains_any(text, spec['trigger_terms'])
    if not trigger_hits:
        return {
            'path_id': path_id,
            'summary': '未发现明显触发信号。',
            'items': []
        }

    relevant_segments = [seg for seg in segments if contains_any(seg, spec['trigger_terms'])]
    relevant_text = '\n'.join(relevant_segments) if relevant_segments else text

    present_groups, missing_groups = group_coverage(text, spec['required_groups'])
    ambiguity_hits = contains_any(relevant_text, spec.get('ambiguity_terms', []))
    adequacy_ratio = len(present_groups) / len(spec['required_groups']) if spec['required_groups'] else 1

    overreach_hits = contains_any(relevant_text, spec.get('overreach_terms', []))
    evidence = find_relevant_snippets(relevant_text, spec['trigger_terms'], overreach_hits)

    if adequacy_ratio >= 0.85 and not ambiguity_hits and not (path_id == 'lawful_basis_check' and overreach_hits and not contains_any(text, ['同意', '单独同意', '明确同意', '授权'])):
        return {
            'path_id': path_id,
            'summary': f"命中主题：{', '.join(trigger_hits[:4])}；关键披露要素较完整，暂未形成明确风险。",
            'items': []
        }

    risk_level = classify_risk_level(path_id, text, trigger_hits, missing_groups, ambiguity_hits, adequacy_ratio)
    auto_recheck = risk_level in {'中风险', '高风险'}

    missing_names = [group['name'] for group in missing_groups]
    present_names = [group['name'] for group in present_groups]

    extra_notes = []
    if path_id == 'lawful_basis_check' and overreach_hits and not contains_any(text, ['同意', '单独同意', '明确同意', '授权']):
        extra_notes.append('对营销、推荐、画像等处理活动补充单独同意或其他可支撑的合法性基础')

    reason_parts = [
        f"触发主题：{', '.join(trigger_hits[:4])}",
        f"已识别要素：{', '.join(present_names[:4]) if present_names else '无明显充分披露'}",
    ]
    if missing_names:
        reason_parts.append(f"待补要素：{', '.join(missing_names[:4])}")
    if ambiguity_hits:
        reason_parts.append(f"模糊表述：{', '.join(ambiguity_hits[:4])}")
    if evidence:
        reason_parts.append('证据片段：' + ' / '.join(evidence))

    summary = f"命中 {len(trigger_hits)} 个触发点；关键要素覆盖 {len(present_groups)}/{len(spec['required_groups'])}；模糊表述 {len(ambiguity_hits)} 处。"

    return {
        'path_id': path_id,
        'summary': summary,
        'items': [
            {
                'risk_point': spec['risk_point'],
                'risk_level': risk_level,
                'legal_basis': spec['legal_basis'],
                'reason': '；'.join(reason_parts) + '。',
                'suggestion': build_suggestion(spec, missing_groups, extra_notes),
                'auto_recheck': auto_recheck,
                'evidence': evidence,
                'coverage_ratio': round(adequacy_ratio, 2),
                'trigger_hits': trigger_hits,
                'missing_groups': missing_names,
                'ambiguity_hits': ambiguity_hits,
            }
        ]
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--preprocessed', required=True)
    parser.add_argument('--tasks', required=True)
    parser.add_argument('--out-dir', required=True)
    args = parser.parse_args()

    preprocessed = load_json(Path(args.preprocessed))
    tasks = load_json(Path(args.tasks))
    text = preprocessed.get('normalized_text', '')
    segments = preprocessed.get('segments', [])
    segment_contexts = preprocessed.get('segment_contexts') or [
        {'page': None, 'segment_index': idx + 1, 'label': infer_segment_label(seg, idx), 'text': seg}
        for idx, seg in enumerate(segments)
    ]
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    outputs = []
    for task in tasks.get('tasks', []):
        finding = assess_one(task['path_id'], text, segments)
        for item in finding.get('items', []):
            item['source_sections'] = locate_source_sections(segment_contexts, item)
        path = out_dir / f"{task['path_id']}.json"
        path.write_text(json.dumps(finding, ensure_ascii=False, indent=2), encoding='utf-8')
        outputs.append(str(path))

    print(json.dumps({'findings': outputs}, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
