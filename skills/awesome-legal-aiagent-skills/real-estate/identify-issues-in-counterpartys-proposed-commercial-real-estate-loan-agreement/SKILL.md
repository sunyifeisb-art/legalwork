---
name: identify-issues-in-counterpartys-proposed-commercial-real-estate-loan-agreement
task_id: real-estate/identify-issues-in-counterpartys-proposed-commercial-real-estate-loan-agreement
description: Guides borrower-side identification of issues in a proposed commercial real estate loan agreement and related guaranty by comparing the draft against the appraisal, underwriting materials, Phase I environmental summary, and attorney instructions to identify lender-favorable departures from market norms and prepare a prioritized issues memorandum.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Counterparty's Proposed Commercial Real Estate Loan Agreement — Issue Memorandum

## 1. Subject-matter triage

- Treat the attorney instruction email as the deal compass: identify the requested focus areas, non-negotiables, and any items to de-emphasize.
- Treat the draft loan agreement, guaranty, appraisal, underwriting model, and environmental summary as one integrated source set; issues often arise only from their interaction.
- If the source set contains multiple borrower entities, multiple collateral assets, or multiple loan tranches, enumerate them first and analyze each separately before synthesizing the memo.
- If only one property, one borrower group, and one loan facility are in scope, state that explicitly and proceed on that basis.

## 2. Failure modes the skill is correcting

- Reviewing the loan documents in isolation and missing that covenant levels, extension tests, and cash management triggers must be tested against the underwriting case, not abstract market language.
- Missing how the guaranty expands practical recourse beyond the nominally non-recourse loan through broad default triggers or environmental / SPE / transfer-based carve-outs.
- Producing a technically complete memo that ignores the client’s priority list and therefore wastes negotiation capital on low-value points.
- Accepting lender-friendly environmental indemnity language without reconciling it to the Phase I environmental summary and any known pre-existing conditions.
- Failing to identify when the appraisal or underwriting model does not support the loan’s economics, timing assumptions, or maturity-out conditions.
- Describing an issue without closing the loop on scale, source-document interaction, and borrower consequence.

## 3. Legal frameworks / domain conventions that apply

- Commercial real estate loan terms should be benchmarked against market norms for the asset class, leverage profile, and sponsor strength reflected in the source documents.
- Key economics to test include rate, amortization, maturity, extension mechanics, prepayment, reserves, and any fees or spreads that materially change borrower economics.
- Ongoing covenants must be evaluated for feasibility using the underwriting model; covenants that the model suggests are likely to be missed are effectively hidden default traps.
- Extension rights are usually conditional; typical conditions include no existing default, payment compliance, performance thresholds, and delivery of customary lender conditions.
- Non-recourse structures should be checked against standard carve-outs; any expansion that makes “bad-boy” liability broader than customary market practice should be flagged.
- Cash management and cash sweep regimes should be evaluated for trigger breadth, release mechanics, and operational feasibility.
- SPE and bankruptcy-remote covenants should align with the borrower’s organizational documents and closing structure; internal inconsistency is a curable but material closing issue.
- Environmental indemnities should be measured against the Phase I environmental summary and common-risk allocation principles; pre-existing recognized conditions should not be silently shifted to the borrower.
- Transfer restrictions should be tested against realistic exit paths and customary qualified transferee standards for the asset type.
- To the extent the memo states a legal proposition, cite the governing authority or recognized practice convention supporting that proposition.

## 4. Analytical scaffolds

- Start with the instruction email: identify the client’s stated priorities, negotiation posture, and any terms that should be elevated or deprioritized.
- Extract the core transaction economics from the underwriting model, then test the loan agreement’s covenants, reserves, amortization, and extension conditions against those projections.
- Compare the draft loan agreement and guaranty together; identify where an event of default in the loan document becomes guarantor liability, and whether that result is limited, springing, or effectively full recourse.
- Cross-check the appraisal against any value-based covenant, advance rate, or maturity condition tied to valuation.
- Use the Phase I environmental summary as the benchmark for environmental risk allocation; flag indemnity language that exceeds the identified risk profile.
- For each issue, state: the provision at issue, the market-standard baseline, the borrower impact, the likely negotiation posture, and a clear recommendation.
- Close every issue with: a scale or threshold from the source set, a cross-reference to the interacting document or clause, and the downstream consequence for the borrower.
- Apply a uniform severity scale across the memo and keep the rationales short and consistent.

## 5. Vertical / structural / temporal relationships

- Underwriting assumptions precede covenant feasibility: if the model does not support a covenant on day one, the issue is immediate, not hypothetical.
- Maturity and extension conditions must be assessed in sequence: a workable initial term can still be impaired by an unachievable extension test.
- Loan default provisions and guaranty triggers must be read vertically: a narrow loan default can become a broad recourse event when the guaranty is layered on top.
- Environmental diligence and indemnity language must be read temporally: pre-existing conditions identified before closing should not be reallocated to the borrower as if they arose post-closing.
- Transfer restrictions should be assessed against exit timing: a restriction that is tolerable at closing may become value-destructive if it impairs refinancing or sale at maturity.

## 6. Output structure conventions

- Deliver a borrower-focused issue memorandum in a conventional legal memo shape: short executive summary, severity key, issue-by-issue analysis grouped by topic, and a closing recommended-actions section.
- Define the severity scale once at the top and apply it uniformly across all issues.
- For each issue entry, include: document and section reference; concise description of the proposed language; market comparison; quantitative or threshold reference from the source set; related clause or document cross-reference; borrower consequence; severity; and recommended response.
- Keep the memo prioritized: lead with issues most likely to affect closing, economics, or recourse exposure.
- Use a practical negotiation tone: identify what should be rejected, what is acceptable with modification, and what is merely confirmatory.
- End with a Recommended Actions block that assigns each action to the relevant role named in the source materials and ties the timing to the closing process, diligence deadline, or other transaction milestone.
- Follow the deliverable naming convention in the task instructions and produce `issue-memorandum.docx`.
