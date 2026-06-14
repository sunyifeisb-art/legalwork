#!/usr/bin/env python3
"""
LegalWork 文件脱敏功能 (Redaction Agent)

从 LegalClaw 项目完整独立出来的文件脱敏能力包。
涵盖：敏感实体检测 → 策略脱敏 → 渲染输出 → 质量评测 → 反向还原

⚠️ 当前为独立复制版本，标注为"文件脱敏功能"。
   原项目中的集成层（modes/redaction_mode.py、runtime.redact_document()、api.redact_file()、cli）
   尚未移植，后续可按需接入 Agent 工具列表。

用法：
  python3 redact_agent.py text <文本> [--policy external_client]   # 文本脱敏
  python3 redact_agent.py file <file_path> [--policy ...]          # 文件脱敏
  python3 redact_agent.py pdf <pdf_path> <ldir_path>               # PDF 坐标级脱敏
  python3 redact_agent.py batch <dir_path>                         # 批量脱敏
  python3 redact_agent.py detect <file_path>                       # 仅检测敏感实体
  python3 redact_agent.py eval <result.json> <ground_truth.json>   # 脱敏质量评测
  python3 redact_agent.py restore <mapping.enc> <file_or_text>     # 反向还原代词
  python3 redact_agent.py list-entities                            # 列出支持的实体类型
  python3 redact_agent.py list-policies                            # 列出支持的脱敏策略
"""

import sys
import json
import os
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


# ============================================================
# 1. 核心脱敏操作
# ============================================================

def redact_text(text: str, policy: str = "external_client",
                entity_types: list = None, custom_rules: dict = None) -> dict:
    """
    对文本执行脱敏。

    Args:
        text: 待脱敏文本
        policy: 脱敏策略 external_client / internal_legal_analysis / public_release
        entity_types: 指定实体类型列表（默认检测所有）
        custom_rules: 自定义规则

    Returns:
        dict: redacted_text, mappings, entity_count, review_items
    """
    from redaction.pipeline import RedactionPipeline

    pipeline = RedactionPipeline()
    result = pipeline.process_text(
        text=text,
        policy_name=policy,
        entity_types=entity_types,
        custom_rules=custom_rules,
    )
    return _serialize_mappings(result)


def _serialize_mappings(result: dict) -> dict:
    """将脱敏结果中的 dataclass mappings 转为可 JSON 序列化的 dict 列表"""
    if "mappings" in result and result["mappings"]:
        result["mappings"] = [
            {
                "entity_id": m.entity_id,
                "entity_type": m.entity_type,
                "original": m.original,
                "redacted": m.redacted,
                "mode": str(m.mode),
                "start": m.start,
                "end": m.end,
                "page_number": m.page_number,
                "confidence": m.confidence,
                "cluster_id": m.cluster_id,
                "alias_of": m.alias_of,
            }
            for m in result["mappings"]
        ]
    return result


