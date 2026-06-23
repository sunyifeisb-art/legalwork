---
name: extract-conditions-precedent-from-indenture
task_id: structured-finance-securitization/extract-conditions-precedent-from-indenture
description: Extract closing conditions precedent from an ABS indenture and related transaction documents to prepare a compliance checklist, while identifying cross-document inconsistencies, inapplicable conditions carried forward from a prior deal checklist, and structural issues such as reserve account funding sequencing.
activates_for: [planner, solver, checker]
---

# Skill: Extract Conditions Precedent from Indenture and Prepare Closing Compliance Checklist

## 1. Subject-matter triage (only if applicable)

- Treat this as a document-extraction and issue-spotting task, not a freeform legal memo.
- Identify the operative closing package first, then separate true conditions precedent from post-closing covenants, ministerial deliverables, and background recitals.
- If a prior deal checklist is supplied, treat it as a candidate reference only; every carried-forward item must be re-tested against the current structure.

## 2. Failure modes the skill is correcting

- Adapting a prior closing checklist without reviewing each item for applicability to the current deal structure, which can import inapplicable conditions and omit conditions required by the current transaction.
- Missing circularity in reserve account funding mechanics where the reserve account must be funded at closing from the same note proceeds that depend on the issuance mechanics.
- Failing to identify principal amount discrepancies between transaction documents, which must be reconciled before conditions can be certified as satisfied.
- Collapsing multiple document sources into one assumed checklist without tracking where each condition actually appears.
- Treating an ongoing covenant, filing, or later-delivery obligation as though it were a condition to initial closing.
- Recording a condition without noting the document conflict, the practical closing impact, and the next action needed to resolve it.

## 3. Legal frameworks / domain conventions that apply

- True sale opinion chain: in multi-step asset-backed structures, confirm whether the required opinion covers each transfer step in the chain; a closing checklist should verify that the opinion scope matches the full transfer structure.
- Backup servicer operational readiness: distinguish between appointment or engagement and an operational-readiness confirmation; the checklist should identify whether the relevant document requires one or both.
- Reserve account funding sequencing: trace how the reserve account is funded at closing and whether any condition precedent inadvertently requires funding before the source proceeds exist; if so, flag the sequencing issue for resolution.
- Minimum denomination consistency: transaction documents may specify different minimum denominations for the same note class; reconcile the documents before closing and identify the operative denomination term.
- Ongoing obligations versus closing conditions: identify whether a listed item is a post-closing reporting or filing obligation rather than a condition to initial closing, and separate it from true closing deliverables.
- Tax opinion scope: compare each document’s tax opinion requirement and identify which opinion covers which transaction step or entity; flag any gap in coverage.
- LLC signatory requirements: if an issuer or obligor is organized as an LLC, verify that the officer’s certificate is executed by an authorized person in the capacity required by that entity’s governing documents and applicable law.
- Authority and execution mechanics: verify that each deliverable is tied to the governing document section or other controlling authority referenced in the source set, and do not state a closing requirement without the document basis for it.

## 4. Analytical scaffolds

1. Identify every source document in the package and determine which documents actually govern initial closing conditions.
2. Extract each stated condition precedent verbatim only to the extent needed to preserve meaning, then convert it into a checklist item with source citation.
3. Separate conditions by document and by functional category, such as organizational, opinions, filings, collateral, funding, rating, account setup, and officer certificates.
4. Cross-check the indenture against the sale, servicing, underwriting, administration, account control, and prior checklist materials for conditions that appear in one place but not another.
5. For each item, decide whether it is a true closing condition, a closing deliverable, a post-closing covenant, or an assumption embedded in the checklist.
6. True sale opinion: confirm whether the required opinion covers the relevant transfer steps; flag any ambiguity about scope.
7. Backup servicer: confirm whether the checklist requires an operational-readiness confirmation rather than only an engagement letter or appointment.
8. Reserve account funding: trace the mechanics and flag any circularity; recommend a clear funding sequence.
9. Minimum denomination: compare the denomination specifications in the operative documents for each class; flag any inconsistency.
10. Ongoing obligations: identify any condition that is actually a post-closing obligation incorrectly listed as a closing condition; recommend removal from the closing checklist.
11. Tax opinion scope: compare the opinion requirements across documents; flag any gap in coverage.
12. LLC signatory: confirm the signatory capacity stated in the checklist is correct for the issuer’s organizational form.
13. Principal amount: compare the aggregate stated across documents; flag any discrepancy.
14. Prior deal checklist review: confirm each carried-forward item is applicable to the current deal; add new items required by the current structure.
15. Issues memo: for each issue, state the affected document set, the conflict or omission, the closing consequence, and the corrective path.

## 5. Vertical / structural / temporal relationships

- Reserve account funding sequencing and note issuance sequencing are interdependent; the closing funding sequence should be documented so that proceeds flow in the required order and the conditions precedent are tested in that order.
- True sale opinion scope and LLC signatory requirements may interact; confirm both before finalizing the closing deliverables and before relying on any executed certificate.
- When a condition depends on another deliverable being delivered first, preserve that dependency in the checklist order rather than flattening it into a generic list.
- If the documents require simultaneous closing steps, note the sequencing constraint explicitly so the checklist does not imply a false order.

## 6. Output structure conventions

- Produce the closing conditions checklist first, and make it the operative deliverable; only then draft the issues memorandum.
- Checklist format: use conventional closing-checklist grouping by category, with an item line that states the deliverable, the responsible party if identifiable, the source document and section reference, and a status field or completion column if appropriate.
- Separate true conditions precedent from deliverables that are merely supporting documents or post-closing actions.
- Issues memorandum: define a simple ordinal severity scale at the top and apply it consistently to each issue.
- For each issue, include: severity, concise issue statement, source documents involved, why the inconsistency or omission matters for closing, and the proposed resolution path.
- Where multiple conditions or discrepancies are present, list them item-by-item rather than collapsing them into a single umbrella observation.
- End the memorandum with a short Recommended Actions block that assigns the next step to a role drawn from the source set and ties it to the closing timeline or another transaction milestone.
- Use controlling authority or document authority for each legal proposition or closing requirement you rely on; cite the relevant section, rule, or document source in the item itself rather than leaving the basis implicit.
