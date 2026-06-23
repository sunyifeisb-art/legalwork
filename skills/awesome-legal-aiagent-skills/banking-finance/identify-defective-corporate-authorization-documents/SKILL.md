---
name: identify-defective-corporate-authorization-documents
task_id: banking-finance/identify-defective-corporate-authorization-documents
description: Reviews corporate authorization documents for a credit facility closing across multiple entity types and jurisdictions, and prepares a structured issues memo organized by severity.
activates_for: [planner, solver, checker]
---

# Skill: Corporate Authorization Deficiency Memo — Senior Secured Credit Facility

## 1. Subject-matter triage
- Identify each entity in the closing set and group the review by entity, not by document type.
- For each entity, first determine the governing organizational regime, then the approval path the regime permits, then whether the closing package matches it.
- If the source set contains multiple entities, multiple jurisdictions, or multiple approval instruments, enumerate them explicitly before analyzing defects so each entity receives a separate pass.
- Treat the memo as an issues-spotting exercise: the goal is to isolate closing defects, not to narrate the documents.

## 2. Failure modes the skill is correcting
- Applying the wrong governance standard because the entity’s statute, formation documents, or internal approvals were not identified first.
- Missing defects in written consents, board actions, or manager approvals, including improper approval mechanics, missing waivers, or use of a method the governing documents do not allow.
- Treating manager approval as sufficient where member, shareholder, owner, or similar equity approval is also required.
- Overlooking title, capacity, or execution mismatches between the approving action and the signature block.
- Failing to connect authorization defects to the existing financing package, including consent, amendment, or restricted-transaction issues.
- Ignoring qualification or foreign-registration issues where an entity is acting across jurisdictions.
- Stating a defect without explaining why it matters for closing readiness and how it can be cured.

## 3. Legal frameworks / domain conventions that apply
- Corporate and organizational authority: apply the governing statute, certificate/articles, operating agreement, bylaws, or equivalent internal documents that control the entity’s power to authorize the transaction.
- Written consent mechanics: confirm that the approval method used is permitted and that the required approval threshold was achieved under the governing regime.
- Meeting mechanics: check notice, quorum, attendance, waiver, and proxy restrictions against the applicable statute and governing documents.
- LLC / partnership / similar entities: distinguish manager, member, partner, owner, and equity-holder authority; extraordinary transactions may require more than manager-level approval.
- Special-entity regimes: where the entity is subject to a distinct statutory form, verify whether an extra shareholder or similar approval step is required.
- Officer authority and execution: compare the officer title or capacity approved in the authorization with the title used to sign closing documents; a material mismatch may require re-approval or confirmatory action.
- Existing debt documents: review any outstanding credit, bond, or similar financing documents for restrictions on new indebtedness, liens, guarantees, or amendments that may require lender consent.
- Foreign qualification: identify whether any entity appears to be conducting business in a jurisdiction that may require registration, qualification, or equivalent authority.
- Use the controlling authority named in the source materials where available; otherwise, cite the applicable statute, rule, or governing-document provision that supports the defect analysis.

## 4. Analytical scaffolds
1. **Entity-by-entity pass**: identify the entity, governing regime, and the documents that purport to authorize the closing.
2. **Authority check**: determine whether the approving body had authority to approve the transaction and whether the approval method was permissible.
3. **Threshold check**: compare the consent, vote, or quorum obtained against the required threshold in the statute or governing documents.
4. **Notice and waiver check**: assess notice timing, waiver language, and any proxy or participation restrictions.
5. **Equity-holder overlay**: test whether member, shareholder, owner, or similar approval was also required.
6. **Execution check**: compare approved signatory capacity, title, and scope of authority to the executed signature block and counterparts.
7. **Cross-document consistency**: compare the authorization package with the credit documents, existing financing documents, and any related ancillary agreements.
8. **Jurisdictional overlay**: note any foreign-registration, qualification, or local-law issue that may affect validity or enforceability.
9. **Issue closure**: for each issue, identify the governing authority, the mismatch, the practical consequence for closing, and the most direct cure.
10. **Severity rating**: assign a uniform ordinal severity label to every issue using a defined scale such as Critical / Significant / Minor, and use the label consistently.

## 5. Vertical / structural / temporal relationships
- When multiple documents relate to the same entity, treat them as one approval chain and test whether later documents cure earlier defects.
- When approval authority depends on a sequence, analyze the sequence in order: entity formation authority, internal approval authority, then execution authority.
- When the defect is temporal, check whether the approval was effective when the relevant closing document was signed or whether it was only adopted later.
- When multiple entities share a common approval package, do not assume one entity’s authority cures another’s; analyze each entity separately.

## 6. Output structure conventions
- Title the work as an issues memo organized by entity.
- Start with a brief severity key defining the ordinal scale used in the memo.
- For each entity, use a consistent subheading and include: governing regime, issues identified, severity, controlling authority, and recommended cure.
- For each issue, state the defect in one sentence, then the authority, then the practical consequence for the transaction, then the recommended fix.
- Keep the analysis tied to the closing consequences: whether the defect blocks signing, funding, perfection, enforceability, or later ratification.
- Include a closing summary that tallies the issues by severity and flags any item likely to require re-execution, supplemental consent, or lender waiver.
- End with a Recommended Actions section that assigns a concrete action, a responsible role, and a timing anchor tied to the closing process.
