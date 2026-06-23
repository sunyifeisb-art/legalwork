---
name: analyze-gdpr-amendment-impact-on-data-processing-agreement-portfolio
task_id: data-privacy-cybersecurity/analyze-gdpr-amendment-impact-on-data-processing-agreement-portfolio
description: Portfolio-level data processing agreement amendment impact analyses fail when the agent assesses each agreement in isolation rather than systematically mapping every new or amended obligation across the portfolio and the agreement register matrix.
activates_for: [planner, solver, checker]
---

# Skill: Analyze GDPR Amendment Impact on Data Processing Agreement Portfolio — Regulatory Gap Analysis Memorandum

## 1. Subject-matter triage

Identify the controlling source set before analysis: the amendment summary, the agreement register or inventory, each in-scope DPA, and any board memo, audit report, or supporting reference that constrains scope or prioritization. Enumerate the in-scope agreements explicitly first, then assess each one separately; do not collapse the portfolio into a generic “typical DPA” review. Use the register as the inventory source of truth unless the task materials clearly state otherwise.

## 2. Failure modes the skill is correcting

- Reading only the amendment summary and a subset of agreements, which misses counterparty-specific gaps.
- Treating the portfolio as one homogeneous contract set instead of mapping each amended obligation to each in-scope agreement.
- Ignoring the register or inventory matrix and accidentally including out-of-scope agreements or missing in-scope ones.
- Reporting descriptive observations without tying each issue to a source provision, a cross-document interaction, and a practical consequence.
- Producing a flat narrative instead of a board-ready memo with ordinal severity, remediation priority, and clear next steps.
- Failing to distinguish immediate repapering issues from items that can wait for renewal or be handled operationally.

## 3. Legal frameworks / domain conventions that apply

- GDPR Article 28 sets the baseline processor-contract requirements; each amendment should be tested against the Article 28 allocation of controller/processor responsibilities.
- Depending on the amendment summary, also test for implications under GDPR Articles 5, 6, 12–22, 24, 25, 30, 32, 33, 35, 37, 44–49, and 82 where the change touches processing purpose, data subject rights, security, records, breach response, DPIAs, transfers, or liability.
- Supervisory guidance or amendment updates may affect sub-processor controls, international transfers, breach notice windows, assistance obligations, retention, audit rights, or deletion/return mechanics.
- Contract portfolio conventions matter: renewal date, governing law, processing scope, and counterparty status affect whether remediation should be by addendum, next-cycle re-papering, or operational update.
- If the source set uses a lead-authority or one-stop-shop framing, assess whether the amendment’s regulatory logic is likely to propagate across jurisdictions represented in the portfolio.
- Use an ordinal severity scale defined once and apply it consistently across all issues; keep the scale simple and board-readable.

## 4. Analytical scaffolds

- First list every in-scope agreement from the register or inventory, with enough identifiers to distinguish counterparties and timing.
- Extract each amendment obligation from the summary as a discrete item: what changed, who it affects, and when it takes effect.
- For each obligation, review each agreement against the new requirement and classify the current position as compliant, partially compliant, or non-compliant.
- For every issue, capture three things in one entry: the scale of the gap using source-document facts, the intersecting clause or supporting document that changes the analysis, and the consequence if left unremediated.
- Where the source set provides dates or lifecycle markers, use them to separate immediate outreach from renewal-based remediation.
- Where audit findings or prior compliance notes exist, treat overlapping gaps as severity-enhancing because they may indicate a broader control weakness.
- Convert the analysis into a matrix that can drive action, not just description.

## 5. Vertical / structural / temporal relationships

- Agreement timing is often dispositive: near-expiry agreements may be better fixed at renewal than through standalone amendments.
- If an amendment touches sub-processing, transfer, security, or breach-response language, test whether the relevant clauses actually flow through the full processing chain or stop at a predecessor contract.
- If the board memo or audit report narrows priority to certain jurisdictions, processing activities, or counterparties, preserve that hierarchy in the final prioritization.
- Later documents may supersede earlier ones; confirm whether the amendment summary, audit report, or side letter changes the operational baseline for a given agreement.
- Cross-document issues should be traced through the contract hierarchy, not assumed from one clause in isolation.

## 6. Output structure conventions

- Write a board-ready gap analysis memo in conventional memo form: short executive summary, methodology/source set, key findings, prioritized remediation, and concise closing.
- Define severity once near the top using an ordinal scale such as Critical / High / Medium / Low, then apply it uniformly to every finding.
- Include a portfolio-level overview that highlights the most serious gaps, the recurring themes, and the agreements most affected.
- Include a clear issue matrix or annex for each agreement and each amended obligation, with columns for: obligation, agreement, current status, gap, severity, consequence, and recommended remediation path.
- End with an explicit Recommended Actions section that uses imperative verbs, names the responsible role where discernible from the source set, and ties each action to a deadline, renewal point, or immediate urgency.
- Keep the memo board-ready: concise, action-oriented, and suitable for circulation without additional editing.
- If a filename is specified, deliver the memo under that exact filename.
