---
name: analyze-disclosure-schedule-markup
task_id: corporate-ma/analyze-disclosure-schedule-markup-against-merger-agreement
description: Guides gap analysis of supplemental disclosure schedules against the merger agreement's original representations, with cross-schedule consistency review, contractual-effects assessment, and identification of the buyer's response options and deadlines.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Disclosure Schedule Markup Against Merger Agreement

## 1. Subject-matter triage
- Treat the supplemental disclosure package as a multi-document comparison exercise, not a schedule-by-schedule summary.
- Identify the governing update mechanism in the merger agreement before analyzing any schedule: whether supplemental disclosures can cure, qualify, preserve, or only notice a breach.
- Determine whether the buyer has a single response window or separate deadlines by schedule, disclosure topic, or closing milestone.
- If the source set includes multiple supplemental versions or dates, enumerate them first and analyze each in sequence before drawing aggregate conclusions.

## 2. Failure modes the skill is correcting
- Reviewing each supplemental disclosure in isolation and missing stale text, superseded figures, or broken cross-references within the updated materials.
- Treating a disclosure as self-contained without comparing it to the original representation, the original schedules, and any related schedule entries elsewhere in the package.
- Failing to assess the combined effect of all supplemental items against the merger agreement’s adverse-effect standard, cure mechanics, and indemnification structure.
- Omitting the buyer’s contractual response deadline or the practical consequence of missing it.
- Describing issues without stating severity, source threshold, related provisions, and downstream transaction impact.
- Relying on conclusory legal assertions without naming the contractual provision or other controlling authority that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply
- Supplemental disclosure schedules typically function under a contractual update regime that determines whether new information amends the seller’s disclosure, preserves a breach claim, or merely provides notice.
- The original merger agreement controls the baseline; the supplemental schedules must be measured against the original representations, the related disclosure schedules, and any special disclosure exceptions.
- Internal consistency matters: updated narratives, figures, exhibits, defined terms, and cross-references should align within the same package and across related schedules.
- Buyer response rights may include objection, request for clarification, demand for renegotiation, termination, or reservation of rights; the applicable contract language controls which remedy is available and when.
- Adverse-effect analysis must be tied to the contract’s defined standard, not to a generic materiality label.
- Recovery analysis must map each issue to the applicable indemnification basket, cap, survival period, escrow, special indemnity, or exclusive-remedy provision.
- If the source documents cite a controlling contractual provision or defined term, cite it by the same name and section when stating the legal proposition.

## 4. Analytical scaffolds
1. List the governing documents and versions in order: original merger agreement, original schedules, each supplemental schedule set, and any amendment or notice letter.
2. Identify the original representation or schedule item.
3. Identify the supplemental change, update, or omission.
4. Check internal consistency within the revised schedule set: stale figures, conflicting dates, mismatched defined terms, or broken cross-references.
5. Check cross-document consistency against related schedules, the agreement text, and any overlapping disclosure items.
6. Determine whether the supplemental disclosure reflects a pre-signing inaccuracy, a post-signing development, or a mixed issue.
7. Assess the contractual effect under the update mechanism: qualified disclosure, breach preservation, cure opportunity, or claim notice only.
8. Map the issue to the recovery architecture: basket, cap, survival, escrow, special indemnity, or carve-out.
9. State the downstream consequence for the client: closing risk, renegotiation leverage, claim posture, disclosure cure, or waiver risk.
10. Identify the buyer’s response deadline and the action required before that deadline.
11. Where multiple items are in play, run the same analysis once per item and then synthesize the combined exposure.

## 5. Vertical / structural / temporal relationships
- Compare the original schedule baseline to the supplemental update, then compare the update to the rest of the disclosure package.
- Distinguish between vertical relationships in the deal stack: agreement text controls schedules, schedules control representations, and later notices control timing.
- Distinguish temporal buckets: signing-date accuracy, post-signing change, pre-closing update, and post-update response deadline.
- If one disclosure affects another schedule entry or defined term, note that interaction explicitly and explain whether the inconsistency is cosmetic, interpretive, or substantive.
- When multiple schedules touch the same subject, analyze the aggregate exposure rather than treating each schedule as a separate silo.

## 6. Output structure conventions
- Use a concise memo format with a brief executive summary, then a schedule-by-schedule gap analysis, then an aggregate exposure view, then procedural deadlines, then recommendations.
- Define a uniform severity scale once at the top and apply it consistently to every issue entry, such as Critical / High / Medium / Low.
- For each issue, include: schedule reference, original disclosure, supplemental change, consistency check, contractual effect, severity, and practical consequence.
- Every issue entry must close with three points: the relevant scale or threshold from the source documents, the related clause or schedule interaction, and the downstream consequence.
- Include a short table for aggregate exposure and a separate table for buyer response timing and next steps.
- End with an explicit Recommended Actions block using imperative verbs, a responsible role, and a timing anchor tied to the contract deadline or transaction milestone.
- If the task requires a file deliverable, ensure the substantive memo is complete and ready for export as the named document before finishing.
