---
name: compare-executed-supply-agreement-template
task_id: intellectual-property/compare-executed-supply-agreement-against-approved-template
description: Full deviation report comparing an executed supplier agreement against the approved template, with risk ratings and remediation paths, incorporating supplier profile and delegation-of-authority context.
activates_for: [planner, solver, checker]
---

# Skill: Compare Executed Supply Agreement Against Approved Template

## 1. Subject-matter triage (only if applicable)

- Confirm the document set before analysis: executed agreement, approved template, and any supporting approval, policy, exhibit, or playbook materials.
- Identify whether one executed agreement or multiple versions are in scope; if more than one, enumerate each version first and analyze them separately.
- Treat the executed contract as the operative text, but test each departure against the approved template and the governing approval framework before assigning significance.
- If the source set includes supplier-profile materials, integrate them into the deviation assessment rather than treating them as background only.

## 2. Failure modes the skill is correcting

- Treating the executed agreement as automatically authoritative without checking whether departures from the template were within delegated signing authority.
- Splitting commercial deviations from operational deviations, which obscures the combined risk picture.
- Ignoring supplier-specific context when ranking deviation severity.
- Describing deviations without distinguishing between those that are already fixed in the executed contract and those that remain amendable by later agreement.
- Reporting differences without tying each one to an approval basis, source interaction, and business consequence.
- Providing a narrative summary without a clear severity ranking and action path for each issue.

## 3. Legal frameworks / domain conventions that apply

- The approved template and any internal approval or delegation framework together define the baseline against which deviations are judged.
- A deviation is material when it alters economics, risk allocation, liability structure, compliance obligations, operational controls, or other protections the template was designed to preserve.
- Delegated authority limits matter: a signatory may bind the business only within the scope of the authority actually granted by the relevant internal framework.
- Supplier risk profile affects materiality: the same deviation can be more or less significant depending on counterparty criticality, financial strength, performance history, compliance posture, and strategic dependence.
- Remediation is usually prospective: an amendment can correct or clarify many issues, but retroactive fixes to accrued liability, indemnity, or already-triggered obligations are often limited.
- Use the controlling authority stated in the source set when present; otherwise cite the applicable internal approval policy, contract governance rule, or generally recognized contract-review principle by name.

## 4. Analytical scaffolds

- Template-to-executed comparison: compare each provision, exhibit, schedule, and defined term against the approved baseline and classify the result as unchanged, minor variation, material deviation, missing, or added.
- Authority review: for each material deviation, test whether the signatory or approver had authority to accept it under the relevant approval framework.
- Source interaction review: check whether a deviation is explained, limited, or contradicted by a supporting document, policy, email approval, exhibit, or incorporated term.
- Risk synthesis: assess each deviation through the combined lens of economics, liability, compliance, and operations, then adjust for supplier-specific context.
- Remediation analysis: identify whether the issue can be cured by amendment, side letter, waiver, internal ratification, operational workaround, or no practical cure.
- Issue-closing discipline: for every deviation, anchor the analysis to a figure, term, threshold, duration, volume, or other measurable source point; then cross-reference the interacting document or clause; then state the downstream consequence for the client.
- Severity discipline: assign every issue a single ordinal severity level using a stated scale, and keep the scale consistent across the report.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track hierarchy in the document stack: template, special terms, exhibits, order forms, approvals, and supporting materials may override, supplement, or narrow one another.
- Distinguish pre-signature issues from post-signature remediation. A defect in approval may require internal ratification even if the contract remains effective.
- Distinguish evergreen obligations from time-bound commitments, and flag any deviation that accelerates, extends, or removes a deadline, notice period, renewal point, or cure period.
- Where the source set contains multiple counterparties, affiliate references, or incorporated documents, evaluate whether the deviation changes which entity is bound or protected.

## 6. Output structure conventions

- Produce a deviation report in conventional advisory form, not a clause-by-clause commentary dump.
- Start with a short executive summary that states the overall risk posture, the most important deviations, and whether remediation is likely feasible.
- Define the severity scale once near the top and use it uniformly, such as Critical / High / Medium / Low.
- For each deviation, include:
  - template provision or baseline position
  - executed language or observed change
  - deviation description
  - authorization / approval status
  - severity rating
  - remediation path
  - concise rationale
- Make the report self-contained and plain-text legible; do not rely on formatting alone for any required distinction.
- Where the task is a comparison or markup-adjacent analysis, make each substantive change legible in text as well as in structure.
- End with a Recommended Actions section that gives imperative next steps, names the responsible role, and ties each action to a timing anchor or business milestone from the source set.
- Include a priority ranking or risk matrix only if it helps distinguish which deviations require immediate escalation.
- Confirm in the finished work that the primary deliverable file is the deviation report and that it is complete enough to stand on its own for business and legal review.
