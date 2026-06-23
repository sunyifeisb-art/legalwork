---
name: compare-target-reps-vs-diligence
task_id: corporate-ma/compare-target-representations-vs-diligence
description: Guides cross-referencing transaction representations and disclosure materials against diligence findings, mapping each material discrepancy to the implicated provision, assessing financial and risk impact, and identifying appropriate protective drafting or process responses.
activates_for: [planner, solver, checker]
---

# Skill: Compare Target Representations vs. Diligence

## 2. Failure modes the skill is correcting

- Identifying a mismatch without tying it to the exact representation, disclosure topic, or qualifier that controls the analysis.
- Treating diligence findings as standalone concerns instead of testing whether they create a false, misleading, incomplete, or under-disclosed rep package.
- Skipping the interaction analysis between the SPA text, disclosure schedules, and diligence record, which is where many issues are resolved or hardened.
- Describing the issue qualitatively but not scaling it to the deal economics, exposure, headroom, or other source-document thresholds.
- Collapsing distinct fact patterns into one generalized concern, which obscures whether the problem is a rep breach, a disclosure gap, or a diligence-only valuation issue.
- Failing to translate the finding into a concrete protective response: disclosure update, indemnity, condition, covenant, price adjustment, insurance, or process fix.
- Overlooking tax-attribute limitations where the transaction may constrain future use of carryforwards or similar attributes.

## 3. Legal frameworks / domain conventions that apply

- Representations are typically read against their qualifiers, schedules, and timing bring-down mechanics; a diligence inconsistency may indicate breach, partial disclosure, or no issue depending on how the rep is drafted.
- Disclosure schedules should be tested topic-by-topic against the reps they qualify, not treated as a general carveout; cross-reference schedule entries to the specific rep language they modify.
- Materiality, knowledge, ordinary course, and adverse-effect concepts can materially change the result; their effect must be analyzed as written, not assumed.
- Commercial concentration, facility dependence, compliance, customer, supplier, litigation, IP, and tax topics often carry both rep implications and valuation consequences; the issue should be analyzed under both lenses when the facts support it.
- EBITDA, net debt, working capital, and similar normalization items should be checked against the deal’s stated valuation framework before any financial impact is stated.
- Tax-attribute limitation analysis should use the governing limitation regime for the attribute at issue and assess whether the rep package addresses existence, usability, and post-change limits.

## 4. Analytical scaffolds

For each discrepancy:

1. Identify the implicated provision precisely.
   - State the rep section, related schedule topic, and any cross-cutting clause that affects interpretation.
   - If more than one provision may apply, enumerate the competing hooks before selecting the primary one.

2. State the rep as written.
   - Capture the operative qualifiers, including materiality, knowledge, disclosure, or temporal language.
   - Cite the controlling authority or contractual source the memo relies on when the proposition turns on a legal rule or standard.

3. State the diligence finding.
   - Describe the underlying fact pattern from the diligence materials.
   - If the issue spans multiple documents or periods, enumerate each relevant document, period, or counterparty before analysis.

4. Perform the gap analysis.
   - Explain whether the diligence fact makes the rep false, misleading, incomplete, or adequately disclosed.
   - Cross-reference any schedule entry, side letter, exhibit, or other source material that changes the result.

5. Close with the issue-closing triad.
   - Scale the issue against a source-document figure, threshold, term, or other concrete benchmark.
   - Cross-reference the issue against another clause, schedule, or diligence document that interacts with it.
   - State the downstream consequence for the client: economic, operational, regulatory, litigation, or transaction risk.

6. Classify severity.
   - Use a uniform ordinal scale defined once in the memo, and apply it consistently to every issue.
   - Severity should reflect both likelihood of a true rep problem and magnitude of consequence.

7. Recommend a protective action.
   - Tie the recommendation to the issue type and the deal posture.
   - Use a concrete action: revise disclosure, narrow or expand the rep, add a special indemnity, impose a closing condition, require a covenant, adjust pricing, or seek insurance.

Tax-attribute limitation analysis:
- Test whether the tax reps address the existence of the attribute, any limitation regime, the post-change usability profile, and any pricing consequence if value is not fully realizable.
- If the rep package is silent or thin, identify the missing concept and the practical drafting or pricing response.
- Where multiple attribute categories or time periods are implicated, enumerate them first and analyze each separately.

Severity scale:
- Critical: likely deal-significant breach or exposure that can alter signing, closing, or economics.
- High: serious issue requiring targeted contractual protection or material disclosure correction.
- Medium: meaningful issue with manageable but real risk or pricing effect.
- Low: limited issue, mainly confirming disclosure quality or residual risk.

## 5. Vertical / structural / temporal relationships

- Analyze the same fact pattern across the vertical chain: diligence fact, rep text, disclosure schedule, and remedy.
- Distinguish signing-date, closing-date, and post-closing effects where the rep package or remedy depends on timing.
- If an issue touches multiple periods, counterparties, facilities, or assets, list them first and then compare each against the relevant rep and schedule.
- Where the issue depends on a sequence of events, preserve that sequence; do not analyze the end state without the intervening disclosures or updates.

## 6. Output structure conventions

- Begin with a short executive summary and a legend for the severity scale.
- Include a summary table listing each issue, its severity, the implicated provision, the core discrepancy, and the recommended action.
- Then provide issue-by-issue analysis in sequential order.
- For each issue, use a consistent substructure:
  - Issue number and short title
  - Severity
  - Implicated provision and related disclosure topic
  - Representation as written
  - Diligence finding
  - Gap analysis
  - Impact / scale / consequence
  - Recommended action
- If tax-attribute limitations are in scope, include a separate tax section after the main issues.
- End with a Recommended Actions block that lists each action in imperative form, the responsible role, and the timing anchor.
- Write for a memo deliverable, not a checklist; use complete sentences, but keep each issue self-contained and decision-oriented.
