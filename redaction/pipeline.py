"""
Redaction Pipeline - 脱敏流水线

整合 v0.2 脱敏全流程：
1. 读取文件或 LDIR
2. Detector: 识别敏感实体
3. Policy Engine: 应用脱敏策略
4. Renderer: 生成脱敏输出
5. 保存到 Redacted Workspace

输出：
- redacted/{filename}.redacted.md
- redacted/{filename}.mapping.enc
- redacted/{filename}.redaction_report.html
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime

from .detector import RedactionDetector
from .policy import RedactionPolicyEngine
from .renderer import RedactionRenderer
from .renderer_pdf import PDFRedactionRenderer


class RedactionPipeline:
    """脱敏处理流水线"""

    def __init__(self):
        self.detector = RedactionDetector()
        self.renderer = RedactionRenderer()
        self.pdf_renderer = PDFRedactionRenderer()

    def process_text(self, text: str, policy_name: str = "external_client",
                     custom_rules: Optional[Dict[str, Any]] = None,
                     entity_types: Optional[List[str]] = None,
                     page_number: Optional[int] = None) -> Dict[str, Any]:
        """
        对纯文本执行脱敏。

        Returns:
            {
                "success": bool,
                "redacted_text": str,
                "mappings": list,
                "entity_count": int,
                "review_items": list,
            }
        """
        # Step 1: 检测实体
        entities = self.detector.detect(text, entity_types, page_number)
        if not entities:
            return {
                "success": True,
                "redacted_text": text,
                "mappings": [],
                "entity_count": 0,
                "review_items": [],
            }

        # Step 2: 应用策略
        policy = RedactionPolicyEngine(policy_name, custom_rules)
        mappings = policy.create_mapping(entities)

        # Step 3: 渲染脱敏文本
        redacted_text = self.renderer.render_markdown(text, mappings)

        # Step 4: 获取需复核项
        review_items = policy.get_review_items(mappings)

        return {
            "success": True,
            "redacted_text": redacted_text,
            "mappings": mappings,
            "entity_count": len(entities),
            "review_items": review_items,
            "policy_name": policy_name,
            "cluster_table": policy.get_cluster_table(),
        }

    def process_file(self, file_path: str, matter_id: str,
                     matter_dir: Path, policy_name: str = "external_client",
                     custom_rules: Optional[Dict[str, Any]] = None,
                     entity_types: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        对文件执行脱敏，保存到 Redacted Workspace。

        file_path: 输入文件路径（优先从 Working Workspace 读取）
        matter_id: Matter ID
        matter_dir: Matter 根目录
        """
        path = Path(file_path)

        # 读取文本
        if not path.exists():
            return {"success": False, "error": f"文件不存在: {file_path}"}

        try:
            text = path.read_text(encoding="utf-8")
        except Exception as e:
            return {"success": False, "error": f"读取文件失败: {e}"}

        # 执行脱敏
        result = self.process_text(text, policy_name, custom_rules, entity_types)
        if not result["success"]:
            return result

        # 保存到 Redacted Workspace
        redacted_dir = matter_dir / "redacted"
        redacted_dir.mkdir(parents=True, exist_ok=True)

        base_name = path.stem

        # 保存脱敏 Markdown
        md_path = redacted_dir / f"{base_name}.redacted.md"
        md_path.write_text(result["redacted_text"], encoding="utf-8")

        # 保存映射表
        mapping_path = redacted_dir / f"{base_name}.mapping.enc"
        self.renderer.generate_mapping_file(
            result["mappings"],
            str(mapping_path),
            encrypt=False,
            cluster_table=result.get("cluster_table", []),
        )

        # 生成报告
        report_path = redacted_dir / f"{base_name}.redaction_report.html"
        self.renderer.generate_report(
            result["mappings"],
            policy_name=policy_name,
            source_file=str(path),
            output_path=str(report_path),
        )

        return {
            "success": True,
            "source_file": str(path),
            "outputs": {
                "redacted_md": str(md_path),
                "mapping": str(mapping_path),
                "report": str(report_path),
            },
            "entity_count": result["entity_count"],
            "review_items_count": len(result["review_items"]),
            "policy_name": policy_name,
        }

    def process_ldir(self, ldir_path: str, matter_id: str,
                     matter_dir: Path, policy_name: str = "external_client",
                     custom_rules: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        对 LDIR 文件执行脱敏。
        """
        path = Path(ldir_path)
        if not path.exists():
            return {"success": False, "error": f"LDIR 文件不存在: {ldir_path}"}

        try:
            ldir_doc = json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            return {"success": False, "error": f"读取 LDIR 失败: {e}"}

        # 从 LDIR 中检测实体
        entities = self.detector.detect_from_ldir(ldir_doc)
        if not entities:
            return {
                "success": True,
                "redacted_ldir": ldir_doc,
                "mappings": [],
                "entity_count": 0,
            }

        # 应用策略
        policy = RedactionPolicyEngine(policy_name, custom_rules)
        mappings = policy.create_mapping(entities)

        # 渲染脱敏 LDIR
        redacted_ldir = self.renderer.render_ldir(ldir_doc, mappings)

        # 保存
        redacted_dir = matter_dir / "redacted"
        redacted_dir.mkdir(parents=True, exist_ok=True)
        base_name = path.stem.replace(".ldir", "")

        ldir_output = redacted_dir / f"{base_name}.redacted.ldir.json"
        ldir_output.write_text(json.dumps(redacted_ldir, ensure_ascii=False, indent=2), encoding="utf-8")

        mapping_path = redacted_dir / f"{base_name}.mapping.enc"
        self.renderer.generate_mapping_file(
            mappings, str(mapping_path), encrypt=False, cluster_table=policy.get_cluster_table()
        )

        report_path = redacted_dir / f"{base_name}.redaction_report.html"
        self.renderer.generate_report(mappings, policy_name, str(path), str(report_path))

        return {
            "success": True,
            "outputs": {
                "redacted_ldir": str(ldir_output),
                "mapping": str(mapping_path),
                "report": str(report_path),
            },
            "entity_count": len(entities),
            "review_items_count": len(policy.get_review_items(mappings)),
        }

    def process_pdf(self, pdf_path: str, ldir_path: str,
                    matter_dir: Path, policy_name: str = "external_client",
                    remove_text_layer: bool = False) -> Dict[str, Any]:
        """
        对 PDF 执行坐标级脱敏（v0.3）。

        需要 LDIR 文件提供敏感实体的坐标信息。
        """
        path = Path(pdf_path)
        if not path.exists():
            return {"success": False, "error": f"PDF 不存在: {pdf_path}"}

        # 如果没有提供 LDIR，先尝试从同名文件找
        if not ldir_path or not Path(ldir_path).exists():
            auto_ldir = path.with_suffix(".ldir.json")
            if auto_ldir.exists():
                ldir_path = str(auto_ldir)
            else:
                return {"success": False, "error": "未找到 LDIR 坐标文件"}

        # 执行坐标级脱敏
        redacted_dir = matter_dir / "redacted"
        redacted_dir.mkdir(parents=True, exist_ok=True)
        output_pdf = redacted_dir / f"{path.stem}.redacted.pdf"

        result = self.pdf_renderer.redact(
            pdf_path=str(path),
            ldir_path=ldir_path,
            output_path=str(output_pdf),
            remove_text_layer=remove_text_layer,
            clean_metadata=True,
        )

        return result
