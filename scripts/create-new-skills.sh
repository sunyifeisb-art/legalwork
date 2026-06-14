#!/usr/bin/env bash
# 批量创建 Phase 3 的 7 个新技能
set -euo pipefail

SKILLS_DIR="/Users/xiangyang/Desktop/legalwork/skills"

mkdir -p "$SKILLS_DIR/case_notebook" \
         "$SKILLS_DIR/legal_time_management" \
         "$SKILLS_DIR/team_knowledge_sharing" \
         "$SKILLS_DIR/meeting_minutes" \
         "$SKILLS_DIR/new_legislation_analysis" \
         "$SKILLS_DIR/legal_professional_philosophy" \
         "$SKILLS_DIR/legal_professional_growth"

echo "✅ 目录创建完成"

# Generate skill.json for each
cat > "$SKILLS_DIR/case_notebook/skill.json" << 'JSONEOF'
{
  "name": "case-notebook",
  "description": "办案手记：案件核心工作底稿的全流程生成与管理",
  "version": "0.1.0",
  "entry": "SKILL.md",
  "triggers": {
    "commands": ["/notebook"],
    "promptPatterns": ["办案手记|工作底稿|案件底稿|案件笔记|办案笔记"],
    "fileTypes": []
  },
  "allowedTools": [],
  "assets": [],
  "priority": 0
}
JSONEOF

cat > "$SKILLS_DIR/legal_time_management/skill.json" << 'JSONEOF'
{
  "name": "legal-time-management",
  "description": "律师时间管理：多案件并行时间规划、倒排工期与效率提升",
  "version": "0.1.0",
  "entry": "SKILL.md",
  "triggers": {
    "commands": ["/timemanage"],
    "promptPatterns": ["时间管理|时间规划|多案件并行|倒排工期|日程安排|优先级"],
    "fileTypes": []
  },
  "allowedTools": [],
  "assets": [],
  "priority": 0
}
JSONEOF

cat > "$SKILLS_DIR/team_knowledge_sharing/skill.json" << 'JSONEOF'
{
  "name": "team-knowledge-sharing",
  "description": "团队知识共享：知识整理表格、一问一答式沉淀、团队内共享机制",
  "version": "0.1.0",
  "entry": "SKILL.md",
  "triggers": {
    "commands": ["/teamshare"],
    "promptPatterns": ["知识整理|知识共享|团队共享|知识沉淀|一问一答|知识库"],
    "fileTypes": []
  },
  "allowedTools": [],
  "assets": [],
  "priority": 0
}
JSONEOF

cat > "$SKILLS_DIR/meeting_minutes/skill.json" << 'JSONEOF'
{
  "name": "meeting-minutes",
  "description": "会议记录：法律会议/案件讨论会的结构化记录与待办追踪",
  "version": "0.1.0",
  "entry": "SKILL.md",
  "triggers": {
    "commands": ["/meeting"],
    "promptPatterns": ["会议记录|会议纪要|案件讨论|案情沟通会|会议录音"],
    "fileTypes": []
  },
  "allowedTools": [],
  "assets": [],
  "priority": 0
}
JSONEOF

cat > "$SKILLS_DIR/new_legislation_analysis/skill.json" << 'JSONEOF'
{
  "name": "new-legislation-analysis",
  "description": "新法分析：新法出台后的分析文章撰写与业务影响评估",
  "version": "0.1.0",
  "entry": "SKILL.md",
  "triggers": {
    "commands": ["/newlaw"],
    "promptPatterns": ["新法|新法规|新出台|立法动态|法规解读|法律修订"],
    "fileTypes": []
  },
  "allowedTools": [],
  "assets": [],
  "priority": 0
}
JSONEOF

cat > "$SKILLS_DIR/legal_professional_philosophy/skill.json" << 'JSONEOF'
{
  "name": "legal-professional-philosophy",
  "description": "律师职业理念：以终为始、共情之心、综合智慧、全程担当的职业哲学",
  "version": "0.1.0",
  "entry": "SKILL.md",
  "triggers": {
    "commands": ["/philosophy"],
    "promptPatterns": ["职业理念|律师价值观|执业哲学|以终为始|共情|信任|败诉"],
    "fileTypes": []
  },
  "allowedTools": [],
  "assets": [],
  "priority": 0
}
JSONEOF

cat > "$SKILLS_DIR/legal_professional_growth/skill.json" << 'JSONEOF'
{
  "name": "legal-professional-growth",
  "description": "律师成长进阶：经验转化、知识沉淀、AI时代法律人发展路径",
  "version": "0.1.0",
  "entry": "SKILL.md",
  "triggers": {
    "commands": ["/growth"],
    "promptPatterns": ["成长|进阶|律师成长|经验转化|知识沉淀|复盘|一鱼多吃|AI时代"],
    "fileTypes": []
  },
  "allowedTools": [],
  "assets": [],
  "priority": 0
}
JSONEOF

echo "✅ 所有 skill.json 生成完成"
