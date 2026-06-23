---
name: extract-land-option-agreement-terms-wind-oregon
task_id: energy-natural-resources/extract-land-option-agreement-terms
description: Guides extraction and issue spotting for a wind farm land option agreement by comparing operative terms against the relevant project playbook and comparable transactions, identifying ambiguities in payment mechanics, assessing enforceability risks under the applicable property-law framework, and noting provisions whose practical effect diverges from their apparent purpose.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Land Option Agreement for Wind Farm Project

## 1. Subject-matter triage

- Treat the land option agreement as a transactional document with both extraction and advisory components: identify the operative economics, control rights, conditions to exercise, recording mechanics, and post-exercise obligations.
- Before analysis, map the source set into distinct inputs: the agreement, the playbook, the project summary, the lender diligence checklist, and any comparables or term summaries. If only one version of a term appears in the record, say so explicitly.
- Where the agreement uses defined terms that control multiple provisions, extract the definition first and then assess each downstream clause against it.

## 2. Failure modes the skill is correcting

- Baseline lists a term but does not test whether the term matches the playbook standard or diverges from the comparable deal set.
- Baseline notes a restriction or consent right without assessing whether the drafting makes the right meaningful in practice or merely formal.
- Baseline identifies payment language without resolving whether multiple payment streams are cumulative, substitutive, or credited against one another.
- Baseline flags a lender-facing covenant or security concept but misses whether the timing, scope, or recordability deviates from the diligence checklist.
- Baseline states a legal risk in conclusory form without naming the property-law doctrine or contract principle that supports the risk.
- Baseline collapses several independent provisions into one summary and loses issue-specific consequences, severity, and action items.

## 3. Legal frameworks / domain conventions that apply

- Wind project land options are typically evaluated against a project playbook, a lender diligence checklist, and market comparables; deviations matter most where they affect site control, bankability, record notice, payment certainty, or transferability.
- Payment mechanics: extract all option payments, exercise payments, rent, escalation, royalties, reimbursement rights, and separate site-use charges; test whether the agreement states if amounts are exclusive, cumulative, credited, or offset.
- Exercise mechanics: identify notice periods, exercise conditions, cure rights, and any conditions precedent that could narrow the option holder’s ability to vest site control.
- Assignment and transfer restrictions: assess whether any consent right is sufficiently tailored to avoid an impermissible restraint on alienation under the governing state property law; if the agreement implicates that doctrine, flag the governing rule or jurisdictional standard used in the source set or recognized practice.
- Recording and notice: evaluate whether any memorandum of option or similar recording instrument is adequate to provide constructive notice, including property identification, term reference, and internal consistency with the underlying agreement.
- Default, abandonment, and termination: examine whether carve-outs, grace periods, and force majeure language collectively make termination rights illusory or postpone them beyond the business purpose of the provision.
- Decommissioning and security provisions: compare timing, amount-setting method, and triggers for posting assurance against the playbook and lender checklist, because late or vague posting can leave an interim unsecured exposure.
- Market comparison: compare rent escalators, MFN concepts, and similar economic protections against the supplied comparable transactions; flag material deviations without importing external benchmarks not in the source set.
- Controlling authority: where the memo relies on a legal conclusion, state the governing doctrine or statutory concept by name, and cite it in conventional legal form if identified in the source materials or as generally recognized law.

## 4. Analytical scaffolds

- For each provision:
  1. Extract the operative term in plain English.
  2. Compare it to the playbook, lender checklist, and comparable transactions.
  3. Note the deviation or confirm alignment.
  4. State the legal or commercial risk created.
  5. Recommend a targeted fix or confirmatory point.
- For payment provisions, separate the analysis by category: option fee, interim payments, exercise consideration, rent, escalators, reimbursement items, and any project-component-specific payments.
- For transfer and consent provisions, test both sides of the clause: the holder’s right to assign and the landowner’s or grantor’s right to transfer, then assess whether the drafting is practically enforceable and commercially workable.
- For abandonment or termination rights, list the carve-outs one by one, then assess whether their combined breadth makes the trigger ineffective; if so, identify whether a cap, sunset, or drop-dead date would restore functionality.
- For recording documents, compare the described parcel and term language against the agreement itself and the playbook requirement for constructive notice.
- For each issue, include:
  - Severity using a consistent ordinal scale defined once in the memo.
  - The relevant comparison point from the playbook, checklist, or comparables.
  - The downstream consequence for the project, lender, or landowner.
  - A recommended action stated as an imperative.
- If multiple parties, sites, periods, or payment streams are in play, enumerate them before analysis and run the same scaffold for each rather than collapsing them into a single representative point.

## 5. Vertical / structural / temporal relationships

- Track how rights and obligations change over time: option period, extension rights, exercise window, pre-construction, construction, commercial operation, and decommissioning.
- Identify dependencies across clauses: a payment obligation may depend on exercise, a security posting may depend on COD, and an assignment restriction may interact with financing and foreclosure rights.
- Note when a clause appears adequate in isolation but fails when read against a later schedule, definition, or lender requirement.
- When a term is supposed to occur at a particular milestone, confirm the milestone is stated clearly and that no later drafting pushes the obligation beyond the intended trigger.
- Where a provision affects priority or notice, state whether the temporal sequence of execution, memorandum recording, and third-party transfer changes the practical result.

## 6. Output structure conventions

- Produce a key-terms extraction memo in a conventional transaction-diligence format using sections such as overview, parties, property, option and exercise mechanics, payment economics, assignment and transfer, default and termination, recording, lender-facing points, and issues.
- Open with a short assumptions/inputs note if the source set is incomplete or if a term must be inferred from context.
- Include a concise table or bullet list for the key terms, then a separate issues section with each issue labeled by severity and tied to the relevant source comparison.
- For each issue, give a one-line legal basis or conventional doctrine reference where the conclusion depends on law rather than pure drafting preference.
- End with a Recommended Actions block containing imperative next steps, the responsible role for each action, and the timing anchor drawn from the transaction phase or source deadline.
- Keep the memo focused on extraction and practical diligence: do not rewrite the agreement unless the task expressly asks for drafting changes.
