---
name: ecvc-analyze-counterparty-markup-bridge-loan
task_id: emerging-companies-venture-capital/analyze-counterparty-markup-of-bridge-loan-agreement
description: Counterparty bridge loan markups require analysis that connects conversion mechanics, investor control provisions, runway implications, and pay-to-play interactions — not just issue-by-issue enumeration.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Bridge Loan Agreement

## 2. Failure modes the skill is correcting

- Individual markup changes are analyzed in isolation instead of as interacting provisions whose combined effect may be materially more adverse than any single edit
- Control terms are not measured against the company’s cash runway, financing alternatives, and operating flexibility
- Conversion economics are treated as standalone economics rather than as a function of cap, denominator definition, and any linked MFN or most-favored pricing right
- MFN risk is noted abstractly rather than analyzed as a hybrid-instrument problem that can import favorable terms from other notes
- The analysis stops at description and does not close each issue with size, interaction, and consequence
- Redline commentary is not expressed in a format that survives document conversion and cannot be audited from plain text
- Recommendations are implied rather than stated as concrete next steps with owner and timing

## 3. Legal frameworks / domain conventions that apply

- Conversion mechanics: analyze how the cap-based conversion price depends on both the cap amount and the capitalization denominator definition; determine whether the denominator is pre-money or post-money, and assess those inputs together
- MAC-based events of default: if the definition uses subjective triggers such as future prospects or general business deterioration, evaluate the resulting discretion to declare default against an objectively verifiable standard
- CEO departure events of default: in a bridge loan, evaluate whether an automatic event of default upon CEO departure without a cure period or board-approved transition carve-out is operationally onerous
- Pay-to-play and qualified financing threshold interaction: if the qualified financing threshold is reduced in the markup, assess how that change shifts the round size at which pay-to-play obligations are triggered
- MFN clause and hybrid notes: evaluate whether an MFN right permits selecting the most favorable terms across multiple prior notes in a way that creates a more investor-favorable instrument than any single note
- Expenditure consent thresholds: assess investor consent rights for expenditures above a threshold relative to monthly burn rate to contextualize operational impact
- Anti-layering and subordination: assess any anti-layering provision against existing senior debt, and verify whether any subordination cap is workable in light of outstanding senior obligations
- No-shop duration and runway: assess the no-shop period against remaining cash runway and determine whether the company retains realistic flexibility to pursue alternatives if the deal does not close
- Standard contract interpretation and redline reading principles: treat the revised text, defined terms, schedules, and cross-references as a single instrument and resolve changes by their operative legal effect, not their cosmetic prominence

## 4. Analytical scaffolds

- Start by identifying whether there is only one agreement and one counterparty markup set in scope; if multiple versions, dates, or counterparties exist, enumerate them before comparing any terms
- For each changed provision, state the original term, the markup change, the legal consequence, the interaction effects, and the recommended response
- Group changes into clusters of interacting provisions and analyze the compounding effect of each cluster rather than issuing isolated observations
- For each issue, close with three moves: scale it against a document-specific figure or threshold, cross-reference the interacting clause or related document, and state the downstream consequence for the company
- Identify the investor’s apparent strategic objective from the pattern of markup changes, including where the markup appears to push economics, control, or optionality in the same direction
- When the source set includes multiple possible triggers, dates, thresholds, or counterparties, analyze each one separately rather than using a representative pass
- Treat any legal conclusion as tethered to an identified rule, defined term, or governing clause; avoid unsupported conclusory statements
- If the markup is intended for a redline-style output, make each substantive change legible in plain text with explicit deleted, inserted, or replaced markers and a short rationale for each change

## 5. Vertical / structural / temporal relationships

- Assess any consent, veto, or information right against the company’s operating cadence, burn rate, and the timing of the next financing milestone
- Compare no-shop, exclusivity, and closing timetable restrictions against the remaining runway and the likely need for parallel fundraising outreach
- Evaluate how conversion pricing, liquidation economics, and pay-to-play provisions interact across pre- and post-closing scenarios
- Check whether default triggers, covenant baskets, and negative covenants become more restrictive when read together than they appear separately
- Test whether any subordination, anti-layering, or pari passu language is workable in light of existing senior obligations and the contemplated bridge structure
- Examine whether investor protections introduced in the markup shift practical control before or after closing and whether cure periods, approvals, or transition carve-outs temper that shift

## 6. Output structure conventions

- Organize the memorandum by issue priority, using a defined ordinal severity scale stated once at the top and applied consistently to each issue
- For each issue section: original term → markup change → severity → legal consequence → interaction effects → quantified or scaled impact → recommended response
- Include a cluster-analysis section explaining how groups of changes compound each other and whether they create a broader control or economics package
- Include a strategic-context section identifying the investor’s apparent objectives from the markup pattern
- End with a Recommended Actions block naming the action, the responsible role, and the timing anchor
- When describing any substantive redline change, use plain-text marking that survives export, such as deleted/inserted/replaced text plus a short rationale, so the change can be read without styling
- Keep the memo executive-ready: concise, issue-driven, and written as an advisory analysis rather than a clause-by-clause recitation
