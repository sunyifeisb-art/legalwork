---
name: identify-issues-vendor-cloud-infrastructure-proposal
task_id: intellectual-property/identify-issues-in-vendor-cloud-infrastructure-proposal
description: Reviewing a vendor cloud infrastructure proposal and draft agreement against an internal assessment to produce an issue memorandum with severity ratings and recommended fixes.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Vendor Cloud Infrastructure Proposal

## 1. Subject-matter triage

- Treat the vendor proposal package, draft agreement, and internal assessment as a single comparison set.
- Identify whether the package covers one cloud service scope or multiple offerings, regions, tiers, or deployment models; if more than one is in scope, review each separately before generalizing.
- Prioritize provisions that affect operational continuity, regulatory posture, cost exposure, or the ability to exit cleanly.

## 2. Failure modes the skill is correcting

- Reviewing the proposal in isolation and missing gaps between claimed capabilities and the internal assessment.
- Failing to reconcile the proposal with the draft agreement, leaving commercial promises more favorable than the binding terms.
- Treating vague operational language as sufficient where the assessment expects concrete commitments.
- Identifying issues without tying each one to severity, source text, and a concrete fix.
- Summarizing risks without closing the loop to the affected clause set, scale of exposure, and client consequence.

## 3. Legal frameworks / domain conventions that apply

- Service commitments in cloud infrastructure transactions should be tested against the binding agreement, not the marketing or proposal layer; where the agreement is narrower or more permissive, the discrepancy is a risk.
- Availability, performance, maintenance, incident response, and service credits should be specified in operational terms; benchmark-only or aspirational language is usually too loose for an enterprise customer.
- Data location and transfer language should be checked for residency, sovereignty, and regulated-data constraints; unrestricted placement authority can create compliance and audit issues.
- Pricing must be reviewed for variable, pass-through, usage-based, or exception charges that may not appear in headline pricing.
- Exit and portability terms should address export format, assistance, transition timing, and fees; inadequate exit mechanics increase lock-in risk.
- Shared responsibility language should allocate security duties clearly across the parties; ambiguity can leave control gaps and incident-response disputes.
- Business continuity and disaster recovery commitments should be specific enough to test against the internal assessment, including recovery expectations and testing obligations.
- Contract interpretation should be anchored to the governing terms in the source set; if the proposal and draft conflict, the binding document controls unless the package expressly states otherwise.

## 4. Analytical scaffolds

1. Read the proposal and draft agreement side by side, and mark every place where the proposal is more favorable than the binding draft or where the draft omits a promised feature.
2. Compare the technical claims in the proposal against the internal assessment’s findings; flag each mismatch, gap, or unsupported assumption.
3. Review service levels for uptime, response time, maintenance scope, outage handling, service credit mechanics, and any exclusivity or limitation language that narrows remedies.
4. Check data handling provisions for storage location, processing location, access paths, transfer permissions, and any carveouts that could undermine residency or sovereignty expectations.
5. Break pricing into its components and test whether any variable charge, overage, support fee, implementation fee, or exception cost is missing from the headline economics.
6. Examine exit mechanics for export format, migration assistance, transition window, and termination support; note anything that would make switching impractical or costly.
7. Test the security responsibility model for gaps between vendor duties and customer duties, especially around access control, logging, patching, incident notification, and shared infrastructure boundaries.
8. Review continuity and disaster recovery language for specificity, internal consistency, and alignment with the assessment’s requirements.
9. For each issue, state: what the problem is, where it appears, how serious it is, why it matters operationally or legally, and what fix or negotiation position should be taken.

## 5. Vertical / structural / temporal relationships

- Track how a promise in the proposal is affected by a narrower definition, disclaimer, exclusion, or limitation elsewhere in the package.
- Note whether one provision undermines another, such as a service-level promise that is neutralized by broad maintenance discretion or credit-only remedies.
- Identify any timing mismatch between promised implementation, remediation, migration assistance, notice periods, and termination rights.
- If the package references internal standards, policies, or unnamed procedures, verify whether they are actually incorporated and whether they create an enforceable commitment or only a statement of practice.

## 6. Output structure conventions

- Produce an issues memorandum in a conventional memo format with a short executive summary, a severity legend, a table of issues, and a ranked discussion by severity.
- Use a defined ordinal severity scale and apply it consistently to every issue; define the scale once near the top.
- Each issue entry should include the source section or provision, a concise description of the issue, the internal assessment point it conflicts with if relevant, the severity, the practical consequence, and the recommended fix or negotiation stance.
- For every issue, close the analysis by tying the issue to the relevant scale in the source set, any interacting clause or document, and the downstream consequence for the client.
- End with a separate Recommended Actions section that uses imperative actions, identifies the responsible role or team where available from the source documents, and gives a timing anchor tied to the deal or implementation timeline.
- Use ordinary legal and commercial citations to the extent a proposition depends on a recognized authority or named rule in the source documents; do not state conclusions as if they were self-proving.
- Keep the memo focused on actionable gaps and avoid duplicating issues that are merely stylistic or drafting preferences.
