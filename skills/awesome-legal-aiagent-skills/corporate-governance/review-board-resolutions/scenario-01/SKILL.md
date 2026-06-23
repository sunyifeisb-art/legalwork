---
name: review-board-resolutions-scenario-01
task_id: corporate-governance/review-board-resolutions/scenario-01
description: Agents review board resolutions resolution-by-resolution and cross-check each action against the governing charter, bylaws, and any applicable investor or voting agreements; confirm committee membership requirements, interested-director procedure, option-pricing tax consequences, stockholder consent rights for indebtedness, board composition requirements, notice requirements, and any other procedural condition that may affect validity.
activates_for: [planner, solver, checker]
---

# Skill: Review Board Resolutions — Comprehensive Governance Issues Report

## 1. Subject-matter triage (only if applicable)

- Treat the review as a document-by-document governance audit of board and committee actions, with emphasis on whether each authorization is valid under the charter, bylaws, stockholder agreements, investor rights provisions, and any adopted committee charter or consent framework.
- If the source set includes multiple resolutions, analyze each resolution separately before synthesizing; do not merge distinct corporate actions into a single pass.
- If only one board action is in scope, state that expressly and analyze it against every potentially controlling governance source in the record.

## 2. Failure modes the skill is correcting

- Baseline reviews resolutions in isolation and misses that a charter, bylaw, voting agreement, or investor rights document may impose a separate approval condition, seat allocation rule, or notice requirement.
- Baseline identifies a committee change without confirming actual independence under the applicable listing standard or committee charter, leaving the committee non-compliant after the purported cure.
- Baseline flags an option grant issue as a pricing or incentive-qualification problem without separately analyzing tax consequences that can arise from a discounted grant.
- Baseline treats board approval as sufficient for indebtedness or other reserved actions even when the governing documents require stockholder or preferred-holder consent.
- Baseline overlooks a vacant, expired, or improperly filled board seat that independently undermines required board composition.
- Baseline spots a procedural defect but does not identify the available waiver, ratification, or other cure path.
- Baseline describes a concern without tying it to the governing authority, the interacting document, and the downstream consequence.

## 3. Legal frameworks / domain conventions that apply

- **Governing authority hierarchy:** Start with the certificate of incorporation, then bylaws, then any stockholder, voting, investor rights, or committee documents that impose additional conditions; use the controlling document for the action at issue.
- **Committee independence:** Exchange listing standards and committee charters typically require actual independence, not merely the absence of a disclosed conflict. Confirm each member’s status against the relevant standard before treating a membership change as curative.
- **Interested-director actions:** Where a director has a material interest in a transaction or compensation decision, evaluate the applicable cleansing path under corporate law, including informed approval by disinterested directors or stockholders, or substantive fairness review under the controlling statute and case law.
- **Option grants and tax treatment:** Below-market option pricing may defeat favorable incentive treatment and may separately implicate deferred-compensation consequences under the applicable tax rules. Treat those as distinct analyses.
- **Reserved financing or leverage actions:** Charter or contractual consent rights often require preferred-holder, investor, or other stockholder approval for indebtedness, guarantees, or analogous leverage actions. Board approval alone is not enough if the reserved-right trigger is met.
- **Board composition:** Required board seats, designated directors, class rights, and quorum mechanics must be checked against the current composition and election history. A vacancy or misallocated seat can be a standalone governance defect.
- **Notice and waiver:** Meeting notice defects should be tested against any written waiver or unanimous consent mechanism available under the bylaws or applicable corporate law.
- **Aggregate threshold analysis:** If authority turns on a threshold, examine whether related expenditures or commitments must be aggregated under the governing text rather than tested one-by-one.

## 4. Analytical scaffolds

- **Source-document crosswalk first:** Identify the controlling provisions in the charter, bylaws, and any investor or voting agreement before assessing the resolutions.
- **Issue-by-issue analysis:** For each issue, identify the action, the governing rule, the defect or risk, the relevant interaction with another document, and the practical consequence.
- **Severity tagging:** Apply one consistent ordinal severity scale across the report, such as Critical, High, Medium, and Low, and use it for every issue.
- **Authority citation:** State the rule supporting each conclusion by naming the controlling authority or doctrine, including section-level citations where available.
- **Resolution-specific cure analysis:** For each defect, identify whether the issue is curable by waiver, ratification, re-approval, supplemental disclosure, reconstitution, or stockholder consent, and note the timing dependency if one exists.
- **Cross-document interaction check:** Compare each resolution against any provision that could override, condition, or supplement the board’s authority, including committee charters and side agreements.
- **Board-composition verification:** Reconcile the current board roster against required seats, designated classes, and any director appointment rights before concluding that a resolution was properly adopted.
- **Multiple-item discipline:** If several board actions are under review, run the same analytical sequence for each action and give each one its own entry in the final report.

## 5. Vertical / structural / temporal relationships (only if applicable)

- **Effectiveness sequencing:** Distinguish board approval from full effectiveness where stockholder consent, preferred-holder approval, or post-approval ratification is required.
- **Cure timing:** If the document set indicates a notice waiver, ratification, or consent deadline, tie the recommended cure to that milestone rather than speaking in abstract terms.
- **Dependency ordering:** If one defect can be cured only after another action occurs, present the dependency explicitly so the reader can follow the sequence.

## 6. Output structure conventions

- Produce a comprehensive governance issues report organized by conventional governance categories, such as board composition, committee independence, compensation, equity grants, indebtedness and capital uses, notice and procedural defects, and residual issues.
- Open with a summary table listing each issue once, with severity, category, brief description, governing authority, and recommended action.
- For each category, include:
  - severity,
  - the governing provision or doctrine,
  - a concise description of the deficiency or risk,
  - the interacting document or approval right that affects it,
  - the downstream consequence,
  - and a concrete remediation step.
- Keep each issue entry self-contained and written so it can stand alone in a board or counsel review.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible role, and anchors each step to a transaction, meeting, filing, or consent milestone reflected in the source set.
- Use file-ready language suitable for a DOCX issues report, not a legal memo with heavy argumentation.
