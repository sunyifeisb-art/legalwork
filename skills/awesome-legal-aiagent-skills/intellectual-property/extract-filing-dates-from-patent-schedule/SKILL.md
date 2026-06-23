---
name: extract-filing-dates-patent-schedule
task_id: intellectual-property/extract-filing-dates-from-patent-schedule
description: Reconciling patent portfolio filing dates and status across multiple diligence sources for a transactional patent schedule, requiring priority-chain verification, discrepancy flagging, and maintenance-fee risk assessment at a category level.
activates_for: [planner, solver, checker]
---

# Skill: Extract Filing Dates from Patent Schedule

## 1. Subject-matter triage

Use this skill for a patent-portfolio reconciliation built from a transaction schedule, an IP diligence report, and an internal tracker. Treat the exercise as a source-comparison and verification task, not a single-source extraction.

Start by identifying the patent families and filing tracks that actually appear in the materials. If the materials present more than one family, filing type, country, or status bucket, enumerate them before analysis and work family-by-family so no record is silently collapsed into another.

Treat the schedule, diligence report, and tracker as potentially inconsistent. No source is presumptively controlling unless the documents themselves say so.

## 2. Failure modes the skill is correcting

- Pulling filing dates or status from one document and presenting them as verified
- Missing cross-document conflicts, silent gaps, or partial matches
- Failing to trace priority chains from provisional to non-provisional, PCT to national phase, or parent to child filings
- Treating malformed, transposed, or non-matching application numbers as valid without a format check
- Confusing pending, granted, issued, lapsed, expired, or abandoned status labels
- Ignoring maintenance-fee timing for issued patents and associated lapse risk
- Using a later or less conservative date for deadline-sensitive analysis when sources disagree
- Reporting discrepancies without stating what should be checked next

## 3. Legal frameworks / domain conventions that apply

- Patent filing and priority analysis turns on internal consistency across application data, priority claims, and status history; a date is not verified until it fits the chain.
- For provisional-to-non-provisional relationships, the later filing should be checked against the earlier filing date and the claimed priority path.
- For PCT matters, distinguish the international filing from any national-phase entry and flag silence where a downstream entry would ordinarily be expected.
- Application numbers should be checked for format integrity and cross-source match; a transposition or malformed sequence is a verification issue even if the surrounding record looks plausible.
- Status distinctions matter commercially and legally; a record marked granted or issued should be supported as such, and an apparent mismatch is material.
- For issued patents, maintenance-fee timing should be assessed using the conservative date when sources differ, with lapse or near-deadline risk flagged as a transactional issue.
- When source materials conflict on a deadline-relevant date, use the more conservative date for timing analysis and state the assumption.

## 4. Analytical scaffolds

1. For each patent family or record group, list every filing that appears in any source, including provisional, non-provisional, PCT, national-phase, and foreign filings where present.
2. Build a source matrix for each filing: schedule value, diligence-report value, and tracker value.
3. For every mismatch or omission, record:
   - the exact nature of the conflict or gap,
   - the most likely correct value or status based on the available context,
   - the verification step needed to close the point.
4. Trace the priority chain end-to-end and test whether each child filing is consistent with the parent filing and stated priority claim.
5. Check whether any PCT filing has an expected downstream national-phase entry and whether the materials support that entry.
6. Screen application numbers for transposition, malformed formatting, or internal inconsistency across sources.
7. For issued patents, identify the next maintenance-fee checkpoint and any lapse or grace-period concern, using conservative timing where the sources diverge.
8. Separate expired provisional filings from active non-provisional or issued assets so the portfolio summary does not overstate live rights.
9. Treat each status label as a separate verification point; do not infer “issued” from “granted” or “pending” from silence.
10. Summarize counts by filing type and status only after the record-level reconciliation is complete.

## 5. Vertical / structural / temporal relationships

Work from parent filing to child filing, earliest date to later date, and filing to status to maintenance deadline. A later event should be tested against the earlier event it depends on, not analyzed in isolation.

Where the documents create a chain, keep the sequence explicit:
- provisional → non-provisional
- PCT → national phase
- parent application → continuation / divisional / other descendant where shown
- filing date → grant/issue date → fee checkpoint → lapse risk

If the sources disagree on sequence, identify the inconsistency rather than forcing a chronology.

## 6. Output structure conventions

- Produce a single verified portfolio summary report organized by patent family or equivalent record group.
- Open with a short methodology note describing the source set reviewed and the reconciliation approach.
- Include a family-level comparison table showing the key filing data pulled from each source side by side.
- Follow each family table with concise discrepancy notes, each one pairing the conflict, the likely correct reading, and the needed verification step.
- Include a separate consolidated discrepancy log for all unresolved or material cross-document conflicts.
- Include a maintenance-fee and lapse-risk section for issued patents or other records requiring timing review.
- Include a portfolio-level summary of filing types and statuses after reconciliation.
- Use clear, transactional language suitable for a due-diligence deliverable.
- If any point remains unverified, flag it expressly rather than filling the gap with inference.
- The final document should be written as the operative report itself, not as a process memo.
