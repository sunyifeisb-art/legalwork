---
name: analyze-transaction-restrictions-s02
task_id: corporate-ma/analyze-transaction-restrictions/scenario-02
description: Guides comprehensive analysis of acquisition consent requirements and transaction restrictions across credit facilities, joint venture agreements, government contracts, commercial contracts, and regulatory notification obligations for a reverse triangular merger, using a procedural, category-level approach.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Transaction Restrictions (Scenario 02)

## 1. Subject-matter triage

- Treat the assignment as a closing-restrictions review for a reverse triangular merger: identify every consent, notice, approval, transfer restriction, default trigger, and timing condition that could affect signing, closing, financing, or post-closing operations.
- Separate issues by document family first, then by transaction effect: transfer/assignment, change of control, novation, payment restriction, financing restriction, termination right, and regulatory filing or notice.
- If the source set includes multiple contracts, counterparties, facilities, or regulatory regimes, enumerate them explicitly before analysis and run the same issue-spotting sequence for each.
- If no issue appears in a category, state that affirmatively and explain why the transaction structure does not trigger the restriction.

## 2. Failure modes the skill is correcting

- Listing restrictions without analyzing whether the reverse triangular merger avoids or triggers the relevant clause, especially where indirect ownership change, deemed assignment, or change-of-control language matters.
- Missing that acquisition financing, paydown steps, or interim operating covenants may be separately restricted even if the merger itself is permitted.
- Treating consent rights as binary and failing to identify threshold mechanics, blocking rights, notice windows, cure periods, or sequencing dependencies.
- Overlooking government contract approval, novation, or notice requirements that can lag the closing date and create interim performance or compliance risk.
- Failing to test whether commercial contracts, JV agreements, drag-along provisions, or similar rights turn on indirect ownership changes, control shifts, or ownership-counting rules.
- Omitting antitrust or sector-specific notification analysis where the buyer’s existing investments or the target’s regulated status create overlap or pre-clearance issues.
- Stopping at description instead of tying each issue to the governing authority, the source-document interaction, and the consequence for closing.

## 3. Legal frameworks / domain conventions that apply

- Reverse triangular merger analysis: determine whether the deal structure effects a transfer, assignment, or change of control under the operative contract language, and whether the relevant clause captures indirect ownership changes rather than only direct asset transfers.
- Credit agreement mechanics: analyze change-of-control defaults, mandatory prepayment, amendment or waiver requirements, lender consent thresholds, and any restriction on incurrence, liens, investments, or payment steps pending consent.
- JV and partnership restrictions: test consent, approval, transfer, admission, and ROFR mechanics under the agreement’s defined transfer concept; assess whether the provision reaches control changes and how it treats value or pricing when no standalone asset transfer occurs.
- Government contract and procurement approval: identify any novation, assignment consent, assumption notice, or agency approval requirement, and compare the expected approval path to the transaction timetable.
- Drag-along and similar ownership-threshold rights: measure the triggering threshold under the agreement’s counting rules, including any securities that are expressly included or excluded, before concluding whether the right is activated.
- Commercial contract change-of-control provisions: assess notice obligations, consent rights, termination rights, pricing or rate resets, or performance conditions that may be triggered by the merger.
- Antitrust and overlap review: map the buyer’s existing investments against the target’s markets, identify horizontal overlaps, and assess whether filing, clearance, remedy, or sequencing issues arise.
- Regulatory notifications: identify any sector-specific filing, approval, or notice obligation, and align the statutory or contractual deadline with signing, closing, and interim-operation milestones.
- Controlling authority discipline: state the governing contractual provision, statute, regulation, or cited authority for each legal conclusion; do not present a rule as settled without naming the source that supports it.

## 4. Analytical scaffolds

1. Build an inventory of all documents and group them by restriction type, counterparty, and closing dependency.
2. For each document, identify the operative clause, the trigger, the required response, and the timing mechanics.
3. Test the merger structure against the clause language: direct transfer, indirect transfer, change of control, deemed assignment, or control-based consent.
4. Test sequencing: determine whether financing, integration steps, covenant waivers, or interim actions must wait for consent or approval.
5. Test cross-document interaction: determine whether one document’s consent requirement is affected by another document’s default, notice, or regulatory condition.
6. Test closing impact: identify whether the issue is a hard blocker, a sequencing item, a post-closing covenant, or a monitoring item.
7. Where the source set supports it, quantify the issue using the relevant transaction figure, term, exposure, headroom, or deadline from the documents; do not invent figures or perform unsupported reconciliation arithmetic.
8. Close each issue with: governing authority, source-document interaction, and downstream consequence for the client.

## 5. Vertical / structural / temporal relationships

- Vertical: assess whether parent-level change, merger-step mechanics, or downstream subsidiary ownership shifts are the event that triggers the restriction.
- Structural: compare direct assignment language against indirect change-of-control language; do not assume a reverse triangular merger avoids transfer concepts.
- Temporal: map each consent, notice, filing, cure period, approval window, and expiration date against signing, financing, closing, and any interim operating period.
- Dependency: identify whether one approval is precedent to another, whether lender consent is required before drawdown, or whether agency approval must precede effectiveness.
- Interim risk: flag periods where the transaction can sign but not close, close but not integrate, or operate only under a conditional waiver.
- If a threshold right depends on counting rules, state the counting methodology before applying it; if multiple parties or periods exist, analyze each one separately rather than combining them.

## 6. Output structure conventions

- Produce a restrictions-and-consents memorandum organized by restriction category, not by source document alone.
- Begin with a short scope note identifying the transaction, the document set reviewed, and any category with no issue.
- Use a uniform issue-entry format for each item: document reference | restriction type | trigger | analysis | severity | closing impact | deadline/timing | recommended action.
- Use an ordinal severity scale defined once at the top and apply it consistently across all issues.
- For each issue, include the governing authority or contractual source for the proposition, the document interaction that matters, and the concrete consequence for closing, financing, or operations.
- Include a dedicated timeline section that maps all consent, notice, approval, and filing deadlines against the expected signing and closing sequence.
- Include a separate section for horizontal overlap or antitrust-style analysis if any investment or market overlap appears in the source documents.
- End with a Recommended Actions block that uses imperative verbs, assigns each action to a responsible role, and anchors timing to a milestone or specific deadline if one exists.
- Before finalizing, ensure the memorandum reads as a self-contained advisory work product and not as a list of extracted clauses.
