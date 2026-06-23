---
name: review-equipment-lease-abs-indenture-scenario-02
task_id: structured-finance-securitization/review-securitization-indenture/scenario-02
description: Reviewing a draft indenture for an equipment lease receivables securitization, with the additional analytical requirement of comparing the initial trigger calibration against the sponsor's most recent annualized net loss rate and identifying whether historical losses are trending upward as part of the assessment.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Draft Indenture for Equipment Lease Receivables Securitization (Scenario 02)

## 1. Subject-matter triage
- Treat this as a contract review and issue-spotting exercise for a securitization indenture, not a generic proofreading task.
- Read the indenture against the attached transaction documents as an integrated package; inconsistencies across operative documents are issues even if each document is internally coherent.
- Build the memo around real transaction defects, not drafting preferences, and prioritize items that can affect cash flow, credit support, enforcement, transfer mechanics, or closing certainty.
- If only one version of a term appears in the source set, say so; if multiple periods, triggers, or thresholds appear, enumerate them before analyzing them.

## 2. Failure modes the skill is correcting
- Describing a gap without tying it to the specific section, related document, and business consequence that make it material.
- Treating a trigger, reserve, or covenant as acceptable in isolation without checking how it works with the related amortization, default, servicing, or redemption provisions.
- Missing that a threshold calibrated off stale performance data may be functionally non-protective once more recent loss data is considered.
- Ignoring whether the sponsor’s loss experience is moving upward, which can make an apparently tolerable trigger too tight in practice.
- Failing to distinguish a true closing issue from a drafting cleanup item that can be handled post-closing.
- Omitting a recommendation that tells the reader what to change, who should own the fix, and when it needs to happen.
- Stating legal concerns without anchoring them to the relevant governing provision, market convention, or transaction document language.

## 3. Legal frameworks / domain conventions that apply
- Apply the operative securitization framework in the transaction documents: waterfall priority, reserve mechanics, amortization/early termination triggers, collateral performance tests, servicing remedies, transfer and perfection mechanics, and trustee/enforcement provisions.
- Use the indenture as the primary operative instrument, but test it against the sale agreement, servicing agreement, administration/backup servicing provisions, note terms, and any related disclosure or presale materials.
- For performance-trigger analysis, compare the stated trigger calibration to the most recent annualized net loss rate reflected in the source materials, and test whether the historical series shows an upward trend.
- Treat a trigger set at or below current performance as a likely early-breach concern; treat a trigger set below an upward-trending series as a forward-looking breach risk even if today’s gap appears narrow.
- Where the source set includes presale or rating materials, verify that the performance assumptions used there still match the latest loss data before the memo finalizes.
- Use the controlling authority identified in the transaction documents when a point turns on an express contractual standard; otherwise rely on the governing structured-finance convention for the provision at issue.
- For each legal or transactional proposition relied upon, name the operative authority or document section rather than stating the conclusion abstractly.

## 4. Analytical scaffolds
- Start with a document-to-document comparison matrix: identify the operative sections, the related source provisions, and the practical function of each term before drafting the memo.
- For each issue, apply a three-step close: state the relevant magnitude or threshold from the source documents, identify the related provision elsewhere in the package, and explain the downstream consequence for the transaction.
- For trigger issues, extract the trigger level, the most recent annualized net loss rate, and the direction of the historical trend; then state whether the trigger is comfortably above, near, or at risk relative to current performance.
- Where multiple periods or performance points exist, list them in sequence first, then analyze whether the later figures move materially against the structure’s protection.
- For reserve, deferral, redemption, backup servicing, bankruptcy remoteness, and trustee provisions, test whether the operative language is complete enough to function at closing and on default, not merely whether it is commercially familiar.
- Separate drafting omissions from economic or structural defects; the former may be medium or low, while the latter can be high or critical depending on the affected protection.
- Tie each issue to the practical result it causes: leakage in cash flow, delayed enforcement, weakened credit support, rating uncertainty, or closing friction.
- If a provision appears to rely on a future cure or later administrative fix, confirm that the cure exists in the documents and is timely enough to protect the structure.

## 5. Vertical / structural / temporal relationships
- Check how each provision behaves over time: at closing, during current performance, on trigger breach, during amortization, upon servicer disruption, and in enforcement.
- Test whether one term overrides or delays another, especially where reserve replenishment, deferral, or early amortization provisions compete for the same cash flow.
- Compare the present trigger calibration against historical performance trends, not just the latest single period, because upward movement can compress the effective cushion quickly.
- If the trigger is already tight relative to current losses, identify the near-term breach path and the consequences for amortization, reporting, and investor expectations.
- Where a provision depends on another document’s definition or threshold, confirm the dependency is complete and consistent across the package.
- Identify any timing gap between when a breach can occur and when the related remedy or cure can actually be implemented.

## 6. Output structure conventions
- Produce a prioritized issues memo organized by topic area, using a clear ordinal severity scale defined once at the top and applied consistently to every entry.
- Use conventional topic headings for structured-finance document review; do not mirror any hidden checklist or rubric wording.
- For each issue, include:
  - a short issue title;
  - the indenture section reference;
  - the related document cross-reference;
  - the severity classification;
  - the specific defect or inconsistency;
  - the practical risk to the transaction;
  - the recommended resolution;
  - the controlling authority or document provision supporting the point.
- For performance-trigger issues, include the stated trigger level, the current annualized net loss rate from the source materials, the historical trend direction, and the need for recalibration if the buffer is thin or inverted.
- Distinguish clearly between critical closing blockers and items that can be addressed as drafting cleanup.
- End with a Recommended Actions block that assigns each action to the responsible role in the transaction documents and ties it to a closing or pre-signing timing anchor.
- Keep the memo substantive and concise: issue-focused, cross-referenced, and ready to paste into the requested `.docx` deliverable.
