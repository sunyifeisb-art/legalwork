---
name: compare-compliance-certificate-against-financial-covenants
task_id: banking-finance/compare-compliance-certificate-against-financial-covenants
description: Independently recalculate covenant metrics from financial data and credit agreement definitions, compare the results against the compliance certificate, and identify deviations together with appropriate follow-up steps.
activates_for: [planner, solver, checker]
---

# Skill: Compliance Certificate Deviation Analysis — Independent Recalculation

## 1. Subject-matter triage
- Treat the work as a comparison of a borrower’s compliance certificate against the operative credit agreement and source financials.
- Identify all measurement dates, covenant tests, and defined terms before calculating anything.
- If multiple periods, covenants, amendments, or certificate versions appear, enumerate them first and analyze each separately.
- If only one covenant or one reporting period is in scope, say so explicitly and explain why.

## 2. Failure modes the skill is correcting
- Recalculating a leverage or coverage metric without independently verifying each input component, allowing an understated denominator or overstated numerator to mask a deviation.
- Missing double-counting when the same item is treated as an addback and also appears in another covenant component.
- Accepting discretionary or non-recurring addbacks without confirming the definition permits them and any required approval or condition has been met.
- Failing to verify that an addback or adjustment falls within the applicable time window or other stated limitation.
- Comparing the certificate to a covenant level without checking whether an amendment, waiver, or reset changed the benchmark for the relevant measurement date.
- Treating a certificate presentation as controlling when the agreement-defined calculation requires a different treatment.
- Omitting the downstream consequence of an error, such as covenant breach risk, notice obligations, or a request for correction.
- Stating a conclusion without showing the underlying source provision or controlling agreement language.

## 3. Legal frameworks / domain conventions that apply
- Recompute each covenant from the underlying financial data and agreement-defined inputs; do not rely on the borrower’s stated ratio.
- Verify every numerator and denominator component independently, including exclusions, addbacks, and reclassifications.
- If a cost can be characterized in more than one way for covenant purposes, test whether it is counted twice or otherwise inconsistently.
- For non-recurring adjustments, test the operative definition, any approval requirement, and any quantitative cap or timing restriction stated in the agreement.
- For trailing-period metrics, reconstruct the rolling period quarter by quarter so the inputs and trend can be checked.
- If an amendment or waiver modifies the covenant level, apply the governing version for the specific measurement date.
- Use the agreement’s defined terms and calculation mechanics, not accounting presentation alone, to determine covenant compliance.
- Support each legal or contractual proposition by citing the controlling agreement provision or other source authority identified in the materials.
- If the sources do not support a claimed adjustment, treat it as unsupported rather than inferred.

## 4. Analytical scaffolds
1. Identify the covenant type, measurement date, and applicable defined terms.
2. Extract the borrower-reported figures, all stated adjustments, and the reported result.
3. Recalculate each input component from the financial data and supporting schedules.
4. Test each addback or exclusion against the agreement definition, timing limit, approval condition, and any cap.
5. Check for overlap, double-counting, reclassification, or omission across related line items.
6. Recompute the covenant ratio or compliance measure using corrected inputs.
7. Compare the corrected result to the borrower-reported result and to the governing threshold.
8. If an amendment, waiver, or reset applies, confirm the correct covenant level for the relevant period.
9. If a discrepancy exists, identify the source of the deviation and the practical consequence.
10. State the follow-up step needed to cure, confirm, or reserve rights on the discrepancy.

## 5. Vertical / structural / temporal relationships
- Separate borrower-reported figures, agreement-defined calculations, and independently recalculated figures.
- Track each metric by period so that quarter-to-quarter movement is visible and the trailing-period build is auditable.
- Distinguish parent-level, subsidiary-level, and consolidated inputs only where the agreement actually uses those distinctions.
- Link each adjustment to the time period it purports to cover; do not carry an item into a period outside its stated window.
- If the certificate relies on a later amendment or side letter, place that authority in the correct temporal sequence and test whether it was effective on the measurement date.
- If a covenant test depends on a rolling horizon, show the component quarters that feed the test rather than only the final result.

## 6. Output structure conventions
- Write a deviation-analysis memo organized by issue, not as a narrative summary alone.
- Define an ordinal severity scale once at the top and apply it uniformly to each issue.
- For each issue, include: severity; borrower-reported figure or position; corrected figure or analysis; governing agreement provision; why the deviation matters; recommended action.
- Each issue should close with three moves: the magnitude of the deviation, the related provision or document interaction, and the downstream consequence for the client.
- Include a quarterly build-up table for each relevant trailing-period metric.
- Include a summary table comparing corrected ratios, borrower-reported ratios, and covenant thresholds.
- Include a Recommended Actions section with imperative action items, a responsible role, and a timing anchor tied to the reporting or response deadline if one appears in the sources.
- Use concise, source-tethered language; do not infer unsupported adjustments or omit the governing provision.
