import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repository = process.env.GITHUB_REPOSITORY || 'sunyifeisb-art/legalwork';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const outputPath = path.resolve(process.cwd(), 'site-data/changelog.json');
const apiUrl = `https://api.github.com/repos/${repository}/releases?per_page=100`;

// Build website changelog data for end users: keep old versions, refresh matching tags,
// and translate technical release notes into user-visible changes.
const cumulativeReleaseOverrides = {
  // 手写条目：从 markdown 正文自动提取会把小标题也当成亮点，这条是官网门面，
  // 由人工整理成用户能直接看懂的更新内容。
  'v0.3.34': {
    summary: '本次更新包括：知识库调用、长任务反馈、默认设置。',
    categories: ['知识库', '对话体验', '修复优化'],
    highlights: [
      'IMA 知识库工具不再被策略拦截：主对话和文档交付等步骤中始终可用。此前模型会回答"当前没有 IMA 工具"，只有在提问里点名 IMA 才会去用。',
      'IMA 的推理过程会实时滚动显示，不再只转一个圈。',
      '复杂任务的执行推理改为节流式实时显示，"在思考"和"卡住"能一眼区分。此前强制检索步骤会推理几十秒而界面全程静止。',
      '模型长时间无响应时不再重发整个请求，避免最坏 45 秒空白，也避免把数万字的提示词重复计费。',
      '默认模型改为明确的 deepseek-flash，不再显示"自动"。',
      '外网 MCP（GitHub、Flint Chart 等）连不上时只提示"需要网络环境"，不再标红报错；鉴权类错误仍照常提示。',
      '本次提供 Windows 64 位、macOS（Apple 芯片 / Intel 芯片）三个版本，不再提供 32 位 Windows 版本。'
    ]
  },
  'v0.2.2': {
    baseline: 'v0.1.8',
    summary: '从 v0.1.8 到 v0.2.2 的累计更新：知识库、法规检索、插件技能、对话工作台、附件处理、自动更新和安装稳定性均有明显升级。',
    categories: ['累计更新', '知识库', '插件技能', '体验优化'],
    highlights: [
      '法规检索接入国家法律法规数据库，可以检索现行法律、行政法规、地方性法规、司法解释、规章和规范性文件。',
      '具体法条查询更直接：已知法规名称、关键词或条文号时，系统会优先定位官方候选结果，并给出来源链接。',
      '知识库升级为可托管资料库，支持多目录接入、增量同步、分块索引和语义检索。',
      '知识库支持自动分类，可把混杂文件归入法规规范、合同协议、诉讼仲裁、案例判例、调研报告、模板范本、图片资料、表格数据等类别。',
      '知识库文件管理更完整，支持树形浏览、读取、写入、新建目录、移动、删除和一键归档。',
      '新增知识库全局 AI 对话，可围绕整个知识库提问，适合查询法律条款、总结资料、梳理案例和形成分析思路。',
      '外部权威来源更丰富，可查看官方政府网站、司法数据库、学术法律平台等来源，用于补充本地知识库之外的法规与案例信息。',
      '插件和技能市场重新分类，按法律与合规、数据处理、检索研究、浏览器网页、前端设计等 15 个类目展示。',
      '技能系统增强，新增内置 Skill 工具入口、项目技能发现与运行能力，并补充网页访问、内容抓取、技能创建等常用技能。',
      '法律 AI 技能库扩展，新增反垄断、仲裁、银行金融、破产重整、资本市场、公司治理、税务、信托家事、白领调查等场景模板。',
      'MCP 工具接入更方便，插件页支持 MCP 源市场和访问令牌配置，外部工具服务更容易接入 Agent。',
      '对话时间线更清爽，请求、错误、提醒会按数量分组折叠，并显示任务已用时长。',
      '文档和附件处理增强，新增 DOCX 纯文本提取链路，工作区文件、附件和工具调用中的文档读取更稳定。',
      '图片附件上传体验优化，处理图片材料和数据合规任务时反馈更明确。',
      '数据合规与脱敏流程优化，合规面板、任务运行、文件上传和相关设置体验更顺畅。',
      '聊天工作台细节优化，包括模型选择器、浮动输入框、消息时间线、知识库视图、侧边栏和工作区模式切换。',
      '模型兼容性增强，Anthropic / DeepSeek 兼容客户端行为更稳定。',
      '自动更新和安装流程修复，改进更新安装兜底、Windows Python 安装、Windows 安装器关闭应用、macOS 权限等问题。',
      'Git 分支选择的错误提示改为更清楚的中文说明。',
      '下载页和产品介绍页更新，展示新版界面截图和更完整的功能说明。'
    ],
  },
  'v0.2.3': {
    summary: '新增用户自装 Skill 能力，并对 Agent 运行稳定性、模型兼容性和发布流程做了多项改进。',
    categories: ['插件市场', 'Agent 运行', '模型兼容', '修复优化'],
    highlights: [
      '用户自装 Skill：可以从本地文件夹或 zip 包导入 Skill，插件市场会单独展示「用户已安装」分类。',
      'Agent 运行更稳定：目标续传单轮增加 32 步上限，避免模型无工具调用时空转。',
      '对话渲染更流畅：SSE 文本增量改为 32ms 批量刷新，减少前端渲染压力。',
      'MCP 状态修复：修复 tool provider 中 server 对象被错误覆盖的问题。',
      'DeepSeek 兼容增强：思考模式不再限制特定 host，支持更多模型开启思考能力。',
      '运行时启动更稳健：增加并发去重和健康检查等待，减少启动失败。',
      '诊断与配置优化：内存记录仅在 capability 可用时加载，存储键统一迁移到 legalwork.*。'
    ],
  },
  'v0.2.4': {
    summary: '修复 v0.2.3 中 agent-loop 系统提示包含源码的回归问题。',
    categories: ['修复优化', 'Agent 运行'],
    highlights: [
      '修复 agent-loop 系统提示回归：goalContinuationInstruction 的模板字符串意外把常量定义和函数源码包含进提示，已修复为正常文案。',
      '补全 README 中 v0.2.2 / v0.2.3 / v0.2.4 的更新记录。'
    ],
  },
  'v0.2.7': {
    summary: '自动更新兜底安装、数据合规批量任务、文书生成历史侧边栏等多项体验优化。',
    categories: ['桌面端', '数据合规', '插件技能', '修复优化'],
    highlights: [
      'macOS 自动更新增加 zip 兜底安装：当原生 updater 未触发应用退出时，自动执行已下载 zip 的替代安装流程，降低更新失败概率。',
      '数据合规支持批量任务：可一次提交多个文件进行审查或脱敏，自动生成清单并统一调度；worker 扩展 Excel、PPT、PDF、OCR 等文件解析能力。',
      '文书生成历史改为侧边栏：历史记录从弹窗迁移到左侧边栏，生成后自动保存并刷新，切换和回溯更便捷。',
      '法律研究与知识库继续优化：文件预览、分类和问答交互体验进一步提升。',
      'web-access skill 增强：新增 CDP proxy 脚本与 API 参考，浏览器自动化链路更完整。'
    ],
  },
  'v0.2.9': {
    summary: 'OfficeCLI 集成、数据合规引擎优化、Agent 附件本地路径引用等多项更新。',
    categories: ['插件市场', '数据合规', 'Agent 运行', '修复优化'],
    highlights: [
      'OfficeCLI 集成：新增 Office 文档读写 MCP server，打包流程自动处理 binary，配置变更后运行时自动重启生效。',
      'Agent 附件支持本地路径引用：文件附件可直接以本地路径形式提供给 Agent，提升文件类任务处理精度。',
      '数据合规本地引擎优化：Python 依赖按核心/可选 OCR 包拆分，安装完成后写入标记避免重复校验，启动更快更稳。',
      '数据合规面板体验改进：进度弹窗支持完成/失败状态展示，任务生命周期更直观。',
      '脱敏引擎主体识别增强：新增法定代表人、委托诉讼代理人、律所、公司/机构等识别规则，脱敏覆盖更完整。'
    ],
  },
  'v0.3.10': {
    summary: '模型配置独立设置项、ChatGPT 账号认证、中转站支持、数据合规与脱敏升级、对话文件悬浮层，以及一批稳定性修复。',
    categories: ['模型设置', '数据合规', '法律调研', '对话文件', '修复优化'],
    highlights: [
      '模型设置更清晰：新增「模型配置」独立入口，模型服务、认证方式、API Key、服务地址、模型列表集中管理；认证方式可选「API Key」或「ChatGPT 账号」，选 ChatGPT 账号后用订阅额度无需填 Key。',
      '支持更多第三方模型服务（中转站）：可在设置里选择模型服务对接协议，中转站、Claude 中转、OpenAI 中转都能接上，接 DeepSeek 模型更稳、费用显示更准。',
      '数据合规与脱敏升级：脱敏能识别自然人姓名、企业名称、律所、地址、电话、身份证号、银行卡号、邮箱、账号、出生日期、IP 等十余类敏感信息并分类标注；结果支持导出 Word、PDF、Markdown、纯文本。',
      '对话文件列表改悬浮小窗：点「对话文件」才弹出列表，点文件后才开右侧预览，不占主界面；同一文件不再重复显示，更多文本/代码格式可预览。',
      '法律调研更稳定：修了规划后卡住、只出规划没检索、规划跑进总结等问题；仅生成规划未检索会明确提示；阶段播报编号对齐；调研记录不再混进主页对话。'
    ],
  },
  'v0.3.15': {
    summary: '知识库检索升级（SQLite FTS 索引）、新增 12 个内嵌法律技能库、自定义 Skill 增强，以及一批稳定性修复。',
    categories: ['知识库', '技能库', '模型兼容', '稳定性', '体验优化'],
    highlights: [
      '知识库检索升级：新增增量 SQLite FTS 索引 + 修订感知缓存 + 结构化分块，按标题层级切分、带出处与哈希，检索更快更准（LEGALWORK_KNOWLEDGE_SQLITE=1 开启）。',
      '新增 12 个内嵌法律技能库：商标助手、Open-Kimi-PPT、法律可视化、元典法律检索、专利申请/下载、法律问答抽取、引注核查、OPC 法务顾问、裁判文书、代码转专利等。',
      '自定义 Skill 增强：支持上传纯 Markdown skill，只有 SKILL.md 的 skill 导入后自动补 skill.json，可用 /命令 显式触发、也能关键词自动激活。',
      '中转站 Claude 调用失败原因透传：不再只报笼统 "Agent turn failed"，余额不足 / HTTP 错误 / 流中断等真实原因会显示出来。',
      '稳定性与体验修复：脱敏环境 Python 压缩包损坏自动重下；学习线程 Windows 写状态失败自动重试；不影响功能的工具报错不再红色告警；知识库侧栏恢复可拖动；Apple/Windows 字体排版自适应。'
    ],
  },
};

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
    .sort((a, b) => getAssetPriority(a.name) - getAssetPriority(b.name))
    .map((asset) => ({
      name: asset.name,
      browser_download_url: asset.browser_download_url,
      download_count: asset.download_count || 0,
      size: asset.size || 0,
    }));
}

