---
name: extract-insurance-policy-terms-acquisition-due-diligence
task_id: insurance/extract-insurance-policy-terms
description: Agents conducting an insurance coverage analysis memo for acquisition due diligence extract primary policy terms and then test for structural coverage gaps, endorsements, open-claim tensions, transition risk, and post-closing continuity issues.
activates_for: [planner, solver, checker]
---

# Skill: Insurance Policy Key Term Extraction — Coverage Analysis Memorandum for Acquisition Due Diligence

## 1. Subject-matter triage

- Identify each policy form in the portfolio and classify it by line, insurer, insured entity, policy year, and claims-made or occurrence structure.
- Separate the analysis into (i) current coverage terms, (ii) endorsement-driven deviations, (iii) open claims and known exposures, and (iv) closing/transition continuity issues.
- If only one policy or one insured entity is in scope, say so explicitly before analyzing gaps; do not assume portfolio-wide issues apply everywhere.
- Where multiple policies, claim matters, or policy periods exist, enumerate them first and then analyze each item separately.

## 2. Failure modes the skill is correcting

- A policy term is extracted but its practical effect is not tied to the target’s actual exposure or operating facts.
- An endorsement is noticed, but the memo does not say whether it broadens, narrows, conditions, or suspends coverage.
- A claim-handling clause is identified without connecting it to any open matter that creates settlement pressure or reporting risk.
- A policy-year change is treated as routine even though retroactive dates, continuity terms, or tail rights may create a reporting gap.
- A transition-period operational change, including vacancy or reduced safeguards, is not tested against policy conditions.
- The memo lists coverage features but does not convert them into risk-rated findings with concrete next steps.

## 3. Legal frameworks / domain conventions that apply

- Read each policy as a contract: anchor the analysis in the insuring agreement, exclusions, conditions, endorsements, and priority-of-coverage language.
- Treat claims-made forms differently from occurrence forms: for claims-made coverage, reporting timing, retroactive dates, continuity terms, and any extended reporting period are central.
- For umbrella and excess forms, test whether the layer follows form or departs from underlying coverage through exclusions, sublimits, or conditions.
- For liability and property forms, test exclusions and carve-outs as written; if a carve-out is absent, do not infer one.
- For open claims, connect the claim posture to settlement-consent, defense-control, notice, cooperation, allocation, and consent-to-settle provisions.
- For acquisition diligence, evaluate continuity at closing as a post-closing operational and transactional risk, not only as a policy-interpretation issue.

## 4. Analytical scaffolds

1. For each policy, extract:
   - insurer, named insured, additional insured language if any
   - policy type and form number if available
   - policy period
   - limits, sublimits, retentions, deductibles, and self-insured components
   - insuring agreements
   - key exclusions
   - conditions, notice requirements, and defense/settlement provisions
   - endorsements that alter scope, timing, occupancy, safeguards, professional services, pollution, or contractual liability treatment

2. Test the following recurring issues wherever the source documents make them relevant:
   - umbrella contractual-liability gap: determine whether contractual liability is excluded, narrowed, or merely co-extensive with underlying coverage; explain any practical cap on indemnity protection
   - pollution exclusion: identify the exclusion and any fire-related or other express carve-out; flag the absence of a carve-out when environmental loss is plausible
   - environmental remediation coverage: determine whether cleanup, investigation, monitoring, or compliance costs are affirmatively covered or excluded
   - protective safeguards endorsement: identify required systems or practices, whether coverage is suspended or reduced for noncompliance, and whether current operations match the condition
   - settlement-consent / hammer clause: identify the consent mechanism and explain how it affects claim resolution strategy and excess-cost exposure
   - professional-services exclusion: test whether mixed products/services/advice allegations may fall out of umbrella protection
   - vacancy clause: determine whether a vacancy trigger reduces, suspends, or conditions property coverage during transitional occupancy changes
   - retroactive-date continuity: compare claims-made dates and continuity terms across successive forms to identify pre-change conduct not clearly covered
   - tail coverage: determine whether an extended reporting period or similar tail is needed after replacement or nonrenewal to preserve reporting rights

3. For every issue, complete the analysis in one pass:
   - identify the triggering policy text and the affected exposure
   - tie the issue to another clause, endorsement, claim, schedule, or policy in the source set
   - state the downstream consequence for the deal, operations, claims handling, or post-closing indemnity economics
   - assign a severity level from the scale used in the memo

4. When the materials include open claims, treat each claim as a separate row of analysis:
   - claim description or matter type
   - related policy year(s)
   - notice/reporting status if shown
   - defense and settlement-control issues
   - coverage tension or reservation issues if shown
   - transaction impact and recommended follow-up

5. If the source set does not contain enough information to confirm a point, say what is missing and what assumption cannot safely be made.

6. Use controlling authority only as needed for legal propositions stated in the memo; do not state a coverage conclusion without tying it to the governing policy language, contract doctrine, or other identified authority.

## 5. Vertical / structural / temporal relationships

- Separate vertical layers of coverage: primary, excess, umbrella, and any specialty policies.
- Track temporal sequence: prior year, current year, renewal year, closing date, and post-closing period.
- Compare policy transitions across time for retroactive dates, reporting obligations, occupancy status, safeguard compliance, and unresolved claims.
- Where one policy depends on another, explain the dependency explicitly rather than describing the forms in isolation.
- If a policy condition can be defeated by a transition event, flag the timing issue and identify whether the problem arises before or after closing.

## 6. Output structure conventions

- Write a coverage analysis memo organized by policy type, then by issue, then by claim or exposure where relevant.
- Start with a short executive summary that states the overall risk posture and the most material coverage gaps.
- Include a concise policy inventory table capturing the core terms for each policy.
- Define a uniform ordinal severity scale once near the top and apply it consistently to each issue.
- For each issue, provide:
  - severity
  - policy or policies implicated
  - short issue statement
  - supporting policy language or document reference
  - practical consequence
  - recommended action
- Include a separate section for open claims and another for transition / post-closing continuity risks.
- End with a Recommended Actions block that assigns each action to a role or owner and ties it to a transaction milestone, renewal date, reporting deadline, or other timing anchor visible from the materials.
- Keep the memo action-oriented: findings should identify the gap, its significance, and the next step, not merely describe the policy language.
