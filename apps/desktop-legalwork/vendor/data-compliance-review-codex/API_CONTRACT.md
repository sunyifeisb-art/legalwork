# 前后端接口契约

> 目的：让前端和后端不需要互相问"你改了什么"，只需要看这个文档。

## 1. 项目架构

- **主业务链没有任务数据库**。用户上传的文件/文本保存在 `uploads/`，分析结果保存在 `output/{task_id}/`。
- 项目可选使用本地法规检索库 `knowledge-base/local-regulations.sqlite3` 对报告做法规增强，但它不承担任务状态存储。
- 后端 = Python 脚本流水线，输出 JSON。
- 前端 = Flask 渲染 HTML，消费这些 JSON。

## 2. 核心数据流

```
用户上传/粘贴文本
    ↓
POST /api/upload → 返回 task_id
    ↓
SSE /api/progress/{task_id} → 实时进度
    ↓
GET /result/{task_id} → 结果页
```

## 3. 输出文件约定

后端每次跑完流水线，在 `output/{task_id}/` 下必须生成以下文件：

| 文件名 | 说明 | 前端用途 |
|--------|------|----------|
| `07_report_auto_rechecked.json` | 核心审查报告 | **必渲染**，展示风险统计和详情 |
| `14_remediation_tasks.json` | 整改任务清单 | **必渲染**，展示 P1/P2/P3 任务看板 |
| `10_evidence_checklist.json` | 证据清单 | 可选，展示需要补充的材料 |
| `11_sdk_partner_review_pack.json` | SDK 合作方审查包 | 命中场景时展示 |
| `12_cross_border_review_pack.json` | 数据出境审查包 | 命中场景时展示 |
| `13_privacy_remediation_pack.json` | 隐私整改审查包 | 命中场景时展示 |

## 4. JSON Schema 约定

### 4.1 核心报告 `07_report_auto_rechecked.json`

```json
{
  "document_name": "文档名",
  "document_type": "privacy_policy",
  "review_scope": "数据合规相关文件审查",
  "selected_review_paths": ["disclosure_check", "purpose_scope_check", ...],
  "summary": "共汇总 X 个风险/优化项...",
  "auto_recheck_triggered": true,
  "auto_recheck_summary": "触发 3 项，维持判断 3 项...",
  "stats": { "total": 6, "high_risk": 0, "medium_risk": 3, "advisory": 3 },
  "risk_clusters": [
    {
      "theme_name": "处理目的与法律基础",
      "item_count": 3,
      "high_risk_count": 0,
      "medium_risk_count": 1,
      "advisory_count": 2,
      "risk_points": ["..."]
    }
  ],
  "items": [
    {
      "risk_point": "风险标题",
      "risk_level": "中风险",
      "legal_basis": "法规依据",
      "legal_basis_source": "mapped_or_existing",
      "reason": "原因分析",
      "suggestion": "修改建议",
      "evidence": ["证据片段1", "证据片段2"],
      "supporting_regulations": [
        {
          "title": "支撑规范标题",
          "standard_code": "GB/T xxxx-2025",
          "effect_level": "国家标准/行业标准/技术指南",
          "relative_path": "二、国家标准、行业标准合集/xxx.pdf",
          "match_keywords": ["跨境", "个人信息"],
          "match_score": 12,
          "snippet": "命中的正文片段"
        }
      ],
      "auto_recheck": true,
      "auto_recheck_status": "自动复核后维持中风险",
      "theme_name": "主题名称"
    }
  ]
}
```

其中：
- `legal_basis` 仍表示主法规依据，保持现有口径。
- `supporting_regulations` 为**可选字段**，表示从本地法规库命中的支撑规范，不替代主法规依据。
- `local_regulation_db` 为报告级**可选字段**，用于记录本地法规库增强是否生效以及命中统计。

### 4.2 整改任务 `14_remediation_tasks.json`

```json
{
  "task_count": 4,
  "priority_counts": { "P1": 2, "P2": 2, "P3": 0 },
  "tasks": [
    {
      "task_id": "TASK-001",
      "kind": "risk_point_task",
      "priority": "P2",
      "title": "整改：xxx",
      "risk_point": "xxx",
      "owner_hint": "法务/产品",
      "objective": "...",
      "suggested_actions": ["动作1", "动作2"],
      "required_evidence": ["材料1", "材料2"],
      "matched_scenarios": ["隐私文档整改"],
      "status": "todo"
    }
  ]
}
```

## 5. 前端开发用 Mock 数据

- Mock 数据统一放在 `data-compliance-web/test_output/demo_data/`。
- 前端开发时可直接访问 `http://127.0.0.1:5000/dev/result` 查看结果页，无需跑完整流水线。
- **后端责任**：每当你调整了输出格式，必须同步更新 `test_output/demo_data/` 里的样例文件，否则前端 mock 会过时。

## 6. 变更管理

如果任何一方要改这个契约（比如新增字段、改文件名），必须：
1. 先更新这个 `API_CONTRACT.md`
2. 通知对方
3. 同步更新 `test_output/demo_data/` 样例
