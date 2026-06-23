---
name: draft-markup-of-arbitration-agreement
task_id: arbitration-international-dispute-resolution/draft-markup-of-arbitration-agreement
description: Ensures an arbitration agreement markup produces two distinct deliverables, annotates each change with the applicable playbook position tier, and explains institutional choice and governing-law implications at a procedural level.
activates_for: [planner, solver, checker]
---

# Skill: Arbitration Agreement Markup

## 1. Subject-matter triage (only if applicable)

- Confirm the task is a markup/draft-redline assignment, not a pure issue memo.
- Identify the operative artifact to be marked up first, then treat any memo as secondary.
- If the source set contains more than one agreement version, amendment, or parallel instruction set, enumerate each governing source before analyzing changes.
- If only one agreement is in scope, state that expressly and proceed on that basis.

## 2. Failure modes the skill is correcting

- Produces only a cover memo and omits a separately tracked redlined agreement, leaving no negotiable markup.
- Relies on formatting alone to show edits, so changes disappear or become ambiguous after export.
- Adds comments without tying each change to the client’s playbook tier, making priority and trade posture unclear.
- Treats institutional selection as boilerplate instead of explaining fit for the anticipated dispute profile.
- States a governing-law preference without explaining the negotiation leverage, enforceability, or procedural consequences behind it.
- Blends the primary markup and secondary summary into one document, obscuring the distinct purpose of each deliverable.

## 3. Legal frameworks / domain conventions that apply

- Client playbooks typically sort positions into Required, Preferred, and Fallback; comments should use that hierarchy consistently so the reader can distinguish non-negotiables from tradeable points.
- Arbitration clauses should be reviewed for institution, seat, governing law, appointment mechanics, interim relief, consolidation/joinder, confidentiality, discovery scope, and award enforceability.
- Institutional choice should be matched to the expected dispute type, cross-border posture, cost profile, and procedural sophistication; the comment should explain why the selected institution is the best fit and, where relevant, why an alternative better tracks the dispute profile.
- Governing law should be framed in negotiation terms: the clause may affect interpretation, available remedies, procedural defaults, and enforceability.
- Any legal proposition stated in the markup or memo should be anchored to a controlling authority where one is invoked in the source set or is standard for the issue, rather than presented as a naked conclusion.
- For cross-border arbitration concepts, the New York Convention, UNCITRAL Model Law, applicable arbitration statute, and institutional rules are the usual reference points; use the governing authority that matches the source materials and venue.

## 4. Analytical scaffolds

- Draft the redlined agreement first, then the cover memo after the markup exists and is usable.
- Show every substantive edit in a plain-text-stable form in addition to any visible track changes:
  - [DELETED: …]
  - [INSERTED: …]
  - [REPLACED: old → new]
- Attach a short rationale comment to each substantive edit so the reason for the change survives conversion.
- In each comment, identify the playbook tier and the negotiation posture:
  - why the change is mandatory, strongly preferred, or acceptable only as a compromise;
  - what leverage point it protects;
  - what risk it reduces or preserves.
- For the institution clause, explain whether the chosen forum is appropriate for the anticipated dispute set, and whether its procedures, administrative costs, and appointment mechanics fit the transaction.
- For the governing-law clause, explain why the client’s preferred law is selected and why the counterparty’s preferred law is resisted, focusing on practical consequences rather than abstract preference.
- Where the clause interacts with seat, venue, interim relief, confidentiality, enforcement, or consolidation, note that interaction in the comment so the reader can see the clause as part of a system, not in isolation.
- If multiple candidate institutions, laws, or seats are under consideration in the source materials, analyze each one separately before selecting the recommended position; do not collapse distinct alternatives into one generalized comment.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track how the arbitration clause operates across the life of the relationship: formation, dispute escalation, appointment, interim relief, hearing, award, and enforcement.
- Note whether a clause is intended to govern disputes arising now, disputes under a future amendment, or disputes surviving termination.
- If the markup touches related provisions elsewhere in the agreement, cross-reference those provisions in the rationale so the clause package is read consistently.
- Treat hierarchy explicitly where there is a conflict between the arbitration clause, an incorporated playbook position, and any general boilerplate; the more specific instruction should control unless the source materials say otherwise.

## 6. Output structure conventions

- Produce two separate files, in this order: the redlined arbitration agreement first, then the cover memo.
- The redlined agreement is the primary deliverable and must contain the operative clause text, not merely a description of proposed edits.
- The redlined agreement should be readable in plain text even if formatting is stripped; every substantive change must be identifiable from the text itself.
- Every substantive edit should carry a short comment that states the rationale and the applicable playbook tier.
- The cover memo should summarize the changes by priority, with Required items first, then Preferred, then Fallback.
- The memo should explain the practical consequence of each change and identify any negotiation tradeoff or fallback path.
- End the memo with clear next-step recommendations directed to the appropriate deal team role, with timing tied to the signing, markup, or negotiation milestone if one is available from the source materials.
- Before finishing, confirm that each deliverable file exists, is non-empty, and contains operative markup or memo content rather than a placeholder or summary of what should be drafted.
