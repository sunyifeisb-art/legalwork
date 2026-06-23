---
name: extract-key-compliance-obligations-from-new-state-data-privacy-regulations
task_id: data-privacy-cybersecurity/extract-key-compliance-obligations-from-new-state-data-privacy-regulations
description: State privacy regulation obligation extraction fails when the agent does not apply each statute's applicability thresholds to the company's actual data profile and does not map extracted obligations against existing compliance gaps evidenced by the company's own documents.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Compliance Obligations from New State Data Privacy Regulations — Obligation Matrix

## 1. Subject-matter triage

Treat this as a multi-statute applicability-and-gap analysis, not a generic checklist. Read each state statute first to confirm the threshold test, effective date, cure period, and any scoped exemptions, then test those requirements against the company’s actual data profile and operating footprint before extracting obligations.

Enumerate the statutes in scope before analysis, and for each one determine whether it applies, on what basis, and from which date. If a statute does not apply, say so and exclude its obligations except to note any residual monitoring or future-trigger issues.

## 2. Failure modes the skill is correcting

- Extracting every duty from every statute without first testing applicability, which produces an overinclusive matrix.
- Summarizing duties in the abstract without comparing them to the company’s current privacy policy, DPA template, notices, security materials, and internal compliance memo.
- Collapsing distinct statutory regimes into one blended “privacy obligations” bucket and losing differences in scope, thresholds, and stringency.
- Treating the engagement scope as a substitute for statutory applicability rather than checking the company’s data profile against the law.
- Failing to assign a consistent severity level, which makes the gap analysis unusable for prioritization.
- Identifying gaps without naming the controlling statutory provision or other authority supporting the obligation.
- Omitting action-oriented remediation, so the deliverable reads like an issue list instead of a compliance plan.

## 3. Legal frameworks / domain conventions that apply

- State privacy statutes generally turn on a threshold inquiry, then impose obligations in categories such as notice, consumer rights, opt-out handling, sensitive data, processor terms, data protection assessments, security, and enforcement exposure.
- Applicability analysis should be tied to the statute’s threshold language, exclusions, and effective-date structure, then measured against the company’s collection, use, sharing, processing volume, and business model as reflected in the source materials.
- A gap matrix should compare each applicable obligation against the company’s current posture and classify it as compliant, partial, non-compliant, or unclear.
- Severity should be stated on a uniform ordinal scale defined once at the top of the deliverable and used consistently for every entry.
- Risk should reflect legal exposure, operational impact, and implementation difficulty, with timing adjusted for effective dates, cure periods, and any sequencing dependencies.
- Every legal conclusion should be anchored to the controlling statute or regulation, and where the source materials identify a provision or authority, cite it as written there.

## 4. Analytical scaffolds

- For each statute:
  - State the threshold test.
  - Compare the threshold to the company’s documented data profile.
  - State whether the statute applies and why.
  - Note any effective-date or cure-period implications.
- For each applicable statute, extract obligations by conventional category:
  - consumer rights and request handling;
  - transparency, notices, and disclosures;
  - contracts with processors or service providers;
  - assessments, audits, or risk reviews;
  - security and governance;
  - sensitive data or profiling limits;
  - enforcement and internal accountability.
- For each obligation, cross-reference the company’s existing materials and assign posture:
  - compliant;
  - partial;
  - non-compliant;
  - unclear / evidence needed.
- For each gap, include:
  - the controlling legal basis;
  - the current-company evidence point;
  - the consequence of the gap;
  - the remediation step.
- Where statutes overlap, identify whether one statute’s stricter requirement would satisfy another’s baseline requirement, but keep each law’s analysis distinct.
- Use the most conservative reading where applicability is uncertain, and flag uncertainty explicitly rather than smoothing it over.
- Build a phased remediation path that prioritizes legal urgency, implementation lead time, and dependencies on policy, contract, or system changes.

## 5. Vertical / structural / temporal relationships

- Sequence matters: confirm applicability first, then obligation extraction, then gap assessment, then risk ranking, then remediation.
- Effective dates, grace periods, and cure windows should drive timing; obligations already in force merit faster action than future-dated obligations, even if implementation is complex.
- If the source set contains a companywide policy and a more specific operating document, treat the specific document as the better indicator of actual practice, but reconcile both when they conflict.
- If the engagement scope appears narrower than the statutes or the company’s footprint, flag the mismatch as a scoping risk.
- Preserve statute-by-statute distinctions while also showing where a single control can close multiple gaps.

## 6. Output structure conventions

- Open with a short executive summary stating which statutes apply, the basis for applicability, and the overall severity mix.
- Define the severity scale once at the top and use it uniformly.
- Include a statute-by-statute applicability table before the obligation matrix if it helps show the threshold analysis cleanly.
- Use a matrix format with rows for obligation categories and columns for each applicable statute, current posture, severity, and remediation recommendation.
- For each row, cite the controlling statute or provision and reference the relevant company document(s) used to assess posture.
- Include a concise remediation roadmap with actions sequenced by urgency and dependency.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible role from the source materials where possible, and ties each action to a deadline, effective date, or other timing anchor.
- Name the deliverable exactly as instructed: `compliance-obligation-matrix.docx`.
