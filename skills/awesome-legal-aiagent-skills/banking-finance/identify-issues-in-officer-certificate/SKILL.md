---
name: identify-issues-in-officer-certificate
task_id: banking-finance/identify-issues-in-officer-certificate
description: Reviews an officer's certificate package against the applicable credit agreement conditions precedent, identifying signatory deficiencies, stale representations, undisclosed events, and certification errors.
activates_for: [planner, solver, checker]
---

# Skill: Officer's Certificate Issues Memo — Conditions Precedent to Initial Funding

## 2. Failure modes the skill is correcting

- Accepting the officer's signature without verifying the signatory's title against the agreement-defined officer category
- Missing the double-materiality problem when a materiality-scrubbed bring-down standard is required but the certificate applies materiality to all representations, including those that already contain a materiality qualifier
- Failing to identify intervening events between the certificate date and the closing date that make the certificate stale
- Overlooking undisclosed indebtedness incurred after signing that may violate a negative covenant and affect a closing-date representation
- Treating a descriptive memo as complete when it omits the applicable condition-precedent standard, the interaction with related schedules or ancillary certificates, or the transaction consequence of the defect

## 3. Legal frameworks / domain conventions that apply

- Signatory authority: verify the officer's title against the agreement-defined officer category; if the certificate is executed by the wrong officer type, flag whether the condition precedent is unsatisfied under the credit agreement and related authorization provisions
- Rep bring-down standard: identify the governing bring-down formulation in the financing documents; compare the certificate language to that standard and flag any added materiality overlay or other deviation from the required formulation
- Solvency certificate timing: assess whether the solvency certificate is dated on or near closing; if it predates closing, review intervening events and flag any development that could make the certification stale under the solvency requirement
- Material subsidiary guarantor coverage: identify subsidiaries that meet any guarantor threshold under the financing documents and confirm whether they are included among the guarantors; flag omissions against the guaranty requirement and related schedules
- Undisclosed indebtedness and negative covenants: review post-signing financings or other indebtedness for compliance with the negative covenant and any required consent mechanics; flag transactions that appear to require repayment, consent, waiver, or other closing action before funding
- Wrong date in certificate: verify that the certificate date aligns with the intended closing date or certification period; if there is a dating error, flag the mismatch and its effect on effectiveness and reliance
- Insurance certificate requirements: verify that insurance certificates reflect the designations required by the financing documents for property and liability coverage; flag any missing agent designation or other technical deficiency
- Property casualty / MAE linkage: if a material property is damaged or destroyed between signing and closing, assess whether the event may constitute a material adverse effect under the financing documents and whether it affects a condition precedent
- Ratio or financial certification consistency: compare any certified financial ratio against the supporting calculations and source data; flag discrepancies and trace the inconsistency to the relevant certificate or backup schedule
- Authority and effectiveness: cite the governing clause, schedule, or defined term that controls each condition precedent before concluding whether the defect is closing-blocking, curable, or informational

## 4. Analytical scaffolds

1. Scope the package: identify each certificate, its date, signer, stated purpose, and the closing condition it is meant to satisfy
2. Enumerate the moving pieces: list each relevant officer certificate, related schedule, ancillary certificate, and referenced agreement provision before analyzing any one item
3. Signatory authority: verify the officer's title against the agreement-defined officer category; flag if deficient; assess severity
4. Bring-down standard: identify the required standard; assess whether the certificate adds an improper materiality qualifier or other deviation; flag if present
5. Temporal fit: compare the certificate date to closing and identify any intervening events that may affect reliance; flag staleness or date mismatch
6. Guarantor coverage: compare the guarantor list against the subsidiary threshold and related schedule; flag omissions or mismatches
7. Indebtedness and covenant compliance: identify new debt or financing activity; compare it to the negative covenant and consent mechanics; flag the specific issue and any required cleanup
8. Insurance and asset events: verify required designations and assess whether casualty events may trigger MAE or other closing concerns
9. Financial statement or ratio support: compare any certified metric to backup calculations and source data; flag discrepancies and the source of the mismatch
10. Severity ratings: assign severity using a uniform ordinal scale defined at the outset; tie the rating to the likely effect on the closing condition and whether the issue is curable before funding
11. Issue closing triad: for each issue, include the relevant scale or threshold from the source documents, the related clause or schedule, and the downstream consequence for the transaction
12. Recommendation discipline: pair every deficiency with a concrete corrective step directed to the responsible person and tied to the closing timeline

## 5. Vertical / structural / temporal relationships

- Treat the officer's certificate package as a set of linked inputs, not isolated pages; a defect in one certificate may be cured, contradicted, or magnified by another certificate, schedule, or bringing-down representation
- Analyze the timeline from signing through funding; a certificate that is technically accurate on its date may still be stale at closing if intervening facts undermine it
- Distinguish among documentary defects, factual defects, and covenant defects; some are signature or form issues, others are substantive closing-condition failures
- When multiple officers, dates, assets, or subsidiaries appear, assess each separately before drawing a package-level conclusion
- If only one item is actually in scope, say so affirmatively and explain why the remaining categories do not apply

## 6. Output structure conventions

- Issue memo organized by issue, using industry-conventional headings rather than a rigid rubric list
- Include a short opening section stating the review scope, the governing severity scale, and any assumptions about the closing package
- For each issue, include:
  - severity
  - certificate or document reference
  - specific deficiency
  - controlling authority from the financing documents or related source materials
  - quantitative or threshold context from the source documents, when applicable
  - cross-reference to the interacting clause, schedule, or certificate
  - transaction consequence or closing impact
  - recommended fix
- Use a consistent ordinal severity field for every issue, defined once and applied uniformly
- Where the package includes multiple certificates or schedules, present a separate entry for each distinct defect rather than collapsing them into one generalized comment
- End with a Recommended Actions section that assigns each action to the relevant role and ties it to the closing milestone or other timing anchor
- Close with a concise summary table or paragraph that counts issues by severity and identifies any blocker issues
