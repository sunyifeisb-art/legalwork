---
name: extract-key-terms-warehouse-credit-facility
task_id: structured-finance-securitization/extract-key-terms-from-warehouse-credit-facility-term-sheet
description: Extract material terms from a warehouse credit facility term sheet and any supplemental side letter, compare overlapping provisions for consistency, identify undefined or ambiguous covenant language, and flag structural issues in events of default and eligibility provisions for follow-up analysis and negotiation.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Warehouse Credit Facility Term Sheet — Structured Extraction Memo

## 1. Subject-matter triage

- Treat the term sheet and side letter as a single integrated source set unless the text clearly states otherwise.
- Identify every provision that is amended, qualified, superseded, or made subject to a side letter; do not assume the term sheet controls by default.
- Separate pure extraction from issue spotting: first capture what the documents say, then flag what is incomplete, inconsistent, or operationally hard to administer.
- If the source set contains more than one version of a provision, enumerate each version before comparing them.

## 2. Failure modes the skill is correcting

- Extracting terms from one document without checking whether a side letter changes the same deal point.
- Reporting financial covenants, advance mechanics, or eligibility criteria without testing whether the defined terms actually support the stated rule.
- Collapsing multiple documents into a single summary and losing which source controls which term.
- Treating a vague covenant, reporting obligation, or default trigger as if it were administrable simply because it appears in transaction language.
- Missing structural issues where a default trigger, cure right, or eligibility screen operates differently across documents.
- Failing to tie each flagged issue to a concrete transaction consequence and a specific follow-up action.
- Presenting a narrative memo without a disciplined extraction structure that lets a reader find the operative terms quickly.

## 3. Legal frameworks / domain conventions that apply

- Warehouse credit facilities are designed to finance collateral accumulation before takeout or securitization, so collateral quality, eligibility screens, and advance mechanics are core deal terms.
- Priority-of-payment provisions should be checked for internal coherence across fees, interest, principal, expenses, and reserve or reimbursement items.
- Financial covenants require defined inputs, measurement timing, and computation mechanics; a ratio without a usable formula is not fully administered by the document.
- Default provisions should be read together with any cure rights, notice mechanics, and grace periods to determine whether a breach is immediate or remediable.
- Material adverse change language should be reviewed for breadth, qualifiers, and whether it is tied to business, collateral, performance, or insolvency concepts.
- Cross-default language should be read against the referenced obligations and thresholds in the source set to test whether the trigger is calibrated or overbroad.
- Representation clauses qualified by knowledge should be treated as narrower than unqualified affirmations and noted accordingly.
- Reporting covenants should be checked for frequency, subject matter, and any open-ended request right that could create an unlimited obligation.
- Backup servicing and similar continuity provisions should be reviewed for timing, appointment mechanics, and the existence of any protection gap.
- Use generally recognized contract-interpretation principles: read the documents as a whole, give effect to specific provisions over general ones, and treat later or more specific amendments as potentially controlling where the text says so.

## 4. Analytical scaffolds

1. Extract the economic package.
   - Commitment or facility size
   - Advance mechanics and any eligibility-based borrowing formula
   - Interest, fees, default pricing, and other payment mechanics
   - Maturity, extension, amortization, prepayment, and termination rights

2. Extract the covenant package.
   - Each financial covenant or reporting-based test
   - Thresholds, measurement dates, cure rights, and calculation inputs
   - Any undefined metric, ambiguous denominator, or incomplete formula

3. Extract default and remedy mechanics.
   - Each event of default or acceleration trigger
   - Any materiality qualifier, notice requirement, grace period, or cure period
   - Any cross-default, insolvency, judgment, or misrepresentation trigger

4. Extract collateral and eligibility provisions.
   - Asset-level eligibility criteria
   - Concentration limits, geographic or legal constraints, and enforceability conditions
   - Any mismatch between the intended collateral profile and the stated criteria

5. Extract representations, undertakings, and reporting.
   - Compliance reps, knowledge qualifiers, and legal-status statements
   - Scheduled reporting, ad hoc reporting, notice obligations, and audit or inspection rights
   - Any obligation that is open-ended as to timing, scope, or recipient

6. Compare the term sheet and side letter term by term.
   - Identify whether one document amends, narrows, or expands the other
   - State which document appears controlling only if the text provides a basis for that conclusion
   - If the documents conflict, record the conflict rather than harmonizing it silently

7. For each flagged issue, include all of the following in the issue entry.
   - The exact provision category and the source document(s)
   - The scale of the issue using a transaction-specific figure, threshold, term, or frequency from the documents
   - The interacting clause, schedule, or document that makes the issue material
   - The downstream consequence for the client
   - A specific negotiation or drafting resolution

8. Use a uniform severity scale for every issue.
   - Define the scale once, then apply it consistently
   - Keep the labels ordinal and comparable across entries

9. Cite the controlling authority or contract text for each legal proposition.
   - When the point is driven by the documents, cite the operative clause or defined term by source location
   - When relying on a general legal rule, cite the relevant statute, regulation, rule, or recognized doctrine by name
   - Do not state a legal conclusion without identifying the authority or source language supporting it

## 5. Vertical / structural / temporal relationships

- Cross-default triggers, MAC language, and cure periods can interact to create multiple paths to the same remedy; analyze them together.
- Eligibility criteria and advance mechanics interact because an asset can be eligible in concept but still produce a lower or unusable borrowing amount under the formula.
- Priority of payment and reserve mechanics interact because the waterfall can affect how quickly collateral value is applied to secured obligations.
- Reporting frequency, inspection rights, and ad hoc request rights interact because a narrow scheduled report can be expanded by a broad catch-all request clause.
- Side letters may operate as targeted amendments; check whether they create timing gaps, carve-outs, or exceptions that are not visible in the main term sheet.

## 6. Output structure conventions

- Write the memo as an extraction-first, issue-spotting second document.
- Start with a concise deal overview, then organize the extracted terms by conventional deal categories such as economics, covenants, defaults, collateral, representations, reporting, and special terms.
- For each extracted term, identify the source document(s): term sheet, side letter, or both.
- Follow the extraction section with an issues section that uses numbered entries.
- Give each issue a severity label from the defined ordinal scale and a short rationale line.
- Close each issue with a concrete follow-up or negotiation recommendation in imperative form, naming the responsible role and an urgency anchor if one is available from the documents.
- If a term is unresolved or ambiguous, say so directly rather than inferring missing text.
- Keep the memo suitable for conversion into `key-terms-extraction-memo.docx` and ensure the substance, not just headings, carries the analysis.
