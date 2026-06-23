---
name: multi-state-privacy-law-gap-analysis
task_id: corporate-governance/compare-state-privacy-law-requirements
description: Multi-state consumer privacy law gap analysis comparing a current privacy program, data inventory, and vendor agreements against enacted state comprehensive privacy laws, identifying data classification issues, state-specific stricter requirements, and universal opt-out signal obligations.
activates_for: [planner, solver, checker]
---

# Skill: Multi-State Consumer Privacy Law Gap Analysis

## 1. Subject-matter triage

- Confirm the company is plausibly within scope for one or more enacted state comprehensive privacy laws before doing state-by-state analysis.
- Separate enacted-law coverage from planned-market expansion, because planned entry into an effective state is current compliance work, not hypothetical planning.
- Identify the source set by document type first: privacy notice, inventory, vendor terms, internal policy, assessment records, intake forms, and technical implementation notes.
- Treat the presence of multiple states, multiple data types, and multiple processing purposes as distinct analytical dimensions that each require independent checking.

## 2. Failure modes the skill is correcting

- Accepting the provided data inventory classification without re-testing whether specific data types meet biometric, health, sensitive, or comparable statutory definitions.
- Treating exemptions for regulated health, protected data, or similar categories as blanket shields when the processing falls outside the exempt entity, dataset, or activity.
- Missing universal opt-out obligations that are already effective and mislabeling them as future work.
- Collapsing different states into a California-only baseline and overlooking stricter notice, minimization, opt-out, or sensitive-data rules elsewhere.
- Assuming a response workflow that satisfies one state also satisfies faster or otherwise different state deadlines.
- Failing to spot data protection assessment duties for targeted advertising, sale, profiling, or other heightened-risk processing.
- Assuming de-identified data is outside scope without checking linkage, crosswalk, or re-identification capability retained by the company.
- Overlooking profiling opt-out rights where analytics are used for legal or similarly significant effects.
- Treating enforcement risk as uniform despite differences in cure periods and AG enforcement posture.
- Stopping at issue description without tying each issue to scope, interacting documents, and operational consequence.

## 3. Legal frameworks / domain conventions that apply

- State comprehensive consumer privacy laws must be analyzed state by state under each law’s own applicability threshold, definitions, rights, notice rules, opt-out mechanics, sensitive-data treatment, assessment triggers, and enforcement structure.
- Coverage analysis should rely on the relevant statute and implementing provisions for each enacted state law, not on a single baseline substitute.
- Sensitive-data classification turns on statutory definitions; health-monitoring outputs, device-derived measurements, and similar data may fall within sensitive or specially regulated categories depending on the jurisdiction.
- Health and regulated-data exemptions are generally limited by entity, dataset, or activity and do not automatically extend across unrelated products, affiliates, or business lines.
- Consumer rights regimes commonly include access, deletion, correction, portability, and appeal rights, but the response timeline and procedural details vary by state.
- Universal opt-out regimes require recognition of browser or device signals where the applicable state law and effective date make the obligation current.
- State-specific stricter requirements may include notice content, sale or targeted advertising constraints, purpose limitation, minimization, and special rules for sensitive categories.
- Data protection assessments are required under many state laws for processing that presents heightened risk, including targeted advertising, sale, profiling, and sensitive-data processing; the applicable statute and retention expectations should be named.
- De-identification status depends on whether the business retains linkage or crosswalk data that could reasonably enable re-identification.
- Profiling opt-out rights may apply where outputs are used for decisions with legal or similarly significant effects.
- Enforcement risk differs materially between states with cure periods and states where the cure opportunity is limited or absent.

## 4. Analytical scaffolds

- Build a state-by-state applicability table first, and proceed only for states where coverage is confirmed.
- For each state, map: coverage threshold, personal-data definition, sensitive-data categories, consumer rights, universal opt-out requirement, profiling rights, assessment trigger, cure period, and any notice-specific rule that exceeds the baseline program.
- For each inventory category, re-test classification against the controlling state definition and flag any mismatch as a compliance gap, not a mere taxonomy preference.
- For each exemption relied upon, verify the entity, dataset, and processing activity all fit the exemption’s scope.
- For each consumer-rights workflow, compare the current response and appeal process against the state’s deadline and procedural requirements.
- For each opt-out mechanism, identify whether the state requires recognition of universal signals, whether the effective date has passed, and whether the current stack recognizes the signal automatically.
- For each high-risk processing activity, confirm whether a documented assessment exists, whether it addresses the actual use case, and whether it is retained for review.
- For each de-identification claim, check whether internal linkage data, hashes, or other connectors undermine the claim under the state standard.
- For each profiling use case, determine whether the output is used for decisions that trigger a statutory opt-out right.
- For each gap, state the legal rule, the affected process, the current status, and the operational consequence.

## 5. Vertical / structural / temporal relationships

- A single misclassification can cascade into notice, consent, opt-out, and assessment defects, so remediation should be sequenced to fix classification before downstream disclosures and controls.
- Universal opt-out defects are time-sensitive once effective dates have passed; policy edits alone are insufficient if the technical stack does not recognize signals.
- Exemption analysis must track organizational boundaries and product boundaries separately; a compliant health-data workflow in one line of business can still create violations in another.
- States with shorter timelines or no meaningful cure opportunity should be prioritized ahead of states where the immediate enforcement risk is lower.
- Planned market entry should be treated as present-tense compliance work if the target state’s law is already effective.

## 6. Output structure conventions

- Begin with a concise executive summary stating overall risk posture, the highest-priority gap themes, and which items are current non-compliance versus forward-looking remediation.
- Include a multi-state comparison matrix organized by state, using conventional columns such as law, applicability, data categories, rights, opt-out signals, assessments, cure/enforcement posture, and current status.
- Define a simple ordinal severity scale once and use it consistently for every gap entry.
- Include an issue-by-issue gap section that gives, for each issue, the severity, the governing state rule, the implicated process or data set, the current deficiency, and the consequence if not remediated.
- Where a rule depends on multiple states or multiple data types, enumerate the relevant states or categories first and then analyze each one separately rather than combining them into a single generic pass.
- Include a remediation roadmap ordered by urgency, with immediate fixes first, then near-term policy and technical changes, then longer-term governance updates.
- End with an explicit Recommended Actions block that assigns each action to a role or owner and ties it to a deadline, effective date, or other timing anchor.
- Cite the controlling statutory or regulatory authority by name and section for each legal proposition relied upon; do not state a conclusion without naming the rule that supports it.
- Use conventional privacy-compliance terminology and avoid idiosyncratic section headings that obscure the matrix, gap analysis, roadmap, and enforcement-risk conclusions.
