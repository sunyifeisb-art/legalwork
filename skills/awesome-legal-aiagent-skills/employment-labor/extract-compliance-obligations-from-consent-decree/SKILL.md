---
name: extract-compliance-obligations-from-consent-decree
task_id: employment-labor/extract-compliance-obligations-from-consent-decree
description: Guides the analyst in extracting obligations from a consent decree into a structured tracker, including deadline mapping, compliance status, cascading risk identification, and cross-referencing related modifying or supplementing documents.
activates_for: [planner, solver, checker]
---

# Skill: Extract Compliance Obligations from Consent Decree into Obligation Tracker

## 1. Subject-matter triage

- Treat the consent decree as a court-enforceable compliance instrument, not a narrative settlement summary.
- Separate operative obligations from background recitals, findings, and jurisdictional boilerplate.
- Identify every source in the packet that may alter, explain, extend, or condition an obligation, and read those sources as part of the same compliance set.
- If the packet contains only one operative decree, state that affirmatively and proceed decree-by-decree; if there are multiple operative sources, enumerate them first and extract against each source separately.

## 2. Failure modes the skill is correcting

- Analyst writes a prose summary instead of a row-based obligation tracker, leaving the incoming general counsel without a usable action list.
- Analyst misses obligations embedded in amendments, side letters, monitor correspondence, exhibits, schedules, or implementing guidance that modify the decree’s baseline requirements.
- Analyst collapses distinct duties into one blended entry, obscuring who must act, by when, and how often.
- Analyst ignores whether an obligation is complete, overdue, recurring, contingent, or dependent on another task.
- Analyst fails to connect a missed or delayed obligation to the downstream compliance, monitoring, reporting, or enforcement consequences it triggers.
- Analyst omits the legal source reference for each extracted obligation, making the tracker hard to verify against the underlying documents.
- Analyst produces a list of tasks without a severity or urgency signal, which prevents triage.

## 3. Legal frameworks / domain conventions that apply

- Consent decrees create enforceable obligations under the court’s retained jurisdiction; paragraph-level citations matter because enforcement usually turns on the exact operative language.
- Amending, supplemental, interpreting, or implementing documents can narrow, expand, or clarify decree duties; when they do, the tracker should reflect both the base provision and the modifying source.
- Compliance duties in this setting commonly include reporting, notice, training, policy revision, recordkeeping, audit/monitor cooperation, remediation, and payment obligations; each should be extracted as a distinct operational item when separately stated.
- Deadline logic matters: one-time deadlines, recurring deadlines, event-triggered deadlines, and rolling obligations should be captured differently so the tracker can support calendaring.
- Status assessment should reflect completion posture, not just existence of the duty: completed, pending, overdue, partially complete, contingent, or recurring.
- Risk should be framed as an operational enforcement risk tied to the decree’s structure, the likelihood of follow-on noncompliance, and the significance of any cascade to related duties.
- Where the decree references monitoring, retention, access, cooperation, or cost-sharing, those provisions should be tracked as standalone obligations because they often outlive a single reporting deadline.
- Use authorities as stated in the source set for any legal characterization; do not infer more than the documents support.

## 4. Analytical scaffolds

- Read sequentially and extract each operative clause into its own tracker row.
- For each obligation, capture:
  - source citation at paragraph/exhibit level;
  - concise duty statement;
  - responsible party;
  - trigger, deadline, or frequency;
  - status;
  - severity/urgency;
  - related source documents;
  - practical notes for the incoming general counsel.
- When multiple deadlines or duty variants appear, enumerate them first and then map each one separately; do not merge distinct dates or cadences into a single entry.
- For each obligation, test whether a related document changes the duty’s scope, timing, or method of compliance, and note the effect in the row.
- For each overdue or incomplete item, identify what other obligations depend on it and record the downstream consequence of delay.
- Use a uniform ordinal severity scale defined once and applied consistently across all rows.
- If the packet contains an issue or risk requiring action, close the entry with three elements: the source basis, the cross-reference that interacts with it, and the consequence for the client.

## 5. Vertical / structural / temporal relationships

- Distinguish between obligations that run vertically from decree to exhibit to later modification and obligations that stand alone in the main decree.
- Distinguish between immediate, future-dated, recurring, and event-driven duties.
- Distinguish between one-off implementation tasks and enduring compliance controls.
- Distinguish between obligations that affect the whole organization and those assigned to a specific officer, team, or function.
- If a duty is a precondition for another duty, reflect that dependency explicitly in the tracker and in the risk notes.
- Present the tracker so a new general counsel can understand current posture without rereading the source packet.

## 6. Output structure conventions

- Produce a multi-tab spreadsheet as the deliverable, with conventional workbook tabs rather than a narrative memo.
- Use an obligation tracker tab as the primary tab, with one row per obligation and columns for source reference, obligation description, responsible party, deadline or frequency, status, severity, related documents, dependency/cascade notes, and GC comments.
- Use a risk tab for active violations, overdue duties, and elevated exposures, with columns for issue description, severity, source basis, interacting provisions, consequence, and recommended remediation.
- Use a timeline tab that lists deadlines in chronological order and distinguishes completed, pending, overdue, recurring, and event-triggered items.
- Make the workbook filterable by source, responsible party, status, and severity.
- Keep the extracted language concise and operative; the output should capture what must be done, by whom, and when, not paraphrase the decree.
- Ensure the primary file requested by the task is the workbook itself and that it contains the operative tracker content rather than a summary placeholder.
