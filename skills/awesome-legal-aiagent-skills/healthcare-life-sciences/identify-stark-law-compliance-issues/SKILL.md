---
name: hls-identify-stark-compliance-issues
task_id: healthcare-life-sciences/identify-stark-law-compliance-issues
description: Reviews physician compensation arrangements, lease agreements, compliance hotline logs, and fair-market-value opinions to produce an issue-identification memorandum addressing Stark Law compliance risk, exposure at risk by arrangement, voluntary-disclosure considerations, and the relationship between unresolved compliance complaints and broader litigation or notice concerns.
activates_for: [planner, solver, checker]
---

# Skill: Stark Law Compliance Program Review — Issue Identification

## 1. Subject-matter triage
- Treat the source set as a Stark Law issue-spotting record review, not a merits brief.
- Separate physician compensation, lease, in-kind benefit, hotline, and valuation materials before analysis.
- If only one arrangement is in scope, say so explicitly; otherwise enumerate each arrangement, complaint stream, and valuation support item before analysis.
- Preserve any compliant arrangements in a separate section so the reader can distinguish true gaps from clean items.

## 2. Failure modes the skill is correcting
- In-kind remuneration or other noncash benefits provided without a written agreement at fair market value are not identified as a financial relationship requiring a Stark exception, even when the arrangement is visible in the source documents.
- Expired or incomplete writings are treated as technicalities instead of gap periods that may create noncompliance exposure under the Stark framework.
- Fair-market-value support is accepted without testing whether the valuation is current enough to support the relevant time period.
- A physician’s participation in reviewing their own compensation is not flagged as an independence problem that can undermine exception support and disclosure credibility.
- Unresolved compliance hotline complaints raising Stark concerns are not connected to possible litigation or notice exposure, leaving the client without a coherent picture of risk.
- The memo stops at describing a defect and does not tie it to scale, document interaction, and client consequence.
- Recommendations are implied but not stated as concrete next steps with an accountable role and timing anchor.

## 3. Legal frameworks / domain conventions that apply
- Stark Law: physician self-referral prohibition under 42 U.S.C. § 1395nn and implementing regulations at 42 C.F.R. Part 411, Subpart J.
- Exception analysis: identify the specific exception potentially applicable to each arrangement and test each element on the face of the documents.
- Writing and term requirements: most physician compensation and lease exceptions depend on a written, signed arrangement with a defined term; if the writing lapses, analyze any holdover or analogous protection under the cited exception before treating the gap as compliant.
- Fair market value and commercial reasonableness: analyze whether compensation or in-kind value is supported by current valuation evidence and whether the arrangement would be commercially reasonable absent referrals, using the exception-specific regulatory standard.
- In-kind remuneration: noncash benefits can be remuneration if they confer value on a referring physician or related practice; treat them as Stark relationships if they are tied to referral activity or ongoing business terms.
- Referral-linked revenue at risk: when an arrangement fails an exception, estimate the Medicare revenue attributable to referrals during the noncompliant period, using the figures available in the source documents.
- Complaint handling and notice risk: unresolved hotline or compliance complaints may create separate notice, investigation, or litigation concerns even apart from the underlying Stark defect.
- Voluntary disclosure: assess whether the pattern of issues, duration, and exposure make voluntary self-disclosure under the applicable federal pathway a plausible strategic option.

## 4. Analytical scaffolds
1. Build an issue inventory first.
   - List each physician arrangement, lease, benefit, complaint log, and valuation opinion.
   - Note the governing document, period covered, and any linked materials that must be read together.

2. For each arrangement, run the same sequence.
   - Identify the most plausible Stark exception.
   - Test the written agreement, signature, term, compensation/FMV, commercial reasonableness, and any parties or services limits required by that exception.
   - Identify the exact defect, if any, and the document that creates or cures it.
   - Quantify the exposure using a source-based figure or threshold, then note the related document interaction and the downstream consequence.

3. For expired or missing writings.
   - State the end date, gap period, and whether any holdover or similar concept appears to preserve compliance.
   - If no saving doctrine appears, treat the gap as noncompliant for exposure analysis.

4. For in-kind benefits and noncash support.
   - Treat the benefit as remuneration if it has economic value and is connected to a referring physician relationship.
   - Test whether it is reduced to writing, valued at FMV, and otherwise fits an available exception.

5. For valuation materials.
   - Identify whether the opinion is recent enough for the period under review.
   - If the support is dated or stale, note why that weakens both exception support and any disclosure strategy.

6. For committee or internal review conflicts.
   - Identify whether the physician whose arrangement is under review participates in the approval process.
   - Explain how that affects independence, FMV support, and defensibility.

7. For compliance hotline or complaint logs.
   - Identify each Stark-related complaint, the date received, who handled it, and whether it was independently investigated.
   - Flag any closure without meaningful review, escalation, or legal input as separate notice or litigation risk.

8. For voluntary disclosure candidacy.
   - Assess the aggregate exposure, the duration of the issue, the number of affected arrangements, and whether facts are sufficiently developed.
   - State whether disclosure looks plausible, premature, or disfavored, and why.

9. For each issue entry, close the loop.
   - Quantify or scale the problem using a document-based figure, period, or threshold.
   - Cross-reference the other clause, schedule, log, or opinion that affects the analysis.
   - State the practical consequence for the client: repayment, exposure, operational disruption, regulatory risk, or litigation/notice risk.

## 5. Vertical / structural / temporal relationships
- Organize the memorandum by arrangement or complaint stream, not by abstract doctrine.
- Within each arrangement, address the vertical chain: governing agreement, amendment or renewal history, valuation support, approval process, and any related complaint record.
- Track time carefully: execution date, effective date, expiration date, renewal date, complaint date, investigation date, and any gap period.
- If multiple arrangements or complaints exist, keep them separate until the final aggregation step; do not merge distinct periods or parties into a single representative analysis.
- Distinguish current-period risk from historical risk if the documents cover more than one term or renewal cycle.

## 6. Output structure conventions
- Write a memorandum in conventional legal-issues format with a short executive summary, a body organized by arrangement or complaint, and a closing recommendations section.
- Include a severity field for every issue using a uniform ordinal scale defined once near the top, such as Critical / High / Medium / Low.
- For each issue, use a consistent move sequence: description of the arrangement → exception analysis with controlling authority → defect/gap → scale of exposure → related document cross-reference → client consequence → recommendation.
- Cite controlling authority for every legal proposition by name and section or subsection, including 42 U.S.C. § 1395nn, 42 C.F.R. Part 411, Subpart J, and any exception-specific regulatory provision relied on.
- Identify compliant arrangements separately so they are not lost in the issue list.
- End with a distinct Recommended Actions section that assigns each action to a role reflected in the source set and gives a timing anchor tied to the review cycle, renewal date, response deadline, or disclosure decision point.
- If the source set does not supply a deadline, use a relative urgency tied to the next compliance, renewal, or disclosure milestone rather than a vague instruction.
- Keep the output issue-oriented and source-grounded; do not invent figures, parties, or remedies not supported by the documents.
