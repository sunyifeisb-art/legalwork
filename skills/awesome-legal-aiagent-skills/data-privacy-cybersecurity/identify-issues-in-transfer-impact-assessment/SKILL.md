---
name: identify-issues-in-transfer-impact-assessment
task_id: data-privacy-cybersecurity/identify-issues-in-transfer-impact-assessment
description: TIA issue memos for cross-border EU data transfers fail when the agent does not assess the TIA's methodology and conclusions against the destination-country legal analysis required by Schrems II, and does not identify where multiple transfer mechanisms in the same engagement have been incorrectly applied or are inconsistent.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Transfer Impact Assessment for Cross-Border EU Data Transfers

## 1. Subject-matter triage

Treat the inquiry letter as the controlling roadmap for scope and priority. Identify which transfers, destinations, and transfer mechanisms are actually under review before analyzing the TIA.

If the source set covers more than one destination country, mechanism, or transfer stream, enumerate each one explicitly and analyze them separately. Do not collapse distinct transfers into a single generic assessment.

Read the TIA, supporting transfer documents, and any internal compliance materials together. Use internal emails, memos, or issue lists as additional issue sources, not as substitutes for the TIA review.

## 2. Failure modes the skill is correcting

- The TIA is treated as a stand-alone narrative rather than a destination-specific legal assessment tied to the actual transfer structure.
- The analysis stops at whether the TIA exists, instead of testing whether its methodology follows the required transfer-impact framework and whether its conclusions are supported.
- Different destinations or transfer mechanisms are blended together, causing a single analysis to obscure inconsistent assumptions, incomplete annexes, or mismatched safeguards.
- The transfer mechanism is referenced without checking whether it is current, complete, and actually fit for the destination-specific legal environment.
- Contract documents, annexes, and operational descriptions are not reconciled, so discrepancies in data scope, recipients, subprocessors, or security measures are missed.
- Internal compliance concerns are ignored even when they identify gaps the regulator is likely to focus on.
- Issues are described but not closed with the practical consequences and fix required for regulator response.

## 3. Legal frameworks / domain conventions that apply

- Schrems II transfer-impact methodology: assess the destination legal framework, the practical risk of access or interference, the effectiveness of the transfer mechanism, and the need for supplementary measures where protection is not otherwise effective.
- EDPB-style transfer-impact analysis conventions: the assessment should proceed step by step and document the basis for each conclusion.
- GDPR Chapter V transfer logic: each cross-border transfer must be supported by an applicable transfer mechanism and, where required, supplementary measures.
- Adequacy or comparable transfer reliance: if the TIA relies on an asserted mechanism or status, confirm that the TIA addresses scope, limitations, and fallback risk.
- Regulatory inquiry context: the inquiry letter defines the issues that matter for the response, so align the memorandum to those points first.
- Documentation completeness norms: each transfer execution should have populated annexes and operational detail sufficient to match the stated processing and security posture.
- General legal proposition rule: state the governing authority for each legal conclusion rather than asserting it in the abstract.

## 4. Analytical scaffolds

- Build an issue map by destination and mechanism:
  1. destination country;
  2. transfer mechanism relied on;
  3. relevant inquiry concern;
  4. TIA methodology step at issue;
  5. supporting document inconsistency, if any;
  6. downstream consequence.
- For each destination, test the TIA against the required methodology sequence:
  - identify the transfer route and data scope;
  - identify the destination legal environment;
  - assess access-risk and enforcement realities;
  - test the transfer mechanism’s effectiveness;
  - identify supplementary measures or fallback steps.
- Cross-check the TIA against contract terms, annexes, and security materials for consistency in:
  - categories of personal data;
  - recipient and subrecipient scope;
  - processing purpose and instructions;
  - technical and organizational measures;
  - retention, deletion, and incident-response commitments.
- Treat omissions, generic placeholders, and unsupported conclusions as issues even if the TIA is directionally correct.
- For each issue, state:
  - the specific destination or transfer stream;
  - the applicable transfer mechanism and governing authority;
  - the deficiency in the TIA or supporting documents;
  - why it matters to the inquiry;
  - the consequence for the client;
  - the remediation needed.

## 5. Vertical / structural / temporal relationships

Use destination-specific sequencing. A later-stage supplementary-measures analysis does not cure an earlier failure to identify the correct transfer mechanism or legal environment.

Where the same engagement uses multiple transfer pathways, assess each pathway on its own terms and note any inconsistency in assumptions, controls, or annexes between them.

If the TIA references an external legal or operational assumption that may change over time, flag whether the document addresses current status, future risk, and fallback treatment.

## 6. Output structure conventions

- Write an issues memorandum in conventional legal-memo form, organized by destination and then by issue type.
- Start with a concise executive summary that states overall adequacy, key priority issues, and the regulator-response posture.
- Define a uniform ordinal severity scale once, then apply it consistently to every issue.
- For each issue, include:
  - destination / transfer stream;
  - applicable mechanism and controlling authority;
  - severity;
  - issue statement;
  - source-document inconsistency or omission;
  - why the issue matters to the inquiry;
  - consequence for the client;
  - recommended fix.
- Support each legal conclusion with the relevant authority by name and section, article, rule, or leading case where appropriate.
- Close with a Recommended Actions section that gives imperative next steps, the responsible role, and a timing anchor tied to the inquiry response or remediation cycle.
- Keep the filename exact: `tia-issue-memorandum.docx`.
