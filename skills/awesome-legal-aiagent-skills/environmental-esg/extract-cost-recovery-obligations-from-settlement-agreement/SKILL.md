---
name: extract-cost-recovery-obligations-from-settlement-agreement
task_id: environmental-esg/extract-cost-recovery-obligations-from-settlement-agreement
description: Guides preparation of a cost recovery obligation matrix by extracting all payment obligations, reimbursement mechanics, trust fund requirements, and risk triggers from a settlement agreement and cross-referencing against financial records.
activates_for: [planner, solver, checker]
---

# Skill: Extract Cost Recovery Obligations from Settlement Agreement — Obligation Matrix

## 1. Subject-matter triage
- Confirm the document set includes the settlement agreement, all incorporated exhibits or schedules, and the supporting financial records needed to test performance and exposure.
- Separate present obligations from contingent or future obligations; do not blend fixed payment duties, reimbursement mechanics, trust fund mechanics, and dispute rights into one generic cost summary.
- Identify whether the agreement is bilateral or multi-party, whether costs are shared or allocated, and whether any payment streams depend on invoice, milestone, or agency-demand mechanics.

## 2. Failure modes the skill is correcting
- Baseline describes settlement payment obligations in general terms without extracting each specific obligation with its amount formula, trigger, deadline, and responsible party.
- Baseline does not cross-reference invoices and trust fund statements against the settlement agreement's obligation structure to identify payment discrepancies or compliance risks.
- Baseline omits risk assessment of scenarios where cost recovery obligations may escalate beyond current projections, including overruns, additional work, and disputes.
- Baseline does not assess the legal and financial consequences of missed, delayed, or disputed payment obligations.
- Baseline collapses separate duties into a single “cost” bucket and misses different legal consequences for payment, reimbursement, trust funding, and reserve maintenance.
- Baseline treats silence in the financial records as compliance rather than testing whether the records actually evidence performance.
- Baseline states a risk without tying it to the clause that creates it, the record that tests it, and the downstream exposure it drives.

## 3. Legal frameworks / domain conventions that apply
- Environmental settlement cost recovery: identify the basis for recoverable past costs, any consistency requirements tied to the remediation framework, and any interest or late-payment provisions.
- Allocation and contribution: determine how the settlement allocates past costs and future costs among responsible parties; track payment triggers tied to invoicing or equivalent demand mechanics.
- Trust fund mechanics: review any environmental trust fund provisions, including trustee obligations, investment standards, disbursement conditions, and shortfall or surplus provisions.
- Invoice review rights: extract provisions for reviewing and disputing invoices; capture notice and objection procedures.
- Future cost allocation: determine how costs for remedy implementation, operation and maintenance, and long-term stewardship are allocated and when they come due.
- Cost overrun risk: identify provisions governing what happens if remediation costs exceed estimates, including cost-sharing among responsible parties and any reopener implications.
- Dispute resolution: note mechanisms for resolving cost disputes among responsible parties or with the agency.
- Financial assurance: identify obligations to maintain financial assurance instruments that support future performance obligations.
- Apply controlling legal authority when a clause or record turns on a defined legal standard, notice rule, or dispute period; cite the governing agreement provision, incorporated instrument, statute, regulation, or rule as reflected in the source set.

## 4. Analytical scaffolds
- First enumerate every distinct obligation stream, party, period, and payment trigger before analysis; then run the same extraction pass for each item so no obligation is swallowed by a summary.
- For each obligation, capture: obligation type, governing text, formula or amount basis, trigger event, deadline, paying or reimbursing party, recipient, support documentation, and consequence of non-performance.
- Cross-reference each obligation against the available financial records: invoices issued, payments made, trust fund activity, reserves, and any correspondence showing acceptance, dispute, or deferral.
- Identify discrepancies between settlement obligations and actual payment history, including missing payments, partial payments, timing slippage, unapplied credits, and record gaps.
- For future cost obligations, assess the current estimate and identify risk scenarios where costs could exceed current projections or where the trigger date could move earlier than expected.
- For trust fund mechanics, assess current balance, funded status relative to projected future needs, and compliance with investment, disbursement, and replenishment mechanics.
- For invoice review rights, extract notice and objection procedures; assess whether any pending invoices require review action and whether any objection window is running or expired.
- For each identified risk, state severity, likelihood, magnitude of exposure, the clause or record that creates the risk, and the mitigation action.
- Where the source set uses defined terms, keep the defined-term usage consistent across the matrix and memo rather than paraphrasing into generic labels.

## 5. Vertical / structural / temporal relationships
- Multi-party cost sharing: where multiple parties share obligations, track each party's payment status and the consequence of any party's default on other parties.
- Invoice timing vs. payment deadline: settlement payment deadlines run from invoice receipt or similar demand mechanics; assess whether current invoice processing and payment workflows are consistent with those deadline requirements.
- Remediation progress milestones: some cost obligations are triggered by remediation milestones; assess current milestone status and when upcoming cost triggers will arise.
- Trust fund flow vs. disbursement timing: distinguish amounts required to be funded from amounts actually authorized for disbursement and from amounts already spent.
- Reimbursement chain: if one party advances costs and seeks reimbursement from another, trace the sequence from advance, to substantiation, to demand, to payment, and to any offset right.
- Temporal sequencing matters: a later dispute right does not excuse an earlier funding obligation unless the agreement expressly says so.

## 6. Output structure conventions
- Obligation matrix deliverable: structured table of all cost obligations with columns for obligation type, amount or formula, trigger, deadline, responsible party, current status, source support, and risk assessment.
- Risk assessment memo deliverable: organized by risk category such as payment timing, cost overrun, dispute, trust fund shortfall, and financial assurance, with severity, likelihood, exposure, and mitigation steps.
- Use an ordinal severity scale defined once at the top of the memo and apply it consistently to every risk entry.
- Include a short Recommended Actions section at the end of the memo with imperative actions assigned to the relevant role and tied to the applicable deadline or milestone.
- Keep each conclusion anchored to the source documents; do not infer an obligation or risk unless the governing clause and the supporting record can both be identified.
- Use the task's required deliverable naming conventions when producing the final outputs.
