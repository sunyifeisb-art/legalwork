---
name: its-draft-ofac-specific-license-application
task_id: international-trade-sanctions/draft-ofac-specific-license-application
description: Produces a complete OFAC specific license application package and a pre-filing issues memorandum that addresses required application elements, party-screening disclosures, line-item schedule checks, shipping route completeness, and re-export authorization requirements for the full transaction chain.
activates_for: [planner, solver, checker]
---

# Skill: Draft OFAC Specific License Application

## 1. Subject-matter triage

- Treat the assignment as a filing package plus a companion advisory memo.
- Draft the application package as the primary deliverable first; do not let the memo substitute for missing application content.
- Separate what must be filed from what should be flagged internally before filing.
- If the source set contains multiple parties, goods, routes, or legs, enumerate them before analysis and keep each leg distinct.

## 2. Failure modes the skill is correcting

- Producing a narrative application without the mandatory filing components the agency will independently check.
- Omitting screened-party connections identified in diligence, especially where an intermediary, logistics actor, payment participant, or affiliate creates a disclosure issue.
- Analyzing only the origin export while overlooking whether a downstream transit or re-export leg needs separate authorization.
- Leaving route, end-user, or goods details incomplete, which makes the application internally inconsistent.
- Failing to distinguish issues that block filing from issues that can be cured with clarification or supplementary support.

## 3. Legal frameworks / domain conventions that apply

- Specific license applications are completeness-driven filings: present the applicant, the requested authorization, the transaction narrative, the parties, the goods or services, the legal basis, and the justification in a single coherent package.
- The application should identify the end-user and any known intermediaries with enough specificity to allow screening and agency review.
- The goods schedule should track the commercial record and reflect each line item consistently across description, quantity, unit value, and total value, without unexplained gaps.
- The shipping description should cover origin, route, transit points, transshipment hubs, and final destination as a complete chain.
- If the transaction includes movement through a third country, assess whether that leg is separately regulated under sanctions or export-control rules and whether the requested authorization reaches it.
- Disclosures should be candid and complete; if a screened or blocked connection is known, explain it and the filing theory for proceeding, rather than omitting it.
- Where the source documents identify authority, cite the governing sanctions framework, the relevant executive order or regulation, and any other controlling provision as stated in the materials or standard practice.

## 4. Analytical scaffolds

1. Identify every party, consignee, intermediary, freight actor, payment actor, and affiliated person mentioned in the source documents.
2. Determine whether the source set describes more than one shipment, route leg, or authorization issue; if so, separate them and analyze each item independently.
3. Draft the application cover information first: applicant identity, counsel or preparer identity if used, requested license scope, and filing contact details.
4. Draft the transaction narrative with the requested authorization, the commercial purpose, and the sanctions or export-control basis that supports the request.
5. Build the goods schedule from the commercial documents, using the source descriptions consistently and reconciling any mismatch before finalizing.
6. Map the full logistics path from origin to final destination, including all transit and transshipment points, and identify any leg that may require independent authorization.
7. Test screened-party and blocked-party information against the transaction chain and decide what must be disclosed affirmatively in the filing.
8. Add prior licensing history or enforcement history only where the source documents supply it or where it is relevant to the requested authorization.
9. Convert all open questions into bracketed confirmation items so the filing can be completed without silent assumptions.

## 5. Vertical / structural / temporal relationships

- Distinguish the direct export from any downstream movement after transshipment; a permissive view for one leg does not automatically authorize the other.
- Preserve the order of the transaction chain: applicant, supplier, exporter, freight path, transit points, end-user, and any payment chain should read as a single sequence.
- Keep internal issues tied to their filing consequence: missing data that prevents submission, missing data that weakens authorization, or data that can be cured by supplementation.
- When several issues arise from one fact pattern, organize them by the stage at which they arise so the memo mirrors the filing workflow.

## 6. Output structure conventions

- Produce two deliverables: a specific license application package and an internal issues memorandum.
- The application package should read like a filing-ready packet, not an outline; include the operative narrative, schedules, and disclosure sections in final form with brackets only for items still to confirm.
- The memo should be advisory and action-oriented, with each issue stated as a discrete entry that includes a uniform severity label, the controlling authority or regulatory basis, the filing consequence, and the fix.
- Use conventional legal headings rather than copying any hidden rubric structure.
- End the memo with a concise Recommended Actions section stating the next step, the responsible internal role, and the timing anchor tied to filing.
- Before completion, confirm in the final review that the application file exists, is non-empty, and contains substantive filing content rather than a summary of what would be filed.
