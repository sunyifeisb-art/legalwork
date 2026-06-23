---
name: its-extract-ownership-structure-sanctions
task_id: international-trade-sanctions/extract-ownership-structure-from-corporate-records
description: Produces an ownership report that traces beneficial ownership through multi-tier corporate and trust structures, aggregates sanctions-attributable ownership across all paths, and flags structural inconsistencies and post-designation non-divestiture as risk factors.
activates_for: [planner, solver, checker]
---

# Skill: Extract Ownership Structure from Corporate Records for Sanctions Compliance

## 1. Subject-matter triage

- Identify every entity, trust, individual, and intermediary that appears in the source set, then classify each as owner, issuer, trustee, beneficiary, nominee, or blocked/designated party.
- Treat the task as an ownership-tracing exercise first and a sanctions-risk conclusion second; do not jump to a threshold conclusion before the chain is fully mapped.
- If the source set contains multiple ownership snapshots, signature dates, registry extracts, or post-designation records, analyze them in chronological order and reconcile any changes before concluding.

## 2. Failure modes the skill is correcting

- Tracing only direct holdings and missing indirect ownership through layered holding vehicles, nominee arrangements, or trust structures.
- Calculating an indirect chain correctly at one tier but failing to carry the result forward through the full chain to the target entity.
- Treating a blocked or designated holder as if only its proportional upstream interest counts, instead of attributing the full stake it holds in the target for aggregation purposes.
- Failing to sum all sanctions-attributable paths across direct, indirect, and blocked-entity routes before applying the blocking threshold.
- Missing ownership changes across dates, especially where the record suggests continued holding after designation or other sanctions-triggering events.
- Overstating confidence where the trust deed, registry extract, or organizational chart contains inconsistencies that should be flagged as ambiguity rather than resolved by assumption.
- Concluding on blocking status without naming the governing sanctions rule that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply

- Apply the applicable sanctions ownership rule, including the OFAC 50 Percent Rule where relevant, by aggregating ownership interests held directly or indirectly by blocked, designated, or otherwise attributable persons.
- For a trust chain, multiply each upstream beneficial interest by the downstream ownership interest at each tier to calculate sanctions-attributable ownership in the target entity.
- For layered corporate ownership, trace through each intermediate entity and preserve the arithmetic at every hop; do not compress the chain into a narrative summary without the intermediate percentages.
- Where a blocked entity owns an interest in the target, treat that stake as sanctions-attributable under the applicable aggregation rule, subject to the governing framework in the source set.
- Use the controlling authority identified in the record when cited there; otherwise, state the governing rule by name and section or part from the applicable sanctions regime.
- Treat post-designation retention of an ownership stake as an ongoing compliance risk and an aggravating fact in the overall assessment.
- Treat inconsistent governing-law and trustee-location signals in a trust deed as a structural red flag that may indicate opacity, uncertainty, or documentation risk.

## 4. Analytical scaffolds

1. Enumerate each ownership path from the target entity up to the ultimate beneficial owner or blocked party.
2. For each path, identify the ownership percentage at every tier and carry the product through the chain.
3. Separate direct ownership from indirect ownership and from ownership attributable through blocked or designated holders.
4. Aggregate all sanctions-attributable interests across all paths to reach a single total attributable figure for the target.
5. Compare the total attributable figure against the applicable blocking threshold under the governing sanctions rule.
6. Reconcile conflicting records by source quality and date, favoring the most recent authoritative corporate record unless a later document is facially unreliable.
7. Review trust documents for governing-law clauses, trustee location, beneficiary rights, and any structural inconsistency that could affect interpretation.
8. Check whether any designated or blocked person remained invested after designation, and treat non-divestiture as an ongoing risk factor.
9. Screen the structure against any additional sanctions indicators appearing in the source set, but keep the primary conclusion tied to the governing ownership rule.

## 5. Vertical / structural / temporal relationships

- Corporate registry extracts, annual returns, cap tables, and shareholder registers establish vertical ownership links at each entity tier.
- Trust deeds establish the relationship among settlor, trustee, beneficiary, and any retained interest that may be relevant to attribution.
- Organizational charts help identify missing intermediaries, but they do not substitute for record-based ownership percentages.
- Timing matters: compare pre-designation and post-designation documents to determine whether ownership changed, was divested, or remained in place.
- If a source document contains conflicting jurisdictional cues, treat the conflict as a documented ambiguity rather than resolving it by assumption.

## 6. Output structure conventions

- Write an ownership-and-sanctions report in a conventional compliance memo shape: executive conclusion, ownership map, calculation table, risk flags, and final determination.
- Use a visual chain or indented tree for each ownership path, then pair it with a calculation table showing the tier-by-tier arithmetic and the aggregated total.
- State the governing rule invoked for each legal conclusion, including the sanctions ownership rule and any other rule or authority needed for the risk flags.
- For each issue or risk flag, give: the scale or magnitude implicated, the related document or clause that interacts with it, and the downstream compliance consequence.
- If multiple entities or periods are in scope, analyze each separately and label them clearly rather than combining them into a single blended assessment.
- Include a short recommendations section directing the next compliance steps, with the responsible function and an urgency anchor tied to the transaction or screening process.
- Before finalizing, verify that the report names every primary ownership path considered and that the conclusion follows from the documented aggregation, not from an unsupported assumption.
