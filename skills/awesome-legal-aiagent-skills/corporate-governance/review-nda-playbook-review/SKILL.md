---
name: review-nda-playbook-review
task_id: corporate-governance/review-nda-playbook-review
description: Agents produce structured deviation analyses for non-disclosure agreements by comparing each agreement against the applicable standard playbook positions, classifying deviations by severity, and summarizing portfolio-level triage in a table.
activates_for: [planner, solver, checker]
---

# Skill: NDA Playbook Review — Multi-Agreement Triage and Deviation Report

## 1. Subject-matter triage (only if applicable)

- Treat the task as a comparison exercise across multiple NDAs against a fixed playbook, not as a free-form contract summary.
- First identify every agreement in scope and confirm whether each is a distinct NDA, an amendment, or a variant form; then analyze each one separately.
- If the source set contains timing information relevant to renegotiation, renewal, expiration, or existing disclosure risk, carry it into the prioritization.
- If any agreement contains a memory-based residuals concept or equivalent exception, flag it immediately and treat it as materially significant.

## 2. Failure modes the skill is correcting

- Baseline identifies deviations one-by-one without a portfolio-level summary that allows side-by-side comparison and prioritization across all NDAs.
- Baseline labels issues narratively without a uniform severity scale, so the business cannot distinguish drafting preferences from material risk.
- Baseline misses clauses that materially narrow confidentiality protection through exclusions, survival limits, disclosure permissions, or weakened remedial language.
- Baseline fails to treat residuals or memory carve-outs as a major confidentiality risk when they undercut protection for information retained after review.
- Baseline does not connect individual deviations to the combined agreement-level risk posture.
- Baseline states that an NDA is problematic without tying each point back to the playbook position, the actual wording, and the downstream consequence for the company.
- Baseline omits concrete next steps, leaving the report as diagnosis only rather than a usable renegotiation roadmap.

## 3. Legal frameworks / domain conventions that apply

- Use a playbook-deviation methodology: compare each NDA term against the approved standard position issue by issue; do not analyze the agreement as if it were being negotiated from first principles.
- Apply a consistent ordinal severity scale across all deviations: Critical, High, Medium, Low. Define the scale once and use it uniformly.
- Treat confidentiality scope, exclusions, survival, injunctive relief, residuals, return/destroy, and permitted disclosures as core review areas.
- Assess whether the definition of confidential information is narrowed by broad exclusions or missing carve-backs that should preserve protection for disclosed materials.
- Assess whether the survival period leaves long-lived confidential information exposed after termination; for trade-secret-type information, shorter survival can be a material concern.
- Assess whether remedial language preserves access to equitable relief and avoids language that makes emergency relief harder to obtain.
- Assess whether the disclosure regime is too permissive by allowing recipients or third parties broader access than the playbook allows.
- Use generally recognized NDA practice concepts where needed, including irreparable harm, equitable relief, confidentiality carve-outs, and survival of obligations, but keep the analysis anchored to the playbook comparison.
- If a source document expressly states a governing standard or authority, cite it as provided in the materials; otherwise, rely on the NDA playbook position and ordinary NDA drafting practice.

## 4. Analytical scaffolds

- Begin by enumerating the NDAs in scope so each agreement receives a separate pass and a separate row in the portfolio summary.
- For each NDA, screen first for any residuals, memory exception, or similar unrestricted-use concept before moving to the remaining provisions.
- For each issue, close the analysis by stating: the playbook position, the actual NDA wording or faithful summary, why it deviates, the practical consequence for the company, and the severity.
- Where the source set provides dates, durations, or disclosure history, use them to calibrate urgency and risk; if no timing is provided, say so and avoid inventing it.
- Where clauses interact, note the relationship rather than treating them in isolation; for example, a narrow confidentiality definition may be compounded by broad exclusions or a short survival period.
- Classify the agreement-level risk based on the strongest deviation and the cumulative effect of the others; do not rely only on the single most severe issue if multiple moderate deviations combine to create a higher overall posture.
- Rank recommended actions by urgency, with the highest-risk agreements first and the most material provisions to renegotiate at the top.

## 5. Vertical / structural / temporal relationships (only if applicable)

- If an NDA is nearing expiration, renewal, or renegotiation, state that timing as part of the actionability analysis.
- If confidential information has already been shared under an agreement with a serious deviation, flag the possibility that the risk is already live rather than merely prospective.
- If the same deviation appears in more than one agreement, note the pattern and use it to support portfolio-level prioritization.

## 6. Output structure conventions

- Produce a structured deviation report suitable for document export, with a short executive summary, a portfolio comparison table, per-agreement analysis, and a recommendation section.
- Open with a severity legend that defines Critical, High, Medium, and Low in plain language.
- Include a portfolio table listing each agreement, a non-specific counterparty type, overall risk rating, severity counts, and recommended action.
- For each NDA, include a compact deviation table with columns for provision category, playbook position, NDA language or summary, deviation description, severity, and consequence.
- Follow each table with a brief narrative that explains the most material deviations and how they interact.
- Use the report to distinguish between substantive deviations and drafting preferences; not every deviation warrants the same remediation priority.
- End with a Recommended Actions section that states the action, the responsible role, and the timing anchor or urgency level.
- Keep agreement identifiers generic unless the source materials require a label; do not invent or expose names not necessary to the analysis.
