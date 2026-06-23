---
name: assess-litigation-hold-scope-for-custodian-identification
task_id: litigation-dispute-resolution/assess-litigation-hold-scope-for-custodian-identification
description: A litigation hold memo should identify likely custodians of potentially relevant information, map the principal sources of their data, and flag preservation risks such as auto-deletion, off-boarding, or system migrations that may affect collection.
activates_for: [planner, solver, checker]
---

# Skill: Assess Litigation Hold Scope for Custodian Identification — Custodian Recommendation Memorandum

## 1. Subject-matter triage
- Treat the record set as a preservation-assessment problem: identify who likely has relevant information, where that information lives, and what could cause it to disappear before collection.
- Start from the trigger materials to fix the preservation onset and the subject-matter boundary of the hold.
- If the materials point to multiple groups, time periods, systems, or entities, enumerate them first and analyze each separately rather than collapsing them into a single generalized hold scope.
- Distinguish between likely custodians, data stewards, and third parties; each may require a different preservation step.

## 2. Failure modes the skill is correcting
- Limiting custodians to named parties and missing decision-makers, operational personnel, communications personnel, IT personnel, and other data owners with non-duplicative information.
- Naming custodians without tying them to concrete sources, so the hold cannot be implemented in practice.
- Ignoring retention settings, auto-deletion, migrations, device turnover, or off-boarding that can destroy relevant ESI before collection.
- Failing to coordinate with business and IT teams on preservation steps, especially for departing employees and shared systems.
- Overlooking outside holders of relevant materials, including vendors, consultants, and other counterparties who may need separate notice.
- Stating preservation conclusions without identifying the governing duty to preserve or the authorities that support the action.

## 3. Legal frameworks / domain conventions that apply
- The duty to preserve arises when litigation is reasonably anticipated; in practice, that may occur before suit is filed after a demand, dispute escalation, internal claim assessment, or regulatory inquiry.
- Preservation analysis should be tied to relevance and proportionality, using the dispute themes, known actors, and document systems in the source materials as the scope boundary.
- Custodian identification should prioritize people with firsthand knowledge, approval authority, operational responsibility, or communications about the disputed conduct.
- Common source categories include corporate email, chat and collaboration tools, cloud storage, shared drives, mobile devices, enterprise applications, and paper files.
- Departing or terminated employees require prompt preservation coordination because device return, account closure, and record transfer can create spoliation risk.
- Third-party preservation may be necessary where vendors, consultants, or partners hold unique information.
- Preservation failures can trigger sanctions under the court’s inherent authority and the federal ESI framework, including Federal Rule of Civil Procedure 37(e) where electronically stored information is lost.
- The memo should reflect the applicable retention and hold controls identified in the materials, including any corporate records policy, IT hold protocol, or account-suspension process.
- When citing a legal proposition, name the controlling rule, statute, regulation, or recognized authority rather than stating the conclusion abstractly.

## 4. Analytical scaffolds
- Build the hold scope from four linked questions: who knows, what they used, where it sits, and what could delete it.
- For each likely custodian, record name if known, role/title, why the person matters, likely data sources, and the immediate preservation steps needed.
- Separate custodians into practical categories such as leadership/decision-makers, operational participants, communications participants, IT/data stewards, and outside holders.
- For each category, identify whether the person is active, departed, or likely to depart soon, and adjust the preservation recommendation accordingly.
- Review system and records materials for hold-relevant controls: auto-delete settings, retention overrides, backup limitations, migration schedules, and account deactivation workflows.
- Identify whether forensic imaging, export, or suspension of deletion should occur before ordinary collection.
- If a source document names a specific legal or policy authority for preservation, use that authority; otherwise anchor the recommendation in the general duty to preserve and standard ESI preservation practice.
- Convert each risk into an action: issue notice, suspend deletion, preserve devices, coordinate with IT, confirm receipt, or extend notice to a third party.

## 5. Vertical / structural / temporal relationships
- Structure the memo by custodian category first, then individual custodian or holder within each category.
- For each entry, move from role to source systems to risk to required action so the reader can implement the hold without inference.
- Track temporal sensitivity explicitly: immediate actions for departing employees or expiring systems, near-term actions for active custodians, and follow-up actions for third parties.
- Where systems interact, note dependencies, such as account deactivation affecting email retention or migrations affecting shared-drive integrity.
- Where one custodian’s information overlaps with another’s, identify the overlap so the preservation plan avoids gaps and redundant steps.

## 6. Output structure conventions
- Prepare the document as a litigation hold memorandum suitable for external circulation or internal approval.
- Use conventional memo headings rather than a rigid rubric-derived checklist; keep the presentation operational and implementation-oriented.
- Include a short opening that states the preservation trigger, the hold purpose, and the scope assumptions.
- Include a custodian analysis section with one entry per identified custodian or holder, each entry covering role, rationale, data sources, and immediate preservation actions.
- Include a systems and records section addressing deletion controls, backups, migrations, device management, and off-boarding risks.
- Include a third-party preservation section where outside holders of relevant information are identified.
- End with a concise action plan that assigns responsibility to counsel, business leads, or IT and gives a timing anchor tied to the urgency shown in the materials.
- Keep the output aligned to the required file name: `litigation-hold-memo.docx`.
