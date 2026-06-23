---
name: compare-settlement-terms-against-policy-limits
task_id: employment-labor/compare-settlement-terms-against-policy-limits
description: Guides the analyst through a coverage gap analysis memorandum comparing settlement terms against available insurance coverage, including policy-priority issues, reservation-of-rights handling, punitive-damages insurability, and defense-cost erosion.
activates_for: [planner, solver, checker]
---

# Skill: Compare Settlement Terms Against Policy Limits — Coverage Gap Analysis

## 1. Subject-matter triage

- Determine whether the source set contains one policy or multiple policies, and whether the settlement allocates among covered and potentially uncovered components.
- Identify the jurisdiction governing insurability issues and any choice-of-law language that could alter the coverage result.
- Separate indemnity exposure from defense spend, because the coverage gap may turn on erosion, not just nominal limits.
- Flag any reservation-of-rights correspondence that may change the analysis only if a triggering adjudication or other condition occurs.

## 2. Failure modes the skill is correcting

- Treating the settlement as a single number without mapping each component to the correct layer, retention, sublimit, or excess position.
- Assuming coverage exists or fails in the abstract without tying the conclusion to the actual policy form, endorsement language, and governing law.
- Declaring punitive damages insurable or uninsurable without first identifying the controlling jurisdiction and the rule that jurisdiction applies.
- Treating a reservation-of-rights letter as an immediate denial when the cited exclusion may depend on a later finding or defined event.
- Ignoring that defense payments may reduce remaining indemnity capacity when the policy is defense-within-limits.
- Failing to show how a coverage issue changes the client’s bargaining position, settlement structure, or residual exposure.
- Providing descriptive coverage commentary without quantifying the gap against the policy structure in the record.

## 3. Legal frameworks / domain conventions that apply

- Policy construction controls: analyze the insuring agreement, exclusions, conditions, endorsements, retentions, sublimits, and priority language together, not in isolation.
- Layering and exhaustion: identify primary, excess, and umbrella positions; determine when each layer attaches and what must be exhausted before the next responds.
- Employment-liability coverage forms: review whether the policy responds to discrimination, harassment, retaliation, wrongful termination, or related claims as pleaded and settled.
- Individual insureds: determine whether officers, managers, or other persons are included, and whether any severability or conduct exclusions affect them differently from the entity.
- Punitive-damages insurability: state the governing jurisdiction’s rule and apply the relevant public-policy doctrine or statutory restriction before discussing whether that component is recoverable.
- Reservation of rights: treat the insurer’s position as provisional when the cited exclusion requires a final adjudication, judgment, or other specified trigger.
- Defense-cost erosion: if the policy is defense-within-limits, treat defense payments as reducing the amount remaining for settlement indemnity.
- Coverage-gap framing: the relevant question is not only whether some coverage exists, but whether the available coverage fully funds the settlement after priority, erosion, exclusions, and any uninsured components.

## 4. Analytical scaffolds

- Coverage map:
  - For each policy, identify insurer, policy type, applicable limit, retention or deductible, defense-cost treatment, exclusions, endorsements, and priority position.
  - State whether the policy appears primary, excess, or umbrella on the face of the form and how that affects attachment.
- Settlement-component allocation:
  - Break the settlement into its component pieces as reflected in the documents.
  - Match each component to the coverage potentially available under each policy.
  - Identify any component that is plausibly outside coverage.
- Waterfall analysis:
  - Start with the first responding layer and work upward in order.
  - Show the amount absorbed at each layer, then the residual exposure after that layer.
  - Continue until the settlement is funded or a gap remains.
- Punitive-damages analysis:
  - Identify the controlling jurisdiction.
  - State the governing rule on insurability.
  - Apply that rule to the punitive portion of the settlement and note any uncertainty created by mixed allegations or mixed allocations.
- Reservation-of-rights analysis:
  - For each reservation letter, identify the exclusion or condition cited.
  - State whether the cited language is presently operative or contingent on a later finding.
  - Explain how the reservation affects settlement leverage, tender strategy, or the likelihood of a coverage dispute.
- Defense-cost erosion analysis:
  - Determine whether defense costs reduce limits.
  - Account for defense spend already incurred.
  - State the remaining indemnity capacity after erosion, if any.
- Issue-by-issue treatment:
  - For each coverage issue, state the scale of the problem using the source record, cross-reference the policy or correspondence that controls it, and explain the downstream consequence for the client.
  - If multiple policies, periods, claimants, or insureds are implicated, analyze each separately rather than as a blended average.

## 5. Vertical / structural / temporal relationships

- Track the relationship among complaint allegations, settlement terms, policy wording, and insurer correspondence in chronological order.
- Note whether the settlement resolves conduct before or after any policy period boundary, notice event, or reservation-of-rights trigger.
- If different insureds or claimants are treated differently across the documents, preserve that distinction in the analysis.
- If coverage depends on later findings, separate current exposure from contingent exposure so the memo does not overstate present denial rights.

## 6. Output structure conventions

- Format the work as a coverage gap analysis memorandum.
- Begin with a short executive summary that states the likely coverage picture and the main gap drivers.
- Include a policy summary table capturing the principal terms relevant to coverage, layering, erosion, and exclusions.
- Include a settlement-to-coverage mapping or waterfall that shows how the settlement is expected to be absorbed and where any shortfall remains.
- Include separate sections for punitive-damages insurability, reservation-of-rights issues, and defense-cost erosion.
- Use an ordinal severity label for each major issue and define the scale once at the outset.
- Cover each issue with a concise but complete entry that identifies the governing rule or authority, the relevant document cross-reference, the magnitude of the issue, and the client consequence.
- Conclude with a recommended-actions section that lists concrete next steps, the responsible role, and a timing anchor tied to the settlement or insurer-response posture.
