import type { ReviewItem, ReviewReport } from '../shared/types';

const PLACEHOLDER = '待外部规范数据库补充具体依据';
const MAX_RESULTS = 3;

const PATH_QUERY_HINTS: Record<string, string[]> = {
  disclosure_check: ['个人信息', '处理规则', '个人信息处理规则', '个人信息保护'],
  third_party_sharing_check: ['第三方', '共享', '委托处理', 'SDK', '个人信息'],
  outbound_transfer_check: ['跨境', '出境', '境外接收方', '安全认证', '标准合同'],
  lawful_basis_check: ['个人信息', '同意', '最小必要', '处理规则'],
  purpose_scope_check: ['最小必要', '个人信息', '互联网平台', 'APP'],
  sensitive_personal_info_check: ['敏感个人信息', '未成年人', '儿童', '个人信息保护'],
  consent_feature_coupling_check: ['同意', '个性化推荐', '营销推荐', 'APP'],
  retention_deletion_check: ['保存期限', '删除', '匿名化', '个人信息'],
  consistency_check: ['个人信息', '处理规则', '合规审计'],
  field_purpose_legal_basis_check: ['个人信息', '最小必要', '处理规则', '自动化决策'],
  contract_obligation_check: ['委托处理', '第三方', '数据交易', '个人信息']
};

const DOMAIN_KEYWORDS = [
  '个人信息',
  '个人信息保护',
  '敏感个人信息',
  '未成年人',
  '儿童',
  '跨境',
  '出境',
  '境外接收方',
  '标准合同',
  '安全认证',
  '第三方',
  '共享',
  '委托处理',
  'SDK',
  '自动化决策',
  '最小必要',
  '合法性基础',
  '保存期限',
  '删除',
  '匿名化',
  '同意',
  '单独同意',
  '营销推荐',
  '个性化推荐',
  '画像',
  '互联网平台',
  'APP',
  '合规审计',
  '数据交易',
  '数据接口',
  '移动互联网应用'
];

type RegulationChunk = {
  chunk_index: number;
  chunk_text: string;
};

type RegulationDocument = {
  id: number;
  title: string;
  standard_code: string;
  doc_category: string;
  effect_level: string;
  relative_path: string;
  is_draft: boolean;
  chunks: RegulationChunk[];
};

type RegulationIndex = {
  db_name: string;
  total_documents: number;
  regulations: RegulationDocument[];
};

let regulationIndexPromise: Promise<RegulationIndex | null> | null = null;

function uniqueKeepOrder(values: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const cleaned = value.trim();
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    output.push(cleaned);
  }
  return output;
}

function extractEvidenceTerms(item: ReviewItem) {
  const terms: string[] = [];
  for (const evidence of item.evidence ?? []) {
    const cleaned = evidence.replace(/\s+/g, ' ').trim();
    if (cleaned.length >= 6) {
      terms.push(cleaned.slice(0, 40));
    }
  }
  return uniqueKeepOrder(terms).slice(0, 4);
}

function deriveKeywords(item: ReviewItem) {
  const combined = [
    item.risk_point,
    item.legal_basis,
    item.reason,
    item.suggestion,
    item.theme_name ?? '',
    ...(item.evidence ?? [])
  ].join(' ');

  const keywords: string[] = [];
  for (const pathId of item.path_ids ?? []) {
    keywords.push(...(PATH_QUERY_HINTS[pathId] ?? []));
  }
  for (const keyword of DOMAIN_KEYWORDS) {
    if (combined.includes(keyword)) {
      keywords.push(keyword);
    }
  }
  return uniqueKeepOrder(keywords).slice(0, 8);
}

function extractClauseReferences(text: string) {
  const matches = text.match(/第[一二三四五六七八九十百千万零两0-9]+条(?:第[一二三四五六七八九十百千万零两0-9]+款)?/g) ?? [];
  return uniqueKeepOrder(matches).slice(0, 3);
}

function buildSnippet(chunkText: string, matchedKeywords: string[], maxChars = 140) {
  if (!chunkText) return '';
  for (const keyword of matchedKeywords) {
    const pos = chunkText.indexOf(keyword);
    if (pos >= 0) {
      const start = Math.max(0, pos - 40);
      const end = Math.min(chunkText.length, pos + maxChars);
      return chunkText.slice(start, end).replace(/\n/g, ' ').trim();
    }
  }
  return chunkText.slice(0, maxChars).replace(/\n/g, ' ').trim();
}

