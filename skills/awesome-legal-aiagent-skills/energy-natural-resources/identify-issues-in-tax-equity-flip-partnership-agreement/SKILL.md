---
name: identify-issues-in-tax-equity-flip-partnership
task_id: energy-natural-resources/identify-issues-in-tax-equity-flip-partnership-agreement
description: Guides issue identification in a tax equity flip partnership agreement by cross-referencing the financial model's tax assumptions against current applicable law, assessing eligibility for available tax credit bonus treatments and related substantiation, and analyzing structural tax risks including basis adjustment rules, partnership anti-abuse principles, and back-leverage mechanics.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Tax Equity Flip Partnership Agreement — Renewable Energy

## 1. Subject-matter triage
- Use this skill for issue spotting in a tax equity flip partnership agreement and its supporting model, tax diligence, and financing materials.
- Separate pure tax-model assumptions from governing-agreement mechanics and financing covenants before analyzing consequences.
- If the source set covers multiple project periods, financing tranches, or counterparties, enumerate them first and analyze each separately rather than blending them into one pass.

## 2. Failure modes the skill is correcting
- The model assumes a credit, bonus treatment, depreciation rate, or flip date without verifying the controlling law for the placed-in-service year or the project’s documented eligibility.
- A claimed bonus treatment is accepted without checking the underlying substantiation in the source materials.
- Basis reduction is omitted or applied late, overstating depreciation and distorting projected flip economics.
- Partnership allocations are reviewed for business intent but not for whether they satisfy the applicable tax-allocation standard.
- Sponsor financing and pledge mechanics are treated as routine even though they may implicate partnership tax restrictions or required consents.
- Recapture protection is discussed abstractly without testing whether the agreement defines triggering events and indemnity consequences with enough specificity.
- Reserve, covenant, and financing-document requirements are reviewed in isolation instead of against each other.
- Issues are described without a severity judgment, source cross-reference, quantified scale, or practical resolution path.

## 3. Legal frameworks / domain conventions that apply
- Tax equity flip structure: pre-flip allocations typically favor the tax equity investor; post-flip economics shift toward the sponsor; the flip may be yield-based or time-based, and the trigger must be checked against the model because it changes return allocation and residual economics.
- Credit-rate and bonus-treatment analysis: confirm the applicable statutory or regulatory credit framework for the project and verify that any claimed adder is supported by the required factual record.
- Basis reduction on credit claims: when a credit is claimed, the depreciable basis must be reduced under the applicable tax rule before depreciation is computed; failure to do so overstates deductions and can accelerate the modeled flip.
- Bonus depreciation phase-down: the applicable bonus depreciation percentage depends on the placed-in-service year; use the rate in force for that year and flag any mismatch with the model.
- Domestic content bonus: eligibility depends on meeting the relevant sourcing standard for manufactured components; it is not self-proving and must be supported by sourcing records and contract documentation.
- Energy community bonus: eligibility turns on the project location’s status under the applicable designation or mapping methodology as of the relevant date; site verification is required.
- Partnership allocations: allocations must satisfy the applicable substantial economic effect framework or equivalent test under the partnership tax rules.
- Sponsor back-leverage: pledges of partnership interests and related debt mechanics can create partnership tax and consent issues depending on structure and governing-agreement restrictions.
- Recapture risk: the credit may be recaptured if the project is disposed of or ceases qualifying use during the recapture period; the agreement should define recapture events and address indemnity and gross-up consequences.
- Operating reserves: reserve requirements in the partnership agreement should align with financing documents and investor requirements to avoid a covenant mismatch.

## 4. Analytical scaffolds
- Build a list of the tax assumptions in the model, then test each against the governing law and the supporting record: credit rate, bonus treatment, basis treatment, depreciation rate, and flip timing.
- For each claimed bonus treatment, identify the evidentiary source in the materials, test whether it matches the legal eligibility standard, and note any missing or inconsistent support.
- For each allocation or distribution mechanic, test whether the agreement’s economic terms align with the applicable partnership tax allocation rule and whether any carve-out or special allocation creates recharacterization risk.
- For each financing or pledge mechanic, test whether the agreement requires consent, notice, or other procedural approval and whether the source materials show that condition satisfied.
- For each recapture provision, test the definition of triggering events, the duration of exposure, and whether the indemnity covers the investor’s tax cost and related gross-up exposure.
- For each issue, include: the governing authority, a severity rating, the scale of the issue using a figure or threshold from the source materials, the interacting document or clause, the downstream consequence, and a concrete fix.

## 5. Vertical / structural / temporal relationships
- Track the relationship between the model, the partnership agreement, the financing documents, and any tax diligence materials; the model should reflect legal assumptions that the agreement and supporting documents can actually sustain.
- Track pre-flip and post-flip periods separately because a defect in the pre-flip allocation or basis treatment can move the flip date and alter the sponsor’s residual economics.
- Track placed-in-service timing against any credit, bonus depreciation, or eligibility determination that depends on year-specific law or project status at a particular date.
- Track reserve and covenant mechanics across the partnership agreement and external financing documents so a mismatch is identified as a live compliance problem, not a drafting preference.
- When multiple partners, projects, or tranches exist, analyze each one individually before comparing them for consistency.

## 6. Output structure conventions
- Prepare an issues memorandum in industry-conventional form, using clear categories such as tax-model issues, structural issues, and compliance or covenant issues.
- Define a uniform ordinal severity scale once, then apply it to every issue entry.
- For each issue, give the governing authority by name and section or comparable citation, describe the factual basis from the source materials, quantify the issue using an available transaction figure, term, threshold, or other scale marker, cross-reference the related clause or document, state the downstream consequence, and recommend a fix.
- Close the memorandum with a Recommended Actions block that uses imperative verbs, identifies the responsible role, and includes a timing anchor tied to the deal process or a stated deadline.
- Keep the writing action-oriented and diagnostic; do not narrate the document set at a high level without isolating the material problems and resolutions.
