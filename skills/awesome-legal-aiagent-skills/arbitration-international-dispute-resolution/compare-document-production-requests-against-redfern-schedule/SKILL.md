---
name: compare-document-production-requests-against-redfern-schedule
task_id: arbitration-international-dispute-resolution/compare-document-production-requests-against-redfern-schedule
description: Supports a gap analysis memorandum that compares document production requests against response schedules, checking both structure and substance while avoiding instance-specific conclusions.
activates_for: [planner, solver, checker]
---

# Skill: Redfern Schedule Gap Analysis

## 1. Subject-matter triage
- Treat the request set and Redfern schedule as parallel source tables that must be aligned before any merits assessment.
- Determine whether the comparison is one-to-one, or whether requests were split, merged, renumbered, narrowed, or left unanswered.
- If multiple parties, periods, custodians, affiliates, or privilege bases appear in the source set, enumerate them first and analyze each separately.
- Separate procedural defects from substantive objections; do not collapse them into a single “disputed request” label.

## 2. Failure modes the skill is correcting
- Confuses substantive scope disputes with numbering and alignment errors, including swaps, splits, and renumbering that break request-to-response matching.
- Misses unanswered requests even where the governing procedural order requires a response by a deadline.
- Reviews privilege assertions without checking whether the asserted basis is temporally plausible for the document at issue.
- Fails to detect new factual allegations embedded in response columns, which exceed the proper function of a response schedule.
- Treats narrowed date ranges as generic objections instead of isolating the excluded period and its significance.
- Ignores arithmetic, totals, or cross-referenced figures that should be internally consistent across the schedule.
- Analyzes affiliate-held documents without assessing whether the responding party had control under the applicable framework.
- Describes issues without tying them to the governing rule, source cross-reference, and practical consequence for the hearing.

## 3. Legal frameworks / domain conventions that apply
- Redfern schedules are multi-column procedural tools: request, response, requester’s reply, and tribunal decision must be analyzed distinctly.
- Document production standards typically turn on relevance, materiality, and case connection, with control potentially extending beyond direct possession where the governing framework so provides.
- Failure to respond by a required deadline can support waiver-style relief or an order compelling production, subject to the procedural order and tribunal practice.
- Privilege objections should be tested against the applicable doctrine, including dominant purpose where that test governs dual-purpose documents.
- Temporal plausibility matters: a privilege claim may be inconsistent if the asserted legal relationship or retention post-dates the document.
- Response columns should not function as pleadings; substantive narrative additions can be improper if they go beyond answering the request.
- When citing any legal proposition, identify the governing authority by name and section, rule, article, or recognized doctrinal test.

## 4. Analytical scaffolds
- Align every response to the same-numbered request in the underlying set before evaluating substance; flag any mismatch, split, merger, or renumbering.
- For each unanswered request, identify the procedural deadline source and assess whether the omission supports waiver, compulsion, or another remedy under the applicable order.
- For each narrowed request, identify the excluded time period or subject slice, explain why it matters to the dispute, and assess whether the narrowing is justified.
- For each privilege objection, test the claimed doctrine, the document’s creation date, and the timing of any legal engagement or equivalent trigger.
- For each response containing numbers, dates, totals, or other quantitative statements, check internal consistency and cross-reference against the source documents.
- For each response that adds facts, ask whether the added material is responsive explanation or an impermissible merits narrative.
- For each affiliate-control issue, identify the holder, the affiliate relationship, and the indicia of control relevant under the applicable framework.
- For each issue, close the analysis by tying the point to the relevant authority, the interacting request or schedule entry, and the hearing consequence.

## 5. Vertical / structural / temporal relationships
- Track vertical relationships between the original request, the response, any requester reply, and any decision column; do not evaluate a response in isolation.
- Treat numbering, subparting, and references as structural dependencies: if the request set changes shape, the substantive comparison may change with it.
- Preserve temporal sequencing: request date, response date, document creation date, privilege-retention date, and hearing date may each affect the analysis.
- Where dates are narrowed or privilege is asserted, identify the time window implicated and whether the asserted basis existed at the relevant time.
- Where documents are said to be held by affiliates or related entities, map the control relationship across the relevant organizational layer before drawing conclusions.

## 6. Output structure conventions
- Prepare a hearing-ready gap analysis memorandum in conventional memo form, not as a raw issue dump.
- Open with a short executive summary that states the main alignment problems, unanswered requests, and highest-value hearing points.
- Include a request-by-request table with at least: request identifier, subject matter, response status, structural issue, substantive issue, authority, and recommended hearing use.
- Include a separate section for structural defects: misnumbering, swaps, splits, merges, missing responses, and numerical inconsistencies.
- Include a separate section for substantive defects: scope narrowing, privilege challenges, temporal implausibility, improper factual additions, and control issues.
- Use an explicit ordinal severity field for each issue, applied consistently across the memorandum with a brief one-line rationale.
- For every issue entry, state the scale or extent implicated, cite the governing authority, identify the interacting request or schedule item, and explain the downstream consequence at the hearing.
- End with a Recommended Actions block that assigns each step to a role drawn from the source materials and anchors it to a deadline or hearing milestone.
- Keep the tone strategic and pragmatic: identify what can be pressed immediately at the hearing, what requires follow-up, and what should be preserved for later relief.
