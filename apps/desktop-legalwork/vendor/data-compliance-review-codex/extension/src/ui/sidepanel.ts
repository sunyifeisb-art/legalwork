import { createReviewJob, listJobs } from '../storage/jobs';

type PendingSource =
  | { kind: 'text'; fileName: string; text: string }
  | { kind: 'binary'; fileName: string; mimeType: string; bytes: ArrayBuffer }
  | null;

const documentNameInput = document.querySelector<HTMLInputElement>('#documentName')!;
const textInput = document.querySelector<HTMLTextAreaElement>('#textInput')!;
const fileInput = document.querySelector<HTMLInputElement>('#fileInput')!;
const uploadZone = document.querySelector<HTMLDivElement>('#uploadZone')!;
const fileCard = document.querySelector<HTMLDivElement>('#fileCard')!;
const fileNameEl = document.querySelector<HTMLDivElement>('#fileName')!;
const fileSizeEl = document.querySelector<HTMLDivElement>('#fileSize')!;
const fileRemove = document.querySelector<HTMLButtonElement>('#fileRemove')!;
const pickFileButton = document.querySelector<HTMLButtonElement>('#pickFileButton')!;
const currentPageButton = document.querySelector<HTMLButtonElement>('#currentPageButton')!;
const startButton = document.querySelector<HTMLButtonElement>('#startReviewButton')!;
const statusBox = document.querySelector<HTMLDivElement>('#statusBox')!;
const recentJobs = document.querySelector<HTMLDivElement>('#recentJobs')!;
const settingsButton = document.querySelector<HTMLButtonElement>('#openSettingsButton')!;

const reviewToggle = document.querySelector<HTMLDivElement>('#reviewToggle')!;
const toggleIndicator = document.querySelector<HTMLSpanElement>('#toggleIndicator')!;

let pendingSource: PendingSource = null;
let reviewType: 'document' | 'code' = 'document';

function setStatus(message: string, tone: 'info' | 'error' = 'info') {
  statusBox.textContent = message;
  statusBox.dataset.tone = tone;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function showFileCard(name: string, size: number) {
  fileNameEl.textContent = name;
  fileSizeEl.textContent = formatFileSize(size);
  fileCard.style.display = 'flex';
  uploadZone.style.display = 'none';
}

function hideFileCard() {
  fileCard.style.display = 'none';
  uploadZone.style.display = 'grid';
}

function setModeCopy(type: 'document' | 'code') {
  const zoneTitle = uploadZone.querySelector('h3');
  const zoneDesc = uploadZone.querySelector('p');
  if (!zoneTitle || !zoneDesc) return;
  if (type === 'code') {
    zoneTitle.textContent = '点击或拖拽上传代码文件';
    zoneDesc.textContent = '支持 ZIP、JS、PY、TS、Java、Go 等';
  } else {
    zoneTitle.textContent = '点击或拖拽上传文档';
    zoneDesc.textContent = '支持 PDF、Word、Markdown、TXT';
  }
}

async function refreshJobs() {
  const jobs = await listJobs(8);
  if (!jobs.length) {
    recentJobs.innerHTML = '<p class="empty-state">还没有审查记录。</p>';
    return;
  }
  recentJobs.innerHTML = jobs
    .map(
      (job) => `
        <a class="history-item" data-job-id="${job.id}">
          <div>
            <div class="history-name">${job.documentName}</div>
            <div class="history-meta">${new Date(job.updatedAt).toLocaleString()}</div>
          </div>
          <span class="history-status">${job.status}</span>
        </a>
      `
    )
    .join('');

  recentJobs.querySelectorAll<HTMLAnchorElement>('[data-job-id]').forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      await chrome.runtime.sendMessage({
        type: 'openResultPage',
        jobId: link.dataset.jobId
      });
    });
  });
}

async function selectFile(file: File) {
  const bytes = await file.arrayBuffer();
  pendingSource = {
    kind: 'binary',
    fileName: file.name,
    mimeType: file.type || inferMimeType(file.name),
    bytes
  };
  if (!documentNameInput.value.trim()) {
    documentNameInput.value = file.name.replace(/\.[^.]+$/, '');
  }
  showFileCard(file.name, file.size);
  textInput.value = '';
  setStatus(`已选择文件：${file.name}`);
}

function inferMimeType(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (lower.endsWith('.doc')) return 'application/msword';
  if (lower.endsWith('.md')) return 'text/markdown';
  return 'text/plain';
}

/* ---- Review type toggle ---- */
document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const nextType = (btn as HTMLButtonElement).dataset.reviewType || 'document';
    if (nextType === reviewType) return;

    document.querySelectorAll('.mode-btn').forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    reviewType = nextType as 'document' | 'code';
    reviewToggle.dataset.active = nextType;
    toggleIndicator.classList.toggle('code-active', nextType === 'code');

    pendingSource = null;
    fileInput.value = '';
    hideFileCard();
    setModeCopy(reviewType);
  });

  btn.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes((event as KeyboardEvent).key)) return;
    event.preventDefault();
    const buttons = Array.from(document.querySelectorAll('.mode-btn'));
    const index = buttons.indexOf(btn);
    const nextIndex = (event as KeyboardEvent).key === 'ArrowRight'
      ? (index + 1) % buttons.length
      : (index - 1 + buttons.length) % buttons.length;
    (buttons[nextIndex] as HTMLButtonElement).focus();
    (buttons[nextIndex] as HTMLButtonElement).click();
  });
});

/* ---- Upload zone interactions ---- */
uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('drag-active');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-active');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-active');
  const file = e.dataTransfer?.files?.[0];
  if (file) selectFile(file);
});

pickFileButton.addEventListener('click', (e) => {
  e.stopPropagation();
  fileInput.click();
});

fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  await selectFile(file);
});

fileRemove.addEventListener('click', () => {
  pendingSource = null;
  fileInput.value = '';
  hideFileCard();
  setStatus('等待输入');
});

currentPageButton.addEventListener('click', async () => {
  setStatus('正在读取当前页 PDF...');
  const response = await chrome.runtime.sendMessage({ type: 'readCurrentTabPdf' });
  if (!response?.ok) {
    setStatus(response?.error || '当前页面无法读取 PDF', 'error');
    return;
  }

  const bytes = new Uint8Array(response.payload.bytes).buffer;
  const fileName = response.payload.fileName;
  pendingSource = {
    kind: 'binary',
    fileName,
    mimeType: response.payload.mimeType,
    bytes
  };
  if (!documentNameInput.value.trim()) {
    documentNameInput.value = fileName.replace(/\.[^.]+$/, '');
  }
  showFileCard(fileName, bytes.byteLength);
  textInput.value = '';
  setStatus(`已读取当前页 PDF：${fileName}`);
});

settingsButton.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'openOptionsPage' });
});

startButton.addEventListener('click', async () => {
  const documentName = documentNameInput.value.trim();
  if (!documentName) {
    setStatus('请输入文档名称', 'error');
    return;
  }

  let source = pendingSource;
  const text = textInput.value.trim();
  if (!source && text) {
    source = {
      kind: 'text',
      fileName: `${documentName}.txt`,
      text
    };
  }

  if (!source) {
    setStatus('请上传文件、粘贴文本，或读取当前页 PDF', 'error');
    return;
  }

  const job = await createReviewJob({ documentName, source, reviewType });
  setStatus('已创建任务，正在打开结果页...');
  await chrome.runtime.sendMessage({ type: 'openResultPage', jobId: job.id });
  await refreshJobs();
});

refreshJobs().catch((error) => setStatus(String(error), 'error'));
