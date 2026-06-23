---
name: draft-response-to-regulatory-inquiry-letter
task_id: data-privacy-cybersecurity/draft-response-to-regulatory-inquiry-letter
description: Regulatory inquiry responses involving health data sharing should be drafted by mapping each inquiry item to a corresponding response, preserving the distinction between the external response and any privileged internal analysis, and checking that representations align with the underlying factual record.
activates_for: [planner, solver, checker]
---

# Skill: Draft Response to California AG Formal Inquiry Letter on Health Data Sharing Practices

## 1. Subject-matter triage
- Confirm the inquiry is a formal regulatory request and identify the response deadline, production scope, and any stated preservation or certification requirements.
- Separate the work into two distinct deliverables at the outset: an external response and a privileged internal memo.
- Inventory the source set before drafting: inquiry letter, privacy notices, internal policies, vendor/data-sharing terms, technical or audit materials, incident or complaint history, and any privileged legal analysis.
- If the inquiry spans multiple business lines, products, data streams, time periods, or legal entities, enumerate them first and assign each to a response track before drafting.

## 2. Failure modes the skill is correcting
- The response omits or only implicitly addresses one or more inquiry items, creating avoidable follow-up demands.
- The draft overstates compliance, understates known gaps, or makes factual representations that do not match the underlying record.
- The external response and internal memo are blended, causing privilege waiver risk or an overdefensive public position.
- The draft ignores technical or operational evidence that may contradict policy-level statements about data collection, sharing, notice, consent, or opt-out handling.
- Privileged materials are not segregated, and withheld materials are not tracked with a defensible privilege/protection description.
- The internal memo diagnoses problems but does not translate them into concrete remediation steps tied to responsible owners and timing.

## 3. Legal frameworks / domain conventions that apply
- State consumer privacy enforcement authority: treat the inquiry as a formal regulatory record and draft every statement as if it may be read against the evidence later.
- Health-related data sharing rules: analyze whether disclosures, sales, sharing, processing, consent, notice, opt-out, purpose limitation, or vendor restrictions are implicated by the facts.
- Consumer rights workflows: assess whether access, deletion, correction, opt-out, and sensitive-data controls were implemented as represented.
- Preference signals and browser/device controls: verify whether any required global opt-out or similar signal handling is implemented and whether exceptions apply.
- Privilege and work product: segregate counsel-generated legal analysis and prepare withholding language and a privilege-log entry for any protected material.
- Regulatory response convention: answer in a formal, restrained tone; respond to the question asked; avoid volunteering unnecessary detail; acknowledge corrections or supplementation where warranted.
- Controlling authority must be named when a legal proposition is asserted, whether it is a statute, regulation, rule, or recognized doctrine.

## 4. Analytical scaffolds
- Read the inquiry letter first and extract each question, request, and deadline into a response matrix.
- For each inquiry item, identify the factual predicate, the supporting documents, the risk if the record is incomplete, and the proposed response position.
- Test policy statements against operational evidence; if they diverge, resolve the discrepancy before finalizing any external statement.
- For each legal risk point, name the governing authority before stating the conclusion.
- Distinguish facts that can be affirmatively stated from points that should be qualified, reserved, or answered by reference to a document production.
- For any withheld material, determine whether the basis is privilege, work product, confidentiality, or another protection, and record that basis consistently.
- In the internal memo, identify the enforcement exposure, explain the factual and legal driver, and convert each issue into a concrete remediation plan.

## 5. Vertical / structural / temporal relationships
- The response may need to describe past practices, current practices, and remediation underway; keep those time frames distinct.
- If changes were made after the inquiry date, identify them as post-inquiry remediation and avoid implying they were in place earlier.
- If the inquiry concerns one entity but the documents span affiliates, vendors, or service providers, trace the data flow vertically from collection to downstream disclosure and horizontally across recipients.
- Where multiple periods or products are involved, do not collapse them into one blended narrative; analyze each track separately and then reconcile them in the final drafting.
- If the company is responding while other regulatory or litigation matters are pending, calibrate the response to avoid inconsistent admissions across proceedings.

## 6. Output structure conventions
- Produce two deliverables: an external response letter and a privileged internal advisory memo.
- The external response should be formatted as a formal business letter on firm letterhead, with numbered or otherwise clearly keyed responses that track the inquiry letter item by item.
- Keep the external tone factual, measured, and responsive; include privilege assertions only where needed and identify withheld materials in a separate privilege-log style reference.
- The internal memo should be candid, attorney-facing, and organized around risk, factual gaps, likely regulator concerns, and remediation priorities.
- End the internal memo with an explicit Recommended Actions section that assigns each action to a responsible role and a timing anchor tied to the inquiry response or remediation window.
- Use industry-conventional headings rather than mirroring any hidden checklist; do not rely on the same section names used in the prompt.
- Ensure the named deliverable filenames exactly match the task instructions.
