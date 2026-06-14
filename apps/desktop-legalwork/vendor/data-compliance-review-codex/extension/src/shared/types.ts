export type ReviewSourceInput =
  | {
      kind: 'text';
      fileName: string;
      text: string;
    }
  | {
      kind: 'binary';
      fileName: string;
      mimeType: string;
      bytes: ArrayBuffer;
    };

export interface ReviewProgress {
  step: number;
  totalSteps: number;
  message: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: Record<string, unknown>;
}

export interface ReviewJobRecord {
  id: string;
  documentName: string;
  source: ReviewSourceInput;
  reviewType: 'document' | 'code';
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  progress: ReviewProgress;
  result?: ReviewBundle;
  error?: string;
}

export interface ExtensionSettings {
  aiEnabled: boolean;
  deepseekApiKey: string;
  deepseekBaseUrl: string;
  deepseekModel: string;
}

export interface ReviewBundle {
  report: ReviewReport;
  remediation: RemediationPlan;
  evidence: EvidenceChecklist;
  markdown: string;
  applicationPlan: ApplicationScenarioPlan;
}

export interface ReviewReport {
  document_name: string;
  review_scope: string;
  document_type: string;
  selected_review_paths: string[];
  summary: string;
  auto_recheck_triggered: boolean;
  items: ReviewItem[];
  notes: string[];
  stats: {
    total: number;
    high_risk: number;
    medium_risk: number;
    advisory: number;
  };
  auto_recheck_summary: string;
  auto_recheck_stats: {
    triggered: number;
    maintained: number;
    need_more_support: number;
  };
  risk_clusters: RiskCluster[];
  local_regulation_db?: {
    enabled: boolean;
    db_name: string;
    matched_items: number;
    unmatched_items: number;
    total_documents: number;
    searchable_documents: number;
    updated_at: string;
  };
}

export interface ReviewItem {
  risk_point: string;
  risk_level: '高风险' | '中风险' | '建议优化' | '无';
  legal_basis: string;
  legal_basis_source?: string;
  legal_basis_detail?: string;
  reason: string;
  suggestion: string;
  auto_recheck: boolean;
  evidence: string[];
  coverage_ratio?: number;
  trigger_hits?: string[];
  missing_groups?: string[];
  ambiguity_hits?: string[];
  path_ids?: string[];
  sources?: string[];
  theme_name?: string;
  auto_recheck_status?: string;
  auto_recheck_notes?: string;
  auto_recheck_decision?: string;
  corroboration_count?: number;
  related_risk_points?: string[];
  rewritten_clause?: string;
  supporting_regulations?: Array<{
    title: string;
    standard_code?: string;
    doc_category?: string;
    effect_level?: string;
    relative_path?: string;
    match_keywords?: string[];
    match_score?: number;
    snippet?: string;
    clause_references?: string[];
  }>;
}

export interface RiskCluster {
  theme_id: string;
  theme_name: string;
  item_count: number;
  high_risk_count: number;
  medium_risk_count: number;
  advisory_count: number;
  risk_points: string[];
}

export interface EvidenceChecklist {
  document_name: string;
  checklist_count: number;
  checklist: Array<{
    risk_point: string;
    risk_level: ReviewItem['risk_level'];
    owner_hint: string;
    evidence_items: string[];
    why_needed: string;
    related_scenarios: string[];
  }>;
}

export interface RemediationPlan {
  document_name: string;
  task_count: number;
  priority_counts: Record<'P1' | 'P2' | 'P3', number>;
  tasks: Array<Record<string, unknown>>;
}

export interface ApplicationScenarioPlan {
  document_type: string;
  document_name: string;
  scenario_count: number;
  scenarios: Array<{
    id: string;
    name: string;
    matched_by_document_type: boolean;
    matched_risk_points: string[];
    deliverables: string[];
    next_actions: string[];
  }>;
}

export interface ParsedDocument {
  rawText: string;
  normalizedText: string;
  segments: string[];
  pageCount: number;
}
