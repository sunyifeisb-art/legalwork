---
name: identify-tax-issues-in-counterpartys-summary-judgment-brief
task_id: tax/identify-tax-issues-in-counterpartys-summary-judgment-brief
description: Analyzing a government summary judgment brief requires verifying the internal consistency of any stated deficiency computation, assessing whether the brief addresses the relevant economic substance analysis under both prongs of the applicable doctrine, and identifying whether any factual contradictions within the brief have implications on more than one issue.
activates_for: [planner, solver, checker]
---

# Skill: Identify Tax Issues in IRS Summary Judgment Brief

## 1. Subject-matter triage
- Treat the government’s brief as an issue-spotting and vulnerability-assessment task, not a merits brief.
- Confirm the filing identity first: caption, docket, court, judge, and party alignment must match the source set before analyzing substance.
- Read the motion, response, reply, exhibits, declarations, and cited authorities as one record; inconsistencies often arise only when materials are compared across filings.
- If the source set contains more than one deficiency period, transaction step, taxpayer entity, or asserted defense, enumerate each before analysis and keep the analysis separate.

## 2. Failure modes the skill is correcting
- Accepting the stated deficiency or adjustment amount without checking whether the disclosed components support it.
- Missing undisclosed assumptions embedded in a calculation, especially where the brief gives enough data to back-solve the implied rate, base, or spread.
- Treating an internal inconsistency as one-sided when it may both weaken the government on one issue and strengthen it on another.
- Assuming the economic substance doctrine is satisfied by discussion of only one prong.
- Overlooking a limitations defense or other threshold defense that the government does not address.
- Failing to tie each identified issue to the source-set facts, the interacting document, and the downstream litigation consequence.
- Stating a legal conclusion without naming the controlling authority supporting it.
- Writing a memo that diagnoses problems but omits concrete next steps.

## 3. Legal frameworks / domain conventions that apply
- **Deficiency and computation review:** Verify arithmetic, implied tax rate, basis, timing, and any stated adjustments against the record. If the math depends on a missing input, identify the hidden assumption rather than filling it in.
- **Economic substance doctrine:** Analyze both the objective economic effect and the subjective non-tax purpose inquiry. A one-prong discussion is incomplete if the doctrine invoked is conjunctive or otherwise requires both elements under controlling authority.
- **Internal contradiction analysis:** A factual statement that conflicts with another statement may affect credibility, burden framing, or a substantive element. Assess the favorable and unfavorable implications separately.
- **Limitations defense:** If limitations is raised, assess whether the government addresses timeliness, tolling, suspension, or exception arguments; silence can matter when the record is otherwise adequate.
- **Summary judgment standard:** Ground any vulnerability assessment in the governing Rule 56 standard and the tax doctrine at issue, including whether disputed material facts preclude judgment as a matter of law.
- **Authority citation discipline:** State the rule, statute, regulation, or leading case supporting each legal proposition relied upon; do not state doctrine in conclusory shorthand.

## 4. Analytical scaffolds
- **Caption and filing check**
  - Verify case name, docket, court, date, and judge.
  - Confirm the brief is the government filing intended for review and that supporting/opposing materials belong to the same matter.

- **Calculation verification**
  - Isolate every stated numerical component relevant to the asserted deficiency or adjustment.
  - Reconcile the stated result against the disclosed inputs.
  - If the result only works by assuming an unstated rate, base, or offset, flag the assumption and its litigation significance.

- **Doctrine completeness**
  - Identify the exact tax doctrine invoked.
  - Map the brief’s analysis to each required element or prong.
  - Note any missing element and whether the omission is strategic, inadvertent, or cured elsewhere in the record.

- **Contradiction mapping**
  - List each internal inconsistency or tension in the government’s presentation.
  - For each, analyze:
    - how it undermines the government’s preferred theory;
    - how it may nevertheless support another government argument or hurt the taxpayer elsewhere.
  - Keep the two effects in separate paragraphs.

- **Defense-by-defense review**
  - Identify each defense the taxpayer raised.
  - State whether the government answers it, partially answers it, or ignores it.
  - For an ignored defense, evaluate whether the present record supports partial summary judgment or another targeted response.

- **Authority check**
  - For each major proposition, identify the authority the brief cites.
  - Test whether the authority truly supports the proposition, is distinguishable, or is being stretched.
  - Flag any proposition left unsupported by authority.

- **Balanced assessment**
  - Separate the government’s strongest points from its weakest points.
  - Do not collapse litigation strengths into legal correctness; explain why a point is strong even if incomplete.

- **Issue-close format**
  - For each issue, include:
    - a scale or magnitude drawn from the record;
    - the related document, clause, or argument that interacts with it;
    - the downstream consequence for the client’s litigation posture.

## 5. Vertical / structural / temporal relationships
- Track how statements in the opening brief, factual appendix, declarations, and exhibits build on or contradict one another.
- Distinguish pre-transaction facts, transaction-step facts, filing-date facts, and post-filing litigation posture; timing can change the relevance of the same statement.
- If the same fact affects multiple issues, cross-reference it rather than repeating it as if it were issue-specific.
- When the record spans multiple periods or multiple taxpayer positions, analyze each period or position separately before drawing any synthesis.

## 6. Output structure conventions
- Produce an issue-by-issue memorandum suitable for a Word document.
- Use clear headings for: filing verification, deficiency/computation issues, doctrine completeness, contradictions, limitations or other threshold defenses, authority check, strengths, weaknesses, and recommendations.
- Assign a severity level to each issue using a fixed ordinal scale stated once near the top of the memo.
- For each issue, include a compact severity label, the relevant magnitude from the record, the interacting source material, and the litigation consequence.
- For each factual contradiction, present the adverse implication and the countervailing implication in separate paragraphs.
- End with a concise Recommended Actions section that gives imperative next steps, assigns the responsible role, and ties each step to the relevant litigation milestone or deadline if one appears in the record.
- Keep the memo analytic and source-driven; do not substitute general tax commentary for record-specific review.
