export interface TabLike {
  url?: string;
}

export interface PdfProbeResult {
  embedSrc?: string;
  iframeSrc?: string;
  anchorHref?: string;
}

export interface ResolvedPdfSource {
  kind: 'direct-url' | 'viewer-src' | 'embedded-src';
  url: string;
}

export function extractViewerSrc(url: string): string | null {
  if (!url.startsWith('chrome-extension://') && !url.startsWith('edge-extension://')) {
    return null;
  }
  try {
    const parsed = new URL(url);
    const src = parsed.searchParams.get('src');
    return src ? decodeURIComponent(src) : null;
  } catch {
    return null;
  }
}

export function resolvePdfSourceFromTab(tab: TabLike): ResolvedPdfSource | null {
  const url = tab.url?.trim();
  if (!url) return null;
  const viewerSrc = extractViewerSrc(url);
  if (viewerSrc) {
    return { kind: 'viewer-src', url: viewerSrc };
  }
  if (/\.pdf(?:$|[?#])/i.test(url)) {
    return { kind: 'direct-url', url };
  }
  return null;
}

export function inferPdfSourceFromProbe(
  probe: PdfProbeResult | null | undefined
): ResolvedPdfSource | null {
  const candidate = probe?.embedSrc || probe?.iframeSrc || probe?.anchorHref;
  if (!candidate) return null;
  return { kind: 'embedded-src', url: candidate };
}
