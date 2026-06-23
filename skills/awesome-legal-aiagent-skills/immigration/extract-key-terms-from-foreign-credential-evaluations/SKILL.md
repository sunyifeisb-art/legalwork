---
name: extract-key-terms-from-foreign-credential-evaluations
task_id: immigration/extract-key-terms-from-foreign-credential-evaluations
description: Cross-referenced extraction from multiple foreign credential evaluations and supporting academic records, where the output should surface discrepancies between evaluators and between evaluations and the underlying records, rather than only summarizing each evaluation's conclusion.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Foreign Credential Evaluations

## 1. Subject-matter triage

Treat the source set as a multi-document credential record, not a single evaluation exercise. First separate by evaluand, then by degree, then by issuer so records are not cross-mixed.

1. Enumerate each evaluand present in the file set.
2. For each evaluand, enumerate each evaluation report, transcript, expert letter, and controlling notice that relates to that person.
3. If only one evaluand exists, say so affirmatively and proceed on that basis.

Identify the controlling educational standard before extracting details. If a notice or filing sets a specific credential threshold, that standard governs the comparison.

## 2. Failure modes the skill is correcting

- The extraction stops at the conclusion and omits the factual basis that makes the conclusion reliable or vulnerable.
- The evaluator’s qualifications, methodology, and stated area of expertise are treated as boilerplate rather than as credibility inputs.
- Multiple evaluations for the same degree are summarized separately without comparing their conclusions, methods, or internal assumptions.
- Transcript data, program length, field of study, and institutional identity are not checked against the stated equivalency.
- The record’s required educational level is not compared to the claimed equivalency, leaving a hidden qualification mismatch.
- Separate persons’ credentials are blended into one summary, which obscures who earned what and which discrepancies attach to whom.

## 3. Legal frameworks / domain conventions that apply

- In employment-based immigration filings, foreign credential evaluations are used to show that a foreign degree is equivalent to the U.S. credential required by the case record.
- The probative value of an evaluation depends on the evaluator’s qualifications, the rigor of the methodology, and the fit between the written analysis and the underlying academic record.
- A course-by-course analysis is usually more defensible than a bare conclusory equivalency statement when the file depends on precision.
- Program duration matters because duration and level of study are part of the equivalency analysis; a shorter program generally requires stronger supporting context.
- Association membership in a recognized credential-evaluation body is relevant to credibility, but it is not itself dispositive.
- Where an approval notice, labor filing, or job requirement sets a specific educational standard, the extracted equivalency must be tested against that standard.
- A discrepancy between the evaluation and the transcript is a reason to flag the record and recommend a clarifying or supplemental submission.

## 4. Analytical scaffolds

For each evaluand, run the same extraction sequence.

1. Identity and document map
   Identify the person, the evaluation issuer, the evaluator, the foreign institution, the degree, and each supporting academic record tied to that person.

2. Per-document extraction
   Extract the degree title, field of study, program length, dates of attendance if stated, claimed U.S. equivalency, methodology, and any stated evaluator qualifications or memberships.

3. Transcript cross-check
   Compare the evaluation’s description of the program against the transcript and related academic records. Flag mismatches in degree title, field, duration, credits, institution, dates, or completion status.

4. Methodology assessment
   Note whether the report is general or course-by-course, whether it explains its equivalency logic, and whether it gives enough detail for the filing purpose.

5. Cross-evaluation comparison
   If more than one evaluation addresses the same or comparable credential, compare the conclusions, assumptions, and methods. Flag inconsistencies even if the bottom-line equivalency is similar.

6. Control-standard alignment
   Compare each claimed equivalency against the educational level demanded by the filing record. Flag any gap between what is required and what the evaluation actually supports.

7. Resolution recommendation
   For each discrepancy, state the most likely cure: corrected transcript, supplemental records, revised evaluation, or a clarifying explanation.

## 5. Vertical / structural / temporal relationships

Track how the credential sits in the academic sequence and in time.

- Distinguish completed degrees from in-progress study.
- Note whether the program duration supports the claimed level of study.
- Preserve chronology where it bears on equivalency: attendance dates, graduation dates, evaluation dates, and filing dates.
- If multiple documents describe the same credential differently over time, report the later inconsistency and whether it affects reliability.

## 6. Output structure conventions

Use a credential-extraction summary organized by evaluand. Do not merge different people into one table.

Include, for each evaluand:

- a short document inventory;
- a per-evaluation extraction table;
- a discrepancy analysis section;
- a recommendation section.

Use a consistent per-evaluation table with columns equivalent to:

Evaluator | Organization | Membership / Credentials | Foreign Degree | Institution | Program Duration | Claimed U.S. Equivalent | Methodology | Transcript Match | Issues

Keep the issues field concrete and document-linked. Distinguish:
- internal inconsistency within the evaluation,
- inconsistency with the transcript or other academic record,
- inconsistency with another evaluation,
- mismatch with the controlling educational standard.

End with a concise action list that states what should be corrected, supplemented, or reissued, and by whom if that role is identified in the source set.
