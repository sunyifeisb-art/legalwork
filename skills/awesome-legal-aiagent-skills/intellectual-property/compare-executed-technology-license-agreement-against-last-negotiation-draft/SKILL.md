---
name: compare-executed-tla-vs-negotiation-draft
task_id: intellectual-property/compare-executed-technology-license-agreement-against-last-negotiation-draft
description: Comparative deviation report for an executed technology license agreement versus the last negotiation draft, using negotiation-summary context to identify, prioritize, and analyze differences and to frame possible remediation paths.
activates_for: [planner, solver, checker]
---

# Skill: Compare Executed Technology License Agreement Against Last Negotiation Draft

## 1. Subject-matter triage
- Treat the task as a document-to-document comparison with context reconciliation, not a generic contract review.
- Pull three inputs into the same comparison frame: the executed agreement, the last negotiation draft, and the client email/negotiation summary.
- If more than one executed or draft version appears in the source set, enumerate the versions first and compare each against the stated baseline before analyzing deviations.
- If the record contains only one executed agreement and one final draft, state that the comparison is limited to that pair and that all findings are tied to those two documents plus the contextual email materials.

## 2. Failure modes the skill is correcting
- Comparing only headline business terms while missing technical, operational, or implementation provisions that were actively negotiated.
- Treating the executed text as a standalone contract and failing to reconcile it against the negotiation summary for agreed changes, rejected proposals, or open items.
- Reporting differences without ranking them by seriousness, so material scope or economics changes are buried among clerical edits.
- Missing compound risk where one deviation alters the operation of another provision, schedule, or defined term.
- Repeating textual differences without stating whether the change appears intentional, unexplained, or inconsistent with the deal record.
- Offering diagnosis without a concrete remediation path tied to the likely source of the mismatch.

## 3. Legal frameworks / domain conventions that apply
- The executed agreement governs the parties’ rights as signed, but departures from the final draft may indicate a drafting error, an unresolved negotiation point, or a unilateral insertion requiring correction.
- License scope provisions are especially sensitive: grant language, field-of-use limits, territory, exclusivity, sublicensing, ownership, use restrictions, and reservation clauses can materially alter the deal.
- Commercial mechanics matter as much as headline price: royalty base, reporting, audit rights, payment timing, offsets, minimums, milestones, acceptance, support, warranty, indemnity, termination, and post-termination rights all affect value and enforceability.
- Operational mechanics deserve separate review: implementation duties, service levels, maintenance, security, data rights, governance, and transition assistance can shift performance risk even where economics are unchanged.
- Where the source materials include a negotiation summary, use it as the control document for intent, then test the executed text for consistency with that summary.
- Remediation options generally include amendment, clarification, corrective side letter, restatement, or targeted renegotiation, chosen according to whether the deviation is clerical, interpretive, or substantive.

## 4. Analytical scaffolds
- Provision-by-provision comparison: review the executed agreement against the final draft line by line, capturing additions, deletions, substitutions, reordered concepts, and omitted material.
- Context reconciliation: for each deviation, check the client email and negotiation summary to determine whether the change was expected, expressly agreed, left open, or never discussed.
- Severity ranking: assign each deviation an ordinal severity label using a defined scale such as Critical / High / Medium / Low, and apply it consistently across the report.
- Impact analysis: for each issue, state the practical consequence to the client, including economic, operational, regulatory, enforcement, or transaction-processing effects.
- Interaction analysis: note where a deviation interacts with another clause, defined term, schedule, or exhibit and whether the combined effect increases or offsets risk.
- Remediation analysis: identify the most plausible fix for each significant deviation and indicate whether it can be handled by documentation cleanup or requires negotiation with the counterparty.
- Record support: where the source set gives a metric, threshold, term length, quantity, or payment cadence, use it to anchor the significance of the deviation rather than describing the issue in the abstract.
- Authority support: when stating a legal proposition about contract effect or correction path, cite the controlling authority or document-based source invoked in the materials; do not state conclusions without support.

## 5. Vertical / structural / temporal relationships
- Compare the documents in chronological order: negotiation draft first, executed agreement second, then the negotiation summary and client email as intent evidence.
- Track how a change in an early definition or scope clause flows into downstream provisions that use that defined term.
- Check whether a change in a schedule, exhibit, annex, or exhibit reference silently changes the operative text in the main body.
- Identify whether the executed agreement introduces new obligations, removes negotiated protections, or shifts timing, notice, approval, or cure mechanics.
- If a later provision depends on an earlier one, analyze both together rather than as isolated edits.

## 6. Output structure conventions
- Produce a deviation report in conventional advisory form: short executive summary, severity-ranked findings, clause-by-clause comparison, context reconciliation, and a remediation roadmap.
- Start with a brief severity legend so every issue uses the same ordinal scale.
- Present each deviation as a discrete entry with: clause or subject, the textual change, severity, reconciliation with the negotiation record, interaction notes, consequence to client, and recommended fix.
- Keep the report focused on material deviations; minor stylistic edits may be noted only if they alter meaning, cross-references, or operative effect.
- For each entry, include an explicit recommended action with an imperative verb, the responsible role, and a timing anchor tied to the signing, closing, or post-signing correction window.
- If the record does not support a firm conclusion on intent, label the issue as unresolved and state the next factual check needed.
- Avoid reproducing internal-source wording verbatim except where necessary to identify the deviation; paraphrase the analysis and describe the change in plain English.
- Name the output file as `deviation-report.docx` and ensure the substance reads as a finished report rather than a note set or issue log.
