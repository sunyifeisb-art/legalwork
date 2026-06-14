"""
Runner - 统一 skill 执行入口
"""

import argparse
import re
from pathlib import Path

from .intake import intake_file
from .output import save_result, build_summary

SKILLS_DIR = Path("/Users/xiangyang/Desktop/legalwork/skills")


def load_skill_prompt(skill_name: str) -> str:
    """读取 skill 的 SKILL.md 作为 prompt 模板。"""
    skill_dir = SKILLS_DIR / skill_name
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        return ""
    return skill_md.read_text(encoding="utf-8", errors="replace")


def run_skill(skill_name: str, input_path: Path, output_dir: Path | None = None, ocr_profile: str = "auto") -> dict:
    """
    执行一个 skill 的完整流程：
    1. 读取输入文件文本
    2. 加载 skill prompt
    3. 保存结构化输出

    注意：当前版本把提取后的文本 + skill 指令组合输出，供 LLM 进一步处理。
    未来可在此接入本地/远程 LLM 直接生成最终结果。
    """
    # 1. 读取输入
    intake_result = intake_file(input_path, ocr_profile)
    if not intake_result.get("success"):
        return {
            "success": False,
            "error": intake_result.get("error", "文本提取失败"),
            "output_path": None,
        }

    # 2. 加载 skill prompt
    prompt = load_skill_prompt(skill_name)
    if not prompt:
        return {
            "success": False,
            "error": f"找不到 skill prompt: {skill_name}",
            "output_path": None,
        }

    # 3. 组合输出
    full_output = build_summary(intake_result, skill_name, input_path)
    full_output += "\n\n---\n\n"
    full_output += "## Skill 指令（用于后续 LLM 分析）\n\n"
    full_output += prompt

    # 4. 保存
    out_path = save_result(full_output, skill_name, input_path, output_dir)

    return {
        "success": True,
        "text": intake_result.get("text", ""),
        "engine": intake_result.get("engine", ""),
        "confidence": intake_result.get("confidence", 0),
        "output_path": str(out_path),
    }


def main():
    parser = argparse.ArgumentParser(description="LegalWork Skill Engine Runner")
    parser.add_argument("skill_name", help="skill 目录名，如 legal-case-analysis")
    parser.add_argument("input_path", help="输入文件路径")
    parser.add_argument("--output-dir", help="输出目录，默认与输入文件同目录")
    parser.add_argument("--ocr-profile", default="auto", help="OCR profile")
    args = parser.parse_args()

    result = run_skill(args.skill_name, Path(args.input_path), args.output_dir, args.ocr_profile)

    if result["success"]:
        print(f"[legalwork-skill] 成功: {result['output_path']}")
        print(f"[legalwork-skill] 引擎: {result['engine']}, 置信度: {result['confidence']}")
        # 终端只展示前 1000 字符文本
        text = result["text"]
        preview = text[:1000] + ("..." if len(text) > 1000 else "")
        print("\n=== 提取文本预览 ===")
        print(preview)
    else:
        print(f"[legalwork-skill] 失败: {result['error']}")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
