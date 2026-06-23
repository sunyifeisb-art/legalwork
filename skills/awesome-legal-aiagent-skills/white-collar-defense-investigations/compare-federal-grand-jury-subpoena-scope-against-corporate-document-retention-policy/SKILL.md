---
name: compare-grand-jury-subpoena-against-retention-policy
task_id: white-collar-defense-investigations/compare-federal-grand-jury-subpoena-scope-against-corporate-document-retention-policy
description: Gap analysis memorandum comparing a grand jury subpoena's scope against a corporate document retention policy and destruction records, identifying when the preservation obligation arose, which destructions occurred before versus after that obligation, and the spoliation risk associated with each gap.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis — Grand Jury Subpoena vs. Corporate Document Retention Policy

## 2. Failure modes the skill is correcting

- The controlling question is not whether a subpoena was later received, but when the duty to preserve reasonably arose; analyses that anchor the hold only to receipt of the subpoena misclassify earlier preservation failures.
- Pre-hold destruction under a routine policy is not the same as post-hold destruction; failing to separate those timelines obscures whether a gap is defensible or sanctionable.
- Automated deletion that kept running after a hold was triggered creates ongoing loss even without intent; the analysis must surface system-level failures, not just custodial ones.
- A category-by-category comparison is required; collapsing all subpoena requests into a single narrative can hide that some requests are fully supported while others face genuine gaps.
- A gap memo that describes missing material without identifying its legal source, preservation trigger, and practical consequence is incomplete.

## 3. Legal frameworks / domain conventions that apply

- The duty to preserve arises when litigation or government investigation is reasonably anticipated, under common-law spoliation principles and Rule 37(e) of the Federal Rules of Civil Procedure for electronically stored information.
- In a grand jury context, preserve-on-anticipation can be triggered by the earliest credible government contact, internal notice of an investigation, a whistleblower event reasonably likely to prompt government attention, or other facts showing a foreseeable inquiry; the subpoena itself may come later.
- Destruction before the preservation duty arose may be defensible if it occurred under a consistently applied, good-faith retention policy and was not targeted to material likely to become relevant.
- Destruction after the duty arose is preservation failure; for ESI, Rule 37(e) governs measures available for loss when reasonable steps were not taken, and severe prejudice or intent can justify stronger sanctions.
- Auto-delete, auto-archive, overwrite, and scheduled purge systems must be suspended when the duty attaches; failure to stop them can constitute post-duty loss even if no person manually deleted the material.
- Paper files, off-system notes, shared drives, messaging platforms, and voicemail may each have separate retention behavior; each source should be tested against the hold timeline and the policy in force.
- The subpoena-scope comparison must be done against what was requested, what exists, what was destroyed, and what remains recoverable from backups or alternative custodians.

## 4. Analytical scaffolds

1. **Control date selection**: Identify the earliest event that reasonably triggered the preservation duty and state it as the controlling hold date, with the legal basis for that trigger.
2. **Scope enumeration**: Break the subpoena into discrete request categories before analysis so each category can be assessed separately against the records universe.
3. **Policy mapping**: For each category, map the retention rule, deletion cycle, exception process, and any hold override in force at the relevant time.
4. **Timeline comparison**: For each destruction event, compare the destruction date to the controlling hold date and classify it as pre-duty or post-duty.
5. **Routine-policy defense check**: For pre-duty losses, test whether the policy was consistently applied, enterprise-wide, and not selectively suspended.
6. **System-suspension check**: Determine whether auto-deletion, archiving, purge, and overwrite functions were actually paused for the affected data types when the hold attached.
7. **Source triage**: Note whether responsive material may still exist in backups, exported archives, forensic images, custodial duplicates, or third-party repositories.
8. **Risk grading**: Assign a severity level to each gap based on timing, volume, relevance, recoverability, and likelihood of prejudice to the investigation.
9. **Consequence statement**: For each material gap, state the practical exposure for the client, including preservation risk, sanction risk, investigation risk, and remediation urgency.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Sequence matters: the analysis should run from earliest trigger, to hold implementation, to system suspension, to destruction events, to present recoverability.
- For each request category, distinguish among:
  - material that existed and remains available;
  - material destroyed before the duty arose;
  - material destroyed after the duty arose;
  - material potentially recoverable from backups or secondary sources.
- If multiple custodians or data systems are implicated, compare them rather than treating the organization as a single uniform repository.
- Where records show staggered hold rollout, identify any interval during which some custodians or systems remained exposed to deletion after others were preserved.
- If voicemail, chat, or short-retention data is involved, treat the shortest deletion interval as the highest-risk temporal window.

## 6. Output structure conventions

- Deliver a privileged gap analysis memorandum in conventional legal-memo form, with a short issue summary, governing principles, chronology, category-by-category analysis, risk assessment, and recommended actions.
- Use an ordinal severity field for each gap entry, with one scale defined once and applied uniformly throughout the memorandum.
- Organize the core analysis by subpoena request category, then by document type or data source, so the reader can see coverage and loss together.
- For each gap entry, state:
  - the document or data category;
  - the relevant date range;
  - the trigger event or retention rule that applies;
  - whether the loss was pre-duty or post-duty;
  - the recovery status or alternative source;
  - the severity rating;
  - the practical consequence for the client.
- Include a concise chronology that fixes the earliest preservation trigger, the hold notice date, suspension steps taken, and destruction events.
- Close with a Recommended Actions section directing responsible personnel to preserve remaining material, suspend any remaining auto-delete functions, recover backups, and document the scope of any irretrievable loss.
- Keep the memorandum privilege-sensitive and work-product oriented; state conclusions as legal-risk assessments rather than bare factual summaries.
