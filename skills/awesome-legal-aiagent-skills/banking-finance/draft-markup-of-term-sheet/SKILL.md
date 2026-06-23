---
name: draft-markup-of-term-sheet
task_id: banking-finance/draft-markup-of-term-sheet
description: Prepares a borrower-side annotated term sheet markup memo with a narrative cover memo and provision-by-provision annotations, prioritized issues, and negotiating strategy.
activates_for: [planner, solver, checker]
---

# Skill: Borrower-Side Annotated Term Sheet Markup Memo

## 1. Subject-matter triage (only if applicable)

- Treat the term sheet as the operative draft artifact; produce the markup memo as the primary work product and any narrative cover memo as secondary.
- If the source set includes multiple drafts, side letters, or supporting term sheets, reconcile against the latest operative version before drafting comments.
- If only one term sheet is in scope, say so explicitly and anchor all comments to that version.

## 2. Failure modes the skill is correcting

- Producing only a narrative cover memo without an annotated term sheet markup; both components are required.
- Using styling alone to signal changes, which can fail in .docx export or plain text conversion.
- Listing issues without borrower position, rationale, or proposed language.
- Failing to prioritize negotiation points by severity and deal impact.
- Omitting cross-references to related covenants, definitions, baskets, baskets tied to delayed-draw use, or other interconnected provisions.
- Missing non-standard governing law, enforcement, or venue terms that should be tested against market convention.
- Overlooking the interaction among cash sweep, capex restrictions, delayed-draw availability, and leverage-based flex.
- Failing to address sponsor equity cure mechanics where a sponsor-owned borrower is involved.
- Ignoring reinvestment timing for insurance or condemnation proceeds when the period is shortened versus market.
- Forgetting to close each issue with an actionable recommendation and negotiation path.

## 3. Legal frameworks / domain conventions that apply

- Use borrower-side market practice for senior secured credit facilities as the baseline, then flag deviations from that baseline as comments rather than assuming they are acceptable.
- Treat governing law, jurisdiction, and enforcement language as market-sensitive terms; if they are unusual for the financing or collateral package, call them out.
- Read leverage-based protections as an integrated package: closing leverage supports arguments about cash sweep intensity, capex flexibility, cure mechanics, and covenant headroom.
- Analyze cash sweep, mandatory prepayment, restricted payments, and capital expenditure limits together when any delayed-draw or integration use is contemplated.
- If sponsor equity cure rights are present or missing, specify cure period, frequency, lifetime cap, application mechanics, and whether the cure counts for covenant compliance only or also debt incurrence and sweep purposes.
- Treat insurance and condemnation proceeds as a separate reinvestment issue; an abbreviated reinvestment period is borrower-unfavorable if it compresses operational flexibility.
- Use market-practice references in comments where they strengthen leverage, but do not rely on them as the sole basis for a legal conclusion.
- For any proposition about market standards, enforcement mechanics, or covenant operation, cite the controlling document language or generally recognized credit-agreement convention in the comment.

## 4. Analytical scaffolds

1. Start with a short cover memo that states the overall borrower posture, the highest-priority open points, the likely trade-offs, and the proposed negotiation sequence.
2. For each substantive provision, mark the borrower position as accept, counter-propose, or reject, and include an explicit textual markup convention that survives export:
   - [DELETED: …]
   - [INSERTED: …]
   - [REPLACED: old → new]
   - [Rationale: …]
3. For each issue comment, include:
   - severity on a uniform ordinal scale defined once at the top;
   - the relevant clause interaction or cross-reference;
   - the commercial or legal consequence to the borrower;
   - the proposed revised language or fallback position;
   - where useful, a market-practice comparison.
4. Prioritize negotiation around the terms that affect economics, operational flexibility, and default risk before polishing drafting points.
5. When the source set contains multiple periods, thresholds, parties, or alternative formulations, enumerate them before analysis and address each separately rather than collapsing them.
6. When a comment depends on a cited rule, covenant convention, or statutory concept, name the authority or conventional source in the comment instead of stating a bare conclusion.
7. Treat concessions as trade currency: identify where the borrower can yield on a lower-value point in exchange for improvements on leverage, sweep, capex, cure rights, or reinvestment timing.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Read closing leverage, leverage ratio maintenance, and mandatory prepayment mechanics as temporally linked: closing leverage can justify softer sweep mechanics at signing, while later de-leveraging may support tighter mechanics only after a defined threshold is reached.
- Calibrate delayed-draw availability against build-out or integration needs; if the facility is intended to fund post-closing capex or acquisition integration, the covenant package should not defeat that purpose.
- If cash sweep applies to excess cash after capex, debt service, or permitted investments, verify that the ordering and carve-outs preserve practical operating liquidity.
- If insurance or condemnation proceeds must be reinvested, check the reinvestment clock, extension rights, and default triggers to ensure they match project or recovery timelines.
- If equity cures are permitted, make sure cure timing tracks reporting and compliance dates so the right is usable in practice.

## 6. Output structure conventions

- Deliver a borrower-side annotated markup memo, not a standalone issues list.
- Use an industry-conventional structure:
  - concise cover memo;
  - prioritized issues summary with severity labels;
  - provision-by-provision annotations with borrower position and proposed edits;
  - negotiation strategy and concession points;
  - recommended next steps.
- Every substantive comment should be self-contained in plain text, even if the document also uses visual markup.
- The markup must remain intelligible without track changes enabled.
- Do not replicate the source document’s section list verbatim; organize by conventional credit-term topics instead.
- Keep the writing operational: each comment should tell the reader what to change, why, and what to do next.
- End with a short Recommended Actions block that assigns the next move to the appropriate lawyer or business lead and ties it to the next deal milestone.
