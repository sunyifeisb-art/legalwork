#!/bin/bash
# LegalWork 统一启动入口
# 自动激活项目虚拟环境并运行 ocr_agent.py

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -d ".venv" ]; then
    echo "未找到 .venv，请先运行 ./setup.sh"
    exit 1
fi

source .venv/bin/activate
python3 ocr_agent.py "$@"
