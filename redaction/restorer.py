"""
Redaction Restorer - 脱敏反向还原器

职责：
1. 读取脱敏时生成的 mapping 文件
2. 将脱敏后的文本（包括 AI 二次分析生成的带代词文本）还原为原始名称
3. 支持基于 cluster 的还原：同一主体的不同代词/简称都能正确还原

使用场景：
- 用户拿到 AI 基于脱敏材料生成的大事记/分析报告（含 COMPANY_001、甲方等代词）
- 需要将最终成果还原为原始名称
"""

import json
import base64
import re
from pathlib import Path
from typing import Dict, Any, List, Optional


class RedactionRestorer:
    """脱敏反向还原器"""

    def __init__(self, mapping_path: Optional[str] = None):
        self.mappings: List[Dict[str, Any]] = []
        self.clusters: List[Dict[str, Any]] = []
        self.version: str = "0.2"

        # 还原索引
        self._redacted_to_original: Dict[str, str] = {}
        self._cluster_redacted_to_canonical: Dict[str, str] = {}
        self._cluster_aliases: Dict[str, List[str]] = {}
        self._redacted_to_cluster: Dict[str, str] = {}

        if mapping_path:
            self.load_mapping(mapping_path)

    def load_mapping(self, mapping_path: str) -> bool:
        """加载映射文件"""
        path = Path(mapping_path)
        if not path.exists():
            return False

        try:
            content = path.read_text(encoding="utf-8")

            # 尝试 base64 解码（兼容加密格式）
            try:
                decoded = base64.b64decode(content)
                content = decoded.decode("utf-8")
            except Exception:
                pass

            data = json.loads(content)

            # 兼容旧版格式（直接是 mappings 列表）
            if isinstance(data, list):
                self.mappings = data
                self.clusters = []
                self.version = "0.2"
            else:
                self.mappings = data.get("mappings", [])
                self.clusters = data.get("clusters", [])
                self.version = data.get("version", "0.3")

            self._build_indexes()
            return True
        except Exception as e:
            print(f"[RedactionRestorer] 加载映射文件失败: {e}")
            return False

    def _build_indexes(self) -> None:
        """构建还原索引"""
        self._redacted_to_original = {}
        self._cluster_redacted_to_canonical = {}
        self._cluster_aliases = {}
        self._redacted_to_cluster = {}

        # 1. 从 mappings 构建 redacted -> original 索引
        for m in self.mappings:
            original = m.get("original", "")
            redacted = m.get("redacted", "")
            cluster_id = m.get("cluster_id")
            entity_type = m.get("entity_type", "")

            if not original or not redacted:
                continue

            # 简单直接的映射（优先用 cluster 级 canonical）
            self._redacted_to_original[redacted] = original
            if cluster_id:
                self._redacted_to_cluster[redacted] = cluster_id

        # 2. 从 clusters 构建 cluster 级还原
        for c in self.clusters:
            cluster_id = c.get("cluster_id", "")
            canonical = c.get("canonical", "")
            redacted = c.get("redacted", "")
            mentions = c.get("mentions", [])

            if not cluster_id or not canonical:
                continue

            self._cluster_redacted_to_canonical[redacted] = canonical
            self._cluster_aliases[cluster_id] = [m for m in mentions if m != canonical]

            # cluster 的 redacted 也指向 canonical
            if redacted:
                self._redacted_to_original[redacted] = canonical
                self._redacted_to_cluster[redacted] = cluster_id

        # 3. 为每个 cluster 的 mention 建立映射：mention_text -> canonical
        #    这样 AI 若直接输出"甲方""该公司""小米"等代词/简称，也能还原为 canonical 主体
        for c in self.clusters:
            canonical = c.get("canonical", "")
            cluster_id = c.get("cluster_id", "")
            mentions = c.get("mentions", [])
            if not canonical or not cluster_id:
                continue

            for mention in mentions:
                if not mention or mention == canonical:
                    continue
                if mention not in self._redacted_to_original:
                    self._redacted_to_original[mention] = canonical
                    self._redacted_to_cluster[mention] = cluster_id

    def _get_canonical_by_cluster(self, cluster_id: str) -> Optional[str]:
        """根据 cluster_id 获取 canonical 名称"""
        for c in self.clusters:
            if c.get("cluster_id") == cluster_id:
                return c.get("canonical", "")
        return None

    def restore_text(self, text: str,
                     fallback_to_cluster: bool = True,
                     missing_marker: Optional[str] = None) -> Dict[str, Any]:
        """
        将脱敏后的文本还原为原始文本。

        Args:
            text: 脱敏后的文本（可包含 COMPANY_001、A公司、甲方 等）
            fallback_to_cluster: 是否允许基于 cluster 推断还原
            missing_marker: 未匹配时的占位符（默认保留原样）

        Returns:
            {
                "success": bool,
                "restored_text": str,
                "replacements": list,
                "unmatched": list,
            }
        """
        if not self.mappings:
            return {
                "success": False,
                "error": "未加载映射文件",
                "restored_text": text,
                "replacements": [],
                "unmatched": [],
            }

        replacements = []
        unmatched = []

        # 策略：
        # 1. 优先按最长 redacted 字符串匹配（避免短 token 覆盖长 token）
        # 2. 如果 redacted 是 token（如 COMPANY_001），直接替换
        # 3. 如果是 replace 模式结果（如 A公司），也按映射替换
        # 4. 对于 party_alias（甲方/该公司/其），如果它在 cluster 中，替换为 canonical

        # 收集所有可还原的 redacted 文本，按长度降序
        candidates = sorted(self._redacted_to_original.keys(), key=len, reverse=True)

        # 使用占位符避免重复替换
        placeholders = {}
        placeholder_counter = [0]

        def make_placeholder():
            placeholder_counter[0] += 1
            return f"RESTORE_{placeholder_counter[0]:06d}"

        restored = text

        for redacted in candidates:
            original = self._redacted_to_original[redacted]
            if not original or redacted == original:
                continue

            # 使用非贪婪边界感知的替换
            pattern = re.escape(redacted)
            found = False

            def replacer(match):
                nonlocal found
                found = True
                ph = make_placeholder()
                placeholders[ph] = original
                return ph

            new_restored = re.sub(pattern, replacer, restored)
            if found:
                restored = new_restored
                replacements.append({
                    "redacted": redacted,
                    "original": original,
                })

        # 处理 cluster 级 alias 还原
        # 例如 AI 输出的文本中可能出现 cluster 的某个 mention 但未在 mapping 中直接出现
        if fallback_to_cluster and self.clusters:
            for c in self.clusters:
                canonical = c.get("canonical", "")
                cluster_redacted = c.get("redacted", "")
                cluster_id = c.get("cluster_id", "")
                mentions = c.get("mentions", [])

                if not canonical or not cluster_id:
                    continue

                # 将 cluster 的 redacted 形式替换为 canonical
                if cluster_redacted and cluster_redacted != canonical:
                    pattern = re.escape(cluster_redacted)
                    if pattern in restored or re.search(pattern, restored):
                        ph = make_placeholder()
                        placeholders[ph] = canonical
                        restored = re.sub(pattern, ph, restored)
                        replacements.append({
                            "redacted": cluster_redacted,
                            "original": canonical,
                        })

        # 还原占位符
        for ph, original in placeholders.items():
            restored = restored.replace(ph, original)

        # 统计未匹配（可选：查找仍存在的 token 模式）
        token_pattern = re.compile(r"\b(COMPANY|PERSON|PARTY|BANK|ADDR|EMAIL|PHONE|ID|PLATE|CASE|WECHAT|ALIPAY|IP)_\d{3}\b")
        for match in token_pattern.finditer(restored):
            unmatched.append(match.group())

        return {
            "success": True,
            "restored_text": restored,
            "replacements": replacements,
            "unmatched": list(set(unmatched)),
        }

    def restore_file(self, input_path: str, output_path: Optional[str] = None,
                     missing_marker: Optional[str] = None) -> Dict[str, Any]:
        """还原文件内容"""
        path = Path(input_path)
        if not path.exists():
            return {"success": False, "error": f"文件不存在: {input_path}"}

        try:
            text = path.read_text(encoding="utf-8")
        except Exception as e:
            return {"success": False, "error": f"读取文件失败: {e}"}

        result = self.restore_text(text, missing_marker=missing_marker)
        if not result.get("success"):
            return result

        if output_path:
            out = Path(output_path)
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(result["restored_text"], encoding="utf-8")
            result["output_path"] = str(out)

        result["input_path"] = str(path)
        return result

    def get_cluster_info(self) -> List[Dict[str, Any]]:
        """获取聚类信息"""
        return self.clusters

    def get_mapping_summary(self) -> Dict[str, Any]:
        """获取映射摘要"""
        return {
            "version": self.version,
            "mapping_count": len(self.mappings),
            "cluster_count": len(self.clusters),
            "restorable_tokens": list(self._redacted_to_original.keys())[:20],
        }
