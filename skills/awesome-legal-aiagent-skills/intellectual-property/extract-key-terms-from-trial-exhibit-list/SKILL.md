---
name: extract-key-terms-trial-exhibit-list
task_id: intellectual-property/extract-key-terms-from-trial-exhibit-list
description: Cross-referencing a joint trial exhibit list against pretrial filings to identify discrepancies, authentication risks, and corrective actions before trial, using the governing pretrial materials and related procedural orders.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Trial Exhibit List

## 1. Subject-matter triage

Identify the governing trial-preparation documents first: the joint exhibit list, final pretrial order, witness lists, claim construction order, and any standing or scheduling order controlling exhibit handling. Treat those documents as the source set for a discrepancy review, not as independent summaries of trial themes.

If more than one exhibit list or witness list is present, enumerate each version and determine which is operative before comparing entries. If only one version exists, say so expressly and proceed on that basis.

## 2. Failure modes the skill is correcting

- Reading the exhibit list alone and missing conflicts with the pretrial order or other trial-management filings
- Treating all listed exhibits as equally admissible without separating stipulated items from items needing a sponsor or foundation
- Overlooking numbering, description, or category mismatches that create trial-day confusion
- Missing exhibit-specific risks tied to authentication, hearsay, relevance, or claim-construction consistency
- Failing to track whether objections were preserved or waived under the governing order
- Producing observations without turning them into concrete corrective steps tied to the trial schedule

## 3. Legal frameworks / domain conventions that apply

- Final pretrial orders generally control the trial exhibit universe; omitted items usually require leave or good cause under the governing civil procedure framework
- Standing or scheduling orders may control exhibit formatting, numbering, exchange deadlines, pre-admission procedures, and objection timing
- Federal Rule of Evidence 901 governs authentication; Federal Rules of Evidence 402 and 403 govern relevance and prejudice; Federal Rule of Evidence 802 governs hearsay unless an exception applies
- Federal Rule of Civil Procedure 16 governs pretrial management and enforcement of pretrial orders
- Claim construction orders constrain how trial exhibits may be used when they implicate construed terms
- Witness sponsorship matters: a non-stipulated exhibit ordinarily requires a witness able to authenticate or otherwise lay foundation
- Stipulated exhibits are treated differently from disputed exhibits; the report should keep those categories separate
- Objection deadlines in the governing order matter; late objections may be forfeited, while timely objections preserve the issue for trial

## 4. Analytical scaffolds

1. Build a master exhibit index from the joint trial exhibit list.
2. Compare each exhibit against the final pretrial order to confirm whether it is identified, described consistently, and assigned to the correct side or category.
3. Compare each exhibit against any standing or scheduling order for numbering, formatting, exchange, and pre-admission requirements.
4. Compare each exhibit against the witness lists to determine whether a sponsor exists for each non-stipulated exhibit.
5. Compare exhibits that implicate claim terms or technical concepts against the claim construction order for consistency with adopted meanings.
6. Separate stipulated exhibits from disputed exhibits and assess whether the list clearly signals that distinction.
7. Flag exhibits that appear to lack authentication support, a hearsay pathway, or a relevance theory under the governing evidence rules.
8. Identify any exhibit-position or description mismatch that could create confusion at trial, even if the exhibit is otherwise admissible.
9. For each issue, state the controlling authority or governing order supporting the risk assessment.
10. Convert each discrepancy into a corrective action that names the responsible actor and the timing anchor tied to the pretrial or trial deadline.

## 5. Vertical / structural / temporal relationships

Where the same exhibit appears across multiple filings, assess the relationship among the documents in this order: governing order, pretrial order, witness list, then exhibit list. Use the later-drafted trial management documents to identify operational obligations, but use the pretrial order and standing order to determine whether the exhibit may be used at trial.

If the source set includes multiple filing dates or revisions, track whether the exhibit treatment changed over time and whether the change appears intentional, clerical, or unresolved. Mark any unresolved progression as a trial-prep risk.

## 6. Output structure conventions

- Produce a discrepancy, risk, and corrective-action report in conventional issue-report form
- Open with a short scope note identifying the governing source documents reviewed and any operative-version assumptions
- Include a legend defining an ordinal severity scale, and apply it consistently to every entry
- Organize findings by issue type, such as pretrial-order compliance, exhibit-format compliance, witness sponsorship, claim-construction consistency, authentication or admissibility risk, and objection-timing risk
- For each entry, include the exhibit identifier, a concise description, the discrepancy or risk, the controlling authority or governing order, the downstream trial consequence, the severity rating, and the corrective action with a timing anchor
- When a source document supplies a deadline or sequence, use it; otherwise, anchor the action to the next pretrial milestone or trial start
- Include a summary table that groups all flagged exhibits by severity and issue type
- End with an explicit Recommended Actions section listing the steps to cure or mitigate the highest-risk items, assigned to the relevant role and tied to the governing timetable
