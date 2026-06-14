#!/usr/bin/env python3
from __future__ import annotations
from __future__ import annotations

import argparse
import json
from pathlib import Path


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def dedupe_keep_order(items: list[str]) -> list[str]:
    seen = set()
    out = []
    for item in items:
        if not item or item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def normalize_priority(priority: str, high: int, medium: int) -> str:
    if priority == 'P1' or high > 0:
        return 'P1'
    if medium > 0:
        return 'P2'
    return 'P3'


def build_maps(evidence: dict, application_plan: dict) -> tuple[dict, dict]:
    evidence_map = {item['risk_point']: item for item in evidence.get('checklist', [])}
    scenario_map: dict[str, list[dict]] = {}
    for scenario in application_plan.get('scenarios', []):
        for risk_point in scenario.get('matched_risk_points', []):
            scenario_map.setdefault(risk_point, []).append(scenario)
    return evidence_map, scenario_map


def build_task_from_queue(index: int, entry: dict, evidence_map: dict, scenario_map: dict) -> dict:
    risk_point = entry.get('risk_point', '')
    evidence = evidence_map.get(risk_point, {})
    scenarios = scenario_map.get(risk_point, [])
    scenario_names = [s.get('name', '') for s in scenarios]
    scenario_actions = []
    scenario_deliverables = []
    for scenario in scenarios:
        scenario_actions.extend(scenario.get('next_actions', []))
        scenario_deliverables.extend(scenario.get('deliverables', []))

    actions = dedupe_keep_order((entry.get('next_actions') or []) + scenario_actions)
    deliverables = dedupe_keep_order(scenario_deliverables + ['更新后的合规材料或说明'])
    evidence_items = evidence.get('evidence_items', ['待补充证据材料'])

    return {
        'task_id': f'TASK-{index:03d}',
        'kind': 'risk_point_task',
        'priority': entry.get('priority', 'P2'),
        'theme_name': entry.get('theme_name', '未归类主题'),
        'title': f"整改：{risk_point}",
        'risk_point': risk_point,
        'risk_level': entry.get('risk_level', ''),
        'auto_recheck_status': entry.get('auto_recheck_status', ''),
        'auto_recheck_decision': entry.get('decision', ''),
        'owner_hint': evidence.get('owner_hint', '待指派'),
        'objective': '围绕该风险点补齐证据、修正文案或调整处理逻辑，直至自动复核可稳定通过。',
        'suggested_actions': actions,
        'required_evidence': evidence_items,
        'matched_scenarios': scenario_names,
        'deliverables': deliverables,
        'dependencies': entry.get('related_risk_points', []),
        'status': 'todo',
    }


def build_theme_task(index: int, cluster: dict, queue: list[dict], scenario_map: dict) -> dict | None:
    if cluster.get('item_count', 0) < 2:
        return None
    risk_points = cluster.get('risk_points', [])
    related_queue = [item for item in queue if item.get('theme_name') == cluster.get('theme_name')]
    priority = normalize_priority(
        'P1' if any(item.get('priority') == 'P1' for item in related_queue) else 'P2',
        cluster.get('high_risk_count', 0),
        cluster.get('medium_risk_count', 0),
    )

    scenario_names = []
    scenario_actions = []
    scenario_deliverables = []
    for risk_point in risk_points:
        for scenario in scenario_map.get(risk_point, []):
            scenario_names.append(scenario.get('name', ''))
            scenario_actions.extend(scenario.get('next_actions', []))
            scenario_deliverables.extend(scenario.get('deliverables', []))

    queue_actions = []
    for item in related_queue:
        queue_actions.extend(item.get('next_actions', []))

    return {
        'task_id': f'THEME-{index:03d}',
        'kind': 'theme_task',
        'priority': priority,
        'theme_name': cluster.get('theme_name', '未归类主题'),
        'title': f"专题整改：{cluster.get('theme_name', '未归类主题')}",
        'risk_points': risk_points,
        'objective': '将同一主题下的关联风险统一整改，避免逐条修补导致口径反复冲突。',
        'suggested_actions': dedupe_keep_order(queue_actions + scenario_actions),
        'required_evidence': ['汇总同主题风险点对应的证据材料', '形成统一整改口径或字段映射表'],
        'matched_scenarios': dedupe_keep_order(scenario_names),
        'deliverables': dedupe_keep_order(scenario_deliverables + ['主题级整改方案', '统一整改口径说明']),
        'status': 'todo',
        'summary': {
            'item_count': cluster.get('item_count', 0),
            'high_risk_count': cluster.get('high_risk_count', 0),
            'medium_risk_count': cluster.get('medium_risk_count', 0),
            'advisory_count': cluster.get('advisory_count', 0),
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', required=True)
    parser.add_argument('--queue', required=True)
    parser.add_argument('--clusters', required=True)
    parser.add_argument('--evidence-checklist', required=True)
    parser.add_argument('--application-plan', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    report = load_json(Path(args.report))
    queue_payload = load_json(Path(args.queue))
    cluster_payload = load_json(Path(args.clusters))
    evidence = load_json(Path(args.evidence_checklist))
    application_plan = load_json(Path(args.application_plan))

    evidence_map, scenario_map = build_maps(evidence, application_plan)

    tasks = []
    task_index = 1
    for entry in queue_payload.get('queue', []):
        tasks.append(build_task_from_queue(task_index, entry, evidence_map, scenario_map))
        task_index += 1

    theme_index = 1
    for cluster in cluster_payload.get('clusters', []):
        theme_task = build_theme_task(theme_index, cluster, queue_payload.get('queue', []), scenario_map)
        if theme_task:
            tasks.append(theme_task)
            theme_index += 1

    priority_counts = {'P1': 0, 'P2': 0, 'P3': 0}
    for task in tasks:
        priority = task.get('priority', 'P3')
        priority_counts[priority] = priority_counts.get(priority, 0) + 1

    payload = {
        'document_name': report.get('document_name', ''),
        'task_count': len(tasks),
        'priority_counts': priority_counts,
        'tasks': tasks,
    }

    Path(args.output).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
    print(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
