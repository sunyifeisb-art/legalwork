import { existsSync } from 'node:fs'
import { cp, mkdir, readdir, readFile, stat } from 'node:fs/promises'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { homedir } from 'node:os'
import { z } from 'zod'
import type { SkillsCapabilityConfig } from '../contracts/capabilities.js'

const DEFAULT_ACTIVE_LIMIT = 3
const DEFAULT_INSTRUCTION_BUDGET_BYTES = 24_000
const DEFAULT_DISCOVERY_DEPTH = 5
export const DEFAULT_USER_SKILL_ROOT = join(homedir(), '.legalwork', 'skills')

const LEGALWORK_SKILL_EXECUTION_CONTRACT = [
  'Legalwork Skill Execution Contract:',
  '- Treat the active skill as an operational workflow for the current Legalwork matter, not as background reading.',
  '- Ground the work in the current prompt, workspace files, attachments, and available tools; inspect relevant evidence before drafting conclusions when the task depends on local material.',
  '- Convert the skill procedure into concrete deliverables: issue lists, evidence tables, timelines, drafting sections, risk ratings, checklists, or saved workspace artifacts when appropriate.',
  '- Preserve legal-work safeguards: distinguish facts from assumptions, cite sources or file evidence when available, flag missing inputs, and avoid inventing statutes, cases, deadlines, or client facts.',
  '- Finish with a matter-specific quality check derived from the skill, unless the user only asked for a quick answer.'
].join('\n')

const SkillTriggerManifest = z.object({
  commands: z.array(z.string().min(1)).default([]),
  promptPatterns: z.array(z.string().min(1)).default([]),
  fileTypes: z.array(z.string().min(1)).default([])
}).default({ commands: [], promptPatterns: [], fileTypes: [] })

export const SkillManifest = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().default('0.0.0'),
  entry: z.string().min(1).default('SKILL.md'),
  triggers: SkillTriggerManifest,
  allowedTools: z.array(z.string().min(1)).default([]),
  assets: z.array(z.string().min(1)).default([]),
  priority: z.number().int().default(0)
}).strict()
export type SkillManifest = z.infer<typeof SkillManifest>

export type LoadedSkill = {
  id: string
  name: string
  description?: string
  version: string
  root: string
  entryPath: string
  entry: string
  triggers: z.infer<typeof SkillTriggerManifest>
  allowedTools: string[]
  assets: string[]
  priority: number
  legacy: boolean
  keywords: string[]
}

export type SkillActivation = {
  skillId: string
  reason: string
  score: number
}

export type SkillTurnResolution = {
  activeSkillIds: string[]
  activations: SkillActivation[]
  instructions: string[]
  allowedToolNames?: string[]
  injectedBytes: number
}

export type SkillSearchResult = {
  id: string
  name: string
  description?: string
  root: string
  entryPath: string
  legacy: boolean
  triggers: LoadedSkill['triggers']
  allowedTools: string[]
  score: number
  reason: string
}

export type LoadedSkillInstructions = Omit<SkillSearchResult, 'score' | 'reason'> & {
  instructions: string
}

export type SkillRuntimeDiagnostics = {
  enabled: boolean
  roots: string[]
  skills: Array<{
    id: string
    name: string
    description?: string
    version: string
    root: string
    legacy: boolean
    triggers: LoadedSkill['triggers']
    allowedTools: string[]
  }>
  validationErrors: Array<{ root: string; message: string }>
  lastActivations: SkillActivation[]
  lastInjection?: {
    activeSkillIds: string[]
    injectedBytes: number
    budgetBytes: number
    blockedToolNames: string[]
  }
}

export type SkillRuntimeOptions = {
  activeLimit?: number
  instructionBudgetBytes?: number
  onRootsChanged?: (roots: string[]) => Promise<void> | void
}

export type SkillRuntimeChangeListener = (roots: string[]) => Promise<void> | void

export class SkillRuntime {
  private skills: LoadedSkill[]
  private validationErrors: Array<{ root: string; message: string }>
  private lastActivations: SkillActivation[] = []
  private lastInjection: SkillRuntimeDiagnostics['lastInjection']

  private constructor(
    private config: SkillsCapabilityConfig,
    private readonly options: Required<SkillRuntimeOptions>,
    loaded: { skills: LoadedSkill[]; validationErrors: Array<{ root: string; message: string }> }
  ) {
    this.skills = loaded.skills
    this.validationErrors = loaded.validationErrors
  }

