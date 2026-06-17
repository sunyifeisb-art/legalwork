import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

import {
  applicationScenariosConfig,
  evidenceRequirementsConfig,
  priorityRulesConfig,
  riskThemesConfig
} from '../shared/config';
import type {
  ApplicationScenarioPlan,
  ExtensionSettings,
  ParsedDocument,
  RemediationPlan,
  ReviewBundle,
  ReviewItem,
  ReviewProgress,
  ReviewReport,
  ReviewSourceInput
} from '../shared/types';
import { normalizeSettings } from '../storage/settings';
import { classifyDocument } from './classify';
import { applyNormMappings } from './normMapping';
import { planReview } from './plan';
import { enrichReportWithRegulationIndex } from './regulationSearch';
import { assessOne, RISK_LEVEL_ORDER } from './rules';
import { mergeList, mergeText, normalizeText, segmentText } from './utils';

if ('Worker' in globalThis && !pdfjsLib.GlobalWorkerOptions.workerPort) {
  pdfjsLib.GlobalWorkerOptions.workerPort = new Worker(
    new URL('../vendor/pdf.worker.mjs', import.meta.url),
    { type: 'module' }
  );
}

export interface RunReviewOptions {
  documentName: string;
  source: ReviewSourceInput;
  settings?: Partial<ExtensionSettings>;
  onProgress?: (progress: ReviewProgress) => void | Promise<void>;
}

const TOTAL_STEPS = 9;

function createProgress(
  step: number,
  message: string,
  status: ReviewProgress['status'] = 'running',
  detail?: Record<string, unknown>
): ReviewProgress {
  return { step, totalSteps: TOTAL_STEPS, message, status, detail };
}

async function emitProgress(
  onProgress: RunReviewOptions['onProgress'],
  progress: ReviewProgress
) {
  if (onProgress) {
    await onProgress(progress);
  }
}

async function extractTextFromSource(source: ReviewSourceInput): Promise<ParsedDocument> {
  if (source.kind === 'text') {
    const normalizedText = normalizeText(source.text);
    return {
      rawText: source.text,
      normalizedText,
      segments: segmentText(normalizedText),
      pageCount: 1
    };
  }

  const bytes = source.bytes;
  const lowerName = source.fileName.toLowerCase();
  let rawText = '';
  let pageCount = 1;

  if (lowerName.endsWith('.pdf') || source.mimeType.includes('pdf')) {
    const loadingTask = pdfjsLib.getDocument({
      data: bytes
    });
    const pdf = await loadingTask.promise;
    pageCount = pdf.numPages;
    const parts: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      parts.push(pageText);
    }
    rawText = parts.join('\n\n');
  } else if (lowerName.endsWith('.docx') || source.mimeType.includes('wordprocessingml')) {
    const result = await mammoth.extractRawText({ arrayBuffer: bytes });
    rawText = result.value;
  } else if (lowerName.endsWith('.doc')) {
    rawText = decodeBestEffort(bytes);
  } else {
    rawText = decodeBestEffort(bytes);
  }

  const normalizedText = normalizeText(rawText);
  return {
    rawText,
    normalizedText,
    segments: segmentText(normalizedText),
    pageCount
  };
}

function decodeBestEffort(bytes: ArrayBuffer): string {
  const utf8 = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  if (utf8.trim()) return utf8;
  return new TextDecoder('gbk' as never, { fatal: false }).decode(bytes);
}

