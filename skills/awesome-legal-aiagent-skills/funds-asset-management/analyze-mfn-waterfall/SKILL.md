---
name: analyze-mfn-waterfall
task_id: funds-asset-management/analyze-mfn-waterfall
description: Review a fund's side-letter package, governing fund agreement, policy materials, tracking records, and commitment schedule to produce an MFN election analysis and recommendation memorandum covering LP eligibility, economic cascade modeling, and pre-notice amendment recommendations.
activates_for: [planner, solver, checker]
---

# Skill: MFN Waterfall Analysis — GP Recommendation Memo

## 2. Failure modes the skill is correcting

- Missing the MFN notice deadline or treating notice timing as informal rather than a hard contractual trigger
- Failing to build a complete investor-by-investor eligibility view before analyzing elections, especially where closings, commitment tiers, or scope limitations differ
- Under-modeling the fee and carry cascade by analyzing only a headline concession instead of the most favorable electable term across all eligible investors
- Overlooking that a preferential side-letter term may be defensible if it was integral to the investor’s commitment, while also failing to test whether the granting investor itself can elect back under an MFN clause
- Ignoring priority conflicts created by co-investment commitments when multiple investors have competing participation rights
- Treating tax gross-ups as automatically excluded from MFN without checking the clause text and practical election likelihood
- Recommending notice distribution before correcting drafting errors or clarifying which concessions are excluded from MFN
- Providing issue spotting without tying each issue to source-document scale, cross-document interaction, and downstream consequence

## 3. Legal frameworks / domain conventions that apply

**MFN mechanics and notice discipline**
- The MFN clause controls who may elect whose side-letter terms, when elections must be made, and whether elections are limited to the same closing or same commitment tier
- The notice package is the operative disclosure; deadline compliance matters because late notice can foreclose elections or expand dispute risk
- Analyze the governing fund agreement first, then each side letter, then any policy or tracking materials that define excluded categories or election process

**Eligibility and election scope**
- Determine each investor’s MFN status, scope of covered terms, and any tier or closing restrictions
- Cross-closing elections are only available if the contract text permits them
- Build the eligibility view as a party-by-party matrix before assessing any single concession

**Preferential economics and fiduciary framing**
- Preferential treatment given to a smaller investor can raise fiduciary concerns when the rationale is personal relationship rather than a bona fide business justification
- Test the relevant exclusion for terms that were necessary to secure the commitment or otherwise integral to the investment
- Confirm whether the favored investor’s own side letter contains MFN protection; absence of reciprocal protection can increase cascade exposure

**Co-investment commitments**
- A hard co-investment commitment is different from aspirational, commercially reasonable efforts, or proportional allocation language
- A commitment can create practical priority conflicts if more than one investor seeks the same allocation
- Assess whether other investors’ MFN clauses are broad enough to capture co-invest rights and related allocation terms

**Tax gross-ups and similar tax-specific provisions**
- Tax-specific exclusions may remove gross-up mechanics from the MFN pool, but only if the clause text actually does so
- If the clause is silent, consider whether the provision is likely to be elected in practice and whether domestic investors would find the concession meaningful
- Treat jurisdiction-specific tax treatment as a separate election question, not a default exclusion

**Fee and carry cascade modeling**
- Model fee revenue using committed capital and the applicable fee rate for each period that the fund agreement uses
- Identify the most favorable electable management-fee term and model a worst-case cascade where all eligible investors elect it
- Also present a realistic scenario based on likely election behavior
- If carry is reduced for any investor, model the knock-on effect across all eligible investors at representative return outcomes

**Pre-notice cleanup**
- Correct drafting errors in individual side letters before notice goes out
- Confirm which terms fit within express MFN exclusions and which remain electable
- Surface ambiguities for business and counsel discussion before the election window opens

## 4. Analytical scaffolds

1. Enumerate all investors and closings explicitly before analysis begins
   - For each investor, capture: MFN clause present or absent, scope of covered terms, commitment tier, closing, and any election limitations
   - If only one investor or one closing is in scope for a sub-issue, say so and explain why

2. Identify the notice mechanics
   - State the triggering event, notice deadline, election window, and any consequences for late delivery
   - Link the deadline to the operative document that governs it

3. Build the MFN eligibility matrix
   - Show who can elect whose terms and which categories of terms are in or out of scope
   - Separate same-closing from cross-closing elections
   - Separate economic terms, governance terms, tax terms, and co-invest terms

4. Model fee economics
   - Establish the fee baseline from the commitment schedule and fee grid
   - Identify the most favorable management-fee term available for election
   - Model worst-case and expected cascade effects for the investment period and the post-investment period separately
   - State the direction and practical significance of the revenue impact

5. Model carry economics if any reduced carry is present
   - Identify eligible electors
   - Test at multiple representative return outcomes
   - State how the cascade affects sponsor economics and fund alignment

6. Analyze preferential-treatment and commitment-integrality issues
   - Determine whether the term was likely integral to the commitment
   - Check whether the favored investor has reciprocal MFN protection
   - State the downstream effect if the term enters the election pool

7. Analyze co-investment rights
   - Distinguish binding commitments from discretionary efforts language
   - Identify priority conflicts and allocation pressure
   - Test whether the right is likely to cascade through other investors’ MFN clauses

8. Analyze tax gross-ups and other specialized concessions
   - Apply any express exclusion
   - If no exclusion exists, evaluate practical election likelihood and administrative burden

9. Scan for other cascade-sensitive terms
   - Reporting enhancements
   - Advisory board participation
   - Placement-agent fee disclosures
   - Other governance or economics concessions that may ride the MFN framework

10. Draft pre-notice recommendations
   - Recommend amendments, clarifications, or investor conversations before notice distribution
   - Tie each recommendation to the relevant document and timing milestone

## 5. Vertical / structural / temporal relationships

The fund agreement sets the MFN architecture; side letters create investor-specific deviations; policy materials can narrow or exclude categories of terms; the commitment schedule supplies the inputs for revenue modeling and election scoping. Temporal sequencing matters: close and notice timing determine eligibility, and pre-notice amendments should be completed before the MFN package is circulated. Where multiple closings exist, analyze them in chronological order and do not assume a later closing can elect earlier terms absent express text.

## 6. Output structure conventions

Single deliverable: memorandum or comparable analysis file named `output.md`.

Use a conventional memo shape:
1. Executive summary with notice deadline, principal cascade risks, and recommended next steps
2. MFN eligibility matrix
3. Economic impact analysis, including fee baseline, worst-case and expected fee cascade, and any carry cascade
4. Issue analysis covering preferential treatment, co-investment, tax gross-up, and other cascade-sensitive terms
5. Pre-notice amendment recommendations
6. Recommended actions before notice distribution

Every issue entry should be written in a decision-useful way:
- State the applicable scale or threshold from the source documents
- Cross-reference the interacting clause, schedule, or side letter
- State the consequence for the GP, fund economics, operations, or dispute risk

End with an explicit Recommended Actions block. Each recommendation must use an imperative verb, identify the responsible role, and include a timing anchor tied to the notice process or the next transactional milestone.
