#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 2200, 1500
BG = (248, 250, 252)
TEXT = (15, 23, 42)
MUTED = (71, 85, 105)
BLUE = (59, 130, 246)
GREEN = (16, 185, 129)
ORANGE = (249, 115, 22)
PURPLE = (139, 92, 246)
RED = (239, 68, 68)
GRAY = (226, 232, 240)
WHITE = (255, 255, 255)


def font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        "/System/Library/Fonts/SFNS.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()


def rounded_box(draw, xy, fill, outline=GRAY, radius=22, width=3):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def draw_box(draw, x, y, w, h, title, lines, color, title_font, body_font):
    rounded_box(draw, (x, y, x + w, y + h), WHITE, outline=color)
    draw.rounded_rectangle((x, y, x + w, y + 54), radius=22, fill=color)
    draw.text((x + 18, y + 12), title, font=title_font, fill=WHITE)
    yy = y + 74
    for line in lines:
        draw.text((x + 18, yy), line, font=body_font, fill=TEXT)
        yy += 36


def arrow(draw, x1, y1, x2, y2, color=BLUE, width=6):
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    if abs(x2 - x1) > abs(y2 - y1):
        sign = 1 if x2 > x1 else -1
        draw.polygon([(x2, y2), (x2 - 18 * sign, y2 - 10), (x2 - 18 * sign, y2 + 10)], fill=color)
    else:
        sign = 1 if y2 > y1 else -1
        draw.polygon([(x2, y2), (x2 - 10, y2 - 18 * sign), (x2 + 10, y2 - 18 * sign)], fill=color)


def main():
    out = Path('/Users/xiangyang/.openclaw/workspace/output/data-compliance-workflow-overview.png')
    out.parent.mkdir(parents=True, exist_ok=True)

    img = Image.new('RGB', (W, H), BG)
    draw = ImageDraw.Draw(img)
    title_font = font(54, True)
    h1 = font(34, True)
    h2 = font(27, True)
    body = font(24)
    small = font(21)

    draw.text((70, 50), '数据合规AI项目｜工作流流程图（当前骨架 / 目标形态）', font=title_font, fill=TEXT)
    draw.text((70, 118), '第一阶段聚焦：对数据合规相关文件/文本做系统性风险审查；数据库外置；不含 OCR', font=body, fill=MUTED)

    # top level lanes
    draw.text((90, 190), 'A. 项目级三条主工作流（当前已经搭好骨架）', font=h1, fill=TEXT)
    draw_box(draw, 90, 250, 560, 260, '01 输入接收与预处理', [
        '接收文件 / 文本', '→ 提取可处理内容', '→ 轻量清洗与标准化', '→ 文档类型识别', '→ 切分审查单元'
    ], GREEN, h2, body)
    draw_box(draw, 820, 250, 560, 260, '02 合规文件审查', [
        '多路径审查', '→ 调外部规范数据库', '→ 识别潜在风险', '→ 引用溯源', '→ 生成系统性报告'
    ], BLUE, h2, body)
    draw_box(draw, 1550, 250, 560, 260, '03 自动复核回流', [
        '自动二次核验高风险项', '→ 检查依据与证据完整性', '→ 记录错误类型', '→ 修规则 / 修模板 / 记外部依赖问题'
    ], ORANGE, h2, body)
    arrow(draw, 650, 380, 810, 380, color=BLUE)
    arrow(draw, 1380, 380, 1540, 380, color=ORANGE)

    # detail flow
    draw.text((90, 590), 'B. 预计跑通后的核心链路（重点是 02 通用合规文件审查）', font=h1, fill=TEXT)
    xs = [90, 420, 750, 1080, 1410, 1740]
    titles = ['输入文件/文本', '预处理', '文档识别', '多路径审查', '系统性报告', '自动复核']
    colors = [PURPLE, PURPLE, GREEN, BLUE, BLUE, ORANGE]
    line_sets = [
        ['合同 / 隐私政策 /', '数据出境材料 / 其他文本'],
        ['轻量清洗', '标准化分段', '不做 OCR'],
        ['判断更接近哪类', '合规文档', '选择审查路径'],
        ['条款识别 / 规则比对', '/ 风险归纳 / 交叉校验', '依据不足则标“需补依据”'],
        ['固定字段：', '风险点 / 依据 / 原因', '/ 建议 / 自动复核状态'],
        ['高风险默认二次核验', '记录错判原因', '反馈回下一轮']
    ]
    for x, t, c, lines in zip(xs, titles, colors, line_sets):
        draw_box(draw, x, 650, 250, 300, t, lines, c, h2, small)
    for i in range(len(xs) - 1):
        arrow(draw, xs[i] + 250, 800, xs[i + 1] - 10, 800, color=BLUE)

    # bottom notes
    draw.text((90, 1035), 'C. 当前已经做好的“非数据能力”', font=h1, fill=TEXT)
    draw_box(draw, 90, 1090, 640, 300, '已完成', [
        '• 3 条工作流 YAML 骨架',
        '• 输入/输出模板 / 报告模板 / 复核模板',
        '• schema：report / review / regulation(占位)',
        '• 校验脚本 / 报告渲染脚本 / smoke check',
        '• 项目专用 skill 已打包进母包'
    ], GREEN, h2, body)
    draw_box(draw, 790, 1090, 600, 300, '还在等数据的部分', [
        '• 真实合同 / 隐私政策 /',
        '• 数据出境材料样本',
        '• benchmark 标准答案',
        '• 多类文档审查效果实测'
    ], ORANGE, h2, body)
    draw_box(draw, 1450, 1090, 660, 300, '当前边界', [
        '• 第一阶段不做 OCR',
        '• 不做扫描件/图片复杂解析',
        '• 不负责建设数据库本体',
        '• 不把 AI 输出当最终法律意见'
    ], RED, h2, body)

    img.save(out)
    print(out)


if __name__ == '__main__':
    main()
