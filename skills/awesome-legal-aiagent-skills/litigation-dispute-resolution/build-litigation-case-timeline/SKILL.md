---
name: build-litigation-case-timeline
task_id: litigation-dispute-resolution/build-litigation-case-timeline
description: A litigation case timeline must capture every dated event across the source materials in strict chronological order, annotate each entry for strategic significance, and flag gaps that may indicate missing documentation or non-production.
activates_for: [planner, solver, checker]
---

# Skill: Build Litigation Case Timeline — Chronological Event Summary for Breach of Contract and Fraud Defense

## 1. Subject-matter triage
- Treat the assignment as a fact-development and summary-judgment support task, not a mere date extraction exercise.
- Build the chronology from all source types that may contain dated facts: pleadings, correspondence, internal communications, deposition materials, schedules, logs, expert materials, and attachments.
- If the source set covers more than one claim, defense, counterclaim, or time period, handle each explicitly rather than folding them into a single blended narrative.
- Use the most specific supportable date, date range, or temporal marker in the record; do not invent precision where the documents do not support it.

## 2. Failure modes the skill is correcting
- Mining only the pleadings and missing earlier or later dated events in internal communications, logs, deposition testimony, or expert materials.
- Listing dates without explaining why they matter to breach, fraud, notice, reliance, intent, damages, or defenses.
- Failing to reconcile the chronology against testimony, especially where a witness’s recollection conflicts with document dates.
- Collapsing distinct events into one entry, which hides the sequence needed for liability, defenses, and summary judgment.
- Omitting gaps in periods where business activity appears active but documentation is sparse.
- Ignoring accrual- or notice-sensitive dates that may control limitation, waiver, or contractual timing arguments.
- Using a narrative summary when the task calls for a forensic timeline with source anchoring.

## 3. Legal frameworks / domain conventions that apply
- A litigation timeline is a proof map: each entry should connect to an element, defense, or damages theory, not just record occurrence.
- In breach-of-contract disputes, formation, amendment, performance, notice, cure, termination, and payment dates are usually legally operative.
- In fraud defenses or fraud-based claims, dates showing knowledge, intent, reliance, misstatement, concealment, and discovery are often critical.
- Accrual analysis depends on the controlling cause of action and its governing statute or doctrine; where a limitations issue may arise, flag the earliest plausible accrual event and the source that supports it.
- Deposition testimony should be used as corroboration or impeachment against contemporaneous documents, not as a substitute for them.
- Expert opinions must be tied to preexisting facts; an opinion that depends on later facts or unclear timing should be flagged as vulnerable.
- Gaps in a communication chain may support missing-production or spoliation analysis only if the surrounding record suggests expected continuity and preservation relevance.

## 4. Analytical scaffolds
- First, identify all discrete date-bearing items in the source set and sort them into a master chronology.
- When more than one relevant claim, defense, party, period, or accrual theory exists, enumerate the full set before analyzing the timeline, then apply the same extraction logic to each.
- For each event, capture:
  - date or date range;
  - event description;
  - source document(s);
  - strategic significance;
  - any contradiction, ambiguity, or follow-up needed.
- Classify each entry as favorable, unfavorable, or neutral to the client’s litigation position, with a short explanation tied to the record.
- Surface internal communications that bear on knowledge, intent, reliance, notice, or awareness of a problem.
- Cross-check dates in deposition excerpts against contemporaneous documents and flag mismatches, memory gaps, or admissions that change the timeline’s meaning.
- Identify periods where the record suggests ongoing activity but the dated documents thin out; note whether that gap is material to preservation, completeness, or a missing-production inference.
- Where a date is uncertain, state the uncertainty and use the narrowest defensible range rather than guessing.
- After the chronology, synthesize the key date dependencies for summary judgment: what must be proven, what can be conceded, and what sequence issues matter most.
- End with concrete next-step recommendations tied to counsel or the relevant business witness and anchored to a litigation milestone or filing deadline if one appears in the record.

## 5. Vertical / structural / temporal relationships
- Formation or execution dates define the baseline obligations; later amendments, waivers, extensions, and course-of-performance evidence may alter those obligations.
- Notice, cure, rejection, reservation-of-rights, and termination dates are often legally operative and should be placed precisely in sequence.
- In fraud-related defenses, the timeline should distinguish between the date of the statement, the date of reliance, the date of discovery, and any later corrective disclosure.
- Events should be presented in true chronological order, with related sub-events nested only if the nesting does not obscure sequence.
- If a later source recounts an earlier event, do not treat the recounting date as the event date unless the later recounting itself is the operative fact.

## 6. Output structure conventions
- Use a primary chronology table with columns in this order: Date | Event Description | Source Document(s) | Strategic Assessment.
- Include a separate gap-analysis section that identifies periods of sparse or missing documentation and explains why the gap matters.
- Include a separate summary section that organizes the most important dates by claim, defense, or issue and explains the summary-judgment relevance of each cluster.
- Use concise, litigation-style language; each entry should be self-contained and readable without consulting the source set.
- Preserve the file naming convention specified in the task instructions and produce the requested `.docx` deliverable.
