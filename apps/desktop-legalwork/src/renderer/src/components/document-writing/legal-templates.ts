/**
 * 内置法律文书模板数据
 *
 * 分类：
 * - litigation: 诉讼文书（20个）
 * - non-litigation: 非诉文书（20个）
 *
 * 每个模板包含：id、名称(name)、分类(category)、简要描述(description)、
 * 模板字段结构(fields，用于AI辅助填写)
 */

export type TemplateCategory = 'litigation' | 'non-litigation' | 'custom'

export interface LegalTemplateField {
  /** 字段标识符 */
  id: string
  /** 字段名称（如"原告姓名"） */
  label: string
  /** 字段类型 */
  type: 'text' | 'textarea' | 'date' | 'select' | 'array'
  /** 提示文本 */
  placeholder?: string
  /** 选项（type=select时） */
  options?: string[]
  /** 是否必填 */
  required?: boolean
}

export interface LegalTemplate {
  /** 唯一标识 */
  id: string
  /** 模板名称 */
  name: string
  /** 分类 */
  category: TemplateCategory
  /** 简短描述 */
  description: string
  /** 模板内容（Markdown格式，包含 {{字段名}} 占位符） */
  content: string
  /** 需要填写的字段 */
  fields: LegalTemplateField[]
  /** 适用的法律依据 */
  legalBasis?: string[]
  /** 图标emoji */
  icon: string
}

