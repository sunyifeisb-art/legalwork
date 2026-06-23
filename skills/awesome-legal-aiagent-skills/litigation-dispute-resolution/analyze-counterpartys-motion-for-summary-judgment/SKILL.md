---
name: analyze-counterpartys-motion-for-summary-judgment
task_id: litigation-dispute-resolution/analyze-counterpartys-motion-for-summary-judgment
description: Defending against a summary judgment motion requires identifying genuine factual disputes, exposing mischaracterizations in the movant's statement of undisputed facts, and pinpointing evidentiary deficiencies that preclude judgment as a matter of law.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty's Motion for Summary Judgment — Issue Identification Memorandum

## 1. Subject-matter triage

- Treat the motion, supporting statement of facts, exhibits, and cited record materials as the complete working set unless the task file adds supplemental evidence.
- If multiple claims, defenses, counts, contracts, or time periods are implicated, enumerate them first and analyze each on its own record; do not collapse distinct theories into one blended assessment.
- If the motion turns on expert testimony, affirmative defenses, procedural prerequisites, or damages methodology, isolate those issues as separate tracks before doing merits analysis.

## 2. Failure modes the skill is correcting

- Accepting the movant's characterization of deposition testimony without independently checking the cited excerpts against the full transcript
- Treating factual disputes as resolved when the movant presents one version, rather than confirming that the non-movant has admissible evidence establishing a genuine dispute
- Analyzing the motion brief without scrutinizing the statement of material facts paragraph-by-paragraph for mischaracterizations, overstatements, and unsupported assertions
- Overlooking credibility-dependent issues that are for the factfinder, not the court, to resolve
- Missing that a legal argument fails because the movant cites the wrong governing standard, omits an essential element, or relies on authority that does not fit the claim or defense
- Letting an evidentiary defect hide inside a merits argument instead of separating admissibility, materiality, and weight
- Failing to prioritize threshold defects that can defeat the motion outright before cataloging subsidiary factual disputes

## 3. Legal frameworks / domain conventions that apply

- Summary judgment is proper only when there is no genuine dispute as to any material fact and the movant is entitled to judgment as a matter of law under the governing civil procedure rule.
- The court must view the evidence and draw reasonable inferences in favor of the non-movant; it may not weigh evidence or make credibility determinations.
- A party disputing a fact must point to particular record materials; unsupported argument is not evidence.
- The movant's statement of facts, the opposition record, and any reply materials must be tested against the underlying exhibits, deposition transcripts, declarations, and authenticated documents.
- For claims or defenses with defined elements, analyze each element separately and identify which element is not negated or is affirmatively disputed.
- For expert testimony issues, assess qualification, reliability, and fit under the applicable admissibility standard, while keeping admissibility distinct from the underlying merits.
- For contract-based defenses such as excuse, impossibility, frustration, waiver, notice failure, or mitigation, assess the governing doctrine, the required contractual or common-law predicates, and any notice, foreseeability, or causation requirements.
- Cite the controlling authority for each legal proposition relied on, using the governing rule, statute, regulation, or leading case name that supports the proposition.

## 4. Analytical scaffolds

- Read the statement of material facts paragraph-by-paragraph; for each paragraph, verify the cited record and note whether it is accurate, incomplete, misleading, or unsupported.
- For every disputed or disputable fact, identify the exact supporting exhibit, transcript page and line, declaration paragraph, or other admissible material that creates the dispute.
- Test each legal theory in the motion against its governing elements and ask whether the movant has negated an essential element or only offered a disputed narrative.
- Separate threshold defects from ordinary disputes: jurisdictional, procedural, evidentiary, or legal-standard errors come first; fact conflicts and inference disputes come next.
- For each issue, close the analysis by tying the defect to the scale of the record evidence, the record source that interacts with it, and the consequence for the client if the court accepts or rejects the movant's theory.
- Flag any proposition that depends on witness credibility, disputed intent, contested interpretation of ambiguous documents, or competing expert views as a factfinder issue unsuitable for resolution on summary judgment.
- If the motion raises expert issues, evaluate whether the attack should target admissibility, weight, or both, and separate those arguments in the memo.
- If there are multiple claims or defenses, run the same scaffold once per claim or defense and preserve the distinct opposition strategy for each.

## 5. Vertical / structural / temporal relationships

- Track how the motion brief depends on the statement of facts, and how both depend on the cited record; a defect in any layer can undermine the others.
- Compare the movant's fact statement to the full cited excerpt, not just the sentence quoted in the brief, to detect truncation or selective quotation.
- If the timeline matters, reconstruct the sequence of events and identify whether the movant has skipped a date, collapsed separate events, or ignored later corrective evidence.
- Where one document modifies, supersedes, incorporates, or qualifies another, analyze the documents together rather than in isolation.
- If a defense depends on notice, cure, condition precedent, or mitigation, trace the chronology carefully and identify the earliest and latest relevant dates in the record.
- Where damages, exposure, or performance are time-sensitive, note whether the movant's theory depends on a particular period or snapshot that the record does not support.

## 6. Output structure conventions

- Use a prioritized issue memo format, ordered from highest-impact defects to lower-level disputes.
- Define a uniform severity scale at the top of the memo and apply it to every issue consistently.
- Include an opening summary table that maps each claim, defense, or theory to the best opposition strategy.
- For each issue, use a stable field structure: Issue ID | Motion Section / Fact Paragraph | Defect or Dispute | Supporting Record | Severity | Opposition Angle.
- Every entry should identify the legal rule or evidentiary standard implicated, the specific record support for the dispute, and the practical consequence for the opposition.
- End with a concise Recommended Actions block that assigns the next step to a role and ties it to the briefing or case-management timeline.
- Match the requested deliverable name exactly: `msj-issue-identification-memo.docx`.