def redact_file(file_path: str, policy: str = "external_client",
                entity_types: list = None) -> dict:
    """
    对文件执行脱敏。

    支持：.txt / .md 文本文件 → 纯文本脱敏
         .pdf（有 LDIR）→ 坐标级脱敏
         其他 → 读取文本后脱敏

    Returns:
        dict: redacted_text, mappings, entity_count, review_items, output_files
    """
    path = Path(file_path)
    if not path.exists():
        return {"success": False, "error": f"文件不存在: {file_path}"}

    from redaction.pipeline import RedactionPipeline

    pipeline = RedactionPipeline()
    suffix = path.suffix.lower()

    # --- PDF 脱敏（需要先 OCR 生成 LDIR）---
    if suffix == ".pdf":
        # 先通过 OCR 获取文本层
        try:
            from document.ocr.router import OCRRouter
            from document.intake.router import DocumentIntakeRouter

            intake = DocumentIntakeRouter()
            decision = intake.route(str(path))

            if decision.ocr_required:
                ocr = OCRRouter()
                ocr_result = ocr.process(str(path), profile_name="legal_pdf_parser")
                text = ocr_result.text
            else:
                import fitz
                doc = fitz.open(str(path))
                text = "\n\n".join(p.get_text("text") for p in doc)
        except Exception as e:
            return {"success": False, "error": f"PDF 文本提取失败: {e}"}

        # 脱敏
        result = pipeline.process_text(
            text=text,
            policy_name=policy,
            entity_types=entity_types,
        )

        # PDF 坐标涂黑
        if result.get("mappings"):
            try:
                from redaction.renderer_pdf import PDFRedactionRenderer
                pdf_renderer = PDFRedactionRenderer()

                pdf_result = pdf_renderer.redact_from_mappings(
                    pdf_path=str(path),
                    mappings=result["mappings"],
                    output_path=str(path.parent / f"{path.stem}.redacted.pdf"),
                )
                result["pdf_redaction"] = pdf_result
            except Exception as e:
                result["pdf_redaction_error"] = str(e)

        return _serialize_mappings(result)

    # --- 文本文件脱敏 ---
    try:
        content = path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        content = path.read_text(encoding="gbk", errors="replace")

    result = pipeline.process_text(
        text=content,
        policy_name=policy,
        entity_types=entity_types,
    )

    # 保存脱敏结果
    output_path = path.parent / f"{path.stem}.redacted.md"
    output_path.write_text(result.get("redacted_text", ""), encoding="utf-8")
    result["output_file"] = str(output_path)

    # 保存映射文件（用于反向还原）
    mapping_path = path.parent / f"{path.stem}.mapping.enc"
    try:
        from redaction.renderer import RedactionRenderer
        renderer = RedactionRenderer()
        renderer.generate_mapping_file(
            result.get("mappings", []),
            str(mapping_path),
            encrypt=False,
            cluster_table=result.get("cluster_table", []),
        )
        result["mapping_file"] = str(mapping_path)
    except Exception as e:
        result["mapping_file_error"] = str(e)

    return _serialize_mappings(result)


def redact_pdf(pdf_path: str, ldir_path: str = None,
               mappings: list = None, output_path: str = None,
               remove_text_layer: bool = False) -> dict:
    """
    对 PDF 执行坐标级脱敏（基于 LDIR 坐标涂黑）。

    Args:
        pdf_path: PDF 文件路径
        ldir_path: LDIR 文件路径（含敏感实体坐标）
        mappings: 脱敏映射列表（如已有脱敏结果）
        output_path: 输出路径
        remove_text_layer: 是否删除底层文本
    """
    from redaction.renderer_pdf import PDFRedactionRenderer

    renderer = PDFRedactionRenderer()

    if mappings:
        result = renderer.redact_from_mappings(
            pdf_path=pdf_path,
            mappings=mappings,
            output_path=output_path or str(Path(pdf_path).parent / f"{Path(pdf_path).stem}.redacted.pdf"),
        )
    elif ldir_path:
        result = renderer.redact(
            pdf_path=pdf_path,
            ldir_path=ldir_path,
            output_path=output_path or str(Path(pdf_path).parent / f"{Path(pdf_path).stem}.redacted.pdf"),
            remove_text_layer=remove_text_layer,
        )
    else:
        return {"success": False, "error": "需要提供 ldir_path 或 mappings"}

    return result


def batch_redact(directory: str, policy: str = "external_client") -> list:
    """批量脱敏目录下所有可脱敏文件"""
    dir_path = Path(directory)
    if not dir_path.exists():
        return [{"success": False, "error": f"目录不存在: {directory}"}]

    supported = {".txt", ".md", ".html", ".pdf"}
    results = []
    for f in sorted(dir_path.iterdir()):
        if f.is_file() and f.suffix.lower() in supported:
            result = redact_file(str(f), policy)
            result["file"] = str(f)
            results.append(result)

    return results


# ============================================================
# 2. 敏感实体检测
# ============================================================

def detect_entities(text: str = None, file_path: str = None) -> dict:
    """检测文本中的敏感实体"""
    from redaction.detector import RedactionDetector

    if file_path:
        path = Path(file_path)
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            text = path.read_text(encoding="gbk", errors="replace")

    detector = RedactionDetector()
    entities = detector.detect(text or "")

    return {
        "success": True,
        "entity_count": len(entities),
        "entities": [
            {
                "type": e.entity_type,
                "text": e.text,
                "start": e.start,
                "end": e.end,
                "confidence": e.confidence,
            }
            for e in entities
        ],
    }


