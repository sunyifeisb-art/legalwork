---
name: compare-data-protection-remediation-plan-against-regulatory-undertaking-commitments
task_id: data-privacy-cybersecurity/compare-data-protection-remediation-plan-against-regulatory-undertaking-commitments
description: Regulatory undertaking gap analyses are strongest when the agent maps each undertaking commitment individually to the remediation plan and tests whether implementation evidence, timelines, ownership, and verification measures satisfy the commitment's specific requirements.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis: Data Protection Remediation Plan vs. Regulatory Undertaking Commitments

## 1. Subject-matter triage

- Treat the undertaking as the controlling obligation set; do not generalise from abstract privacy principles unless they help interpret the specific commitment wording.
- If the source set includes an investigation summary, use it to identify the regulatory harm, control failure, and expected remediation theme behind each commitment.
- If there are review emails, treat them as evidence of scope clarifications, agreed revisions, unresolved objections, or timing commitments that may affect whether the plan is complete.
- If a mapping matrix exists, use it only as a starting index; verify every linkage independently against the underlying documents.

## 2. Failure modes the skill is correcting

- Agent gives a generic “overall compliant / non-compliant” view instead of analysing each commitment separately.
- Agent accepts a prebuilt crosswalk without checking whether the cited plan section actually satisfies the commitment’s wording.
- Agent misses gaps in implementation detail: ownership, evidence of completion, testing, reporting, or sequence.
- Agent fails to tie each gap back to the investigation facts, so the remediation appears detached from the original control failure.
- Agent ignores fixed regulatory dates and milestones, leading to a plan that is directionally right but temporally non-compliant.
- Agent identifies a problem but does not close it with a severity judgment, consequence, and concrete next step.

## 3. Legal frameworks / domain conventions that apply

- A regulatory undertaking is governed by its own wording and any stated statutory or administrative basis; the commitment text is the primary benchmark for sufficiency.
- The underlying data protection obligations matter because the remediation must address the root cause identified by the regulator, not merely a related operational issue.
- Remediation plans in this context ordinarily require:
  - a defined action or control change,
  - an accountable owner,
  - a target date or milestone,
  - implementation evidence,
  - and a verification or testing mechanism.
- A plan is incomplete if it describes an intention but does not specify how completion will be demonstrated.
- Where the undertaking contains phased milestones or reporting obligations, those dates are binding constraints on the remediation plan’s sequence and evidence package.

## 4. Analytical scaffolds

- First enumerate every commitment in the undertaking as a numbered list, preserving its meaning in concise form.
- Then, for each commitment, identify the most relevant remediation plan section or sections and test four questions:
  - Does the plan address the same obligation, not just a related one?
  - Does it include implementation detail sufficient to show completion?
  - Does it align with the required timing, owner, and evidence standard?
  - Does it provide verification or testing that proves the control works?
- Use the investigation summary to anchor the analysis in the regulator’s factual concern; if the plan remediates a downstream symptom but not the root cause, call that out as a gap.
- If the source set contains a mapping matrix, compare it against your own reading and flag any overbroad or unsupported mappings.
- For each issue, close the analysis with:
  - the commitment and plan section(s),
  - the gap type,
  - the severity,
  - the regulatory or operational consequence,
  - and the recommended fix.
- Where a commitment is only partly met, distinguish between coverage gaps, timing gaps, evidence gaps, and verification gaps rather than collapsing them into one label.
- If a commitment has no meaningful plan counterpart, say so expressly and explain why the plan fails to reach the required subject matter.

## 5. Vertical / structural / temporal relationships

- Treat the commitment list as the vertical hierarchy: analyse top-level commitments first, then sub-requirements, then any embedded milestones or reporting duties.
- Treat dates in the undertaking as hard external constraints; a later internal plan date is a gap unless the undertaking allows it.
- If implementation depends on a vendor or another function, check whether that dependency is actually captured in the plan with enforceable responsibility and timing.
- If the source documents include sequential steps, verify that the plan respects the order in which controls must be designed, implemented, tested, and reported.
- If the undertaking requires evidence before reporting, do not treat a promise to “complete later” as satisfaction.

## 6. Output structure conventions

- Produce a gap analysis report organised by commitment, with each commitment receiving a clear pass / partial / fail assessment.
- Open with a short methodology note that states the documents compared and the severity scale used.
- Define a uniform ordinal severity scale once near the top and apply it consistently to every issue entry.
- Include a compact summary table with columns for commitment, plan section, gap type, severity, and recommended action.
- Follow with commitment-by-commitment analysis that identifies the gap, explains why it matters, and states the consequence of leaving it unresolved.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible role or function from the source set where possible, and ties each action to the relevant regulatory milestone or deadline.
- Use ordinary legal/business prose; do not reproduce internal wording verbatim except where the task specifically asks for it.
- Name the deliverable file exactly as instructed and ensure the report is complete in substance, not just in outline.
