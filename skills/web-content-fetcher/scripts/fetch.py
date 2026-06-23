#!/usr/bin/env python3
"""
通用网页正文提取脚本（基于 Scrapling + html2text）
返回干净的 Markdown 格式，效果与 Jina Reader 相当。
用于 article-writer skill 的二级内容提取方案（Jina 超限或失败时使用）

用法：
  python3 fetch.py <url> [max_chars]

示例：
  python3 fetch.py https://example.com/article 12000
  python3 fetch.py https://mp.weixin.qq.com/s/xxx 30000

输出：
  Markdown 格式正文，截断至 max_chars（默认 30000）
  图片使用原始 URL 内嵌在 Markdown 中（data-src 懒加载已自动处理）
"""

import sys
import re
import certifi
import html2text
from scrapling.engines.static import FetcherClient


def fix_lazy_images(html_raw):
    """
    微信公众号等平台用 data-src 懒加载图片，src 为占位符。
    将 data-src 的值提升为 src，确保 html2text 能正确渲染图片。
    """
    # 先把 data-src 提升为 src（如果 src 不存在或是占位）
    html_raw = re.sub(
        r'<img([^>]*?)\sdata-src="([^"]+)"([^>]*?)>',
        lambda m: f'<img{m.group(1)} src="{m.group(2)}"{m.group(3)}>',
        html_raw
    )
    return html_raw


def scrapling_fetch(url, max_chars=30000):
    try:
        page = FetcherClient(verify=certifi.where()).get(
            url,
            headers={"Referer": "https://www.google.com/search?q=site"}
        )
    except Exception as e:
        msg = str(e).lower()
        if 'certificate' in msg or 'curl: (60)' in msg or 'ssl' in msg:
            page = FetcherClient(verify=False).get(
                url,
                headers={"Referer": "https://www.google.com/search?q=site"}
            )
        else:
            raise

    h = html2text.HTML2Text()
    h.ignore_links = False
    h.ignore_images = False
    h.body_width = 0  # 不自动换行

    # 微信公众号专用选择器
    if "mp.weixin.qq.com" in url:
        selectors = ["div#js_content", "div.rich_media_content"]
    else:
        selectors = [
            'article',
            'main',
            '.post-content',
            '.entry-content',
            '.article-body',
            '[class*="body"]',
            '[class*="content"]',
            '[class*="article"]',
        ]

    for selector in selectors:
        els = page.css(selector)
        if els:
            html_raw = fix_lazy_images(els[0].html_content)
            md = h.handle(html_raw)
            md = re.sub(r'\n{3,}', '\n\n', md).strip()
            if len(md) > 300:
                return md[:max_chars], selector

    # fallback：全页转 Markdown
    html_raw = fix_lazy_images(page.html_content)
    md = h.handle(html_raw)
    md = re.sub(r'\n{3,}', '\n\n', md).strip()
    return md[:max_chars], 'body(fallback)'


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python3 fetch.py <url> [max_chars]", file=sys.stderr)
        sys.exit(1)

    url = sys.argv[1]
    max_chars = int(sys.argv[2]) if len(sys.argv) > 2 else 30000

    text, selector = scrapling_fetch(url, max_chars)
    print(text)
