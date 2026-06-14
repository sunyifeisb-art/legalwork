import { inferPdfSourceFromProbe, resolvePdfSourceFromTab } from './browser/pdfSource';

async function probePageForPdf(tabId: number) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const embed = document.querySelector<HTMLEmbedElement>('embed[type="application/pdf"], embed[src$=".pdf"]');
      const iframe = document.querySelector<HTMLIFrameElement>('iframe[src$=".pdf"], iframe[type="application/pdf"]');
      const anchor = document.querySelector<HTMLAnchorElement>('a[href$=".pdf"]');
      return {
        embedSrc: embed?.src,
        iframeSrc: iframe?.src,
        anchorHref: anchor?.href
      };
    }
  });
  return result;
}

async function resolveCurrentTabPdf() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error('未找到当前标签页');
  }
  const direct = resolvePdfSourceFromTab({ url: tab.url });
  if (direct) {
    const fileName = safeDecodeFileName(direct.url.split('/').pop() || 'current-page.pdf');
    return {
      url: direct.url,
      fileName
    };
  }
  const probe = await probePageForPdf(tab.id);
  const inferred = inferPdfSourceFromProbe(probe);
  if (!inferred) {
    throw new Error('当前页面不是可直接读取的 PDF 文档');
  }
  return {
    url: inferred.url,
    fileName: safeDecodeFileName(inferred.url.split('/').pop() || 'current-page.pdf')
  };
}

function safeDecodeFileName(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'openResultPage') {
    chrome.tabs
      .create({
        url: chrome.runtime.getURL(`result.html?jobId=${encodeURIComponent(message.jobId)}`)
      })
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  if (message?.type === 'openOptionsPage') {
    chrome.runtime.openOptionsPage().then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === 'readCurrentTabPdf') {
    resolveCurrentTabPdf()
      .then(async ({ url, fileName }) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`读取当前 PDF 失败: ${response.status}`);
        }
        const bytes = await response.arrayBuffer();
        sendResponse({
          ok: true,
          payload: {
            fileName,
            mimeType: 'application/pdf',
            bytes: Array.from(new Uint8Array(bytes))
          }
        });
      })
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  return false;
});
