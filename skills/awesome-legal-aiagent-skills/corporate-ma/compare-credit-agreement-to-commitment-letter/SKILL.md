---
name: compare-credit-agreement-to-commitment-letter
task_id: corporate-ma/compare-credit-agreement-to-commitment-letter
description: Guides provision-by-provision comparison of a draft credit agreement against the commitment letter and term sheet, identifying deviations in pricing, structural protections, and covenant mechanics, and classifying each as a commitment-letter breach or within an acceptable range.
activates_for: [planner, solver, checker]
---

# Skill: Compare Credit Agreement to Commitment Letter Deviation Report

## 2. Failure modes the skill is correcting

- Comparing only broad deal terms instead of the operative language that controls economics, protections, and covenant mechanics.
- Missing deviations that arise from subtle drafting moves such as altered thresholds, timing changes, narrower baskets, added conditions, or deleted fallback mechanics.
- Treating no-flex-confirmed items as negotiable when the commitment package fixes them absent borrower consent.
- Reporting differences without tying them to the relevant source documents, the affected covenant or mechanic, and the practical consequence for the borrower.
- Collapsing several distinct facilities, baskets, or tests into one pass when each must be reviewed separately.
- Describing issues without a severity judgment or an actionable follow-up recommendation.

## 3. Legal frameworks / domain conventions that apply

- Compare the draft credit agreement against the commitment letter, term sheet, and any no-flex confirmation as an integrated financing package; the draft must be measured against the strongest applicable committed term.
- Pricing terms: compare benchmark, margin, floors, default-rate mechanics, and any toggle or step-up/step-down that affects economics.
- Mandatory prepayment and sweep mechanics: compare triggers, rates, carve-outs, reinvestment rights, and application waterfall.
- Reinvestment mechanics: compare the initial period, extension mechanics, notice requirements, and consequences of unused proceeds.
- Equity cure mechanics: compare cure rights, frequency limits, testing windows, and whether cures affect default or basket calculations.
- Incremental debt and refinancing capacity: compare capacity tests, ratio tests, MFN protection, permitted terms, sunset features, and linkages to existing restrictions.
- Restricted payments, investments, liens, indebtedness, and asset sale baskets: compare whether leverage-conditioned capacity is preserved, narrowed, or removed.
- Springing covenants and collateral triggers: compare the applicable threshold, trigger mechanics, and any changes to testing frequency or scope.
- No-flex confirmation: terms covered by a no-flex confirmation are fixed unless the package expressly permits a change or the borrower consents.
- Treat the commitment package as the interpretive baseline; if documents conflict, identify the controlling language and note the inconsistency.

## 4. Analytical scaffolds

- Start by separating the source set into the distinct items that can change the outcome: each financing tranche, each covenant mechanic, each basket, each prepayment regime, each cure right, and each no-flex-confirmed term.
- For each item, extract the exact operative term from the commitment materials and the corresponding term in the draft credit agreement, then compare them on the same axis: rate, threshold, timing, scope, condition, carve-out, or consequence.
- For each deviation, close the analysis by stating:
  1. the size or threshold that the clause turns on;
  2. the other clause, schedule, or document that interacts with it;
  3. the downstream consequence for the borrower or lender.
- Classify each deviation by practical significance:
  - likely commitment-package breach;
  - borrower-favorable or borrower-adverse change;
  - within the expected flex range;
  - unclear and requiring confirmation.
- Apply a uniform ordinal severity scale to each finding and define it once in the report. Use the same scale consistently across all rows.
- If a provision is covered by no-flex, treat any deviation from the committed term as presumptively material unless the draft simply restates permitted flex or clarifying mechanics.
- If multiple facilities or multiple covenant tests are in scope, review each separately and do not merge them into a single generic comparison.
- When the issue is a drafting substitution rather than a numerical change, compare legal effect, not just wording.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track vertical dependence from economics to protections to remedies: pricing changes may be small in isolation but material if paired with tighter sweep, narrower baskets, or faster mandatory prepayment.
- Track temporal sequencing: initial availability, step-down dates, testing dates, cure windows, reinvestment periods, sunset dates, and post-closing milestones can change the outcome even when the headline term is unchanged.
- Track conditional relationships: a threshold, basket, or right often depends on leverage, EBITDA, collateral status, or no-default conditions; if the condition changes, the right changes with it.
- Track cross-document hierarchy: commitment letter, term sheet, and no-flex confirmation may each speak to the same provision, and the controlling read should be stated explicitly.
- Where the draft changes one clause by reference to another definition or schedule, trace the cross-reference to its practical effect before classifying the deviation.

## 6. Output structure conventions

- Produce a deviation report organized as a table with conventional columns for: provision; committed term; draft term; delta; severity; classification; consequence; follow-up.
- Use concise, source-tethered descriptions that identify the exact comparison point rather than a narrative summary.
- Include a separate section for no-flex-confirmed terms so those deviations are visible on first review.
- Include an executive summary that states the overall posture of the draft, the most material deviations, and whether escalation or borrower consent appears warranted.
- End the advisory output with a Recommended Actions block that assigns each next step to a role and a timing anchor tied to the financing process.
- If the comparison reveals no material deviation for a provision, say so affirmatively; do not leave silent rows.
- Keep the report usable for direct transfer into `deviation-report.xlsx` and `executive-summary.docx`: findings should read as discrete rows, not prose paragraphs.
