#!/bin/bash
set -euo pipefail

export IMA_PYTHON_SCRIPT="/Users/xiangyang/Desktop/legalwork/apps/desktop-legalwork/scripts/ima-mcp-server.py"
exec "$HOME/.ima-web-mcp/ima-web-serve.sh" "${1:-start}"
