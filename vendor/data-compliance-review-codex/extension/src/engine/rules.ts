import { containsAny, findRelevantSnippets, uniqueKeepOrder } from './utils';

const RISK_LEVEL_ORDER: Record<string, number> = {
  无: 0,
  建议优化: 1,
  中风险: 2,
  高风险: 3
};

type RuleSpec = {
  triggerTerms: string[];
  requiredGroups: Array<{ name: string; terms: string[]; suggestion: string }>;
  ambiguityTerms: string[];
  riskPoint: string;
  legalBasis: string;
  defaultSuggestion: string;
  overreachTerms?: string[];
  broadPurposeTerms?: string[];
  dataTerms?: string[];
  sensitiveDataTerms?: string[];
  minorTerms?: string[];
  sensitiveTerms?: string[];
  optionalFeatureTerms?: string[];
  permissionTerms?: string[];
  bundlingTerms?: string[];
  purposeTerms?: string[];
  basisTerms?: string[];
  highRiskPurposeTerms?: string[];
};

const RISK_RULES: Record<string, RuleSpec> = {
  outbound_transfer_check: {
    triggerTerms: ['境外接收方', '跨境', '出境', '标准合同', '安全评估', '境外'],
    requiredGroups: [
      { name: '境外接收方身份', terms: ['境外接收方', '接收方', '接收主体', '主体名称', '公司名称'], suggestion: '明确境外接收方名称、身份或主体信息' },
      { name: '联系方式', terms: ['联系方式', '联系邮箱', '联系电话', '联系地址'], suggestion: '补充境外接收方联系方式或联系渠道' },
      { name: '出境场景与必要性', terms: ['出境场景', '跨境场景', '为实现', '业务需要', '必要性', '必要'], suggestion: '说明出境场景、业务目的与必要性边界' },
      { name: '保障机制', terms: ['标准合同', '安全评估', '认证', '保护措施', '保障机制'], suggestion: '说明已采取的保障机制，如标准合同、安全评估或其他保护措施' }
    ],
    ambiguityTerms: ['相关方', '必要时', '可能', '等', '包括但不限于'],
    riskPoint: '数据出境相关披露可能不足',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '补充境外接收方信息、出境场景、必要性说明及保障机制。'
  },
  third_party_sharing_check: {
    triggerTerms: ['第三方', '合作方', '合作伙伴', '委托处理', '共享', 'SDK', '受托方'],
    requiredGroups: [
      { name: '第三方身份或类别', terms: ['第三方', '合作方', '合作伙伴', '受托方', '委托处理方', 'SDK', '服务商', '接收方'], suggestion: '明确第三方、受托方或 SDK 的身份、名称或类别' },
      { name: '共享信息范围', terms: ['信息类型', '字段', '范围', '类别', '手机号', '设备标识', '位置信息', '个人信息类型'], suggestion: '列明共享或委托处理的信息类型、字段范围' },
      { name: '共享目的', terms: ['目的', '用于', '为实现', '共享目的'], suggestion: '说明共享或委托处理的业务目的' },
      { name: '处理方式或管理要求', terms: ['方式', '委托处理', '接口传输', '匿名化', '去标识化', '协议', '管理要求'], suggestion: '说明共享方式、委托处理安排及管理要求' }
    ],
    ambiguityTerms: ['合作伙伴', '相关方', '必要时', '可能', '等', '包括但不限于', '相关服务'],
    riskPoint: '第三方共享或委托处理披露可能不足',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '补充第三方类别、共享范围、目的及处理方式。'
  },
  disclosure_check: {
    triggerTerms: ['收集', '使用', '处理', '个人信息', '信息类型'],
    requiredGroups: [
      { name: '处理目的', terms: ['目的', '用于', '为了', '为实现'], suggestion: '补充处理目的或业务场景说明' },
      { name: '处理方式', terms: ['方式', '如何', '通过', '处理方式'], suggestion: '说明具体处理方式，而不是只写收集或使用' },
      { name: '信息范围', terms: ['信息类型', '个人信息', '类别', '范围', '手机号', '设备标识', '位置信息'], suggestion: '列明处理的信息类型、类别或范围' },
      { name: '用户权利与联系方式', terms: ['用户权利', '查询', '更正', '删除', '撤回同意', '联系我们', '联系方式'], suggestion: '补充用户权利、联系方式与权利行使渠道' }
    ],
    ambiguityTerms: ['相关信息', '必要信息', '等', '包括但不限于', '适当', '必要时'],
    riskPoint: '重要处理事项披露可能不充分',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '补充处理目的、方式、范围及用户权利告知。'
  },
  lawful_basis_check: {
    triggerTerms: ['同意', '授权', '必要', '处理', '推荐', '营销', '画像'],
    requiredGroups: [
      { name: '合法性基础', terms: ['同意', '单独同意', '授权', '履行合同', '法定义务', '法定职责', '公共利益'], suggestion: '明确对应的合法性基础，如同意、履行合同、法定义务等' },
      { name: '必要性边界', terms: ['必要', '最小', '最少', '仅限', '限于', '必要性'], suggestion: '说明必要性边界与最小必要范围' },
      { name: '授权范围', terms: ['授权范围', '处理范围', '适用范围', '使用范围'], suggestion: '明确授权或处理范围，避免范围过宽' }
    ],
    ambiguityTerms: ['为提升服务', '服务优化', '体验优化', '必要时', '可能'],
    overreachTerms: ['营销', '推荐', '画像', '个性化', '精准', '广告'],
    riskPoint: '合法性基础与必要性表达可能不足',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '明确同意/授权基础及必要性边界。'
  },
  purpose_scope_check: {
    triggerTerms: ['位置信息', '设备标识', '浏览记录', '通讯录', '联系人', '身份证', '银行卡', '相册', '麦克风', '剪贴板', '营销推荐', '个性化推荐', '商业分析', '服务优化', '用户画像'],
    requiredGroups: [
      { name: '具体业务目的', terms: ['用于', '为了', '为实现', '业务目的', '具体目的'], suggestion: '把处理目的写具体，不要只写服务优化、体验提升等宽泛表述' },
      { name: '信息与目的对应关系', terms: ['分别用于', '对应', '与上述目的相关', '信息类型', '字段'], suggestion: '说明每类信息分别对应什么目的，避免目的与范围脱节' },
      { name: '必要性边界或最小化说明', terms: ['必要', '最小必要', '仅限', '最少', '范围'], suggestion: '说明为何属于实现目的所必需，以及最小必要边界' },
      { name: '可选性或替代方案', terms: ['可选', '关闭', '拒绝', '不影响基本功能', '替代方案'], suggestion: '对非核心场景说明可选性、关闭方式或不授权的影响' }
    ],
    ambiguityTerms: ['服务优化', '体验提升', '商业分析', '相关服务', '包括但不限于', '等信息', '其他信息'],
    broadPurposeTerms: ['服务优化', '体验提升', '营销推荐', '个性化推荐', '商业分析', '用户画像', '精准营销'],
    dataTerms: ['位置信息', '精准定位', '设备标识', '浏览记录', '通讯录', '联系人', '身份证', '银行卡', '相册', '麦克风', '剪贴板', '交易记录'],
    sensitiveDataTerms: ['精准定位', '通讯录', '联系人', '身份证', '银行卡', '相册', '麦克风', '剪贴板'],
    riskPoint: '处理目的与信息范围匹配性可能不足',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '说明每类信息与具体目的的对应关系，压缩非必要范围，并补充可选性或替代方案。'
  },
  sensitive_personal_info_check: {
    triggerTerms: ['生物识别', '指纹', '人脸', '面部识别', '医疗健康', '病历', '银行卡', '金融账户', '财产信息', '行踪轨迹', '精准定位', '通讯录', '未成年人', '十四周岁', '14周岁', '儿童'],
    requiredGroups: [
      { name: '单独同意或明示授权', terms: ['单独同意', '明示同意', '单独授权', '明确同意'], suggestion: '补充敏感个人信息处理所需的单独同意或等效授权安排' },
      { name: '处理必要性与具体目的', terms: ['必要', '为实现', '用于', '具体目的', '业务需要'], suggestion: '说明处理敏感个人信息的具体目的及必要性，避免宽泛使用' },
      { name: '严格保护措施', terms: ['加密', '访问控制', '严格保护', '安全措施', '脱敏', '权限控制'], suggestion: '说明针对敏感个人信息采取的严格保护措施' },
      { name: '未成年人/监护人安排', terms: ['监护人', '父母', '监护人同意', '未成年人保护', '儿童隐私'], suggestion: '如涉及未成年人信息，补充监护人同意与专门保护安排' }
    ],
    ambiguityTerms: ['服务优化', '体验提升', '商业分析', '必要时', '相关功能', '等'],
    minorTerms: ['未成年人', '十四周岁', '14周岁', '儿童'],
    sensitiveTerms: ['生物识别', '指纹', '人脸', '面部识别', '医疗健康', '病历', '银行卡', '金融账户', '财产信息', '行踪轨迹', '精准定位', '通讯录'],
    broadPurposeTerms: ['服务优化', '体验提升', '商业分析', '营销推荐', '个性化推荐', '用户画像'],
    riskPoint: '敏感个人信息处理条件与保护安排可能不足',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '补充单独同意、处理必要性、严格保护措施；如涉及未成年人，再补充监护人同意与专门保护安排。'
  },
  consent_feature_coupling_check: {
    triggerTerms: ['单独同意', '同意', '授权', '开启定位', '开启相机', '开启麦克风', '开启通讯录', '个性化推荐', '营销推荐', '广告', '附近门店', '附近服务', '通讯录匹配', '刷脸登录'],
    requiredGroups: [
      { name: '独立同意机制', terms: ['单独同意', '明确同意', '自主选择', '单独授权'], suggestion: '对基于同意的可选功能明确设置独立同意或自主选择机制' },
      { name: '可选功能说明', terms: ['个性化推荐', '营销推荐', '广告', '附近门店', '附近服务', '刷脸登录', '通讯录匹配', '扩展功能', '可选功能'], suggestion: '说明该处理仅对应可选功能或增强功能，而不是泛化成全部主功能' },
      { name: '关闭或拒绝路径', terms: ['可关闭', '可拒绝', '可撤回', '随时关闭', '关闭方式', '拒绝后', '关闭后', '可不开启'], suggestion: '补充关闭、拒绝或撤回同意的路径说明' },
      { name: '不影响基础功能', terms: ['不影响基本功能', '不影响基础功能', '不影响核心功能', '仍可使用基础功能', '不影响基础浏览', '不影响下单功能', '不影响浏览和下单功能', '不影响基础浏览和下单功能'], suggestion: '明确拒绝或关闭该授权后，不影响产品/服务的基础功能' }
    ],
    ambiguityTerms: ['相关功能', '必要时', '经同意后', '授权后使用', '等'],
    optionalFeatureTerms: ['个性化推荐', '营销推荐', '广告', '附近门店', '附近服务', '刷脸登录', '通讯录匹配', '扩展功能', '增强服务'],
    permissionTerms: ['定位', '相机', '麦克风', '通讯录', '相册', '人脸'],
    bundlingTerms: ['不同意则无法使用', '拒绝后将无法使用', '不开启将无法使用', '未授权将无法使用', '否则无法使用', '否则无法继续使用', '否则将无法继续使用', '需授权后方可使用', '必须同意'],
    riskPoint: '基于同意的可选功能与基础功能绑定关系可能不清',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '把可选功能、同意机制、关闭路径与基础功能影响拆开说明，避免把非必要授权绑成主功能前提。'
  },
  field_purpose_legal_basis_check: {
    triggerTerms: ['手机号', '位置信息', '精准定位', '设备标识', '浏览记录', '通讯录', '人脸', '银行卡', '用于', '为实现', '个性化推荐', '营销推荐', '商业分析', '登录验证', '履行合同', '同意', '单独同意', '法定义务'],
    requiredGroups: [
      { name: '字段信息', terms: ['手机号', '位置信息', '精准定位', '设备标识', '浏览记录', '通讯录', '人脸', '银行卡', '个人信息类型', '字段'], suggestion: '明确具体处理的字段或信息类型，避免只写笼统的个人信息' },
      { name: '处理目的', terms: ['用于', '为了', '为实现', '登录验证', '个性化推荐', '营销推荐', '商业分析', '附近门店', '风控'], suggestion: '明确每类字段对应的处理目的或业务场景' },
      { name: '法律基础', terms: ['同意', '单独同意', '履行合同', '法定义务', '法定职责', '公共利益'], suggestion: '明确该处理活动对应的法律基础，不要只写目的不写依据' },
      { name: '字段-目的-依据对应关系', terms: ['分别用于', '分别基于', '基于上述同意', '上述处理基于', '对应关系'], suggestion: '把字段、目的和法律基础一一对应写清，不要混成一团' }
    ],
    ambiguityTerms: ['等信息', '相关信息', '服务优化', '必要时', '经授权后'],
    dataTerms: ['手机号', '位置信息', '精准定位', '设备标识', '浏览记录', '通讯录', '人脸', '银行卡'],
    purposeTerms: ['登录验证', '个性化推荐', '营销推荐', '商业分析', '附近门店', '风控'],
    basisTerms: ['同意', '单独同意', '履行合同', '法定义务', '法定职责', '公共利益'],
    highRiskPurposeTerms: ['营销推荐', '个性化推荐', '商业分析'],
    riskPoint: '字段、处理目的与法律基础之间的对应关系可能不足',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '把具体字段、处理目的、法律基础以及三者的对应关系拆开写清，避免出现“知道收了什么、也知道拿去干嘛，但不知道凭什么处理”的情况。'
  },
  contract_obligation_check: {
    triggerTerms: ['甲方', '乙方', '合同', '协议', '责任', '违约', '委托处理'],
    requiredGroups: [
      { name: '双方义务边界', terms: ['义务', '责任', '边界', '甲方', '乙方'], suggestion: '明确双方的数据处理义务、责任与边界' },
      { name: '保密与安全措施', terms: ['保密', '安全措施', '技术措施', '管理措施'], suggestion: '补充保密义务与安全措施要求' },
      { name: '终止后处理', terms: ['终止', '返还', '删除', '销毁', '到期'], suggestion: '说明合同终止、到期后的返还、删除或销毁安排' }
    ],
    ambiguityTerms: ['另行约定', '必要时', '合理', '适当'],
    riskPoint: '合同中的数据处理义务或责任边界可能不清',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '明确双方义务、责任边界、保密要求及终止后处理。'
  },
  retention_deletion_check: {
    triggerTerms: ['保存', '删除', '注销', '退出', '期限', '保留'],
    requiredGroups: [
      { name: '保存期限', terms: ['保存期限', '保留期限', '保存期间', '留存期限', '天', '日', '个月', '年'], suggestion: '写明保存期限或可识别的留存时长' },
      { name: '删除触发条件', terms: ['删除', '注销', '停止服务', '期限届满', '删除条件'], suggestion: '说明何时删除、注销后的删除条件或触发点' },
      { name: '删除方式', terms: ['匿名化', '去标识化', '删除方式', '销毁'], suggestion: '说明删除、匿名化或去标识化处理方式' }
    ],
    ambiguityTerms: ['长期', '永久', '视业务需要', '在必要期间', '适当期限'],
    riskPoint: '保存期限或删除机制表达可能不足',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '明确保存期限、删除条件与注销退出后的处理机制。'
  },
  consistency_check: {
    triggerTerms: ['共享', '第三方', '删除', '保存', '必要', '最小必要', '包括但不限于'],
    requiredGroups: [],
    ambiguityTerms: [],
    riskPoint: '文本前后关于数据处理边界的表述可能存在冲突',
    legalBasis: '待外部规范数据库补充具体依据',
    defaultSuggestion: '统一前后表述，避免在共享、保存期限、必要性范围等关键问题上出现互相冲突或边界不清。'
  }
};

