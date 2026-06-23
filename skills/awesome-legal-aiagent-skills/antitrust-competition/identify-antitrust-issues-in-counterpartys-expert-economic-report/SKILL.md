---
name: identify-antitrust-issues-in-counterpartys-expert-economic-report
task_id: antitrust-competition/identify-antitrust-issues-in-counterpartys-expert-economic-report
description: Closes gaps in econometric specification critique including residual diagnostics, structural-break testing, methodological linkage to prior exclusion history, and consistency analysis between affected-commerce measures and market-share evidence.
activates_for: [planner, solver, checker]
---

# Skill: Expert Economic Report Critique

## 1. Subject-matter triage

- Treat the task as an issue-spotting memorandum against an opposing expert economic report, not a merits brief.
- First identify the governing antitrust theory, damages theory, and the expert’s stated method; then test the report on its own assumptions, data inputs, and cited sources.
- Separate pure econometric defects from factual inaccuracies, legal mismatches, and impeachment material; do not merge them into one generalized criticism.
- Enumerate each defendant, period, product set, market, and damages slice that is materially distinct before analysis; do not assume one pass fits all when the report uses multiple datasets or time windows.
- If the report is only about one model, state that expressly and analyze that model by its distinct specifications and outputs.

## 2. Failure modes the skill is correcting

- The critique stops at broad disagreement and does not isolate the exact methodological defect, data defect, evidentiary gap, or legal mismatch.
- The critique misses whether the regression is internally testable on the face of the report, including residual diagnostics, specification choices, and sensitivity checks.
- The critique overlooks whether the expert assumed a conspiracy period instead of testing it, creating a cross-examination point on arbitrariness.
- The critique fails to compare defendant-specific affected-commerce figures against other market evidence that should be directionally consistent.
- The critique does not tie the expert’s methodology to any prior exclusion, limitation, or criticism of the same methodology where that history is relevant to admissibility.
- The critique flags a problem without showing scale, interaction with other materials, or litigation consequence, leaving the issue underdeveloped.
- The critique omits a concrete rebuttal path, making it harder to convert the critique into targeted cross-examination or Daubert practice.

## 3. Legal frameworks / domain conventions that apply

- Daubert v. Merrell Dow Pharmaceuticals, Inc.; Federal Rule of Evidence 702: expert testimony must rest on sufficient facts, reliable principles and methods, and reliable application.
- Federal Rule of Evidence 703: the expert’s factual inputs must be of a kind reasonably relied on by experts in the field.
- Federal Rule of Evidence 403: overbroad or misleading econometric presentations can be attacked where probative value is outweighed by confusion or unfair prejudice.
- Antitrust damages models should be assessed for specification error, omitted-variable risk, unsupported causal assumptions, and failure to test key breakpoints.
- Residual diagnostics matter: autocorrelation, heteroskedasticity, and related misspecification concerns can undermine inferential reliability.
- Structural break analysis matters when the model hard-codes an alleged conspiracy start date rather than testing whether the data support that date.
- A single binary conspiracy indicator can be a simplifying assumption, but it is vulnerable where participation, timing, or conduct differs materially across defendants or across time.
- Internal consistency across the report, exhibits, underlying data, and cited market evidence is a standard impeachment axis; arithmetic errors are especially useful because they are verifiable on the page.
- Prior methodological criticism of the same expert or same model family can be relevant to reliability and to the weight, and sometimes admissibility, of the opinions.
- Where the report implicates pass-through, market definition, or class-period assumptions, the critique should tie those assumptions to the controlling factual record and the applicable damages theory.

## 4. Analytical scaffolds

1. Map the report:
   - Identify the expert, the opinion being offered, the model type, the data universe, the relevant period, and the stated damages or liability theory.
   - List each distinct defendant, product, market, and time span that the report treats separately.

2. Test the method:
   - Check whether the model explains variable selection, functional form, and identification strategy.
   - Look for residual autocorrelation, heteroskedasticity, multicollinearity, overfitting, selection bias, and failure to test alternative specifications.
   - Flag missing robustness checks, but only when the report’s own design makes those checks material.

3. Test the timing:
   - Determine whether the claimed start of the unlawful period is empirically tested or merely assumed.
   - Compare the expert’s period assumptions with the operative factual record and any competing period definitions in the source materials.
   - If the report uses a single period for all defendants, test whether the record supports uniform treatment.

4. Test defendant-level consistency:
   - Compare affected-commerce measures, output shares, sales shares, or other defendant-level allocations against market-share evidence or comparable record evidence.
   - Identify materially divergent treatment across defendants and explain why the divergence suggests a method issue, not just a factual dispute.
   - If the report aggregates defendants, assess whether aggregation obscures meaningful differences in conduct or exposure.

5. Test arithmetic and exhibits:
   - Recompute reported totals, shares, averages, and tables from the underlying exhibits.
   - Flag any mismatch between narrative, chart, table, appendix, and source data.
   - State the correct figure or the correct direction of the error when the underlying materials permit it.

6. Test omitted variables and controls:
   - Identify obvious omitted variables, alternative causal drivers, supply-side constraints, demand shocks, regulatory events, or product differences the model should have addressed.
   - Explain whether the omission likely biases the estimate upward, downward, or in an ambiguous direction.

7. Test admissibility history:
   - If the same expert, same framework, or same core technique was criticized, limited, or excluded before, connect that history to the current methodology rather than treating it as background color.
   - Focus on the shared defect: unsupported assumption, weak identification, misuse of data, or overstatement of causal inference.

8. Test legal fit:
   - Check whether the opinion matches the relevant antitrust theory, class period, injury theory, and damages construct.
   - Identify places where the expert’s legal assumptions exceed what the record or governing theory permits.

## 5. Vertical / structural / temporal relationships

- Use a vertical hierarchy: report-wide defects first, then model-specific defects, then defendant-specific or exhibit-specific defects, then line-item arithmetic errors.
- Use a temporal sequence: pre-period baseline, alleged violation period, post-period validation, and any break date or transition period.
- Where the source materials include multiple defendants or multiple products, analyze each separately before synthesizing.
- Where the report compares one measure to another, analyze the direction and magnitude of the inconsistency, then explain the doctrinal or economic significance.
- If the report’s conclusion depends on a chain of assumptions, identify the weakest link and the downstream assumption that fails with it.

## 6. Output structure conventions

- Write a memorandum with a clear issue register, not a narrative essay.
- Define one ordinal severity scale at the outset and apply it consistently to every issue.
- Give each issue a unique identifier and keep the issue description concise but specific.
- For each issue, include:
  - severity
  - issue statement
  - why it matters
  - source support or conflict
  - cross-examination angle
  - rebuttal recommendation
- Close every issue by tying it to scale, interaction with another source item, and the litigation consequence.
- Include a short summary table that lists all issues and severities before the detailed analysis.
- Include a legal authority section that names the controlling admissibility authorities relied on.
- End with a Recommended Actions block that gives concrete next steps, assigns the responsible role, and anchors timing to the briefing, deposition, expert-discovery, or motion schedule where available.
- Use precise legal citations when stating admissibility propositions; do not state reliability conclusions without naming the governing rule or case.
