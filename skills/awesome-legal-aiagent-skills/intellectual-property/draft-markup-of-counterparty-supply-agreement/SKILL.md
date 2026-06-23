---
name: draft-markup-counterparty-supply-agreement
task_id: intellectual-property/draft-markup-of-counterparty-supply-agreement
description: Redlined supply agreement markup and negotiation commentary memo for a counterparty supply agreement evaluated against the applicable internal playbook, relevant internal communications, and a supplier risk assessment.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Counterparty Supply Agreement

## 1. Subject-matter triage

- Treat the contract markup as the primary deliverable and the negotiation commentary memo as secondary.
- Before finishing, ensure the markup file exists, is non-empty, and contains operative redline language rather than a summary of proposed changes.
- Build the markup from the procurement playbook, internal emails, and supplier risk assessment together; do not treat any one source as exhaustive.
- If the source set contains more than one relevant business line, risk profile, or commercial variant, enumerate them first and analyze each separately rather than blending them into one pass.

## 2. Failure modes the skill is correcting

- Using a generic procurement template without reconciling it to the supplier-specific risk profile and operational realities reflected in internal communications.
- Reviewing pricing, delivery, volume, quality, warranty, and termination terms in isolation instead of as one commercial package that allocates supply, performance, and remedial risk.
- Missing internal email concerns that change the practical meaning of standard playbook positions, especially where the emails identify recurring pain points or nonstandard deal constraints.
- Producing a commentary memo that restates the redline without prioritizing issues, explaining tradeoffs, or giving negotiation direction.
- Relying only on visible track changes that may be lost on export, leaving the actual change unreadable from plain text.
- Stating concerns without tying them to the governing contractual provision, the operative source material, and the downstream business consequence.
- Writing advice without a clear recommendation, owner, and timing anchor.

## 3. Legal frameworks / domain conventions that apply

- Procurement playbooks typically set the buyer’s baseline positions on delivery, acceptance, inspection, rejection, remedies, warranties, indemnities, limitation of liability, confidentiality, compliance, insurance, suspension, and termination.
- Supply agreements are commercial risk-allocation documents; the operative question is whether the bargain protects continuity of supply, performance quality, and economic predictability under the supplier’s actual risk profile.
- Supplier risk assessment findings on financial stability, compliance history, capacity, single-source dependence, cyber or data handling, and operational resilience should be mapped to the clauses that mitigate those exposures.
- Internal communications may reveal non-public commercial constraints, transition needs, service dependencies, or practical tolerance levels that should inform markup positions.
- Price and volume provisions should be evaluated together with forecast commitments, take-or-pay mechanics, change-order rights, indexation, pass-throughs, and true-up concepts so the economic exposure is viewed as a whole.
- Quality, inspection, rejection, repair/replacement, and credit rights should be drafted to preserve a usable remedy path and avoid procedural hurdles that make the remedy illusory.
- Warranty, indemnity, insurance, and limitation-of-liability provisions should be read together because each can narrow or expand the actual recovery path.
- Termination, suspension, wind-down, transition assistance, and source-code or tooling access provisions should be coordinated to preserve continuity if supply fails.
- When legal propositions are invoked, name the governing authority used in the source set or the generally recognized authority supporting the proposition, rather than stating the conclusion nakedly.

## 4. Analytical scaffolds

- Source reconciliation: compare the playbook position, the internal emails, and the risk assessment clause by clause, then identify where the markup should follow, deviate from, or carve out the baseline.
- Commercial package review: assess whether the combined price, quantity, delivery, and service terms create acceptable exposure over the contract term.
- Risk-to-clause mapping: for each material supplier risk, identify the provision that addresses it and show whether the existing language actually closes the gap.
- Remedies review: test whether acceptance, rejection, cure, replacement, refund, setoff, and termination rights work together coherently.
- Liability architecture review: assess the relationship among indemnity scope, exclusions, liability cap, consequential damages waiver, and insurance requirements.
- Continuity review: evaluate whether the agreement contains usable fallback rights for shortages, interruption, force majeure, insolvency, nonperformance, and transition.
- Negotiation framing: classify each issue by severity, identify the negotiating objective, and separate must-hold positions from tradeable points.

## 5. Vertical / structural / temporal relationships

- Read upstream and downstream obligations together: ordering, forecast, manufacturing or sourcing, delivery, acceptance, invoicing, payment, and remedy provisions should not conflict.
- Track temporal triggers carefully: notice periods, cure windows, inspection periods, warranty periods, renewal dates, termination windows, and transition periods can change leverage and remedy availability.
- If the agreement has multiple product lines, service tiers, sites, or business units, analyze each separately where the risk or economics differ.
- If the source documents describe sequential approvals or escalation paths, preserve that order in both the markup and the commentary memo.
- Where a clause depends on another defined term, schedule, or exhibit, confirm the cross-reference still works after markup.

## 6. Output structure conventions

- Redlined markup: use robust textual change markers that survive export, such as [DELETED: …], [INSERTED: …], and [REPLACED: old → new], and attach a short [Rationale: …] note to each substantive change.
- Keep the redline readable as plain text even if formatting is stripped; do not rely on visual styling alone.
- Commentary memo: use an ordinal severity scale defined once at the top, then apply it consistently to every issue.
- For each issue in the memo, include: the affected clause or topic, the source of concern, the severity label, the practical consequence, and the recommended negotiating position.
- The memo should prioritize issues by business importance and negotiation leverage, not by document order alone.
- End the memo with a Recommended Actions block that assigns each action to a role and ties it to a milestone or urgency point.
- If multiple issues are present, enumerate them explicitly before analyzing them, and keep each issue separate rather than collapsing distinct problems into one discussion.
- The final package should leave the reader with both a usable redline and a decision-ready negotiation roadmap.
