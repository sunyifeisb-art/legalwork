---
name: draft-tax-structure-memorandum-pe-acquisition
task_id: tax/draft-tax-structure-memorandum
description: A tax structure memorandum for a private equity acquisition of an S-corporation target should compare structural alternatives with per-seller after-tax computations and address election mechanics for a deemed asset sale, inventory-method recapture, the business interest limitation under current and prospective adjusted taxable income definitions, and related basis and depreciation issues.
activates_for: [planner, solver, checker]
---

# Skill: Draft Tax Structure Memorandum — PE Acquisition of S-Corporation

## 2. Failure modes the skill is correcting

- Treating the deal as a single-taxpayer question when the analysis must be run seller by seller, because each equity holder may have different basis, holding period, state exposure, rollover terms, and consent posture.
- Analyzing a stock deal, an asset deal, and a deemed asset sale only in the abstract, without a side-by-side after-tax comparison that shows how the same purchase price produces different seller outcomes and buyer tax attributes.
- Omitting the deemed asset sale election mechanics, including whether required equity-holder consent is needed and whether rollover equity creates a separate consent or structuring issue.
- Ignoring ordinary-income items created by inventory-method reserve recapture, recapture generally, or non-compete allocation, which can materially change seller proceeds and buyer deductions.
- Failing to distinguish amortizable intangibles from tangible property that may qualify for bonus depreciation, or failing to carry the allocation through to basis, amortization, and depreciation schedules.
- Quantifying the business interest limitation only under one adjusted taxable income regime, without testing the current and prospective definitions that may change capacity after the temporary addback sunsets.
- Leaving out state income tax, nonconformity, and transaction-cost treatment, even though those items often drive the recommendation.
- Reaching a recommendation without showing the legal authorities and tax rules that support each material conclusion.

## 3. Legal frameworks / domain conventions that apply

- **Stock purchase versus deemed asset sale versus actual asset purchase:** Compare the federal tax consequences of each structure using the governing election and recharacterization rules under the Internal Revenue Code and Treasury regulations applicable to S corporation acquisitions.
- **Deemed asset sale election mechanics and consent:** Identify the election mechanism, the shareholder-consent requirement, and any conflict created if some holders receive rollover equity rather than cash. If rollover equity is involved, analyze whether the rollover must be separately structured, conditioned, or excluded from the election.
- **Seller-level gain computation:** For each seller, compute gross proceeds, basis, total gain or loss, character of gain or income, applicable federal capital gains or ordinary-income rate, state income tax, and resulting after-tax proceeds. Where ordinary-income recapture applies, isolate it from capital gain.
- **Inventory-method recapture and ordinary income items:** If the target uses an inventory reserve method or similar deferral method that converts to ordinary income upon a deemed asset sale, include the resulting entity-level tax or distributive effect and carry that through to seller proceeds.
- **Purchase price allocation under the residual method:** Allocate consideration among asset classes in the applicable order, assign fair market value to identified classes first, and then derive residual goodwill or going-concern value. If parties agree to an allocation, note the need for consistent reporting positions.
- **Non-compete allocation:** Analyze the buyer-seller tension created by covenant-not-to-compete allocations: buyer amortization versus seller ordinary income.
- **Depreciation and amortization:** Separate amortizable intangibles from tangible personal property that may qualify for bonus depreciation under the applicable recovery-period and placed-in-service rules. State the basis and timing consequences for each category.
- **Business interest limitation under current and prospective ATI:** Apply Section 163(j) to the post-close capital structure and quantify the limitation under both the current adjusted taxable income definition and the future definition with reduced addbacks. Cite the controlling Code and regulation provisions used in the analysis.
- **State and local tax:** Address state conformity or nonconformity to bonus depreciation, federal basis adjustments, and ordinary-income treatment where relevant.
- **Transaction costs:** Distinguish buyer acquisition costs that must be capitalized from deductible expenses, and seller costs that are capital or ordinary depending on their function and source.
- **Authority discipline:** Every conclusion should be tied to the governing statutory, regulatory, or established authority relied on for that point.

## 4. Analytical scaffolds

- Start with a transaction summary that identifies the parties, purchase price, rollover terms, intended closing form, and any assumptions necessary to complete the tax analysis.
- Enumerate the structural alternatives before analysis and run the same framework for each alternative rather than collapsing the deal into a single representative case.
- For each seller, prepare a separate comparison of the alternatives, with a row or subsection that shows:
  - gross proceeds,
  - basis,
  - gain or loss,
  - character,
  - federal tax,
  - state tax,
  - and net after-tax proceeds.
- When comparing seller economics, isolate ordinary-income items first, then capital gain, then state tax effects, so the recommendation does not blur rate differences with basis effects.
- For the buyer, show how the chosen structure affects initial tax basis, depreciation and amortization deductions, and any step-up or fresh-start benefits.
- For purchase price allocation, begin with the identified asset classes, assign values in tax order, and then derive residual goodwill or going-concern value. If a covenant allocation is relevant, model it separately from goodwill and note the competing buyer and seller consequences.
- For business interest expense, run the limitation under at least two ATI definitions when the close-date facts make the future rule economically relevant, and describe how the result affects post-close deductibility.
- If a state conformity issue exists, flag whether the federal benefit is preserved, reduced, or reversed at the state level, and whether that changes the preferred structure.
- End with a clear recommendation that states the chosen structure, the tax reasons for it, and any closing conditions or drafting points needed to preserve the intended tax result.

## 5. Vertical / structural / temporal relationships

- Identify which items are entity-level effects and which are seller-level effects; do not mix them without stating the pass-through or basis mechanism that connects them.
- Separate pre-close and post-close consequences, especially where an election, allocation, or basis step-up changes deductions in later periods.
- If rollover equity is present, distinguish the cash-selling holders from the continuing holders and analyze whether the election, allocation, or reporting position must be made consistently or separately.
- Treat ordinary-income recapture, interest limitation, depreciation, and state tax as interacting layers: the same structure may improve one layer while worsening another.
- Where a prospective rule changes the post-close deduction profile, show the near-term and later-period effects in sequence rather than as one blended figure.

## 6. Output structure conventions

- Write a detailed internal tax memorandum suitable for deal team circulation, with a concise executive recommendation up front and a reasoned analysis in the body.
- Use conventional memorandum headings that cover transaction summary, structural alternatives, election mechanics, allocation and basis, interest limitation, seller economics, state tax, transaction costs, and recommendation.
- Include a side-by-side seller comparison for each structural alternative, and keep each seller’s computation internally complete.
- Show implied goodwill or residual value where an asset or deemed asset sale analysis requires it.
- State the controlling tax authority for each material proposition in the body of the memorandum.
- Close with an explicit Recommended Actions section that tells the deal team what to do next, who should do it, and when it must occur relative to signing or closing.
- Prepare the deliverable as the requested memo file name and ensure the final content reflects an operative memorandum, not a summary of issues alone.
