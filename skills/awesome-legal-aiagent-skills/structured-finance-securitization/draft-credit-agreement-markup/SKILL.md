---
name: draft-credit-agreement-markup-lbo
task_id: structured-finance-securitization/draft-credit-agreement-markup
description: Preparing a borrower-side markup of a financing agreement by comparing each provision against the operative deal documents to identify tightening of economic terms, flexibility baskets, and protective covenants.
activates_for: [planner, solver, checker]
---

# Skill: Portfolio Company Credit Agreement Markup — Borrower's Counsel Draft Markup for LBO Financing

## 1. Subject-matter triage
- Confirm the task is a borrower-side markup of a draft credit agreement against the executed term sheet and commitment letter.
- Treat the operative deal documents as the commercial source of truth; the draft agreement must be checked for faithful implementation, not re-traded from scratch.
- Identify whether the assignment is limited to markup comments, or also requires a companion memo; if both are requested, produce the file named in the instructions and ensure the primary marked-up work product exists first.
- Extract all deal economics and negotiated flex points from the source documents before opening the draft: facility size, borrowing base or EBITDA reference points, leverage thresholds, basket formulas, cure mechanics, addback limits, sunset periods, and any borrower-friendly exceptions.
- If multiple facilities, tranches, test periods, baskets, or covenant sets are in scope, enumerate them explicitly before analyzing each one.

## 2. Failure modes the skill is correcting
- Marking up the draft from memory or assumptions instead of the executed deal documents.
- Missing a divergence because the agreement uses different defined terms, schedules, or cross-references to restate the same concept.
- Treating a numerical difference as immaterial without checking whether it affects leverage headroom, basket capacity, or covenant flexibility.
- Failing to distinguish a true drafting mismatch from a permitted refinement that still preserves the negotiated business deal.
- Overlooking borrower-protective language that was agreed in the term sheet but not carried into the draft.
- Producing only narrative commentary when the task requires redline-ready text that can be lifted into the document.
- Using visual-only markup that disappears in export rather than text-marking every change.
- Stopping at issue spotting without stating the legal/documentary basis, the practical consequence, and the proposed fix.

## 3. Legal frameworks / domain conventions that apply
- The commitment letter and executed term sheet control the negotiated commercial package for borrower-side markup purposes; the draft credit agreement should conform to those documents absent a clearly identified fallback.
- Incremental facility tests, fixed-amount baskets, and similar debt capacity provisions are often tied to pro forma leverage or EBITDA-based formulas; any tightening reduces future financing flexibility and should be flagged.
- Equity cure mechanics and look-back limits govern sponsor support rights; narrowing cure frequency or changing cure application mechanics can impair the borrower’s ability to manage covenant compliance.
- Adjusted EBITDA definitions drive leverage and capacity calculations; changes to addbacks, caps, timing, or sunset periods can materially alter covenant headroom.
- Borrower-favorable drafting should preserve operational flexibility, avoid unnecessary lender consent rights, and ensure negotiated economic and covenant terms are implemented exactly as agreed.
- Where the source documents specify a formula, threshold, cap, or exception, the draft should mirror it unless the change is expressly contemplated and documented.
- For any legal proposition relied on in the markup memo, cite the governing document or controlling legal authority by name and section where applicable; do not rely on unexplained conclusions.

## 4. Analytical scaffolds
1. Read the executed term sheet and commitment letter first, and build a deal map of every borrower-relevant term that can be tested against the draft agreement.
2. Separate provisions into: economic terms, covenant mechanics, basket capacity, definitions, conditions precedent, default triggers, and general borrower protections.
3. For each provision, compare the draft text to the source documents line by line and determine whether there is a mismatch, omission, narrowing, or expansion.
4. For every mismatch, assess:
   - the size or scope of the issue using the transaction metric implicated by the source documents;
   - the cross-reference or related clause that changes the practical effect;
   - the downstream consequence for the borrower if the draft language stands.
5. When several items are present in the same topic area, analyze each item separately rather than collapsing them into a single “overall” comment.
6. Distinguish between:
   - pure conformity points, where the draft should be restored to the negotiated text; and
   - negotiated open points, where the borrower-side position should be improved if the drafting permits.
7. For each identified issue, propose a precise borrower-friendly revision that can be dropped into the document and understood from the text alone.
8. Prioritize issues by practical effect on financing capacity, covenant headroom, and sponsor flexibility.

## 5. Vertical / structural / temporal relationships
- Track how defined terms flow into operative covenants; a change in a definition may be more significant than a change in the covenant sentence itself.
- Check whether a later schedule, annex, or exhibit overrides the main body text on baskets, collateral, permitted liens, or prepayment mechanics.
- Compare opening-date terms to post-closing or as-tested mechanics; some provisions should remain static while others depend on quarterly or compliance-period calculations.
- Watch for interactions among leverage tests, incurrence tests, and basket carryforwards; tightening one clause can reduce capacity across several others.
- Identify any rolling windows, look-back periods, sunset dates, or reset mechanics that can compound over time and reduce flexibility.
- Confirm that any borrower election, notice period, or optional prepayment feature is not inadvertently conditioned more tightly in one place than another.
- If the same concept appears in multiple sections, verify that all references are harmonized so the draft does not contain internal inconsistency.

## 6. Output structure conventions
- Produce a borrower-side markup memo in a conventional issue-by-issue format that can be converted into redlines or marked-up comments.
- Define a single ordinal severity scale at the top and apply it consistently to every issue entry.
- For each issue entry, include:
  - the affected provision or defined term;
  - the draft position;
  - the term sheet / commitment letter position;
  - whether there is a deviation or open point;
  - the borrower-side proposed language or redline instruction;
  - the severity rating;
  - the practical consequence if uncorrected.
- Mark every substantive textual change in a way that survives format conversion, using explicit deletion/addition/substitution text rather than relying only on styling.
- Include a short rationale with each proposed change so the reader can see why the edit is needed from the plain text alone.
- Where an issue turns on a controlling document or authority, cite it explicitly in the entry.
- End with a concise Recommended Actions section that assigns the next step to the relevant role and ties it to the transaction timeline or document turnaround.
- Ensure the primary deliverable file is complete, non-empty, and contains operative markup language or clauses, not just a description of what should be changed.
