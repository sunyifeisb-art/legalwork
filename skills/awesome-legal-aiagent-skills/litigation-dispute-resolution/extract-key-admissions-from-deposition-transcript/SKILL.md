---
name: extract-key-admissions-from-deposition-transcript
task_id: litigation-dispute-resolution/extract-key-admissions-from-deposition-transcript
description: Extracting key admissions from a deposition transcript requires cross-referencing each admission against the governing record, prior sworn statements, and related contemporaneous documents to identify inconsistencies and assess the admission’s utility for motion practice, trial impeachment, and settlement analysis.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Admissions from Deposition Transcript — Admission Summary Memorandum

## 1. Subject-matter triage

- Confirm the witness, case posture, and deposition scope before extracting admissions.
- Identify whether the transcript includes corrections, errata, exhibits, or linked discovery responses that may alter the meaning of an answer.
- Determine whether the memo is aimed at motion practice, impeachment, settlement leverage, or all three; the framing and emphasis should follow that use case.
- If multiple transcripts, witnesses, or document sets are in scope, enumerate them first and analyze each separately rather than blending them into a single narrative.

## 2. Failure modes the skill is correcting

- Cataloguing isolated statements without assessing their significance against the rest of the record.
- Treating a statement as an admission without checking whether it conflicts with prior sworn answers, contemporaneous documents, or later clarifying testimony.
- Missing admissions buried in background, foundation, or housekeeping questioning because the review focuses only on the “main” liability topics.
- Failing to distinguish between a useful impeachment point and a fact that is merely background or cumulative.
- Ignoring transcript errata, readbacks, or follow-up clarifications that change the impeachment value of the original answer.
- Writing a narrative summary that describes the testimony but does not tell the reader how to use it.

## 3. Legal frameworks / domain conventions that apply

- Deposition testimony is sworn testimony and may be used as an admission of a party-opponent or for impeachment under the applicable evidence rules, including Federal Rule of Evidence 801(d)(2) and Rule 613 where relevant.
- Prior sworn discovery responses that conflict with deposition testimony are prior inconsistent statements and can support impeachment; where the governing rule allows, they may also have substantive use.
- Admissions that bear on elements such as knowledge, intent, notice, control, reliance, causation, or damages are often more consequential than generic factual concessions.
- A contradiction between deposition testimony and contemporaneous written communications can undercut credibility even if it is not itself a formal impeachment exhibit.
- Transcript corrections can create a separate impeachment issue if the original answer and the correction tell different stories.
- Use the controlling authority that fits the proposition being made; do not state evidentiary or procedural conclusions without tying them to the governing rule or doctrine.

## 4. Analytical scaffolds

- Read the transcript in full before finalizing any category labels; later answers may narrow, explain, or neutralize earlier statements.
- Build the analysis around issues or elements, not page order.
- For each candidate admission, capture:
  - source location;
  - the witness’s precise answer in substance;
  - the fact admitted;
  - the legal or factual issue it affects;
  - the supporting or conflicting record materials;
  - the practical use of the admission.
- Cross-check every significant admission against prior discovery responses, affidavits, declarations, interrogatory answers, document production, and relevant correspondence.
- Treat inconsistency as a separate analytical step: identify the two statements, explain the clash, and note whether the discrepancy appears material, explainable, or potentially tactical.
- If the record includes multiple witnesses or multiple versions of the same topic, state the full set before analysis and assess each witness/version on its own terms.
- If the source materials include a numeric exposure, date, quantity, deadline, or threshold that bears on significance, use that figure to scale the importance of the admission without inventing new arithmetic.
- End each entry with the concrete downstream consequence: impeachment value, motion support, settlement leverage, discovery follow-up, or trial use.
- Conclude with action-oriented recommendations directed to the appropriate role and tied to the next procedural milestone or urgency in the record.

## 5. Vertical / structural / temporal relationships

- Track how the testimony unfolds across time: initial answer, clarification, qualification, correction, and any later retreat.
- Distinguish between present knowledge, past knowledge, and reconstructed memory; the temporal frame often determines whether the admission is substantive or merely impeaching.
- Note whether the admission concerns a relationship between documents, actors, events, or business units, because those vertical connections often create the strongest contradiction.
- When a later answer changes an earlier one, preserve both versions and explain whether the later statement cures, sharpens, or worsens the inconsistency.
- If the transcript references exhibits or prior documents, identify the sequence in which the witness encountered them and whether the sequence affects credibility.

## 6. Output structure conventions

- Use an issue-driven memo format rather than a chronological recap.
- Include an opening overview that states the memo’s purpose, the witness or witnesses covered, and the main themes of the admissions.
- Organize the body by topic, element, or theme.
- For each entry, use a consistent row or bullet format containing:
  - Source location;
  - Admission;
  - Record cross-reference;
  - Significance;
  - Recommended use.
- Include a separate section for contradictions with prior sworn statements, and identify the specific prior response or sworn statement that conflicts.
- Include a separate section for transcript corrections or errata if they affect the analysis.
- If multiple witnesses or transcript segments are included, provide a distinct subsection for each before any cross-cutting synthesis.
- Use an ordinal severity label for each entry, defined once at the top of the memo, so the reader can prioritize the strongest admissions quickly.
- End with a Recommended Actions block that lists concrete next steps, the responsible role, and the relevant deadline, milestone, or urgency anchor drawn from the source materials.
- Keep the writing concise, but make each entry complete enough that a litigator can use it without rereading the transcript.