const CONSISTENCY_PATTERNS = [
  {
    name: '共享口径冲突',
    leftTerms: ['不会共享', '不会向第三方共享', '不向第三方共享', '不向第三方提供', '不会向第三方提供', '未经同意不会共享'],
    rightTerms: ['共享', '第三方', '合作伙伴', '委托处理', 'SDK'],
    riskLevel: '高风险' as const,
    suggestion: '统一是否共享、向谁共享以及共享条件的表述，避免既写不共享又写合作伙伴共享。'
  },
  {
    name: '保存删除口径冲突',
    leftTerms: ['删除', '注销后删除', '期限届满后删除', '及时删除'],
    rightTerms: ['长期保存', '永久保存', '长期保留', '无限期保存'],
    riskLevel: '高风险' as const,
    suggestion: '统一保存期限与删除机制口径，明确何时删除、何时仅因法定义务继续保存。'
  },
  {
    name: '最小必要与范围口径冲突',
    leftTerms: ['最小必要', '仅限必要', '必要范围', '最少范围'],
    rightTerms: ['包括但不限于', '等信息', '其他信息', '相关信息'],
    riskLevel: '中风险' as const,
    suggestion: '把最小必要范围写具体，避免一边强调最小必要，一边又用“包括但不限于”等兜底表述放大范围。'
  }
];

