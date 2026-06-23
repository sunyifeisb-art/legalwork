---
name: identify-issues-in-security-agreement-term-loan
task_id: energy-natural-resources/identify-issues-in-security-agreement
description: Guides issue identification in a security agreement for a senior secured lender by systematically checking perfection requirements, cross-document consistency on collateral package terms, and remedies provisions.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Security Agreement — Senior Secured Lender's Perspective

## 1. Subject-matter triage

- Treat the security agreement as the core lien-creation document, but read it together with the collateral schedules, financing statements, joinders, and related credit documents before flagging any issue.
- If the source set covers more than one pledging entity, collateral class, account type, or filing path, enumerate those items first and assess each one separately rather than collapsing them into a single pass.
- If the task set is limited to a single obligor or single collateral category, state that boundary explicitly and explain why no broader comparison is needed.

## 2. Failure modes the skill is correcting

- Baseline misses cross-document inconsistencies between the security agreement and the related credit documentation, especially on collateral scope, perfection mechanics, future-entity joinder, and the scope of secured obligations.
- Baseline under-analyzes remedies provisions, including notice periods and commercially reasonable disposition language, and fails to test whether those provisions align with secured-transactions requirements.
- Baseline over-focuses on filing mechanics while missing asset-class-specific perfection steps, including control, federal office recording, and specific-description requirements.
- Baseline fails to distinguish genuine lender risk from provisions that are already handled elsewhere in the package and should not be over-flagged.

## 3. Legal frameworks / domain conventions that apply

- Filing jurisdiction: confirm that the financing statement is filed in the correct entity-formation jurisdiction for each pledgor under Article 9 of the Uniform Commercial Code; an incorrect filing location can defeat perfection.
- Control perfection: for deposit accounts and similar control-based collateral, perfection depends on control under UCC Article 9, not filing alone; check whether a control agreement is required and whether any post-closing execution timing has been set.
- Collateral scope carve-outs: read excluded-asset language against the actual operating asset base to see whether the carve-out unintentionally removes accounts, contracts, permits, IP, or other key assets from the lien.
- Commercial tort claims: under UCC Article 9, these typically require a specific description; a generic grant is often inadequate.
- Future subsidiaries: if the credit package contemplates future joinder, confirm the security agreement contains an express mechanism that matches the joinder covenant.
- Insurance: test whether lender loss-payee and additional-insured requirements are stated consistently with the insurance covenant package.
- IP perfection: for registered trademarks, patents, and copyrights, review whether federal office recording is required in addition to state filing, and whether the package reflects that step.
- Secured obligations: compare the security agreement’s secured-obligations definition against the credit documents to confirm the intended debt, hedging, letters of credit, fees, and similar obligations are included.
- Remedies: review collateral-sale notice provisions and disposition standards against UCC Article 9’s commercially reasonable sale requirements and any notice concepts reflected in the package.

## 4. Analytical scaffolds

- For each pledging entity, identify formation jurisdiction, collateral grant scope, filing location, and any entity-specific perfection step; flag any mismatch between the document set and the governing filing rule.
- For each deposit account or similar account-based asset, identify the account, the expected control arrangement, the stated execution timing, and whether the related covenant or exhibit confirms the same treatment.
- For each equity pledge, compare the pledged interest described in the security agreement with the pledge requirement in the related credit documents and flag any narrower grant.
- For each excluded-asset carve-out, compare the carve-out list against the borrower’s business model and asset inventory to identify any likely inadvertent exclusion.
- For each registered IP asset, confirm the security agreement, financing statement, and any federal recording step line up with the required perfection path.
- For each secured-obligations definition, compare the defined basket against the credit package’s economic and contingent obligations to identify any omission.
- For each remedies clause, test whether the notice period and sale standard are internally consistent and consistent with UCC Article 9 and the related loan documents.

## 5. Vertical / structural / temporal relationships

- Track whether future obligations, future collateral, and future entities are brought into the lien automatically or only after a separate action.
- Track whether post-closing deliverables are immediate, scheduled, or conditional, and whether the source documents give a clear outside date or milestone.
- Track whether the security agreement is narrower than the related credit documents at inception or whether the gap appears only after a future event such as acquisition, formation, or asset acquisition.

## 6. Output structure conventions

- Produce a prioritized issues memorandum in conventional legal-memo form.
- Open with a short severity key using an ordinal scale such as Critical / High / Medium / Low, and apply that scale consistently to every issue.
- For each issue, state: the affected provision, the legal or contractual basis, why it matters economically or transactionally for the lender, the relevant cross-document point of comparison, and a concrete fix or follow-up.
- Every issue write-up should close with the practical consequence to the client and should note the document or clause that creates the discrepancy.
- Include only real issues; confirm where the package is already consistent and do not pad with speculative points.
- End with a concise Recommended Actions section that uses imperative verbs, identifies the responsible role from the source set where available, and anchors timing to any stated deadline or, if none exists, to the next closing or post-closing milestone.