  static async create(
    config: SkillsCapabilityConfig | undefined,
    options: SkillRuntimeOptions = {}
  ): Promise<SkillRuntime> {
    const normalized = config ?? { enabled: false, roots: [], legacySkillMd: true }
    const resolvedOptions = {
      activeLimit: options.activeLimit ?? DEFAULT_ACTIVE_LIMIT,
      instructionBudgetBytes: options.instructionBudgetBytes ?? DEFAULT_INSTRUCTION_BUDGET_BYTES,
      onRootsChanged: options.onRootsChanged ?? (() => undefined)
    }
    const loaded = normalized.enabled
      ? await discoverSkills(normalized)
      : { skills: [], validationErrors: [] }
    return new SkillRuntime(normalized, resolvedOptions, loaded)
  }

  async refresh(): Promise<void> {
    const loaded = this.config.enabled
      ? await discoverSkills(this.config)
      : { skills: [], validationErrors: [] }
    this.skills = loaded.skills
    this.validationErrors = loaded.validationErrors
  }

  async addRoot(root: string): Promise<void> {
    const resolved = resolve(root)
    if (!this.config.roots.includes(resolved)) {
      this.config.roots.push(resolved)
      this.config.enabled = true
      await this.refresh()
      await this.options.onRootsChanged?.([...this.config.roots])
    }
  }

  async removeRoot(root: string): Promise<void> {
    const resolved = resolve(root)
    const index = this.config.roots.indexOf(resolved)
    if (index >= 0) {
      this.config.roots.splice(index, 1)
      await this.refresh()
      await this.options.onRootsChanged?.([...this.config.roots])
    }
  }

  async installFromPath(sourcePath: string, overwrite = false): Promise<{
    skillName: string
    sourcePath: string
    targetPath: string
    userSkillRoot: string
  }> {
    const resolvedSource = resolve(sourcePath)
    if (!(await isSkillDirectory(resolvedSource))) {
      throw new Error(`Source path is not a valid skill directory: ${resolvedSource}`)
    }
    const skillName = basename(resolvedSource)
    const userSkillRoot = DEFAULT_USER_SKILL_ROOT
    const targetPath = join(userSkillRoot, skillName)

    if (existsSync(targetPath) && !overwrite) {
      throw new Error(
        `Skill '${skillName}' is already installed. Use overwrite: true to replace it.`
      )
    }

    await mkdir(userSkillRoot, { recursive: true })
    await cp(resolvedSource, targetPath, {
      recursive: true,
      force: true,
      filter: (src) => {
        const relative = src.slice(resolvedSource.length + 1)
        if (!relative) return true
        const top = relative.split(/[/\\]/)[0]
        return !['.git', '.venv', '__pycache__', 'node_modules', '.DS_Store'].includes(top ?? '')
      }
    })

    await this.addRoot(userSkillRoot)
    return { skillName, sourcePath: resolvedSource, targetPath, userSkillRoot }
  }

  resolveTurn(input: {
    prompt: string
    workspace: string
    filePaths?: readonly string[]
  }): SkillTurnResolution {
    if (!this.config.enabled) return emptyResolution()
    const matches = this.matchSkills(input)
    const active = matches.slice(0, this.options.activeLimit)
    const injection = buildInjection(active, this.options.instructionBudgetBytes)
    const blockedToolNames = blockedToolsFor(this.skills, injection.allowedToolNames)
    this.lastActivations = active.map(({ skill, reason, score }) => ({
      skillId: skill.id,
      reason,
      score
    }))
    this.lastInjection = {
      activeSkillIds: injection.activeSkillIds,
      injectedBytes: injection.injectedBytes,
      budgetBytes: this.options.instructionBudgetBytes,
      blockedToolNames
    }
    return {
      activeSkillIds: injection.activeSkillIds,
      activations: this.lastActivations,
      instructions: injection.instructions,
      ...(injection.allowedToolNames ? { allowedToolNames: injection.allowedToolNames } : {}),
      injectedBytes: injection.injectedBytes
    }
  }

