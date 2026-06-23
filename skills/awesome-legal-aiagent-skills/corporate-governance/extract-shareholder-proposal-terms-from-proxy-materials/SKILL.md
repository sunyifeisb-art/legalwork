---
name: extract-shareholder-proposal-terms-from-proxy-materials
task_id: corporate-governance/extract-shareholder-proposal-terms-from-proxy-materials
description: Agents extract shareholder proposal terms and summarize proxy materials by topic, including voting outcomes, board recommendations, prior-year history, director relationships, committee composition issues, proxy access mechanics, voting-standard implications, and related-party transaction disclosures.
activates_for: [planner, solver, checker]
---

# Skill: Governance Summary Memorandum — Shareholder Proposals and Proxy Materials Review

## 1. Subject-matter triage
- Treat the proxy statement, annexes, bylaws, governance guidelines, committee charters, and any prior-year proxy materials as one integrated record set.
- First determine whether the annual meeting materials include shareholder proposals, director elections, say-on-pay, proxy access language, resignation policies, related-party transaction disclosures, and committee membership disclosures.
- If a topic is absent, say so affirmatively rather than implying omission from the record.

## 2. Failure modes the skill is correcting
- Summaries often list proposals and vote tallies without tying each item to the board recommendation, proponent position, and any prior-year repeat proposal history.
- Director-independence analysis is often superficial and misses disclosed business, familial, advisory, or board-affiliation relationships that bear on exchange-listing independence and committee service.
- Voting-standard analysis often confuses plurality voting with majority voting or treats a resignation policy as if it were a binding electoral standard.
- Proxy access analysis often misses internal date mismatches between the governing text and the disclosure summary, creating an untimeliness risk.
- Committee analysis often fails to test disclosed compensation committee service for interlocks and related governance consequences.
- Related-party transaction review often stops at identification and does not ask whether the approval process, valuation support, and committee review were sufficiently documented.
- Engagement recommendations are often generic and do not rank issues by governance sensitivity or investor-facing risk.

## 3. Legal frameworks / domain conventions that apply
- **Proxy disclosure and annual-meeting materials:** Use the proxy statement, DEF 14A-style disclosures, bylaws, and governance documents as the governing source set for vote outcomes, recommendations, and process mechanics.
- **Director independence under exchange standards:** Evaluate nominee independence under the applicable stock-exchange listing standard and the company’s disclosed governance criteria, including material relationships that may affect committee eligibility.
- **Compensation committee interlock disclosure:** Apply the executive-compensation disclosure framework for interlocks and cross-board service; a disclosed interlock is a governance and disclosure risk even where no conflict is alleged.
- **Voting standards and resignation policies:** Distinguish plurality election mechanics from majority-vote frameworks; analyze any non-binding resignation policy under the governing disclosure standard and stated board practice.
- **Proxy access mechanics:** Read the bylaw text together with the proxy’s summary description; inconsistencies in the nomination window, eligibility conditions, or ownership thresholds can create practical rejection risk.
- **Related-party transaction governance:** Use the applicable exchange and disclosure norms requiring review of transactions involving directors, officers, and affiliated entities; note whether independent review, approval, and valuation support are described.
- **Shareholder-proposal practice:** Assess proposals against the board’s recommendation, prior-year support, and likely proxy-adviser themes commonly used in governance voting decisions.

## 4. Analytical scaffolds
- **Proposal-by-proposal extraction**
  - For each shareholder proposal, identify the proponent, proposal subject, operative terms, board recommendation, vote outcome if disclosed, and any prior-year filing or resubmission history.
  - State whether the proposal is binding or advisory, and whether the company describes any implemented action or partial response.
- **Director independence audit**
  - For each nominee, enumerate disclosed relationships with the company, its affiliates, management, or significant counterparties.
  - Test whether each relationship is the type that may impair independence under the applicable listing standard or the company’s own governance criteria.
  - Flag any nominee whose committee service appears mismatched with the disclosed relationship profile.
- **Committee composition check**
  - Identify the members of key committees and confirm whether any disclosed service implicates interlock, overboarding, or independence concerns.
  - Note whether the committee charter or governance guidelines impose additional eligibility rules.
- **Proxy access verification**
  - Extract the nomination window and procedural requirements from both the bylaw text and the proxy summary.
  - Compare the two descriptions for consistency and practical usability; identify any discrepancy that could affect a qualifying nomination.
- **Voting-standard analysis**
  - Identify the election standard and any resignation policy, then assess how the policy operates in practice if a nominee receives more withheld votes than votes in favor.
  - Distinguish legal effect from governance signaling and investor expectations.
- **Related-party transaction review**
  - Extract each disclosed transaction or relationship involving insiders or affiliates.
  - Assess whether the disclosure indicates independent review, audit committee oversight, or valuation support.
  - Flag transactions that are disclosed without enough process detail to evaluate governance robustness.
- **Engagement and voting implications**
  - Translate each issue into likely voting, engagement, or proxy-adviser sensitivity.
  - Prioritize topics that would plausibly drive negative recommendations, with attention to board responsiveness, repeat issues, and disclosure quality.

## 5. Vertical / structural / temporal relationships
- Analyze each topic across the relevant time horizon: prior year, current proxy cycle, and any stated forward-looking remediation.
- When the materials describe more than one nominee, proposal, committee, or transaction, treat each as a separate item rather than merging them into a single blended conclusion.
- Where the proxy statement and another governance document differ, identify which document is more specific for the point at issue and describe the resulting operational consequence.
- If a prior-year proposal, vote result, or resignation event is referenced, connect it to the current-year disclosure and explain whether the company appears to have closed the loop.

## 6. Output structure conventions
- Write a governance summary memorandum in conventional memo form, organized by topic rather than by source document.
- Open with a short executive summary that identifies the most material voting and engagement themes.
- Follow with sections covering: shareholder proposals, director elections and independence, committee composition and interlocks, voting mechanics and resignation policy, proxy access, related-party transactions, and engagement priorities.
- For each issue, include a severity label using a single ordinal scale defined once at the outset, then explain the basis for the rating in one or two sentences.
- Use a consistent row or bullet format for repeated items so the client can compare proposals, nominees, and transactions easily.
- For every legal or governance proposition, cite the controlling authority or disclosure source by name in the body of the memo.
- End with a Recommended Actions section that assigns an action, a responsible internal role, and a timing anchor tied to the proxy season or annual-meeting timeline.
- Keep the memo focused on operative conclusions and client-facing implications; do not reproduce large blocks of source text.
