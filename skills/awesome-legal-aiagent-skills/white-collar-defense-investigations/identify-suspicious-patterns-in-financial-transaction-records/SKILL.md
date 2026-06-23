---
name: identify-suspicious-patterns-in-financial-transactions
task_id: white-collar-defense-investigations/identify-suspicious-patterns-in-financial-transaction-records
description: Issue memorandum identifying suspicious transaction patterns for a white-collar internal investigation, covering related-party payment structures, trading activity around nonpublic information, foreign-official payment issues, internal controls failures, and transaction structuring concerns.
activates_for: [planner, solver, checker]
---

# Skill: Identify Suspicious Patterns in Financial Transaction Records — Issue Memorandum

## 1. Subject-matter triage
- Start by mapping the record set into transaction families: success fees and intermediaries, securities trades, government-related payments, approval/control exceptions, and split or threshold-adjacent payments.
- Identify the relevant actors, entities, accounts, dates, and business events before drawing conclusions.
- If only one transaction family is present, say so explicitly and analyze only that family; otherwise, treat each family as a separate issue and do not blend them.

## 2. Failure modes the skill is correcting
- Stopping at a suspicious payment label without connecting payment structure, recipient control, timing, and business purpose.
- Describing trading activity without tying it to the trader’s access to material nonpublic information and the timing of the trades.
- Treating a payment as a facilitation payment without testing whether the official’s act was ministerial or discretionary.
- Not separating a compliance-control failure from the substantive misconduct that the control may have enabled.
- Missing structuring where individual payments sit below a review or reporting threshold but the pattern reveals evasion.
- Failing to quantify the issue against the source record, cross-reference interacting documents, or state the downstream exposure.
- Issuing conclusions without naming the governing legal rule or authority.
- Omitting concrete next steps that assign responsibility and timing.

## 3. Legal frameworks / domain conventions that apply
- **Related-party or diverted payment analysis:** look for undefined milestones, no documented deliverables, round or arbitrary amounts, bypassed vendor review, unexplained intermediaries, and a payment chain that ends with an insider-controlled or related entity.
- **Insider trading theories:** analyze both classical and misappropriation theories by asking what material nonpublic information existed, who possessed it, when they learned it, and whether trading occurred while in possession of that information; apply **SEC v. Texas Gulf Sulphur Co.** and **United States v. O’Hagan** as the core doctrinal anchors, together with Exchange Act **Section 10(b)** and Rule **10b-5**.
- **FCPA facilitation-payment exception:** apply the narrow exception in **15 U.S.C. § 78dd-1(b)**, **§ 78dd-2(b)**, or **§ 78dd-3(b)** only to ministerial, nondiscretionary acts; discretionary actions such as contract awards, license grants requiring judgment, or bidder selection do not qualify.
- **Compliance approval controls:** evaluate whether internal policy required legal, compliance, or senior-officer approval for higher-risk payments or third-party arrangements, and treat bypass as an internal-controls failure even if the underlying payment is not independently unlawful.
- **Structuring concerns:** repeated payments broken into smaller tranches to avoid a threshold, review step, or reporting trigger are suspicious even where each component is individually plausible.
- **Internal-controls framing:** where controls are material to the transaction path, assess failure through the lens of documented approvals, segregation of duties, escalation, and exceptions to standard vendor or payment workflows.
- Cite the controlling statute, rule, regulation, or recognized doctrine whenever stating the legal significance of the facts.

## 4. Analytical scaffolds
1. **Transaction family inventory:** enumerate all distinct transaction families, counterparties, accounts, and relevant periods before analysis.
2. **Success-fee or intermediary analysis:** for each payment stream, ask whether there is a documented milestone, deliverable, or transaction event; if not, state the missing basis and how the payment was sized.
3. **Ownership / control connection:** identify whether the recipient is owned or controlled by an insider or related person, and tie that connection to a source document or record.
4. **Payment-chain tracing:** follow funds through each intermediate entity or account to the ultimate recipient and note any unnecessary layering.
5. **Trading analysis:** for each securities trade, identify the information possessed, the acquisition date of that information, the trade date, and the announcement or market event that followed.
6. **Government-payment analysis:** for each foreign-official or government-context payment, ask whether the act was ministerial or discretionary and whether any exception can plausibly apply.
7. **Control-failure analysis:** test whether required approvals, reviews, certifications, or escalations were bypassed, waived, or not documented.
8. **Structuring analysis:** compare payment amounts, timing, and repetition to applicable thresholds or review triggers and flag patterns of slicing or repetition.
9. **Issue closure:** for each issue, quantify scale from the record, cross-reference the interacting document or process, and state the client consequence.

## 5. Vertical / structural / temporal relationships
- Timing is often dispositive: compare payment dates to business milestones, approvals, regulatory actions, public announcements, or trading windows.
- Compare the front-end decision path with the back-end payment path; gaps between approval and execution often reveal control weakness or concealment.
- When a payment moves through multiple entities, describe the sequence in order and note where the transaction departs from ordinary vendor or treasury flow.
- If the record shows repeated conduct over time, organize the memorandum chronologically within each issue so the pattern is visible.

## 6. Output structure conventions
- Deliver an issue memorandum, not a narrative summary.
- Use a short severity legend at the top with a uniform ordinal scale such as Critical / High / Medium / Low.
- Organize the body by legal theory or transaction family, with one issue per discrete pattern.
- For each issue, include:
  - a concise issue heading;
  - factual description of the suspicious pattern;
  - key transaction details with dates, entities, and amounts from the record;
  - the governing legal rule or doctrine with authority named;
  - severity rating from the stated ordinal scale;
  - quantified exposure or scale drawn from the source record;
  - cross-reference to the interacting document, approval path, account trail, or related transaction;
  - downstream consequence for the client, including regulatory, civil, criminal, or operational exposure as applicable;
  - recommended next investigative steps.
- Include a summary table covering suspicious transactions by entity, counterparty, date range, and legal theory, with a brief status note for each row.
- Close with a Recommended Actions section that uses imperative verbs, assigns the responsible role or function, and ties each action to an immediate milestone or relative urgency from the record.
- Keep conclusions tied to the documents; where facts are incomplete, say what additional record is needed rather than filling the gap.
