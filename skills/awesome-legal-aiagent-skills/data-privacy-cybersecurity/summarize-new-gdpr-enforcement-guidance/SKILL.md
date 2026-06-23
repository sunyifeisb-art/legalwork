---
name: summarize-new-gdpr-enforcement-guidance
task_id: data-privacy-cybersecurity/summarize-new-gdpr-enforcement-guidance
description: GDPR enforcement guidance executive briefs fail when the agent summarizes the guidance generically rather than filtering its implications through the company's specific processing activities and compliance tracker to produce actionable, company-specific takeaways for cross-functional leadership.
activates_for: [planner, solver, checker]
---

# Skill: Summarize New GDPR Enforcement Guidance — Executive Regulatory Brief for SaaS Workforce Analytics Company

## 1. Subject-matter triage
- Treat the guidance, enforcement summary, processing overview, and compliance tracker as one integrated record set; do not brief the guidance in isolation.
- Identify whether the guidance changes interpretation, enforcement emphasis, or practical risk; the brief should state what is newly significant, not restate GDPR basics.
- Map each key point to the company’s actual workforce-analytics processing activities and to the current compliance status reflected in the tracker.
- If the source set contains multiple affected processing activities, assess each one separately before synthesizing cross-functional implications.

## 2. Failure modes the skill is correcting
- Summarizing the guidance generically instead of translating it through the company’s specific data flows, purposes, and compliance posture.
- Ignoring the compliance tracker and missing where existing “completed” items now require reassessment under the new guidance.
- Writing in legalese rather than plain-language business terms for leadership outside the privacy team.
- Omitting the enforcement action summary and therefore missing the regulator’s real-world application of the rules.
- Collapsing distinct processing activities into one blended risk statement, which hides where the company is most exposed.
- Giving diagnostic commentary without clear ownership, urgency, and next steps.

## 3. Legal frameworks / domain conventions that apply
- GDPR interpretive guidance: use the guidance as the primary statement of regulatory direction, and distinguish it from binding law where relevant.
- Supervisory enforcement action: treat the enforcement summary as a practical indicator of how authorities may apply the guidance to similar conduct.
- Workforce analytics risk areas: lawful basis, purpose limitation, data minimization, retention, employee monitoring, automated decision-making, transparency, processor/controller allocation, and security expectations.
- Compliance tracker function: use the tracker as the baseline against which the new guidance reveals gaps, reclassification, or changed priority.
- Executive brief convention: lead with business impact, then regulatory meaning, then company-specific implications, then action items with ownership and timing.

## 4. Analytical scaffolds
- Extract the guidance’s core interpretive points and the enforcement action’s enforcement priorities.
- For each affected processing activity, ask: what does the guidance say, how does that differ from the current tracker position, and what business risk follows.
- Separate “new requirement,” “new emphasis,” and “existing control that now needs tighter evidence” so leadership can see what changed.
- Where the source set references a legal basis or regulatory rule, name the governing authority or rule rather than stating a bare conclusion.
- When multiple processing activities are implicated, list them first and analyze them one by one instead of using a generic composite.
- Keep each issue tied to a concrete company practice, a source document, and a practical consequence.

## 5. Vertical / structural / temporal relationships
- Show the relationship between the new guidance and the company’s current compliance tracker: what was previously acceptable, what is now under pressure, and what must be revisited.
- Show the relationship between guidance and enforcement: guidance explains the rule; enforcement shows how it is likely to be applied in practice.
- Show the relationship between processing design and legal risk: the same rule may affect product analytics, employee monitoring, customer configuration, retention, and vendor/processor arrangements differently.
- Preserve the sequence of change: what changed in the regulatory position, what that means now, and what should be done next.
- If the guidance creates phased or conditional implications, distinguish immediate actions from follow-up work.

## 6. Output structure conventions
- Write the deliverable as a plain-language executive regulatory brief for cross-functional leadership.
- Use an industry-conventional shape:
  - headline summary of what changed and why it matters,
  - the guidance points most relevant to the company,
  - implications for the company’s specific processing activities and current tracker status,
  - recommended actions with owners and timing.
- Use concise, business-oriented language; avoid unnecessary article-by-article GDPR citation in the body unless needed for precision.
- Make each implication section specific to a processing activity or compliance-tracker item, not a generic privacy summary.
- Include an explicit recommended actions section with imperative verbs, responsible roles, and timing anchors drawn from the source set or tied to the regulatory milestone.
- If the source documents identify controlling legal authority for a proposition, cite that authority by name in the brief.
- Deliver the file exactly as `executive-regulatory-brief.docx`.
