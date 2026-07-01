import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repository = process.env.GITHUB_REPOSITORY || 'sunyifeisb-art/legalwork';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const outputPath = path.resolve(process.cwd(), 'site-data/changelog.json');
const apiUrl = `https://api.github.com/repos/${repository}/releases?per_page=100`;

// Build website changelog data for end users: keep old versions, refresh matching tags,
// and translate technical release notes into user-visible changes.
function normalizeReleaseLine(line) {
  return String(line || '')
    .replace(/^#{1,6}\s*/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/^\d+[.)]\s+/, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim();
}

function extractHighlights(body, release) {
  const blocked = /^(本次更新重点[:：]?|更新内容[:：]?|full changelog|automated release|compare|https?:\/\/)/i;
  const highlights = String(body || '')
    .split(/\r?\n/)
    .map(normalizeReleaseLine)
    .filter((line) => line && !blocked.test(line))
    .filter((line) => !/^legalwork\s+\d/i.test(line))
    .map(toUserFacingHighlight)
    .filter(Boolean);

  const uniqueHighlights = [...new Set(highlights)].slice(0, 5);
  if (uniqueHighlights.length) return uniqueHighlights;
  if (release.name && release.name !== release.tag_name) {
    return [`${release.name} 已上线，安装后即可使用这一版的新能力与体验优化。`];
  }
  return ['新版本已经发布，可前往下载最新版安装包，获得最新功能与稳定性改进。'];
}

function toUserFacingHighlight(line) {
  const text = normalizeReleaseLine(line);
  if (!text) return '';
  if (/TypeScript|README|blockmap|latest.*ya?ml|自动更新元数据|Automated release|commit|sha/i.test(text)) {
    return '';
  }
  if (/国家法律法规数据库|flk\.npc\.gov\.cn|法规知识库.*实时检索|法规.*实时检索/.test(text)) {
    return '法规检索更及时：可以直接查询国家法律法规数据库，查找法律依据更方便。';
  }
  if (/知识库自动分类|语义检索|多格式解析|外部权威源|团队写作风格库/.test(text)) {
    return '知识库更好用：资料可自动分类、语义检索，并支持沉淀团队写作风格。';
  }
  if (/插件市场|15\s*个类目|访问令牌|Skill 工具入口|项目技能/.test(text)) {
    return '插件和技能更容易找到：按使用场景分类展示，扩展能力接入更清晰。';
  }
  if (/对话时间线|折叠输入请求|错误\/提醒|已用时长|任务已用时长/.test(text)) {
    return '对话记录更清楚：请求、错误、提醒和任务耗时会分组展示，复盘更省力。';
  }
  if (/Git 分支|中文错误提示/.test(text)) {
    return '问题提示更易懂：遇到 Git 分支相关问题时，会看到更清楚的中文说明。';
  }
  if (/数据合规|图片附件|附件上传|上传交互/.test(text)) {
    return '数据合规和附件上传体验优化，处理图片和材料时操作反馈更明确。';
  }
  if (/文件脱敏|脱敏|敏感/.test(text)) {
    return '文件脱敏能力优化，处理客户材料和敏感信息时更稳妥。';
  }
  if (/OCR|识别|扫描/.test(text)) {
    return '文档识别能力优化，扫描件和图片材料的处理更顺畅。';
  }
  if (/运行时版本同步|桌面端.*升级|升级到\s*v?\d/i.test(text)) {
    return '桌面端已升级，安装最新版后即可使用新的功能与稳定性改进。';
  }
  if (/修复|错误|失败|异常|bug/i.test(text)) {
    return `修复了使用中的稳定性问题：${text}`;
  }
  if (/新增|支持|增强|优化|完善|改进/.test(text)) {
    return text
      .replace(/^新增/, '新增可用能力：')
      .replace(/^支持/, '现在支持：')
      .replace(/^增强/, '体验增强：')
      .replace(/^优化/, '体验优化：')
      .replace(/^完善/, '体验完善：')
      .replace(/^改进/, '体验改进：');
  }
  return `使用体验更新：${text}`;
}

function getCategories(highlights) {
  const text = highlights.join(' ');
  const buckets = [
    ['法规知识库', /法规|知识库|检索|语义|解析|权威|数据库/],
    ['插件市场', /插件|市场|令牌|skill|技能/i],
    ['对话体验', /对话|时间线|输入|错误|提醒|任务|分组/],
    ['数据合规', /合规|脱敏|隐私|附件|上传|图片/],
    ['桌面端', /桌面|安装包|mac|windows|linux|运行时|版本/i],
    ['修复优化', /修复|优化|完善|增强|改进|错误/],
  ];
  const categories = buckets.filter(([, test]) => test.test(text)).map(([label]) => label);
  return categories.length ? categories.slice(0, 4) : ['版本发布'];
}

function getInstallAssets(assets) {
  return (Array.isArray(assets) ? assets : [])
    .filter((asset) => /\.(dmg|zip|exe|AppImage)$/i.test(asset.name || ''))
    .map((asset) => ({
      name: asset.name,
      browser_download_url: asset.browser_download_url,
      download_count: asset.download_count || 0,
      size: asset.size || 0,
    }));
}

async function fetchReleases() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(apiUrl, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  }
  const releases = await response.json();
  if (!Array.isArray(releases)) throw new Error('GitHub releases response is not an array');
  return releases;
}

