---
name: hls-compare-payor-contract-benchmarks
task_id: healthcare-life-sciences/compare-payor-contract-terms-against-benchmarks
description: Analyzes multiple payor contracts against a benchmark report on a contract-by-contract basis to identify rate deviations, structural adverse terms, and acquisition-relevant provisions with quantified financial impact.
activates_for: [planner, solver, checker]
---

# Skill: Payor Contract Deviation Analysis Against Benchmarks

## 1. Subject-matter triage
- Treat the source set as a contract-by-contract benchmarking exercise, not a single portfolio-level comparison.
- Separate the universe into: payor contracts, benchmark report, and revenue data; confirm whether the benchmark applies uniformly or varies by service line, product, geography, or effective date.
- If only one contract is truly in scope, say so explicitly and explain why; otherwise enumerate each contract before analyzing it.
- If the engagement letter or source materials identify a valuation date, effective date, or closing timeline, use that as the organizing clock for all temporal analysis.

## 2. Failure modes the skill is correcting
- Analysis collapses all contracts into a general benchmark comparison rather than reviewing each agreement separately; contract-specific rate positioning and structural risk are lost.
- Rate deviations are identified without tying them to actual revenue exposure, so the memo reads as qualitative rather than diligence-grade.
- Operational terms that affect transaction timing are under-analyzed, including evergreen provisions, rolling notice requirements, and change-of-control consent mechanics.
- Cross-contract interactions are missed, especially where one contract’s rate posture or MFN language affects another contract’s permissible economics.
- Contract analysis stops at description and does not close each issue with scale, interaction, and consequence.
- The memo gives observations without ranking severity or ending with concrete next steps.

## 3. Legal frameworks / domain conventions that apply
- Most Favored Nation clauses: determine whether a payor-linked pricing promise depends on better terms granted elsewhere, and assess whether it creates cross-contract tension.
- Unilateral amendment rights: identify whether rates or material terms can be changed without provider consent, and assess the planning and valuation consequences.
- Timely filing windows: normalize claim submission deadlines to a consistent unit before comparing them to benchmark norms.
- Audit and extrapolation rights: distinguish ordinary claim review from broader recovery rights, and note whether extrapolation is limited or expansive.
- Evergreen and rolling notice provisions: identify renewal mechanics and required notice periods, then map them against deal timing and renegotiation windows.
- Business day vs. calendar day: normalize all response, notice, and payment periods before comparing them across agreements.
- Change-of-control consent: identify consent, notice, approval, or assignment restrictions that may affect acquisition execution.
- Termination and dispute mechanics: review for-cause, for-convenience, post-termination obligations, governing law, venue, and fee allocation because they affect exit leverage and integration planning.

## 4. Analytical scaffolds
1. Enumerate every payor contract in scope before analysis; assign each a separate review path and separate output row.
2. For each contract, compare every material reimbursement term against the benchmark report, normalize units and effective dates, and identify all rate deviations.
3. For each deviation, tie the benchmark difference to revenue data and state the financial exposure in annualized or period-specific terms using the source documents’ figures.
4. For each contract, identify structural adverse terms, including amendment rights, MFN features, panel restrictions, audit/extrapolation rights, timely filing limits, and renewal mechanics.
5. For each issue, close the analysis by: (i) scaling it to the relevant source-document figure; (ii) cross-referencing the interacting clause, schedule, or other agreement; and (iii) stating the practical consequence for diligence, pricing, closing, or integration.
6. Compare contracts against one another to identify relative rate positioning, possible MFN conflicts, and outlier provisions that create renegotiation leverage.
7. Analyze termination, notice, and consent provisions for each contract with a closing lens: what must be given, to whom, by when, and what happens if timing is missed.
8. Rank contracts by economic exposure and execution risk, and separate pure pricing issues from change-of-control or renewal blockers.

## 5. Vertical / structural / temporal relationships
- Benchmark analysis must be contract-specific, but MFN and relative rate positioning require cross-contract comparison.
- Evergreen terms, renewal windows, and rolling notice periods can compress the time available for diligence, renegotiation, or exit planning.
- Change-of-control restrictions interact with closing timing and should be mapped to the transaction schedule, not treated as an isolated consent issue.
- Normalization across business days, calendar days, and effective dates is necessary before drawing any comparison conclusions.

## 6. Output structure conventions
- Write a memorandum organized by payor, not by generic issue type.
- Begin with a short executive summary that identifies the highest-exposure contracts, the most material benchmark gaps, and the most urgent closing risks.
- Include a concise severity scale defined once at the top and apply it uniformly to each issue discussed.
- For each payor section, use a consistent sequence: benchmarked rate analysis, structural adverse terms, termination/renewal mechanics, dispute resolution, and renegotiation or diligence priority.
- Each issue entry should include the relevant contract reference, the benchmark comparator, the revenue or exposure basis, any interacting provision or other agreement, and the downstream consequence.
- Include a financial impact summary table that compares contracts side by side and highlights relative priority.
- End with a Recommended Actions section that gives imperative next steps, assigns them to the appropriate responsible role, and ties them to the diligence or closing timeline.
- Use the source documents’ terminology for legal standards and contract mechanics, and cite governing authorities when a proposition depends on a specific rule, statute, regulation, or recognized contract doctrine.
