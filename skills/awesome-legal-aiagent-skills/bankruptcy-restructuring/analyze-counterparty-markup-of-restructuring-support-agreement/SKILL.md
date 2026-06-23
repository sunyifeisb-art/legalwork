---
name: analyze-counterparty-markup-of-restructuring-support-agreement
task_id: bankruptcy-restructuring/analyze-counterparty-markup-of-restructuring-support-agreement
description: Ensures an RSA markup analysis evaluates the economic impact of each material change, classifies each deviation against the company's stated negotiating positions, and surfaces cross-issue interaction effects that individual-issue analysis would miss.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Restructuring Support Agreement

## 1. Subject-matter triage

- Treat the counterparty markup as a line-by-line comparison against the company draft, but identify first whether there is only one Ad Hoc Group markup package or multiple versions/attachments in scope.
- If multiple drafts, side letters, exhibits, schedules, or term sheets are present, enumerate them before analysis and keep each source version separate.
- Confirm whether the task is to analyze markup only or also to produce a redline-ready document; if a redline is requested, preserve the company draft as the baseline and treat any memo as secondary.

## 2. Failure modes the skill is correcting

- Agent describes isolated edits without tying each one to the company’s negotiating posture, so the business significance of the change is lost.
- Agent fails to identify whether a change is a true economic shift, a control-right shift, or a timing/conditionality shift, and therefore misses the practical impact.
- Agent ignores interaction effects between milestone timing, support conditions, voting mechanics, fee treatment, or release language.
- Agent states legal concern in abstract terms without naming the governing doctrine, statute, rule, or practice principle supporting the concern.
- Agent gives issue descriptions without a severity signal, quantified effect, cross-reference, and recommendation.
- Agent omits a concrete next step, leaving the memo diagnostic rather than action-oriented.

## 3. Legal frameworks / domain conventions that apply

- RSA analysis should separate economics, governance/control, process timing, and conditionality; a change in one category can alter the negotiation leverage of another.
- Financing economics must be analyzed in the unit used by the transaction documents or a normalized unit that allows like-for-like comparison; distinguish cash cost, fee burden, roll-up or exchange effect, and dilution effect.
- Fiduciary-out concepts should be tested against standard restructuring practice and the company’s reserved rights; removal or narrowing of a fiduciary out is typically a major company concern.
- Release and exculpation provisions should be checked against applicable bankruptcy-law limits and general enforceability principles; nonconsensual or overbroad releases require heightened scrutiny.
- Milestones, support obligations, and conditionality should be tested for feasibility against the case timetable and other procedural deadlines that the source materials impose.
- Voting, solicitation, joinder, and support thresholds should be analyzed for their effect on confirmation path, lock-up integrity, and coalition durability.
- Confidentiality, MNPI, and conduct restrictions should be reviewed for operational friction and any apparent conflict with ordinary restructuring process.

## 4. Analytical scaffolds

- Walk every substantive markup issue and assign each one a discrete issue entry; do not bundle unrelated edits into a single paragraph of commentary.
- For each issue, state the change, identify the company baseline, and classify the deviation against the company’s stated position or red line.
- Use a uniform ordinal severity scale defined once at the top of the memo, and apply it to every issue consistently.
- For every issue, close with three moves: quantify the change using a document-based figure, term, threshold, or timing reference; cross-reference the clause, schedule, or other document it affects; and state the downstream consequence for economics, control, timing, or confirmability.
- Where a provision affects money or economics, translate the effect into a comparable metric and explain whether the change increases, decreases, delays, or conditions the company’s value.
- Where a provision affects deadlines, condition precedents, or outside dates, test achievability against the broader case timetable and any linked cure, challenge, hearing, or solicitation period.
- Where a provision affects voting, support, joinder, or release mechanics, test whether it weakens coalition strength, increases dissent risk, or creates confirmation friction.
- Cite the applicable authority or practice basis for each legal proposition relied upon, including the bankruptcy rule, doctrine, or statute supporting the concern where relevant.
- After issue-by-issue analysis, identify combined effects that only emerge from reading multiple edits together, especially where a timing change amplifies an economic change or a control-right change undercuts a support obligation.
- Conclude with a prioritized negotiation posture that distinguishes non-starters, acceptable tradeoffs, and points that can be revised with drafting fixes.

## 5. Vertical / structural / temporal relationships

- Track how an edit in one section changes the meaning of another section, including definitions, conditions precedent, milestones, voting mechanics, releases, injunction language, or termination rights.
- Check whether a shortened deadline interacts with any cure period, objection deadline, financing close condition, solicitation period, or hearing date.
- Check whether fee, pricing, expense, or roll-up edits interact with any waterfall, priority, or recovery provisions.
- Check whether any release, covenant, or recommendation-right edit interacts with fiduciary-out language, board authority, or termination rights.
- Check whether joinder, support, or assignment edits affect the breadth, durability, or enforceability of the overall support package.

## 6. Output structure conventions

- Produce an organized legal memo in issue-by-issue form, with one section per material change.
- Begin with a brief methodology note that states the baseline reviewed, the severity scale used, and whether the markup package is singular or multi-document.
- For each issue, use a consistent internal sequence: description of change, legal/strategic analysis, quantified impact, cross-reference to related provision(s), recommendation, and severity classification.
- Use direct, practice-ready language that distinguishes business leverage from legal risk.
- End with a concise interaction-effects summary that explains the combined risk picture, followed by a prioritized Recommended Actions block naming the responsible role and a timing anchor tied to the restructuring process.
- If a redline is part of the work product, ensure every substantive deletion, insertion, or substitution is marked in text in a way that survives conversion and is understandable without styling alone.
