---
name: extract-privileged-communications-from-production-set
task_id: litigation-dispute-resolution/extract-privileged-communications-from-production-set
description: Reviewing a flagged document batch for privilege and clawback issues requires applying attorney-client privilege and work product doctrine to each flagged document, assessing whether the governing clawback order provides adequate protection, and producing both a privilege log and a clawback memorandum with recommended actions.
activates_for: [planner, solver, checker]
---

# Skill: Extract Privileged Communications from Production Set — Privilege Log and Clawback Memorandum

## 1. Subject-matter triage

- Read the governing clawback order first, then any protective order, confidentiality agreement, engagement letter, subpoena, or discovery protocol that defines the privilege-review regime.
- Read the flagged production set in context of the underlying dispute, investigation, or regulatory matter before classifying any item.
- Treat email threads, attachments, draft markups, and forwarded chains as separate review units where privilege may differ within the same sequence.
- If only one review universe exists, state that expressly; otherwise enumerate the review universe before analysis and keep the log aligned to that set.

## 2. Failure modes the skill is correcting

- Marking a document as privileged without completing the full element-by-element analysis for the doctrine invoked.
- Missing the clawback order’s procedure, timing, and notice obligations, or assuming protection extends beyond its stated scope.
- Collapsing mixed email chains or attachment sets into one determination when different messages or attachments have different privilege status.
- Ignoring parallel proceedings, investigation context, or prior disclosures that may affect waiver, scope, or confidentiality.
- Treating business communications as privileged merely because counsel is copied, without testing whether legal advice was actually sought or rendered.
- Overstating work product protection where the document was created in the ordinary course of business rather than in anticipation of litigation.
- Failing to distinguish full privilege, partial privilege, and no privilege, or failing to separate factual material from opinion material.
- Producing a memo that describes the review but does not make concrete clawback recommendations or procedural next steps.

## 3. Legal frameworks / domain conventions that apply

- Attorney-client privilege requires a confidential communication between attorney and client, or their functional equivalents, made for the purpose of obtaining or providing legal advice; each element must be supported by the record.
- Work product doctrine protects materials prepared because of anticipated litigation; opinion work product receives stronger protection than fact work product.
- Dual-purpose communications require a primary-purpose assessment: if legal advice predominates, privilege may attach; if business advice predominates, it may not.
- Inadvertent disclosure analysis turns on the governing rule or order, including whether reasonable steps were taken to prevent disclosure and whether prompt notice and rectification occurred.
- Federal Rule of Evidence 502 and any entered clawback order govern the effect of disclosure and any limits on waiver, subject to the order’s text.
- Subject-matter waiver risk must be assessed in light of what has already been produced, what remains withheld, and whether production was selective or inadvertent.
- Ethical and evidentiary obligations concerning privilege logs, privilege assertions, and clawback demands are controlled by the governing order, the Federal Rules of Civil Procedure, Federal Rule of Evidence 502, and any applicable local rule or standing order.
- Any legal conclusion in the memo should be tied to the controlling rule, order, or doctrine by name rather than stated as a bare conclusion.

## 4. Analytical scaffolds

- Start with the governing order and review instructions, then identify the operative standards for privilege, clawback, logging detail, notice, and return or destruction.
- Identify each document’s date, author, recipients, subject matter, custodial context, and relationship to the underlying matter before classifying it.
- For each item, test attorney involvement, confidentiality, purpose of the communication, litigation anticipation, and whether the item is an original, draft, attachment, or forwarded message.
- For email chains, analyze each message separately and note whether later circulation changes the status of earlier messages or attached material.
- For mixed documents, separate privileged legal analysis from non-privileged business or operational content and determine whether partial redaction or partial withholding is appropriate.
- For work product, ask whether the document was created because of litigation risk or in anticipation of litigation, and whether it reflects counsel’s mental impressions or mainly factual material.
- For clawback candidates, assess whether inadvertent disclosure appears covered by the order, whether prompt notice is required, and whether the receiving party must return, sequester, or destroy the material.
- Draft each privilege-log entry so it identifies the document without revealing the privileged substance: enough detail to justify the claim, not enough to disclose the advice.
- In the memorandum, separate findings, privilege-log recommendations, clawback steps, and residual waiver or litigation risk.

## 5. Vertical / structural / temporal relationships

- Distinguish upstream communications that generated legal advice from downstream circulation that merely transmitted it.
- Distinguish contemporaneous communications from later summaries, memorializations, or post hoc rationalizations.
- Distinguish original privileged communications from attachments, where the attachment may be independently non-privileged even if the cover email is privileged.
- Distinguish document status across time: created, circulated, produced, challenged, clawed back, and potentially re-produced under court order.
- If multiple proceedings or investigations are implicated, map which communication relates to which matter and whether a privilege claim travels across matters.

## 6. Output structure conventions

- Prepare a privilege log with one entry per withheld or partially withheld document.
- Use a conventional log row structure: Date | Author | Recipient(s) | Document Type / Subject Summary | Privilege Type | Basis / Notes.
- Where partial privilege applies, note the redacted portion or withheld segment and the doctrine supporting the partial withholding.
- Prepare a separate clawback memorandum to the lead partner that contains: a concise findings summary, document-by-document recommendations, the procedural steps for invoking clawback under the governing order, waiver-risk assessment, and recommended next steps.
- If a document is not privileged, state that clearly and explain why it should not appear as a withheld item.
- If the review identifies only one review set or one relevant proceeding, say so expressly; if more than one, keep the log and memo aligned to the numbered universe identified at the outset.
- End the memorandum with an explicit Recommended Actions section that assigns each action to counsel or the relevant internal role and ties it to the applicable deadline, notice period, or litigation milestone.
- Match the output files and filenames specified in the task instructions exactly: `privilege-log.docx` and `clawback-memo.docx`.
