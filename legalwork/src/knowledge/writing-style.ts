import type { KnowledgeContextRecord } from '../contracts/knowledge-retrieval.js'

/**
 * Legal citation formatting utilities.
 * Ensures every source used in output can be traced back to original text.
 */

/** Format a single source citation for inclusion in legal documents. */
export function formatCitation(record: KnowledgeContextRecord): string {
  const parts: string[] = [record.citation]
  if (record.sourceKind === 'web') {
    parts.push('[外部来源]')
  }
  if (record.tags.includes('high_confidence')) {
    parts.push('[已核验]')
  }
  return parts.join(' ')
}

/** Build a source verification footnote block for document output. */
export function buildSourceFootnotes(sources: KnowledgeContextRecord[]): string {
  if (!sources.length) return ''

  const lines = sources.map((source, index) => {
    const verified = source.sourceKind === 'local' ? '✓ 本地知识库' : '◈ 外部检索'
    const confidence = source.relevanceScore > 0.7 ? '高' : source.relevanceScore > 0.4 ? '中' : '低'
    return `[${index + 1}] ${source.citation}（${verified}，相关度${confidence}）`
  })

  return [
    '',
    '---',
    '**引用来源**',
    ...lines
  ].join('\n')
}

/**
 * Team writing style configuration.
 * This would be loaded from a team SKILL.md or configuration file.
 */
export const TEAM_WRITING_STYLE = {
  /** Core writing principles */
  principles: [
    '采用法律三段论结构（大前提→小前提→结论）',
    '请求权基础分析方法',
    '每个论点必须有法律依据或案例支撑'
  ],

  /** Argumentation rhythm */
  argumentRhythm: [
    '先陈述法律规则（大前提）',
    '再分析案件事实（小前提）',
    '最后得出结论',
    '重要观点前置，次要观点后置'
  ],

  /** Citation requirements */
  citationRules: [
    '法条引用必须使用原文，标注具体条、款、项',
    '案例引用必须注明案号和裁判要点',
    '引用团队经验需标注来源',
    '禁止编造法条或案例'
  ],

  /** Risk warning template */
  riskWarningTemplate: '需要提示贵方注意，上述分析基于现有材料，如事实发生变化或出现新证据，可能影响分析结论。',

  /** Common document type structures */
  documentStructures: {
    complaint: {
      title: '民事起诉状',
      sections: ['当事人信息', '诉讼请求', '事实与理由', '法律依据', '此致', '落款']
    },
    defense: {
      title: '民事答辩状',
      sections: ['答辩人信息', '答辩事项', '事实与理由', '法律依据', '此致', '落款']
    },
    legalOpinion: {
      title: '法律意见书',
      sections: ['致送对象', '出具依据', '基本事实', '法律分析', '结论意见', '风险提示', '落款']
    },
    agencyOpinion: {
      title: '代理词',
      sections: ['尊敬的审判长/审判员', '代理意见', '事实分析', '法律适用', '结论']
    }
  }
} as const

/** Generate a writing style instruction block for model injection. */
export function buildWritingStyleInstruction(documentType?: string): string {
  const sections: string[] = [
    '## 团队写作风格要求',
    '',
    '### 核心原则',
    ...TEAM_WRITING_STYLE.principles.map((p) => `- ${p}`),
    '',
    '### 论证节奏',
    ...TEAM_WRITING_STYLE.argumentRhythm.map((r) => `- ${r}`),
    '',
    '### 引用规范',
    ...TEAM_WRITING_STYLE.citationRules.map((c) => `- ${c}`),
    '',
    '### 风险提示',
    `- ${TEAM_WRITING_STYLE.riskWarningTemplate}`
  ]

  if (documentType && documentType in TEAM_WRITING_STYLE.documentStructures) {
    const structure = TEAM_WRITING_STYLE.documentStructures[
      documentType as keyof typeof TEAM_WRITING_STYLE.documentStructures
    ]
    sections.push(
      '',
      `### ${structure.title} 结构要求`,
      ...structure.sections.map((s, i) => `${i + 1}. ${s}`)
    )
  }

  return sections.join('\n')
}
