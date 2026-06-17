import { describe, expect, it } from 'vitest';

import { classifyDocument } from '../src/engine/classify';

describe('classifyDocument', () => {
  it('classifies a privacy policy and returns its default review paths', () => {
    const text = [
      '某 App 隐私政策',
      '我们会收集个人信息、设备标识、位置信息，用于个性化推荐。',
      '如涉及跨境传输，我们会向境外接收方提供说明。'
    ].join('\n');

    const result = classifyDocument(text);

    expect(result.type).toBe('privacy_policy');
    expect(result.matchedKeywords).toEqual(
      expect.arrayContaining(['隐私政策', '个人信息', '位置信息', '个性化推荐', '境外接收方'])
    );
    expect(result.defaultReviewPaths).toContain('outbound_transfer_check');
    expect(result.defaultReviewPaths).toContain('field_purpose_legal_basis_check');
  });
});
