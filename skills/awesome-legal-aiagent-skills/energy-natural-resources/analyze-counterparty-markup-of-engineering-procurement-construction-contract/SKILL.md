---
name: analyze-counterparty-markup-epc-contract-solar
task_id: energy-natural-resources/analyze-counterparty-markup-of-engineering-procurement-construction-contract
description: Guides analysis of an EPC redline by systematically connecting each markup change to its impact on financing closing conditions, schedule and completion-risk exposure, fixed-price structure integrity, warranty and indemnity risk allocation, and applicable legal constraints.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Engineering Procurement Construction Contract — Redline Analysis Memorandum

## 2. Failure modes the skill is correcting

- Treating the contractor’s markup as a line-edit exercise instead of a risk-allocation review, so the memo misses how a narrow wording change can alter financing eligibility, schedule risk, or enforceability.
- Flagging provisions in isolation without tying them to the project’s closing conditions, required security package, schedule milestones, or incentive compliance obligations.
- Describing a schedule shift without translating it into unrecovered delay exposure, penalty exposure, or downstream completion risk for the owner.
- Missing structural risk transfer, especially where a proposed carve-out, cap, qualifier, or pass-through erodes a fixed-price EPC allocation.
- Failing to detect interactions among related provisions, such as warranty, indemnity survival, bond release, assignment, or change-order approval mechanics.
- Using narrative comments without a clear severity ranking, counterproposal, and action path, which makes the memo hard to negotiate from.
- Concluding that a clause is acceptable or unenforceable without identifying the governing rule, statute, regulation, or case that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply

- Start from the owner’s form, then test each contractor edit against the project’s financing requirements, schedule assumptions, and risk-allocation baseline; the redline is not neutral — every deletion or insertion should be read for commercial and legal effect.
- Financing closing conditions matter because a contractor revision that drops below a lender or investor requirement can become a closing blocker, not merely a business point; identify the controlling source requirement and state the consequence if the markup is accepted.
- In a fixed-price EPC, cost-overrun risk ordinarily sits with the contractor; a new pass-through, reopener, or uncapped reimbursement obligation shifts the structure toward cost-plus for that category and should be called out as a structural departure.
- Completion-date edits must be tested against the project’s contractual milestone chain; if the EPC completion date moves but the downstream commercial operation or penalty start date does not, the gap creates unrecovered exposure for the owner.
- Warranty and indemnity language must be read together; if the warranty ends and indemnity survival ends at the same time, late-arising defects or claims may fall into a coverage gap.
- Assignment, security, bond, and surety terms often have external minimum standards; if the markup restricts collateral assignment, weakens surety support, shortens bond duration, or narrows release timing, check whether the change remains consistent with the financing package and applicable law.
- Change-order approval mechanics should be measured against the owner’s real review cadence; a short-deemed-approval period can operate as an inadvertent waiver mechanism if it expires before meaningful internal and advisor review.
- Force majeure, indemnity, and similar risk-shifting clauses should be checked against any mandatory statutory limits in the project jurisdiction, including construction anti-indemnity rules and any other nonwaivable restrictions on contractual risk allocation.
- Where a legal conclusion depends on enforceability, cite the governing authority by name and section, regulation, rule, or leading case before stating the outcome.

## 4. Analytical scaffolds

- Read the financing term sheet, security package, and project milestones before the EPC redline, then compile the owner-facing requirements that the contractor markup might disturb.
- For each contractor change:
  - identify the original owner form language and the proposed revision;
  - state the practical risk shift in one sentence;
  - test it against the financing, schedule, incentive, bonding, and legal constraints that apply;
  - quantify the effect where the source documents provide a figure, term, date, cap, threshold, or rate;
  - identify the related clause or document that amplifies or mitigates the risk;
  - assign a severity rating;
  - draft a counterproposal that restores the owner’s intended allocation.
- When timing is changed, compare the revised EPC milestone to the downstream milestone and calculate the exposure window created by the gap; if the source documents include a daily rate, carry the result through to the economic consequence.
- When the issue is a financing requirement, build a separate breach inventory that groups all closing-condition failures together before discussing lower-priority commercial edits.
- When the issue is a structural risk transfer, explain whether the markup merely clarifies the deal or materially reallocates risk away from the contractor; if the latter, say so directly.
- When provisions interact, state the combined effect rather than analyzing each clause in a vacuum.
- If only one party, period, threshold, or milestone is relevant, say that explicitly; otherwise enumerate the relevant items before analysis so each gets a separate pass.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track the clause chain from EPC completion to commissioning or commercial operation, and from warranty start to warranty end to indemnity survival expiry; use that chain to identify gaps in protection.
- Track the relationship between bond effectiveness, bond release, and surety qualification so a shortened or weakened bond is assessed in context.
- Track the relationship between owner review time, notice periods, and deemed approval so that consent traps are identified as timing problems, not just wording changes.
- Track the relationship between assignment rights, collateral assignment, and financing consent so a restrictive edit is assessed as a closing-risk issue.
- Track the relationship between a cost-bearing clause and the fixed-price baseline so any uncapped pass-through is identified as a shift in the contract’s economic architecture.
- Track the relationship between mandatory law and negotiated indemnity language so an otherwise acceptable clause is not analyzed as enforceable if the jurisdiction forbids it.

## 6. Output structure conventions

- Write a negotiation analysis memorandum in a redline-review format that is organized by severity, with the most serious financing or enforceability problems first.
- Define the severity scale once at the top and apply it uniformly to every issue entry.
- For each issue, include:
  - the original term;
  - the contractor markup;
  - the controlling requirement, threshold, or legal rule;
  - the impact on economics, operations, or enforceability;
  - the related clause or document that interacts with it;
  - the proposed counterlanguage or negotiating position;
  - a one-line rationale for why the severity level fits.
- Make each issue self-contained and closed: quantify the scale of the problem from the source documents where possible, tie it to at least one related provision, and state the downstream consequence for the owner.
- Include a dedicated financing-breach summary if any markup threatens a closing condition, security requirement, or other external minimum.
- Include a concise closing matrix that lets the reader compare issues across original term, contractor change, controlling requirement, severity, and recommended counter.
- End with a Recommended Actions block that assigns the next step to the relevant role and anchors timing to a milestone, deadline, or transaction event.
- If the output is presented as a memo rather than embedded markup, still ensure that every substantive redline change is captured in plain-text terms so the reader can identify the modification without relying on formatting alone.
