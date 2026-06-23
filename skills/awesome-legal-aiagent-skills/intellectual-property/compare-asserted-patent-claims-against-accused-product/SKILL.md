---
name: compare-asserted-claims-accused-product
task_id: intellectual-property/compare-asserted-patent-claims-against-accused-product
description: Element-by-element claim chart and non-infringement analysis comparing asserted patent claims to an accused product implementation, using the patent record, prosecution history, and technical materials to test each limitation and any infringement theory.
activates_for: [planner, solver, checker]
---

# Skill: Compare Asserted Patent Claims Against Accused Product

## 1. Subject-matter triage

- Confirm the asserted claims, the accused product version, and the technical record actually in scope before analyzing infringement.
- Separate independent claims from dependent claims, and method claims from apparatus/system claims, because the proof path differs.
- Identify whether the theory is literal infringement, doctrine of equivalents, induced/contributory infringement, or divided infringement; do not assume one theory fits all claims.
- If multiple asserted claims, embodiments, configurations, or product modes are involved, enumerate them explicitly and analyze each one on its own record rather than collapsing them into a single pass.
- Surface verbatim quotes from internal documents only when necessary to anchor a technical point; otherwise paraphrase and cite the source material.

## 2. Failure modes the skill is correcting

- Accepting a patentee's characterization of how an accused product implements each claim element without independently verifying each element against the product's technical materials.
- Treating product features that are optional, disabled by default, or require user activation as always present for purposes of literal infringement.
- Applying a functional equivalence argument without checking whether prosecution history estoppel forecloses doctrine-of-equivalents coverage for the relevant element.
- Analyzing claim terms inconsistently with how the patent specification itself uses those terms.
- Blending distinct accused configurations, software modes, or deployment states into one generalized infringement theory.
- Concluding infringement from capability alone where the record requires actual operation, configuration, or direction-and-control facts.
- Stopping at mismatch identification without translating the mismatch into claim scope, litigation consequence, and risk level.

## 3. Legal frameworks / domain conventions that apply

- Literal infringement requires that every element of an asserted claim be present in the accused product; absence of any single element defeats literal infringement.
- Claim construction must follow the intrinsic record, including the claims, specification, and prosecution history, and terms should be read consistently with their technical usage in that record.
- Doctrine of equivalents may apply where literal infringement fails, but only after testing whether the accused feature performs substantially the same function, in substantially the same way, to achieve substantially the same result.
- Prosecution history estoppel can bar or narrow equivalents where the applicant narrowed claim scope or made a surrender relevant to the disputed limitation.
- Divided infringement turns on the direction-and-control framework and agency-type principles where method steps are performed by more than one actor.
- Induced and contributory infringement require an underlying direct infringement theory and the specific intent or knowledge elements that accompany the secondary theory.
- Optional or disabled features should be treated as a factual question tied to configuration and operation, not assumed present by product capability alone.
- The operative legal proposition should be stated with its supporting authority, whether from the patent record, governing statute, rule, or leading case.

## 4. Analytical scaffolds

- Build an element-by-element claim chart for each asserted claim:
  - claim language
  - construction or technical meaning
  - accused-product feature or operation
  - source citation
  - literal match or miss
  - non-infringement rationale if missing
- Run the chart claim by claim and element by element; if a dependent claim adds a limitation, test the added limitation separately rather than carrying forward the independent-claim result.
- For each disputed limitation, test the patentee’s theory against the technical record, product documentation, architecture evidence, user settings, and any source-code or interface evidence available.
- Where literal infringement fails, assess whether a doctrine-of-equivalents theory is available, then test estoppel and disclaimer before reaching functional equivalence.
- For method claims, identify who performs each step, whether any step is optional, and whether one actor directs or controls the others.
- For secondary infringement theories, identify the direct-infringement predicate and then analyze knowledge, intent, and the accused acts supporting the theory.
- If the record shows multiple product states or deployment scenarios, analyze each relevant state separately and state whether the infringement theory depends on a particular configuration.
- Distinguish “can be configured to” from “is configured to,” and “may support” from “does practice,” because capability alone is often insufficient for the asserted theory.

## 5. Vertical / structural / temporal relationships

- Track how the specification defines or exemplifies a term, then compare that usage against the accused implementation to see whether the accused feature sits inside or outside the disclosed scope.
- Track the prosecution timeline for each disputed limitation: amendment, argument, examiner response, allowance, and any disclaimer statements that bear on scope.
- Track any temporal dependency in the product record: default state, setup phase, activation step, runtime behavior, and post-deployment operation.
- If the claimed process depends on sequence, ordering, or repeated performance, evaluate whether the accused product actually performs the steps in the required order and at the required time.
- If one component triggers another, map the vertical relationship among user, administrator, controller, server, module, or external party and test whether the claim requires a particular relationship among them.

## 6. Output structure conventions

- Open with a concise bottom-line assessment of infringement risk and the strongest non-infringement themes.
- Use an element-by-element claim chart as the core of the analysis, organized by asserted claim and then by limitation.
- Include a claim-construction / intrinsic-record section only where it affects the disputed limitations.
- Include a prosecution-history section that identifies narrowing amendments, argument-based disclaimers, and estoppel implications tied to the contested elements.
- Include separate subsections for literal infringement, doctrine of equivalents, divided infringement, and secondary infringement only if those theories are genuinely in play.
- For each disputed limitation, state the governing rule, the technical comparison, the source support, and the downstream litigation consequence.
- Close with a litigation risk assessment that grades the strength of the non-infringement position by issue and explains which points are dispositive versus supporting.
- End with recommended defensive actions in imperative form, assigning the responsible role and a timing anchor tied to the litigation or technical review milestone.
- Use industry-conventional headings rather than copying any internal rubric language; keep the deliverable readable as a litigation work product, not a checklist.
