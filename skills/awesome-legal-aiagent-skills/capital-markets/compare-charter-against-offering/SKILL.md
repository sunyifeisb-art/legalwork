---
name: compare-charter-against-offering
task_id: capital-markets/compare-charter-against-offering
description: Three-document cross-check where the baseline typically performs only pairwise comparisons and misses conflicts that surface only when all three documents are read together.
activates_for: [planner, solver, checker]
---

# Skill: Compare Charter Against Offering Documents — Deviation Report

## 2. Failure modes the skill is correcting

- The comparison stops at charter-vs-underwriting or charter-vs-prospectus and misses provisions that only conflict when all three documents are reconciled together.
- The analysis notes differences but does not state whether the difference is a true inconsistency, a drafting omission, or an acceptable disclosure gap.
- Silence in the charter is treated as neutral instead of being tested against the governing corporate statute and the representations used in the offering.
- Issues are described without a clear severity order, so closing blockers are not separated from cleanup items.
- The report identifies problems but does not specify the minimum corrective change, the responsible actor, and the transaction point by which the fix must land.
- Conclusions are stated without tying them to the governing corporate-law or securities-law authority that makes the inconsistency matter.

## 3. Legal frameworks / domain conventions that apply

- Read the charter, underwriting agreement, and preliminary prospectus as a single transactional set; each document may allocate risk differently, but core capitalization and governance terms must be internally consistent.
- Authorized capitalization must be sufficient for the securities to be issued at closing and for any option or over-allotment mechanics contemplated by the offering documents; a shortfall is typically a pre-closing amendment issue under the applicable corporate statute and the charter itself.
- Charter-based governance terms must match the offering disclosures on board structure, removal rights, written-consent restrictions, supermajority thresholds, blank-check powers, anti-takeover features, and related stockholder rights; where the charter is silent, apply the default rule under the governing corporate statute before deciding whether the disclosure is inconsistent.
- Securities-law disclosure must accurately describe the charter and the transaction mechanics; a mismatch may be a disclosure defect even if the charter itself is legally effective.
- Forum-selection, takeover, conversion, and lock-up mechanics are common pressure points; if the charter, underwriting agreement, and prospectus point in different directions, the inconsistency must be surfaced even if one document appears internally correct.
- Use the governing corporate statute, the charter text, and the securities-disclosure regime as the controlling authorities; do not state a legal conclusion without identifying the rule that supports it.

## 4. Analytical scaffolds

- Read all three documents fully before comparing any single clause.
- Build the analysis issue-by-issue, not document-by-document.
- For each issue, identify:
  - the charter provision,
  - the underwriting-agreement term,
  - the prospectus disclosure,
  - the governing default rule if the charter is silent,
  - the exact point of inconsistency or omission,
  - the practical consequence for closing, disclosure, or post-closing administration.
- If multiple classes, series, or offer mechanics are implicated, enumerate them first and then test each one separately rather than collapsing them into a single generic pass.
- Distinguish:
  - a true conflict,
  - a missing charter provision that makes the disclosure inaccurate,
  - a drafting ambiguity that can be harmonized,
  - and a pre-closing blocker that requires amendment or re-disclosure.
- For every issue, tie the analysis to the relevant source-scale or transaction context available in the documents, such as the class of security, the closing mechanic, the lock-up term, the governance feature, or the share-authority requirement.
- State the downstream effect on the company and the offering, including whether the issue affects closing, pricing, investor disclosure, or later litigation risk.
- When a fix is required, identify the minimum change needed and the party who should implement it.

## 5. Vertical / structural / temporal relationships

- Test the charter as the baseline authority, then check whether the underwriting agreement and prospectus are consistent with it; if the offering documents agree with each other but not with the charter, the charter controls corporate authority and the mismatch must be flagged.
- If the charter is amended or expected to be amended before closing, distinguish current-state inconsistency from future-state cured inconsistency.
- Treat pre-closing mechanics, closing mechanics, and post-closing rights as distinct time periods; a term that is acceptable after closing may still be defective if the prospectus describes it as existing at pricing or closing.
- Where the documents use different temporal anchors for the same mechanic, flag the mismatch even if the substantive term is similar.
- If the charter contains an opt-out, election, conversion trigger, or limitation that ripens only on a future event, verify that the prospectus and underwriting agreement describe the same trigger date and effective timing.

## 6. Output structure conventions

- Produce a deviation report organized by issue, not by document.
- Begin with a short severity legend using a uniform ordinal scale such as:
  - Critical: blocks closing or requires amendment before effectiveness
  - High: material inconsistency or disclosure defect needing pre-closing correction
  - Medium: important inconsistency that can be cured with conforming disclosure or targeted amendment
  - Low: minor mismatch or drafting cleanup
- For each issue, include:
  - Issue title
  - Severity
  - Charter position
  - Underwriting-agreement position
  - Prospectus position
  - Controlling rule or authority
  - Conflict / omission analysis
  - Transaction consequence
  - Required corrective action
- Make each issue entry self-contained and complete.
- State clearly whether the item is a closing blocker, a pre-closing disclosure correction, or a post-closing cleanup.
- Include a concise recommended-actions section at the end that assigns the fix to the relevant responsible party and ties it to the offering timeline.
- Keep the report neutral and transactional in tone; do not narrate the comparison process itself.
