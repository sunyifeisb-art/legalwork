#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] || 'skills'
const includeImported = process.argv.includes('--include-imported')
const json = process.argv.includes('--json')

const checks = [
  ['manifest', (dir, _text) => existsSync(join(dir, 'skill.json'))],
  ['trigger_terms', (dir, text) => /何时使用|触发|适用场景|when to use/i.test(text) || hasManifestTriggers(dir)],
  ['workflow', (_dir, text) => /操作步骤|流程|workflow|步骤|procedure/i.test(text)],
  ['deliverables', (_dir, text) => /输出格式|输出物|交付|deliverable|报告|清单|表格/i.test(text)],
  ['validation', (_dir, text) => /质量检查|检查清单|验证|校验|自检|audit/i.test(text)],
  ['software', (_dir, text) => /Legalwork|工作区|附件|read|write|bash|工具|文件|证据表/i.test(text)]
]

function hasManifestTriggers(dir) {
  const manifestPath = join(dir, 'skill.json')
  if (!existsSync(manifestPath)) return false
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const triggers = manifest && typeof manifest === 'object' ? manifest.triggers : null
    if (!triggers || typeof triggers !== 'object') return false
    return ['commands', 'promptPatterns', 'fileTypes'].some((key) =>
      Array.isArray(triggers[key]) && triggers[key].length > 0
    )
  } catch {
    return false
  }
}

const rows = []
for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  if (!includeImported && entry.name === 'awesome-legal-aiagent-skills') continue
  const dir = join(root, entry.name)
  const skillPath = join(dir, 'SKILL.md')
  if (!existsSync(skillPath)) continue
  const text = readFileSync(skillPath, 'utf8')
  const result = Object.fromEntries(checks.map(([name, fn]) => [name, Boolean(fn(dir, text))]))
  const score = Object.values(result).filter(Boolean).length
  rows.push({
    skill: entry.name,
    score,
    maxScore: checks.length,
    chars: text.length,
    missing: checks.map(([name]) => name).filter((name) => !result[name]),
    checks: result
  })
}

rows.sort((a, b) => a.score - b.score || a.chars - b.chars || a.skill.localeCompare(b.skill))

if (json) {
  console.log(JSON.stringify({ root, count: rows.length, rows }, null, 2))
} else {
  console.log('Skill quality audit: ' + rows.length + ' skills under ' + root)
  for (const row of rows) {
    console.log(row.score + '/' + row.maxScore + '\t' + String(row.chars).padStart(6) + ' chars\t' + row.skill + '\tmissing: ' + (row.missing.join(',') || '-'))
  }
}
