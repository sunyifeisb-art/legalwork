#!/usr/bin/env python3
"""
LegalWork Skill 统一入口

用法:
    python3 run_skill.py <skill-name> <input-file> [--output-dir DIR]

示例:
    python3 run_skill.py legal-case-analysis /path/to/case.pdf
    python3 run_skill.py fact-extraction /path/to/evidence.jpg
    python3 run_skill.py evidence-catalog /path/to/卷宗目录/ --batch
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from skill_engine.runner import main

if __name__ == "__main__":
    raise SystemExit(main())
