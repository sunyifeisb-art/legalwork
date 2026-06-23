---
name: identify-issues-joint-development-agreement
task_id: intellectual-property/identify-issues-in-joint-development-agreement
description: Reviewing a joint development agreement against related governance, data access, insurance, and product specification materials to identify intellectual property ownership ambiguities and structural risks.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Joint Development Agreement

## 1. Subject-matter triage

- Treat the JDA as the primary instrument, but read it together with any governance, data, insurance, specification, and communications materials that bear on ownership, use rights, approvals, or scope.
- Start by identifying the full set of parties, assets, deliverables, and decision-makers implicated by the source set; if only one disputed asset category exists, say so explicitly before analyzing it.
- Separate background IP, developed IP, derivative/improvement IP, data, and commercialization rights before evaluating any risk.

## 2. Failure modes the skill is correcting

- Reviewing the JDA in isolation and missing cross-document restrictions on ownership, licensing, transfer, approval rights, or commercialization authority.
- Treating joint ownership as harmless and failing to flag that, absent contrary agreement, a joint owner may be able to exploit jointly owned IP without consent or accounting to the other owner.
- Failing to distinguish background IP from foreground IP and improvements, which can leave ownership and license scope ambiguous.
- Missing data contribution and data-use ambiguities where one party supplies proprietary, sensitive, or structurally valuable data for development.
- Overlooking inconsistencies between the JDA and governance materials, insurance evidence, product specifications, or side communications.
- Issuing a descriptive memo that does not rank issues by severity or end with concrete fixes.

## 3. Legal frameworks / domain conventions that apply

- Joint ownership doctrine: under applicable patent and contract principles, absent a contrary agreement, each joint owner may have broad exploitation rights in jointly owned IP; the memo should therefore test whether the JDA narrows or reallocates those rights.
- Contract drafting convention: the agreement should clearly allocate background IP, foreground IP, improvements, and derivative works, and should specify whether any implied license arises from the development relationship.
- Data-rights convention: contributed data should be addressed expressly as to ownership, permitted development use, retention after termination, confidentiality, and any commercial use outside the project.
- Governance consistency: any internal approval, consent, technology-transfer, or licensing-control provision in the source set can override or constrain the apparent commercial freedom of the JDA.
- Insurance convention: required coverage should be tested against the actual policy/certificate for coverage type, limit, term, named insured status, and additional-insured status if applicable.
- Specification consistency: product or technical specifications should align with the agreement’s defined scope, milestones, and deliverables; mismatches can create performance, ownership, or acceptance disputes.
- Communications evidence: written commitments in emails or similar materials may create interpretive risk even if not fully incorporated; flag any material understanding not reflected in the executed documents.
- Authority framing: when stating a legal rule, identify the governing doctrine, statute, regulation, or other controlling authority as named in the source set or as generally recognized in the field.

## 4. Analytical scaffolds

1. Build an issue map by category: IP ownership, data rights, governance conflicts, insurance, specification consistency, and unincorporated commitments.
2. For each issue, identify the exact agreement provision, the interacting provision or external document, and the resulting commercial or legal consequence.
3. Where the agreement allocates rights by category, test the allocation in this order: background IP, foreground IP, improvements, data, and commercialization rights.
4. Where the agreement is silent, assess whether silence creates an implied right, an ownership gap, or a control gap that should be fixed expressly.
5. For each issue, scale the risk by reference to the relevant source fact available: asset category, project stage, data sensitivity, coverage term, approval threshold, or other concrete source measure.
6. If multiple parties, datasets, products, or insurance instruments are in play, enumerate them first and analyze each one separately rather than using a single representative pass.
7. Close each issue by stating: what in the source set creates the concern, what other document or clause interacts with it, and what consequence follows for the client.
8. Assign a uniform severity label to every issue and keep the scale consistent across the memo.

## 5. Vertical / structural / temporal relationships

- Compare the JDA to related documents vertically: the operative agreement at the top, then governance approvals, then insurance evidence, then technical specifications, then correspondence.
- Note any temporal mismatch: pre-signing promises later omitted, insurance effective dates that do not cover the development period, or specification changes that post-date the JDA but alter the scope.
- Track whether rights, approvals, or obligations survive termination, continue through commercialization, or end with project completion.
- Where a later document narrows or expands an earlier commitment, flag the chronology and identify which text appears controlling on its face.

## 6. Output structure conventions

- Write a prioritized issues memorandum for a lead partner, not a deal summary.
- Open with a short severity legend using an ordinal scale such as Critical / High / Medium / Low; apply it consistently to every issue entry.
- Organize the body by issue category rather than by document chronology, but within each category lead with the most material risk.
- For each issue entry include: severity, affected provision or document, concise issue statement, source evidence, cross-reference to the interacting clause or document, risk to the client, and recommended fix or follow-up.
- Quantify or otherwise scale the issue using a concrete source fact where available, but do not invent numbers or perform placeholder arithmetic.
- Cite the controlling legal principle by name where a proposition depends on doctrine or rule, rather than asserting the conclusion bare.
- End with a distinct Recommended Actions section that assigns an imperative next step, the responsible role, and a timing anchor tied to the deal schedule or the need for prompt remediation.
- Keep the memo concise, prioritized, and implementation-oriented; avoid repeating the source text and avoid quoting internal materials verbatim except where the task specifically requires surface verbatim quotes from internal documents.
