import { describe, expect, it } from 'vitest';

import {
  inferPdfSourceFromProbe,
  resolvePdfSourceFromTab
} from '../src/browser/pdfSource';

describe('pdf source resolution', () => {
  it('uses direct pdf urls as the source', () => {
    const resolved = resolvePdfSourceFromTab({
      url: 'https://example.com/policy.pdf'
    });

    expect(resolved).toEqual({
      kind: 'direct-url',
      url: 'https://example.com/policy.pdf'
    });
  });

  it('extracts a pdf src from the chromium viewer url', () => {
    const resolved = resolvePdfSourceFromTab({
      url: 'chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai/index.html?src=https%3A%2F%2Fexample.com%2Fcross-border.pdf'
    });

    expect(resolved).toEqual({
      kind: 'viewer-src',
      url: 'https://example.com/cross-border.pdf'
    });
  });

  it('falls back to detected embed or iframe sources from page probes', () => {
    const resolved = inferPdfSourceFromProbe({
      embedSrc: 'https://example.com/sdk-disclosure.pdf'
    });

    expect(resolved).toEqual({
      kind: 'embedded-src',
      url: 'https://example.com/sdk-disclosure.pdf'
    });
  });
});
