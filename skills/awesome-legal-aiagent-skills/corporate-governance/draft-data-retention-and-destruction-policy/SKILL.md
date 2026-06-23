---
name: data-retention-destruction-policy-cross-border-digital-health
task_id: corporate-governance/draft-data-retention-and-destruction-policy
description: Comprehensive data retention and destruction policy for a company with cross-border operations, covering storage limitation and erasure obligations, pseudonymized data treatment, multi-jurisdictional destruction verification, and the interaction between erasure rights and statutory retention obligations, with a cover memo flagging compliance gaps and transaction deadline implications.
activates_for: [planner, solver, checker]
---

# Skill: Comprehensive Data Retention and Destruction Policy for Cross-Border Company

## 1. Subject-matter triage

- Identify the operating footprint first: parent entity, EU subsidiaries, data-processing locations, and whether each category is held by the company, a processor, or a subprocesser.
- Separate operational data categories before drafting: patient or customer records, financial records, employee records, communications, device and system logs, analytics datasets, backups, and disaster-recovery copies.
- Confirm whether the source materials indicate any transaction timeline, closing date, or policy-adoption deadline that controls sequencing of the draft and memo.
- If the materials identify multiple jurisdictions or regulatory regimes, draft to the highest applicable retention floor while preserving local-law overrides where mandatory.

## 2. Failure modes the skill is correcting

- Drafting retention schedules that use open-ended phrasing such as “as long as necessary” without converting each category into a finite, purpose-linked period.
- Treating pseudonymized datasets as outside retention and erasure constraints when linkage keys, crosswalks, or other reasonable means of re-identification remain available.
- Failing to reconcile erasure requests with legal-retention duties, which leaves operational teams without a rule for when deletion is required and when retention must continue.
- Omitting backups, disaster-recovery systems, and third-party environments from destruction procedures, so “deletion” is incomplete in practice.
- Leaving litigation holds uncapped or unreviewed, which creates disproportionate retention and weakens governance.
- Drafting a policy that cannot support a transaction compliance representation because it lacks specific, operable controls and review steps.
- Producing a memo that recites issues without mapping each gap to a concrete policy fix, owner, and timing point.

## 3. Legal frameworks / domain conventions that apply

- Storage limitation under EU data protection law requires personal data to be kept in identifiable form no longer than necessary for the processing purpose; the policy should translate that principle into category-specific retention periods.
- Purpose limitation and data minimization require each retained category to be tied to a specified purpose and a documented retention rationale; secondary uses such as analytics, research, or archiving should have separate treatment.
- Right to erasure is not absolute; retention may continue where necessary for compliance with a legal obligation or for establishment, exercise, or defense of legal claims. Cite the applicable EU data protection provisions and any local mandatory-retention rules identified in the materials.
- Pseudonymized data can remain personal data if re-identification is reasonably possible; if the company retains keys, crosswalks, or comparable linkage data, the retention analysis must apply to the combined system.
- Health-sector and employment-sector records often carry statutory minimum retention periods; where multiple rules overlap, apply the longest mandatory period unless local counsel advises a narrower lawful approach.
- Litigation holds should be proportionate, purpose-limited, and periodically reviewed; the policy should require escalation from legal to records governance and a documented release process.
- Destruction should be verifiable across live systems, archives, backups, disaster-recovery environments, and vendor-hosted systems; require written certification from each holder or processor confirming completion.
- If the source materials describe a representation, covenant, or condition tied to compliance with data-protection laws, the policy should be written to support that representation before the relevant transaction milestone.

## 4. Analytical scaffolds

- Build the policy around an operational retention schedule rather than narrative principles alone.
- For each data category, specify:
  - the purpose of processing,
  - the retention period or retention trigger,
  - the legal or regulatory basis,
  - the responsible owner,
  - the destruction method,
  - any exception for legal hold, audit, or dispute preservation.
- Replace any indefinite retention language with a finite period or a clearly defined event-based trigger, then note any mandatory floor that prevents shorter retention.
- Test each category against erasure rights by asking:
  1. Is the data subject request within scope?
  2. Does a legal obligation require retention?
  3. Is the data needed for a claim, defense, audit, or safety purpose?
  4. If partial deletion is required, what must be suppressed, anonymized, or restricted instead?
- For pseudonymized datasets, trace whether identification can occur through separately held linkage material; if yes, retain and delete on the same timetable as the underlying personal data unless a separate lawful basis justifies longer retention.
- For backups and disaster-recovery copies, distinguish operational overwrite cycles from true destruction and specify when expired data must be excluded from restoration sets or irretrievably rendered inaccessible.
- For destruction verification, require proof from internal IT and each external processor, and require the certificate to identify the dataset, destruction date, method, and systems covered.
- For litigation holds, define who may impose them, who must be notified, how scope is narrowed, and when periodic review occurs.
- For the cover memo, organize each gap as: current deficiency, compliance impact, policy fix, open input needed, and timing consequence if adoption is delayed.
- When drafting the policy, use “must” for mandatory rules, “may” only for discretionary exceptions, and “should” for procedural guidance.

## 5. Vertical / structural / temporal relationships

- Treat the transaction milestone, if any, as a hard sequencing constraint: policy drafting, internal review, and adoption must be completed before the deadline tied to the compliance representation.
- Make the legal function the owner of exceptions and holds, records management the owner of retention implementation, IT the owner of destruction execution, and privacy or compliance the owner of oversight and certification tracking.
- Ensure the hold process overrides ordinary retention only for the affected scope and only while the hold remains necessary; when the hold ends, normal schedules resume without re-approval.
- Where local law and group policy differ, the local mandatory rule governs that subsidiary’s minimum retention, while the group policy may set a higher uniform standard if operationally justified.
- If the source materials contain multiple entities or jurisdictions, analyze each affected entity and location separately before drafting a unified policy architecture.

## 6. Output structure conventions

- Draft the policy as a stand-alone governance document applicable to the parent company and all relevant subsidiaries, using conventional sections such as:
  - purpose and scope,
  - definitions,
  - roles and responsibilities,
  - retention principles,
  - category-based retention schedule,
  - erasure and restriction handling,
  - legal hold process,
  - destruction and certification,
  - vendor and cross-border handling,
  - audit, training, and periodic review,
  - exceptions and escalation.
- The retention schedule should be the operational core of the policy and should read as an implementable table or table-like section, not as prose only.
- The cover memo should be addressed to the relevant legal or governance lead and should concisely identify each compliance gap, how the policy addresses it, any unresolved local-law questions, and the adoption deadline if one exists.
- Use a direct, implementation-focused tone suitable for legal, compliance, records, and IT stakeholders.
- Cite controlling authorities for each legal proposition relied on, using the authority name and section or article where available; do not state conclusions without the supporting rule.
- End the memo with action-oriented recommendations that assign a responsible role and a timing anchor tied to review, approval, adoption, or closing.
- Before finalizing, confirm that the policy file contains operative policy text and that the memo file contains gap analysis and recommendations, not merely summaries.
