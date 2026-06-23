---
name: its-compare-transaction-records-sanctions-list
task_id: international-trade-sanctions/compare-transaction-records-against-sanctioned-parties-list
description: Produces a sanctions screening report covering transactions in the review period by comparing counterparties, dates, ownership chains, and vessel identifiers against applicable sanctions lists and highlighting items that warrant escalation or disclosure review.
activates_for: [planner, solver, checker]
---

# Skill: Compare Transaction Records Against Sanctioned Parties List

## 2. Failure modes the skill is correcting

- Doing surface-level name matching without testing whether the transaction occurred before or after the relevant designation date, which is essential to distinguish a benign historical touchpoint from a potentially actionable post-designation event.
- Screening only the named counterparty and ignoring beneficial ownership, control, or other attribution rules that can pull an apparently clean entity into sanctions risk.
- Checking a vessel only against its registered name and omitting permanent identifiers, ownership history, and other vessel-linkage data needed to assess blocked-property risk.
- Treating one sanctions regime as sufficient when the transaction’s nexus requires review across all applicable sanctions programs and list sources.
- Describing a match without closing the issue with scale, cross-document linkage, and downstream compliance consequence.
- Failing to grade findings consistently, which makes it hard to triage escalation, disclosure review, and remediation.
- Presenting flagged items without a clear recommended action, owner, and timing anchor.

## 3. Legal frameworks / domain conventions that apply

- Use the controlling sanctions authorities that govern the transaction nexus, including the applicable statute, regulation, executive authority, or list-based designation instrument for each regime implicated.
- Treat designation timing as a key legal comparator: the transaction date must be tested against the designation date to determine whether the activity is pre-designation history, post-designation exposure, or otherwise requires escalation.
- Apply the relevant ownership and control attribution rule when an entity may be linked to a designated person through direct or indirect interests, voting rights, or control indicia.
- For vessels, screen both the vessel identifier and the ownership chain; if the governing rule treats property of a designated person as blocked, trace whether the vessel falls within that rule rather than relying on label-only screening.
- Where the transaction set has multiple potentially relevant sanctions programs, apply each program that has a plausible nexus to the facts instead of stopping at the first apparent match.
- Use an ordinal severity scale defined once at the outset and apply it uniformly to every flagged item.
- When the issue set suggests widespread post-designation activity or repeated screening failures, evaluate whether escalation to the appropriate compliance authority and disclosure review are warranted under the applicable program’s enforcement and voluntary disclosure framework.

## 4. Analytical scaffolds

1. Enumerate the universe of transactions first: list each Q4 2024 transaction, its counterparty, date, amount or value field if present, and any vessel or ownership data attached to it.
2. Screen each counterparty name against the consolidated sanctions list and any other applicable sanctions lists for the transaction’s nexus.
3. For each potential match, compare the transaction date to the designation date and classify the timing as pre-designation, post-designation, or indeterminate based on the source record.
4. If ownership or control data is present, apply the applicable attribution rule to determine whether an indirect link creates sanctions exposure even where the name itself does not match exactly.
5. If a vessel is involved, screen the vessel identifier, then trace beneficial ownership and any other vessel-specific linkage needed to determine whether the vessel is itself implicated.
6. For each flagged item, close the analysis by stating: the scale of the exposure using a source-derived figure or other measurable marker, the other document or record that interacts with the issue, and the practical consequence for the client.
7. Assign a severity level to each issue based on match confidence, designation timing, regime sensitivity, and transaction significance.
8. For cleared transactions, state why they cleared and identify any residual monitoring point, if any.
9. If the pattern of findings suggests repeated post-designation activity or a systemic screening gap, include a disclosure-review assessment with a short rationale.

## 5. Vertical / structural / temporal relationships

- Use the transaction register as the primary timeline, and align it against designation dates, ownership snapshots, and any vessel history to determine whether a recorded transaction sits before or after a sanctions-triggering event.
- Where counterparty summaries, ownership records, KYC materials, or vessel registers conflict, prefer the most specific and contemporaneous source while noting the inconsistency.
- If a screening incident log or prior review record exists, treat it as context for reliability and remediation, not as a substitute for re-screening the underlying transactions.
- Keep the analysis transaction-by-transaction; do not collapse multiple records into one generic finding when dates, counterparties, or vessel data differ.

## 6. Output structure conventions

- Begin with a short executive summary stating the overall screening result, the number and nature of flagged items, and whether disclosure review is recommended.
- Define the severity scale once near the top, then use it consistently for every flagged entry.
- Present the findings in a row-by-row compliance report, with one row per transaction or one row per distinct issue if a single transaction raises multiple independent sanctions concerns.
- For each flagged entry, include:
  - transaction identifier or equivalent reference
  - counterparty / vessel / ownership match description
  - applicable sanctions regime or authority
  - designation date and transaction date
  - timing assessment
  - severity
  - issue closing note covering scale, cross-reference, and consequence
  - recommended action
- Include a separate section for cleared transactions that confirms screening clearance and notes any residual watchpoints.
- End with a concise Recommended Actions section that assigns each action to a responsible role and ties it to an immediate or milestone-based timing anchor.
- Use plain language that can be lifted into `sanctions-screening-report.docx` without further restructuring.