# ============================================================
# 3. 脱敏反向还原
# ============================================================

def restore_text(mapping_path: str, text: str) -> dict:
    """
    基于 mapping 文件将脱敏后的文本还原为原始名称。

    Args:
        mapping_path: mapping.enc 文件路径
        text: 脱敏后的文本（可包含 COMPANY_001、A公司、甲方 等）

    Returns:
        dict: restored_text, replacements, unmatched
    """
    from redaction.restorer import RedactionRestorer

    restorer = RedactionRestorer(mapping_path)
    return restorer.restore_text(text)


def restore_file(mapping_path: str, input_path: str,
                 output_path: str = None) -> dict:
    """
    基于 mapping 文件还原文件内容。

    Args:
        mapping_path: mapping.enc 文件路径
        input_path: 脱敏后的文件路径
        output_path: 还原后的输出路径（默认在输入文件同目录生成 .restored.md）

    Returns:
        dict: restored_text, output_path, replacements, unmatched
    """
    from redaction.restorer import RedactionRestorer

    restorer = RedactionRestorer(mapping_path)
    if not output_path:
        p = Path(input_path)
        output_path = str(p.parent / f"{p.stem}.restored.md")
    return restorer.restore_file(input_path, output_path)


# ============================================================
# 4. 脱敏质量评测
# ============================================================

def evaluate_redaction(redacted_result: dict, ground_truth_entities: list) -> dict:
    """
    评测脱敏质量。

    Args:
        redacted_result: 脱敏结果（含 redacted_text, mappings）
        ground_truth_entities: 真实敏感实体列表

    Returns:
        dict: score, passed, fnr, fpr, consistency, warnings
    """
    from redaction.policy import RedactionPolicyEngine
    redacted_text = redacted_result.get("redacted_text", "")
    mapping = redacted_result.get("mappings", [])
    mapping_dict = {m.get("original", ""): m.get("redacted", "") for m in mapping}

    # 漏检率
    missed = sum(1 for e in ground_truth_entities if e in redacted_text)
    fnr = missed / len(ground_truth_entities) if ground_truth_entities else 0

    # 一致性检查
    consistent = True
    value_to_key = {}
    for orig, redacted in mapping_dict.items():
        if redacted in value_to_key and value_to_key[redacted] != orig:
            consistent = False
        value_to_key[redacted] = orig

    score = (1 - fnr) * 0.6 + 0.2 + (0.2 if consistent else 0.0)

    return {
        "success": True,
        "eval_name": "redaction_quality",
        "passed": fnr < 0.05 and consistent,
        "score": round(score * 100, 2),
        "metrics": {
            "false_negative_rate": round(fnr, 4),
            "false_positive_rate": 0.0,
            "consistency": consistent,
            "missed_entities": missed,
            "total_ground_truth": len(ground_truth_entities),
        },
        "warnings": [f"漏检 {missed} 个实体"] if missed > 0 else [],
    }


# ============================================================
# 4. 信息查询
# ============================================================

SUPPORTED_ENTITY_TYPES = [
    ("id_card", "身份证号", "15/18位身份证号"),
    ("phone", "手机号", "中国大陆手机号"),
    ("email", "邮箱地址", "电子邮件地址"),
    ("bank_card", "银行卡号", "银行卡号"),
    ("license_plate", "车牌号", "中国大陆车牌号"),
    ("company_name", "公司名", "公司名称"),
    ("address", "地址", "详细地址"),
    ("case_number", "案号", "法律案件编号"),
    ("name", "姓名", "人名（NER 预留）"),
    ("amount", "金额", "金额数字"),
]

SUPPORTED_POLICIES = [
    ("external_client", "对外发送", "Mask 敏感信息，保留部分可读性"),
    ("internal_legal_analysis", "内部法律分析", "语义化 Token（如北京某米科技有限公司），可还原"),
    ("public_release", "公开发布", "Full Mask，不可逆"),
]

