const API_BASE = 'http://127.0.0.1:5100';

self.onmessage = async (event: MessageEvent) => {
  if (event.data?.type !== 'run-review') return;

  try {
    const { documentName, source, reviewType } = event.data;
    const formData = new FormData();

    formData.append('document_name', documentName);
    formData.append('review_type', reviewType || 'document');

    if (source.kind === 'text') {
      formData.append('input_text', source.text);
    } else if (source.kind === 'binary') {
      const blob = new Blob([source.bytes], { type: source.mimeType });
      formData.append('file', blob, source.fileName);
    }

    self.postMessage({ type: 'progress', progress: { step: 1, totalSteps: 9, message: '提交审查请求...', status: 'running' } });

    let taskId: string;
    try {
      const uploadRes = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const errText = await uploadRes.text().catch(() => '');
        throw new Error(`上传失败 (${uploadRes.status}): ${errText || uploadRes.statusText}`);
      }
      const uploadData = await uploadRes.json();
      taskId = uploadData.task_id;
      if (!taskId) throw new Error('服务端未返回任务 ID');
    } catch (err) {
      throw new Error(`上传请求失败: ${err instanceof Error ? err.message : String(err)}`);
    }

    // 轮询审查进度（API 返回 SSE 格式，需解析 data: 行）
    let attempts = 0;
    let lastStatus = '';
    while (attempts < 120) {
      await new Promise(r => setTimeout(r, 2000));
      attempts++;

      let progRes: Response;
      try {
        progRes = await fetch(`${API_BASE}/api/progress/${taskId}`);
      } catch (err) {
        self.postMessage({ type: 'progress', progress: { step: attempts, totalSteps: 9, message: `连接中... (${attempts})`, status: 'running' } });
        continue;
      }

      if (!progRes.ok) {
        self.postMessage({ type: 'progress', progress: { step: attempts, totalSteps: 9, message: `查询进度... (${attempts})`, status: 'running' } });
        continue;
      }

      const text = await progRes.text();
      // 解析 SSE: 取最后一个 data: JSON 行
      const lines = text.split('\n').filter(l => l.startsWith('data: '));
      if (lines.length === 0) continue;

      let last: any;
      try {
        last = JSON.parse(lines[lines.length - 1].slice(6));
      } catch {
        continue;
      }
      lastStatus = last.status;

      if (last.status === 'completed') {
        self.postMessage({ type: 'progress', progress: { step: 9, totalSteps: 9, message: '审查完成', status: 'completed' } });
        break;
      } else if (last.status === 'failed') {
        throw new Error(last.error || last.message || '审查失败');
      } else {
        const step = last.progress?.step || 0;
        const msg = last.progress?.message || '审查进行中...';
        self.postMessage({ type: 'progress', progress: { step, totalSteps: 9, message: msg, status: 'running' } });
      }
    }

    if (attempts >= 120) throw new Error('审查超时（超过 4 分钟）');

    // 获取审查结果
    let bundle: any;
    try {
      const resultRes = await fetch(`${API_BASE}/api/result/${taskId}`);
      if (!resultRes.ok) {
        const errText = await resultRes.text().catch(() => '');
        throw new Error(`获取结果失败 (${resultRes.status}): ${errText || resultRes.statusText}`);
      }
      bundle = await resultRes.json();
      bundle.task_id = taskId;
    } catch (err) {
      throw new Error(`获取结果失败: ${err instanceof Error ? err.message : String(err)}`);
    }

    self.postMessage({ type: 'completed', bundle });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ type: 'failed', error: message });
  }
};
