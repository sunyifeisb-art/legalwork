---
name: compare-final-working-capital
task_id: corporate-ma/compare-final-working-capital-against-target-working-capital
description: Guides independent verification of a post-closing working capital adjustment by applying the operative agreement’s definition line by line, computing the resulting adjustment with any applicable collar, and calculating interest from the contractually specified start date.
activates_for: [planner, solver, checker]
---

# Skill: Compare Final Working Capital Against Target Working Capital

## 1. Subject-matter triage
- Confirm the source set contains the operative agreement, closing statement, objection notice, resolution memo, any independent determination, and escrow summary.
- Identify whether the task is a pure comparison, a dispute-resolution comparison, or a comparison plus payment/escrow calculation; if multiple phases appear, separate them and analyze in order.
- Determine whether one or more working-capital dates, scenarios, or statement versions are in play; if more than one, enumerate each before analysis and keep the computations separate.

## 2. Failure modes the skill is correcting
- Accepting one party’s working capital number without reconstructing the definition and testing each line item against it.
- Missing directionality: some disputed items increase working capital, others decrease it, and the memo must state the sign of each adjustment.
- Collapsing competing versions, dates, or dispute outcomes into one blended answer instead of running each scenario through the same framework.
- Treating a collar, true-up threshold, or interest trigger as decorative rather than operative.
- Quoting the parties’ labels instead of independently classifying each item under the agreement.
- Stating a conclusion without tying it to the source documents that drive the adjustment, the dispute, and the payment mechanics.
- Skipping the escrow or payment-waterfall step when the documents require the adjustment to be funded or netted through a specified mechanism.

## 3. Legal frameworks / domain conventions that apply
- Working-capital true-up provisions typically compare final working capital to a target or peg and allocate the difference according to the agreement’s payment direction.
- The definition of working capital controls; schedule captions and accounting labels do not override express inclusions and exclusions.
- Current asset and current liability treatment must follow the contract, not general financial-statement presentation, where the two differ.
- Common dispute points include receivables collectability, intercompany items, debt-like items, reserves, accrued expenses, deferred revenue, taxes, and cash treatment; each must be tested against the operative definition and any specified accounting principles.
- If the agreement includes a collar, deadband, or threshold, first determine whether the corrected amount falls inside or outside the operative band, then apply only the excess if required by the contract.
- Interest, if any, runs only from the contractually specified trigger date and at the stated rate or formula.
- If the source set includes a dispute-resolution or independent determination provision, the determination memo should track the contractually assigned role of that determination and distinguish agreed items from adjudicated items.
- If an escrow or offset mechanism exists, confirm the adjustment is matched to the payment source, release condition, and any holdback sequencing required by the documents.

## 4. Analytical scaffolds
1. Extract the operative rules
   - Quote or paraphrase the working-capital definition, the target/peg, the collar or threshold, the interest clause, and any escrow or dispute-resolution mechanics.
   - List the accounting convention the agreement adopts if one is specified.

2. Build the issue inventory
   - Enumerate each disputed line item or adjustment category before analyzing it.
   - For each item, identify: source document reference, party position if stated, stated amount, and whether the item affects assets, liabilities, or both.

3. Test each item against the contract
   - For every item, decide whether it belongs in working capital under the definition.
   - State the direction of the correction and why the item is included, excluded, reclassified, or adjusted.
   - Tie the item to any interacting clause, schedule, closing statement entry, objection, or independent determination.

4. Close each issue completely
   - Quantify the item using the amount or threshold in the source set.
   - Cross-reference the controlling definition or related document provision.
   - State the downstream consequence for the client, including the effect on the final adjustment, escrow release, or payment obligation.

5. Reconcile the final working capital
   - Start from the reported closing working capital.
   - Apply each accepted correction in a transparent sequence.
   - Show the corrected final working capital and the resulting delta versus target.

6. Apply collar and payment mechanics
   - Determine whether the corrected figure is within any collar or deadband.
   - If outside the band, calculate only the operative excess and identify who owes whom under the agreement.
   - Confirm how the adjustment is funded, netted, or satisfied through escrow or other setoff mechanics.

7. Calculate interest, if applicable
   - Use the contractual start date, not the date of dispute or resolution, unless the agreement says otherwise.
   - Apply the stated rate or formula to the operative adjustment amount for the relevant period.

8. Resolve timing and procedural questions
   - Check whether notices, objections, responses, or determinations were timely under the contract.
   - If timing affects the validity, scope, or accrual of the adjustment, state that effect explicitly.

## 5. Vertical / structural / temporal relationships
- Track the full chain from closing statement to objection notice to resolution memo to independent determination to escrow summary.
- Treat later documents as potentially superseding earlier positions only to the extent the contract permits.
- Distinguish between reported amounts, disputed amounts, agreed adjustments, and finally determined amounts.
- If more than one measurement date, methodology version, or dispute track exists, keep separate columns for each and do not blend them.
- When a later document references an earlier line item, preserve the linkage so the reader can see how the number moved through the process.

## 6. Output structure conventions
- Use a memo format titled as a working-capital adjustment verification memo.
- Open with a short executive conclusion stating the final direction of payment, the operative amount basis, and whether interest applies.
- Include a compact source-summary section listing the controlling documents and the specific provisions relied on.
- Provide a line-by-line reconciliation table or equivalent structured list for each disputed item with:
  - item name or category
  - reported amount
  - contract treatment
  - correction amount and direction
  - cross-reference to the interacting document or clause
  - consequence for the final adjustment
- Show a corrected working-capital computation that starts from the reported figure and walks through each accepted adjustment.
- Include a separate collar/threshold analysis and a separate interest analysis.
- If escrow is involved, include a concise funding or release analysis tied to the operative payment mechanics.
- End with a practical conclusion identifying the net amount owed, the paying party, the receiving party, and the effect on escrow, if any.
- Add a short recommended-actions section with imperative next steps, responsible roles, and timing anchors derived from the source documents where available.
