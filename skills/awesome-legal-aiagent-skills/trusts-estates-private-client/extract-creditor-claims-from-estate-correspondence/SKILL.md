---
name: extract-creditor-claims-from-estate-correspondence
task_id: trusts-estates-private-client/extract-creditor-claims-from-estate-correspondence
description: Closes the gap where agents list creditor claims without computing the applicable claims filing deadline, identifying potentially untimely claims, prorating invoices that straddle the relevant cutoff date, correcting arithmetic errors in invoices, and producing an adjusted total claims figure with a reconciliation.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Summarize Creditor Claims from Estate Correspondence

## 1. Subject-matter triage (only if applicable)

- Treat the task as a creditor-claims extraction and review exercise, not a generic document summary.
- First identify the governing estate-administration event that starts the claims period, then determine whether a filing deadline can be computed from the file.
- If the correspondence covers multiple creditors, multiple invoices, or multiple claim dates, enumerate each creditor claim separately before analysis.
- If the file does not contain enough information to compute a deadline or verify a claim, state the missing input and the consequence for allowance review.

## 2. Failure modes the skill is correcting

- Failing to compute the claims deadline from the estate event that starts the claims period, which can cause late-filed claims to be overlooked.
- Treating filing timeliness and debt enforceability as the same question; a claim may be timely in the estate process yet still stale or otherwise unenforceable on its own terms.
- Accepting stated invoice totals without checking line-item arithmetic.
- Including the full amount of a charge that spans the claims cutoff without separating the pre-cutoff portion from later services or deliveries.
- Allowing a business-contract claim against the estate without confirming a direct personal obligation, guaranty, or other basis for estate liability.
- Failing to flag gaps in source documentation before recommendation.
- Summarizing claims without a line-by-line adjustment trail back to the stated amounts.
- Ending with diagnostics only, without a concrete recommendation for each claim and for the file as a whole.

## 3. Legal frameworks / domain conventions that apply

- Probate creditor-claims procedure: identify the event that triggers the claims window, compute the deadline under the governing estate procedure, and test each claim against that deadline.
- Late-claim treatment: claims presented after the probate deadline are generally subject to rejection or heightened review unless an exception applies under the governing procedure.
- Independent limitations analysis: apply any separate statute of limitations or accrual rule to the underlying debt, apart from probate filing timeliness.
- Proof of claim and documentation norms: claims should be tied to statements, invoices, account histories, contracts, or other supporting records sufficient to verify amount and basis.
- Estate liability on contracts: a business debt is not automatically an estate obligation; check whether the decedent personally undertook the obligation or otherwise became directly liable.
- Invoice verification: verify line-item totals, identify arithmetic errors, and replace stated totals with verified totals when the source math does not reconcile.
- Period-spanning charges: if a billing period crosses the cutoff date, allocate charges to the relevant pre-cutoff segment using the best available dates, usage, or service periods.
- Priority and administration context: allowance, objection, or settlement recommendations should be framed against the estate’s administration posture and claim priority rules under the governing law.
- Authority citation discipline: cite the controlling probate rule, statute, or other governing authority for any timeliness, limitations, or liability proposition relied on.

## 4. Analytical scaffolds

1. Identify the claims-triggering estate event and compute the claims deadline from the governing procedure; if only one claim window applies, say so expressly.
2. Build a claims register for every creditor item in the correspondence: creditor name, debt type, date received, amount claimed, supporting documents, and timing relative to the deadline.
3. For each claim, determine whether it was timely filed, whether the underlying obligation is separately time-barred, and whether documentation is sufficient.
4. Recalculate every invoice or statement that includes line items; replace any overstated total with the verified amount and note the variance.
5. If a claim spans the cutoff date, allocate the amount between pre-cutoff and post-cutoff periods using the billing dates or service chronology available in the file.
6. For contract-based claims, test whether the estate has a direct liability basis; if the record does not show one, recommend objection or further proof.
7. For every issue identified, state the scale of the exposure or amount at stake, connect it to the relevant document or rule in the file, and state the practical consequence for the estate.
8. Assign a severity level to each claim issue using a consistent ordinal scale defined at the outset of the report.
9. End with a reconciliation that moves from stated claims to recommended allowed amounts, showing each deduction or reduction separately.

## 5. Vertical / structural / temporal relationships (only if applicable)

- The claims-triggering estate event anchors the timeline; correspondence dates, receipt stamps, and acknowledgment letters should be read against that anchor.
- Where multiple creditors are involved, process them claim-by-claim rather than averaging or pooling them.
- If the file contains both estate correspondence and underlying billing records, use the billing records to test the correspondence rather than treating the correspondence as self-proving.
- If later correspondence modifies an earlier claim amount, treat the later document as a superseding data point only to the extent it is consistent with the underlying records.
- Timing issues can affect both allowance strategy and settlement leverage; note when a claim’s position changes because the deadline, documentation, or liability basis is weak.

## 6. Output structure conventions

- Single deliverable: creditor claims summary report.
- Use a conventional report structure: executive summary; claims register; issue analysis by creditor; recommended allowance/rejection positions; reconciliation of stated versus adjusted amounts; recommended next steps.
- For each creditor entry include: creditor name, claim description, date received, deadline comparison, documentation status, verified amount if different from stated amount, severity, and recommendation.
- For each issue entry include: severity, amount or exposure, controlling authority or governing rule, short analysis, and downstream consequence for the estate.
- If a claim is timely but unsupported, separate that from a claim that is late, overstated, or unsupported by estate liability.
- The reconciliation should move line by line from the aggregate stated claims amount to the adjusted recommended total, identifying every reduction or rejection.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible role if apparent from the file, and ties each action to a deadline or administration milestone.
