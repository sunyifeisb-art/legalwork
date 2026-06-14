import { loadSettings } from '../storage/settings';
import { completeJob, failJob, getJob, updateJobProgress } from '../storage/jobs';
import type { ReviewBundle, ReviewJobRecord } from '../shared/types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const params = new URLSearchParams(window.location.search);
const jobId = params.get('jobId');

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderLoading(job: ReviewJobRecord) {
  const pct = Math.round((job.progress.step / job.progress.totalSteps) * 100);
  app.innerHTML = `
    <section class="hero-shell">
      <div class="hero-card">
        <p class="eyebrow">正在审查</p>
        <h1>${escapeHtml(job.documentName)}</h1>
        <p class="supporting">${escapeHtml(job.progress.message)}</p>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="progress-meta"><span>进度</span><span>${pct}%</span></div>
      </div>
    </section>
  `;
}

function downloadBlob(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function renderList(items: string[], className = '') {
  if (!items.length) return '<p class="detail-empty">暂无</p>';
  return `<ul class="${className || 'detail-list'}">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')}</ul>`;
}

function renderRegulationCards(
  regulations: NonNullable<ReviewBundle['report']['items'][number]['supporting_regulations']>
) {
  return regulations
    .map(
      (reg) => `
        <article class="reg-card">
          <div class="risk-meta-row">
            ${reg.standard_code ? `<span class="reg-code">${escapeHtml(reg.standard_code)}</span>` : ''}
            <span class="task-owner">${escapeHtml(reg.effect_level || reg.doc_category || '规范索引')}</span>
          </div>
          <h4>${escapeHtml(reg.title)}</h4>
          ${
            reg.match_keywords?.length
              ? `<p class="detail-muted">命中词：${escapeHtml(reg.match_keywords.join('、'))}</p>`
              : ''
          }
          ${reg.snippet ? `<p class="reg-snippet">${escapeHtml(reg.snippet)}</p>` : ''}
        </article>
      `
    )
    .join('');
}

function renderRiskCard(item: ReviewBundle['report']['items'][number]) {
  const summaryReason = item.missing_groups?.length
    ? `该处未明确 ${item.missing_groups.join('、')}，存在 ${item.risk_point}。`
    : item.ambiguity_hits?.length
      ? `该处存在「${item.ambiguity_hits.join('、')}」等模糊表述，存在 ${item.risk_point}。`
      : `该处存在 ${item.risk_point}。`;

  const lvlClass = item.risk_level === '高风险' ? 'lvl-high' : item.risk_level === '中风险' ? 'lvl-medium' : 'lvl-low';
  return `
    <article class="risk-item ${lvlClass}">
      <div class="risk-meta-row">
        <div class="risk-meta-row">
          <span class="risk-badge badge-${item.risk_level}">${item.risk_level}</span>
          ${item.theme_name ? `<span class="theme-tag">${escapeHtml(item.theme_name)}</span>` : ''}
        </div>
        ${item.auto_recheck_status ? `<span class="task-owner">${escapeHtml(item.auto_recheck_status)}</span>` : ''}
      </div>
      <h3>${escapeHtml(item.risk_point)}</h3>

      ${
        item.evidence?.length
          ? `
            <div class="quote-block">
              <p class="info-label">原文摘录</p>
              ${item.evidence
                .slice(0, 2)
                .map((evidence) => `<blockquote class="risk-quote">${escapeHtml(evidence)}</blockquote>`)
                .join('')}
            </div>
          `
          : ''
      }

      <div class="analysis-box">
        <p class="info-label">问题详情</p>
        <p class="risk-reason">${escapeHtml(summaryReason)}</p>
      </div>

      <div class="two-col">
        <div class="info-box">
          <p class="info-label">法规依据</p>
          <p class="detail-primary">${escapeHtml(item.legal_basis || '待补充')}</p>
        </div>
        <div class="info-box">
          <p class="info-label">修改建议</p>
          <p>${escapeHtml(item.suggestion)}</p>
        </div>
      </div>

      ${
        item.rewritten_clause
          ? `
            <div class="info-box" style="margin-top:16px">
              <p class="info-label">改写后条款</p>
              <p>${escapeHtml(item.rewritten_clause)}</p>
            </div>
          `
          : ''
      }

      <details class="detail-panel">
        <summary>法规依据与定位详情</summary>
        <div class="detail-grid">
          <div class="info-box">
            <p class="info-label">系统判断详情</p>
            <p>${escapeHtml(item.reason)}</p>
          </div>
          ${
            item.auto_recheck_notes
              ? `
                <div class="info-box">
                  <p class="info-label">自动复核说明</p>
                  <p>${escapeHtml(item.auto_recheck_notes)}</p>
                </div>
              `
              : ''
          }
          ${
            item.trigger_hits?.length
              ? `
                <div class="info-box">
                  <p class="info-label">触发主题</p>
                  ${renderList(item.trigger_hits, 'chip-list')}
                </div>
              `
              : ''
          }
          ${
            item.missing_groups?.length
              ? `
                <div class="info-box">
                  <p class="info-label">待补要素</p>
                  ${renderList(item.missing_groups, 'chip-list')}
                </div>
              `
              : ''
          }
          ${
            item.ambiguity_hits?.length
              ? `
                <div class="info-box">
                  <p class="info-label">模糊表述</p>
                  ${renderList(item.ambiguity_hits, 'chip-list')}
                </div>
              `
              : ''
          }
          ${
            item.path_ids?.length
              ? `
                <div class="info-box">
                  <p class="info-label">命中审查路径</p>
                  ${renderList(item.path_ids, 'chip-list')}
                </div>
              `
              : ''
          }
          ${
            item.supporting_regulations?.length
              ? `
                <div class="detail-span">
                  <p class="info-label">补充规范索引</p>
                  <div class="reg-grid">${renderRegulationCards(item.supporting_regulations)}</div>
                </div>
              `
              : ''
          }
          ${
            item.evidence?.length
              ? `
                <div class="detail-span">
                  <p class="info-label">补充证据片段</p>
                  ${item.evidence
                    .map((evidence) => `<blockquote class="risk-quote">${escapeHtml(evidence)}</blockquote>`)
                    .join('')}
                </div>
              `
              : ''
          }
        </div>
      </details>
    </article>
  `;
}

function renderCompleted(job: ReviewJobRecord, bundle: ReviewBundle) {
  const riskStats = bundle.report.stats;
  const topTask = bundle.remediation.tasks[0] as Record<string, string> | undefined;
  app.innerHTML = `
    <header class="result-header">
      <div>
        <p class="eyebrow">审查完成</p>
        <h1>${escapeHtml(bundle.report.document_name)}</h1>
        <p class="supporting">${escapeHtml(bundle.report.summary)}</p>
      </div>
      <div class="header-actions">
        <button id="downloadJsonButton" class="btn-secondary">下载 JSON</button>
        <button id="downloadMarkdownButton" class="btn-primary">下载 Markdown</button>
      </div>
    </header>

    <section class="overview-grid">
      <article class="overview-card">
        <p class="card-label">审查结论</p>
        <div class="risk-tally">
          <div><strong>${riskStats.high_risk}</strong><span>高风险</span></div>
          <div><strong>${riskStats.medium_risk}</strong><span>中风险</span></div>
          <div><strong>${riskStats.advisory}</strong><span>建议优化</span></div>
        </div>
        ${
          bundle.report.auto_recheck_triggered
            ? `<div class="notice-bar">已触发自动复核：${escapeHtml(bundle.report.auto_recheck_summary || '系统已完成自动复核')}</div>`
            : ''
        }
      </article>
      <article class="overview-card">
        <p class="card-label">优先行动</p>
        <h2>${escapeHtml((topTask?.title as string) || '暂无整改任务')}</h2>
        <p>${escapeHtml((topTask?.objective as string) || '当前未生成整改任务。')}</p>
      </article>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h2>报告说明</h2>
        <span>${bundle.report.selected_review_paths.length} 条审查路径</span>
      </div>
      <div class="info-box report-meta-box">
        <p><strong>审查范围：</strong>${escapeHtml(bundle.report.review_scope)}</p>
        <p><strong>文档类型：</strong>${escapeHtml(bundle.report.document_type)}</p>
        <p><strong>命中路径：</strong>${escapeHtml(bundle.report.selected_review_paths.join('、') || '未识别')}</p>
        ${
          bundle.report.notes?.length
            ? `<div class="note-list">${bundle.report.notes
                .map((note) => `<p>${escapeHtml(note)}</p>`)
                .join('')}</div>`
            : ''
        }
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h2>风险详情</h2>
        <span>${bundle.report.items.length} 项发现</span>
      </div>
      <div class="risk-list">${bundle.report.items.map((item) => renderRiskCard(item)).join('')}</div>
    </section>

    ${
      bundle.report.risk_clusters?.length
        ? `
          <section class="section-block">
            <div class="section-head">
              <h2>风险聚类</h2>
              <span>${bundle.report.risk_clusters.length} 个主题</span>
            </div>
            <div class="cluster-grid">
              ${bundle.report.risk_clusters
                .map(
                  (cluster) => `
                    <article class="cluster-card">
                      <div class="risk-meta-row">
                        <h3>${escapeHtml(cluster.theme_name)}</h3>
                        <span class="task-owner">${cluster.item_count} 项</span>
                      </div>
                      <p class="detail-muted">高风险 ${cluster.high_risk_count} / 中风险 ${cluster.medium_risk_count} / 建议优化 ${cluster.advisory_count}</p>
                      <p>${escapeHtml(cluster.risk_points.join('、'))}</p>
                    </article>
                  `
                )
                .join('')}
            </div>
          </section>
        `
        : ''
    }

    <section class="section-block">
      <div class="section-head">
        <h2>整改任务</h2>
        <span>P1 ${bundle.remediation.priority_counts.P1} / P2 ${bundle.remediation.priority_counts.P2}</span>
      </div>
      <div class="task-list">
        ${bundle.remediation.tasks
          .map((task) => {
            const item = task as Record<string, any>;
            return `
              <article class="task-card">
                <div class="risk-meta-row">
                  <span class="priority-chip">${escapeHtml(item.priority || 'P3')}</span>
                  <span class="task-owner">${escapeHtml(item.owner_hint || '待指派')}</span>
                </div>
                <h3>${escapeHtml(item.title || '')}</h3>
                <p>${escapeHtml(item.objective || '')}</p>
                ${
                  Array.isArray(item.suggested_actions) && item.suggested_actions.length
                    ? `<div class="task-subsection"><p class="info-label">建议动作</p>${renderList(item.suggested_actions)}</div>`
                    : ''
                }
                ${
                  Array.isArray(item.required_evidence) && item.required_evidence.length
                    ? `<div class="task-subsection"><p class="info-label">所需证明材料</p>${renderList(item.required_evidence)}</div>`
                    : ''
                }
              </article>
            `;
          })
          .join('')}
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h2>证据清单</h2>
        <span>${bundle.evidence.checklist_count} 项</span>
      </div>
      <div class="evidence-list">
        ${bundle.evidence.checklist
          .map(
            (row) => `
              <article class="evidence-card">
                <div class="risk-meta-row">
                  <span class="risk-badge badge-${row.risk_level}">${row.risk_level}</span>
                  <span class="task-owner">${escapeHtml(row.owner_hint)}</span>
                </div>
                <h3>${escapeHtml(row.risk_point)}</h3>
                <p class="detail-muted">${escapeHtml(row.why_needed)}</p>
                <ul>${row.evidence_items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
              </article>
            `
          )
          .join('')}
      </div>
    </section>
  `;

  document.querySelector<HTMLButtonElement>('#downloadJsonButton')?.addEventListener('click', () => {
    downloadBlob(`${bundle.report.document_name}_report.json`, JSON.stringify(bundle.report, null, 2), 'application/json');
  });
  document
    .querySelector<HTMLButtonElement>('#downloadMarkdownButton')
    ?.addEventListener('click', () => {
      downloadBlob(`${bundle.report.document_name}_report.md`, bundle.markdown, 'text/markdown');
    });
}

function renderFailure(job: ReviewJobRecord) {
  app.innerHTML = `
    <section class="hero-shell">
      <div class="hero-card error-card">
        <p class="eyebrow">审查失败</p>
        <h1>${escapeHtml(job.documentName)}</h1>
        <p class="supporting">${escapeHtml(job.error || job.progress.message || '未知错误')}</p>
        <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">
          <button id="retryButton" class="btn-primary">重试审查</button>
          <button id="backButton" class="btn-secondary">返回侧栏</button>
        </div>
      </div>
    </section>
  `;

  document.querySelector<HTMLButtonElement>('#retryButton')?.addEventListener('click', async () => {
    await failJob(job.id, '');
    await runJob(job);
  });

  document.querySelector<HTMLButtonElement>('#backButton')?.addEventListener('click', () => {
    chrome.sidePanel.open();
  });
}

async function runJob(job: ReviewJobRecord) {
  const settings = await loadSettings();
  const worker = new Worker(chrome.runtime.getURL('workers/review.worker.js'), {
    type: 'module'
  });
  worker.postMessage({
    type: 'run-review',
    documentName: job.documentName,
    source: job.source,
    reviewType: job.reviewType,
    settings
  });

  worker.onmessage = async (event) => {
    if (event.data?.type === 'progress') {
      await updateJobProgress(job.id, event.data.progress, 'running');
      const fresh = await getJob(job.id);
      if (fresh) renderLoading(fresh);
      return;
    }
    if (event.data?.type === 'completed') {
      await completeJob(job.id, event.data.bundle);
      const fresh = await getJob(job.id);
      if (fresh?.result) renderCompleted(fresh, fresh.result);
      worker.terminate();
      return;
    }
    if (event.data?.type === 'failed') {
      await failJob(job.id, event.data.error);
      const fresh = await getJob(job.id);
      if (fresh) renderFailure(fresh);
      worker.terminate();
    }
  };
}

async function init() {
  if (!jobId) {
    app.innerHTML = '<p class="empty-state">缺少任务 ID。</p>';
    return;
  }
  const job = await getJob(jobId);
  if (!job) {
    app.innerHTML = '<p class="empty-state">未找到对应任务。</p>';
    return;
  }
  if (job.status === 'completed' && job.result) {
    renderCompleted(job, job.result);
    return;
  }
  if (job.status === 'failed') {
    renderFailure(job);
    return;
  }
  renderLoading(job);
  await runJob(job);
}

init().catch((error) => {
  app.innerHTML = `<p class="empty-state">${escapeHtml(String(error))}</p>`;
});
