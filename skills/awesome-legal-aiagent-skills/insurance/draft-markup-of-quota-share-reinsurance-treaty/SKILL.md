---
name: draft-markup-quota-share-reinsurance-treaty
task_id: insurance/draft-markup-of-quota-share-reinsurance-treaty
description: Agents producing a quota share treaty markup memo identify commission changes, assess the economic significance of retention and profit-participation mechanics, evaluate arbitration substitutions as structural changes, and note any internal approval requirements before accepting below-floor commission terms.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Quota Share Reinsurance Treaty — Redlined Agreement with Commentary

## 1. Subject-matter triage

- Treat the proposed treaty, the expiring treaty, and the cedant guidelines as a three-document comparison; if only one proposed clause is available, state that the comparison is incomplete and identify the missing source.
- Separate hard legal blockers from commercial negotiation points before drafting any redline.
- Use the markup to preserve the cedant’s position on economics, claims handling, and dispute resolution while distinguishing non-negotiable terms from terms that can move for value.

## 2. Failure modes the skill is correcting

- A change in commission mechanics is described without testing it against the cedant’s internal floor and approval path.
- A loss corridor or similar retention band is treated as drafting noise even though it changes the cedant’s retained economics across a material slice of the loss distribution.
- A profit commission revision is summarized without assessing whether the minimum margin, carryforward, or related trigger still yields meaningful participation.
- A substitution of general commercial arbitration for reinsurance-specific arbitration is treated as procedural only, instead of a structural change to arbitrator qualifications and process.
- An insolvency clause revision is flagged generically without checking the governing insolvency-clause requirement and enforceability consequences.
- Late-payment interest changes are noted without stating the direction of economic impact.
- Commentary stops at issue-spotting and does not give the business or legal team a usable proposed revision.

## 3. Legal frameworks / domain conventions that apply

- Compare each proposed deviation against both the expiring treaty and the cedant’s internal underwriting or legal guidelines before accepting any change.
- Ceding commission: assess whether the proposed rate falls below the internal floor and, if so, identify the approval requirement that must be satisfied before acceptance.
- Loss corridor: removal or narrowing of a corridor alters the cedant’s retained exposure across the affected band and should be treated as an economic change, not a stylistic one.
- Profit commission: review the formula, minimum margin, expense allowance, carryforward, and trigger mechanics together; the question is whether the cedant still receives economically meaningful participation.
- Arbitration: if the proposal replaces an industry-specific reinsurance arbitration forum with a general commercial forum, treat that as a structural shift affecting arbitrator expertise and procedure.
- Insolvency clause: test the text against the governing reinsurance insolvency-clause statute or regulation applicable to the transaction; identify any mismatch by reference to the controlling authority.
- Interest on overdue amounts: identify whether the proposal increases or decreases the cost of delay for the paying party and state the resulting bargaining or cash-flow effect.
- Loss occurrence / aggregation: changes to occurrence definitions can alter aggregation, attachment behavior, and interaction with other reinsurance protections.
- Priority should track economic significance, enforceability risk, and structural change, not just textual breadth.

## 4. Analytical scaffolds

1. Start with a clean issue inventory grouped by topic: commission, profit commission, retention bands or corridor mechanics, occurrence and aggregation, claims/payment timing, arbitration, insolvency, and other deviations.
2. For each issue, compare the proposed text to the expiring treaty and internal guidelines, then identify the exact departure in plain language.
3. For each issue, state:
   - severity on a uniform ordinal scale defined once at the top of the memorandum;
   - whether the point is a walk-away position or a negotiable concession;
   - the proposed redline text using plain-text markup that survives export, such as [DELETED: ...], [INSERTED: ...], or [REPLACED: old → new];
   - a short rationale tied to the transaction’s economics or enforceability.
4. Quantify or scale each issue using whatever source figure is available in the materials, such as premium, expected loss exposure, term length, attachment band, commission floor, or payment timing; if only directional data exists, say so explicitly.
5. Cross-reference any interacting provision in the source set when the change affects another clause, schedule, or guideline.
6. State the downstream consequence for the cedant: economic, operational, regulatory, or dispute-resolution impact.
7. For arbitration changes, explain why the replacement is or is not acceptable in light of industry reinsurance practice and whether the cedant should restore specialist arbitration features.
8. For insolvency language, identify the governing authority by name and section or comparable citation form, then explain the mismatch and the likely enforceability or credit consequence.
9. For below-floor commission terms, note the internal approval path in the rationale rather than burying it in a footnote.
10. End each issue entry with a concrete recommended action directed to the responsible role and tied to the transaction timeline.

## 5. Vertical / structural / temporal relationships

- Track how a change in one clause affects the rest of the treaty: commission terms can affect economics, retention mechanics can affect loss-sharing, and dispute-resolution language can affect claims administration.
- Read the treaty in time order: placement, inception, premium payment, loss reporting, arbitration, and insolvency consequences may each arise at different stages.
- If a clause is stated to apply only after a threshold event or during a defined period, identify the trigger and duration before assessing the risk.
- When multiple versions or counterparties are present, analyze each separately rather than collapsing them into one representative path.
- If a provision interacts with a schedule, exhibit, or guideline, carry the cross-reference through the markup instead of discussing it in isolation.

## 6. Output structure conventions

- Produce a treaty markup memorandum suitable for direct conversion to `treaty-markup-memorandum.docx`; do not substitute a generic summary for the markup.
- Open with a short severity legend using one ordinal scale and apply it uniformly.
- Include a prioritized issue table or numbered list with one row per deviation, ordered from highest to lowest priority.
- For each entry, include:
  - severity;
  - classification as walk-away or negotiable;
  - the proposed redline language in robust textual markup;
  - concise rationale;
  - source comparison point(s);
  - downstream consequence;
  - recommended action with responsible role and timing anchor.
- Use conventional legal-markup language, but ensure every substantive change is visible in plain text, not only by formatting.
- Surface verbatim quotes from internal documents only where necessary to anchor a deviation; otherwise paraphrase.
- Close with a short recommended-actions block that converts the markup into next steps for counsel and the business owner before execution or circulation.
