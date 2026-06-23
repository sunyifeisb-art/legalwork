---
name: identify-issues-coverage-denial-letter
task_id: insurance/identify-issues-in-coverage-denial-letter
description: Agents analyzing an insurance coverage denial letter should test each denial ground against the policy language, the insurer's own positions, and the underlying facts; identify omitted coverage theories, internal inconsistencies, timing defenses, causation issues, mitigation arguments, and potential bad-faith exposure under applicable law.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Insurance Coverage Denial Letter — Coverage Analysis Memorandum

## 1. Subject-matter triage
- Treat the denial letter as the primary object of analysis, but test it against the policy excerpts, technical reports, records of notice and response, BI calculations, and any compliance order.
- Identify whether the loss is a single-occurrence event or presents multiple coverage questions across time, cause, and policy provision.
- If more than one policy form, endorsement, coverage part, or insured location is implicated, enumerate them before analysis and keep the coverage treatment separate for each.
- If the file contains related or co-issued policies, compare how the same fact pattern is characterized across them before accepting any denial premise.
- If the issue set includes both first-party property and business interruption questions, analyze them as distinct coverage tracks.

## 2. Failure modes the skill is correcting
- The denial grounds are taken at face value instead of being tested against the policy text, the insurer's own positions, and the underlying chronology.
- The analysis stops after identifying the cited exclusion and fails to test exception clauses, ensuing-loss language, additional coverage grants, or other carvebacks.
- The denial relies on maintenance, inspection, or compliance concepts without tying them to the actual standard, the actual condition, and the actual causal path to loss.
- Timing defenses are asserted without anchoring them to the insured's knowledge, the notice record, the proof-of-loss deadline, or the BI waiting period.
- Mitigation objections are stated generically rather than tied to concrete steps that were feasible and material.
- The memo overlooks whether the denial is internally inconsistent with positions taken under related policies or in related correspondence.
- The analysis omits whether the denial creates a plausible bad-faith record under the governing jurisdiction's standards.
- The memo describes a problem but does not close it by linking the issue to the governing rule, the relevant document cross-reference, and the practical consequence.

## 3. Legal frameworks / domain conventions that apply
- Ensuing loss clause: where an excluded event is followed by a separate covered peril, analyze whether the later loss is independently covered under the policy language.
- Internal inconsistency across related policies: if the insurer characterizes the same substance, condition, or event differently elsewhere, reconcile the positions and identify which policy language supports each.
- Notice timing: evaluate late-notice arguments against the date the insured first had knowledge that notice was required and the timing shown in the correspondence record.
- Proof of loss: compare the submission date to the governing deadline in the policy form and any associated schedule or endorsement.
- Faulty maintenance / neglect / wear-and-tear style exclusions: require the denial to identify the specific deficiency, the applicable standard, and the causal link to the claimed loss.
- Technical inspection standards: if the denial cites an engineering or industry standard, verify the actual requirements of that standard and whether the reported facts satisfy them.
- Business interruption waiting period: compare the shutdown duration and restoration timeline to the waiting period and related measurement provisions.
- Mitigation duty: assess whether the insurer identifies realistic mitigation steps rather than asserting in general terms that losses could have been reduced.
- Compliance-order interaction: if a government or regulator order affects shutdown, remediation, or reopening, assess whether the order is an independent loss driver, a causation modifier, or a mitigation constraint.
- Bad faith: evaluate whether the denial ignores material policy language, applies standards inconsistently, or advances untenable positions; cite the governing statute, regulation, or common-law doctrine for the jurisdiction being applied.

## 4. Analytical scaffolds
1. For each denial ground, identify the ground, the governing policy language, the record support, the legal weakness, the counter-argument, and the downstream effect on coverage.
2. For each exclusion, test the exclusion first, then any exception, carveback, or ensuing-loss theory that may restore coverage.
3. For any timing defense, build a chronology from incident, discovery, notice, proof of loss, investigation, and denial; then assess whether the insurer's position fits that sequence.
4. For any causation defense, distinguish among initiating cause, concurrent cause, intervening cause, and damage consequence; then tie each to the operative policy wording.
5. For any maintenance or inspection argument, identify the precise standard invoked, the reported condition, the deficiency alleged, and the causal bridge to the claimed damage.
6. For BI issues, verify the covered interruption period, the waiting period, the measurement method, and the relation between physical damage, shutdown, and claimed income loss.
7. For mitigation issues, identify what the insurer says could have been done, whether the record shows it was feasible, and whether the policy actually imposes that duty in the stated form.
8. For any inconsistency issue, compare the insurer's characterization across documents and explain how the alternative characterization affects coverage analysis.
9. For any bad-faith issue, tie the denial conduct to the governing legal standard and note the specific factual basis that could support or defeat exposure.
10. Conclude each issue with: the governing rule, the key cross-reference, and the practical consequence for coverage, valuation, or litigation posture.

## 5. Vertical / structural / temporal relationships
- Map the sequence from pre-loss condition, incident, immediate response, notice, investigation, remediation, reopening, and final denial.
- Separate direct physical damage from consequential loss, cleanup or remediation effects, compliance-driven shutdown, and BI impacts.
- If the record contains multiple dates for the same event, resolve them chronologically before drawing a coverage conclusion.
- If the same subject appears in multiple documents under different labels, treat the label conflict as a substantive issue, not a drafting nuisance.
- If the denial depends on a technical report, align the report's assumptions with the underlying maintenance records and inspection history.
- If a compliance order changes the operational timeline, assess its effect on mitigation, BI duration, and any causation defense.

## 6. Output structure conventions
- Write a coverage analysis memorandum organized by denial ground, with each issue presented in the same internal sequence: issue, governing rule, record fit, weakness, counter-argument, consequence, and recommended action.
- Use a clear severity label for each issue on a uniform ordinal scale defined once at the top of the memorandum.
- When multiple policies, coverages, periods, or loss theories are in play, list them up front and analyze each in turn rather than collapsing them into a single generalized discussion.
- For each issue, include the relevant scale or duration from the record, the related document cross-reference, and the practical consequence for the insured.
- Include a concluding section that synthesizes the strongest coverage arguments and the most material vulnerabilities in the denial.
- End with a Recommended Actions block that assigns each next step to a responsible role and gives a timing anchor tied to the claim process, investigation status, or any policy deadline.
- Cite the controlling authority for every legal proposition relied on, using the governing statute, regulation, rule, or case name and section where applicable.
