---
name: identify-industrial-portfolio-acquisition
task_id: real-estate/identify-industrial-portfolio-acquisition
description: Guides property-by-property title commitment issue identification for a multi-property real-estate acquisition by comparing each title commitment against the transaction documents, survey materials, and financing requirements, and producing a prioritized issues memo.
activates_for: [planner, solver, checker]
---

# Skill: Title Commitment Issue Identification for Industrial Portfolio Acquisition

## 1. Subject-matter triage

This task is a comparative diligence exercise across multiple parcels. First map each title commitment to the correct property, then confirm the commitment is being tested against the right purchase document, survey summary, and lender package. If the portfolio includes more than one parcel, enumerate each parcel up front and analyze each one separately before preparing any roll-up.

Treat the lender title requirements as controlling for closing deliverables when they are more demanding than the PSA. Compare the current commitment date, schedule of exceptions, and requirements section against the expected closing timing so you can flag issues that may change on bring-down.

## 2. Failure modes the skill is correcting

- Reviews each title commitment in isolation and misses that the PSA, survey summary, and lender requirements impose different standards.
- Collapses all parcels into a single summary and fails to identify which issue belongs to which property.
- Describes exceptions generically instead of classifying whether they are already permitted, must be cured, or can be handled by endorsement or other title accommodation.
- Omits the practical consequence of an exception, leaving the client unable to tell what blocks closing, what delays closing, and what is merely informational.
- Fails to tie each issue to the specific commitment section, related document, and responsible party.
- Produces a narrative memo without a prioritized structure, making it hard to separate blocking items from curative items and note items.
- Misses discrepancies between the survey summary and the commitment, including encroachments, access matters, or easements that appear in only one source.
- Treats financing requirements as advisory even when they are stricter than the PSA.

## 3. Legal frameworks / domain conventions that apply

- Title commitment structure: identify the estate insured, proposed insureds, requirements to be satisfied before issuance, and exceptions from coverage.
- Contractual title standard: the PSA typically defines acceptable title, permitted exceptions, and deliverables at closing; exceptions outside that definition must be cured or specifically approved.
- Lender title standard: financing conditions may require endorsements, priority, access, zoning, survey, or other protections beyond the PSA.
- Survey/title reconciliation: a diligence review should compare the survey summary against the commitment to identify matters shown on one but not the other.
- Curative mechanics: common responses include release, payoff, subordination, endorsement, reformation, affidavit, or updated documentation from the title company or record owner.
- Priority analysis: liens, judgments, tax matters, mechanics’ liens, and similar encumbrances are assessed for whether they must be removed before closing or are acceptable by arrangement.
- Closing timing: bring-down updates can introduce new exceptions, so the memorandum should distinguish current issues from update-risk issues.
- Practical title conventions: easements, access, use restrictions, CC&Rs, encroachments, and survey-related exceptions should be evaluated in light of the intended industrial use and financing requirements.

## 4. Analytical scaffolds

- For each property, confirm the commitment matches the parcel description, vesting, and insured parties in the transaction documents.
- For each property, read the requirements section line by line and identify any unmet requirement, who must satisfy it, and whether it is a closing condition.
- For each property, review the exceptions section and classify each item as:
  - acceptable under the PSA,
  - must be cured before closing,
  - requires a lender endorsement or other accommodation,
  - informational only.
- Cross-check each commitment against the survey summary to identify:
  - a survey item not reflected in the commitment,
  - a commitment exception not shown in the survey,
  - a mismatch in location, scope, or access.
- Compare each property against lender requirements and elevate any item that is sufficient under the PSA but insufficient for financing.
- For each issue, state:
  - the property,
  - the commitment section reference,
  - the related PSA/survey/lender provision,
  - the issue classification,
  - the consequence for closing or financing,
  - the curative step and responsible party,
  - the timing anchor tied to closing or title update.
- Use a uniform ordinal severity scale at the top of the memo and apply it consistently:
  - Critical
  - High
  - Medium
  - Low
  Define the scale once, then use it throughout.
- Tie each issue to its downstream effect: inability to insure, failure to satisfy lender conditions, need for revised closing deliverables, or need for curative work before funding.
- If a matter affects more than one parcel, treat it as a portfolio-level issue and also note the parcel-specific impact.

## 5. Vertical / structural / temporal relationships

- Analyze property by property first; then prepare a portfolio-level roll-up that highlights cross-cutting issues.
- If a bring-down or updated commitment is expected, separate present exceptions from risks that may appear in the update.
- Where the lender standard is stricter than the PSA, follow the lender standard for closing-readiness purposes.
- If a title exception is acceptable only with an endorsement, make clear whether the endorsement is typically issued, whether it is required for closing, and whether any survey condition must first be satisfied.
- If a requirement cannot be cured immediately, identify whether a temporary workaround exists or whether the item is a hard stop.

## 6. Output structure conventions

- Produce a prioritized issues memorandum, not a simple issue dump.
- Open with a short portfolio summary that identifies the number of properties reviewed, the overall risk profile, and the highest-priority blockers.
- Use clear parcel headings, then under each parcel organize issues by severity from highest to lowest.
- For each issue entry, include:
  - property identifier,
  - severity,
  - commitment section reference,
  - issue description,
  - related PSA/survey/lender reference,
  - why it matters,
  - required action,
  - responsible party,
  - timing anchor.
- Include a distinct section for issues affecting multiple properties or the portfolio as a whole.
- End with a concise Recommended Actions section that uses imperative verbs and ties each action to the relevant party and transaction milestone.
- Keep the deliverable filename exactly as instructed: `title-issues-memorandum.docx`.
