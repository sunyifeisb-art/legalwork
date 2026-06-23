---
name: <kebab-case-skill-slug>
task_id: <harvey-domain>/<harvey-task-slug>
description: <one sentence — the procedural / framing gap this skill closes for *this class of work* (e.g., "reviewing corporate authorization documents for a credit-facility closing across multi-entity, multi-jurisdiction guarantor groups"). Do not mention specific dollar amounts, percentages, named entities, verbatim quotes, or jurisdiction- / statute- / entity-type-specific citations that you only know to mention because you read *this* scenario's documents. The description should read like the title of a CLE module, not the abstract of a single matter.>
activates_for: [planner, solver, checker]
---

# Skill: <human-readable task name>

> **Authoring rule (binding).** This template is the framing-first (v2)
> scaffold. Write only procedural guidance, legal frameworks, analytical
> scaffolds, output-shape conventions, and role-specific guards. Do
> **not** preload subject-specific dollar amounts, percentages, share
> calculations, verbatim short quotations from the parties' internal
> documents, named subsidiaries / contracts / JVs / precedents, or any
> rubric-derived "must-name" checklist. The agent must derive those from
> `documents_text/` itself. See this repository's README →
> *Authoring principle: framing first, not rubric reverse-engineering*
> for the empirical basis and the leakage A/B protocol.
>
> **Class-applicability rule (SkillsBench-aligned).** Although each
> SKILL.md is routed by a single `task_id`, its *content* must read as
> guidance for the **class** of matters this task represents, not as a
> cheat sheet for this one instance. Concretely:
>
> - **Rubric-blind test.** Ask: *"If I were a senior practitioner writing
>   a CLE module or internal practice note for this kind of matter,
>   having never seen this scenario's source documents or the hidden rubric, would
>   I write this sentence?"* If the answer is no — if the sentence only
>   makes sense because you know which jurisdiction / statute / entity
>   type / counterparty appears in *this* scenario — cut it or
>   generalize it to the category.
> - **3-variant test.** Ask: *"Would this same SKILL.md still be useful
>   if the parties, jurisdictions, dollar amounts, and counsel were
>   swapped for three other plausible variants of the same matter
>   type?"* If swapping a US-Delaware borrower for a UK-Cayman borrower
>   (or a $500M facility for a $50M facility) would break the skill,
>   the skill is over-fit to this instance.
> - **Statute / jurisdiction handling.** Naming the *category* of
>   authority is fine ("apply the borrower's jurisdiction-of-incorporation
>   corporate statute"); naming the *specific* statute, code section,
>   provincial act, or regulator that happens to govern this scenario
>   ("Ohio Rev. Code § 1701.58", "Alberta ULC", "Ontario EBCA
>   registration") is leakage if you only know to mention it because
>   you read the documents. Generalize unless the statute is genuinely
>   load-bearing for every plausible variant of this task class.
>
> Delete any section below that does not apply to this task. Keep
> section headings concrete and short.

## 1. Subject-matter triage (when applicable)

> Use only if the task's `documents/` plausibly contains material from
> more than one matter / transaction / counterparty / period, and the
> baseline failure mode includes the agent writing about the wrong one.
> Otherwise delete this section.

<Describe the *procedure* the agent should run to identify the single
in-scope subject before drafting — e.g., "walk every file under
`documents_text/`, group by counterparty / signing date / advisor of
record, and identify the single cluster whose deal-summary / engagement
letter / board minutes matches the task instructions." Mark every other
cluster as out-of-scope background.

Do not name which specific cluster is the subject (the agent should
infer that from instructions + documents). Do tell it how to decide.

If the pipeline includes a separate planner / checker step, the
planner should write the triage outcome into its task contract /
notes (subject cluster + explicit list of out-of-scope files), and
the checker should grep the final deliverable for any out-of-scope
entity names that would indicate the deliverable migrated into the
wrong matter. Phrase the rule once here; do not split into per-role
sub-sections.>

## 2. Failure modes the skill is correcting

> 2–4 bullets naming the **structural / procedural** patterns the
> baseline tends to drop — not the specific facts. Source: reading the
> baseline run's draft deliverable (you may inspect it). Do **not**
> read the hidden rubric, prior-run scores, or evaluation traces
> for this task.

- <e.g., "Baseline paraphrases pricing / market-power language from
  internal communications into its own words instead of preserving the
  source phrase.">
- <e.g., "Baseline stops at national-scale market analysis and does not
  walk state- or MSA-scale overlap.">
- <e.g., "Baseline collapses a comparison table into prose, losing the
  row-level structure the deliverable type conventionally requires.">

## 3. Legal frameworks / domain conventions that apply

> What statutory / regulatory / industry framework the deliverable
> conventionally sits in. This is general practice knowledge an expert
> would write rubric-blind. Naming a regulation, an Act, a guideline,
> or a Form is fine; naming the specific dollar threshold the rubric
> happens to be checking for this filing year is not.

- <e.g., "HSR pre-merger notification mechanics: identify Ultimate
  Parent Entity per 16 C.F.R. § 801.1, name the Acquired Person, state
  the size-of-transaction threshold for the filing year named in the
  source documents (do not import a different year's number), and the
  reviewing agency under the FTC-DOJ interagency clearance protocol.">
- <e.g., "If the matter involves a JV between competitors, raise
  Section 8 of the Clayton Act interlocking-directorate analysis.">
- <e.g., "If the buyer is a private-equity-sponsored platform that has
  assembled the business through multiple add-ons, walk the 2023
  DOJ/FTC Merger Guidelines Guideline 8 serial-acquisition theory and
  FTC heightened scrutiny of PE-backed consolidation in the relevant
  industry.">

## 4. Analytical scaffolds

> What scales / granularities / dimensions the analysis must walk to
> be defensible. This is procedure, not answer-feeding.

- <e.g., "Walk geographic market at every scale: national for context,
  then each state with overlap individually (do not lump states), then
  the most-concentrated MSA. Identify the local competitors and their
  shares to contextualize the combined position. Treat the narrow MSA
  as a plausible agency-defined geographic market.">
- <e.g., "Walk product market at both broad (industry-wide) and narrow
  (service-line) granularity.">
- <e.g., "For every share figure, show the arithmetic
  (numerator / denominator = percentage). All numbers must come from
  the subject's source documents, not be invented.">
- <e.g., "Surface verbatim short quotations from internal documents
  with document name and date. Do not paraphrase pricing, market-power,
  or competitive-elimination language into your own words.">

## 5. Vertical / structural / temporal relationships (when applicable)

> If the task has structural elements the analysis must address (org
> chart, exclusive customer contracts, subsidiary supply relationships,
> JVs, timeline tensions, lifecycle events), name the *categories*
> here, not the specific instances.

- <e.g., "Exclusive customer contracts the target holds — analyze each
  as a foreclosure / entry-barrier issue with customer, scope, and
  revenue from the source documents.">
- <e.g., "Subsidiaries that supply inputs or platform services to
  *competing* independent operators — raise the post-merger
  raise-price / refuse-to-supply foreclosure question for each.">
- <e.g., "Timing tensions between contractual deadlines (renewals,
  outside dates, closing windows) and regulatory review windows.">

## 6. Output structure conventions

> The conventional shape an expert deliverable of this type takes. List
> *standard section names* an industry practitioner would use; do not
> copy the rubric's section list or its minimum counts verbatim.

- <e.g., "Organize as a formal client memorandum with named sections.
  Conventional sections for an HSR pre-notification briefing paper:
  Executive Summary, HSR Filing Requirements, Market Definition,
  Competitive Effects, Timeline / Process Risks, Pre-Filing Strategy,
  Risk Rating and Conclusion.">
- <e.g., "Use an explicit risk-rating scale (Low / Moderate / High /
  Very High) with supporting rationale, not a single qualitative
  adjective.">
- <e.g., "If the deliverable is an issue list, keep one row per issue
  with severity, source citation, recommended action, and deadline —
  do not collapse to prose.">

---

## Forbidden in this body (anti-leakage checklist)

Before committing, grep your draft for these patterns; any hit is a
sign you have crossed from framing into rubric reverse-engineering or
from class-level practice guidance into instance-level cheat sheet:

- Specific subject-cluster dollar amounts, percentages, share
  calculations, ratios, or reconciliation arithmetic.
- Specific verbatim short quotes from the subject cluster's internal
  documents (the *general instruction* "surface verbatim quotes from
  internal documents" is OK; pasting the actual phrase the agent must
  surface is not).
- Specific named subsidiaries, contracts, JVs, counsel, advisors,
  precedents, or competitors from the subject cluster.
- Jurisdiction- / statute- / entity-type-specific citations you only
  know to mention because you read this scenario's documents (e.g.,
  pre-loading "Ohio Rev. Code § 1701.58 director-proxy prohibition" or
  "Alberta ULC shareholder-resolution requirement" or "Ontario EBCA
  registration" when the *task class* — "review corporate authorization
  documents for a multi-jurisdiction guarantor group" — does not by
  itself imply those specific authorities). Write the category
  ("apply each entity's jurisdiction-of-incorporation corporate
  statute, including any director-proxy prohibition that jurisdiction
  imposes"), let the agent name the instance from the documents.
- Task-specific filenames, paths, document titles, or matter
  identifiers from the subject cluster (SkillsBench R1).
- The exact deliverable section list copied from the rubric's
  presence-check criterion (use the *industry-conventional* shape
  described in section 6 instead).
- Minimum counts the rubric is testing for (e.g., "≥ 12 distinct
  issues") — let the analysis dictate the count from the documents.
- Any sentence whose specificity is only justifiable by having read
  the hidden rubric, prior-run scores, evaluation traces, or the
  scenario's source documents. If the
  same sentence would *not* appear in a rubric-blind CLE module on
  this kind of matter, cut it.
- Any sentence that would stop being true / useful if the parties,
  jurisdictions, dollar amounts, and counsel in this scenario were
  swapped for three other plausible variants of the same matter type
  (class-applicability / 3-variant test).
