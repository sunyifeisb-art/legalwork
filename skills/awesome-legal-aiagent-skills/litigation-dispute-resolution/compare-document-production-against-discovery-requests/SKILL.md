---
name: compare-document-production-against-discovery-requests
task_id: litigation-dispute-resolution/compare-document-production-against-discovery-requests
description: A discovery gap analysis requires comparing each requested document category against the production index and privilege log to identify what was not produced, assess the sufficiency of privilege assertions, and evaluate whether a motion to compel is warranted.
activates_for: [planner, solver, checker]
---

# Skill: Compare Document Production Against Discovery Requests — Discovery Gap Analysis Memorandum

## 1. Subject-matter triage

- Treat the source set as a three-way comparison: discovery requests, document production, and privilege/discovery responses.
- Identify the governing procedural setting first: federal or state discovery rules, the applicable scheduling order, and any meet-and-confer requirement that conditions relief.
- If multiple request sets, custodians, periods, or response rounds are in play, enumerate them before analysis and run the same comparison pass for each.
- Keep the deliverable focused on gap analysis, not merits of the underlying breach or fraud claims except where those claims explain relevance, proportionality, or privilege disputes.

## 2. Failure modes the skill is correcting

- Reviewing the privilege log in isolation without comparing it to the production index and request categories to identify what was withheld from each requested category.
- Accepting vague privilege log descriptions without assessing whether they are sufficiently detailed to support the privilege claim.
- Missing the meet-and-confer history as context for assessing which gaps were disclosed, promised, narrowed, or still disputed before the motion deadline.
- Failing to distinguish between production gaps and privilege gaps, including documents withheld on stated privilege grounds but supported by deficient log entries.
- Collapsing distinct request categories into one generalized complaint instead of tracing document-by-document or category-by-category mismatches.
- Stating that a gap exists without tying it to the response language, the production record, and the practical consequence for discovery relief.

## 3. Legal frameworks / domain conventions that apply

- Apply the governing discovery rules for relevance, proportionality, objections, and disclosure of withheld materials, including the duty to state whether responsive material is being withheld and on what basis.
- Use the applicable privilege framework for attorney-client privilege, work product, and any other asserted protection; assess each assertion against the document type and context.
- Privilege logs must be detailed enough to permit assessment of the claim without revealing privileged substance; conclusory or business-only descriptions may support waiver or compelled supplementation under the governing rule and local practice.
- A withholding party that relies on an objection should be tested for whether the objection is complete, partial, preserved, or waived under the applicable rule set and case law.
- If the party has placed privileged communications or advice at issue while withholding the same material, assess the sword-and-shield problem under the controlling privilege doctrine.
- If fraud-related facts suggest wrongdoing, consider whether the crime-fraud exception and in camera review are plausibly implicated under the governing standard.
- Motion practice is usually conditioned on good-faith conferral and may be limited by a discovery cutoff or motion deadline in the scheduling order.
- Cite the specific controlling rule, statute, or leading case relied on in the memorandum whenever stating a privilege, waiver, or motion-to-compel proposition.

## 4. Analytical scaffolds

- Build a request-by-request matrix: request category, response language, production entries, privilege-log entries, and any follow-up correspondence.
- For each request category, determine whether the production is: complete, partial, nonexistent, or internally inconsistent with the response.
- Where production appears incomplete, cross-check whether the response expressly withholds documents, objects only in part, or states that no responsive documents exist.
- Review the privilege log entry by entry; test whether each entry identifies the author/recipient, date range, document type, privilege asserted, and enough context to evaluate the claim.
- Flag entries that omit counsel involvement where it matters, describe the document only in generic business terms, or assert privilege for ordinary business communications without an apparent legal purpose.
- Compare interrogatory answers, admissions, or narrative discovery responses against produced documents to identify contradictions, omissions, or unexplained narrowing.
- Measure each gap against the scale of the request and the dispute, and explain why the gap matters to the claims or defenses at issue.
- When a gap is material, state the procedural path: further conferral, revised log, supplemental production, partial motion to compel, or in camera review.
- For every issue, include the governing authority for the objection, privilege, or disclosure principle being invoked, and connect it to the source material rather than asserting it abstractly.
- Close each issue by tying the gap to the downstream consequence for the requesting party, such as inability to test a claim, missing impeachment material, or inability to assess the privilege assertion.

## 5. Vertical / structural / temporal relationships

- Track how request categories relate to each other, especially where one request seeks documents that should exist if another response is accurate.
- Track chronology: pre-complaint communications, contract formation, alleged breach period, fraud period, retention of counsel, and the dates of production and privilege entries.
- Note whether privilege assertions concern documents created before legal advice was sought, during litigation, or after a dispute had crystallized; timing often affects the privilege analysis.
- Note whether the same subject matter appears in both produced documents and withheld entries, because overlap can indicate incomplete production or selective logging.
- If meet-and-confer letters resolved some categories but not others, separate closed items from live disputes and preserve the sequence of concessions and refusals.

## 6. Output structure conventions

- Write the memorandum as a gap analysis, not a discovery narrative.
- Use a clear severity field for each issue with a uniform ordinal scale defined once near the top, and apply it consistently to every entry.
- Organize the body by gap type, such as: missing production, deficient privilege log entries, inconsistencies across responses, and unresolved meet-and-confer items.
- For each entry, include: request category, gap description, controlling authority, why the response is deficient, meet-and-confer status, severity, and recommended relief.
- When more than one request category or source set is implicated, use a separate row or subheading for each rather than aggregating them into one paragraph.
- Identify which items belong in a motion to compel, which warrant supplemental conferral, and which may be deferred because the record is incomplete.
- End with an explicit Recommended Actions block naming the responsible role and a timing anchor tied to the discovery cutoff, motion deadline, or other source-based milestone.
- Format the memo consistently for a legal work product intended to become `discovery-gap-analysis.docx`; do not rely on any hidden rubric structure or internal checklist.
