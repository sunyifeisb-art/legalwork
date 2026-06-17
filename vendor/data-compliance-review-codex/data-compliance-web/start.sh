#!/bin/bash

# 数据合规智能审查系统 - macOS/Linux 启动脚本

echo "=============================================="
echo "数据合规智能审查系统"
echo "=============================================="

# 检查 Python 是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python3"
    echo "请先安装 Python3: https://www.python.org/downloads/"
    exit 1
fi

echo "✓ 找到 Python3"

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 检查并创建虚拟环境
if [ ! -d "venv" ]; then
    echo "→ 正在创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
echo "→ 激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo "→ 安装依赖..."
pip install -q -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✓ 依赖安装完成"

# 检查原项目代码是否存在
if [ ! -d "scripts" ] || [ ! -d "config" ]; then
    echo "⚠️ 警告: 未找到 scripts/ 或 config/ 目录"
    echo "请先复制原项目的 scripts/ 和 config/ 目录到当前文件夹"
    exit 1
fi

echo ""
echo "=============================================="
echo "正在启动服务..."
echo "浏览器将自动打开 http://127.0.0.1:5000"
echo "按 Ctrl+C 停止服务"
echo "=============================================="
echo ""

# 启动应用
python3 app.py
