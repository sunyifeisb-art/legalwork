---
name: analyze-credit-agreement-markup
task_id: corporate-ma/analyze-credit-agreement-markup
description: Guides systematic comparison of a borrower’s credit agreement markup against the original draft and related preliminary financing terms, assessing both individual provision changes and their compounded effect on lender protection.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Credit Agreement Markup

## 1. Subject-matter triage

- Confirm the source set: original credit agreement, borrower markup, commitment letter, and credit memo.
- Determine whether the task is a pure comparison, a change analysis memo, or both; if a redline file is also needed, ensure the markup itself is prepared first and the memo comes after.
- If only one version of a provision appears in the source set, state that it is the sole operative text before comparing it to the preliminary financing terms.

## 2. Failure modes the skill is correcting

- Evaluating each changed provision in isolation rather than assessing how changes to earnings definitions, covenant testing thresholds, cure rights, and cash sweep obligations interact to collectively weaken lender protection
- Failing to cross-reference each deviation against the related preliminary financing terms to identify which changes constitute a departure from the agreed commercial package versus a permissible borrower-favorable adjustment
- Missing broadly defined or uncapped adjustment categories that create systemic risk for covenant compliance manipulation
- Describing a change without tying it to scale, related clauses, and client consequence
- Mixing severity judgments without a consistent ordinal scale
- Issuing analysis without an actionable recommendation at the end

## 3. Legal frameworks / domain conventions that apply

- Adjusted earnings addbacks: aggregate caps on non-recurring addbacks help prevent artificial inflation of earnings for covenant compliance purposes; categories with broad or undefined scope can be used to characterize routine operating variances as non-recurring
- Springing financial covenant: a maintenance covenant tested only when revolving credit utilization exceeds a specified threshold; raising that threshold reduces testing frequency and materially decreases the practical enforceability of the covenant
- Excess cash flow sweep: an annual mandatory prepayment based on free cash flow; the cash netting cap sets the maximum amount of unrestricted cash that can be excluded from the calculation; changes to step-down percentages or the netting cap reduce mandatory amortization
- Most-favored-nation protection for incremental facilities: pricing on new incremental term loans should preserve spread protection for existing lenders; removal or dilution creates pricing and syndication risk
- Equity cure mechanics: earnings-increase cures and debt-reduction cures have different leverage effects; consecutive quarter permissions and annual limits restrict abuse
- Incremental facility baskets, restricted payment baskets, investment baskets, and asset sale reinvestment periods operate as a package; a permissive change in one basket may negate tighter terms elsewhere
- Preliminary financing terms in the commitment letter and credit memo serve as the commercial baseline; departures should be classified by whether they track the negotiated package or expand borrower flexibility beyond it
- Use recognized drafting authorities for support where needed, such as standard leveraged finance market practice and the plain terms of the operative documents, rather than treating a favorable borrower edit as acceptable by default

## 4. Analytical scaffolds

- Start by identifying every changed provision and grouping the changes by topic before drawing conclusions.
- For each changed provision, compare: original language, borrower markup, and the related preliminary financing position.
- For each issue, close the analysis with:
  - scale or threshold drawn from the source documents,
  - the clause or document interaction that amplifies the change,
  - the downstream lender or transaction consequence.
- Classify each issue by severity using a single ordinal scale defined once at the top of the memo:
  - Critical: materially impairs core lender protection or economics
  - High: significant borrower-favorable shift that changes negotiated risk allocation
  - Medium: meaningful drafting or economic deviation that warrants correction or reserve
  - Low: limited deviation or clarification issue
- When a provision admits multiple parties, periods, test dates, baskets, or scenarios, enumerate them first and then analyze each in turn; do not compress distinct changes into one summary pass.
- Assess the cumulative effect of the markup, not just discrete edits; determine whether several borrower-favorable changes together make a covenant or protection functionally weaker.
- Where the source documents present a negotiated range, distinguish clearly between:
  - a departure from the agreed commercial package,
  - an acceptable borrower-favorable refinement,
  - an ambiguous point needing clarification.
- If a provision is unchanged but interacts with a revised clause, note the interaction expressly.

## 5. Vertical / structural / temporal relationships

- Track hierarchy across the financing package: the credit agreement should be read together with the commitment letter and credit memo, and the operative provision should be tested against the preliminary commercial terms where they address the same topic.
- Watch for temporal changes that alter enforcement over time, including:
  - testing frequency,
  - springing triggers,
  - cure windows,
  - lookback periods,
  - reinvestment periods,
  - sunset periods,
  - step-down schedules.
- Note how one change can shift the practical effect of another, such as a broader earnings definition supporting higher leverage headroom while a looser sweep or cure right further reduces lender discipline.
- Compare basket mechanics vertically:
  - free-and-clear baskets,
  - grower baskets,
  - leverage-based baskets,
  - carve-outs conditioned on compliance tests.
- Flag when the borrower markup creates misalignment between economic protections and covenant mechanics, even if each edit appears modest standing alone.

## 6. Output structure conventions

- Draft a change analysis memo in a conventional issue-by-issue format, not as a bare list of edits.
- Define the severity scale once near the top and apply it uniformly.
- For each issue entry, include:
  - provision/topic,
  - original language,
  - borrower markup,
  - preliminary financing terms position,
  - severity,
  - legal/economic impact,
  - classification as package departure, acceptable change, or clarification.
- Where helpful, include a concise table for quick comparison, but keep the analytical narrative tied to the source documents.
- Use plain-language textual markers if quoting or excerpting operative changes so the memo remains readable in export formats.
- End with a compounding-effect section that explains how the changes interact as a package.
- End with a Recommended Actions block that states the action, the responsible role, and the timing anchor tied to the transaction workflow.
- If the task also requires a markup artifact, ensure that file is created and populated before finalizing the memo; the memo must not substitute for an absent primary document.
- Before concluding, confirm that the memo addresses each changed provision, identifies the governing baseline, and states the practical consequence of each material deviation.
