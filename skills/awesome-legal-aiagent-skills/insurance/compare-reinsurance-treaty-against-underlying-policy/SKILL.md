---
name: compare-reinsurance-treaty-underlying-policy-gap
task_id: insurance/compare-reinsurance-treaty-against-underlying-policy
description: Agents comparing a reinsurance treaty against the underlying policy should treat the work as a structured gap analysis, quantify any unrecovered share for relevant loss categories where treaty limitations reduce recovery below the underlying policy treatment, and analyze how a per-occurrence cap interacts with current loss development.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis Memorandum — Reinsurance Treaty vs. Underlying Commercial Property Policy

## 1. Subject-matter triage

- Treat the assignment as a comparison of the treaty, the underlying policy, and the loss record, not as a standalone contract interpretation exercise.
- Separate issues that affect coverage scope from issues that affect recovery mechanics, reporting, or credit for reinsurance.
- If the source set contains more than one loss event, claim period, or development scenario, enumerate them first and analyze each separately.

## 2. Failure modes the skill is correcting

- The comparison stays qualitative and never measures the cedant’s retained exposure where the treaty is narrower than the underlying policy.
- The per-occurrence limit is noted but not tested against the actual loss profile or later development.
- Divergences between placement materials and final treaty text are ignored instead of being framed as potential broader-coverage arguments.
- Procedural limits in claims-handling, insolvency, or reporting provisions are treated as boilerplate even though they can change recoverability and statutory credit.
- The memorandum identifies a gap but does not tie it to a concrete downstream consequence for coverage, reserving, settlement, or administration.

## 3. Legal frameworks / domain conventions that apply

- Compare the treaty and underlying policy clause-by-clause, using the treaty’s own definitions, exclusions, and financial terms as the operative benchmark.
- Follow-the-fortunes and follow-the-settlements: identify the governing language and analyze the level of deference owed to coverage and settlement decisions under the applicable formulation.
- Occurrence and aggregation: compare the treaty’s occurrence definition, hours clause, or temporal aggregation language to the underlying policy’s treatment and assess whether the mismatch changes the number of occurrences, retention application, or cap usage.
- Limit analysis: when a treaty cap, sublimit, or retention is implicated, measure it against the current loss record and the plausible development range to determine when the limit binds.
- Sue-and-labor, debris removal, business interruption, and other ancillary coverages: test whether the treaty expressly mirrors the underlying policy treatment, is silent, or narrows recovery.
- Insolvency and claims-handling provisions: evaluate how submission deadlines, proof requirements, and notice mechanics affect enforceability and statutory reinsurance credit.
- Placement materials: if pre-binding documents use broader language than the treaty, treat the mismatch as a potential ambiguity or reformation argument, subject to the final contract language and parol-evidence rules applicable to the governing law.
- Apply the governing law, treaty article, statute, or generally recognized reinsurance doctrine that supports each conclusion; do not state conclusions without anchoring them in the operative authority.

## 4. Analytical scaffolds

1. Start with a document map: identify the treaty provisions, the matching underlying-policy provisions, and the loss documents that actually drive the exposure.
2. Build an issue table by category: coverage scope, exclusions, definitions, financial terms, and procedural provisions.
3. For each issue, close the analysis in three steps:
   - quantify the exposure using the source record or state the threshold the issue turns on;
   - cross-reference the interacting clause, schedule, endorsement, or loss document;
   - state the downstream consequence for the cedant, reinsurer, or claims process.
4. For each limitation or exclusion, compare the underlying policy’s broader treatment to the treaty’s narrower text and state the cedant’s retained exposure where the record permits.
5. If the record supports it, show the unrecovered share by loss category or cost bucket; if it does not, state what additional inputs are needed rather than guessing.
6. For business interruption or time-element coverage, compare how the underlying policy measures the loss against how the treaty responds to that same component.
7. For occurrence and aggregation issues, test both the treaty definition and any timing or causation language against the loss chronology.
8. For per-occurrence or aggregate limits, identify the binding threshold and explain the development scenario that causes the limit to be reached or exhausted.
9. For follow-the-fortunes or settlements language, explain whether it covers only completed settlements, extends to reserved claims, or is otherwise cabined by the text.
10. For sue-and-labor, debris removal, and similar ancillary items, identify express inclusion, exclusion, or silence, and flag partial treatment as an ambiguity.
11. For insolvency or claims-submission provisions, compare the filing window and procedural requirements to ordinary market practice and explain the effect on recovery and statutory credit.
12. For placement-slip conflicts, identify the broader pre-treaty wording, compare it to the final treaty, and assess whether the conflict supports a broader-reading argument.
13. End each issue with a targeted recommendation tied to the clause or drafting point that should be revised.

## 5. Vertical / structural / temporal relationships

- Track how the treaty sits above or beside the underlying policy: a narrower treaty can leave a retained layer even where the underlying policy responds.
- Track how one clause interacts with another: definition language can alter exclusions, aggregation can alter retentions, and procedural deadlines can affect substantive recovery.
- Track time carefully: notice, proof, submission, insolvency filing, and development windows can change the practical value of otherwise available recovery.
- If multiple loss periods or development snapshots exist, compare them in sequence so the memo shows how exposure changes over time rather than freezing it at one point.

## 6. Output structure conventions

- Produce a gap-analysis memorandum in conventional legal-memo form, not a clause chart alone.
- Open with a short issue summary and a severity legend using an ordinal scale such as Critical / High / Medium / Low; apply the same scale to every issue.
- For each issue, use a consistent subheading that includes: issue name, severity, source clauses, and a short conclusion.
- Under each issue, state:
  - the treaty language at issue and the matching underlying-policy or loss-document language;
  - the quantified exposure or governing threshold, if the record permits;
  - the interacting clause or document that changes the analysis;
  - the practical consequence for coverage, retention, administration, settlement, or reinsurance credit.
- Include a dedicated section for quantified exposure analysis showing unrecovered amounts or thresholds where the source record supports the calculation.
- Include a separate section for per-occurrence limit analysis with development scenarios and the point at which the limit binds.
- If placement materials conflict with the final treaty, address that conflict in its own issue entry.
- End with a Recommended Actions section that uses imperative verbs, names the responsible role, and ties each step to a deadline, milestone, or immediate next action.
- Keep the memo concise but complete; prefer issue-driven prose with embedded calculations over long background discussion.
