---
name: compare-borrower-disclosures-against-due-diligence-findings
task_id: banking-finance/compare-borrower-disclosures-against-due-diligence-findings
description: Cross-references borrower disclosure schedules against due diligence findings and produces a severity-organized discrepancy memorandum with issue-specific recommended next steps for each gap.
activates_for: [planner, solver, checker]
---

# Skill: Borrower Disclosure vs. Due Diligence Discrepancy Memorandum

## 1. Subject-matter triage

- Treat the source set as a comparison exercise across multiple document types: borrower disclosure schedules, diligence report, officer’s certificate, and environmental assessment.
- Before drafting, enumerate the disclosure schedules, diligence findings, and any distinct contracts, assets, permits, liens, or environmental items actually in scope so each discrepancy is tied to a specific source item.
- Separate true discrepancies from:
  - omissions,
  - affirmative misstatements,
  - mischaracterizations,
  - stale certifications,
  - incomplete diligence,
  - and cross-document inconsistencies.
- If only one item is implicated on a topic, say so explicitly; do not imply a broader population that is not in the sources.
- Where the transaction structure appears to interact with consent or transfer restrictions, treat that as a separate issue even if the discrepancy is otherwise about disclosure completeness.
- For environmental matters, distinguish operational issues from regulatory exposure and closing-condition risk.

## 2. Failure modes the skill is correcting

- Treating every mismatch as a generic omission instead of classifying whether the borrower affirmatively said something that diligence contradicts.
- Missing encumbrances because only one diligence stream was checked, or failing to reconcile multiple search outputs against the disclosure schedules.
- Overlooking whether financing structure, change of control, assignment, or similar mechanics could trigger consent, termination, acceleration, or other rights in key contracts.
- Identifying a gap without stating why it matters to the transaction, including the legal, operational, or closing consequence.
- Failing to distinguish pre-closing fixes from items that can be documented or cured after closing.
- Forgetting to pair each issue with a concrete follow-up step and a responsible actor.
- Drafting a list of observations instead of a severity-ranked memorandum.
- Using conclusory labels without tying them to the controlling document language or recognized legal framework.

## 3. Legal frameworks / domain conventions that apply

- Compare disclosures against the full diligence record, not just one report; reconcile across schedules, certificates, searches, and assessments.
- For liens and encumbrances, verify priority and perfection across available search sources and confirm whether any undisclosed security interest, judgment lien, tax lien, or similar claim affects closing mechanics.
- For material contracts, check whether any consent, termination, anti-assignment, change-of-control, or similar provision is implicated by the contemplated financing structure.
- For debt or creditor rights, assess whether demand, acceleration, or similar features affect repayment priority, liquidity, or closing risk.
- For licenses, permits, certifications, and approvals, evaluate expiration, renewal timing, and whether any condition must be satisfied before closing.
- For environmental findings, identify whether the issue is disclosure-only, remediation-related, permit-related, or a closing-condition problem.
- When a legal proposition is stated, anchor it to the controlling authority or governing document language reflected in the source set; do not state a legal conclusion without naming the rule, clause, statute, regulation, or similar authority that supports it.
- Treat every material discrepancy as requiring a procedural response: corrected disclosure, consent request, covenant, closing condition, indemnity, bringdown certificate, or similar protection.

## 4. Analytical scaffolds

1. Build a source map first:
   - disclosure schedule by topic,
   - diligence finding by topic,
   - officer’s certificate statement,
   - environmental assessment point,
   - and any cross-referenced document language that interacts with the issue.
2. For each discrepancy, identify the error type:
   - omission,
   - affirmative misstatement,
   - mischaracterization,
   - stale certification,
   - or other material inconsistency.
3. For each issue, close the analysis with:
   - the scale or magnitude drawn from the source documents,
   - the document or clause that intersects with it,
   - and the transaction consequence for the client.
4. For every contract- or relationship-based issue, ask whether the contemplated financing, transfer, or control arrangement could trigger consent, default, termination, or similar rights.
5. For every lien, encumbrance, or creditor-rights issue, compare all available diligence sources and assess whether the disclosure is incomplete, inconsistent, or insufficiently prioritized.
6. For each environmental issue, identify whether it is a factual discrepancy, an unresolved compliance matter, or a closing-risk item requiring remediation or further diligence.
7. Assign each issue an ordinal severity level and use that same scale consistently throughout the memorandum.
8. End each issue with a concrete next step that matches the risk level and the transaction stage.

## 5. Vertical / structural / temporal relationships

- Organize the memorandum from highest severity to lowest severity.
- Define the severity scale once at the outset and use only those labels throughout.
- Split issues into pre-closing matters and items that may be addressed post-closing, but keep both under the same severity framework.
- If an issue depends on timing, state the relevant deadline, closing milestone, expiration date, or bringdown point from the source documents.
- Where one disclosure item affects multiple diligence findings, make the hierarchy explicit so the reader can see the primary issue and any dependent issue beneath it.
- Where multiple findings point to the same disclosure gap, consolidate them into one entry only if the downstream consequence is the same; otherwise separate them by consequence.

## 6. Output structure conventions

- Produce a formal discrepancy memorandum in conventional memo form, not a raw issue log.
- Use a short heading that identifies the transaction and the purpose of the memorandum.
- Begin with a legend defining the severity scale.
- Include an executive summary that distinguishes critical pre-closing issues from lower-severity matters.
- Present the body in severity order, with each entry containing:
  - the disclosure source section or schedule item,
  - the corroborating diligence source,
  - the error type,
  - the severity label,
  - the consequence,
  - and the recommended next step.
- Include a compact comparison table that maps discrepancy to severity and action, then follow with narrative analysis for each item.
- For each issue, make the recommended action imperative, assign it to a responsible role if identifiable from the source set, and tie it to a transaction milestone or deadline.
- If a source item is not implicated, do not manufacture an issue; state that no discrepancy was identified for that topic when useful.
- Conclude with a brief Recommended Actions section that prioritizes immediate follow-up, cure steps, and any items requiring closing conditions or post-closing monitoring.
- Name the output file as `discrepancy-memorandum.docx`.
