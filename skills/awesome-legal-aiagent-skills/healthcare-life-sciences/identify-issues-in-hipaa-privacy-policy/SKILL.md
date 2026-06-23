---
name: hls-identify-hipaa-privacy-policy-issues
task_id: healthcare-life-sciences/identify-issues-in-hipaa-privacy-policy
description: Produces a per-document compliance gap report identifying privacy-rule deficiencies, using subsection-level citations where available, and covering common HIPAA privacy-policy topics such as marketing communications, notice of privacy practices distribution, separate confidentiality regimes for substance use disorder records, electronic-accounting obligations, business associate scope alignment, patient restriction rights, reproductive-health privacy provisions, and minimum-necessary access controls.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in HIPAA Privacy Policy

## 1. Subject-matter triage

- Treat the assignment as a document-by-document HIPAA privacy-policy review, not a generic compliance memo.
- First identify each source document and any distinct policy population, then assess each document on its own terms before synthesizing cross-document conflicts.
- If the source set contains multiple covered entities, business units, notices, or related policies, enumerate them before analysis and keep findings tied to the relevant document.

## 2. Failure modes the skill is correcting

- Issues are described at a high level without tying them to a specific policy section, controlling HIPAA provision, or concrete remediation.
- The report buries document-specific defects inside thematic buckets instead of organizing findings by source document, making implementation difficult.
- The analysis notes a deficiency but does not connect it to its operational, regulatory, or patient-facing consequence.
- The report omits a uniform severity scale, making relative risk and remediation sequencing unclear.
- The review skips adjacent or interacting documents that may create a mismatch, such as a notice, internal privacy policy, workforce access standard, or business associate arrangement.
- The analysis treats HIPAA as a single monolith and misses topic-specific overlays for marketing, notice distribution, substance use disorder confidentiality, electronic accounting, restriction rights, reproductive-health privacy, and minimum-necessary access.

## 3. Legal frameworks / domain conventions that apply

- Marketing and remunerated communications: identify communications that may fall within HIPAA’s marketing framework when they are tied to financial remuneration from an outside source, and determine whether authorization or an exception applies under the privacy rule.
- Notice of privacy practices distribution: confirm whether the policy or related notice framework addresses required distribution to affected individuals, including any updated notice obligations after acquisition or organizational change.
- Substance use disorder confidentiality: if the policy touches substance use disorder records, flag the separate confidentiality framework and its distinct consent, redisclosure, and court-order concepts.
- Electronic accounting of disclosures: assess whether the policy addresses enhanced accounting obligations for disclosures made through electronic health record systems or other electronic records.
- Business associate scope alignment: compare the protected health information categories actually processed against the stated scope of each business associate arrangement and note mismatches.
- Patient restriction rights: verify that the notice describes the individual’s right to restrict certain disclosures to health plans when the individual pays out of pocket in the relevant circumstances.
- Reproductive-health privacy protections: review whether the policy reflects current privacy protections applicable to reproductive-health information and related disclosure limits.
- Minimum necessary and role-based access: assess whether the policy states the minimum-necessary standard and role-based access principles with enough specificity to match the workforce access model described.
- Cite the controlling HIPAA provision or other governing authority for each legal proposition relied on; do not state a conclusion without naming the rule or regulation that supports it.

## 4. Analytical scaffolds

1. Organize findings by source document first; within each document, list issues in priority order.
2. For each source document, identify the relevant policy sections, then compare them against the controlling privacy rule or related authority at subsection level where possible.
3. For each issue, state:
   - the policy section or clause at issue,
   - the controlling authority,
   - the deficiency,
   - why it matters in context,
   - the recommended fix.
4. When more than one policy, notice, or related agreement bears on the same issue, cross-reference the interacting documents and explain the mismatch.
5. Where a topic is conditional, confirm whether the triggering fact is present before flagging a defect; if absent, say so briefly rather than forcing an issue.
6. For communications, notices, or permissions that depend on a specific factual trigger, identify the trigger and assess whether the policy clearly addresses it.
7. For any deficiency, include a severity assessment using a uniform ordinal scale defined once at the top of the report, and calibrate the label to remediation urgency and regulatory exposure.
8. Tie each issue to the downstream consequence for the client, such as disclosure risk, enforcement exposure, patient confusion, operational burden, or audit deficiency.
9. If the source set presents multiple covered entities, patient populations, or operational settings, analyze each one separately rather than collapsing them into a generic summary.

## 5. Vertical / structural / temporal relationships

- Identify whether a policy obligation is forward-looking, ongoing, or triggered by an event such as acquisition, service commencement, a change in data flow, or a new disclosure practice.
- Check whether a notice, authorization, consent process, access rule, or accounting procedure depends on another document or operational control; if so, analyze the hierarchy and consistency across documents.
- When a policy references a limited data scope, test whether later sections expand that scope in a way that creates an internal contradiction.
- If the policy reflects different populations or regimes over time, separate pre-change and post-change treatment rather than blending them.
- If source documents include a related agreement or operational policy, compare the vertical chain from policy statement to implementation document to ensure the actual workflow matches the written rule.

## 6. Output structure conventions

- Write a compliance gap report organized by source document, using conventional document headings rather than an issue taxonomy.
- Define the severity scale once near the top and apply it consistently to every finding.
- For each finding, use a compact row or bullet that includes:
  - policy section,
  - controlling authority,
  - gap description,
  - severity,
  - remediation recommendation.
- Keep citations specific and subsection-level where possible.
- End with a priority-ranked summary table that consolidates all findings across documents.
- End with a Recommended Actions block that assigns each action to a responsible role and a practical timing anchor tied to the document set or regulatory context.
- Use concise, implementation-oriented language; do not reproduce long quotations from internal documents. Surface verbatim quotes only when necessary and only in short excerpts.