function aggregateFindings(
  skeleton: Omit<ReviewReport, 'stats' | 'auto_recheck_summary' | 'auto_recheck_stats' | 'risk_clusters'>,
  findings: Array<{ path_id: string; summary: string; items: ReviewItem[] }>
): ReviewReport {
  const merged = new Map<string, ReviewItem>();
  const notes = [...skeleton.notes];
  let autoRecheckTriggered = skeleton.auto_recheck_triggered;

  for (const finding of findings) {
    if (finding.summary) notes.push(`[${finding.path_id}] ${finding.summary}`);
    for (const item of finding.items) {
      const key = item.risk_point || `unknown:${finding.path_id}`;
      const current = merged.get(key);
      if (!current) {
        merged.set(key, { ...item, path_ids: [finding.path_id] });
      } else {
        if ((RISK_LEVEL_ORDER[item.risk_level] ?? 0) > (RISK_LEVEL_ORDER[current.risk_level] ?? 0)) {
          current.risk_level = item.risk_level;
        }
        current.legal_basis = mergeText(current.legal_basis, item.legal_basis);
        current.reason = mergeText(current.reason, item.reason);
        current.suggestion = mergeText(current.suggestion, item.suggestion);
        current.auto_recheck = current.auto_recheck || item.auto_recheck;
        current.evidence = mergeList(current.evidence, item.evidence);
        current.trigger_hits = mergeList(current.trigger_hits, item.trigger_hits);
        current.missing_groups = mergeList(current.missing_groups, item.missing_groups);
        current.ambiguity_hits = mergeList(current.ambiguity_hits, item.ambiguity_hits);
        current.path_ids = mergeList(current.path_ids, [finding.path_id]);
      }
      if (item.auto_recheck) autoRecheckTriggered = true;
    }
  }

  const items = [...merged.values()].sort(
    (left, right) => (RISK_LEVEL_ORDER[right.risk_level] ?? 0) - (RISK_LEVEL_ORDER[left.risk_level] ?? 0)
  );
  const high = items.filter((item) => item.risk_level === '高风险').length;
  const medium = items.filter((item) => item.risk_level === '中风险').length;
  const advisory = items.filter((item) => item.risk_level === '建议优化').length;

  return {
    ...skeleton,
    summary: priorityRulesConfig.summary_template
      .replace('{count}', String(items.length))
      .replace('{high}', String(high))
      .replace('{medium}', String(medium))
      .replace('{low}', String(advisory)),
    auto_recheck_triggered: autoRecheckTriggered,
    items,
    notes,
    stats: {
      total: items.length,
      high_risk: high,
      medium_risk: medium,
      advisory
    },
    auto_recheck_summary: '',
    auto_recheck_stats: { triggered: 0, maintained: 0, need_more_support: 0 },
    risk_clusters: [],
    local_regulation_db: undefined
  };
}

function buildThemeIndex() {
  const index = new Map<string, { id: string; name: string }>();
  for (const theme of riskThemesConfig.themes) {
    for (const riskPoint of theme.risk_points) {
      index.set(riskPoint, { id: theme.id, name: theme.name });
    }
  }
  return index;
}

function autoRecheck(report: ReviewReport): ReviewReport & { queue: any[]; clusters: any[] } {
  const themeIndex = buildThemeIndex();
  const items = report.items;

  const queue = items.map((item) => {
    const theme = themeIndex.get(item.risk_point) ?? { id: 'ungrouped', name: '未归类主题' };
    item.theme_name = theme.name;
    item.auto_recheck_status =
      item.risk_level === '高风险'
        ? '自动复核后维持高风险'
        : item.risk_level === '中风险'
          ? '自动复核后维持中风险'
          : '未触发';
    item.auto_recheck_notes =
      item.auto_recheck_status === '未触发'
        ? '当前风险等级未触发自动复核。'
        : '该项已进入自动复核，建议补充法规依据、证据材料并统一整改口径。';
    item.auto_recheck_decision = item.auto_recheck ? '维持' : '未触发';
    item.corroboration_count = items.filter(
      (peer) => peer !== item && themeIndex.get(peer.risk_point)?.id === theme.id
    ).length;
    item.related_risk_points = items
      .filter((peer) => peer !== item && themeIndex.get(peer.risk_point)?.id === theme.id)
      .map((peer) => peer.risk_point);
    return {
      priority: item.risk_level === '高风险' ? 'P1' : item.risk_level === '中风险' ? 'P2' : 'P3',
      theme_name: theme.name,
      risk_point: item.risk_point,
      risk_level: item.risk_level,
      auto_recheck_status: item.auto_recheck_status,
      decision: item.auto_recheck ? '维持' : '未触发',
      related_risk_points: item.related_risk_points,
      next_actions: [item.suggestion]
    };
  });

  const clusters = [...themeIndex.entries()].reduce<Array<ReviewReport['risk_clusters'][number]>>(
    (output, [riskPoint, theme]) => {
      const matching = items.filter((item) => item.risk_point === riskPoint);
      if (!matching.length) return output;
      const existing = output.find((cluster) => cluster.theme_id === theme.id);
      if (existing) {
        existing.item_count += matching.length;
        existing.high_risk_count += matching.filter((item) => item.risk_level === '高风险').length;
        existing.medium_risk_count += matching.filter((item) => item.risk_level === '中风险').length;
        existing.advisory_count += matching.filter((item) => item.risk_level === '建议优化').length;
        existing.risk_points.push(...matching.map((item) => item.risk_point));
      } else {
        output.push({
          theme_id: theme.id,
          theme_name: theme.name,
          item_count: matching.length,
          high_risk_count: matching.filter((item) => item.risk_level === '高风险').length,
          medium_risk_count: matching.filter((item) => item.risk_level === '中风险').length,
          advisory_count: matching.filter((item) => item.risk_level === '建议优化').length,
          risk_points: matching.map((item) => item.risk_point)
        });
      }
      return output;
    },
    []
  );

  const triggered = items.filter((item) => item.auto_recheck).length;
  const maintained = items.filter((item) => item.auto_recheck).length;
  const needMoreSupport = 0;

  return {
    ...report,
    auto_recheck_triggered: triggered > 0,
    auto_recheck_summary: `触发 ${triggered} 项，维持判断 ${maintained} 项，仍需补充支持信息 ${needMoreSupport} 项。`,
    auto_recheck_stats: {
      triggered,
      maintained,
      need_more_support: needMoreSupport
    },
    risk_clusters: clusters.sort(
      (left, right) =>
        right.high_risk_count - left.high_risk_count ||
        right.medium_risk_count - left.medium_risk_count ||
        right.advisory_count - left.advisory_count
    ),
    queue,
    clusters
  };
}

