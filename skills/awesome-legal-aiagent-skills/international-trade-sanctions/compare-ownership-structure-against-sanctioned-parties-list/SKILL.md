---
name: its-compare-ownership-structure-sanctions
task_id: international-trade-sanctions/compare-ownership-structure-against-sanctioned-parties-list
description: Produces a sanctions compliance assessment memo that traces multi-tier ownership chains to identify sanctions-linked parties at any tier, applies the applicable ownership-aggregation rule across layered and joint-venture structures, and separately assesses any co-ownership, control, or transactional-prohibition issues under the relevant sanctions regimes.
activates_for: [planner, solver, checker]
---

# Skill: Compare AML Ownership Structure Against Sanctioned Parties Lists

## 1. Subject-matter triage (only if applicable)

- Treat the corporate ownership chart as the baseline, then test it against the sanctioned parties lists, personnel roster, JV materials, and operations records.
- Screen every entity and person that appears in the source set; if the materials span multiple entities, owners, JV participants, vessels, or operating sites, analyze each one separately rather than using a single representative pass.
- If a source set contains both ownership data and operations data, assess sanctions exposure on both tracks: ownership/control and operational nexus.

## 2. Failure modes the skill is correcting

- Stopping the ownership trace at the first corporate layer rather than following every intermediate vehicle to the ultimate beneficial owner.
- Treating direct ownership as dispositive while ignoring indirect interests through layered or joint-venture structures.
- Failing to aggregate multiple sanctions-linked interests that reach the same target entity through different paths.
- Missing co-ownership, control, or transactional-prohibition issues that can arise even when a formal ownership threshold is not met.
- Treating listed-party involvement as purely economic rather than separately assessing control, restriction, and screening consequences.
- Overlooking personnel, nationality, board, management, or operational facts that may create sanctions exposure apart from equity ownership.
- Ignoring vessel, port-call, or operating-location facts that may create a separate sanctions nexus.
- Relying on a screening snapshot without checking whether the list version, entity names, or ownership records were current at the time of review.

## 3. Legal frameworks / domain conventions that apply

- Multi-tier indirect ownership analysis: compute attributable ownership through each tier by multiplying percentages down the chain, then aggregate all paths that reach the same target entity.
- Layered and joint-venture aggregation: where more than one sanctions-linked party holds an interest through separate paths, sum the attributable interests before testing the applicable threshold or restriction rule.
- Listed-party co-ownership and transactional restrictions: some regimes restrict dealings with entities owned or controlled by sanctioned persons even where the formal threshold is not met, so co-ownership must be evaluated independently from pure percentage tests.
- Control below a formal threshold: management authority, board seats, veto rights, operational direction, or similar indicia can require escalation even when equity ownership is below the core ownership threshold.
- Regime-specific ownership and control rules: apply the relevant sanctions-list rule set for each listed person, jurisdiction, or restriction category rather than assuming a single global standard.
- Operational nexus review: vessel port calls, sanctioned-country operations, or comparable facts can create program-specific exposure for operators, charterers, or counterparties independent of equity ownership.
- Screening governance: use the list version, naming convention, and date context reflected in the source materials; if the materials are incomplete or inconsistent, flag the gap rather than smoothing it over.
- Controlling authority: cite the specific sanctions program, statute, regulation, executive order, or policy provision supporting each legal conclusion; do not state a conclusion without naming the rule.

## 4. Analytical scaffolds

1. Build a complete inventory of entities, individuals, JV participants, vessels, and operating locations appearing in the source set.
2. For each entity under review, trace ownership upward through every intermediate holder to the ultimate beneficial owners.
3. For each chain involving a potentially sanctions-linked party, calculate attributable ownership at each tier and aggregate all paths that reach the same target.
4. Separate direct ownership analysis from control analysis; test board, management, veto, operational, and veto-right facts even where the percentage threshold is not reached.
5. Compare each owner, controller, director, officer, employee, JV participant, and operating counterpart against the sanctioned parties lists and the policy criteria in the source set.
6. Where joint ventures or layered holdings exist, evaluate the combined attributable interests of all sanctions-linked persons and compare the result against the relevant rule.
7. Review operations facts for sanctioned-country or restricted-location activity, port calls, or other program-specific nexus indicators.
8. Identify any screening gaps, stale list issues, name-matching ambiguities, or missing source documents that limit confidence in the result.
9. For each issue, tie the fact pattern to the controlling rule, explain the consequence for the client, and state whether escalation, remediation, or abstention is required.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Ownership is vertical: parent-to-subsidiary and intermediary-to-intermediary relationships matter because attribution flows through the chain.
- Joint ventures are horizontal aggregation points: separate interests from different sanctions-linked parties must be combined before the threshold or restriction test is applied.
- Personnel facts run in parallel to equity facts: a person may create exposure through role or influence even if the person does not own equity.
- Operations facts are temporally sensitive: port calls, shipping activity, and other location-based events must be reviewed in their time context against the applicable sanctions status at that time.
- If the record shows a change in ownership, control, list status, or operations over time, analyze the relevant periods separately rather than collapsing them.

## 6. Output structure conventions

- Produce a compliance assessment memo in conventional memorandum form with a brief executive summary, method, findings, and recommendations.
- Define one ordinal severity scale at the outset and use it consistently for each finding.
- For each identified issue, include: the ownership or facts chain, the sanctions link, the controlling authority or policy basis, the consequence for the client, and the assigned severity.
- Where multiple entities, people, or vessels are in scope, present them in a numbered list or table before analysis and then address each one in its own row or subsection.
- Include a concise aggregation table for any layered or JV structure showing the relevant paths, attributable interests, and combined result.
- Include a separate section for control and operational-nexus findings where those issues exist.
- End with a Recommended Actions section that states the action, the responsible role, and the timing anchor tied to the source record or the review milestone.
- If no issue is found for a given entity or person, say so expressly and note the basis for the negative conclusion.
