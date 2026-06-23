---
name: compare-sla-negotiation-playbook
task_id: intellectual-property/compare-software-license-agreement-against-negotiation-playbook
description: Deviation report comparing a vendor-drafted software license agreement against the company negotiation playbook and internal priorities, with a summary deviation table.
activates_for: [planner, solver, checker]
---

# Skill: Compare Software License Agreement Against Negotiation Playbook

## 1. Subject-matter triage

- Identify the agreement version to be compared, the playbook source of truth, and any internal emails that reflect business priorities or negotiated fallbacks.
- Treat the playbook as the baseline and internal priorities as possible overrides, clarifications, or escalations.
- Map the draft against all relevant license dimensions, including any terms that are present, materially different, or missing entirely.

## 2. Failure modes the skill is correcting

- Applying a generic software-license review lens instead of the playbook’s specific must-have, preferred, and negotiable positions.
- Missing internal priorities that sharpen or displace the playbook for a particular deal context.
- Failing to separate acceptable fallbacks from true deviations that fall below the stated floor.
- Overlooking omissions: a required clause can be a deviation even when the draft is silent.
- Collapsing multiple issues into one blended comment, which obscures deal risk and response strategy.
- Stating a deviation without identifying why it matters operationally, economically, or legally for the client.

## 3. Legal frameworks / domain conventions that apply

- Compare the draft to the negotiated position on core software-license topics: scope of license, permitted use, restrictions, support and maintenance, service levels, acceptance, warranties, indemnities, IP ownership, confidentiality, audit/compliance rights, termination, data handling, and liability allocation.
- Read defined terms consistently across the agreement; a change in definition can alter the effect of multiple downstream clauses.
- Distinguish between mandatory language, preferred language, and fallback language in the playbook; the classification controls how aggressively to flag the deviation.
- Treat internal priorities as deal-specific guidance that may require elevating a preferred item or relaxing a standard position.
- If the source documents cite any statute, regulation, or other controlling authority, carry that citation through the analysis rather than paraphrasing it away.

## 4. Analytical scaffolds

- Provision inventory: enumerate the relevant provisions in the draft, then compare each against the playbook and internal priorities.
- Deviation classification: label each item by severity on a uniform ordinal scale defined once at the top of the report.
- Omission check: separately test whether any playbook-required concept is absent from the draft.
- Cross-document linkage: for each issue, connect the draft clause to the playbook position and any email-based priority that changes the analysis.
- Consequence analysis: explain the client-facing effect of each deviation, including operational, commercial, compliance, or risk-allocation consequences.
- Response framing: for each material issue, state the recommended negotiating position or fallback.
- If only one subject area is actually in scope, say so explicitly before analyzing; otherwise, cover each distinct provision area separately.

## 5. Vertical / structural / temporal relationships

- Track clause hierarchy: definitions can control operative clauses, schedules can override body text if the agreement says so, and exhibits can introduce hidden scope shifts.
- Check temporal ordering: term, renewal, notice windows, cure periods, acceptance deadlines, and audit timing can change the practical effect of the same wording.
- Compare allocation across parties and affiliates where the draft expands rights or obligations beyond the named contracting entity.
- Watch for asymmetry over time: one-sided renewal rights, unilateral changes to service levels, or post-termination survivals can convert a modest edit into a material deviation.

## 6. Output structure conventions

- Produce a deviation report with a short executive summary, then a provision-by-provision analysis, then a summary deviation table.
- Define the severity scale once at the top and use it consistently for every entry.
- For each entry, include:
  - the provision or topic,
  - the draft position,
  - the playbook position,
  - any internal-email priority that modifies the baseline,
  - the severity classification,
  - the recommended counter-position or fallback.
- Make omission-based deviations explicit; do not bury them inside unrelated clause comments.
- Keep the tone practical and negotiation-oriented; the report should tell the reader what to push, what to accept, and what to escalate.
- End with a concise Recommended Actions section that assigns the next step to the appropriate business or legal role and ties it to the deal timeline.
