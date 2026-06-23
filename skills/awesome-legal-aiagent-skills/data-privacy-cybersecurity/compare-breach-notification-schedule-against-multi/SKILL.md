---
name: compare-breach-notification-schedule-against-multi
task_id: data-privacy-cybersecurity/compare-breach-notification-schedule-against-multi
description: Breach notification schedule gap analyses require comparing each scheduled notification action against the applicable regulatory deadline, identifying whether notifications are past due or still pending, and checking whether the schedule is complete, timely, and aligned with the governing guidance.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis Memorandum: Breach Notification Schedule vs. Multi-Jurisdiction Regulatory Guidance

## 1. Subject-matter triage

- Identify the governing jurisdictions, frameworks, and any contract-based notice obligations before analyzing the schedule.
- Treat the regulatory guidance memo as the benchmark and the schedule as the item to be tested against it.
- If the source set contains multiple jurisdictions, notice recipients, or notice tracks, enumerate each one first and analyze them separately rather than collapsing them into a single pass.
- If only one jurisdiction or notice stream is actually implicated, state that expressly and explain why.

## 2. Failure modes the skill is correcting

- The memorandum discusses breach-notification rules in the abstract without comparing each scheduled notice entry against the specific deadline, recipient, method, and content required by the governing materials.
- The analysis fails to determine whether a notice is already overdue, due soon, or merely incomplete on content or method.
- The schedule omits required statutory, regulatory, or contractual notices, or includes notices that do not appear to be triggered on the facts.
- The analysis accepts the incident timeline as fixed without checking whether later source materials, updates, or transmittal communications alter the trigger date or the scope of notice obligations.
- Findings are described narratively but never tied back to a controlling rule, a source-document interaction, and a practical consequence for the client.
- The output lists issues without a consistent severity scale or without recommendations that translate the gap into action.

## 3. Legal frameworks / domain conventions that apply

- Multi-jurisdiction breach-notification regimes can differ on trigger standards, deadline length, required recipients, content elements, and escalation paths; the governing memo and supporting documents control the benchmark for each jurisdiction.
- The notice clock often starts when the organization has reason to believe a breach occurred, not when the investigation is fully complete; verify the source documents’ trigger date and use it consistently.
- Regulatory notice, individual notice, supervisory notice, and downstream contractual notice may each have distinct timing and content requirements; a complete analysis checks every applicable track.
- Schedule entries commonly include recipient, method, due date, responsible party, status, and message content; each of those fields should be tested against the governing guidance.
- When the source documents identify a statute, regulation, rule, guidance, or contractual clause, cite that authority by name and section or part when stating the proposition it supports.
- Findings should distinguish overdue items from upcoming deadlines and from content-only defects, because the practical risk differs even where the underlying rule is the same.

## 4. Analytical scaffolds

- Read the governing guidance first and extract the controlling requirements jurisdiction by jurisdiction, including deadline, recipient, content, method, and any special escalation or reporting sequence.
- Review the incident narrative and any updates to confirm the trigger date, the affected data categories, and any facts that expand or narrow the notice obligation.
- Build a complete inventory of the notice obligations disclosed in the source set before evaluating them.
- Work entry by entry through the schedule:
  - confirm the notice is actually required on the facts;
  - compare the planned date to the governing deadline;
  - check whether the recipient and method match the required track;
  - verify that the content elements identified in the guidance are included;
  - confirm that the responsible party and sequencing are coherent with other source documents.
- Cross-check related contract language, regulator correspondence, internal escalation materials, and any update memo for obligations that are missing from the schedule or that affect timing.
- For each issue, close the analysis by stating the scale of the problem using the source materials, identifying the interacting document or clause, and explaining the downstream consequence for the client.
- Assign each finding an ordinal severity level using a defined scale, and apply that scale consistently across all entries.

## 5. Vertical / structural / temporal relationships

- Organize the analysis by jurisdiction or framework first, then by notice type or recipient within each jurisdiction.
- Within each jurisdictional strand, distinguish the sequence of obligations: internal escalation, regulator notice, individual notice, and any contractual or downstream notice.
- Flag whether the schedule date is past due, imminent, or still pending, and make that timing status visible in the finding itself.
- If later materials revise the incident facts or timing, reconcile them against the earlier schedule and state which version governs the analysis.

## 6. Output structure conventions

- Produce a gap-analysis memorandum in conventional memo form, using an executive summary followed by findings grouped by severity.
- Define the severity scale once near the top and apply it uniformly to every finding.
- Within each severity tier, organize findings by jurisdiction or framework, then by notice obligation.
- Each finding should state: the governing authority, the scheduled date, the regulatory deadline or timing standard, the status, the content or method gap if any, the severity level, and the recommended action.
- Every finding should also identify the relevant cross-reference to another source document or clause and explain the practical consequence of the gap.
- End with a concise Recommended Actions section that assigns each action to a responsible role and ties it to a deadline or urgency anchor drawn from the source set.
- Use the filename instructed in the task exactly as the final document name.
