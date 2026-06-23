---
name: summarize-state-ai-governance-bill-for-product-and-engineering-teams
task_id: corporate-governance/summarize-state-ai-governance-bill-for-product-and-engineering-teams
description: Agents summarize the bill's substantive requirements for product and engineering leadership, identifying implementation ambiguities, potential conflicts between documentation/retention requirements and privacy obligations, and opportunities to seek regulatory guidance on unresolved interpretive questions.
activates_for: [planner, solver, checker]
---

# Skill: State AI Governance Bill Summary — Plain-Language Executive Memo for Product and Engineering Teams

## 1. Subject-matter triage

- Confirm the target statute, the version in force or proposed, and whether the request is to summarize enacted law, pending legislation, or a bill as amended.
- Identify whether the AI product is a covered system because it is used in hiring, screening, ranking, recommendation, or another consequential employment decision.
- Treat the memo as an executive-facing advisory summary: the goal is implementation clarity, not statutory paraphrase.
- If the source set includes more than one bill, amendment, or comparator state law, separate them before analysis and state which is controlling for the product decision.
- If only one bill is in scope, say so affirmatively and avoid implying a broader comparative survey unless the source materials support it.

## 2. Failure modes the skill is correcting

- Summarizes only the bill’s headline obligations and omits the implementation questions product and engineering must solve.
- Treats human oversight as a box-checking concept instead of specifying the decision flow, review point, and fallback for borderline cases.
- States a testing obligation without identifying the internal testing standard when the bill leaves statistical terms undefined.
- Fails to surface conflicts between retention/documentation duties and privacy, deletion, or minimization obligations.
- Avoids recommending escalation to regulators even where the bill leaves material interpretive uncertainty.
- Writes for lawyers instead of product and engineering leadership, making the memo too abstract to drive implementation.
- Collapses multiple covered obligations, dates, or decision types into one generalized summary instead of mapping each separately.

## 3. Legal frameworks / domain conventions that apply

- **Scope and coverage:** Identify the bill’s covered entities, covered AI systems, and covered decision types, then confirm why the hiring product falls within that scope.
- **Consequential employment decisions:** For hiring use cases, focus on screening, selection, ranking, recommendation, and other decisions that affect access to work or advancement.
- **Human oversight:** State whether the bill requires review, approval, override authority, notice, or documentation of human involvement, and distinguish those duties clearly.
- **Exceptions for favorable outcomes:** If an exception exists for wholly favorable decisions, address mixed or partially adverse outputs conservatively and explain the operational default.
- **Testing and impact assessment:** Summarize any requirement to test for bias, disparate impact, accuracy, or other performance issues and note any undefined statistical concepts or thresholds.
- **Recordkeeping and retention:** Identify what documentation must be preserved, for how long, and whether the statute contemplates audit access, notices, or internal logs.
- **Privacy and minimization:** If retention or documentation duties may conflict with privacy obligations, minimize personal data in the retained record and distinguish required evidence from optional supporting material.
- **Temporal compliance:** Capture effective dates, delayed applicability, phased obligations, or separate compliance dates by entity size or system type.
- **Comparative context:** If the source set discusses other state AI laws, note only the implementation-relevant similarities and differences that change the compliance work.

## 4. Analytical scaffolds

- **Scope confirmation:** Start by stating whether the hiring product is in scope and why, using the bill’s own defined categories.
- **Obligation-by-obligation summary:** For each material obligation, state in plain language:
  - what the bill requires,
  - what product and engineering must do,
  - where the text is ambiguous or underdefined,
  - the conservative implementation choice.
- **Borderline-case analysis:** Where the bill turns on outcome type, level of human involvement, or statistical significance, identify the edge case and adopt the safer operational interpretation unless the text clearly allows otherwise.
- **Conflict analysis:** For any documentation or retention rule that may collide with privacy, deletion, minimization, or data-security obligations, identify the collision and recommend a record-design that satisfies both.
- **Guidance trigger analysis:** Flag interpretive questions that are important enough to merit regulator outreach before final implementation.
- **Timeline analysis:** Translate each obligation into a practical implementation window, distinguishing immediate policy work from engineering build work and from later launch readiness.

## 5. Vertical / structural / temporal relationships

- **State-law alignment:** If another state AI law is already part of the company’s compliance program, indicate whether this bill is aligned, more demanding, or uniquely different in ways that require separate controls.
- **Documentation architecture:** Distinguish among policy documents, model documentation, testing evidence, human-review logs, notices, and retention records so engineering knows what must exist and what can be minimized.
- **Workflow hierarchy:** Map how product design, model development, human review, compliance review, and launch approval fit together so the memo reflects the actual operating sequence.
- **Temporal sequencing:** Make clear which duties arise before deployment, at deployment, during ongoing use, and after a triggering event such as a complaint, audit request, or detected disparity.

## 6. Output structure conventions

- Write a plain-language executive memo for product and engineering leadership, not a law-firm note.
- Use short, action-oriented headings such as:
  - What This Law Means for Our Hiring Product
  - Compliance Timeline
  - Key Requirements and Implementation Steps
  - Ambiguities and Conservative Defaults
  - Data Retention / Privacy Interactions
  - When to Seek Regulator Guidance
  - Priority Actions for Product and Engineering
- Define any specialized term on first use and avoid unnecessary citation clutter.
- Where the memo relies on a legal proposition, name the controlling authority from the source materials or the relevant statute, rule, or regulation rather than stating the proposition abstractly.
- If the bill contains multiple obligations, organize them as separate rows or bullets so each one can be implemented and tracked independently.
- End with a concise recommended-actions block that assigns each action to a responsible role and a timing anchor tied to the statute’s effective date, launch milestone, or other concrete compliance milestone.
- Include a practical priority table with columns for obligation, required action, responsible team or role, and target timing.
- Keep the output suitable for direct conversion into `hb-4217-executive-summary-memo.docx`.
