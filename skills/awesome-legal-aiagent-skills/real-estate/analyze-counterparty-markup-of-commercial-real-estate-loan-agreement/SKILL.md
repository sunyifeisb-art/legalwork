---
name: analyze-counterparty-markup-of-commercial-real-estate-loan-agreement
task_id: real-estate/analyze-counterparty-markup-of-commercial-real-estate-loan-agreement
description: Guides prioritized redline analysis of a lender markup by structuring term-sheet verification, borrower-risk assessment, and playbook-calibrated response recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Commercial Real Estate Loan Agreement — Redline Analysis Memorandum

## 1. Subject-matter triage
- Treat the executed term sheet as the primary benchmark, then compare the lender markup against the original draft and any partner instructions.
- If more than one loan, tranche, phase, guarantor, or property is in scope, enumerate each one first and analyze them separately; do not collapse distinct facilities into one pass.
- If the request concerns a single loan facility only, state that affirmatively before analysis.

## 2. Failure modes the skill is correcting
- Reviews the markup against the draft loan agreement without anchoring each change to the negotiated term sheet.
- Describes edits without assessing borrower-side economic or operational impact.
- Treats covenants, remedies, guaranties, and structural provisions in isolation, missing cumulative lender-favorable effects.
- Omits standard CRE topics that should be checked even when the markup is silent, including fallback rate mechanics, SPE covenants, recourse carve-outs, and extension conditions.
- Fails to distinguish true deal-term deviations from drafting cleanups or internal consistency edits.
- Produces a list of comments without a clear severity ranking or next-step response.
- Omits a plain-text-readable marking method for changes, which makes the analysis fragile in export.

## 3. Legal frameworks / domain conventions that apply
- CRE loan economics: rate, index/spread, maturity, amortization, interest-only period, required reserves, and extension economics must be tested against the term sheet.
- Benchmark fallback drafting: post-transition loan documents should include a clear fallback waterfall, spread adjustment, and conforming mechanics consistent with governing market practice and applicable benchmark-replacement rules.
- Covenant package: LTV, DSCR, debt yield, cash-management triggers, reporting, and default cure mechanics often operate together and should be reviewed as a package, not clause by clause only.
- SPE structure: bankruptcy remoteness, separateness covenants, independent management, and voluntary bankruptcy restrictions are standard lender protections and should be checked for consistency with the borrower structure.
- Non-recourse and bad-boy carve-outs: recourse exposure should be analyzed by trigger, scope, and interaction with default, bankruptcy, transfer, and casualty/environmental provisions.
- Guaranty package: completion, carry, repayment, springing, or environmental guaranties must be read with default definitions and remedy triggers.
- Construction or renovation mechanics: if applicable, advances, retainage, inspections, reserves, lien waivers, and completion conditions should be tested against the term sheet and source documents.
- Environmental and casualty provisions: indemnity scope, survival, insurance, condemnation, and restoration mechanics are routine high-impact issues.
- Use controlling authority only where the issue turns on a legal proposition that requires it; otherwise rely on transaction conventions and the source documents.

## 4. Analytical scaffolds
- Start by extracting every economic term from the term sheet and checking it against the markup before assessing structural edits.
- For each marked change, identify whether it is:
  - an economic modification,
  - a covenant tightening,
  - a remedial-right expansion,
  - a structural requirement addition,
  - or a drafting cleanup.
- For each issue, state the exact section reference, the nature of the change, and whether it is consistent with the term sheet, original draft, and playbook.
- Close each issue with three moves: the relevant scale or threshold from the source documents, the clause or document that interacts with it, and the practical consequence for the client.
- Assign a uniform ordinal severity label to every issue and define the scale once at the top of the memo.
- Use robust markup conventions in the analysis so each substantive change is identifiable in plain text, even if formatting is stripped:
  - [DELETED: ...]
  - [INSERTED: ...]
  - [REPLACED: old → new]
  - [Rationale: ...]
- When the markup adds a lender-favorable condition not found in the term sheet, flag it expressly as a deviation and state the borrower-side negotiating point.
- When the markup is silent on a market-standard topic that should be present, flag the omission and explain the risk of leaving it unresolved.
- Separate true deal-breakers from items that are merely suboptimal, even if both should be captured in the memo.
- Cross-check the agreement against the term sheet, draft, and playbook for internal consistency on names, dates, defined terms, reserves, triggers, and cure rights.

## 5. Vertical / structural / temporal relationships
- Term-sheet hierarchy controls the economic bargain; if the markup conflicts with the term sheet, identify the conflict and prioritize it.
- Default-to-remedy linkage matters: changes to default definitions, notice periods, or cure rights can accelerate guaranty liability, cash management, or foreclosure remedies.
- Guaranty exposure often turns on upstream loan events; analyze guaranty provisions together with defaults, transfers, bankruptcies, and misapplication of proceeds.
- For facilities with construction-to-permanent conversion, verify that conversion conditions, post-conversion economics, and remaining reserves match across both phases.
- If a benchmark replacement or reserve mechanic is time-sensitive, note the temporal trigger and any post-closing deliverable or milestone it affects.

## 6. Output structure conventions
- Write a prioritized redline analysis memo, not a narrative summary.
- Open with a short executive summary that states the overall posture, the highest-severity issues, and the borrower-side negotiating outlook.
- Include a severity key at the top using an ordinal scale, then use that scale consistently throughout.
- Organize the body by severity first, then by agreement section or topic.
- For each issue, include:
  - section reference,
  - brief description of the markup change,
  - why it matters economically or legally,
  - source-document check against the term sheet or playbook,
  - downstream consequence,
  - recommended counter-position.
- Where helpful, group related changes that compound risk, but do not lose clause-level specificity.
- End with a concise Recommended Actions block that assigns the next step to the relevant role and ties it to the transaction timeline or closing sequence.
- If any issue requires escalation, say so explicitly and identify the decision point.
- The deliverable filename must be `redline-analysis-memo.docx`.
