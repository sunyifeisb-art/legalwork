---
name: analyze-counterparty-markup-of-protective-order
task_id: antitrust-competition/analyze-counterparty-markup-of-protective-order
description: Closes gaps in identifying compound interaction risks across protective order provisions, citing the relevant court’s prior rulings on contested issues, and making concrete recommendations with legal grounding.
activates_for: [planner, solver, checker]
---

# Skill: Protective Order Counterparty Markup Analysis

## 1. Subject-matter triage

- Treat the task as a clause-by-clause comparison of the counterparty’s markup against the client’s proposed protective order, not as a generic summary.
- If the source set includes multiple versions, first identify the operative baseline, the markup version, and any court-specific prior orders that inform likely acceptance.
- If the markup touches only one subject area, say so affirmatively; otherwise enumerate each changed provision before analysis.
- Keep the analysis anchored to the litigated antitrust context and the expected use of protected materials in that case.

## 2. Failure modes the skill is correcting

- Baseline analyzes changed provisions in isolation but misses how separate edits combine to create a broader disclosure or use risk.
- Baseline does not tie recommendations to the relevant court’s prior rulings on disputed protective-order issues, weakening courtroom-specific persuasion.
- Baseline omits waiver analysis for compressed clawback timing and does not connect clawback language to court-order-based protection against waiver in other proceedings.
- Baseline overlooks government retention obligations that may override destruction-or-return language.
- Baseline fails to assess challenge windows, de-designation mechanics, personnel access limits, and parallel-proceeding carve-outs as a connected system.
- Baseline states conclusions without a clear severity hierarchy or concrete negotiation posture.

## 3. Legal frameworks / domain conventions that apply

- Protective orders in antitrust matters commonly distinguish ordinary confidential material from highly sensitive material requiring tighter access controls.
- Access provisions for business personnel and in-house lawyers should be assessed for competitive-decision-making restrictions and related “wall” protections.
- Government and regulator access provisions should be read together with notice, objection, and downstream use restrictions.
- Clawback provisions should be analyzed against Federal Rule of Civil Procedure 26(b)(5)(B) and any order-based nonwaiver protection available under the governing rule and the court’s practice.
- Over-designation challenge provisions should be measured against the risk of practical chilling effects if the response period is too short.
- Automatic or scheduled de-designation can create administrative and inadvertent-release risk and often deserves scrutiny.
- Prosecution-style use restrictions may be relevant where the protective order limits competitive exploitation of technical or strategic information.
- Expert access provisions should require undertakings that bind experts to the same use and non-disclosure limits as counsel.
- Government records obligations may create a retention exception to return-or-destroy language.
- Parallel proceeding carve-outs, if broad, can expand disclosure and use beyond the immediate case when combined with sharing and access provisions.

## 4. Analytical scaffolds

1. Start with a change log: identify each substantive edit in the markup, state what moved, and classify whether it expands access, narrows protection, adds procedure, or shifts burden.
2. For each changed provision, analyze in this order:
   - the text change;
   - the specific risk created;
   - whether the court’s prior rulings address the issue or suggest likely acceptance;
   - a concrete recommendation with proposed counter-language.
3. Close each issue with three moves:
   - state the practical scale of the change using the case’s own sensitivity, timing, scope, or access structure from the source materials;
   - cross-reference any other clause or section that amplifies or mitigates the change;
   - explain the downstream consequence for the client’s litigation position, operational burden, or disclosure risk.
4. Assign an explicit severity level to every issue using a uniform ordinal scale defined once at the top of the memo.
5. Analyze interaction effects separately; identify where two facially tolerable edits become problematic when read together.
6. For each clawback or privilege-related issue, address court-order-based waiver protection and specify a business-day response period that is workable in practice.
7. End with negotiation priorities: separate objections the client should resist from provisions that may be traded for concessions elsewhere.
8. Cite the controlling authority for each legal proposition by name and section, rule, or case, rather than relying on conclusory phrasing.

## 5. Vertical / structural / temporal relationships

- Compare the markup’s effects across access tiers, not just within a single clause.
- Trace how disclosure permissions flow from one provision to another: sharing, copying, filing, use at deposition, use at trial, and post-litigation retention.
- Evaluate how timing provisions interact: designation deadlines, challenge windows, clawback notice periods, and de-designation schedules.
- Treat the protective order as a system; a permissive carve-out in one section can enlarge a restriction elsewhere if the cross-references are broad enough.
- Flag any provision that creates a one-way ratchet: broader sharing, shorter challenge periods, or weaker clawback rights without a compensating safeguard.

## 6. Output structure conventions

- Begin with a short executive summary identifying the most consequential changes and the overall negotiation posture.
- Define the severity scale once, then use it uniformly for every issue.
- Use issue-by-issue analysis with a compact heading for each changed provision.
- For each issue, include:
  - severity;
  - what the DOJ changed;
  - why it matters;
  - the governing authority or court practice supporting the recommended position;
  - proposed counter-language or drafting direction;
  - practical consequence for the client.
- Include a separate interaction-risks section for compounded effects across provisions.
- Include a recommendations table that maps each change to a proposed response and the legal basis.
- Where the markup touches privilege or clawback, include the recommended business-day notice period and the waiver-protection rationale.
- Where the markup affects access by personnel, experts, or government actors, state the intended guardrails and any undertaking requirement.
- Close with a Recommended Actions section that names the responsible role and the urgency or milestone for each step.
