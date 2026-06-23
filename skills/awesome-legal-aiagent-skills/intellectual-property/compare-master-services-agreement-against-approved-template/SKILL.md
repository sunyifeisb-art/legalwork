---
name: compare-msa-vendor-redline-approved-template
task_id: intellectual-property/compare-master-services-agreement-against-approved-template
description: Produce a deviation report comparing a vendor-redlined master services agreement against the approved template and playbook, using the template and playbook as the baseline and assessing changes with due diligence context where available.
activates_for: [planner, solver, checker]
---

# Skill: Compare Vendor-Redlined MSA Against Approved Template

## 1. Subject-matter triage

- Treat the approved template as the baseline risk position and the playbook as the governing interpretive guide for acceptable deviations.
- Compare the vendor redline against the baseline provision by provision, then test whether any deviation is softened, offset, or worsened by other edits, schedules, exhibits, diligence materials, or cover-letter claims.
- Where the source set contains multiple agreement versions, exhibits, or diligence documents, identify them first and analyze each against the same baseline before drafting conclusions.
- If only one redlined agreement is in scope, state that explicitly and proceed on a single-document comparison.

## 2. Failure modes the skill is correcting

- Classifying deviations by visual size or wording churn instead of by the playbook’s actual risk posture for the affected provision.
- Missing how liability, indemnity, security, confidentiality, audit, and compliance edits interact as a system rather than as isolated clauses.
- Accepting the vendor’s summary of changes at face value instead of checking the redline and cross-referencing the source materials.
- Ignoring due diligence facts that materially change how a weakened warranty, indemnity, cap, or compliance obligation should be scored.
- Describing a deviation without stating its scale, its interaction with another source document or clause, and the practical consequence for the client.
- Returning a narrative review with no structured remediation path, or with recommendations that omit who should act and when.

## 3. Legal frameworks / domain conventions that apply

- The approved template is the company’s negotiated risk floor; any departure must be measured against the playbook’s stated treatment for that clause family.
- The playbook’s labels and fallback positions control the risk classification, not the drafting style of the change.
- Core MSA risk areas should be assessed as linked systems: liability cap, exclusions, indemnities, insurance, warranty scope, termination, data security, confidentiality, audit rights, subcontracting, service levels, and compliance.
- Data protection and security obligations should be read together with any DPA, security exhibit, or policy references in the source set.
- Vendor diligence materials are relevant to whether a softened clause is acceptable, particularly where the vendor’s operational, financial, security, or compliance profile increases exposure.
- Any legal proposition used in the report should be anchored to the authority or governing source identified in the materials; if the source set supplies no authority, rely on the applicable contractual hierarchy and the playbook’s stated convention rather than unsupported assertion.
- Do not treat a cover letter, markup summary, or negotiation note as controlling if it conflicts with the actual redline text.

## 4. Analytical scaffolds

- **Baseline mapping:** map each substantive deviation to the exact template provision it changes, then record whether the vendor deleted, added, narrowed, expanded, or reordered the term.
- **Playbook classification:** assign the clause the playbook’s required posture, then classify the deviation against that posture using a uniform ordinal severity scale defined at the top of the report.
- **Change-significance test:** for each issue, state the practical magnitude using a source-derived figure, term, threshold, or operational benchmark where available; if the source set provides no usable number, say so and use the closest contractual proxy.
- **Cross-document interaction:** identify any clause, schedule, exhibit, diligence item, or side letter that changes the risk reading of the deviation.
- **Consequence analysis:** explain the downstream effect on economics, performance, enforceability, regulatory exposure, dispute leverage, or operational flexibility.
- **Counter-position drafting:** for each high-priority deviation, give the client’s response posture, fallback language, and whether the issue is acceptable, negotiable, or not acceptable under the playbook.
- **Consistency check:** confirm that related provisions do not leave gaps or contradictions, especially where one clause expands obligations and another narrows remedies or proof rights.

## 5. Vertical / structural / temporal relationships

- Analyze the agreement vertically from definitions through operative clauses, then through exhibits and ancillary documents, because changes in defined terms often alter multiple downstream provisions.
- Track whether the vendor change is front-loaded, ongoing, conditional, post-termination, or survival-based, since timing changes can shift practical risk even when text changes are modest.
- When multiple counterparties, services, data types, or regions appear in the source set, separate them before analysis and do not collapse distinct risk profiles into a single pass.
- If the redline introduces different treatment for different service lines, locations, or data classes, analyze each distinct branch separately before summarizing.
- Identify whether a deviation creates a mismatch between liability allocation and the contract’s operational obligations over time.

## 6. Output structure conventions

- Produce a formal deviation report suitable for insertion into `msa-deviation-report.docx`; the report itself is the primary deliverable.
- Begin with a concise executive summary that states the overall risk picture and the highest-priority departures.
- Define the severity scale once near the top and apply it consistently to every issue entry.
- For each deviation, include:
  - the affected provision;
  - the approved-template position;
  - the vendor-redline position;
  - the playbook treatment;
  - the severity;
  - the source-based significance;
  - the interacting clause or document;
  - the client consequence;
  - the recommended response.
- Use an issue-by-issue table or similarly structured format that can be read without the source documents in hand.
- Where helpful, group related deviations under the same commercial topic, but do not merge separate issues that require distinct responses.
- End with an explicit Recommended Actions section that assigns an imperative action, the responsible role, and a timing anchor tied to the negotiation or signing process.
- Include a short section calling out interaction effects where multiple deviations collectively increase risk beyond any single clause.
- Use plain-language status labels only as narrative support; the operative classification must be the stated ordinal severity field.
- If the vendor’s characterization of a change differs from the actual text, note the discrepancy plainly.
