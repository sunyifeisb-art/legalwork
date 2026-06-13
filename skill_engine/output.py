"""
Output - 统一输出处理
保存结果、生成摘要、格式化汇报。
"""

from pathlib import Path
from datetime import datetime


def build_summary(data: dict, skill_name: str, input_path: Path) -> str:
    """生成人类可读的结果摘要。"""
    lines = []
    lines.append(f"# {skill_name} 处理结果")
    lines.append("")
    lines.append(f"- **输入文件**: {input_path}")
    lines.append(f"- **处理时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"- **文本提取引擎**: {data.get('engine', 'unknown')}")
    lines.append(f"- **置信度**: {data.get('confidence', 'N/A')}")
    if data.get("error"):
        lines.append(f"- **错误**: {data['error']}")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 提取文本")
    lines.append("")
    lines.append(data.get("text", ""))
    return "\n".join(lines)


def save_result(text: str, skill_name: str, input_path: Path, output_dir: Path | None = None) -> Path:
    """
    保存 skill 处理结果到文件。

    Returns:
        保存的文件路径
    """
    if output_dir is None:
        output_dir = Path(input_path).parent
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    stem = Path(input_path).stem
    timestamp = datetime.now().strftime("%m%d_%H%M")
    out_path = output_dir / f"{stem}.{skill_name}.{timestamp}.md"
    counter = 1
    while out_path.exists():
        out_path = output_dir / f"{stem}.{skill_name}.{timestamp}_{counter}.md"
        counter += 1

    out_path.write_text(text, encoding="utf-8")
    return out_path