function groupCoverage(
  text: string,
  groups: RuleSpec['requiredGroups']
): [Array<{ name: string; hits: string[]; suggestion: string }>, Array<{ name: string; hits: string[]; suggestion: string }>] {
  const present = [];
  const missing = [];
  for (const group of groups) {
    const hits = containsAny(text, group.terms);
    const payload = { name: group.name, hits, suggestion: group.suggestion };
    if (hits.length) present.push(payload);
    else missing.push(payload);
  }
  return [present, missing];
}

function buildSuggestion(
  spec: RuleSpec,
  missingGroups: Array<{ suggestion: string }>,
  extraNotes: string[] = []
): string {
  const suggestions = uniqueKeepOrder([
    ...missingGroups.slice(0, 4).map((item) => item.suggestion),
    ...extraNotes
  ]);
  if (!suggestions.length) return spec.defaultSuggestion;
  return `${suggestions.join('；')}。`;
}

function classifyRiskLevel(
  pathId: string,
  fullText: string,
  triggerHits: string[],
  missingGroups: Array<{ name: string }>,
  ambiguityHits: string[],
  adequacyRatio: number
): '高风险' | '中风险' | '建议优化' {
  const overreachHits = containsAny(fullText, RISK_RULES[pathId]?.overreachTerms ?? []);
  const consentHits = containsAny(fullText, ['同意', '单独同意', '明确同意', '授权']);

  if (pathId === 'lawful_basis_check' && overreachHits.length && !consentHits.length) {
    return '高风险';
  }
  if (pathId === 'retention_deletion_check') {
    const longKeep = containsAny(fullText, ['长期保存', '永久保存', '长期保留', '永久保留', '无限期保存']);
    const deletionHits = containsAny(fullText, ['删除', '注销', '匿名化', '去标识化', '销毁']);
    if (longKeep.length && !deletionHits.length) return '高风险';
  }
  if (pathId === 'outbound_transfer_check') {
    const crossBorderCore = containsAny(fullText, ['跨境', '出境', '境外接收方', '境外']);
    const safeguard = containsAny(fullText, ['标准合同', '安全评估', '认证', '保护措施']);
    if (crossBorderCore.length && missingGroups.length >= 3 && !safeguard.length) {
      return '高风险';
    }
  }

  let score = missingGroups.length + Math.min(2, ambiguityHits.length);
  if (adequacyRatio >= 0.75) score -= 2;
  else if (adequacyRatio >= 0.5) score -= 1;
  if (triggerHits.length >= 2) score += 1;

  if (score >= 4) return '中风险';
  return '建议优化';
}

