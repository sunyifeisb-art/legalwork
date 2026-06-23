---
name: review-saas-agreement-company-playbook
task_id: intellectual-property/review-saas-agreement-against-company-playbook
description: Reviewing a proposed SaaS agreement against a company playbook and related business context to produce a prioritized deviation report with redlines and fallback language.
activates_for: [planner, solver, checker]
---

# Skill: Review SaaS Agreement Against Company Playbook

## 1. Subject-matter triage
- Treat the playbook as the primary benchmark and the business context as the modifier of priority, not as a substitute for the playbook.
- Separate true deviations from mere drafting differences, and separate negotiated exceptions from outright noncompliance.
- If the record reflects a single vendor relationship, state that it is the only counterparty in scope; if multiple versions or parallel drafts exist, enumerate them before comparing.
- Identify whether the arrangement is strategic, mission-critical, or operationally replaceable, because that status changes how aggressively to grade SLA, termination, liability, and data-portability issues.
- Confirm the agreement stage and whether the task is a pure review or a markup exercise, because that determines how much executable redline language is required.

## 2. Failure modes the skill is correcting
- Comparing the agreement to the playbook clause-by-clause without translating the result into negotiation priorities.
- Treating all deviations as equal and missing the business-critical provisions that control continuity, data access, and loss allocation.
- Reporting issues without giving a usable fallback position, which leaves no path to compromise.
- Flagging a deviation without tying it to the agreement’s internal mechanics, related schedules, or operational consequences.
- Writing redlines in a way that depends only on formatting, which can fail when converted to .docx or plain text.
- Naming concerns abstractly instead of stating the governing rule, the source of the deviation, and the practical consequence.

## 3. Legal frameworks / domain conventions that apply
- Review the SaaS agreement against the playbook on the provisions that typically drive customer risk: data ownership and use rights, data portability, service levels and credits, support commitments, security obligations, modification rights, audit rights, indemnities, liability cap structure, term and termination, suspension, and price changes.
- Treat customer data as customer-controlled unless the agreement clearly and narrowly states otherwise; any vendor use beyond service delivery should be checked for express permission and scope limitation.
- Evaluate SLA language for uptime commitments, service credits, exclusions, chronic-failure remedies, and whether credits are the exclusive remedy.
- Review unilateral change language for advance notice, consent triggers, and the customer’s ability to object or terminate if materially adverse changes are introduced.
- Review limitation of liability in light of dependency and criticality; a low cap may be acceptable in a low-risk utility relationship but not where the service is central to operations.
- Review termination provisions for cause and convenience, including transition assistance, data export, deletion, and survival obligations.
- Review price adjustment mechanisms for objective benchmarks, notice periods, and exit rights if pricing moves beyond the agreed tolerance.
- Where the source documents identify specific governing authorities or compliance rules, cite them in the analysis; otherwise, ground the deviation in the playbook position and the agreement text.
- Use a uniform ordinal severity scale defined once at the top of the report, and apply it consistently across all entries.

## 4. Analytical scaffolds
1. Read the playbook first and extract the required position, permitted fallback, and any business-context modifiers.
2. Read the SaaS agreement once for architecture: identify the clauses that govern data, service performance, change control, liability, indemnity, pricing, term, termination, and transition.
3. Compare each relevant clause to the playbook position and classify the result as compliant, negotiable, or deviating.
4. For each deviation, write:
   - the clause or section at issue,
   - the playbook position,
   - the nature of the deviation,
   - the severity grade,
   - the business reason for the grade,
   - the preferred redline,
   - a fallback position if the preferred language is rejected.
5. When drafting redlines, make each substantive edit explicit in text so the change survives export:
   - use [DELETED: ...] for removed language,
   - use [INSERTED: ...] for added language,
   - use [REPLACED: old → new] for substitutions.
6. Add a short rationale to each redline so the reader can see why the edit is required and what risk it addresses.
7. Tie each issue to the clause ecosystem around it: if termination depends on data return, if credits interact with exclusivity, or if liability carve-outs interact with indemnities, say so.
8. When the business materials show the service is strategic or hard to replace, elevate the severity of any issue that could interrupt operations, impair data access, or cap recovery too tightly.
9. If only one vendor, one agreement, or one business scenario is in scope, say so affirmatively instead of analyzing hypothetical alternatives.
10. End with a short action list that converts the report into next steps for legal and business owners.

## 5. Vertical / structural / temporal relationships
- Track whether each issue affects the relationship at signing, during service delivery, at renewal, on termination, or after termination.
- Show how one clause can change the meaning of another: for example, a broad modification right can defeat a carefully negotiated SLA, or a short data-retention period can nullify termination rights.
- Distinguish immediate operational risk from delayed legal risk.
- Note whether a fallback position preserves the same economic allocation or merely reduces the severity of the deviation.
- Where a clause turns on notice, cure, renewal, or price-increase timing, state the temporal trigger and the downstream consequence if that trigger is missed.
- If multiple versions, markups, or side letters exist, analyze them in document order and make clear which text controls absent a hierarchy clause.

## 6. Output structure conventions
- Produce a deviation report organized by priority, not a generic contract summary.
- Define the severity scale once near the top and use it uniformly, such as: Critical, High, Medium, Low.
- Open with a brief executive summary of the overall posture and the main negotiation pressure points.
- Then provide an issue-by-issue report in a conventional legal format:
  - clause reference,
  - severity,
  - playbook position,
  - deviation identified,
  - business impact,
  - preferred redline,
  - fallback language,
  - rationale.
- Keep the redline language operational, not descriptive; the reader should be able to paste it into the agreement.
- Make fallback language meaningfully different from the preferred position, but still protective.
- If an issue is acceptable as written, say so only if it helps explain the boundary of the playbook; otherwise omit nonissues and focus on deviations.
- End with a concise Recommended Actions section naming the next steps for legal and business stakeholders, the responsible role for each, and the timing anchor tied to the negotiation or signature milestone.
- If the final deliverable is to be saved as a document, ensure the substantive deviation report is the primary content and not a mere outline or checklist.
