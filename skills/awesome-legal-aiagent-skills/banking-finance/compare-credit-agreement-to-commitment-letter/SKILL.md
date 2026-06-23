---
name: compare-credit-agreement-to-commitment-letter
task_id: banking-finance/compare-credit-agreement-to-commitment-letter
description: Compares a draft credit agreement against related financing materials and produces a structured deviation report distinguishing items that appear to depart from the agreed package from items that are more likely to be negotiable market-practice changes.
activates_for: [planner, solver, checker]
---

# Skill: Credit Agreement vs. Commitment Letter Deviation Report (LBO Financing)

## 1. Subject-matter triage
- Treat the task as a document-comparison exercise across the draft credit agreement, commitment letter, term sheet, and any no-flex confirmation.
- Build the comparison issue-by-issue, not as a generalized summary of “better/worse” drafting.
- Separate true package departures from ordinary market flex or drafting cleanup; the negotiating posture differs.
- If multiple financing concepts are present, enumerate them first and analyze each one independently rather than collapsing them into a composite mismatch.

## 2. Failure modes the skill is correcting
- Focusing on headline economics while missing structural deviations such as omitted baskets, added conditions, or tighter covenant mechanics.
- Treating stepdown mechanics, reinvestment periods, cure periods, or addback limits as single provisions when the documents may change them in pieces.
- Failing to distinguish agreed-package deviations from market-practice deviations.
- Missing that a lender-favorable extension or tightening can be material even where the core label of the provision remains unchanged.
- Overstating a deviation without anchoring it to a source-document threshold, cross-reference, or transaction consequence.
- Writing conclusions without a clear severity ranking and action-oriented next step.

## 3. Legal frameworks / domain conventions that apply
- Read the financing package as a hierarchy of deal materials: the draft agreement should be tested against the commitment letter, term sheet, and any no-flex confirmation together.
- Compare each material concept against the agreed package as drafted in the source documents, including where the draft agreement implements the concept through related definitions, exceptions, baskets, or schedules.
- Treat lender flexibility language as bounded by the agreed package; if the draft goes beyond that flexibility, flag the mismatch.
- Apply market conventions common to sponsor-backed leveraged finance when assessing whether a change looks like a negotiated departure or ordinary drafting variation.
- For each issue, identify the governing provision in the agreed materials, the corresponding draft provision, and the practical effect on borrower economics, operational flexibility, or closing risk.
- Use an ordinal severity scale defined once at the top of the report and apply it consistently to every issue.

## 4. Analytical scaffolds
1. Inventory the source set
   - List each governing financing document in scope.
   - State which document is being treated as the benchmark for each concept where the package is split across multiple materials.

2. Compare the provision family, not just the label
   - For each concept, locate the draft clause, any related definition, and any linked schedule or annex.
   - Check whether the draft changes the concept directly or indirectly through cross-referenced language.

3. Break compound mechanics into sub-items
   - If a provision has multiple thresholds, periods, baskets, or stepdowns, analyze each element separately.
   - Do not merge distinct thresholds into a single issue entry.

4. Close each issue with three moves
   - Quantify the deviation using the figure, threshold, period, or structural limit stated in the source documents.
   - Cross-reference the other clause or document that interacts with the change.
   - State the consequence for the client, including whether the change affects economics, flexibility, closing certainty, or post-closing operating room.

5. Classify the deviation
   - Mark whether the issue appears to depart from the agreed package or instead looks like a negotiable market-practice change.
   - If the answer is ambiguous, explain what feature makes it uncertain and what additional source text would resolve it.

6. Assess lender-friendliness and borrower impact
   - Identify changes that increase lender control, reduce borrower optionality, shorten cure or reinvestment windows, or tighten funding conditions.
   - Identify changes that preserve or expand borrower capacity, restore package consistency, or align with the commitment materials.

7. Keep the analysis document-grounded
   - Do not infer missing economics or perform reconciliation arithmetic unless the source documents supply the needed inputs.
   - If a value is not stated clearly, flag the ambiguity rather than filling it in.

8. Use severity as a triage tool
   - Critical: likely to alter the agreed deal or closing posture.
   - High: materially borrower-adverse or inconsistent with the agreed package.
   - Medium: meaningful drafting or market-position deviation that warrants attention.
   - Low: technical or cosmetic difference with limited practical effect.

## 5. Vertical / structural / temporal relationships
- If a provision changes over time, analyze the timing architecture separately from the substantive covenant.
- For sweep mechanics, reinvestment periods, cure windows, pricing protections, and realization periods, compare each stage or trigger on its own.
- If a concept depends on leverage, EBITDA, or another metric, identify the metric definition that controls the trigger before concluding on impact.
- Where one provision references another, explain the downstream effect of the change through the chain of cross-references.
- If the draft adds a closing condition or conditionality carveout, test it against the broader financing package and the expected post-signing / pre-closing allocation of risk.

## 6. Output structure conventions
- Produce a structured deviation report with one row or entry per discrete issue.
- Each issue entry should include:
  - issue title
  - severity
  - agreed-package provision
  - draft credit agreement provision
  - deviation type
  - package-departure vs. market-practice flag
  - quantified or threshold-based impact
  - cross-reference to related clause or source document
  - practical consequence
  - recommended next step
- Use concise, transactional language; do not narrate the comparison as a generic memo.
- Include an executive summary memo that leads with the highest-priority must-restore items and then separates package departures from likely negotiable changes.
- End with an explicit Recommended Actions section that assigns an action, a responsible role, and a timing anchor tied to signing, launch, syndication, or closing.
- Keep the deliverables aligned to the requested file names and content types: a structured deviation workbook and a separate executive summary document.