  diagnostics(): SkillRuntimeDiagnostics {
    return {
      enabled: this.config.enabled,
      roots: [...this.config.roots],
      skills: this.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        ...(skill.description ? { description: skill.description } : {}),
        version: skill.version,
        root: skill.root,
        legacy: skill.legacy,
        triggers: skill.triggers,
        allowedTools: skill.allowedTools
      })),
      validationErrors: [...this.validationErrors],
      lastActivations: [...this.lastActivations],
      ...(this.lastInjection ? { lastInjection: this.lastInjection } : {})
    }
  }

  count(): number {
    return this.skills.length
  }

  search(input: { query?: string; limit?: number } = {}): SkillSearchResult[] {
    const query = input.query?.trim() ?? ''
    const limit = clampLimit(input.limit, 20, 100)
    const lowerQuery = query.toLowerCase()
    const queryTerms = tokenizeForSkillMatch(query)
    const matches = this.skills
      .map((skill) => {
        const explicit = query ? explicitSkillMention(skill, query) : undefined
        if (explicit) return skillSearchResult(skill, 1_000 + skill.priority, explicit)

        const command = query
          ? skill.triggers.commands.find((candidate) => lowerQuery.includes(candidate.toLowerCase()))
          : undefined
        if (command) return skillSearchResult(skill, 900 + skill.priority, `command:${command}`)

        const pattern = query
          ? skill.triggers.promptPatterns.find((candidate) => safePatternMatches(candidate, query))
          : undefined
        if (pattern) return skillSearchResult(skill, 500 + skill.priority, `pattern:${pattern}`)

        const keywordScore = scoreKeywordMatch(skill.keywords, queryTerms, lowerQuery)
        if (keywordScore > 0) {
          return skillSearchResult(skill, 100 + keywordScore + skill.priority, 'keywords')
        }

        if (!query) return skillSearchResult(skill, skill.priority, 'list')
        return null
      })
      .filter((match): match is SkillSearchResult => match !== null)
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))

    return matches.slice(0, limit)
  }

  load(skillId: string): LoadedSkillInstructions | undefined {
    const normalized = slug(skillId)
    const skill = this.skills.find((candidate) => candidate.id === normalized || candidate.id === skillId)
    if (!skill) return undefined
    return {
      id: skill.id,
      name: skill.name,
      ...(skill.description ? { description: skill.description } : {}),
      root: skill.root,
      entryPath: skill.entryPath,
      legacy: skill.legacy,
      triggers: skill.triggers,
      allowedTools: skill.allowedTools,
      instructions: skillInstructionText(skill, 'loaded_by_tool')
    }
  }

  private matchSkills(input: {
    prompt: string
    workspace: string
    filePaths?: readonly string[]
  }): Array<SkillActivation & { skill: LoadedSkill }> {
    const prompt = input.prompt
    const lowerPrompt = prompt.toLowerCase()
    const fileTypes = fileTypesFrom(input.filePaths ?? [], prompt)
    const matches: Array<SkillActivation & { skill: LoadedSkill }> = []
    for (const skill of this.skills) {
      const explicit = explicitSkillMention(skill, prompt)
      if (explicit) {
        matches.push({ skill, skillId: skill.id, reason: explicit, score: 1_000 + skill.priority })
        continue
      }
      const command = skill.triggers.commands.find((candidate) => lowerPrompt.startsWith(candidate.toLowerCase()))
      if (command) {
        matches.push({ skill, skillId: skill.id, reason: `command:${command}`, score: 900 + skill.priority })
        continue
      }
      const pattern = skill.triggers.promptPatterns.find((candidate) => safePatternMatches(candidate, prompt))
      if (pattern) {
        matches.push({ skill, skillId: skill.id, reason: `pattern:${pattern}`, score: 500 + skill.priority })
        continue
      }
      const fileType = skill.triggers.fileTypes.find((candidate) => fileTypes.has(normalizeFileType(candidate)))
      if (fileType) {
        matches.push({ skill, skillId: skill.id, reason: `fileType:${fileType}`, score: 300 + skill.priority })
        continue
      }
    }
    return matches.sort((a, b) => b.score - a.score || a.skill.id.localeCompare(b.skill.id))
  }
}

async function discoverSkills(config: SkillsCapabilityConfig): Promise<{
  skills: LoadedSkill[]
  validationErrors: Array<{ root: string; message: string }>
}> {
  const skills: LoadedSkill[] = []
  const validationErrors: Array<{ root: string; message: string }> = []
  for (const rawRoot of config.roots) {
    const root = resolve(rawRoot)
    const candidates = await packageCandidates(root, DEFAULT_DISCOVERY_DEPTH).catch((error) => {
      validationErrors.push({ root, message: errorMessage(error) })
      return []
    })
    for (const candidate of candidates) {
      const loaded = await loadSkillPackage(candidate, config.legacySkillMd).catch((error) => {
        validationErrors.push({ root: candidate, message: errorMessage(error) })
        return null
      })
      if (loaded) skills.push(loaded)
    }
  }
  const unique = new Map<string, LoadedSkill>()
  for (const skill of skills) {
    if (!unique.has(skill.id)) unique.set(skill.id, skill)
    else validationErrors.push({ root: skill.root, message: `duplicate Skill id: ${skill.id}` })
  }
  return { skills: [...unique.values()].sort((a, b) => a.id.localeCompare(b.id)), validationErrors }
}

