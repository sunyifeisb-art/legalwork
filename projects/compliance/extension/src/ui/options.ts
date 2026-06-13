import { loadSettings, saveSettings } from '../storage/settings';

const aiEnabledInput = document.querySelector<HTMLInputElement>('#aiEnabled')!;
const apiKeyInput = document.querySelector<HTMLInputElement>('#apiKey')!;
const baseUrlInput = document.querySelector<HTMLInputElement>('#baseUrl')!;
const modelInput = document.querySelector<HTMLInputElement>('#model')!;
const saveButton = document.querySelector<HTMLButtonElement>('#saveSettingsButton')!;
const statusBox = document.querySelector<HTMLDivElement>('#settingsStatus')!;

function setStatus(message: string) {
  statusBox.textContent = message;
}

async function init() {
  const settings = await loadSettings();
  aiEnabledInput.checked = settings.aiEnabled;
  apiKeyInput.value = settings.deepseekApiKey;
  baseUrlInput.value = settings.deepseekBaseUrl;
  modelInput.value = settings.deepseekModel;
}

saveButton.addEventListener('click', async () => {
  await saveSettings({
    aiEnabled: aiEnabledInput.checked,
    deepseekApiKey: apiKeyInput.value,
    deepseekBaseUrl: baseUrlInput.value,
    deepseekModel: modelInput.value
  });
  setStatus('设置已保存');
});

init().catch((error) => setStatus(String(error)));
