---
name: verify-disbursement-charges-against-billing-guidelines
task_id: litigation-dispute-resolution/verify-disbursement-charges-against-billing-guidelines
description: Verifying disbursement charges requires comparing each disbursement line against the applicable billing guidelines' permitted categories and cost limits, cross-referencing the pre-approval log to confirm which disbursements were approved in advance, and producing a compliance report that identifies any requested reductions for non-compliant items.
activates_for: [planner, solver, checker]
---

# Skill: Verify Disbursement Charges Against Outside Counsel Billing Guidelines — Compliance Report

## 1. Subject-matter triage (only if applicable)

- Treat the invoice as a line-item compliance review, not a high-level billing summary.
- Read the billing guidelines, pre-approval log, and engagement letter before assessing any invoice line.
- If the documents do not clearly supply a rule for a line item, mark the item as unresolved rather than assuming it is reimbursable.
- If the same disbursement type appears multiple times, evaluate each line separately unless the source documents expressly authorize bulk treatment.

## 2. Failure modes the skill is correcting

- Reviewing disbursements without first establishing the governing category-by-category rules, caps, and approval requirements.
- Ignoring the pre-approval log, which may validate an otherwise unusual charge or defeat a charge that looks facially ordinary.
- Missing engagement-letter modifications that supersede or refine the baseline billing guidelines.
- Treating overhead-like items as reimbursable disbursements without checking whether the guidelines reclassify them as included in hourly rates.
- Flagging non-compliance without stating the requested reduction that flows from the rule violation.
- Collapsing distinct invoice lines into one generic comment instead of analyzing each charge against the applicable source record.
- Stating a violation without naming the controlling provision or approval condition that governs the charge.

## 3. Legal frameworks / domain conventions that apply

- Outside-counsel billing guidelines usually distinguish reimbursable pass-through expenses from non-reimbursable overhead and may impose category-specific caps.
- Common reimbursable categories include filing fees, service of process, court reporting, travel, copying, delivery, and vendor pass-through charges, but each category is controlled by the source documents.
- Advance approval requirements often apply to travel, outside vendors, experts, e-discovery, technology-heavy services, and other atypical disbursements.
- Engagement letters can modify default guideline treatment, create exceptions, or impose stricter approval rules than the general policy.
- Overhead concepts matter: ordinary office administration, general postage, standard supplies, telecom, and similar internal costs are often not separately reimbursable.
- If a source document provides a cap, threshold, per-unit limit, or approval trigger, apply that limit exactly as written and do not infer a more permissive standard.
- Where the governing materials are silent, use conservative bill-review judgment and explain the basis for treating the item as non-compliant or needing confirmation.

## 4. Analytical scaffolds

- Start by building a working rule set from the billing guidelines and engagement letter:
  - permitted vs. non-permitted categories
  - any caps, thresholds, or per-unit limits
  - pre-approval requirements
  - special exceptions or carve-outs
- Then review the pre-approval log and map each potentially sensitive charge to a yes/no/unclear approval status.
- For each invoice line:
  - identify the disbursement type
  - match it to the governing category
  - test whether the category is allowed
  - test whether any cap or approval condition applies
  - compare the invoice detail against the pre-approval record
  - determine whether the charge is fully compliant, partially compliant, or non-compliant
- When a charge is only partly compliant, separate the compliant portion from the disallowed portion and recommend reduction only for the disallowed part.
- When a charge appears allowable but lacks required advance approval, note both the approval defect and the practical consequence for reimbursement.
- When multiple source documents address the same issue, give effect to the most specific or most restrictive instruction unless the documents expressly state otherwise.
- For every flagged item, include:
  - the invoice line reference
  - the disbursement category
  - the governing provision or approval rule
  - the approval status
  - the issue description
  - the recommended reduction
- Use the source documents’ own terminology where possible, but do not invent a category if the materials do not support it.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Temporal sequencing matters: approval before incurrence is not the same as after-the-fact ratification.
- If the engagement letter or guidelines distinguish between base approval, conditional approval, and retroactive approval, preserve that distinction.
- If a disbursement spans multiple periods or services, check whether the approval or cap attaches to the date of incurrence, the vendor invoice date, or the billing period.
- If a single invoice line bundles reimbursable and non-reimbursable components, separate the components rather than treating the line as all-or-nothing without explanation.
- If the source set includes multiple approval-related records, reconcile them in order of specificity and timing.

## 6. Output structure conventions

- Write the deliverable as a compliance report titled for disbursement review and reduction recommendations.
- Include a short methodology section stating the governing source documents reviewed and the standard used for compliance testing.
- Define a simple ordinal severity scale once near the top and apply it consistently to each flagged item.
- Organize the body by disbursement category or by invoice line, using whichever makes the compliance decision clearest from the source materials.
- For each entry, use a consistent row format such as:
  - Invoice Line
  - Disbursement Type
  - Governing Provision
  - Pre-Approval Status
  - Severity
  - Issue
  - Recommended Reduction
- Include a concise summary table showing total reviewed items, total flagged items, and total recommended reduction.
- End with a short Recommended Actions section that tells the reviewer what to do next, using imperative verbs and assigning the task to the appropriate role named in the source materials when available.
- If no reduction is recommended for a line, say so expressly rather than leaving the result implicit.
- Match the required output filename exactly: `disbursement-compliance-report.docx`.
