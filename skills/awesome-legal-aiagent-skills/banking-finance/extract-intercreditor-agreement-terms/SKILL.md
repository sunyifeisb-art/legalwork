---
name: extract-intercreditor-agreement-terms
task_id: banking-finance/extract-intercreditor-agreement-terms
description: Extracts and cross-references key terms from multiple intercreditor agreements in a Chapter 11 context, identifying conflicts, ambiguities, and bankruptcy-related enforcement issues.
activates_for: [planner, solver, checker]
---

# Skill: Intercreditor Agreement Term Extraction — Chapter 11 Debtor Context

## 1. Subject-matter triage (only if applicable)
- Treat the three intercreditor agreements as separate governing texts first, then compare them against the supporting deal documents and each other.
- Build the report around operative provisions that matter in a Chapter 11 setting: standstill, stay relief, DIP consent, voting restrictions, purchase rights, refinancing mechanics, expense allocation, roll-up treatment, and cross-collateral support.
- If the source set includes a proposed financing or plan document, identify whether it changes any intercreditor consent, priority, or enforcement mechanics.
- If a term appears in more than one agreement, extract each formulation separately before comparing them.
- Do not collapse distinct parties, facilities, or time periods into one summary pass.

## 2. Failure modes the skill is correcting
- Reporting standstill or stay-related periods without tying them to the operative trigger and calculating the resulting expiration from the filing date or other stated benchmark.
- Missing conflicts in consent thresholds across multiple intercreditor agreements, or failing to identify which formulation is more restrictive for analysis.
- Overlooking minority veto risk in plan-voting restrictions where a supermajority requirement within the restricted creditor group can allow a small bloc to block direction.
- Failing to assess lien-creep risk where refinancing baskets permit the senior claim amount to expand through fees, expenses, discount accretion, or similar add-ons.
- Treating purchase-option mechanics as settled when the trigger, notice, or exercise window is ambiguous.
- Missing overlapping expense-recovery rights that could create duplicate recovery pathways.
- Ignoring the effect of roll-up financing on consent mechanics, priority, or collateral coverage.
- Assuming bankruptcy enforceability where the agreement text may collide with Chapter 11 policy or the Bankruptcy Code.

## 3. Legal frameworks / domain conventions that apply
- Automatic stay and stay relief: identify any contractual standstill on seeking relief from the automatic stay, then evaluate it in light of Bankruptcy Code section 362.
- DIP financing and priming consent: compare any consent thresholds or veto mechanics tied to debtor-in-possession financing, roll-ups, or priming liens under Bankruptcy Code sections 364 and 1129.
- Plan voting restrictions: identify any contractual voting direction or abstention restriction and assess it against Bankruptcy Code sections 1126 and 1129, including whether the restriction creates a practical minority veto.
- Purchase rights and claim transfers: extract the trigger, notice, and timing mechanics for any senior-claim purchase option; note any ambiguity in sequencing or deadline.
- Permitted refinancing and lien creep: determine whether the agreement permits refinancings, extensions, or replacements of senior obligations and whether the basket allows incremental debt from fees, costs, or similar items.
- Expense recovery and setoff-type overlap: identify whether the agreement permits reimbursement from collateral, claim proceeds, or another source for the same cost items.
- Cross-collateralization and priority shifts: compare any cross-collateral support language against the agreement’s collateral and priority restrictions.
- Where the source documents identify governing authority or operative legal standards, cite them as stated; otherwise anchor conclusions to the controlling Bankruptcy Code provision or other recognized authority.

## 4. Analytical scaffolds
1. Agreement-by-agreement extraction: identify each operative clause, define the relevant trigger, timing, consent standard, and enforcement consequence, then capture the exact commercial effect in plain English.
2. Cross-document comparison: for each common topic, place the three agreements side by side and identify where they align, diverge, or leave gaps.
3. Temporal analysis: compute any date-sensitive rights from the relevant filing, notice, or event date stated in the source set; if multiple trigger dates exist, treat each separately.
4. Threshold analysis: record each consent, approval, veto, or direction threshold exactly as stated, then compare for relative restrictiveness.
5. Bankruptcy-impact analysis: assess whether the clause is likely to matter in Chapter 11 practice, including stay relief, priming, plan confirmation, voting, or claims treatment.
6. Ambiguity analysis: flag undefined terms, circular triggers, missing notice mechanics, inconsistent defined terms, or sequencing problems that affect enforceability or execution.
7. Economic-effect analysis: identify any provision that shifts value, priority, leverage, or recovery risk among creditor groups.
8. Source cross-reference: tie each extracted term back to the supporting deal document that introduces, conditions, or modifies it.

## 5. Vertical / structural / temporal relationships (only if applicable)
- If a term appears at both the agreement level and in an ancillary deal document, identify which document governs the operative standard and whether one supersedes or supplements the other.
- If one agreement is later in time or amends another, note the vertical relationship and the practical effect on the earlier text.
- If the same right has multiple temporal steps, map them in order: trigger, notice, waiting period, exercise window, termination, and post-expiration consequence.
- If a later financing or plan document interacts with an intercreditor restriction, state whether it is conditioned on consent, deemed permitted, or potentially inconsistent.
- If the source set includes a hierarchy of parties or liens, track how each clause moves priority, control, or enforcement rights up or down that hierarchy.

## 6. Output structure conventions
- Write a report organized by agreement, then by provision, with a comparison section that highlights conflicts, ambiguities, and bankruptcy-sensitive issues.
- Include a concise methodology note stating that each extracted term was cross-referenced against the supporting deal documents.
- Use a uniform issue table or issue list with a stated ordinal severity scale at the top, and apply that scale consistently to each issue.
- For each issue, state the operative clause, the source cross-reference, the legal or commercial consequence, and the practical Chapter 11 risk.
- Include a terms matrix that captures, for each agreement, the standstill/stay provision, DIP consent mechanics, voting restriction, purchase option, refinancing basket, expense allocation, roll-up treatment, and any cross-collateral or priority-shift language.
- Where multiple agreements address the same topic, present the comparison in a dedicated subsection rather than merging them into a single narrative.
- End with a recommended actions section that assigns each action to a role or workstream and ties it to a filing, notice, negotiation, or confirmation milestone.
- If a legal conclusion depends on a rule or statute, name the controlling authority in the discussion rather than stating the conclusion bare.
