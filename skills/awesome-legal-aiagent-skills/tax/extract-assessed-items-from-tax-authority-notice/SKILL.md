---
name: extract-assessed-items-from-tax-authority-notice
task_id: tax/extract-assessed-items-from-tax-authority-notice
description: Extracting assessed items from a state tax authority notice requires separately cataloging each tax type and each component deficiency, identifying the challenge issues applicable to each line item, and flagging procedural vulnerabilities — not just reading the total deficiency from the cover page.
activates_for: [planner, solver, checker]
---

# Skill: Extract Assessed Items from Tax Authority Notice

## 1. Subject-matter triage

- Treat the final assessment notice as the controlling extraction source, then reconcile it against the supporting return, schedules, protests, audit workpapers, and correspondence.
- Identify whether the notice assesses one tax type or multiple tax types; if multiple, enumerate them first and analyze each separately before drawing conclusions.
- Separate principal tax, penalty, and interest for every assessed item; do not collapse them into a single total.
- If the notice contains multiple periods, multiple bases, or multiple adjustment categories, treat each as its own item for extraction and challenge review.
- Confirm the petition or reassessment deadline from the notice and any cited statute before doing substantive analysis.

## 2. Failure modes the skill is correcting

- Reading only the aggregate deficiency from the cover page without disaggregating the notice into component tax types and sub-components.
- Treating the notice as a final merit determination rather than an opening position in an administrative dispute.
- Failing to verify the penalty computation method for each assessed item and whether the cited penalty standard matches the item.
- Missing period-by-period limitation exposure, including assessments that may be time-barred even if other periods are not.
- Ignoring inconsistencies between the narrative and the schedules, including arithmetic errors and missing identifiers.
- Failing to match the final notice against prior submissions and not flagging arguments that were raised but not addressed.
- Omitting the governing authority for a challenge theory and stating a conclusion without the supporting rule.
- Producing a summary that describes the notice but does not extract the assessed items into a usable working table.

## 3. Legal frameworks / domain conventions that apply

- **Multi-item assessment structure:** State tax notices commonly assess principal, penalty, and interest separately, and each component can have a different legal basis and challenge posture.
- **Penalty standards by type:** Negligence, failure-to-pay, understatement, and fraud-type penalties are governed by different statutory standards and proof requirements; the applicable authority must be matched to the notice’s stated penalty basis.
- **Exemption and apportionment rules:** Where an assessment turns on a claimed exemption, partial exemption, or apportionment, the controlling statute, rule, or administrative guidance governs whether the disallowance is correct in whole or only in part.
- **Interest computation rules:** Interest follows the statute’s prescribed rate and compounding method, and deviations across periods or tax types may create an overstatement.
- **Limitation periods:** Assessment authority is bounded by the applicable statutory period, with possible extensions for specified conditions such as substantial understatement or fraud; each period must be tested separately.
- **Procedural completeness:** A final notice should be checked for responses to prior arguments, consistency with supporting schedules, and internal arithmetic integrity.
- **Authority citation discipline:** Every challenge basis should be tied to a cited statute, regulation, administrative rule, or other controlling authority named in the notice or otherwise generally applicable.

## 4. Analytical scaffolds

- First enumerate all assessed tax types, periods, and component items visible in the notice.
- For each tax type, extract:
  - the assessed principal amount,
  - the penalty amount and stated basis,
  - the interest amount and stated computation approach,
  - the period covered,
  - the adjustment category or issue description.
- Cross-reference each extracted item to the supporting documents to verify whether the notice matches the underlying records.
- For each item, test the following challenge categories where relevant:
  - exemption or partial exemption,
  - incorrect penalty standard,
  - incorrect penalty calculation,
  - incorrect interest computation,
  - limitation-period defect,
  - unaddressed prior argument,
  - arithmetic or schedule discrepancy,
  - missing or inconsistent identifying information.
- For every challengeable item, state:
  - the governing authority supporting the challenge,
  - the factual mismatch or procedural defect,
  - the likely effect on the assessed amount.
- If the notice cites multiple legal bases, map each assessment line to the specific cited authority rather than treating the notice as a single unit.
- If the record set includes prior protest or response materials, compare them line-by-line to the final notice and note what changed, what remained, and what was omitted.
- Verify the petition, appeal, or hearing deadline and state it prominently.
- If the source materials do not support a dispute point, say so expressly rather than inferring one.

## 5. Vertical / structural / temporal relationships

- Work from top-down structure: notice header, tax type grouping, line-item details, then supporting schedules and correspondence.
- Preserve the temporal sequence of the administrative process: preliminary finding, taxpayer response, final assessment, and current deadline.
- Track each assessed period independently; a defect in one period does not automatically carry to another unless the same legal basis applies.
- When a line item has multiple components, keep the component amounts linked to the same tax type and period so the reader can reconcile the notice back to the source documents.
- If the final notice references earlier materials, show the relationship between the earlier position and the final assessed amount.

## 6. Output structure conventions

- Use a conventional tax assessment extraction report format rather than a memo disguised as a narrative.
- Begin with a short executive summary stating the overall assessment posture, the deadline, and the main dispute themes.
- Include an assessment inventory table with columns for:
  - tax type,
  - assessment period,
  - component issue,
  - principal,
  - penalty,
  - interest,
  - cited basis,
  - verification status,
  - challenge basis,
  - likely impact.
- Include a discrepancy / challenge table that lists each issue, the governing authority, the mismatch or defect, and the consequence for the taxpayer.
- Include a procedural flags section for limitation, penalty, interest, schedule, and correspondence issues.
- Use an ordinal severity field for each issue entry, defined once and applied consistently across the report.
- If multiple items exist, provide one row per item; do not aggregate separate issues into a single representative row.
- End with a recommended actions section that uses imperative verbs, names the responsible role, and ties each step to the filing deadline or next procedural milestone.
- Keep the document suitable for direct insertion into a .docx report.
