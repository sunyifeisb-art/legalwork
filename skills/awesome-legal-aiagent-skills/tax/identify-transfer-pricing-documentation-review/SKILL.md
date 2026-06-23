---
name: identify-transfer-pricing-documentation-review
task_id: tax/identify-transfer-pricing-documentation-review
description: A transfer pricing documentation issue-identification memorandum should methodically identify gaps, explain why each gap matters, and outline the follow-up steps needed to remediate the record. Incomplete documentation should be analyzed by specifying what is missing, why it is insufficient, and how the deficiency should be addressed.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Transfer Pricing Documentation Review

## 1. Subject-matter triage
- Confirm the filing year, entities, transactions, and documented intercompany methods before analyzing gaps.
- Separate one-off documentation defects from recurring method defects, because recurring defects drive broader audit exposure and remediation scope.
- If the package contains multiple tested transactions, functions, or valuation workstreams, enumerate them first and review each on its own terms rather than collapsing them into a single pass.
- If a topic is not actually documented in the record, say so expressly and treat the absence as a review issue, not as a basis for assumption.

## 2. Failure modes the skill is correcting
- Identifying documentation gaps without explaining what is missing, why the omission matters, and what follow-up is needed to cure it.
- Accepting a benchmarking study’s comparable set without independently testing whether the comparables are sufficiently similar in technology, product profile, and industry context.
- Missing a mismatch between the contractual royalty base and the base actually used in the calculation.
- Failing to assess whether a valuation or cost-sharing discount rate is independently derived and supported by sensitivity analysis.
- Treating intercompany service or cost-allocation support as adequate when the file does not tie the narrative, the contracts, and the calculations together.
- Overlooking stale data, inconsistent role descriptions, or unsupported residual-profit allocations that create IRS audit vulnerability.

## 3. Legal frameworks / domain conventions that apply
- **Section 482 arm’s-length standard:** Analyze whether the documented method and result align with the arm’s-length principle under Internal Revenue Code § 482 and Treas. Reg. § 1.482-1.
- **Comparable analysis discipline:** Comparable selection should be tested for similarity in functions, assets, risks, technology, product life cycle, and market context under Treas. Reg. § 1.482-1(d).
- **Royalties and intangibles:** Royalty analyses should match the contract-defined base to the base actually used, with any exclusions, inclusions, or offsets reconciled to the agreement and accounting records.
- **Cost sharing and intangible development:** Where cost-sharing or platform-sharing materials appear, test consistency across governing documents, valuation support, and annual reporting under Treas. Reg. § 1.482-7.
- **Services and cost allocations:** For intercompany services, assess whether the record supports the stated method and whether excluded activities or pass-through items distort the cost base under Treas. Reg. § 1.482-9.
- **DEMPE / functional analysis:** The file should explain who performs development, enhancement, maintenance, protection, and exploitation activities and how that supports the profit allocation.
- **Valuation support:** Discount-rate or present-value analyses should show the derivation, assumptions, and sensitivity testing that would allow independent review.

## 4. Analytical scaffolds
- Review each issue as a self-contained item: identify the deficiency, locate the governing source, explain the inconsistency, assess the likely audit consequence, and specify the cure.
- For benchmarking issues, identify any comparables that appear materially different, explain why the difference matters, and assess whether the range or selected point would likely change if the set were refreshed or narrowed.
- For royalty issues, compare the contract language to the calculation workpaper, note any mismatched base items, and determine whether the mismatch is material enough to require recalculation or contractual clarification.
- For cost-sharing or valuation issues, trace the rate, allocation, or discount support back to the source documents, then test whether the record shows a derivation, a rationale, and a sensitivity analysis.
- For DEMPE issues, map functions to entities and compare that mapping against the narrative elsewhere in the file; flag any residual-return allocation that is not supported by the described activity.
- For services and cost-base issues, isolate pass-through amounts, excluded activities, and cost-only claims; determine whether each item is included or excluded consistently across the file.
- For each issue, state a severity level on a uniform ordinal scale defined once at the top of the memorandum.
- For each issue, include the governing authority, the size or scope of the issue as reflected in the file, the related source materials that interact with it, the consequence for the taxpayer, and a concrete remediation step.
- Do not invent arithmetic. Quantify only from figures already shown in the source set; if the record does not support a calculation, describe the exposure qualitatively.
- If multiple years, entities, or transactions are in scope, analyze each separately and avoid blending facts across periods.

## 5. Vertical / structural / temporal relationships
- Compare the governed document set vertically: agreement language, transfer pricing study, valuation workpapers, accounting support, annual true-up or reporting, and audit correspondence should be internally consistent.
- Test temporal consistency: the methodology should not rely on stale data if more current information exists for the year under review, and later amendments should be reconciled to earlier workpapers.
- Compare top-down claims to bottom-up calculations; if the narrative says one method is used but the math reflects another, flag the mismatch.
- Where source documents conflict, identify which document appears controlling, which appears derivative, and what reconciliation is missing.

## 6. Output structure conventions
- Write an issue-by-issue issues memorandum in a professional legal or tax format suitable for `tp-issue-identification-memo.docx`.
- Begin with a short executive summary, then a defined severity scale, then the issue list.
- Use one entry per issue, and within each entry include: severity, issue statement, governing authority, source conflict or missing support, audit significance, and recommended fix.
- Present any benefits, allocations, or source-document discrepancies in a comparison table when multiple documents need to be reconciled.
- Organize the issue list from highest to lowest severity.
- State the review horizon or completion deadline prominently if it appears in the record; otherwise note the milestone driving urgency.
- End with a Recommended Actions block that assigns each next step to a role identified in the file and ties it to a deadline or milestone.
- Keep the memo analytical and corrective: identify the problem, why it matters, and how to remediate it; do not merely summarize the file.
