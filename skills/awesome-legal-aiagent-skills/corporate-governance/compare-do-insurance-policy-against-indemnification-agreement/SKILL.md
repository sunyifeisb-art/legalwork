---
name: do-insurance-indemnification-gap-analysis
task_id: corporate-governance/compare-do-insurance-policy-against-indemnification-agreement
description: Coverage gap analysis memorandum comparing a D&O insurance policy against an indemnification agreement, identifying structural mismatches in timing, conduct standards, consent requirements, subrogation, tail coverage, and related protection gaps.
activates_for: [planner, solver, checker]
---

# Skill: D&O Insurance Policy vs. Indemnification Agreement Coverage Gap Analysis

## 1. Subject-matter triage
- Confirm you are comparing a D&O policy and an indemnification agreement for director/officer protection, not drafting new coverage.
- Identify whether the source set includes multiple policies, amendments, riders, ERPs, acquisition-related tail terms, or board approvals; if so, compare each operative document separately before synthesizing.
- Separate protections for individuals from entity reimbursement coverage; do not assume one fills the other’s gaps.

## 2. Failure modes the skill is correcting
- Treating “coverage exists” as a sufficient answer without stating when, for whom, and under what trigger it actually applies.
- Missing practical exposure created by timing mismatches between claims-made insurance and longer-lived indemnification.
- Overlooking advancement differences that create interim cash-flow risk even where ultimate indemnity may exist.
- Ignoring circularity between subrogation rights and reimbursement limits.
- Failing to spot deadlock where insurer consent and company consent both must be obtained.
- Collapsing conduct exclusions and indemnity standards into one bucket when the operative trigger may differ.
- Missing tail/ERP gaps that arise when service ends or control changes.
- Treating entity-side limitations, fiduciary-claim carveouts, and contribution caps as if they automatically protect individuals.

## 3. Legal frameworks / domain conventions that apply
- D&O policies commonly split coverage between individual loss protection and entity reimbursement; analyze the specific parts actually implicated by the source documents.
- Claims-made structure controls when coverage attaches; the claim must be made during the policy period or any applicable extended reporting period.
- Advancement provisions control timing, while indemnification provisions control ultimate allocation; those are distinct obligations and can diverge.
- Conduct exclusions often turn on an adjudication standard; indemnification standards often turn on good faith, best interests, or similar contractual thresholds.
- Consent provisions may require insurer approval for settlement or defense expenditures, and the indemnification agreement may impose separate company consent requirements.
- Subrogation rights in the policy can conflict with any contractual limit on recoupment from an indemnitee.
- Insured-versus-insured exclusions, fiduciary-liability carveouts, ERISA-related limitations, and change-of-control/tail provisions are common sources of hidden coverage loss.
- Use the governing state corporate law, insurance contract principles, and any cited policy/contract provisions as the controlling authorities for each proposition; do not state a coverage conclusion without tying it to the operative clause or governing rule.

## 4. Analytical scaffolds
- Start by enumerating every relevant protection channel in the source set: individual coverage, entity reimbursement, advancement, tail/ERP, settlement consent, conduct carve-outs, subrogation, and any special fiduciary or ERISA treatment.
- For each issue, state:
  1. the policy provision,
  2. the corresponding indemnification provision,
  3. the mismatch,
  4. the practical exposure scenario,
  5. the remediation.
- When a claim could implicate more than one timeframe, compare the operative policy period, any ERP, and the indemnification term in one pass; do not assume the later promise subsumes the earlier one.
- When comparing conduct standards, identify the precise trigger that ends advancement or coverage, and explain whether the standard is final adjudication, written admission, or another threshold.
- When comparing settlement rights, analyze whether dual consent creates a stalemate and whether either document contains a tie-break or advancement-preservation mechanism.
- When analyzing subrogation, test whether the insurer’s recovery path would be practically neutralized by the indemnification agreement’s reimbursement limits or vice versa.
- When analyzing tail coverage, trace the effect of termination, merger, or non-renewal on former directors and officers, then ask whether any document obligates procurement of runoff protection.
- When analyzing special fiduciary or ERISA exposure, check whether the policy narrows coverage differently from the indemnification undertaking and whether any exclusion leaves a residual hole.
- For every identified issue, close the analysis by stating the scale or duration implicated, the cross-document interaction, and the consequence for the protected person.

## 5. Vertical / structural / temporal relationships
- Incoming directors are most exposed where the policy period began before their service or where individualized indemnity was not negotiated; analyze pre-joining conduct, legacy claims, and reliance on entity-side coverage.
- Former directors are most exposed when the claim arrives after expiration of the policy period and any ERP; assess whether indemnification still exists and whether the company is solvent or otherwise able to perform.
- Current officers are often exposed to parallel consent and advancement issues because they face active litigation while still in service.
- If a change of control is present, test whether the policy or related governance documents preserve runoff protection for past acts and whether the indemnity survives the transaction.
- If multiple directors/officers are implicated, compare each person’s role, service period, and source of protection separately rather than using a single blended conclusion.

## 6. Output structure conventions
- Produce a memorandum in conventional legal-issue format, with a short executive summary followed by numbered gap sections.
- Define one ordinal severity scale at the outset and apply it uniformly to each gap.
- Include a compact table or list that pairs each gap with severity, impacted persons, and the operative consequence.
- For each gap entry, include: severity, issue title, the policy text or concept, the indemnification text or concept, the mismatch, the concrete risk scenario, and a recommended fix.
- Use source-document citations or pinpoints where available; when stating legal propositions, identify the governing authority or contractual provision supporting the point.
- Close with a Recommended Actions section that assigns each action to counsel, management, or the relevant officer and ties it to a transaction, renewal, litigation, or closing milestone.
- Keep the memo focused on coverage gaps and remediation; do not drift into a general insurance primer.