function buildApplicationPlan(report: ReviewReport): ApplicationScenarioPlan {
  const riskPoints = new Set(report.items.map((item) => item.risk_point));
  const scenarios = applicationScenariosConfig.scenarios
    .filter(
      (scenario) =>
        scenario.applies_to.includes(report.document_type) ||
        scenario.trigger_risk_points.some((riskPoint) => riskPoints.has(riskPoint))
    )
    .map((scenario) => ({
      id: scenario.id,
      name: scenario.name,
      matched_by_document_type: scenario.applies_to.includes(report.document_type),
      matched_risk_points: scenario.trigger_risk_points.filter((riskPoint) => riskPoints.has(riskPoint)),
      deliverables: scenario.deliverables,
      next_actions: scenario.next_actions
    }));

  return {
    document_type: report.document_type,
    document_name: report.document_name,
    scenario_count: scenarios.length,
    scenarios
  };
}

function buildEvidenceChecklist(
  report: ReviewReport,
  applicationPlan: ApplicationScenarioPlan
) {
  const requirementMap = new Map(
    evidenceRequirementsConfig.requirements.map((item) => [item.risk_point, item])
  );

  return {
    document_name: report.document_name,
    checklist_count: report.items.length,
    checklist: report.items.map((item) => {
      const requirement = requirementMap.get(item.risk_point);
      return {
        risk_point: item.risk_point,
        risk_level: item.risk_level,
        owner_hint: requirement?.owner_hint ?? '待指派',
        evidence_items: requirement?.evidence_items ?? ['待补充对应证据材料'],
        why_needed: requirement?.why_needed ?? '用于支撑风险判断、自动复核与整改留痕。',
        related_scenarios: applicationPlan.scenarios
          .filter((scenario) => scenario.matched_risk_points.includes(item.risk_point))
          .map((scenario) => scenario.name)
      };
    })
  };
}

