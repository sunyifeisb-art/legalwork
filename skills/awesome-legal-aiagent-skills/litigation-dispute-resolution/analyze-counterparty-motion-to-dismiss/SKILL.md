---
name: analyze-counterparty-motion-to-dismiss
task_id: litigation-dispute-resolution/analyze-counterparty-motion-to-dismiss
description: Analyze a motion to dismiss by mapping each argument against the operative complaint count-by-count and identifying jurisdictional, pleading-standard, and contractual defenses that can be assessed and organized for opposition.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Motion to Dismiss — Issue Identification Memorandum

## 1. Subject-matter triage

- Confirm the procedural posture before analysis: identify the challenged pleading, the dismissal grounds invoked, and the relief sought.
- Separate threshold attacks from merits attacks, and separate motion arguments that target the case as a whole from those that target only particular counts, parties, or remedies.
- Inventory the source set up front, then read the complaint, motion, exhibits, operative agreement, declarations, and email record as a single factual and contractual universe.
- If the motion raises multiple procedural theories, enumerate them first and analyze each on its own procedural footing rather than collapsing them into one dismissal theory.
- Where only one count, one clause, or one jurisdictional basis is truly at issue, state that affirmatively and explain why the analysis is not broader.

## 2. Failure modes the skill is correcting

- Treating the motion’s headings as the complete issue list instead of testing each complaint count against each asserted ground for dismissal.
- Ignoring exhibits, attached correspondence, or contractual text that qualify, limit, or contradict the motion’s factual narrative.
- Conflating forum, venue, transfer, arbitration, and dismissal remedies when a clause or procedural rule supports only one of them.
- Reading a choice-of-law clause as if it automatically governs forum, jurisdiction, or non-contract claims.
- Blending ordinary plausibility review with heightened pleading standards for fraud, mistake, or similarly particularized claims.
- Assigning the same weight to jurisdictional defects, pleading gaps, and curable drafting defects.
- Stopping at issue spotting without identifying the downstream effect of each issue on the opposition strategy.

## 3. Legal frameworks / domain conventions that apply

- Apply the governing motion-to-dismiss standard: accepted facts are taken as true, reasonable inferences are drawn for the nonmovant, and dismissal is proper only if the complaint fails to state a plausible claim under the applicable rule.
- Apply the correct rule-based standard for any fraud-based or mistake-based claim, including any particularity requirement and the elements that must be pled with specificity.
- Treat personal jurisdiction, subject-matter jurisdiction, standing, and ripeness as threshold doctrines that must be analyzed independently of the merits.
- If a forum-selection or arbitration clause is invoked, identify the clause’s scope, the procedural vehicle used to enforce it, and the relief actually available under the controlling authority.
- Separate contract, tort, statutory, and equitable theories; analyze whether the contract text expressly reaches non-contract claims or only claims arising from the agreement itself.
- Treat limitations clauses, notice provisions, cure periods, integration clauses, and disclaimer language as distinct contractual defenses with distinct scopes.
- Where the source documents identify controlling authority, use those authorities; otherwise cite the governing rule, statute, or leading case supporting the proposition relied on.
- Do not state a legal conclusion without naming the authority that supports it.

## 4. Analytical scaffolds

- Read the complaint count-by-count and the motion argument-by-argument, then map each argument to the claim or party it targets.
- For each count, test each element against the pleaded facts and identify whether the defect is jurisdictional, threshold, element-level, or purely formal.
- Where the motion relies on contractual text, quote or paraphrase the operative clause only as needed to explain scope, and test whether the clause actually reaches the asserted claim.
- Where the motion relies on emails, declarations, or other extrinsic materials, determine whether they are properly considered on a motion to dismiss and whether they undercut or merely contextualize the pleadings.
- For each issue, state:
  - the claim, clause, or doctrine implicated;
  - the governing authority;
  - the source document and location that matters;
  - the practical consequence for the opposition.
- Each issue entry should end by tying the issue to the relevant scale or threshold in the record, identifying any interacting provision or document, and stating the likely litigation consequence.
- Use a uniform ordinal severity scale and apply it consistently across all issues:
  - Critical: threshold defect likely to dispose of a claim or the case absent a strong response
  - Significant: material pleading or contractual issue that could narrow claims or require amendment
  - Minor: curable or presentation-level defect with limited substantive effect
- Distinguish issues that warrant immediate opposition briefing emphasis from those that are background preservation points.

## 5. Vertical / structural / temporal relationships

- Track how the complaint, operative agreement, declarations, and emails interact over time; later communications may narrow or confirm earlier contractual positions.
- Note whether a clause applies at signing, during performance, after termination, or only upon dispute, because timing can change the clause’s scope.
- If multiple parties, counts, or agreements are in play, identify which provisions bind which actors and which facts are personal to a subset of them.
- Treat cross-references, defined terms, schedules, amendments, and incorporation language as part of the operative structure, not as optional background.
- If the motion depends on an alleged inconsistency between the complaint and extrinsic documents, analyze whether the inconsistency is real, material, and legally cognizable.

## 6. Output structure conventions

- Produce a concise executive summary first, identifying the strongest and weakest motion arguments and the overall opposition posture.
- Then organize the memo by issue, ordered from most to least severe.
- Use a consistent issue row format, such as:
  - Issue ID
  - Description
  - Governing Authority
  - Source Document and Section
  - Severity
  - Recommended Opposition Argument
- Every issue must include an explicit severity label from the stated ordinal scale.
- Every issue must identify the controlling rule, statute, regulation, or case relied on for the proposition stated.
- Every issue must include a short recommended opposition response or cure.
- End with a Recommended Actions section that assigns an action verb, a responsible role, and a timing anchor tied to the briefing schedule, hearing date, amendment deadline, or other procedural milestone.
- Keep the memorandum aligned to the task instructions and suitable for conversion into `motion-to-dismiss-issue-memo.docx`.
