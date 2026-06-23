---
name: extract-credit-agreement-covenants
task_id: banking-finance/extract-credit-agreement-covenants
description: Extract and analyze financial covenants from a credit agreement for acquisition diligence, including compliance status, headroom calculations, and risks affecting future flexibility.
activates_for: [planner, solver, checker]
---

# Skill: Credit Agreement Covenant Extraction Memo — Acquisition Diligence

## 1. Subject-matter triage
- Treat the credit agreement and the Q3 compliance materials as a matched source set and extract covenant terms against the reporting period(s) actually reflected in the compliance data.
- If the agreement contains multiple tests, baskets, carve-outs, or reporting dates, enumerate each one before analyzing it; do not collapse distinct tests into a single blended summary.
- If the source set includes only one covenant test or one reporting period, say so expressly and explain why no further breakdown is needed.

## 2. Failure modes the skill is correcting
- Extracting covenant levels without computing current headroom from the compliance data.
- Repeating the borrower’s calculation without checking whether it matches the agreement-defined metric.
- Missing contract-specific limitations on any cash netting or post-closing liquidity support that may affect leverage compliance.
- Failing to connect cure rights, step-ups, reset dates, and tightening tests to the borrower’s future flexibility.
- Overlooking reporting triggers, default grace periods, or conditional notices that change when and how a covenant becomes actionable.
- Summarizing compliance status without identifying the downstream diligence consequence for the acquisition.

## 3. Legal frameworks / domain conventions that apply
- Read each covenant by its defined terms, including numerator, denominator, permitted add-backs, exclusions, and any cap on deductions or exclusions.
- Compare the agreement definition to the compliance certificate methodology; if they differ, flag the discrepancy and reconcile both approaches in the memo.
- For leverage-style tests, analyze any contractual limit on unrestricted cash or similar netting adjustments and state whether additional cash would be fully, partially, or not creditable under the agreement.
- For coverage-style tests, compute current cushion against the applicable minimum and note whether any future tightening reduces available flexibility.
- For cure rights, identify both periodic and lifetime limits and analyze whether remaining cure capacity is meaningful in light of any expected step-up or tighter future test.
- For reporting or borrowing-base triggers, identify the trigger event and assess whether the current period data implicates it.
- For default provisions, separate payment-related defaults from covenant-related defaults and note any distinct grace or cure periods.
- Use the controlling agreement language as the primary authority; when the memo states a legal proposition about how the covenant works, tie it to the operative definition, test provision, cure provision, or default provision rather than stating the conclusion nakedly.

## 4. Analytical scaffolds
1. Source inventory: identify the agreement, compliance materials, and any schedules or certificates that bear on covenant testing.
2. Covenant extraction: for each covenant, record the threshold, test frequency, measurement date, step-up or step-down schedule, and any linked definitions.
3. Calculation review: determine the borrower’s reported metric and the agreement-defined metric; if both are available, compare them side by side.
4. Headroom analysis: compute compliance status and cushion against the relevant threshold for each tested covenant.
5. Methodology discrepancy check: identify any differences in treatment of cash, debt, add-backs, reinvestment periods, or reporting triggers.
6. Flexibility analysis: assess how cure limits, future step-ups, reporting obligations, or default grace periods affect post-close flexibility.
7. Risk framing: for each issue, state the scale of the issue, the related clause or schedule, and the practical consequence for diligence.
8. Prioritization: assign a severity label to each issue using a uniform ordinal scale defined at the start of the issues section.

## 5. Vertical / structural / temporal relationships
- If the agreement contains multiple covenants, organize them by covenant type and then by testing date or test period.
- If different provisions use different reinvestment periods, cure windows, or grace periods, list each period separately and compare them for consistency.
- If a future step-up, reset, or tightening date is scheduled, analyze present compliance and projected cushion after the change.
- If current utilization, balance, or reporting frequency may trigger an additional certificate or notice requirement, flag the operational consequence and the timing.
- If the source materials cover more than one quarter or measurement date, analyze each period distinctly before drawing any trend conclusion.

## 6. Output structure conventions
- Produce a covenant extraction memo in conventional diligence format, organized by covenant type.
- Include a covenant status table for each covenant: current level, threshold, headroom or cushion, testing frequency, and current compliance status.
- Include a methodology comparison section for any borrower-reported metric versus agreement-defined metric discrepancies.
- Include an issues section with a severity scale defined once at the top, and apply that same severity field to every issue.
- For each issue, state: the quantified impact, the related provision or other interacting source item, and the downstream consequence for the acquisition or financing process.
- End with a Recommended Actions section that gives an imperative action, the responsible role, and a timing anchor tied to the diligence or closing timeline.
- Keep the memo self-contained and operational; avoid generic recitation of the agreement and instead state what matters for diligence, flexibility, and compliance.
- If the task requires a file deliverable, ensure the operative memo content is written to the named deliverable and is not limited to a summary of the summary.
