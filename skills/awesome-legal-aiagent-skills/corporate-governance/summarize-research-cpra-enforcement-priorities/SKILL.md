---
name: summarize-research-cpra-enforcement-priorities
task_id: corporate-governance/summarize-research-cpra-enforcement-priorities
description: Agents summarize current privacy-enforcement priorities generically and prepare an executive briefing memorandum that prioritizes exposure areas, analyzes opt-out signal handling, evaluates whether advertising-related data disclosures implicate cross-context behavioral advertising opt-out obligations, and assesses whether privacy disclosures, vendor contracts, and inquiry-response practices support a defensible compliance posture.
activates_for: [planner, solver, checker]
---

# Skill: Privacy Enforcement Priorities — Executive Briefing Memorandum

## 1. Subject-matter triage (only if applicable)

- Treat the source set as a privacy-compliance and enforcement-risk review, not a general privacy-law survey.
- Identify whether the materials include a regulator inquiry, audit findings, vendor terms, operational emails, or policy documents; if so, analyze each as a separate risk input before synthesizing the memo.
- Enumerate the distinct exposure areas first when multiple systems, disclosures, vendors, or inquiry topics appear; do not merge them into a single generic privacy issue.
- If only one enforcement topic is actually present, say so and explain why the remaining categories are not implicated.

## 2. Failure modes the skill is correcting

- Baseline summarizes privacy-law requirements without tying them to the regulator’s current enforcement focus, producing a generic memo instead of a prioritized briefing.
- Baseline discusses opt-out compliance abstractly without testing whether browser-based or similar signals are detected, honored, logged, and operationalized.
- Baseline flags advertising-related disclosures without determining whether they function as cross-context behavioral advertising, sharing, or another opt-out-triggering disclosure under applicable guidance.
- Baseline overlooks stale, incomplete, or practice-mismatched privacy disclosures that weaken the company’s good-faith and transparency position.
- Baseline reviews vendor paper only for commercial terms and misses privacy-required restrictions on use, retention, onward disclosure, assistance, and audit support.
- Baseline treats a regulator inquiry as background instead of a deadline-driven response obligation with document collection, custodians, and submission sequencing.
- Baseline gives issue descriptions without enough severity calibration, document cross-references, and concrete remediation direction.

## 3. Legal frameworks / domain conventions that apply

- **Current enforcement priorities:** Assess exposure against the privacy regulator’s present enforcement themes as reflected in public actions, guidance, inquiry materials, and summaries in the source set; enforcement risk depends on the agency’s current focus, not only the black-letter statute.
- **Opt-out signal compliance:** Where recognized browser or device signals are required to be honored, analyze whether the company receives, interprets, and acts on them as valid opt-out requests, including downstream propagation to relevant systems and vendors.
- **Cross-context behavioral advertising / sharing:** If consumer data is disclosed to ad-tech or advertising recipients, determine whether the practice is functionally a sharing or disclosure for targeted advertising under the applicable privacy regime, regardless of label or compensation structure, and whether the corresponding consumer-facing opt-out mechanism is implemented.
- **Privacy notice accuracy and currency:** Compare actual data practices against the operative privacy disclosures for consistency, completeness, and update cadence; stale or materially incomplete notices can undercut transparency and compliance defenses.
- **Vendor and service-provider contracting:** Review agreements for privacy-required restrictions on processing, retention, disclosure, subprocessors, security, cooperation, and audit or certification rights where the framework expects them.
- **Data minimization and purpose limitation:** Test whether collection, use, retention, and disclosure are reasonably necessary for disclosed purposes and whether internal practice exceeds those purposes.
- **Regulatory inquiry response obligations:** If an inquiry, notice, information request, or investigative demand is present, identify the response deadline, requested materials, document sources, and action owners needed to meet the deadline.
- Cite the controlling authority for each legal proposition used, including the applicable statutory provision, regulation, or officially stated agency guidance reflected in the source materials or general legal framework.

## 4. Analytical scaffolds

- **Enforcement-priority matrix:** For each distinct current enforcement topic identified from the materials, assess whether the company’s documented practice creates exposure and assign a severity rating of Critical, High, Medium, or Low.
- **Opt-out signal implementation assessment:** Test whether the company honors recognized opt-out signals end-to-end; if the record includes traffic, users, event counts, or similar scale data, use that to calibrate the reach of any failure.
- **Disclosure mapping:** List each third party, service, ad-tech recipient, analytics provider, or similar recipient appearing in the source materials and assess whether the transfer implicates a targeted-advertising or comparable opt-out regime.
- **Notice audit:** Identify the operative privacy notice, its last update timing if available, and any mismatch between stated and actual practices.
- **Contract review:** Compare vendor terms against required privacy provisions and isolate missing or weak clauses that create compliance or audit risk.
- **Inquiry-response plan:** If the source set includes a regulator inquiry, identify the deadline, requested categories of information, likely custodians, and any gaps that must be filled before submission.
- **Remediation prioritization:** Separate immediate fixes from longer-lead contract, policy, and vendor-management changes, and explain why sequencing matters.

## 5. Vertical / structural / temporal relationships (only if applicable)

- When a regulator deadline exists, place response preparation ahead of broader remediation that will not affect the immediate filing.
- Technical opt-out signaling fixes are usually faster than contract amendments; policy updates are often faster than vendor-paper changes; reflect that sequencing in recommendations.
- If multiple business units, websites, or data flows are implicated, analyze them in order of likely regulatory salience and operational urgency.
- Where a practice depends on vendor cooperation, note that remediation timing may be constrained by counterparties even if the legal issue is already clear.

## 6. Output structure conventions

- Write an executive briefing memorandum, not a law school issue spotter.
- Open with a concise risk summary that ranks the principal exposure areas and states the overall compliance posture.
- Include a front-loaded risk table with: issue area, severity, current exposure, supporting source basis, and recommended action.
- For each issue, state the applicable authority, the company conduct or document feature, why it matters under that authority, and the practical consequence if unremedied.
- Keep each issue entry disciplined: severity first, then factual basis, then legal basis, then consequence, then remediation.
- End with an explicit Recommended Actions block that assigns each action to a business owner, privacy lead, counsel, or other responsible role and ties it to a deadline or urgency milestone.
- Use conventional memo headings rather than a rubric-like checklist; organize by enforcement priority and remediation sequence.
- If the source materials contain no inquiry deadline or no update date for a document, say that expressly rather than inferring one.
