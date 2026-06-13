#!/bin/bash
# LegalWork 项目环境初始化脚本
# 在项目目录下创建 Python 3.12 虚拟环境并安装 OCR 依赖

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PYTHON_BIN="${PYTHON_BIN:-/opt/homebrew/bin/python3.12}"

if [ ! -f "$PYTHON_BIN" ]; then
    echo "未找到 Python 3.12: $PYTHON_BIN"
    echo "请安装 Python 3.12 后重试，或通过环境变量指定: PYTHON_BIN=/path/to/python3.12 ./setup.sh"
    exit 1
fi

echo "使用 Python: $PYTHON_BIN"

if [ -d ".venv" ]; then
    echo "发现已有 .venv，是否删除重建？（y/N）"
    read -r answer
    if [[ "$answer" =~ ^[Yy]$ ]]; then
        rm -rf .venv
    else
        echo "保留现有 .venv，执行更新依赖..."
        source .venv/bin/activate
        pip install -r requirements.txt
        exit 0
    fi
fi

"$PYTHON_BIN" -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "安装完成。使用方式："
echo "  source .venv/bin/activate"
echo "  python3 ocr_agent.py auto 你的文件.pdf"
