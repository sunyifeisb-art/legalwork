---
name: identify-issues-in-title-commitment
task_id: real-estate/identify-issues-in-title-commitment
description: Guides identification and severity-ranked analysis of title commitment issues for a land acquisition by comparing the title commitment against the survey, purchase agreement requirements, lender requirements, and trust documentation, with curative recommendations for each material issue.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Title Commitment — Issue Memorandum for Land Acquisition

## 1. Subject-matter triage
- Treat the title commitment, survey, purchase agreement excerpts, lender requirements, and trust documents as a single diligence set.
- Start by confirming whether the seller’s chain of authority and the target estate are sufficient to close; if trust authority is unresolved, treat that as threshold risk before lower-order exception review.
- If multiple parcels, tracts, title commitments, or trust instruments are in scope, enumerate them first and analyze each separately rather than collapsing them into one pass.
- The memorandum should be issue-focused, not a recitation of all title pages.

## 2. Failure modes the skill is correcting
- The review lists title exceptions descriptively but does not explain whether each item is permitted, curable, lender-problematic, or project-blocking.
- The review reads the commitment in isolation and misses mismatches among the legal description, acreage, easements, and survey depiction.
- The review ignores trust authority questions, including whether the trustee may convey, whether the trust has terminated, and whether beneficiary consent is required.
- The review satisfies the purchase agreement standard but omits independent lender conditions that can still prevent funding.
- The review identifies issues but stops at diagnosis, without a practical cure path, owner, and timing anchor.
- The review fails to tie each issue to the transaction’s closing consequence, leaving the memo non-actionable.

## 3. Legal frameworks / domain conventions that apply
- Title commitment structure: Schedule A states the insured estate, proposed insured parties, and legal description; Schedule B-I lists pre-issuance requirements; Schedule B-II lists exceptions from coverage, each of which must be evaluated on its own terms.
- Purchase agreement title standard: compare the commitment against the seller’s promised title condition and permitted-exception regime, including any buyer-consent mechanism for new exceptions.
- Lender title package: assess title requirements, endorsements, survey certifications, and exception removals independently of the purchase agreement because lender conditions may be stricter.
- Survey-title consistency: the survey should align with the commitment on legal description, acreage, access, setback-relevant boundaries, and plotted encumbrances; discrepancies are diligence issues even if not yet deal-breakers.
- Trust authority: review the trust instrument and any related certificates or consents for trustee power to convey, expiration or termination concerns, and beneficiary-consent requirements; treat unresolved authority as a conveyancing defect.
- Energy-project sensitivity: for solar or similar development land, assess whether title burdens interfere with use, access, setbacks, height-related restrictions, conservation limitations, or other project-specific siting needs.

## 4. Analytical scaffolds
- Read Schedule A first to confirm the insured estate, proposed insureds, and legal description match the deal documents.
- Read Schedule B-I next and assign each requirement to the party responsible for satisfying it before closing.
- Read Schedule B-II line by line and classify each exception as:
  - permitted under the purchase agreement,
  - removable or endorsable to satisfy lender requirements,
  - curable by seller or trustee action,
  - or requiring buyer follow-up / further factual review.
- Cross-check every exception against the survey and flag any easement, restriction, boundary issue, or access issue that appears in one document but not the other.
- Review the trust materials for authority, term, and consent mechanics before treating title as deliverable.
- For each issue, include:
  - the source and commitment reference,
  - a concise description,
  - the governing standard or document hook,
  - why it matters to closing or project use,
  - a severity classification,
  - and a concrete curative recommendation.
- Use an ordinal severity scale defined once at the top of the memorandum and apply it uniformly across all issues.
- Support each legal proposition with the controlling authority named in the source materials or the applicable title / trust convention that supports the conclusion.
- For each issue, close the analysis by tying together scale or scope, the interacting document(s), and the downstream consequence to the client.

## 5. Vertical / structural / temporal relationships
- Treat seller authority to convey as logically upstream from Schedule B analysis; if authority is unclear, downstream title cures may be irrelevant until the trust issue is fixed.
- Treat survey certification, if required, as a gating closing condition rather than a clerical detail.
- Treat lender conditions as additive to, not replaced by, the purchase agreement standard; where they diverge, the stricter requirement governs the closing path.
- Order issues from highest severity to lowest, but preserve category coherence within each severity tier.
- For curative items, note who must act and when the action must occur relative to closing or lender funding.

## 6. Output structure conventions
- Deliver a title issue memorandum organized by severity tiers using an ordinal scale such as Blocking / Material / Informational, defined in the memo itself.
- Open with a short executive summary identifying the critical-path items and any closing blockers.
- For each issue entry, include:
  - severity,
  - document and schedule reference,
  - issue statement,
  - interaction with other documents,
  - project or financing consequence,
  - curative recommendation,
  - responsible party,
  - and timing anchor.
- Keep the analysis concise but complete; do not bury a blocking issue inside narrative text.
- End with a Recommended Actions section listing imperative next steps by responsible role and timing.
- Use conventional issue-memo headings rather than copying any checker-specific rubric headings.
- The required file name is `title-issue-memorandum.docx`.
