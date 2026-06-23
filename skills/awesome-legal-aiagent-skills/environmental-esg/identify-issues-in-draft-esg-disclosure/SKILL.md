---
name: identify-issues-in-draft-esg-disclosure
task_id: environmental-esg/identify-issues-in-draft-esg-disclosure
description: Guides preparation of a severity-ranked ESG disclosure issues memorandum by cross-checking draft report claims against underlying data, active enforcement matters, board records, and internal communications that may reveal material inaccuracies or legal exposure.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Draft ESG Disclosure — Issue Memorandum

## 1. Subject-matter triage
- Treat the draft ESG report as a disclosure document, not a branding exercise.
- Separate claim types before analysis: quantitative metrics, governance statements, target/progress statements, enforcement/compliance statements, assurance statements, and risk-factor statements.
- Treat internal data, consent orders, board materials, and emails as potentially controlling evidence; do not privilege the draft report’s narrative.

## 2. Failure modes the skill is correcting
- Reviewing the draft against generic ESG frameworks without tying each claim to the actual source documents.
- Missing affirmative misstatements where the draft contradicts the underlying data or enforcement record.
- Treating an active enforcement matter as background rather than a constraint on what performance or compliance claims can be made.
- Ignoring internal emails and board minutes as evidence of management knowledge, timing, and inconsistency.
- Flagging only omissions and failing to identify statements that are technically complete but misleading in context.
- Stopping at identification without explaining severity, legal consequence, and practical fix.
- Assuming assurance, targets, or governance language are accurate without checking the scope and supporting record.

## 3. Legal frameworks / domain conventions that apply
- Securities disclosure accuracy: material statements and omissions in ESG reporting must be supportable and not misleading under the applicable federal securities disclosure framework.
- Anti-fraud standards: if a claim is unsupported, contradicted, or misleading by omission, evaluate exposure under Rule 10b-5 and related disclosure principles.
- Environmental enforcement context: consent orders, remediation obligations, and ongoing monitoring can limit the accuracy of “compliant,” “sustainable,” “low-impact,” or similar performance narratives.
- ESG methodology conventions: Scope 1, Scope 2, and Scope 3 terminology must be used consistently with the stated methodology, boundaries, and baseline period.
- Governance disclosure norms: board oversight, committee structure, and management responsibility statements must match the actual governance record.
- Risk disclosure norms: physical and transition risk discussion must be tied to the company’s own risk assessment, not generic industry language.
- Assurance conventions: claims about verification must not exceed the assurance scope, subject matter, period, or standard actually covered.
- Internal knowledge doctrine: emails or board records showing awareness of a problem increase the risk that a mismatch between facts and public disclosure is material and actionable.

## 4. Analytical scaffolds
- Build an issue map by disclosure category, then test each statement against the source set.
- For each quantitative claim:
  - identify the metric, period, boundary, and methodology stated in the report;
  - compare it to the underlying data source;
  - flag any mismatch, unsupported calculation, or unexplained change in methodology.
- For each compliance or performance claim:
  - compare the draft statement to the consent order and any remediation or monitoring obligations;
  - ask whether the claim overstates compliance status, completion, or operational improvement.
- For each governance statement:
  - compare the report to board minutes and committee records;
  - verify the described oversight structure, delegation, and approval process.
- For each target or commitment:
  - verify baseline year, target date, scope, and progress metric;
  - check whether the report uses the same target definition throughout.
- For each risk statement:
  - compare the disclosure to internal risk assessments and management emails;
  - identify omitted known risks, overstated mitigation, or stale risk descriptions.
- For each assurance statement:
  - verify what the assurance provider actually covered and whether the report implies broader verification than exists.
- For each issue, close the analysis with:
  - the size or scale of the issue as shown in the source documents;
  - the interacting document, clause, record, or email that changes the reading;
  - the consequence for disclosure accuracy, regulatory exposure, litigation risk, or operational decision-making.

## 5. Vertical / structural / temporal relationships
- Prioritize source documents over the draft when they conflict.
- Treat enforcement status as a ceiling on how optimistic the performance narrative can be.
- Treat board knowledge as temporally important: if management knew before publication, the disclosure standard is stricter than if the issue arose afterward.
- Treat methodology drift across reporting periods as a structural issue, not a harmless formatting change.
- Treat scope mismatches as material when the report implies a company-wide claim but the source data is narrower.
- Where multiple periods, facilities, emissions scopes, or business units are involved, separate them before analysis; do not blend them into one composite conclusion.
- If only one item is in scope for a category, say so expressly and explain why the source set supports that limitation.

## 6. Output structure conventions
- Use a severity-ranked issue memorandum in a conventional legal-memo shape: brief summary, issue list, analysis, and recommendations.
- Define the severity scale once at the top and use it consistently for every issue.
- For each issue, state:
  - the draft claim or implication;
  - the contradicting or missing source;
  - why the issue matters legally or factually;
  - the scale of the discrepancy;
  - the downstream consequence;
  - the recommended correction.
- Cite the controlling authority or governing disclosure convention for each legal proposition relied on, including the relevant statute, rule, regulation, or recognized framework where applicable.
- Separate legal exposure from pure accuracy problems and from improvement opportunities.
- End with a Recommended Actions section that assigns a responsible role and a timing anchor for each step.
- Keep the filename aligned with the task instructions: `esg-issue-memorandum.docx`.