async function packageCandidates(root: string, maxDepth: number): Promise<string[]> {
  const candidates = new Set<string>()
  if (await exists(join(root, 'skill.json')) || await exists(join(root, 'SKILL.md'))) {
    candidates.add(root)
  }
  if (maxDepth <= 0) return [...candidates]
  const entries = await readdir(root, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory() || shouldSkipSkillDiscoveryDirectory(entry.name)) continue
    const dir = join(root, entry.name)
    if (await exists(join(dir, 'skill.json')) || await exists(join(dir, 'SKILL.md'))) {
      candidates.add(dir)
      continue
    }
    for (const child of await packageCandidates(dir, maxDepth - 1)) {
      candidates.add(child)
    }
  }
  return [...candidates]
}

async function loadSkillPackage(root: string, allowLegacy: boolean): Promise<LoadedSkill | null> {
  const manifestPath = join(root, 'skill.json')
  if (await exists(manifestPath)) {
    const manifest = SkillManifest.parse(JSON.parse(await readFile(manifestPath, 'utf8')))
    const entryPath = resolve(root, manifest.entry)
    const entry = await readFile(entryPath, 'utf8')
    return {
      id: slug(manifest.id ?? manifest.name),
      name: manifest.name,
      description: manifest.description,
      version: manifest.version,
      root,
      entryPath,
      entry,
      triggers: manifest.triggers,
      allowedTools: manifest.allowedTools,
      assets: manifest.assets.map((asset) => resolve(root, asset)),
      priority: manifest.priority,
      legacy: false,
      keywords: skillKeywords({
        id: manifest.id ?? manifest.name,
        name: manifest.name,
        description: manifest.description,
        path: root
      })
    }
  }
  if (!allowLegacy) return null
  const legacyPath = join(root, 'SKILL.md')
  if (!await exists(legacyPath)) return null
  const entry = await readFile(legacyPath, 'utf8')
  const frontmatter = readFrontmatter(entry)
  const folderName = basename(root)
  const name = frontmatter.name || folderName
  const taskId = frontmatter.taskId
  return {
    id: slug(frontmatter.id || taskId || folderName),
    name,
    description: frontmatter.description,
    version: 'legacy',
    root,
    entryPath: legacyPath,
    entry,
    triggers: { commands: [], promptPatterns: [], fileTypes: [] },
    allowedTools: [],
    assets: [],
    priority: 0,
    legacy: true,
    keywords: skillKeywords({
      id: frontmatter.id || taskId || folderName,
      name,
      description: frontmatter.description,
      taskId,
      path: root
    })
  }
}

function buildInjection(
  active: Array<SkillActivation & { skill: LoadedSkill }>,
  budgetBytes: number
): {
  activeSkillIds: string[]
  instructions: string[]
  allowedToolNames?: string[]
  injectedBytes: number
} {
  const instructions: string[] = []
  const activeSkillIds: string[] = []
  const allowed = new Set<string>()
  let injectedBytes = 0
  for (const match of active) {
    const skill = match.skill
    const text = skillInstructionText(skill, match.reason)
    const bytes = Buffer.byteLength(text, 'utf8')
    if (injectedBytes + bytes > budgetBytes) continue
    activeSkillIds.push(skill.id)
    instructions.push(text)
    injectedBytes += bytes
    for (const tool of skill.allowedTools) allowed.add(tool)
  }
  return {
    activeSkillIds,
    instructions,
    ...(allowed.size > 0 ? { allowedToolNames: [...allowed].sort() } : {}),
    injectedBytes
  }
}

function skillInstructionText(skill: LoadedSkill, activation: string): string {
  return [
    `Active Skill: ${skill.name} (${skill.id})`,
    `Activation: ${activation}`,
    LEGALWORK_SKILL_EXECUTION_CONTRACT,
    skill.description ? `Description: ${skill.description}` : '',
    skill.allowedTools.length ? `Allowed tools: ${skill.allowedTools.join(', ')}` : '',
    skill.assets.length ? `Assets:\n${skill.assets.map((asset) => `- ${asset}`).join('\n')}` : '',
    skill.entry
  ].filter(Boolean).join('\n\n')
}

