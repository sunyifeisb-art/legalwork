---
name: extract-ip-tech-transactions
task_id: intellectual-property/extract-ip-tech-transactions
description: Extract key commercial terms from an IP or technology transaction term sheet and supporting documents for a board-ready memo, with separate identification of risk flags and negotiation positions for structural anomalies.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from IP/Tech Transaction Documents

## 1. Subject-matter triage
- Treat the term sheet as the primary commercial source and the supporting emails and portfolio summary as confirmation, qualification, or deviation evidence.
- If the documents reflect more than one draft state, separate what is agreed, what is proposed, and what is merely discussed.
- If only one transaction structure is actually in scope, say so expressly before analyzing it; do not imply parallel structures unless the source set supports them.

## 2. Failure modes the skill is correcting
- Extracting headline terms while missing structural risks such as governance deadlock, post-termination use rights, royalty stacking exposure, prosecution-control gaps, or insolvency-trigger enforceability problems.
- Collapsing commercial extraction and legal risk analysis into a single undifferentiated summary, which makes the memo unusable for board review.
- Failing to reconcile term-sheet language against internal emails or portfolio materials that reveal negotiated departures, assumptions, or omitted constraints.
- Omitting standard transaction provisions that materially affect value, control, or enforceability.
- Stating concerns without tying them to the relevant document source, consequence, and proposed fix.

## 3. Legal frameworks / domain conventions that apply
- Exclusive license and co-development terms should be read together: field, territory, exclusivity, sublicensing, improvement ownership, and commercialization rights must align across the deal documents.
- Governance provisions in joint development arrangements should specify committee composition, meeting cadence, voting mechanics, escalation path, and a final decision mechanism if deadlock persists.
- Consider whether payment obligations, reporting obligations, diligence obligations, and development milestones have distinct cure mechanics.
- IP diligence should track ownership chain, assignment status, encumbrances, infringement or validity disputes, and any assumptions about inventorship or contractor contributions.
- Patent prosecution and enforcement provisions should allocate who controls filing, maintenance, opposition, enforcement, and settlement authority for covered rights.
- Termination provisions should be read for continuing-use rights, sell-off periods, wind-down obligations, and the scope of any post-termination license.
- Change-of-control and assignment restrictions matter where portfolio transfers, mergers, or asset sales could alter the counterparty risk profile.
- Insolvency-triggered termination language may be constrained by bankruptcy law; flag automatic termination or ipso facto style clauses where relevant.
- Arbitration or other dispute resolution clauses should be checked for institution, rules, seat, and interim relief mechanics, because the seat governs procedural law.
- If equity, warrants, or other ownership consideration is included, verify the economics against the capitalization assumptions reflected in the source set.

## 4. Analytical scaffolds
1. Identify every commercial consideration category in the source set, including upfront amounts, milestone-based consideration, royalties, minimums, equity, reimbursement rights, and in-kind obligations.
2. Identify the governance architecture, including committees, reserved matters, voting thresholds, deadlock process, and escalation rights.
3. Identify the IP package, including licensed rights, excluded rights, improvements, ownership of derivative work product, and any portfolio assumptions.
4. Identify the development and commercialization allocation, including who funds, who performs, who controls, and who may exploit results.
5. Identify termination triggers and termination effects, including survival clauses, continuing licenses, transition assistance, and reversion or return obligations.
6. Identify prosecution, maintenance, enforcement, and settlement authority for patents and related rights.
7. Identify dispute-resolution provisions, including escalation steps, forum, institution, rules, seat, and interim relief.
8. Identify any inconsistency between the term sheet and internal emails, portfolio summary, or draft language; treat deviation as a risk unless clearly resolved.
9. Flag any missing standard term that is material to an exclusive license or co-development deal.
10. For each risk flag, state the issue, its commercial significance, and a proposed negotiation position or drafting fix.
11. Where a risk depends on a factual assumption from the source set, state that assumption explicitly rather than burying it in the analysis.
12. If the source documents contain multiple counterparties, tranches, programs, territories, or timelines, enumerate them first and then analyze each separately rather than blending them.

## 5. Vertical / structural / temporal relationships
- Give priority to the operative transaction document, but use the emails and portfolio summary to test whether the operative document omits, narrows, or expands terms discussed elsewhere.
- Distinguish between pre-signing understandings and post-signing obligations; a board memo should not blur a proposed term with an executed one.
- When one clause depends on another, present the dependency explicitly: economics may depend on field scope; exclusivity may depend on diligence milestones; post-termination use may depend on survival language; enforcement rights may depend on ownership or control.
- If the source set contains different versions of the same term, present the latest or operative version first, then note prior formulations only to the extent they create risk or ambiguity.

## 6. Output structure conventions
- Produce a board-ready memo in conventional sections:
  - executive snapshot;
  - extracted key terms by topic;
  - inconsistencies and risk flags;
  - recommended negotiation positions or fixes.
- For extracted terms, cite the source document and section or analogous location for each item.
- For risk flags, include an ordinal severity label defined once at the top of the memo and apply it consistently across all flags.
- For each risk flag, include the source basis, why it matters commercially, and the proposed response.
- Separate pure extraction from risk commentary so a reader can see the deal terms before the concerns.
- Use concise, operative sentences; avoid narrative filler.
- End with an explicit Recommended Actions section that assigns the next step to the relevant role and ties it to the deal timeline or the next negotiation milestone.
- If a legal proposition is stated, anchor it to the controlling authority or recognized doctrine supporting it; do not state a legal conclusion without the rule or principle that supports it.
