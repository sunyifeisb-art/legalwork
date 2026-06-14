"""
Legal Entity Extractor - 法律实体提取

从法律文档中自动提取关键实体：
- 当事人 (party): 甲方、乙方、公司名称、自然人姓名
- 金额 (amount): 合同金额、违约金、赔偿金额
- 期限 (term): 履行期限、有效期、宽限期
- 标的 (subject): 合同标的描述
- 日期 (date): 签署日期、生效日期、到期日期
- 比例/百分比 (ratio): 违约金比例、股权比例
- 地点 (location): 履行地点、管辖法院所在地

提取方式：
1. 规则匹配（正则）- 快速、确定性高
2. LLM 补充提取 - 处理复杂表述

输出：LegalEntity 列表，包含实体类型、文本、规范化值、位置
"""

import re
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class LegalEntity:
    """法律实体"""
    entity_id: str
    type: str  # party | amount | term | subject | date | ratio | location | other
    text: str  # 原始文本
    normalized: str  # 规范化值
    unit: str = ""  # 单位（金额、期限等）
    confidence: float = 0.0
    source_chunk_id: str = ""
    position: Dict[str, Any] = field(default_factory=dict)  # {start, end, page}
    attributes: Dict[str, Any] = field(default_factory=dict)  # 额外属性


