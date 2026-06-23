---
name: identify-issues-in-custodian-production-set
task_id: white-collar-defense-investigations/identify-issues-in-custodian-production-set
description: Issues memorandum analyzing a custodian production set for a government investigation, identifying preservation-risk events, post-preservation deletions, privilege log deficiencies, and gaps between the collection plan and actual collection activity.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Custodian Production Set — Issues Memorandum

## 1. Subject-matter triage
- Treat this as a document-review and issue-spotting assignment, not a transactional drafting task.
- Confirm the relevant preservation trigger, then sort the production set into discrete issue buckets: hardware events, deletions, privilege logging, and collection-scope mismatches.
- If only one custodian set is in scope, say so explicitly; if multiple source records or date ranges are present, enumerate them before analysis and evaluate each separately.

## 2. Failure modes the skill is correcting
- Hardware changes are discussed without testing whether they occurred after the preservation duty arose.
- Device replacement is noted without asking whether the prior device was imaged, retained, repurposed, or disposed of.
- Deletions from shared locations are described without distinguishing recovered material from permanently lost material.
- Privilege logs are accepted despite missing fields that are necessary to assess the withholding claim.
- Collection-plan departures are missed because the plan is not compared item-by-item against the vendor’s actual collection record.
- The memo states issues but does not close them with severity, source support, consequences, and practical remediation.

## 3. Legal frameworks / domain conventions that apply
- Preservation analysis is governed by the common-law and procedural duty to preserve potentially relevant evidence once litigation or a government investigation is reasonably anticipated; spoliation analysis typically turns on notice, relevance, culpability, and prejudice.
- In federal civil practice, preservation and sanctions analysis commonly tracks Federal Rule of Civil Procedure 37(e) for electronically stored information; for government-investigation contexts, the same preservation logic applies when evaluating remedial risk and evidentiary exposure.
- Hardware replacement after a hold or preservation notice is a preservation-risk event if the old device was not secured, imaged, or otherwise made recoverable before changeover.
- Shared-drive deletions after preservation notice must be treated as post-preservation loss events; permanent loss is more serious than loss that was later recovered from another source.
- Privilege logs should permit assessment of the claim of protection; deficient logs usually omit date, author, recipients, a non-privileged description, or the privilege basis.
- Collection review should compare what the plan required against what the vendor actually collected, because scope gaps can create downstream completeness challenges.

## 4. Analytical scaffolds
1. **Preservation trigger**: Identify the date and form of the preservation notice or equivalent trigger; anchor all later events to that date.
2. **Hardware event**: Identify each replacement, retirement, imaging, or disposal event for the custodian device; determine whether it post-dates the preservation trigger.
3. **Hardware mitigation**: Determine whether the original device was preserved, forensically imaged, or otherwise backed up before changeover; note whether alternative sources exist.
4. **Deletion event**: Identify deletions from shared drives or similar repositories after the preservation trigger; record the dates and the type of content if available.
5. **Recovery status**: Separate recovered deletions from unrecoverable deletions and treat unrecoverable items as the highest-risk subset.
6. **Privilege log review**: Test each withheld entry for the core metadata needed to evaluate privilege; identify missing fields and whether the deficiency is isolated or systemic.
7. **Collection comparison**: Compare the collection plan to the vendor report source-by-source; identify every planned source not actually collected and any unexplained variance.
8. **Issue closing**: For each issue, state the timing or scale, link it to the interacting record set, and explain the practical consequence for the investigation or defense.

## 5. Vertical / structural / temporal relationships
- Build a chronological timeline that starts with the preservation notice and then places hardware changes, deletions, collection activity, and logging events in order.
- Cross-reference each event against the specific source document that confirms it; do not rely on a single narrative source when a contemporaneous record exists.
- If one event depends on another, make the dependency explicit: notice before replacement, hold before deletion, plan before vendor collection, withholding before privilege logging.
- Where multiple custodians, repositories, or source systems appear, keep the analysis separate by custodian or source unless the documents clearly show the same issue pattern across them.

## 6. Output structure conventions
- Deliver a memorandum of findings organized by issue and ordered from highest to lowest severity.
- Use an ordinal severity field for every issue, with a single scale defined at the outset of the memo, such as Critical / High / Medium / Low.
- For each issue, include: issue title, short description, source basis, severity, legal consequence, and concrete remediation.
- Close each issue with: a concise scale or timing anchor drawn from the source set, a cross-reference to the interacting record or event, and the downstream consequence to the client.
- End with a Recommended Actions section that assigns each step to a role named in the source set where possible and ties it to an urgent timing anchor or next milestone.
- Include a brief executive summary up front and a chronology of key events near the end or after the issue discussion.
- Keep the writing memorandum-style; do not convert it into a Q&A or a narrative summary without issue headings.
