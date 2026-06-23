---
name: draft-markup-counterparty-saas-agreement
task_id: intellectual-property/draft-markup-of-counterparty-saas-agreement
description: Redlined SaaS agreement and order form with commentary markup and a risk-prioritized commentary memo for a specialized life sciences data platform, evaluated against the company playbook and a security assessment.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Counterparty SaaS Agreement

## 1. Subject-matter triage

- Treat the agreement and the order form as one combined deal set; identify which document controls on conflict and whether any exhibit, policy, or order-term language silently overrides the base form.
- Separate customer business terms, security/privacy terms, and operational terms before drafting; do not blur them into one generic SaaS pass.
- If the source set contains multiple ordered forms, statements of work, addenda, or policy attachments, enumerate them first and mark each governing relationship before analyzing changes.
- If only one agreement set is in scope, state that explicitly and proceed on that basis.

## 2. Failure modes the skill is correcting

- Marking up the SaaS agreement without tailoring the analysis to a life sciences data platform context, where data security, integrity, regulated-use support, and operational continuity matter more than ordinary subscription terms.
- Ignoring the security assessment when drafting privacy and information-security edits, which leaves contractual commitments below the vendor’s actual capabilities or below the company’s risk tolerance.
- Reading the order form and master agreement separately, causing uncaught conflicts on scope, fees, service levels, renewal, data use, or precedence.
- Delivering a redline without a companion commentary memo, leaving the deal team without severity-ranking, negotiation posture, or issue sequencing.
- Making edits that are visually obvious in Word but unreadable after export; every material change must remain legible from the text alone.
- Omitting a clear recommendation where the issue analysis is otherwise sound.

## 3. Legal frameworks / domain conventions that apply

- SaaS agreements for specialized life sciences data platforms should address customer ownership of input data, limits on provider use of that data, and ownership of any outputs, derivatives, or platform-generated materials.
- Data security and privacy provisions should be tested against the security assessment, internal playbook, and any stated control environment; where the contract promises more than the assessment supports, narrow the promise or add a remediation obligation.
- For regulated or validation-sensitive workflows, the agreement should preserve auditability, traceability, change control, access logging, retention, exportability, and cooperation with inspections or investigations to the extent the platform is used in such contexts.
- Clinical and research data integrity terms should align with recognized electronic-record and signature controls where relevant, including traceability, record integrity, and reliable retention practices.
- Liability and indemnity provisions should reflect the heightened consequences of data security failures, confidentiality breaches, service outages, and data integrity events, not only ordinary subscription disputes.
- Exit and transition terms should require portable export, reasonable transition assistance, and certified deletion or retention limits after termination.

## 4. Analytical scaffolds

- Contract-by-contract review: identify the operative agreement hierarchy, then review the order form, MSA, security addendum, privacy terms, and any incorporated policies together.
- Playbook alignment: for each standard SaaS topic, compare the source language against the internal position and draft the narrowest change needed to close the gap.
- Security-assessment integration: for each security representation, obligation, incident procedure, or subcontractor control, compare the promise to the assessment and flag any mismatch.
- Regulated-data lens: test whether the terms preserve audit access, validation support, record integrity, and defensible retention/termination handling.
- Redline drafting: make the operative text change, then attach a short rationale comment to each substantive edit.
- Commentary memo drafting: rank issues by severity, explain why each matters, and give the negotiation path most likely to close the gap efficiently.

## 5. Vertical / structural / temporal relationships

- Check whether fees, term, auto-renewal, usage caps, suspension rights, service credits, and termination rights in the order form interact with the base agreement in a way that changes the economics or leverage of the deal.
- Check whether security obligations, breach notice, incident cooperation, audit rights, data return, and deletion timing fit together coherently over the lifecycle of the relationship.
- Check whether confidentiality, data-use restrictions, analytics rights, de-identification language, and feedback clauses create an unintended right to commercialize or repurpose customer data.
- Check whether service-level remedies, indemnity triggers, limitation-of-liability carveouts, and insurance requirements align across the document set and do not leave a major failure mode outside the remedy structure.
- Check whether transition assistance, exit export, deletion certification, and retention exceptions are sequenced so the customer can actually retrieve data before access ends.
- If a point depends on timing, state the timing anchor from the source documents; if no timing anchor exists, anchor the recommendation to the next commercial milestone or signature/launch date.

## 6. Output structure conventions

- Produce the redlined agreement first, then the commentary memo.
- Use a plain-text-safe redline convention in addition to any Word styling so the changes remain readable after conversion:
  - [DELETED: removed text]
  - [INSERTED: added text]
  - [REPLACED: old → new]
- Attach a short [Rationale: …] comment to every substantive change.
- In the redline, preserve the contract’s numbering and structure unless the change requires a structural rewrite; if you reorder provisions, explain why in a comment.
- The commentary memo should use an ordinal severity scale defined once at the top, then apply that scale consistently to every issue.
- Each issue entry in the memo should include:
  - severity,
  - a concise issue statement,
  - the source-term interaction or clause conflict,
  - the practical consequence for the company,
  - the preferred negotiation position,
  - a short fallback position if the counterparty resists.
- Where the source documents contain a specific governing rule, policy, statute, regulation, or internal control reference, cite that authority by name and section in the commentary when making the related legal or compliance point.
- Keep the memo risk-prioritized rather than chronological; place the highest-impact gaps first.
- End the memo with a clear Recommended Actions block that assigns each next step to a role and ties it to a deadline, closing, or signature milestone.
- Before finishing, confirm the primary deliverable files are complete, non-empty, and contain operative contractual edits rather than a description of them.
