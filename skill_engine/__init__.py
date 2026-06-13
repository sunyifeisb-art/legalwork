"""
LegalWork Skill Engine
统一为 legalwork/skills/ 下的 skill 提供输入处理、输出保存等基础设施。
"""

from .intake import intake_file, extract_text
from .output import save_result, build_summary
from .runner import run_skill

__all__ = ["intake_file", "extract_text", "save_result", "build_summary", "run_skill"]
