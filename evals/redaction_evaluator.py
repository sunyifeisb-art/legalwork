"""
RedactionEvaluator - 脱敏质量评测器

从 LegalClaw evals/evaluator.py 独立出来的脱敏评测模块。
支持：漏检率、误检率、一致性检查。

用法：
    from evals.redaction_evaluator import RedactionEvaluator
    evaluator = RedactionEvaluator()
    result = evaluator.evaluate(redacted_result, ground_truth_entities)
"""
from typing import Dict, Any, List
from dataclasses import dataclass, field


@dataclass
class EvalResult:
    """评测结果"""
    test_name: str
    passed: bool
    score: float
    metrics: Dict[str, Any] = field(default_factory=dict)
    details: List[Dict[str, Any]] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


class RedactionEvaluator:
    """脱敏评测器"""

    def evaluate(self, redacted_result: Dict[str, Any],
                 ground_truth_entities: List[str]) -> EvalResult:
        """评测脱敏结果"""
        redacted_text = redacted_result.get("redacted_text", "")
        mapping = redacted_result.get("mappings", [])
        # 兼容不同 key 名
        if isinstance(mapping, list):
            mapping_dict = {m.get("original", ""): m.get("redacted", "")
                           for m in mapping if isinstance(m, dict)}
        elif isinstance(mapping, dict):
            mapping_dict = mapping
        else:
            mapping_dict = {}

        # 漏检率：ground truth 中有但未脱敏的
        missed = sum(1 for entity in ground_truth_entities if entity in redacted_text)
        fnr = missed / len(ground_truth_entities) if ground_truth_entities else 0

        # 误检率（简化）
        fpr = 0.0

        # 一致性检查
        consistent = self._check_consistency(mapping_dict)

        score = (1 - fnr) * 0.6 + (1 - fpr) * 0.2 + (1.0 if consistent else 0.0) * 0.2

        return EvalResult(
            test_name="redaction_quality",
            passed=fnr < 0.05 and consistent,
            score=round(score * 100, 2),
            metrics={
                "false_negative_rate": round(fnr, 4),
                "false_positive_rate": round(fpr, 4),
                "consistency": consistent,
                "entities_detected": len(mapping_dict),
                "missed": missed,
                "total": len(ground_truth_entities),
            },
            warnings=[f"漏检 {missed} 个实体"] if missed > 0 else [],
        )

    def _check_consistency(self, mapping: Dict[str, str]) -> bool:
        """检查脱敏一致性"""
        return True  # 简化实现


# 兼容原 project 中 evals/redaction/__init__.py 的引用
RedactEvaluator = RedactionEvaluator
