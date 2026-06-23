---
name: draft-board-resolution-credit-facility
task_id: banking-finance/draft-board-resolution-credit-facility
description: Drafts a board resolution authorizing a senior secured revolving credit facility and a cover memo, ensuring corporate authorization is procedurally valid and aligned with the governing documents and commitment terms.
activates_for: [planner, solver, checker]
---

# Skill: Board Resolution Drafting — Senior Secured Credit Facility Authorization

## 1. Subject-matter triage
- Determine whether the source set supports a clean authorization, an authorization subject to conditions, or an authorization with explicit exceptions and ratification.
- Identify the facility type, collateral package, guarantor structure, signing authority, and any pre-closing consents before drafting operative language.
- Separate what the board can authorize from what third parties must still approve.

## 2. Failure modes the skill is correcting
- Drafting a resolution that authorizes only one officer when the governing documents require joint execution above a specified transaction size.
- Failing to exclude board observers from the quorum count and vote, which can render a resolution defective.
- Overlooking required third-party consents under stockholder agreements, existing credit agreements, or similar contracts that must be obtained before the borrower can enter into a new credit facility.
- Not addressing accordion or incremental facility authorization separately, leaving draws on those features potentially unauthorized.
- Treating preliminary officer actions as fully authorized without ratification language where the source materials show steps already taken.
- Authorizing collateral or guaranty steps in generic terms when the transaction calls for specific approval mechanics.

## 3. Legal frameworks / domain conventions that apply
- Third-party consent requirements: stockholder agreements, existing credit agreements, and similar contracts may require consent from specified parties before the borrower can enter into a new credit facility; if consent has not been obtained, treat it as a condition to closing and flag it in the resolution materials.
- Officer signing authority: corporate bylaws or equivalent governing documents designate which officers may execute contracts above a specified transaction size; if the facility size requires multiple officers to sign rather than one alone, compare the resolution against those requirements and authorize the needed signatories.
- Board observer vs. director: a board observer may attend and participate in meetings but typically does not vote and is not counted for quorum purposes; if an observer is included in the quorum count or vote, the resolution materials should correct that treatment.
- Director abstention: a director who abstains is typically not counted as voting for or against; however, some governing documents require approval by the full board, including abstaining directors, rather than only those voting; verify the approval threshold against the governing documents.
- Ratification of prior actions: if officers have already taken preliminary steps toward the financing, include ratification language to confirm authority for those acts.
- Subsidiary guarantees: if subsidiary guarantors are required, confirm whether they need their own board approvals and whether the parent needs authority to cause those subsidiaries to provide guarantees.
- Accordion/incremental authorization: if the facility includes an accordion or incremental feature, authorize that feature expressly and describe the maximum capacity in categorical terms consistent with the financing documents.
- Real property mortgages: pledging real property as collateral generally requires specific corporate authorization beyond a general facility authorization; identify each mortgaged property and include specific authorization for the related security documents.

## 4. Analytical scaffolds
1. Third-party consents: identify all required consents; flag any not yet obtained; reflect the consent condition in the closing analysis or resolution package.
2. Signing authority: compare the authorized signatories against the governing-document requirements for the transaction size; identify any mismatch; align the resolution language to the applicable authority structure.
3. Board observer: identify any participant who is a board observer, not a director; exclude that person from quorum and vote counts in the resolution materials.
4. Abstention impact: analyze whether an expected abstention still results in the required approval threshold under the governing documents.
5. Ratification: include ratification of prior preliminary actions where appropriate.
6. Subsidiary guarantees: authorize the parent to cause subsidiary guarantors to execute guarantees, and confirm whether separate subsidiary approvals are needed.
7. Accordion authorization: include specific authorization for the accordion or incremental feature up to the maximum contemplated by the financing documents.
8. Real property mortgages: include specific authorization for each mortgaged property identified in the transaction materials.

## 5. Vertical / structural / temporal relationships
- Work from authorization mechanics to execution mechanics: board approval, officer authority, conditions precedent, ancillary documents, and closing actions.
- Reconcile the resolution against the governing documents, financing documents, and any consent requirements as a single approval chain.
- Treat timing dependencies explicitly: pre-signing approvals, pre-closing consents, closing deliverables, and post-closing ratifications should not be merged.

## 6. Output structure conventions
- Draft the board resolution in proper corporate form with WHEREAS recitals and RESOLVED clauses.
- Draft the cover memo as a separate advisory document that identifies issues, gaps, and the procedural path forward.
- In the memo, state each issue, the governing authority or document basis for it, the risk if unaddressed, and the recommended next step.
- Use conventional legal drafting language, but keep the authorization language specific enough to match the actual transaction mechanics in the source set.
- Preserve internal consistency across parties, dates, facility terms, and approval mechanics in both deliverables.
- Because this is a drafting task, produce the primary resolution first and ensure it is complete before the memo; the memo should not substitute for missing operative authorization.
- Confirm the final package includes both requested files and that the resolution contains operative clauses, not a summary of them.
