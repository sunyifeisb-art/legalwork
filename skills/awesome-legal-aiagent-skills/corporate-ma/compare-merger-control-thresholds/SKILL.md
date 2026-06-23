---
name: compare-merger-control-thresholds
task_id: corporate-ma/compare-merger-control-thresholds
description: Guides multi-jurisdictional merger control threshold analysis by comparing transaction facts against each jurisdiction’s applicable filing tests, identifying turnover-based and deal-value-based thresholds where relevant, checking closing-condition coverage, and flagging potentially stale reference data.
activates_for: [planner, solver, checker]
---

# Skill: Compare Merger Control Thresholds

## 2. Failure modes the skill is correcting

- Reaching filing conclusions without showing how the parties’ revenues, assets, presence, or deal value compare to each jurisdiction’s threshold components.
- Treating one jurisdiction’s test as representative when the guide uses different tests, different party-level metrics, or alternative/nexus-based triggers.
- Missing deal-value-based thresholds that operate alongside or instead of turnover-based tests.
- Failing to tie a filing obligation to the SPA’s closing conditions and then overlooking a regulatory-gap drafting issue.
- Ignoring horizontal overlaps or other competition signals that can lengthen review and distort the closing timeline.
- Using stale exchange rates, publication dates, or source figures without flagging the data risk.
- Stating a filing conclusion without citing the governing test or authority the conclusion rests on.

## 3. Legal frameworks / domain conventions that apply

- Identify the governing merger-control test for each jurisdiction: turnover, assets, deal value, local nexus, market share, or a combination, and determine whether the components are cumulative or alternative.
- Apply party-level thresholds where the jurisdiction measures each acquirer, each target, or both, rather than the transaction as a whole.
- Treat domestic-nexus requirements as distinct from headline size tests; a transaction can exceed size thresholds yet still fail jurisdictional nexus.
- Recognize supplemental deal-value thresholds that capture high-value acquisitions of low-turnover targets.
- Account for pre-notification, consultation, standstill, and waiting-period rules that affect timing even when the filing trigger is straightforward.
- Tie any competition-risk observation to the controlling merger-control standard or procedural rule, including the authority identified in the threshold guide or generally recognized practice authority for the jurisdiction.
- Where the source materials identify overlaps or concentration indicators, treat them as review-risk inputs, not as filing tests unless the guide expressly says otherwise.

## 4. Analytical scaffolds

1. Enumerate every jurisdiction covered by the threshold guide before analysis.
2. For each jurisdiction, identify the applicable filing trigger(s) and whether the test is independent, cumulative, or alternative.
3. Compare the parties’ relevant metrics to each threshold component and show the comparison in plain arithmetic or threshold-form, without inventing unstated calculations.
4. State the filing outcome using the status labels supplied by the source materials; if no label is given, use a clear yes/no/uncertain formulation.
5. Note any pre-notification, waiting-period, consultation, or standstill feature that affects timing.
6. Identify any horizontal overlap, competitive adjacency, or other review-risk signal reflected in the source set, and explain whether it could extend the review path.
7. Flag any stale or potentially stale source item, especially exchange rates, effective dates, publication dates, and revenue snapshots.

For cross-cutting analysis:
- Compare all required filings against the SPA’s regulatory closing conditions and identify any jurisdictional filing that is missing from the condition list.
- Build the filing sequence around the longest-lead jurisdiction and any mandatory pre-notification step.
- If multiple parties, entities, or time periods are relevant, analyze each item separately rather than collapsing them into one proxy.
- If only one jurisdiction, one party set, or one timing path is in scope, say so explicitly and explain why.

## 5. Vertical / structural / temporal relationships

- Jurisdiction-by-jurisdiction analysis should remain vertically aligned: test, data used, threshold comparison, filing conclusion, timing effect, and review-risk note.
- If the transaction involves more than one target, acquirer, or filing lane, preserve the temporal order in which approvals must be obtained or filings must be made.
- Treat the SPA as a separate reference layer: filings required under the guide must be checked against closing-condition language, and any mismatch should be surfaced as a drafting gap.
- Distinguish immediate filing obligations from longer-review jurisdictions so the memo identifies the regulatory critical path.

## 6. Output structure conventions

- Draft a merger-control assessment memo in conventional memo form with:
  - a short executive takeaway,
  - a jurisdiction-by-jurisdiction analysis section,
  - a closing-conditions gap section,
  - a review-risk / overlap section,
  - a recommended timeline section,
  - and a short action-oriented conclusion.
- Use a uniform severity label for any issue-style observations, with a simple ordinal scale defined once at the outset and applied consistently.
- Include the governing authority or rule for each filing conclusion or procedural point as named in the source materials or in recognized merger-control practice.
- Keep the analysis self-contained and source-tethered; do not introduce parties, counterparties, or deal facts not contained in the threshold guide.
- End with a Recommended Actions block that assigns an imperative action, the responsible role, and a timing anchor tied to signing, launch of filings, pre-notification, or closing.
- If the guide contains potentially stale exchange rates, source dates, or publication dates, surface them in a brief footnote or source note section.
