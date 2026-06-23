---
name: synthesize-disclosure-schedules-against-acquisition-agreement
task_id: corporate-ma/synthesize-disclosure-schedules-against-acquisition-agreement
description: Guides preparation of a buyer-side gap analysis memorandum cross-referencing updated disclosure schedules against an acquisition agreement’s representations and warranties using supporting diligence materials to identify completeness gaps and disclosure concerns.
activates_for: [planner, solver, checker]
---

# Skill: Buyer-Side Disclosure Schedule Gap Analysis

## 2. Failure modes the skill is correcting

- The analysis treats updated disclosure schedules as complete because they exist, without testing each schedule against the actual scope of the related representation and the diligence record.
- Findings in diligence materials are not mapped back to the relevant representation and schedule section, so omissions that should have been disclosed remain hidden.
- Data room index excerpts are reviewed in isolation rather than as a completeness check for items within the scope of a scheduled representation.
- Financial exhibits and similar schedule attachments are not reconciled against the underlying financial diligence or summary materials, leaving internal inconsistencies unflagged.
- New disclosures in an updated schedule are not separated from pre-existing disclosures that were merely carried forward, causing the memo to blur breach risk with commercial surprise.
- The memo describes problems without stating why they matter to the buyer’s contractual position, closing risk, or negotiation leverage.
- Issues are reported without an explicit severity ladder, making it hard to distinguish closing-impacting items from lesser disclosure defects.

## 3. Legal frameworks / domain conventions that apply

- Updated disclosure schedules commonly change between signing and closing; the buyer should test whether the update cures omissions, introduces new disclosures, or creates other agreement consequences.
- Each representation that references a schedule should be mapped to the corresponding schedule section before any substantive analysis begins.
- A diligence finding within the scope of a representation but absent from the schedule is a potential disclosure gap and may indicate a breach of the representation, subject to the agreement’s text.
- A newly disclosed item may be contractually permissible yet still affect bring-down, closing-condition, indemnity, or negotiation analysis.
- The same fact can be relevant to multiple representations; analyze each relevant mapping separately rather than assuming one disclosure resolves all.
- If the agreement contains knowledge qualifiers, materiality qualifiers, or schedule carveouts, those qualifiers control the breadth of the completeness check.
- Where the source materials identify a governing legal standard, use that authority when framing the contractual or disclosure consequence; do not state a legal conclusion without the supporting rule or clause.

## 4. Analytical scaffolds

- Start by identifying every representation or warranty that points to a disclosure schedule, then build a representation-to-schedule map.
- Enumerate the schedule sections, diligence items, and data room items that fall within scope before analyzing them; do not collapse multiple items into a single pass if they may diverge.
- For each mapped representation, compare the updated schedule against:
  - the acquisition agreement text,
  - diligence memoranda and issue lists,
  - data room index excerpts, and
  - any financial exhibits or summary schedules.
- Classify each discrepancy as one of the following:
  - omission within scope,
  - partial or unclear disclosure,
  - newly disclosed item,
  - internal inconsistency,
  - disclosed item that changes buyer risk or closing analysis.
- For every identified issue, include:
  - severity on a fixed ordinal scale stated at the outset,
  - the contractual or documentary cross-reference that makes the issue relevant,
  - the buyer-side consequence, including breach risk, closing condition impact, or negotiation leverage.
- Where a figure, date, term, or other measurable fact appears in the source materials, use it to scale the issue; if the source set gives only one relevant item, say so explicitly.
- Treat a schedule entry that is broader, narrower, or differently scoped than the agreement language as a drafting mismatch, not merely a stylistic difference.
- If the update reveals a new disclosure, evaluate whether it creates a standalone issue, interacts with other disclosures, or suggests a pattern of omissions.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track the flow from agreement representation → original schedule → updated schedule → diligence materials → buyer consequence.
- Where later updates supersede earlier schedules, analyze what changed, what remained absent, and whether the update cures or compounds the issue.
- If a disclosure is nested within a broader exhibit, analyze both the parent exhibit and the specific item to avoid missing partial disclosure.
- If a fact appears in more than one source, reconcile the versions and note whether the later or more specific source controls the buyer’s understanding.
- Distinguish pre-signing disclosure, signing-to-closing update, and post-update diligence references, because each stage can affect how the buyer frames the gap.

## 6. Output structure conventions

- Produce a single buyer-side gap analysis memorandum in conventional memo form.
- Open with a short executive summary that identifies the most material omissions, new disclosures, and inconsistencies.
- Use a fixed severity scale defined once near the top and apply it uniformly to each issue.
- Organize the body by representation or schedule section, then within each section address:
  - scope of the representation,
  - what the updated schedule discloses,
  - what diligence or data room materials add,
  - the gap or inconsistency, and
  - the buyer-side consequence.
- For each issue, write compactly but completely: severity, cross-reference, and consequence must all appear in the same entry.
- Separate true omissions from newly disclosed items; do not merge breach risk with commercial concern.
- End with a recommended actions section that gives concrete next steps, names the responsible buyer-side role or function where the sources support it, and ties each action to the relevant transaction milestone or urgency.
- Use clear memo language, not deal-markup language; this is an advisory analysis, not a redline.
- Ensure the final document is ready to save as `disclosure-schedule-gap-analysis.docx`.
