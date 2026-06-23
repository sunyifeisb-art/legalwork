---
name: its-extract-penalty-factors-ofac-ppn
task_id: international-trade-sanctions/extract-penalty-factors-from-ofac-pre
description: Produces a penalty assessment memorandum from an OFAC Pre-Penalty Notice that identifies potential duplicate or phantom transactions to test the violation count, assesses the transition from constructive to actual knowledge, evaluates statute-of-limitations defenses for early transactions, flags criminal referral risk, and develops a penalty-range analysis.
activates_for: [planner, solver, checker]
---

# Skill: Extract Penalty Factors from OFAC Pre-Penalty Notice

## 2. Failure modes the skill is correcting

- Accepting the notice's violation count or transaction list without independently reconciling each listed entry to the source records, including possible duplicates, phantom entries, or mismatches that alter the penalty base
- Treating knowledge as static rather than identifying the specific document or communication that marks the shift from constructive notice to actual knowledge, which changes how pre- and post-notice conduct should be analyzed
- Failing to test the earliest listed conduct against the applicable civil limitations period and preserve time-bar defenses where available
- Repeating the agency’s penalty arithmetic without checking the implied per-violation amount, methodology, or any undisclosed adjustment
- Omitting criminal-referral and individual-exposure implications when the record suggests continued conduct after actual knowledge
- Presenting conclusions without tying each one to the governing statutory or regulatory authority
- Producing diagnosis without a practical penalty-range view or next-step recommendations

## 3. Legal frameworks / domain conventions that apply

- Verify each listed transaction against the company’s shipping, payment, trade, and internal approval records; duplicates, phantom entries, or unsupported items may be challenged under the record evidence rather than assumed as violations
- Identify the point at which the record shows actual knowledge, as distinct from constructive knowledge, and separate the analysis for conduct before and after that date
- Test the earliest conduct against the applicable civil statute of limitations under the sanctions-enforcement regime; if any item is outside the cutoff, flag it as a time-bar defense and keep the issue separate from merits arguments
- Check the agency’s penalty calculation for arithmetic consistency, unit assumptions, and any unexplained adjustment; a mismatch can materially change the penalty range
- Assess whether the facts raise criminal-referral risk where personnel appear to have actual awareness and the conduct continued; consider privilege, document preservation, and individual-exposure implications
- Consider ability-to-pay arguments only to the extent supported by financial records and tie them to the penalty recommendation
- Cite the controlling authority for each legal proposition relied on, including the governing sanctions statute, implementing regulations, penalty provisions, and any authority defining knowledge, limitations, or enforcement discretion

## 4. Analytical scaffolds

1. Enumerate the disputed transaction set before analysis: list each claimed violation, then reconcile each item to the supporting records and identify duplicates, unsupported entries, and time-bar candidates
2. Identify the document or communication that most clearly establishes actual knowledge; split the transaction set into pre-actual-knowledge and post-actual-knowledge groups and analyze them separately
3. For the earliest transactions, determine the limitations cutoff under the applicable civil statute and test each item against that date
4. Recalculate the proposed penalty using the agency’s stated methodology; compare the implied per-violation amount to the documented approach and flag any discrepancy
5. Apply the relevant OFAC factors framework to each transaction group, with separate treatment for knowledge state, remedial response, and compliance posture
6. Assess criminal-referral risk from the record, including whether individuals were aware of the conduct and whether it continued after notice
7. Assess ability-to-pay only from available financial information and explain how it affects settlement posture
8. Develop alternative penalty scenarios based on corrected counts, time-bar exclusions, knowledge boundaries, and any documented mitigation or aggravation

## 5. Vertical / structural / temporal relationships

- Treat transaction chronology as outcome-determinative: the sequence of conduct, notice, escalation, and response matters
- Separate internal-record verification from legal characterization; an item can be disputed on evidentiary grounds even if the agency characterizes it as a violation
- Distinguish conduct before actual knowledge from conduct after actual knowledge, because the same transaction type may carry different penalty implications depending on timing
- Keep statute-of-limitations analysis separate from duplication analysis; each defense affects the penalty base differently
- If the record contains more than one plausible knowledge date or more than one transaction group, analyze each explicitly rather than collapsing them into a single representative pass
- Where the source set supports only one relevant knowledge date, say so affirmatively and explain why it is the operative boundary

## 6. Output structure conventions

- Draft a penalty assessment memorandum, not a generic issues list
- Open with a short executive summary that states the challenged violation count, the principal legal defenses, and a penalty-range view
- Define an ordinal severity scale once near the top and apply it uniformly to each issue discussed
- For each issue, state: the agency’s position, the challenge basis, the governing authority, the scale of the issue, the record cross-reference, and the downstream consequence
- Include separate sections or subsections for violation-count integrity, knowledge boundary, limitations defense, penalty-calculation check, criminal-referral risk, ability-to-pay, and overall settlement posture
- Close with a Recommended Actions block that gives imperative next steps, assigns each to a responsible role, and includes a timing anchor tied to the response deadline or enforcement milestone
- Use alternative penalty calculations where the record supports them, but do not preload scenario-specific amounts or arithmetic outside the source-record analysis
- Keep the memo self-contained and ensure every legal conclusion is anchored to named authority rather than conclusory assertion
