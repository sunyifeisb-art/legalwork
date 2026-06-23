---
name: extract-key-changes-from-proposed-regulation
task_id: corporate-governance/extract-key-changes-from-proposed-regulation
description: Agents extract the main proposed provisions and prepare a regulatory impact summary memorandum that evaluates operational effects, disclosure obligations, transaction-process implications, implementation burden, books-and-records considerations, and comment-period opportunities.
activates_for: [planner, solver, checker]
---

# Skill: Regulatory Impact Summary for a Proposed SEC Rule — Private Fund Adviser

## 1. Subject-matter triage
- Identify the exact proposed SEC release, the affected adviser entity, and the current compliance baseline before evaluating impact.
- If the source set includes more than one fund, strategy, or operating model, enumerate each one first and assess them separately rather than assuming a single representative structure.
- Flag at the outset whether the memo is a pure gap analysis, a gap analysis with implementation roadmap, or a comment-letter precursor; do not blur those functions.

## 2. Failure modes the skill is correcting
- Summarizing the proposal’s headline items without mapping each change to the firm’s current procedures, disclosures, records, and governance controls.
- Missing how fee, expense, and performance disclosure changes affect existing quarterly statement and investor-reporting workflows.
- Overlooking transaction-process changes in adviser-led or continuation-style secondary transactions, including the need for independent opinions and the effect of advisor conflicts.
- Treating side letters and preferential terms as a generic disclosure issue rather than testing them against the proposal’s specific restrictions and exceptions.
- Failing to connect expanded books-and-records duties to the firm’s retention, audit trail, and evidentiary support practices.
- Listing issues without assigning severity, operational burden, or a concrete implementation path.
- Describing the rule but not the controlling SEC authority that supports the compliance conclusion.
- Missing the comment-period opportunity to shape calibration where the proposal does not fit the firm’s fund structures.

## 3. Legal frameworks / domain conventions that apply
- Anchor the analysis in the operative Advisers Act framework and the proposed SEC release governing private fund advisers.
- Treat quarterly statement requirements as a disclosure-and-calculation regime: fees, expenses, performance, and methodology must be tested against how the firm actually compiles and presents investor reporting.
- Treat transaction-related opinion requirements as a conflict-management and independence issue; the analysis must test whether current advisor relationships would satisfy the proposal’s independence standard.
- Treat preferential treatment provisions as a side-letter and investor-parity issue; identify whether material economic terms, liquidity preferences, information rights, or other special arrangements require disclosure or are constrained.
- Treat books-and-records expansion as a retention and substantiation issue; the firm must be able to recreate the basis for statements, opinions, and restricted-activity judgments.
- Treat comment-period analysis as a legal-strategy step, not an afterthought; identify the provisions that are most vulnerable to overbreadth, operational mismatch, or unintended consequences for the client’s structure.
- Cite the controlling authority for each proposition relied upon, using the statute, rule, release, or other recognized authority that governs the point.

## 4. Analytical scaffolds
- Use a provision-by-provision comparison: proposed requirement, current practice, compliance gap, implementation burden, and recommended action.
- For each provision, test three questions in order: what changes in law or SEC position are being proposed, what is the firm doing today, and what must change operationally if the proposal is adopted.
- Where the proposal turns on independence, evaluate the relevant counterparties, service providers, and recurring relationships against the stated standard before drawing a conclusion.
- Where the proposal turns on disclosure, separate investor-facing content, internal data sources, and calculation methodology so the memo distinguishes drafting work from systems work.
- Where the proposal turns on transaction process, identify the decision points that would need new approvals, notices, or third-party deliverables.
- Where the proposal turns on records, identify the documents that must be created or retained, who owns them, and where the existing process would fail.
- Assign an ordinal severity to each gap and define the scale once near the top of the memo so the reader can distinguish critical implementation blockers from lower-risk refinements.
- Close each identified gap with: the relevant scale or scope, the interaction with another requirement or process, and the downstream consequence for the adviser.
- Build the implementation timeline from the proposal’s effective-date logic and operational lead times, then sequence work by dependency rather than by topic alone.
- End with a concrete recommendations block that names the actor responsible and the timing anchor for each action.

## 5. Vertical / structural / temporal relationships
- Compare the proposed rule to the current compliance framework at the level of workflow, not just policy text.
- Distinguish obligations that apply at point of transaction, at periodic reporting intervals, at onboarding, and at retention/post-close stages.
- If the firm uses different funds or sleeves with different fee logic, side-letter practice, or transaction approval paths, separate them vertically rather than collapsing them into one generalized answer.
- When a provision affects multiple internal teams, map the relationship between legal, compliance, finance, operations, investor relations, and portfolio management so the memo shows who must move first.
- Where timing matters, identify immediate remediation, pre-effective-date buildout, and post-effective-date monitoring as distinct phases.

## 6. Output structure conventions
- Prepare a regulatory impact memorandum in conventional memo form with a short executive summary, a rule-by-rule gap analysis, an implementation timeline, and a closing recommendations section.
- Include a summary table that pairs each major proposed provision with current status, gap description, severity, required action, owner, and target timing.
- For each substantive provision, state: the proposed requirement, the firm’s current position, the compliance gap, the operational effect, and the recommended fix.
- Include a separate section for comment-period strategy when the proposal is still open for comment or when prior comment history makes further advocacy useful.
- Use plain-text labels that survive conversion and make the memo usable in Word without relying on visual formatting alone.
- If the analysis references a legal conclusion, tie it to the controlling authority in the same paragraph or row.
- Conclude with an explicit Recommended Actions block naming the responsible role and a timing anchor for each item.
