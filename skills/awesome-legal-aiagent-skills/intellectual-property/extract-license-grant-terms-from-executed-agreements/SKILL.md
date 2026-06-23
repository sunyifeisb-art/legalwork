---
name: extract-license-grant-terms-executed-agreements
task_id: intellectual-property/extract-license-grant-terms-from-executed-agreements
description: Create a matrix summarizing license grant terms across multiple executed technology license agreements and assess how those terms interact with a planned integration, using cross-agreement comparison and conflict identification.
activates_for: [planner, solver, checker]
---

# Skill: Extract License Grant Terms from Executed Agreements

## 1. Subject-matter triage

Treat the seven executed agreements as separate source instruments first, then compare them only after each has been fully extracted. Identify, for each agreement, the licensor, licensee, licensed technology, grant language, and any integration-relevant restriction before drawing portfolio conclusions.

Enumerate the agreements up front and keep a one-to-one extraction pass for each. If a term is absent in one agreement but present in another, preserve that difference rather than harmonizing it away.

## 2. Failure modes the skill is correcting

- Capturing only the headline grant while missing scope limiters that control actual permitted use
- Collapsing all agreements into one generic summary and losing agreement-specific restrictions
- Missing sublicensing, assignment, change-of-control, audit, ownership, or data-processing provisions that affect integration feasibility
- Failing to compare the planned integration against each grant boundary, resulting in false comfort or overbroad risk flags
- Overlooking cross-agreement friction where one agreement’s permissions or restrictions are inconsistent with another’s
- Treating absence of an express prohibition as affirmative permission

## 3. Legal frameworks / domain conventions that apply

- License scope is determined by the combined reading of the defined technology, field of use, territory, exclusivity, and any express carve-outs
- Sublicensing and third-party access require express authority or a clearly sufficient grant; do not infer them from a general use right
- Assignment and change-of-control restrictions are commonly enforced according to their text; broad anti-assignment language can reach indirect transfers
- Improvement, derivative work, and feedback ownership provisions govern who owns integration outputs and downstream adaptations
- Audit rights, recordkeeping duties, and inspection procedures affect compliance exposure even if the integration is otherwise permitted
- Data-use, privacy, security, and DPA provisions must be checked where the integration touches personal data or regulated data flows
- Open-source or embedded third-party component obligations should be flagged when the licensed stack includes redistributed software
- Most-favored or price-protection clauses, if present, can create cross-agreement sensitivity and should be tested against the portfolio
- The governing law and interpretation rules in the agreement control how ambiguous grant language is read; use the agreement’s own defined terms and construction clauses
- Where the source documents incorporate external standards or policies, treat the incorporated text as part of the operative framework and identify it separately

## 4. Analytical scaffolds

1. For each agreement, extract the grant, reserved rights, exclusions, term, territory, field of use, exclusivity, sublicensing, assignment, audit, ownership, and data-related provisions
2. For each agreement, identify the exact integration activity to which the grant is being compared: internal use, customer-facing deployment, hosting, distribution, modification, or third-party access
3. Compare the planned integration against each agreement’s scope limits, including whether the activity depends on rights not expressly granted
4. Test whether any agreement requires consent, notice, approval, certification, or flow-down terms before the integration can proceed
5. Compare the seven agreements against one another for inconsistent grant breadth, conflicting exclusivity, incompatible transfer restrictions, or differing IP ownership outcomes
6. Separate clearly permitted, uncertain, and prohibited uses; do not blend them into one blended conclusion
7. When a risk is identified, state the triggering clause, the interacting clause or document, and the operational consequence for the integration plan
8. Prefer clause-based reasoning over inference; if a point depends on an unstated assumption, mark it as uncertain
9. Where remediation is possible, identify the narrowest practical path: consent, amendment, implementation change, segregation of functionality, or data-flow restriction
10. Keep the extraction neutral and source-tethered; do not editorialize beyond the compliance implications supported by the text

For every issue flagged, tie the observation to the relevant agreement text, identify the interacting provision in the same or another source document, and state the downstream integration impact.

## 5. Vertical / structural / temporal relationships

Treat the agreements as potentially layered in function: upstream technology rights may constrain downstream integration, hosting, distribution, or commercialization rights. If one agreement depends on another agreement’s technology, map the dependency chain before assessing compliance.

Pay attention to timing-sensitive provisions such as effective date, term, renewal, survival, termination triggers, post-termination wind-down, and notice periods. A right that exists at signature may not exist at launch if the term or approval conditions are not satisfied.

Where rights vary by entity, product line, geography, customer type, or deployment method, analyze each dimension separately rather than assuming a uniform grant across the portfolio.

## 6. Output structure conventions

- Begin with a license-term extraction matrix organized by agreement, with rows for the major term categories and cells limited to the operative text summary
- Include a comparison layer that highlights differences, overlaps, and inconsistencies across the seven agreements
- Include a compliance-risk section organized by integration activity or use case, with each entry stating the applicable agreement(s), the risk level, the triggering terms, and the integration consequence
- Use a uniform ordinal severity scale for all risks and define the scale once at the top of the risk section
- For each risk entry, include a concise remediation-oriented next step
- End with a recommended actions block that assigns the action to the relevant role and ties it to a practical timing anchor from the transaction or integration timeline
- Keep the write-up in industry-conventional diligence format; do not mirror any hidden checklist or rubric section labels verbatim
