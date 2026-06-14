"""
Redaction Detector - 敏感实体识别器

职责：
1. 从文本/LDIR 中识别敏感实体
2. 支持多种识别方法：正则规则、词典匹配、NER、法律语义提取
3. 输出实体位置、类型、置信度

v0.3 支持实体类型：
- person_name: 人名
- id_number: 身份证号
- phone_number: 手机号
- email: 邮箱
- address: 地址
- bank_account: 银行卡号
- company_name: 公司名称
- license_plate: 车牌号
- case_number: 案号
- wechat_id: 微信号
- alipay_id: 支付宝账号
- ip_address: IP 地址
- party_alias: 当事人代称/简称（如甲方、该公司、其）

v0.3 增强：
- 集成 LegalEntityExtractor，减少法律意见书等复杂文本中的主体遗漏
- 识别当事人代称（甲方/乙方/该公司/其）用于后续实体聚类
- 支持 LLM 增强识别（可选，默认关闭以保速度）
"""

import re
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class SensitiveEntity:
    """敏感实体"""
    entity_id: str
    entity_type: str
    text: str
    start: int
    end: int
    confidence: float = 0.0
    detection_method: str = ""  # regex | dictionary | ner | llm | semantic
    page_number: Optional[int] = None
    bbox: Optional[List[float]] = None
    review_required: bool = False
    alias_of: Optional[str] = None  # 指向所属实体的 entity_id（用于简称/代词）
    cluster_id: Optional[str] = None  # 实体聚类 ID（用于同一主体多称谓统一）


