---
name: entity-compliance-checklist-gap-analysis
task_id: corporate-governance/compare-entity-compliance-checklist-against-annual-requirements
description: Cross-referencing a compliance checklist against supporting documents for a multi-entity fund structure, identifying deadline errors, missing entities, beneficial ownership reporting obligations, and state-specific filing requirements.
activates_for: [planner, solver, checker]
---

# Skill: Multi-Entity Annual Compliance Checklist Review

## 1. Subject-matter triage (only if applicable)

- Use this skill when the task is to compare an annual compliance checklist against organizational, formation, qualification, and filing support for a multi-entity structure.
- First identify the full entity universe from the governing structure document, then map each entity to its formation state, foreign qualifications, annual filing regime, registered agent status, and any separate federal reporting obligation.
- If the source set contains multiple jurisdictions, entity types, or filing cycles, treat each as a separate analysis pass; do not assume a single due date or filing rule applies across the structure.
- If the checklist omits an entity, flag the omission before analyzing downstream filing details.

## 2. Failure modes the skill is correcting

- Accepting checklist due dates as correct without independently verifying them against the applicable filing requirements for each entity type and jurisdiction, which often differ from the dates commonly used for one entity type applied generically across the structure
- Failing to compare the entity list in the checklist against the organizational structure documents to identify entities that are absent from the checklist entirely
- Missing beneficial ownership information reporting obligations as a distinct compliance requirement with its own deadlines that operate independently of state filing obligations
- Treating one filing calendar as if it governs all entities, even where the governing rules, filing windows, or triggers vary by jurisdiction or entity status
- Conflating a correct compliance concept with a correct record entry; the checklist must be tested against the supporting documents, not against internal consistency alone

## 3. Legal frameworks / domain conventions that apply

- Franchise tax and annual report obligations: corporations, limited liability entities, and partnerships may have distinct due dates and calculation methods; where a jurisdiction offers alternative calculation methods, verify the method used and whether the other method changes the result; late payment may create penalties and good-standing consequences
- Beneficial Ownership Information reporting: the federal reporting regime applies to most domestic and foreign reporting companies; filing timing depends on formation or registration date; amendments are required after reportable changes within the governing update period; failure to file or update is a regulatory violation
- Minimum annual tax obligations: some jurisdictions impose a minimum annual tax on certain entity types regardless of revenue or activity level; this obligation often appears on compliance checklists without a corresponding payment entry for newly active entities
- Registered agent maintenance: entities must maintain a registered agent in each jurisdiction where the requirement applies at all times; resignation or lapse may trigger administrative consequences, including loss of good standing or dissolution risk
- Periodic statement requirements: some jurisdictions require a recurring statement tied to formation, qualification, or an anniversary cycle; the filing window is entity-specific and must be verified separately
- Foreign qualification: entities conducting business outside their formation state typically must qualify as foreign entities in each relevant jurisdiction; annual report and registered agent requirements apply in each qualification state
- International annual filing regimes: entities formed or registered in non-U.S. jurisdictions may have annual return or equivalent maintenance filings with government surcharges for lateness
- Good standing certificates: a loss of good standing in any jurisdiction can affect financing, transaction reps, and other contractual covenants; the compliance review should identify whether the issue creates a downstream business risk
- Entity-specific annual report requirements: a single date cannot be assumed across all entities; due dates, filing windows, and penalties must be matched to the entity and jurisdiction actually reflected in the source documents

## 4. Analytical scaffolds

- Start by enumerating every entity appearing in the organizational materials, then separately enumerate every filing jurisdiction and filing type implicated for each entity.
- For each entity-jurisdiction pair, verify the checklist’s stated due date, filing type, and amount against the governing source materials; if a rule is conditional on entity status, confirm the status before accepting the entry.
- Compare the checklist entity list against the organizational chart or memorandum and identify every missing entity for inclusion and independent review.
- For each entity, determine whether it is subject to beneficial ownership reporting, whether the initial filing is documented, and whether any post-filing update obligation appears outstanding.
- Review whether any entity is subject to a minimum annual tax, alternative franchise-tax calculation, or separate surcharge regime, and confirm the checklist reflects the correct obligation.
- Confirm registered agent information for each entity in each jurisdiction where an appointment is required; flag any resignation, lapse, or missing confirmation.
- Assess good-standing status where the source set provides it, and note any documented contractual or financing sensitivity that makes the issue materially consequential.
- Classify every issue on an ordinal severity scale defined once at the top of the memo, and use that scale consistently.
- For each issue, state the affected entity, jurisdiction, discrepancy, correct position, source support, and the practical consequence of the mismatch.
- Close each issue by tying it to the governing rule, the interacting document or record, and the downstream effect on compliance, standing, or transaction risk.
- Where the source documents do not provide enough information to confirm a checklist entry, mark the entry as unconfirmed rather than assumed correct.

## 5. Vertical / structural / temporal relationships (only if applicable)

- The organizational structure memorandum is the authoritative source for the entity universe; if it reflects later changes than the checklist, the checklist must be updated before any compliance action is taken.
- Separate formation-state obligations from foreign-qualification obligations; an entity may be compliant in one jurisdiction and deficient in another.
- Track federal beneficial ownership obligations on a separate calendar from state annual reports; the deadlines are driven by formation or change events, not by state filing cycles.
- Treat good-standing status as a live condition that can affect financing and transaction representations beyond the immediate filing obligation.
- If a filing deadline has passed by the analysis date, classify the issue as already due rather than merely upcoming.

## 6. Output structure conventions

- Produce a gap analysis memorandum in conventional memo form, with a short executive summary, a defined severity legend, and an issue-by-issue analysis section.
- Begin with a concise summary table that lists each issue, the affected entity, the jurisdiction or reporting regime, the severity, and the disposition as discrepancy, omission, or confirmed-correct entry.
- Use an explicit severity field for every issue, drawn from the same ordinal scale throughout the memo.
- Include a separate section for confirmed-correct entries so the reader can distinguish true matches from gaps.
- For each discrepancy, include: entity, jurisdiction or regime, checklist entry, controlling support, corrected entry, severity, and recommended remediation.
- Flag any entity that appears in the supporting structure but not in the checklist as a standalone omission requiring immediate inclusion and review.
- End with a Recommended Actions section that gives concrete next steps, assigns the responsible role named or implied by the source documents, and ties each action to the relevant filing window, deadline, or reporting milestone.
- State the analysis date in the memo body so timing-sensitive determinations are clear.
