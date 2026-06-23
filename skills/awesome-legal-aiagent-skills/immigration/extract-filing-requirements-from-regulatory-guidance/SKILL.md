---
name: extract-filing-requirements-from-regulatory-guidance
task_id: immigration/extract-filing-requirements-from-regulatory-guidance
description: Filing requirements checklist for pending immigration petitions extracted from regulatory guidance documents, where the checklist should capture both core procedural requirements and petition-specific risks arising from beneficiary facts and filing logistics.
activates_for: [planner, solver, checker]
---

# Skill: Extract Filing Requirements from Regulatory Guidance

## 1. Subject-matter triage

Separate the source set into two layers before drafting anything:
- generally applicable regulatory guidance governing the petition type;
- intake or filing-specific materials identifying the pending petition, beneficiary facts, timing constraints, and logistics.

Treat the checklist as a compliance tool, not a summary. Every extracted requirement should be tied either to a filing-package item, a pre-filing prerequisite, or a petition-specific risk flag.

If more than one pending filing is in scope, enumerate each filing first by petition category and beneficiary, then apply the framework to each filing separately.

## 2. Failure modes the skill is correcting

- The output restates general filing rules but does not map them to the pending petition(s), leaving the client without an actionable checklist.
- Pre-filing prerequisites and filing-package items are blended together, obscuring what must be completed before submission.
- Timing-sensitive requirements are listed without checking whether the filing date permits completion.
- Beneficiary facts that create petition-level risk are omitted or buried in prose instead of being surfaced as checklist items.
- A prior denial or similar adverse history is treated as background only, rather than as a live risk factor that must be addressed in the filing strategy.
- Logistics for signatures, notarization, apostille, translations, or outside-country execution are ignored even though they affect readiness.
- The checklist uses generic labels like “urgent” or “important” instead of a uniform severity field.
- The analysis states a requirement without naming the governing authority or regulatory source that supports it.

## 3. Legal frameworks / domain conventions that apply

- Anchor each filing requirement to the governing statute, regulation, form instruction, agency guidance, or other controlling authority named in the source materials or generally recognized for the petition type.
- For prerequisites imposed by regulation or agency process, state whether the step must occur before filing, whether it can run in parallel, and what document or agency action proves completion.
- For evidence-based eligibility questions, distinguish between threshold eligibility facts, supporting corroboration, and discretionary risk factors.
- For advisory opinions, labor-market steps, certifications, or comparable external prerequisites, identify the issuing body, the expected lead time, and whether the prerequisite is a gating item.
- For petitions involving specialized knowledge, extraordinary ability, or similarly heightened standards, assess whether the available facts are specific enough for the evidentiary burden and whether the record appears vulnerable to scrutiny.
- For any adverse prior history, treat the earlier outcome as relevant context that may require an affirmative response strategy, even if not binding.
- For foreign-based declarants or signatories, flag practical execution issues such as notarization, apostille, translation, courier timing, and local authentication limits.

## 4. Analytical scaffolds

1. Extract requirements by category: forms, fees, evidence, eligibility predicates, supporting declarations, translations, signatures, and filing timing.
2. Split each requirement into one of three buckets: pre-filing prerequisite, filing-package requirement, or post-filing follow-up item.
3. Map the pending filing(s) to the extracted requirements and determine which items are satisfied, missing, uncertain, or time-sensitive.
4. For each filing, identify beneficiary-specific facts or logistics that increase risk or affect sequencing.
5. Check deadline feasibility against lead times, expiration dates, document-collection constraints, and agency processing dependencies.
6. State each issue in a way that identifies the rule, the relevant factual trigger, and the filing consequence.

## 5. Vertical / structural / temporal relationships

Use sequence logic, not just a flat list:
- prerequisite first, filing package second, post-filing follow-up last;
- legal eligibility first, evidentiary support second, execution logistics third;
- beneficiary facts first, then how those facts affect the record, then the filing risk they create.

When multiple filings are pending, keep them distinct. For each filing, include:
- the governing petition category;
- the beneficiary or subject filing;
- the outstanding or satisfied requirements;
- any sequencing constraints;
- any timing conflict or execution barrier.

When a requirement depends on another document or agency action, note the dependency explicitly rather than collapsing it into a single checklist line.

## 6. Output structure conventions

- Use a checklist format organized in two parts: universal requirements from the regulatory guidance, then filing-by-filing application to the pending matters.
- Define a simple ordinal severity scale once near the top and apply it uniformly to each risk flag or gap item.
- For each checklist entry, include:
  - the requirement or issue;
  - the controlling source or authority;
  - the severity;
  - whether it is a prerequisite or filing-package item;
  - the filing(s) affected;
  - the practical consequence if unresolved.
- Keep the language operational: write items as actions or decision points, not narrative background.
- If a requirement is contingent on a fact not yet confirmed in the intake materials, label it as unknown and list the fact needed to resolve it.
- End with a concise recommended actions block that assigns next steps to the relevant filing owner or preparer and ties each step to the filing timeline.
