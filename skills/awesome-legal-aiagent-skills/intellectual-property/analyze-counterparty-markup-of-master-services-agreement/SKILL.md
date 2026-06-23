---
name: analyze-counterparty-markup-msa
task_id: intellectual-property/analyze-counterparty-markup-of-master-services-agreement
description: Systematic deviation analysis of a vendor-redlined master services agreement against the company template and contracting playbook, with risk classifications and counter-positions.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Master Services Agreement

## 1. Subject-matter triage
- Confirm the review is a true markup comparison against the approved MSA template and the current contracting playbook, not a standalone contract interpretation exercise.
- Identify the governing document set up front: template baseline, playbook positions, redlined draft, and any deal-side communications that explain why changes were proposed.
- If multiple redline versions or multiple counterparties are present, enumerate each version and counterparty separately before analysis and keep findings version-specific.
- If the redline is paired with emails, term sheets, or comment logs, treat them as interpretive context for intent and priority, not as substitutes for the contract text.

## 2. Failure modes the skill is correcting
- Cataloguing changed language without classifying each deviation against the controlling template and playbook position.
- Treating liability cap, consequential damages, indemnity, insurance, and related risk-transfer terms as isolated edits rather than one allocation structure.
- Missing quiet changes in definitions, order of precedence, affiliate language, service levels, audit rights, or flow-downs that alter the legal effect of the MSA.
- Focusing only on visible strike/insert changes and overlooking substantive shifts in fallback language, cross-references, or exception carve-outs.
- Analyzing clause-by-clause in isolation without assessing whether multiple edits, taken together, reallocate operational, regulatory, or litigation risk.
- Ignoring accompanying communications that reveal what the counterparty is actually prioritizing in negotiation.
- Stopping at diagnosis without a clear disposition and counter-language for the business team.

## 3. Legal frameworks / domain conventions that apply
- Use the company template as the baseline and the playbook as the controlling set of acceptable, fallback, and prohibited positions for each clause family.
- Read the MSA as a system of interlocking provisions: limitation of liability, indemnity, disclaimer, remedies, termination, confidentiality, data security, and compliance obligations should be tested together where they interact.
- Evaluate risk allocation by clause family, not by isolated sentence edits; a narrow carve-out can nullify a broad cap or exclusion.
- Apply standard MSA conventions for order of precedence, incorporated exhibits, change control, service levels, assignment, subcontracting, and audit/access rights when the markup touches those concepts.
- Treat data security, privacy, breach notice, and subcontractor provisions as mandatory operational protections where the playbook requires them.
- Treat governing law, venue, arbitration, injunctive relief, and equitable remedies as dispute-resolution risk levers when changed.
- For any legal conclusion stated in the report, anchor it to the controlling source in the document set or the applicable clause family in the playbook; do not state a conclusion as free-floating commentary.

## 4. Analytical scaffolds
- Template-to-redline mapping: for each deviation, identify the template clause it amends, the change requested, and the practical effect of the edit.
- Playbook classification: label each issue using the playbook’s acceptance, fallback, or rejection posture, and translate that posture into a clear risk rating.
- Ordinal severity: use a uniform severity scale such as Critical / High / Medium / Low, define it once, and apply it consistently across all issues.
- Issue-closing triad: for each issue, state the relevant scale or threshold from the source documents when available, tie the issue to another clause or exhibit it affects, and explain the downstream consequence for the client.
- Liability-structure analysis: review cap, exclusions, indemnity, defense, insurance, and carve-outs as one integrated allocation package; state the combined effect, not just the edit-by-edit effect.
- Cross-reference analysis: trace whether a change is reinforced, weakened, or contradicted elsewhere in the redline, including definitions, exhibits, SOWs, or security addenda.
- Communication cross-check: note which redline edits are highlighted in side correspondence and whether the correspondence understates or overstates the contractual significance.
- Counter-position formulation: for each material deviation, provide concise fallback language or negotiating posture that moves the clause back toward the playbook position.

## 5. Vertical / structural / temporal relationships
- When a clause is defined by another section, analyze the vertical dependency before assigning risk; definition changes can rewrite multiple operative sections.
- When an obligation survives termination, assignment, renewal, or expiry, identify that temporal effect and state whether the redline narrows or expands the survival footprint.
- When one clause serves as an exception to another, test the exception chain from general rule to carve-out to sub-carve-out to final effect.
- When schedules, exhibits, statements of work, service levels, security addenda, or order forms modify the MSA, compare them against the template and note any precedence conflict.
- When multiple counterparties, affiliates, subcontractors, or service locations are involved, separate entity-specific obligations from entity-neutral language and assess whether the redline broadens the affected party set.
- When a change affects remedies, termination, or suspension rights, identify any operational timing consequence for service delivery, cure, transition assistance, or wind-down.

## 6. Output structure conventions
- Produce an issue-led deviation report, not a narrative contract summary.
- Start with a short severity key, then a table or equivalent list that includes: clause reference, baseline position, redline deviation, severity, playbook disposition, risk rationale, and recommended counter-position.
- Use a row or entry for each distinct issue; do not merge materially different deviations into one generic bucket.
- For each entry, include the clause family it belongs to and a concise note on why the change matters in practice.
- Where the source set contains multiple versions or counterparties, keep the analysis separated by version or party and label it clearly.
- Include an aggregate risk assessment that states the overall posture of the markup and identifies the handful of provisions driving the result.
- End with a Recommended Actions block using imperative verbs, the responsible role, and a timing anchor tied to the deal timeline or a specific milestone in the source materials.
- Keep counter-positions practical and negotiable: use fallback language, restore-template positions, or narrowed carve-outs rather than abstract criticism.
- If the deliverable is being produced to a file, ensure the primary artifact is created first and is non-empty before any summary is finalized.
