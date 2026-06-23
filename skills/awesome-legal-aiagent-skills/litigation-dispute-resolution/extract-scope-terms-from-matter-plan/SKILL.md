---
name: extract-scope-terms-from-matter-plan
task_id: litigation-dispute-resolution/extract-scope-terms-from-matter-plan
description: Extracting scope terms from engagement materials requires identifying scope-defining provisions across the relevant engagement materials, then flagging any inter-document inconsistencies that create ambiguity about what work is authorized.
activates_for: [planner, solver, checker]
---

# Skill: Extract Scope Terms from Matter Plan — Structured Extraction Report

## 1. Subject-matter triage

- Read the full engagement set before extracting any term; scope language is often split across the matter plan, engagement letter, budget, and related communications.
- Identify the document set first, then determine whether there is a later revision, addendum, amendment, or negotiated email chain that changes scope.
- Treat the task as both extraction and comparison: the output must surface each scope-defining term and the places where documents diverge.
- If the materials include a hierarchy or order-of-precedence clause, use it to frame which source governs each point of conflict.

## 2. Failure modes the skill is correcting

- Summarizing scope from only one source instead of cross-referencing the whole set.
- Missing later communications that modify or clarify scope before the formal documents were updated.
- Treating all scope language as equally operative without testing document hierarchy or temporal priority.
- Listing inconsistencies without saying which document appears controlling under the stated hierarchy.
- Failing to connect scope definitions to the budget, phase structure, or approval conditions that determine what work is actually authorized.
- Collapsing distinct categories of work into one general description and thereby hiding partial exclusions, conditions, or carve-outs.

## 3. Legal frameworks / domain conventions that apply

- Outside counsel and engagement materials commonly allocate different functions across documents: one document may set relationship terms, another may define the workstream, and a budget or phase plan may constrain what is presently authorized.
- Scope creep is a central billing-risk concept: work performed outside the defined authorization may be disputed absent written approval or a clear amendment.
- Phase-based plans often make later work contingent on completion, review, or express client approval of earlier phases.
- Negotiation communications can matter if they record agreed changes; they should be checked for scope commitments not carried into the formal text.
- The governing analysis is document-based rather than abstract: identify the operative clause, the source hierarchy, and the consequence of any mismatch.
- When citing any legal or practice proposition in the report, identify the controlling authority as stated in the source materials or as the relevant governing rule or practice norm.

## 4. Analytical scaffolds

- Start by enumerating the source documents and their dates, versions, and apparent status before comparing terms.
- For each document, extract every clause that defines, limits, expands, conditions, or excludes scope, including phase gates, approval triggers, assumptions, carve-outs, staffing constraints, and budget-linked limits.
- Separate true scope terms from background recitals or administrative detail unless the language changes what work is authorized.
- Build a term-by-term crosswalk so the same concept is compared across documents rather than summarized globally.
- Where multiple sources address the same term, test whether they are consistent, partially overlapping, or in tension.
- For each tension, identify the apparent controlling source using the stated hierarchy, then flag any residual ambiguity that the hierarchy does not resolve.
- Review the budget or estimate against the phase structure and scope language to determine whether the planned resources align with the authorized work.
- If the materials contain approval or sign-off mechanics, capture those as scope conditions, not mere process notes.
- If a later document narrows or expands earlier language, note the change expressly and treat the later text as potentially superseding the earlier text on the addressed topic.
- Keep the analysis anchored in the words used in the materials; do not infer unstated scope from business context alone.

## 5. Vertical / structural / temporal relationships

- Later-dated revisions, amendments, or confirmations may supersede earlier scope language for the topics they address.
- A document that is higher in the stated hierarchy may control on the subject it governs even if another document is more detailed on a different subject.
- Phase sequencing matters: a later phase may not be authorized until a prior milestone or client approval is satisfied.
- If the materials contain conflicting dates, version labels, or execution timing, resolve them before treating any clause as operative.
- If budget terms were updated after the underlying scope language, note whether the budget reflects the updated scope or lags behind it.

## 6. Output structure conventions

- Use a structured extraction table with fields that map each scope term to its source, location, and governance status.
- Include a separate inconsistency register that states the conflicting terms, the documents involved, the apparent control rule, and any unresolved ambiguity.
- Include a concise hierarchy note explaining which document type appears to govern which category of scope term.
- Include a budget alignment note where the materials permit comparison between authorized scope and allocated resources.
- Use a clear issue taxonomy such as: aligned, modified, inconsistent, conditional, or unresolved.
- Keep the report analytical rather than narrative; the reader should be able to trace each scope term back to a source location.
- File the deliverable under the name specified in the task instructions: `scope-extraction-report.docx`.
