#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1800, 1080
BG = (255, 255, 255)
TEXT = (17, 24, 39)
MUTED = (107, 114, 128)
LINE = (156, 163, 175)
BORDER = (203, 213, 225)
ACCENT = (37, 99, 235)
BOX_FILL = (248, 250, 252)
ACCENT_FILL = (239, 246, 255)


FONT_CANDIDATES = [
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/SFNS.ttf",
]


def font(size: int):
    for path in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()


def rounded_box(draw: ImageDraw.ImageDraw, xy, fill, outline=BORDER, radius=20, width=2):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def draw_multiline(draw, x, y, lines, body_font, fill=TEXT, line_gap=14):
    yy = y
    for line in lines:
        draw.text((x, yy), line, font=body_font, fill=fill)
        yy += body_font.size + line_gap


def draw_box(draw, x, y, w, h, title, lines, highlighted=False):
    fill = ACCENT_FILL if highlighted else BOX_FILL
    rounded_box(draw, (x, y, x + w, y + h), fill=fill)
    title_font = font(30)
    body_font = font(22)
    draw.text((x + 24, y + 22), title, font=title_font, fill=TEXT)
    draw.line((x + 24, y + 70, x + w - 24, y + 70), fill=BORDER, width=2)
    draw_multiline(draw, x + 24, y + 96, lines, body_font)


def arrow(draw, x1, y1, x2, y2, color=LINE, width=5):
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    if abs(x2 - x1) >= abs(y2 - y1):
        sign = 1 if x2 > x1 else -1
        draw.polygon([
            (x2, y2),
            (x2 - 18 * sign, y2 - 10),
            (x2 - 18 * sign, y2 + 10),
        ], fill=color)
    else:
        sign = 1 if y2 > y1 else -1
        draw.polygon([
            (x2, y2),
            (x2 - 10, y2 - 18 * sign),
            (x2 + 10, y2 - 18 * sign),
        ], fill=color)


def main():
    out = Path('/Users/xiangyang/.openclaw/workspace/output/data-compliance-workflow-simple.png')
    out.parent.mkdir(parents=True, exist_ok=True)

    img = Image.new('RGB', (W, H), BG)
    draw = ImageDraw.Draw(img)

    title_font = font(42)
    sub_font = font(24)
    section_font = font(28)
    small_font = font(21)

    draw.text((70, 48), '数据合规 AI 项目｜当前工作流流程图（简版）', font=title_font, fill=TEXT)
    draw.text((70, 104), '只展示当前框架和功能，不做复杂 UI。', font=sub_font, fill=MUTED)

    draw.text((70, 170), '主流程', font=section_font, fill=ACCENT)

    top_y = 230
    box_w, box_h = 470, 250
    x1, x2, x3 = 70, 665, 1260

    draw_box(draw, x1, top_y, box_w, box_h, '01 输入接收与预处理', [
        '• 接收文件 / 文本',
        '• 提取可处理内容',
        '• 轻量清洗与标准化',
        '• 判断文档类型',
        '• 切分为可审查单元',
    ], highlighted=True)

    draw_box(draw, x2, top_y, box_w, box_h, '02 合规文件审查', [
        '• 选择审查路径',
        '• 规则比对 / 风险识别',
        '• 关联法规依据',
        '• 标记高风险与依据不足项',
        '• 输出初版结构化结果',
    ], highlighted=False)

    draw_box(draw, x3, top_y, box_w, box_h, '03 自动复核与输出', [
        '• 对高风险项自动二次核验',
        '• 检查依据 / 证据 / 说明完整性',
        '• 必要时标记“需补依据”',
        '• 生成最终报告与专项包',
        '• 全程不要求人工介入',
    ], highlighted=False)

    arrow(draw, x1 + box_w, top_y + box_h // 2, x2 - 25, top_y + box_h // 2)
    arrow(draw, x2 + box_w, top_y + box_h // 2, x3 - 25, top_y + box_h // 2)

    draw.text((70, 570), '框架补充', font=section_font, fill=ACCENT)

    bottom_y = 625
    bottom_w, bottom_h = 520, 250
    bx1, bx2, bx3 = 70, 640, 1210

    draw_box(draw, bx1, bottom_y, bottom_w, bottom_h, '输入范围', [
        '• 隐私政策',
        '• 合同 / 协议',
        '• 数据出境材料',
        '• 其他数据合规相关文本',
    ])

    draw_box(draw, bx2, bottom_y, bottom_w, bottom_h, '当前系统重点能力', [
        '• 文档分型',
        '• 多路径规则审查',
        '• 风险等级输出',
        '• 法规条文映射',
        '• 整改建议 / 证据清单 / 场景包',
    ], highlighted=True)

    draw_box(draw, bx3, bottom_y, bottom_w, bottom_h, '当前边界', [
        '• 先聚焦数据合规审查主链路',
        '• 暂不做复杂 OCR / 扫描件解析',
        '• 数据库能力可外接，不在本图展开',
        '• AI 结果默认不是最终法律意见',
    ])

    draw.text((70, 930), '输出结果', font=section_font, fill=ACCENT)
    rounded_box(draw, (70, 970, 1730, 1030), fill=(250, 250, 250), outline=BORDER, radius=16, width=2)
    draw.text((94, 986), '结构化风险报告  →  自动复核结果  →  整改建议  →  证据清单  →  场景化审查包', font=small_font, fill=TEXT)

    img.save(out)
    print(out)


if __name__ == '__main__':
    main()
