---
name: extract-market-share-data-scenario-02
task_id: antitrust-competition/extract-market-share-data/scenario-02
description: Closes gaps in per-source revenue accuracy, sub-segment HHI computation, hot-document obligations, and explicit characterization of self-serving internal materials.
activates_for: [planner, solver, checker]
---

# Skill: Market Share Data Extraction and Antitrust Risk Analysis (Scenario 02)

## 1. Subject-matter triage

This task requires source-by-source extraction, reconciliation, and antitrust assessment. Identify every source in scope, then extract each company’s revenue or share input from each source separately before any aggregation or concentration analysis.

If the sources present more than one market definition, product slice, time period, or competitive set, enumerate them first and run the analysis once per scope item. Do not collapse distinct scopes into a single blended result.

Treat the requested memo as an advisory deliverable supported by calculations and document analysis. The memo itself is the output; the memo should not substitute for the underlying comparison and reconciliation work.

## 2. Failure modes the skill is correcting

- Figures are averaged, smoothed, or mixed across sources before the reader can see source-level differences.
- A discrepancy is stated without identifying the specific source values, the likely reason for divergence, and the business or antitrust consequence.
- Concentration analysis is incomplete because it omits pre-merger, post-merger, and change-in-concentration analysis for the relevant scope.
- Internal materials are described neutrally when they should be flagged as potentially self-serving if they diverge from independent sources.
- Hot-document status is asserted in conclusory form without tying it to the document’s role in strategy, valuation, or board-level decisionmaking.
- Structural antitrust risk is discussed without linking the legal standard to the computed concentration metrics and the relevant market scope.
- The memo ends with diagnosis only and no concrete next steps.

## 3. Legal frameworks / domain conventions that apply

Use the conventional merger-review framework for horizontal overlap analysis:
- define the relevant market or sub-market reflected in the source set;
- reconcile source inputs before using them in market share calculations;
- compute concentration measures for the relevant scope and compare them to the applicable structural benchmark;
- assess whether the transaction raises a structural presumption of competitive concern in any defined scope;
- evaluate whether internal strategy, board, or presentation materials should be treated as hot documents because they bear directly on competitive positioning, market definition, integration plans, or pricing expectations.

Apply the customary antitrust document-analysis convention that a material conflicting with independent sources may be treated as potentially self-serving and therefore less reliable unless explained by a specific methodological or timing difference.

When stating legal significance, anchor the conclusion to the governing merger-review standard, the concentration metric used, and the document category involved. Do not state risk conclusions without naming the rule or framework that supports them.

## 4. Analytical scaffolds

1. **Enumerate the scope set**
   - List each market, sub-segment, period, or other analytic scope item that appears in the source set.
   - If only one scope is truly in play, say so and explain why the sources do not require separate passes.

2. **Extract source-level figures**
   - Build a comparison table with one row per company and one column per source.
   - Preserve each source’s number separately; do not average or otherwise normalize before the table is complete.
   - If a source uses a different methodology, units, or date basis, note that in the table or immediately below it.

3. **Reconcile discrepancies**
   - For each variance, identify the exact figures at issue.
   - Explain the likely cause: different date, scope, product mapping, currency/unit treatment, inclusion or exclusion rule, or estimate versus reported value.
   - State the downstream effect on market share analysis or concentration results.

4. **Compute concentration**
   - For each relevant scope, calculate the relevant concentration metric on a pre-transaction and post-transaction basis, then state the change.
   - Compare the result against the governing structural benchmark for that market definition.
   - If a sub-segment is more concentrated than the broader market, analyze both and explain which one drives risk.

5. **Characterize internal materials**
   - If an internal document diverges from independent sources, state that it appears potentially self-serving.
   - Identify the specific divergence and explain why it matters for credibility, negotiation posture, or antitrust risk.
   - Distinguish between advocacy language and methodological differences.

6. **Assess hot-document obligations**
   - Flag board decks, strategic plans, pricing analyses, integration plans, and similar materials when they speak directly to market power, competitive strategy, or transaction rationale.
   - Explain why the category matters for production and why it should be preserved and reviewed carefully.
   - Tie the obligation to the document’s substance, not just its label.

7. **Close with action**
   - End with concrete next steps that follow from the reconciliation and antitrust assessment.
   - Make the recommendations operational: what to verify, what to revise, what to escalate, and who should own the task.

## 5. Vertical / structural / temporal relationships

If the source set contains both an overall market and a narrower segment, analyze the narrower segment separately and then explain how it relates to the broader market.

If there are multiple dates or periods, keep the time slices distinct and do not blend them into one timeline unless the sources clearly use the same measurement date.

If one source is internal and another is external or independent, treat the external source as a reconciliation anchor and explain any departure from it.

## 6. Output structure conventions

- Start with a brief executive summary stating the overall data quality, the principal concentration conclusion, and the main antitrust risk points.
- Include a source-by-source comparison table with precise figures and methodology notes.
- Include a reconciliation section that names each discrepancy, its cause, and its effect.
- Include a concentration analysis section with pre-transaction, post-transaction, and change analysis for each relevant scope.
- Include an antitrust risk section addressing structural concern, sub-segment sensitivity, document credibility, and hot-document implications.
- Include a concise recommendations section with imperative action items, the responsible business or legal role, and an urgency anchor tied to the transaction or review process.
- Keep terminology consistent across the memo; do not switch between share, revenue, and concentration terminology without clarifying the mapping.
