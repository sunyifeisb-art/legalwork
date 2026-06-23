---
name: identify-rfe-issues-scenario-01
task_id: immigration/identify-rfe-issues/scenario-01
description: H-1B request-for-evidence issue identification memo where each agency-identified concern is analyzed for its impact on petition approvability, with a response strategy and evidence recommendation for each issue organized by RFE category.
activates_for: [planner, solver, checker]
---

# Skill: H-1B RFE Issue Identification Memorandum

## 1. Subject-matter triage
- Treat the RFE as a category-by-category issue-spotting exercise, not a merits brief.
- First extract every agency-identified concern in the order presented, and treat each as a distinct issue unless the notice clearly groups subpoints under one heading.
- If the record contains multiple versions of the same document, identify which version the agency likely relied on and whether later materials cure the concern.
- If the file contains a prior denial or prior RFE, identify whether the current notice is repeating the same concern or raising a new one.

## 2. Failure modes the skill is correcting
- Agents paraphrase the RFE at a high level instead of breaking out each agency concern and tying it to the approvability element it affects.
- Internal inconsistencies in job descriptions, charts, postings, support letters, and organizational materials are described as clerical differences without explaining why they matter to specialty occupation, employer control, or petition credibility.
- The memo states that an issue is “addressed” without identifying the specific evidence that would actually answer the agency’s request.
- Risk is assessed globally instead of issue-by-issue, which hides which concerns are easily cured and which threaten denial if left unresolved.
- The analysis stops at diagnosis and does not convert the diagnosis into a concrete response plan.
- The memo cites legal concepts vaguely, without naming the rule, regulation, or authority that gives the concept force.

## 3. Legal frameworks / domain conventions that apply
- An RFE requires a direct, specific response to each stated deficiency; a generic narrative is not a meaningful response under USCIS adjudication practice.
- Specialty occupation analysis turns on whether the position normally requires a degree in a specific specialty and whether the petition record supports that requirement under INA § 214(i) and 8 C.F.R. § 214.2(h)(4).
- Employer requirements reflected in internal postings, job descriptions, and recruiting materials are probative of what the employer actually requires; inconsistency between those materials and the petition theory can undercut the specialty-occupation showing.
- The employer-employee relationship is assessed through right-to-control evidence, including organizational structure, reporting lines, supervision, and the beneficiary’s placement in the hierarchy.
- A corrected organizational chart or similar support should be internally consistent, current, authenticated by an authorized signatory, and aligned with the title and reporting structure in the petition record.
- Prior denial reasoning matters because the response should directly engage any prior grounds that remain relevant; ignoring them leaves the same defect unaddressed.
- Credibility and consistency are recurring adjudicative concerns: the record should read as one coherent story across forms, letters, charts, and exhibits.

## 4. Analytical scaffolds
1. RFE parsing: restate each agency concern in the sequence used by the notice, and preserve the notice’s category structure.
2. Issue framing: for each concern, state the implicated legal element, the factual trigger, and why it matters to approvability.
3. Record cross-check: compare the RFE against the petition forms, support letters, organizational materials, job postings, resumes, and any prior decision letters to identify the exact inconsistency or evidentiary gap.
4. Severity calibration: assign each issue an ordinal severity rating and explain it in one line using the likely denial impact and ease of cure.
5. Evidence mapping: for each issue, identify the specific evidence type that would directly answer the concern, separating existing-record evidence from newly prepared evidence.
6. Response strategy: specify how the response should be framed for that issue, including whether the best path is clarification, supplementation, correction, or concession and reframing.
7. Prior-denial engagement: if a prior denial appears in the file, identify the prior ground and state how the current response should distinguish, cure, or rebut it.
8. Outcome assessment: conclude with the combined approval risk and identify any issue that remains materially unresolved.

## 5. Vertical / structural / temporal relationships
- Track how petition materials relate vertically: petition form, employer letter, job description, organizational chart, worksite or project description, and supporting exhibits should be mutually consistent.
- Track whether the RFE concerns a present fact, a historical fact, or a future assurance; use the correct time frame when assessing whether evidence can cure the issue.
- When the agency questions structure, map the reporting chain above and below the beneficiary position and note whether the record shows who supervises, who evaluates, and where the role sits operationally.
- When the agency questions the nature of the position, compare the petitioned role to internal postings, similar roles, and actual business needs to determine whether the claimed specialty requirement is supported or contradicted.
- When the agency questions prior history, map the sequence of earlier filings, prior decisions, and any changed facts that may now matter.

## 6. Output structure conventions
- Use a memorandum format organized by RFE category, following the notice’s sequence.
- Begin with a short severity legend using an ordinal scale such as Critical / High / Medium / Low, and apply that scale consistently to each issue.
- For each issue, include:
  - Issue heading tied to the RFE category
  - Concern stated in plain English
  - Legal element implicated
  - Record inconsistency or evidentiary gap, if any
  - Severity rating with a one-line rationale
  - Response strategy
  - Evidence needed, separated into existing-record materials and new materials to prepare
  - Any document that should be corrected or replaced
- When citing legal conclusions, name the governing authority or adjudicative rule supporting the proposition, including the relevant statute, regulation, or recognized USCIS framework.
- If the RFE references prior denial grounds, include a separate sub-entry explaining how the response should address them.
- End with an overall risk assessment and a concise recommendation on whether the record can likely be cured, needs substantial supplementation, or remains denial-prone.
- Close with a Recommended Actions block listing the concrete next steps, using imperative verbs and assigning each action to the responsible role or signatory where the source record makes that role clear.
