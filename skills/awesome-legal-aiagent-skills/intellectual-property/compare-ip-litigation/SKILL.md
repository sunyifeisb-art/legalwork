---
name: compare-ip-litigation-claim-chart
task_id: intellectual-property/compare-ip-litigation
description: Element-by-element infringement comparison chart mapping asserted patent claims to accused product features, with separate handling for claim construction, literal infringement, doctrine of equivalents, prosecution-history limits, and overall strength assessment.
activates_for: [planner, solver, checker]
---

# Skill: Prepare Claim-by-Claim Comparison Chart for Patent Infringement

## 1. Subject-matter triage

Identify the asserted claims, the adopted claim construction, and the accused-product technical record before comparing anything. If multiple asserted claims, accused features, embodiments, or versions are in scope, enumerate them explicitly and analyze each one separately rather than collapsing them into a single representative pass.

When expert submissions or technical exhibits diverge, separate disputes about the underlying technical facts from disputes about claim meaning or legal effect. Use the most probative technical materials available for the product’s actual implementation; do not rely on marketing copy unless it is the only source of record.

## 2. Failure modes the skill is correcting

- Mapping limitations to broad product descriptions instead of the specific accused feature set and implementation record
- Treating claim construction as optional, stale, or informal rather than the controlling lens for the infringement comparison
- Blending literal infringement, equivalence, and estoppel into one conclusory statement instead of analyzing them limitation by limitation
- Ignoring prosecution history, disclaimer, or other intrinsic limits that may narrow literal or equivalent scope
- Presenting only the patentee’s theory and omitting the accused infringer’s technical and legal positions
- Summarizing strength at the claim level without showing how the result follows from the element-by-element record

## 3. Legal frameworks / domain conventions that apply

- Claim construction controls infringement: each disputed term must be applied as construed before assessing infringement
- Literal infringement requires every limitation of the asserted claim to be found in the accused product as construed
- Doctrine of equivalents is limitation-specific and subject to prosecution-history estoppel, disclaimer, and other intrinsic constraints
- The function-way-result framework is the standard analytical lens for equivalence where appropriate
- Prosecution history can bar or narrow reliance on equivalents for particular limitations
- Technical charts should cite the source documents that support each mapping, including claim language, intrinsic materials, expert reports, and product technical evidence
- For software-implemented features, code, architecture, logs, specifications, and engineering documentation are often more probative than user-facing descriptions

## 4. Analytical scaffolds

- Build the comparison from the top down: identify the claim, the construed limitation, the accused feature, and the evidentiary source for each
- For each limitation, ask in sequence:
  1. What does the claim require as construed?
  2. What accused feature is alleged to satisfy it?
  3. Is the feature present literally?
  4. If not, is there a viable equivalents theory?
  5. Does prosecution history or another intrinsic limit foreclose that theory?
- When the expert record conflicts, state the exact point of disagreement: technical operation, mapping logic, or legal consequence
- Treat unsupported equivalence assertions skeptically; if the record does not identify a comparable function, way, and result, say so
- Assess claim strength by aggregating limitation-level results, with special attention to any missing or weakly supported limitation
- Where the source record provides quantitative or scale-based facts tied to the accused functionality, use them to frame the significance of the disputed limitation and the practical consequence of any mismatch

## 5. Vertical / structural / temporal relationships

If the asserted patent contains dependent claims, analyze each dependent claim as an added-layer inquiry on top of the base claim, not as a free-standing duplicate of the independent claim. Track whether the accused feature satisfies the base limitation first, then whether it also satisfies the narrowing dependent limitation.

If the record includes multiple product versions, configurations, or time periods, keep them separate unless the evidence shows they are legally and technically indistinguishable. Note any changes over time that affect mapping, infringement, or equivalence.

If the accused product is modular or distributed across components, identify where each limitation is purportedly met and whether the asserted theory depends on a single component or an interaction among components.

## 6. Output structure conventions

- Start with a brief framing note identifying the asserted claims analyzed, the operative claim construction, and the accused product record used
- Use one table per asserted claim, with one row per limitation and columns that cover:
  - construed claim language
  - accused product feature or absence
  - literal infringement analysis
  - doctrine of equivalents analysis
  - prosecution-history or other intrinsic limit
  - supporting evidence citation
  - strength / confidence assessment for that limitation
- Keep the chart limitation-specific; do not collapse several limitations into one row unless they are inseparable as a matter of claim structure
- Distinguish “not shown,” “plausibly shown,” and “shown” with consistent, plain-language labels
- Include a claim-level conclusion after each table that explains why the claim is strong, mixed, or weak based on the limiting element(s)
- End with an overall assessment section that compares the asserted claims against each other and identifies the principal infringement vulnerabilities and strongest theories
- Use a conventional litigation-chart style, not a memo style: dense, comparative, citation-heavy, and organized for side-by-side review
