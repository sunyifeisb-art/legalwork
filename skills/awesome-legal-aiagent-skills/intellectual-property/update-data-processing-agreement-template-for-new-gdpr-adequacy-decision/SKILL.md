---
name: update-dpa-template-gdpr-adequacy-decision
task_id: intellectual-property/update-data-processing-agreement-template-for-new-gdpr-adequacy-decision
description: Revising a DPA template to reflect an updated adequacy framework and related guidance, producing an issues memo and a redlined revised template.
activates_for: [planner, solver, checker]
---

# Skill: Update DPA Template for Updated Adequacy Framework

## 1. Subject-matter triage

- Confirm the governing data-transfer event, the jurisdictions involved, and whether the template is being updated for a new adequacy decision, a renewed UK transfer framework, or both.
- Read the adequacy summary, client concerns letter, sub-processor register, CLO instructions, and EDPB guidance together; do not treat any one source as exhaustive.
- Identify whether the template is a standalone DPA, a processor addendum, or a broader vendor agreement with DPA provisions, because transfer language may appear in multiple sections.
- Separate transfers covered by adequacy from transfers that still require another lawful mechanism; if the source set suggests multiple transfer routes, treat them as distinct workstreams rather than one global fix.

## 2. Failure modes the skill is correcting

- Updating transfer-mechanism language in one clause while missing linked provisions elsewhere in the template that still assume standard contractual clauses or equivalent safeguards.
- Assuming the new framework is a blanket solution without checking its scope limits, duration, territorial reach, entity coverage, sector coverage, or any fallback conditions.
- Ignoring sub-processors in the affected jurisdiction, which can make the update operationally important even where the main customer-facing transfer language seems straightforward.
- Failing to reconcile the client’s stated concerns with what the revised framework actually resolves, leaving the memo unhelpful on the business question.
- Omitting transitional handling for existing executed DPAs, renewal language, or fallback provisions if the framework changes.
- Drafting a memo that describes the issue but does not translate the legal change into concrete template edits.
- Producing a redline that depends only on formatting rather than text that remains readable after export.

## 3. Legal frameworks / domain conventions that apply

- An adequacy decision can remove the need for an additional transfer mechanism only for transfers within its defined scope; the template must track the exact scope stated in the relevant EU GDPR framework and any corresponding UK transfer regime.
- Use the controlling GDPR provisions for international transfers, including the adequacy mechanism and any residual safeguards framework that still applies where adequacy does not.
- If the source materials reference EDPB guidance, treat that guidance as a practical drafting input for supplementary measures, risk review, or monitoring obligations where the framework does not fully displace them.
- Where the source set addresses the UK regime, align the template with the applicable UK transfer framework and any renewal or continuity language in the instructions.
- Contract language should distinguish between: transfers covered by adequacy, transfers covered by another approved mechanism, and internal recordkeeping or operational monitoring obligations.
- Transitional drafting should preserve enforceability for legacy agreements and prevent accidental overstatement that all prior transfer clauses are automatically obsolete.
- If the framework or guidance contemplates future change, include a fallback or reversion concept that keeps the DPA operable if adequacy ceases to apply.

## 4. Analytical scaffolds

1. Map the scope of the adequacy summary: which transfers, entities, and jurisdictions are covered, and what express limitations remain.
2. Map the EDPB guidance: identify any additional process, notice, audit, documentation, or monitoring language that should be reflected in the template.
3. Enumerate every template provision that refers to cross-border transfers, subprocessors, safeguards, onboarding, vendor approvals, annexes, or fallback law.
4. For each provision, determine whether it should be:
   - deleted as obsolete,
   - narrowed to non-adequacy transfers,
   - revised to reference the new framework,
   - supplemented with a fallback clause, or
   - left unchanged.
5. Review the sub-processor register and identify the operational impact of any covered or potentially covered locations, including whether the register needs a conforming update.
6. Review the client concerns letter and state whether the new framework answers the concern fully, partially, or not at all.
7. Test transitional provisions against existing executed DPAs, renewal language, and amendment mechanics.
8. Draft the issues memo first as a synthesis of the changes, then implement the conforming redline in the template.

## 5. Vertical / structural / temporal relationships

- The adequacy framework sits above contract drafting and may supersede separate transfer mechanics only for covered transfers; clause-level drafting must therefore preserve a fallback for uncovered transfers.
- Where the source set suggests that the framework may evolve, the template should be drafted so that future invalidation, expiry, or narrowing does not break the agreement.
- If the template uses schedules or annexes for sub-processors or transfer details, update those cross-references consistently rather than only editing the operative clause.
- Treat existing agreements, renewals, amendments, and new signings as temporally distinct states; the right language may differ for each.

## 6. Output structure conventions

- Produce two deliverables: an issues memorandum and a redlined revised template.
- Issues memorandum should use conventional legal-analysis sections: scope and limitations, guidance implications, clause-by-clause impacts, sub-processor implications, client-concern response, and transition handling.
- Every issue entry in the memo should carry a uniform ordinal severity label defined once at the top of the memo, and each entry should state the practical consequence of the issue.
- Every advisory point should end with a concrete recommended action naming the responsible role and an urgency or milestone anchor drawn from the source set where available.
- The redlined template must be export-safe: pair normal redline styling with explicit text markers for insertions, deletions, and replacements so changes remain legible outside Word.
- Annotate substantive edits with short rationale comments tied to the governing framework or guidance.
- Keep the redline fully conforming: if one transfer clause changes, check related definitions, annexes, subprocessors, notices, audits, data-export restrictions, and amendment mechanics for consistency.
- When a clause is left unchanged, do not silently omit it from review; note in the memo why no conforming change is needed.
