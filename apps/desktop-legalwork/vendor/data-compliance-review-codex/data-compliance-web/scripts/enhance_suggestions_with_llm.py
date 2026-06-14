#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path


try:
    from openai import OpenAI
except ImportError as exc:  # pragma: no cover
    raise ImportError("请先安装依赖: pip install openai>=1.30.0") from exc


SYSTEM_PROMPT = (
    "你是一名资深数据合规律师助理。请根据用户提供的风险点、原文证据、法规依据和风险分析，\n"
    "生成三部分内容：\n"
    "1. optimized_reason: 一段完整、专业、具体的风险分析。\n"
    "   要求：说清楚“为什么有风险、具体是什么风险、风险来自哪里/可能造成什么损害”。\n"
    "   不要简单罗列关键词、字段名或原文片段；不要重复“涉及功能/权限：...；已识别要素：...”这种结构。\n"
    "   必须写成连贯的叙述性段落，像律师在给客户解释风险成因、风险表现和潜在后果。\n"
    "   如果可能，指出具体法律条款要求、业务场景中的薄弱环节、以及一旦不合规可能导致的实际后果。\n"
    "2. optimized_suggestion: 一段完整、具体、可落地的优化建议（直接替换原有建议）。\n"
    "   要求：不堆砌短句，不使用模板化空话，像律师在给客户写反馈。\n"
    "   必须是一段连贯的叙述文字，严禁使用 Markdown 表格、列表或项目符号。\n"
    "   必须直接写出完整的优化建议，不要重复或拼接原有模板建议的原文。\n"
    "   建议应包含：应该做什么、怎么做、谁来做、优先级、注意事项，让读者能直接据此安排整改。\n"
    "3. rewritten_clause: 基于【原文证据】中的具体条款，对其进行针对性改写后的完整条款文本。\n"
    "   要求：直接修改原文中的问题表述，生成一段可直接替换原文的合规条款。\n"
    "   语言正式、结构清晰，必须贴合原文上下文，不能是泛泛的通用模板。不能留空。\n"
    "\n"
    "必须且只能返回合法的 JSON 对象，不要包含 markdown 代码块或其他说明文字。格式如下：\n"
    '{"optimized_reason": "...", "optimized_suggestion": "...", "rewritten_clause": "..."}'
)


def build_user_prompt(item: dict) -> str:
    lines = [
        "【风险点】",
        item.get("risk_point", ""),
        "",
        "【法规依据】",
        item.get("legal_basis", ""),
        "",
        "【风险分析】",
        item.get("reason", ""),
        "",
        "【原文证据】",
    ]
    evidence = item.get("evidence") or []
    if evidence:
        for idx, ev in enumerate(evidence[:3], 1):
            lines.append(f"{idx}. {ev}")
    else:
        lines.append("（无直接证据片段）")
    lines.extend([
        "",
        "【原有模板建议】",
        item.get("suggestion", ""),
        "",
        "请返回 JSON：",
    ])
    return "\n".join(lines)


def enhance_item(client: OpenAI, model: str, item: dict) -> dict:
    """Call LLM to enhance a single report item."""
    user_prompt = build_user_prompt(item)
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=2048,
        )
        content = response.choices[0].message.content or ""
        content = content.strip()
        # Remove markdown code fences if present
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        parsed = json.loads(content)
        optimized_reason = (parsed.get("optimized_reason") or "").strip()
        optimized = (parsed.get("optimized_suggestion") or "").strip()
        rewritten = (parsed.get("rewritten_clause") or "").strip()
        if optimized_reason:
            item["reason"] = optimized_reason
        if optimized:
            item["suggestion"] = optimized
        if rewritten:
            item["rewritten_clause"] = rewritten
        item["llm_enhanced"] = bool(optimized and rewritten)
    except Exception as exc:
        # Graceful fallback: keep original suggestion, mark as not enhanced
        item["llm_enhanced"] = False
        # Include a quiet debug note in stderr
        print(f"[LLM enhance warning] {item.get('risk_point', 'unknown')}: {exc}", file=sys.stderr)
    return item


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--model", default=os.environ.get("LEGALWORK_MODEL", "deepseek-chat"))
    parser.add_argument("--api-key", default=os.environ.get("LEGALWORK_API_KEY") or os.environ.get("DEEPSEEK_API_KEY", ""))
    parser.add_argument("--base-url", default=os.environ.get("LEGALWORK_BASE_URL", "https://api.deepseek.com"))
    args = parser.parse_args()

    report_path = Path(args.report)
    output_path = Path(args.output)

    data = json.loads(report_path.read_text(encoding="utf-8"))

    api_key = args.api_key.strip()
    if not api_key:
        # No API key configured: pass through unchanged but mark all as not enhanced
        for item in data.get("items", []):
            item["llm_enhanced"] = False
        output_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print("[enhance_suggestions_with_llm] LEGALWORK_API_KEY / DEEPSEEK_API_KEY 未配置，跳过增强，保留原建议。")
        return 0

    client = OpenAI(api_key=api_key, base_url=args.base_url)

    items = data.get("items", [])
    total = len(items)
    for idx, item in enumerate(items, 1):
        if not item.get("suggestion"):
            item["llm_enhanced"] = False
            continue
        enhance_item(client, args.model, item)
        # Small rate-limit friendly delay
        if idx < total:
            time.sleep(0.3)

    output_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    enhanced_count = sum(1 for item in items if item.get("llm_enhanced"))
    print(f"[enhance_suggestions_with_llm] 完成 {enhanced_count}/{total} 条增强。输出：{output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
