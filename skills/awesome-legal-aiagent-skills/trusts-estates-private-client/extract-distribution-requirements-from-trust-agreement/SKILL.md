---
name: extract-distribution-requirements-from-trust-agreement
task_id: trusts-estates-private-client/extract-distribution-requirements-from-trust-agreement
description: Closes the gap where agents summarize distribution provisions at a general level without computing adjusted figures, applying section-by-section prohibition conditions to each pending request, flagging ambiguous expense definitions, and identifying trust protector conflicts that affect the approval process.
activates_for: [planner, solver, checker]
---

# Skill: Extract Distribution Requirements from Trust Agreement

## 1. Subject-matter triage

- Identify the governing trust instrument, every amendment, each pending distribution request, the current asset summary, and any attorney correspondence bearing on administration.
- Determine whether the trust uses separate shares, sub-trusts, or branch-based accounting; if so, analyze each affected share separately.
- Treat the successor trustee's task as both interpretive and operational: identify what must be paid, what may be paid, what is barred, and what additional approvals or information are required before action.

## 2. Failure modes the skill is correcting

- Describing distribution standards in general terms without computing the figures that actually apply to each request.
- Failing to apply prohibitions, conditions precedent, and approval gates before analyzing a discretionary request.
- Treating all requests as if they were governed by one uniform standard when the trust uses multiple distribution regimes.
- Missing ambiguity in expense definitions, especially where the trust language controls over later statutory changes or common assumptions.
- Overlooking trust protector involvement, succession mechanics, or conflicts that can affect approval authority.
- Collapsing amendment history into the original trust text instead of applying the most current operative language.
- Giving a conclusion without tying it to the operative trust provision, controlling amendment, and the factual trigger in the record.
- Omitting the downstream administration consequence for the successor trustee, such as required notice, additional documentation, or withholding action pending clearance.

## 3. Legal frameworks / domain conventions that apply

- Trust amendments control over earlier provisions to the extent they modify them; always read the trust as restated by the full amendment chain.
- Mandatory distributions, if any, must be analyzed under the trust’s own accounting and valuation rules, using the current asset summary and the trust’s stated measuring date.
- Discretionary distributions are governed by the trust instrument’s express standard, cap, and gating conditions, not by a generic private-client template.
- Age-triggered or cap-linked distributions often require application of an internal adjustment formula; use the trust’s defined index, base date, and current comparison date where the document provides them.
- HEMS-style provisions must be read as written, including any defined scope of health, education, maintenance, and support, and any internal caps or enhancements.
- Education-related provisions turn on the trust’s own definition of qualifying expenses; if the trust narrows, expands, or freezes that definition, follow the trust text.
- Approval authority may sit with a trust protector or similar fiduciary-adjacent role; if that role has succession mechanics, removal powers, or approval rights, those terms must be mapped before recommendations are made.
- Conflict analysis should identify whether a proposed decision-maker has a beneficiary interest, family relationship, or other stake that could impair approval integrity under the trust’s own structure.
- Spendthrift or anti-assignment language may change the permissibility of an outright payment and may require pre-distribution verification of status-based bars.
- Where the trust cites an external benchmark, statute, or index, cite that authority by name and section if available in the source materials; otherwise state the document-defined reference used for the computation.

## 4. Analytical scaffolds

1. Build the operative text stack: original trust, each amendment, and any attorney guidance that clarifies administration.
2. Map the trust structure: identify each share, sub-trust, beneficiary class, and any provision that causes different treatment by branch, age, status, or request type.
3. For each distribution clause, extract:
   - governing section;
   - operative standard or mandatory amount;
   - any cap, ceiling, or formula;
   - any indexation or adjustment method;
   - any prohibition condition, approval gate, or required finding.
4. For any formula-based amount, compute the operative figure from the document inputs without mixing in unstated assumptions.
5. For each pending request, run the request through the governing clause(s) only:
   - identify requestor and purpose;
   - match the request to the correct distribution regime;
   - test every condition precedent and disqualifying condition;
   - determine whether further approval, documentation, or factual confirmation is needed;
   - state a clear administration recommendation.
6. If the request depends on an expense category, test the requested item against the trust’s defined categories and note any boundary issue where the language is uncertain.
7. If trust protector approval, appointment, or succession is implicated, identify the current authority path, the next decision-maker, and any structural conflict that must be resolved before action.
8. Separate interpretation from recommendation: first state what the trust requires, then what the successor trustee should do next.

## 5. Vertical / structural / temporal relationships

- Apply the most recent amendment first for any provision it expressly changes, then reconcile the resulting text with the rest of the trust.
- When multiple provisions can apply to a single request, identify the hierarchy or interaction rather than forcing one provision to swallow the others.
- Evaluate the trust at the time of the requested distribution, using the latest asset information and any time-sensitive facts in the request packet.
- If a distribution depends on status at a future date or event, distinguish present eligibility from future eligibility.
- If the trust creates separate treatment for different beneficiary lines, do not borrow a figure or standard from one line to another without textual support.

## 6. Output structure conventions

- Produce a single distribution requirements memorandum addressed to the successor trustee.
- Use a conventional memorandum shape with: brief assignment summary, trust structure and operative documents, distribution framework by provision, request-by-request analysis, ambiguities and open issues, trust protector / approval-path issues, and recommended next actions.
- For each governing provision, state the operative rule, the controlling amendment if any, the factual trigger, and the practical effect on administration.
- For each pending request, include the requestor, purpose, governing provision(s), applicable limit or standard, condition checks, disposition, and any follow-up needed before payment or denial.
- If a computation is required, show the inputs and the resulting figure in a compact, readable form; do not invent missing data.
- If a provision is unclear, flag the ambiguity and explain why it matters for administration.
- End with a concise Recommended Actions section that tells the successor trustee what to do next, who should do it, and when it should be done in relation to the administration timeline.
