---
name: identify-accused-product-issues
task_id: intellectual-property/identify-accused-product-issues
description: Preparing an infringement issue-identification memo for a patent matter by analyzing asserted claims against accused product documentation and prosecution history, requiring claim mapping, prosecution history estoppel assessment, and prior art impact analysis.
activates_for: [planner, solver, checker]
---

# Skill: Identify Accused Product Issues

## 1. Subject-matter triage
- Confirm the asserted patent claims, the accused-product record, the prosecution history, and the prior-art set before analysis.
- Separate what is actually accused from what is merely described in marketing, sales, or high-level summaries.
- If more than one accused product, version, configuration, or feature set is in scope, enumerate each one first and analyze them separately; do not merge distinct variants into one pass.
- If only one product/version is in scope, say so explicitly and explain why the record supports that scope.

## 2. Failure modes the skill is correcting
- Analyzing accused product features in isolation without mapping them element-by-element to the asserted claims.
- Treating a feature as an infringement fit because it is functionally similar, without checking whether every claim element is supported by the record.
- Missing prosecution-history arguments or amendments that narrow claim scope and affect the infringement theory.
- Ignoring prior art that may affect validity, construction, or litigation posture.
- Relying on marketing language that overstates or abstracts functionality compared with technical evidence.
- Failing to distinguish literal infringement analysis from doctrine-of-equivalents analysis.
- Failing to connect documentary evidence to a practical litigation consequence.

## 3. Legal frameworks / domain conventions that apply
- Direct infringement requires practice of every element of at least one asserted claim. See 35 U.S.C. § 271(a); claim construction principles from Phillips v. AWH Corp.
- Claim analysis is element-by-element, not feature-by-feature.
- Dependent claims must be analyzed separately from independent claims; infringement of a dependent claim requires infringement of its parent claim.
- Doctrine of equivalents may apply where the accused product lacks a literal element, but the function-way-result inquiry is constrained by the claim language and record.
- Prosecution history estoppel may bar or narrow equivalents for subject matter surrendered by amendment or argument during prosecution; review amendments, examiner responses, and distinguishing statements chronologically.
- Prior art affects both validity exposure and how aggressively claim scope can be read; address it as part of infringement strategy, not as an afterthought.
- Internal engineering records, testing materials, and design documents are often more probative of actual operation than polished external materials.
- Marketing materials and datasheets should be compared against technical documents for discrepancies, because a mismatch can change both infringement and credibility analysis.

## 4. Analytical scaffolds
1. Identify the asserted claims and group them by independent and dependent status.
2. For each independent claim, list each element in order and map the accused product evidence to that element.
3. For each element, state whether the record supports literal presence, literal absence, or ambiguity.
4. For any literal absence, assess whether the same record supports a doctrine-of-equivalents theory, and note any prosecution-history limits.
5. Review the prosecution history chronologically to identify narrowing amendments, argument-based disclaimers, and any surrender relevant to specific claim elements.
6. Compare the accused-product documentation across source types: technical manuals, design documents, source-adjacent materials, testing records, marketing collateral, and discovery materials.
7. Flag discrepancies between what the product is said to do and what the technical record shows it does.
8. Review prior art for effects on claim scope, likely construction disputes, and validity exposure that could alter the infringement posture.
9. Rank claims by overall infringement strength, then by vulnerability to prosecution-history and prior-art challenges.

## 5. Vertical / structural / temporal relationships
- Analyze parent and child claims in sequence, because dependent-claim issues often turn on an inherited limitation plus one added feature.
- Track the file chronology of prosecution events, because later amendments or arguments may supersede earlier positions.
- Where the accused product has versions or releases, distinguish baseline architecture from later modifications and note whether the record ties an element to a specific release.
- If the documentation spans design, development, testing, and launch, compare the temporal state of the product record to the asserted claim theory; do not assume all documents describe the same configuration.

## 6. Output structure conventions
- Write the memo as an issue-identification document organized by claim, then by element, then by issue type.
- For each issue entry, include: claim number, claim element, issue type, severity, supporting evidence, governing authority, and a concise next-step note.
- Use a uniform ordinal severity scale defined once at the top of the memo, and apply it consistently across all entries.
- Every issue discussion should close with: the scale of the issue as reflected in the record, the related prosecution-history or prior-art cross-reference, and the practical consequence for infringement posture.
- Cite controlling authority for each legal proposition relied on, including the claim-construction rule, infringement standard, equivalents doctrine, and prosecution-history-estoppel rule.
- End with a Recommended Actions section that gives imperative next steps, names the responsible role where available, and ties each action to a filing, review, or diligence milestone.
- Conclude with a short ranking of the strongest and weakest claims, and identify the main litigation risks associated with each.
