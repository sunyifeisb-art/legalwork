---
name: analyze-counterparty-markup-ppa-solar
task_id: energy-natural-resources/analyze-counterparty-markup-of-power-purchase-agreement
description: Guides analysis of a buyer's markup of a power purchase agreement by connecting related changes that compound risk exposure, benchmarking performance provisions against market ranges, identifying changes that threaten project financing, and separately identifying changes that appear commercially reasonable to accept.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Power Purchase Agreement — Deviation Report

## 2. Failure modes the skill is correcting

- The analysis isolates single edits and misses when linked revisions shift the seller’s risk profile as a system, especially where one change expands exposure and another removes a practical backstop.
- The analysis describes a deviation without anchoring it to the source set, so the report fails to show how the playbook, internal email guidance, and lender summary jointly constrain the markup.
- The analysis treats off-market performance terms as ordinary negotiation points instead of identifying when they move outside the acceptable commercial range for the project type.
- The analysis underweights lender-facing edits and fails to distinguish a negotiable commercial point from a provision that can impair financing or delay close.
- The analysis omits an explicit severity hierarchy, which makes the report harder to triage and weaker as a negotiation tool.
- The analysis flags problems but does not convert them into concrete counter-positions or acceptance recommendations.

## 3. Legal frameworks / domain conventions that apply

- Contract deviation analysis should be anchored to the seller’s baseline form, the buyer’s markup, and any referenced playbook or lender requirements; the operative question is whether the revision alters risk allocation, bankability, or economics in a material way.
- Performance obligations should be read against the project’s technology, resource profile, and measurement method; annual tests, rolling averages, and guaranteed output levels are not interchangeable and can shift burden materially.
- Delay, curtailment, termination, and force majeure provisions should be analyzed as linked economic mechanisms: the trigger, duration, rate, cap, and remedy must be read together.
- Financing-protection language is a bankability issue, not a mere drafting preference, where the source set indicates lender reliance on cure rights, assignment consent, direct arrangements, or similar protections.
- If the buyer is a public or quasi-public offtaker, sovereign-immunity, waiver, and dispute-remedy language must be checked against the governing law framework reflected in the source materials.
- Any legal conclusion should be tied to the governing authority identified in the source set or to the controlling statute, regulation, or doctrine customarily applied in this market.

## 4. Analytical scaffolds

- Start by identifying each marked change in the buyer redline and grouping related edits that operate on the same clause, remedy, or risk bucket.
- For each issue, compare: original term, buyer revision, playbook position, lender summary position, and any internal email guidance that clarifies deal priority.
- Close each issue with three elements: quantify the exposure or scale using a figure or threshold from the source documents; cross-reference the clause, schedule, or external document it interacts with; and state the downstream consequence for the seller.
- Use an ordinal severity scale defined once at the top of the report and apply it consistently to every issue.
- Separate genuinely bankability-threatening edits from commercially acceptable asks; do not dilute a critical financing issue by mixing it into ordinary negotiation comments.
- Where changes interact, analyze them as one combined deviation rather than as disconnected line edits if the combined effect is what creates the risk.
- For each issue, include a brief counter-proposal that restores the seller’s intended allocation or narrows the buyer’s ask to market-acceptable bounds.
- When the markup touches multiple periods, thresholds, notice windows, or performance tests, enumerate the relevant items before analysis and address each in turn rather than using a single representative treatment.

## 5. Vertical / structural / temporal relationships

- Treat the agreement as a layered system: commercial operation timing, delivery obligations, compensation mechanics, termination rights, and lender protections each feed into the next.
- A change to timing may alter damages, revenue timing, cure rights, and financing feasibility at once; assess those downstream effects together.
- If the buyer revises a threshold and a remedy in the same provision set, evaluate the revised trigger, the revised consequence, and the revised cap as one exposure chain.
- If lender protection language is removed or weakened, trace the effect from financing availability to construction or completion risk to eventual performance under the PPA.
- If force majeure, curtailment, or termination provisions are asymmetric, identify both the immediate option granted to one party and the longer-term incentive distortion created by that asymmetry.

## 6. Output structure conventions

- Open with a short methodology note stating the document set reviewed and the severity scale used.
- Present the report as a deviation list organized by severity, from highest to lowest.
- For each deviation, include:
  - clause or topic;
  - original seller term;
  - buyer markup;
  - source-based comparison point from the playbook, internal email, or lender summary;
  - impact assessment with scale, cross-reference, and consequence;
  - severity;
  - recommended counter-proposal.
- Use plain, conventional headings rather than an internal rubric-style checklist.
- End with a separate section for provisions that are commercially reasonable to accept, with a brief reason for acceptance.
- End with a concise Recommended Actions block that assigns the next step to the relevant role and ties it to the deal timeline or signing / financing milestone.
- If the task requires producing a redline-style attachment, mark each substantive change in text in a way that survives export to Word or plain text, and pair each change with a short rationale.
- If the report cites legal propositions, identify the controlling authority or market authority supporting the point instead of stating the conclusion bare.
- Finish with a short summary matrix capturing issue, seller position, buyer ask, recommended counter, and walk-away stance.
