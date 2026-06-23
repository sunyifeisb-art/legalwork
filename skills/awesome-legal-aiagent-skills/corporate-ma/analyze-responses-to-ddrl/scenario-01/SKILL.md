---
name: analyze-responses-to-ddrl-s01
task_id: corporate-ma/analyze-responses-to-ddrl/scenario-01
description: Guides cross-verification of seller responses to diligence requests against the underlying document set to identify false or incomplete characterizations, regulatory contradictions, financial inconsistencies, and outstanding information gaps.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Responses to DDRL (Scenario 01)

## 1. Subject-matter triage

- This task is a diligence gap analysis, not a generic issue list: verify each seller response against the source set, then translate any mismatch into a concrete follow-up request.
- Treat the DDRL, seller response matrix, VDR materials, and partner guidance as an integrated record; no single response is reliable unless it is consistent with the supporting documents.
- If the source set contains multiple entities, periods, facilities, permit groups, or response batches, enumerate them first and analyze each in turn rather than collapsing them into a blended summary.

## 2. Failure modes the skill is correcting

- Logging whether a request was answered without testing whether the answer is accurate, complete, and responsive to the actual ask.
- Missing contradictions between a seller’s denial, qualification, or “not applicable” response and the underlying document set.
- Failing to surface characterization errors in financial, operational, regulatory, labor, insurance, or IP materials that change diligence risk.
- Treating internal guidance as background noise instead of using it to prioritize material gaps and escalation points.
- Concluding that a document “responds” when it is merely adjacent, partial, outdated, or non-responsive.
- Stopping at description of the gap without converting it into a diligence consequence and a targeted follow-up ask.

## 3. Legal frameworks / domain conventions that apply

- Diligence response gap analysis asks whether the response is supported by the source set; the legal or commercial significance flows from the mismatch, not from the existence of a response alone.
- Regulatory and compliance review should check for notices, correspondence, consents, orders, conditions, or remediation obligations that undercut a categorical denial or silence.
- Financial statement review should distinguish audited, reviewed, and compiled materials and test whether metrics, captions, or date ranges are internally consistent across documents.
- License and contract review should test anti-assignment, change-of-control, consent, exclusivity, renewal, and termination mechanics where transferability or continuity matters.
- Permit analysis should focus on expiration timing, renewal posture, transferability, and any action required before closing or integration.
- Labor and employment review should verify whether collective bargaining, disputes, or worksite restrictions are reflected consistently across the record.
- Claims and insurance review should confirm whether actual claims history, coverage terms, exclusions, and pending matters are provided, not just declarations or summaries.
- Related-party and affiliate analysis should test whether schedules and financial disclosures capture counterparties, management arrangements, shared services, or non-arm’s-length terms.
- Cite the controlling authority for any legal proposition relied upon, using the governing statute, regulation, rule, or other authority as identified in the source materials or recognized practice authority.

## 4. Analytical scaffolds

- For every diligence item, run the same sequence:
  1. identify the seller’s characterization,
  2. locate the underlying document(s) that should support it,
  3. test whether the document is actually responsive,
  4. test whether the document contradicts or qualifies the characterization,
  5. state the practical consequence and the follow-up request.
- Do not treat a document reference as sufficient if the document is missing, incomplete, stale, unsigned, non-final, or addresses only part of the request.
- When the source set spans more than one time period or reporting layer, compare them directly and flag internal inconsistencies rather than assuming later documents supersede earlier ones.
- For each issue, close the loop with:
  - a concrete size, timing, exposure, or scope marker drawn from the source set;
  - a cross-reference to the interacting document, schedule, clause, or response entry;
  - the downstream effect on closing, diligence confidence, integration, regulatory posture, or economics.
- Apply a uniform severity scale and define it once at the outset; use the same ordinal labels consistently across the memo.
- If an issue cannot be quantified from the source materials, say so explicitly and explain what information is needed to quantify it.
- Frame follow-up requests as diligence-ready asks that can be sent without further editing.

## 5. Vertical / structural / temporal relationships

- Compare seller responses against the exact request scope, then against the supporting record, then against any later or higher-priority source that modifies the answer.
- Pay special attention to temporal mismatches: pre- versus post-signing facts, expired versus current documents, and historical issues that remain live because they were not cured or renewed.
- Where one record implies another, test the chain end-to-end; a response is incomplete if the supporting document only partially answers the request or if a later document changes the earlier position.
- If multiple business lines, sites, permits, contracts, or counterparties are involved, separate them by row or subsection so the reader can see which gap attaches to which item.

## 6. Output structure conventions

- Write a memorandum that begins with a short risk-scale legend, then a concise executive summary, then the issue analysis grouped by severity.
- Use a table or similarly structured format for the body so each entry captures:
  - diligence item reference,
  - seller response characterization,
  - actual source content,
  - gap or contradiction,
  - severity,
  - consequence,
  - specific follow-up request.
- Each issue entry should be self-contained and should not rely on another entry for context.
- Use clear ordinal severity labels such as Critical, High, Medium, and Low, and apply them uniformly.
- Draft follow-up requests in formal diligence language, with enough specificity that counsel or the business team can send them as written.
- End with a distinct Recommended Actions section that assigns the next step to the appropriate role and ties it to the relevant transaction or response milestone.
- If the source set is sparse on a topic, include a brief “information not confirmed” note rather than implying the issue is cleared.
- The deliverable should read as a diligence-gap-analysis memo, not a narrative summary or a checklist of unanswered questions alone.