function assessConsistency(text: string) {
  const spec = RISK_RULES.consistency_check;
  const items = CONSISTENCY_PATTERNS.flatMap((pattern) => {
    const leftHits = containsAny(text, pattern.leftTerms);
    const rightHits = containsAny(text, pattern.rightTerms);
    if (!leftHits.length || !rightHits.length) return [];
    const evidence = findRelevantSnippets(text, uniqueKeepOrder([...leftHits, ...rightHits]));
    return [
      {
        risk_point: spec.riskPoint,
        risk_level: pattern.riskLevel,
        legal_basis: spec.legalBasis,
        reason: `发现“${pattern.name}”：前文命中 ${leftHits.slice(0, 3).join('、')}，同时又出现 ${rightHits.slice(0, 3).join('、')}；证据片段：${evidence.join(' / ') || '见原文'}。`,
        suggestion: pattern.suggestion,
        auto_recheck: true,
        evidence,
        trigger_hits: uniqueKeepOrder([...leftHits, ...rightHits]),
        missing_groups: [],
        ambiguity_hits: []
      }
    ];
  });
  return {
    path_id: 'consistency_check',
    summary: items.length ? `发现 ${items.length} 处一致性风险。` : '未发现明显的前后表述冲突。',
    items
  };
}

function assessPurposeScope(text: string, segments: string[]) {
  const spec = RISK_RULES.purpose_scope_check;
  const dataHits = containsAny(text, spec.dataTerms ?? []);
  const purposeHits = containsAny(text, [...(spec.broadPurposeTerms ?? []), '用于', '为了', '为实现']);
  if (!dataHits.length || !purposeHits.length) {
    return { path_id: 'purpose_scope_check', summary: '未发现明显的“信息范围—处理目的”匹配性风险信号。', items: [] };
  }

  const relevantTerms = uniqueKeepOrder([...dataHits, ...purposeHits]);
  const relevantText = segments.filter((segment) => containsAny(segment, relevantTerms).length).join('\n') || text;
  const [presentGroups, missingGroups] = groupCoverage(text, spec.requiredGroups);
  const ambiguityHits = containsAny(relevantText, spec.ambiguityTerms);
  const broadPurposeHits = containsAny(relevantText, spec.broadPurposeTerms ?? []);
  const sensitiveHits = containsAny(relevantText, spec.sensitiveDataTerms ?? []);
  const adequacyRatio = spec.requiredGroups.length ? presentGroups.length / spec.requiredGroups.length : 1;
  const evidence = findRelevantSnippets(relevantText, relevantTerms, [...broadPurposeHits, ...sensitiveHits]);

  if (adequacyRatio >= 0.85 && !ambiguityHits.length && !broadPurposeHits.length) {
    return { path_id: 'purpose_scope_check', summary: `命中主题：${relevantTerms.slice(0, 4).join('、')}；目的与信息范围对应关系较清晰，暂未形成明确风险。`, items: [] };
  }

  let riskLevel: '高风险' | '中风险' | '建议优化' = '建议优化';
  if (broadPurposeHits.length && missingGroups.length >= 2) riskLevel = '中风险';
  if (sensitiveHits.length && broadPurposeHits.length && missingGroups.length >= 2) riskLevel = '高风险';

  const extraNotes = [];
  if (sensitiveHits.length && broadPurposeHits.length) {
    extraNotes.push('对高敏感或高侵入性信息，进一步论证与目的的对应关系，并压缩到最小必要范围');
  }

  return {
    path_id: 'purpose_scope_check',
    summary: `命中 ${relevantTerms.length} 个相关信号；关键要素覆盖 ${presentGroups.length}/${spec.requiredGroups.length}；宽泛表述 ${ambiguityHits.length} 处。`,
    items: [
      {
        risk_point: spec.riskPoint,
        risk_level: riskLevel,
        legal_basis: spec.legalBasis,
        reason: `涉及信息：${dataHits.slice(0, 5).join('、')}；涉及目的：${purposeHits.slice(0, 4).join('、')}；已识别要素：${presentGroups.map((item) => item.name).slice(0, 4).join('、') || '无明显充分说明'}；待补要素：${missingGroups.map((item) => item.name).slice(0, 4).join('、') || '无'}；证据片段：${evidence.join(' / ') || '见原文'}。`,
        suggestion: buildSuggestion(spec, missingGroups, extraNotes),
        auto_recheck: riskLevel !== '建议优化',
        evidence,
        coverage_ratio: Number(adequacyRatio.toFixed(2)),
        trigger_hits: relevantTerms,
        missing_groups: missingGroups.map((item) => item.name),
        ambiguity_hits: ambiguityHits
      }
    ]
  };
}

