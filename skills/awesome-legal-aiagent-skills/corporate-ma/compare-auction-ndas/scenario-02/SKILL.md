---
name: compare-auction-ndas-s02
task_id: corporate-ma/compare-auction-ndas/scenario-02
description: Guides auction-process NDA review by comparing each bidder's markup against the seller's form and playbook, assessing standstill, representatives scope, enforcement mechanics, and data room admission recommendation for each bidder.
activates_for: [planner, solver, checker]
---

# Skill: Compare Auction NDAs

## 2. Failure modes the skill is correcting

- Reviewing deviations clause-by-clause without testing how they interact, especially where broader access rights, weaker employee restrictions, and residual-memory language combine into a practical leakage pathway.
- Treating standstill issues as purely textual without checking the trigger mechanics, fall-away timing, and whether the relief sought remains usable in an active auction.
- Missing that a notice period, cure period, or other precondition before equitable relief can undercut fast confidentiality enforcement.
- Overlooking whether side letters or “special terms” submitted by a bidder are procedurally effective absent seller countersignature or comparable assent.
- Failing to tie each deviation to a concrete admission decision, so the report identifies issues but does not convert them into an actionable room-access recommendation.

## 3. Legal frameworks / domain conventions that apply

- Compare each bidder’s NDA against the seller’s form and playbook, not against market abstraction; the controlling baseline is the seller’s own drafting position.
- Standstill analysis should focus on whether the restriction exists, whether it falls away on a discrete event or only after a later threshold, and whether the trigger aligns with auction dynamics.
- Representative-scope analysis should test access by affiliates, funds, portfolio companies, advisers, and other related persons, then assess interaction with any no-solicit, no-contact, or use-limitation language.
- Residuals analysis should assess practical—not merely textual—erosion of confidentiality where retained-memory concepts or similar carve-backs are broad.
- Enforcement mechanics should be checked for any notice, waiting period, exclusivity, or forum restriction that could delay injunctive or other equitable relief.
- Governing law and dispute-resolution changes matter only insofar as they change enforceability, speed of relief, or auction leverage.
- Side letters should be treated as effective only if the source set shows valid assent under the applicable contract-formalities framework; otherwise flag them as disputed or non-operative.
- Every legal conclusion should be anchored to a named authority, rule, statute, regulation, or recognized doctrine where one is available from the source set or standard practice.

## 4. Analytical scaffolds

### 4.1 Scope and party enumeration
- First enumerate the bidders and the NDA documents in scope.
- If there is only one NDA per bidder, say so and analyze each bidder once.
- If there are multiple variants, side letters, or follow-on markups for the same bidder, treat each as a separate instrument and note whether they supersede, supplement, or conflict.

### 4.2 Per-bidder deviation review
For each bidder, assess the deviations in this order:
1. Confidentiality definition and carve-outs
2. Representatives scope and access permissions
3. Standstill presence, deletion, modification, and fall-away mechanics
4. Non-solicitation of employees and related carve-outs
5. Non-solicitation of customers, suppliers, or business partners
6. Residuals or retained-memory language
7. Liability cap or damage-limitation language
8. Enforcement mechanics, including notice, delay, or cure conditions before equitable relief
9. Governing law, venue, and dispute mechanics
10. Side letters, transmittals, or special conditions affecting operability
11. Consistency with seller playbook positions

### 4.3 Issue-closing method
For each deviation, do not stop at description. Close the issue by:
- stating the scale of the deviation using a document-grounded benchmark from the source set;
- linking it to any other clause or document that amplifies, narrows, or conditions the risk;
- stating the downstream consequence for the seller in transactional, competitive, operational, or enforcement terms.

### 4.4 Severity and recommendation logic
- Assign every deviation an explicit ordinal severity label using one consistent scale stated at the outset.
- Tie severity to the combined effect of scope, enforceability, and auction sensitivity, not to phrasing alone.
- Convert each material issue into a bidder-specific admission recommendation: admit, admit with conditions, or exclude.
- Where admission is conditional, state the condition in practical terms that can be implemented before data room access is granted or expanded.

### 4.5 Cross-bidder comparison
- After the per-bidder review, compare bidders across the same issue categories.
- Highlight compounding-risk profiles, such as broad representative access paired with weak restraints on use or solicitation.
- Distinguish isolated drafting noise from deviations that materially change the seller’s information-control or enforcement position.
- If two bidders share the same deviation, note whether the business context makes one materially riskier than the other.

### 4.6 Authority discipline
- Support each legal proposition with the controlling authority or doctrine relevant to the point.
- Use the source documents’ citations when they identify the governing rule, and otherwise use the standard authority normally applied to the issue.
- Do not state that a term is unenforceable, ineffective, or commercially unacceptable without naming the rule or principle supporting that assessment.

## 6. Output structure conventions

- Start with a concise executive summary that states the overall auction-access posture and the highest-risk deviation themes.
- Define the severity scale once near the top and apply it consistently throughout.
- Provide a bidder-by-bidder deviation report in a comparison-matrix format, with one row per material deviation and columns for bidder, provision, nature of change, severity, interaction, consequence, and recommendation.
- Follow the matrix with narrative analysis for each bidder, using the same issue order across bidders to make comparison easy.
- End with a cross-bidder risk summary that identifies the most permissive forms, the most enforceable forms, and the main compounding-risk patterns.
- Conclude with a Recommended Actions block that assigns each action to a responsible role and ties it to the auction timeline or document-exchange milestone.
- Present the final data room admission recommendation for each bidder as a clear status with any gating conditions stated in implementation terms.
- Keep the report internally consistent: the recommendation for a bidder should track the severity and enforcement analysis already given.
