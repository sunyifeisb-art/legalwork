---
name: triage-counterparty-redlines-company-dpa-template
task_id: intellectual-property/triage-counterparty-redlines-to-company-dpa-template
description: Triaging a counterparty redline against a company standard data processing agreement template and playbook to produce a deviation report with risk classification and recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Triage Counterparty Redlines to Company DPA Template

## 1. Subject-matter triage

- Treat the company’s clean DPA template as the baseline position and the playbook as the controlling decision rule for deviations.
- Confirm whether the redline is a true markup of the template or a partial rewrite; if the latter, reconstruct the comparison against the baseline before assessing risk.
- Identify every counterparty change, including silent deletions, scope narrowing, timing extensions, and edits that appear cosmetic but alter legal effect.
- If the redline touches multiple operational themes, separate them before analysis and assess each theme on its own terms.

## 2. Failure modes the skill is correcting

- Reviewing the counterparty markup in isolation and missing differences from the company template or playbook.
- Overlooking silent deletions of template protections because the redline does not visibly strike them.
- Collapsing distinct issues into one generic “nonstandard” note instead of classifying each deviation by risk and playbook posture.
- Treating any deviation as equally problematic without distinguishing acceptable, fallback, and out-of-bounds positions.
- Missing omissions created by the redline where the template had addressed a topic and the counterparty left it out.
- Failing to connect the deviation to the operational or compliance consequence it creates for the company.
- Recommending “reject” or “accept” without a concrete, role-based next step.

## 3. Legal frameworks / domain conventions that apply

- Compare the counterparty redline against the company’s standard DPA as the operative baseline; the template reflects the company’s approved allocation of processor obligations.
- Use the playbook as the hierarchy for deviation review: preferred position, fallback position, and non-acceptable position.
- Apply data protection concepts that commonly drive DPA review, including controller/processor allocation, subprocessors, transfer safeguards, data subject rights support, security incident notice, audit/access, assistance obligations, deletion/return, and confidentiality.
- Where the redline changes a compliance-sensitive clause, assess whether the change preserves functional equivalence to the template’s protection or materially weakens it.
- For any proposition that depends on a specific legal rule, cite the controlling authority or rule as identified in the source set or as generally recognized in practice; do not state a legal conclusion without naming the supporting rule.
- Keep the analysis tied to the governing document set: template language, playbook guidance, and any operational references supplied with the markup.

## 4. Analytical scaffolds

1. Compare the documents side by side and list every substantive change, including deletions and omissions.
2. For each change, identify:
   - the template position,
   - the counterparty position,
   - the playbook posture,
   - whether the change is within bounds, a fallback issue, or outside acceptable range.
3. Test whether the redline preserves the clause’s function, not just its wording.
4. Check whether a change in one clause creates pressure on another clause, schedule, or operational process in the same DPA package.
5. Flag whether the issue is a direct deviation, a silent deletion, or an unaddressed gap.
6. Where the template’s protection depends on an operational assumption, confirm the redline is consistent with that assumption before deeming it acceptable.
7. Close each issue with the legal/commercial significance, not just the textual difference.

## 5. Vertical / structural / temporal relationships

- Compare the redline against the template at the clause level and the subclause level; a partial edit can change the effect of surrounding text.
- Track temporal shifts carefully: shorter notice periods, later deletion deadlines, delayed assistance, or post-termination obligations that are softened or removed.
- Identify cross-clause interactions where one edit undermines another protection, such as narrower subprocessors language affecting incident response or audit rights affecting security review.
- When the redline narrows a permission or expands an exception, note whether the change is self-contained or propagates through the DPA’s broader compliance structure.
- Treat omitted template provisions as separate findings when their absence leaves a gap in the contractual risk allocation.

## 6. Output structure conventions

- Produce a deviation report in conventional issue-report form, ordered from highest risk to lower-risk negotiation items, and then any within-bounds confirmations.
- Use a uniform ordinal severity scale defined once at the top, and apply it consistently to every entry.
- For each entry, include:
  - DPA section or clause reference,
  - template position,
  - counterparty redline position,
  - playbook classification,
  - severity,
  - why the change matters,
  - recommended response.
- Distinguish clearly among:
  - deviations from the template,
  - positions that are outside the preferred but still within fallback range,
  - positions that are outside fallback,
  - omissions or silent deletions.
- Surface unaddressed gaps in a separate section for template provisions not carried into the redline.
- End with a concise Recommended Actions block that assigns an action, the responsible role, and a timing anchor tied to the negotiation cycle or signing deadline.
- Keep the report self-contained and readable without relying on tracked changes; if the output includes rewritten language, make the change visible in plain text with explicit deletion/insertion markings.
