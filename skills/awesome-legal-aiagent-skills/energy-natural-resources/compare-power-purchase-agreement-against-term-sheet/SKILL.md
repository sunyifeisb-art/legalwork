---
name: compare-ppa-against-term-sheet-wind
task_id: energy-natural-resources/compare-power-purchase-agreement-against-term-sheet
description: Guides a term-sheet-to-executed-agreement comparison by classifying each deviation as favorable or adverse, identifying internal inconsistencies, distinguishing authorized from unexplained changes, and recommending specific corrective actions for each deviation.
activates_for: [planner, solver, checker]
---

# Skill: Compare Power Purchase Agreement Against Term Sheet — Deviation Report

## 1. Subject-matter triage
- Treat the executed PPA, binding term sheet, negotiation summary, and tax equity checklist as a single comparison set.
- Identify whether there is one governing commercial package or multiple versions by date; if multiple versions exist, compare against the latest binding version first and note earlier versions only where they explain an authorized change.
- If the deliverable is to a file, ensure the primary report is drafted completely and saved first; do not let a summary replace the report.

## 2. Failure modes the skill is correcting
- Deviations are identified but not classified from the client’s perspective, so the report fails to show which changes are favorable, adverse, or neutral.
- Agreed changes and unauthorized changes are blended together, so the reader cannot tell whether a deviation was negotiated, accidental, or unresolved.
- Internal contradictions inside the executed PPA are missed, especially where body text conflicts with pricing, curtailment, liquidated damages, or exhibit mechanics.
- Issues are described abstractly without tying them to the operative figure, clause interaction, and business consequence that make them actionable.
- Tax equity closing risks are noted generally but not mapped to the checklist items that govern close readiness.
- Recommendations are stated as observations instead of instructions with an owner and timing anchor.

## 3. Legal frameworks / domain conventions that apply
- Compare the executed PPA against the binding term sheet provision-by-provision; every material term in the term sheet should be traced to the corresponding PPA provision or exhibit.
- Classify each deviation as favorable, adverse, or neutral from the client’s perspective, and state whether the deviation is authorized by the negotiation record or remains unexplained.
- Use document hierarchy to identify whether the body or an exhibit controls where the PPA contains conflicting pricing, escalation, curtailment, or LD mechanics; if hierarchy does not resolve the conflict cleanly, flag amendment risk rather than assuming resolution.
- Treat reductions in seller compensation for curtailment, tighter performance thresholds, lower force majeure protection, longer cure burdens, broader indemnities, or expanded buyer discretion as adverse unless the source documents show the client accepted the change.
- Treat more seller-protective economics or more forgiving operational mechanics as favorable, but still note whether the favorable change is authorized or merely accidental.
- For tax equity and renewable-project closing analysis, cross-check assignment, financing, collateral, change-of-control, member-rights, tax matters, and related restrictions against the checklist and applicable project-company diligence requirements.
- Cite the controlling document source for each proposition used in the analysis: the binding term sheet, executed PPA, negotiation summary, tax equity checklist, or other governing source set.

## 4. Analytical scaffolds
- Read the term sheet and negotiation summary first, then extract all material commercial and risk terms before reviewing the executed PPA.
- Build the comparison issue by issue:
  1. identify the term sheet position;
  2. locate the matching PPA clause or exhibit;
  3. state the deviation precisely;
  4. classify the deviation as favorable, adverse, or neutral;
  5. confirm whether the change is authorized, explained, or unexplained;
  6. measure the issue against the operative figure, period, cap, threshold, or other source-document scale;
  7. cross-reference any related clause, schedule, or exhibit that affects the same topic;
  8. state the downstream consequence for close, economics, operations, enforceability, or tax equity diligence;
  9. assign a concrete corrective action.
- Run an independent internal-consistency pass after the term-sheet comparison to catch body-to-exhibit conflicts, duplicate definitions, mismatched formulas, and schedule language that changes deal economics.
- Treat every unexplained deviation as a closing item until it is confirmed with the counterparty or fixed by amendment.
- When a source document gives a specific deadline, milestone, or sign-off dependency, use it in the recommendation; otherwise tie the recommendation to the next transactional milestone.

## 5. Vertical / structural / temporal relationships
- Price, escalation, and settlement mechanics can compound over the project term; a small drafting shift may create a materially different revenue path once applied across the full contract life.
- Curtailment compensation, notice windows, and deemed-energy concepts can interact: a narrower compensation trigger or shorter notice period may reduce recoverable revenue even if the headline price is unchanged.
- Force majeure, termination, and default provisions interact with cure rights and outside dates; shortening one protection may accelerate loss of the contract or impair financing certainty.
- Performance guarantees, LD caps, and milestone dates can interact with construction and COD risk; a tighter threshold may be manageable alone but adverse when paired with reduced schedule float.
- Assignment, lien, and financing restrictions can affect both operability and tax equity eligibility; a term that looks procedural may still impair close readiness if it limits investor or lender rights.

## 6. Output structure conventions
- Begin with a short methodology note stating the source set reviewed and the comparison standard used.
- Include a severity scale defined once at the top, and apply it uniformly to every issue entry.
- Organize the body as a comparison table or issue list with one row per deviation, using conventional columns such as:
  - Issue
  - Term sheet position
  - Executed PPA position
  - Severity
  - Favorable / adverse / neutral
  - Authorized / unexplained
  - Cross-reference
  - Close risk / consequence
  - Recommended action
- Include a separate internal inconsistencies section for conflicts within the executed PPA itself.
- Include a separate tax equity / close-readiness section tied to the checklist, noting only the items that bear on financial close risk.
- End with a concise Recommended Actions block that uses imperative verbs, identifies the responsible role from the source materials where possible, and ties each action to the relevant milestone or deadline.
- Conclude with a compact summary table listing the deviation, governing source, directional impact, authorization status, and required action.
