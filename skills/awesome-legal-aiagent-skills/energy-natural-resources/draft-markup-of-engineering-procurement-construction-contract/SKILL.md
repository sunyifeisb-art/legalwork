---
name: draft-markup-epc-contract-owner-solar
task_id: energy-natural-resources/draft-markup-of-engineering-procurement-construction-contract
description: Guides drafting of an owner-side markup of a contractor-favorable EPC agreement for a solar project by checking commercial provisions against financing minimum requirements, tax credit conditions, and power purchase agreement alignment constraints.
activates_for: [planner, solver, checker]
---

# Skill: Draft Owner's Redline Markup of Contractor-Favorable EPC Agreement for Solar Project

## 1. Subject-matter triage
- Confirm the primary deliverable is the markup memorandum; if a redlined contract file is also required by the task context, produce the operative markup first and the memo only after the markup exists and is non-empty.
- Read the EPC draft together with the financing term sheet, tax equity requirements, owner playbook, and lender counsel comments before proposing edits.
- Identify whether the project is single-site and whether any schedule, completion, or tax-credit covenant applies to one project only; if so, state that the analysis is project-specific and do not generalize across non-existent tranches or sites.
- Treat each section of the EPC as a separate review unit and preserve section-level mapping so the owner can apply edits directly.

## 2. Failure modes the skill is correcting
- Drafting proceeds from contractor-favorable language without testing the clause against financing minimums, tax-credit closing conditions, and owner remedy expectations.
- Tax-credit provisions are added at a high level but omit the operative covenants, documentation duties, and breach remedies needed to support closing and later substantiation.
- Completion, commissioning, and tax timing are treated as interchangeable, creating gaps between contractual milestones, financing conditions, and commercial operation timing.
- Liquidated damages are revised in one place without checking internal consistency across the aggregate cap and the component caps.
- Risk allocation is left with the contractor’s home-jurisdiction defaults where the project needs owner-protective governing law, venue, insurance, and financing-party rights.
- The output describes issues without converting them into usable markup language, leaving the client with analysis but no redline-ready changes.

## 3. Legal frameworks / domain conventions that apply
- **Liquidated damages and cap coherence.** Review the EPC against the contract’s LD structure and any financing minimum cap requirement under the term sheet; the aggregate cap must be internally consistent with all sub-caps and the owner’s intended remedies. Do not present a cap without reconciling the component buckets that feed it.
- **Completion and commercial operation sequencing.** Compare the EPC substantial completion date against the power purchase agreement commercial operation date and lender-required float; a sufficient commissioning buffer is a project-finance convention, not a drafting preference.
- **Performance assurance.** The guaranteed performance metric should reflect the project’s technology and modeled output, not a contractor-favorable floor that leaves the owner with underperformance risk and no meaningful remedy.
- **Defects and cure mechanics.** Use a tiered cure structure that distinguishes simple physical defects from remediation requiring a longer corrective plan; avoid a single long cure period that effectively defeats the owner’s remedy.
- **Title and commissioning control.** Title transfer should align with substantial completion and commissioning control so the owner has the intended property and security position during the operational transition.
- **Governing law, venue, and neutrality.** Align governing law with the project state or other logically connected law, and use a neutral dispute forum when the contractor’s proposed forum is one-sided.
- **Insurance and indemnity allocation.** Require the owner and, where appropriate, financing parties to be additional insureds and ensure indemnity covers ordinary negligence as well as the project-specific breach risks the owner is underwriting.
- **Tax credit support.** The contract should contain the representations, covenants, certification rights, and indemnities needed to support domestic content, placed-in-service timing, prevailing wage/apprenticeship compliance if applicable, and related tax-credit benefits.
- **Financing-party protections.** Include consent to collateral assignment, notice and cure rights, and related lender protections so the EPC does not impair project finance closing or enforcement.
- Cite controlling authority when stating a legal proposition, including the governing contract clause, relevant statute, regulation, rule, or recognized project-finance convention that supports the markup position.

## 4. Analytical scaffolds
- Build a section-by-section issue list keyed to the EPC’s actual article or section numbers.
- For each clause, compare:
  1. the draft language,
  2. the owner-side position in the playbook,
  3. the financing or tax-equity requirement,
  4. the markup language needed to close the gap,
  5. the practical consequence if the clause remains unchanged.
- Use a uniform severity scale at the top of the memo, and apply it consistently to every issue entry.
- For each issue, include the source-based magnitude or timing reference, cross-reference the interacting clause or external document, and explain the downstream consequence to the owner or financing package.
- Draft changes in plain-text markup that survives export, using explicit insertion/deletion notation rather than relying only on visual redlining.
- When multiple provisions are affected by one concept, enumerate them before analysis and handle each separately rather than collapsing them into a single comment.
- End each issue with a concrete owner-side recommendation that names the responsible party and the timing trigger.

## 5. Vertical / structural / temporal relationships
- Track the hierarchy among EPC milestones, PPA milestones, and financing conditions precedent; if one date or certificate drives another, identify the dependency explicitly.
- Distinguish pre-completion, substantial completion, final completion, and post-completion obligations so the owner does not lose rights during commissioning.
- Where the contract references warranties, indemnities, insurance, or title transfer, map which protections survive which milestone and whether lender rights attach before or after that milestone.
- If a provision affects tax credit qualification, explain how the contractual obligation links to the project’s operational deadline or certification window.

## 6. Output structure conventions
- Begin with the severity legend, then a section-by-section markup memorandum organized by EPC article or section.
- For each issue entry, include:
  - the section reference,
  - the severity label,
  - the current language or a concise identification of it,
  - the proposed markup using robust textual markers such as [DELETED:], [INSERTED:], or [REPLACED: old → new],
  - a short rationale,
  - the controlling authority or source basis,
  - the consequence to the owner or financing package,
  - the recommended action with role and timing anchor.
- Keep the markup memorandum owner-side and operational; avoid abstract commentary that cannot be inserted into the draft.
- Where a financing-party protection, insurance, or tax-credit provision is implicated, group the related edits under the relevant contract section and confirm that the proposed language addresses the full financing package.
- If the task context requires a standalone file, ensure the markup memorandum is written as `epc-markup-memorandum.docx` and is not replaced by a summary or issues list alone.
