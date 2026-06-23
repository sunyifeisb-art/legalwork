---
name: ecvc-identify-issues-bridge-loan
task_id: emerging-companies-venture-capital/identify-issues-in-bridge-loan-agreement
description: Identifying issues in a bridge loan agreement requires assessing economic terms against market benchmarks, flagging a personal guaranty as non-standard for an institutional bridge, identifying one-sided amendment provisions, and evaluating revenue milestones for achievability given the company's stage.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Bridge Loan Agreement

## 1. Subject-matter triage

- Treat the bridge loan draft as an issue-spotting and advisory task, not a markup task.
- Read the draft together with the company’s existing agreements, cap table, and financials before prioritizing any issue.
- Identify whether the borrower is venture-backed, early-stage, or otherwise in a market context where institutional bridge terms should track startup lending norms.
- If the source set contains multiple tranches, milestones, lenders, guarantors, or amendment triggers, enumerate them first and analyze each separately.

## 2. Failure modes the skill is correcting

- Economic terms are identified as present without testing whether they are outside market practice for an institutional bridge to a venture-backed company.
- Conversion or participation features are described without comparing their compensation effect to the principal amount and expected bridge structure.
- A personal guaranty is treated as routine even though it is often non-standard for an institutional bridge.
- Amendment mechanics are summarized without checking whether the company can block changes that increase its obligations or impair its rights.
- Revenue or performance milestones are accepted without testing whether they are realistically achievable given the company’s stage, projections, and business model.
- Default provisions are described without checking cure periods, objective triggers, and the interaction with other financing documents.
- Issues are listed as if equally important instead of being ranked by severity and transaction impact.
- Recommendations are left abstract instead of giving a concrete revision path tied to the relevant document owner and timing.

## 3. Legal frameworks / domain conventions that apply

- Bridge loan economics for venture-backed startups are evaluated against market practice for institutional interim financing; unusual yield, fees, warrants, discounts, conversion ratios, or other hidden economics should be flagged when they materially overcompensate the lender.
- Conversion features should be analyzed as part of total lender compensation, with attention to whether they function like equity-side upside rather than conventional debt pricing.
- Personal guaranties in institutional startup bridges are atypical under common venture lending practice; they are more consistent with owner-operated or bank-style credit. If present, identify the departure and evaluate whether the company can negotiate removal or limitation.
- Amendment and waiver provisions should be tested against baseline consent norms. Provisions that permit unilateral lender-side amendment, or that allow a small voting block to change material borrower obligations, should be flagged where company consent is absent for adverse changes.
- Revenue milestone defaults should be tested for achievability using the company’s actual operating scale and forecast. A default tied to a milestone the borrower is unlikely to hit creates an immediate acceleration lever for the lender.
- Default provisions should be reviewed for objective triggers, cure rights where curable, and narrowing of subjective standards that allow opportunistic enforcement.
- Relevant authority should be cited when the analysis depends on a legal standard from the source set or a generally recognized doctrine, rule, statute, or market convention. Do not state a proposition as if self-evident; anchor it to the controlling rule or convention being applied.

## 4. Analytical scaffolds

- Start with the source documents that govern economics, governance, and financial capacity:
  - the bridge loan draft
  - the company’s existing financing documents
  - the cap table and ownership data
  - the company’s recent and projected financials
- For each economic term, identify:
  - the contractual mechanism
  - the economic burden or upside
  - the benchmark it should be compared against
  - whether it appears above market or otherwise non-standard
  - the transaction consequence if left unchanged
- For any guaranty, walk through:
  - who guarantees
  - what obligations are guaranteed
  - whether the guaranty is limited or full
  - whether the structure matches an institutional bridge or instead resembles a bank-style credit package
- For amendment provisions, determine:
  - whether company consent is required
  - whether the lender can act alone or through a holder threshold
  - whether the provision can be used to worsen economics, change default triggers, or impair payment priority
- For revenue or performance milestones, test achievability by comparing:
  - the milestone text
  - current run rate or operating scale
  - forecast timing
  - seasonality or adoption constraints
  - the company’s stated business model and stage
- For defaults more generally:
  - check whether the trigger is objective or subjective
  - check whether a cure period exists and whether it is meaningful
  - check whether the trigger overlaps with another covenant or reporting duty in the source set
  - explain the downstream enforcement risk for the company
- Rank issues by severity using an ordinal scale:
  - Critical
  - High
  - Medium
  - Low
- Treat as critical any provision that can immediately accelerate, extract non-standard personal exposure, or permit unilateral lender control over material borrower rights.
- Treat as high any provision that is materially outside market practice or likely to affect economics, control, or financing flexibility.
- For each issue, close the analysis by stating:
  - the relevant scale or threshold from the documents
  - the cross-reference to the related clause, schedule, or company document
  - the downstream consequence to the borrower
- When a source document supplies a legal citation, quote it only at the level needed to identify the authority; do not reproduce long verbatim text.

## 5. Vertical / structural / temporal relationships

- Analyze the bridge loan in the context of the company’s existing capital structure and any prior debt, preferred equity, or investor rights that could be affected.
- Check whether the draft subordinates or conflicts with existing agreements, board approvals, preemptive rights, protective provisions, negative covenants, information rights, or lien restrictions.
- Compare any milestones and default dates against the company’s projected runway, funding timeline, and anticipated closing events.
- If the bridge is intended to close before a larger financing, assess whether the draft creates timing pressure that could distort the next round or force an early default.
- Where rights or obligations depend on holder thresholds, analyze the practical control implications of the cap table and concentration of ownership.

## 6. Output structure conventions

- Produce a prioritized issue memorandum.
- Use a clear severity legend once at the top, then apply the same ordinal labels consistently.
- Organize the memo as issue entries, each with:
  - provision
  - issue summary
  - benchmark or legal standard
  - severity
  - why it matters now
  - recommended fix
- Each issue entry should include the quantitative or contextual scale drawn from the source set, the related cross-document interaction, and the borrower consequence.
- End with a Recommended Actions block that gives concrete next steps in imperative form, tied to a responsible role and a timing anchor drawn from the transaction timeline or, if none exists, an urgent relative deadline.
- If the analysis depends on authority, identify the controlling statute, regulation, rule, case, or recognized market convention by name in the relevant issue entry.
- Keep the memo concise, prioritized, and action-oriented; do not provide a general treatise.
