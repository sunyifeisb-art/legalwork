---
name: extract-key-custodians-from-document-preservation-notice
task_id: antitrust-competition/extract-key-custodians-from-document-preservation-notice
description: Closes gaps in accurate title and division extraction for each custodian, employment status verification, and gap analysis between the preservation notice list and the full custodian universe identified in source documents.
activates_for: [planner, solver, checker]
---

# Skill: Custodian Identification Report

## 1. Subject-matter triage

- Treat the preservation notice as the starting list, not the universe.
- Build the custodian set from all names that appear in the notice, the key-document trail, organizational records, and the investigation materials.
- Separate current employees, former employees, and non-employees whose documents or communications may still matter under the applicable possession, custody, or control standard.
- Track whether the notice appears to reach all relevant repositories and device types, including business systems and any personal devices used for business purposes.

## 2. Failure modes the skill is correcting

- Treating the preservation notice list as complete when source materials show additional custodians.
- Missing authors, recipients, or named individuals in key documents and investigation records.
- Failing to reconcile title, division, department, or employment status against source records.
- Overlooking former employees whose documents may remain accessible or relevant.
- Ignoring device-coverage gaps where the notice reaches only some systems or platforms.
- Stopping at identification without converting gaps into concrete preservation-risk flags and action items.

## 3. Legal frameworks / domain conventions that apply

- Litigation-hold practice requires identifying custodians reasonably likely to hold potentially relevant documents, not merely those expressly listed in the notice.
- In antitrust matters, the key-document trail is a primary relevance filter: authors, recipients, and named participants are all custodian candidates.
- Former employees can remain within scope for preservation and collection analysis if relevant documents may exist on company systems, backups, cloud repositories, or personal devices used for business.
- A valid preservation review must test both person coverage and repository coverage; a custodian with partial device coverage is still a gap.
- When source materials conflict on title, division, or status, the report should preserve the discrepancy rather than resolve it silently.

## 4. Analytical scaffolds

1. Enumerate the full custodian universe from all source materials before analysis:
   - persons named in the preservation notice;
   - authors and recipients of key documents;
   - persons mentioned by name in investigation materials;
   - any additional custodians identified in organizational or IT records.

2. For each person, extract and normalize:
   - full name;
   - title;
   - division / department;
   - employment status;
   - source basis for inclusion;
   - whether the preservation notice covers that person.

3. Reconcile each person against the preservation notice:
   - if listed, confirm whether title, division, and status match the source record;
   - if not listed, flag as a gap and state why the person should be considered a custodian candidate.

4. Test device and repository coverage:
   - identify whether the notice reaches all relevant devices or systems reflected in the source set;
   - flag partial coverage where business communications may exist on additional devices or repositories.

5. Perform a gap analysis:
   - compile every person found in source materials but not on the preservation notice;
   - convert each gap into an action-oriented preservation item;
   - distinguish high-priority gaps tied to key documents or central investigation references.

6. Assign severity to each gap and discrepancy:
   - use a fixed ordinal scale at the top of the report;
   - apply it consistently to missing custodians, status conflicts, and device-coverage defects.

7. End with recommended actions:
   - state the next preservation steps;
   - assign each action to the responsible role indicated by the materials where possible;
   - tie each action to the nearest preservation, collection, or investigation milestone.

## 5. Vertical / structural / temporal relationships

- Preserve the relationship between custodian identity and source provenance: a person may appear in more than one source, and each source should be captured.
- Preserve the relationship between current status and preservation scope: active employees and former employees may require different handling, but both can be in scope.
- Preserve the relationship between person coverage and device coverage: a custodian may be listed but still under-covered if a device type or repository is omitted.
- Preserve the sequence of review: identify the universe first, then compare against the notice, then rank the resulting gaps by risk.
- If multiple notices or versions exist, compare them chronologically and identify what changed in each round.

## 6. Output structure conventions

- Begin with a short methods note stating the source set reviewed and the severity scale used.
- Use a custodian table with, at minimum: name, title, division, employment status, source basis, notice coverage, discrepancies, and severity.
- Follow with a gap-analysis section listing every person found in source materials but not covered by the notice, with a concise action item for each.
- Include a device-coverage section identifying repository or platform gaps and linking them to affected custodians where possible.
- Include a preservation-risk section that flags the highest-priority custodians or gaps based on document centrality, status conflicts, or partial coverage.
- End with a Recommended Actions block using imperative verbs, responsible roles, and timing anchors.
- Keep the report self-contained and cross-referenced so each custodian can be traced back to the source basis used for inclusion.
