---
name: extract-conditions-precedent-from-credit-agreement
task_id: banking-finance/extract-conditions-precedent-from-credit-agreement
description: Extract conditions precedent from a credit agreement, compare them against a closing checklist and supporting materials, and produce a prioritized gap analysis with remediation steps.
activates_for: [planner, solver, checker]
---

# Skill: Conditions Precedent Checklist and Gap Analysis

## 1. Subject-matter triage
- Treat the credit agreement as the controlling source for closing conditions, then use the closing checklist and supporting materials to confirm satisfaction, identify missing items, and rank curing work.
- Separate true conditions precedent from post-closing covenants, bring-down items, administrative deliverables, and optional documents; do not let them blur into one checklist.
- Where multiple entities, facilities, dated documents, collateral pools, insurance policies, or certificates are involved, enumerate each one first and analyze each separately before concluding.
- If the agreement or checklist gives a total count and an itemized list, reconcile them before any substantive assessment.

## 2. Failure modes the skill is correcting
- Reporting an aggregate count without reconciling it against the itemized list, which can hide a missing required item.
- Treating a document as current without measuring its age against the agreement’s freshness window.
- Accepting a financial compliance figure without checking whether each adjustment is permitted and whether any cap is exceeded.
- Collapsing per-occurrence and aggregate insurance requirements into one coverage check, which can miss a primary-limit shortfall.
- Assuming a delivered certificate is sufficient without checking that its scope matches the required entity, basis, or consolidation level.
- Ignoring local-law perfection or opinion steps for foreign collateral.
- Mixing satisfied items, follow-up items, and blocking items without a consistent severity standard.
- Stating that something is defective without tying the issue to the controlling agreement language, the interacting document, and the practical closing consequence.
- Omitting a concrete cure path or responsible party for each gap.

## 3. Legal frameworks / domain conventions that apply
- Use the credit agreement’s CP article, exhibit, schedule, and defined terms as the primary authority for what must be delivered and when.
- Read the closing checklist against the agreement’s exact delivery standard: “delivered,” “in form and substance satisfactory,” “certified,” “dated as of,” “reasonably acceptable,” or similar formulations are not interchangeable.
- For dated certificates, opinions, search results, organizational documents, authorizations, consents, and similar materials, calculate elapsed time to the contemplated closing date and compare it to the stated freshness requirement.
- For officer’s certificates or compliance certificates, verify each adjustment against the agreement’s permitted categories and any overall cap before recomputing the cited metric.
- For insurance, verify primary policy limits and any excess or umbrella layers separately; confirm that the required structure is actually satisfied, not merely economically approximated.
- For collateral involving foreign entities or non-U.S. interests, check whether local-law perfection steps, filings, notices, or opinions are required in addition to the pledge documentation.
- For solvency or no-default certificates, confirm the required signatory, covered entities, and basis of delivery match the agreement.
- For any legal conclusion stated in the analysis, anchor it to the relevant contract provision or recognized document requirement rather than using a bare conclusion.

## 4. Analytical scaffolds
1. Build the CP inventory.
   - Extract every closing condition from the agreement, including subparts and embedded deliverables.
   - Number each condition and keep a one-to-one mapping to the clause that creates it.
   - Separate hard conditions from items that are merely evidentiary support for a condition.

2. Reconcile the checklist.
   - Match each CP against the closing checklist and supporting documents.
   - Note whether the item is satisfied, partially satisfied, absent, stale, or unclear.
   - If the checklist total and itemized list differ, identify the mismatch and the missing or extra item.

3. Test dated deliverables.
   - For each dated document, compute whether it is within the required freshness window as of the closing date.
   - Identify the affected entity, asset, facility, or jurisdiction if staleness exists.
   - If no closing date is stated, analyze against the nearest practical closing milestone and flag the assumption.

4. Test financial deliverables.
   - Identify each reported adjustment, allowance, add-back, or reconciliation item.
   - Check whether each is expressly permitted and whether any aggregate cap or limitation applies.
   - Recompute the relevant metric only from permitted inputs and then assess whether the corrected figure still satisfies the condition.

5. Test insurance and collateral deliverables.
   - Verify coverage requirements by layer, limit, insured party, and endorsement structure.
   - Review collateral deliverables for perfection steps, required filings, releases, notices, and foreign-law dependencies.
   - Do not assume one document cures another unless the agreement or supporting materials expressly tie them together.

6. Assign severity and consequence.
   - Use a uniform ordinal scale for each issue: Critical, High, Medium, Low.
   - Tie severity to closing impact, cure complexity, timing sensitivity, and whether another document can readily bridge the gap.
   - For each issue, state the downstream consequence for the transaction if not cured.

7. Remediate.
   - State the specific next action needed to cure, complete, or document the item.
   - Identify who should act when that role is discernible from the materials.
   - Tie the action to the relevant closing milestone or, if none is stated, to the most immediate practical deadline.

## 5. Vertical / structural / temporal relationships
- Check whether a document’s effectiveness depends on another document being delivered first, simultaneously, or in final form.
- Note when one condition is only a component of another broader condition, so the component should not be double-counted as a standalone blocker.
- Track chronological dependencies: execution date, certification date, search date, opinion date, bring-down date, and closing date.
- If the materials contain multiple borrowers, guarantors, pledgors, subsidiaries, facilities, or tranches, keep the analysis entity-specific and do not collapse distinct obligations into a single pass.
- If a CP can be satisfied by alternative forms of evidence, determine which form is actually delivered and whether it matches the agreement’s permitted alternative.

## 6. Output structure conventions
- Produce a CP checklist gap analysis organized by issue, not as a raw document dump.
- Start with a brief scope note and a severity legend.
- For each issue, include:
  - CP requirement
  - Source clause or controlling document reference
  - Current status
  - Specific gap or ambiguity
  - Any computed timing, scope, or financial check
  - Cross-reference to the interacting checklist item or supporting document
  - Downstream consequence
  - Recommended cure or follow-up action
  - Severity
- Use a consistent status vocabulary such as Satisfied, Partially Satisfied, Missing, Stale, or Needs Follow-Up.
- End with a prioritized summary that separates blocking items from non-blocking items and identifies the highest-risk gaps first.
- Include an explicit Recommended Actions section with imperative steps, the responsible role when identifiable, and timing tied to the closing process.
- Keep the writing decision-oriented; do not narrate the document set without stating what matters for closing.
