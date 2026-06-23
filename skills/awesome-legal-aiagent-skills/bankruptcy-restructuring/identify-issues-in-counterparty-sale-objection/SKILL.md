---
name: identify-issues-in-counterparty-sale-objection
task_id: bankruptcy-restructuring/identify-issues-in-counterparty-sale-objection
description: Ensures a sale objection analysis applies the governing legal standard to each argument, checks contract-based cure-period and damages issues against the operative agreement and applicable law, evaluates break-up fee objections under the appropriate business-judgment framework, analyzes insider allegations under the relevant insider definition, assesses standing, and contextualizes any requested delay against the transaction timeline and financing milestones.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Counterparty Sale Objection

## 1. Subject-matter triage (only if applicable)

- Use this skill when the source set includes a debtor sale motion under Section 363, supporting sale documents, and a counterparty objection that must be broken down argument by argument.
- First isolate the objection arguments in the order they are made, then map each one to the corresponding sale-motion fact, exhibit, contract term, or timeline event.
- If the objection raises multiple parties, periods, contracts, or milestones, enumerate them before analysis and treat each as a separate issue track rather than collapsing them into one generalized response.

## 2. Failure modes the skill is correcting

- The memo summarizes the objection but does not test each point against the controlling bankruptcy or contract standard.
- The analysis describes alleged harm without tying it to the operative agreement, sale motion, cure package, or closing timeline.
- The memo accepts asserted damages, cure amounts, or delay prejudice without checking them against the source documents and governing law.
- The analysis ignores standing, insider status, or the practical effect of requested delay on closing or financing milestones.
- The response strategy is generic and does not tell the reader what the debtor should say, concede, narrow, or preserve.
- The memo states conclusions without naming the rule, statute, or leading authority that supports them.

## 3. Legal frameworks / domain conventions that apply

- Section 363 sale process: Sale objections should be analyzed against the debtor’s business-reasoned sale process, the evidentiary support for market check and notice, and the court’s role in approving a maximized-value transaction. Cite 11 U.S.C. § 363 and the relevant sale-order authorities as applicable.
- Contract assumption and cure issues: Compare the objection’s contract-based complaint to the operative agreement, the cure notice, and 11 U.S.C. §§ 365(b) and 365(f), including adequate assurance and cure requirements.
- Damages and cure amount disputes: Verify alleged amounts against the contract’s damage provisions, limitation clauses, offsets, exclusions, and any supporting schedule or claim documentation; do not assume the objector’s math is correct.
- Break-up fee / expense reimbursement objections: Evaluate any challenge under the business judgment standard and applicable bankruptcy-sale precedent, not by hindsight preference.
- Insider allegations: Test buyer or related-party allegations against the Bankruptcy Code’s insider definition, 11 U.S.C. § 101(31), and the factual record.
- Standing to object: Confirm the objector has a pecuniary interest affected by the sale order or the challenged relief.
- Delay and urgency: Assess whether the requested continuance or expanded process would jeopardize closing, financing, employee retention, or other transaction milestones identified in the source set.
- Debtor discretion: Measure any argument that the debtor was required to assume, reject, market differently, or accept a different cure path against the debtor’s statutory discretion and the sale record.

## 4. Analytical scaffolds

- Start with a numbered inventory of every distinct objection argument, in the order presented in the objection.
- For each issue, use the same sequence:
  - Controlling authority
  - Application to the source documents
  - Severity
  - Merit assessment
  - Response strategy
- For each issue, close the analysis by doing all three of the following:
  - Scale the issue against a source-document figure, term, deadline, or transaction milestone;
  - Cross-reference the clause, schedule, motion section, exhibit, or other document that interacts with the issue;
  - State the downstream consequence for the estate, bidder, objector, creditors, or closing process.
- If the source set provides only one relevant contract, claim, buyer, or timeline, say so explicitly and explain why no parallel track is needed.
- Do not present bare assertions of overstatement, insider status, or unfairness; tie them to the operative facts and the controlling rule.
- When a requested delay appears in the objection, analyze both legal merit and transaction prejudice, including whether it collides with financing, closing, or order-entry timing.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track how the objection interacts vertically across documents: objection text → sale motion → exhibit or purchase document → cure notice → claim or schedule → proposed order.
- Track how a single issue changes over time: notice period, objection deadline, hearing date, bid deadline, closing date, and any financing milestone.
- Where the source documents contain competing numbers or descriptions, identify the controlling version and explain why it governs.
- If the objection attacks a breakup fee, insider relationship, or damages figure, relate the challenged item to the broader transaction structure rather than treating it as standalone.
- If the requested relief would slow the sale, state the practical effect on bidder certainty, stalking-horse protection, or estate value.

## 6. Output structure conventions

- Produce an issue memorandum organized by objection argument, not a narrative summary.
- Define a simple ordinal severity scale once and apply it uniformly to every issue, such as:
  - Critical: likely to alter sale approval or closing timing materially
  - High: substantial legal or transaction risk
  - Medium: arguable issue with limited expected impact
  - Low: weak issue or mainly preserve-for-appeal point
- For each issue, include:
  - Issue title
  - Severity
  - Governing authority
  - Short statement of the objection argument
  - Application to the source documents
  - Merit assessment
  - Debtor response strategy
- Make the response strategy specific: identify whether to oppose, narrow, supplement the record, reserve, or concede only a limited point.
- Include a short strategic context section at the end covering transaction urgency, risk from delay, and the strongest proactive points for the debtor.
- End with a Recommended Actions block that assigns the next step to the responsible role and ties it to the hearing, filing, or closing milestone in the source set.
