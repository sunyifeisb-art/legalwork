---
name: ecvc-draft-markup-series-b-spa
task_id: emerging-companies-venture-capital/draft-markup-of-series-b-preferred-stock-purchase-agreement
description: Marking up a preferred stock purchase agreement from the company's perspective requires comparing the draft to the agreed term sheet, reviewing all schedules and exhibits for hidden anti-dilution mechanics, identifying any investor-specific consent rights that go beyond the general class vote, reconciling the share authorization in the transaction documents against the charter documents, and checking whether any signing representations are inconsistent with the diligence record.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Series B Preferred Stock Purchase Agreement

## 1. Subject-matter triage
- Treat the investor draft as the baseline only for markup mechanics, not for legal acceptability.
- Start by mapping the source set: draft SPA, term sheet or strategy memo, cap table and capitalization exhibits, charter and Series A excerpts, and any transmittal email that changes the working assumptions.
- Separate true open points from implied imports: provisions copied from prior rounds, side-letter concepts, exhibit-only mechanics, and points only mentioned in email.
- If the source set contains only one investor package, state that explicitly before drafting; otherwise enumerate each relevant counterparty, class, or scenario before analyzing them.

## 2. Failure modes the skill is correcting
- The markup fixes the body language of the agreement but misses exhibit language that quietly changes economics or control.
- Consent rights are left in a broad class vote format even though a specific holder gets separate blocking power.
- Share issuance mechanics are accepted without reconciling them to the charter, existing preferred designations, and reserved shares.
- Signing reps are left untouched even where diligence materials make them inaccurate or overstated.
- The draft is rewritten as commentary only, without an actual redline file that can be circulated.
- Changes are described narratively but not marked in a way that survives conversion to .docx.

## 3. Legal frameworks / domain conventions that apply
- Economic preference analysis: test whether the preferred security changes the company’s payoff profile at exit by comparing preference and conversion outcomes at representative enterprise outcomes drawn from the deal materials.
- Charter and issuance authority: confirm the contemplated issuance fits within the authorized capital and any class-designation mechanics in the charter and related board or stockholder approvals.
- Control allocation: distinguish general class protections from bespoke investor vetoes, observer rights, or side-letter governance rights that alter the negotiated balance.
- Disclosure consistency: signing representations must be checked against the diligence record, including schedules, exceptions, and any email-carried understandings.
- Anti-dilution and price-protection review: inspect every schedule, exhibit, and defined term for conversion-ratio mechanics or equivalent protections that may not be obvious from the body text.
- Company-side drafting norm: where a provision is overbroad, narrow the operative trigger, add materiality, knowledge, or reasonableness qualifiers, and align the text with the term sheet and market convention.

## 4. Analytical scaffolds
- Read the draft against the term sheet point by point; extract every deviation, omission, and added protection.
- Review each schedule and exhibit separately for hidden economic or governance mechanics; do not assume the main text is complete.
- For each investor protection, ask whether it duplicates a general class vote or creates separate blocking power; if the latter, propose rationalization.
- Reconcile the share numbers across the draft, charter excerpts, cap table, and any closing mechanics before commenting on issuance sufficiency.
- Check each signing representation against the diligence record; flag any statement that would be inaccurate at signing or misleading by omission.
- For each material issue, give a concrete counterproposal rather than a general objection.
- Where the issue turns on economics, include a concise comparison of the relevant outcomes at a few representative exit levels drawn from the source materials, not invented transaction assumptions.
- Where multiple preferred series, holders, or time periods are in play, analyze each separately rather than collapsing them into one generic pass.
- Every legal point should be tied to the applicable authority or deal-document hook used in the source set, including the charter, SPA, term sheet, or governing legal standard relied on in the draft.

## 5. Vertical / structural / temporal relationships
- Track hierarchy carefully: charter and certificate language control over inconsistent SPA drafting, and the SPA controls only where it validly implements the charter and approvals.
- Track document interaction across time: prior-round rights, current-round modifications, and closing conditions may all affect the same provision.
- Track structural dependencies: if one clause depends on a schedule, exhibit, or defined term, the redline should change both the operative clause and the dependent cross-reference.
- Track temporal claims: signing, closing, funding, and post-closing covenants should not be mixed unless the source documents expressly do so.

## 6. Output structure conventions
- Produce the actual markup file as the primary deliverable; do not stop at a memo or issue list.
- Use plain-text change markers that remain readable after export, including explicit deleted, inserted, or replaced text conventions, and attach a short rationale to each substantive change.
- Organize commentary by issue severity using a defined ordinal scale stated once at the top, then apply it consistently.
- For each issue entry, use this sequence: severity, counterparty position, deviation from the source set or market convention, consequence for the company, and recommended counterproposal.
- Each issue should identify the relevant document interaction, the governing clause or authority hook, and the practical downstream effect on economics, control, disclosure, or closing deliverability.
- Include an economic preference comparison table when the preferred economics or conversion mechanics matter to the markup.
- Close with a concise Recommended Actions block naming the responsible role and the next timing milestone or urgency anchor.
- Before finishing, confirm that the primary markup file exists and is non-empty, and that it contains operative redlines rather than a descriptive summary.