async function loadRegulationIndex(): Promise<RegulationIndex | null> {
  if (!regulationIndexPromise) {
    regulationIndexPromise = fetch(new URL('../assets/regulation-index.json', import.meta.url))
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`regulation index fetch failed: ${response.status}`);
        }
        return response.json() as Promise<RegulationIndex>;
      })
      .catch(() => null);
  }
  return regulationIndexPromise;
}

function searchRegulations(index: RegulationIndex, item: ReviewItem, keywords: string[]) {
  if (!keywords.length) return [];
  const evidenceTerms = extractEvidenceTerms(item);
  const rankedByRegulation = new Map<number, { score: number; payload: NonNullable<ReviewItem['supporting_regulations']>[number] }>();

  for (const regulation of index.regulations) {
    let bestForRegulation:
      | { score: number; payload: NonNullable<ReviewItem['supporting_regulations']>[number] }
      | undefined;

    for (const chunk of regulation.chunks) {
      let score = 0;
      const matchedKeywords: string[] = [];

      for (const keyword of keywords) {
        let matched = false;
        if (regulation.standard_code && regulation.standard_code.includes(keyword)) {
          score += 10;
          matched = true;
        }
        if (regulation.title.includes(keyword)) {
          score += 8;
          matched = true;
        }
        if (chunk.chunk_text.includes(keyword)) {
          score += 4;
          matched = true;
        }
        if (matched) matchedKeywords.push(keyword);
      }

      for (const evidenceTerm of evidenceTerms) {
        if (chunk.chunk_text.includes(evidenceTerm)) {
          score += 12;
          matchedKeywords.push(evidenceTerm);
        }
      }

      if (regulation.doc_category === 'standard_or_guideline') score += 5;
      else if (regulation.doc_category === 'national_policy') score += 4;
      else if (regulation.doc_category === 'local_policy') score += 2;

      if (regulation.effect_level.includes('征求意见稿') || regulation.effect_level.includes('草案') || regulation.is_draft) {
        score -= 4;
      }
      if (regulation.standard_code) score += 2;
      if (score <= 0) continue;

      const payload = {
        title: regulation.title,
        standard_code: regulation.standard_code || '',
        doc_category: regulation.doc_category || '',
        effect_level: regulation.effect_level || '',
        relative_path: regulation.relative_path || '',
        clause_references: extractClauseReferences(chunk.chunk_text),
        match_keywords: uniqueKeepOrder(matchedKeywords),
        match_score: score,
        snippet: buildSnippet(chunk.chunk_text, matchedKeywords)
      };

      if (!bestForRegulation || score > bestForRegulation.score) {
        bestForRegulation = { score, payload };
      }
    }

    if (bestForRegulation) {
      rankedByRegulation.set(regulation.id, bestForRegulation);
    }
  }

  return [...rankedByRegulation.values()]
    .sort((left, right) => right.score - left.score || left.payload.title.localeCompare(right.payload.title))
    .slice(0, MAX_RESULTS)
    .map((entry) => entry.payload);
}

export async function enrichReportWithRegulationIndex(report: ReviewReport): Promise<ReviewReport> {
  const index = await loadRegulationIndex();
  if (!index) return report;

  let matchedItems = 0;
  for (const item of report.items) {
    const keywords = deriveKeywords(item);
    const regulations = searchRegulations(index, item, keywords);
    item.legal_basis_source =
      item.legal_basis && item.legal_basis !== PLACEHOLDER ? 'mapped_or_existing' : 'placeholder';
    item.supporting_regulations = regulations;
    if (regulations.length) matchedItems += 1;
  }

  report.local_regulation_db = {
    enabled: true,
    db_name: index.db_name,
    matched_items: matchedItems,
    unmatched_items: Math.max(0, report.items.length - matchedItems),
    total_documents: index.total_documents,
    searchable_documents: index.total_documents,
    updated_at: new Date().toISOString()
  };

  return report;
}
