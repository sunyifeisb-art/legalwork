"""
Intake - 统一文件入口处理
支持 PDF、图片、Word、TXT，扫描件自动 OCR。
"""

import subprocess
from pathlib import Path

LEGALWORK_DIR = Path("/Users/xiangyang/Desktop/legalwork")
VENV_PYTHON = LEGALWORK_DIR / ".venv" / "bin" / "python3"
OCR_AGENT = LEGALWORK_DIR / "ocr_agent.py"


def _run_ocr_agent(file_path: Path, profile: str = "auto") -> dict:
    """调用 legalwork ocr_agent.py 提取文本。"""
    if profile == "auto":
        cmd = [str(VENV_PYTHON), str(OCR_AGENT), "auto", str(file_path)]
    else:
        cmd = [str(VENV_PYTHON), str(OCR_AGENT), "scan", str(file_path), profile]

    result = subprocess.run(
        cmd,
        cwd=LEGALWORK_DIR,
        capture_output=True,
        text=True,
        timeout=1800,
    )
    stdout = result.stdout.strip()
    if not stdout:
        return {"success": False, "error": "OCR 无输出", "text": ""}

    import json

    first_brace = stdout.find("{")
    last_brace = stdout.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        try:
            data = json.loads(stdout[first_brace : last_brace + 1])
            return data
        except json.JSONDecodeError:
            pass

    return {"success": False, "error": "无法解析 OCR 输出", "text": stdout}


def extract_text(file_path: str | Path, ocr_profile: str = "auto") -> dict:
    """
    从文件提取文本，扫描 PDF/图片自动走 OCR。

    Returns:
        {
            "success": bool,
            "text": str,
            "engine": str,
            "confidence": float,
            "error": str | None,
        }
    """
    path = Path(file_path)
    if not path.exists():
        return {"success": False, "text": "", "engine": "", "error": f"文件不存在: {path}"}

    suffix = path.suffix.lower()
    if suffix in {".txt", ".md"}:
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
            return {"success": True, "text": text, "engine": "direct_read", "confidence": 1.0}
        except Exception as e:
            return {"success": False, "text": "", "engine": "", "error": str(e)}

    if suffix in {".pdf", ".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif", ".webp"}:
        return _run_ocr_agent(path, ocr_profile)

    if suffix in {".docx", ".doc"}:
        try:
            from docx import Document
            doc = Document(str(path))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            text = "\n".join(paragraphs)
            return {"success": True, "text": text, "engine": "python-docx", "confidence": 0.95}
        except Exception as e:
            # 兜底：调用 OCR agent 的 auto 模式
            return _run_ocr_agent(path, "auto")

    return {"success": False, "text": "", "engine": "", "error": f"不支持的文件格式: {suffix}"}


def intake_file(file_path: str | Path, ocr_profile: str = "auto") -> dict:
    """extract_text 的别名，语义更清楚。"""
    return extract_text(file_path, ocr_profile)