function skillSearchResult(skill: LoadedSkill, score: number, reason: string): SkillSearchResult {
  return {
    id: skill.id,
    name: skill.name,
    ...(skill.description ? { description: skill.description } : {}),
    root: skill.root,
    entryPath: skill.entryPath,
    legacy: skill.legacy,
    triggers: skill.triggers,
    allowedTools: skill.allowedTools,
    score,
    reason
  }
}

function clampLimit(value: number | undefined, defaultValue: number, maxValue: number): number {
  if (!Number.isFinite(value)) return defaultValue
  return Math.max(1, Math.min(maxValue, Math.floor(value ?? defaultValue)))
}

function blockedToolsFor(skills: LoadedSkill[], allowedToolNames: string[] | undefined): string[] {
  if (!allowedToolNames) return []
  const allowed = new Set(allowedToolNames)
  return [...new Set(skills.flatMap((skill) => skill.allowedTools))]
    .filter((tool) => !allowed.has(tool))
    .sort()
}

function emptyResolution(): SkillTurnResolution {
  return {
    activeSkillIds: [],
    activations: [],
    instructions: [],
    injectedBytes: 0
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function isSkillDirectory(path: string): Promise<boolean> {
  try {
    const s = await stat(path)
    if (!s.isDirectory()) return false
    return existsSync(join(path, 'SKILL.md')) || existsSync(join(path, 'skill.json'))
  } catch {
    return false
  }
}

function explicitSkillMention(skill: LoadedSkill, prompt: string): string | undefined {
  const lower = prompt.toLowerCase()
  const id = skill.id.toLowerCase()
  const name = skill.name.toLowerCase()
  if (lower.includes(`$${id}`) || lower.includes(`@${id}`) || lower.includes(`/skill:${id}`)) return 'explicit:id'
  if (name && (lower.includes(`$${name}`) || lower.includes(`@${name}`))) return 'explicit:name'
  return undefined
}

function safePatternMatches(pattern: string, prompt: string): boolean {
  try {
    return new RegExp(pattern, 'i').test(prompt)
  } catch {
    return false
  }
}

function fileTypesFrom(paths: readonly string[], prompt: string): Set<string> {
  const out = new Set<string>()
  for (const filePath of paths) {
    const ext = extname(filePath)
    if (ext) out.add(normalizeFileType(ext))
  }
  for (const match of prompt.matchAll(/\.[a-z0-9]+/gi)) {
    out.add(normalizeFileType(match[0] ?? ''))
  }
  return out
}

function normalizeFileType(value: string): string {
  const trimmed = value.trim().toLowerCase()
  return trimmed.startsWith('.') ? trimmed : `.${trimmed}`
}

function firstMarkdownParagraph(markdown: string): string | undefined {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.replace(/^#+\s*/, '').trim())
    .find(Boolean)
}

function shouldSkipSkillDiscoveryDirectory(name: string): boolean {
  return name.startsWith('.') ||
    name === '__pycache__' ||
    name === 'node_modules' ||
    name === '.venv' ||
    name === 'venv' ||
    name === '_template'
}

function scoreKeywordMatch(keywords: readonly string[], promptTerms: Set<string>, lowerPrompt: string): number {
  if (keywords.length === 0 || promptTerms.size === 0) return 0
  let exactPhraseScore = 0
  let sharedTerms = 0
  for (const keyword of keywords) {
    if (keyword.includes(' ') && keyword.length >= 8 && lowerPrompt.includes(keyword)) {
      exactPhraseScore += 80
      continue
    }
    if (promptTerms.has(keyword)) sharedTerms += 1
  }
  if (exactPhraseScore > 0) return exactPhraseScore + Math.min(sharedTerms, 8) * 10
  return sharedTerms >= 2 ? Math.min(sharedTerms, 8) * 10 : 0
}

function skillKeywords(input: {
  id?: string
  name?: string
  description?: string
  taskId?: string
  path?: string
}): string[] {
  const source = [
    input.id,
    input.name,
    input.taskId,
    input.description,
    input.path ? relative(process.cwd(), input.path) : undefined
  ].filter(Boolean).join(' ')
  return [...tokenizeForSkillMatch(source)]
}

function tokenizeForSkillMatch(value: string): Set<string> {
  const normalized = value
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\/_-]+/g, ' ')
  const out = new Set<string>()
  for (const match of normalized.matchAll(/[\p{L}\p{N}]+/gu)) {
    const token = match[0] ?? ''
    if (token.length < 4 || STOPWORDS.has(token)) continue
    out.add(token)
  }
  const compact = normalized.trim().replace(/\s+/g, ' ')
  if (compact.length >= 8 && compact.length <= 80) out.add(compact)
  addChineseLegalAliases(value, out)
  return out
}

function addChineseLegalAliases(value: string, out: Set<string>): void {
  const aliases: Array<[RegExp, string[]]> = [
    [/合同|协议|条款|违约|履行|采购|服务|saas/i, ['contract', 'agreement', 'clause']],
    [/上市|招股|披露|证券|资本市场|ipo/i, ['ipo', 'securities', 'offering', 'disclosure', 'capital', 'markets']],
    [/并购|收购|兼并|股权交易|交易文件|交割/i, ['merger', 'acquisition', 'corporate', 'closing']],
    [/公司治理|董事会|股东会|章程|决议/i, ['corporate', 'governance', 'board', 'shareholder']],
    [/知识产权|专利|商标|著作权|版权|商业秘密/i, ['intellectual', 'property', 'patent', 'trademark', 'copyright']],
    [/反垄断|经营者集中|竞争|横向垄断|纵向垄断|hsr/i, ['antitrust', 'competition', 'merger', 'hsr']],
    [/数据|隐私|个人信息|网安|网络安全|数据出境/i, ['data', 'privacy', 'cybersecurity']],
    [/劳动|雇佣|员工|裁员|竞业|劳务/i, ['employment', 'labor', 'employee']],
    [/诉讼|争议|纠纷|庭审|起诉|答辩|仲裁/i, ['litigation', 'dispute', 'arbitration']],
    [/银行|贷款|融资|授信|担保|债务/i, ['banking', 'finance', 'credit', 'loan']],
    [/破产|重整|清算|债权人/i, ['bankruptcy', 'restructuring', 'creditor']],
    [/基金|资管|私募|投资人|lp|gp/i, ['funds', 'asset', 'management', 'investor']],
    [/房地产|不动产|租赁|物业|土地/i, ['real', 'estate', 'lease']],
    [/税|税务|纳税|关税/i, ['tax']],
    [/保险|保单|理赔/i, ['insurance']],
    [/移民|签证|居留|绿卡/i, ['immigration', 'visa']],
    [/环保|环境|esg|能源|自然资源/i, ['environmental', 'energy', 'resources', 'esg']],
    [/医疗|医药|生命科学|药品|器械/i, ['healthcare', 'life', 'sciences']],
    [/制裁|出口管制|国际贸易|海关/i, ['international', 'trade', 'sanctions']],
    [/白领|刑事调查|内部调查|反腐|合规调查/i, ['white', 'collar', 'investigations']]
  ]
  for (const [pattern, terms] of aliases) {
    if (!pattern.test(value)) continue
    for (const term of terms) out.add(term)
  }
}

const STOPWORDS = new Set([
  'skill',
  'skills',
  'legal',
  'agent',
  'agents',
  'analysis',
  'review',
  'draft',
  'memo',
  'task',
  'scenario',
  'identify',
  'analyze',
  'prepare',
  'compare',
  'extract',
  'requires',
  'across',
  'against',
  'under',
  'with',
  'from',
  'that',
  'this'
])

function readFrontmatter(content: string): { id?: string; name?: string; description?: string; taskId?: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content)
  if (!match) return { description: firstMarkdownParagraph(content) }
  const yaml = match[1] ?? ''
  return {
    id: frontmatterString(yaml, 'id'),
    name: frontmatterString(yaml, 'name'),
    description: frontmatterString(yaml, 'description') || firstMarkdownParagraph(content.slice(match[0].length)),
    taskId: frontmatterString(yaml, 'task_id')
  }
}

function frontmatterString(yaml: string, key: string): string | undefined {
  const match = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm').exec(yaml)
  return match ? stripQuotes(match[1] ?? '').trim() || undefined : undefined
}

function stripQuotes(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function slug(value: string): string {
  return value
    .trim()
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'skill'
}

function errorMessage(error: unknown): string {
  if (error instanceof z.ZodError) return error.issues.map((issue) => issue.message).join('; ')
  return error instanceof Error ? error.message : String(error)
}
