---
name: triage-counterparty-redlines-employment-template
task_id: intellectual-property/triage-counterparty-redlines-to-employment-agreement-template
description: Triaging a counterparty's redline against the company template and playbook, with attention to silent changes and inconsistencies with the cover email's representations.
activates_for: [planner, solver, checker]
---

# Skill: Triage Counterparty Redlines to Executive Employment Agreement Template

## 1. Subject-matter triage

- Confirm the source set before analysis: clean template, counterparty redline, playbook, cover email, and any related attachment or exhibit referenced by either document.
- Treat the redline as a comparison exercise, not a drafting exercise: the task is to identify deviations, classify them, and recommend a response.
- If the redline references more than one version, attachment, or marked-up layer, enumerate each version or layer first and assess them separately.
- If the cover email describes a limited scope of edits, test the redline against that scope before reviewing clause-by-clause substance.

## 2. Failure modes the skill is correcting

- Reviewing tracked changes without identifying silent deletions, unmarked insertions, or restructured provisions that alter meaning without obvious markup.
- Accepting the counterparty’s stated summary of changes without checking whether the actual redline matches it.
- Missing changes to core employment terms because they are embedded in defined terms, cross-references, exhibits, or boilerplate.
- Treating every deviation as equal instead of separating true counterparty asks from formatting cleanups, conforming edits, and substantive departures.
- Failing to tie each deviation to the company playbook position and the practical consequence of accepting it.
- Overlooking that a change in one clause can affect another clause elsewhere in the agreement, including definitions, remedies, survival, and integration language.
- Reading the redline visually only; substantive changes can disappear in export or in a non-marked clean copy.

## 3. Legal frameworks / domain conventions that apply

- Employment agreement triage requires comparison of the redline against the clean template, the playbook, and the cover email representations.
- The analysis should distinguish administrative edits from substantive departures affecting compensation, equity, scope of duties, confidentiality, restrictive covenants, IP assignment, dispute resolution, and termination.
- Any modification that narrows at-will employment, expands employee protections, or introduces notice, cause, or cure concepts should be flagged against the template and playbook.
- Any change to restrictive covenants should be assessed against the governing jurisdiction’s enforceability rules and the company’s preferred fallback position.
- Any narrowing of work-made-for-hire language, assignment scope, moral rights waiver, invention disclosure duty, or cooperation obligation should be treated as an IP risk.
- Any change to compensation, bonus, severance, benefits, equity, vesting, acceleration, forfeiture, or repayment terms should be compared to the template and playbook, including any cross-references to plan documents.
- If the source documents identify a governing law or forum, use that as the baseline for evaluating enforceability and dispute mechanics.
- When relying on a legal proposition, cite the controlling authority named in the source materials or the applicable generally recognized authority for the issue.

## 4. Analytical scaffolds

- Start with a complete pass over the redline to identify every substantive change, including:
  - tracked additions and deletions,
  - silent deletions,
  - untracked substitutions,
  - moved language,
  - newly introduced defined terms,
  - conforming edits that create substantive drift.
- For each deviation, compare four things in the same pass:
  - the template text,
  - the redline text,
  - the playbook position,
  - the cover email representation, if any.
- Classify each deviation by outcome:
  - accept,
  - negotiate,
  - reject.
- Assign each deviation a severity level using a consistent ordinal scale defined once at the top of the report.
- For each issue, state:
  - the agreement section,
  - the nature of the deviation,
  - why it matters under the template or playbook,
  - whether it aligns with or departs from the cover email,
  - the recommended response.
- If the source set includes multiple counterpart positions or multiple candidate edits, enumerate them first and then analyze each one separately.
- If the redline includes a deleted provision without a marked replacement, treat the omission itself as a deviation and explain the downstream effect.

## 5. Vertical / structural / temporal relationships

- Read the agreement vertically, not only clause-by-clause: definitions may alter operative terms later in the document, and an edit in one section may require a conforming change elsewhere.
- Check temporal sequencing in the agreement:
  - pre-employment conditions,
  - commencement,
  - ongoing service obligations,
  - post-termination restrictions,
  - survival provisions,
  - amendment and waiver mechanics.
- Identify whether a deviation changes the timing of rights or obligations, such as delayed vesting, accelerated payment, notice periods, cure periods, or restrictive covenant tails.
- If one change depends on another, note the dependency explicitly; do not analyze the downstream clause as if it were standalone.
- Treat exhibit, schedule, and plan references as part of the same vertical structure when they govern compensation, equity, or IP-related terms.

## 6. Output structure conventions

- Produce a redline-deviation-report style output organized by disposition:
  - reject,
  - negotiate,
  - accept.
- Define a severity scale at the start and apply it uniformly to every entry.
- For each entry, include:
  - section or clause reference,
  - template language or a concise description of it,
  - redline language or a concise description of it,
  - silent-change note, if applicable,
  - cover-email consistency check,
  - playbook classification,
  - severity,
  - recommended response.
- Include a separate subsection for silent changes, even when they also appear in the main classification groups.
- Include a separate subsection for cover email inconsistencies, even when they also appear in the main classification groups.
- Make the change identification robust in plain text; do not rely only on formatting marks surviving export. Use explicit textual change notation where needed.
- Surface substantive deletions, insertions, and replacements clearly enough that a reader can identify the deviation without comparing documents side by side.
- End with an explicit Recommended Actions block that tells the reviewer what to do next, who should do it, and when it should happen relative to the negotiation or signature milestone.
