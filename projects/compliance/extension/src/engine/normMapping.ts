import defaultNormMappings from '../../../projects/data-compliance-ai-project-kit/config/default-norm-mappings.json';

import type { ReviewReport } from '../shared/types';

const PLACEHOLDER = '待外部规范数据库补充具体依据';

export function applyNormMappings(report: ReviewReport): ReviewReport {
  const mappings = defaultNormMappings.mappings;
  for (const item of report.items) {
    for (const ref of mappings) {
      const sameRisk = ref.risk_point === item.risk_point;
      const samePath = !ref.path_id || item.path_ids?.includes(ref.path_id);
      if (!sameRisk || !samePath) continue;

      if (!item.legal_basis || item.legal_basis === PLACEHOLDER) {
        item.legal_basis = ref.legal_basis || item.legal_basis;
      }
      if (ref.reference_note?.trim()) {
        item.legal_basis_detail = ref.reference_note.trim();
      }
      if (ref.source_id) {
        item.sources = item.sources ?? [];
        if (!item.sources.includes(ref.source_id)) {
          item.sources.push(ref.source_id);
        }
      }
      item.legal_basis_source = 'mapped_or_existing';
      break;
    }
  }

  return report;
}
