---
name: analyze-counterparty-markup-supply-agreement
task_id: intellectual-property/analyze-counterparty-markup-of-supply-agreement
description: Comprehensive deviation report analyzing a counterparty-marked supply agreement against the company's standard form and procurement playbook, incorporating critical-supplier dependency context.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of API Supply Agreement

## 1. Subject-matter triage
- Treat the standard form, the counterparty markup, the cover email, and the sole-source risk memo as one source set; do not analyze the redline in isolation.
- First determine whether there is one agreement version or multiple relevant iterations; if there are multiple markups, versions, or side letters in the packet, enumerate them and analyze each separately before drafting conclusions.
- Identify whether the supplier is a critical or sole source and calibrate every deviation to that dependency, because leverage, transition risk, and practical remedies change materially in constrained-supply situations.
- If the cover email purports to summarize concessions, verify those statements against the actual markup and flag any omission or mismatch as a negotiation-record risk.

## 2. Failure modes the skill is correcting
- Reviewing provisions one by one without tying commercial terms together as a single economic package.
- Missing the interaction among pricing, volume commitment, minimum purchase, take-or-pay, and termination provisions.
- Underweighting warranty, indemnity, product liability, insurance, and remedy language that together allocate defective-supply risk.
- Treating business-continuity and force majeure language as boilerplate even where the supplier is a critical or sole source.
- Relying on formatting changes alone instead of identifying each substantive change in a plain-text durable way.
- Failing to tie each issue to the source documents, the downstream consequence, and a concrete response.

## 3. Legal frameworks / domain conventions that apply
- Supply agreements commonly govern delivery, specifications, acceptance, pricing, forecasting, purchase commitments, quality, liability, confidentiality, term, and termination.
- Critical-supplier dependency changes the practical meaning of standard fallback rights; backup sourcing, allocation rights, notice obligations, and transition support become more important.
- Commercial pricing provisions should be read together with volume and purchase obligations to assess lock-in, exposure, and flexibility over the contract term.
- Warranty and inspection provisions define the buyer’s real leverage for nonconforming supply and should be assessed alongside cure rights, replacement obligations, and rejection mechanics.
- Indemnification, limitation of liability, and insurance provisions jointly determine whether the buyer can recover for third-party claims, recall exposure, and defective-product losses.
- Force majeure, supply-allocation, business-continuity, and disaster-recovery obligations govern operational resilience and should be assessed in light of source concentration.
- Termination, transition assistance, and wind-down provisions matter more where replacing the supplier would be slow, costly, or operationally disruptive.
- Use the governing law and any cited procurement-policy standards from the source documents when characterizing risk; do not state a legal conclusion without naming the rule, policy, or contractual clause that supports it.

## 4. Analytical scaffolds
- Issue framing: identify the clause, the counterparty change, the baseline position in the form or playbook, and the practical effect of the change.
- Economic package review: evaluate pricing, escalation, rebates, commitments, forecast commitments, minimum purchases, and take-or-pay as one interlocking structure.
- Quality and remedies review: assess specs, testing, acceptance, rejection, cure, replacement, and warranty duration together.
- Risk-allocation review: assess indemnity scope, cap structure, exclusions, consequential-damage carveouts, and insurance backstop together.
- Continuity review: assess force majeure, allocation, priority of supply, notice, stockholding, business-continuity planning, and transition support together.
- Negotiation-record review: cross-check the cover email for promised concessions, disclosed exceptions, and unresolved points; highlight any silent deviation that should have been surfaced.

## 5. Vertical / structural / temporal relationships
- Tie each issue to the clause hierarchy that controls it: definitions, order of precedence, schedules, exhibits, service levels, and ancillary policies.
- Where a term changes over time, capture the timing mechanics: initial term, renewal, notice windows, cure periods, forecast cycles, inspection periods, and transition periods.
- If the agreement contains multiple related commercial thresholds, explain how they compound or offset each other instead of analyzing them in isolation.
- If multiple documents create competing statements, identify which document governs and whether the inconsistency creates ambiguity, leverage loss, or execution risk.
- When the supplier is a sole or primary source, explain the operational consequence of each deviation in terms of sourcing continuity, replacement timing, and bargaining leverage.

## 6. Output structure conventions
- Produce a deviation report in issue-list form with a defined ordinal severity scale stated once at the top and applied uniformly to every entry.
- For each issue, include: clause/topic, baseline position, counterparty deviation, severity, and concise rationale.
- Each issue must close by tying the deviation to a source-document metric or threshold, a related clause or document, and the client consequence.
- Mark every substantive markup change in a durable plain-text convention so the deviation is visible even outside document styling; use explicit change markers for deletions, insertions, and substitutions, and attach a short rationale to each marked change.
- Distinguish between issues that are purely legal/compliance oriented and those that are economically or operationally material, but keep both in one integrated report.
- Include a dedicated critical-supplier section if the risk memo indicates dependency, and use it to explain how leverage constraints affect the severity of each deviation.
- End with a Recommended Actions block that gives imperative next steps, assigns the responsible internal role, and anchors timing to the negotiation, execution, or sourcing milestone reflected in the source set.
- Ensure the primary deliverable is complete and operative before any secondary summary; the report itself is the deliverable, not a description of it.
