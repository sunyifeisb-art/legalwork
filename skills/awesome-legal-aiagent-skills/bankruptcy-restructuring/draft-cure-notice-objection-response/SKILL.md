---
name: draft-cure-notice-objection-response
task_id: bankruptcy-restructuring/draft-cure-notice-objection-response
description: Ensures a cure notice objection addresses the full assumption analysis for an executory contract, including monetary cure, compensation for actual pecuniary loss, and adequate assurance, on a line-item basis, and anticipates likely waiver or forbearance defenses.
activates_for: [planner, solver, checker]
---

# Skill: Draft Cure Notice Objection Response

## 2. Failure modes the skill is correcting

- The draft attacks the proposed cure figure but omits one or more required assumption predicates: cure of defaults, compensation for actual pecuniary loss, and adequate assurance of future performance under Bankruptcy Code section 365.
- The draft treats the cure dispute as a single-number disagreement instead of a line-item analysis tied to each invoice, charge, interest item, penalty, or other prepetition component reflected in the documents.
- The draft fails to separate prepetition cure items from postpetition obligations that may be relevant only if they relate back to a prepetition service period.
- The draft misses contract-specific hooks that independently support objection, including written waiver requirements, minimum commitment or shortfall mechanics, default interest, and other express remedy provisions.
- The draft does not anticipate the debtor’s likely argument that the objecting party waived default rights or acquiesced through conduct, silence, or forbearance.
- The draft asserts lack of adequate assurance without tying that concern to concrete facts in the record showing operational, financial, capacity, personnel, or counterparty-performance risk.
- The draft states legal conclusions without naming the controlling statutory or doctrinal authority supporting them.

## 3. Legal frameworks / domain conventions that apply

- Assumption of an executory contract under Bankruptcy Code section 365 requires cure of defaults, compensation for actual pecuniary loss from default, and adequate assurance of future performance.
- Cure analysis is document-driven: identify each outstanding prepetition invoice or charge, its date, due date, amount, and whether it was included in the debtor’s proposed cure figure.
- Contractual interest on overdue amounts may be part of cure where the agreement and applicable bankruptcy authority so provide; analyze late charges, default interest, and fee provisions separately.
- A postpetition invoice may still be relevant if it covers a prepetition service period or other prepetition obligation; do not assume its label controls.
- Anti-assignment clauses do not automatically defeat assumption or assignment in bankruptcy; analyze the general rule together with any applicable-law limitation recognized under Bankruptcy Code section 365(c) and related authority.
- Written waiver clauses matter. Informal communications, course of dealing, or failure to terminate do not necessarily waive rights where the contract requires a written waiver or written modification.
- Minimum purchase or volume commitments can create cure, damage, or contingent liability arguments depending on the contract text and governing bankruptcy treatment; preserve alternative characterizations where supported by the record.
- Adequate assurance is fact-intensive and must be linked to evidence, not boilerplate. Loss of routes, equipment, capacity, personnel, access, licensing, or other performance inputs can undermine the showing.
- Use controlling authority in the draft. Cite the Bankruptcy Code, Federal Rules, and any identified contract provisions by name and section; do not state a legal proposition without its anchor.

## 4. Analytical scaffolds

- Start by identifying the contract, the petition date, the proposed assumption motion, and the debtor’s stated cure amount.
- Build a complete prepetition obligations table from the source documents:
  - invoice or charge identifier
  - invoice or charge date
  - service or performance period
  - due date
  - amount
  - whether included in the proposed cure notice
  - dispute basis
- Confirm whether each disputed item accrued prepetition. If an item spans petition date or is billed later for earlier performance, explain that timing issue expressly.
- Analyze each omitted or understated item on its own terms, then explain how the items interact with one another and with any contract remedy clause, waiver clause, notice requirement, or interest provision.
- If the record supports it, frame shortfall or minimum-commitment exposure both as a cure-related obligation and, in the alternative, as a contingent claim or damages component.
- For adequate assurance, tie the argument to concrete record facts: financial condition, access to capital, operating continuity, management stability, performance history, substitute capacity, or any other fact showing whether future performance is likely.
- Treat waiver and forbearance as affirmative defenses to be preempted. Identify any written-waiver requirement and explain why silence, delay, or accommodation does not equal a written waiver absent an express agreement.
- If anti-assignment is implicated, analyze it in sequence: contract restriction, Bankruptcy Code overlay, then any applicable-law exception or personal-services limitation.
- Keep the objection legally grounded and practical: explain how each defect affects the amount due, the assumption motion, or the court’s ability to approve assumption.

## 5. Vertical / structural / temporal relationships

- Distinguish prepetition defaults from postpetition administrative obligations.
- Distinguish contract text that governs present cure from evidence that only bears on future performance.
- Distinguish a waiver of collection activity from a waiver of the underlying right to cure, default interest, or termination.
- Distinguish assumption approval from assignment approval where both are implicated.
- When multiple invoices, periods, or counterparties appear in the documents, enumerate them first and analyze each separately rather than using a composite estimate.
- Track chronology carefully: contract execution, amendments, default notices, forbearance communications, petition date, proposed cure notice, objection deadline, and hearing date.

## 6. Output structure conventions

- Draft a formal objection in conventional bankruptcy pleading form with caption, introduction, background, objection, and requested relief.
- Use an issue-by-issue body that follows the documents, not a purely narrative summary.
- Include a cure-dispute section with line-item treatment for each disputed invoice, charge, interest item, or other component.
- Include a separate adequate-assurance section that cites concrete record facts.
- Include a separate waiver/forbearance rebuttal section that addresses any likely debtor response before it is raised.
- Include any anti-assignment or applicable-law analysis only if the documents or contract make it relevant.
- Conclude with a clear prayer for relief requesting denial of assumption absent correction of the cure figure and adequate assurance showing, or other appropriate relief supported by the record.
- End with a signature block for objecting counsel and, if the task calls for a file, ensure the operative objection text is written to the named deliverable first and the file is complete before finishing.