function buildRemediationPlan(
  report: ReviewReport,
  applicationPlan: ApplicationScenarioPlan,
  evidence: ReturnType<typeof buildEvidenceChecklist>,
  queue: any[],
  clusters: any[]
): RemediationPlan {
  const evidenceMap = new Map(evidence.checklist.map((item) => [item.risk_point, item]));
  const scenarioMap = new Map<string, typeof applicationPlan.scenarios[number][]>();
  for (const scenario of applicationPlan.scenarios) {
    for (const riskPoint of scenario.matched_risk_points) {
      const list = scenarioMap.get(riskPoint) ?? [];
      list.push(scenario);
      scenarioMap.set(riskPoint, list);
    }
  }

  const tasks: Array<Record<string, unknown>> = queue.map((entry, index) => {
    const scenarioList = scenarioMap.get(entry.risk_point) ?? [];
    const evidenceItem = evidenceMap.get(entry.risk_point);
    return {
      task_id: `TASK-${String(index + 1).padStart(3, '0')}`,
      kind: 'risk_point_task',
      priority: entry.priority,
      theme_name: entry.theme_name,
      title: `整改：${entry.risk_point}`,
      risk_point: entry.risk_point,
      risk_level: entry.risk_level,
      auto_recheck_status: entry.auto_recheck_status,
      auto_recheck_decision: entry.decision,
      owner_hint: evidenceItem?.owner_hint ?? '待指派',
      objective: '围绕该风险点补齐证据、修正文案或调整处理逻辑，直至自动复核可稳定通过。',
      suggested_actions: [
        ...new Set([...(entry.next_actions ?? []), ...scenarioList.flatMap((scenario) => scenario.next_actions)])
      ],
      required_evidence: evidenceItem?.evidence_items ?? ['待补充证据材料'],
      matched_scenarios: scenarioList.map((scenario) => scenario.name),
      deliverables: [
        ...new Set([...scenarioList.flatMap((scenario) => scenario.deliverables), '更新后的合规材料或说明'])
      ],
      dependencies: entry.related_risk_points ?? [],
      status: 'todo'
    };
  });

  let themeIndex = 1;
  for (const cluster of clusters) {
    if (cluster.item_count < 2) continue;
    tasks.push({
      task_id: `THEME-${String(themeIndex).padStart(3, '0')}`,
      kind: 'theme_task',
      priority: cluster.high_risk_count > 0 ? 'P1' : cluster.medium_risk_count > 0 ? 'P2' : 'P3',
      theme_name: cluster.theme_name,
      title: `专题整改：${cluster.theme_name}`,
      risk_points: cluster.risk_points,
      objective: '将同一主题下的关联风险统一整改，避免逐条修补导致口径反复冲突。',
      suggested_actions: ['统一整改同主题风险点口径', '汇总证据并更新合规材料'],
      required_evidence: ['汇总同主题风险点对应的证据材料', '形成统一整改口径或字段映射表'],
      matched_scenarios: applicationPlan.scenarios
        .filter((scenario) => scenario.matched_risk_points.some((riskPoint) => cluster.risk_points.includes(riskPoint)))
        .map((scenario) => scenario.name),
      deliverables: ['主题级整改方案', '统一整改口径说明'],
      status: 'todo',
      summary: {
        item_count: cluster.item_count,
        high_risk_count: cluster.high_risk_count,
        medium_risk_count: cluster.medium_risk_count,
        advisory_count: cluster.advisory_count
      }
    });
    themeIndex += 1;
  }

  const priority_counts = tasks.reduce<Record<'P1' | 'P2' | 'P3', number>>(
    (acc, task) => {
      const priority = ((task['priority'] as 'P1' | 'P2' | 'P3' | undefined) ?? 'P3');
      acc[priority] += 1;
      return acc;
    },
    { P1: 0, P2: 0, P3: 0 }
  );

  return {
    document_name: report.document_name,
    task_count: tasks.length,
    priority_counts,
    tasks
  };
}

function renderMarkdown(
  report: ReviewReport,
  remediation: RemediationPlan,
  evidence: ReturnType<typeof buildEvidenceChecklist>
): string {
  const lines = [
    `# ${report.document_name} 审查报告`,
    '',
    `- 文档类型：${report.document_type}`,
    `- 概要：${report.summary}`,
    '',
    '## 风险详情'
  ];

  for (const item of report.items) {
    lines.push(`### ${item.risk_point}`);
    lines.push(`- 风险等级：${item.risk_level}`);
    lines.push(`- 法规依据：${item.legal_basis}`);
    lines.push(`- 判断说明：${item.reason}`);
    lines.push(`- 修改建议：${item.suggestion}`);
    if (item.rewritten_clause) {
      lines.push(`- 改写后条款：${item.rewritten_clause}`);
    }
    lines.push('');
  }

  lines.push('## 整改任务');
  for (const task of remediation.tasks.slice(0, 10)) {
    lines.push(`- [${task.priority as string}] ${task.title as string}`);
  }

  lines.push('', '## 证据清单');
  for (const row of evidence.checklist) {
    lines.push(`- ${row.risk_point}：${row.evidence_items.join('；')}`);
  }

  return lines.join('\n');
}

