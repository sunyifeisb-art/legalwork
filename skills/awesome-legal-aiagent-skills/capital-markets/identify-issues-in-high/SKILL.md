---
name: identify-issues-in-high-yield-indenture-dividend-recap
task_id: capital-markets/identify-issues-in-high
description: High-yield indenture issue analysis for a proposed dividend recapitalization, focusing on covenant restrictions, basket availability, calculation checks, and drafting ambiguities that may create structural risk.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in High-Yield Indenture — Dividend Recapitalization

## 1. Subject-matter triage

- Treat the restricted payments covenant as the primary gate, but test every adjacent provision that can independently block or condition the dividend recapitalization.
- If the source set includes multiple possible baskets, tests, or exceptions, enumerate them all before evaluating availability; do not collapse distinct pathways into one generalized conclusion.
- Surface verbatim quotes from internal documents only when they are needed to anchor a disputed text point; otherwise paraphrase the operative language.

## 2. Failure modes the skill is correcting

- The analysis identifies the restricted payments covenant but fails to map each sub-basket, exception, and condition separately, which can miss the only viable path for the dividend.
- The analysis accepts a headline basket balance without checking the controlling definition, the applicable measurement date, or any pro forma test that conditions use of the basket.
- The analysis relies on a financial annex without recomputing the stated ratio or checking whether the annex formula matches the indenture definition.
- The analysis misses drafting inconsistencies that create uncertainty in basket capacity, covenant suspension, subsidiary designation mechanics, reporting compliance, or cross-referenced exceptions.
- The analysis describes a risk but does not tie it to source-document scale, interacting provisions, and transaction impact, leaving the memo incomplete for decision-making.

## 3. Legal frameworks / domain conventions that apply

- Restricted payments analysis: identify each permitted-payment pathway, including fixed baskets, builder-style baskets, equity or contribution-based baskets, carve-outs for specified distributions, and any other enumerated exceptions; determine the applicable conditions, formula, and current availability for each.
- Coverage or leverage test conditions: if any basket or exception requires a ratio test, verify it under the indenture’s defined terms using the source financial data and pro forma adjustments supplied in the record.
- Builder basket mechanics: confirm the accrual start date, the accumulation source, any deductions, and any cap or reset mechanism; inconsistent dates or definitions create uncertainty in available capacity.
- Covenant suspension or baskets tied to ratings: if the indenture suspends restrictive covenants upon satisfaction of ratings or similar thresholds, identify activation conditions and the scope of actions permitted during suspension.
- Unrestricted subsidiary mechanics: review any ability to designate subsidiaries or assets outside the restricted group; assess whether the indenture includes a taint feature, transfer cap, or re-designation limit that constrains the loophole.
- Change of control put: evaluate whether the proposed recapitalization could interact with a change of control threshold or sponsor ownership mechanics that would trigger repurchase rights.
- Reporting covenant compliance: compare delivery deadlines for financial statements and related reports against the transaction timeline and customary audit completion assumptions disclosed in the materials.
- Cross-reference integrity: verify that exceptions, defined terms, and covenant carve-outs point to the correct provisions and that any affiliate or permitted transaction language is complete and operative.

## 4. Analytical scaffolds

- Start with a basket-by-basket inventory: name the basket or exception, state the governing section, identify the formula or cap, note the required conditions, and determine whether the source documents support current availability.
- For any ratio or financial test, recompute the result from the source materials using the indenture’s definition; note whether any mismatch is arithmetic, definitional, or caused by missing inputs.
- For any accrual-based basket, identify every date reference, reconcile inconsistencies, and explain how the inconsistency affects capacity now and at closing.
- For any covenant-suspension provision, state the trigger, the evidence of satisfaction, the covenants affected, and the extent to which it would expand dividend capacity.
- For any unrestricted-subsidiary or asset-transfer provision, test whether the structure allows value leakage outside the restricted group and whether any cap or taint provision limits that outcome.
- For any change of control or reporting issue, connect the trigger or deadline to the proposed transaction timetable and explain the downstream consequence if the condition is not satisfied.
- For any cross-reference problem, identify the broken link, the clause that was intended to be incorporated, and the practical effect on the exception or covenant being relied upon.

## 5. Vertical / structural / temporal relationships

- Track hierarchy: defined term → covenant exception → schedule, annex, or related document → transaction step.
- Track timing: historical accrual start, current measurement date, signing date, closing date, and any post-closing testing or reporting deadline.
- Track dependency: basket availability may depend on pro forma compliance, sponsor actions, subsidiary designations, or satisfaction of a separate covenant condition.
- Track mismatch risk: if one section uses a different start date, threshold, or reference provision than another, treat the inconsistency as a standalone issue because it can change the result even if the headline basket appears sufficient.

## 6. Output structure conventions

- Produce an issue memorandum organized by issue number.
- Define a severity scale once at the outset and apply it uniformly to every issue entry.
- For each issue, include: the issue description, applicable indenture section(s), the source-document scale or threshold that frames the problem, the related clause or document that interacts with it, the consequence for the proposed recapitalization, the severity rating, and the recommended resolution.
- Where the analysis turns on multiple baskets, tests, periods, or alternative pathways, give each a separate row or sub-entry rather than combining them.
- Include a concise summary table that inventories all restricted payments pathways reviewed, with conditions, current availability, and the basis for each availability determination.
- End with a Recommended Actions section that assigns each action to the relevant role and ties it to a transaction milestone or other source-based timing anchor.
- Use controlling legal authority or the operative indenture language whenever you state a legal proposition; do not state a conclusion without identifying the rule, section, or defined term that supports it.
