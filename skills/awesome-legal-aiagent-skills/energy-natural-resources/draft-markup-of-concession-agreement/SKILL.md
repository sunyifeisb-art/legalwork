---
name: draft-markup-concession-agreement-ccgt-mexico
task_id: energy-natural-resources/draft-markup-of-concession-agreement
description: Guides drafting of a project-company-side markup of a concession agreement by prioritizing bankability-critical provisions, structuring termination and currency risk mechanisms, and producing a companion commentary memo with negotiability assessments and fallback positions for each markup.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Concession Agreement with Commentary — Project Company Perspective

## 1. Subject-matter triage
- Treat the concession as a bankability document first and a commercial allocation document second.
- Read the lender term sheet, bankability letter, and any direct agreement before revising operative clauses; align the markup to lender-facing requirements even where the grantor resists them.
- Identify whether the agreement already addresses:
  - lender cure and step-in,
  - termination payment mechanics,
  - force majeure and change in law,
  - site delivery and delay relief,
  - currency conversion or tariff adjustment,
  - dispute resolution against a public counterparty,
  - indemnities and security package calibration.
- If any of those topics are missing or thin, treat that as a drafting gap, not a negotiation preference.

## 2. Failure modes the skill is correcting
- Produces cosmetic edits that do not translate into a usable .docx redline or plain-text review record.
- Flags issues without tying them to the actual bankability package the lenders require.
- Describes a problem without stating what to change, why it matters, and where the fallback sits.
- Fails to separate must-have protections from points that can be traded.
- Drafts termination, currency, or dispute provisions in a way that leaves gaps between the concession and the financing documents.
- Gives commentary that is readable but not actionable for negotiation.

## 3. Legal frameworks / domain conventions that apply
- Lender step-in and cure rights are a standard project-finance bankability feature; the concession language should not leave lender protections dependent on implied consent.
- Termination compensation should be drafted to address debt exposure, equity recovery concepts, and breakage costs with a clear calculation path; the controlling drafting principle is certainty of remedy in a public-concession context.
- Delay liquidated damages should be capped and paired with a coherent period and rate so the clause functions as a loss allocation mechanism rather than a punitive device.
- Currency risk provisions should use a trigger-and-adjustment structure when project revenues and debt service sit in different currencies; coordinate this with the change in law regime so the same event is not priced twice or left unaddressed.
- Site delivery delays by the grantor should be paired with extension-of-time relief and documented standby-cost recovery tied to actual project delay consequences.
- Dispute resolution with a governmental counterparty should preserve neutrality and enforceability through international arbitration architecture and a neutral seat where possible.
- Indemnity drafting should be mutual, scoped to direct third-party loss concepts where market practice supports it, and calibrated with thresholds and caps that are consistent with the project risk profile.
- Performance security should track market practice for the project type; excess security can distort economics, while insufficient security can undermine lender and grantor acceptance.

## 4. Analytical scaffolds
- Build the markup provision by provision, and for each provision ask:
  - Is the current drafting acceptable?
  - If not, is it negotiable with improvement or unacceptable as-is?
  - What text should replace or supplement it?
  - What is the negotiated fallback if the grantor rejects the preferred position?
- For every substantive change, use a plain-text marker that survives export:
  - [DELETED: …]
  - [INSERTED: …]
  - [REPLACED: old → new]
  - Add a short [Rationale: …] note immediately adjacent to the change.
- Do not rely on formatting alone to signal redlines; the substantive change must remain visible in the text stream.
- Where a clause has multiple moving parts, draft the full revised clause rather than isolated fragments so the interaction of definitions, triggers, and remedies is clear.
- If the agreement turns on more than one period, party, trigger, or payment condition, separate them before analysis and address each in turn rather than collapsing them into a single representative treatment.
- For termination payment provisions, state the calculation concept in modular form: outstanding debt, accrued amounts, breakage, and equity recovery logic, with a generic illustration only if it clarifies the methodology without importing scenario-specific arithmetic.
- For currency provisions, specify the trigger, the adjustment mechanism, and the interaction with change in law and tariff/payment clauses.
- For dispute resolution, draft the forum, seat, governing procedure, interim relief path, and enforcement-facing language as a coordinated package.

## 5. Vertical / structural / temporal relationships
- Cross-check the concession against any direct agreement, financing covenant, security document, or permit package that depends on the same default, cure, or payment trigger.
- Make sure a grantor default, force majeure event, change in law event, and prolonged site delay do not create overlapping or contradictory remedies.
- Where one clause depends on another, preserve sequencing:
  - event occurs,
  - notice/cure period runs,
  - compensation or extension right crystallizes,
  - dispute mechanism applies if the parties disagree.
- Keep the project-company and lender perspectives aligned: if lender rights are intended to be exercisable, the concession should not reserve a prohibition elsewhere that nullifies them.
- When a remedy has a cap or threshold, ensure the related definition, timing rule, and recovery formula operate together.
- If the concession includes multiple counterparties or documents, identify the controlling instrument for each remedy and avoid drafting that requires readers to infer priority.

## 6. Output structure conventions
- Produce two files:
  - `concession-agreement-markup.docx`
  - `markup-commentary-memo.docx`
- The markup file should present the revised agreement text with robust textual redline markers and adjacent rationale notes for each substantive change.
- The commentary memo should be organized by provision, and each entry should include:
  - issue identification,
  - severity on a uniform ordinal scale defined at the top of the memo,
  - rationale for the change,
  - negotiability assessment,
  - fallback position,
  - downstream consequence if left unaddressed.
- Use clear bankability labels in the memo so the reader can distinguish lender-required points from commercially negotiable items.
- For each issue, reference the relevant clause interaction and the practical impact on project cost, schedule, enforceability, or financeability.
- End the memo with a concise Recommended Actions block that assigns each action to a role and a timing anchor tied to the transaction workflow.
- Before finishing, confirm that the markup file and the memo file both exist, are non-empty, and contain operative drafting rather than only commentary about drafting.