function shapeRelease(release) {
  const highlights = extractHighlights(release.body, release);
  const categories = getCategories(highlights);
  const focus = categories.slice(0, 3).join('、');
  return {
    tag_name: release.tag_name,
    name: release.name || release.tag_name,
    published_at: release.published_at,
    html_url: release.html_url,
    prerelease: Boolean(release.prerelease),
    summary: focus && focus !== '版本发布'
      ? `本次更新主要改善 ${focus} 相关体验，帮助用户更快找到功能、处理材料并判断是否需要升级。`
      : '本次发布带来功能和稳定性改进，安装最新版后即可体验。',
    highlights,
    categories,
    assets: getInstallAssets(release.assets),
  };
}

function versionTime(release) {
  const value = Date.parse(release?.published_at || '');
  return Number.isFinite(value) ? value : 0;
}

function mergeReleases(existingReleases, fetchedReleases) {
  const byTag = new Map();
  for (const release of Array.isArray(existingReleases) ? existingReleases : []) {
    if (release?.tag_name) byTag.set(release.tag_name, release);
  }
  for (const release of fetchedReleases) {
    if (release?.tag_name) byTag.set(release.tag_name, release);
  }
  return [...byTag.values()].map(sanitizeStoredRelease).sort((a, b) => {
    const timeDiff = versionTime(b) - versionTime(a);
    if (timeDiff) return timeDiff;
    return String(b.tag_name || '').localeCompare(String(a.tag_name || ''), undefined, { numeric: true });
  });
}

function sanitizeStoredRelease(release) {
  const { body, ...storedRelease } = release;
  return storedRelease;
}

const fetchedReleases = (await fetchReleases())
  .filter((release) => !release.draft)
  .map(shapeRelease);

let existingReleases = [];
let generatedAt = new Date().toISOString();

try {
  const existing = JSON.parse(await readFile(outputPath, 'utf8'));
  existingReleases = Array.isArray(existing.releases) ? existing.releases : [];
  generatedAt = existing.generated_at || generatedAt;
} catch (error) {
  // First run or unreadable JSON; write a fresh generated_at value.
}

const releases = mergeReleases(existingReleases, fetchedReleases);
const stablePayload = { repository, releases };

try {
  const existing = JSON.parse(await readFile(outputPath, 'utf8'));
  const existingStablePayload = {
    repository: existing.repository,
    releases: existing.releases,
  };
  if (JSON.stringify(existingStablePayload) !== JSON.stringify(stablePayload)) {
    generatedAt = new Date().toISOString();
  }
} catch (error) {
  generatedAt = new Date().toISOString();
}

const payload = {
  generated_at: generatedAt,
  ...stablePayload,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${releases.length} releases to ${path.relative(process.cwd(), outputPath)}`);
