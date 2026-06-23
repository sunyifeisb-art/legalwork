---
name: draft-limited-partnership-agreement
task_id: funds-asset-management/draft-limited-partnership-agreement
description: Draft a limited partnership agreement for a growth equity fund using the principal transaction documents as source material, and prepare a companion issues memo flagging cross-document conflicts and drafting decisions.
activates_for: [planner, solver, checker]
---

# Skill: Draft Limited Partnership Agreement

## 1. Subject-matter triage

- Treat the term sheet and formation memo as the primary economics and facts source.
- Use the prior fund LPA as the drafting baseline, not the economic source of truth.
- Use the side letter to identify LP-specific deviations that may need carve-outs or disclosure.
- Use the commitment schedule to confirm the target raise, hard cap, and investor allocations.
- If any source document is missing, inconsistent, or internally incomplete, flag the gap before drafting and carry it into the issues memo.
- Draft the LPA first, then the companion issues memo after the draft exists and is complete.

## 2. Failure modes the skill is correcting

- Drafting to the precedent without reconciling the actual deal economics.
- Leaving waterfall mechanics ambiguous, especially where the source materials differ on return-of-capital, preferred return, catch-up, or residual split.
- Carrying forward an incorrect catch-up formulation that does not produce the intended economics.
- Omitting or under-specifying clawback mechanics where the waterfall structure needs them.
- Ignoring how recycling, reserves, and fee base calculations interact.
- Missing MFN side-letter leakage that can spread LP-specific economics beyond the intended investor.
- Drafting key person mechanics without aligning them to the current management reality.
- Failing to address subscription facility duration if the source materials or market context make it material.
- Leaving in-kind distribution valuation open-ended.
- Not checking the commitment schedule against the fund’s stated sizing.
- Producing an issues memo that lists observations without resolving the cross-document conflict or recommending a drafting choice.
- Writing the memo before the operative draft exists.

## 3. Legal frameworks / domain conventions that apply

- Use standard private-fund LPA architecture: defined terms, formation, capital commitments, contributions, investment period, expenses, management fee, distributions, waterfall, carry, clawback, recycling, governance, transfers, removal, dissolution, reporting, and miscellaneous provisions.
- Where the source set is silent, follow market-standard growth equity fund conventions and conform them to the precedent structure.
- Resolve all conflicts between the term sheet, prior LPA, formation memo, side letter, and commitment schedule before finalizing drafting choices.
- Waterfall style must be selected coherently and carried through the distributions, carry, and clawback provisions.
- If a deal-by-deal waterfall is used, a clawback and related security package should be drafted to match that choice.
- If a whole-fund waterfall is used, ensure the draft reflects that LPs receive the fund-level return protections before carry is paid.
- Any catch-up language must be checked against the intended carry split and drafted so the arithmetic matches the business deal.
- If recycling is permitted, the draft must say what may be recycled, for how long, and whether reserved follow-on capital counts toward any cap.
- If an MFN exists alongside a side-letter fee concession, the draft must decide whether that concession is excluded from MFN elections or allowed to cascade.
- Key person language should track the actual operating team and any transition risk reflected in the source materials.
- In-kind distributions must use an objective valuation method tied to asset type and approval mechanics.
- Commitment schedules should be consistent with the fund size stated in the governing documents.

## 4. Analytical scaffolds

1. Read the term sheet and formation memo first; identify the intended economics, governance, and sizing.
2. Read the prior LPA next; use it as a structural template only after extracting the current deal points.
3. Read the side letter for LP-specific deviations, MFN sensitivity, and confidentiality or reporting carve-outs.
4. Read the commitment schedule last to verify aggregate commitments and investor-level consistency.
5. For each economic term in the source set, draft a matching LPA clause and compare it against all other source documents.
6. For any conflict, pick one drafting position, explain the alternative, and state the business or legal consequence of each path in the issues memo.
7. If the waterfall is not unified across sources, settle that point before drafting downstream carry, clawback, and distribution language.
8. Test catch-up language against a simple distribution path to confirm the intended post-catch-up split is achieved.
9. If clawback is net-of-tax, assess whether that is enough to restore the economics over multiple distribution periods and whether escrow or another backstop should supplement it.
10. If recycling exists, test the interaction between recycled proceeds, follow-on reserve language, and fee-base calculations.
11. Check whether any side-letter fee reduction could interact with MFN elections or fee ratchets.
12. Confirm any key person trigger reflects the current team and avoids stale names or obsolete governance mechanics.
13. Validate any in-kind distribution standard by asset class and approval process.
14. Compare the commitment schedule totals against the stated fund size and any hard cap, and flag variances.
15. Draft the issues memo as an implementation memo: what changed, why it changed, what remains open, and who must decide.

## 5. Vertical / structural / temporal relationships

- The source hierarchy is functional, not formal: economics documents first, precedent second, LP-specific documents third, factual schedules last.
- Side letters can modify the LPA for a single investor, but should not be allowed to create unintended spillover through MFN or fee provisions.
- Formation timing matters for key person, subscription facility, and closing mechanics because those provisions often depend on the current team and launch process.
- The LPA should be internally self-contained even if the source materials spread terms across several documents.
- Any unresolved inconsistency between documents should be surfaced in the issues memo rather than silently harmonized.

## 6. Output structure conventions

- Produce two files: the LPA draft and a companion drafting issues memo.
- Draft the LPA in standard fund-agreement form with integrated schedules or exhibits where needed.
- The LPA should read as operative contract text, not as commentary or a checklist.
- The issues memo should be organized by issue, with each entry identifying:
  - the issue or conflict,
  - the source documents implicated,
  - the chosen drafting resolution or open question,
  - the legal or economic consequence,
  - the decision needed, if any,
  - and a recommended next step.
- Use an explicit severity label for each issues-memo entry, using a consistent ordinal scale set once at the top of the memo.
- Include a short recommended-actions section at the end of the memo with imperative action items, the responsible party, and a timing anchor tied to the drafting or signing process.
- Do not rely on the memo as a substitute for operative drafting; the LPA must stand on its own.
- Before finishing, confirm that the primary LPA file exists, is non-empty, and contains operative provisions rather than a summary, and then confirm the memo file likewise exists and is complete.
