---
name: analyze-counterparty-markup-of-investment-advisory-agreement
task_id: funds-asset-management/analyze-counterparty-markup-of-investment-advisory-agreement
description: Review a counterparty's redline of an investment advisory agreement against the adviser's standard form, negotiation playbook, and Form ADV to produce a classified redline review memorandum with issue-by-issue counter-positions for each proposed change.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Investment Advisory Agreement

## 1. Subject-matter triage
- Confirm the source set: standard form, counterparty redline, internal playbook, and any disclosure filing or related schedule that bears on the advisory terms.
- Identify whether the counterparty is a public entity, a regulated account, or a bespoke client type, because that changes the treatment of confidentiality, audit, fees, and governing law.
- Identify all clauses that can vary by client profile or asset base before analyzing economics or risk.
- If the agreement includes multiple fee schedules, performance-fee constructs, account types, or term alternatives, enumerate them first and analyze each separately.
- Treat the requested memo as an issue-spotting and negotiation document, not a rewrite of the agreement itself.

## 2. Failure modes the skill is correcting
- Accepting proposed fee-tier reductions without testing the economics at each breakpoint and against the governing fee schedule.
- Missing the regulatory consequences of performance-fee structures, including whether the client class and measurement period support the proposed economics under the Investment Advisers Act framework.
- Treating confidentiality carve-outs, audit rights, and public-records language as boilerplate when they can force disclosure of proprietary process, trade data, or internal materials.
- Overlooking conflicts between a fiduciary-duty representation and an exculpation or limitation-of-liability clause.
- Missing the interaction between soft-dollar or research-commission language and the adviser’s disclosure posture.
- Failing to assess termination timing, wind-down burden, or key-person mechanics against operational reality.
- Treating liquidated damages, indemnities, and fee-shifting as ordinary when the stated remedy may be punitive, one-sided, or inconsistent with actual loss.
- Giving a narrative critique without a clear counter-position, severity, or downstream consequence for each issue.
- Relying on visual redline markup alone, which can be lost on export or in plain-text review.
- Stating conclusions without tying them to the controlling legal or regulatory authority.

## 3. Legal frameworks / domain conventions that apply
- Investment adviser contracting is constrained by the Investment Advisers Act of 1940, fiduciary-duty principles, and the adviser’s disclosure and conflict-management posture.
- Performance fees must be analyzed against the client eligibility and measurement-period rules applicable to advisory compensation structures.
- Liability, indemnity, and disclaimer language must be read against anti-fraud principles and the adviser’s fiduciary obligations.
- Public-client confidentiality provisions may be constrained by open-records or compelled-disclosure regimes; notice-and-protection mechanics are commonly required.
- Audit rights should be narrowed to reasonable scope, frequency, notice, and confidentiality protections.
- Governing law, venue, and attorneys’ fees provisions should be tested for symmetry and litigation leverage.
- If the source documents identify a controlling rule, regulation, or disclosure item, use that authority in the memo; do not speak in generalities where a named authority is available.

## 4. Analytical scaffolds
1. Read the playbook first and map each proposed change to the applicable red, yellow, or acceptable treatment before drafting commentary.
2. Build an issue list in source-document order, then reorder only if needed for practical negotiation sequencing.
3. For each proposed change, state:
   - the clause or concept changed,
   - the severity classification,
   - the governing authority or playbook principle,
   - the financial, regulatory, operational, or litigation consequence,
   - the recommended counter-position.
4. For every fee change, identify the relevant tier or alternative pricing path, test the impact at a representative account size, and describe whether the change is a minor concession or a material economics shift.
5. For performance-fee changes, test whether the measurement period and related conditions are sufficient to distinguish skill from short-term luck.
6. For confidentiality, public-records, and disclosure carve-outs, assess whether the draft would require release of proprietary strategy, models, trading information, or internal records; if so, require notice, limitation, and protective-order mechanics where appropriate.
7. For any key-person, personnel, or designation-based clause, confirm whether the identified person or role still exists and whether the clause needs a cure, substitution, or fallback.
8. For commission, research, or brokerage-related language, compare the markup to the adviser’s disclosed practice and identify any inconsistency that would need disclosure follow-through.
9. For damages, liquidated damages, indemnity, or fee-shifting provisions, test whether the remedy is tied to actual, documentable loss and whether the allocation is bilateral and commercially defensible.
10. For termination and wind-down provisions, check notice timing, transition assistance, and service continuity risk.
11. For audit rights, flag open-ended access, unlimited frequency, or intrusive scope as an operational and confidentiality issue.
12. For governing law and forum clauses, assess whether the proposed jurisdiction or venue changes litigation posture or removes familiar investment-management precedent.
13. Mark each issue with an explicit severity level from the scale defined in this skill, and keep that severity consistent across the memo.

## 5. Vertical / structural / temporal relationships
- Use the negotiation playbook as the controlling classification layer; the legal analysis informs why an item is red, yellow, or acceptable, but the playbook decides the label.
- Read confidentiality, audit, and public-records provisions together when the counterparty is a public entity, because the clauses interact as a disclosure package.
- Read fee schedules, side letters, and disclosure filings together, because pricing concessions may require disclosure consistency.
- Read fiduciary-duty language, limitation-of-liability language, indemnity, and damages provisions together, because one clause can undermine another.
- Read termination notice, transition assistance, and service-delivery provisions together, because the practical risk is temporal rather than isolated.
- If a clause depends on another schedule, exhibit, or defined term, state that linkage explicitly in the issue analysis.

## 6. Output structure conventions
- Produce a single redline review memorandum suitable for conversion to `redline-review-memorandum.docx`.
- Open with a short executive summary that states the overall posture, the most material issues, and the likely negotiation stance.
- Define the severity scale once at the top and apply it uniformly, using ordinal labels such as Critical, High, Medium, and Low.
- Then provide an issue-by-issue analysis in practical negotiation order.
- For each issue, use a consistent mini-structure:
  - Issue / clause
  - Severity
  - What changed
  - Why it matters
  - Authority / playbook basis
  - Cross-reference to related provisions or documents
  - Consequence for the adviser or client
  - Recommended counter-position
- Include robust redline notation in the discussion where useful, using plain-text markers that survive conversion, such as [DELETED: ...], [INSERTED: ...], and [REPLACED: old → new], with a short rationale when describing the proposed revision.
- Do not rely on styling alone to convey deletions or insertions.
- Quantify fee-related issues wherever the source documents permit, but do not invent economics not shown in the record.
- End with a concise Recommended Actions block that assigns the next step to the responsible role and ties it to the relevant negotiation or closing milestone.
- Keep the memo substantive and issue-driven; avoid repeating the same point in multiple sections.
