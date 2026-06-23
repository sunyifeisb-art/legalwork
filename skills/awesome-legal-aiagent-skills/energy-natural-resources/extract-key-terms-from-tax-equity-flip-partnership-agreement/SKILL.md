---
name: extract-key-terms-tax-equity-flip-partnership
task_id: energy-natural-resources/extract-key-terms-from-tax-equity-flip-partnership-agreement
description: Guides extraction of key terms from a tax equity flip partnership agreement by identifying the flip structure and trigger, summarizing allocation mechanics, checking tax assumptions against applicable law, and systematically flagging cross-document inconsistencies between the agreement and related transaction materials.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Tax Equity Flip Partnership Agreement — Term Sheet Summary

## 1. Subject-matter triage

- Treat this as a document-extraction and issue-spotting task, not a rewrite of the agreement.
- Identify the governing deal stack first, then extract the operative economics, tax treatment, governance, and exit mechanics.
- If multiple transaction documents are present, determine which terms are fixed by the agreement, which are explained by the model or closing materials, and which are only assumed elsewhere.

## 2. Failure modes the skill is correcting

- Baseline notes the tax credit computation basis but does not identify whether a fair-market-value safe harbor election has been made or explain its significance for the credit basis.
- Baseline extracts financial model assumptions without cross-checking them against the applicable statutory or regulatory treatment for the relevant placed-in-service year, leaving overstated depreciation assumptions undetected.
- Baseline summarizes the flip economics but fails to pin down the actual trigger, the pre- and post-flip allocation mechanics, or whether the trigger is performance-based or date-based.
- Baseline lists terms in isolation and misses conflicts between the agreement, model, appraisal, tax opinion, or closing checklist.
- Baseline identifies an issue descriptively but does not state its significance for the flip date, credit allocation, cash flow, tax treatment, or exit economics.
- Baseline omits whether the extracted term is fixed, conditional, or merely assumed in a related document.

## 3. Legal frameworks / domain conventions that apply

- Tax equity flip structure identification: a flip partnership may be structured as a yield-based flip or as a fixed-date flip; correctly identifying the flip type is critical because the trigger mechanism determines when the economics shift, and the analysis should distinguish performance-based triggers from date-based triggers.
- Credit allocation and fair-value safe harbor: the tax credit is allocated among partners based on the agreement’s allocation mechanics; the standard pre-flip allocation typically directs the bulk of the credit to the investor; identify whether a fair-value safe harbor is elected and note that it may change the basis used to compute the credit.
- Basis reduction and depreciation interaction: when a tax credit is claimed, the depreciable basis of the property is reduced by the applicable basis-reduction percentage; this reduction affects depreciation deductions; if the financial model does not apply this basis reduction before computing depreciation, the model will overstate depreciation deductions and tax benefits.
- Bonus depreciation phase-down: bonus depreciation rates vary by placed-in-service year under current law; verify that the model uses the rate applicable to the relevant year and flag any mismatch between the model and current law.
- Allocation method and flip-date accuracy: partnership allocation rules for built-in gain or loss can affect depreciation allocations; if the partnership agreement specifies one allocation method and the financial model assumes another, projected economics may be based on incorrect allocation assumptions; identify the specified method and verify that the model reflects it.
- Debt-service coverage and cash sweep interaction: a debt-service coverage covenant may trigger a cash sweep if performance falls below the covenant threshold; the restoration threshold may be higher than the trigger threshold to avoid toggling between states; the interaction between the sweep and preferred-return accrual during the sweep period is often important.
- Asset management fee characterization: an asset management fee paid to the managing member may be characterized as a guaranteed payment or as an allocation and distribution; the characterization affects tax treatment and should be tested against the agreement’s actual payment mechanics.
- Deficit restoration obligations: a deficit restoration obligation requires a partner to restore a negative capital account balance upon liquidation; the presence and level of each class’s obligation affects the substantial economic effect analysis; identify whether each class has such an obligation and at what level.
- Back-leverage and encumbrance: if the managing member has taken back-leverage financing secured by its partnership interest, the pledge may constitute a transfer or encumbrance requiring consent under the partnership agreement; identify whether back-leverage is disclosed and whether the required consent was obtained.
- Put option mechanics: a put option allows the managing member to require the investor to sell its interest back at a defined price; the option price mechanism determines the economics of the buyout; extract the exercise window, price mechanism, and any termination conditions.
- Cross-document consistency: the partnership agreement, financial model, tax opinion, appraisal, and closing checklist should present consistent information on the key tax and economic terms; identify any inconsistency between documents and flag it with the source documents in conflict, the nature of the inconsistency, and its potential impact on the flip date, tax allocation, or equity return.

