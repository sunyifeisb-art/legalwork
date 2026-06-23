---
name: extract-license-grant-terms-executed-tech-agreements
task_id: intellectual-property/extract-license-grant-terms-from-executed-technology-agreements
description: Building a license grant matrix from multiple executed technology agreements and amendments, identifying scope limitations, amendment modifications, and remediation recommendations at a category level.
activates_for: [planner, solver, checker]
---

# Skill: Extract License Grant Terms from Executed Technology Agreements

## 1. Subject-matter triage

Treat the source set as a document stack, not a flat list. Identify each executed technology agreement, then attach every amendment, exhibit, and incorporated side letter to the base agreement it modifies. Read the documents in operative order: base agreement first, then later amendments, then incorporated ancillary terms.

For each agreement set, determine the current operative license terms before comparing across the portfolio. If a document is only partially incorporated or only modifies a narrow subject, confine the modification to that subject and leave the remaining base terms in place.

If multiple agreements are in scope, enumerate each agreement separately before analysis so the matrix can track one operative profile per agreement. Do not merge distinct contracts into a composite summary.

## 2. Failure modes the skill is correcting

- Extracting the headline grant while missing the operative limits that control actual use
- Treating the base agreement as final without reconciling later amendments or incorporated terms
- Collapsing field, geography, exclusivity, sublicensing, assignment, and ownership into one generic license description
- Missing internal inconsistencies between the license grant and related restriction clauses
- Missing cross-agreement conflicts, especially where one agreement narrows or competes with another
- Failing to distinguish express permissions from silence, reservation clauses, or implied limitations
- Overstating rights by assuming sublicensing, assignment, or affiliate use where the text does not clearly grant it
- Omitting remediation recommendations when a grant is ambiguous, overbroad, or internally inconsistent

## 3. Legal frameworks / domain conventions that apply

Use the operative agreement as modified by all valid amendments on the same subject matter; later inconsistent provisions typically control their stated scope, while untouched provisions remain governed by the base text.

A license grant should be broken into separate legal dimensions: the licensed technology, the scope of permitted use, field of use, territory, exclusivity, sublicense rights, affiliate rights, transferability, and any reserved rights. Silence on a right is not a grant of that right.

Express sublicensing language should be extracted separately from affiliate-use language and assignment language. Those concepts often differ and may create different downstream control, consent, and compliance consequences.

Assignment and change-of-control restrictions commonly operate as separate transfer controls. A restriction on assignment may also capture merger, reorganization, or change in control by definition; read the definitional clause and the transfer clause together.

Ownership of improvements, derivative works, modifications, feedback, and resulting intellectual property must be extracted separately from the grant itself. Allocation of ownership and allocation of exploitation rights are distinct.

Audit, reporting, recordkeeping, confidentiality, data security, and data-processing obligations may be embedded in the same agreement or incorporated by reference. If they affect license use or compliance exposure, they belong in the matrix.

Cross-agreement comparison should focus on conflicting exclusivity, inconsistent permitted-use scope, conflicting transfer controls, and any most-favored or parity language that can alter the economic or operational profile of the portfolio.

When identifying legal implications, tie each conclusion to the controlling contractual text and the applicable doctrinal rule or interpretive convention; do not state a conclusion as if it were self-proving.

## 4. Analytical scaffolds

For each agreement set:

1. Identify the base agreement and list every amendment or incorporated document that affects license scope or related controls.
2. Establish the current operative terms by reading the documents in sequence and resolving any stated supersession or conflict language.
3. Extract the license grant in separate fields:
   - licensed technology or IP
   - permitted uses and field limitations
   - territory or geographic scope
   - exclusivity status and any carve-outs
   - sublicense rights and conditions
   - affiliate, contractor, distributor, or end-user permissions
   - reservation of rights
4. Extract transfer-related terms:
   - assignment restrictions
   - change-of-control triggers
   - consent requirements
   - permitted transferees or exceptions
5. Extract IP ownership and exploitation terms:
   - improvements
   - derivative works
   - feedback
   - jointly developed materials
   - post-termination use or wind-down rights
6. Extract operational compliance terms that materially affect the grant:
   - audit and inspection rights
   - reporting or notice obligations
   - recordkeeping
   - confidentiality
   - data processing or security obligations incorporated by reference
7. Compare the agreements against one another for overlap, conflict, or practical incompatibility.
8. Flag any ambiguity, missing definition, internal inconsistency, or adverse carve-out that narrows the grant more than the headline language suggests.
9. For each risk, provide a severity label, the affected agreement(s), the operative issue, the commercial or operational consequence, and a remediation recommendation.

## 5. Vertical / structural / temporal relationships

Read vertically within each agreement set: definitions, grant clause, restrictions, transfer clause, ownership clause, compliance clause, and termination/post-termination provisions must be read together.

Read temporally across the document stack: later amendments and incorporated updates may narrow, expand, or replace earlier permissions. Where timing matters, identify which document is operative for each issue.

Read structurally across agreements: if two licenses touch the same technology, business line, or counterparty relationship, compare them for overlapping permission, duplicative obligations, or conflicting exclusivity.

Where a clause refers to another document, treat the referred document as part of the operative universe for the limited subject addressed. If the referral is partial, keep the analysis equally limited.

## 6. Output structure conventions

Use an industry-conventional matrix format with one row per term category and one column per agreement set, including amendment status or operative-date status in the column header.

Include rows that separately capture:
- license subject / technology definition
- field of use
- geography / territory
- exclusivity
- sublicense rights
- affiliate / contractor / third-party use
- assignment / transfer / change-of-control
- improvements / derivative works / feedback ownership
- audit / reporting / recordkeeping
- confidentiality / data-processing / security obligations
- termination or post-termination survival items that affect continued use
- notable reservations, carve-outs, or implied limitations

For each row, state the operative term succinctly and note whether the term is express, limited, conditioned, or absent. Use the same terminology across all agreements so comparisons remain readable.

Add a risk flags section with an ordinal severity scale defined once and applied consistently to every entry. Each risk entry should include:
- severity
- issue description
- affected agreement(s)
- why it matters commercially or operationally
- the controlling contract language or document linkage that creates the issue
- recommended remediation

When the issue turns on a legal proposition, cite the controlling contractual provision or recognized doctrine supporting the conclusion. If the source documents identify a governing rule, use that citation; otherwise cite the relevant general contract-interpretation or IP-license principle from standard practice.

End with a concise Recommended Actions section that assigns each follow-up step to a responsible role and gives a timing anchor tied to deal review, signature, amendment, or closing workflow.

Keep the final deliverable complete enough that a reader can see the current operative license profile, the cross-agreement conflict map, and the practical remediation path without consulting the source stack again.
