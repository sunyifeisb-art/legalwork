---
name: ai-disclosure-requirements-multi-jurisdiction
task_id: corporate-governance/compare-ai-disclosure-requirements-across-jurisdictions
description: Multi-jurisdiction comparison of AI disclosure requirements across deployment jurisdictions, identifying misclassifications in prior analyses, consent-versus-disclosure distinctions, and a prioritized remediation roadmap mapped to law effective dates.
activates_for: [planner, solver, checker]
---

# Skill: AI Disclosure Requirements Across Jurisdictions Comparison

## 2. Failure modes the skill is correcting

- Treating all AI-facing transparency language as if it creates the same legal obligation, without first confirming whether the covered conduct is disclosure, notice, explanation, opt-in consent, or a separate due-process style safeguard
- Collapsing distinct jurisdiction-by-jurisdiction obligations into one blended compliance conclusion, which hides differences in scope, trigger, effective date, and remediation path
- Missing when a prior analysis characterizes a consent regime as a mere disclosure regime, or vice versa, leading to the wrong product and legal fix
- Treating already-effective obligations as future work, which misstates urgency and distorts remediation sequencing
- Failing to tie each issue back to the governing legal text, the source documents’ own characterization, and the operational consequence for the deployment program
- Omitting an explicit severity ranking, which prevents the client from seeing which jurisdictional gaps are immediate blockers versus lower-priority cleanups
- Producing diagnosis without a concrete next-step plan that assigns owners and deadlines, leaving the memo non-actionable

## 3. Legal frameworks / domain conventions that apply

- AI transparency laws are scope-limited: confirm the covered system type, deployment context, and regulated actor before assuming any disclosure duty
- Disclosure, notice, explanation, and consent are distinct legal concepts; a jurisdiction that requires affirmative consent is not satisfied by a disclosure banner alone
- Deployer obligations may differ from provider obligations; the client’s role in the deployment chain controls the compliance burden
- Some regimes layer AI transparency with automated decision-making, consumer protection, data protection, or health-specific rules; those obligations must be analyzed separately but can operate concurrently
- Effective-date mechanics matter: enacted laws with past effective dates create present compliance duties, while future-effective laws support planning but not delay
- Pre-deployment assessments, if required, are usually jurisdiction-specific and tied to a named statutory or regulatory provision; one generic assessment is not automatically sufficient
- Penalty exposure and private enforcement rights, where available, are part of the comparative analysis because they affect remediation priority and legal risk

## 4. Analytical scaffolds

- Start by enumerating the deployment jurisdictions and the governing instruments for each one before analysis; do not merge jurisdictions that have different texts, dates, or enforcement structures
- For each jurisdiction, identify the controlling authority by name and cite the relevant section, article, part, or schedule that creates the AI disclosure or consent obligation
- For each jurisdiction, classify the obligation precisely as disclosure-only, consent-required, disclosure-plus, or no covered AI transparency duty on the current facts
- For each jurisdiction, confirm the effective date and determine whether the obligation is already operative, phased in, or not yet in force
- For each jurisdiction, compare the internal regulatory analysis, gap analysis, tech spec, tracker, consent form, and EU briefing against the governing text to locate misstatements, omissions, or overbroad assumptions
- For each identified gap, state the concrete operational consequence for the tool: product UI changes, consent flow changes, notice content updates, deployment gating, documentation, or legal review
- Where the system implicates automated decision-making or sensitive data processing, analyze the overlapping obligations separately and explain how they affect the disclosure or consent design
- If a pre-deployment assessment is required, identify the triggering provision and the deployment milestone it must precede
- If penalty provisions or private actions exist, state the exposure mechanics and explain how that changes sequencing and urgency
- Close each issue with the governing rule, the document interaction that shows the mismatch, and the downstream effect on the client’s rollout or risk profile

## 5. Vertical / structural / temporal relationships

- Jurisdictions should be compared in parallel, but remediation should be sequenced by legal urgency, effective date, and implementation complexity
- Consent changes typically require product, engineering, and legal coordination; simple notice updates may be faster, but they do not replace consent where consent is required
- An obligation that is already in force outranks a future-effective obligation even if the future law is broader or more operationally burdensome
- A single deployment workflow may need different jurisdiction-specific branches; do not assume one global disclosure layer satisfies every market

## 6. Output structure conventions

- Use a comparative memorandum format with a short executive summary, then a jurisdiction-by-jurisdiction analysis, then a cross-jurisdiction gap register, then a prioritized remediation plan
- Define a uniform severity scale once at the top and apply it consistently to every issue identified
- For each jurisdiction entry, include the governing authority, the obligation characterization, the effective date, any enforcement or private-action feature, and the practical remediation step
- For each issue, include: severity, controlling authority, why the current analysis is wrong or incomplete, the specific source-document mismatch, and the consequence for deployment
- Where the record supports it, distinguish between the client’s current state, the target compliance state, and the interim controls needed before full remediation
- End with a Recommended Actions section that assigns each step to a responsible role and anchors timing to an effective date, deployment milestone, or immediate follow-up requirement
- Keep the memo decision-oriented; the purpose is to identify what must change, in what order, and why that order is legally necessary