function assessSensitivePersonalInfo(text: string, segments: string[]) {
  const spec = RISK_RULES.sensitive_personal_info_check;
  const sensitiveHits = containsAny(text, spec.sensitiveTerms ?? []);
  const minorHits = containsAny(text, spec.minorTerms ?? []);
  const triggerHits = uniqueKeepOrder([...sensitiveHits, ...minorHits]);
  if (!triggerHits.length) {
    return { path_id: 'sensitive_personal_info_check', summary: '未发现明显的敏感个人信息处理信号。', items: [] };
  }

  const relevantTerms = uniqueKeepOrder([...triggerHits, ...(spec.broadPurposeTerms ?? [])]);
  const relevantText = segments.filter((segment) => containsAny(segment, relevantTerms).length).join('\n') || text;
  let [presentGroups, missingGroups] = groupCoverage(text, spec.requiredGroups);
  if (!minorHits.length) {
    presentGroups = presentGroups.filter((item) => item.name !== '未成年人/监护人安排');
    missingGroups = missingGroups.filter((item) => item.name !== '未成年人/监护人安排');
  }
  const ambiguityHits = containsAny(relevantText, spec.ambiguityTerms);
  const groupCount = minorHits.length ? spec.requiredGroups.length : spec.requiredGroups.length - 1;
  const adequacyRatio = groupCount > 0 ? presentGroups.length / groupCount : 1;
  const broadPurposeHits = containsAny(relevantText, spec.broadPurposeTerms ?? []);
  const consentHits = containsAny(text, ['单独同意', '明示同意', '单独授权', '明确同意']);
  const guardianHits = containsAny(text, ['监护人', '监护人同意', '父母']);
  const evidence = findRelevantSnippets(relevantText, relevantTerms, broadPurposeHits);

  if (adequacyRatio >= 0.85 && !ambiguityHits.length && (!minorHits.length || guardianHits.length)) {
    return { path_id: 'sensitive_personal_info_check', summary: `命中主题：${triggerHits.slice(0, 4).join('、')}；敏感信息处理条件说明较完整，暂未形成明确风险。`, items: [] };
  }

  let riskLevel: '高风险' | '中风险' | '建议优化' = '建议优化';
  if (minorHits.length && !guardianHits.length) riskLevel = '高风险';
  else if (sensitiveHits.length && !consentHits.length && broadPurposeHits.length) riskLevel = '高风险';
  else if (sensitiveHits.length && missingGroups.length >= 2) riskLevel = '中风险';

  const extraNotes = [];
  if (sensitiveHits.length && !consentHits.length) extraNotes.push('补充针对敏感个人信息处理的单独同意或其他明确授权机制');
  if (minorHits.length && !guardianHits.length) extraNotes.push('如涉及未成年人信息，补充监护人同意与专门规则');

  return {
    path_id: 'sensitive_personal_info_check',
    summary: `命中 ${triggerHits.length} 个敏感信息相关信号；关键要素覆盖 ${presentGroups.length}/${spec.requiredGroups.length}；模糊表述 ${ambiguityHits.length} 处。`,
    items: [
      {
        risk_point: spec.riskPoint,
        risk_level: riskLevel,
        legal_basis: spec.legalBasis,
        reason: `涉及敏感主题：${triggerHits.slice(0, 5).join('、')}；已识别要素：${presentGroups.map((item) => item.name).slice(0, 4).join('、') || '无明显充分说明'}；待补要素：${missingGroups.map((item) => item.name).slice(0, 4).join('、') || '无'}；证据片段：${evidence.join(' / ') || '见原文'}。`,
        suggestion: buildSuggestion(spec, missingGroups, extraNotes),
        auto_recheck: riskLevel !== '建议优化',
        evidence,
        coverage_ratio: Number(adequacyRatio.toFixed(2)),
        trigger_hits: triggerHits,
        missing_groups: missingGroups.map((item) => item.name),
        ambiguity_hits: ambiguityHits
      }
    ]
  };
}

