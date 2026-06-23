---
name: analyze-mfn-waterfall-analysis
task_id: funds-asset-management/analyze-mfn-waterfall-analysis
description: Review a fund's governing fund documents, a set of individual LP side letters, a GP policy memo, a tracking spreadsheet, and a capital commitment schedule at closing to produce a comprehensive MFN waterfall analysis and recommendation memorandum with LP-by-LP eligibility determinations, economic comparisons, cascade analysis, and pre-notice amendment recommendations.
activates_for: [planner, solver, checker]
---

# Skill: MFN Waterfall Analysis — Comprehensive Final-Closing Memo

## 1. Subject-matter triage
- Treat the fund agreement, side letters, policy memo, tracking spreadsheet, and capital commitment schedule as a layered record: the fund documents set the baseline, each side letter can alter only the relevant LP’s rights, and the closing schedule determines who can compare against whom.
- If the task includes multiple LPs, closings, or election tiers, enumerate them first and analyze each one separately before comparing outcomes.
- Do not rely on the spreadsheet’s labels as dispositive; use it as a guide, then confirm each point from the governing text.

## 2. Failure modes the skill is correcting
- Relying on a tracking spreadsheet’s categorizations rather than independently determining each LP’s MFN eligibility from the side letter text.
- Missing that a later-closing LP can become the benchmark for earlier-closing LPs when it negotiates more favorable economics.
- Failing to analyze aggregation rights that may let an LP reach a higher MFN tier and thereby trigger a broader cascade.
- Overlooking drafting defects in side letters that should be corrected before MFN notice goes out, so the defect does not become the reference term for elections.
- Treating unusual governance concessions as non-economic when they can still flow through MFN provisions unless clearly excluded.

## 3. Legal frameworks / domain conventions that apply
- Determine MFN eligibility LP by LP from the side letter text: whether an MFN clause exists, whether it is full or limited, the applicable commitment threshold, and which other terms are available for election based on commitment size and closing date.
- An LP without an MFN clause cannot elect preferential terms, even if those terms are available to others.
- Later-closing LPs may provide the best economics for earlier-closing LPs; compare fee and carry economics separately for earlier and later closing groups.
- For governance terms, assess whether the term falls within a standard MFN exclusion category or is an unusual concession that may still cascade absent a clear carveout.
- Use the governing authority in the source set for MFN notice timing, election mechanics, and any stated exclusions; if the source set is silent, apply the fund’s own contractual hierarchy and standard fund-document reading principles.

## 4. Analytical scaffolds
1. Build an LP-by-LP table from the side letters: MFN presence, scope, threshold, closing date, commitment amount, and election-eligible terms.
2. Identify the MFN notice deadline and the point by which any needed amendments must be completed.
3. Identify the later-closing LP or LPs and determine whether they provide the most favorable economics available to earlier closings.
4. Separate analysis of management fee and carry: identify the best available rate for each closing group and assess cascade risk within each group.
5. Model fee impact using the commitment schedule and closing data; state the baseline, then the downside and expected cascade paths.
6. Model carry impact at representative return outcomes using the lowest carry term available in the source documents.
7. Evaluate no-fault removal or similar governance thresholds for cascade effects by looking at the aggregate commitments of LPs who can elect the lower threshold.
8. Review any side-letter drafting error that should be corrected before notice; recommend amendment before circulation.
9. If an LP may aggregate with affiliates or related vehicles, determine the post-aggregation tier and then re-run the election analysis from that tier.
10. Characterize co-investment guarantees against commercially reasonable efforts and fair-allocation language; assess whether the guarantee can spread through MFN rights.
11. Enumerate any expanded key person lists and assess whether they enlarge the fund’s overall key-person exposure if elected by others.
12. Test unusual rights, including valuation-agent approval, against the policy memo’s exclusion architecture and flag any ambiguity for counsel.
13. Distinguish relationship-driven concessions from excluded terms only if the source documents clearly support the carveout; otherwise treat them as potentially electable.
14. End with concrete action items tied to the closing timetable and notice process.

## 5. Vertical / structural / temporal relationships
- The fund agreement sits at the base; side letters overlay it; the policy memo may narrow or categorize terms; the closing schedule determines which LPs can compare terms across closing groups.
- Earlier closings generally compare upward to later closings only to the extent the MFN language and closing mechanics permit.
- Pre-notice amendments must be completed before MFN notices are delivered, or the flawed term can become the reference point for elections.
- Aggregation analysis is circular by design: aggregation can move an LP into a better tier, and that better tier can then affect cascade outcomes for others.

## 6. Output structure conventions
- Produce a single recommendation memorandum as the deliverable.
- Use a conventional memo shape: opening summary, LP-level eligibility matrix, economics comparison by closing group, issue-by-issue analysis, cascade impact modeling, and recommended next steps.
- For each identified issue, state the scale or threshold implicated, identify the document interaction that matters, and explain the downstream consequence for the fund or LPs.
- Use an explicit severity label for each issue, with a uniform ordinal scale defined once at the start of the analysis.
- Close the memorandum with a Recommended Actions section that assigns each action to the relevant role and ties timing to the MFN notice process or final-closing timeline.
- Cite the controlling contractual provision, policy rule, or other source authority whenever stating a legal or interpretive conclusion.
- Keep the analysis grounded in the source documents; do not assume a term is excluded, electable, or non-electable without tracing it through the governing text.
