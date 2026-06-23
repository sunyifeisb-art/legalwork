---
name: ecvc-draft-arcoi
task_id: emerging-companies-venture-capital/draft-amended-and-restated-certificate-of-incorporation
description: Drafting an amended and restated certificate of incorporation for a venture financing requires reconciling overlapping protective provisions across equity classes, keeping drag-along thresholds consistent with the voting framework, verifying authorized-share sufficiency, and applying current corporate exculpation standards.
activates_for: [planner, solver, checker]
---

# Skill: Draft Amended and Restated Certificate of Incorporation

## 1. Subject-matter triage

- Treat the charter as the primary deliverable and draft it first; use any note, summary, or appendix only as a secondary work product after the charter text is complete and non-empty.
- Identify whether the transaction is a true restatement, an amendment-and-restatement, or a clean restatement with substantive changes; preserve legacy terms only where the source set requires them.
- Map the source package into the operative inputs that control the charter: existing charter, term sheet, board actions, capitalization table, waiver or consent documents, and investor comments.
- If the source set contains multiple versions or marked-up drafts, enumerate them and identify which source controls each disputed point before drafting.

## 2. Failure modes the skill is correcting

- Authorized common shares may be set without first testing whether they cover founders, employees, conversion, reserves, warrants, and an appropriate buffer.
- Class rights may be copied forward from prior drafts without reconciling liquidation, conversion, voting, dividend, redemption, and anti-dilution mechanics across all series.
- Protective provisions may overlap or diverge in threshold, class participation, or approval mechanics, leaving uncertain which holders must consent.
- Drag-along mechanics may be drafted with a voting threshold that does not match the stockholder voting architecture elsewhere in the charter.
- Redemption language may be drafted too broadly if it is not cabined to funds legally available for redemption under the governing statute.
- Exculpation and indemnification language may lag current Delaware standards if officer protection is omitted or misstated.
- Cross-document inconsistencies may be left unresolved in the body of the charter rather than surfaced and resolved in a drafting appendix.
- Investor comments may be incorporated selectively, creating internal contradictions between definitions, class designations, and closing mechanics.

## 3. Legal frameworks / domain conventions that apply

- Delaware General Corporation Law governs charter amendments, class designations, voting mechanics, redemption limits, and exculpation; draft against the current statute and conform the charter text to it.
- If the charter includes preferred stock, each series should state its liquidation preference, conversion rights, dividends, voting rights, protective provisions, redemption terms, and optional protections in a consistent internal structure.
- Anti-dilution provisions should use a defined weighted-average framework with clear carve-outs, adjustments, and defined terms that align across all preferred classes.
- If a pay-to-play construct is used, draft it as an automatic conversion or reclassification mechanism that leaves the resulting shadow class with no rights superior to common stock.
- Protective provisions should be allocated so that actions requiring separate class approval, class-majority approval, or combined approval are distinguishable and not redundant.
- Drag-along provisions should track the stockholder voting basis used elsewhere in the charter so enforcement is not dependent on an unstated interpretation.
- Redemption rights, if any, should be expressly limited by available funds and any other statutory precondition required for payment.
- Exculpation should reflect current Delaware authority for both directors and officers, and should be written to match the statute rather than legacy market shorthand.
- Any legal proposition stated in drafting notes or commentary should be supported by the governing authority, statute, or recognized corporate-law convention.

## 4. Analytical scaffolds

- Start by reconciling the source set into a single control table: document, date, clause area, and whether it governs by hierarchy, later-in-time update, or express override.
- For each equity class, draft the charter provisions in the same order so omissions are visible: designation, powers, preferences, rights, limitations, conversion, dividends, voting, protective provisions, and redemption.
- Before writing the authorized-share section, confirm the capital stack can accommodate current issuances, reserved issuances, conversion coverage, and planned financing securities without undercounting.
- If multiple preferred classes exist, compare each class’s veto rights and consent thresholds action-by-action, then decide whether the charter should require separate class votes, voting together, or a hierarchy of approvals.
- Where anti-dilution appears, align the defined formulas, issuance exceptions, and reclassification mechanics so the adjustment language does not vary by series unless intentionally different.
- Where a pay-to-play or conversion feature appears, test the triggering event, the automatic effect, and the resulting rights package against the rest of the preferred terms.
- Where a drag-along clause appears, tie the selling threshold to the same voting denomination used for general stockholder approval or explain the departure in the drafting notes.
- Where redemption appears, add the statutory limiting language and ensure no other provision implies an unconditional cash obligation.
- Where exculpation appears, include both director and officer coverage if the governing framework permits and the source documents do not narrow it.
- For each inconsistency, draft the operative fix in the charter and capture the source conflict and resolution in the appendix rather than in a separate memo.

## 5. Vertical / structural / temporal relationships

- Preserve hierarchy: charter provisions control over term sheet language once adopted, but the drafting should preserve any source-specific limitation that the board or investors expressly conditioned.
- Resolve vertical conflicts in this order: statute, charter mechanics, board approvals, investor consent language, then stylistic preferences from comments.
- Keep temporal sequencing clear: pre-closing authorization, closing issuance, post-closing rights, and future triggering events should not be blended into one clause.
- If the source materials contain both closing-time terms and post-closing governance terms, separate them so the charter does not embed a future covenant as if it were an immediate corporate action.
- When a feature depends on later financing events or future ownership percentages, state the trigger, the measuring date, and the operative consequence with no ambiguity.

## 6. Output structure conventions

- Produce a complete Delaware-style second amended and restated certificate of incorporation suitable for execution and filing.
- Use standard charter architecture with clear article and section sequencing, and define terms once before using them consistently.
- Keep the operative charter text clean; place reconciliation notes in a drafting-notes appendix rather than inside core provisions unless a disclosure-style note is necessary.
- Include a concise appendix identifying each material inter-document inconsistency, the source documents involved, the issue created, and the resolution adopted in the draft.
- Include an authorized-share reconciliation note or appendix entry showing the logic used to size the share reserve without exposing unnecessary arithmetic detail.
- When multiple sources differ on a point, state which source control was adopted and why, in drafting terms rather than in argumentative prose.
- Keep the final product file-oriented and self-contained so it can be delivered directly as `second-amended-restated-coi.docx`.
