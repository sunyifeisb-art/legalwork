---
name: review-business-unit-msas-corporate-template
task_id: intellectual-property/review-business-unit-msas-against-corporate-template
description: Reviewing multiple business unit MSA templates against a corporate template and a higher-authority risk policy to produce a deviation-by-deviation conformance report with risk ratings and a remediation roadmap.
activates_for: [planner, solver, checker]
---

# Skill: Review Business Unit MSAs Against Corporate Template

## 1. Subject-matter triage

Identify the controlling document hierarchy before analyzing deviations: the board risk policy governs, the corporate template supplies the baseline standard, and each business unit template is reviewed against both. Treat each business unit template as a separate comparison target, then compare recurring deviations across the set to distinguish a systemic drafting choice from a unit-specific departure.

If the source set includes a redline or markup request, preserve the comparison logic but ensure changes are expressed in a way that survives export to Word or plain text. If the task names a primary file to produce, create that file first and verify it is populated before any secondary summary or cover note.

## 2. Failure modes the skill is correcting

- Comparing only against the corporate template and missing that the board risk policy is the governing ceiling for acceptable terms
- Treating repeated deviations across business units as isolated exceptions instead of a common drafting pattern that may need template-level remediation
- Collapsing distinct deviations into a generic “non-conforming” label without stating what changed, why it matters, and how urgent it is
- Omitting a severity rating, which prevents triage and makes the report advisory rather than operational
- Describing a deviation without tying it to the relevant clause family, interacting document, and practical consequence
- Failing to give a concrete next step for legal, procurement, or the business owner
- In markup-style outputs, relying only on visual formatting that may not survive conversion instead of using explicit textual change markers

## 3. Legal frameworks / domain conventions that apply

- The board risk policy is the controlling internal authority for acceptable contract risk; any deviation from the corporate template must also fit within that policy
- The corporate template is the internal baseline, not the ultimate authority; a term can be non-standard even if it is commercially familiar
- Common deviation categories in MSAs typically include liability allocation, indemnity scope, intellectual property ownership, confidentiality, data security, insurance, audit rights, termination rights, payment mechanics, subcontracting, assignment, warranty disclaimers, and dispute procedures
- A deviation is more concerning when it reduces the company’s protections, expands its obligations, narrows its remedies, or weakens governance controls
- A deviation that is expressly approved in a governing internal process is treated differently from a silent departure, but it still needs to be recorded and risk-scored
- If the template touches regulated data, security, privacy, or cross-border processing, the analysis must test the clause against the policy’s data-handling standard and any higher-risk operational requirements in the source set
- Where a legal conclusion is drawn, state the governing internal authority or contract principle supporting it rather than presenting the conclusion bare

## 4. Analytical scaffolds

1. Enumerate the full set of business unit templates before analysis and treat each one as its own pass.
2. Build a comparison matrix with rows for each material provision family and columns for the corporate template, the board policy, and each business unit template.
3. For every deviation, record:
   - the clause or topic
   - the exact nature of the departure from the corporate baseline
   - whether the departure is more or less favorable to the company
   - whether the departure is consistent with the board policy
   - whether the departure appears approved, unapproved, or unclear
   - the severity rating
   - the operational, legal, or economic consequence
   - the recommended fix
4. Score severity on a single ordinal scale defined once at the start of the report and apply it consistently across all deviations.
5. When a deviation is analyzed, close it with three moves: identify the scale of the issue using a source-based metric or threshold, cross-reference any interacting clause or source document, and state the downstream consequence for the company.
6. Separate true conforming language from “equivalent but different” drafting; if the same risk is achieved through different wording, say so explicitly.
7. After individual analysis, compare the full set of templates to identify repeat deviations, structural gaps, and places where a single template revision could resolve multiple business units at once.
8. End with a remediation roadmap that groups fixes by urgency and implementation owner, not by template alone.

## 5. Vertical / structural / temporal relationships

The board policy is the highest internal reference point; if it conflicts with the corporate template, analyze the departure from the policy, not just from the template. Business unit templates are forward-looking controls for future contracting and do not rewrite already executed agreements. Repeated deviations across templates may show a deliberate business practice, but they still require policy alignment or documented exception status.

Where one clause depends on another, analyze the interaction rather than the isolated text: liability caps interact with indemnities and insurance; IP ownership interacts with work-product and confidentiality; data-security obligations interact with audit, breach notice, and subcontracting; termination and survival interact with payment, deliverables, and post-termination use rights.

## 6. Output structure conventions

- Use a report format that opens with a brief scope statement, a severity key, and a short description of the governing hierarchy.
- Provide a comparison matrix before the narrative analysis.
- Then provide a deviation-by-deviation analysis, with one entry per deviation and one template source clearly identified in each entry.
- Each deviation entry should include: clause/topic, corporate baseline, board-policy check, approval status, severity, consequence, and remediation recommendation.
- Group repeated deviations together only after identifying them separately at the template level.
- Include a remediation roadmap at the end, organized by urgency and owner, with imperative action verbs and timing anchors tied to the project or contracting cycle.
- If the deliverable is a markup or redline package, mark every substantive change with explicit plain-text conventions such as [DELETED: …], [INSERTED: …], and [REPLACED: old → new], and attach a short rationale to each change so the modification is legible without styling.
- If the task requires a primary file, ensure the named output file is written first, exists, is non-empty, and contains the operative analysis or markup rather than a description of it.
