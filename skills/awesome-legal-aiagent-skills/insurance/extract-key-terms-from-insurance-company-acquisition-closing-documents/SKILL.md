---
name: extract-key-terms-insurance-acquisition-closing-docs
task_id: insurance/extract-key-terms-from-insurance-company-acquisition-closing-documents
description: Agents extracting terms from acquisition closing documents should produce a structurally complete summary, verify cross-document consistency, check arithmetic in line items, surface operational risks embedded in transition services arrangements, and compile a post-closing obligation tracker.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Insurance Company Acquisition Closing Documents into Structured Term Sheet Summary

## 1. Subject-matter triage
- Treat the source set as a closing package, not a single agreement.
- Separate business economics, regulatory conditions, reinsurance notices, transition arrangements, and post-closing obligations before drafting.
- Identify every source document that governs a term; do not assume the main acquisition agreement is controlling on its own.
- Enumerate all counterparties, dates, and periods that matter to closing, because the same concept may be defined differently across documents.

## 2. Failure modes the skill is correcting
- Key economic terms are extracted from one document but not reconciled against the closing statement, approval materials, or side letters.
- Line-item math is accepted without verifying whether the stated total matches the components.
- A defined transaction-price term is used inconsistently across documents, creating ambiguity in downstream caps, adjustments, or thresholds.
- Regulatory conditions are summarized generally but not reduced to the specific restriction that must be tracked after closing.
- Reinsurance notice obligations are missed even though they can affect treaty continuity after change of control.
- Transition services dependencies are described without flagging vendor consent risk or the absence of a fallback plan.
- Restrictive covenant periods are captured without comparing them to any related consulting or service period.
- Escrow mechanics are extracted without a clear release or distribution timeline.
- Post-closing obligations are not converted into a usable tracker with owner, timing, and source reference.

## 3. Legal frameworks / domain conventions that apply
- Acquisition closing packages must be read as an integrated transaction record; conflicts between the agreement, schedules, approvals, and closing deliverables should be flagged rather than harmonized silently.
- Economic terms in insurance acquisitions often turn on defined terms, closing-date adjustments, and conditionally restricted amounts; if a term is defined differently across documents, the summary should preserve the inconsistency.
- Regulatory approval documents may impose closing or post-closing limitations that are more specific than the base transaction agreement; extract the operative restriction, not the general approval language.
- Reinsurance treaties commonly include change-of-control or notice provisions; the relevant question is whether notice must be given, to whom, and by when.
- Transition services arrangements should be read for operational continuity risk, including third-party consents, service dependencies, and fallback coverage.
- Restrictive covenants should be compared to any related consulting, employment, or service arrangement to detect an unbalanced restraint period.
- Escrow or holdback mechanics are not complete unless the release triggers and timing are captured.
- Post-closing trackers should reflect obligations that are time-bound, condition-based, or document-dependent, even if they arise in multiple instruments.

## 4. Analytical scaffolds
1. Build a source map.
   - List each document, its date, and its role in the transaction.
   - Note where each material term appears so cross-checking is possible.

2. Extract economic terms.
   - Pull purchase price, consideration structure, escrow, holdbacks, adjustments, bonuses, and any contingent payment mechanics.
   - Verify arithmetic for totals, components, and subtotals before carrying them into the summary.
   - If a figure appears in more than one place, reconcile the variations and preserve the discrepancy.

3. Check defined-term consistency.
   - Identify any defined transaction-price or closing-value term used for caps, adjustments, or triggers.
   - Compare the definition across the agreement, closing statement, and any ancillary schedule.
   - Flag inconsistent usage and explain the practical effect on exposure or payment mechanics.

4. Review regulatory conditions.
   - Extract any approval condition that limits dividends, distributions, business actions, or capital movements.
   - Distinguish the specific restriction from broader approval language.
   - If multiple approvals exist, treat each separately and note whether they operate cumulatively or independently.

5. Review reinsurance and insurance-regulatory items.
   - Identify change-of-control, notice, consent, or reporting obligations tied to insurance or reinsurance relationships.
   - Flag any notice item that appears immediate, time-sensitive, or prerequisite to continued treaty performance.
   - If the document set is silent on notice timing, note the omission as an action item rather than inferring a deadline.

6. Review transition services and operational continuity.
   - Extract service scope, duration, termination mechanics, dependencies, and any vendor or third-party consent condition.
   - Assess whether the TSA contains a fallback if a critical vendor with consent rights refuses or delays approval.
   - Separate operational risk from legal risk so the tracker can be used by business owners.

7. Compare restrictive covenants and related arrangements.
   - Compare any non-compete, non-solicit, or similar restriction against consulting, employment, or advisory term lengths.
   - Flag asymmetry where the restraint extends beyond the compensatory relationship.
   - Preserve the source language in substance, but do not quote verbatim.

8. Review reserves, adjustments, and policyholder mechanics.
   - If the package includes reserve collars, adjustment bands, or policyholder escrows, identify whether the mechanics are symmetrical and whether timing is fully specified.
   - Flag one-sided exposure or undefined distribution timing.

9. Build the post-closing tracker.
   - Convert each obligation into a row with obligation, trigger/date, owner, source document, and status.
   - Include regulatory filings, notices, bonus anniversaries, escrow releases, and any action tied to closing.
   - Use the tracker to highlight what must be monitored after signing and after closing.

10. Cross-check before finalizing.
   - Confirm every material extracted term has a source reference.
   - Confirm every issue is tied to the source documents, not to speculation.
   - Confirm each recommendation in the tracker points to a concrete follow-up.

## 5. Vertical / structural / temporal relationships
- Where multiple documents address the same concept, preserve the hierarchy and note whether one document amends, supplements, or merely restates another.
- Distinguish pre-closing, closing, and post-closing obligations explicitly.
- Track whether an obligation is triggered by signing, closing, regulatory approval, or a later anniversary date.
- When a term depends on another document’s definition, show the dependency so the reader can trace the chain.
- If a post-closing obligation is conditioned on an event, note both the condition and the deadline if available.

## 6. Output structure conventions
- Produce a structured term sheet summary in conventional transaction headings: overview, economics, regulatory, reinsurance, transition services, covenants, escrow/holdbacks, and post-closing obligations.
- Include an issues section that lists each inconsistency or risk separately, with a severity label on a uniform ordinal scale defined once at the top.
- For each issue, state the affected term, the cross-reference that creates the conflict or risk, and the consequence for the deal or post-closing operations.
- End with a post-closing tracker that is usable by operations or legal teams, with dates, owners, and source references.
- Include a concise recommendations section that converts each material issue into a concrete follow-up action, assigned to the responsible role and tied to the relevant milestone.
- Cross-reference each extracted term to its source document.
- Do not rely on formatting alone for completeness; the summary must remain intelligible if exported to plain text.
