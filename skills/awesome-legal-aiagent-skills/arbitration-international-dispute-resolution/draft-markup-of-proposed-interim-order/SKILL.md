---
name: draft-markup-of-proposed-interim-order
task_id: arbitration-international-dispute-resolution/draft-markup-of-proposed-interim-order
description: Ensures a respondent-side markup of a proposed interim order addresses the requested relief structure, tests any asserted risk with financial evidence, and cites the applicable interim measures framework.
activates_for: [planner, solver, checker]
---

# Skill: Interim Order Markup (Respondent Side)

## 1. Subject-matter triage (only if applicable)

- Determine whether the proposed order is truly interim, or whether any provision effectively grants final relief, freezes business operations, or pre-adjudicates merits.
- Identify all requested restraints, disclosures, preservation obligations, reporting duties, access rights, and enforcement hooks before revising text.
- If more than one respondent, asset pool, disputed measure, or time period is in play, separate them before analysis and assess each restraint on its own footing.

## 2. Failure modes the skill is correcting

- Marks up scope and duration provisions without identifying whether the proposed order should include reciprocal protection for the restrained party and explanatory commentary on that omission
- Accepts the claimant's asserted risk narrative without testing it against the respondent's financial position or other available evidence bearing on that risk
- Does not cite the applicable interim measures framework, leaving the markup's legal basis ungrounded
- Treats commentary as freeform notes instead of a change-by-change legal justification tied to the revised language
- Uses styled redlines only, so changes become opaque when the document is exported or converted

## 3. Legal frameworks / domain conventions that apply

- Interim measures framework: cite the governing source for interim relief authority, including the arbitration agreement, institutional rules, tribunal powers, and any procedural order already entered.
- Respondent-side proportionality: interim relief should be tailored to the alleged harm and should not exceed what is necessary to preserve the status quo or protect the tribunal's effectiveness.
- Risk-based relief: where the request depends on dissipation, concealment, frustration, or similar prejudice, the response should test that claim against available financial evidence, operational facts, and any contrary conduct.
- Reciprocal or protective measures: where the proposed order burdens one side, assess whether symmetry, security, carve-outs, reporting limits, or undo provisions are needed to avoid unfairness.
- Modification and discharge: identify any trigger, review date, expiration point, or application process that governs alteration, lifting, or replacement of the order.
- Drafting convention: each revision should be anchored to a specific legal basis, a factual basis, or a prior procedural directive, not merely to advocacy preference.

## 4. Analytical scaffolds

- For each proposed restraint or affirmative obligation, ask: what exact conduct is prohibited or required, why is it needed now, and what narrower wording would preserve the same protection?
- Test any asserted urgency or prejudice against the record as a whole, including financial position, liquidity, conduct history, and any evidence of ability or inability to comply.
- Compare the proposed order against the governing framework provision and any existing procedural order to determine whether the tribunal has the authority to grant, tailor, condition, or time-limit the relief.
- For each objection or revision, state the consequence of leaving the language as drafted: overbreadth, unfair prejudice, compliance ambiguity, enforcement difficulty, or unnecessary operational burden.
- If the respondent is asked to do something affirmative, consider whether a reciprocal obligation, confidentiality safeguard, cost protection, or prompt review mechanism should be inserted.
- Where the source materials support a narrower alternative, replace absolute wording with defined scope, objective triggers, limited duration, and express carve-outs for ordinary-course conduct.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Map the order from governing authority to tribunal power to operative paragraph so the commentary shows why the language belongs in the order and where it fits.
- Distinguish immediate preservation measures from ongoing reporting or later review obligations.
- Identify whether a deadline, sunset, return date, or status-review mechanism should follow the restraint to prevent an indefinite freeze.
- If the proposed language interacts with prior directions, preserve consistency and flag any conflict expressly.

## 6. Output structure conventions

- Produce a respondent-side redlined interim order with comments attached to each substantive edit.
- Use a plain-text-safe redline convention in addition to any visual formatting so the changes survive export, such as [DELETED: …], [INSERTED: …], and [REPLACED: old → new].
- Attach a short [Rationale: …] after each substantive change, stating the factual basis, legal basis, or procedural basis for the revision.
- Make the change itself legible without relying on color or track-changes styling alone.
- Each legal proposition should be tied to a named authority or governing provision.
- Commentary should be concise, specific, and linked to the exact sentence or paragraph being revised.
- If the order contains multiple independent restraints or reporting duties, address each one separately rather than collapsing them into a single generalized comment.
- End with a short Recommended Actions block that tells the drafter what to verify, revise, or escalate next, in imperative form and tied to the responsible role and timing anchor.
- Ensure the final primary deliverable file is the completed interim order markup itself, not a memo standing in for the order.
