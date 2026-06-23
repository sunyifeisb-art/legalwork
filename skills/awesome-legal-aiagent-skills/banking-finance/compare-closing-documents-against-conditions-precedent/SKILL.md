---
name: compare-closing-documents-against-conditions-precedent
task_id: banking-finance/compare-closing-documents-against-conditions-precedent
description: Verify closing documents against the applicable conditions-precedent framework and produce a severity-organized gap memorandum with remediation steps for each deficiency.
activates_for: [planner, solver, checker]
---

# Skill: Conditions Precedent Gap Memorandum (Real Estate Secured Facility)

## 1. Subject-matter triage (only if applicable)
- Use this skill when the task is to compare a closing set against a credit agreement’s conditions precedent and report deficiencies, not to summarize the deal.
- Start by locating the controlling conditions-precedent provisions, related definitions, exhibits, schedules, and any closing checklist embedded in the source set.
- Identify whether the closing package involves multiple borrowers, guarantors, collateral items, insurance policies, tenant deliverables, or other parallel deliverables; if so, review each separately before drawing a consolidated conclusion.
- If the source set contains only one relevant obligor, asset, policy, or notice item, state that expressly and analyze only that item.

## 2. Failure modes the skill is correcting
- Treating the assignment as a narrative closing summary instead of a document-by-document compliance comparison.
- Missing an individual CP because the analysis grouped related documents too early.
- Failing to test recency where the agreement requires a current survey, appraisal, certificate, report, or good-standing evidence.
- Overlooking content defects in otherwise present documents, including signature defects, authority defects, named-party mismatches, or missing required wording.
- Ignoring cross-document dependencies, such as a condition that is satisfied only if two or more documents align.
- Failing to translate an identified deficiency into a concrete closing consequence and a practical cure path.
- Reporting issues without an ordinal severity classification.
- Recommending remediation without identifying who should act and when the cure should occur.

## 3. Legal frameworks / domain conventions that apply
- Conditions-precedent review is document-driven: compare each contractual condition to the actual closing binder item by item.
- Use the agreement’s own defined terms and references to determine scope, timing, and satisfaction standards.
- For time-sensitive deliverables, calculate elapsed time against the contractual freshness requirement and treat stale evidence as a deficiency.
- For collateral-value or leverage-related conditions, compare the stated figures against the contractual threshold or underwriting standard in the agreement.
- For title, survey, insurance, environmental, tenant, authorization, lien, and notice conditions, verify both existence and substantive conformity with the required form.
- Title and insurance conditions commonly turn on exact coverage, endorsements, named insured/loss payee language, and secured-party wording.
- Environmental conditions commonly turn on whether the report flags issues that trigger follow-on review, lender approval, or additional testing.
- Tenant-related conditions commonly turn on missing estoppels, consents, SNDA forms, or similar occupancy deliverables for required counterparties.
- Authorization conditions commonly turn on execution authority, resolutions, incumbency, certificates, and corresponding entity approvals.
- Lien-search conditions commonly turn on undisclosed liens, permitted encumbrances, and whether any exception is expressly tolerated by the agreement.
- Borrowing notice conditions commonly turn on notice timing measured against the actual request or funding date.
- Cite the controlling contractual provision or other authority relied on for each proposition; do not state a legal conclusion without naming the source rule, section, or clause.

## 4. Analytical scaffolds
1. Build the CP universe from the agreement first.
   - Extract every express condition precedent and any linked definition, exhibit, schedule, or mechanic that modifies it.
   - Do not analyze only the documents that were easiest to find; work through the full list.
2. Enumerate the deliverables and counterparties before analysis.
   - List each document category, each obligor or property, and each time-sensitive certificate or report that must be matched to a CP.
   - Then assess each item separately.
3. For each CP item, use the same three-step test.
   - Existence: is the required item present in the closing set?
   - Freshness: if timing matters, is it current enough?
   - Substantive match: does its content satisfy the agreement?
4. When a CP involves a number, threshold, or period, quantify it.
   - Measure elapsed time, compare figures to the contractual limit, or test whether the stated metric meets the required standard.
   - If the source set supports more than one calculation, run each relevant comparison rather than using a proxy.
5. Cross-reference interacting documents.
   - If a deficiency depends on another schedule, certificate, policy, notice, or approval, identify that interaction explicitly.
   - Explain why the interaction matters to CP satisfaction.
6. Classify severity using one ordinal scale defined once at the top of the memorandum.
   - Apply the same labels consistently across all issues.
   - Use severity to reflect whether the issue blocks closing, requires prompt cure, or is administrative/waivable.
7. For each issue, close the analysis with three explicit moves.
   - State the quantitative or threshold-based mismatch, if any.
   - Identify the related clause, schedule, or other document that affects the issue.
   - State the downstream consequence for the transaction or lender protections.
8. End each issue with a concrete cure.
   - Say what must be delivered, amended, reaffirmed, re-executed, or waived.
   - Tie the cure to the relevant party and the transactional milestone.
9. Keep the memorandum evidence-based.
   - Ground each issue in the source set and cite the operative agreement reference or other controlling authority used for the conclusion.

## 5. Vertical / structural / temporal relationships (only if applicable)
- Where the closing package contains multiple properties, loans, obligors, guarantors, or policies, map each CP to the specific vertical it governs before summarizing.
- Where an item’s adequacy depends on date, age, or funding timing, show the temporal relationship between the document date, request date, and closing date.
- Where one document cures or qualifies another, note that hierarchy explicitly rather than treating the materials as independent.
- Where a condition is satisfied only in combination with a later cure, distinguish between present satisfaction and post-closing cure mechanics.

## 6. Output structure conventions
- Produce a memorandum, not a checklist dump.
- Open with a short executive summary that states the overall CP posture and the aggregate count of issues by severity.
- Include a compact issue summary table near the front with columns for issue, severity, status, and brief cure path.
- Group the body by severity first, then by issue number within each severity bucket.
- For each issue, include:
  - CP requirement, with the controlling agreement reference or other cited authority
  - Document(s) reviewed
  - Deficiency or mismatch
  - Why it matters to closing or lender protection
  - Recommended remediation
- Use explicit severity labels drawn from the defined ordinal scale and apply them uniformly.
- Keep issue statements specific and document-linked; avoid generic “needs review” phrasing.
- Include a final Recommended Actions block with imperative steps, the responsible role, and a timing anchor tied to the signing, funding, or closing milestone.
- If a required document is absent, say so directly and treat absence as a substantive issue rather than a neutral omission.
- If a deficiency is curable by waiver or post-closing delivery, say that expressly and note any pre-closing condition that still remains unresolved.