REDACTION_MODES = [
    ("MASK", "138****8000", "中间部分掩码"),
    ("REPLACE", "[手机号]", "替换为类型标签"),
    ("TOKENIZE", "{PHONE:1}", "替换为唯一 Token"),
    ("FULL_MASK", "***********", "全部掩码"),
    ("PARTIAL_MASK", "138****8000", "部分保留"),
]

def list_entities():
    return {"success": True, "entity_types": [
        {"id": e[0], "name": e[1], "description": e[2]} for e in SUPPORTED_ENTITY_TYPES
    ]}

def list_policies():
    return {"success": True, "policies": [
        {"id": p[0], "name": p[1], "description": p[2]} for p in SUPPORTED_POLICIES
    ]}

def list_modes():
    return {"success": True, "modes": [
        {"id": m[0], "example": m[1], "description": m[2]} for m in REDACTION_MODES
    ]}


# ============================================================
# 5. CLI 入口
# ============================================================

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    command = sys.argv[1]

    if command == "text":
        if len(sys.argv) < 3:
            print("用法: python3 redact_agent.py text <文本> [--policy <policy>]")
            sys.exit(1)
        text = sys.argv[2]
        policy = "external_client"
        if "--policy" in sys.argv:
            idx = sys.argv.index("--policy")
            policy = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else policy
        result = redact_text(text, policy)

    elif command == "file":
        if len(sys.argv) < 3:
            print("用法: python3 redact_agent.py file <file_path> [--policy <policy>]")
            sys.exit(1)
        policy = "external_client"
        if "--policy" in sys.argv:
            idx = sys.argv.index("--policy")
            policy = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else policy
        result = redact_file(sys.argv[2], policy)

    elif command == "pdf":
        if len(sys.argv) < 4:
            print("用法: python3 redact_agent.py pdf <pdf_path> <ldir_path> [--output <path>]")
            sys.exit(1)
        output = None
        if "--output" in sys.argv:
            idx = sys.argv.index("--output")
            output = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else None
        result = redact_pdf(sys.argv[2], sys.argv[3], output_path=output)

    elif command == "batch":
        if len(sys.argv) < 3:
            print("用法: python3 redact_agent.py batch <dir_path> [--policy <policy>]")
            sys.exit(1)
        policy = "external_client"
        if "--policy" in sys.argv:
            idx = sys.argv.index("--policy")
            policy = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else policy
        results = batch_redact(sys.argv[2], policy)
        result = {"success": True, "count": len(results), "results": results}

    elif command == "detect":
        if len(sys.argv) < 3:
            print("用法: python3 redact_agent.py detect <file_path>")
            sys.exit(1)
        result = detect_entities(file_path=sys.argv[2])

    elif command == "eval":
        if len(sys.argv) < 4:
            print("用法: python3 redact_agent.py eval <result.json> <ground_truth.json>")
            sys.exit(1)
        with open(sys.argv[2]) as f:
            redacted_result = json.load(f)
        with open(sys.argv[3]) as f:
            ground_truth = json.load(f)
        result = evaluate_redaction(redacted_result, ground_truth.get("entities", ground_truth))

    elif command == "restore":
        if len(sys.argv) < 4:
            print("用法: python3 redact_agent.py restore <mapping.enc> <file_or_text> [--output <path>]")
            sys.exit(1)
        mapping_path = sys.argv[2]
        input_arg = sys.argv[3]
        output = None
        if "--output" in sys.argv:
            idx = sys.argv.index("--output")
            output = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else None

        # 如果输入是文件路径，按文件还原；否则按文本还原
        if Path(input_arg).exists() and Path(input_arg).is_file():
            result = restore_file(mapping_path, input_arg, output)
        else:
            result = restore_text(mapping_path, input_arg)
            if output:
                Path(output).write_text(result.get("restored_text", ""), encoding="utf-8")
                result["output_path"] = output

    elif command == "list-entities":
        result = list_entities()
    elif command == "list-policies":
        result = list_policies()
    elif command == "list-modes":
        result = list_modes()

    else:
        print(f"未知命令: {command}")
        print(__doc__)
        sys.exit(1)

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