function getAssetPriority(name) {
  const value = String(name || '');
  if (/mac-.*\.dmg$/i.test(value)) return 0;
  if (/win-x64\.exe$/i.test(value)) return 1;
  if (/mac-.*\.zip$/i.test(value)) return 2;
  if (/win-ia32\.exe$/i.test(value)) return 3;
  if (/\.AppImage$/i.test(value)) return 4;
  return 5;
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
  const override = cumulativeReleaseOverrides[release.tag_name];
  if (override) {
    return {
      tag_name: release.tag_name,
      name: override.baseline ? `${release.name || release.tag_name} 累计更新` : (release.name || release.tag_name),
      published_at: release.published_at,
      html_url: release.html_url,
      prerelease: Boolean(release.prerelease),
      summary: override.summary,
      highlights: override.highlights,
      categories: override.categories,
      baseline: override.baseline,
      assets: getInstallAssets(release.assets),
    };
  }
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
      ? `本次更新包括：${focus}。`
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
  if (typeof storedRelease.summary === 'string' && /帮助用户更快找到功能|判断是否需要升级/.test(storedRelease.summary)) {
    const categories = Array.isArray(storedRelease.categories) ? storedRelease.categories : [];
    const focus = categories.slice(0, 3).join('、');
    storedRelease.summary = focus && focus !== '版本发布'
      ? `本次更新包括：${focus}。`
      : '本次发布带来功能和稳定性改进，安装最新版后即可体验。';
  }
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