## 4. Analytical scaffolds

- Start by enumerating the distinct parties, documents, project assets, equity classes, and timing periods that matter; analyze each item separately rather than collapsing multiple items into a single pass.
- For each key provision: extract the operative term; compute any derived figures only if they can be supported by the documents; cross-check against financial model assumptions and applicable statutory or regulatory treatment.
- Depreciation analysis: identify the asset class, the stated bonus depreciation rate, and the applied basis; verify against the current-law treatment for the placed-in-service year; apply any required basis reduction; assess whether the financial model correctly reflects all three elements.
- Flip analysis: state whether the flip is yield-based or date-based, identify the trigger, the post-flip allocation shift, and any conditions that accelerate, delay, or prevent the flip.
- Allocation analysis: identify pre-flip and post-flip allocations of credits, cash, losses, and depreciation; note any preferred return, target yield, catch-up, or residual allocation mechanics.
- Governance and control analysis: extract consent rights, major decision rights, transfer restrictions, removal rights, and any encumbrance or pledge restrictions that affect control of the interest.
- Exit and remedies analysis: extract any put, call, forced transfer, buy-sell, dissolution, cure, indemnity, or recapture protection mechanics.
- Cross-document issues: after completing the extraction, compare the agreement, financial model, tax opinion, appraisal, and closing checklist; compile an issues list identifying each inconsistency, the documents in conflict, and the potential financial or legal impact.
- When stating a legal proposition, tie it to the controlling authority or generally recognized tax rule supporting the point rather than asserting the conclusion nakedly.

## 5. Vertical / structural / temporal relationships

- Track timing in deal order: signing, conditions to closing, placed-in-service date, funding date, credit commencement, first allocation period, flip trigger, post-flip period, and exit or liquidation.
- Distinguish vertical relationships within the entity stack: sponsor, investor, managing member, partnership, project company, and any blocker or financing vehicle.
- Distinguish structural relationships between economics and tax: cash distributions may diverge from tax allocations, and both may diverge from capital account allocations; do not conflate them.
- If a term changes by period, phase, or condition, state the governing period explicitly and do not merge pre-condition and post-condition treatment.

## 6. Output structure conventions

- Produce a structured term-sheet summary using conventional deal headings rather than reproducing the source document’s section list.
- Cover, at minimum, the transaction overview, parties and ownership, capital contributions, tax credit and depreciation mechanics, flip trigger and post-flip economics, distributions, governance and consent rights, management fees, capital account and DRO mechanics, transfer and encumbrance restrictions, recapture and indemnity protections, put/call or exit rights, debt-related covenants if any, and any special tax assumptions.
- For each term, give the operative description, the source document(s), and a short note on whether the term is consistent across the materials.
- Include a separate inconsistencies and open issues section for conflicts, ambiguities, missing terms, and unresolved drafting points.
- For each issue, state the inconsistency, the documents in conflict, the significance to the economics or tax treatment, and the suggested follow-up or cure.
- Use an ordinal severity label consistently for each issue entry, with the scale defined once at the top of the issues section.
- Close each issue with the relevant scale or threshold if one is stated in the documents, the interacting provision or document, and the downstream consequence for the client.
- End with a concise recommended next steps list identifying who should resolve each open point and by when relative to signing, closing, or the tax filing deadline.