/** 诉讼文书模板 */
const litigationTemplates: LegalTemplate[] = [
  {
    id: 'civil-complaint',
    name: '民事起诉状',
    category: 'litigation',
    description: '公民、法人或其他组织向人民法院提起民事诉讼时使用的法律文书',
    icon: '⚖️',
    legalBasis: ['《中华人民共和国民事诉讼法》第一百二十二条', '《中华人民共和国民法典》'],
    fields: [
      { id: 'plaintiff', label: '原告信息', type: 'textarea', placeholder: '姓名/名称、性别、出生年月、民族、住址、联系方式等', required: true },
      { id: 'defendant', label: '被告信息', type: 'textarea', placeholder: '姓名/名称、性别、出生年月、住址、联系方式等', required: true },
      { id: 'legalRepresentative', label: '法定代表人（如有）', type: 'text', placeholder: '姓名、职务' },
      { id: 'claims', label: '诉讼请求', type: 'textarea', placeholder: '请逐项列明诉讼请求', required: true },
      { id: 'facts', label: '事实与理由', type: 'textarea', placeholder: '详细描述案件事实和法律依据', required: true },
      { id: 'evidence', label: '证据清单', type: 'textarea', placeholder: '列出证据名称、来源及证明目的' },
      { id: 'court', label: '管辖法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '起诉日期', type: 'date', required: true },
    ],
    content: `# 民事起诉状

**原告：** {{plaintiff}}

**被告：** {{defendant}}

{{legalRepresentative}}

## 诉讼请求

{{claims}}

## 事实与理由

{{facts}}

## 证据清单

{{evidence}}

此致

{{court}}

**具状人：** {{plaintiff}}
**日期：** {{date}}

---
> 附：本起诉状副本__份
> 证据材料__份
`,
  },
  {
    id: 'civil-defense',
    name: '民事答辩状',
    category: 'litigation',
    description: '被告针对原告的起诉状进行答辩的法律文书',
    icon: '📝',
    legalBasis: ['《中华人民共和国民事诉讼法》第一百二十八条'],
    fields: [
      { id: 'respondent', label: '答辩人信息', type: 'textarea', placeholder: '姓名/名称、住址、联系方式等', required: true },
      { id: 'plaintiffInfo', label: '被答辩人（原告）', type: 'text', placeholder: '姓名/名称', required: true },
      { id: 'caseCause', label: '案由', type: 'text', placeholder: '如：买卖合同纠纷', required: true },
      { id: 'defenseOpinion', label: '答辩意见', type: 'textarea', placeholder: '针对原告起诉状的事实和理由逐项答辩', required: true },
      { id: 'evidence', label: '证据材料', type: 'textarea', placeholder: '支持答辩意见的证据' },
      { id: 'court', label: '审理法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 民事答辩状

**答辩人（被告）：** {{respondent}}

**被答辩人（原告）：** {{plaintiffInfo}}

**案由：** {{caseCause}}

## 答辩意见

{{defenseOpinion}}

## 证据材料

{{evidence}}

此致

{{court}}

**答辩人：** {{respondent}}
**日期：** {{date}}
`,
  },
  {
    id: 'civil-appeal',
    name: '民事上诉状',
    category: 'litigation',
    description: '当事人不服一审判决，向上一级人民法院提起上诉的法律文书',
    icon: '⬆️',
    legalBasis: ['《中华人民共和国民事诉讼法》第一百七十一条、第一百七十二条'],
    fields: [
      { id: 'appellant', label: '上诉人信息', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'appellee', label: '被上诉人信息', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'originalCase', label: '原审案件', type: 'textarea', placeholder: '原审法院、案号、案由', required: true },
      { id: 'appealRequest', label: '上诉请求', type: 'textarea', placeholder: '明确上诉请求', required: true },
      { id: 'appealReason', label: '上诉理由', type: 'textarea', placeholder: '针对一审判决认定事实、适用法律等方面的问题', required: true },
      { id: 'appealCourt', label: '上诉法院', type: 'text', placeholder: 'XX市中级人民法院', required: true },
      { id: 'date', label: '上诉日期', type: 'date', required: true },
    ],
    content: `# 民事上诉状

**上诉人（原审{{originalRole}}）：** {{appellant}}

**被上诉人（原审{{originalRole2}}）：** {{appellee}}

**上诉因不服{{originalCourt}}（{{originalCaseNumber}}）号民事判决，现提出上诉。**

## 上诉请求

{{appealRequest}}

## 上诉理由

{{appealReason}}

此致

{{appealCourt}}

**上诉人：** {{appellant}}
**日期：** {{date}}

---
> 附：本上诉状副本__份
`,
  },
  {
    id: 'civil-counterclaim',
    name: '民事反诉状',
    category: 'litigation',
    description: '被告在诉讼过程中针对原告提出相反诉讼请求的法律文书',
    icon: '🔄',
    legalBasis: ['《中华人民共和国民事诉讼法》第五十一条、第一百四十三条'],
    fields: [
      { id: 'counterclaimant', label: '反诉人（本诉被告）', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'counterclaimed', label: '被反诉人（本诉原告）', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'originalCase', label: '本诉案由及案号', type: 'text', placeholder: '本诉案由及案号', required: true },
      { id: 'counterclaimRequest', label: '反诉请求', type: 'textarea', placeholder: '反诉的具体请求事项', required: true },
      { id: 'counterclaimFacts', label: '反诉事实与理由', type: 'textarea', placeholder: '支持反诉请求的事实和法律依据', required: true },
      { id: 'court', label: '受理法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 民事反诉状

**反诉人（本诉被告）：** {{counterclaimant}}

**被反诉人（本诉原告）：** {{counterclaimed}}

**本诉案由：** {{originalCase}}

## 反诉请求

{{counterclaimRequest}}

## 反诉事实与理由

{{counterclaimFacts}}

此致

{{court}}

**反诉人：** {{counterclaimant}}
**日期：** {{date}}
`,
  },
  {
    id: 'civil-retrial',
    name: '民事再审申请书',
    category: 'litigation',
    description: '当事人对已生效判决、裁定不服，申请再审的法律文书',
    icon: '🔍',
    legalBasis: ['《中华人民共和国民事诉讼法》第二百一十条、第二百一十一条'],
    fields: [
      { id: 'applicant', label: '申请人信息', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'opponent', label: '被申请人信息', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'judgmentDetails', label: '原审判决情况', type: 'textarea', placeholder: '原审法院、案号、判决时间、判决结果', required: true },
      { id: 'retrialGrounds', label: '法定再审事由', type: 'textarea', placeholder: '符合民事诉讼法第二百一十一条规定的具体情形', required: true },
      { id: 'retrialRequest', label: '再审请求', type: 'textarea', placeholder: '具体的再审请求', required: true },
      { id: 'factsReasons', label: '事实与理由', type: 'textarea', placeholder: '详细阐述再审事由', required: true },
      { id: 'court', label: '受理法院', type: 'text', placeholder: 'XX高级人民法院/最高人民法院', required: true },
      { id: 'date', label: '申请日期', type: 'date', required: true },
    ],
    content: `# 民事再审申请书

**申请再审人（原审{{originalRole}}）：** {{applicant}}

**被申请人（原审{{originalRole2}}）：** {{opponent}}

**申请再审人因与被申请人{{caseName}}纠纷一案，不服{{court}}{{caseNumber}}号民事{{judgmentType}}，现提出再审申请。**

## 再审请求

{{retrialRequest}}

## 法定再审事由

{{retrialGrounds}}

## 事实与理由

{{factsReasons}}

此致

{{court}}

**申请人：** {{applicant}}
**日期：** {{date}}
`,
  },
  {
    id: 'civil-enforcement',
    name: '民事强制执行申请书',
    category: 'litigation',
    description: '胜诉当事人申请法院强制执行已生效法律文书的法律文书',
    icon: '💪',
    legalBasis: ['《中华人民共和国民事诉讼法》第二百四十六条', '《中华人民共和国民事诉讼法》第二百四十七条'],
    fields: [
      { id: 'applicant', label: '申请执行人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'enforcementDefendant', label: '被执行人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'enforcementBasis', label: '执行依据', type: 'textarea', placeholder: '生效法律文书名称、案号、作出法院', required: true },
      { id: 'enforcementItems', label: '执行事项', type: 'textarea', placeholder: '具体的执行内容', required: true },
      { id: 'propertyInfo', label: '被执行人财产线索', type: 'textarea', placeholder: '已知的财产信息' },
      { id: 'court', label: '管辖法院', type: 'text', placeholder: '第一审人民法院或同级的被执行财产所在地法院', required: true },
      { id: 'date', label: '申请日期', type: 'date', required: true },
    ],
    content: `# 强制执行申请书

**申请执行人：** {{applicant}}

**被执行人：** {{enforcementDefendant}}

**执行依据：** {{enforcementBasis}}

## 执行请求

{{enforcementItems}}

## 被执行人财产线索

{{propertyInfo}}

此致

{{court}}

**申请执行人：** {{applicant}}
**日期：** {{date}}
`,
  },
  {
    id: 'property-preservation',
    name: '财产保全申请书',
    category: 'litigation',
    description: '当事人向法院申请采取财产保全措施的法律文书',
    icon: '🔒',
    legalBasis: ['《中华人民共和国民事诉讼法》第一百零三条、第一百零四条'],
    fields: [
      { id: 'applicant', label: '申请人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'respondent', label: '被申请人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'preservationRequest', label: '保全请求', type: 'textarea', placeholder: '请求保全的财产范围、金额', required: true },
      { id: 'preservationReason', label: '保全理由', type: 'textarea', placeholder: '说明不保全可能造成的损害', required: true },
      { id: 'propertyDetails', label: '财产线索', type: 'textarea', placeholder: '被保全财产的具体信息', required: true },
      { id: 'security', label: '担保信息', type: 'textarea', placeholder: '提供的担保方式及金额', required: true },
      { id: 'court', label: '受理法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '申请日期', type: 'date', required: true },
    ],
    content: `# 财产保全申请书

**申请人：** {{applicant}}

**被申请人：** {{respondent}}

## 保全请求

{{preservationRequest}}

## 保全理由

{{preservationReason}}

## 财产线索

{{propertyDetails}}

## 担保

{{security}}

此致

{{court}}

**申请人：** {{applicant}}
**日期：** {{date}}
`,
  },
  {
    id: 'evidence-preservation',
    name: '证据保全申请书',
    category: 'litigation',
    description: '当事人在诉讼前或诉讼中申请法院保全证据的法律文书',
    icon: '📋',
    legalBasis: ['《中华人民共和国民事诉讼法》第八十四条'],
    fields: [
      { id: 'applicant', label: '申请人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'opponent', label: '对方当事人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'evidenceDetails', label: '申请保全的证据', type: 'textarea', placeholder: '证据名称、种类、数量、存放地点', required: true },
      { id: 'preservationPurpose', label: '保全目的', type: 'textarea', placeholder: '保全证据所要证明的事实', required: true },
      { id: 'urgencyReason', label: '紧急原因', type: 'textarea', placeholder: '证据可能灭失或以后难以取得的原因', required: true },
      { id: 'court', label: '受理法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '申请日期', type: 'date', required: true },
    ],
    content: `# 证据保全申请书

**申请人：** {{applicant}}

**对方当事人：** {{opponent}}

## 申请保全的证据

{{evidenceDetails}}

## 保全目的

{{preservationPurpose}}

## 紧急原因

{{urgencyReason}}

此致

{{court}}

**申请人：** {{applicant}}
**日期：** {{date}}
`,
  },
  {
    id: 'preliminary-execution',
    name: '先予执行申请书',
    category: 'litigation',
    description: '当事人在判决前申请法院责令对方先行给付的法律文书',
    icon: '⏩',
    legalBasis: ['《中华人民共和国民事诉讼法》第一百零九条、第一百一十条'],
    fields: [
      { id: 'applicant', label: '申请人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'respondent', label: '被申请人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'applicationScope', label: '申请先予执行的范围', type: 'textarea', placeholder: '具体请求先予执行的金额或物品', required: true },
      { id: 'applicationReason', label: '事实与理由', type: 'textarea', placeholder: '说明符合先予执行的条件', required: true },
      { id: 'court', label: '受理法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '申请日期', type: 'date', required: true },
    ],
    content: `# 先予执行申请书

**申请人：** {{applicant}}

**被申请人：** {{respondent}}

## 申请先予执行的事项

{{applicationScope}}

## 事实与理由

{{applicationReason}}

此致

{{court}}

**申请人：** {{applicant}}
**日期：** {{date}}
`,
  },
  {
    id: 'jurisdiction-objection',
    name: '管辖权异议申请书',
    category: 'litigation',
    description: '当事人认为受理法院无管辖权时提出的异议申请',
    icon: '📍',
    legalBasis: ['《中华人民共和国民事诉讼法》第一百三十条'],
    fields: [
      { id: 'objector', label: '异议人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'caseInfo', label: '案号及案由', type: 'text', placeholder: '案号、案由', required: true },
      { id: 'objectionReason', label: '管辖权异议理由', type: 'textarea', placeholder: '说明本院无管辖权的法律依据', required: true },
      { id: 'proposedCourt', label: '建议移送法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 管辖权异议申请书

**异议人（{{litigationRole}}）：** {{objector}}

**案号：** {{caseInfo}}

## 管辖权异议

{{objectionReason}}

综上，异议人认为{{originalCourt}}对本案不具有管辖权，请求依法将本案移送至{{proposedCourt}}审理。

此致

{{originalCourt}}

**异议人：** {{objector}}
**日期：** {{date}}
`,
  },
  {
    id: 'criminal-private-prosecution',
    name: '刑事自诉状',
    category: 'litigation',
    description: '被害人或其法定代理人直接向法院提起刑事自诉的法律文书',
    icon: '🔨',
    legalBasis: ['《中华人民共和国刑事诉讼法》第二百一十条', '《中华人民共和国刑法》'],
    fields: [
      { id: 'privateProsecutor', label: '自诉人信息', type: 'textarea', placeholder: '姓名、性别、出生年月、民族、住址、联系方式', required: true },
      { id: 'criminalDefendant', label: '被告人信息', type: 'textarea', placeholder: '姓名、性别、出生年月、住址、联系方式', required: true },
      { id: 'criminalCharge', label: '案由（指控罪名）', type: 'text', placeholder: '如：故意伤害罪、侮辱罪等', required: true },
      { id: 'criminalRequest', label: '诉讼请求', type: 'textarea', placeholder: '依法追究被告人刑事责任的请求', required: true },
      { id: 'criminalFacts', label: '犯罪事实', type: 'textarea', placeholder: '详细描述犯罪时间、地点、手段、情节、后果', required: true },
      { id: 'criminalEvidence', label: '证据清单', type: 'textarea', placeholder: '列出证据名称、来源、证明内容', required: true },
      { id: 'criminalCourt', label: '管辖法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 刑事自诉状

**自诉人：** {{privateProsecutor}}

**被告人：** {{criminalDefendant}}

**案由：** {{criminalCharge}}

## 诉讼请求

{{criminalRequest}}

## 事实与理由

{{criminalFacts}}

## 证据清单

{{criminalEvidence}}

此致

{{criminalCourt}}

**自诉人：** {{privateProsecutor}}
**日期：** {{date}}
`,
  },
  {
    id: 'criminal-incidental-civil',
    name: '刑事附带民事起诉状',
    category: 'litigation',
    description: '刑事案件的被害人因被告人的犯罪行为遭受物质损失而提起附带民事诉讼的法律文书',
    icon: '💰',
    legalBasis: ['《中华人民共和国刑事诉讼法》第一百零一条'],
    fields: [
      { id: 'civilPlaintiff', label: '附带民事诉讼原告人', type: 'textarea', placeholder: '姓名、性别、出生年月、住址、联系方式', required: true },
      { id: 'civilDefendant', label: '附带民事诉讼被告人', type: 'textarea', placeholder: '姓名、住址、联系方式', required: true },
      { id: 'criminalCase', label: '刑事案件情况', type: 'text', placeholder: '案号、涉嫌罪名', required: true },
      { id: 'civilClaims', label: '民事赔偿请求', type: 'textarea', placeholder: '具体的赔偿项目和金额', required: true },
      { id: 'civilFacts', label: '事实与理由', type: 'textarea', placeholder: '被告人的犯罪行为与损失之间的因果关系', required: true },
      { id: 'lossEvidence', label: '损失证据', type: 'textarea', placeholder: '医疗费、误工费等损失证明', required: true },
      { id: 'court', label: '受理法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 刑事附带民事起诉状

**附带民事诉讼原告人：** {{civilPlaintiff}}

**附带民事诉讼被告人：** {{civilDefendant}}

**刑事案件：** {{criminalCase}}

## 诉讼请求

{{civilClaims}}

## 事实与理由

{{civilFacts}}

## 证据清单

{{lossEvidence}}

此致

{{court}}

**附带民事诉讼原告人：** {{civilPlaintiff}}
**日期：** {{date}}
`,
  },
  {
    id: 'criminal-appeal',
    name: '刑事上诉状',
    category: 'litigation',
    description: '刑事被告人不服一审判决，向上一级法院提起上诉的法律文书',
    icon: '⬆️',
    legalBasis: ['《中华人民共和国刑事诉讼法》第二百二十七条、第二百三十条'],
    fields: [
      { id: 'criminalAppellant', label: '上诉人（被告人）', type: 'textarea', placeholder: '姓名、性别、出生年月、现羁押场所', required: true },
      { id: 'originalJudgment', label: '原审判决', type: 'text', placeholder: '原审法院、案号、判决结果', required: true },
      { id: 'appealGrounds', label: '上诉理由', type: 'textarea', placeholder: '事实认定、法律适用、量刑等方面的理由', required: true },
      { id: 'appealClaims', label: '上诉请求', type: 'textarea', placeholder: '明确的上诉请求', required: true },
      { id: 'appealCourt', label: '上诉法院', type: 'text', placeholder: 'XX市中级人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 刑事上诉状

**上诉人（被告人）：** {{criminalAppellant}}

**上诉因不服{{originalCourt}}（{{originalCaseNumber}}）号刑事{{judgmentType}}，现提起上诉。**

## 上诉理由

{{appealGrounds}}

## 上诉请求

{{appealClaims}}

此致

{{appealCourt}}

**上诉人：** {{criminalAppellant}}
**日期：** {{date}}
`,
  },
  {
    id: 'criminal-petition',
    name: '刑事申诉状',
    category: 'litigation',
    description: '当事人对已生效刑事判决不服，向法院或检察院提出申诉的法律文书',
    icon: '📄',
    legalBasis: ['《中华人民共和国刑事诉讼法》第二百五十二条'],
    fields: [
      { id: 'petitioner', label: '申诉人', type: 'textarea', placeholder: '姓名、性别、出生年月、住址', required: true },
      { id: 'targetJudgment', label: '申诉针对的判决', type: 'text', placeholder: '作出法院、案号', required: true },
      { id: 'petitionGrounds', label: '申诉理由', type: 'textarea', placeholder: '新证据、事实认定错误、法律适用错误等', required: true },
      { id: 'petitionRequest', label: '申诉请求', type: 'textarea', placeholder: '具体的申诉请求', required: true },
      { id: 'newEvidence', label: '新证据（如有）', type: 'textarea', placeholder: '足以推翻原判决的新证据' },
      { id: 'targetAuthority', label: '受理机关', type: 'text', placeholder: 'XX人民法院/XX人民检察院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 刑事申诉状

**申诉人：** {{petitioner}}

**申诉人因{{caseName}}一案，不服{{originalCourt}}（{{originalCaseNumber}}）号刑事{{judgmentType}}，现提出申诉。**

## 申诉请求

{{petitionRequest}}

## 申诉理由

{{petitionGrounds}}

## 新证据

{{newEvidence}}

此致

{{targetAuthority}}

**申诉人：** {{petitioner}}
**日期：** {{date}}
`,
  },
  {
    id: 'admin-complaint',
    name: '行政起诉状',
    category: 'litigation',
    description: '公民、法人或其他组织不服行政机关行政行为而向法院提起行政诉讼的法律文书',
    icon: '🏛️',
    legalBasis: ['《中华人民共和国行政诉讼法》第四十九条', '《中华人民共和国行政诉讼法》第十二条'],
    fields: [
      { id: 'adminPlaintiff', label: '原告信息', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'adminDefendant', label: '被告（行政机关）', type: 'text', placeholder: '行政机关名称、住所', required: true },
      { id: 'adminAct', label: '被诉行政行为', type: 'textarea', placeholder: '具体行政行为的名称、文号、内容', required: true },
      { id: 'adminClaims', label: '诉讼请求', type: 'textarea', placeholder: '撤销行政行为、确认违法、赔偿等', required: true },
      { id: 'adminFacts', label: '事实与理由', type: 'textarea', placeholder: '行政行为违法的事实和法律依据', required: true },
      { id: 'adminCourt', label: '管辖法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 行政起诉状

**原告：** {{adminPlaintiff}}

**被告：** {{adminDefendant}}

**被诉行政行为：** {{adminAct}}

## 诉讼请求

{{adminClaims}}

## 事实与理由

{{adminFacts}}

此致

{{adminCourt}}

**原告：** {{adminPlaintiff}}
**日期：** {{date}}
`,
  },
  {
    id: 'admin-defense',
    name: '行政答辩状',
    category: 'litigation',
    description: '作为被告的行政机关针对行政诉讼起诉状进行答辩的法律文书',
    icon: '📝',
    legalBasis: ['《中华人民共和国行政诉讼法》第六十七条'],
    fields: [
      { id: 'adminRespondent', label: '答辩机关', type: 'text', placeholder: '行政机关名称', required: true },
      { id: 'adminPlaintiffName', label: '原告', type: 'text', placeholder: '原告姓名/名称', required: true },
      { id: 'contestedAct', label: '被诉行政行为', type: 'text', placeholder: '行政行为名称及文号', required: true },
      { id: 'adminDefense', label: '答辩意见', type: 'textarea', placeholder: '行政行为的合法性依据', required: true },
      { id: 'adminEvidence', label: '证据材料', type: 'textarea', placeholder: '证明行政行为合法的事实和法律依据', required: true },
      { id: 'court', label: '审理法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 行政答辩状

**答辩机关：** {{adminRespondent}}

**原告：** {{adminPlaintiffName}}

**被诉行政行为：** {{contestedAct}}

## 答辩意见

{{adminDefense}}

## 证据材料

{{adminEvidence}}

此致

{{court}}

**答辩机关：** {{adminRespondent}}
**日期：** {{date}}
`,
  },
  {
    id: 'admin-appeal',
    name: '行政上诉状',
    category: 'litigation',
    description: '行政诉讼当事人不服一审判决，向上一级法院提起上诉的法律文书',
    icon: '⬆️',
    legalBasis: ['《中华人民共和国行政诉讼法》第八十五条'],
    fields: [
      { id: 'adminAppellant', label: '上诉人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'adminAppellee', label: '被上诉人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'adminOriginalCase', label: '原审案件', type: 'text', placeholder: '原审法院、案号、判决结果', required: true },
      { id: 'adminAppealRequest', label: '上诉请求', type: 'textarea', placeholder: '明确的上诉请求', required: true },
      { id: 'adminAppealReason', label: '上诉理由', type: 'textarea', placeholder: '一审认定事实或适用法律错误', required: true },
      { id: 'adminAppealCourt', label: '上诉法院', type: 'text', placeholder: 'XX市中级人民法院/XX高级人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 行政上诉状

**上诉人（原审{{originalRole}}）：** {{adminAppellant}}

**被上诉人（原审{{originalRole2}}）：** {{adminAppellee}}

**上诉因不服{{originalCourt}}（{{originalCaseNumber}}）号行政判决，现提起上诉。**

## 上诉请求

{{adminAppealRequest}}

## 上诉理由

{{adminAppealReason}}

此致

{{adminAppealCourt}}

**上诉人：** {{adminAppellant}}
**日期：** {{date}}
`,
  },
  {
    id: 'admin-petition',
    name: '行政诉讼申请书',
    category: 'litigation',
    description: '当事人向行政机关或法院就特定行政事项提出申请的法律文书',
    icon: '📋',
    legalBasis: ['《中华人民共和国行政诉讼法》', '《中华人民共和国行政许可法》'],
    fields: [
      { id: 'adminApplicant', label: '申请人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'targetAgency', label: '被申请机关', type: 'text', placeholder: '行政机关名称', required: true },
      { id: 'applicationMatter', label: '申请事项', type: 'textarea', placeholder: '具体的申请内容', required: true },
      { id: 'applicationBasis', label: '事实与法律依据', type: 'textarea', placeholder: '申请所依据的事实和法律', required: true },
      { id: 'attachment', label: '附件材料', type: 'textarea', placeholder: '支持申请的材料清单' },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 行政诉讼申请书

**申请人：** {{adminApplicant}}

**被申请机关：** {{targetAgency}}

## 申请事项

{{applicationMatter}}

## 事实与法律依据

{{applicationBasis}}

## 附件材料

{{attachment}}

**申请人：** {{adminApplicant}}
**日期：** {{date}}
`,
  },
  {
    id: 'state-compensation',
    name: '国家赔偿申请书',
    category: 'litigation',
    description: '公民因国家机关及其工作人员违法行使职权造成损害而申请国家赔偿的法律文书',
    icon: '🇨🇳',
    legalBasis: ['《中华人民共和国国家赔偿法》第十二条、第十三条'],
    fields: [
      { id: 'compensationApplicant', label: '赔偿请求人', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'compensationAgency', label: '赔偿义务机关', type: 'text', placeholder: '机关名称', required: true },
      { id: 'illegalAct', label: '违法侵权行为', type: 'textarea', placeholder: '侵权行为的时间、经过、结果', required: true },
      { id: 'compensationClaim', label: '赔偿请求', type: 'textarea', placeholder: '赔偿方式及具体金额', required: true },
      { id: 'compensationBasis', label: '事实与法律依据', type: 'textarea', placeholder: '损害与国家侵权行为之间的因果关系', required: true },
      { id: 'supportingDocs', label: '证明材料', type: 'textarea', placeholder: '相关证据材料清单' },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 国家赔偿申请书

**赔偿请求人：** {{compensationApplicant}}

**赔偿义务机关：** {{compensationAgency}}

## 违法侵权行为

{{illegalAct}}

## 赔偿请求

{{compensationClaim}}

## 事实与法律依据

{{compensationBasis}}

## 证明材料

{{supportingDocs}}

此致

{{compensationAgency}}

**赔偿请求人：** {{compensationApplicant}}
**日期：** {{date}}
`,
  },
  {
    id: 'withdraw-complaint',
    name: '撤回起诉申请书',
    category: 'litigation',
    description: '原告在法院作出判决前申请撤回起诉的法律文书',
    icon: '↩️',
    legalBasis: ['《中华人民共和国民事诉讼法》第一百四十八条'],
    fields: [
      { id: 'withdrawApplicant', label: '申请人（原告）', type: 'textarea', placeholder: '姓名/名称、住址、联系方式', required: true },
      { id: 'withdrawCase', label: '案件信息', type: 'text', placeholder: '案号、案由', required: true },
      { id: 'withdrawReason', label: '撤回起诉的理由', type: 'textarea', placeholder: '如：双方已达成和解等', required: true },
      { id: 'court', label: '受理法院', type: 'text', placeholder: 'XX市XX区人民法院', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 撤回起诉申请书

**申请人（原告）：** {{withdrawApplicant}}

**案号：** {{withdrawCase}}

## 撤回起诉的理由

{{withdrawReason}}

综上，申请人申请撤回起诉，请予批准。

此致

{{court}}

**申请人：** {{withdrawApplicant}}
**日期：** {{date}}
`,
  },
]

/** 非诉文书模板 */
const nonLitigationTemplates: LegalTemplate[] = [
  {
    id: 'sales-contract',
    name: '买卖合同',
    category: 'non-litigation',
    description: '出卖人转移标的物所有权于买受人，买受人支付价款的合同',
    icon: '📦',
    legalBasis: ['《中华人民共和国民法典》第五百九十五条至第六百四十七条'],
    fields: [
      { id: 'seller', label: '出卖人（甲方）', type: 'textarea', placeholder: '名称/姓名、统一社会信用代码/身份证号、地址', required: true },
      { id: 'buyer', label: '买受人（乙方）', type: 'textarea', placeholder: '名称/姓名、统一社会信用代码/身份证号、地址', required: true },
      { id: 'productName', label: '标的物名称', type: 'text', placeholder: '产品/商品名称', required: true },
      { id: 'productSpec', label: '规格型号', type: 'text', placeholder: '规格、型号、质量标准', required: true },
      { id: 'quantity', label: '数量', type: 'text', placeholder: '数量及计量单位', required: true },
      { id: 'price', label: '单价/总价', type: 'text', placeholder: '单价、总价款（人民币）', required: true },
      { id: 'deliveryTerms', label: '交货条款', type: 'textarea', placeholder: '交货时间、地点、方式', required: true },
      { id: 'paymentTerms', label: '付款条款', type: 'textarea', placeholder: '付款方式、期限', required: true },
      { id: 'inspection', label: '验收条款', type: 'textarea', placeholder: '验收标准、期限', required: true },
      { id: 'breach', label: '违约责任', type: 'textarea', placeholder: '违约金计算方式' },
      { id: 'dispute', label: '争议解决', type: 'textarea', placeholder: '仲裁或诉讼管辖' },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 买卖合同

**出卖人（甲方）：** {{seller}}
**买受人（乙方）：** {{buyer}}

根据《中华人民共和国民法典》及相关法律法规，甲乙双方经平等协商，就产品买卖事宜达成如下协议：

## 第一条 标的物

| 名称 | 规格型号 | 数量 | 单价 | 总价 |
|------|---------|------|------|------|
| {{productName}} | {{productSpec}} | {{quantity}} | | {{price}} |

## 第二条 质量要求

{{qualityStandard}}

## 第三条 包装标准

{{packagingStandard}}

## 第四条 交货

{{deliveryTerms}}

## 第五条 验收

{{inspection}}

## 第六条 付款

{{paymentTerms}}

## 第七条 违约责任

{{breach}}

## 第八条 争议解决

{{dispute}}

## 第九条 其他约定

{{otherTerms}}

**甲方（盖章）：** {{seller}}
**乙方（盖章）：** {{buyer}}

**签订日期：** {{signDate}}
**签订地点：** {{signPlace}}
`,
  },
  {
    id: 'lease-contract',
    name: '租赁合同',
    category: 'non-litigation',
    description: '出租人将租赁物交付承租人使用、收益，承租人支付租金的合同',
    icon: '🏠',
    legalBasis: ['《中华人民共和国民法典》第七百零三条至第七百三十四条'],
    fields: [
      { id: 'lessor', label: '出租人（甲方）', type: 'textarea', placeholder: '姓名/名称、身份证号、联系方式', required: true },
      { id: 'lessee', label: '承租人（乙方）', type: 'textarea', placeholder: '姓名/名称、身份证号、联系方式', required: true },
      { id: 'property', label: '租赁物', type: 'textarea', placeholder: '坐落位置、面积、用途', required: true },
      { id: 'leaseTerm', label: '租赁期限', type: 'text', placeholder: '起止日期', required: true },
      { id: 'rent', label: '租金及支付方式', type: 'textarea', placeholder: '租金金额、支付周期、支付方式', required: true },
      { id: 'deposit', label: '押金', type: 'text', placeholder: '押金金额', required: true },
      { id: 'maintenance', label: '维修责任', type: 'textarea', placeholder: '维修责任划分' },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 租赁合同

**出租人（甲方）：** {{lessor}}
**承租人（乙方）：** {{lessee}}

根据《中华人民共和国民法典》，甲乙双方就房屋/设备租赁事宜达成如下协议：

## 第一条 租赁物

{{property}}

## 第二条 租赁期限

{{leaseTerm}}

## 第三条 租金

{{rent}}

## 第四条 押金

{{deposit}}

## 第五条 维修责任

{{maintenance}}

## 第六条 其他约定

{{otherTerms}}

**甲方：** {{lessor}}
**乙方：** {{lessee}}

**签订日期：** {{signDate}}
`,
  },
  {
    id: 'loan-contract',
    name: '借款合同',
    category: 'non-litigation',
    description: '借款人向贷款人借款，到期返还借款并支付利息的合同',
    icon: '💰',
    legalBasis: ['《中华人民共和国民法典》第六百六十七条至第六百八十条'],
    fields: [
      { id: 'lender', label: '出借人（甲方）', type: 'textarea', placeholder: '姓名/名称、身份证号/统一社会信用代码', required: true },
      { id: 'borrower', label: '借款人（乙方）', type: 'textarea', placeholder: '姓名/名称、身份证号/统一社会信用代码', required: true },
      { id: 'loanAmount', label: '借款金额', type: 'text', placeholder: '人民币（大写）', required: true },
      { id: 'loanTerm', label: '借款期限', type: 'text', placeholder: '起止日期', required: true },
      { id: 'interestRate', label: '利率', type: 'text', placeholder: '年利率/月利率', required: true },
      { id: 'repayment', label: '还款方式', type: 'textarea', placeholder: '到期一次性还本付息/分期还款等', required: true },
      { id: 'guarantee', label: '担保方式', type: 'textarea', placeholder: '保证、抵押、质押等担保方式' },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 借款合同

**出借人（甲方）：** {{lender}}
**借款人（乙方）：** {{borrower}}

根据《中华人民共和国民法典》及相关法律法规，双方就借款事宜达成如下协议：

## 第一条 借款金额

甲方同意向乙方出借人民币（大写）{{loanAmount}}元整。

## 第二条 借款期限

{{loanTerm}}

## 第三条 利率

{{interestRate}}

## 第四条 还款方式

{{repayment}}

## 第五条 担保

{{guarantee}}

## 第六条 违约责任

{{defaultClause}}

**甲方：** {{lender}}
**乙方：** {{borrower}}

**签订日期：** {{signDate}}
`,
  },
  {
    id: 'labor-contract',
    name: '劳动合同',
    category: 'non-litigation',
    description: '用人单位与劳动者确立劳动关系、明确双方权利义务的协议',
    icon: '👔',
    legalBasis: ['《中华人民共和国劳动法》', '《中华人民共和国劳动合同法》第十七条'],
    fields: [
      { id: 'employer', label: '用人单位', type: 'textarea', placeholder: '名称、住所、法定代表人', required: true },
      { id: 'employee', label: '劳动者', type: 'textarea', placeholder: '姓名、性别、身份证号、住址', required: true },
      { id: 'position', label: '工作岗位', type: 'text', placeholder: '岗位名称', required: true },
      { id: 'workplace', label: '工作地点', type: 'text', placeholder: '工作地址', required: true },
      { id: 'contractTerm', label: '合同期限', type: 'text', placeholder: '固定期限/无固定期限/以完成一定工作为期限', required: true },
      { id: 'workingHours', label: '工作时间', type: 'text', placeholder: '标准工时制/综合计算工时制/不定时工作制', required: true },
      { id: 'salary', label: '劳动报酬', type: 'textarea', placeholder: '工资标准、支付方式、发放日', required: true },
      { id: 'socialInsurance', label: '社会保险', type: 'text', placeholder: '五险一金缴纳情况', required: true },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 劳动合同

**用人单位（甲方）：** {{employer}}
**劳动者（乙方）：** {{employee}}

根据《中华人民共和国劳动法》《中华人民共和国劳动合同法》及相关法律法规，甲乙双方经平等协商一致，自愿签订本合同。

## 第一条 劳动合同期限

{{contractTerm}}

## 第二条 工作内容和工作地点

**工作岗位：** {{position}}
**工作地点：** {{workplace}}

## 第三条 工作时间和休息休假

{{workingHours}}

## 第四条 劳动报酬

{{salary}}

## 第五条 社会保险和福利待遇

{{socialInsurance}}

## 第六条 劳动保护

{{laborProtection}}

**甲方（盖章）：** {{employer}}
**乙方（签字）：** {{employee}}

**签订日期：** {{signDate}}
`,
  },
  {
    id: 'equity-transfer',
    name: '股权转让协议',
    category: 'non-litigation',
    description: '股东将其持有的公司股权转让给受让方的法律文件',
    icon: '📊',
    legalBasis: ['《中华人民共和国公司法》第七十一条', '《中华人民共和国民法典》合同编'],
    fields: [
      { id: 'transferor', label: '转让方（甲方）', type: 'textarea', placeholder: '姓名/名称、身份证号/统一社会信用代码', required: true },
      { id: 'transferee', label: '受让方（乙方）', type: 'textarea', placeholder: '姓名/名称、身份证号/统一社会信用代码', required: true },
      { id: 'companyName', label: '目标公司名称', type: 'text', placeholder: '公司全称', required: true },
      { id: 'transferEquity', label: '转让股权', type: 'text', placeholder: '出资额、持股比例', required: true },
      { id: 'transferPrice', label: '转让价款', type: 'text', placeholder: '价款金额（人民币）', required: true },
      { id: 'paymentSchedule', label: '支付安排', type: 'textarea', placeholder: '付款时间、方式', required: true },
      { id: 'representations', label: '陈述与保证', type: 'textarea', placeholder: '双方的陈述与保证条款' },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 股权转让协议

**转让方（甲方）：** {{transferor}}
**受让方（乙方）：** {{transferee}}

**目标公司：** {{companyName}}

## 第一条 股权转让

甲方同意将其持有的{{companyName}}{{transferEquity}}的股权（出资额{{capitalContribution}}元）转让给乙方，乙方同意受让。

## 第二条 转让价款及支付

{{transferPrice}}

{{paymentSchedule}}

## 第三条 陈述与保证

{{representations}}

## 第四条 交割

{{closingConditions}}

## 第五条 违约责任

{{defaultClause}}

**甲方：** {{transferor}}
**乙方：** {{transferee}}

**签订日期：** {{signDate}}
`,
  },
  {
    id: 'partnership-agreement',
    name: '合伙协议',
    category: 'non-litigation',
    description: '合伙人共同出资、合伙经营、共享收益、共担风险的协议',
    icon: '🤝',
    legalBasis: ['《中华人民共和国合伙企业法》', '《中华人民共和国民法典》合伙合同章节'],
    fields: [
      { id: 'partners', label: '合伙人信息', type: 'textarea', placeholder: '各合伙人姓名/名称、出资方式、出资额', required: true },
      { id: 'partnershipName', label: '合伙企业名称', type: 'text', placeholder: '合伙企业名称', required: true },
      { id: 'businessScope', label: '经营范围', type: 'textarea', placeholder: '经营业务范围', required: true },
      { id: 'capitalTotal', label: '出资总额', type: 'text', placeholder: '总出资额', required: true },
      { id: 'profitSharing', label: '利润分配', type: 'textarea', placeholder: '利润分配比例和方式', required: true },
      { id: 'management', label: '执行事务合伙人', type: 'text', placeholder: '执行事务合伙人姓名', required: true },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 合伙协议

**合伙人：** {{partners}}

依据《中华人民共和国合伙企业法》，各合伙人经协商一致，共同出资设立合伙企业。

## 第一条 合伙企业基本情况

**名称：** {{partnershipName}}
**经营范围：** {{businessScope}}

## 第二条 出资

**出资总额：** {{capitalTotal}}
**出资方式及期限：** {{contributionDetails}}

## 第三条 利润分配与亏损分担

{{profitSharing}}

## 第四条 事务执行

**执行事务合伙人：** {{management}}

{{managementAuthority}}

## 第五条 入伙与退伙

{{entryExitTerms}}

## 第六条 解散与清算

{{dissolutionTerms}}

**各合伙人签字：**

{{signDate}}
`,
  },
  {
    id: 'nda',
    name: '保密协议',
    category: 'non-litigation',
    description: '约定一方不得向第三方披露特定保密信息的法律协议',
    icon: '🔐',
    legalBasis: ['《中华人民共和国反不正当竞争法》第九条', '《中华人民共和国民法典》第五百零一条'],
    fields: [
      { id: 'disclosingParty', label: '披露方', type: 'textarea', placeholder: '名称/姓名', required: true },
      { id: 'receivingParty', label: '接收方', type: 'textarea', placeholder: '名称/姓名', required: true },
      { id: 'confidentialInfo', label: '保密信息范围', type: 'textarea', placeholder: '保密信息的具体内容', required: true },
      { id: 'confidentialPeriod', label: '保密期限', type: 'text', placeholder: '保密义务的持续时间', required: true },
      { id: 'purpose', label: '使用目的', type: 'textarea', placeholder: '允许使用保密信息的目的', required: true },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 保密协议

**披露方：** {{disclosingParty}}
**接收方：** {{receivingParty}}

## 第一条 保密信息

{{confidentialInfo}}

## 第二条 保密义务

接收方应对保密信息严格保密，未经披露方书面同意，不得向任何第三方披露。

## 第三条 使用限制

{{purpose}}

## 第四条 保密期限

{{confidentialPeriod}}

## 第五条 例外情况

{{exceptions}}

**披露方：** {{disclosingParty}}
**接收方：** {{receivingParty}}

**签订日期：** {{signDate}}
`,
  },
  {
    id: 'non-compete',
    name: '竞业限制协议',
    category: 'non-litigation',
    description: '用人单位与劳动者约定离职后一定期限内不得到竞争单位工作的协议',
    icon: '🚫',
    legalBasis: ['《中华人民共和国劳动合同法》第二十三条、第二十四条'],
    fields: [
      { id: 'company', label: '用人单位', type: 'textarea', placeholder: '名称、地址', required: true },
      { id: 'employee', label: '劳动者', type: 'textarea', placeholder: '姓名、身份证号', required: true },
      { id: 'restrictionScope', label: '竞业限制范围', type: 'textarea', placeholder: '限制的行业、地域、单位', required: true },
      { id: 'restrictionPeriod', label: '竞业限制期限', type: 'text', placeholder: '不超过两年', required: true },
      { id: 'compensation', label: '经济补偿', type: 'text', placeholder: '补偿金额和支付方式', required: true },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 竞业限制协议

**用人单位（甲方）：** {{company}}
**劳动者（乙方）：** {{employee}}

根据《中华人民共和国劳动合同法》第二十三条、第二十四条，双方经协商一致，签订本竞业限制协议。

## 第一条 竞业限制范围

{{restrictionScope}}

## 第二条 竞业限制期限

{{restrictionPeriod}}

## 第三条 经济补偿

{{compensation}}

## 第四条 违约责任

{{defaultClause}}

**甲方（盖章）：** {{company}}
**乙方（签字）：** {{employee}}

**签订日期：** {{signDate}}
`,
  },
  {
    id: 'power-of-attorney',
    name: '授权委托书',
    category: 'non-litigation',
    description: '委托人授权受托人代为办理特定事项的法律文书',
    icon: '📜',
    legalBasis: ['《中华人民共和国民法典》第一百六十五条', '《中华人民共和国民事诉讼法》第六十二条'],
    fields: [
      { id: 'principal', label: '委托人', type: 'textarea', placeholder: '姓名/名称、身份证号/统一社会信用代码', required: true },
      { id: 'agent', label: '受托人', type: 'textarea', placeholder: '姓名、身份证号、联系方式', required: true },
      { id: 'authorizationScope', label: '授权范围', type: 'textarea', placeholder: '具体授权事项和权限', required: true },
      { id: 'authorizationPeriod', label: '授权期限', type: 'text', placeholder: '起止日期', required: true },
      { id: 'isSpecial', label: '是否特别授权', type: 'select', options: ['普通授权', '特别授权'], required: true },
      { id: 'signDate', label: '签署日期', type: 'date', required: true },
    ],
    content: `# 授权委托书

**委托人：** {{principal}}
**受托人：** {{agent}}

## 授权事项

{{authorizationScope}}

## 授权期限

{{authorizationPeriod}}

## 授权性质

{{isSpecial}}

受托人在上述授权范围内所实施的一切法律行为，委托人均予以承认。

**委托人（签章）：** {{principal}}
**受托人（签章）：** {{agent}}

**签署日期：** {{signDate}}
`,
  },
  {
    id: 'lawyer-letter',
    name: '律师函',
    category: 'non-litigation',
    description: '律师接受当事人委托，就特定事项向对方发出的法律文书',
    icon: '📨',
    legalBasis: [],
    fields: [
      { id: 'senderClient', label: '委托人（当事人）', type: 'textarea', placeholder: '名称/姓名', required: true },
      { id: 'recipient', label: '致送对象', type: 'textarea', placeholder: '对方名称/姓名、地址', required: true },
      { id: 'lawFirm', label: '律师事务所', type: 'text', placeholder: '律师事务所名称', required: true },
      { id: 'lawyerName', label: '律师姓名', type: 'text', placeholder: '经办律师', required: true },
      { id: 'caseFacts', label: '基本事实', type: 'textarea', placeholder: '案件事实概述', required: true },
      { id: 'legalAnalysis', label: '法律分析', type: 'textarea', placeholder: '法律依据和分析', required: true },
      { id: 'demand', label: '要求事项', type: 'textarea', placeholder: '对对方的具体要求', required: true },
      { id: 'deadline', label: '履行期限', type: 'text', placeholder: '要求的答复或履行期限', required: true },
      { id: 'date', label: '发函日期', type: 'date', required: true },
    ],
    content: `# 律师函

**致：** {{recipient}}

**委托人就{{caseTitle}}事宜，本所{{lawFirm}}接受{{senderClient}}的委托，指派{{lawyerName}}律师，就相关事宜致函如下：**

## 一、基本事实

{{caseFacts}}

## 二、法律分析

{{legalAnalysis}}

## 三、法律后果

{{legalConsequences}}

## 四、本所律师意见

{{demand}}

请贵方于{{deadline}}前予以书面答复，否则我方委托人将依法采取进一步法律措施，届时产生的一切法律后果由贵方承担。

**{{lawFirm}}**
**律师：** {{lawyerName}}
**日期：** {{date}}
`,
  },
  {
    id: 'legal-opinion',
    name: '法律意见书',
    category: 'non-litigation',
    description: '律师就特定法律问题出具的专业法律意见',
    icon: '📋',
    legalBasis: [],
    fields: [
      { id: 'opinionClient', label: '委托单位', type: 'text', placeholder: '委托单位名称', required: true },
      { id: 'opinionSubject', label: '法律事项', type: 'textarea', placeholder: '出具意见所针对的法律事项', required: true },
      { id: 'basicFacts', label: '基本事实', type: 'textarea', placeholder: '与法律事项相关的事实', required: true },
      { id: 'applicableLaw', label: '适用的法律', type: 'textarea', placeholder: '相关法律法规', required: true },
      { id: 'legalConclusion', label: '法律结论', type: 'textarea', placeholder: '具体的法律意见和结论', required: true },
      { id: 'riskWarning', label: '风险提示', type: 'textarea', placeholder: '可能的法律风险' },
      { id: 'lawFirmName', label: '出具律所', type: 'text', placeholder: '律师事务所名称', required: true },
      { id: 'lawyerName', label: '出具律师', type: 'text', placeholder: '律师姓名', required: true },
      { id: 'opinionDate', label: '出具日期', type: 'date', required: true },
    ],
    content: `# 法律意见书

**致：** {{opinionClient}}

**关于：** {{opinionSubject}}

本所{{lawFirmName}}接受{{opinionClient}}的委托，指派{{lawyerName}}律师就{{opinionSubject}}出具本法律意见书。

## 一、基本事实

{{basicFacts}}

## 二、法律依据

{{applicableLaw}}

## 三、法律分析

{{legalAnalysis}}

## 四、法律结论

{{legalConclusion}}

## 五、风险提示

{{riskWarning}}

**{{lawFirmName}}**
**律师：** {{lawyerName}}
**日期：** {{opinionDate}}
`,
  },
  {
    id: 'due-diligence-report',
    name: '尽职调查报告',
    category: 'non-litigation',
    description: '对目标公司/项目进行全面的法律、财务、业务尽职调查后出具的报告',
    icon: '🔍',
    legalBasis: [],
    fields: [
      { id: 'ddClient', label: '委托方', type: 'text', placeholder: '委托方名称', required: true },
      { id: 'ddTarget', label: '调查对象', type: 'text', placeholder: '目标公司/项目名称', required: true },
      { id: 'ddScope', label: '调查范围', type: 'textarea', placeholder: '尽职调查的范围和内容', required: true },
      { id: 'ddFindings', label: '调查发现', type: 'textarea', placeholder: '调查中发现的主要问题', required: true },
      { id: 'ddConclusion', label: '结论与建议', type: 'textarea', placeholder: '法律意见和风险提示', required: true },
      { id: 'ddFirm', label: '出具机构', type: 'text', placeholder: '律师事务所名称', required: true },
      { id: 'ddDate', label: '报告日期', type: 'date', required: true },
    ],
    content: `# 尽职调查报告

**致：** {{ddClient}}

**关于：** {{ddTarget}}

**出具机构：** {{ddFirm}}
**报告日期：** {{ddDate}}

## 一、调查范围

{{ddScope}}

## 二、调查方法

{{ddMethod}}

## 三、调查发现

{{ddFindings}}

## 四、法律风险分析

{{ddRiskAnalysis}}

## 五、结论与建议

{{ddConclusion}}

**{{ddFirm}}**
**日期：** {{ddDate}}
`,
  },
  {
    id: 'shareholders-resolution',
    name: '股东会决议',
    category: 'non-litigation',
    description: '公司股东会就重大事项作出的书面决议文件',
    icon: '📑',
    legalBasis: ['《中华人民共和国公司法》第三十七条、第四十三条'],
    fields: [
      { id: 'companyName', label: '公司名称', type: 'text', placeholder: '公司全称', required: true },
      { id: 'meetingTime', label: '会议时间', type: 'text', placeholder: '会议召开时间', required: true },
      { id: 'meetingPlace', label: '会议地点', type: 'text', placeholder: '会议召开地点', required: true },
      { id: 'attendees', label: '出席股东', type: 'textarea', placeholder: '出席股东名称及持股比例', required: true },
      { id: 'resolutionItems', label: '决议事项', type: 'textarea', placeholder: '逐项列明决议内容', required: true },
      { id: 'votingResult', label: '表决结果', type: 'textarea', placeholder: '同意、反对、弃权情况', required: true },
      { id: 'signDate', label: '签署日期', type: 'date', required: true },
    ],
    content: `# 股东会决议

**公司名称：** {{companyName}}

**会议时间：** {{meetingTime}}
**会议地点：** {{meetingPlace}}
**出席股东：** {{attendees}}

本次会议的召集、召开程序符合《中华人民共和国公司法》和公司章程的规定。

## 决议事项

{{resolutionItems}}

## 表决结果

{{votingResult}}

**出席股东签字（盖章）：**

**签署日期：** {{signDate}}
`,
  },
  {
    id: 'board-resolution',
    name: '董事会决议',
    category: 'non-litigation',
    description: '公司董事会就经营管理事项作出的书面决议文件',
    icon: '📑',
    legalBasis: ['《中华人民共和国公司法》第四十八条、第一百一十一条'],
    fields: [
      { id: 'boardCompany', label: '公司名称', type: 'text', placeholder: '公司全称', required: true },
      { id: 'boardMeetingTime', label: '会议时间', type: 'text', placeholder: '会议召开时间', required: true },
      { id: 'boardMeetingPlace', label: '会议地点', type: 'text', placeholder: '会议召开地点', required: true },
      { id: 'boardAttendees', label: '出席董事', type: 'textarea', placeholder: '出席董事姓名', required: true },
      { id: 'boardResolutions', label: '决议事项', type: 'textarea', placeholder: '逐项列明决议内容', required: true },
      { id: 'boardVoting', label: '表决结果', type: 'textarea', placeholder: '同意、反对、弃权情况', required: true },
      { id: 'boardSignDate', label: '签署日期', type: 'date', required: true },
    ],
    content: `# 董事会决议

**公司名称：** {{boardCompany}}

**会议时间：** {{boardMeetingTime}}
**会议地点：** {{boardMeetingPlace}}
**出席董事：** {{boardAttendees}}

本次会议的召集、召开程序符合《中华人民共和国公司法》和公司章程的规定。

## 决议事项

{{boardResolutions}}

## 表决结果

{{boardVoting}}

**董事签字：**

**签署日期：** {{boardSignDate}}
`,
  },
  {
    id: 'company-articles',
    name: '公司章程',
    category: 'non-litigation',
    description: '公司依法制定的规范公司组织与行为的基本法律文件',
    icon: '📘',
    legalBasis: ['《中华人民共和国公司法》第十一条、第二十五条'],
    fields: [
      { id: 'companyFullName', label: '公司名称', type: 'text', placeholder: '公司全称', required: true },
      { id: 'companyAddress', label: '公司住所', type: 'text', placeholder: '注册地址', required: true },
      { id: 'companyScope', label: '经营范围', type: 'textarea', placeholder: '经营范围', required: true },
      { id: 'registeredCapital', label: '注册资本', type: 'text', placeholder: '注册资本金额', required: true },
      { id: 'shareholders', label: '股东信息', type: 'textarea', placeholder: '股东名称、出资额、出资比例、出资方式', required: true },
      { id: 'orgStructure', label: '组织机构', type: 'textarea', placeholder: '股东会、董事会（执行董事）、监事会（监事）的设置', required: true },
      { id: 'signDate', label: '签署日期', type: 'date', required: true },
    ],
    content: `# {{companyFullName}}章程

## 第一章 总则

**第一条** 为规范公司的组织和行为，保护公司、股东和债权人的合法权益，根据《中华人民共和国公司法》及相关法律法规，制定本章程。

**第二条** 公司名称：{{companyFullName}}

**第三条** 公司住所：{{companyAddress}}

**第四条** 公司经营范围：{{companyScope}}

**第五条** 公司注册资本：人民币{{registeredCapital}}元

## 第二章 股东

**第六条** 公司股东及其出资情况：

{{shareholders}}

## 第三章 组织机构

{{orgStructure}}

## 第四章 财务与利润分配

{{financeClause}}

## 第五章 合并、分立、解散

{{mergerClause}}

**全体股东签字（盖章）：**

**签署日期：** {{signDate}}
`,
  },
  {
    id: 'divorce-agreement',
    name: '离婚协议书',
    category: 'non-litigation',
    description: '夫妻双方就自愿离婚及财产、子女抚养等问题达成一致的协议',
    icon: '💔',
    legalBasis: ['《中华人民共和国民法典》第一千零七十六条、第一千零八十七条'],
    fields: [
      { id: 'husband', label: '男方信息', type: 'textarea', placeholder: '姓名、身份证号、住址', required: true },
      { id: 'wife', label: '女方信息', type: 'textarea', placeholder: '姓名、身份证号、住址', required: true },
      { id: 'marriageStatus', label: '婚姻状况', type: 'text', placeholder: '结婚登记时间、地点', required: true },
      { id: 'divorceReason', label: '离婚原因', type: 'textarea', placeholder: '双方自愿离婚的原因', required: true },
      { id: 'childCustody', label: '子女抚养', type: 'textarea', placeholder: '抚养权归属、抚养费、探望权', required: true },
      { id: 'propertyDivision', label: '财产分割', type: 'textarea', placeholder: '房产、车辆、存款等分割方案', required: true },
      { id: 'debtDivision', label: '债务处理', type: 'textarea', placeholder: '共同债务的分担', required: true },
      { id: 'signDate', label: '签署日期', type: 'date', required: true },
    ],
    content: `# 离婚协议书

**男方：** {{husband}}
**女方：** {{wife}}

男方与女方于{{marriageDate}}在{{marriagePlace}}登记结婚。现因{{divorceReason}}，致使夫妻感情确已破裂，无和好可能。双方经充分协商，就自愿离婚一事达成如下协议：

## 一、自愿离婚

男方与女方自愿解除婚姻关系。

## 二、子女抚养

{{childCustody}}

## 三、财产分割

{{propertyDivision}}

## 四、债务处理

{{debtDivision}}

## 五、其他约定

{{otherTerms}}

**男方：** {{husband}}
**女方：** {{wife}}

**签署日期：** {{signDate}}
`,
  },
  {
    id: 'will',
    name: '遗嘱',
    category: 'non-litigation',
    description: '自然人生前按照法律规定方式处分个人财产的法律文件',
    icon: '📜',
    legalBasis: ['《中华人民共和国民法典》第一千一百三十四条至第一千一百四十四条'],
    fields: [
      { id: 'testator', label: '立遗嘱人', type: 'textarea', placeholder: '姓名、性别、身份证号、住址', required: true },
      { id: 'inheritanceProperty', label: '遗产范围', type: 'textarea', placeholder: '财产的种类、数量、所在地', required: true },
      { id: 'bequest', label: '遗产分配方案', type: 'textarea', placeholder: '各继承人的继承份额和具体财产', required: true },
      { id: 'executor', label: '遗嘱执行人', type: 'text', placeholder: '指定遗嘱执行人姓名' },
      { id: 'specialBequest', label: '遗赠（如有）', type: 'textarea', placeholder: '遗赠给国家、集体或法定继承人以外的组织、个人' },
      { id: 'date', label: '立遗嘱日期', type: 'date', required: true },
    ],
    content: `# 遗 嘱

**立遗嘱人：** {{testator}}

为防止遗产继承纠纷，特立本遗嘱。

## 一、基本情况

立遗嘱人{{testator}}，身份证号：{{testatorId}}，住址：{{testatorAddress}}。

## 二、遗产范围

{{inheritanceProperty}}

## 三、遗产分配

{{bequest}}

## 四、遗嘱执行人

{{executor}}

## 五、其他

{{otherTerms}}

本遗嘱一式{{copies}}份，由{{holder}}保存。

**立遗嘱人：** {{testator}}
**见证人：** {{witness}}
**日期：** {{date}}
`,
  },
  {
    id: 'gift-contract',
    name: '赠与合同',
    category: 'non-litigation',
    description: '赠与人无偿将自己的财产给予受赠人，受赠人表示接受赠与的合同',
    icon: '🎁',
    legalBasis: ['《中华人民共和国民法典》第六百五十七条至第六百六十八条'],
    fields: [
      { id: 'donor', label: '赠与人', type: 'textarea', placeholder: '姓名/名称、身份证号/统一社会信用代码', required: true },
      { id: 'donee', label: '受赠人', type: 'textarea', placeholder: '姓名/名称、身份证号/统一社会信用代码', required: true },
      { id: 'giftDescription', label: '赠与财产', type: 'textarea', placeholder: '财产名称、数量、质量、价值', required: true },
      { id: 'giftTerms', label: '附随义务', type: 'textarea', placeholder: '附义务赠与的具体义务内容' },
      { id: 'giftDate', label: '赠与时间', type: 'text', placeholder: '财产交付时间或方式', required: true },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 赠与合同

**赠与人：** {{donor}}
**受赠人：** {{donee}}

## 第一条 赠与财产

{{giftDescription}}

## 第二条 赠与时间

{{giftDate}}

## 第三条 附随义务

{{giftTerms}}

## 第四条 撤销条款

{{revocationTerms}}

**赠与人：** {{donor}}
**受赠人：** {{donee}}

**签订日期：** {{signDate}}
`,
  },
  {
    id: 'settlement-agreement',
    name: '和解协议',
    category: 'non-litigation',
    description: '当事人在诉讼外或诉讼中就争议事项相互妥协达成一致的协议',
    icon: '🤝',
    legalBasis: ['《中华人民共和国民法典》', '《中华人民共和国民事诉讼法》'],
    fields: [
      { id: 'partyA', label: '甲方（当事人）', type: 'textarea', placeholder: '名称/姓名', required: true },
      { id: 'partyB', label: '乙方（当事人）', type: 'textarea', placeholder: '名称/姓名', required: true },
      { id: 'disputeOverview', label: '争议事项', type: 'textarea', placeholder: '争议的背景和焦点', required: true },
      { id: 'settlementTerms', label: '和解条款', type: 'textarea', placeholder: '双方达成的具体和解内容', required: true },
      { id: 'settlementAmount', label: '和解金额', type: 'text', placeholder: '补偿/赔偿金额（如有）' },
      { id: 'confidentiality', label: '保密条款', type: 'textarea', placeholder: '保密义务约定' },
      { id: 'signDate', label: '签订日期', type: 'date', required: true },
    ],
    content: `# 和解协议

**甲方：** {{partyA}}
**乙方：** {{partyB}}

## 第一条 争议事项

{{disputeOverview}}

## 第二条 和解内容

{{settlementTerms}}

## 第三条 和解金额及支付

{{settlementAmount}}

{{paymentTerms}}

## 第四条 权利义务终结

{{releaseClause}}

## 第五条 保密

{{confidentiality}}

**甲方：** {{partyA}}
**乙方：** {{partyB}}

**签订日期：** {{signDate}}
`,
  },
  {
    id: 'arbitration-application',
    name: '仲裁申请书',
    category: 'non-litigation',
    description: '当事人根据仲裁协议向仲裁委员会申请仲裁的法律文书',
    icon: '⚖️',
    legalBasis: ['《中华人民共和国仲裁法》第二十二条、第二十三条'],
    fields: [
      { id: 'arbitrationApplicant', label: '申请人', type: 'textarea', placeholder: '姓名/名称、住址/地址、联系方式', required: true },
      { id: 'arbitrationRespondent', label: '被申请人', type: 'textarea', placeholder: '姓名/名称、住址/地址、联系方式', required: true },
      { id: 'arbitrationAgreement', label: '仲裁依据', type: 'textarea', placeholder: '合同中约定的仲裁条款或单独仲裁协议', required: true },
      { id: 'arbitrationClaims', label: '仲裁请求', type: 'textarea', placeholder: '具体的仲裁请求事项', required: true },
      { id: 'arbitrationFacts', label: '事实与理由', type: 'textarea', placeholder: '案件事实和法律依据', required: true },
      { id: 'arbitrationCommittee', label: '仲裁委员会', type: 'text', placeholder: 'XX仲裁委员会', required: true },
      { id: 'date', label: '提交日期', type: 'date', required: true },
    ],
    content: `# 仲裁申请书

**申请人：** {{arbitrationApplicant}}

**被申请人：** {{arbitrationRespondent}}

## 仲裁依据

{{arbitrationAgreement}}

## 仲裁请求

{{arbitrationClaims}}

## 事实与理由

{{arbitrationFacts}}

此致

{{arbitrationCommittee}}

**申请人：** {{arbitrationApplicant}}
**日期：** {{date}}

---
> 附：
> 1. 仲裁协议复印件__份
> 2. 证据材料__份
`,
  },
]

/** 所有内置法律文书模板 */
export const builtInTemplates: LegalTemplate[] = [...litigationTemplates, ...nonLitigationTemplates]

/** 按分类获取模板 */
export function getTemplatesByCategory(category: TemplateCategory): LegalTemplate[] {
  return builtInTemplates.filter((t) => t.category === category)
}

/** 根据 ID 获取模板 */
export function getTemplateById(id: string): LegalTemplate | undefined {
  return builtInTemplates.find((t) => t.id === id)
}

/** 搜索模板 */
export function searchTemplates(query: string): LegalTemplate[] {
  const q = query.toLowerCase()
  return builtInTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.fields.some((f) => f.label.toLowerCase().includes(q))
  )
}

/** 分类元数据 */
export const categoryMeta: Record<TemplateCategory, { label: string; icon: string; description: string }> = {
  litigation: {
    label: '诉讼文书',
    icon: '⚖️',
    description: '涉及诉讼程序的法律文书，包括起诉、应诉、上诉、申诉等各阶段',
  },
  'non-litigation': {
    label: '非诉文书',
    icon: '📄',
    description: '非诉讼法律事务文书，包括合同、协议、公司文件等',
  },
  custom: {
    label: '我的模板',
    icon: '👤',
    description: '用户自行上传和AI学习生成的自定义模板',
  },
}