class RedactionDetector:
    """敏感实体检测器"""

    # 实体类型列表
    ENTITY_TYPES = [
        "person_name", "id_number", "phone_number", "email",
        "address", "bank_account", "company_name", "license_plate",
        "case_number", "wechat_id", "alipay_id", "ip_address",
        "device_id", "trade_secret", "medical_info", "minor_info",
        "party_alias",  # 当事人代称/简称
    ]

    # 诉讼/合同角色词，用于识别当事人上下文
    ROLE_KEYWORDS = [
        "原告", "被告", "第三人", "上诉人", "被上诉人",
        "申请人", "被申请人", "申请执行人", "被执行人",
        "甲方", "乙方", "丙方", "丁方",
        "出卖人", "买受人", "出租人", "承租人",
        "委托人", "受托人", "转让方", "受让方",
        "债权人", "债务人", "保证人", "被保证人",
    ]

    # 当事人代词/简称模式（用于后续 coreference 聚类）
    PARTY_PRONOUNS = [
        r"该公司", r"该企业", r"该司", r"本单位", r"本机关",
        r"其", r"己方", r"对方", r"相对方", r"目标公司",
        r"标的公司", r"被收购方", r"收购方", r"重组方",
    ]

    def __init__(self, model_router: Optional[Any] = None, use_llm: bool = False):
        self._regex_patterns = self._init_regex_patterns()
        self._company_suffixes = self._init_company_suffixes()
        self._address_keywords = self._init_address_keywords()
        self._party_suffixes = self._init_party_suffixes()
        self.model_router = model_router
        self.use_llm = use_llm
        self._semantic_extractor = self._init_semantic_extractor(model_router)

    def _init_semantic_extractor(self, model_router: Optional[Any]) -> Optional[Any]:
        """初始化法律语义实体提取器"""
        try:
            from document.semantic.entity_extractor import LegalEntityExtractor
            return LegalEntityExtractor(model_router=model_router)
        except Exception as e:
            import sys
            sys.stderr.write(f"[RedactionDetector] 语义提取器初始化失败: {e}\n")
            return None

    def detect(self, text: str, entity_types: Optional[List[str]] = None,
               page_number: Optional[int] = None,
               use_semantic: bool = True) -> List[SensitiveEntity]:
        """
        检测文本中的敏感实体。

        text: 输入文本
        entity_types: 指定要检测的实体类型（None=全部）
        page_number: 页码（可选）
        use_semantic: 是否启用法律语义提取增强主体识别
        """
        target_types = entity_types or self.ENTITY_TYPES
        entities: List[SensitiveEntity] = []
        entity_index = 0

        # 1. 传统规则检测
        for etype in target_types:
            if etype == "party_alias":
                # 代词/简称在第二阶段统一处理
                continue

            method = self._get_detection_method(etype)
            found = []

            if method == "regex":
                found = self._detect_by_regex(text, etype, page_number)
            elif method == "dictionary":
                found = self._detect_by_dictionary(text, etype, page_number)
            elif method == "semantic":
                found = self._detect_by_semantic(text, etype, page_number)
            elif method == "ner":
                found = self._detect_by_ner(text, etype, page_number)

            for e in found:
                entity_index += 1
                e.entity_id = f"{etype}_{entity_index:03d}"
                entities.append(e)

        # 2. 语义增强：提取当事人主体（解决规则遗漏）
        if use_semantic and self._semantic_extractor and "company_name" in target_types:
            semantic_entities = self._detect_parties_by_semantic(text, page_number)
            for e in semantic_entities:
                entity_index += 1
                e.entity_id = f"{e.entity_type}_{entity_index:03d}"
                entities.append(e)

        # 3. 检测当事人代词/简称 mention
        if "party_alias" in target_types:
            alias_entities = self._detect_party_aliases(text, page_number)
            for e in alias_entities:
                entity_index += 1
                e.entity_id = f"party_alias_{entity_index:03d}"
                entities.append(e)

        # 按位置排序，去除重叠
        entities = self._deduplicate_entities(entities)
        return entities

    def detect_from_ldir(self, ldir_doc: Dict[str, Any],
                         entity_types: Optional[List[str]] = None) -> List[SensitiveEntity]:
        """从 LDIR 文档中检测敏感实体"""
        all_entities = []
        for page in ldir_doc.get("pages", []):
            page_num = page.get("page_number", 1)
            for block in page.get("blocks", []):
                text = block.get("text", "")
                bbox = block.get("bbox")
                entities = self.detect(text, entity_types, page_num)
                for e in entities:
                    e.bbox = bbox
                all_entities.extend(entities)
        return all_entities

    # --- 检测方法 ---

    def _detect_by_regex(self, text: str, entity_type: str,
                         page_number: Optional[int]) -> List[SensitiveEntity]:
        """基于正则规则检测"""
        patterns = self._regex_patterns.get(entity_type, [])
        entities = []

        for pattern_info in patterns:
            pattern = pattern_info["pattern"]
            confidence = pattern_info.get("confidence", 0.9)

            for match in pattern.finditer(text):
                entities.append(SensitiveEntity(
                    entity_id="",
                    entity_type=entity_type,
                    text=match.group(),
                    start=match.start(),
                    end=match.end(),
                    confidence=confidence,
                    detection_method="regex",
                    page_number=page_number,
                ))

        return entities

    def _detect_by_dictionary(self, text: str, entity_type: str,
                              page_number: Optional[int]) -> List[SensitiveEntity]:
        """基于词典检测"""
        entities = []

        if entity_type == "company_name":
            # 扩展：同时用公司后缀和更宽泛的主体后缀检测
            suffixes = sorted(set(self._company_suffixes + self._party_suffixes), key=len, reverse=True)

            # 通用代词，不应作为公司名主体
            generic_pronouns = {"该公司", "该企业", "该司", "本单位", "本机关",
                                "目标公司", "标的公司", "被收购方", "收购方",
                                "重组方", "相对方", "对方", "己方"}

            for suffix in suffixes:
                # 找到所有后缀出现位置，然后向前截取合理边界
                pattern = re.compile(re.escape(suffix))
                for match in pattern.finditer(text):
                    suffix_end = match.end()
                    suffix_start = match.start()

                    # 向前截取名称：从 suffix_start 往前，遇到标点/连接词/角色词时截断
                    name_start = self._find_name_start(text, suffix_start)
                    matched_text = text[name_start:suffix_end]

                    # 过滤过短的
                    if not matched_text.strip() or len(matched_text) < len(suffix) + 1:
                        continue

                    # 过滤司法机构（法院/检察院/仲裁委员会/公证处）
                    if self._is_judicial_institution(matched_text, suffix):
                        continue

                    # 去除前导/尾随的引号、括号
                    matched_text, name_start, suffix_end = self._strip_quotes(
                        matched_text, name_start, suffix_end
                    )

                    # 过滤通用代词
                    if matched_text in generic_pronouns:
                        continue

                    # 过滤常见的非主体词开头
                    noise_prefixes = ["关于", "有关", "对于", "根据", "依据", "按照"]
                    if any(matched_text.startswith(n) for n in noise_prefixes):
                        continue

                    entities.append(SensitiveEntity(
                        entity_id="",
                        entity_type="company_name",
                        text=matched_text,
                        start=name_start,
                        end=suffix_end,
                        confidence=0.7,
                        detection_method="dictionary",
                        page_number=page_number,
                    ))

            # 特殊处理：提取"以下简称'xxx'" / "以下简称"xxx"" / "以下简称「xxx」"中的简称
            # 允许有后缀的公司简称，也允许无后缀的核心名简称（如"以下简称\"小米\""）
            alias_pattern = re.compile(
                r"以下简称\s*['\"“”‘’「『]([^'\"“”‘’」』]{2,20}?)\s*['\"“”‘’」』]"
            )
            for match in alias_pattern.finditer(text):
                alias = match.group(1).strip()
                if not alias or len(alias) < 2:
                    continue
                # 过滤纯代词和噪声
                noise_words = {"该公司", "该企业", "该司", "本单位", "本机关",
                               "目标公司", "标的公司", "甲方", "乙方", "丙方", "丁方"}
                if alias in noise_words:
                    continue
                entities.append(SensitiveEntity(
                    entity_id="",
                    entity_type="company_name",
                    text=alias,
                    start=match.start(1),
                    end=match.end(1),
                    confidence=0.85,
                    detection_method="dictionary",
                    page_number=page_number,
                ))

        elif entity_type == "address":
            exclude_words = ["身份证号", "编号", "电话号", "账号", "序号", "批号"]
            # 介词：如果地址片段前面紧邻介词，通常是"向北京"而非独立地址
            prepositions = ["向", "从", "在", "到", "往", "自", "于", "位于", "地处", "距", "离"]
            for keyword in self._address_keywords:
                pattern = re.compile(rf"[^，。；\n]{{3,30}}{re.escape(keyword)}")
                for match in pattern.finditer(text):
                    matched_text = match.group()
                    # 排除常见误报
                    if any(exclude in matched_text for exclude in exclude_words):
                        continue
                    # 排除介词后的地点片段（如"向北京市"）：检查 match 前面紧邻的字符
                    prev_idx = match.start() - 1
                    if prev_idx >= 0 and text[prev_idx] in prepositions:
                        continue
                    # 也排除匹配文本内部以介词开头的情况（如"遂向北京市"）
                    if any(matched_text.startswith(p) for p in prepositions) or \
                       (len(matched_text) >= 2 and matched_text[1] in prepositions):
                        continue
                    entities.append(SensitiveEntity(
                        entity_id="",
                        entity_type="address",
                        text=matched_text,
                        start=match.start(),
                        end=match.end(),
                        confidence=0.6,
                        detection_method="dictionary",
                        page_number=page_number,
                        review_required=True,
                    ))

        return entities

    def _detect_parties_by_semantic(self, text: str,
                                    page_number: Optional[int]) -> List[SensitiveEntity]:
        """
        使用法律语义提取器识别当事人主体，弥补规则遗漏。

        将 LegalEntityExtractor 提取的 party 实体转换为 SensitiveEntity。
        """
        if not self._semantic_extractor:
            return []

        entities = []
        try:
            legal_entities = self._semantic_extractor.extract(
                text, chunk_id=f"page_{page_number or 1}", use_llm=self.use_llm
            )
            for le in legal_entities:
                if le.type != "party":
                    continue
                name = le.normalized.strip()
                if not name or len(name) < 2:
                    continue

                # 只取语义提取里置信度较高或名字较长的（避免噪声）
                if le.confidence < 0.6 and len(name) < 4:
                    continue

                # 清理名称前可能混入的连接词/角色词前缀
                connective_prefixes = ["与", "和", "及", "同", "被告", "原告", "第三人",
                                       "上诉人", "被上诉人", "申请人", "被申请人"]
                adjusted_start_offset = 0
                for prefix in sorted(connective_prefixes, key=len, reverse=True):
                    if name.startswith(prefix):
                        name = name[len(prefix):]
                        adjusted_start_offset += len(prefix)
                        break

                if not name or len(name) < 2:
                    continue

                # 计算位置：优先用 LegalEntity 自带的位置，否则在文本中查找
                start = le.position.get("start", -1) if le.position else -1
                end = le.position.get("end", -1) if le.position else -1
                if start >= 0 and adjusted_start_offset > 0:
                    start += adjusted_start_offset
                if start < 0 or end < 0 or end > len(text):
                    idx = text.find(name)
                    if idx >= 0:
                        start, end = idx, idx + len(name)
                    else:
                        continue

                entities.append(SensitiveEntity(
                    entity_id="",
                    entity_type="company_name",
                    text=name,
                    start=start,
                    end=end,
                    confidence=le.confidence,
                    detection_method="semantic",
                    page_number=page_number,
                ))
        except Exception as e:
            print(f"[RedactionDetector] 语义提取失败: {e}")

        return entities

    def _detect_party_aliases(self, text: str,
                              page_number: Optional[int]) -> List[SensitiveEntity]:
        """
        检测当事人代词/简称 mention。

        这些 mention 本身需要被识别，并在后续 coreference 聚类中
        关联到对应的主体实体。
        """
        entities = []

        # 1. 甲方/乙方/丙方/丁方等合同角色词
        role_alias_pattern = re.compile(
            r"(甲方|乙方|丙方|丁方|出卖人|买受人|出租人|承租人|"
            r"委托人|受托人|转让方|受让方|债权人|债务人|保证人|被保证人|"
            r"抵押权人|抵押人|出质人|质权人|寄售人|代销人|保险人|投保人|被保险人|受益人)"
        )
        for match in role_alias_pattern.finditer(text):
            entities.append(SensitiveEntity(
                entity_id="",
                entity_type="party_alias",
                text=match.group(1),
                start=match.start(),
                end=match.end(),
                confidence=0.85,
                detection_method="regex",
                page_number=page_number,
            ))

        # 2. 通用代词/指代表达
        pronoun_pattern = re.compile(
            r"(该公司|该企业|该司|本单位|本机关|目标公司|标的公司|"
            r"被收购方|收购方|重组方|相对方|对方|己方)"
        )
        for match in pronoun_pattern.finditer(text):
            entities.append(SensitiveEntity(
                entity_id="",
                entity_type="party_alias",
                text=match.group(1),
                start=match.start(),
                end=match.end(),
                confidence=0.75,
                detection_method="regex",
                page_number=page_number,
            ))

        # 3. 孤立的"其"（前后有公司/主体上下文时）
        for match in re.finditer(r"(其)", text):
            # 简单启发式：前后 50 字内有公司/企业/主体等词
            context = text[max(0, match.start() - 50):match.end() + 50]
            if re.search(r"公司|企业|集团|主体|当事人|一方", context):
                entities.append(SensitiveEntity(
                    entity_id="",
                    entity_type="party_alias",
                    text="其",
                    start=match.start(),
                    end=match.end(),
                    confidence=0.6,
                    detection_method="regex",
                    page_number=page_number,
                ))

        return entities

    def _detect_by_semantic(self, text: str, entity_type: str,
                            page_number: Optional[int]) -> List[SensitiveEntity]:
        """语义方法占位（目前 company_name 已在 detect 中单独处理）"""
        return []

    def _find_name_start(self, text: str, suffix_start: int) -> int:
        """
        从后缀起点向前搜索，找到合理名称起点。

        策略：
        1. 最多向前搜索 40 个字符
        2. 遇到句读标点、连接词、角色词时，在其后截断
        3. 优先取最短合理片段
        """
        max_lookback = 40
        search_start = max(0, suffix_start - max_lookback)
        window = text[search_start:suffix_start]

        # 截断标记：标点、连接词、角色词、常见动词/介词
        break_marks = [
            "，", "。", "；", "、", "\n", " ", "\t",
            "与", "和", "及", "同", "向", "对", "为", "的",
            "起诉", "诉", "被", "将", "因", "就", "由", "自", "至", "在",
            "被告", "原告", "第三人", "上诉人", "被上诉人",
            "申请人", "被申请人", "申请执行人", "被执行人",
            "甲方", "乙方", "丙方", "丁方",
            "出卖人", "买受人", "出租人", "承租人",
            "委托人", "受托人", "转让方", "受让方",
            "债权人", "债务人", "保证人", "被保证人",
            "以下简称",
        ]

        # 从后往前找最近的截断点
        best_pos = search_start
        for mark in break_marks:
            idx = window.rfind(mark)
            if idx >= 0:
                # 截断点在 mark 之后
                pos = search_start + idx + len(mark)
                # 跳过冒号
                if pos < suffix_start and text[pos] in "：:":
                    pos += 1
                if pos > best_pos:
                    best_pos = pos

        return best_pos

    def _is_judicial_institution(self, text: str, suffix: str) -> bool:
        """判断是否为司法机构（不应作为公司名主体）"""
        judicial_suffixes = ["人民法院", "人民检察院", "仲裁委员会", "公证处"]
        return any(js in text for js in judicial_suffixes)

    def _strip_quotes(self, text: str, start: int, end: int) -> tuple:
        """去除名称前后的引号、括号，并调整起止位置"""
        quote_pairs = [
            ('"', '"'), ("'", "'"), ('"', '"'), ('"', '"'),
            ('「', '」'), ('『', '』'), ('(', ')'), ('（', '）'),
        ]
        stripped_text = text
        new_start = start
        new_end = end

        for left, right in quote_pairs:
            if stripped_text.startswith(left) and stripped_text.endswith(right):
                stripped_text = stripped_text[len(left):-len(right)]
                new_start += len(left)
                new_end -= len(right)
                break
            elif stripped_text.startswith(left):
                stripped_text = stripped_text[len(left):]
                new_start += len(left)
                break
            elif stripped_text.endswith(right):
                stripped_text = stripped_text[:-len(right)]
                new_end -= len(right)
                break

        # 单独去除开头可能残留的引号
        for left, _ in quote_pairs:
            if stripped_text.startswith(left):
                stripped_text = stripped_text[len(left):]
                new_start += len(left)
                break

        return stripped_text, new_start, new_end

    def _detect_by_ner(self, text: str, entity_type: str,
                       page_number: Optional[int]) -> List[SensitiveEntity]:
        """
        基于 NER 模型检测。
        v0.2 框架实现，实际需接入 NER 模型。
        """
        # v0.2 预留：可接入 HanLP / jieba / 小模型 NER
        return []

    # --- 内部工具 ---

    def _init_regex_patterns(self) -> Dict[str, List[Dict]]:
        """初始化正则规则库"""
        return {
            "id_number": [
                {
                    # 中国大陆身份证号（15位或18位）
                    "pattern": re.compile(r"\b\d{6}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]\b"),
                    "confidence": 0.95,
                },
                {
                    # 15位老身份证号
                    "pattern": re.compile(r"\b\d{6}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}\b"),
                    "confidence": 0.90,
                },
            ],
            "phone_number": [
                {
                    # 中国大陆手机号
                    "pattern": re.compile(r"\b1[3-9]\d{9}\b"),
                    "confidence": 0.95,
                },
                {
                    # 固定电话（带区号）
                    "pattern": re.compile(r"\b0\d{2,3}-?\d{7,8}\b"),
                    "confidence": 0.85,
                },
            ],
            "email": [
                {
                    "pattern": re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"),
                    "confidence": 0.95,
                },
            ],
            "bank_account": [
                {
                    # 银行卡号（16-19位）
                    "pattern": re.compile(r"\b\d{16,19}\b"),
                    "confidence": 0.80,
                    # 注意：16-19位数字可能是其他编号，需人工复核
                },
            ],
            "license_plate": [
                {
                    # 中国车牌
                    "pattern": re.compile(r"[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4,5}[A-Z0-9挂学警港澳]"),
                    "confidence": 0.90,
                },
            ],
            "ip_address": [
                {
                    "pattern": re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b"),
                    "confidence": 0.85,
                },
            ],
            "wechat_id": [
                {
                    # 微信号（字母开头，6-20位）
                    "pattern": re.compile(r"微信号[：:]\s*([a-zA-Z][a-zA-Z0-9_-]{5,19})"),
                    "confidence": 0.85,
                },
            ],
            "alipay_id": [
                {
                    # 支付宝账号（手机号或邮箱）
                    "pattern": re.compile(r"支付宝[账号]?[：:]\s*(\S+@\S+|1[3-9]\d{9})"),
                    "confidence": 0.85,
                },
            ],
            "case_number": [
                {
                    # 中国法院案号
                    "pattern": re.compile(r"\(\d{4}\)[一-龥]{1,3}\d{1,4}号"),
                    "confidence": 0.90,
                },
                {
                    "pattern": re.compile(r"\d{4}年[一-龥]{1,3}\d{1,4}号"),
                    "confidence": 0.85,
                },
            ],
        }

    def _init_company_suffixes(self) -> List[str]:
        """公司名称后缀词典（扩展法律场景常见主体）"""
        return [
            # 公司/企业
            "有限公司", "有限责任公司", "股份有限公司", "股份公司",
            "集团有限公司", "集团公司", "集团",
            "科技有限公司", "科技有限责任公司", "科技股份有限公司",
            "信息技术有限公司", "信息科技有限公司",
            "咨询有限公司", "顾问有限公司",
            "律师事务所", "会计师事务所", "审计事务所",
            "税务师事务所",
            "资产评估有限公司", "评估有限公司",
            "合伙企业", "有限合伙企业", "有限合伙",
            "工作室", "中心", "研究院", "研究所", "学会", "协会", "委员会",
            # 境外常见
            "Co., Ltd.", "Inc.", "Corp.", "LLC", "LP", "Ltd.",
            "Limited", "Holdings", "Group",
            # 政府/事业单位/其他组织
            "人民政府", "街道办事处", "村民委员会", "居民委员会",
            "管理局", "监管局", "市场监督管理局",
            "人民法院", "人民检察院", "仲裁委员会", "公证处",
            "公安局", "检察院", "法院",
            # 银行/金融机构
            "银行", "支行", "分行", "保险公司", "证券公司", "基金公司",
            "信托有限公司", "资产管理有限公司", "融资租赁有限公司",
            # 基金/投资
            "投资基金", "股权投资基金", "创业投资基金",
            "投资合伙企业", "投资中心", "资管计划",
        ]

    def _init_party_suffixes(self) -> List[str]:
        """当事人主体后缀（比公司后缀更宽泛，覆盖非公司主体）"""
        return [
            "公司", "集团", "企业", "事务所", "中心", "研究院",
            "银行", "支行", "分行", "基金", "合伙企业",
            "人民政府", "法院", "检察院", "委员会", "协会", "学会",
        ]

    def _init_address_keywords(self) -> List[str]:
        """地址关键词词典"""
        return [
            "省", "市", "自治区", "区", "县", "镇", "街道",
            "路", "街", "巷", "号", "栋", "单元", "室",
            "号楼", "大厦", "广场", "中心", "花园",
        ]

    def _get_detection_method(self, entity_type: str) -> str:
        """获取实体类型的默认检测方法"""
        regex_types = [
            "id_number", "phone_number", "email", "bank_account",
            "license_plate", "ip_address", "wechat_id", "alipay_id",
            "case_number",
        ]
        dictionary_types = ["company_name", "address"]
        ner_types = ["person_name", "trade_secret", "medical_info", "minor_info"]

        if entity_type in regex_types:
            return "regex"
        if entity_type in dictionary_types:
            return "dictionary"
        return "ner"

    def _deduplicate_entities(self, entities: List[SensitiveEntity]) -> List[SensitiveEntity]:
        """
        去重：移除完全重叠的实体，保留置信度更高的。
        """
        if not entities:
            return entities

        # 按起始位置排序
        sorted_entities = sorted(entities, key=lambda e: (e.start, -e.confidence))
        result = []

        for e in sorted_entities:
            # 检查是否与已保留的实体重叠
            overlap = False
            for kept in result:
                # 如果当前实体被已保留实体完全覆盖
                if e.start >= kept.start and e.end <= kept.end:
                    overlap = True
                    break
                # 如果当前实体与已保留实体部分重叠，保留置信度更高的
                if not (e.end <= kept.start or e.start >= kept.end):
                    if e.confidence > kept.confidence:
                        # 替换
                        result.remove(kept)
                        result.append(e)
                    overlap = True
                    break

            if not overlap:
                result.append(e)

        # 按位置重新排序
        return sorted(result, key=lambda e: e.start)
