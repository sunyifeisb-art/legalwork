---
name: review-annual-report-filing-for-form-compliance
task_id: capital-markets/review-annual-report-filing-for-form-compliance
description: Form 10-K compliance review where the baseline catches missing narrative sections but misses required items and exhibits introduced by later rule changes, and does not apply the correct filing deadline calculation.
activates_for: [planner, solver, checker]
---

# Skill: Review Annual Report (Form 10-K) Filing for Form Compliance

## 2. Failure modes the skill is correcting

- The review spots missing narrative sections but misses filing-date defects, including an incorrect cover-page deadline or failure to account for a weekend or federal-holiday extension.
- The review treats an older annual-report checklist as complete and misses newer item and exhibit requirements, including required cover-page representations tied to current rules.
- The review identifies content gaps inside sections but does not test whether the auditor’s report includes required elements under the applicable auditing standard.
- The review flags isolated omissions without tying them to the related cover-page checkboxes, exhibit list, incorporation-by-reference statements, or other filing components that control the final form.
- The review describes deficiencies without assigning severity, authority, and corrective action in a consistent compliance format.

## 3. Legal frameworks / domain conventions that apply

- Use the current Form 10-K, Regulation S-K, Regulation S-X, Securities Exchange Act filing rules, and applicable stock-exchange listing requirements as the controlling framework, rather than a prior-year template.
- Compute the filing due date from fiscal year-end and apply the relevant weekend or federal-holiday adjustment before evaluating the filed date and cover-page statement.
- Treat each required annual-report item as a distinct compliance checkpoint; if an item is inapplicable, verify that the form contains the appropriate not-applicable treatment rather than silence.
- Confirm required exhibits and cover-page checkboxes under the current filing regime, including any items created or expanded by later rule changes.
- Review officer certifications under the applicable Exchange Act rules and distinguish filed certifications from furnished materials where the rules require that distinction.
- Review the auditor’s report under the applicable auditing standard for required report elements, including critical audit matters when that standard applies.
- Where the filing incorporates later proxy information for Part III matters, confirm that the incorporation-by-reference structure matches the applicable filing timetable and amendment mechanics.
- Where the draft touches acquisition accounting, purchase price allocation, share counts, market-risk disclosure, cybersecurity disclosure, mine-safety disclosure, or legal-proceedings disclosure, test the disclosure against the governing item-level rule and not just against generic narrative completeness.

## 4. Analytical scaffolds

- Start by mapping the filing against the current form structure, then run a separate pass for cover page, body items, exhibits, financial statement schedules, certifications, and auditor reporting.
- Enumerate all potentially affected annual-report items and exhibits in the draft before analysis; then test each item individually instead of relying on a representative sample.
- For each omission or defect, identify the governing authority, explain why the cited rule applies to this registrant or filing, and state the filing consequence of the defect.
- When an item may be inapplicable, verify whether the draft says so expressly and whether the reason for inapplicability is credible from the source materials.
- Check internal consistency among the cover page, the table of contents, the financial statements, the exhibit index, and any referenced incorporation-by-reference language.
- Compare share counts, filer status, and checkbox selections across the cover page and the financial statements for consistency.
- Review risk factors and legal proceedings for known proceedings, regulatory notices, or other material events that may require disclosure.
- If an acquisition occurred during the period, verify that purchase accounting disclosures are internally coherent and that any residual allocation is supported by the disclosed accounting treatment.
- Assign an ordinal severity to each deficiency, and state the practical consequence if the defect is not corrected before filing.

## 5. Vertical / structural / temporal relationships

- Track how the cover page, Part I, Part II, Part III, financial statements, exhibits, and certifications interact; a defect in one section may invalidate or necessitate revision in another.
- Distinguish current-period filing requirements from later-filed proxy incorporation mechanics, because the timing of the proxy filing affects whether Part III can be completed by reference or requires amendment handling.
- Distinguish disclosure that belongs in the annual report itself from information that may be furnished or filed elsewhere; the classification matters for the form-compliance review.
- Evaluate any deadline issue against the actual fiscal year-end, then against the filing date shown on the draft, then against the correct extension rule if the due date lands on a non-business day.
- Where the draft contains both narrative disclosure and exhibit references on the same topic, check that the substantive disclosure and the exhibit package move together.

## 6. Output structure conventions

- Prepare a form-check memorandum in conventional legal-memo form, organized by filing component and item number rather than by a bare defect list.
- Open with a concise executive summary stating the overall filing status and the most significant blockers.
- Define a uniform ordinal severity scale at the outset and apply it consistently to every issue.
- For each issue, include: filing component or item reference, a brief issue statement, the controlling authority by name and section or rule, severity, the filing consequence, and a concrete corrective action.
- Where multiple items or exhibits are implicated, address them as separate rows or subsections so each defect is independently traceable.
- Use source-based citations to the governing rule, regulation, or standard for every legal conclusion in the memorandum.
- End with a Recommended Actions section that assigns an imperative action, the responsible role, and a timing anchor tied to the filing deadline or other regulatory milestone.
- Include a compact summary table of all deficiencies with severity and controlling authority before the detailed discussion.
