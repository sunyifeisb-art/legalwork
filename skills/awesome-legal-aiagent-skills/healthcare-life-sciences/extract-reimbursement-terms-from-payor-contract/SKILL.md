---
name: hls-extract-reimbursement-terms-payor
task_id: healthcare-life-sciences/extract-reimbursement-terms-from-payor-contract
description: Extracts and catalogs reimbursement terms from a managed care payor contract and any related exhibits, focusing on methodologies, rate structures, escalation mechanics, discount provisions, audit and recoupment mechanics, value-based care terms, and termination-related payment obligations, benchmarked against general industry playbook conventions.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Catalog Reimbursement Terms from Managed Care Payor Contract

## 1. Subject-matter triage
- Treat the PPA, fee schedules, exhibits, amendments, attachments, and incorporated policies as one integrated reimbursement record unless the contract clearly disclaims incorporation.
- Build the extraction around payment mechanics first: what is paid, to whom, for which services, when, on what basis, and subject to what deductions, withholds, recoupments, or true-ups.
- Separate provider-facing reimbursement terms from administrative provisions only when they directly affect payment, audit rights, dispute windows, or termination-related continuation of reimbursement.
- If multiple service lines, rate schedules, or effective periods appear, analyze each separately rather than averaging them.

## 2. Failure modes the skill is correcting
- Escalator scope constraints are missed, causing overstatement of revenue when a rate increase applies only to a narrow subset of reimbursement.
- Distinct methodologies are collapsed into one generic “fee schedule,” obscuring materially different payment effects across service categories.
- Timing mechanics are under-read, especially prompt-pay, audit, recoupment, effective-date, and post-termination payment obligations.
- Offset and recoupment rights are treated as administrative, when they can materially reduce net collections.
- Value-based care provisions are summarized without separating upside, downside, reconciliation, and settlement timing.
- Contract and exhibit mismatches are not reconciled, leaving the wrong schedule as the operative rate source.
- Benchmarking is performed at a high level instead of clause-by-clause against standard managed care playbook conventions.
- Risk is described narratively without tying it to the payment consequence, the affected category, and the source location.

## 3. Legal frameworks / domain conventions that apply
- Reimbursement methodologies may be expressed as per diem, percentage-of-charge, fee schedule, case rate, capitation, bundled payment, carve-out, or hybrid structures; identify the operative method for each service line.
- Time-based professional services may use unit-based or increment-based computation; extract the stated increment, rounding rule, and any conversion between time and billable units.
- Prompt-pay discounts may apply to allowed amounts, billed charges, or balances after patient responsibility; identify the base, trigger date, and exclusions.
- Escalators may reference CPI, medical CPI, market basket, or a fixed percentage; extract the index, cap, floor, measurement period, and any limitation by service category or contract year.
- Emergency and high-acuity services may use blended rates, exceptions, or carve-outs; identify the component services and the blending methodology.
- Audit, overpayment, and recoupment provisions commonly include look-back windows, notice, offset, withholding, and repayment mechanics; extract each separately.
- Value-based care may include upside sharing, downside risk, quality gates, reconciliation, and settlement timing; identify sequencing and whether risk is symmetrical or staged.
- Termination provisions may preserve payment for in-flight treatment episodes or transitional care; extract the duration, eligible patients, and whether standard rates continue.
- Benchmark comparisons should use general managed care contracting conventions and the plain meaning of the operative clause unless the contract defines a term differently.
- Where the contract cites a statute, regulation, or incorporated policy, use that authority as the benchmark anchor rather than inferring a broader industry norm.

## 4. Analytical scaffolds
1. Inventory the operative documents and rank them by payment relevance: base agreement, rate exhibits, amendments, fee schedules, policies, and cross-referenced manuals.
2. Enumerate each reimbursement term by payment category before analysis: methodology, base rate, modifiers, exclusions, escalation, discount, audit, recoupment, value-based care, termination payment, dispute timing, and any other payment-affecting term.
3. For each term, extract: the trigger, the computation method, the affected service category, the timing rule, and any cap, floor, exclusion, or exception.
4. Compare the clause to the surrounding schedule or exhibit to confirm whether it is standalone, overridden, or limited by another provision.
5. For each category, state the economic effect in practical terms: increases gross reimbursement, reduces net reimbursement, delays collection, expands repayment exposure, or creates contingent upside/downside.
6. When a clause uses defined terms, trace those definitions back to the contract definitions section before finalizing the extraction.
7. For escalators, identify the covered categories first, then the index or formula, then the adjustment timing, then any cap/floor or low-inflation mechanic.
8. For prompt-pay and discount provisions, identify the payment base, the due-date condition, and whether patient responsibility is excluded from the discount calculation.
9. For audit and recoupment provisions, extract the review period, notice requirements, offset rights, interest or repayment terms, and any dispute window.
10. For value-based care, separate earned incentives from contingent settlement mechanics and from reconciliation timing.
11. For termination, separate contract termination rights from payment survival provisions and transitional care obligations.
12. For each extracted term, provide: source location, plain-English interpretation, benchmark comparison, and risk assessment.
13. If a provision is ambiguous, identify both plausible readings and the one that is safer for revenue recognition or collections planning.
14. If the contract spans multiple service lines or periods, produce a discrete analysis row for each distinct term-bearing category.
15. If a provision interacts with another clause, summarize the interaction explicitly rather than assuming the more specific clause controls.

## 5. Vertical / structural / temporal relationships
- Map terms vertically from agreement to exhibit to schedule to amendment to incorporated policy; later or more specific documents may narrow the base rule.
- Track temporal ordering for effective date, implementation date, measurement period, payment due date, audit window, recoupment window, reconciliation date, and termination survival period.
- Note whether a rate change applies prospectively only, retroactively, or upon a renewal/anniversary date.
- Distinguish service-line-specific terms from contract-wide terms, and distinguish provider-specific exceptions from population-wide provisions.
- If a clause references “subject to,” “except as,” “notwithstanding,” or similar priority language, treat that as a hierarchy signal and resolve the relationship before summarizing the term.
- Where termination or amendment language interacts with payment provisions, state whether the payment rule survives, is superseded, or is limited after the triggering event.

## 6. Output structure conventions
- Produce a reimbursement-term extraction report in a professional memo/report format suitable for `.docx`.
- Open with a short executive summary stating the overall reimbursement posture, the main economic levers, and the highest-risk payment terms.
- Include a contract map or table of contents by operative section or exhibit so the reader can trace each term to source text.
- Use a table or equivalent structured format with one row per extracted reimbursement term.
- For each row, include: source location, term type, operative language summary, interpretation, benchmark comparison, and risk rating.
- Use a uniform ordinal risk scale defined once at the outset, then apply it consistently to every entry.
- Include a separate summary of financial implications organized by upside, downside, timing, and operational friction.
- Include a distinct section for audit, recoupment, dispute, and termination-related payment terms, because those provisions often drive the largest hidden exposure.
- If multiple service lines or schedules exist, group rows by service category and then by contract section.
- Close with prioritized recommended actions directed to the appropriate internal owner or reviewer, with timing tied to contract execution, renewal, audit response, or other relevant milestone.
- Ensure every legal or contractual conclusion is anchored to the operative clause or incorporated authority identified in the source materials.
