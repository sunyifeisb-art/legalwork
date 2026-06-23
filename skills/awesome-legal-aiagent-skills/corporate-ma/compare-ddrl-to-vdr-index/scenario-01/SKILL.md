---
name: compare-ddrl-to-vdr-index-s01
task_id: corporate-ma/compare-ddrl-to-vdr-index/scenario-01
description: Guides DDRL-to-VDR gap analysis by requiring substantive assessment of each gap, distinguishing simple document omissions from underlying compliance concerns, structural defects, and stale materials that may require pre-closing follow-up.
activates_for: [planner, solver, checker]
---

# Skill: Compare DDRL to VDR Index

## 2. Failure modes the skill is correcting

- Listing missing DDRL items without assessing whether the absence is a mere upload gap, an indicator of non-compliance, or a structural defect that may require pre-closing remediation
- Treating all gaps as equivalent instead of prioritizing items that affect title, regulatory status, financing, tax elections, or closing deliverables
- Failing to tie each gap to the diligence question it blocks, the document set that should answer it, and the client consequence of the missing or stale material
- Omitting a concrete next step, responsible party, and timing anchor for follow-up
- Ignoring document currency and treating outdated materials as if they were current

## 3. Legal frameworks / domain conventions that apply

- Chain-of-title and assignment practice: missing invention, work-product, IP assignment, or similar title documents may indicate a substantive ownership defect rather than a simple data-room omission, especially where the asset was created by a founder, employee, or contractor whose ownership status is unclear
- Permits and regulatory compliance: where a material permit, license, consent, or renewal date is implicated, the absence of a renewal filing or updated approval may signal an underlying compliance problem, not merely an incomplete upload
- Tax structuring diligence: tax elections, entity classifications, and historical filings may determine whether a post-signing or closing election is available and whether the buyer can model the desired acquisition structure
- Financial and bank-record diligence: multi-period statements, reconciliations, and supporting schedules are used to detect unusual flows, related-party activity, and off-balance-sheet arrangements; incomplete coverage narrows the diligence window
- Currency-sensitive materials: financial statements, appraisals, environmental reports, insurance certificates, and similar materials should be checked for staleness against the analysis date and the transaction milestone
- Source-document authority: when the source set identifies a governing statute, regulation, contract requirement, or internal policy, cite that authority in the analysis rather than stating the proposition abstractly

## 4. Analytical scaffolds

- Define an ordinal severity scale once and apply it consistently to every gap, such as Critical / High / Medium / Low
- Review the full DDRL in order and map each request to the current VDR contents before drawing conclusions
- For each DDRL item, determine:
  - status: Fully Satisfied / Partially Satisfied / Not Provided / Deferred or Resisted
  - characterization: simple document gap, compliance concern, structural defect, or stale material
  - diligence consequence: what analysis is blocked, narrowed, or made unreliable
  - follow-up: the next document, confirmation, or remediation step needed
  - severity: ordinal priority based on closeness to closing, deal significance, and risk of hidden defect
- Where multiple periods, entities, counterparties, or versions are relevant, enumerate them explicitly before analyzing each one; do not collapse distinct items into a single generic pass
- Where a gap depends on a legal rule, state the controlling authority or governing document provision supporting the conclusion
- Where a document is outdated, identify the currency issue and request an updated version tied to the relevant milestone
- Where a gap may reflect a deeper defect, explain the likely defect and why pre-closing action may be required
- For each material issue, connect three points: the scale of the gap as shown by the source set, the related document or section that bears on it, and the downstream transaction consequence

## 5. Vertical / structural / temporal relationships

- Track the relationship between the DDRL request, any corresponding VDR document, and any cross-referenced exhibit, schedule, appendix, or later version
- Distinguish between a missing document, a partial response, and a document that exists but is incomplete, superseded, or stale
- Note whether the gap is cured elsewhere in the data room, duplicated in another folder, or contradicted by a later upload
- Flag time-sensitive requests where the relevant deadline, expiration, renewal date, or reporting period has already passed or is approaching
- If several documents address the same diligence theme, compare them for consistency rather than reviewing each in isolation

## 6. Output structure conventions

- Begin with a short executive summary that states the overall coverage picture, counts by status, and the most significant gaps
- Include a clear severity legend near the top and use it uniformly throughout
- Organize the body by DDRL category or logical diligence topic, covering every request in the order presented unless a different grouping is necessary for clarity
- For each entry, use a compact record format that includes:
  - DDRL item reference
  - requested material
  - VDR status
  - gap characterization
  - diligence consequence
  - related source or cross-reference
  - recommended follow-up
  - severity
- Surface stale documents separately from missing documents when currency affects the diligence conclusion
- End with an explicit Recommended Actions block listing the next steps, responsible role, and timing anchor for each material follow-up
- Keep the memo transaction-focused; avoid narrative padding and do not recite the DDRL or VDR index verbatim without analysis
