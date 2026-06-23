---
name: extract-market-share-data-scenario-01
task_id: antitrust-competition/extract-market-share-data/scenario-01
description: Supports multi-source reconciliation, concentration analysis, document-production review, and cumulative acquisition-risk assessment for an antitrust transaction memorandum.
activates_for: [planner, solver, checker]
---

# Skill: Market Share Data Extraction and Antitrust Risk Analysis

## 1. Subject-matter triage

This task is a multi-source extraction and reconciliation exercise, not a single-source summary. Begin by isolating each source, each market definition, and each company figure before any synthesis.

Treat the record as potentially containing:
- overlapping but non-identical market definitions,
- different revenue bases or time periods,
- internal figures that may be self-serving,
- sub-segment data that can change the competitive picture,
- prior acquisition facts that may affect cumulative risk,
- documents that may be responsive for transactional production purposes.

If the sources support more than one relevant market or time period, enumerate them explicitly before analyzing. Do not collapse distinct markets, periods, or buyer targets into one blended dataset.

## 2. Failure modes the skill is correcting

- Baseline accepts a single market-share figure without reconciling it against the other sources in the record.
- Baseline treats discrepancies as noise instead of identifying the specific driver: scope, geography, timing, methodology, or excluded categories.
- Baseline performs concentration analysis only at the headline market level and misses a narrower sub-segment that is more concentrated.
- Baseline states an antitrust conclusion without anchoring it to the governing concentration framework and the relevant market-share evidence.
- Baseline ignores whether internal management materials discussing competition, market position, or acquisition rationale may need separate production review.
- Baseline misses cumulative or roll-up risk where the same buyer has a documented acquisition pattern in the same space.
- Baseline fails to distinguish an internal source that may be self-serving from independent sources that better calibrate the competitive record.
- Baseline answers in narrative form only, without a tabular reconciliation that lets the reader see source-by-source differences.

## 3. Legal frameworks / domain conventions that apply

- Market definition and concentration analysis: use the market definition reflected in the source set, but test whether the record supports a narrower product or geographic sub-market.
- HHI methodology: compute concentration using the market-share shares supplied in the record; assess pre-transaction, post-transaction, and change in concentration.
- Structural presumption analysis: compare the concentration result against the applicable merger-guideline framework and state whether the record suggests a materially heightened competitive concern.
- Multi-source reconciliation: identify whether each discrepancy stems from different scope, different denominator, timing mismatch, or methodology. The point is to explain the variance, not to force convergence.
- Credibility of internal figures: internal presentations or planning materials may be informative but can also be directional or strategic; compare them against independent sources before relying on them.
- Production review: management-level materials addressing market position, competition, pricing, customer overlap, or strategic rationale may be responsive in a transactional disclosure or antitrust production context.
- Cumulative acquisition risk: a pattern of prior purchases in the same sector can increase scrutiny even where any single transaction appears modest in isolation.

## 4. Analytical scaffolds

1. Enumerate the relevant markets, sub-markets, periods, and source types before analysis.
2. Build a source-by-source comparison table for each company and market:
   - source name,
   - date or period,
   - market definition,
   - revenue or volume base,
   - share figure,
   - notes on methodology or scope.
3. For every discrepancy, identify the most likely cause:
   - product scope difference,
   - geographic scope difference,
   - different denominator or market size estimate,
   - different reporting period,
   - excluded channel/customer segment,
   - differing treatment of self-supply, imports, or affiliated sales,
   - rounding or estimation convention.
4. Reconcile, do not average. If a source is preferred, say why and what that means for the competitive analysis.
5. Compute concentration metrics for each relevant market:
   - pre-transaction HHI,
   - post-transaction HHI,
   - change in HHI.
   If the record supports a narrower sub-segment, run the same analysis there too.
6. Assess whether the relevant market outcome suggests a structural concern, and explain whether the concern is stronger at the sub-segment level than at the headline level.
7. Evaluate whether any internal source appears self-serving by identifying the specific figures that diverge from independent sources and the directional effect on the assessment.
8. Review whether the record contains management, board, or strategic materials that discuss competition, market shares, customer overlap, or deal rationale, and flag them as potentially production-responsive.
9. If the record shows prior acquisitions by the same buyer in the same area, assess whether the pattern increases cumulative antitrust risk.
10. Close each substantive issue with: the magnitude or threshold implicated, the related source interaction, and the downstream consequence for the transaction.

## 5. Vertical / structural / temporal relationships

Use the source hierarchy and timing to organize the analysis:
- separate internal and external sources before comparing them;
- prefer current, market-specific data over older or generalized figures unless the older source better captures the relevant scope;
- distinguish company-level shares from product-line or segment-level shares;
- treat pre-transaction, post-transaction, and historical-acquisition data as different analytic layers;
- where the record contains both headline-market and sub-segment data, explain how the narrower layer changes the risk profile;
- if a source reflects a different fiscal year or trailing period, identify that timing mismatch explicitly.

## 6. Output structure conventions

- Start with a short executive summary stating the reconciled market view and the overall antitrust risk posture.
- Include a data reconciliation table that lists each company, each source, and the reported figures side by side.
- Follow with a discrepancy analysis section that explains each material variance and its likely root cause.
- Include a concentration analysis section that sets out the relevant market, the reconciled figures, and the HHI results.
- If sub-segment evidence exists, include a separate sub-segment concentration discussion rather than folding it into the headline market.
- Include an antitrust risk section covering structural concern, internal-source credibility, production-responsive materials, and cumulative acquisition risk.
- Where a legal conclusion depends on a governing framework, cite the controlling authority or recognized merger-guideline standard supporting the proposition.
- End with a Recommended Actions section that gives concrete next steps, assigns the responsible role, and ties each step to the transaction timeline or regulatory milestone.
- Write the memo as a practical advisory product suitable for insertion into `antitrust-market-share-memo.docx`.
