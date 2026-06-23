---
name: its-compare-country-of-origin-declarations
task_id: international-trade-sanctions/compare-country-of-origin-declarations-against-trade-preference-rules
description: Produces a compliance gap report comparing import entry country-of-origin claims against applicable trade preference rules, distinguishing fraudulent certificates from curable calculation errors, quantifying duty exposure entry by entry, and evaluating whether voluntary disclosure procedures are appropriate where underpayments are identified.
activates_for: [planner, solver, checker]
---

# Skill: Compare Country of Origin Declarations Against Trade Preference Rules

## 1. Subject-matter triage
- Treat the review as an entry-by-entry origin and preference eligibility comparison, not a generic customs summary.
- First map each import entry to the specific preference program, origin claim, product type, and supporting certificate or declaration in the source set.
- If multiple entries, programs, dates, products, or sourcing patterns appear, enumerate them before analysis and run the same rule-set against each item separately.
- If only one entry or one program is in scope, state that explicitly and explain why no broader comparison is needed.

## 2. Failure modes the skill is correcting
- Collapsing distinct preference programs into one origin test instead of applying the program-specific rule that actually governs the claim.
- Treating every defective origin statement as the same type of problem, rather than separating fraudulent-origin indicators from correctable calculation or sourcing errors.
- Ignoring textile and apparel-specific origin requirements when those goods are involved.
- Missing time-sensitive eligibility limits, suspensions, product restrictions, or quota-like constraints that can defeat an otherwise plausible claim.
- Overlooking cumulation or regional sourcing aggregation where the applicable program allows it.
- Failing to connect an identified origin defect to the duty impact, enforcement consequence, and remediation path.
- Omitting voluntary disclosure analysis when underpayment or incorrect entry documentation is identified.
- Stating a legal conclusion without identifying the governing authority that supports it.

## 3. Legal frameworks / domain conventions that apply
- Apply the controlling origin rule for the claimed preference program to each entry; do not mix rules across programs unless the source documents expressly show a shared regime.
- For textile and apparel goods, apply the program’s textile-specific origin rule, including any yarn-forward or similar processing requirement, and test exceptions only if the governing program permits them.
- For preference claims subject to country, product, or temporal restrictions, verify whether a restriction was effective on the entry date and whether any exception or grandfathering provision applies.
- Where the source documents suggest regional cumulation or sourcing aggregation, test that framework before concluding that the claim fails.
- Distinguish a curable defect from a fraudulent certificate by asking whether the problem is an erroneous but fixable origin computation, classification, or sourcing analysis, or whether the stated origin is incompatible with the documented facts.
- If an underpayment is identified, consider the applicable voluntary disclosure process, timing window, and penalty-mitigation effect before assuming enforcement posture.
- Cite the governing authority for each proposition used in the report, including the specific statute, regulation, treaty provision, or program rule where available.

## 4. Analytical scaffolds
1. Identify each entry, the claimed origin or preference, the goods description, and the support relied on.
2. State the applicable program rule and determine whether the claim is valid, invalid but potentially curable, or potentially fraudulent.
3. For each issue, quantify the exposure using the entry value, duty rate, or other threshold provided in the source documents, and tie the issue to the controlling document or rule that interacts with it.
4. Separate factual misstatement, calculation error, documentation deficiency, and eligibility-bar problem into distinct categories.
5. For textile or apparel entries, apply the program-specific textile rule before any general origin analysis.
6. For entries with regional sourcing facts, test cumulation or comparable aggregation if the governing program allows it.
7. For each non-compliant entry, state the downstream consequence: duty underpayment, preference denial, penalty risk, corrective filing need, or disclosure obligation.
8. Summarize confirmed exposure separately from merely at-risk exposure.
9. Evaluate whether voluntary disclosure is available and advisable, and link that evaluation to the timing and penalty framework in the source set or governing rule.
10. Close every legal proposition with its authority, and close every issue with severity, exposure, cross-reference, and consequence.

## 5. Vertical / structural / temporal relationships
- If the source set includes multiple entries over different dates, analyze whether the governing rule changed over time and whether the entry date controls the outcome.
- If an entry references more than one support document, reconcile them in temporal order and prefer the document that governs the claimed preference or origin statement.
- If a certificate, declaration, and invoice conflict, identify the conflict explicitly and explain which document controls the reported origin claim, if any.
- If a restriction, suspension, or program limitation became effective after some entries but before others, split the analysis by date rather than using one blanket conclusion.
- If a source document references a related sourcing arrangement, evaluate whether it changes the origin outcome before treating the claim as non-compliant.

## 6. Output structure conventions
- Open with a short scope note identifying the reviewed entries, the claimed preference programs, and the governing authorities relied on.
- Include a legend defining a uniform ordinal severity scale used throughout the report, such as Critical / High / Medium / Low, and apply it consistently.
- Present the body as an entry-by-entry compliance gap report.
- For each entry, include:
  - entry identifier and claimed origin/preference;
  - applicable rule and controlling authority;
  - assessment outcome: valid, curable defect, or fraudulent indicator;
  - severity;
  - quantified duty exposure or other measurable impact;
  - cross-reference to the conflicting or supporting source document(s);
  - downstream consequence.
- Use concise issue labels, but do not let any issue end as a bare description; each must be closed with a quantified impact, document cross-reference, and consequence statement.
- Include a separate summary section for confirmed non-compliant exposure and at-risk exposure.
- Include a voluntary disclosure section that states availability, timing considerations, and practical effect on penalty exposure.
- End with a Recommended Actions block. Each recommendation must use an imperative verb, identify the responsible role, and include a timing anchor tied to the entry review, filing deadline, or regulatory milestone.
- If the task requests a DOCX deliverable, draft the report content as a complete standalone document ready for export, not as notes or outline fragments.
