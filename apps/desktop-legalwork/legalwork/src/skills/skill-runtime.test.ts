import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

  it('loads deferred skill discovery in the background', async () => {
    const skillDir = join(tempRoot, 'background-skill')
    await mkdir(skillDir, { recursive: true })
    await writeFile(join(skillDir, 'SKILL.md'), [
      '---',
      'name: background-skill',
      'description: Loaded after the core runtime is already available.',
      '---',
      '',
      '# Background skill'
    ].join('\n'), 'utf8')

    const runtime = await SkillRuntime.create({
      enabled: true,
      roots: [tempRoot],
      legacySkillMd: true
    }, {
      deferDiscovery: true
    })

    await vi.waitFor(() => {
      expect(runtime.diagnostics().skills).toContainEqual(expect.objectContaining({
        name: 'background-skill'
      }))
    }, { timeout: 5_000 })
  })

  it('finds nested skills from legal work keywords without auto-injecting them', async () => {
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

    const query = '帮我 prepare IPO risk factors for this securities offering memo'
    const matches = runtime.search({ query })
    const resolution = runtime.resolveTurn({ prompt: query, workspace: tempRoot })

    expect(matches[0]).toMatchObject({
      id: 'capital-markets-prepare-ipo-risk-factors',
      reason: 'keywords'
    })
    expect(resolution.activeSkillIds).toEqual([])
    expect(runtime.load('capital-markets-prepare-ipo-risk-factors')?.instructions).toContain('IPO Risk Factors')
    expect(runtime.load('plugin:capital-markets-prepare-ipo-risk-factors')?.instructions)
      .toContain('IPO Risk Factors')
  })

  it('bridges Chinese legal prompts to English skill metadata through search', async () => {
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

    const query = '帮我审查这份 SaaS 服务协议，重点看合同条款风险'
    const matches = runtime.search({ query })
    const resolution = runtime.resolveTurn({ prompt: query, workspace: tempRoot })

    expect(matches[0]).toMatchObject({
      id: 'technology-transactions-review-enterprise-saas-agreement',
      reason: 'keywords'
    })
    expect(resolution.activeSkillIds).toEqual([])
  })

  it('auto-activates native skills while keeping supplemental skills as opt-in fallbacks', async () => {
    const nativeRoot = join(tempRoot, 'native')
    const supplementalRoot = join(tempRoot, 'supplemental')
    const nativeSkill = join(nativeRoot, 'native-contract-review')
    const supplementalSkill = join(supplementalRoot, 'extra-contract-review')
    await mkdir(nativeSkill, { recursive: true })
    await mkdir(supplementalSkill, { recursive: true })
    await writeFile(join(nativeSkill, 'SKILL.md'), [
      '---',
      'name: native-contract-review',
      'description: Review contract agreement clauses and legal risks.',
      '---',
      '# Native contract review'
    ].join('\n'), 'utf8')
    await writeFile(join(nativeSkill, 'skill.json'), JSON.stringify({
      id: 'native-contract-review',
      name: 'native-contract-review',
      description: 'Review contract agreement clauses and legal risks.',
      triggers: { promptPatterns: ['contract agreement'] }
    }), 'utf8')
    await writeFile(join(supplementalSkill, 'SKILL.md'), [
      '---',
      'name: extra-contract-review',
      'description: Review contract agreement clauses with an extra workflow.',
      '---',
      '# Supplemental contract review'
    ].join('\n'), 'utf8')

    const runtime = await SkillRuntime.create({
      enabled: true,
      roots: [supplementalRoot, nativeRoot],
      nativeRoots: [nativeRoot],
      legacySkillMd: true
    })
    const prompt = 'Review this contract agreement and identify clause risks.'

    expect(runtime.resolveTurn({ prompt, workspace: tempRoot }).activeSkillIds)
      .toEqual(['native-contract-review'])
    expect(runtime.search({ query: prompt })[0]).toMatchObject({
      id: 'native-contract-review',
      source: 'native'
    })
    expect(runtime.load('extra-contract-review')).toMatchObject({ source: 'supplemental' })
  })

  it('keeps the Legalwork native implementation when a supplemental skill has the same id', async () => {
    const nativeRoot = join(tempRoot, 'native')
    const supplementalRoot = join(tempRoot, 'supplemental')
    for (const [root, marker] of [
      [nativeRoot, 'LEGALWORK NATIVE IMPLEMENTATION'],
      [supplementalRoot, 'USER SUPPLEMENTAL IMPLEMENTATION']
    ] as const) {
      const skillDir = join(root, 'contract-review')
      await mkdir(skillDir, { recursive: true })
      await writeFile(join(skillDir, 'SKILL.md'), [
        '---',
        'name: contract-review',
        'description: Review contract agreement clauses.',
        '---',
        `# ${marker}`
      ].join('\n'), 'utf8')
    }

    const runtime = await SkillRuntime.create({
      enabled: true,
      // Supplemental deliberately comes first to verify source priority is not
      // an accidental consequence of configured root order.
      roots: [supplementalRoot, nativeRoot],
      nativeRoots: [nativeRoot],
      legacySkillMd: true
    })

    expect(runtime.load('contract-review')).toMatchObject({ source: 'native' })
    expect(runtime.load('contract-review')?.instructions).toContain('LEGALWORK NATIVE IMPLEMENTATION')
    expect(runtime.load('contract-review')?.instructions).not.toContain('USER SUPPLEMENTAL IMPLEMENTATION')
    expect(runtime.diagnostics().validationErrors).toContainEqual(expect.objectContaining({
      root: join(supplementalRoot, 'contract-review'),
      message: expect.stringContaining('Legalwork native skill takes priority')
    }))
  })

  it('still allows an explicitly named supplemental skill for a confirmed capability gap', async () => {
    const supplementalRoot = join(tempRoot, 'supplemental')
    const skillDir = join(supplementalRoot, 'legacy-word-annotations')
    await mkdir(skillDir, { recursive: true })
    await writeFile(join(skillDir, 'SKILL.md'), [
      '---',
      'name: legacy-word-annotations',
      'description: Adds legacy Word annotations unsupported by the native path.',
      '---',
      '# Legacy Word annotations'
    ].join('\n'), 'utf8')
    const runtime = await SkillRuntime.create({
      enabled: true,
      roots: [supplementalRoot],
      legacySkillMd: true
    })

    expect(runtime.resolveTurn({
      prompt: '原生路径缺少旧版批注支持，请使用 @legacy-word-annotations 补齐。',
      workspace: tempRoot
    }).activeSkillIds).toEqual(['legacy-word-annotations'])
  })
})
