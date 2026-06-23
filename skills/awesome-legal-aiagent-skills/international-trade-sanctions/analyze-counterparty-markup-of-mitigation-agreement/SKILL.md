---
name: its-analyze-cfius-nsa-markup
task_id: international-trade-sanctions/analyze-counterparty-markup-of-mitigation-agreement
description: Produces a risk-prioritized analysis of a national security agreement markup that identifies compounding effects across grouped changes, distinguishes categorically non-negotiable provisions from negotiable deviations, and evaluates cover-letter characterizations against the actual redline.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of CFIUS National Security Agreement

## 1. Subject-matter triage
- Read the draft NSA, the counterparty markup, the cover letter, and the supporting materials before issuing conclusions.
- Identify whether the markup affects a single oversight mechanism or multiple linked mechanisms; if the latter, treat the affected provisions as a cluster and analyze them together.
- Separate provisions that are likely outside acceptable mitigation practice from provisions that are commercially negotiable.
- Confirm whether the materials describe controlled items, covered facilities, ownership/control mechanics, audit rights, reporting lines, and technology-control timing with enough specificity to support the analysis.
- If only one facility, one proxy arrangement, or one reporting chain is in scope, say so expressly and anchor the analysis to that single item; do not imply a broader set of facts.

## 2. Failure modes the skill is correcting
- Treating each redline in isolation instead of assessing how grouped edits weaken a single oversight system.
- Missing timing edits, threshold edits, escalation edits, or routing edits that create a compliance gap even if each edit appears small alone.
- Failing to distinguish baseline mitigation terms that are effectively non-negotiable from terms that can be redrafted.
- Accepting a cover letter’s description of changes as “administrative,” “minor,” or similar without checking the actual markup.
- Overlooking changes to audit independence, management routing, observer confidentiality, proxy-holder eligibility, or technology-control effectiveness dates.
- Losing the linkage between facility descriptions and controlled-item analysis, including co-location or scope issues.

## 3. Legal frameworks / domain conventions that apply
- CFIUS mitigation agreements operate as integrated oversight structures; provisions on notice, reporting, audit, access, escalation, and remediation should be read together, not as standalone edits.
- Independent compliance monitoring requires the reporting channel to reach the monitoring authority or designated recipient directly, not through ordinary company management, where that routing could dilute independence.
- Where a proxy or similar control device is used, appointment eligibility must match the governing mitigation structure and the actual control facts; broadened eligibility should be treated as a legal-risk issue.
- If a technology control plan or similar safeguard is required by closing or another defined milestone, any delay in effectiveness can create an uncured gap period.
- Board-observer and privilege provisions should be checked for confidentiality leakage, waiver risk, or overbroad management access.
- Facility and controlled-item descriptions matter because they determine whether the site is a covered facility and whether the mitigation scope tracks the actual risk profile.
- Counterparty cover letters are advocacy, not authority; their characterizations must be tested against the redline and supporting materials.

## 4. Analytical scaffolds
1. Build a provision map before writing the memo: identify every clause touching notice, audit, access, reporting, escalation, remediation, confidentiality, governance, proxy mechanics, technology controls, and facility scope.
2. Group related edits into issue clusters and analyze each cluster for combined operational effect, not just textual change.
3. For each issue, state the affected mechanism, the precise markup change, the governing baseline expectation, and the practical consequence if accepted.
4. Classify each issue by negotiability: non-negotiable baseline departure, high-risk deviation needing material revision, or commercially negotiable drafting issue.
5. Test whether the markup creates timing gaps, delayed triggers, weaker thresholds, reduced reporting frequency, longer cure periods, or indirect routing of oversight information.
6. Compare any proxy-holder or similar control-appointment changes against the source materials’ control structure and the relevant mitigation practice.
7. Review board-observer and privilege language for disclosure path, access scope, and whether it permits management to interpose itself between the monitor and the information source.
8. Compare the cover letter’s description of each change with the actual markup and flag any understatement, omission, or mismatch.
9. Use the supporting materials to verify whether the facility description contains the controlled-item detail needed for covered-facility analysis and whether co-location increases risk.
10. For every recommendation, give a concrete counter-draft direction or rejection position tied to the issue’s negotiability.

## 5. Vertical / structural / temporal relationships
- The facility summary supplies the controlled-item facts that anchor covered-facility analysis; if those facts are incomplete, the facility scope analysis is correspondingly weaker.
- Comparative materials help distinguish ordinary drafting variation from deviations that undermine the mitigation structure.
- Timing relationships matter: closing, effectiveness, cure windows, reporting deadlines, audit intervals, escalation triggers, and remediation milestones should be checked as a chain, because one delayed step can undercut the next.
- Structural relationships matter: audit, reporting, escalation, and management-access provisions should be evaluated as a system of oversight rather than separate clauses.

## 6. Output structure conventions
- Produce a risk-prioritized memorandum organized by issue cluster, with an explicit ordinal severity label for each issue using a uniform scale stated once at the outset.
- For each issue, include: the original provision, the markup change, the legal/operational impact, any compounding effect with related clauses, and the recommended response.
- Close each issue with the scale or magnitude of the issue as reflected in the source materials, the clause or document it interacts with, and the downstream consequence for the client.
- Distinguish clearly between rejection candidates and terms that can be counter-drafted.
- Include a separate cover-letter review section that cross-references each stated characterization to the actual redline.
- End with a Recommended Actions block that assigns each action to an appropriate role and ties it to a transaction or regulatory timing anchor.
- Where a change is negotiable, provide concise counter-draft language that preserves the oversight function; where it is not, recommend rejection rather than redrafting.
- When citing legal propositions, identify the controlling authority, regulation, or recognized mitigation practice supporting the proposition; do not state a conclusion without the supporting rule or practice basis.
