---
name: extract-pricing-data-from-document-production
task_id: antitrust-competition/extract-pricing-data-from-document-production
description: Supports extraction of complete pricing structures, temporal gap analysis between competitor contacts and later pricing changes, cost-justification assessment, and flagging of deletion or non-reply instructions.
activates_for: [planner, solver, checker]
---

# Skill: Antitrust Pricing Analysis from Document Production

## 1. Subject-matter triage

- Treat the production as an extraction-and-analysis task, not a general document summary.
- Build the memo from the full record of pricing, competitor contact, and related internal communications.
- If multiple pricing events, counterparties, meeting dates, or cost movements appear, enumerate them first and analyze each separately rather than collapsing them into a single representative example.
- If the record contains only one instance of a category, say so affirmatively and explain why no broader series exists on the documents reviewed.

## 2. Failure modes the skill is correcting

- Baseline extracts only the primary discount tiers and misses additional tiers where lower-volume customers sit; the complete pricing structure requires enumerating all discount and rebate tiers, including those applicable to smaller accounts.
- Baseline does not assess whether a cost-justification defense is available; if a price increase appears to exceed the underlying cost increase, the excess cannot be cost-justified, so the analysis must compare the price movement to the cost movement.
- Baseline does not flag deletion, non-retention, or “do not reply” instructions that immediately follow competitor communications as standalone evidence of consciousness of guilt.
- Baseline compresses separate pricing mechanisms into one narrative; tier discounts, volume rebates, special programs, and ad hoc adjustments must be kept distinct.
- Baseline reports contact events without temporal sequencing; the memo must show the communication-to-price-change pattern clearly enough to support inference work.
- Baseline describes issues without consequences; each flagged item should identify why it matters for antitrust exposure, investigation posture, or litigation risk.

## 3. Legal frameworks / domain conventions that apply

- Temporal-gap analysis is central: document the elapsed time between a competitor contact and a later price change, because a short interval can be probative even absent direct agreement evidence.
- Cost-justification analysis asks whether the increase in selling price can be explained by the increase in underlying costs; any spread beyond the cost movement is analytically relevant.
- Consciousness-of-guilt evidence includes instructions to delete, stop writing, avoid reply, or not retain messages after competitor contact; those instructions should be flagged as independent issues rather than buried in chronology.
- Competitive-contact context matters: pricing-adjacent discussions at trade association or industry meetings may serve as circumstantial coordination evidence when they precede later pricing moves.
- Investigation references, subpoena numbers, or similar government identifiers should be preserved because they anchor the context and may tie the document to enforcement activity.
- Antitrust analysis should stay close to the documents: distinguish direct evidence of contact from inference based on timing, topic, and follow-on pricing behavior.

## 4. Analytical scaffolds

1. **Extract the complete pricing architecture.** Capture every discount tier, rebate schedule, volume threshold, exception, and special pricing mechanism; keep tiered discounts separate from annual or cumulative rebates.
2. **Build a pricing chronology.** List each pricing change with its effective date, affected product or customer segment, and any stated rationale.
3. **Build a competitor-communication chronology.** For each contact, record date, participants, medium, and subject matter as reflected in the documents.
4. **Run temporal-gap analysis.** For each competitor contact, identify later pricing changes and calculate the elapsed time between the communication and the effective price change.
5. **Assess cost justification.** Compare the price movement to the relevant cost movement using the figures reflected in the source documents; identify any unexplained spread that may not be cost-supported.
6. **Flag consciousness-of-guilt language.** Isolate deletion, non-reply, non-retention, or similar instructions that appear after competitor contact, and treat each as a separate flagged issue.
7. **Trace meeting-based circumstantial evidence.** Identify trade association or industry meetings that discuss pricing-adjacent topics and precede later pricing changes; record the topic and the subsequent action.
8. **Preserve enforcement context.** Note any government inquiry, subpoena, or investigation reference and the document context in which it appears.

## 5. Vertical / structural / temporal relationships

- Present pricing changes in time order so the reader can see before/after movement and any clustering around contacts or meetings.
- Link each competitor contact to the first subsequent pricing change, and then note any later changes that follow the same contact.
- Where a document shows both a contact and an instruction to avoid retention or response, treat the instruction as temporally and analytically downstream of the contact.
- Distinguish between contemporaneous explanations and later rationalizations; if the documents conflict, flag the mismatch.
- If the record includes multiple customer segments or product lines, keep the timeline segmented enough to avoid mixing distinct pricing paths.

## 6. Output structure conventions

- Use a memo format with clear headings, not a bullet dump.
- Start with a concise executive summary of the pricing pattern, contact pattern, and highest-priority flags.
- Include a complete pricing-structure section with tables for tiers, rebates, exceptions, and any other extracted mechanisms.
- Include a competitor-communications chronology followed by a temporal-gap analysis table.
- Include a cost-justification assessment section that compares price movement, cost movement, and any remaining unexplained spread.
- Include a separate flagged-issues section for deletion, non-reply, non-retention, and similar consciousness-of-guilt indicators.
- Include a trade-association or meeting analysis section when the record contains industry meetings touching pricing-adjacent topics.
- Include a government-investigation context section if any subpoena, inquiry, or investigation reference appears in the documents.
- End with a practical recommendations section identifying the next investigative or review steps, the responsible business or legal function, and the urgency tied to the pricing or enforcement timeline.
- Use the language of the source documents for dates, amounts, and document identifiers, but do not invent missing figures or backfill arithmetic not shown by the records.
- Cite the controlling antitrust concepts by name in the prose where they support an inference, but avoid overclaiming beyond what the documents establish.
---
