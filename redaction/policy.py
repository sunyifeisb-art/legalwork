"""
Redaction Policy - 脱敏策略引擎

职责：
1. 定义脱敏策略（external_client / internal_legal_analysis / public_release）
2. 管理每种实体类型的脱敏模式（mask / replace / tokenize / irreversible）
3. 生成和管理映射表（mapping table）
4. 处理跨页主体一致性
5. 实体聚类（Entity Clustering）：同一主体的全称/简称/代词统一映射

脱敏模式：
- mask:       张三 → 张某, 13812345678 → 138****5678
- replace:    张三 → 当事人甲, 北京某科技有限公司 → A公司
- tokenize:   张三 → 张某, 北京某科技有限公司 → 北京某米科技有限公司
- irreversible: PDF坐标涂黑 / 像素覆盖

策略示例（开发文档第7.5节）。
"""

import re
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from enum import Enum


class RedactionMode(str, Enum):
    MASK = "mask"
    REPLACE = "replace"
    TOKENIZE = "tokenize"
    IRREVERSIBLE = "irreversible"
    FULL_MASK = "full_mask"
    PARTIAL_MASK = "partial_mask"
    KEEP = "keep"
    CONFIGURABLE = "configurable"


@dataclass
class RedactionRule:
    """单个实体类型的脱敏规则"""
    entity_type: str
    mode: RedactionMode
    options: Dict[str, Any] = field(default_factory=dict)


@dataclass
class RedactionMapping:
    """脱敏映射项"""
    entity_id: str
    entity_type: str
    original: str
    redacted: str
    mode: RedactionMode
    start: int = 0
    end: int = 0
    page_number: Optional[int] = None
    confidence: float = 0.0
    cluster_id: Optional[str] = None
    alias_of: Optional[str] = None  # 如果是简称/代词，指向 canonical 实体


@dataclass
class EntityCluster:
    """实体聚类：同一主体的不同 mention"""
    cluster_id: str
    canonical_text: str           # canonical 名称（通常为最长全称）
    entity_type: str              # 实体类型（如 company_name, person_name）
    mentions: List[Dict[str, Any]] = field(default_factory=list)  # 所有 mention
    token: str = ""               # 分配的脱敏 token
    redacted: str = ""            # 脱敏后的文本


