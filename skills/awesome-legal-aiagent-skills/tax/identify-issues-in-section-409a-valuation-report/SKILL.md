---
name: identify-issues-in-section-409a-valuation-report
task_id: tax/identify-issues-in-section-409a-valuation-report
description: Reviewing a section 409A valuation report requires assessing each methodological choice for its effect on the concluded common stock value, organizing issues by severity, and evaluating whether the analysis supports the relevant valuation safe-harbor framework.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Section 409A Valuation Report

## 1. Subject-matter triage (only if applicable)

- Confirm the report is being used to support stock option or other equity award pricing, not a general finance memo.
- Identify the valuation date, common stock class valued, and whether the report is intended to support board action on grants.
- Enumerate the core inputs, then analyze each separately: recent financing, enterprise value method, market comps, income approach, OPM or PWERM assumptions, and any marketability discounts.
- If the source set contains multiple reports, drafts, or addenda, compare them by date and analyze the latest controlling version first.

## 2. Failure modes the skill is correcting

- Describing valuation concerns in abstract terms without tying each one to the concluded common stock value and board-reliance risk.
- Treating a flawed assumption as harmless when it could move the exercise price, undermine reasonableness, or weaken the valuation defense.
- Missing whether the report is structured to support a recognized valuation safe harbor and the ordinary indicia expected for that position.
- Overlooking inconsistencies between liquidity timing assumptions and contemporaneous facts, including management communications or financing activity.
- Ignoring the most recent financing round or other strong market evidence that should be reconciled to the common stock conclusion.
- Failing to test whether discounts are layered in a way that compounds rather than isolates the relevant adjustment.
- Accepting unsupported discount rates, peer sets, or selection criteria that cannot be independently reviewed.
- Writing a memo that catalogs problems but does not give a board-facing bottom line on reliance and remediation.

## 3. Legal frameworks / domain conventions that apply

- **Section 409A valuation consequences:** A below-fair-market-value equity grant can create deferred compensation consequences under Treasury Regulation section 1.409A-1 and section 1.409A-2, with adverse tax and interest consequences to the holder if the pricing is not defensible.
- **Valuation safe-harbor framework:** The report should be tested against the applicable presumption of reasonableness for FMV determinations under Treasury Regulation section 1.409A-1(b)(5), including whether it reflects an independent appraisal, a reasonable valuation method, and contemporaneous facts.
- **Market evidence from recent financing:** A recent preferred financing round is often the strongest observable evidence of enterprise value and implied common stock value; the report should explain why that evidence is or is not controlling under the circumstances.
- **Option pricing / liquidity timing convention:** OPM analyses depend on a time-to-liquidity assumption that should be consistent with the record available at the valuation date and with the company’s own communications.
- **Discount for lack of marketability convention:** Marketability discounts should be applied consistently and not layered in a manner that double-counts illiquidity or otherwise overstates the discount.
- **Income approach convention:** A discount rate should be traceable to a recognized build-up or WACC-style derivation with explainable inputs, not a bare conclusion.
- **Market approach convention:** Comparable companies should be identified, their screening criteria explained, and the basis for comparability stated so the analysis can be reviewed.
- **Board reliance standard:** The question is not whether every judgment is perfect, but whether the report is sufficiently reasoned and documented to support reliance for grant pricing under the applicable 409A framework.

## 4. Analytical scaffolds

- Start with a severity ladder and use it consistently: Critical, High, Medium, Low.
- For each issue, identify:
  1. the valuation input or assumption at issue;
  2. the magnitude or scale available from the source set;
  3. the document or fact that interacts with it;
  4. the likely direction of valuation distortion;
  5. the board or tax consequence if uncorrected.
- Always close each issue with three moves: quantify or anchor it to a source figure or timing fact; cross-reference the other document or section that bears on it; and state the downstream consequence for exercise price reliability or tax exposure.
- Where the source materials provide enough data, compare alternative treatments rather than describing only one.
- If a report claims safe-harbor support, test the claim against the report’s own methodology, disclosure, and contemporaneous record.
- If the report gives a single conclusion but multiple valuation methods are discussed, assess whether the reconciliation is transparent or whether one method is silently driving the result.
- If the source set includes only one relevant financing round, say so expressly; if there are multiple financing rounds or multiple valuation dates, enumerate them first and analyze each separately.
- When a numerical adjustment is visible in the source set, assess whether it is isolated or compounded by another discount, but do not invent arithmetic that is not shown.
- Use authority-based analysis: cite the governing regulation, valuation convention, or other controlling authority for each legal proposition you rely on.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare the valuation date against:
  - the most recent equity financing;
  - board or management communications about liquidity timing;
  - financial statements or operating results used in the model;
  - any later-dated addendum that revises the original assumptions.
- Track whether later information confirms, contradicts, or materially updates the original assumptions.
- If the report uses multiple levels of discounting or allocation, distinguish enterprise-level adjustments from share-level adjustments and test for overlap.
- If a preferred round, option pool change, or recapitalization sits between valuation date and board action, explain whether the report reconciles that event.
- If the report is comparing enterprise value to common stock value, identify the bridge and whether each step is explained enough to support board reliance.

## 6. Output structure conventions

- Write an issue-spotting memorandum, not a narrative summary of the report.
- Open with a short executive conclusion on board reliance, including whether the report is supportable as issued, supportable only with supplementation, or requires revision before reliance.
- Use an issue-by-issue format ordered by severity, with the most serious issues first.
- For each issue, include:
  - Severity;
  - Issue title;
  - What the report did;
  - Why it matters to the concluded common stock value;
  - Interacting facts or documents;
  - Legal / valuation authority;
  - Recommended corrective action.
- Keep the issue statement concrete and tied to the source record; avoid generic “needs more support” language unless you explain what support is missing.
- If a relevant assumption is unsupported, flag the consequence in plain language rather than merely stating it is “subjective.”
- Include a separate section for section 409A tax exposure, focused on holder consequences if FMV is understated.
- End with a Recommended Actions block that gives imperative steps, identifies the responsible role from the record where possible, and ties each step to a timing anchor or near-term board milestone.
- State the final board-reliance recommendation plainly and condition it on any identified follow-up work.
