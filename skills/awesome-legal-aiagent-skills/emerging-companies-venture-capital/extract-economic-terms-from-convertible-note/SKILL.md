---
name: ecvc-extract-economic-terms-convertible-note
task_id: emerging-companies-venture-capital/extract-economic-terms-from-convertible-note
description: Extract and compare economic terms across multiple convertible notes by grouping instruments by issuer, separating note-level extraction from cross-note comparison, identifying definitional inconsistencies, and preparing dilution modeling inputs.
activates_for: [planner, solver, checker]
---

# Skill: Extract Economic Terms from Convertible Notes

## 1. Subject-matter triage

This task is a multi-instrument extraction and comparison exercise for a single financing context. First confirm which notes belong to the same issuer and same bridge round, then analyze each note on its own before comparing across the set. If a cap table is provided, use it as the reference point for conversion and dilution inputs; if multiple entity names or financing tranches appear, keep them separated unless the documents expressly tie them together.

Enumerate the full set of notes and any cap table or reference schedules before analysis. Do not collapse multiple notes into one representative instrument.

## 2. Failure modes the skill is correcting

- Notes are summarized one by one without a side-by-side comparison, so conflicting economics, priority terms, or MFN effects are missed
- Cap and discount mechanics are extracted without checking whether the same defined capitalization base is used consistently across notes
- The analysis states a conversion result without showing the input assumptions needed for dilution modeling
- Ambiguous drafting is treated as harmless even when it affects conversion price, priority, or investor election rights
- Risks are described generally without tying them to the governing note language or the cap table
- A single adverse term is isolated without assessing whether it interacts with other notes to compound dilution or create election leverage

## 3. Legal frameworks / domain conventions that apply

- Convertible note economics turn on principal, accrued interest, maturity, conversion trigger, discount, valuation cap, and defined capitalization; these terms must be extracted as written and then normalized for comparison
- MFN rights must be tested for scope: whether the holder may adopt a later note’s more favorable term, whether the right is limited to economics or extends to the instrument as a whole, and whether combining features from multiple notes creates an unintended blended package
- Defined capitalization questions are often dispositive for cap-price calculations; check whether the denominator is pre-conversion or post-conversion, whether outstanding options or other convertibles are included, and whether the definition is internally consistent across notes
- Priority and subordination language must be read against the whole note set and any referenced financing documents; inconsistent ranking language can change enforcement outcomes and Series A negotiation leverage
- Default, acceleration, and remedy provisions should be flagged when they are subjective, uncured, or investor-favorable in a way that can pressure the company before the priced round
- Any board observer or information access term should be treated as a potential information-asymmetry issue because it can affect disclosure controls and trading sensitivity
- For dilution inputs, the analysis should translate each note into conversion share estimates under the cap and under representative financing prices, using the cap table as the baseline for fully diluted post-conversion ownership

## 4. Analytical scaffolds

Use the following sequence for each note, then compare across notes:

1. Identify the issuer, holder, principal amount, issue date, interest rate, maturity, conversion mechanics, cap, discount, MFN, subordination, information rights, default, and any side-letter or amendment references.
2. Normalize the economic terms into a common format so that different drafting styles can be compared directly.
3. Test each note’s cap definition and conversion mechanics against the cap table and against the other notes.
4. Evaluate whether any note’s MFN language could import more favorable economics from another note, either term-by-term or as a package.
5. Check whether the notes allocate priority consistently or whether any note purports to rank ahead of, pari passu with, or behind the others without a coherent framework.
6. Convert principal and accrued interest into estimated shares at the cap price and at representative financing price points; present the assumptions used so the dilution model can be reused.
7. Identify any subjective trigger, open-ended default, or ambiguous cure regime that creates leverage before the Series A.
8. Close each issue by stating: the scale of the issue, the related note or cap table provision that interacts with it, and the likely Series A consequence.

When a legal conclusion depends on a drafting rule or customary financing principle, name the relevant authority or standard by section, rule, or commonly recognized market convention rather than stating the conclusion bare.

For every issue, include an explicit severity assessment using a consistent ordinal scale defined once at the top of the section set, and keep the level tied to the economic or transactional impact.

## 5. Vertical / structural / temporal relationships

The notes should be read in a vertical chain: issuer-level capitalization facts first, then note-level economics, then cross-note interactions, then dilution impact in the anticipated Series A. Temporal sequencing matters as well: issuance date, amendment date, maturity, trigger date, and financing date can change which terms control or whether an MFN right is live.

Where a note references later amendments, side letters, or prior financings, treat those references as part of the same hierarchy and check whether later paper supersedes earlier economics. If the cap table reflects a later financing state than the notes, reconcile the timing before using it as the dilution baseline.

## 6. Output structure conventions

Organize the document in a conventional diligence format rather than a rubric-like checklist.

- Start with a brief executive summary stating the issuer, the set of notes reviewed, and the key economic pressure points for the Series A
- Provide a note-by-note extraction section with one subsection per note
- Include a comparison table that runs term-by-term across all notes and flags inconsistencies, ambiguities, or investor elections
- Include a dilution inputs table showing, for each note, the inputs needed for conversion share estimates at the cap and at representative financing prices
- Add a risk section that highlights MFN interactions, cap-denominator ambiguity, priority conflicts, and default leverage
- End with concise recommended actions directed to the relevant company role or counsel, tied to the next financing milestone

Write the deliverable so that the operative terms, comparison, and dilution inputs are all visible in the final document; do not leave the result as a narrative-only summary.
