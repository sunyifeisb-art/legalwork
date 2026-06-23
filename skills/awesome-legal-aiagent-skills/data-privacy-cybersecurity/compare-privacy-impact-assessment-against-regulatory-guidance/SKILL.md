---
name: compare-privacy-impact-assessment-against-regulatory-guidance
task_id: data-privacy-cybersecurity/compare-privacy-impact-assessment-against-regulatory-guidance
description: PIA/DPIA gap analyses fail when the agent uses only one benchmark, omits key elements of the applicable DPIA framework, or skips task-specific scope materials that may shape the memo's priorities.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis Memorandum: Privacy Impact Assessment vs. Regulatory DPIA Guidance for an AI Health Platform

## 1. Subject-matter triage (only if applicable)

- Treat the engagement scope memo and any transfer supplemental as first-order inputs, not background. They can narrow the issues, elevate certain risks, and supply the factual anchors for the memo.
- Confirm whether the source set contains more than one applicable guidance baseline; if so, analyze each baseline separately before synthesizing differences.
- If the PIA addresses multiple processing streams, jurisdictions, or data categories, separate them before comparing adequacy; do not collapse distinct risk profiles into one pass.
- Where the processing involves health data, automated decision-making, profiling, or cross-border transfers, expect a heightened DPIA burden and evaluate those items explicitly.

## 2. Failure modes the skill is correcting

- Comparing the PIA against only one guidance source, or blending guidance requirements without identifying where the authorities converge or differ.
- Accepting the PIA’s conclusion without testing whether its facts, assumptions, and evidence support the conclusion under the applicable DPIA standard.
- Missing mandatory DPIA content: the processing description, necessity and proportionality, risk identification and assessment, and risk-mitigation measures.
- Under-analyzing AI-specific privacy issues such as explainability, transparency, training-data minimisation, model governance, and ongoing monitoring.
- Treating transfer analysis as a side note instead of a distinct DPIA dimension with its own risk and mitigation questions.
- Ignoring scope instructions that change the memo’s priority order, depth, or emphasis.
- Stating a gap without tying it to the controlling legal or guidance authority and without stating the downstream operational or regulatory consequence.

## 3. Legal frameworks / domain conventions that apply

- The DPIA framework under the applicable data-protection regime: high-risk processing triggers, mandatory DPIA content, review/refresh expectations, and consultation duties where residual risk remains high.
- Guidance from the relevant European and UK data-protection authorities on DPIA content, methodology, risk assessment, and supervisory consultation.
- Health-data rules applicable to special-category data, including heightened lawful-basis and risk considerations.
- AI governance conventions in privacy reviews: transparency, explainability, data minimisation, purpose limitation, bias and model drift monitoring, and human oversight where relevant.
- International transfer analysis within a DPIA: transfer mechanism, recipient-country risk, supplementary measures, and practical enforceability.
- Use the source documents’ own citations where provided; otherwise cite the controlling authority by name and section or article when stating a legal proposition.

## 4. Analytical scaffolds

- Extract the mandatory DPIA elements from each guidance source, then compare the PIA against each element in turn.
- For every issue, close the analysis by identifying: the scale or scope of the issue from the source documents, the related source document or clause that interacts with it, and the specific consequence for the client.
- Assess methodology, not just conclusions: whether the PIA identifies risks at the right level of granularity, explains why controls are sufficient, and supports residual-risk statements with evidence.
- Test the AI-specific disclosures: what the system does, what data it uses, how outputs affect individuals, whether the analysis addresses explainability and monitoring, and whether mitigation is operationalized.
- Separate transfer risks from general privacy risks and analyze the transfer supplemental as a distinct input.
- For each finding, record the guidance source, the DPIA element, the gap, the severity, and the recommended remediation.
- Define a uniform ordinal severity scale once and apply it consistently across all findings.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Where the source set contains multiple jurisdictions, business units, processing purposes, or data flows, map the relationships before writing the memo so the analysis does not mix standards or controls that apply to different contexts.
- If the PIA evolved over time or the supplemental materials amend earlier assumptions, note the sequence and assess the later materials as superseding or refining the earlier ones where appropriate.
- If a transfer mechanism depends on a later implementation step, identify that dependency and explain how it affects the adequacy of the current DPIA.
- If scope materials prioritize certain risks over others, preserve that ordering in the memo’s structure and emphasis.

## 6. Output structure conventions

- Write a gap analysis memo in industry-conventional memo form, with a concise executive summary, an ordinal severity legend, and a body organized by DPIA topic area.
- Use a uniform finding format for each issue: guidance source; DPIA element; gap description; severity; consequence; recommended remediation.
- Make the authority explicit in each legal conclusion; do not leave a risk statement unsupported by the governing rule or guidance.
- End with a short recommended actions section that assigns the next step to the relevant role and ties it to a regulatory or project milestone where possible.
- Keep the filename exactly as instructed: `dpia-gap-analysis-memo.docx`.
