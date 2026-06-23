---
name: triage-service-provider-contracts-for-cpra-compliance-gaps
task_id: data-privacy-cybersecurity/triage-service-provider-contracts-for-cpra-compliance-gaps
description: CPRA service-provider contract triage requires first classifying each counterparty by its correct legal relationship before assessing contractual adequacy, and using any existing internal gap analysis and enforcement materials as framing inputs that set triage priorities.
activates_for: [planner, solver, checker]
---

# Skill: Triage Service Provider Contracts for CPRA Compliance Gaps — Regulatory Compliance Report

## 1. Subject-matter triage

This is a multi-contract review. First identify the complete set of vendor agreements and supporting materials in scope, then enumerate each counterparty before analysis so no contract is implicitly skipped or treated as representative.

Use any existing internal gap analysis as a baseline, not an endpoint: note what it already covers, what it misses, and where the present review confirms, refines, or departs from it. Use any enforcement bulletin or similar guidance to prioritize issues that map to current enforcement focus.

Classify each counterparty before testing clauses. The same contract language can be adequate or inadequate depending on whether the counterparty is a service provider, contractor, third party, or data broker.

## 2. Failure modes the skill is correcting

- Reviewing all vendors under one generic privacy checklist instead of classifying the relationship first, which leads to wrong legal tests and wrong triage.
- Treating a clause as compliant because it exists, even if the language is incomplete, outdated, or missing the function the CPRA requires.
- Ignoring the internal gap analysis, duplicating it mechanically, or contradicting it without explaining why the current review differs.
- Failing to elevate issues that align with enforcement priorities, which understates practical risk.
- Collapsing multiple vendors into a single finding rather than giving each agreement its own classification, gaps, severity, and action.
- Stating conclusions without tying them to the governing CPRA concept or other controlling authority that supports the classification or obligation.
- Producing diagnosis without a concrete next step, owner, and timing anchor.

## 3. Legal frameworks / domain conventions that apply

- CPRA service provider analysis: assess whether the counterparty processes personal information on behalf of a business under a written contract that limits use, retention, and disclosure to the permitted business purpose.
- CPRA contractor analysis: assess whether the arrangement fits the contractor category and whether the contract contains the role-appropriate purpose and use restrictions.
- Third-party analysis: if the vendor is not a service provider or contractor, treat the disclosure arrangement as potentially implicating sale or sharing concepts and flag possible misclassification.
- Data broker analysis: determine whether the counterparty is in the business of selling or sharing personal information about consumers with whom it lacks a direct relationship.
- Enforcement guidance: treat the bulletin or comparable material as a risk-weighting input, not as a substitute for legal classification.
- Contract adequacy: a provision must do the work the statute contemplates; boilerplate, partial, or legacy formulations may be insufficient even if superficially similar.
- Controlling authority: cite the relevant CPRA statutory or regulatory provision, and any other governing authority needed to support the classification or obligation stated in the report.

## 4. Analytical scaffolds

- Build a vendor inventory first. For each agreement, record the counterparty, the role asserted in the paper, the role suggested by the operative facts, and whether the source set contains enough information to classify confidently.
- For each vendor, run the same sequence:
  1. classify the relationship;
  2. identify the contract terms required for that classification;
  3. test whether the terms are present and substantively adequate;
  4. compare against the internal gap analysis;
  5. adjust priority using enforcement guidance;
  6. assign a severity rating and a recommended action.
- When the documents support a different classification than the contract label, treat that as a threshold issue, not a drafting tweak.
- When a clause is present but outdated or incomplete, distinguish between a true missing-term problem and a drafting sufficiency problem.
- For service provider and contractor arrangements, confirm the contract limits retention, use, and disclosure to the permitted purpose and does not permit secondary use outside the services relationship.
- For any vendor that appears misclassified, assess the downstream CPRA consequence of the classification error, including whether the disclosure may instead implicate sale or sharing analysis.
- Where supporting materials conflict, reconcile them explicitly rather than blending them into one summary view.
- Apply a uniform ordinal severity scale across all entries and define it once at the top of the report; keep the rationale one line per issue.
- If the scope includes multiple agreements, give each its own row or section so the triage result is traceable vendor by vendor.

## 5. Vertical / structural / temporal relationships

The review should track how the documents relate vertically and over time: whether the main agreement, addenda, data processing terms, policies, and supporting memoranda are consistent with one another; whether later documents supersede earlier language; and whether the internal gap analysis predates or postdates the operative contract package.

If a later amendment, order form, schedule, or policy changes the privacy allocation, treat it as potentially controlling and note the sequence. If the supporting materials reflect an earlier state of the deal, identify that temporal mismatch.

Where the source set includes both contract text and internal analysis, use the analysis to anchor triage but do not let it override the operative language without explanation.

## 6. Output structure conventions

- Write a regulatory compliance triage report in a conventional memo/report shape, not a checklist dump.
- Open with scope, source set reviewed, the severity scale, and a short overall posture.
- Include a concise summary of the highest-priority issues, especially any items elevated by enforcement guidance.
- Then provide vendor-by-vendor findings. For each vendor, include:
  - classification;
  - the key contractual gaps or adequacy concerns;
  - severity;
  - the controlling authority or CPRA concept supporting the conclusion;
  - recommended action.
- Preserve traceability to the internal gap analysis by noting where it is confirmed, narrowed, expanded, or contradicted.
- End with a Recommended Actions section that assigns an imperative action, a responsible role, and a timing anchor tied to the review or remediation cycle.
- Use the requested filename for the deliverable.
