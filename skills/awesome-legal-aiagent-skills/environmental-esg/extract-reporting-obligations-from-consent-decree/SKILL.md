---
name: extract-reporting-obligations-from-consent-decree
task_id: environmental-esg/extract-reporting-obligations-from-consent-decree
description: Guides construction of a comprehensive consent decree obligation register and companion risk memo by extracting reporting and compliance deadlines, identifying sequencing dependencies, and flagging tracker errors and ambiguities.
activates_for: [planner, solver, checker]
---

# Skill: Extract Reporting Obligations from Consent Decree — Build Compliance Calendar and Obligation Register

## 1. Subject-matter triage
- Treat the main decree, all appendices, schedules, exhibits, and incorporated attachments as potentially operative unless the text clearly excludes them.
- Separate obligations by track: reporting, monitoring, certification, remediation, project milestones, notice-and-cure, dispute-resolution steps, and payment/penalty events.
- If an internal tracker or preliminary calendar is supplied, reconcile it against the decree text before drafting the final register.

## 2. Failure modes the skill is correcting
- Excerpts only the main body and misses appendices or incorporated schedules that supply the real deadlines, protocols, and milestones.
- Lists obligations without identifying trigger events, dependencies, or conditions precedent, causing missed sequencing.
- Accepts a tracker at face value instead of testing dates, offsets, trigger language, and obligation labels against the source text.
- Fails to flag ambiguous, undefined, or internally inconsistent terms that create compliance risk.
- Collapses distinct obligations into one bucket, obscuring independent reporting or certification duties.
- Produces a risk memo with descriptions only, but no concrete recommendations tied to timing and responsibility.

## 3. Legal frameworks / domain conventions that apply
- Environmental consent decrees are court-enforceable instruments; deadlines, reporting duties, and milestone commitments can carry stipulated penalties and contempt risk.
- Incorporated appendices, exhibits, and schedules may be legally operative and can refine or supersede general body text where the decree says so.
- Reporting obligations often include periodic reports, certifications, notices of completion, milestone submissions, and proof-of-compliance attachments, each with its own trigger and due date.
- Sequencing matters: a notice, approval, inspection, certification, or prerequisite deliverable may need to occur before a later milestone becomes due or compliant.
- Excuse, extension, and dispute-resolution provisions are typically narrow and procedural; they should be treated as mandatory steps, not informal requests.
- Where the decree identifies a governing regulatory standard, permit condition, or technical protocol, use that authority as the benchmark for the obligation and note it in the register.

## 4. Analytical scaffolds
- Read the decree end-to-end, then read each appendix or attachment as if it were part of the operative order.
- First enumerate every distinct obligation, party, trigger, and due date before analyzing dependencies or risks.
- For each obligation, capture: obligation type, source location, responsible party, trigger, deadline, deliverable, frequency, prerequisite steps, and consequence for non-performance.
- Preserve the distinction between absolute dates and relative deadlines tied to an event, approval, notice, or completion milestone.
- Test each deadline against nearby provisions for cross-references, extensions, tolling, cure periods, and penalty accrual language.
- Reconcile the source text against any tracker or draft calendar: identify mismatched dates, missing obligations, misread triggers, and duplicated entries.
- For each ambiguity, state the competing interpretations, the compliance-safe reading, and whether clarification from the counterparty or court is advisable.
- For each issue in the risk memo, pair the problem with its downstream consequence and a recommended next step.

## 5. Vertical / structural / temporal relationships
- Track hierarchy: if an appendix, schedule, or exhibit contains more specific instructions than the body, treat the specific instruction as controlling to the extent the decree incorporates it.
- Separate parallel compliance streams: remediation work, reporting work, and project work may run on different clocks and should not be merged.
- Sequence dependencies: identify obligation chains where one filing, approval, certification, or milestone unlocks the next.
- Temporal clustering: when several obligations share a trigger period, flag the cluster as a heightened operational risk even if each individual deadline is facially manageable.
- Penalty logic: note where one missed event may cascade into later missed events or additional stipulated penalties.

## 6. Output structure conventions
- Prepare the obligation register as a chronological table with one row per discrete obligation.
- Use fields that operationalize compliance: ID, obligation, source citation, responsible party, trigger, due date, cadence, dependencies, deliverable, penalty or consequence, status, and notes.
- Do not merge separate deadlines into a single row unless the decree clearly treats them as one composite obligation.
- Prepare the risk memo as an issue-oriented advisory document with a clear severity scale defined once at the top and applied uniformly to each entry.
- For each risk item, include: severity, obligation references, issue description, why it matters, and a recommended action with a responsible role and timing anchor.
- Close the memo with a concise recommended-actions section that prioritizes immediate calendar fixes, clarification requests, and follow-up steps.
- Name the deliverables exactly as instructed: `obligation-register.docx` and `compliance-risk-memo.docx`.
- Before finishing, ensure the register exists as the primary deliverable and is complete, then produce the memo as the secondary deliverable.
