---
name: compare-closing-documents-against-closing-checklist
task_id: capital-markets/compare-closing-documents-against-closing-checklist
description: Checklist-driven closing review where the baseline misses document-level defects such as mismatched parties, stale certificates, identifier mismatches, and similar defects, and fails to produce a severity-tiered remediation plan.
activates_for: [planner, solver, checker]
---

# Skill: Compare Closing Documents Against Closing Checklist — Discrepancy Report

## 1. Subject-matter triage

- This is a document-to-checklist comparison, not a general legal memo.
- Treat the master checklist as the governing benchmark and compare each closing document against it item by item.
- If the source set contains multiple entities, multiple drafts, or multiple dated certificates, enumerate them up front and analyze each separately rather than collapsing them into a single pass.
- If only one item or one entity is actually in scope, say so affirmatively and explain why.

## 2. Failure modes the skill is correcting

- Confirms documents exist without checking whether the substance matches the transaction terms, including parties, dates, identifiers, and referenced amounts.
- Treats all defects alike instead of separating closing blockers from items that can be corrected before signing or cured after closing.
- Misses stale certificates and other freshness defects.
- Fails to trace a discrepancy across related documents, so the same defect is not seen in context.
- Omits a concrete next step, leaving the closing team with diagnosis but no remediation path.
- States severity in casual terms without using a consistent ordinal scale.

## 3. Legal frameworks / domain conventions that apply

- Use the checklist as the controlling source for required deliverables, party alignment, execution status, and any freshness windows.
- Apply standard debt-offering closing conventions for items such as executed governing agreement, officer and secretary certifications, legal opinions, comfort materials, good standing evidence, settlement eligibility evidence, and authentication-related deliverables.
- Treat authentication provisions as transaction-critical where the notes or comparable securities require a trustee or similar agent to authenticate before issuance.
- Treat mismatch in a required identifier, settlement code, or similar transaction key as a settlement-risk defect.
- Treat an undated, stale, or otherwise outdated certificate as defective if it falls outside the checklist’s required recency window or market-standard freshness period.
- Treat missing coverage for a required obligor, guarantor, issuer, or other party as a substantive gap even if other party documents are present.
- Treat execution-date inconsistencies across signature pages or counterparts as an administrative defect unless the checklist elevates them to a blocker.
- When a legal proposition is stated, anchor it to the governing document, checklist item, or standard closing convention relied on in the source set; do not state conclusions in free-floating form.

## 4. Analytical scaffolds

- Start by mapping the checklist into a working inventory of required items, then compare each source document against that inventory.
- For each item, check four things in sequence:
  1. presence;
  2. correct party/recipient/executor;
  3. conformity of referenced terms, identifiers, dates, and other transaction-specific data;
  4. timeliness or freshness.
- If a discrepancy is found, record:
  - the checklist reference or equivalent item label;
  - the document name;
  - the exact nature of the mismatch;
  - why it matters operationally in the closing process;
  - the corrective action required.
- Do not stop at description. Each issue entry should close the loop by tying the defect to a source term or threshold, another related document or checklist item, and the downstream consequence for the closing.
- Classify every issue using one ordinal severity scale defined once at the top of the report and applied consistently throughout.
- Use the severity scale to separate blockers from pre-closing corrections and administrative defects.
- If checklist numbering is incomplete or an apparent item is missing from the document set, flag the omission as a process issue rather than silently skipping it.
- When multiple documents interact, cross-check them against each other so that a defect visible in one document is not treated as isolated if it affects another.
- Summarize the defects by severity at the end so the closing team can triage quickly.

## 5. Vertical / structural / temporal relationships

- Check whether the same entity appears under different names, abbreviations, or roles across documents.
- Check whether dates are internally consistent across the execution pages, certificates, opinions, and settlement materials.
- Check whether one document’s stated amount, identifier, or party list is repeated accurately in the corresponding companion document.
- Check whether any freshness date is measured against the correct milestone date in the checklist or transaction timeline.
- Check whether a later replacement or bringdown document supersedes an earlier version and whether the earlier version should be treated as stale rather than merely duplicative.

## 6. Output structure conventions

- Produce a discrepancy report organized by severity first, then by checklist item within each severity group.
- Define the severity scale once at the top in ordinal terms such as Critical, High, Medium, and Low, and use it consistently.
- For each entry, include:
  - checklist item reference;
  - document name;
  - discrepancy description;
  - severity;
  - why it matters;
  - required corrective action.
- Keep the report factual and comparison-driven; do not editorialize beyond the corrective implication.
- Include a concise summary table or count by severity so the closing team can see the distribution of issues at a glance.
- End with an explicit Recommended Actions section that assigns each next step to a role named in the source materials or an obvious closing participant and ties it to the relevant closing milestone or deadline.
- If the deliverable is to be written to a file, ensure the primary report file exists and is non-empty before considering the task complete.
