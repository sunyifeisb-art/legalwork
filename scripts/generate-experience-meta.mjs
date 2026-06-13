#!/usr/bin/env node
/**
 * 为 knowledge-base/experience-sharing/ 下的所有 .md 文档生成 KnowledgeMeta 侧车文件。
 * 每个 .md 文件对应一个 .meta.json 文件，包含 tags, category, source, author, confidence 等元数据。
 *
 * 用法: node scripts/generate-experience-meta.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const KB_DIR = new URL('../knowledge-base/experience-sharing', import.meta.url).pathname

const CATEGORY_MAP = {
  '法律调研': { tags: ['法律调研', '法律检索', '研究方法'], confidence: 'high' },
  '日常基本工作方法': { tags: ['基本工作方法', 'SOP', '工作流程'], confidence: 'high' },
  '价值观及律师执业理念': { tags: ['职业理念', '价值观', '执业哲学'], confidence: 'medium' },
  '时间管理': { tags: ['时间管理', '效率提升', '多案件并行'], confidence: 'high' },
  '团队管理': { tags: ['团队管理', '知识整理', 'SOP化', '项目管理'], confidence: 'high' },
  '成长及进步': { tags: ['个人成长', '经验转化', '职业发展'], confidence: 'medium' },
  '案件准备': { tags: ['案件准备', '庭审技巧', '诉讼策略', '证据'], confidence: 'high' },
  '新人入门篇': { tags: ['新人入门', '实习律师', '职业入门'], confidence: 'medium' }
}

const CONFIDENCE_KEYS = Object.keys(CATEGORY_MAP)
const AUTHOR = '律所团队经验分享'
const SOURCE = '团队内部经验分享文档库'

function generateMeta(mdPath, categoryName) {
  const content = readFileSync(mdPath, 'utf-8')
  const baseName = mdPath.split('/').pop().replace(/\.md$/, '')
  const catConfig = CATEGORY_MAP[categoryName] || { tags: ['未分类'], confidence: 'medium' }

  // Generate tags from title keywords
  const titleTags = baseName
    .replace(/[（(][^)）]*[)）]/g, '') // remove parenthesized content
    .replace(/[0-9]+[.、]/, '') // remove leading numbers
    .split(/[ _,，、：:]/)
    .filter(t => t && t.length >= 2 && !/^[（(]/.test(t))
    .slice(0, 4)

  const meta = {
    tags: [...new Set([...catConfig.tags, ...titleTags])],
    category: `经验分享/${categoryName}`,
    deprecated: false,
    source: SOURCE,
    author: AUTHOR,
    confidence: catConfig.confidence,
    reviewStatus: 'reviewed',
    version: '1.0.0'
  }

  return meta
}

function walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const results = []
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('.')) {
      results.push(fullPath)
    }
  }
  return results
}

// Walk the knowledge base directory and generate meta files
const categoryDirs = readdirSync(KB_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('.'))

let totalMetaFiles = 0

for (const catDir of categoryDirs) {
  const catName = catDir.name
  const catFullPath = join(KB_DIR, catName)
  const mdFiles = walkDir(catFullPath)

  for (const mdPath of mdFiles) {
    const metaPath = mdPath.replace(/\.md$/, '.meta.json')
    // Skip if meta already exists and is newer than md
    if (existsSync(metaPath)) {
      const mdStat = statSync(mdPath)
      const metaStat = statSync(metaPath)
      if (metaStat.mtime >= mdStat.mtime) continue
    }

    const meta = generateMeta(mdPath, catName)
    writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
    totalMetaFiles++
    console.log(`  ✓ ${relative(KB_DIR, metaPath)}`)
  }
}

console.log(`\n✅ 生成 ${totalMetaFiles} 个元数据文件`)
