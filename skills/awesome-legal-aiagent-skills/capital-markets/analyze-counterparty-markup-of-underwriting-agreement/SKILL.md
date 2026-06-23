---
name: analyze-counterparty-markup-of-underwriting-agreement
task_id: capital-markets/analyze-counterparty-markup-of-underwriting-agreement
description: Redline analysis where the baseline omits a systematic risk-shift narrative, issue severity ratings, and the playbook-grounded rationale needed for a negotiation-ready memo.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Underwriting Agreement

## 1. Subject-matter triage

- Read the firm playbook before the counterparty markup so the benchmark positions are fixed before any issue spotting.
- Treat the original issuer draft as subordinate to the playbook where they differ.
- If the source set contains multiple versions, identify the controlling draft sequence before comparing text.
- If only one underwritten transaction is in scope, state that explicitly and analyze it as a single integrated markup.

## 2. Failure modes the skill is correcting

- Baseline paraphrases the counterparty's changes in neutral terms instead of characterizing each change as favorable or adverse to the issuer relative to the firm's playbook position.
- Baseline surfaces individual issues but omits a closing pattern analysis that assesses whether the redline reflects a systematic strategy of risk-shifting to the issuer.
- Baseline does not assign a severity rating or a disposition to each issue, leaving the partner without a negotiation prioritization framework.
- Baseline stops at description and does not tie each issue to the transaction economics, related provisions, or downstream consequences.
- Baseline under-specifies redlines in a way that can be lost on export instead of making each change readable from the text alone.

## 3. Legal frameworks / domain conventions that apply

- Firm-commitment vs. best-efforts: an unqualified termination right can materially alter the agreement's risk allocation; market practice is to limit termination to objectively defined systemic disruption events.
- Indemnification scope and cap: market practice is to cap the issuer's indemnification obligation at gross offering proceeds and to exclude losses attributable to information furnished by the underwriter for inclusion in the prospectus.
- Indemnification trigger language: an obligation triggered by alleged rather than adjudicated liability can shift defense-cost timing to the issuer before fault is determined; market-standard language conditions any advance on an undertaking to repay if the indemnitee is ultimately found liable.
- Representations survival: a time-limited survival is standard because it aligns with applicable securities-law limitations periods; deletion of a survival clause extends exposure beyond the usual limitations window.
- Contribution mechanics: contribution in proportion to relative benefit alone favors underwriters; adding relative fault produces a more balanced allocation.
- Overallotment option period and scope: the option period and source of shares affect pricing optionality and dilution; non-standard extensions give the underwriter additional time to make an economic decision not available to the issuer.
- Expense reimbursement: a cap on expense reimbursement is market practice; removal of the cap or expansion to all out-of-pocket expenses without limitation is non-market.
- Any legal proposition stated in the memo should be tied to the controlling doctrine, statute, rule, regulation, or generally recognized market practice that supports it.

## 4. Analytical scaffolds

- Walk each redlined provision systematically and create a numbered issue entry for every material change.
- For each issue, identify the exact textual change, then compare it to the playbook position and the original draft.
- Characterize the change as issuer-favorable, issuer-adverse, or mixed; avoid neutral paraphrase where the deviation has economic or legal direction.
- Every issue entry must include:
  - a short description of the counterparty's change;
  - the controlling playbook position;
  - the legal or economic impact on the issuer;
  - an explicit ordinal severity rating defined once and used consistently;
  - a recommended disposition for negotiation.
- Use a plain-text redline convention that survives export, so the reader can identify each change without relying on formatting alone.
- Close each issue with the scale or threshold implicated, the related clause or document interaction, and the downstream consequence for the client.
- Where a change has a quantifiable economic effect, derive it from the disclosed transaction terms; do not invent figures.
- After the issue-by-issue analysis, assess whether the redline reflects a coordinated strategy of shifting risk, cost, timing, or discretion to the issuer.
- Distinguish between provisions that are market deviations, drafting cleanups, and non-economic edits, and prioritize only the substantive items.

## 5. Vertical / structural / temporal relationships

- The preliminary prospectus or equivalent offering disclosure anchors any quantitative impact analysis.
- The underwriting agreement must be read together with related disclosure and closing deliverables when a clause cross-references them.
- Termination, indemnity, survival, contribution, expense, and option provisions should be checked for internal consistency across the agreement rather than in isolation.
- If a provision depends on another defined term, schedule, or exhibit, analyze the dependency before stating the issue.
- Temporal reach matters: survival, notice, defense, reimbursement, and option periods should be assessed against the transaction timetable and limitation horizon.

## 6. Output structure conventions

- Produce a negotiation-ready redline analysis memo.
- Open with a brief severity legend using an ordinal scale such as Critical / High / Medium / Low, defined once.
- Organize the body as numbered issue sections, one issue per material change.
- In each issue section, use compact subparts for: change observed, playbook position, issuer impact, severity, and recommended disposition.
- Use explicit plain-text markup in the analysis when helpful, such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new], and add a short [Rationale: …] note for each substantive change discussed.
- Include an overall pattern analysis section that summarizes the negotiation posture reflected in the redline and states the strategy recommendation.
- End with a Recommended Actions block stating the next steps, the responsible role, and the timing anchor tied to the transaction milestone.
- Keep the memo concise, operational, and suitable for partner review; do not reproduce the entire agreement.
- Ensure the output is tailored for a .docx memo deliverable and that the final product is the memo itself, not a draft description of the memo.
