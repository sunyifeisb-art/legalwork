import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SkillRuntime } from './skill-runtime'

describe('SkillRuntime', () => {
  let tempRoot = ''

  beforeEach(async () => {
    tempRoot = await mkdtemp(join(tmpdir(), 'legalwork-skills-'))
  })

  afterEach(async () => {
    await rm(tempRoot, { recursive: true, force: true })
  })

  it('discovers nested Harvey-style legacy skills by task_id', async () => {
    const skillDir = join(
      tempRoot,
      'awesome-legal-aiagent-skills',
      'emerging-companies-venture-capital',
      'identify-spa-issues',
      'scenario-01'
    )
    await mkdir(skillDir, { recursive: true })
    await writeFile(join(skillDir, 'SKILL.md'), [
      '---',
      'name: ecvc-identify-spa-issues-scenario-01',
      'task_id: emerging-companies-venture-capital/identify-spa-issues/scenario-01',
      'description: Identifying issues in a Series B preferred stock purchase agreement from the company perspective.',
      'activates_for: [planner, solver, checker]',
      '---',
      '',
      '# Skill: Identify SPA Issues — Scenario 01',
      '',
      'Use preferred-stock purchase agreement issue-spotting workflow.'
    ].join('\n'), 'utf8')

    const runtime = await SkillRuntime.create({
      enabled: true,
      roots: [tempRoot],
      legacySkillMd: true
    })

    const diagnostics = runtime.diagnostics()
    expect(diagnostics.skills).toContainEqual(expect.objectContaining({
      id: 'emerging-companies-venture-capital-identify-spa-issues-scenario-01',
      name: 'ecvc-identify-spa-issues-scenario-01',
      legacy: true
    }))
  })

  it('activates nested skills from legal work keywords without explicit mention', async () => {
    const skillDir = join(tempRoot, 'capital-markets', 'prepare-ipo-risk-factors')
    await mkdir(skillDir, { recursive: true })
    await writeFile(join(skillDir, 'SKILL.md'), [
      '---',
      'name: prepare-ipo-risk-factors',
      'task_id: capital-markets/prepare-ipo-risk-factors',
      'description: Drafts IPO risk factors and capital-markets disclosure sections for securities offerings.',
      'activates_for: [planner, solver, checker]',
      '---',
      '',
      '# Skill: IPO Risk Factors',
      '',
      'Structure risk-factor disclosure by issuer, industry, offering, and regulatory risk.'
    ].join('\n'), 'utf8')

    const runtime = await SkillRuntime.create({
      enabled: true,
      roots: [tempRoot],
      legacySkillMd: true
    })

    const resolution = runtime.resolveTurn({
      prompt: '帮我 prepare IPO risk factors for this securities offering memo',
      workspace: tempRoot
    })

    expect(resolution.activeSkillIds).toEqual(['capital-markets-prepare-ipo-risk-factors'])
    expect(resolution.activations[0]).toMatchObject({
      skillId: 'capital-markets-prepare-ipo-risk-factors',
      reason: 'keywords'
    })
    expect(resolution.instructions.join('\n')).toContain('IPO Risk Factors')
  })

  it('bridges Chinese legal prompts to English skill metadata', async () => {
    const skillDir = join(tempRoot, 'technology-transactions', 'review-enterprise-saas-agreement')
    await mkdir(skillDir, { recursive: true })
    await writeFile(join(skillDir, 'SKILL.md'), [
      '---',
      'name: review-enterprise-saas-agreement',
      'task_id: technology-transactions/review-enterprise-saas-agreement',
      'description: Reviews enterprise SaaS agreement clauses for allocation of contract risk.',
      'activates_for: [planner, solver, checker]',
      '---',
      '',
      '# Skill: Enterprise SaaS Agreement Review'
    ].join('\n'), 'utf8')

    const runtime = await SkillRuntime.create({
      enabled: true,
      roots: [tempRoot],
      legacySkillMd: true
    })

    const resolution = runtime.resolveTurn({
      prompt: '帮我审查这份 SaaS 服务协议，重点看合同条款风险',
      workspace: tempRoot
    })

    expect(resolution.activeSkillIds).toEqual(['technology-transactions-review-enterprise-saas-agreement'])
    expect(resolution.activations[0]).toMatchObject({
      skillId: 'technology-transactions-review-enterprise-saas-agreement',
      reason: 'keywords'
    })
  })
})
