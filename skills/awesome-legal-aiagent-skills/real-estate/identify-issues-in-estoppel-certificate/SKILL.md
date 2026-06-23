---
name: identify-issues-in-estoppel-certificate
task_id: real-estate/identify-issues-in-estoppel-certificate
description: Guides tenant-by-tenant review of estoppel certificates against lease abstracts, rent roll, and acquisition agreement requirements, identifying factual discrepancies, qualification language, and coverage gaps that affect closing conditions.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Tenant Estoppel Certificates for Office Building Acquisition

## 1. Subject-matter triage

- Treat the work as a tenant-by-tenant comparison exercise with a portfolio-level coverage check.
- Start by identifying all tenants and all estoppels in scope, then map each estoppel to the corresponding lease abstract, rent roll entry, and PSA estoppel requirement.
- If the source set includes more than one tenant or more than one estoppel date, enumerate the full set before analyzing individual issues.
- If only one tenant is in scope, say so explicitly and explain why no broader portfolio comparison is needed.

## 2. Failure modes the skill is correcting

- Baseline reviews each estoppel in isolation instead of comparing it against the lease abstract and rent roll, which hides mismatches in rent, deposit, term, or landlord obligations.
- Baseline identifies qualifications and exceptions as generic reservation language without testing whether they signal a dispute, an unperformed obligation, or a post-closing claim risk.
- Baseline overlooks side letters, amendments, or other disclosed adjustments that are not carried into the lease abstract or rent roll.
- Baseline treats coverage as a tenant-level issue only and fails to test whether the compliant estoppels satisfy the PSA closing condition as a portfolio.
- Baseline stops at discrepancy spotting and does not translate each issue into source comparison, transactional consequence, and next-step remediation.

## 3. Legal frameworks / domain conventions that apply

- In a commercial acquisition, an estoppel is used to confirm the tenant’s current lease status and to reduce later disputes over lease terms.
- The PSA may condition closing on delivery of estoppels in a required form and from tenants representing a required coverage threshold or specified tenant set.
- A nonconforming estoppel cannot usually be counted toward the closing condition if it departs from the required form or contains unacceptable qualification language.
- Lease comparison should focus on core economics and operational terms: base rent, escalations, security deposit, term, renewal rights, termination rights, concessions, allowances, landlord obligations, defaults, offsets, and known disputes.
- Tenant qualifications, “to the best of knowledge” language, or references to unresolved items must be tested for practical risk, not merely noted as stylistic caveats.
- A disclosed amendment, side letter, or modification not reflected in the abstract may indicate the abstract is stale or incomplete and may affect acquisition diligence.

## 4. Analytical scaffolds

- For each tenant, read the estoppel, lease abstract, rent roll, and PSA requirement together; compare every confirmed factual statement against the other source documents.
- Compare stated rent, deposit, term, and any allowance or concession figures against the rent roll and lease abstract; flag any mismatch and identify which source appears inconsistent.
- Check whether the estoppel contains qualifications, conditions, carveouts, or reservations; assess whether each one is merely informational or raises closing or post-closing risk.
- Test any disclosed amendment, side agreement, or tenant-specific understanding against the abstract and PSA; determine whether it is missing from the diligence record or changes the economics.
- Assess whether the estoppel is compliant enough to count toward the PSA closing condition; if not, identify what makes it nonconforming and what cure is needed.
- For each issue, state the scale or threshold it implicates, cross-reference the other source that controls or conflicts, and explain the downstream transaction consequence.
- Use a uniform ordinal severity scale for every issue, defined once at the top of the memorandum, and apply it consistently.
- End each issue entry with a concrete remediation step tied to the responsible party and transaction timing.

## 5. Vertical / structural / temporal relationships

- Portfolio coverage is a closing-condition question, not just a document-quality question; the relevant comparison is the compliant estoppel set against the PSA threshold or required tenant list.
- Lease abstract, rent roll, and estoppel certificate should be treated as interdependent records; a mismatch may reflect a stale abstract, a rent roll error, a lease amendment not captured in diligence, or a tenant statement that should be corrected.
- If the PSA or related instructions impose a deadline, condition precedent, or pre-closing cure window, place the issue in that timing context.
- If a tenant’s estoppel reveals a future-effective change, distinguish present-day inconsistency from a prospective issue that will matter at or after closing.

## 6. Output structure conventions

- Produce a memorandum, not a chart alone: begin with a short executive summary of the portfolio-level result and the most material issues.
- Include a legend for the severity scale at the outset, using clear ordinal labels.
- Organize the body by tenant, with each tenant section covering: estoppel reference, confirmed facts, discrepancies versus the lease abstract and rent roll, qualification analysis, PSA compliance impact, severity, and recommended action.
- Where the same issue appears across multiple tenants, note the pattern but still analyze each tenant separately.
- For every issue entry, include: the affected term or figure, the conflicting source, the practical consequence for closing or post-closing risk, and a recommended cure or follow-up.
- Use conventional issue-memo headings rather than a rubric-shaped list; do not mirror any hidden checklist structure.
- End with a distinct Recommended Actions section that assigns each action to a role and ties it to the closing timeline or other source deadline.
- The deliverable filename must be `estoppel-issue-memorandum.docx`.
