# Harvey-labs Skills

Per-task, **rubric-blind procedural skills** for **Parthenon**, a self-evolving
legal-agent framework. Each skill encodes *how to work a class of legal matter*
— triage, legal framing, analytical scaffolds, deliverable shape, and a
self-audit — as reusable procedure, never an answer.

This repository accompanies the paper *Parthenon Law: A Self-Evolving
Legal-Agent Framework* (Geng & Liu). The full experimental record — scored
outputs, judge rationales, native solver transcripts, and the
optimization/ablation ledgers — is released separately as a data backup on
Hugging Face:

- **Data, trajectories & harness artifacts:**
  <https://huggingface.co/buckets/hhhhhhejia/parthenon-harvey-results-backup>

## Contents at a glance

- **1,251 skills** across **24 practice areas** — one skill per Harvey LAB task
  class, routed to a matter by its `task_id`.
- Every task ships its current `SKILL.md` plus **two archived versions**
  (`SKILL_v0.md`, `SKILL_v1.md`) that record the self-evolving loop's edit
  history.
- Most tasks live at `<area>/<task>/`; multi-scenario tasks nest one level
  deeper at `<area>/<task>/scenario-NN/` (119 of the 1,251).

### Skills by practice area

| Practice area | Directory | Skills |
|---|---|---:|
| Corporate M&A | `corporate-ma` | 161 |
| Intellectual Property | `intellectual-property` | 147 |
| Corporate Governance | `corporate-governance` | 97 |
| Trusts, Estates & Private Client | `trusts-estates-private-client` | 77 |
| Funds & Asset Management | `funds-asset-management` | 66 |
| Litigation & Dispute Resolution | `litigation-dispute-resolution` | 52 |
| Data Privacy & Cybersecurity | `data-privacy-cybersecurity` | 44 |
| Environmental & ESG | `environmental-esg` | 44 |
| Real Estate | `real-estate` | 44 |
| Emerging Companies & Venture Capital | `emerging-companies-venture-capital` | 43 |
| Healthcare & Life Sciences | `healthcare-life-sciences` | 43 |
| International Trade & Sanctions | `international-trade-sanctions` | 41 |
| Employment & Labor | `employment-labor` | 39 |
| Banking & Finance | `banking-finance` | 37 |
| International Arbitration & Dispute Resolution | `arbitration-international-dispute-resolution` | 37 |
| Bankruptcy & Restructuring | `bankruptcy-restructuring` | 36 |
| Capital Markets | `capital-markets` | 35 |
| Tax | `tax` | 34 |
| Antitrust & Competition | `antitrust-competition` | 33 |
| Energy & Natural Resources | `energy-natural-resources` | 31 |
| Insurance | `insurance` | 31 |
| Structured Finance & Securitization | `structured-finance-securitization` | 31 |
| Immigration | `immigration` | 27 |
| White Collar Defense & Investigations | `white-collar-defense-investigations` | 21 |
| **Total** | | **1,251** |

## What is a skill?

A skill is a single Markdown file (`SKILL.md`) attached to one task class. It is
**appended** to the solver's base prompt at run time — it augments the generic
instructions with the task-specific *procedure and legal framing* the generic
prompt is too thin to convey. There is no classifier and no taxonomy: a skill is
selected by matter class, and a task with no skill simply runs on the base
prompt (zero regression risk on unmodified tasks).

## Directory layout

```
.
├── README.md
├── _template/SKILL.md                 # authoring scaffold (framing-first)
├── corporate-ma/
│   └── <task-slug>/
│       ├── SKILL.md                   # current skill
│       ├── SKILL_v0.md                # earlier version (optimization history)
│       └── SKILL_v1.md
├── emerging-companies-venture-capital/
│   └── identify-spa-issues/
│       ├── scenario-01/SKILL.md       # multi-scenario tasks nest one level deeper
│       └── scenario-02/SKILL.md
└── ...                                # 24 practice areas
```

## SKILL.md format

A short YAML header followed by a Markdown body:

```yaml
---
name: <kebab-case slug>                     # required
task_id: <practice-area>/<task-slug>        # required, routes the skill
description: <one-sentence summary>          # the gap this skill closes
activates_for: [planner, solver, checker]   # roles that see this skill
---

# <markdown body — task-specific procedure and framing>
```

## The seven-part skill scaffold

Every skill body is written against the same scaffold (see `_template/SKILL.md`).
Sections that do not apply to a task are dropped; none are answer-feeding.

1. **Subject-matter triage** — the procedure for identifying the single in-scope
   matter before drafting (e.g., cluster the source files by counterparty /
   date / advisor and mark everything else out of scope). *How* to decide, never
   *which* cluster is the answer.
2. **Failure modes corrected** — 2–4 structural/procedural patterns the baseline
   tends to drop (e.g., paraphrasing source quotes, stopping at national-scale
   analysis, collapsing a required table into prose) — not specific facts.
3. **Legal frameworks / conventions** — the statutory/regulatory framework the
   deliverable conventionally sits in, cited by *category* (an Act, a guideline,
   a Form), not the specific threshold the rubric happens to check.
