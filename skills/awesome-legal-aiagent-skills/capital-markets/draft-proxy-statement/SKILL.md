---
name: draft-proxy-statement
task_id: capital-markets/draft-proxy-statement
description: DEF 14A proxy statement drafting for an annual meeting with a contested director election; the baseline produces standard narrative sections but does not fully verify tabular consistency, shareholder-proposal handling, or governance disclosures tied to the company’s specific profile.
activates_for: [planner, solver, checker]
---

# Skill: Draft Definitive Proxy Statement (DEF 14A)

## 1. Subject-matter triage

- Draft a complete DEF 14A for the annual meeting from the source record, with the proxy statement itself as the primary deliverable.
- If source materials contain gaps, inconsistencies, or unresolved judgments, surface them as bracketed attorney notes in the draft rather than silently resolving them.
- Treat a contested director election as a governance-sensitive filing: separate the dissident/competing slate mechanics, incumbent board recommendation, and voting mechanics cleanly.
- If more than one annual-meeting date, nominee group, proposal, or compensation period appears in the source set, enumerate each before drafting and keep the treatment item-specific.

## 2. Failure modes the skill is correcting

- Drafts often narrate compensation and governance topics without checking internal table consistency, cross-period alignment, or whether footnotes support the stated totals.
- Drafts may compress a stockholder proposal into summary form when the filing requires preservation of the proposal text, the company response, and the governing rule-based treatment.
- Drafts may omit contested-election mechanics, nominee status, voting standards, or disclosure hooks that change when there is a competing slate or solicitation.
- Drafts may miss company-specific governance disclosure that must be described if present in the source materials, including board structure, committee processes, related-party handling, responsiveness to prior votes, and ownership disclosures.
- Drafts may resolve ambiguities without flagging them, leaving the filing exposed if the underlying record is inconsistent, incomplete, or non-matching across exhibits and tables.

## 3. Legal frameworks / domain conventions that apply

- Exchange Act proxy regime: draft to the disclosure structure required for a definitive proxy statement under Regulation 14A and Schedule 14A, including clear separation of proposal text, board recommendations, and voting information.
- Contested election presentation: present the election mechanics, nominee identification, solicitation posture, voting standard, and any dissident materials consistently with the proxy rules and the meeting notice.
- Beneficial ownership disclosure: present ownership in the conventional proxy format and reconcile reported holdings across executive officers, directors, and significant holders using the source record.
- Executive compensation disclosure: align the compensation narrative with the required tables, footnotes, and any compensation committee discussion; ensure period-by-period consistency.
- Audit committee disclosure: describe the committee’s oversight, independence, pre-approval mechanics, and report in the standard proxy convention.
- Related-party and director-conflict disclosure: disclose material transactions, relationships, and recusals where the source materials show they matter to governance or voting.
- Shareholder proposal handling: preserve required proposal text where applicable, state the company’s position, and note any rule-based basis for inclusion, exclusion, or opposition using the governing proxy framework.
- Board structure disclosure: if the board is classified, staggered, or otherwise structured in a non-default way, describe class terms, election cycles, and director allocation accurately.
- Say-on-pay responsiveness: if prior advisory support was weak or the board addressed shareholder feedback, disclose the board’s response in a plain, supportable narrative.
- Interlocking or committee overlap disclosures: include only where the source materials support the relationship and tie it to the relevant governance discussion.

## 4. Analytical scaffolds

- Start from the filing architecture: notice, meeting logistics, voting instructions, contest framing, proposals, election materials, governance, compensation, ownership, committee reports, and any shareholder submissions.
- For each nomination or proposal item, verify the exact party identity, the action sought, the voting standard, and whether the source documents support the stated recommendation.
- For each compensation table or ownership table, reconcile row labels, footnotes, period references, and cross-table references before drafting prose around them.
- For each governance disclosure, check whether the source record supports a concrete statement; if not, insert a bracketed attorney note identifying the missing fact or inconsistency.
- For every shareholder proposal, state the governing rule or filing treatment that supports inclusion, exclusion, or opposition, and preserve the operative text where required.
- If the source record contains multiple candidate slates, meeting dates, or proposal versions, draft each separately and do not merge them into a single generic narrative.
- Where the source documents conflict, do not choose silently; note the discrepancy, identify the affected section, and flag the needed confirmatory fact.
- Use bracketed attorney notes only for unresolved drafting judgments, not as a substitute for ordinary disclosure text.

## 5. Vertical / structural / temporal relationships

- Keep meeting logistics, record date, voting method, quorum, and adjournment mechanics aligned across the notice, proxy card narrative, and proposal sections.
- Keep director terms, class structure, committee assignments, and election cycle language synchronized across the governance and nominee sections.
- Keep compensation discussion, compensation tables, grants, and performance references anchored to the correct fiscal year and meeting cycle.
- Keep shareholder ownership data, beneficial ownership narratives, and solicitation disclosures internally consistent across sections and footnotes.
- Keep any contested-election disclosure synchronized with the identity of nominees, the status of the solicitation, and the applicable voting instructions.
- If the source record spans multiple periods, use the source’s temporal labels consistently and avoid mixing fiscal-year, calendar-year, and meeting-year references.

## 6. Output structure conventions

- Produce a single proxy statement draft in DEF 14A style suitable for conversion to `proxy-statement-draft.docx`.
- Use conventional proxy-statement organization rather than a rubric-shaped checklist; include the filing’s operative notice, solicitation/voting information, nominee and proposal sections, governance disclosure, compensation disclosure, ownership disclosure, committee reports, and stockholder proposal treatment as applicable.
- Draft prose in filing-ready form, with tables where the disclosure convention requires them and with footnotes used to reconcile support, not to hide uncertainty.
- Preserve required proposal text and company response text where the source materials indicate it is needed.
- Insert bracketed attorney notes for missing, conflicting, or ambiguous source facts, especially where the defect affects voting, ownership, compensation, or governance disclosures.
- Do not invent numbers, holdings, vote totals, committee compositions, or recommendation language that the source record does not support.
- Ensure the finished document is the operative proxy statement text, not a summary or outline, and that the primary deliverable exists and is complete before any secondary narrative is considered.
