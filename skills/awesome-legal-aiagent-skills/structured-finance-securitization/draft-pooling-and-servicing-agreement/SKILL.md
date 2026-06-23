---
name: draft-psa-subprime-auto
task_id: structured-finance-securitization/draft-pooling-and-servicing-agreement
description: Drafting a pooling and servicing agreement for an auto loan asset-backed securitization by adapting a prior deal precedent to a new structure that introduces changes to the principal waterfall, pre-funding mechanics, interest-rate fallback language, and note class configuration, while identifying and flagging structural conflicts and open items.
activates_for: [planner, solver, checker]
---

# Skill: Draft Pooling and Servicing Agreement for Auto Loan ABS

## 1. Subject-matter triage
- Treat the PSA as the primary deliverable and the issues memorandum as secondary.
- Draft the operative agreement first, then prepare the separate issues memo from the final draft and source inputs.
- Confirm the deal is a two-step structured-finance transaction and carry both transfer legs through the drafting.
- Identify whether the term sheet changes the waterfall, pre-funding, note classes, servicing mechanics, or fallback terms; if any differ from the precedent, redraft the affected section instead of patching language.

## 2. Failure modes the skill is correcting
- Carrying forward precedent text that no longer matches the new structure, especially where the payment waterfall, class hierarchy, or trigger architecture has changed.
- Leaving backup servicer terms underdeveloped or inconsistent with the operational profile, fee structure, and engagement mechanics required by the new deal.
- Omitting affirmative provisions for commingling protection, permitted modifications, fallback rate mechanics, investor reporting, or transfer formalities.
- Failing to reconcile conflicts among the term sheet, collateral tape, rating criteria, underwriter comments, and backup servicing terms.
- Drafting an issues memo that lists problems without tying each one to the relevant source constraint and transaction consequence.
- Substituting summary for drafting: the PSA must contain operative clauses, not a narrative of what the clauses should say.

## 3. Legal frameworks / domain conventions that apply
- If the principal distribution structure changes, the waterfall must be drafted as a coherent system: class priority, interest and principal sequencing, trigger effects, and reserve interactions must align across all provisions.
- Pre-funding requires explicit mechanics: the permitted purchase window, eligibility tests for later-acquired receivables, account administration, reserve funding, treatment of unused proceeds, and termination of the pre-funding period.
- Overcollateralization tests and floor protections serve different functions and should be drafted separately; their interaction in a stress event must be resolved expressly.
- Interest-rate fallback language should reflect current market conventions and the governing benchmark transition rules applicable to the note structure, not legacy precedent language by default.
- Commingling risk requires a collection handling rule that fits the servicer’s remittance cadence and the applicable rating agency expectations; use a sweep, segregation, or other mitigant that closes the exposure window.
- Servicer modification authority should be limited by a safe harbor for routine, credit-preserving, or otherwise permitted changes that do not create avoidable disclosure or enforceability issues.
- Backup servicer provisions should address readiness, transition timing, information access, compensation, replacement mechanics, and any execution deliverables needed for an operational handoff.
- The transfer chain must support true sale and non-consolidation analysis at each step; do not assume a prior-draft transfer provision remains adequate for the new parties or structure.
- Collection timing, determination timing, and payment timing must be internally consistent so the report cycle supports the distribution cycle.
- Eligible investments, if used, need clear rating and maturity guardrails.
- Pool-level reps for non-bank originator loans should account for state usury or similar rate-limit exposure where relevant.

## 4. Analytical scaffolds
1. Start from the term sheet and map each economic term to the PSA section that must implement it.
2. Compare the precedent against the new structure section by section; rewrite any provision whose function changes, rather than editing a few words in place.
3. For waterfall provisions, draft the full sequence from receipt of collections through final distribution, including triggers, reserves, fees, and priority shifts.
4. For pre-funding, define the account, timing, eligibility, funding source, investment treatment, and end-of-period cleanup.
5. For fallback language, align the rate definition, calculation mechanics, and operational fallback steps with current market and transaction conventions.
6. For commingling, confirm how long funds may remain unsegregated, then draft the protective mechanism that matches the risk profile and criteria.
7. For backup servicing, translate the engagement terms into operative PSA mechanics: appointment, transfer assistance, data access, compensation, and termination.
8. For transfer and true-sale drafting, ensure each conveyance step has separate language appropriate to the transferor and transferee in that step.
9. For issues spotting, identify each inconsistency or open item, state the source conflict, and explain why it matters to execution or enforceability.
10. Before finalizing the memo, verify that each issue has a clear recommended resolution and an owner or follow-up path.

## 5. Vertical / structural / temporal relationships
- The reporting cycle, determination date, and payment date interact with distribution mechanics; any mismatch should be called out because it affects reconciliation and funding certainty.
- Waterfall triggers can interact with one another and with reserve mechanics; if multiple tests can be breached in the same period, the PSA must state sequencing or control priority.
- Fallback rate mechanics and commingling mechanics both affect available cash on a payment date, so stale benchmark language can magnify operational exposure.
- Backup servicer readiness and transfer timing are temporal dependencies; if the handoff window is tight, the PSA should require advance information delivery and operational testing.
- Pre-funding end-date mechanics must align with the acquisition period and the cleanup of unused amounts, or the deal can retain stale cash and unresolved reserve obligations.

## 6. Output structure conventions
- Produce two files: the PSA draft and a separate issues memorandum.
- The PSA should read like a finished agreement with operative defined terms, operative covenants, mechanics, and exhibits/schedules where needed.
- The issues memorandum should use a uniform severity scale stated once at the top, then apply that scale consistently to each item.
- For each issue, give the source conflict, the risk or consequence, and the recommended resolution; if something is unresolved, state the open item plainly and identify the needed confirmation.
- Include an explicit recommended-actions section at the end of the issues memorandum with imperative steps, responsible role, and timing tied to the deal timeline.
- If multiple uncertain items are present across the source set, list them explicitly before analysis rather than collapsing them into a single umbrella note.
- Use controlling legal or market authority where a legal proposition is invoked, and name the relevant rule, statute, regulation, or recognized market convention in the drafting note or issues analysis.
- Before stopping, verify that the PSA file exists and contains operative provisions, and that the issues memorandum exists and contains the identified issues and recommended actions.
