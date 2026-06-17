import { describe, expect, it } from 'vitest';

import { runReviewPipeline } from '../src/engine/review';

describe('runReviewPipeline', () => {
  it('builds a complete report bundle for a privacy policy style text', async () => {
    const bundle = await runReviewPipeline({
      documentName: '测试隐私政策',
      source: {
        kind: 'text',
        fileName: 'policy.txt',
        text: [
          '隐私政策',
          '我们可能向合作伙伴共享设备标识、位置信息等信息，用于服务优化与个性化推荐。',
          '如业务需要，相关信息可能传输至境外。',
          '您不同意定位授权则无法继续使用附近服务。'
        ].join('\n')
      }
    });

    expect(bundle.report.document_name).toBe('测试隐私政策');
    expect(bundle.report.document_type).toBe('privacy_policy');
    expect(bundle.report.items.length).toBeGreaterThan(0);
    expect(bundle.report.stats.total).toBe(bundle.report.items.length);
    expect(bundle.report.risk_clusters.length).toBeGreaterThan(0);
    expect(bundle.report.items.some((item) => item.legal_basis.includes('《个人信息保护法》'))).toBe(true);
    expect(bundle.remediation.tasks.length).toBeGreaterThan(0);
    expect(bundle.evidence.checklist.length).toBe(bundle.report.items.length);
  });
});
