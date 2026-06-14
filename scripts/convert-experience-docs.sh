#!/bin/bash
# 批量转换经验分享 .docx → .md，存入 knowledge-base/experience-sharing/
set -euo pipefail

SRC="/Users/xiangyang/Documents/实习案件/经验分享"
DST="/Users/xiangyang/Desktop/legalwork/knowledge-base/experience-sharing"

echo "=== 开始批量转换 .docx → .md ==="

convert_docx() {
  local src_file="$1"
  local dst_file="$2"
  local dst_dir
  dst_dir="$(dirname "$dst_file")"
  
  mkdir -p "$dst_dir"
  
  echo "  Converting: $(basename "$src_file")"
  textutil -convert txt -stdout "$src_file" 2>/dev/null > "$dst_file" || {
    echo "  ⚠️  textutil failed for $(basename "$src_file")" >&2
    echo "*（此文档转换失败）" > "$dst_file"
    return
  }
  
  if [ ! -s "$dst_file" ]; then
    echo "  ⚠️  Empty output for $(basename "$src_file")" >&2
    echo "*（此文档为空或转换失败）" >> "$dst_file"
  fi
}

sanitize_name() {
  # Replace spaces and special chars with underscores for file naming
  echo "$1" | sed -e 's/ /_/g' -e 's/（/_/g' -e 's/）/]/g' -e 's/(/_/g' -e 's/)/]/g' -e 's/[/_/g' -e 's/]/]/g'
}

process_dir() {
  local src_dir="$1"
  local dst_dir="$2"
  local label="$3"
  echo ""
  echo "[$label]"
  mkdir -p "$dst_dir"
  
  while IFS= read -r -d '' f; do
    local basename_noext
    basename_noext=$(basename "$f" .docx | sed 's/ /_/g')
    convert_docx "$f" "$dst_dir/${basename_noext}.md"
  done < <(find "$src_dir" -maxdepth 1 -name '*.docx' -print0 2>/dev/null || true)
}

process_dir "$SRC/法律调研"              "$DST/法律调研"             "法律调研"
process_dir "$SRC/日常基本工作方法"      "$DST/日常基本工作方法"     "日常基本工作方法"
process_dir "$SRC/价值观及律师执业理念"  "$DST/价值观及律师执业理念" "价值观及律师执业理念"
process_dir "$SRC/时间管理"              "$DST/时间管理"             "时间管理"
process_dir "$SRC/团队管理篇"            "$DST/团队管理"             "团队管理"
process_dir "$SRC/成长及进步"            "$DST/成长及进步"           "成长及进步"
process_dir "$SRC/案件准备"              "$DST/案件准备"             "案件准备"

# 新人入门篇 (嵌套在案件准备下)
if [ -d "$SRC/案件准备/新人入门篇" ]; then
  process_dir "$SRC/案件准备/新人入门篇"  "$DST/新人入门篇"           "新人入门篇"
fi

echo ""
echo "=== 转换完成 ==="
echo "输出目录: $DST"
