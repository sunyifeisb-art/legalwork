---
name: compare-source-code-docs-patent-claims
task_id: intellectual-property/compare-source-code-documentation-against-patent-claims
description: Limitation-by-limitation claim chart and non-infringement analysis for asserted patent claims based on product architecture specifications, prosecution history, and source code documentation.
activates_for: [planner, solver, checker]
---

# Skill: Compare Source Code Documentation Against Patent Claims

## 1. Subject-matter triage

- Confirm the asserted claim set, the accused product version, and the source set before analysis.
- Identify any claim constructions already adopted, any prosecution-history concessions, and any expert positions that need to be tested rather than repeated.
- Separate mandatory implementation evidence from promotional, conceptual, or aspirational descriptions; the comparison must be anchored in engineering documentation, source code, and prosecution materials.
- If multiple asserted claims, product variants, or accused modes are in scope, treat each separately and do not blend them into a single generalized comparison.

## 2. Failure modes the skill is correcting

- Mapping claim limitations to product behavior using marketing language or high-level summaries instead of the technical documentation that shows how the software actually works.
- Treating a patentee’s infringement narrative as established fact without independently checking whether the cited code, architecture description, or execution path supports it.
- Ignoring prosecution-history narrowing when a claim term was amended or argued to avoid prior art, then overextending literal or equivalents analysis.
- Assuming an optional, disabled, unexecuted, or hypothetical code path satisfies a method step or functional limitation.
- Failing to separate what the code can do from what the accused product actually does in the relevant configuration.
- Collapsing multiple claim limitations into one broad “matches/does not match” conclusion without tracing each limitation to specific evidence.
- Overlooking whether a means-plus-function element is limited to the disclosed structure and equivalents, rather than reading it as broad functional language.
- Adopting preliminary expert framing without testing the cited passages against the source code documentation and prosecution record.
- Omitting the legal basis for a non-infringement conclusion or stating one in conclusory form without tying it to the controlling doctrine.

## 3. Legal frameworks / domain conventions that apply

- Patent infringement is analyzed claim by claim and limitation by limitation; each asserted limitation must be compared against the accused product under the governing claim construction.
- Claim construction is a legal prerequisite; apply any adopted constructions consistently across the chart and do not infer broader or narrower meanings from context alone.
- Literal infringement requires every limitation to be found as construed; if a limitation is absent, the analysis stops for that theory as to that element.
- Doctrine of equivalents is constrained by prosecution history, claim vitiation principles, and other limiting doctrines; do not apply it mechanically where the record shows narrowing or surrender.
- Prosecution-history estoppel: when the applicant narrowed scope by amendment or clear argument to obtain allowance, assess whether the surrendered territory bars equivalents for the affected limitation. Cite the amendment or argument that matters.
- Means-plus-function claiming under 35 U.S.C. § 112(f): identify the claimed function, the disclosed structure in the specification, and the corresponding equivalents before comparing to the accused implementation.
- Method claims require proof that the accused product performs each recited step; capability alone is not enough unless the governing law and facts support that theory.
- Source code, build artifacts, architecture diagrams, and design docs are technical evidence of implementation; use them to confirm actual operation, control flow, dependencies, and configuration.
- Where the source documents identify controlling legal authorities, use those; otherwise rely on the recognized patent-law authorities governing construction, literal infringement, equivalents, estoppel, and § 112(f).

## 4. Analytical scaffolds

- Start with a claim-construction inventory: list the construed terms, any disputed phrases, and any terms that require § 112(f) analysis or prosecution-history narrowing.
- Build the comparison limitation by limitation: for each asserted claim, create a row for every limitation and test it against the accused product evidence.
- For each row, identify the best supporting source-code or technical citation, then state whether the evidence shows presence, absence, or only partial/conditional support for the limitation.
- When a limitation depends on a specific execution path, configuration, module boundary, or data flow, verify that the cited code and documentation actually show that path, configuration, boundary, or flow in the accused setup.
- Treat expert contentions as hypotheses: use them to locate the cited evidence, then independently confirm whether the cited materials truly satisfy the claimed functionality.
- If prosecution history is relevant, analyze the narrowing event at the same granularity as the claim chart so the estoppel analysis attaches to the exact limitation affected.
- For each claim, give a separate overall non-infringement conclusion that reflects the strongest dispositive point, not just a recitation of missing elements.
- Where the record supports it, note alternative non-infringement theories: missing limitation, different ordering of steps, different control logic, non-equivalent structure, or estoppel-barred equivalents.

## 5. Vertical / structural / temporal relationships

- Track how software components relate vertically: claim language may map to a module, function, subroutine, database, interface, or deployment layer rather than to a product at large.
- Track how information flows horizontally across components: if the claim requires passing, receiving, storing, transforming, or synchronizing data, show where in the documentation that flow begins, changes, and ends.
- Track temporal sequence for method claims: confirm the recited order, dependencies, and gating conditions; do not treat independently described actions as if they necessarily occur in the claimed sequence.
- Distinguish static capability from runtime behavior, and distinguish default behavior from optional settings or administrator-enabled features.
- When a limitation is conditional on a user action, network event, or system state, identify the condition and verify whether the accused product actually reaches it in the source materials.

## 6. Output structure conventions

- Use a claim-chart format organized by asserted claim, with a separate section for each claim.
- Within each claim section, use a limitation-by-limitation table or equivalent structured format with columns for: claim limitation, governing construction if needed, source-code / technical evidence, literal infringement analysis, doctrine-of-equivalents analysis if applicable, and conclusion.
- Include a prosecution-history subsection that identifies any narrowing amendments or arguments tied to specific limitations and states the estoppel effect, if any, on each affected theory.
- Include a non-infringement analysis subsection that synthesizes the strongest arguments by claim and explains why the cited evidence does not meet the claim as construed.
- Cite the specific portions of the technical record supporting each row; do not rely on generalized summaries when a precise citation is available.
- Make the comparison explicit and self-contained so a reader can follow the reasoning from the cited materials alone.
- If a limitation is not implicated by the record, say so directly and explain why the available evidence does not support a contrary inference.
- If multiple accused product versions or modes are analyzed, keep the version-specific conclusions separate so the reader can see which evidence applies to which configuration.
