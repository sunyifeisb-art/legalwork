#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

TRIGGER_LEVELS = {'中风险', '高风险'}
PLACEHOLDER_BASIS_TERMS = ['待外部规范数据库', '待补充具体依据']
ROOT = Path(__file__).resolve().parent.parent
DEFAULT_THEME_CONFIG = ROOT / 'config' / 'risk-themes.json'
RISK_ORDER = {'高风险': 3, '中风险': 2, '建议优化': 1, '无': 0}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def has_real_legal_basis(text: str) -> bool:
    text = (text or '').strip()
    if not text:
        return False
    return not any(term in text for term in PLACEHOLDER_BASIS_TERMS)


def build_theme_index(config: dict) -> dict[str, dict]:
    mapping: dict[str, dict] = {}
    for theme in config.get('themes', []):
        for risk_point in theme.get('risk_points', []):
            mapping[risk_point] = {
                'id': theme.get('id', ''),
                'name': theme.get('name', ''),
            }
    return mapping


def build_theme_context(item: dict, all_items: list[dict], theme_index: dict[str, dict]) -> dict:
    risk_point = item.get('risk_point', '')
    theme = theme_index.get(risk_point, {'id': 'ungrouped', 'name': '未归类主题'})
    peers = []
    for peer in all_items:
        if peer is item:
            continue
        if theme_index.get(peer.get('risk_point', ''), {'id': 'ungrouped'})['id'] == theme['id']:
            peers.append(peer)

    highest_peer_level = max((RISK_ORDER.get(peer.get('risk_level', '无'), 0) for peer in peers), default=0)
    corroboration_count = sum(1 for peer in peers if RISK_ORDER.get(peer.get('risk_level', '无'), 0) >= 1)
    return {
        'theme_id': theme['id'],
        'theme_name': theme['name'],
        'peer_count': len(peers),
        'corroboration_count': corroboration_count,
        'highest_peer_level': highest_peer_level,
        'peer_risk_points': [peer.get('risk_point', '') for peer in peers],
    }


def build_support_snapshot(item: dict, theme_context: dict) -> dict:
    evidence = item.get('evidence') or []
    path_ids = item.get('path_ids') or []
    sources = item.get('sources') or []
    missing_groups = item.get('missing_groups') or []
    ambiguity_hits = item.get('ambiguity_hits') or []
    coverage_ratio = float(item.get('coverage_ratio') or 0)

    return {
        'has_risk_level': bool(item.get('risk_level')),
        'has_reason': bool((item.get('reason') or '').strip()),
        'has_suggestion': bool((item.get('suggestion') or '').strip()),
        'has_real_legal_basis': has_real_legal_basis(item.get('legal_basis', '')),
        'has_evidence': bool(evidence),
        'path_count': len(path_ids),
        'source_count': len(sources),
        'coverage_ratio': coverage_ratio,
        'missing_group_count': len(missing_groups),
        'ambiguity_count': len(ambiguity_hits),
        'evidence_count': len(evidence),
        'corroboration_count': theme_context['corroboration_count'],
        'highest_peer_level': theme_context['highest_peer_level'],
    }


def compute_support_score(snapshot: dict) -> int:
    score = 0
    if snapshot['has_risk_level']:
        score += 1
    if snapshot['has_reason']:
        score += 1
    if snapshot['has_suggestion']:
        score += 1
    if snapshot['has_real_legal_basis']:
        score += 2
    if snapshot['has_evidence']:
        score += 1
    if snapshot['path_count'] >= 1:
        score += 1
    if snapshot['source_count'] >= 1:
        score += 1
    if snapshot['coverage_ratio'] >= 0.5:
        score += 1
    if snapshot['corroboration_count'] >= 1:
        score += 1
    if snapshot['highest_peer_level'] >= 2:
        score += 1
    if snapshot['missing_group_count'] >= 2:
        score -= 1
    if snapshot['ambiguity_count'] >= 2:
        score -= 1
    return score


def build_status(item: dict, theme_context: dict) -> tuple[str, str, str, list[str]]:
    snapshot = build_support_snapshot(item, theme_context)
    score = compute_support_score(snapshot)
    risk_level = item.get('risk_level', '')
    next_actions: list[str] = []

    if not snapshot['has_real_legal_basis']:
        next_actions.append('补充具体法规依据')
    if not snapshot['has_evidence']:
        next_actions.append('补充原文证据片段')
    if snapshot['missing_group_count'] >= 2:
        next_actions.append('补充关键缺失要素说明')
    if snapshot['ambiguity_count'] >= 2:
        next_actions.append('收窄模糊表述并重新判断')
    if snapshot['source_count'] == 0:
        next_actions.append('补充法条映射来源')
    if snapshot['corroboration_count'] >= 1:
        next_actions.append('结合同主题命中项统一整改')

    if risk_level == '高风险':
        if score >= 8:
            status = '自动复核后维持高风险'
            decision = '维持'
        elif snapshot['has_real_legal_basis'] and snapshot['has_evidence']:
            status = '自动复核后暂维持高风险'
            decision = '暂维持'
        else:
            status = '自动复核后高风险待补依据'
            decision = '待补依据'
    elif risk_level == '中风险':
        if score >= 8:
            status = '自动复核后维持中风险（多规则印证）'
            decision = '维持'
        elif score >= 6:
            status = '自动复核后维持中风险'
            decision = '维持'
        elif score >= 5:
            status = '自动复核后中风险待补说明'
            decision = '待补说明'
        else:
            status = '自动复核后中风险待补证据'
            decision = '待补证据'
    else:
        status = '未触发'
        decision = '未触发'

    notes = [
        f"触发原因：{risk_level}项进入自动复核",
        f"主题：{theme_context['theme_name']}",
        f"支持分：{score}",
        f"命中路径数：{snapshot['path_count']}",
        f"证据片段数：{snapshot['evidence_count']}",
        f"法条来源数：{snapshot['source_count']}",
        f"缺失要素数：{snapshot['missing_group_count']}",
        f"模糊表述数：{snapshot['ambiguity_count']}",
        f"同主题印证项：{snapshot['corroboration_count']}",
    ]
    if theme_context['peer_risk_points']:
        notes.append('同主题关联：' + '、'.join(theme_context['peer_risk_points']))
    if next_actions:
        notes.append('下一步：' + '、'.join(dict.fromkeys(next_actions)))
    else:
        notes.append('当前支持信息较完整，可直接保留当前风险判断')

    return status, '；'.join(notes), decision, list(dict.fromkeys(next_actions))