function assessFieldPurposeLegalBasis(text: string, segments: string[]) {
  const spec = RISK_RULES.field_purpose_legal_basis_check;
  const dataHits = containsAny(text, spec.dataTerms ?? []);
  const purposeHits = containsAny(text, spec.purposeTerms ?? []);
  const basisHits = containsAny(text, spec.basisTerms ?? []);
  const triggerHits = uniqueKeepOrder([...dataHits, ...purposeHits, ...basisHits]);
  if (!dataHits.length || !purposeHits.length) {
    return { path_id: 'field_purpose_legal_basis_check', summary: '未发现明显的“字段—目的—法律基础”联动信号。', items: [] };
  }

  const relevantText = segments.filter((segment) => containsAny(segment, triggerHits).length).join('\n') || text;
  const [presentGroups, missingGroups] = groupCoverage(text, spec.requiredGroups);
  const ambiguityHits = containsAny(relevantText, spec.ambiguityTerms);
  const adequacyRatio = spec.requiredGroups.length ? presentGroups.length / spec.requiredGroups.length : 1;
  const highRiskPurposeHits = containsAny(relevantText, spec.highRiskPurposeTerms ?? []);
  const relationHits = containsAny(text, ['分别用于', '分别基于', '基于上述同意', '上述处理基于', '对应关系']);
  const evidence = findRelevantSnippets(relevantText, triggerHits, highRiskPurposeHits);

  if (adequacyRatio >= 0.85 && relationHits.length && basisHits.length) {
    return { path_id: 'field_purpose_legal_basis_check', summary: `命中主题：${triggerHits.slice(0, 5).join('、')}；字段、目的与法律基础对应关系较完整，暂未形成明确风险。`, items: [] };
  }

  let riskLevel: '高风险' | '中风险' | '建议优化' = '建议优化';
  if (highRiskPurposeHits.length && !basisHits.length) riskLevel = '高风险';
  else if (missingGroups.length >= 2 || (dataHits.length && purposeHits.length && !basisHits.length)) riskLevel = '中风险';

  const extraNotes = [];
  if (!basisHits.length) extraNotes.push('补充该处理活动的法律基础，不要只写字段和目的');
  if (!relationHits.length) extraNotes.push('把字段、目的、法律基础做一一对应说明，避免混合表述');

  return {
    path_id: 'field_purpose_legal_basis_check',
    summary: `命中 ${triggerHits.length} 个联动信号；关键要素覆盖 ${presentGroups.length}/${spec.requiredGroups.length}；模糊表述 ${ambiguityHits.length} 处。`,
    items: [
      {
        risk_point: spec.riskPoint,
        risk_level: riskLevel,
        legal_basis: spec.legalBasis,
        reason: `涉及字段：${dataHits.slice(0, 5).join('、')}；涉及目的：${purposeHits.slice(0, 4).join('、')}；已识别法律基础：${basisHits.slice(0, 4).join('、') || '未明确写出'}；证据片段：${evidence.join(' / ') || '见原文'}。`,
        suggestion: buildSuggestion(spec, missingGroups, extraNotes),
        auto_recheck: riskLevel !== '建议优化',
        evidence,
        coverage_ratio: Number(adequacyRatio.toFixed(2)),
        trigger_hits: triggerHits,
        missing_groups: missingGroups.map((item) => item.name),
        ambiguity_hits: ambiguityHits
      }
    ]
  };
}

