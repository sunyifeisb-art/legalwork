---
name: hls-identify-healthcare-facility-lta-issues
task_id: healthcare-life-sciences/identify-issues-in-healthcare-facility-license-transfer-agreement
description: Reviews a healthcare facility license transfer agreement to identify issues involving governing law conflicts, government certification gaps, indemnification structure, certificate-of-need reporting obligations, adverse-action disclosure requirements, and force majeure risks.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Healthcare Facility License Transfer Agreement

## 1. Subject-matter triage
- Treat the facility’s physical location and operating licenses as the anchor for regulatory analysis; contractual governing law does not displace the licensing regime that actually regulates operations.
- Separate state licensure, federal or program certification, and ownership-change enrollment into distinct approval tracks; do not assume one filing satisfies the others.
- Identify whether the agreement concerns one facility, one license set, or multiple operational authorizations; if multiple approvals or periods are in scope, analyze each separately rather than using a generic pass.

## 2. Failure modes the skill is correcting
- Indemnification cap structure and survival period are under-analyzed even though these provisions directly determine whether the buyer has meaningful recourse for post-closing regulatory exposures.
- Licenses and other approvals that are not separately enumerated in the transfer scope are overlooked, creating revenue gaps when regulators require separate approvals for specific service lines.
- Legal conclusions are stated without tying them to the controlling licensing rule, certification requirement, disclosure obligation, or contractual text.
- Issues are described qualitatively but not tied to scale, interaction with another document, or downstream consequence.
- Memo-style deliverables omit an explicit severity hierarchy or leave recommendations implicit rather than operational.

## 3. Legal frameworks / domain conventions that apply
- Governing law versus license law: a healthcare facility license is issued under state law by a state regulatory agency; the state where the facility is physically located governs the licensing obligations regardless of the contractual choice of a different state's law for dispute resolution; the contractual governing law choice does not change which state's licensing regulations apply to the facility.
- Government certification as separate from state licensure: a state facility license transfer does not automatically transfer federal or state program certification; a separate change-of-ownership process or similar enrollment step may be required; failure to complete that process before or at closing can interrupt reimbursement; facilities with significant government payor revenue face elevated risk from this gap.
- Change-of-ownership timing: the applicable enrollment or ownership-change process may require advance filing and can take weeks or months; the timing relative to the anticipated closing date must be addressed in the agreement's pre-closing covenants.
- Certificate-of-need volume shortfall reporting: if the facility received approval based on projected service volumes, failure to meet those volumes may trigger a reporting obligation to the relevant program; failure to report is a regulatory violation independent of whether the volume shortfall itself was a condition violation.
- Adverse action disclosure requirements: some licensing agencies require applicants for license transfers to disclose conditional licenses, adverse actions, or enforcement proceedings at other facilities in the buyer's portfolio; failure to disclose can result in denial of the transfer.
- As-is clause and representations conflict: an agreement that includes both an as-is disclaimer of warranties and specific representations covering the same subject matter contains a structural contradiction; the relationship between these provisions must be resolved in favor of one or the other.
- Indemnification survival period for healthcare: healthcare regulatory enforcement actions may arise months or years after the conduct at issue; indemnification survival periods should be evaluated against the likely timing of regulatory claims.
- Force majeure and regulatory delays: characterizing regulatory delays as a force majeure event can allow the party responsible for obtaining regulatory approvals to delay closing indefinitely; this provision should be removed or limited to specific, time-bounded external events outside the party's control.

## 4. Analytical scaffolds
1. Governing law conflict: identify which state's law governs the facility license; identify the contractual governing law choice; explain the conflict between the two and its practical consequences.
2. Government certification: flag the change-of-ownership gap separately from the state license transfer; identify any required filing or enrollment step and the revenue exposure during the gap.
3. Licenses and approvals: identify all approvals required for the facility's actual operations; assess whether the transfer scope covers each of them.
4. Certificate-of-need volume shortfall: identify any approval conditions tied to service volumes; assess whether required reporting was provided to the relevant program; note the reporting obligation as an ongoing covenant.
5. Adverse action disclosure: identify any conditional licenses or adverse actions at portfolio facilities that may require disclosure to the licensing agency in the transfer application.
6. As-is versus representations: identify the structural conflict and recommend resolution — either the as-is clause yields to the representations, or the representations must be narrowed to be consistent with the as-is scope.
7. Indemnification: assess cap structure and survival period adequacy relative to regulatory enforcement timelines.
8. Force majeure: flag regulatory delays as a force majeure event if present; recommend removal or limitation to specific bounded events.

## 5. Vertical / structural / temporal relationships
- Read the agreement vertically: definitions, transfer conditions, closing deliverables, reps and warranties, indemnity, termination, and force majeure often interact on the same regulatory risk.
- Read the documents temporally: pre-closing filing obligations, closing conditions, post-closing cure periods, and survival periods may create gaps even if each clause is acceptable in isolation.
- Read across the source set: license transfer terms, schedules of approvals, disclosure schedules, and indemnity exclusions may shift responsibility or reveal an unstated exception.
- When multiple licenses, facilities, service lines, or approval steps appear, list them first, then test each against the same analytical scaffold.
- For every issue, include the clause location, the regulatory or contractual rule, the specific interaction with another provision or document, and the practical effect on closing or operations.

## 6. Output structure conventions
- Produce an issues memorandum organized by severity using an ordinal scale defined up front, such as Critical / High / Medium / Low; apply the same scale to every issue.
- For each issue, use a consistent entry structure: clause or section reference; issue description; controlling authority or contractual rule; severity; interaction with other provision(s); client consequence; recommended revision.
- Every legal proposition must be anchored to a controlling authority, rule, statute, regulation, or recognized licensing requirement; do not state a conclusion without naming the basis.
- Every issue must close with the practical consequence for the client, not just the legal defect.
- Every issue must be paired with a concrete recommendation written as an action directive, identifying the responsible role and timing tied to closing, filing, or regulatory review.
- End with a short Recommended Actions block that converts the highest-severity findings into immediate next steps.
- Use industry-conventional memo headings rather than reproducing any checklist or rubric language.
- Keep the memo tight and operative; avoid background exposition that does not advance the issue analysis.
