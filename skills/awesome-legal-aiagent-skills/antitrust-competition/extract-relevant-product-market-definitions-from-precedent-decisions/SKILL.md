---
name: extract-relevant-product-market-definitions-from-precedent-decisions
task_id: antitrust-competition/extract-relevant-product-market-definitions-from-precedent-decisions
description: Closes gaps in applying extracted precedent market definitions to the current transaction's specific products, identifying inconsistencies across precedents, and assessing concentration implications under each plausible definition.
activates_for: [planner, solver, checker]
---

# Skill: Precedent Market Definition Application

## 1. Subject-matter triage (only if applicable)

- This task is an extraction-plus-application exercise: identify the market definitions used in each precedent, then map those definitions onto the overlapping products in the current pharma acquisition review.
- Treat each precedent as a distinct analytical unit before synthesizing across them.
- If the source set contains multiple candidate product spaces, enumerate them first and analyze each separately rather than collapsing them into a single blended market.

## 2. Failure modes the skill is correcting

- Baseline extracts definitions from precedents but does not test whether the current transaction’s products fall within or outside each precedent-defined market; extraction is incomplete unless it is applied to the facts at hand.
- Baseline misses conflicts among precedents that define similar product spaces differently; those conflicts must be surfaced because they create both argument openings and litigation vulnerabilities.
- Baseline often stops at naming a market and omits the legal test or evidentiary basis used to define it.
- Baseline may ignore the downstream consequences of each definition for concentration, competitive overlap, and potential-competition theories.
- Baseline may treat biosimilar treatment as uniform across decisions, when the inclusion/exclusion question is context-dependent and must be tied to substitutability and clinical interchangeability.
- Baseline may overgeneralize geographic scope; confirm whether each precedent uses a national market and flag any deviation.
- Baseline may describe a concern without tying it to the source record and the practical effect on the merger analysis.

## 3. Legal frameworks / domain conventions that apply

- Market definition precedent: agencies and courts use prior decisions as benchmarks, but they are not bound by them; the same product space may be defined differently across records depending on the evidence and theory of competition.
- Hypothetical monopolist test: the core market-definition tool; ask whether a hypothetical monopolist could profitably impose a small but significant non-transitory increase in price over the candidate market.
- Pharmaceuticals often support narrower markets based on mechanism of action, therapeutic class, dosage form, route of administration, formulation, indication, or physician prescribing behavior.
- Biosimilar treatment is fact-specific: some precedents include biosimilars with the reference product, while others exclude them based on clinical interchangeability, substitution rules, launch timing, and actual competitive constraints.
- Potential competition doctrine matters for pipeline assets: assess whether the pipeline product is likely to enter, when it would commercialize, and whether it would constrain the incumbent product’s pricing or strategy.
- Geographic scope in pharma is commonly national in US and EU proceedings; verify the scope used in each precedent before analogizing.
- Concentration analysis should be framed under the market definition chosen, with attention to whether one definition produces materially more or less concerning structural outcomes.
- Legal propositions should be tied to controlling authority where one is identified in the sources; otherwise use the generally recognized antitrust framework that supports the proposition.

## 4. Analytical scaffolds

1. Build a precedent-by-precedent matrix:
   - case/decision name as used in the source set
   - product market defined
   - analytical method used
   - included products
   - excluded products
   - treatment of biosimilars or pipeline products, if any
   - geographic scope
   - evidentiary basis or commercial realities relied upon

2. Compare precedents for internal inconsistency:
   - identify where the same therapeutic space is treated differently
   - explain whether the difference is due to factual distinctions, evidence quality, or a true doctrinal split
   - state the strategic use of the inconsistency for the current transaction

3. Apply each plausible precedent-defined market to the current overlapping products:
   - for each current product, state whether it fits inside, outside, or arguably within each precedent market
   - explain the inclusion/exclusion logic by reference to product characteristics, indication, substitutability, and prescribing or dispensing behavior
   - do not assume that every overlapping product belongs in the same market

4. Address biosimilars separately:
   - identify decisions that include biosimilars and those that exclude them
   - test whether the current therapeutic context supports inclusion or exclusion based on clinical interchangeability, access barriers, and substitution dynamics
   - if the record is mixed, present both sides and identify which is stronger on the existing facts

5. Analyze pipeline overlap under the potential-competition framework:
   - for each pipeline product targeting the same indication, identify the stage of development, probability of approval, expected timing to market, and likely competitive constraint
   - evaluate whether the pipeline asset is close enough to discipline current pricing or strategic conduct under the applicable precedent
   - distinguish actual overlap from speculative future overlap

6. Run concentration implications under each plausible definition:
   - compare the structural picture across alternative markets
   - identify which definition is most favorable and which is least favorable to the client
   - if source materials provide share or size data, use those figures in the analysis; if they do not, state that the concentration impact cannot yet be quantified from the record and explain what additional data would be needed
   - where a threshold or benchmark is used in the source set, cite and apply that benchmark rather than inventing one

7. Confirm geographic scope:
   - verify whether each precedent is national or otherwise
   - if a decision departs from the expected national frame, flag the exception and explain whether it is likely transferable to the current review

8. Close each issue analytically:
   - tie the point to the source record
   - state the legal or strategic consequence for the merger analysis
   - identify the practical implication for the client’s preferred market framing

## 5. Vertical / structural / temporal relationships (only if applicable)

- Vertical relationship: distinguish upstream input markets from downstream finished-product markets when the precedent does so, and do not merge them absent support.
- Horizontal relationship: assess whether the current products compete at the same level of the supply chain and whether the precedent treats them as direct substitutes.
- Temporal relationship: distinguish present commercial products from pipeline products that may enter later; do not treat expected future entry as present market participation unless the precedent and record support it.
- If the source set contains more than one time period or development stage, analyze each one separately before drawing a consolidated view.

## 6. Output structure conventions

- Use an internal working matrix first, then write the memo from that matrix.
- Organize the memo in conventional antitrust form rather than copying any rubric-specific section list.
- A practical structure is:
  - short introduction and scope
  - precedent matrix
  - synthesis of conflicts and common themes
  - application to the current overlapping products
  - concentration / structural implications under alternative definitions
  - recommended market-definition position and vulnerabilities
- When stating a legal proposition, name the governing antitrust framework or authority that supports it.
- When discussing multiple precedents, preserve one row or subsection per decision rather than blending them.
- When the record does not permit a conclusion, say so expressly and identify the missing factual predicate.
- End with a concise Recommended Actions section that gives the next analytical or evidentiary steps, the responsible role, and the timing relative to the merger review milestone.
