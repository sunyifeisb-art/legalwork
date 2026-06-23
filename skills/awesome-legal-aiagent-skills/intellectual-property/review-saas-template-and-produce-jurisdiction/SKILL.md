---
name: review-saas-template-jurisdiction-conformance
task_id: intellectual-property/review-saas-template-and-produce-jurisdiction
description: Reviewing a SaaS subscription agreement template against jurisdiction-specific legal requirements and operational documents to produce a conformance memorandum identifying required changes and pre-launch actions across the relevant target markets.
activates_for: [planner, solver, checker]
---

# Skill: Review SaaS Template and Produce Jurisdiction-Specific Conformance Memorandum

## 1. Subject-matter triage (only if applicable)

- Treat this as a jurisdiction-by-jurisdiction conformance review of a SaaS subscription template, not a generic commercial contract review.
- First identify the target markets and the source set for each: template, local law materials, operational/data-flow documents, insurance summaries, and any launch-readiness materials.
- If the record shows more than one jurisdiction, analyze each jurisdiction separately and do not blend local requirements into a single combined pass.
- If a jurisdiction is not supported by source materials, state that the review is provisional for that jurisdiction and limit conclusions to documented assumptions.

## 2. Failure modes the skill is correcting

- Reviewing the template for commercial readability without testing it against mandatory local requirements.
- Missing mismatches between contractual promises and the actual data-processing, hosting, support, or transfer architecture.
- Treating privacy, consumer, and regulatory obligations as optional boilerplate rather than launch gating issues.
- Failing to separate pre-launch fixes from post-launch operating obligations.
- Overstating compliance where the source materials do not support the required contractual mechanics or operational controls.
- Summarizing issues without tying each one to the governing authority, the affected clause, and the business consequence.

## 3. Legal frameworks / domain conventions that apply

- Apply the mandatory local contract, consumer, e-commerce, privacy, and marketing rules for each target jurisdiction, with special attention to subscription disclosures, renewal mechanics, cancellation rights, and language requirements.
- Apply the local data protection regime to the template’s collection, use, disclosure, storage, transfer, security, retention, and breach-response commitments.
- Check any localization, cross-border transfer, or local representative/registration requirement against the operational documents to confirm the company can actually perform what the template promises.
- Where the source materials reference insurer-imposed controls, check the template for alignment with required security, notice, indemnity, limitation, or incident-response language.
- Use controlling authority by name and section for each legal proposition, and do not state a compliance conclusion without anchoring it to the governing rule.
- If multiple source documents speak to the same obligation, cite the clause, schedule, policy, or operational document that interacts with the issue.

## 4. Analytical scaffolds

1. Enumerate the jurisdictions in scope and the controlling source materials for each.
2. For each jurisdiction, identify the mandatory topics the template must cover and the operational commitments that must be supportable in practice.
3. Review the template clause by clause against those requirements and mark each gap, mismatch, or overcommitment.
4. Cross-check the data-flow / operational architecture against the template’s data-handling and security language to confirm the promise is feasible.
5. Cross-check any insurer or launch-control materials for additional contractual or operational conditions.
6. For each issue, state:
   - the affected template provision,
   - the controlling authority,
   - the nature of the gap or mismatch,
   - the downstream consequence,
   - the timing classification.
7. Prioritize launch-blocking items before launch-readiness items, and separate true legal defects from drafting refinements.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Build the memorandum in jurisdictional blocks so the reader can see what changes are required in Germany, Brazil, and Japan separately if all are in scope.
- Within each jurisdiction, order issues from launch-critical to operationally corrective.
- Distinguish between:
  - pre-launch mandatory changes,
  - pre-launch recommended changes,
  - post-launch compliance obligations.
- If a requirement depends on an operational milestone, tie the recommendation to that milestone rather than to a generic future date.
- If the source set contains multiple versions of the template or supporting documents, state which version controls for each issue.

## 6. Output structure conventions

- Produce a conformance memorandum in conventional legal memo form, with a short executive summary followed by jurisdiction-by-jurisdiction analysis.
- Use a consistent severity scale defined once at the start, and apply it uniformly to every issue entry.
- For each issue entry, include the following elements in plain language:
  - severity,
  - jurisdiction,
  - template section or operational topic,
  - governing authority,
  - source document cross-reference,
  - required change,
  - business consequence,
  - timing classification.
- Keep the issue discussion concrete: identify the exact clause theme to be revised and the reason the current formulation is deficient or risky.
- End with a Recommended Actions section that assigns each action to a role and a timing anchor.
- End with a pre-launch checklist that separates legal, operational, and launch-readiness items.
- If the task requires a file deliverable, ensure the named memorandum file is the operative deliverable and contains the full analysis, not a placeholder or summary.
