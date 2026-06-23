---
name: review-regional-nda-variants-master-template
task_id: intellectual-property/review-regional-nda-variants-against-master-template
description: Reviewing multiple regional NDA templates against a master template to produce a conformance report identifying jurisdiction-specific deviations and harmonization actions.
activates_for: [planner, solver, checker]
---

# Skill: Review Regional NDA Variants Against Master Template

## 1. Subject-matter triage

When source documents include a global NDA playbook plus regional NDA variants, review each regional template on its own terms against the global standard before comparing regions to one another. Separate departures that appear in every region from departures limited to a single jurisdiction, because common deviations may reflect intentional global tailoring while isolated deviations are more likely to be local-law driven or unauthorized.

If the task includes multiple regional variants, enumerate each region and any document-version pairings up front before analysis. Do not merge them into a single generalized pass.

## 2. Failure modes the skill is correcting

- Treating every departure from the global playbook as a defect without testing whether local law requires or supports it
- Missing jurisdiction-specific restrictions on confidentiality scope, protected disclosures, duration, language, venue, or governing law
- Collapsing region-by-region review into one abstract comparison and losing which deviation belongs to which template
- Identifying a divergence but stopping at description instead of stating its legal basis, cross-document interaction, business effect, and recommended remediation
- Failing to distinguish mandatory local carve-outs from optional harmonization opportunities
- Presenting a conformance summary that reads like a narrative memo instead of a structured comparison with clear severity and actionability

## 3. Legal frameworks / domain conventions that apply

- NDA terms are jurisdiction-sensitive; enforceability turns on local contract law, confidentiality rules, and any sector-specific or employment-related limits
- Some jurisdictions require or favor express protection for disclosures to regulators, law enforcement, legal advisers, tax authorities, auditors, or other protected recipients
- Local law may constrain scope, term, penalty-like remedies, non-solicitation language, or restrictions that operate as de facto non-competes
- Choice-of-law and forum clauses must be checked for both internal consistency and local effectiveness
- Non-English jurisdictions may require local-language support, and English-only templates may create enforceability or evidentiary risk
- Confidentiality periods, survival language, and defined “Confidential Information” scopes may need jurisdiction-specific adjustment
- When the source set identifies a controlling statute, regulation, rule, or case, use that authority as the basis for the conformance call; do not state a legal conclusion without naming the rule that supports it

## 4. Analytical scaffolds

1. Build a comparison matrix with one row per NDA provision and one column for the global playbook plus each regional template
2. For each region, classify each departure as:
   - legally required
   - legally recommended
   - discretionary
   - unclear / needs confirmation
3. For each identified issue, complete the full issue-closing sequence:
   - state the provision and the jurisdiction
   - identify the controlling authority or source basis
   - explain how the provision interacts with any related clause, schedule, or other regional variant
   - describe the practical consequence for enforceability, operations, risk allocation, or deal execution
4. Assign an ordinal severity label to every issue using one consistent scale defined once at the top of the report, and apply it uniformly across all regions
5. When more than one region, clause family, or deviation type is in scope, analyze each item separately rather than using a single representative example
6. If the same deviation appears across multiple regions, note whether it reflects a harmonized global position or a repeated drafting gap
7. Separate true conformance defects from acceptable local-law accommodations and from stylistic preferences

## 5. Vertical / structural / temporal relationships

For each region, test the vertical relationship between the global playbook and the local template: global baseline, local carve-outs, and any fallback or override language. Then test the horizontal relationship across regions to see whether one jurisdiction’s changes create inconsistency elsewhere.

Pay special attention to temporal or sequencing issues where a clause depends on another clause being updated first, such as defined terms, exclusions, survival periods, notice mechanics, execution formalities, or dispute-resolution provisions. If a local carve-out requires a corresponding change elsewhere, treat the pair as a single remediation item.

## 6. Output structure conventions

Use a conventional conformance-report format rather than a bare issue list. A strong structure is:

- Executive summary of overall conformance posture
- Defined severity legend
- Comparison matrix by provision and region
- Region-by-region deviation analysis
- Harmonization assessment across regions
- Recommended remediation roadmap

For each deviation entry, include:
- region
- clause or topic
- severity
- classification
- authority or source basis
- why it matters
- recommended action

When an issue is flagged, end the entry with an explicit recommendation that names the responsible role from the source documents if available and anchors timing to the next drafting, negotiation, or execution milestone. Avoid recommendations that are generic or untethered to the transaction timeline.

If the task asks for a redline package in addition to the report, make the markup legible in plain text as well as visually, so every substantive edit can be identified even after export.
