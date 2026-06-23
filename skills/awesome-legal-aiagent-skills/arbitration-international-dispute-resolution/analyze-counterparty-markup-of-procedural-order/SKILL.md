---
name: analyze-counterparty-markup-of-procedural-order
task_id: arbitration-international-dispute-resolution/analyze-counterparty-markup-of-procedural-order
description: Ensures a counterparty's procedural order markup is analyzed against the case management conference record, tactical motivations are surfaced, and aggregate procedural consequences are assessed.
activates_for: [planner, solver, checker]
---

# Skill: Procedural Order Counterparty Markup Analysis

## 1. Subject-matter triage

- Treat the Tribunal’s clean draft, the Respondent’s markup, and the case management conference record as the governing source set.
- Identify whether the markup is a true comparison task, a procedural issue-spotting task, or both; if multiple procedural changes are present, enumerate them before analysis and analyze each separately.
- If the markup is presented as a redline or tracked change, ensure the analysis can survive export loss by reading the text itself, not only formatting.
- If the request includes a memo only, still ground the memo in the underlying markup-by-markup comparison and not a summary of themes alone.

## 2. Failure modes the skill is correcting

- Treats each change in isolation and misses whether it departs from what the parties already agreed in conference or in prior procedural directions.
- Reviews the markup at face value and fails to infer the tactical purpose of seemingly neutral edits.
- Misses procedural impropriety where the markup tries to expand matters that should be handled elsewhere in the arbitration process.
- Understates the combined effect of multiple revisions on timetable, burden, confidentiality, or enforceability.
- Flags due process concerns in the abstract but does not connect them to the specific procedural mechanism being altered.
- Describes issues without translating them into a concrete response posture or client consequence.
- Relies on formatting-only markup cues that may disappear in a `.docx` conversion.
- States legal conclusions without naming the procedural authority or practice rule supporting them.

## 3. Legal frameworks / domain conventions that apply

- Case-management agreements: procedural positions adopted in conference or reflected in a prior order should be treated as the baseline; any deviation in the markup should be identified against that baseline and described as such.
- Procedural sequencing: proposals that re-open pleaded issues, alter established hearing mechanics, or add new dispute dimensions should be assessed for whether they belong in the markup at all.
- Bifurcation principles: splitting liability and quantum can be efficient in some cases and dilatory in others; the analysis should assess whether the underlying issues are factually intertwined and whether the proposal shifts leverage or timeline.
- Expert examination mechanics: if concurrent expert testimony or another agreed hearing format appears in the source materials, its removal or replacement should be treated as a departure from the agreed procedure.
- Tribunal administrative support limits: a tribunal assistant or secretary is generally expected to perform administrative functions; any proposal to expand into substantive research, drafting, or decision support raises due process and enforceability concerns.
- Confidentiality and data sensitivity: broad procedural demands that would expose commercially sensitive or financial information should be tested for proportionality and narrowed where appropriate.
- Interim relief triggers: if a proposed procedural change could materially increase dissipation, concealment, or loss risk, that consequence should be noted as a separate procedural issue and connected to possible emergency relief.
- Controlling authority: every procedural conclusion should be tied to the governing procedural order, the conference record, applicable institutional rules, or recognized arbitral guidance named in the source set or in established practice.

## 4. Analytical scaffolds

- Start with a numbered inventory of every substantive markup change in scope. If only one change exists, say so expressly.
- For each change, identify: the exact proposal, the governing baseline it alters, whether it is a true deviation or merely a clarification, the likely tactical motivation, the procedural risk, and the recommended posture.
- For each issue, close the analysis by tying it to a concrete scale or consequence visible in the record, cross-referencing the affected clause or prior agreement, and stating the downstream effect for the client.
- Use a uniform ordinal severity scale defined once at the top of the memo and apply it consistently to every entry.
- Distinguish between changes that are objectionable on substance, changes that are objectionable because they are out of sequence, and changes that are objectionable because they create enforceability or fairness problems.
- When assessing bifurcation or sequencing changes, evaluate both legal efficiency and strategic delay; do not treat a timing move as neutral if it reshapes leverage.
- When assessing confidentiality or disclosure revisions, consider whether the proposal broadens access to commercially sensitive materials beyond what the proceeding needs.
- When assessing tribunal-support provisions, ask whether the language preserves administrative support or crosses into substantive adjudicative support.
- When assessing expert-hearing provisions, check whether the markup preserves any prior agreement on simultaneous expert examination or substitutes a different format.
- When assessing counterclaim or expanded-claim language, verify whether the change belongs in a procedural order at all or instead requires pleading amendment or separate permission.
- Where the markup suggests a strategic gain, state the likely motivation plainly; where the motivation is ambiguous, identify the competing inferences.

## 5. Vertical / structural / temporal relationships

- Compare each markup against the clean draft, then against any conference record or prior order that the clean draft incorporates.
- Map the direction of travel for each change: accelerates, delays, narrows, expands, shifts burden, or reallocates decision authority.
- Assess cumulative timing effects across all changes together, not just item by item.
- If one change interacts with another, say so explicitly; avoid treating linked edits as independent.
- If the markup introduces a stage-gate, sequencing condition, or phased process, assess how that affects the rest of the timetable and whether it functions as a delay tactic.
- If the markup alters who may access information or who may perform a task, identify the resulting vertical change in authority or confidentiality.

## 6. Output structure conventions

- Use a memo format with a short executive summary, then an issue register, then a cross-reference section, then a cumulative effects section, then a recommendations section.
- Prepend a legend defining the severity scale once, then use those labels uniformly for every issue.
- In the issue register, give each entry: issue label, severity, deviation status, tactical motivation, governing authority or prior agreement, risk, and recommended response.
- Include a dedicated cross-reference table that maps each challenged change to the clean-draft provision or prior procedural agreement it alters.
- Include a cumulative effects section that addresses timetable, burden, confidentiality, fairness, and enforceability together, not in isolation.
- If the markup contains redline text, make the substantive change visible in plain text conventions in the memo so the reader can identify the edit without relying on formatting.
- End with a Recommended Actions section that gives concrete next steps, assigns the responsible role, and ties each step to the relevant procedural milestone or urgency.
- Keep the memo adversarial but precise: label what should be accepted, rejected, or accepted with modification, and explain why.
