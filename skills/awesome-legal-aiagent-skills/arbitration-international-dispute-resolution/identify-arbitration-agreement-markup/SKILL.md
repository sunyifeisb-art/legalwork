---
name: identify-arbitration-agreement-markup
task_id: arbitration-international-dispute-resolution/identify-arbitration-agreement-markup
description: Ensures an arbitration agreement markup addresses the curial law implications of the proposed seat, advocates for a multi-arbitrator panel with an explicit selection mechanism, and preserves the ability to recover consequential damages where appropriate.
activates_for: [planner, solver, checker]
---

# Skill: Arbitration Agreement Markup Preparation

## 2. Failure modes the skill is correcting

- Proposes a change to the seat of arbitration without explaining the curial law consequences — which courts will have supervisory jurisdiction, which procedural law governs, and how enforcement of the award in other jurisdictions is affected
- Does not address whether the arbitration should be heard by a multi-arbitrator panel or fails to explain why a sole arbitrator may be inadequate for the complexity and value of the anticipated disputes
- Accepts a consequential damages waiver without explaining how that waiver affects the recoverable remedies that may matter most in technology- or license-related disputes
- Does not address the harm caused by a restrictive discovery provision — the specific evidence categories inaccessible and the impact on the ability to establish damages and liability
- Treats the markup as a generic commercial edit instead of a dispute-resolution instrument that must be tested against the underlying deal structure, claim profile, and enforcement path

## 3. Legal frameworks / domain conventions that apply

- Seat and curial law: the seat of arbitration determines the curial (procedural) law and which courts will have supervisory jurisdiction; a non-domestic seat may change the procedural regime and the enforcement path in relevant jurisdictions; each proposed seat must be evaluated for its curial law framework and jurisdictional consequences
- Multi-arbitrator panel and selection mechanism: for complex technical, intellectual property, or revenue-sharing disputes with significant value, a sole arbitrator may lack the breadth of expertise needed; a multi-arbitrator panel can provide redundancy and broader expertise; the agreement should specify a clear mechanism for selecting the presiding arbitrator to avoid delay and possible institutional default appointment
- Consequential damages in technology and licensing disputes: in disputes involving intellectual property, commercialization, or revenue-sharing arrangements, lost profits, market share effects, development costs, and similar downstream harms may be central categories of damages; a waiver of consequential damages may eliminate most or all of the recoverable harm
- Discovery and evidence access: in disputes involving technology, licensing, or revenue allocation, the ability to obtain evidence of infringement, use, accounting, communications, and related damages typically requires document production and possibly forensic examination; a provision restricting discovery or document production may prevent a party from establishing its case
- Statute of limitations: where the agreement specifies a contractual limitations period shorter than the applicable statutory default, this may be enforceable but may cut off claims arising from conduct that occurred before the contractual window opens
- Governing law: the agreement should specify the substantive governing law separately from the seat so the tribunal, parties, and enforcing court can distinguish contract interpretation from procedural supervision
- Arbitration authority: any recommendation about seat, composition, remedies, discovery, or limitations should be tied to the relevant institutional rules, arbitration statute, or enforcement treaty that actually governs the draft

## 4. Analytical scaffolds

Assess the proposed seat; explain the curial law that would apply and the courts that would have supervisory jurisdiction; propose an alternative if the proposed seat is unfavorable and explain why.

Propose a multi-arbitrator panel with an explicit selection mechanism for the presiding arbitrator; explain why a sole arbitrator may be inadequate for the nature and value of the anticipated disputes.

Remove or narrow any consequential damages waiver; explain the categories of damages that would be affected and their importance for the anticipated claims.

Propose adequate discovery or document production provisions; identify the specific evidence categories needed and the harm caused by the proposed restriction.

Assess the contractual limitations period against the applicable statutory default; propose a period that does not cut off legitimate claims.

Ensure the governing law is correctly specified.

When the source materials present more than one seat, governing law, limitations period, damages framework, or discovery regime, enumerate each candidate explicitly before analysis and evaluate them one by one; do not collapse materially different alternatives into a single pass.

For each markup point, pair the edit with a concise rationale that identifies the legal rule or institutional convention supporting the change and explains the dispute-specific risk if the clause is left unchanged.

Treat the supporting documents as the control set: align the draft to the deal terms, dispute posture, and any referenced arbitration statute, institutional rules, or enforcement framework, rather than drafting in the abstract.

## 6. Output structure conventions

Write a section-by-section markup of the arbitration agreement in industry-conventional drafting order, using robust plain-text change markers in addition to any visual redline styling so the edits survive export.

For every substantive change, include:
- a textual change marker such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new]
- a short [Rationale: …] comment immediately adjacent to the change
- an ordinal severity label for the issue or edit entry, stated consistently from a fixed scale defined once near the top of the markup

Each entry should identify the proposed edit, why it matters in light of the expected dispute, and the governing legal or institutional authority that supports the recommendation.

If multiple clauses interact, cross-reference them in the comment so the reader can see how seat, governing law, tribunal composition, remedies, discovery, confidentiality, and timing operate together.

End with an explicit Recommended Actions section that states the concrete drafting steps to take, who should do them, and when they should be completed relative to the markup cycle or signing process.

Before finalizing, confirm that the primary deliverable file name is the one requested, that it is non-empty, and that it contains operative markup language rather than a summary of issues.
