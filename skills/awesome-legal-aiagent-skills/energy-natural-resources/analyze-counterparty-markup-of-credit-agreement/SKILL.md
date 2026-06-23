---
name: analyze-counterparty-markup-credit-agreement-pipeline
task_id: energy-natural-resources/analyze-counterparty-markup-of-credit-agreement
description: Guides systematic analysis of a lender's markup of a credit agreement by tracing each change's financial impact through the financial model, identifying compounding interactions between related provisions, and separating legal enforceability issues from commercial negotiating points.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Credit Agreement — Redline Analysis Memorandum

## 1. Subject-matter triage

- Treat the lender markup, original draft, term sheet, and supporting context documents as one integrated record.
- Separate pure redline commentary from legal enforceability issues, structural mismatches, and commercial economics.
- If the markup affects multiple borrower entities, facilities, periods, or covenant tests, enumerate them first and analyze each expressly rather than using a blended average view.
- If the deliverable requires marked text, preserve robust textual change markers so the analysis survives export and plain-text review.

## 2. Failure modes the skill is correcting

- Isolating lender edits one by one without recognizing when two changes interact to create a materially worse combined effect.
- Treating every aggressive edit as a commercial negotiation point when some changes raise legal enforceability, structural, or governance concerns.
- Describing default mechanics without identifying whether the absence of a cure period is the real problem.
- Failing to connect amendment-threshold changes to practical blocking power in the actual lender group.
- Missing the way a change in one covenant or definition can cascade through the model, cash availability, or remedy stack.
- Writing a memo that summarizes issues but does not close each issue with quantified context, document cross-reference, and downstream consequence.

## 3. Legal frameworks / domain conventions that apply

- Floating-rate benchmark floors set a minimum benchmark rate; their effect may be dormant today but becomes operative if rates fall, so analysis should consider current and projected periods.
- Pricing grids tie margin to leverage or coverage; a tighter grid can trap the borrower in higher-margin tiers for longer and should be tested against projected ratios.
- Construction-period distribution limits are often justified when a project has not yet proven debt service capacity; tightened restrictions may conflict with existing upstream cash obligations.
- EBITDA addbacks should be tested for compounding when the lender reduces both the amount eligible for adjustment and the time window for recognition.
- In pass-through structures, tax distributions protect members from entity-level taxable income; a flat cap may understate actual liability in higher-tax settings or volatile income years.
- A guaranty structure must match the facility structure; a completion-style guaranty may not fit a facility with no defined completion event and may conflict with governance or fund-document limits on open-ended support.
- Security interests must be tested for enforceability against the specific collateral class under governing law; where a lien may not attach cleanly, analyze alternatives such as assignment of revenues or contract rights instead of treating the point as mere leverage.
- Increased amendment or waiver thresholds can concentrate veto power in a large lender or small bloc; assess practical blocking power against the actual lender composition.
- A broad material adverse change definition that reaches beyond payment defaults may sweep in technical covenant breaches and expand a severe-deterioration trigger beyond its conventional role.
- Default provisions should be checked for cure periods, especially where the event is remediable; immediate default treatment can be disproportionate and commercially harsh.
- Lender involvement in borrower operations can raise equitable-subordination risk if the covenant effectively pulls the lender into managerial control; this is a legal risk arising from conduct and structure, not only from drafting style.
- Eliminating reinvestment rights for casualty or condemnation proceeds can impair rebuild capacity where the asset base is concentrated or operational continuity depends on replacement.

## 4. Analytical scaffolds

- For each markup change, identify the original language, the lender revision, and the corresponding baseline in the term sheet or playbook.
- Test whether the change is an economic haircut, a legal-enforceability issue, a structural mismatch, or a covenant mechanic that changes future bargaining leverage.
- Where a change affects ratios, coverage, cash sweep, distributions, or availability, trace its effect through the borrower’s model and projected compliance path.
- Where a change affects remedies or amendment mechanics, test the real-world effect on waivers, cures, resets, and refinancing flexibility.
- Where a change is legal in nature, cite the controlling authority named in the source record or the most apposite governing-law doctrine, and explain why the issue is not just commercial friction.
- After individual review, identify compound issues created by two or more simultaneous revisions and present them as a single integrated concern.
- For each issue, close the loop with three things: scale or threshold from the source set, the interacting document or clause, and the downstream consequence for the client.
- Assign a uniform severity rating to every issue using an ordinal scale defined once at the start of the memo.
- End the memorandum with action-oriented recommendations that specify who should act and when.

## 5. Vertical / structural / temporal relationships

- Track whether the challenged provision operates differently at closing, during construction, during the ramp period, after a specified milestone, or only upon a trigger event.
- Distinguish immediate cash-impact provisions from deferred provisions that become relevant only if rates, leverage, or operating performance change.
- When a lender edit changes a threshold or voting percentage, assess the consequence in the context of the actual syndicate or capital stack.
- When a provision references proceeds, distributions, or reserves, determine whether the effect is upstream, downstream, or at the facility level and whether that timing creates a mismatch with other documents.
- When two edits affect the same operative period or the same economic metric, analyze them together rather than as separate line items.

## 6. Output structure conventions

- Use a redline analysis memorandum format organized by issue, not a narrative summary.
- Define the severity scale once up front and apply it consistently to each issue.
- For each issue, include: the source provision, the lender markup, the relevant baseline from the term sheet or drafting instructions, the impact analysis, the severity rating, and a proposed counter-language or negotiation response.
- If the task requires discussing marked text, use plain-text change conventions that survive conversion, such as [DELETED: ...], [INSERTED: ...], and [REPLACED: old → new], with a short rationale attached to each substantive change.
- Present compounding issues as combined entries rather than duplicative standalone notes.
- Include a closing summary matrix that maps each issue to the baseline position, lender position, recommended response, and walk-away view.
- End with a Recommended Actions block that assigns the action, the responsible role, and the timing anchor.
