---
name: review-insurance-policy-construction
task_id: insurance/review-insurance-policy
description: Agents reviewing construction project insurance policies against lender requirements should identify coverage gaps, classify each issue by severity, compare policy terms to lender expectations, and propose specific remediation steps where needed.
activates_for: [planner, solver, checker]
---

# Skill: Review Construction Project Insurance Against Lender Requirements

## 1. Subject-matter triage (only if applicable)

- Use this skill for issue-spotting and comparison across construction project insurance forms, endorsements, schedules, declarations, and lender insurance requirements.
- Treat the lender’s loan agreement and any incorporated insurance schedule as the controlling benchmark; compare each policy form against that benchmark, not against industry custom alone.
- If multiple policies, renewals, layers, or locations are in scope, enumerate them first and analyze each separately rather than collapsing them into one blended view.
- If the source set is incomplete or ambiguous on a coverage point, say so expressly and flag the resulting review limitation.

## 2. Failure modes the skill is correcting

- Issues are described narratively but not tied to a severity scale, so the reader cannot tell which gaps are closing risks and which are lower-priority cleanups.
- Policy terms are checked in isolation instead of against the lender requirement they are meant to satisfy.
- Builder’s risk completion, soft costs, and expiration mechanics are noted without testing whether they actually bridge the project’s timing and loss exposure.
- Mortgage clause treatment is mentioned without distinguishing a clause that protects the mortgagee’s independent rights from one that only channels proceeds.
- Endorsements, exclusions, and waivers are not traced consistently across the program, leaving hidden gaps in additional insured, waiver of subrogation, pollution, or ordinance-or-law coverage.
- Recommendations are too generic; they do not identify a concrete fix, who should act, or when the fix must be obtained.
- Legal or coverage conclusions are stated without naming the governing policy concept, clause type, or controlling authority that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply

- Apply a uniform ordinal severity scale across all issues, defined once and used consistently: Critical, High, Medium, Low.
- Evaluate each issue against the operative lender requirement, the policy wording, and any interacting endorsement, exclusion, or schedule provision.
- Builder’s risk review should cover insured property scope, project value basis, soft costs, delay or completion protection, expiration or extension mechanics, and mortgagee treatment.
- Soft costs must be tested as a real exposure question: whether the time-based or delay-related sublimit is plausibly adequate for the project, not merely whether a soft-cost sublimit exists.
- Mortgage clause review should distinguish a standard mortgage clause from a simple loss-payee or payable-through clause and flag when the lender expects independent mortgagee protection.
- Ordinance or law coverage should be reviewed by components: undamaged portion, increased cost of construction, and demolition; missing components create separate gaps.
- Additional insured and waiver of subrogation treatment must be checked where the lender requires them, including whether the wording appears on the relevant primary and excess forms.
- Pollution review should identify whether the project has known contamination or similar site risk and whether the policy’s exclusion structure leaves uninsured exposure.
- Umbrella or excess review should include follow-form scope, punitive damages treatment where relevant, waiver of subrogation, and carrier quality if the source documents make it relevant.
- When legal meaning turns on a recognized insurance concept, name that concept explicitly rather than relying on paraphrase.

## 4. Analytical scaffolds

- Work policy by policy and then synthesize cross-policy gaps in the lender package.
- For each policy, test four elements in sequence:
  1. What the lender requires.
  2. What the policy actually says.
  3. Whether another form, endorsement, schedule, or layer changes the answer.
  4. What practical gap remains for the lender or project.
- For each issue, close the analysis with three moves:
  - scale the issue against a relevant project figure, term, limit, expiration date, or other source-based benchmark;
  - cross-reference the clause, endorsement, or other document that interacts with it;
  - state the downstream consequence for the client, lender, or project.
- Use issue labels that make the comparison visible, such as “requirement vs. form,” “coverage present but sublimit constrained,” or “coverage missing.”
- Where the documents present multiple relevant policies or layers, state the full set first, then analyze each item on its own terms.
- If a stated requirement appears satisfied only by implication, treat that as a review risk and explain why the wording is not clean enough.
- Distinguish between a true coverage gap, a wording ambiguity, and a documentation deficiency; each may require a different remedy and severity level.
- End each issue with a specific remediation step, such as obtaining an endorsement, revising the form, replacing coverage, confirming manuscript wording, or updating the certificate package.
- Do not stop at diagnosis: every recommendation should be operational, tied to a responsible role, and anchored to a timing point in the transaction or closing process.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare policy term, expected construction period, and completion/expiration mechanics to see whether coverage continues through the relevant risk window.
- Compare lender-required limits, sublimits, and deductibles/retentions to the project’s exposure profile and the actual coverage architecture.
- Compare primary and excess layers to confirm that the upper layers follow form where required and do not narrow core protections.
- Compare named insureds, additional insureds, mortgagee/mortgagee-rights wording, and loss payee provisions to confirm that each stakeholder is protected at the right vertical level.
- Compare site-condition risks, known contamination, and pollution exclusions across the program to determine whether one policy leaves a residual gap that another policy does not cure.
- Compare ordinances, codes, demolition obligations, and increased construction costs to ensure the coverage responds to each loss component separately.

## 6. Output structure conventions

- Produce a memorandum organized by issue, not by commentary stream.
- Include a short opening section that states the scope of review, the governing comparison standard, and any material limitations in the source set.
- Include a concise severity legend at the top and apply it uniformly throughout.
- Include a summary matrix early in the memorandum with columns for issue, policy, current status, lender requirement, gap, severity, and recommended action.
- Follow the summary with issue-by-issue analysis using one subsection per issue or related issue cluster.
- In each issue subsection, state:
  - the policy or layer at issue;
  - the relevant lender requirement;
  - the policy language or structure that does or does not satisfy it;
  - the gap or residual risk;
  - the severity classification;
  - the concrete remediation step.
- Surface the key coverage concepts directly in the prose so the reader can see why the gap matters.
- End with a standalone Recommended Actions section that lists the next steps in imperative form, names the responsible role if identifiable from the source set, and gives a timing anchor tied to closing, endorsement placement, renewal, or other transaction milestone.
- Keep the writing concise and transactional; do not add generic insurance background unless it materially explains the gap.
- If a conclusion depends on a recognized insurance rule or clause type, identify that rule or clause type explicitly in the memorandum.
