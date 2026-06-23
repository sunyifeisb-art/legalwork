---
name: analyze-section-382-analysis
task_id: tax/analyze-section-382-analysis
description: A Section 382 ownership change analysis requires systematic identification of testing dates, proper segregation of public groups, look-through analysis for entity shareholders, and option-rule treatment of contingent shares — not just a top-level ownership arithmetic check.
activates_for: [planner, solver, checker]
---

# Skill: Section 382 Ownership Change Analysis

## 1. Subject-matter triage

- Treat the materials as a date-driven ownership tracing exercise, not a single closing-date computation.
- Build the analysis around every potential testing date in the source set, including issuances, transfers, conversions, option events, earnout settlements, and any other equity movement that can alter significant-holder ownership.
- If the source materials only support one relevant testing date, state that explicitly and explain why no other date is in scope.
- Begin by assembling a complete shareholder map, then classify holders, then test change events, then compute any limitation and follow-on consequences.

## 2. Failure modes the skill is correcting

- Computing the ownership shift only at the transaction closing date rather than at every testing date within the relevant lookback period.
- Treating the below-threshold shareholder base as one undifferentiated public group without segregating new below-threshold investors from the preexisting public group.
- Skipping look-through analysis for entity or fund shareholders that may conceal individuals who must be tracked separately.
- Failing to reclassify a holder that crosses into significant-holder status during the lookback period.
- Ignoring contingent shares, warrants, earnouts, or similar instruments that may be deemed outstanding and exercised.
- Collapsing multiple stock movements into a single arithmetic pass instead of testing each event and each holder separately.
- Stating that an ownership change occurred, or did not occur, without tying the conclusion to the governing Section 382 rule and the specific factual inputs in the record.
- Omitting the annual limitation computation and any built-in gain adjustment where the facts require it.
- Producing a memorandum that summarizes the result but does not leave a workbook trail that can be audited by testing date and holder.

## 3. Legal frameworks / domain conventions that apply

- **Section 382 ownership change rule:** An ownership change occurs when the cumulative increase in ownership by one or more five-percent shareholders exceeds the statutory threshold over the testing period. The analysis must be tied to the Internal Revenue Code and Treasury regulations governing ownership changes.
- **Five-percent shareholder tracking:** Holders at or above the relevant threshold are tracked individually; holders below the threshold are aggregated in the public group until segregation or reclassification is required.
- **Public group segregation:** New below-threshold investors are not folded into the preexisting public group as if nothing changed; separate public groups may need to be created and tracked from the date of the relevant issuance or transfer.
- **Look-through principles for entity holders:** Where the facts and governing rules require it, entity or fund ownership must be traced through to underlying owners rather than left at the entity level.
- **Reclassification of accumulating holders:** A holder that crosses the threshold during the lookback period must be treated as significant from the crossing date forward.
- **Option and deemed-exercise rules:** Outstanding options, warrants, earnouts, and similar contingent equity must be tested for deemed exercise at each relevant testing date under the governing Section 382 rules.
- **Annual limitation and built-in gain concepts:** If an ownership change occurs, the limitation is based on pre-change equity value and the applicable long-term tax-exempt rate under the Code and regulations, with any built-in gain adjustments analyzed separately if the facts support them.
- **Controlling authority to anchor conclusions:** Cite the applicable Code provisions and Treasury regulations for each legal proposition relied upon, rather than stating conclusions in free form.

## 4. Analytical scaffolds

- First enumerate all relevant dates, transactions, and equity instruments before analyzing them.
- For each enumerated testing date, identify:
  - the holders in scope,
  - the holder classification at that date,
  - any change in status since the prior date,
  - whether a new public group must be created,
  - whether any entity holder requires look-through treatment,
  - whether any contingent instrument is deemed exercised.
- Run the ownership-change test separately for each testing date rather than by using a single blended percentage.
- If a holder crosses the threshold during the lookback period, record the crossing date and carry that reclassification forward in later periods.
- Where an issuance creates new below-threshold holders, preserve the preexisting public group and track the new group separately from inception.
- When an entity shareholder is in scope, trace to the ultimate owners only to the extent required by the governing rules and the source materials support the tracing.
- If an ownership change is found, compute the annual limitation from the immediately pre-change equity value and the applicable long-term tax-exempt rate, then assess whether any built-in gain adjustment applies.
- Tie each conclusion to the specific regulation or statutory provision supporting it.
- Document the work in a workbook that can be audited by date, holder, and assumption.

## 5. Vertical / structural / temporal relationships

- Treat SPAC-style or sponsor/public/PIPE structures as layered ownership systems: public holders, sponsor/founder holders, and new investors may each affect the test differently on the same date.
- Treat multi-round financings as a sequence of distinct events, not as one combined transaction, unless the source documents compel consolidation.
- Respect temporal ordering: a later reclassification cannot be used to rewrite an earlier testing date.
- When multiple equity instruments interact on the same date, test both the direct transaction effect and any deemed-exercise effect before stating the result.

## 6. Output structure conventions

- Prepare both deliverables named in the task instructions: a tax memorandum and a supporting workbook.
- Draft the memorandum as a date-by-date Section 382 analysis with:
  - issue framing,
  - governing authority,
  - holder classification and testing-date computations,
  - ownership change conclusion for each date,
  - limitation computation if triggered,
  - practical tax consequences and implementation points.
- Include a short recommended-actions section at the end of the memorandum that states the next steps, the responsible business or tax role, and the timing anchor tied to the transaction or filing milestone.
- Build the workbook as an audit trail, with a shareholder register, a separate computation tab for each testing date, a limitation tab if needed, and a summary tab linking the steps together.
- Ensure the memorandum and workbook are internally consistent on dates, holder labels, and conclusions.
- Before finishing, confirm that both required files exist, are non-empty, and contain operative analysis rather than placeholders or summaries.
