---
name: draft-markup-of-proposed-stipulation-of-facts
task_id: tax/draft-markup-of-proposed-stipulation-of-facts
description: Redlining a proposed stipulation of facts requires a paragraph-by-paragraph response that accepts, revises, objects to, or proposes additions to each paragraph based on factual accuracy and strategic impact on the client's legal theory.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Proposed Stipulation of Facts

## 1. Subject-matter triage (only if applicable)

- Treat the draft as a litigation markup, not a summary. The work product must track the proposed stipulation in sequence and preserve paragraph-level traceability.
- If the draft is a proposed stipulation submitted in a tax case, assume each sentence may carry evidentiary and strategic consequences for the record; do not merge paragraphs or “clean up” the document by theme.
- If the stipulation touches computations, tax years, documentation timing, or code provisions, verify each against the supporting materials before choosing a response.

## 2. Failure modes the skill is correcting

- Responding in bulk categories instead of paragraph by paragraph, which hides paragraph-specific factual and strategic problems.
- Accepting a fact because it sounds plausible even though the supporting documents do not confirm it.
- Overlooking a mismatch between the stated tax method, rate, or amount and the workpapers or return position.
- Treating a provision as available without checking whether it was in force for the relevant tax year.
- Missing the timing significance of recordkeeping implementation or project-tracking changes for substantiation.
- Producing markup that depends only on visible formatting and cannot be read reliably if exported or converted.
- Issuing objections or revisions without tying them to the governing tax rule, evidentiary principle, or document mismatch that justifies the change.

## 3. Legal frameworks / domain conventions that apply

- **Paragraph-by-paragraph markup mechanics:** Each paragraph must receive a discrete response: accept, revise, object, or propose addition. No paragraph may be skipped, collapsed, or answered only at a section level.
- **Tax-fact verification:** Every factual assertion, date, amount, percentage, method description, or temporal sequence must be checked against the source documents before acceptance.
- **Method and rate consistency:** If the draft refers to a tax computation method, verify that the stated method matches the return position, workpapers, and any rate or formula tied to that method.
- **Provision timing and availability:** If the draft references a deduction, credit, or other tax attribute tied to a code provision, confirm that the provision applied in the relevant tax year and that any sunset, repeal, or transition rule is accounted for.
- **Recordkeeping and substantiation timing:** Where the draft discusses documentation systems, contemporaneous records, or time/project tracking, identify whether the referenced system existed during the relevant period and how that affects substantiation strength.
- **Controlling authority:** State the legal or evidentiary rule that supports a revision or objection, such as the applicable Internal Revenue Code provision, Treasury Regulation, Tax Court evidentiary practice, or Federal Rule of Evidence, rather than relying on conclusory phrasing alone.

## 4. Analytical scaffolds

- Work in the same order as the proposed stipulation. Do not reorder paragraphs.
- For each paragraph:
  - identify the exact proposition asserted;
  - compare it to the supporting documents;
  - determine whether it is accurate, incomplete, overstated, or strategically harmful;
  - assign one response code: accept, revise, object, or propose addition;
  - if not accepting, provide replacement language or a targeted objection.
- When revising, preserve any accurate core fact and alter only the inaccurate, overbroad, or strategically harmful portion.
- When objecting, state the reason in document-grounded terms and identify the governing rule or evidentiary basis for the objection.
- When proposing an addition, tie the proposed fact to a source document and explain why its omission matters to the record.
- Use a robust plain-text change convention so every edit is visible even if styling is lost in export. Mark deletions, insertions, and substitutions explicitly, and include a short rationale with each non-accepted change.
- If multiple paragraphs raise related issues, analyze each paragraph separately before synthesizing any cross-paragraph theme.
- For any numeric statement, verify the number exactly as stated; do not infer, estimate, or “close enough” the figure.
- Keep the markup tactically aligned with the client’s litigation theory while remaining faithful to the source record.

## 5. Vertical / structural / temporal relationships (only if applicable)

- If the draft references a sequence of tax years, events, or implementation dates, analyze the chronology explicitly and preserve the order in which the facts unfold.
- If a recordkeeping system was implemented on a particular date, distinguish pre-implementation periods from post-implementation periods when assessing substantiation.
- If one paragraph depends on another paragraph’s premise, note the dependency so the later paragraph is not accepted on a premise that the earlier paragraph undermines.
- If a paragraph ties a factual statement to a computation or claimed benefit, verify the underlying method, inputs, and period together rather than in isolation.

## 6. Output structure conventions

- Produce a paragraph-by-paragraph markup in the same sequence as the proposed draft.
- For each paragraph entry, include:
  - paragraph number;
  - original text;
  - response code;
  - if accepted, a brief acceptance note;
  - if revised, objected to, or supplemented, the basis for the response;
  - proposed revised, replacement, or added language;
  - a short rationale anchored to the supporting documents or governing authority.
- Use explicit plain-text change markers so the reader can identify every modification without relying on formatting.
- If adding a new paragraph, place it after the last proposed paragraph and identify it as an addition.
- End with a short, actionable recommendations block that identifies what should be corrected, by whom, and on what timeline relative to the next filing or negotiation milestone.
- Preserve deliverable naming discipline: the operative markup file is the primary output; any notes or summaries are secondary and must not substitute for the markup itself.
