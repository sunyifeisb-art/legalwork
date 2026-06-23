---
name: review-board-resolutions-scenario-02
task_id: corporate-governance/review-board-resolutions/scenario-02
description: Agents apply the same resolution review framework as the baseline scenario while also checking compensation formulas for internal arithmetic consistency, separating any mathematical inconsistency from interested-director procedural issues, and confirming whether any transfer, offering, or issuance restrictions tied to existing equity rights have been addressed before an issuance becomes effective.
activates_for: [planner, solver, checker]
---

# Skill: Review Board Resolutions — Governance Issues Report

## 2. Failure modes the skill is correcting

- Treating a board-resolution review as a single-pass readthrough instead of a category-by-category issue spotter with severity ratings, consequences, and fixes.
- Collapsing distinct defects into one umbrella conclusion, especially where a compensation calculation error, an interested-director approval problem, and an equity-rights compliance problem arise from different source provisions.
- Missing whether all governing documents that bear on the action have been checked, including charter, bylaws, investor rights arrangements, stockholder agreements, committee charters, and any board composition provisions.
- Failing to connect each issue to the resolution text, the supporting documents, and the practical effect on effectiveness, enforceability, closing readiness, or downstream reporting.
- Flagging a problem without stating how large it is in context, what other provision it interacts with, and what the company must do to cure it.
- Treating board-seat composition as static when the documents contemplate designated seats, vacancy status, or appointment mechanics that must be tested against the current board roster.
- Missing that a resolution authorizing an issuance may be incomplete unless any notice, offer, election, waiver, or waiting period applicable to existing equity rights has been addressed.

## 3. Legal frameworks / domain conventions that apply

- Review board resolutions against the corporate charter, bylaws, board and committee authority provisions, and any incorporated governance agreements.
- Evaluate interested-director or conflicted-approval issues under the governing corporate statute and the entity’s approval mechanics, including whether the disinterested directors or stockholders approved the action in the required manner.
- For compensation approvals, separate the substantive compensation decision from any calculation error in the formula, exhibit, or attached schedule.
- If the resolution uses a formula-based bonus, incentive, or pool amount, verify internal arithmetic against the stated metric and formula before assessing the governance effect.
- If the company contemplates an equity issuance, review any preemptive right, right of first offer, participation right, notice right, election window, waiver requirement, or similar restriction in the source documents.
- Treat a board composition issue as distinct from a transaction-validity issue: a vacancy, missing designee, or exceeded seat count can be a separate governance defect even if the underlying resolution is otherwise properly approved.
- Use the controlling authority named in the source set where provided; otherwise cite the governing corporate statute, the company documents, and any generally recognized corporate-law authority supporting the proposition.

## 4. Analytical scaffolds

- Start by identifying each discrete action the board took or approved: appointment, compensation, issuance, delegation, ratification, waiver, amendment, or other operative step.
- Then map each action to the document hierarchy that authorizes it and note any internal inconsistency between the resolution, exhibits, schedules, and governing instruments.
- For each issue, apply a three-part closeout:
  - measure the issue against the relevant figure, term, threshold, seat count, or transaction scope in the source materials;
  - cross-reference the other clause, exhibit, agreement, or governance document that controls or modifies the point;
  - state the downstream consequence for the company, including effectiveness, enforceability, filing risk, tax, disclosure, litigation, or closing delay.
- When a formula appears, extract the formula, identify the underlying metric from the source materials, recompute the result, and compare it to the stated amount.
- Keep the arithmetic issue separate from any conflict-of-interest or approval defect, even if both arise in the same resolution.
- If an issuance is proposed, test whether any existing holder rights must be satisfied before closing and whether the resolution should be conditioned on notice, waiver, or expiration of an exercise period.
- If the documents create designated board seats, confirm whether each seat is occupied, reserved, or vacant based on the current roster and appointment actions.
- Where multiple resolutions, periods, classes, or classes of holders are involved, enumerate them first and analyze each against the controlling source documents rather than collapsing them into one generic pass.

## 5. Vertical / structural / temporal relationships

- Distinguish between authorization, satisfaction of conditions, and closing effectiveness; a board approval may exist before all issuance conditions are complete.
- If rights-holders must receive notice or an election period before an issuance, the issuance timeline must accommodate that sequence and any waiver timing.
- If a formula-based compensation amount is wrong, consider whether the issue was pre-payment or post-payment and whether correction, clawback, or recovery mechanics are implicated.
- If the documents require two designated directors for a series, track both seat status and any time-sensitive vacancy or replacement mechanics.
- If a resolution is conditioned on subsequent approval or notice, say so explicitly and tie the cure to the operative date or milestone.

## 6. Output structure conventions

- Produce a formal issues report suitable for a docx deliverable, organized by category rather than as a narrative memo.
- Define a uniform ordinal severity scale once near the top and apply it to every issue entry.
- Use clear category headings that fit the subject matter, such as authority and approval, board composition, compensation, equity issuance rights, and document consistency.
- For each issue entry, include:
  - a severity rating;
  - a concise issue statement;
  - the governing document or authority that controls;
  - the factual basis from the reviewed materials;
  - the consequence if not cured;
  - a remediation step written as an action.
- For formula-based compensation items, include the formula, the source metric, the recomputed amount, the stated amount, and the discrepancy; do not blur this with interested-director approval analysis.
- For equity issuance items, include the applicable participation or offering right, the required procedural steps, and whether the resolution should be conditioned on completion of those steps before effectiveness.
- For board-composition items, state which designated seat is implicated, whether it is filled or vacant, and why that matters under the governing documents.
- End with a concise Recommended Actions section that lists imperative next steps, the responsible role, and a timing anchor tied to the transaction or governance milestone.
