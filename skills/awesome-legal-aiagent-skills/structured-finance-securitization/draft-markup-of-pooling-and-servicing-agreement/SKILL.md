---
name: draft-markup-of-psa-rmbs
task_id: structured-finance-securitization/draft-markup-of-pooling-and-servicing-agreement
description: Preparing a seller-side markup of a draft RMBS pooling and servicing agreement where ERISA transfer restrictions for certain certificate classes, REMIC election authority, nonrecoverable advance standards, and an independent reviewer mechanism must each be addressed against a seller playbook and prior deal precedent.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Pooling and Servicing Agreement for RMBS Transaction

## 1. Subject-matter triage
- Treat the draft PSA as the primary deliverable and the issues list as secondary.
- Before anything else, identify whether the source set contains one or more operative versions of the PSA, the seller playbook, prior deal excerpts, the term sheet, and partner instructions. If multiple versions exist, enumerate them and resolve which version controls for markup.
- Map each requested change to its source: seller playbook, prior deal precedent, term sheet, or partner instruction. If a provision is missing from the draft but expected in the structure, flag it for insertion rather than only commenting on its absence.

## 2. Failure modes the skill is correcting
- Marking only the provisions expressly discussed in the playbook and missing structurally important PSA terms that should still be reviewed.
- Failing to carry through a change across all affected definitions, cross-references, exhibits, and related operative sections.
- Using comments that describe the issue without giving a practical drafting instruction.
- Omitting a robust textual redline convention that survives export into .docx and plain text.
- Providing an issues list without a clear severity ranking, a cross-reference to the affected clause or exhibit, and a concrete recommended path.
- Stating a legal conclusion without identifying the governing tax, benefits, trust, or contract authority that supports it.

## 3. Legal frameworks / domain conventions that apply
- ERISA and plan asset analysis may require transfer restrictions or legend language for affected certificate classes. Evaluate the applicable exemption framework and confirm the class-level treatment with benefits counsel.
- REMIC election provisions must allocate authority to the proper transaction party and align the trust’s tax covenants with REMIC limitations under the Internal Revenue Code and related Treasury regulations.
- Advance mechanics should distinguish scheduled advances, recovery expectations, and the point at which advances become nonrecoverable under the governing transaction standard.
- Independent reviewer mechanics should specify appointment, scope, timing, binding effect, conflicts handling, and any notice or documentation requirements.
- Servicer termination provisions should be checked for convenience termination, for-cause termination, and stress-period disruption risk.
- Liability and damages provisions should be checked for consequential, indirect, incidental, and punitive damages limitations, and for any carve-outs that the structure or precedent requires.
- Early amortization or cumulative loss triggers should be checked for the correct trigger metric, threshold expression, and cross-reference consistency across the PSA and related schedules.
- Apply governing contract interpretation principles, New York-law style drafting conventions if the draft uses them, and the tax/benefits authorities cited in the source documents where available.

## 4. Analytical scaffolds
1. Read the draft PSA against the playbook and prior deal excerpts clause by clause, not only section by section.
2. For each proposed markup, identify:
   - the source authority,
   - the drafting action needed,
   - every related clause, defined term, exhibit, or cross-reference that must move with it,
   - the transaction consequence if left unchanged.
3. If a provision is expected in the structure but absent from the draft, draft the insertion in place and add a bracketed comment explaining why the term is needed.
4. For every issue entry, include:
   - a severity label from a fixed ordinal scale stated once in the issues list,
   - a concise description of the problem,
   - the recommended markup approach,
   - the source basis,
   - the clause or document cross-reference,
   - the practical consequence.
5. For each issue, tie the analysis to the specific affected certificate class, advance bucket, trigger, tax covenant, or reviewer process if the issue is class-specific or mechanism-specific.
6. If multiple certificate classes or multiple structural alternatives are in scope, enumerate them before analysis and then assess each one separately.
7. End the issues list with an action-oriented recommendation for drafting follow-up, cleanup, or confirmation with the relevant deal team member.

## 5. Vertical / structural / temporal relationships
- ERISA transfer restrictions and class eligibility should be checked together with any legends, transfer mechanics, and offering or book-entry limitations.
- REMIC authority, tax covenants, and any pool modification or loss-recognition mechanics should be checked together for consistency.
- Nonrecoverable advance standards should be checked alongside servicing termination rights, reimbursement priorities, and cash flow waterfall provisions.
- Independent reviewer mechanics should be checked alongside notice periods, response deadlines, evidentiary submissions, and finality language.
- Cumulative loss or early amortization triggers should be checked alongside related reporting, cure, and acceleration provisions so the trigger works across time and across all references.

## 6. Output structure conventions
- Produce the redlined PSA as the primary deliverable, using both visible redline formatting and explicit textual markup that remains legible if formatting is stripped.
- For every substantive edit in the PSA, use a robust textual convention such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new], followed by a short [Rationale: …] comment.
- Make margin comments concise but specific, and attribute each comment to the playbook, prior deal, term sheet, or partner instruction that supports it.
- Ensure the redline includes operative drafting, not just commentary.
- The issues list should use an ordinal severity scale defined at the top and apply it uniformly, for example: Critical, High, Medium, Low.
- Each issue entry should be self-contained and should identify the affected provision, the basis for the recommended change, and the downstream effect on the transaction.
- The issues list should conclude with a Recommended Actions block that assigns next steps to the relevant deal owner, counsel, or transaction lead and ties each step to a practical timing anchor.
- Before finishing, confirm that `redlined-psa-gpmt-2025-1.docx` contains the operative markup and that `psa-issues-list.docx` contains the prioritized issues list with the required commentary.
