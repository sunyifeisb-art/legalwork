#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 2300
BG = (255, 255, 255)
BLACK = (20, 20, 20)
GRAY = (90, 90, 90)
LIGHT = (245, 245, 245)

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


def draw_dashed_rect(draw, xy, dash=12, gap=8, width=2, fill=BLACK):
    x1, y1, x2, y2 = xy
    for x in range(x1, x2, dash + gap):
        draw.line((x, y1, min(x + dash, x2), y1), fill=fill, width=width)
        draw.line((x, y2, min(x + dash, x2), y2), fill=fill, width=width)
    for y in range(y1, y2, dash + gap):
        draw.line((x1, y, x1, min(y + dash, y2)), fill=fill, width=width)
        draw.line((x2, y, x2, min(y + dash, y2)), fill=fill, width=width)


def rounded_box(draw, xy, radius=18, width=2, outline=BLACK, fill=BG):
    draw.rounded_rectangle(xy, radius=radius, outline=outline, width=width, fill=fill)


def centered_text(draw, box, text, font_obj, fill=BLACK):
    x1, y1, x2, y2 = box
    bbox = draw.multiline_textbbox((0, 0), text, font=font_obj, align="center", spacing=6)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = x1 + (x2 - x1 - tw) / 2
    y = y1 + (y2 - y1 - th) / 2
    draw.multiline_text((x, y), text, font=font_obj, fill=fill, align="center", spacing=6)


def box(draw, x, y, w, h, title, subtitle=None, fill=BG):
    rounded_box(draw, (x, y, x + w, y + h), fill=fill)
    title_font = font(26)
    if subtitle:
        sub_font = font(17)
        centered_text(draw, (x + 12, y + 10, x + w - 12, y + 48), title, title_font)
        centered_text(draw, (x + 18, y + 54, x + w - 18, y + h - 12), subtitle, sub_font, fill=GRAY)
    else:
        centered_text(draw, (x + 12, y + 12, x + w - 12, y + h - 12), title, title_font)


def arrow(draw, x1, y1, x2, y2, width=3, fill=BLACK):
    draw.line((x1, y1, x2, y2), fill=fill, width=width)
    if abs(x2 - x1) >= abs(y2 - y1):
        sign = 1 if x2 > x1 else -1
        draw.polygon([(x2, y2), (x2 - 16 * sign, y2 - 8), (x2 - 16 * sign, y2 + 8)], fill=fill)
    else:
        sign = 1 if y2 > y1 else -1
        draw.polygon([(x2, y2), (x2 - 8, y2 - 16 * sign), (x2 + 8, y2 - 16 * sign)], fill=fill)


def vertical_tag(draw, x, y, w, h, text):
    rounded_box(draw, (x, y, x + w, y + h), radius=8, fill=BG)
    stacked = "\n".join(list(text))
    centered_text(draw, (x + 4, y + 4, x + w - 4, y + h - 4), stacked, font(24))


