---
name: analyze-arbitration-agreement-markup-analysis
task_id: arbitration-international-dispute-resolution/analyze-arbitration-agreement-markup-analysis
description: Evaluates a counterparty redline of an arbitration agreement provision-by-provision and for interaction effects, playbook compliance, and enforcement consequences.
activates_for: [planner, solver, checker]
---

# Skill: Arbitration Agreement Markup Analysis

## 1. Subject-matter triage
- Treat the original draft, counterparty redline, SPA excerpts, and internal playbook as a single integrated source set.
- Identify whether the clause is stand-alone or nested inside a broader transaction agreement, because arbitration language can be displaced or qualified by surrounding governing-law, remedies, and integration language.
- If only one party’s markup is in scope, say so; if multiple clauses, variants, or alternative formulations are in scope, enumerate them before analysis and track each separately.

## 2. Failure modes the skill is correcting
- Reviews each markup in isolation and misses compounding effects across the clause set.
- Understates how integration language can shift governing law away from the parent agreement for arbitration-related issues.
- Fails to spot enforcement gaps created when court-ordered interim relief is replaced with arbitral interim measures alone.
- Treats appellate/arbitral-review language as procedural only, without weighing loss of finality and added time.
- Does not distinguish playbook positions by tier, so the client cannot see what is non-negotiable versus negotiable.
- Uses vague risk language without tying each issue to a legal authority, a source-document cross-reference, and a concrete transaction consequence.

## 3. Legal frameworks / domain conventions that apply
- Playbooks typically classify positions as Required, Preferred, and Fallback; every recommendation should identify the applicable tier and whether the markup is acceptable, rejectable, or acceptable only with a counter.
- FAA versus state arbitration acts: the Federal Arbitration Act and related state arbitration statutes may differ on confirmation, vacatur, and enforcement; any shift away from FAA-based framing should be tested for enforceability and preemption consequences.
- Interim relief: court injunctions and temporary restraining orders are materially different from arbitral interim measures because court relief can be directly enforced, while arbitral relief may require additional court proceedings.
- Finality and appeal: internal arbitral appeal or review mechanisms can materially extend dispute duration and weaken the finality of the award.
- Integration clause effects: broad integration language can override or narrow the parent agreement’s governing-law allocation for arbitration-related questions.
- Personal and affiliate scope: extending obligations to personnel, officers, or affiliates without consent raises enforceability and agency issues.
- Cost allocation: loser-pays and similar fee-shifting rules must be assessed for economic leverage, not just formal symmetry.
- Apply controlling authority for each proposition relied on, including the FAA, relevant state arbitration act provisions, arbitration-rule authority if cited in the source set, and any governing-law or remedy provisions identified in the transaction documents.

## 4. Analytical scaffolds
- Define a uniform severity scale at the outset, such as Critical / High / Medium / Low, and apply it consistently.
- Walk every substantive change in the redline and for each one state:
  - what changed,
  - the severity,
  - the legal or drafting risk,
  - the source-document cross-reference that changes the analysis,
  - the downstream consequence for the client,
  - and the recommendation.
- When a change is described as acceptable only if narrowed, specify the exact tightening needed and the playbook tier it is trying to preserve.
- For each legal conclusion, anchor it to the controlling authority or document provision supporting it; do not rely on conclusion-only shorthand.
- Where the source set contains transaction figures, durations, or other thresholds, use those figures to show scale; do not invent or preload numbers.
- Separate pure drafting issues from negotiation posture: a clause may be legally workable but still inconsistent with the playbook.
- Classify each issue as accept, reject, or counterpropose, and explain why in one tight paragraph.

## 5. Vertical / structural / temporal relationships
- Analyze how the arbitration clause interacts vertically with the SPA, the governing-law clause, the remedies clause, the integration clause, and any dispute-resolution carveout.
- Test whether a proposed arbitration provision would displace parent-agreement law only for arbitration matters or more broadly for substantive rights.
- Examine temporal sequencing where the clause changes the path from dispute notice to interim relief to final award to enforcement, and flag any step that becomes slower, less certain, or duplicative.
- Treat interim-relief language and appellate/review language as time-sensitive because each can change leverage before the merits are resolved.
- When multiple changes together create a risk greater than either alone, analyze the combined effect explicitly rather than as separate isolated comments.

## 6. Output structure conventions
- Produce a senior-associate style analytical memo suitable for a Word document.
- Open with an executive summary that states the most material changes, overall posture, and the recommended negotiating stance.
- Include a legend for the severity scale near the top.
- Organize the body by clause or change, using a clear issue-by-issue format.
- For each issue, include the change, severity, risk explanation, interacting provisions, controlling authority, recommended response, and playbook tier.
- Include a dedicated interaction-effects section for compounding issues.
- Include a playbook compliance section that isolates each Red Line or tier-mismatch issue.
- End with a Recommended Actions block that assigns the next step to the relevant role named in the source documents and ties it to the transaction timetable or another concrete urgency anchor.
- Use robust markup conventions in the analysis whenever quoting or tracking changes from the redline; make each substantive change legible in plain text as well as in styled formatting.
- If the task requires a markup or counter-markup response in addition to analysis, preserve every substantive change with explicit textual markers so the result survives export to .docx or plain text.
