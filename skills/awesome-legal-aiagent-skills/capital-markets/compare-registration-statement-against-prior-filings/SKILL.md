---
name: compare-registration-statement-against-prior-filings
task_id: capital-markets/compare-registration-statement-against-prior-filings
description: Registration statement staleness review that compares a draft against prior filings, checks intervening disclosures for material updates, and evaluates whether the filing remains internally consistent and procedurally complete.
activates_for: [planner, solver, checker]
---

# Skill: Compare Registration Statement Against Prior Filings — Deviation and Consistency Report

## 1. Subject-matter triage
- Treat this as a comparison-and-issue-spotting exercise, not a drafting rewrite.
- Identify all time-sensitive statements in the draft registration statement and test them against the prior filings and any intervening disclosures in the source set.
- If only one prior filing or one intervening disclosure is provided, say so explicitly and analyze only that record set; do not imply a broader diligence universe.
- If the filing form, shelf status, or fee posture is in question, isolate that as a separate eligibility branch before discussing disclosure drift.

## 2. Failure modes the skill is correcting
- Textual comparison without checking whether later disclosures made prior language stale.
- Spotting mismatches but failing to distinguish stale disclosure, internal inconsistency, and omission from incorporation gaps.
- Missing form-eligibility problems that affect whether the draft can proceed as prepared.
- Overlooking whether time-sensitive facts were updated in the registration statement using current-record information rather than copied legacy language.
- Treating isolated sentence-level edits as sufficient when the surrounding sections, exhibits, or incorporated reports create a broader consistency problem.
- Ending an issue at description instead of tying it to the affected threshold, cross-document conflict, and practical consequence.

## 3. Legal frameworks / domain conventions that apply
- Registration statements must be current as to material facts under the Securities Act of 1933 and the applicable SEC registration form requirements.
- Incorporation by reference must be checked against the actual incorporated filings, the filing date sequence, and any later developments that should be reflected in the new filing.
- Shelf and related registration mechanics must align with the issuer’s status under the relevant SEC framework, including any accelerated or streamlined eligibility path.
- Share counts, capitalization, use-of-proceeds descriptions, board or governance facts, debt arrangements, litigation, material contracts, properties, and risk factors are inherently time-sensitive and require current confirmation.
- Subsequent-event disclosure should be tested against material developments disclosed after the prior filing, including acquisitions, dispositions, financing changes, cybersecurity incidents, and regulatory or tax changes.
- SEC comment risk is highest where the draft appears to recycle outdated narrative without acknowledging intervening events or where a newly disclosed fact is omitted from the registration statement’s risk or business description.

## 4. Analytical scaffolds
- Build the comparison in three passes:
  1. identify each factual statement in the draft that appears drawn from an earlier filing;
  2. check whether the underlying fact changed in the intervening period;
  3. determine whether the new registration statement updates, qualifies, incorporates, or omits that change.
- For each issue, classify it as one of the following:
  - stale disclosure;
  - internal inconsistency;
  - incorporation gap;
  - eligibility / form-selection issue.
- For each issue, record the relevant source statement in the prior filing or current record, the matching or conflicting language in the draft, and why the difference matters under the applicable registration-statement standard.
- Where the source set includes multiple potentially relevant dates, periods, or filings, evaluate each one separately rather than collapsing them into a single generalized check.
- Include only issues that are supported by the document set; if a point is likely acceptable, note why it appears consistent and do not overstate the risk.
- When a disclosure is potentially stale but not clearly wrong, explain the specific update that would remove the SEC comment risk.

## 5. Vertical / structural / temporal relationships
- Prior filing → intervening disclosure → draft registration statement is the core temporal chain; track whether the draft sits before or after each cited event.
- Current-record facts should control over legacy text when the two conflict.
- If an incorporated document is older than a disclosed event, verify whether the draft or an incorporated report expressly addresses the later event.
- When a later filing updates a section that the draft repeats, confirm the draft either matches the update or is limited enough that it cannot be read inconsistently.
- If a fact has a moving base, use the most recent source in the record chain as the benchmark and note the timing mismatch if the draft uses an older figure or description.

## 6. Output structure conventions
- Organize the report by issue type, using conventional headings rather than a rubric-like checklist.
- Start with a brief severity key using an ordinal scale such as Critical / High / Medium / Low, and apply that scale uniformly to every issue.
- For each issue, include:
  - severity;
  - issue type;
  - source statement(s) and draft statement;
  - why the discrepancy matters;
  - the downstream consequence for the issuer or offering;
  - a targeted remediation.
- When a legal or regulatory conclusion is stated, tie it to the controlling authority or SEC practice that supports the point rather than using conclusory language alone.
- Include a short section confirming provisions reviewed and found consistent, where the draft matches the source record or where the apparent discrepancy is immaterial.
- End with a concise Recommended Actions block using imperative verbs, the responsible role where identifiable, and timing tied to the filing process or the next disclosure milestone.
- Keep the report suitable for direct placement into `s3-deviation-report.docx`; do not reproduce source text beyond what is needed to identify the discrepancy.
