---
name: compare-multi-jurisdiction-employment-agreements
task_id: intellectual-property/compare-multi
description: Jurisdiction-organized deviation report comparing employment agreement drafts for multiple jurisdictions against a company playbook and outside counsel guidance.
activates_for: [planner, solver, checker]
---

# Skill: Compare Multi-Jurisdiction Employment Agreements for Consistency

## 1. Subject-matter triage

Treat the assignment as a jurisdiction-by-jurisdiction consistency review of employment agreement drafts against a company playbook and outside counsel guidance. Identify the governing local employment-law regime for each draft first, then compare the draft to the playbook only to the extent local law permits. Where the source set contains multiple jurisdictions, enumerate them explicitly before analyzing deviations so each jurisdiction receives its own pass and no issue is silently generalized across regimes.

## 2. Failure modes the skill is correcting

- Applying the playbook as if it were universal, instead of testing each provision against mandatory local law first
- Collapsing required local-law edits, counsel-mandated edits, and business-preference edits into one undifferentiated “deviation” bucket
- Ignoring how outside counsel guidance changes the comparison baseline for a specific jurisdiction
- Missing cross-draft inconsistencies in provisions that should track consistently unless a local-law reason justifies divergence
- Stating a legal conclusion without naming the governing employment-law authority or contractual source that supports it
- Producing a narrative summary that does not clearly separate compliance issues from optional drafting choices

## 3. Legal frameworks / domain conventions that apply

- Local mandatory employment law controls over contrary playbook language where the jurisdiction does not permit waiver or variation
- Compare each draft against the operative baseline in this order: mandatory law, outside counsel guidance, then company playbook preference
- Pay special attention to notice, severance, benefits, restrictive covenants, confidentiality, IP ownership, termination mechanics, dispute resolution, governing law, and required disclosures
- Where local law or counsel guidance requires a departure from the playbook, treat that departure as compliant unless another source in the record indicates a conflict
- Where the source set uses a particular legal authority, cite that authority by name and section; otherwise cite the controlling statute, regulation, rule, or recognized doctrine supporting the proposition
- When a provision appears in more than one draft, compare its substantive effect rather than its wording alone, and flag any unexplained divergence
- Where a legal rule turns on a jurisdiction-specific threshold, exception, or default, state the rule that controls and tie the draft language to that rule

## 4. Analytical scaffolds

- For each jurisdiction:
  - identify the governing local-law baseline
  - identify the playbook position
  - identify outside counsel’s instruction
  - classify each deviation as required, permitted, or unsupported
  - note any drafting ambiguity, omission, or internal inconsistency
  - state the practical consequence if the draft is left unchanged
- For each flagged point, close the analysis by linking:
  - the governing source or authority
  - the related clause or drafting point in the same agreement or another draft
  - the client-facing consequence, whether compliance, operational, or negotiation-related
- Use a uniform severity scale for the report, and apply it consistently across all entries
- Where the same issue appears in multiple jurisdictions, analyze each jurisdiction separately rather than using a single representative example
- Distinguish between mandatory corrections and optional harmonization items; do not present them as equivalent

## 5. Vertical / structural / temporal relationships

- Organize the report by jurisdiction first, then by clause or issue within that jurisdiction
- Within each jurisdiction, compare the draft, the playbook, and counsel guidance in that sequence
- If the same provision has different treatment across jurisdictions, call out the divergence and explain whether it reflects local law, counsel guidance, or drafting inconsistency
- If the source set contains time-sensitive obligations, anchor the analysis to the relevant hiring, execution, notice, or termination milestone rather than treating the agreement as static
- If one draft cross-references another clause, schedule, or annex, check the cross-reference for consistency before marking the issue complete

## 6. Output structure conventions

- Produce a jurisdiction-organized deviation report, with one section per jurisdiction
- Open with a short severity key using ordinal labels
- Within each jurisdiction, include:
  - governing baseline
  - deviations from playbook
  - outside counsel alignment check
  - consistency observations
  - consequence / risk note
- Include a compact cross-jurisdiction comparison section for recurring provisions that differ among drafts
- End with a Recommended Actions section that assigns an imperative task, the responsible role, and a timing anchor for each recommendation
- Keep the report written as an issue-oriented advisory document, not a generic summary
- Do not rely on formatting alone to signal substance; make each issue legible in plain text
