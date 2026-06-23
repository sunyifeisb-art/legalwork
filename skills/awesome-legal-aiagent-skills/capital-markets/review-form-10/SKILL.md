---
name: review-form-10-q-compliance
task_id: capital-markets/review-form-10
description: Form 10-Q compliance review where the baseline catches missing narrative sections but misses required financial statement components, disclosure deficiencies in transaction-specific notes, and the controls effectiveness conclusion requirement.
activates_for: [planner, solver, checker]
---

# Skill: Review Draft Form 10-Q for SEC Filing Deficiencies

## 1. Subject-matter triage

- Treat the draft Form 10-Q and exhibit index checklist as a filing-compliance review, not a drafting exercise.
- Separate core filing defects from housekeeping inconsistencies; flag both, but prioritize anything that affects filing acceptance, periodic-report completeness, or investor reliance.
- If the source set contains multiple interim periods, filings, or entity-level presentations, enumerate each and analyze them separately rather than using one representative pass.

## 2. Failure modes the skill is correcting

- Baseline checks that major financial statement headings are present but does not verify that all required statements are included, including the statement of comprehensive income and the comparative cash flow statement for the relevant interim periods.
- Baseline reviews litigation disclosures but does not apply the loss-contingency assessment framework, treating a description of pending litigation without the required probability and range-of-loss analysis as adequate when it is not.
- Baseline reviews transaction disclosures but does not apply acquisition disclosure requirements or the contingent consideration measurement and disclosure requirements.
- Baseline issue lists identify gaps but stop at description; each issue must be tied to a governing authority, a filing consequence, and a concrete fix.
- Baseline reviews officer certifications and controls language for presence only; it must also test whether the conclusion is definite and whether the certification exhibits and cross-references are internally consistent.

## 3. Legal frameworks / domain conventions that apply

- Cover page period accuracy: the fiscal period end date stated on the cover page must match the financial statements; if they differ, treat the mismatch as a filing deficiency under Exchange Act reporting conventions.
- Comprehensive income: a complete interim report must include a statement of comprehensive income either as a separate statement or combined with the income statement; omission is a critical deficiency under interim-report presentation requirements.
- Comparative cash flow statement: the interim report must present cash flows for both the current year-to-date period and the comparative prior-year year-to-date period; omission of the comparative period is a critical deficiency under interim financial statement presentation rules.
- Section 302 certifications: the principal executive and principal financial officers must certify the report under the applicable certification rule; verify that the certification period and exhibit cross-reference are complete and internally consistent under Exchange Act Rules 13a-14 and 15d-14 and Item 601.
- Disclosure controls effectiveness: the report must contain a definite conclusion on the effectiveness of disclosure controls and procedures under Exchange Act Rules 13a-15 and 15d-15; an inconclusive or hedged statement is not responsive.
- Acquisition disclosure: a report filed in the quarter of an acquisition must disclose the acquisition accounting allocation, the goodwill calculation, and, if material, pro forma financial information; if contingent consideration exists, verify fair-value measurement and disclosure of the valuation approach and key assumptions under applicable GAAP purchase-accounting guidance.
- Loss contingency assessment: if the company has pending litigation, determine whether the disclosure includes either an accrual analysis or a reasonably possible loss range, as appropriate; a disclosure that merely describes the litigation without applying this framework is deficient under ASC 450.
- Segment comparative period: if the company has reportable segments, verify that the segment note includes data for the comparative prior-year period under ASC 280.
- Subsequent events consistency: a subsequent event disclosed in a note should be consistent with any other references to the same event elsewhere in the filing; identify and flag contradictions as disclosure integrity issues.
- Exhibit index completeness: confirm that required exhibits, certifications, and incorporated references are listed consistently with the checklist and the filing’s internal cross-references.

## 4. Analytical scaffolds

- Start with a cover-page check: period end date, filer status, shares outstanding, and any registration-status indicators that affect the form’s presentation.
- Then verify financial statement completeness in sequence: balance sheet, income statement, statement of comprehensive income, cash flows, and any required comparative periods.
- Review notes that are transaction-specific or event-driven, then test whether the note addresses measurement, allocation, assumptions, and any required pro forma or fair-value disclosures.
- For each litigation matter, assess whether the note supports accrual, loss range, or a statement that the exposure cannot be reasonably estimated, with the factual basis stated.
- For each reportable segment, verify comparative-period data and consistency with the MD&A and financial statement captions.
- Review certifications, controls language, and exhibit index together so that omissions, wrong-period cross-references, and missing exhibits are caught as a single filing-integrity set.
- Compare repeated references to the same event across notes, MD&A, and cover-page materials; any mismatch should be treated as a deficiency even if each statement is individually plausible.
- For every deficiency, state severity using a single ordinal scale and tie the conclusion to the controlling authority that supports it.
- When a source document gives a quantitative anchor, use it to size the issue; otherwise, describe the filing consequence and the affected section without inventing numbers.
- Close each issue with the practical consequence for the filer, such as restatement risk, delayed filing, investor misstatement, or exhibit/certification defect.

## 5. Vertical / structural / temporal relationships

- Use the filing’s own structure to cross-check consistency vertically: cover page, financial statements, notes, MD&A, certifications, and exhibit index should not contradict one another.
- Use temporal comparison to test interim-report completeness: current quarter, year-to-date, and prior-year comparative periods must align across statements and notes.
- If an acquisition, litigation matter, or post-period event is disclosed in more than one place, check whether the later-reference language narrows, expands, or contradicts the earlier disclosure.
- If a note depends on another schedule or exhibit for completeness, confirm that the relationship is explicit and that the linked material is actually present.
- If multiple entities or reportable business units are presented, keep their disclosures separate unless the filing expressly combines them.

## 6. Output structure conventions

- Produce a compliance memorandum organized by filing component rather than as a free-form narrative.
- Begin with a short executive summary that states overall filing risk and the principal categories of deficiencies.
- Include a concise severity legend at the top using an ordinal scale such as Critical / High / Medium / Low, and apply it uniformly to every issue.
- For each issue, provide:
  - location in the draft filing;
  - deficiency description;
  - controlling authority or accounting basis by name and section or standard;
  - severity;
  - why the issue matters in context of the filing;
  - recommended corrective action.
- Group issues by component: cover page, financial statements, notes, management’s discussion and analysis, certifications, controls disclosure, and exhibits.
- Where several defects arise from the same section, use separate entries so each authority and fix is clear.
- End with an explicit Recommended Actions block that assigns the action, the responsible role, and the timing anchor tied to the filing deadline or amendment process.
- Include a closing checklist that confirms whether the draft is ready for filing, needs targeted revision, or requires a broader rework.
