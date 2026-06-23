---
name: extract-key-terms-reinsurance-treaty
task_id: insurance/extract-key-terms-from-reinsurance-treaty
description: Agents extracting key terms from a reinsurance treaty should capture headline provisions, cross-reference related documents, and check for internal consistency, missing elections, ambiguous formulas, and operational mechanics across the treaty package.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Reinsurance Treaty — Term Sheet Summary

## 1. Subject-matter triage (only if applicable)

- Treat the treaty as a package, not a single instrument: read the treaty together with schedules, endorsements, exhibits, slips, side letters, guideline summaries, and any internal underwriting or compliance instructions.
- Identify whether there is more than one operative period, election window, attachment base, or counterpart document; if so, enumerate each before analysis and keep the extraction aligned to the correct version.
- If the request is for a term sheet summary and issues report, the primary deliverable is an advisory extraction with issues; do not substitute a generic summary.

## 2. Failure modes the skill is correcting

- Headline terms are lifted correctly, but formulas, exceptions, and conditional mechanics are not tested at the edges, leaving silent gaps in the operative range.
- The treaty is reviewed in isolation, so inconsistencies between the treaty and related documents are missed.
- Election rights and deadlines are described without identifying who may act and by when.
- Operational clauses are noted without capturing how money, notice, collateral, offsets, or post-termination obligations actually work.
- Issues are described abstractly without severity, cross-reference, or downstream consequence.

## 3. Legal frameworks / domain conventions that apply

- Reinsurance treaty interpretation: read coverage grants, exclusions, conditions, and operational clauses as a connected whole, giving effect to each provision where possible.
- EC/extra-contractual exposure style provisions: identify the clause that addresses non-contractual or defense-related exposure and compare any stated cap, sublimit, or treatment elsewhere in the package.
- Sliding scale commission mechanics: extract the stated range, floor, ceiling, and formula; test whether the documents address performance outside the stated range.
- Profit commission mechanics: extract threshold, carryforward, and calculation inputs; confirm the same defined terms are used consistently throughout the package.
- Named storm and catastrophe aggregation provisions: identify the aggregation window, election mechanics, and deadline for election, and confirm who holds the election right.
- Reinstatement premium mechanics: capture the reinstatement trigger, base, and denominator assumptions used in the formula.
- Follow-the-fortunes / follow-the-settlements standards: identify which standard applies and whether it reaches reserves, settlements, or both.
- Funds withheld, trust, and collateral provisions: identify whether collateral is retained through withheld funds, a trust account, or another mechanism, and separate crediting or interest treatment from principal flow.
- Intermediary and premium payment clauses: determine who is authorized to receive payment and whether receipt by the intermediary discharges the payer.
- Offset and insolvency clauses: identify whether setoff is permitted and whether any insolvency limitation narrows that right.
- Run-off and cancellation provisions: identify what survives termination, what claims remain in scope, and what notice or timing conditions apply.
- Arbitration, service of suit, audit, downgrade, notice, and large-loss provisions: extract the operative mechanics, not just the topic heading.
- Apply the governing treaty article, clause, schedule, or cited guideline for each proposition; do not state a legal or operational conclusion without naming its source.

## 4. Analytical scaffolds

1. Build a source map first:
   - List each document in the package and the role it plays.
   - Note any hierarchy, incorporation, amendment, or supersession language.
   - Flag any document that appears to modify another without clear cross-reference.

2. Extract key terms by category, with source citations for each:
   - Treaty period, inception, expiration, attachment, and basis of coverage
   - Ceded share, covered business, and exclusions
   - Commission structure, including any sliding scale, profit commission, and management expense load
   - Loss allocation, occurrence definition, and aggregation window mechanics
   - Reinstatement premium, if any
   - Notification, audit, reporting, and records rights
   - Collateral mechanics, including funds withheld, trust, or other security
   - Payment, intermediary, and offset provisions
   - Termination, cancellation, downgrade, and run-off mechanics
   - Dispute resolution, service of suit, and governing law
   - Any special clauses affecting catastrophe, extra-contractual exposure, TRIA, or other carve-outs

3. For each issue, use a full issue-close:
   - State the issue precisely and tie it to the relevant figure, threshold, term, period, or other source-based measure.
   - Cross-reference the interacting clause, schedule, or related document.
   - Explain the downstream consequence for the client in practical terms.
   - Assign an ordinal severity level defined once at the top of the report and apply it consistently.

4. Treat missing elections and ambiguous formulas as separate issues unless the documents clearly resolve them together.
   - If only one party can act, say so explicitly.
   - If the deadline is absent, identify the absence as the issue rather than inferring a deadline.
   - If the formula depends on an unstated denominator, base, or period, call out the missing input and its effect on the calculation.

5. When comparing the treaty to internal guidelines:
   - Note where the treaty is compliant, unclear, or inconsistent.
   - Distinguish a hard conflict from a drafting ambiguity.
   - Identify whether the guideline is more restrictive, more permissive, or simply different in mechanics.

## 5. Vertical / structural / temporal relationships (only if applicable)

- If the package contains multiple related documents, track vertical priority: main treaty, endorsements, schedules, addenda, and internal guidelines.
- If a later document amends an earlier one, note whether the later document expressly amends, supplements, or only informs interpretation.
- If the same term changes across time or across documents, report the chronology and the operative version.
- If one provision sets a cap, floor, window, or trigger and another provision modifies it, analyze both together before stating the extracted term.

## 6. Output structure conventions

- Use a conventional legal term-sheet format with headings such as:
  - Transaction overview
  - Key economic terms
  - Coverage and exclusions
  - Claims / loss handling mechanics
  - Collateral and payment mechanics
  - Termination and run-off
  - Dispute resolution and administrative provisions
  - Issues and recommended resolutions
- Include a short severity legend at the top of the issues section using an ordinal scale.
- For every issue entry, include: severity, source citation(s), concise description, interaction with other provision(s), and client consequence.
- End with a Recommended Actions section that gives concrete next steps, assigns the responsible role where identifiable from the source set, and ties timing to a document deadline or the next transactional milestone.
- Keep the extraction faithful to the source documents; do not infer missing economics, elections, or calculations unless the documents expressly supply the inputs.
- Surface verbatim quotes from internal documents only when they are necessary to resolve ambiguity or to preserve exact operative wording.