def main():
    out = Path('/Users/xiangyang/.openclaw/workspace/output/data-compliance-technical-route.png')
    out.parent.mkdir(parents=True, exist_ok=True)

    img = Image.new('RGB', (W, H), BG)
    draw = ImageDraw.Draw(img)

    title_font = font(42)
    sub_font = font(24)
    section_font = font(26)

    draw.text((390, 38), '数据合规智能审查项目技术路线图', font=title_font, fill=BLACK)
    draw.text((300, 95), '—— 全自动审核版本（用户上传材料后，系统自动完成解析、审查、复核与报告输出） ——', font=sub_font, fill=GRAY)

    # top labels
    box(draw, 90, 150, 180, 68, '技术思路')
    box(draw, 710, 150, 180, 68, '核心内容')
    box(draw, 1330, 150, 180, 68, '自动机制')

    main_x1, main_x2 = 140, 1360
    left_tag_x = 18
    right_tag_x = 1420

    # Section 1
    s1 = (main_x1, 245, main_x2, 520)
    draw_dashed_rect(draw, s1)
    vertical_tag(draw, left_tag_x, 325, 58, 120, '输入材料')
    box(draw, 650, 275, 200, 70, '绪论 / 输入起点')
    box(draw, 200, 400, 240, 90, '研究对象与边界')
    box(draw, 630, 400, 240, 90, '项目目标')
    box(draw, 1060, 400, 240, 90, '输出目标')
    arrow(draw, 750, 345, 320, 398)
    arrow(draw, 750, 345, 750, 398)
    arrow(draw, 750, 345, 1180, 398)

    # Section 2
    s2 = (main_x1, 565, main_x2, 900)
    draw_dashed_rect(draw, s2)
    vertical_tag(draw, left_tag_x, 675, 58, 120, '自动解析')
    vertical_tag(draw, right_tag_x, 640, 58, 180, '识别层')
    box(draw, 650, 595, 200, 70, '文档理解')
    row_y = 735
    w = 210
    gap = 55
    x_positions = [180, 180 + w + gap, 180 + 2 * (w + gap), 180 + 3 * (w + gap)]
    labels = [
        ('材料接收', None),
        ('预处理', None),
        ('文档分型', None),
        ('路径规划', None),
    ]
    for (title, sub), x in zip(labels, x_positions):
        box(draw, x, row_y, w, 100, title, sub)
        arrow(draw, x + w // 2, 665, x + w // 2, row_y)
    for i in range(len(x_positions) - 1):
        arrow(draw, x_positions[i] + w, row_y + 50, x_positions[i + 1], row_y + 50)

    # Section 3
    s3 = (main_x1, 945, main_x2, 1320)
    draw_dashed_rect(draw, s3)
    vertical_tag(draw, left_tag_x, 1060, 58, 120, '自动审核')
    vertical_tag(draw, right_tag_x, 1010, 58, 200, '规则层')
    box(draw, 650, 975, 200, 70, '审查引擎')
    box(draw, 170, 1110, 250, 95, '披露充分性检查')
    box(draw, 475, 1110, 250, 95, '第三方共享检查')
    box(draw, 780, 1110, 250, 95, '合法性基础检查')
    box(draw, 1085, 1110, 250, 95, '数据出境检查')
    arrow(draw, 750, 1045, 295, 1108)
    arrow(draw, 750, 1045, 600, 1108)
    arrow(draw, 750, 1045, 905, 1108)
    arrow(draw, 750, 1045, 1210, 1108)

    box(draw, 320, 1235, 250, 95, '目的—范围匹配')
    box(draw, 675, 1235, 250, 95, '敏感信息检查')
    box(draw, 1030, 1235, 250, 95, '字段—目的—法律基础')
    arrow(draw, 295, 1205, 445, 1233)
    arrow(draw, 600, 1205, 800, 1233)
    arrow(draw, 1210, 1205, 1155, 1233)

    # Section 4
    s4 = (main_x1, 1365, main_x2, 1715)
    draw_dashed_rect(draw, s4)
    vertical_tag(draw, left_tag_x, 1480, 58, 120, '自动复核')
    vertical_tag(draw, right_tag_x, 1450, 58, 180, '校验层')
    box(draw, 650, 1395, 200, 70, '自动复核')
    box(draw, 170, 1530, 250, 95, '高风险项触发')
    box(draw, 475, 1530, 250, 95, '依据完整性检查')
    box(draw, 780, 1530, 250, 95, '复核状态生成')
    box(draw, 1085, 1530, 250, 95, '结论修正')
    arrow(draw, 750, 1465, 295, 1528)
    arrow(draw, 750, 1465, 600, 1528)
    arrow(draw, 750, 1465, 905, 1528)
    arrow(draw, 750, 1465, 1210, 1528)

    # Section 5
    s5 = (main_x1, 1760, main_x2, 2145)
    draw_dashed_rect(draw, s5)
    vertical_tag(draw, left_tag_x, 1890, 58, 120, '报告输出')
    vertical_tag(draw, right_tag_x, 1865, 58, 180, '输出层')
    box(draw, 650, 1790, 200, 70, '结论与建模')
    box(draw, 170, 1940, 250, 100, '结构化主报告')
    box(draw, 475, 1940, 250, 100, '自动复核结果')
    box(draw, 780, 1940, 250, 100, '扩展输出')
    box(draw, 1085, 1940, 250, 100, '专项场景包')
    arrow(draw, 750, 1860, 295, 1938)
    arrow(draw, 750, 1860, 600, 1938)
    arrow(draw, 750, 1860, 905, 1938)
    arrow(draw, 750, 1860, 1210, 1938)

    # main flow arrows between sections
    arrow(draw, 750, 520, 750, 565)
    arrow(draw, 750, 900, 750, 945)
    arrow(draw, 750, 1320, 750, 1365)
    arrow(draw, 750, 1715, 750, 1760)

    draw.text((360, 2200), '说明：当前路线图强调“系统内部自动闭环”，用户只负责上传材料并等待最终报告。', font=font(22), fill=GRAY)

    img.save(out)
    print(out)


if __name__ == '__main__':
    main()
