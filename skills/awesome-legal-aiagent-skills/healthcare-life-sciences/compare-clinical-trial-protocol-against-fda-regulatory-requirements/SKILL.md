---
name: hls-compare-ctp-fda-requirements
task_id: healthcare-life-sciences/compare-clinical-trial-protocol-against-fda-regulatory-requirements
description: Compares a clinical trial protocol against applicable regulatory requirements and pre-submission guidance to produce a gap analysis memorandum with citation-level support and remediation recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Clinical Trial Protocol vs. FDA Regulatory Requirements Gap Analysis

## 1. Subject-matter triage
- Treat the protocol, FDA meeting minutes, regulatory checklist, engagement letter, and internal concerns email as a single comparison set.
- Separate protocol requirements, sponsor commitments, and internal risk flags; do not merge them into one generic compliance review.
- If the source set names a specific data system, safety process, or submission milestone, assess it on its own terms rather than as a background detail.
- If only one protocol version or one governing framework is in scope, state that explicitly before analysis.

## 2. Failure modes the skill is correcting
- Safety reporting timelines are often misstated or collapsed; the standard serious adverse event window must be distinguished from any accelerated window for fatal or life-threatening unexpected reactions.
- Informed-consent defects are frequently noted without tying each missing element to the correct subsection and consequence level.
- Pre-submission guidance is commonly underused; recommendations reflected in meeting minutes must be treated as affirmative comparison points against the protocol.
- Site-to-sponsor notification language is often too vague, leaving investigator ambiguity and audit exposure.
- Electronic-record obligations are frequently missed when the protocol uses a named capture or transmission system.
- Stopping criteria are often described only at a high level; endpoint-triggered or threshold-triggered stopping rules must be checked separately from general monitoring authority.
- Internal concerns are sometimes treated as commentary only; they must be tested as potential gap evidence if they identify concrete compliance risk.

## 3. Legal frameworks / domain conventions that apply
- Use the applicable human-subjects informed-consent rules and identify each missing required element by subsection where available.
- Use the applicable adverse-event reporting rules to distinguish ordinary serious-event reporting from any expedited reporting for fatal or life-threatening unexpected reactions.
- Use the applicable FDA pre-submission meeting framework and treat recorded sponsor-agency guidance as comparison material for protocol alignment.
- Use the applicable electronic-records and signatures framework if the protocol contemplates regulated electronic data capture or transmission.
- Use the applicable sponsor/investigator obligations governing safety notification, monitoring, and study discontinuation criteria.
- Where the source documents identify a governing authority, cite that authority by name and section or part rather than describing the rule generically.
- Where multiple provisions are implicated, cite each controlling provision separately and do not collapse distinct obligations into one citation.

## 4. Analytical scaffolds
1. Start by enumerating the source documents and the protocol sections or operational topics they touch.
2. For each issue, identify the missing or misaligned element, then anchor it to the controlling rule or guidance provision.
3. Compare the protocol against every discrete recommendation, concern, or checklist item in the source set; do not stop at a single representative mismatch.
4. For each gap, state the downstream consequence for the sponsor, site, study, or submission pathway.
5. Classify each issue on a uniform ordinal severity scale defined once at the top of the memo.
6. Where a gap involves timing, specify the relevant reporting or action window and whether the protocol fails to state it, misstates it, or conflicts with another source.
7. Where a gap involves consent, list the omitted element at the subsection level and explain why the omission changes compliance risk.
8. Where a gap involves safety reporting or stopping criteria, assess both the trigger and the timing/threshold mechanics, not just the existence of a monitoring statement.
9. Where a gap involves electronic systems, identify the system by the protocol’s own terminology and confirm whether the required compliance approach is actually described.
10. Each remediation should be a concrete protocol change, not a general instruction to “comply” or “update as needed.”

## 5. Vertical / structural / temporal relationships
- Compare protocol obligations to the meeting minutes as a forward-looking commitment record, the checklist as a requirements baseline, the engagement letter as a scope/allocation document, and the internal email as a risk signal.
- If two source documents address the same topic, resolve the relationship: protocol silence, protocol inconsistency, or protocol overreach.
- Preserve temporal ordering where relevant: pre-submission guidance, protocol drafting, planned conduct, safety reporting after event occurrence, and stopping decisions during execution.
- If a protocol provision depends on an external milestone or trigger, state that relationship explicitly and analyze whether the trigger is defined with enough precision.
- Treat cross-document mismatches as gaps even if each document is internally coherent on its own.

## 6. Output structure conventions
- Write a gap analysis memorandum in conventional memo form, with a short executive summary, a severity legend, a body organized by protocol section or topic, and a prioritized remediation plan.
- Define the ordinal severity scale once and apply it uniformly to every issue.
- For each issue, include: issue statement, governing authority, severity, why it matters, and specific remediation.
- Make the issue description concrete enough to show the comparison point from the source set, but do not reproduce long internal quotations.
- Include explicit downstream consequences for each issue, such as regulatory delay, inspection risk, site confusion, consent invalidity risk, or submission fragility.
- End with a Recommended Actions block that assigns an imperative action, the responsible role, and a timing anchor tied to the submission or study milestone.
- Keep the memo organized so a reviewer can trace each gap back to a protocol section or operational topic without searching across the document.
