---
name: ecvc-extract-key-terms-stockholder-agreement
task_id: emerging-companies-venture-capital/extract-key-terms-from-stockholder-agreement
description: Extracting key terms from a stockholder agreement requires fully capturing director qualification requirements embedded in board composition subsections, assessing debt covenant scope against the operative definition of the relevant indebtedness term, identifying any single investor's concentration of protective provision blocking positions, and confirming transfer-right exercise period precision together with any deemed-waiver mechanics.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Stockholder Agreement

## 1. Subject-matter triage
- Treat the stockholder agreement as the primary source, but compare it against the term sheet, cap table, and side letter for inconsistencies, omissions, and side-deal deviations.
- Separate core governance terms, economic terms, transfer restrictions, and information rights before drafting the summary.
- Surface any term that is unusually buried in definitions, subsections, exhibits, or cross-references; do not rely on headings alone.
- If a point appears in more than one source document, reconcile the documents rather than summarizing each in isolation.

## 2. Failure modes the skill is correcting
- Board composition is summarized at the headline level while director qualification conditions, nomination mechanics, observer rights, and vacancy rules buried in subsections are missed.
- Protective provisions are extracted as isolated veto rights without aggregating which investor or holder actually controls multiple blocking positions.
- Debt or leverage covenants are described without tying them to the operative definition of indebtedness or related defined terms that determine practical scope.
- Transfer rights are misstated because the exercise window, business-day/calendar-day measure, sequencing among holders, and waiver consequence are not read together.
- Side-letter deviations are ignored, causing the summary to reflect the main agreement but miss negotiated exceptions or investor-specific overrides.
- Cap-table alignment is not checked, so designation rights, voting thresholds, and ownership-based rights are summarized inconsistently with the cap table.
- Term-sheet discrepancies are not flagged, so the summary presents the agreement as if it fully matches the financing package when it does not.

## 3. Legal frameworks / domain conventions that apply
- Board composition provisions often embed qualification standards for investor-designated directors, such as affiliation limits, independence requirements, or removal triggers, within the same clause as the seat allocation.
- Protective provisions must be read by action category and consent threshold; a single holder may appear across several categories, which can create a concentration of veto power that should be stated expressly.
- Defined-term architecture matters: covenants referencing indebtedness, liens, investments, or restricted payments operate through the contract’s definitions, exceptions, and baskets.
- Transfer mechanics typically include notice, election, timing, allocation among eligible holders, and deemed waiver; each element affects the practical enforceability of the right.
- Side letters may carve out bespoke rights, waive standard constraints, or preserve special governance rights; those deviations should be identified as such, not merged into the baseline terms.
- Cap-table references may control ownership percentages, class rights, and voting thresholds; reconcile the agreement’s rights against the capitalization data before stating any threshold-based term.
- Term sheets are often nonbinding on detail but useful for spotting scope drift, investor protections, and omitted business points; use them as a comparison set, not a substitute for the operative agreement.

## 4. Analytical scaffolds
- For governance:
  - Extract total board size.
  - Identify each designation right and the holder or class that controls it.
  - State any qualification, removal, replacement, observer, quorum, or consent mechanics attached to that seat.
  - Note whether rights depend on ownership thresholds or continuing affiliation.
- For protective provisions:
  - List each protected action.
  - State the exact consent holder(s) or approval threshold.
  - Group provisions by the investor or class that can block them.
  - Flag overlapping veto rights or concentration of control.
- For transfer and liquidity rights:
  - Extract right-of-first-refusal, co-sale, drag-along, tag-along, or similar mechanics.
  - State the notice period, exercise period, measurement method, and waiver effect.
  - Note sequencing among holders and any allocation or proration rule.
- For financial and operational covenants:
  - Identify each covenant.
  - Tie the covenant to the relevant defined term and listed exceptions.
  - State the practical scope in plain English, including what is covered and what is excluded.
- For information rights:
  - Extract reporting cadence, budget rights, inspection rights, and investor eligibility thresholds.
  - Identify any special rights tied to major investors or specific classes.
- For document comparison:
  - Read the agreement against the term sheet, cap table, and side letter in the same pass.
  - Record each deviation as either an omission, expansion, narrowing, or bespoke override.
  - Preserve the business significance of each deviation, not just the textual difference.

## 5. Vertical / structural / temporal relationships
- Track rights vertically from section title to subsection, definition, exception, exhibit, and cross-reference.
- Track relationships across documents: main agreement, term sheet, cap table, and side letter may each modify the operative position.
- Track temporal mechanics precisely: when notice is given, when a response period starts, how the period is measured, when waiver occurs, and when rights expire or terminate.
- Track conditional dependencies: many rights activate only after a financing closing, ownership threshold, transfer event, or board reconstitution.
- Track class and holder hierarchy: common, preferred, founders, and major investors may have different rights that should not be collapsed into one generic bucket.

## 6. Output structure conventions
- Write a term-sheet-style summary organized by governance category rather than by document.
- Include a board composition section with:
  - total board size
  - each designation right
  - the controlling holder or class
  - seat qualifications and replacement mechanics
- Include a protective provisions section with:
  - protected action
  - required consent
  - blocking holder or class
  - whether the right is concentrated across multiple actions
- Include a transfer restrictions section with:
  - trigger
  - notice or exercise period
  - calendar-day or business-day measure
  - waiver or deemed-waiver consequence
- Include a covenants section for debt, transfer, and operational restrictions that depends on defined terms.
- Include an information rights section for reporting, budget, and inspection rights.
- Include a deviations section that flags differences between the agreement, term sheet, cap table, and side letter.
- State any ambiguity, carve-out, or mismatch plainly and tie it to the affected provision.
- Use concise, deal-summary prose; do not draft commentary about the analysis process.
- If a control right depends on ownership, state the ownership reference used and whether the source documents align.
