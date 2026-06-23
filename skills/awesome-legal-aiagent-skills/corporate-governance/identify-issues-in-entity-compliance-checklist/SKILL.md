---
name: identify-issues-in-entity-compliance-checklist
task_id: corporate-governance/identify-issues-in-entity-compliance-checklist
description: Agents flag general checklist gaps in entity compliance reviews without turning the checklist into an answer key. Analyze whether corporate actions were properly authorized under the applicable entity law, whether foreign qualification may be required where the company conducts business, whether authorized share capacity is sufficient for a contemplated financing, and whether tax or filing lapses create lien, dissolution, or good-standing risks.
activates_for: [planner, solver, checker]
---

# Skill: Entity Compliance Checklist Deviation Report — Pre-Financing Due Diligence

## 2. Failure modes the skill is correcting

- Baseline treats checklist mismatches as mere editorial differences instead of legal deviations and does not state whether the gap is a closing blocker, a post-closing cleanup item, or a best-practice omission.
- Baseline identifies a deficiency without tying it to the controlling corporate statute, charter/bylaw authority, or filing requirement that makes it material.
- Baseline does not compare each checklist item against the underlying records set, so it misses missing approvals, inconsistent dates, unsigned actions, or unsupported assumptions.
- Baseline omits the transaction context that matters in diligence: whether the checklist item affects issuance capacity, qualification status, entity good standing, or the ability to deliver financing closing deliverables.
- Baseline fails to separate one-state or one-entity issues from issues that must be analyzed across every relevant jurisdiction, business location, or filing period.
- Baseline sometimes states a conclusion without identifying the downstream consequence, the cure, and the timing pressure created by the contemplated financing.
- Baseline underweights administrative lapses that can cascade into tax liens, revocation, inability to obtain certificates, or inability to complete a financing on schedule.

## 3. Legal frameworks / domain conventions that apply

- **Corporate authorization and entity power:** Determine whether the action reflected in the checklist was authorized by the body required under the applicable entity statute, charter, operating agreement, or bylaws. Use the governing documents first, then the default statute. If the record shows only partial approval, identify whether the deficiency is curable by later ratification or whether the act was ineffective when taken.
- **Charter, share, and financing capacity:** For a contemplated equity financing, confirm that the company has enough authorized but unissued shares for the proposed issuance, related conversion rights, and any reserved equity. If the available capacity is insufficient, the charter amendment process must be completed before closing under the applicable statute and governing documents.
- **Equity incentive governance:** Validate that any equity plan, pool increase, or grant authority was adopted under the required internal approvals. Grants made from an unauthorized pool or under an invalid plan are defective until cured under the relevant corporate authority.
- **Foreign qualification and doing-business standards:** Assess each jurisdiction where the company has personnel, offices, revenue, or meaningful operations against the applicable foreign-qualification standard. Qualification may be required even if the entity has not already registered there. Unqualified business activity can create penalty exposure and litigation or enforceability limitations.
- **Franchise tax, annual report, and good-standing mechanics:** Unpaid franchise taxes, overdue reports, or lapsed registered-agent appointments can affect good standing, trigger administrative penalties, or create dissolution/revocation risk. Treat these as legal compliance issues, not bookkeeping issues.
- **Cross-document consistency:** Compare the checklist against the charter, amendments, bylaws or operating agreement, board and stockholder or member consents, cap table, financing assumptions, tax status evidence, and qualification filings. A compliance deviation often appears only when two documents are read together.
- **Controlling authority citation discipline:** Every legal conclusion should be anchored to the applicable statute, regulation, governing-document provision, or recognized corporate-law convention that supports it.

## 4. Analytical scaffolds

- **Record-to-checklist reconciliation:** For each checklist line item, identify what the checklist says, what the underlying records actually show, and whether the difference is omission, contradiction, stale information, or missing support.
- **Severity assignment:** Classify each deviation using a uniform ordinal scale stated at the top of the report, and apply it consistently based on whether the issue blocks closing, requires prompt post-closing cure, or is a lower-priority governance gap.
- **Issue-closing triad:** For every deviation, state:
  - the scale of the problem using a figure, date, jurisdiction count, filing status, share-capacity constraint, or other source-document threshold;
  - the record or document it must be read against;
  - the practical consequence for the financing, good standing, enforceability, or qualification posture.
- **Authority-first analysis:** Identify the governing rule before stating the conclusion. If the source documents name the controlling provision, use that citation; otherwise use the applicable corporate-law source by name and section.
- **Jurisdiction-by-jurisdiction screening:** When operations, employees, offices, or filings span more than one state, analyze each relevant jurisdiction separately rather than collapsing them into a single “foreign qualification” issue.
- **Capacity and timing check:** If the financing contemplates new issuances, test whether the issuance can occur without further corporate action, or whether a charter amendment, reserved-capacity adjustment, or other pre-closing step is required.
- **Cure-path identification:** For each issue, distinguish between immediate pre-closing cure, post-closing remediation, and non-urgent housekeeping, and recommend the narrowest effective cure.

## 5. Vertical / structural / temporal relationships

- **Entity hierarchy:** Distinguish parent-level governance from subsidiary-level action, and separate entity-specific approvals from enterprise-wide policies or templates.
- **Temporal sequencing:** Evaluate whether required approvals, filings, tax payments, or qualification steps occurred before the challenged action, not merely whether they exist somewhere in the record.
- **Pre-closing versus post-closing:** Flag anything that must be completed before the financing can close, and separately identify issues that can be cured after closing without breaking the transaction.
- **Jurisdictional layering:** Track incorporation state, qualification states, tax-reporting states, and operational states independently; a clean result in one layer does not cure a defect in another.
- **Authority chain:** Read the checklist against the sequence of charter, bylaws or operating agreement, board or manager approvals, stockholder or member consents, and filed amendments to ensure the action is authorized at each step.

## 6. Output structure conventions

- Use a prioritized compliance deviation report, ordered from closing blockers to lesser governance gaps.
- Open with a short severity legend that defines the ordinal labels used in the report.
- For each deviation, include:
  - severity;
  - checklist item or topic;
  - discrepancy or omission;
  - governing authority or record basis;
  - why it matters for the financing or entity status;
  - recommended cure;
  - timing classification.
- Make every entry self-contained: the reader should not need to infer the legal rule, the supporting record, or the consequence.
- When the issue involves a numeric threshold, present the source-document figure or capacity constraint in words tied to the records, without inventing calculations beyond what the materials support.
- Include a separate section for foreign qualification and filing-status issues, with each jurisdiction analyzed on its own facts.
- Include a separate section for share-capacity, equity-plan, and financing-readiness issues if the records touch issuance authority or reserved equity.
- End with a concise Recommended Actions block that states the next steps, the responsible internal role or external advisor where identifiable from the record, and the urgency relative to the financing milestone.
