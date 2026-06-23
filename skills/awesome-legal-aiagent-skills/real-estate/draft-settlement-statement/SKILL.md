---
name: draft-settlement-statement
task_id: real-estate/draft-settlement-statement
description: Guides drafting of a commercial property settlement statement with proration schedules and a reconciliation notes memo by integrating the purchase agreement, rent roll, payoff information, and other closing documents.
activates_for: [planner, solver, checker]
---

# Skill: Draft Settlement Statement for Commercial Property Closing with Prorations, Lien Payoffs, and Assumed Lease

## 1. Subject-matter triage (only if applicable)

- Determine whether the closing involves one property or multiple parcels, one lease or multiple occupancy arrangements, and one payoff or multiple secured claims; if more than one item exists, treat each as a separate closing component and reconcile it independently before combining totals.
- Identify which dates control the economics: contract date, closing date, rent-period cutoffs, tax bill dates, payoff good-through dates, and any assumed-lease commencement or assignment date.
- Separate hard closing items from post-closing carryovers: amounts settled at closing, amounts held in escrow, and obligations that survive closing but are documented in the notes memo.

## 2. Failure modes the skill is correcting

- The statement shows a net number without displaying the underlying proration math, making review impossible.
- The drafting applies a generic closing convention instead of the governing contract’s allocation rules for prorations, delinquent items, deposits, and closing costs.
- The statement balances on paper but misallocates lender payoffs, tax items, rent, deposits, or holdbacks between buyer and seller.
- The notes memo is omitted or is too thin to capture assumptions, gaps, and date-sensitive items that could change the economics.
- The closing package treats the assumed lease as background context instead of a current cash-flow item that affects proration, transfer of deposits, and post-closing responsibility.
- The statement fails to reconcile all columns back to the purchase price and other closing adjustments, leaving unexplained residuals.

## 3. Legal frameworks / domain conventions that apply

- Use the purchase agreement’s express allocation provisions as the controlling framework for all adjustments, and do not substitute local custom where the contract is specific.
- Apply standard settlement-statement practice: itemize debits and credits by party, then reconcile to a bottom-line amount for seller proceeds and buyer funds required.
- Prorate recurring items by the contract’s chosen accrual method and cutoff date; where the contract is silent, use the transaction’s stated convention consistently across all recurring charges.
- Treat property taxes according to the applicable jurisdiction’s billing convention and lien status, and distinguish current-period accrual from arrears settlement.
- Treat rent and occupancy amounts according to the lease and assignment language, including assumptions about the exact closing-day allocation and any delinquency carveout.
- Transfer security deposits, reserve balances, and similar tenant-held funds only as permitted by the lease, the assignment documents, and applicable landlord-tenant law.
- Allocate payoff items using the payoff statement’s good-through date and interest accrual mechanics; update the payoff if the closing date moves.
- Place transfer taxes, deed recording fees, satisfaction fees, title premiums, and escrow charges in the column assigned by the contract and local practice.
- Treat repair escrows, holdbacks, and similar deferred amounts as seller-side debits unless the source documents expressly provide a different structure.
- If the seller signs in a representative or fiduciary capacity, confirm the authority and any required approvals before treating the closing as executable.
- Support every legal or allocation conclusion with the governing source provision, statute, regulation, or standard closing convention relied on for that item.

## 4. Analytical scaffolds

- Read the closing documents as a single economic package: purchase agreement, lease or assignment, rent roll, tax statements, payoff letters, estoppels, escrow instructions, and closing checklist.
- Build the statement item by item, then reconcile the itemized schedule to the purchase price and all add-ons, deductions, payoffs, and holdbacks.
- For each recurring proration, show the basis, the relevant period, the daily rate or equivalent unit rate, the seller-side allocation, and the resulting amount.
- For each payoff, confirm the amount, the good-through date, and whether closing falls inside that window; if not, flag the need for an updated payoff.
- For deposits and tenant-related balances, compare the rent roll, lease, and any estoppel or schedule of deposits; flag mismatches and state which document is being treated as controlling.
- For taxes and assessments, confirm whether the item is current, delinquent, prepaid, or pending; treat each category separately so the settlement does not mix accrual with payoff.
- For closing fees and transaction charges, verify whether each is buyer-side, seller-side, or split, and note the source for the allocation.
- For any unresolved item, state the assumption used in the statement and isolate the change that would follow if the assumption proves wrong.
- Reconcile the final buyer funds and seller net proceeds against the transaction economics before finalizing the document.

## 5. Vertical / structural / temporal relationships (only if applicable)

- When a closing date is near a period boundary, a one-day change can shift prorations, payoff interest, and occupancy charges; the notes memo must identify the assumed date and the items sensitive to movement.
- Where an assumed lease transfers at closing, the rent proration, security deposit transfer, and post-closing tenant obligations must be aligned so the economic handoff is internally consistent.
- If a payoff statement or tax figure is dated before the expected closing date, note the revalidation trigger and the document that must be refreshed.
- If a holdback or escrow is to be released later, describe the release condition and the party responsible for administering it so the closing statement and notes remain consistent.

## 6. Output structure conventions

- Draft the settlement statement first and ensure it is complete and non-empty before preparing the notes memo.
- Use a conventional dual-column settlement-statement layout with seller-side and buyer-side columns, grouped by transaction category rather than by source document.
- Include separate proration schedules for each recurring item that needs computation, and keep each schedule self-contained so it can be audited independently.
- Include a reconciliation summary that ties the statement back to the purchase price and shows how the bottom-line net figures were reached.
- The notes memo should be a separate advisory document that lists assumptions, discrepancies, missing information, and items that may change if dates or source documents change.
- State in the notes memo which source document governs each contested or uncertain item, and identify any place where the statement reflects a reasonable assumption rather than confirmed closing data.
- Keep filenames exactly as instructed: `settlement-statement.docx` for the statement and `settlement-statement-notes.docx` for the notes memo.
- Before finishing, confirm that both files exist, are non-empty, and contain operative content rather than a summary of what should be drafted.