function assessConsentFeatureCoupling(text: string, segments: string[]) {
  const spec = RISK_RULES.consent_feature_coupling_check;
  const optionalHits = containsAny(text, spec.optionalFeatureTerms ?? []);
  const permissionHits = containsAny(text, spec.permissionTerms ?? []);
  const bundlingHits = containsAny(text, spec.bundlingTerms ?? []);
  const consentHits = containsAny(text, ['单独同意', '明确同意', '同意', '授权']);
  const triggerHits = uniqueKeepOrder([...optionalHits, ...permissionHits, ...bundlingHits, ...consentHits]);
  if (!triggerHits.length || !(optionalHits.length || permissionHits.length)) {
    return { path_id: 'consent_feature_coupling_check', summary: '未发现明显的“同意—可选功能—基础功能影响”风险信号。', items: [] };
  }

  const relevantText = segments.filter((segment) => containsAny(segment, triggerHits).length).join('\n') || text;
  const [presentGroups, missingGroups] = groupCoverage(text, spec.requiredGroups);
  const ambiguityHits = containsAny(relevantText, spec.ambiguityTerms);
  const adequacyRatio = spec.requiredGroups.length ? presentGroups.length / spec.requiredGroups.length : 1;
  const baseUnaffectedHits = containsAny(text, ['不影响基本功能', '不影响基础功能', '不影响核心功能', '仍可使用基础功能', '不影响基础浏览', '不影响下单功能', '不影响浏览和下单功能', '不影响基础浏览和下单功能']);
  const evidence = findRelevantSnippets(relevantText, triggerHits, bundlingHits);

  if (adequacyRatio >= 0.75 && !bundlingHits.length && baseUnaffectedHits.length) {
    return { path_id: 'consent_feature_coupling_check', summary: `命中主题：${triggerHits.slice(0, 4).join('、')}；可选功能与同意关系说明较完整，暂未形成明确风险。`, items: [] };
  }

  let riskLevel: '高风险' | '中风险' | '建议优化' = '建议优化';
  if (bundlingHits.length && !baseUnaffectedHits.length) riskLevel = '高风险';
  else if (missingGroups.length >= 2 || (consentHits.length && (!containsAny(text, ['可关闭', '可拒绝', '可撤回', '随时关闭', '关闭后', '可不开启']).length || !baseUnaffectedHits.length))) {
    riskLevel = '中风险';
  }

  const extraNotes = [];
  if (bundlingHits.length && !baseUnaffectedHits.length) extraNotes.push('避免把基于同意的非必要授权绑定为主功能使用前提');
  if (!containsAny(text, ['可关闭', '可拒绝', '可撤回', '随时关闭', '关闭后', '可不开启']).length) extraNotes.push('补充关闭、拒绝或撤回同意的操作路径');

  return {
    path_id: 'consent_feature_coupling_check',
    summary: `命中 ${triggerHits.length} 个相关信号；关键要素覆盖 ${presentGroups.length}/${spec.requiredGroups.length}；模糊表述 ${ambiguityHits.length} 处。`,
    items: [
      {
        risk_point: spec.riskPoint,
        risk_level: riskLevel,
        legal_basis: spec.legalBasis,
        reason: `涉及功能/权限：${uniqueKeepOrder([...optionalHits, ...permissionHits]).slice(0, 5).join('、')}；已识别要素：${presentGroups.map((item) => item.name).slice(0, 4).join('、') || '无明显充分说明'}；证据片段：${evidence.join(' / ') || '见原文'}。`,
        suggestion: buildSuggestion(spec, missingGroups, extraNotes),
        auto_recheck: riskLevel !== '建议优化',
        evidence,
        coverage_ratio: Number(adequacyRatio.toFixed(2)),
        trigger_hits: triggerHits,
        missing_groups: missingGroups.map((item) => item.name),
        ambiguity_hits: ambiguityHits
      }
    ]
  };
}

