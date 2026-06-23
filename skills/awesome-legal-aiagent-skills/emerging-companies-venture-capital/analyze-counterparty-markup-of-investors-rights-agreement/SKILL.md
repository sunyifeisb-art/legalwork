---
name: ecvc-analyze-counterparty-markup-ira
task_id: emerging-companies-venture-capital/analyze-counterparty-markup-of-investors-rights-agreement
description: IRA markup analysis requires evaluating the cumulative effect of changes to registration rights, information rights, pay-to-play provisions, and consistency with the agreed term sheet — not treating revisions as isolated issues.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Investors' Rights Agreement

## 1. Subject-matter triage

- Start by extracting the agreed deal points from the term sheet and transmittal email before reading the markup.
- Treat the initial draft, the company markup, the cap table, and the negotiation playbook as a single source set; resolve tensions across them rather than reading any one document in isolation.
- Identify whether the markup changes only drafting mechanics or whether it shifts investor protections, governance visibility, transfer restrictions, or economics.
- If only one investor class, round, or rights package is in scope, state that affirmatively; otherwise enumerate each affected holder group and analyze each separately before synthesizing the combined effect.

## 2. Failure modes the skill is correcting

- Each markup change is characterized in isolation; the cumulative impact on investors' ability to obtain liquidity is not analyzed.
- Changes to information rights reporting frequency are treated as minor drafting preferences rather than as material governance changes affecting investor monitoring.
- Additions not reflected in the agreed term sheet are treated as company-initiated clarifications rather than flagged as potential new demands.
- The analysis spots inconsistencies but does not translate them into negotiation leverage or a concrete counterproposal.
- The memo describes the issue without tying it to the relevant source documents, the scale of the change, and the practical consequence for the client.

## 3. Legal frameworks / domain conventions that apply

- Registration rights must be analyzed as a package: demand thresholds, deferral rights, blackout periods, underwriter cutbacks, and transfer mechanics can interact to dilute practical liquidity even when each revision appears modest alone.
- Information rights are a monitoring covenant, not a housekeeping clause; reduced reporting cadence, narrower scope, or delayed delivery weakens investor oversight and can conceal operational deterioration.
- Pay-to-play provisions materially alter financing dynamics and should be treated as a substantive economic term, especially if absent from the agreed term sheet.
- Anti-dilution and related carve-outs should be evaluated by the scope of excluded issuances and the resulting contraction of protection, not by labels alone.
- Standstill, transfer, and creeping-acquisition restrictions should be assessed for whether the revised language enables gradual control accumulation or circumvention of holder limits.
- Board-observer provisions should be checked for privilege and confidentiality risk if the observer may have adverse interests or competitive affiliations.
- Any legal conclusion in the memo should be tied to the operative contract text, the deal documents, or the applicable market convention reflected in the negotiation playbook; do not state a conclusion without the supporting provision or principle.

## 4. Analytical scaffolds

- Build a term-sheet checklist first: for each agreed point, note whether the markup is unchanged, narrowed, expanded, added, or omitted.
- For each marked-up provision, analyze the textual change, then the legal or economic consequence, then the consistency with the agreed deal, then the recommended counterproposal.
- For registration rights, analyze each revised mechanism separately and then step back to assess the cumulative effect on the ability to force, time, and complete a liquidity event.
- For information rights, flag any reduction in frequency, delay in delivery, or narrowing of materials as a material governance change and explain why timelier reporting matters.
- For pay-to-play, if the term sheet did not include it, flag it explicitly as a potential unauthorized addition and state whether deletion or express reconciliation is the cleaner remedy.
- For anti-dilution carve-outs, identify the excluded issuance category and explain the dilution impact at a categorical level tied to the source documents.
- For termination or holder-threshold changes, assess impact across the investor base as a whole, not just the named signer.
- For standstill changes, test whether the revision opens a path to creeping acquisition or other incremental control tactics.
- For every issue that is material, pair the diagnosis with a specific counterproposal keyed to the agreed term sheet or market-standard fallback.
- Close every issue with: the relevant scale or threshold from the source documents, the interacting clause or document, and the downstream consequence for the client.

## 5. Vertical / structural / temporal relationships

- Track how one revision changes the operation of another provision over time; a later-demand restriction can undermine an otherwise preserved registration right.
- Compare any revised reporting cadence against financing milestones, board cycles, and anticipated operational inflection points to assess whether investors will learn of problems too late.
- If the markup reallocates rights among different investor classes, note whether the change is vertical (different treatment by priority or class) or horizontal (within the same class).
- Where the cap table informs threshold mechanics, use it to test whether a stated consent or holder percentage is actually harder or easier to achieve after the revision.
- Where a clause depends on timing windows, analyze how the revised window interacts with blackout periods, deferred effectiveness, or transaction timing in the term sheet and transmittal email.

## 6. Output structure conventions

- Produce an issues memo in severity order using an ordinal scale defined once at the top: Critical / High / Medium / Low.
- For each issue, use a consistent sequence: change description → legal/economic consequence → term-sheet consistency assessment → severity → counterproposal.
- Include a term-sheet consistency check table covering each major deviation, with one row per deviation or issue cluster.
- Include a cumulative-impact section for registration rights that synthesizes the combined effect of all related edits.
- Keep issue entries self-contained; each should identify the specific change, the source document that confirms the baseline, and the practical result.
- Use robust markup conventions in the analysis when quoting or restating changes from the redline, so the reader can distinguish deleted, added, and substituted language even if formatting is lost on export.
- End with a Recommended Actions block that gives the next steps in imperative form, names the responsible role, and ties each action to the deal timeline or other relevant milestone.
