---
name: review-distressed-credit-facility-scenario-02
task_id: bankruptcy-restructuring/review-distressed-credit-facility/scenario-02
description: Ensures a distressed credit facility review applies the same structural analyses as the related scenario class — pledge limitation scope, financing pre-consent feasibility, standstill expiration, cross-agreement change-of-control triggers, and any joint-venture put option cross-reference — while keeping the analysis procedural and document-driven.
activates_for: [planner, solver, checker]
---

# Skill: Review Distressed Credit Facility — Issue Identification Memorandum (Scenario 02)

## 1. Subject-matter triage (only if applicable)

- Treat this as a document-driven distressed credit review, not a general bankruptcy memo.
- First identify the operative documents, the facility parties, the trigger provisions, and any timeline-defining defaults, notices, or forbearance terms.
- If multiple facilities, amendments, guaranty layers, or related agreements are present, enumerate them before analysis and analyze each separately rather than merging them into a single pass.

## 2. Failure modes the skill is correcting

- The review identifies ordinary covenant issues but misses restructuring-critical structural risks: pledge limitations that bind the wrong entity class, financing pre-consent language that cannot accommodate the contemplated rescue financing, and cross-document change-of-control provisions that create hidden liabilities.
- The review omits the standstill or forbearance deadline, leaving the restructuring timeline unanchored.
- The review treats lender consent as generic and fails to compare the actual holder position against the required-lender threshold.
- The review ignores how a joint-venture or equity put right can be triggered indirectly through a change-of-control definition embedded in the facility documents or related agreements.
- The review states conclusions without tying each issue to the governing clause, the related provision, and the practical consequence for the transaction.

## 3. Legal frameworks / domain conventions that apply

- Apply standard credit agreement interpretation conventions: defined terms control, cross-references matter, amendment and waiver mechanics are distinct from ordinary consent rights, and guaranty or collateral obligations should be read by entity tier and jurisdictional scope.
- Apply distressed financing norms: pre-consent, priming, incremental, or rescue financing restrictions may require a specific lender block, a required-lender consent, or a separate agent approval path.
- Apply structural subordination analysis for non-guarantor or unrestricted subsidiaries and any entity outside the collateral package.
- Apply assignment and transfer mechanics to determine whether a lender’s current position affects its consent or blocking power.
- Apply change-of-control and equity-put analysis where a related agreement incorporates the facility definition by reference.
- If a legal conclusion depends on a named statute, regulation, rule, or case cited in the source documents, cite that authority expressly in the memo; do not state propositions as conclusions without the supporting authority.
- When the source set defines a standstill, forbearance, or covenant cure period in days from an execution or notice date, compute the expiration date from the document dates and treat it as a hard restructuring milestone.

## 4. Analytical scaffolds

- Build the memo issue-by-issue using a fixed sequence: Provision → Problem → Impact → Recommendation.
- For each issue, state the severity using a consistent ordinal scale defined once at the top of the memo, such as Critical / High / Medium / Low.
- For each issue, include three closing moves:
  - scale the issue against a document figure, threshold, term, or other source-based metric;
  - cross-reference the interacting clause, schedule, notice, or related agreement;
  - state the downstream consequence for the client, including economic, operational, litigation, or transaction impact.
- For each consent or blocking analysis, identify the relevant holder, compare its position to the required-lender or other control threshold, and state whether it can act unilaterally.
- For each financing permissibility analysis, test the text of the relevant consent, prohibited-debt, lien, debt incurrence, or superpriority language against the intended rescue structure.
- For each standstill or forbearance analysis, calculate the deadline from the operative date and state the resulting urgency in the restructuring process.
- For each change-of-control or put-right analysis, trace the definition chain across all incorporating documents and identify whether the restructuring event triggers the collateral consequence even absent a formal closing.
- Use only the source documents’ facts for quantitative comparisons; do not invent amounts, percentages, or reconciliation math not already supported by the record.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Distinguish among parent, borrower, guarantor, pledged subsidiary, non-guarantor subsidiary, unrestricted subsidiary, and joint-venture entity where the documents do so.
- Track whether a restriction applies only to domestic subsidiaries, only to subsidiaries that are obligors, or more broadly to affiliates or designated entities.
- Track the vertical flow of collateral, guarantees, and distributions so the memo captures structural leakage and structural subordination risk.
- Track temporal dependencies in the order they matter: default notice, standstill start, standstill expiration, consent deadline, amendment effectiveness, and any related put or acceleration trigger.
- If one agreement incorporates another by reference, analyze the incorporated definition at the point of use and note any mismatch created by the cross-reference.

## 6. Output structure conventions

- Write a numbered issue memo in conventional legal style.
- Open with a brief severity key and a short timeline section for key dates, including any computed standstill expiration.
- Then present one numbered entry per issue, each with:
  - Severity
  - Provision
  - Problem
  - Impact
  - Recommendation
- If there is only one lender position or one relevant period in scope, say so affirmatively; otherwise, enumerate all relevant holders, periods, or scenarios before analysis.
- End with an explicit Recommended Actions section that uses imperative verbs, names the responsible role or function drawn from the documents where possible, and ties each action to a deadline or transaction milestone.
- Keep the memo self-contained, document-based, and free of unsupported generalities.