export function assessOne(pathId: string, text: string, segments: string[] = [text]) {
  const spec = RISK_RULES[pathId];
  if (!spec) return { path_id: pathId, summary: '当前无内置规则。', items: [] };
  if (pathId === 'purpose_scope_check') return assessPurposeScope(text, segments);
  if (pathId === 'sensitive_personal_info_check') return assessSensitivePersonalInfo(text, segments);
  if (pathId === 'field_purpose_legal_basis_check') return assessFieldPurposeLegalBasis(text, segments);
  if (pathId === 'consent_feature_coupling_check') return assessConsentFeatureCoupling(text, segments);
  if (pathId === 'consistency_check') return assessConsistency(text);

  const triggerHits = containsAny(text, spec.triggerTerms);
  if (!triggerHits.length) {
    return { path_id: pathId, summary: '未发现明显触发信号。', items: [] };
  }

  const relevantText = segments.filter((segment) => containsAny(segment, spec.triggerTerms).length).join('\n') || text;
  const [presentGroups, missingGroups] = groupCoverage(text, spec.requiredGroups);
  const ambiguityHits = containsAny(relevantText, spec.ambiguityTerms);
  const adequacyRatio = spec.requiredGroups.length ? presentGroups.length / spec.requiredGroups.length : 1;
  const overreachHits = containsAny(relevantText, spec.overreachTerms ?? []);
  const evidence = findRelevantSnippets(relevantText, spec.triggerTerms, overreachHits);

  if (
    adequacyRatio >= 0.85 &&
    !ambiguityHits.length &&
    !(pathId === 'lawful_basis_check' && overreachHits.length && !containsAny(text, ['同意', '单独同意', '明确同意', '授权']).length)
  ) {
    return {
      path_id: pathId,
      summary: `命中主题：${triggerHits.slice(0, 4).join('、')}；关键披露要素较完整，暂未形成明确风险。`,
      items: []
    };
  }

  const riskLevel = classifyRiskLevel(pathId, text, triggerHits, missingGroups, ambiguityHits, adequacyRatio);
  const extraNotes = [];
  if (pathId === 'lawful_basis_check' && overreachHits.length && !containsAny(text, ['同意', '单独同意', '明确同意', '授权']).length) {
    extraNotes.push('对营销、推荐、画像等处理活动补充单独同意或其他可支撑的合法性基础');
  }

  return {
    path_id: pathId,
    summary: `命中 ${triggerHits.length} 个触发点；关键要素覆盖 ${presentGroups.length}/${spec.requiredGroups.length}；模糊表述 ${ambiguityHits.length} 处。`,
    items: [
      {
        risk_point: spec.riskPoint,
        risk_level: riskLevel,
        legal_basis: spec.legalBasis,
        reason: `触发主题：${triggerHits.slice(0, 4).join('、')}；已识别要素：${presentGroups.map((item) => item.name).slice(0, 4).join('、') || '无明显充分披露'}；待补要素：${missingGroups.map((item) => item.name).slice(0, 4).join('、') || '无'}；证据片段：${evidence.join(' / ') || '见原文'}。`,
        suggestion: buildSuggestion(spec, missingGroups, extraNotes),
        auto_recheck: riskLevel !== '建议优化',
        evidence,
        coverage_ratio: Number(adequacyRatio.toFixed(2)),
        trigger_hits: triggerHits,
        missing_groups: missingGroups.map((item) => item.name),
        ambiguity_hits: ambiguityHits
      }
    ]
  };
}

export { RISK_LEVEL_ORDER };
