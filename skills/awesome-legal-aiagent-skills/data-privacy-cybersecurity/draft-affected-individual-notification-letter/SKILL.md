---
name: draft-affected-individual-notification-letter
task_id: data-privacy-cybersecurity/draft-affected-individual-notification-letter
description: Healthcare breach notification letters fail when the agent does not anchor factual representations to the forensic investigation findings and does not flag inconsistencies between the notification template, incident memo, and compliance matrix in an accompanying cover memo.
activates_for: [planner, solver, checker]
---

# Skill: Draft Affected Individual Notification Letter for Healthcare Data Breach

## 1. Subject-matter triage

- Treat this as a two-deliverable drafting task: a plain-language affected-individual notice and a separate attorney-facing cover memo.
- Draft the notification letter first, using the forensic findings as the factual anchor; prepare the memo only after the letter has a complete, internally consistent factual basis.
- If the source set contains multiple incident summaries, timelines, or versions of the event narrative, enumerate them before reconciling differences.
- If only one incident, one notice population, and one notification pathway are in scope, state that explicitly and proceed on that basis.

## 2. Failure modes the skill is correcting

- The letter becomes generic because it is not grounded in the incident’s confirmed facts.
- The writer imports a template’s assumptions without testing them against the forensic findings and the other source documents.
- The letter overstates or understates the compromised data categories, creating avoidable legal and reputational risk.
- The cover memo is omitted, or it merely repeats the letter instead of identifying cross-document inconsistencies and compliance concerns.
- The draft ignores timing, recipient, and content constraints that are specific to healthcare breach notice practice.
- The memo flags issues abstractly but does not tie each issue to a concrete source-document mismatch and a practical fix.
- The deliverables are written as if the notice itself should contain legal analysis, instead of keeping analysis in the memo.

## 3. Legal frameworks / domain conventions that apply

- HIPAA Breach Notification Rule: 45 C.F.R. Part 164, Subpart D governs individual breach notices and related content, timing, and administration.
- Individual notice content convention: the letter should explain what happened, what information may have been involved, what the recipient should do, what the organization is doing, and how to contact the organization.
- Plain-language drafting convention: use direct, lay-readable language and avoid technical or forensic jargon unless it is necessary and immediately explained.
- Factual accuracy convention: the notice must track the forensic record; a breach notice is not the place to speculate about categories not confirmed by the investigation.
- Cross-document consistency convention: the notice, incident memo, template, and compliance matrix should tell one coherent story on scope, timing, and remediation.
- Attorney-facing memo convention: the cover memo should identify discrepancies, explain why they matter under the applicable notice rule, and recommend how to resolve them before mailing.
- If the source documents identify a specific timing rule, privacy standard, or operational checkpoint, carry that rule into the draft and memo rather than paraphrasing it away.

## 4. Analytical scaffolds

- Read the forensic report first and extract the confirmed incident narrative, discovery date, exposure window, data categories actually implicated, affected population, and remedial steps already taken.
- Compare the notice template against the forensic findings and identify any template language that is too broad, too narrow, or inconsistent with the confirmed facts.
- Compare the incident response memo and the compliance matrix against the same factual baseline; note any mismatch in description, timing, audience, or remediation status.
- Draft the letter so every factual statement is supportable by the source set; if a fact is not confirmed, either omit it or frame it cautiously.
- Keep the letter focused on recipient impact and next steps; reserve legal risk analysis, inconsistency analysis, and drafting rationale for the memo.
- In the memo, itemize each inconsistency, state why it matters under the applicable notice requirements, and recommend a concrete fix before issuance.
- When there are multiple affected data categories, multiple exposure periods, or multiple notice obligations, handle each separately rather than collapsing them into one generalized statement.
- If the record is incomplete, identify the gap and draft conservatively around it, rather than filling it with assumptions.

## 5. Vertical / structural / temporal relationships

- Use the forensic report as the highest-fidelity factual source for the notice narrative.
- Use the template as a form reference only; do not let boilerplate displace source-specific facts.
- Use the incident response memo to detect shifts in characterization, scope, or response posture.
- Use the compliance matrix to check whether the notice content and timing align with the documented compliance path.
- Where the documents conflict, explain in the memo which version appears most reliable, what remains unresolved, and what must be confirmed before mailing.
- Track the sequence of events chronologically: incident, discovery, containment, assessment, notice preparation, and planned mailing.
- If the notice timing is tied to a regulatory or contractual milestone, preserve that timing relationship in the memo and in any internal drafting notes.

## 6. Output structure conventions

- Produce exactly two files: a notification letter and a cover memo.
- The notification letter should be formatted as a recipient-facing letter, with clear headings or paragraphs as needed, and written in plain language.
- The letter should include only the facts and instructions needed by the affected individual; do not embed legal analysis or internal debate.
- The cover memo should be attorney-facing, privileged in tone, and organized around identified discrepancies, compliance risks, and suggested fixes.
- The memo should end with a concise recommended actions section that assigns each next step to the appropriate role and ties it to a practical timing anchor from the source set or the notification deadline.
- Keep the deliverable filenames exactly as instructed: `notification-letter-draft.docx` and `cover-memo.docx`.
- Before finishing, ensure the letter contains operative notice content rather than a summary of what the notice should say, and ensure the memo contains actual issue-spotting and remediation guidance rather than a restatement of the facts.
