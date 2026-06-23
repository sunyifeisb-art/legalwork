---
name: extract-governance-requirements-from-regulatory-filings
task_id: corporate-governance/extract-governance-requirements-from-regulatory-filings
description: Agents extract governance obligations from regulatory filings at a high level, map each obligation to the relevant source section, responsible governance function, deadline or trigger, and any related reporting or certification step, while also checking for affiliate-transaction constraints, internal-control implications, and ongoing notice requirements that may arise from changes in board or senior management composition.
activates_for: [planner, solver, checker]
---

# Skill: Governance Compliance Matrix for a Bank Holding Company

## 1. Subject-matter triage
- Treat the source set as a mixed governance pack: regulatory filings, supervisory correspondence, board materials, policies, and related appendices may each contain operative obligations.
- First separate hard obligations from background narrative, then separate one-time milestones from continuing governance duties.
- For each distinct obligation, identify whether it binds the holding company, a subsidiary, the board, a committee, or management; do not assume entity-level overlap.
- If the materials include multiple affiliates, transaction streams, or governance bodies, enumerate them explicitly before analysis and keep each row tied to one item or one obligation family.

## 2. Failure modes the skill is correcting
- Baseline extracts headline duties but misses the element-by-element matrix needed for board use: obligation, source, owner, timing, status, and open items.
- Baseline merges distinct governance duties into one summary row, which hides separate deadlines, escalation paths, and reporting steps.
- Baseline overlooks intercompany and affiliate-transaction constraints that operate alongside ordinary governance approvals.
- Baseline fails to flag internal-control or disclosure implications when filings or examinations identify control weakness, remediation, or certification risk.
- Baseline misses change-of-director or change-of-officer notice/approval protocols that can become ongoing governance conditions.
- Baseline describes an issue without tying it to the controlling authority, the interacting source provision, and the business consequence.
- Baseline gives observations without a clear next step for the board, management, or counsel.

## 3. Legal frameworks / domain conventions that apply
- **Supervisory orders and related filings:** Extract each operative article, condition, certification, progress report, board reporting duty, and regulator notification separately; use the filing’s own section labels as the primary citation.
- **Board governance requirements:** Capture meeting cadence, committee composition, escalation duties, management information flows, and board review obligations as distinct governance requirements.
- **Affiliate-transaction constraints:** Review intercompany dealings for statutory or regulatory limits, arm’s-length or market-terms expectations, approval mechanics, and any restrictions on aggregate exposure or forms of support.
- **Internal-control and disclosure context:** Flag findings that suggest material weakness, reporting-control deficiency, or remediation obligations affecting financial reporting, certifications, or disclosure decisions.
- **Change-in-management protocols:** Identify any advance notice, prior approval, post-change notice, or qualification review required for director or senior officer changes, especially in heightened-supervision settings.
- **Asset growth or activity restrictions:** If the source imposes growth, expansion, or activity limitations, treat the trigger, cap, release condition, and reporting duty as separate entries.
- **Controlling authority discipline:** For every legal proposition or governance rule, cite the controlling source text or recognized authority by name and section/part as reflected in the materials or standard practice.

## 4. Analytical scaffolds
- **Provision-by-provision extraction:** For each operative provision, identify the duty, the actor, the timing trigger, the required output or filing, and the status or open question.
- **Document-to-obligation mapping:** Tie each row to a precise source citation and preserve enough context to show why the row exists.
- **Obligation-to-entity mapping:** State whether the requirement applies at parent, subsidiary, board, committee, or management level, and whether any other entity must also act.
- **Cross-document interaction check:** Note where one document modifies, conditions, expands, or reinforces another; do not treat related documents as independent if they share the same governance theme.
- **Issue-closing analysis:** For each gap or risk, state the scale or trigger in the source set, identify the interacting provision or companion document, and explain the operational, regulatory, or transactional consequence.
- **Deadline consolidation:** Build a single chronology of due dates, recurring review dates, notice windows, escalation dates, and milestone-based triggers.
- **Severity discipline:** If you are presenting gaps or open issues, assign a uniform ordinal severity label and define the scale once at the start.
- **Recommendation discipline:** When the output is advisory rather than purely tabular, end with concrete next steps that assign an actor and a timing anchor.

## 5. Vertical / structural / temporal relationships
- **Parent vs. regulated subsidiary:** Some obligations are set at the holding-company level but operationalized through the bank or another regulated entity; preserve that split.
- **Board vs. committee vs. management:** Distinguish which body approves, which reviews, which monitors, and which reports.
- **Initial compliance vs. ongoing compliance:** Mark whether the obligation is a one-time remediation, a recurring calendar item, or a continuing condition.
- **Trigger vs. release condition:** If a duty starts on an event and ends on a later supervisory milestone, capture both ends of the timeline.
- **Internal governance vs. external reporting:** Separate what the board must do internally from what must be filed, certified, or noticed to the regulator.

## 6. Output structure conventions
- Produce a board-ready compliance matrix in conventional business form, with columns for: obligation, source citation, responsible party, timing or trigger, status, and open items/notes.
- Include a short executive summary up front that highlights the most time-sensitive items, the most structural governance requirements, and any unresolved gaps.
- Group rows by theme or source document when helpful, but keep each distinct obligation on its own row.
- Surface conflicts, overlaps, and dependencies explicitly; if two provisions pull in different directions, note both and identify the practical sequencing issue.
- Where a severity rating is used, define the ordinal scale once and apply it consistently across all gap or risk entries.
- If recommendations are included, use imperative language, name the responsible role, and anchor the timing to a filing deadline, supervisory milestone, board meeting, or comparable regulatory trigger.
- Keep the document board-ready: concise, citation-driven, and oriented toward action rather than exposition.
