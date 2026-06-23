---
name: fda-device-registration-rule-gap-analysis
task_id: corporate-governance/compare-proposed-fda-rule-against-current-device-registration-requirements
description: Gap analysis comparing a proposed FDA device registration rule against current device registration and listing requirements and a client's device portfolio, verifying a third-party consulting memo and addressing client-specific questions about transition timelines and implementation obligations.
activates_for: [planner, solver, checker]
---

# Skill: FDA Device Registration Rule Gap Analysis — Proposed vs. Current Requirements

## 2. Failure modes the skill is correcting

- Accepting a third-party consulting memo's conclusions without independently testing them against the proposed rule text and the current device-registration framework.
- Collapsing distinct compliance triggers into one bucket, especially where registration, listing, disclosure, cybersecurity, correspondent, and penalty provisions operate differently.
- Missing a portfolio-specific impact because the analysis stays at the rule level and does not map obligations to each device class, submission pathway, and operating entity.
- Treating transition timing as uniform when the source materials provide different effective dates, phase-ins, or compliance milestones.
- Overlooking ambiguous definitional scope that can expand the rule beyond the memo's assumptions, especially for component, software, and manufacturing-related concepts.
- Failing to separate compliance burden from disclosure and confidentiality concerns where the same filing can create both operational and information-protection issues.
- Giving conclusions without anchoring them to the governing statutory or regulatory authority, leaving the analysis vulnerable to challenge or incompleteness.
- Producing diagnosis without action items, even though the task requires a usable gap-analysis memorandum.

## 3. Legal frameworks / domain conventions that apply

- Current device registration and listing regime: distinguish establishment registration from device listing, and identify which entity types and product types are subject to each obligation under 21 CFR Part 807.
- Proposed rule comparison: read the proposal provision-by-provision against the current regulation, using the regulation's operative language and the proposing release's stated purpose, scope, and transition mechanics.
- Threshold-sensitive classification: test whether any proposed exclusion, exemption, or treatment turns on a volume, revenue, function, or role threshold; treat entities near a threshold as classification-sensitive.
- Separate compliance timelines: identify whether the proposal assigns different effective dates, phase-ins, or delayed applicability dates to different categories of obligations, and do not assume one date controls all.
- Pre-market listing obligation: determine whether the proposal creates a listing requirement that attaches before market placement for any subset of devices or submissions, and distinguish that from ordinary post-registration listing practice.
- Component and software scope: compare any proposed definitions touching critical components, software inventories, or related inputs against the client’s actual taxonomy and documentation practices.
- Sole correspondent or filing representative: determine whether the proposal requires a single responsible contact or filing agent and assess the operational implications for delegation, staffing, and control.
- Enforcement and penalties: identify how the proposal structures civil penalties, violations, and unit of assessment; keep per-device, per-filing, and per-violation concepts separate if the text does so.
- Administrative-law exposure: assess whether any provision appears vulnerable under the Administrative Procedure Act or exceeds statutory authority; treat this as a regulatory-risk overlay, not a substitute for compliance analysis.
- Confidential information protections: evaluate whether any new disclosure requirement implicates trade secret or confidential commercial information concerns and separate those issues from filing compliance.
- Controlling authority: cite the governing statute, regulation, or procedural rule for every legal proposition relied on, including 21 CFR Part 807 and any relevant provisions of the Federal Food, Drug, and Cosmetic Act and APA principles.

## 4. Analytical scaffolds

- Third-party memo verification: compare each conclusion in the consulting memo against the proposal and current requirements; identify every incorrect, unsupported, or missing point and state the correction.
- Provision-by-provision gap analysis: analyze each relevant rule change separately, then state whether the client’s current process is compliant, partially compliant, or noncompliant.
- Portfolio mapping: for each device class and operating entity in the portfolio, identify the triggered obligations, the timing hook, and any implementation dependency; if only one portfolio segment is in scope, say so expressly.
- Transition analysis: present each relevant effective date or phase-in separately, then map the client’s compliance steps to the controlling date for that provision.
- Pre-market listing impact: test whether any device in the portfolio would need a listing action before launch, clearance, approval, or other market entry step; flag launch-timing consequences where relevant.
- Threshold and classification check: assess whether the client’s arrangements fall near any proposed threshold and whether the classification could shift across periods or entities.
- Component-scope review: compare the proposal’s definition against the client’s component taxonomy, packaging practices, and software inventory to determine whether additional tracking or comments are needed.
- Sole-correspondent question: answer whether a single responsible contact is required, optional, or operationally advisable, and identify the internal role that would own the function.
- Confidentiality review: isolate any required disclosures that may need protection, separate from whether they must be filed.
- APA-risk review: identify the most challenge-prone provisions and explain whether they should be treated as compliance uncertainty, comment targets, or implementation contingencies.
- Severity and impact labeling: assign each issue an ordinal severity rating and tie it to the affected portfolio segment, compliance deadline, and business consequence.
- Recommendation drafting: convert each issue into an operational recommendation addressed to a named internal role or function, with a timing anchor tied to the rulemaking or implementation milestone.

## 5. Vertical / structural / temporal relationships

- Registration, listing, and disclosure obligations may layer on top of each other; a device can be compliant for one obligation and noncompliant for another on the same timeline.
- If the proposal adds pre-market listing, the filing obligation may precede the market-entry event and therefore affect launch sequencing even when the underlying device approval or clearance remains unchanged.
- If a separate transition date applies to cybersecurity, software inventory, or origin-disclosure provisions, those provisions should be analyzed on their own timeline rather than bundled with core registration changes.
- Where the proposal uses a single-correspondent model, the operational burden is structural rather than transactional: it affects who controls filings, notices, corrections, and updates over time.
- Ambiguous penalty language matters more for broader portfolios because the exposure can scale with the number of affected devices, filings, or violations; treat that ambiguity as a candidate for comment and risk mitigation.
- Confidentiality concerns run parallel to substantive filing duties: the fact that information must be disclosed does not answer whether it should be protected, segregated, or designated.

## 6. Output structure conventions

- Use a memorandum format with clear sections for rule overview, memo verification, portfolio impact, timing, and recommendations.
- Open with a short executive summary that states the overall gap conclusion, the highest-risk provision, and the main implementation takeaway.
- Include a concise severity legend using a uniform ordinal scale and apply it to each issue entry.
- Organize findings by proposed provision, with each finding stating: the current rule baseline, the proposed change, the client-specific impact, and the correction to the consulting memo if relevant.
- Include a separate section that identifies every consulting-memo conclusion needing correction or supplementation.
- Present a transition and implementation table that lists each relevant provision, its controlling authority, its effective or compliance date, and the affected portfolio segment.
- Answer the client’s targeted questions directly within the body, not in an appendix, including sole-correspondent applicability, comment-period timing if available, and critical-component or similar scope questions.
- End with a Recommended Actions block that uses imperative verbs, names the responsible role or function, and ties each step to a filing deadline, comment deadline, launch milestone, or other concrete timing anchor.
- Keep the final deliverable as a gap-analysis memorandum suitable for conversion to `gap-analysis-memorandum.docx`, with operative analysis rather than a narrative about analysis.
