---
name: hls-draft-privacy-impact-assessment
task_id: healthcare-life-sciences/draft-privacy-impact-assessment
description: Drafts a privacy impact assessment for an AI-powered healthcare platform, focusing on algorithmic bias, inference logging, HIPAA marketing classification of automated outreach, business associate agreement secondary use scope, state health data law timing, de-identification risk, and API token security.
activates_for: [planner, solver, checker]
---

# Skill: Draft Privacy Impact Assessment for AI-Powered Healthcare Platform

## 1. Subject-matter triage

- Confirm the assessment scope before drafting: the platform, the patient population, the data flows, the deployment timing, and any jurisdictional privacy overlays that actually apply.
- If the source set spans multiple patient cohorts, launch dates, or deployment phases, separate them at the outset and analyze each distinct path rather than collapsing them into one generic risk narrative.
- If a privacy regime is not implicated on the facts, omit it; do not dilute the PIA with unrelated cross-border or sectoral rules.

## 2. Failure modes the skill is correcting

- AI bias and subgroup performance disparities are overlooked even though clinical or operational models can produce unequal outcomes when training data are not representative of the patient population.
- Inference logging gaps are missed even though prediction logs are often necessary for auditability, accountability, and complaint investigation.
- HIPAA marketing classification of automated patient outreach and business associate secondary use scope are overlooked even though automated outreach using protected information to encourage product use can trigger additional authorization or scope limits.
- State health data law timing risk — whether a new health data privacy law's effective date precedes or follows the platform go-live date — is not analyzed even when the go-live materials indicate an imminent launch.
- Re-identification risk is not assessed even where de-identified data may be combined with other datasets.
- Long-lived API tokens are not reviewed even though token compromise may persist undetected for an extended period.

## 3. Legal frameworks / domain conventions that apply

- AI algorithmic bias in clinical applications: assess whether training data demographics match the patient population; identify performance gaps across demographic subgroups using appropriate metrics; recommend bias auditing, training data diversification, and ongoing monitoring.
- AI inference logging: systems making clinical or operational predictions should log those predictions for audit, accountability, and complaint investigation; absence of inference logging is a liability risk and limits the ability to respond to patient or regulatory inquiries.
- HIPAA marketing definition applied to automated outreach: communications that encourage patients to use products or services beyond their own treatment options may require additional authorization; the treatment exception applies only to communications about the patient's own treatment options from the patient's own provider. Cite the HIPAA Privacy Rule provisions governing marketing and treatment communications, including 45 C.F.R. § 164.501 and the authorization rule in 45 C.F.R. § 164.508 where relevant.
- Business associate agreement scope and secondary use: a vendor clause permitting broad improvement, product development, or similar secondary use of protected health information may exceed permitted business associate purposes and create unauthorized secondary-use risk under the HIPAA Privacy Rule and Security Rule framework.
- Re-identification risk: combining de-identified data with other available datasets may allow re-identification of individual patients; assess whether the de-identification method satisfies the applicable standard under 45 C.F.R. § 164.514.
- State health data law timing: if a new state health data privacy act has an effective date close to the platform go-live, assess whether the platform will be in compliance on that date; a go-live that precedes compliance readiness creates immediate statutory violation risk.
- API token security: long-lived API tokens are a security risk because token compromise may go undetected for extended periods; industry standards require token rotation on a defined schedule and access controls proportionate to the data sensitivity.
- Where the facts support only one applicable legal regime for a topic, say so expressly and avoid padding the analysis with inapplicable authorities.

## 4. Analytical scaffolds

1. AI bias: compare training data composition to the patient population; test for performance disparities across relevant subgroups; identify mitigation steps and whether pre-go-live validation is sufficient.
2. Data-transfer scope: determine whether any cross-border or extra-territorial privacy regime applies to the platform's patient population and data flows; if not, keep the PIA focused on the operative domestic framework.
3. Inference logging: determine whether the system logs AI predictions and related outputs; if not, treat logging as a pre-go-live control.
4. HIPAA marketing: analyze automated outreach communications against the marketing definition; apply the treatment exception analysis; identify any authorization or notice implications.
5. BAA secondary use: assess whether secondary use clauses in vendor agreements exceed the scope of permitted business associate purposes and whether downstream processing is consistent with the stated role.
6. State law timing: identify any health data privacy law with an effective date close to the go-live date; assess whether the platform will be compliant on that date and whether launch sequencing needs adjustment.
7. API security: assess token lifetime against industry rotation standards; recommend token rotation and related credential-hardening measures as pre-go-live or immediate post-go-live actions.

## 5. Vertical / structural / temporal relationships

- Organize the assessment by risk category, but preserve the sequence from data collection through model use, patient outreach, retention, sharing, and security controls.
- Distinguish pre-launch controls from post-launch monitoring so the reader can see what must be complete before go-live and what can be remediated after deployment.
- Where a risk depends on another source document, link the documents explicitly in the analysis so the interplay is visible rather than implicit.
- For each issue, state the source of the risk, the privacy or legal implication, the operational consequence, and the timing priority in a single compact entry.
- If multiple effective dates or deployment dates appear in the source set, analyze each date separately and tie the result to the relevant launch milestone.

## 6. Output structure conventions

- Draft the document as a privacy impact assessment organized by risk category, with a short legal framework section up front and a recommendations section at the end.
- Use a consistent entry format for each risk:
  - Risk description
  - Privacy and legal analysis
  - Recommendation
  - Responsible party
  - Priority classification: pre-go-live or post-go-live
- Use an ordinal severity label for each risk entry, and define the scale once at the top of the document; apply it consistently across the assessment.
- When multiple issues are present, list them explicitly before analyzing them so each risk gets its own treatment.
- Every issue entry should close with an action-oriented recommendation, the accountable role, and a timing anchor tied to launch or compliance readiness.
- Include the controlling authority for each legal conclusion by name and section or comparable citation form, using the source documents if they provide the citation and your own legal training if they do not.
- End with a concise Recommended Actions section that groups steps into pre-go-live and post-go-live workstreams.
- Keep the prose factual and operational; do not convert the assessment into a memo about the assessment process itself.
