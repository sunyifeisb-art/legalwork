---
name: extract-multi
task_id: data-privacy-cybersecurity/extract-multi
description: Multi-state privacy obligation extraction memos fail when the agent does not apply each statute's applicability threshold to the company's actual profile before extracting obligations and does not differentiate between obligations that are unique to one state and those that are shared across states.
activates_for: [planner, solver, checker]
---

# Skill: Multi-State Privacy Compliance Obligation Extraction and Statutory Analysis Memorandum

## 1. Subject-matter triage

Read the company overview and engagement materials first, then the attached statutes. Identify the company’s data practices, operating footprint, consumer-facing touchpoints, sensitive-data categories, processors/vendors, biometric exposure, and any industry-specific constraints before deciding which statutes apply.

Enumerate the potentially applicable statutes explicitly before analysis. If only one statute truly applies, say so and explain why. If multiple statutes may apply, analyze each against the company profile separately; do not collapse threshold analysis into a generic privacy summary.

## 2. Failure modes the skill is correcting

- Treating the statutes as a statute-by-statute digest instead of a cross-jurisdictional obligation matrix that shows shared duties, unique duties, and conflicts.
- Skipping applicability thresholds and over-including inapplicable laws, which inflates the memo and weakens credibility.
- Missing biometric-specific rules or treating them as peripheral, despite distinct consent, retention, destruction, use-limitation, and enforcement consequences.
- Describing privacy duties in vague business language instead of grounding each legal conclusion in the controlling statutory section.
- Failing to tie each gap to the company’s actual posture, which leaves the board without a usable remediation picture.
- Omitting the practical consequence of each gap for operations, enforcement, or litigation exposure.
- Presenting the memo as a list of observations rather than a prioritized compliance plan with clear next steps.

## 3. Legal frameworks / domain conventions that apply

- Apply only statutes whose scope and threshold are satisfied by the company profile; note the basis for applicability and non-applicability.
- Treat modern state privacy laws as a family with overlapping structures: consumer rights, notices, sensitive-data consent or opt-out mechanics, processor contracts, security, assessments, and state enforcement.
- Where biometrics are implicated, apply biometric-specific rules as a separate compliance lane because they often add written consent, retention/destruction policies, use/disclosure limits, and private-enforcement risk.
- Use the statutory text itself as the controlling authority. Cite the relevant section for each obligation or exemption rather than stating the duty abstractly.
- When multiple applicable statutes cover the same topic, compare them by obligation category and identify the most demanding practical requirement for implementation.
- Board-ready analysis should separate: applicability, obligation, current posture, gap, priority, and consequence.

## 4. Analytical scaffolds

- Start with a threshold screen:
  - What data does the company collect, process, share, or sell?
  - Does the company meet each statute’s applicability trigger?
  - Are there exclusions, entity-level exemptions, or data-type carveouts?
- Then build a category-based matrix:
  - consumer rights and request handling
  - notices and disclosures
  - sensitive data treatment
  - consent / opt-out mechanics
  - processor / vendor contracts
  - security safeguards
  - risk assessments or similar internal governance
  - biometric-specific requirements if relevant
- For each applicable statute and category, record:
  - the statutory basis
  - whether the company appears compliant, partially compliant, or noncompliant on the facts provided
  - the operational gap
  - the consequence of the gap
  - whether the obligation is shared across jurisdictions or unique to one statute
- Where statutes differ, distinguish:
  - opt-in versus opt-out treatment
  - consumer rights scope and response timing
  - controller versus processor responsibilities
  - notice content and delivery mechanics
  - biometric requirements that do not appear elsewhere
- Prioritize remediation by regulatory risk and implementation impact:
  - immediate fixes for threshold-verified, high-exposure gaps
  - medium-term governance and contracting updates
  - longer-term process and documentation changes
- If the source materials do not support a conclusion, mark the item as unresolved rather than guessing.

## 5. Vertical / structural / temporal relationships

Analyze how obligations layer across entities, data types, and business processes. Separate company-level duties from vendor-facing or processor-facing duties, and separate ordinary personal data obligations from sensitive-data and biometric obligations.

Track timing where relevant:
- notice timing
- response deadlines for consumer requests
- implementation sequencing for policies, contracts, assessments, and training
- remediation priorities tied to regulatory risk or operational dependency

Where one compliance control can satisfy multiple statutes, identify it as a shared control. Where one statute imposes an extra step, isolate it as a jurisdiction-specific add-on.

## 6. Output structure conventions

- Produce a board-ready memorandum in a conventional legal format:
  - executive summary
  - applicability and scope analysis
  - obligation matrix
  - gap analysis
  - remediation priorities / roadmap
- Use an ordinal severity scale and define it once at the top of the memo; apply it uniformly to each gap or recommendation.
- For each issue or gap, include:
  - severity
  - statutory citation
  - short description of the obligation
  - current company posture
  - consequence of the gap
  - recommended remediation
- Make the matrix readable as a comparison tool:
  - rows for obligation categories
  - columns for each applicable statute
  - cells showing duty, posture, and delta
- Differentiate shared obligations from unique obligations in the narrative summary.
- End with a Recommended Actions section that gives concrete next steps, assigns them to a responsible role, and ties them to a timing anchor or compliance milestone.
- Keep the filename aligned with the task instruction: `privacy-obligations-matrix-memo.docx`.