class LegalEntityExtractor:
    """法律实体提取器"""

    # 金额模式（排除身份证号、电话号码等）
    AMOUNT_PATTERN = re.compile(
        r'(?:人民币|￥|¥|RMB|USD|\$|EUR|€)\s*'
        r'([\d,\.]+)\s*'
        r'(万元|亿元|元|万美元|欧元|万| thousand| million| billion)?'
    )
    AMOUNT_KEYWORDS = re.compile(
        r'(合同金额|总价款|报酬|费用|违约金|赔偿金|定金|预付款|尾款|标的额|律师费|诉讼费)'
    )

    # 日期模式
    DATE_PATTERN = re.compile(
        r'(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?|'
        r'(\d{4})[-/](\d{1,2})[-/](\d{1,2})|'
        r'(自|于|在)\s*(\d{4})\s*年\s*(\d{1,2})\s*月'
    )
    DATE_KEYWORDS = re.compile(
        r'(签署日期|签订日期|生效日期|到期日期|终止日期|履行期限|有效期|宽限期|起算日|届满日)'
    )

    # 期限模式
    TERM_PATTERN = re.compile(
        r'(\d+)\s*(年|个月|月|日|天|个工作日|工作日|周|星期)'
    )
    TERM_KEYWORDS = re.compile(
        r'(期限为|有效期为|履行期为|租赁期为|承包期为|保修期为|质保期为|合作期为)'
    )

    # 比例模式
    RATIO_PATTERN = re.compile(
        r'(\d+(?:\.\d+)?)\s*%|百分之([\d一二三四五六七八九十百千零]+)'
    )
    RATIO_KEYWORDS = re.compile(
        r'(违约金比例|违约金为|违约金按|年利率|月利率|日利率|利率|股权比例|持股比例|出资比例)'
    )

    # 当事人模式
    PARTY_PATTERN = re.compile(
        r'(甲方|乙方|丙方|丁方|出卖人|买受人|出租人|承租人|委托人|受托人|发包人|承包人|'
        r'转让方|受让方|债权人|债务人|保证人|被保证人|抵押权人|抵押人|出质人|质权人|'
        r'寄售人|代销人|保险人|投保人|被保险人|受益人)'
    )
    # 公司名称（主体部分避开常见动词/介词/连接词/标点，防止跨过“起诉”“与”“。”等把多个主体连成一片）
    COMPANY_PATTERN = re.compile(
        r'([^，。；、\n 起被将因就由于自至在对向和及同诉控告上诉位于地处作为系属于甲乙丙丁方之]{2,20}'
        r'(?:公司|集团|事务所|中心|研究院|学会|协会|委员会|'
        r'有限责任公司|股份有限公司|合伙企业|工作室))'
    )

    # 地点模式
    LOCATION_PATTERN = re.compile(
        r'(北京市|上海市|广州市|深圳市|杭州市|南京市|成都市|武汉市|西安市|重庆市|'
        r'天津市|苏州市|长沙市|郑州市|东莞市|青岛市|宁波市|昆明市|厦门市|大连市|'
        r'沈阳市|济南市|哈尔滨市|长春市|石家庄市|太原市|合肥市|南昌市|福州市|'
        r'南宁市|贵阳市|兰州市|海口市|银川市|西宁市|拉萨市|乌鲁木齐市|呼和浩特市)'
    )
    COURT_PATTERN = re.compile(
        r'([一-鿿]+(?:人民法院|人民检察院|仲裁委员会|公证处))'
    )

    def __init__(self, model_router: Optional[Any] = None):
        self.model_router = model_router

    def extract(self, text: str, chunk_id: str = "",
                use_llm: bool = True) -> List[LegalEntity]:
        """
        从文本中提取法律实体。

        Args:
            text: 文本内容
            chunk_id: 来源 chunk ID
            use_llm: 是否使用 LLM 补充提取

        Returns:
            LegalEntity 列表
        """
        entities = []

        # 1. 规则提取
        entities.extend(self._extract_amounts(text, chunk_id))
        entities.extend(self._extract_dates(text, chunk_id))
        entities.extend(self._extract_terms(text, chunk_id))
        entities.extend(self._extract_ratios(text, chunk_id))
        entities.extend(self._extract_parties(text, chunk_id))
        entities.extend(self._extract_locations(text, chunk_id))

        # 去重
        entities = self._deduplicate(entities)

        # 2. LLM 补充提取
        if use_llm and self.model_router and len(text) > 50:
            llm_entities = self._extract_by_llm(text, chunk_id)
            entities = self._merge_with_llm(entities, llm_entities)

        return entities

    def _extract_amounts(self, text: str, chunk_id: str) -> List[LegalEntity]:
        """提取金额"""
        entities = []
        for m in self.AMOUNT_PATTERN.finditer(text):
            amount_str = m.group(1).replace(',', '')
            try:
                amount = float(amount_str)
            except ValueError:
                continue

            unit = m.group(2) or "元"
            normalized = f"{amount}{unit}"

            # 判断金额类型
            context = text[max(0, m.start()-20):m.start()]
            amount_type = "金额"
            if self.AMOUNT_KEYWORDS.search(context):
                kw = self.AMOUNT_KEYWORDS.search(context).group(1)
                amount_type = kw

            entities.append(LegalEntity(
                entity_id=f"e{len(entities):04d}",
                type="amount",
                text=m.group(0),
                normalized=normalized,
                unit=unit,
                confidence=0.9,
                source_chunk_id=chunk_id,
                position={"start": m.start(), "end": m.end()},
                attributes={"amount_type": amount_type, "numeric_value": amount},
            ))
        return entities

    def _extract_dates(self, text: str, chunk_id: str) -> List[LegalEntity]:
        """提取日期"""
        entities = []
        for m in self.DATE_PATTERN.finditer(text):
            # 提取年月日
            groups = m.groups()
            year = groups[0] or groups[3] or groups[6]
            month = groups[1] or groups[4] or groups[7]
            day = groups[2] or groups[5] or ""

            if not year:
                continue

            normalized = f"{year}年"
            if month:
                normalized += f"{month}月"
            if day:
                normalized += f"{day}日"

            # 判断日期类型
            context = text[max(0, m.start()-30):m.start()]
            date_type = "日期"
            kw_match = self.DATE_KEYWORDS.search(context)
            if kw_match:
                date_type = kw_match.group(1)

            entities.append(LegalEntity(
                entity_id=f"e{len(entities):04d}",
                type="date",
                text=m.group(0),
                normalized=normalized,
                confidence=0.85,
                source_chunk_id=chunk_id,
                position={"start": m.start(), "end": m.end()},
                attributes={"date_type": date_type, "year": year, "month": month, "day": day},
            ))
        return entities

    def _extract_terms(self, text: str, chunk_id: str) -> List[LegalEntity]:
        """提取期限"""
        entities = []
        for m in self.TERM_PATTERN.finditer(text):
            value = m.group(1)
            unit = m.group(2)
            normalized = f"{value}{unit}"

            # 判断期限类型
            context = text[max(0, m.start()-30):m.start()]
            term_type = "期限"
            kw_match = self.TERM_KEYWORDS.search(context)
            if kw_match:
                term_type = kw_match.group(1).replace("为", "").replace("期", "期限")

            entities.append(LegalEntity(
                entity_id=f"e{len(entities):04d}",
                type="term",
                text=m.group(0),
                normalized=normalized,
                unit=unit,
                confidence=0.85,
                source_chunk_id=chunk_id,
                position={"start": m.start(), "end": m.end()},
                attributes={"term_type": term_type, "value": value, "unit": unit},
            ))
        return entities

    def _extract_ratios(self, text: str, chunk_id: str) -> List[LegalEntity]:
        """提取比例"""
        entities = []
        for m in self.RATIO_PATTERN.finditer(text):
            ratio_value = m.group(1) or m.group(2)
            normalized = f"{ratio_value}%"

            # 判断比例类型
            context = text[max(0, m.start()-30):m.start()]
            ratio_type = "比例"
            kw_match = self.RATIO_KEYWORDS.search(context)
            if kw_match:
                ratio_type = kw_match.group(1)

            entities.append(LegalEntity(
                entity_id=f"e{len(entities):04d}",
                type="ratio",
                text=m.group(0),
                normalized=normalized,
                unit="%",
                confidence=0.9,
                source_chunk_id=chunk_id,
                position={"start": m.start(), "end": m.end()},
                attributes={"ratio_type": ratio_type, "value": ratio_value},
            ))
        return entities

    def _extract_parties(self, text: str, chunk_id: str) -> List[LegalEntity]:
        """提取当事人"""
        entities = []

        # 1. 合同角色标记（限制在合同头部或条款开头附近）
        for m in self.PARTY_PATTERN.finditer(text):
            role = m.group(1)
            # 尝试提取角色后的名称
            after = text[m.end():m.end()+50]
            name_match = re.search(r'[：:]\s*([^\n，。；]{2,20})', after)
            name = name_match.group(1).strip() if name_match else role

            # 过滤噪声：名称不能太短、不能是下划线、不能包含"签字"
            if len(name) < 2 or "___" in name or "签字" in name or "盖章" in name:
                continue

            entities.append(LegalEntity(
                entity_id=f"e{len(entities):04d}",
                type="party",
                text=m.group(0) if not name_match else f"{role}：{name}",
                normalized=name,
                confidence=0.8,
                source_chunk_id=chunk_id,
                position={"start": m.start(), "end": m.end() + (len(name_match.group(0)) if name_match else 0)},
                attributes={"role": role},
            ))

        # 2. 公司名称
        for m in self.COMPANY_PATTERN.finditer(text):
            matched = m.group(0)
            start = m.start()

            # 截断前导的动词/介词等噪声，避免把"起诉XX公司"整体识别为公司名
            stripped = self._strip_party_noise_prefix(matched)
            if not stripped or len(stripped) < 4:
                continue
            if stripped != matched:
                start += len(matched) - len(stripped)
                matched = stripped

            # 避免重复
            if not any(e.position.get("start") == start for e in entities):
                entities.append(LegalEntity(
                    entity_id=f"e{len(entities):04d}",
                    type="party",
                    text=matched,
                    normalized=matched,
                    confidence=0.75,
                    source_chunk_id=chunk_id,
                    position={"start": start, "end": start + len(matched)},
                    attributes={"role": "公司"},
                ))

        return entities

    def _strip_party_noise_prefix(self, text: str) -> str:
        """去除公司名称前面的动词/介词等噪声前缀。"""
        noise_prefixes = [
            "：", ":", "；", ";", "，", ",",
            "起诉", "诉", "控告", "起诉至", "上诉至", "向", "对", "与", "和", "及", "同",
            "被", "将", "因", "就", "由", "自", "至", "在", "位于", "地处",
            "作为", "为", "系", "属于",
        ]
        # 循环处理，避免多个噪声前缀叠加
        changed = True
        while changed:
            changed = False
            for prefix in sorted(noise_prefixes, key=len, reverse=True):
                if text.startswith(prefix):
                    text = text[len(prefix):]
                    changed = True
                    break
        return text

    def _extract_locations(self, text: str, chunk_id: str) -> List[LegalEntity]:
        """提取地点"""
        entities = []

        for m in self.LOCATION_PATTERN.finditer(text):
            entities.append(LegalEntity(
                entity_id=f"e{len(entities):04d}",
                type="location",
                text=m.group(0),
                normalized=m.group(1),
                confidence=0.8,
                source_chunk_id=chunk_id,
                position={"start": m.start(), "end": m.end()},
            ))

        for m in self.COURT_PATTERN.finditer(text):
            entities.append(LegalEntity(
                entity_id=f"e{len(entities):04d}",
                type="location",
                text=m.group(0),
                normalized=m.group(1),
                confidence=0.85,
                source_chunk_id=chunk_id,
                position={"start": m.start(), "end": m.end()},
                attributes={"location_type": "司法机构"},
            ))

        return entities

    def _deduplicate(self, entities: List[LegalEntity]) -> List[LegalEntity]:
        """去重：相同位置只保留置信度最高的"""
        seen = {}
        for e in entities:
            key = (e.type, e.position.get("start"), e.position.get("end"))
            if key not in seen or seen[key].confidence < e.confidence:
                seen[key] = e
        return list(seen.values())

    def _extract_by_llm(self, text: str, chunk_id: str) -> List[LegalEntity]:
        """使用 LLM 补充提取实体"""
        if not self.model_router:
            return []

        from legalclaw.models.base_adapter import ChatMessage

        prompt = f"""请从以下法律文本中提取关键实体，严格按 JSON 格式输出：

文本：
```
{text[:3000]}
```

提取以下类型的实体：
- party: 当事人名称（含甲方/乙方角色）
- amount: 金额（含类型：合同金额/违约金/赔偿金等）
- term: 期限（含类型：履行期/有效期/宽限期等）
- date: 日期（含类型：签署日/生效日/到期日等）
- ratio: 比例（含类型：违约金比例/利率/股权比例等）
- subject: 合同标的简述
- location: 地点（履行地/管辖法院等）

输出格式：
{{
  "entities": [
    {{
      "type": "party|amount|term|date|ratio|subject|location",
      "text": "原文",
      "normalized": "规范化值",
      "unit": "单位（如有）",
      "attributes": {{"key": "value"}}
    }}
  ]
}}
"""

        try:
            messages = [
                ChatMessage(role="system", content="你是一名法律信息提取专家，擅长从法律文本中提取结构化信息。"),
                ChatMessage(role="user", content=prompt),
            ]
            response = self.model_router.chat(messages=messages, temperature=0.1, max_tokens=2000)
            result = self._parse_llm_response(response.content)

            entities = []
            for i, e in enumerate(result.get("entities", [])):
                entities.append(LegalEntity(
                    entity_id=f"llm_{i:04d}",
                    type=e.get("type", "other"),
                    text=e.get("text", ""),
                    normalized=e.get("normalized", ""),
                    unit=e.get("unit", ""),
                    confidence=0.75,
                    source_chunk_id=chunk_id,
                    attributes=e.get("attributes", {}),
                ))
            return entities
        except Exception as e:
            print(f"[EntityExtractor] LLM 提取失败: {e}")
            return []

    def _parse_llm_response(self, content: str) -> Dict[str, Any]:
        """解析 LLM 返回的 JSON"""
        import json
        import re

        # 尝试提取 JSON
        if "```json" in content:
            match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
            if match:
                return json.loads(match.group(1))
        if "```" in content:
            match = re.search(r'```\s*(.*?)\s*```', content, re.DOTALL)
            if match:
                return json.loads(match.group(1))

        # 直接找 JSON 对象
        for match in re.finditer(r'\{', content):
            start = match.start()
            depth = 0
            for end, ch in enumerate(content[start:], start):
                if ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        try:
                            return json.loads(content[start:end+1])
                        except json.JSONDecodeError:
                            break
        return {}

    def _merge_with_llm(self, rule_entities: List[LegalEntity],
                        llm_entities: List[LegalEntity]) -> List[LegalEntity]:
        """合并规则提取和 LLM 提取的结果"""
        # LLM 提取的实体如果与规则提取的不重叠，则补充进来
        rule_positions = set()
        for e in rule_entities:
            pos = e.position.get("start")
            if pos is not None:
                rule_positions.add((e.type, pos))

        merged = list(rule_entities)
        for e in llm_entities:
            pos = e.position.get("start")
            if (e.type, pos) not in rule_positions:
                merged.append(e)

        return merged