async function maybeEnhanceWithAi(
  bundle: ReviewBundle,
  settings: ExtensionSettings
): Promise<ReviewBundle> {
  if (!settings.aiEnabled || !settings.deepseekApiKey) return bundle;

  for (const item of bundle.report.items) {
    try {
      const response = await fetch(`${settings.deepseekBaseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.deepseekApiKey}`
        },
        body: JSON.stringify({
          model: settings.deepseekModel,
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content:
                '你是数据合规审查助手。请输出 JSON，包含 suggestion 和 rewritten_clause 两个字段，措辞专业、可直接用于隐私政策整改。'
            },
            {
              role: 'user',
              content: JSON.stringify({
                risk_point: item.risk_point,
                risk_level: item.risk_level,
                reason: item.reason,
                current_suggestion: item.suggestion
              })
            }
          ],
          response_format: { type: 'json_object' }
        })
      });
      if (!response.ok) continue;
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) continue;
      const parsed = JSON.parse(content);
      item.suggestion = parsed.suggestion || item.suggestion;
      item.rewritten_clause = parsed.rewritten_clause || item.rewritten_clause;
    } catch {
      // Leave rule-based result in place if AI enhancement fails.
    }
  }

  bundle.markdown = renderMarkdown(bundle.report, bundle.remediation, bundle.evidence);
  return bundle;
}

export async function runReviewPipeline(options: RunReviewOptions): Promise<ReviewBundle> {
  const settings = normalizeSettings(options.settings);

  await emitProgress(options.onProgress, createProgress(1, '正在预处理输入文件...'));
  const parsed = await extractTextFromSource(options.source);

  await emitProgress(options.onProgress, createProgress(2, '正在识别文档类型...'));
  const classification = classifyDocument(parsed.normalizedText);

  await emitProgress(options.onProgress, createProgress(3, '正在规划审查路径...'));
  const planned = planReview(classification);

  await emitProgress(options.onProgress, createProgress(4, '正在生成审查任务...'));
  const tasks = planned.tasks;

  await emitProgress(options.onProgress, createProgress(5, '正在执行规则化审查...'));
  const findings = tasks.map((task, index) => {
    void emitProgress(
      options.onProgress,
      createProgress(5, `正在执行审查: ${task.path_name}`, 'running', {
        current: index + 1,
        total: tasks.length,
        current_path: task.path_name
      })
    );
    return assessOne(task.path_id, parsed.normalizedText, parsed.segments);
  });

  await emitProgress(options.onProgress, createProgress(6, '正在汇总审查结果...'));
  const skeleton: Omit<ReviewReport, 'stats' | 'auto_recheck_summary' | 'auto_recheck_stats' | 'risk_clusters'> = {
    document_name: options.documentName,
    review_scope: '数据合规相关文件审查',
    document_type: classification.type,
    selected_review_paths: planned.selectedPaths.map((path) => path.id),
    summary: '',
    auto_recheck_triggered: false,
    items: [],
    notes: [
      '本报告用于辅助合规审查，不替代律师或法务最终判断。',
      '当命中高风险、依据不足或判断存在不确定性时，系统会自动触发二次复核。'
    ],
    local_regulation_db: undefined
  };
  let aggregated = aggregateFindings(skeleton, findings);

  await emitProgress(options.onProgress, createProgress(7, '正在应用法规映射与法规库增强...'));
  aggregated = applyNormMappings(aggregated);
  aggregated = await enrichReportWithRegulationIndex(aggregated);

  await emitProgress(options.onProgress, createProgress(8, '正在执行自动复核与风险聚类...'));
  const autoRechecked = autoRecheck(aggregated);

  await emitProgress(options.onProgress, createProgress(9, '正在生成整改任务与证据清单...'));
  const applicationPlan = buildApplicationPlan(autoRechecked);
  const evidence = buildEvidenceChecklist(autoRechecked, applicationPlan);
  const remediation = buildRemediationPlan(autoRechecked, applicationPlan, evidence, autoRechecked.queue, autoRechecked.clusters);

  let bundle: ReviewBundle = {
    report: autoRechecked,
    remediation,
    evidence,
    markdown: renderMarkdown(autoRechecked, remediation, evidence),
    applicationPlan
  };

  if (settings.aiEnabled && settings.deepseekApiKey) {
    await emitProgress(options.onProgress, createProgress(9, '正在生成 AI 优化建议与改写示例...'));
    bundle = await maybeEnhanceWithAi(bundle, settings);
  }

  await emitProgress(options.onProgress, createProgress(9, '审查完成', 'completed'));
  return bundle;
}
