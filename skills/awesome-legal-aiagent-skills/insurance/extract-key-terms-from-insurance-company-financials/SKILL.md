---
name: extract-key-terms-insurance-company-financials-surplus-note
task_id: insurance/extract-key-terms-from-insurance-company-financials
description: Agents producing a due diligence summary for an insurance company financial review prioritize headline financial metrics, complete all required sections with data-supported content, identify cross-instrument and underwriting reserve interactions, and present risk factors with severity labels and brief impact statements.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Insurance Company Financials — Term Sheet Summary for Surplus Note Due Diligence

## 2. Failure modes the skill is correcting

- The extraction prioritizes the most visible financial figures and omits structured completion of all required sections; every labeled section must be completed with data-supported content, not left blank or generalized.
- Risk factors are listed without severity labels, making it impossible for the investment committee to prioritize concerns.
- A risk or issue is described in isolation, but the summary fails to tie it to the relevant reserve, investment, reinsurance, rating, or capital item that changes the economics or regulatory posture.
- The write-up states a conclusion about payment capacity, reserve adequacy, or capital strength without identifying the source authority or disclosed measure that supports that conclusion.
- Multiple entities, periods, or instruments appear in the file set, but the summary collapses them into one blended description instead of separating each relevant item.
- Recommendations are implied rather than stated, leaving the committee without an action-oriented close.

## 3. Legal frameworks / domain conventions that apply

- Surplus note: a subordinated hybrid capital instrument issued by an insurance company; interest and principal payments may require regulatory approval and can be deferred if surplus falls below a threshold; assess both the issuer's financial health and the payment approval risk.
- Parent entity and holding company structure: the surplus note's credit quality depends not only on the issuer but on the holding company structure; if the issuer is a subsidiary, the parent's financial condition and willingness to support the subsidiary are material.
- NAIC bond designations: bonds are rated on a multi-tier designation scale; the designation determines the capital charge for each bond held; a portfolio with significant lower-quality designations carries higher capital requirements and reflects lower investment quality.
- Catastrophe reinsurance structure: catastrophe excess-of-loss treaties have an attachment point, an exhaustion point, and a rate-on-line; these parameters define the insurer's net catastrophe exposure and the cost of reinsurance protection.
- PML approaching treaty limit: if the insurer's probable maximum loss from a major catastrophe approaches the treaty's exhaustion point, a large loss event could exhaust the reinsurance cover, leaving the insurer absorbing additional losses.
- Capital adequacy ratio: a proprietary or rating-agency capital adequacy measure is a relative indicator of capital strength; a ratio approaching the applicable minimum threshold signals potential downgrade risk; the current ratio and trend must both be reported.
- A&E reserves: legacy long-tail liabilities; survival ratio (carried reserves divided by recent average annual paid losses) estimates years of payment capacity; low survival ratios suggest reserve inadequacy; limited disclosure creates an estimation risk.
- Commercial auto adverse development trend: accelerating paid loss growth relative to incurred loss projections is a leading indicator of reserve inadequacy; an actuarial qualifying paragraph amplifies the concern.
- Single issuer concentration: concentration of the bond portfolio in a single issuer creates concentrated credit risk that must be identified and flagged.
- Sliding scale commission linkage: if the ceding commission under a quota share treaty declines when the loss ratio deteriorates, a period of adverse development simultaneously reduces underwriting income and ceding commission revenue — a compounding negative effect on earnings.
- Use the controlling authority named in the source materials for any regulatory, accounting, or rating conclusion; if the file set is silent, identify the governing rule or standard from generally recognized insurance practice rather than stating an unsupported conclusion.

## 4. Analytical scaffolds

- Determine whether the file set contains more than one entity, statement period, instrument, treaty, or rating view. If so, enumerate them explicitly before analysis and keep each item separate throughout the summary.
- For each data point, state the figure, the period or as-of date, and the source document type. If a figure is unavailable, say so and explain whether the gap is a disclosure gap, a file limitation, or a true absence.
- For each issue, close the loop: identify the scale or threshold implicated, cross-reference the related reserve, investment, reinsurance, or surplus-note term, and state the practical consequence for the issuer or investor.
- Distinguish between statutory balance-sheet measures, underwriting measures, and rating-agency measures; do not mix them unless the source documents expressly reconcile them.
- Treat reserve opinions, rating commentary, and treaty terms as distinct inputs. When one affects another, explain the interaction rather than repeating the same fact in two places.
- When summarizing a legal or regulatory consequence, anchor it to the cited rule, approval requirement, or disclosure standard used in the file set.

## 5. Vertical / structural / temporal relationships

- Identify the issuer, any parent or holding company, and the regulatory domicile before discussing credit support or payment risk.
- Separate current-period metrics from prior-period trends; where trend matters, report the direction and whether it is improving, stable, or deteriorating.
- Track vertical effects across the capital stack: assets and surplus support reserves, reserves support underwriting results, underwriting results affect surplus note payment capacity, and surplus note terms affect investor recovery.
- Trace horizontal interactions within the asset portfolio and reinsurance program: lower-quality bonds raise capital burden, concentration raises idiosyncratic loss risk, and treaty structure determines how catastrophe exposure flows into surplus.
- If multiple schedules or statements address the same concept, prefer the most direct source and reconcile inconsistencies only after identifying them.
- If the source documents present a parent-level view and an operating-company view, state which level each figure belongs to and avoid blending them into one profile.

## 6. Output structure conventions

- Produce a structured due diligence summary in conventional report form, with clear headings for entity overview, key financial metrics, reserving/actuarial observations, investment portfolio, reinsurance, rating view, surplus note terms, and risk assessment.
- Include every material category requested by the file set; do not leave a heading empty without stating why the information is unavailable or not disclosed.
- For each risk factor, include an explicit severity label using a uniform ordinal scale stated once near the risk section, and give a one-line impact statement tied to the cited source facts.
- Where a risk turns on a threshold, include the relevant threshold or directional benchmark from the source documents or governing standard, without introducing unsupported arithmetic.
- End with a concise recommended actions section that names the action, the responsible role or function, and the timing anchor tied to the diligence or closing process.
- Keep the writing decision-useful: short factual sentences, minimal narrative, and no unsupported inference beyond what the disclosed materials and cited authority support.