class RedactionPolicyEngine:
    """脱敏策略引擎"""

    # 预定义策略模板
    PREDEFINED_POLICIES = {
        "external_client": {
            "person_name": RedactionMode.REPLACE,
            "id_number": RedactionMode.FULL_MASK,
            "phone_number": RedactionMode.PARTIAL_MASK,
            "email": RedactionMode.FULL_MASK,
            "address": RedactionMode.PARTIAL_MASK,
            "bank_account": RedactionMode.FULL_MASK,
            "company_name": RedactionMode.REPLACE,
            "party_alias": RedactionMode.REPLACE,
            "minor_info": RedactionMode.FULL_MASK,
            "medical_info": RedactionMode.FULL_MASK,
            "trade_secret": RedactionMode.CONFIGURABLE,
            "case_number": RedactionMode.CONFIGURABLE,
            "license_plate": RedactionMode.MASK,
            "wechat_id": RedactionMode.FULL_MASK,
            "alipay_id": RedactionMode.FULL_MASK,
            "ip_address": RedactionMode.FULL_MASK,
            "amount": RedactionMode.KEEP,
            "date": RedactionMode.KEEP,
            "evidence_id": RedactionMode.KEEP,
        },
        "internal_legal_analysis": {
            "person_name": RedactionMode.TOKENIZE,
            "company_name": RedactionMode.TOKENIZE,
            "party_alias": RedactionMode.TOKENIZE,
            "id_number": RedactionMode.FULL_MASK,
            "phone_number": RedactionMode.FULL_MASK,
            "address": RedactionMode.PARTIAL_MASK,
            "email": RedactionMode.PARTIAL_MASK,
            "bank_account": RedactionMode.FULL_MASK,
            "amount": RedactionMode.KEEP,
            "date": RedactionMode.KEEP,
            "evidence_id": RedactionMode.KEEP,
            "case_number": RedactionMode.KEEP,
            "license_plate": RedactionMode.MASK,
            "trade_secret": RedactionMode.CONFIGURABLE,
        },
        "public_release": {
            "person_name": RedactionMode.FULL_MASK,
            "company_name": RedactionMode.FULL_MASK,
            "party_alias": RedactionMode.FULL_MASK,
            "id_number": RedactionMode.FULL_MASK,
            "phone_number": RedactionMode.FULL_MASK,
            "address": RedactionMode.FULL_MASK,
            "email": RedactionMode.FULL_MASK,
            "bank_account": RedactionMode.FULL_MASK,
            "case_number": RedactionMode.CONFIGURABLE,
            "court_name": RedactionMode.CONFIGURABLE,
            "judge_name": RedactionMode.CONFIGURABLE,
            "lawyer_name": RedactionMode.CONFIGURABLE,
            "license_plate": RedactionMode.FULL_MASK,
            "wechat_id": RedactionMode.FULL_MASK,
            "alipay_id": RedactionMode.FULL_MASK,
            "ip_address": RedactionMode.FULL_MASK,
        },
    }

    def __init__(self, policy_name: str = "external_client",
                 custom_rules: Optional[Dict[str, RedactionMode]] = None):
        self.policy_name = policy_name
        self.rules = self._load_rules(policy_name, custom_rules)
        self._counters: Dict[str, int] = {}  # tokenize 计数器
        self._replace_pool: Dict[str, str] = {}  # replace 映射池（按 cluster_id / text）
        self._clusters: Dict[str, EntityCluster] = {}  # cluster_id -> EntityCluster
        self._text_to_cluster: Dict[str, str] = {}  # canonical/mention text -> cluster_id
        self._replace_templates = self._init_replace_templates()

    def _load_rules(self, policy_name: str,
                    custom_rules: Optional[Dict[str, RedactionMode]]) -> Dict[str, RedactionMode]:
        """加载策略规则"""
        base_rules = self.PREDEFINED_POLICIES.get(policy_name, {}).copy()
        if custom_rules:
            base_rules.update(custom_rules)
        return base_rules

    def get_rule(self, entity_type: str) -> RedactionMode:
        """获取实体类型的脱敏模式"""
        return self.rules.get(entity_type, RedactionMode.KEEP)

    def apply(self, entity: Any) -> str:
        """
        对单个实体应用脱敏规则。

        Returns: 脱敏后的文本
        """
        entity_type = getattr(entity, 'entity_type', '')
        original_text = getattr(entity, 'text', '')
        cluster_id = getattr(entity, 'cluster_id', None)
        mode = self.get_rule(entity_type)

        if mode == RedactionMode.KEEP:
            return original_text

        if mode == RedactionMode.FULL_MASK:
            return self._full_mask(original_text)

        if mode == RedactionMode.PARTIAL_MASK:
            return self._partial_mask(original_text, entity_type)

        if mode == RedactionMode.MASK:
            return self._mask(original_text, entity_type)

        if mode == RedactionMode.REPLACE:
            return self._replace(original_text, entity_type, cluster_id)

        if mode == RedactionMode.TOKENIZE:
            return self._tokenize(original_text, entity_type, cluster_id)

        if mode == RedactionMode.CONFIGURABLE:
            # 可配置项默认进入人工复核
            return f"[{entity_type}: 需配置]"

        return original_text

    def create_mapping(self, entities: List[Any]) -> List[RedactionMapping]:
        """为实体列表生成映射表（含聚类）"""
        # 第一步：实体聚类（同一主体多称谓统一）
        clusters = self._cluster_entities(entities)
        self._clusters = {c.cluster_id: c for c in clusters}

        # 建立 text -> cluster 索引
        self._text_to_cluster = {}
        for c in clusters:
            for m in c.mentions:
                self._text_to_cluster[m["text"]] = c.cluster_id

        # 第二步：为每个 cluster 预生成 token/replace（保证同一主体一致）
        for cluster in clusters:
            mode = self.get_rule(cluster.entity_type)
            if mode in (RedactionMode.REPLACE, RedactionMode.TOKENIZE):
                cluster.redacted = self._generate_for_cluster(cluster, mode)
            elif mode == RedactionMode.FULL_MASK:
                cluster.redacted = self._full_mask(cluster.canonical_text)
            elif mode == RedactionMode.MASK:
                cluster.redacted = self._mask(cluster.canonical_text, cluster.entity_type)
            elif mode == RedactionMode.PARTIAL_MASK:
                cluster.redacted = self._partial_mask(cluster.canonical_text, cluster.entity_type)
            else:
                cluster.redacted = cluster.canonical_text

        # 第三步：解析 party_alias 归属
        entities = self._resolve_party_aliases(entities, clusters)

        # 第四步：生成映射
        mappings = []
        for entity in entities:
            entity_type = getattr(entity, 'entity_type', '')
            entity_id = getattr(entity, 'entity_id', '')
            original = getattr(entity, 'text', '')
            start = getattr(entity, 'start', 0)
            end = getattr(entity, 'end', 0)
            page = getattr(entity, 'page_number', None)
            confidence = getattr(entity, 'confidence', 0.0)
            cluster_id = getattr(entity, 'cluster_id', None)
            alias_of = getattr(entity, 'alias_of', None)

            mode = self.get_rule(entity_type)

            # 如果实体属于 cluster 且 cluster 已预生成 redacted，优先使用
            if cluster_id and cluster_id in self._clusters:
                cluster = self._clusters[cluster_id]
                redacted = cluster.redacted
            else:
                redacted = self.apply(entity)

            mappings.append(RedactionMapping(
                entity_id=entity_id,
                entity_type=entity_type,
                original=original,
                redacted=redacted,
                mode=mode,
                start=start,
                end=end,
                page_number=page,
                confidence=confidence,
                cluster_id=cluster_id,
                alias_of=alias_of,
            ))

        return mappings

    def _cluster_entities(self, entities: List[Any]) -> List[EntityCluster]:
        """
        对可聚类实体（公司名、人名等）进行聚类。

        规则：
        1. 同一文本 = 同一 cluster
        2. 文本互相包含（简称 vs 全称）= 同一 cluster
        3. 去除无意义的前后缀后相同 = 同一 cluster
        """
        clusterable_types = {"company_name", "person_name"}
        clusterable = [e for e in entities
                       if getattr(e, 'entity_type', '') in clusterable_types]

        clusters: List[EntityCluster] = []

        for e in clusterable:
            etype = getattr(e, 'entity_type', '')
            text = getattr(e, 'text', '')
            start = getattr(e, 'start', 0)
            end = getattr(e, 'end', 0)
            page = getattr(e, 'page_number', None)
            eid = getattr(e, 'entity_id', '')

            # 尝试合并到已有 cluster
            merged = False
            for c in clusters:
                if c.entity_type != etype:
                    continue
                if self._same_cluster(c.canonical_text, text):
                    c.mentions.append({
                        "text": text,
                        "entity_id": eid,
                        "start": start,
                        "end": end,
                        "page_number": page,
                    })
                    # canonical 取最长文本
                    if len(text) > len(c.canonical_text):
                        c.canonical_text = text
                    merged = True
                    break

            if not merged:
                cid = f"{etype}_cluster_{len(clusters) + 1:03d}"
                clusters.append(EntityCluster(
                    cluster_id=cid,
                    canonical_text=text,
                    entity_type=etype,
                    mentions=[{
                        "text": text,
                        "entity_id": eid,
                        "start": start,
                        "end": end,
                        "page_number": page,
                    }],
                ))

        # 为每个 cluster 的 mention 设置 cluster_id
        for c in clusters:
            for m in c.mentions:
                # 找到对应实体并设置 cluster_id
                for e in entities:
                    if getattr(e, 'entity_id', '') == m["entity_id"]:
                        e.cluster_id = c.cluster_id
                        break

        return clusters

    def _same_cluster(self, text1: str, text2: str) -> bool:
        """判断两个文本是否属于同一主体"""
        if text1 == text2:
            return True

        t1 = self._normalize_name(text1)
        t2 = self._normalize_name(text2)
        if not t1 or not t2:
            return False

        # 互相包含
        if t1 in t2 or t2 in t1:
            return True

        # 核心名称相同（去除地域、组织形式后）
        core1 = self._extract_core_name(t1)
        core2 = self._extract_core_name(t2)
        if core1 and core2 and (core1 == core2 or core1 in core2 or core2 in core1):
            return True

        return False

    def _normalize_name(self, text: str) -> str:
        """规范化名称用于比较"""
        text = text.strip()
        # 去除角色前缀
        prefixes = ["被告", "原告", "第三人", "上诉人", "被上诉人",
                    "申请人", "被申请人", "甲方", "乙方", "丙方", "丁方"]
        for p in prefixes:
            if text.startswith(p + "：") or text.startswith(p + ":"):
                text = text[len(p) + 1:]
            elif text.startswith(p):
                text = text[len(p):]
        return text.strip()

    def _extract_core_name(self, text: str) -> str:
        """提取名称核心部分（去除地域和组织形式）"""
        # 地域前缀
        regions = ["北京", "上海", "深圳", "广州", "杭州", "南京", "成都", "武汉",
                   "天津", "重庆", "苏州", "西安", "长沙", "郑州", "青岛", "厦门",
                   "合肥", "宁波", "无锡", "大连", "济南", "福州", "昆明", "沈阳"]
        for r in regions:
            if text.startswith(r):
                text = text[len(r):]
                break

        # 组织形式后缀
        org_forms = ["有限公司", "有限责任公司", "股份有限公司", "股份公司",
                     "集团有限公司", "集团公司", "集团", "合伙企业", "有限合伙企业",
                     "事务所", "中心", "研究院", "研究所", "公司", "企业"]
        for of in sorted(org_forms, key=len, reverse=True):
            if text.endswith(of):
                text = text[:-len(of)]
                break

        return text.strip()

    def _resolve_party_aliases(self, entities: List[Any],
                               clusters: List[EntityCluster]) -> List[Any]:
        """
        将 party_alias 归属到对应的 cluster。

        策略：
        1. 优先解析合同中的角色定义（甲方：xxx公司 / 乙方：xxx公司）
        2. 通用代词（该公司/其）按距离关联到最近的公司 cluster
        """
        if not clusters:
            return entities

        company_clusters = [c for c in clusters if c.entity_type == "company_name"]

        # 第一步：解析角色定义（甲方/乙方 → 具体公司）
        role_definitions = self._extract_role_definitions(entities, company_clusters)

        for e in entities:
            if getattr(e, 'entity_type', '') != "party_alias":
                continue

            text = getattr(e, 'text', '')
            start = getattr(e, 'start', 0)
            eid = getattr(e, 'entity_id', '')

            target_cluster = None

            # 角色词：优先使用定义映射
            if text in role_definitions:
                target_cluster = role_definitions[text]

            # 如果没有定义，按距离找最近的公司 cluster
            if not target_cluster:
                target_cluster = self._find_nearest_cluster(
                    start, company_clusters, window=200
                )

            if target_cluster:
                e.cluster_id = target_cluster.cluster_id
                e.alias_of = target_cluster.cluster_id
                target_cluster.mentions.append({
                    "text": text,
                    "entity_id": eid,
                    "start": start,
                    "end": getattr(e, 'end', 0),
                    "page_number": getattr(e, 'page_number', None),
                })

        return entities

    def _extract_role_definitions(self, entities: List[Any],
                                  company_clusters: List[EntityCluster]) -> Dict[str, EntityCluster]:
        """
        从文本中提取角色定义：甲方：xxx公司 / 乙方：xxx公司。

        返回：{role_text: EntityCluster}
        """
        role_pattern = re.compile(
            r"(甲方|乙方|丙方|丁方|出卖人|买受人|出租人|承租人|"
            r"转让方|受让方|委托人|受托人)[：:]\s*([^，。；\n]{2,40})"
        )

        definitions: Dict[str, EntityCluster] = {}

        # 收集所有 company_name 实体的位置
        company_positions = []
        for c in company_clusters:
            for m in c.mentions:
                if m.get("entity_id", "").startswith("company_name"):
                    company_positions.append((m["start"], m["end"], c))

        for e in entities:
            if getattr(e, 'entity_type', '') != "party_alias":
                continue
            text = getattr(e, 'text', '')
            start = getattr(e, 'start', 0)
            end = getattr(e, 'end', 0)

            # 在 role_alias 后查找紧跟的公司名
            search_window = end + 80
            # 找到该 alias 后最近的公司名实体
            nearest = None
            nearest_dist = float("inf")
            for cs, ce, c in company_positions:
                if cs >= end and cs <= search_window:
                    dist = cs - end
                    if dist < nearest_dist:
                        nearest = c
                        nearest_dist = dist

            if nearest:
                definitions[text] = nearest

        return definitions

    def _find_nearest_cluster(self, position: int,
                              clusters: List[EntityCluster],
                              window: int = 200) -> Optional[EntityCluster]:
        """在 position 附近 window 范围内找到最近的 cluster"""
        best = None
        best_dist = float("inf")

        for c in clusters:
            for m in c.mentions:
                mid = (m["start"] + m["end"]) // 2
                dist = abs(mid - position)
                if dist <= window and dist < best_dist:
                    best = c
                    best_dist = dist

        return best

    def _generate_for_cluster(self, cluster: EntityCluster,
                              mode: RedactionMode) -> str:
        """为 cluster 生成统一的脱敏文本"""
        if mode == RedactionMode.TOKENIZE:
            return self._tokenize(cluster.canonical_text, cluster.entity_type, cluster.cluster_id)
        if mode == RedactionMode.REPLACE:
            return self._replace(cluster.canonical_text, cluster.entity_type, cluster.cluster_id)
        return self._full_mask(cluster.canonical_text)

    # --- 脱敏方法 ---

    def _full_mask(self, text: str) -> str:
        """完全遮盖"""
        return "█" * min(len(text), 20)

    def _partial_mask(self, text: str, entity_type: str) -> str:
        """部分遮盖"""
        if entity_type == "phone_number" and len(text) >= 11:
            return text[:3] + "****" + text[-4:]
        if entity_type == "id_number" and len(text) >= 18:
            return text[:6] + "********" + text[-4:]
        if entity_type == "address":
            # 只保留到城市级别
            return text[:min(10, len(text) // 3)] + "..."
        if entity_type == "email":
            parts = text.split("@")
            if len(parts) == 2:
                local = parts[0]
                if len(local) > 2:
                    return local[0] + "***" + local[-1] + "@" + parts[1]
        if len(text) > 4:
            return text[:2] + "****" + text[-2:]
        return "****"

    def _mask(self, text: str, entity_type: str) -> str:
        """掩码替换"""
        if entity_type == "person_name" and len(text) >= 2:
            return text[0] + "某" + (text[2:] if len(text) > 2 else "")
        if entity_type in ("company_name", "party_alias"):
            return "某" + text[-4:] if len(text) > 4 else "某公司"
        if entity_type == "license_plate":
            return text[:2] + "·" + "****"
        return self._partial_mask(text, entity_type)

    def _replace(self, text: str, entity_type: str,
                 cluster_id: Optional[str] = None) -> str:
        """
        智能角色替换（支持 cluster 级一致）。

        原则：不可识别 + 语义关联。
        - 公司名保留地域/行业结构，替换核心名称
        - 人名保留姓氏，替换名字
        """
        # cluster 级缓存
        if cluster_id and cluster_id in self._replace_pool:
            return self._replace_pool[cluster_id]

        # 文本级缓存（兼容未聚类场景）
        if text in self._replace_pool:
            return self._replace_pool[text]

        if entity_type in ("company_name", "party_alias"):
            result = self._smart_company_replace(text)
        elif entity_type == "person_name":
            result = self._smart_person_replace(text)
        else:
            templates = self._replace_templates.get(entity_type, [])
            if not templates:
                result = "[已脱敏]"
            else:
                count = self._counters.get(entity_type, 0)
                result = templates[count % len(templates)]
                self._counters[entity_type] = count + 1

        # 保存映射（cluster 级优先）
        if cluster_id:
            self._replace_pool[cluster_id] = result
        self._replace_pool[text] = result
        return result

    def _smart_company_replace(self, text: str) -> str:
        """
        智能公司名替换。

        保留结构：地域 + 核心名 + 行业 + 组织形式
        替换核心名：保留末尾线索，首字替换为"某"，兼顾可读性与不可识别性。

        示例：
        北京小米科技有限公司 → 北京某米科技有限公司
        深圳市腾讯计算机系统有限公司 → 深圳某讯计算机系统有限公司
        腾讯科技（深圳）有限公司 → 某讯科技（深圳）有限公司
        """
        # 地域前缀
        region_prefixes = [
            "北京", "上海", "深圳", "广州", "杭州", "南京", "成都", "武汉",
            "天津", "重庆", "苏州", "西安", "长沙", "郑州", "青岛", "厦门",
            "合肥", "宁波", "无锡", "大连", "济南", "福州", "昆明", "沈阳",
            "哈尔滨", "长春", "石家庄", "太原", "南昌", "贵阳", "南宁", "兰州",
            "海口", "银川", "西宁", "拉萨", "乌鲁木齐", "呼和浩特",
        ]
        # 行业后缀
        industry_suffixes = [
            "科技", "信息", "网络", "软件", "互联网", "电子商务", "电子",
            "文化", "传媒", "广告", "影视", "娱乐", "体育",
            "咨询", "顾问", "智库", "研究",
            "贸易", "商贸", "商业", "零售", "批发", "进出口",
            "投资", "金融", "基金", "证券", "保险", "资产管理",
            "建设", "建筑", "工程", "设计", "装饰", "地产", "房地产",
            "制造", "实业", "工业", "生产",
            "教育", "培训", "学校", "学园",
            "医疗", "医药", "健康", "生物",
            "餐饮", "酒店", "旅游", "物流", "运输", "仓储",
            "农业", "林业", "渔业", "牧业",
            "能源", "环保", "新材料", "新能源",
        ]
        # 组织形式
        org_forms = [
            "股份有限公司", "股份公司", "有限责任公司", "有限公司",
            "集团有限公司", "集团公司", "集团", "合伙企业", "有限合伙企业",
            "研究所", "研究院", "中心", "事务所", "公司", "企业",
        ]

        # 提取组织形式
        org_form = ""
        for of in sorted(org_forms, key=len, reverse=True):
            if text.endswith(of):
                org_form = of
                text = text[:-len(of)]
                break

        # 提取地域前缀
        region = ""
        for rp in sorted(region_prefixes, key=len, reverse=True):
            if text.startswith(rp):
                region = rp
                text = text[len(rp):]
                break

        # 提取行业后缀
        industry = ""
        for ind in sorted(industry_suffixes, key=len, reverse=True):
            if text.endswith(ind):
                industry = ind
                text = text[:-len(ind)]
                break

        # 括号内的地域（如（深圳））
        bracket_region = ""
        if text.startswith("（") and "）" in text:
            end = text.index("）")
            bracket_region = text[:end + 1]
            text = text[end + 1:]
        elif text.startswith("(") and ")" in text:
            end = text.index(")")
            bracket_region = text[:end + 1]
            text = text[end + 1:]

        # 剩下的就是核心名称
        core_name = text.strip()

        # 替换核心名称：首字替换为"某"，保留其余部分作为线索
        if core_name:
            replaced_core = self._mask_company_core(core_name)
        else:
            replaced_core = "替代"

        # 重新组装
        result = region + replaced_core + industry + bracket_region + org_form
        return result if result else "某公司"

    def _mask_company_core(self, core: str) -> str:
        """掩码替换公司核心名：首字替换为'某'，保留后续字符作为辨识度线索。"""
        if not core:
            return "替代"
        # 单字核心名直接替换为"某"
        if len(core) == 1:
            return "某"
        # 英文/数字开头：保留第一个字符后的内容，首字符替换为 X
        if core[0].isascii() and not core[0].isalpha():
            # 以符号/数字开头，直接对第一个有效字符做处理较复杂，简单整体掩码
            return "某" + core[1:]
        return "某" + core[1:]

        result = []
        for ch in core:
            if ch in char_map:
                result.append(char_map[ch])
            else:
                # 没有映射的字保持原样
                result.append(ch)
        return "".join(result) if result else "替代"

    def _smart_person_replace(self, text: str) -> str:
        """
        智能人名替换。

        保留姓氏，替换名字为形近字或"某"。

        示例：张三 → 张叁, 李四 → 李肆, 王五 → 王某
        """
        if len(text) == 2:
            # 两个字：姓 + 名
            surname = text[0]
            name = text[1]
            name_map = {
                "一": "壹", "二": "贰", "三": "叁", "四": "肆", "五": "伍",
                "六": "陆", "七": "柒", "八": "捌", "九": "玖", "十": "拾",
                "明": "亮", "亮": "明",
                "伟": "炜", "强": "疆", "军": "君", "磊": "垒",
                "静": "净", "敏": "敏", "丽": "莉", "娜": "那",
                "涛": "滔", "波": "泊", "鹏": "朋", "飞": "非",
                "芳": "方", "秀": "绣", "玲": "铃", "红": "虹",
                "建国": "建业", "建军": "建民",
            }
            if name in name_map:
                return surname + name_map[name]
            return surname + "某"

        if len(text) == 3:
            # 三个字：复姓 或 单姓 + 双名
            compound_surnames = ["欧阳", "司马", "上官", "诸葛", "东方", "皇甫", "令狐"]
            for cs in compound_surnames:
                if text.startswith(cs):
                    return cs + "某某"
            # 单姓 + 双名
            return text[0] + "某某"

        if len(text) >= 4:
            # 四个字以上：可能是外国人名或复姓+双名
            return text[:2] + "某某"

        return text[0] + "某" if text else "某人"

    def _tokenize(self, text: str, entity_type: str,
                  cluster_id: Optional[str] = None) -> str:
        """Token 替换（支持 cluster 级一致）。

        对于公司名/人名等可读性要求高的实体，生成语义化 token：
        - 公司名保留地域/行业/组织形式，核心名称首字替换为"某"
          例：北京小米科技有限公司 → 北京某米科技有限公司
        - 人名保留姓氏，名字替换为"某"或形近字
          例：张三 → 张某
        这样既能通过 mapping 唯一还原，又能让用户在阅读脱敏文本时大致辨认主体。
        """
        # cluster 级缓存
        if cluster_id and cluster_id in self._replace_pool:
            return self._replace_pool[cluster_id]

        # 文本级缓存
        if text in self._replace_pool:
            return self._replace_pool[text]

        # 语义化 token：公司/人名使用可读形式，其余类型保持传统编号 token
        if entity_type in ("company_name", "party_alias"):
            result = self._semantic_company_token(text)
        elif entity_type == "person_name":
            result = self._semantic_person_token(text)
        else:
            prefix = self._get_token_prefix(entity_type)
            count = self._counters.get(entity_type, 0) + 1
            self._counters[entity_type] = count
            result = f"{prefix}_{count:03d}"

        if cluster_id:
            self._replace_pool[cluster_id] = result
        self._replace_pool[text] = result
        return result

    def _semantic_company_token(self, text: str) -> str:
        """语义化公司 token：保留结构线索，核心名首字替换为'某'；冲突时加编号后缀。"""
        import string

        base = self._smart_company_replace(text)
        # 收集已使用的相同前缀结果
        existing_values = set(self._replace_pool.values())
        if base not in existing_values:
            return base

        # 冲突时追加 _A, _B, ... 区分不同主体
        for suffix in string.ascii_uppercase:
            candidate = f"{base}_{suffix}"
            if candidate not in existing_values:
                return candidate

        # 极端情况：fallback 到数字编号
        count = 1
        while f"{base}_{count}" in existing_values:
            count += 1
        return f"{base}_{count}"

    def _semantic_person_token(self, text: str) -> str:
        """语义化人名 token：保留姓氏，名字替换为'某'或形近字。"""
        return self._smart_person_replace(text)

    def _get_token_prefix(self, entity_type: str) -> str:
        """获取 token 前缀"""
        prefix_map = {
            "person_name": "PERSON",
            "company_name": "COMPANY",
            "party_alias": "PARTY",
            "bank_account": "BANK",
            "address": "ADDR",
            "email": "EMAIL",
            "phone_number": "PHONE",
            "id_number": "ID",
            "license_plate": "PLATE",
            "case_number": "CASE",
            "wechat_id": "WECHAT",
            "alipay_id": "ALIPAY",
            "ip_address": "IP",
        }
        return prefix_map.get(entity_type, "ENTITY")

    def _init_replace_templates(self) -> Dict[str, List[str]]:
        """初始化角色替换模板"""
        return {
            "person_name": ["当事人甲", "当事人乙", "当事人丙", "当事人丁", "当事人戊"],
            "company_name": ["A公司", "B公司", "C公司", "D公司", "E公司"],
            "party_alias": ["甲方", "乙方", "丙方", "丁方"],
            "lawyer_name": ["代理律师甲", "代理律师乙", "代理律师丙"],
            "judge_name": ["审判员甲", "审判员乙", "审判员丙"],
            "court_name": ["某基层法院", "某中级法院", "某高级法院"],
            "address": ["某市某区某街道", "某市某区某路"],
        }

    def get_mapping_table(self) -> Dict[str, str]:
        """获取替换/Token 映射表（用于 reversible 恢复）"""
        return self._replace_pool.copy()

    def get_cluster_table(self) -> List[Dict[str, Any]]:
        """获取实体聚类表（用于还原和理解）"""
        return [
            {
                "cluster_id": c.cluster_id,
                "canonical": c.canonical_text,
                "entity_type": c.entity_type,
                "redacted": c.redacted,
                "mentions": [m["text"] for m in c.mentions],
            }
            for c in self._clusters.values()
        ]

    def get_review_items(self, mappings: List[RedactionMapping]) -> List[RedactionMapping]:
        """获取需要人工复核的项"""
        return [m for m in mappings if m.mode == RedactionMode.CONFIGURABLE]
