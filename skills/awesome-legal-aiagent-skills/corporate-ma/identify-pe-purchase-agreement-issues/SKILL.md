---
name: identify-pe-purchase-agreement-issues
task_id: corporate-ma/identify-pe-purchase-agreement-issues
description: Guides preparation of a severity-ranked issues list for a private-equity acquisition purchase agreement where diligence findings, financial adjustments, and disclosure schedule disclosures must be cross-referenced against the draft agreement.
activates_for: [planner, solver, checker]
---

# Skill: PE Bolt-On SPA Issue Identification

## 1. Subject-matter triage
- Treat the draft SPA as the anchor document and compare it against the deal terms sheet, diligence reports, environmental summary, and disclosure schedule letter.
- Identify whether there is one target transaction and one agreement version in scope; if multiple drafts, amendments, or disclosure iterations appear, enumerate them first and review each against the same checklist.
- Separate true deal deviations from ordinary drafting cleanup, and separate substantive risk from issues already cured by schedule disclosure or other source documents.

## 2. Failure modes the skill is correcting
- Reviewing the SPA against market standards without first testing it against the negotiated deal terms that control the commercial bargain.
- Missing environmental diligence findings that should be reflected in environmental reps, covenants, indemnity structure, or disclosure carve-outs.
- Failing to connect financial diligence adjustments to financial representations, working-capital mechanics, or closing-account protections.
- Treating the disclosure schedule as a standalone exhibit instead of testing how each disclosure qualifies a representation and changes the buyer’s risk profile.
- Identifying issues without tying them to a specific SPA provision, the interacting source document, and the practical consequence for the buyer.
- Using non-ordinal labels only; severity must be consistent and comparable across the whole list.

## 3. Legal frameworks / domain conventions that apply
- Private-equity buyer-side purchase agreement review: flag deviations from agreed deal terms, seller-favorable drafting, and omitted protections for identified diligence risk.
- Deal terms sheet as the controlling commercial framework: a SPA provision that departs from the term sheet is a prime issue unless the deviation is clearly intentional and accepted.
- Environmental allocation: where diligence identifies known contamination, recognized environmental conditions, or remediation exposure, the SPA should be tested for fit among reps, covenants, indemnity, caps, baskets, survival, escrows, or insurance mechanics.
- Financial diligence / working capital: quality-of-earnings findings and adjustments should be tested against financial reps, closing-statement mechanics, and the working-capital target.
- Disclosure schedule effect: disclosures are exceptions to reps and can materially narrow seller liability; overly broad disclosures can function like silent rewrites of the reps.
- Indemnity architecture in PE deals: evaluate whether the agreement’s risk allocation is coherent across RWI, escrow, special indemnities, caps, baskets, survival, and fundamental reps.
- General corporate and contract interpretation principles: specific provisions control over general ones; inconsistency between schedules and body provisions must be resolved, not ignored.

## 4. Analytical scaffolds
- Start with the deal terms sheet: extract each negotiated business point, then compare the SPA provision-by-provision to find deviations, omissions, or ambiguities.
- Review the diligence materials by theme: environmental, financial, operational, legal, and any other issue area reflected in the source set.
- For each identified issue, test three things in sequence:
  1. the SPA text that creates the problem;
  2. the interacting source document, schedule, or diligence item;
  3. the downstream consequence for the buyer.
- Use a uniform severity scale defined once at the top of the output, such as Critical / High / Medium / Low, and apply it consistently.
- Close each issue with three elements: scale or magnitude drawn from the source set, the related clause or document that interacts with it, and the practical consequence if left unchanged.
- Where the materials contain more than one discrete topic, party, period, or exposure bucket, enumerate them before analysis and run the same comparison framework on each one rather than collapsing them into a blended observation.
- When legal or contractual conclusions depend on a specific authority or governing rule identified in the source set, cite that authority by name and section or by the convention used in the materials.

## 5. Vertical / structural / temporal relationships
- Track how earlier documents constrain later ones: term sheet first, then SPA body, then schedules and disclosure letter, then diligence summaries as issue-confirming context.
- Watch for hierarchy conflicts between definitions, representations, covenants, indemnities, and schedules; a narrow definition may silently limit a broader rep elsewhere.
- Check whether a disclosure, exception, or special schedule entry changes the meaning of a representation in one section while leaving related indemnity or closing-condition language untouched.
- Distinguish pre-signing risk allocation from closing risk allocation and post-closing remedy allocation.
- If the agreement uses a temporal trigger or survival period, test whether it matches the timing of the identified diligence issue and the expected period of exposure.

## 6. Output structure conventions
- Produce a single issues list, organized by severity tier in descending order.
- Define the severity scale once at the top, then apply it uniformly to every entry.
- For each issue, include:
  - the SPA provision reference;
  - a concise issue title;
  - the severity label;
  - the source cross-reference(s) that create or confirm the issue;
  - the practical consequence for the buyer;
  - a recommended revision or action.
- Keep each entry action-oriented and specific enough that it can be used as a redline checklist.
- End with a short Recommended Actions section that converts the highest-priority issues into immediate drafting steps, assigned to the relevant deal team role and tied to the signing or closing milestone.
