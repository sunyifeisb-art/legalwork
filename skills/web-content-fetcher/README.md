# web-content-fetcher

OpenClaw Skill — 网页正文提取，永久免费，支持微信公众号。

## 文件结构

```
web-content-fetcher/
├── SKILL.md          # OpenClaw skill 描述文件（必须）
├── README.md         # 本文件
├── requirements.txt  # Python 依赖
└── scripts/
    └── fetch.py      # Scrapling + html2text 提取脚本
```

## 快速安装

1. 将整个 `web-content-fetcher/` 目录放到你的 OpenClaw workspace skills 目录：
   ```
   ~/.codex/skills/web-content-fetcher/
   ```

2. 安装 Python 依赖：
   ```bash
   python3 -m pip install -r ~/.codex/skills/web-content-fetcher/requirements.txt
   ```

3. 重启 OpenClaw，skill 自动生效。

## 单独使用脚本

不需要 OpenClaw，直接命令行：

```bash
python3 scripts/fetch.py https://mp.weixin.qq.com/s/xxx 30000
```

输出为干净的 Markdown 正文，可重定向到文件：

```bash
python3 scripts/fetch.py https://example.com/article > output.md
```

## 支持平台

| 平台 | 方案 | 状态 |
|------|------|------|
| 微信公众号 | Scrapling | ✅ |
| Substack | Scrapling / Jina | ✅ |
| Medium | Scrapling / Jina | ✅ |
| GitHub | web_fetch | ✅ |
| 知乎 | Scrapling | ✅ |
| CSDN | Scrapling | ✅ |
| 小红书 | ❌ 需登录态 | ❌ |

## 提取效果

返回标准 Markdown，保留：
- 标题层级（`# ## ###`）
- 超链接 `[文字](url)`
- 图片 `![alt](url)`
- 列表、代码块、引用块

## 作者

石臻说AI · OpenClaw 实战系列
