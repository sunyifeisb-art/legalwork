---
name: analyze-counterparty-spa-markup
task_id: corporate-ma/analyze-counterparty-spa-markup
description: Guides provision-by-provision analysis of a counterparty's stock purchase agreement redline, evaluating deviations against the negotiation playbook and assessing the compounded legal and economic impact of markup changes.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty SPA Markup

## 1. Subject-matter triage
- Confirm the primary artifact is the counterparty markup of the SPA, then read alongside the original draft, negotiation playbook, cover letter or transmittal, and any deal documents the markup cross-references.
- Identify whether the redline is silent or disclosed in the seller’s note, and separate cosmetic edits from substantive reallocations of risk, economics, timing, or control.
- If multiple forms, schedules, or side documents are implicated, enumerate them first and analyze each against the same baseline before drawing a combined conclusion.

## 2. Failure modes the skill is correcting
- Cataloguing redline changes without assessing how multiple changes interact across price mechanics, risk allocation, closing mechanics, and post-closing remedies.
- Treating narrowing of seller or management knowledge qualifiers as drafting cleanup rather than a substantive contraction of representation scope and indemnity recoverability.
- Missing the distinction between a holdback subject to offset and deferred consideration payable unconditionally when the counterparty attempts to recharacterize one as the other.
- Failing to assess whether contingent consideration changes the transaction-value analysis for any filing, notice, or consent regime tied to deal value.
- Reading each edit in isolation instead of tracing how one change affects another clause, schedule, or defined term.
- Describing deviation without translating it into practical leverage, downside exposure, or a negotiation response.

## 3. Legal frameworks / domain conventions that apply
- Purchase price mechanics should be read as an integrated package: base price, escrow or holdback, deferred amounts, earnout, adjustment rights, and any set-off rights.
- Earnout provisions must be assessed as a system: baseline formula, measurement period, separate-books covenant, operating covenant, dispute mechanics, and access to records.
- Knowledge qualifiers turn on both the defined knowledge group and the inquiry standard; narrowing either can materially reduce seller exposure.
- Working capital provisions should be checked for peg definition, collar, true-up timing, and dispute resolution symmetry.
- Indemnification terms must be read together: basket, cap, survival, sole remedy language, and collateral package.
- Restrictive covenants require scrutiny for scope, duration, geography, activity limits, and governing-law enforceability.
- Tax provisions should be reviewed for elections or classifications that can change the economic consequence of the acquisition.
- Regulatory or notice thresholds may depend on aggregate value, including contingent or deferred elements, so structural changes can alter filing analysis.
- Legal conclusions should be anchored to the controlling authority or deal document language that supports the proposition, not stated as bare assertion.

## 4. Analytical scaffolds
- Start with a side-by-side issue inventory, then rank each deviation by commercial significance and legal effect.
- For each issue, compare the seller markup to our form, the playbook position, and any related definition or schedule that changes the practical result.
- Treat a cluster of edits as one issue only when they operate on the same legal lever; otherwise separate them so the compound effect is visible.
- For purchase price mechanics, ask whether the change shifts money from conditional to unconditional payment, reduces set-off, changes timing, or weakens collateral.
- For earnouts, ask whether the seller markup preserves the baseline economics, buyer operating flexibility, information access, and dispute process.
- For representations, test whether deletions, added materiality, added knowledge language, or narrowed defined terms reduce coverage in a way that matters to recovery.
- For indemnity, test whether the change reduces the practical value of the remedy by narrowing scope, shortening survival, raising thresholds, or limiting escrow access.
- For regulatory items, test whether structural changes affect whether a notice, filing, approval, or threshold analysis must be recalculated.
- For each issue, state the severity using a single ordinal scale defined at the outset and apply it consistently.
- Close each issue with three moves: cite the relevant scale or threshold from the deal documents, cross-reference the interacting clause or document, and state the downstream consequence for the client.
- When the markup adds or removes text, make the delta legible in the report by identifying the precise textual change and its effect, not merely the subject matter.
- If the source set includes a seller cover note, distinguish disclosed concessions from silent redlines and flag silent edits for heightened scrutiny.

## 5. Vertical / structural / temporal relationships
- Track vertical interactions from definition to operative clause to remedy; a change in a defined term can silently rewrite multiple provisions.
- Track structural interactions across purchase price, representations, indemnification, covenants, and closing conditions rather than treating each section as self-contained.
- Track temporal interactions among signing, closing, interim period covenants, measurement periods, survival periods, and payment dates.
- Where timing is changed, state whether the edit accelerates payment, delays recourse, compresses diligence time, or extends risk exposure.
- Where one provision references another document or schedule, confirm whether the cross-reference changes the legal result or only the drafting mechanics.

## 6. Output structure conventions
- Produce a deviation report organized by issue, not a narrative memo.
- Begin with a short source-summary section that distinguishes disclosed changes in the seller transmittal from silent redlines.
- Use a consistent severity field for every issue, with a brief one-line rationale.
- For each issue, include: provision reference, original draft position, seller change, legal and economic impact, playbook alignment, cross-references, and recommended response.
- Include the plain-text change notation in the report so each substantive edit is identifiable even if styling is lost in export; use a clear inserted / deleted / replaced convention and a short rationale note.
- Tie every recommendation to a concrete action, the responsible role, and a timing anchor tied to the deal process.
- End with a negotiation recommendation table that classifies each material issue as accept, reject, or counter, and include proposed counter-language where appropriate.
- Keep the report suitable for direct conversion into `markup-deviation-report.docx` and ensure the operative analysis, not a summary of analysis, is what the document contains.