4. **Analytical scaffolds** — the scales, granularities, and dimensions the
   analysis must walk to be defensible (e.g., geographic market at national →
   state → MSA scale; show the arithmetic for every share figure).
5. **Relationships (vertical / structural / temporal)** — the categories of
   structural and timing dependencies to address (org charts, exclusive
   contracts, notice/breach/cure chronologies), named as categories.
6. **Output-structure conventions** — the conventional shape of an expert
   deliverable of this type (standard section names, explicit severity scales,
   one-row-per-issue tables), not the rubric's verbatim section list.
7. **Anti-leakage checklist** — the forbidden patterns to grep the draft for
   before commit (subject-specific amounts, verbatim quotes, named entities,
   rubric-derived "must-name" lists).

## Example

A representative skill,
`antitrust-competition/analyze-antitrust-hsr-strategy/SKILL.md`:

```yaml
---
name: analyze-antitrust-hsr-strategy
task_id: antitrust-competition/analyze-antitrust-hsr-strategy
description: Closes gaps in product-market separation, geographic-market framing, hot-document identification, and HSR filing strategy memo production for acquisition antitrust review.
activates_for: [planner, solver, checker]
---
```

Body sections (abbreviated — see the full file for the complete text):

- **1. Subject-matter triage** — inventory deal documents for parties,
  structure, product lines, and overlap; enumerate each distinct product line /
  geography / filing scenario before analysis.
- **2. Failure modes corrected** — distinct product markets merged into one;
  geography defaulting to national; hot documents buried; HSR memo omitting the
  filing owner, fees, and waiting-period mechanics.
- **3. Legal frameworks** — Clayton Act §7; merger-guideline market-definition
  and effects concepts; the hypothetical-monopolist test; Hart-Scott-Rodino
  filing, waiting-period, and gun-jumping rules.
- **4. Analytical scaffolds** — define each product market on its own facts; map
  overlap geographies at local / regional / national scale; flag hot documents
  by theme; test efficiencies for merger-specificity and verifiability.
- **5. Relationships** — treat horizontal overlap as the core issue; distinguish
  permissible integration planning from gun-jumping; analyze remedy timing
  against the outside date.
- **6. Output structure** — a risk-assessment memo (executive summary,
  per-market sections, hot documents, harm theories, entry, efficiencies,
  remedies) plus a separate HSR strategy memo, with an explicit severity scale
  and a recommended-actions block.
- **Anti-leakage checklist** — no subject-specific amounts, verbatim quotes,
  named subsidiaries, or rubric-derived "must-name" lists.

## Authoring principle: framing first, not rubric reverse-engineering

A skill body must reflect what a domain expert would write **knowing only the
task instructions and the source documents — not the hidden rubric**. The
purpose is to encode reusable procedure and legal framing (deal triage, market
analysis, statutory frameworks, document conventions, output shape), **not** to
preload the specific amounts, percentages, verbatim quotes, named entities, or
precedents that a hidden rubric happens to check.

Two failure modes to avoid:

- **Rubric reverse-engineering** — listing each rubric anchor as a "must-name"
  in the skill. The skill becomes a per-task answer key; scores rise because the
  skill memorized the test, not because the model got better at the work, and it
  does not transfer to held-out tasks.
- **Instance carryover** — hard-coding one matter's entities, contracts, or
  numbers into the skill body, even without consulting the rubric.

Write the framing-only version first. If a specific identifier is genuinely part
of standard practice for every plausible variant of the task class, it is fair
to name it; if it is a concrete fact the rubric happens to check, let the solver
extract it from the source documents.

### OK in a skill body (framing — rubric-blind)

- Procedural steps ("before drafting, triage the source files into clusters and
  identify the single in-scope subject; mark the rest out of scope").
- General legal frameworks the task obviously sits in (HSR notification
  mechanics, Clayton Act §7/§8, the applicable merger guidelines, WARN-Act
  notice rules, etc.).
- Deliverable conventions for the document type (the conventional sections of an
  HSR briefing paper, an issues memo, a diligence report).
- Analytical scaffolds ("walk the geographic market at national, state, and MSA
  scale"; "show the arithmetic for every share figure").
- Role-specific guard rails against recurring failure modes.

### NOT OK (rubric-derived — instance-specific)

- Specific dollar amounts, percentages, share calculations, or reconciliation
  arithmetic naming the subject's own numbers.
- Verbatim short quotes from the subject's internal documents.
- Specific named subsidiaries, contracts, JVs, counsel, precedents, or
  competitors from the subject matter.
- Jurisdiction-/statute-/entity-specific citations you only know to mention
  because you read this scenario's documents — name the *category*, let the
  agent name the instance.
- The exact deliverable section list or minimum counts the rubric checks for.

## Anti-leakage (binding)

Skill bodies must be authored **rubric-blind**: from the task instructions, the
task's source documents, and general legal/industry knowledge only — never from
the hidden rubric, prior-run scores, or evaluation traces. A body that is
technically only-from-documents but was built by walking the rubric and
back-filling each anchor still violates this rule.

When in doubt, run a **leakage A/B**: keep a framing-only version and a version
with whatever specifics you considered adding, and score both end to end. The
framing-only version is the publishable number; the gap between the two is the
leakage premium and must not be claimed as a method gain.
