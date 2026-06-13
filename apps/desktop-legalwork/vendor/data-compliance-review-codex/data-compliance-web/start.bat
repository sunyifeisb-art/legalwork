@echo off
chcp 65001 >nul

:: 数据合规智能审查系统 - Windows 启动脚本

echo ==============================================
echo 数据合规智能审查系统
echo ==============================================

:: 检查 Python 是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Python
    echo 请先安装 Python3: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✓ 找到 Python

:: 获取脚本所在目录
cd /d "%~dp0"

:: 检查并创建虚拟环境
if not exist "venv" (
    echo → 正在创建虚拟环境...
    python -m venv venv
)

:: 激活虚拟环境
echo → 激活虚拟环境...
call venv\Scripts\activate.bat

:: 安装依赖
echo → 安装依赖...
pip install -q -r requirements.txt

if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo ✓ 依赖安装完成

:: 检查原项目代码是否存在
if not exist "scripts" (
    echo ⚠️ 警告: 未找到 scripts/ 目录
    echo 请先复制原项目的 scripts/ 和 config/ 目录到当前文件夹
    pause
    exit /b 1
)

echo.
echo ==============================================
echo 正在启动服务...
echo 浏览器将自动打开 http://127.0.0.1:5000
echo 按 Ctrl+C 停止服务
echo ==============================================
echo.

:: 启动应用
python app.py

pause
