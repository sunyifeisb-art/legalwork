---
name: draft-data-room-population-plan-s02
task_id: corporate-ma/draft-data-room-population-plan/scenario-02
description: Guides preparation of a data room population plan with critical DDRL review, regulatory filing-check validation, open-source audit staleness assessment, LGPL copyleft risk identification, anti-assignment consent tracking, and resolution of instruction conflicts.
activates_for: [planner, solver, checker]
---

# Skill: Draft Data Room Population Plan (Scenario 02)

## 1. Subject-matter triage
- Treat the assignment as a sell-side population plan, not a diligence memo: the work product should organize what goes into the room, who gathers it, when it is ready, and what must be reviewed or withheld.
- Read the full source set before assigning folders or deadlines. If the document set is internally inconsistent, preserve the inconsistency in the plan and flag it for client resolution rather than smoothing it over.
- Identify whether the target is a software/SaaS business, because that drives emphasis on code, open-source, product, security, customer, and infrastructure materials.
- If the source set contains more than one document family, inventory them first and map each family to a collection owner before drafting the plan.

## 2. Failure modes the skill is correcting
- Following the requested document checklist mechanically without testing whether any item is stale, overbroad, incomplete, or inconsistent with the transaction posture.
- Omitting deal-execution items that are not obvious from a generic checklist, especially consents, change-of-control restrictions, and other closing dependencies.
- Treating prior technical audits as current without checking whether later development, releases, or code changes may have made them outdated.
- Missing copyleft-license integrations that require special handling, or lumping them together with permissive-license software.
- Uploading sensitive governance, customer, or contract materials without planning for redaction review and buyer-objection management.
- Ignoring conflicts between internal instructions and the requested room contents, or failing to route those conflicts for resolution before population begins.
- Producing a narrative summary instead of a working plan with owners, sequencing, and review gates.

## 3. Legal frameworks / domain conventions that apply
- Regulatory filing and pre-closing notification checks: test any assumption that a filing is unnecessary against the actual deal structure, timing, and jurisdictional footprint before planning the room around that assumption.
- Anti-assignment and change-of-control provisions: flag agreements that may require consent, notice, or waiver on transfer or ownership change, and build collection around the closing-critical path.
- Open-source compliance: distinguish permissive licenses from copyleft licenses, and treat copyleft-linked obligations as a separate legal review track.
- Software compliance audit currency: a prior audit is only useful if it still reflects the current codebase, build process, and release history.
- Confidentiality and privilege management: board materials, counsel communications, and other sensitive governance records should be treated as likely redaction or access-control items.
- Customer and vendor redaction norms: commercial contracts may need partial masking rather than full exclusion to balance diligence utility and confidentiality.
- Cross-border entity and document coverage: non-domestic subsidiaries or operations often require a separate completeness check so the room does not overstate coverage.
- Deal-consent rights and execution conditions: shareholder approvals, third-party consents, and similar rights should be surfaced as closing-readiness items, not merely as background facts.
- Controlling authority should be cited whenever a legal proposition is asserted; use the relevant statute, regulation, contractual provision, or recognized practice authority rather than stating conclusions bare.

## 4. Analytical scaffolds
1. Start with a document-family inventory.
   - List each source document family or issue theme in scope before analysis.
   - If only one family is present, say so expressly and explain why the analysis is limited to that family.
2. Translate the source set into a population workflow.
   - For each folder or workstream, assign: document owner, reviewer, redaction reviewer if needed, and target collection date.
   - Separate business-gathering tasks from legal-review tasks so the plan reflects sequencing, not just storage.
3. Test the checklist against the transaction facts.
   - Identify any requested item that appears inconsistent with the deal structure, timing, or entity footprint.
   - State the governing authority or contractual source that supports the correction.
4. Run a consent and restriction pass.
   - Capture anti-assignment, change-of-control, notice, waiver, consent, and similar restrictions in a separate tracker.
   - Note the downstream closing consequence of each item and route it to the responsible owner.
5. Run a software and licensing pass.
   - Review open-source materials for currency.
   - Separate permissive items from copyleft items.
   - If the audit appears stale, mark it for refresh before room opening.
6. Run a sensitive-materials pass.
   - Flag board materials, customer contracts, security materials, and similar documents for redaction or access-control review.
   - Anticipate likely buyer pushback where redactions may impair diligence utility and propose partial redaction where appropriate.
7. Run a completeness pass for non-standard entities and priority items.
   - Check for non-domestic entities, cybersecurity insurance, shareholder consent rights, and other execution-sensitive materials that can be overlooked in generic checklists.
8. Resolve instruction conflicts explicitly.
   - If a supervising instruction conflicts with the requested room contents, state both positions, identify the affected document category, and route the issue to the client-facing decision-maker.

## 5. Vertical / structural / temporal relationships
- Organize the plan by workstream, then by document type, then by timing:
  - immediate triage items,
  - first-pass collection items,
  - legal-review items,
  - redaction/privilege review items,
  - pre-launch verification items.
- Where a document depends on another item being finalized first, preserve that dependency in the plan rather than listing the items as independent.
- If the source set contains multiple entity levels, keep parent, subsidiary, and operational documents distinct so coverage gaps are visible.
- When an item has a deadline tied to signing, launch, disclosure, or closing, anchor the collection date to that milestone instead of using an abstract urgency label.
- Make review sequencing explicit: gather first, verify second, redact third, upload last.

## 6. Output structure conventions
- Draft the deliverable as a working population plan with conventional business-legal headings, such as:
  - scope and assumptions,
  - document family inventory,
  - collection workstreams,
  - ownership and timing,
  - legal review and redaction gates,
  - exception log,
  - open issues and follow-up actions.
- Include a clear status legend using an ordinal severity scale for issues or exceptions, and apply it consistently across entries.
- For each issue or exception, state the affected document set, the reason it matters, the responsible role, and the practical consequence for the room or transaction.
- End with an explicit action list that assigns each follow-up in imperative form, names the responsible role, and ties it to a milestone or deadline.
- Keep the plan operational: prefer concrete collection steps, review assignments, and upload sequencing over abstract commentary.
- Do not present the plan as exhaustive if the source documents leave gaps; instead, flag the gaps and identify who must close them before launch.
- Before finishing, verify that the primary deliverable content exists as a complete, non-empty plan with operative collection instructions and issue tracking, not merely a summary of the assignment.