def build_queue_entry(item: dict, decision: str, next_actions: list[str], theme_context: dict) -> dict:
    level = item.get('risk_level', '')
    priority = 'P1' if level == '高风险' else 'P2'
    if theme_context['corroboration_count'] >= 2 and priority == 'P2':
        priority = 'P1'
    return {
        'priority': priority,
        'theme_name': theme_context['theme_name'],
        'risk_point': item.get('risk_point', ''),
        'risk_level': level,
        'auto_recheck_status': item.get('auto_recheck_status', ''),
        'decision': decision,
        'gap_summary': {
            'missing_group_count': len(item.get('missing_groups') or []),
            'ambiguity_count': len(item.get('ambiguity_hits') or []),
            'evidence_count': len(item.get('evidence') or []),
            'source_count': len(item.get('sources') or []),
            'corroboration_count': theme_context['corroboration_count'],
        },
        'related_risk_points': theme_context['peer_risk_points'],
        'next_actions': next_actions,
    }


def build_cluster_summary(all_items: list[dict], theme_index: dict[str, dict]) -> list[dict]:
    clusters: dict[str, dict] = {}
    for item in all_items:
        theme = theme_index.get(item.get('risk_point', ''), {'id': 'ungrouped', 'name': '未归类主题'})
        cluster = clusters.setdefault(theme['id'], {
            'theme_id': theme['id'],
            'theme_name': theme['name'],
            'item_count': 0,
            'high_risk_count': 0,
            'medium_risk_count': 0,
            'advisory_count': 0,
            'risk_points': [],
        })
        cluster['item_count'] += 1
        level = item.get('risk_level', '无')
        if level == '高风险':
            cluster['high_risk_count'] += 1
        elif level == '中风险':
            cluster['medium_risk_count'] += 1
        elif level == '建议优化':
            cluster['advisory_count'] += 1
        cluster['risk_points'].append(item.get('risk_point', ''))

    output = list(clusters.values())
    output.sort(key=lambda x: (x['high_risk_count'], x['medium_risk_count'], x['advisory_count']), reverse=True)
    return output


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--queue-output', default='')
    parser.add_argument('--cluster-output', default='')
    parser.add_argument('--theme-config', default=str(DEFAULT_THEME_CONFIG))
    args = parser.parse_args()

    report = load_json(Path(args.report))
    theme_index = build_theme_index(load_json(Path(args.theme_config)))
    all_items = report.get('items', [])

    triggered = 0
    maintain = 0
    watch = 0
    queue = []

    for item in all_items:
        theme_context = build_theme_context(item, all_items, theme_index)
        item['theme_name'] = theme_context['theme_name']
        should_recheck = item.get('auto_recheck', False) or item.get('risk_level') in TRIGGER_LEVELS
        item['auto_recheck'] = should_recheck
        if should_recheck:
            triggered += 1
            status, notes, decision, next_actions = build_status(item, theme_context)
            item['auto_recheck_status'] = status
            item['auto_recheck_notes'] = notes
            item['auto_recheck_decision'] = decision
            item['corroboration_count'] = theme_context['corroboration_count']
            item['related_risk_points'] = theme_context['peer_risk_points']
            if decision in {'维持', '暂维持'}:
                maintain += 1
            else:
                watch += 1
            queue.append(build_queue_entry(item, decision, next_actions, theme_context))
        else:
            item['auto_recheck_status'] = '未触发'
            item['auto_recheck_notes'] = '当前风险等级未触发自动复核。'
            item['auto_recheck_decision'] = '未触发'
            item['corroboration_count'] = theme_context['corroboration_count']
            item['related_risk_points'] = theme_context['peer_risk_points']

    report['auto_recheck_triggered'] = triggered > 0
    report['auto_recheck_summary'] = f'触发 {triggered} 项，维持判断 {maintain} 项，仍需补充支持信息 {watch} 项。'
    report['auto_recheck_stats'] = {
        'triggered': triggered,
        'maintained': maintain,
        'need_more_support': watch,
    }
    report['risk_clusters'] = build_cluster_summary(all_items, theme_index)

    Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')

    if args.queue_output:
        queue_payload = {
            'document_name': report.get('document_name', ''),
            'queue_count': len(queue),
            'queue': queue,
        }
        Path(args.queue_output).write_text(json.dumps(queue_payload, ensure_ascii=False, indent=2), encoding='utf-8')

    if args.cluster_output:
        cluster_payload = {
            'document_name': report.get('document_name', ''),
            'cluster_count': len(report['risk_clusters']),
            'clusters': report['risk_clusters'],
        }
        Path(args.cluster_output).write_text(json.dumps(cluster_payload, ensure_ascii=False, indent=2), encoding='utf-8')

    print(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
