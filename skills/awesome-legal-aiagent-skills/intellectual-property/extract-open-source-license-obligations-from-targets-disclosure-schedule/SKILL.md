---
name: extract-oss-license-obligations-disclosure-schedule
task_id: intellectual-property/extract-open-source-license-obligations-from-targets-disclosure-schedule
description: Reviewing a target company's open source software disclosure schedule and related M&A diligence materials to identify compliance risks and transaction impact, requiring license-category analysis and consistency checking against deal-level IP representations.
activates_for: [planner, solver, checker]
---

# Skill: Extract Open Source License Obligations from Target's Disclosure Schedule

## 1. Subject-matter triage

Use the disclosure schedule, deal-level IP representations, internal open source policy, SDK/license terms, and engineering notes as one diligence set. Treat the transaction representations as the baseline, the schedule as a qualification tool, and the other materials as evidence of actual practice. Flag any disclosed or referenced component that is inconsistent with the representations, unsupported by the schedule, or not clearly classified.

If the source set contains multiple products, services, codebases, or deployment modes, enumerate them first and analyze each separately. Do not merge materially different components into one pass.

## 2. Failure modes the skill is correcting

- Reviewing the schedule in isolation instead of testing it against the deal-level IP representations
- Treating all open source licenses as equivalent instead of separating permissive, weak copyleft, strong copyleft, and network-triggered obligations
- Missing that integration method can change the legal effect of the same license
- Overlooking downstream exposure created by SDK terms, distributed tools, or externally shipped components
- Failing to identify gaps between stated policy and engineering practice
- Ending with diagnosis only, without transaction consequence or remediation path

## 3. Legal frameworks / domain conventions that apply

- Open source diligence turns on license class, modification status, distribution model, and whether the component is embedded, linked, bundled, or merely used internally
- Permissive licenses usually impose notice and attribution-type obligations; copyleft licenses can add source-availability and licensing obligations tied to the covered work
- Strong copyleft and network-use licenses may expand obligations beyond the component itself depending on modification, distribution, and service deployment
- Patent-license terms vary by license and can be material where the target ships software or SDKs to third parties
- Deal-level IP representations commonly address OSS compliance, undisclosed use of open source, source-code disclosure risk, and completeness of identified OSS inventory
- A disclosure schedule qualifies representations only to the extent it is complete, accurate, and internally consistent with the rest of the diligence record
- Remediation may include replacement, code excision, relicensing analysis, policy tightening, or pre-closing covenanting; the chosen fix depends on whether the issue is disclosure, architecture, or downstream licensing

## 4. Analytical scaffolds

1. Build a complete inventory of referenced open source components, libraries, tools, modules, and license labels from the schedule and supporting documents.
2. Classify each item by license family and practical risk tier: permissive, weak copyleft, strong copyleft, or network-triggered.
3. For each item, determine how it is used: internal only, distributed externally, embedded in a product, modified, linked, bundled, or offered as a service.
4. Test each item against the deal-level IP representations to see whether the schedule preserves, narrows, or contradicts the warranty package.
5. Compare the disclosure schedule with the open source policy and engineering notes to identify undocumented practices, missing approvals, or unexplained exceptions.
6. Review any SDK, developer tool, or customer-facing license terms for downstream effects on recipients and license compatibility.
7. Separate confirmed compliance issues from verification gaps; both matter, but they carry different transaction consequences.
8. For each issue, state severity on a uniform ordinal scale, identify the affected document interaction, and explain the likely closing or post-closing consequence.
9. Recommend a fix matched to the issue type: document correction, diligence follow-up, technical remediation, special indemnity, covenant, or closing condition.

## 5. Vertical / structural / temporal relationships

The transaction representations set the legal baseline; the disclosure schedule qualifies that baseline; engineering notes and policy materials evidence whether the schedule is reliable. License obligations also move with time and use: a component that is harmless in isolated internal testing may become risky when shipped, linked, modified, or exposed through a service. Treat pre-closing remediation differently from post-closing monitoring, and distinguish current noncompliance from future-triggered obligations.

## 6. Output structure conventions

- Produce a compliance risk report in conventional diligence format with:
  - a short executive summary,
  - a license inventory and classification table,
  - a component-by-component risk analysis,
  - a representation consistency check,
  - a policy-versus-practice gap section,
  - a downstream/SDK exposure section,
  - a missing-ingredient / undisclosed-component section,
  - a transaction impact and remediation section,
  - and a recommended actions section.
- Define the severity scale once at the top and apply it uniformly to every flagged item.
- For each flagged item, include: severity, component or issue label, license type, integration/use mode, the interacting document or clause, transaction impact, and remediation path.
- Keep analysis tied to the source materials; if a proposition depends on license mechanics or representation risk, name the governing license term or diligence convention that supports the conclusion.
- If the documents contain specific deadlines, milestone dates, approval gates, or closing conditions, carry them through into the recommendation. If not, use a relative timing anchor tied to diligence completion, signing, or closing.
- Conclude with a concise recommended actions block that assigns each action to the responsible role and ties it to the relevant transaction milestone.
