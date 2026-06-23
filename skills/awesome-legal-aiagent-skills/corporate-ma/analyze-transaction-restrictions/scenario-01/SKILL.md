---
name: analyze-transaction-restrictions-s01
task_id: corporate-ma/analyze-transaction-restrictions/scenario-01
description: Guides comprehensive analysis of acquisition consent requirements and transaction restrictions across financing documents, joint venture arrangements, government contracts, commercial contracts, and regulatory notification obligations for a reverse triangular merger.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Transaction Restrictions (Scenario 01)

## 1. Subject-matter triage

- Treat the assignment as an acquisition-consent and restriction review for a reverse triangular merger, not a general diligence summary.
- First sort the source set by document family: financing, JV/partnership, government or defense contracts, commercial contracts, regulatory notices, and the merger agreement.
- If more than one contract, counterparty, filing, or deadline is in play, enumerate them before analysis and keep one pass per item.
- Separate true closing blockers from notice-only items, and separate pre-signing diligence from signing-to-closing conditions.
- Track whether the merger structure itself avoids, triggers, or partially triggers each restriction; do not assume a change-of-control clause is triggered merely because an acquisition exists.

## 2. Failure modes the skill is correcting

- Listing restrictions without analyzing whether the merger structure avoids or triggers each restriction.
- Treating notice obligations as if they were consent rights, or vice versa.
- Missing timing mechanics tied to signing, notice, control transfer, novation, or agency approval.
- Failing to compare rights across linked documents that may override, condition, or waive one another.
- Omitting the downstream effect of an unresolved restriction on closing, integration, financing access, or post-closing operations.
- Failing to assess whether the combined impact of unresolved restrictions could support a material adverse effect analysis under the merger agreement definition.

## 3. Legal frameworks / domain conventions that apply

- Financing document change-of-control analysis: identify whether a lender consent, agent consent, repayment trigger, mandatory prepayment, draw stop, or event of default is implicated by the merger structure; analyze the operative definition and any cure, waiver, or amendment mechanics.
- Joint venture transfer analysis: determine whether the transaction is a direct transfer, indirect transfer, deemed transfer, or change in control under the JV definition; analyze any ROFR, consent right, veto right, buy-sell mechanism, valuation formula, and post-election operational effect.
- Government and defense contract analysis: determine whether novation, written consent, advance notice, or certification is required; identify the governing procurement or security regime and any deadline keyed to signing, closing, award, or control transfer.
- Regulatory notice analysis: identify each mandatory notice, the recipient, the trigger, and the filing or waiting period under the relevant statute or regulation; distinguish a notice obligation from substantive approval.
- Commercial contract analysis: review anti-assignment, change-of-control, consent, notice, termination, and default provisions; determine whether a reverse triangular merger is expressly covered, excluded, or ambiguously captured.
- Antitrust and overlap analysis: map existing holdings against the target’s lines of business; assess whether the transaction raises filing, waiting-period, or remedial issues under the applicable competition statutes and regulations.
- MAE analysis: assess whether unresolved losses, delays, termination rights, or financing constraints, when aggregated, could plausibly satisfy the merger agreement’s material adverse effect standard.

## 4. Analytical scaffolds

- For each restriction, state the governing document, the operative clause, and the legal rule that controls the analysis.
- Apply the document’s own definition of change of control, transfer, assignment, merger, control transfer, or affiliate transaction before drawing a conclusion.
- Measure each issue against the source documents’ own scale where possible: commitment size, term, exposure, concentration, duration, deadline, termination window, consent threshold, or operational dependency.
- Cross-reference every issue to any related clause in the merger agreement, financing documents, JV agreement, or notice regime that changes the outcome.
- State the concrete consequence: no issue, notice only, consent required, waiver advisable, closing condition risk, financing blockage, novation need, or post-closing covenant burden.
- If the source documents show only one relevant item in a category, say so expressly and explain why no additional item is in scope.

### Issue-by-issue method

1. Identify the triggering event and the exact contractual or regulatory definition it must satisfy.
2. Determine whether the reverse triangular merger falls within that definition.
3. Identify any required action, responsible party, and deadline.
4. Evaluate whether the restriction is waivable, defeasible, or fatal to closing.
5. Note any interaction with closing mechanics, financing availability, or integration planning.
6. Conclude with the practical risk allocation for the client.

### Legal proposition discipline

- Support each conclusion with the controlling authority named in the source documents or the relevant statute, regulation, rule, or leading doctrine.
- Do not state a legal conclusion in conclusory form without naming the rule, clause, or regulatory source that supports it.
- When the source set is silent on authority, use the governing legal framework customary for the contract type and identify it expressly.

## 5. Vertical / structural / temporal relationships

- Build a timeline from signing through closing and post-closing, and place each consent, notice, waiting period, and approval on that timeline.
- Distinguish obligations that arise at signing, before closing, at closing, upon control transfer, or after closing.
- Map hierarchy between documents: merger agreement, financing documents, JV arrangements, government contracts, and commercial agreements.
- Where a document incorporates another document or a defined term from another agreement, follow the cross-reference before concluding.
- If multiple restrictions may compound, assess whether the cumulative effect creates a financing, operational, regulatory, or MAE problem even if each item alone appears manageable.

## 6. Output structure conventions

- Draft the memo as a restrictions-and-consents memorandum, organized by restriction category rather than by document dump.
- Begin with a short executive summary that separates closing blockers, consent items, notice items, and post-closing clean-up.
- For each issue, use a compact analytical row or subheading containing:
  - document reference
  - restriction type
  - triggering event
  - required action
  - exposure or consequence
  - deadline or timing anchor
  - recommended approach
  - severity, using a uniform ordinal scale stated once at the top
- Include a regulatory timeline that maps deadlines to signing, closing, and control transfer.
- Include a separate MAE section addressing aggregate unresolved restrictions and their transaction impact.
- End with a Recommended Actions block stating the action, the responsible role, and the timing anchor for each next step.
- Keep the memo concise but complete; prioritize operative conclusions over document recitation.
