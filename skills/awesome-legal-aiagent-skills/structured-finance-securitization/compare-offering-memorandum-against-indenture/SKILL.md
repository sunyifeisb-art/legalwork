---
name: compare-offering-memorandum-against-indenture
task_id: structured-finance-securitization/compare-offering-memorandum-against-indenture
description: Comparing an offering memorandum against the governing transaction document to identify discrepancies where investor-facing descriptions of structural terms diverge from the operative legal document, including internal offering memorandum inconsistencies and omissions that may be material to investors even when not framed as a discrepancy.
activates_for: [planner, solver, checker]
---

# Skill: Compare Offering Memorandum Against Indenture — Discrepancy Report for Auto Loan ABS

## 1. Subject-matter triage

- Treat the indenture as the operative document and the offering memorandum as investor-facing disclosure.
- Flag both direct conflicts and material omissions from the offering memorandum when the indenture discloses a structural term investors would reasonably expect to see.
- If the task includes only one deal and one set of source documents, analyze that single transaction end-to-end rather than sampling.
- If counsel or the deal team has already flagged concerns, preserve those items in the report and test them against the source documents rather than accepting the labels at face value.

## 2. Failure modes the skill is correcting

- Reviewing only explicit contradictions and missing internal offering memorandum inconsistencies.
- Missing investor-material omissions because the issue is framed as silence rather than conflict.
- Treating defined-term differences as cosmetic when they alter payment timing, trigger mechanics, or credit enhancement.
- Missing waterfall sequencing issues, especially reserve replenishment placement, because they are buried in later steps.
- Failing to connect a disclosure mismatch to its practical effect on pricing, modeling, or trigger expectations.
- Omitting the source of each issue’s severity and leaving the reader unable to distinguish critical structural conflicts from lesser drafting drift.
- Ending an issue at description without identifying the controlling document, the interacting provision, and the investor consequence.

## 3. Legal frameworks / domain conventions that apply

- In securitization, the governing transaction document controls the operative economics; investor disclosure should track it, but a mismatch can still be misleading even if the contract is enforceable as written.
- Payment waterfall priority is central to ABS analysis; changes in sequencing can alter where credit support is consumed and when principal is protected.
- Definition mismatches matter when they affect delinquency, default, cumulative loss, business day, or servicing-fee mechanics.
- The practical significance of a discrepancy often turns on common securitization conventions: accrual periods, payment dates, trigger testing, reserve account replenishment, and fee bases.
- For transfer restrictions, the relevant securities-law legend regime should be checked against the document set and the security type described.
- If the offering memorandum is for a registered or otherwise public ABS deal, completeness of transaction and asset-level disclosure is itself a material disclosure issue.
- When a legal proposition is stated, tie it to the governing document provision or recognized securities-law convention rather than asserting it abstractly.

## 4. Analytical scaffolds

1. Compare the offering memorandum waterfall against the indenture waterfall step by step, including reserve account replenishment, fees, interest, principal, and any subordinated payments.
2. Compare defined terms that drive cash flow or trigger testing, including delinquency, default, cumulative loss, business day, and related timing terms.
3. Compare economic terms by class, including coupon, expected maturity, and legal final maturity.
4. Compare servicing fee base, rate, and calculation method.
5. Compare trigger mechanics and thresholds, including any shift to accelerated amortization or principal diversion.
6. Compare pool statistics, collateral representations, and disclosed concentration metrics that investors use in pricing and surveillance.
7. Compare transfer legend and securities-law disclosure language against the applicable regime described in the documents.
8. Review the offering memorandum internally for inconsistencies across summary, risk factors, pool disclosure, and waterfall discussion.
9. For each issue, state: the conflicting text or omission, the controlling provision, the interacting clause or schedule, the investor consequence, and the recommended correction.
10. Tie the severity to structural effect: waterfall, trigger, or timing errors are more serious than cosmetic drafting drift.

## 5. Vertical / structural / temporal relationships

- Waterfall sequencing and trigger mechanics should be analyzed together because a misdescribed trigger can change when the waterfall materially shifts.
- Business day definitions interact with payment date mechanics and accrual calculations; a timing definition error can cascade into interest and distribution mismatches.
- Servicing-fee base differences become more consequential over time as collateral and notes amortize at different rates.
- A disclosure omission can compound with a trigger mismatch if the omitted feature affects when principal or enhancement is redirected.

## 6. Output structure conventions

- Produce a numbered discrepancy list with one entry per distinct issue.
- Use a uniform ordinal severity label for every entry, defined once at the top of the report, such as Critical, High, Medium, or Low.
- Each entry should include:
  - a short issue title;
  - the offering memorandum statement or omission;
  - the indenture provision or other controlling source;
  - the interacting document location, if any;
  - the practical investor impact;
  - the severity label;
  - the recommended correction.
- For every issue, close the analysis by stating the scale or threshold implicated, identifying the related clause or source document that affects it, and explaining the downstream consequence for investors or the transaction.
- Distinguish direct conflict, omission, and internal inconsistency so the reader can see why the item was flagged.
- Note whether the issue was independently identified or previously flagged by deal counsel or the internal deal team, if that information is provided in the source materials.
- End with a concise Recommended Actions section that assigns each follow-up to the relevant role and ties it to the transaction timeline or another practical milestone.
