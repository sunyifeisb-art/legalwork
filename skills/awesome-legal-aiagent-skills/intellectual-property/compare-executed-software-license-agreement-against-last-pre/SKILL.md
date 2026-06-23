---
name: compare-executed-sla-vs-final-draft
task_id: intellectual-property/compare-executed-software-license-agreement-against-last-pre
description: Deviation report comparing an executed software license agreement against the last pre-execution draft, focused on identifying textual differences, checking authorization under the applicable contracting policy, cross-referencing the negotiation record, and organizing remedial analysis.
activates_for: [planner, solver, checker]
---

# Skill: Compare Executed Software License Agreement Against Last Pre-Execution Draft

## 2. Failure modes the skill is correcting

- Spotting text changes between the final draft and executed agreement without tying each change to the contracting policy and approval record
- Missing deviations that first appear in the executed version because the review stops at high-level business terms instead of clause-level comparison
- Treating negotiated edits and post-approval insertions the same even when the email chain shows only some changes were discussed or accepted
- Describing deviations without stating whether they are authorized, unauthorized, or uncertain under the policy and correspondence
- Failing to rank issues by practical significance, so minor drafting edits obscure changes that affect economics, scope, risk allocation, or implementation
- Omitting remedial analysis or leaving recommendations generic instead of linking the fix to the deviation’s source and timing

## 3. Legal frameworks / domain conventions that apply

- An executed agreement controls over prior drafts, but that does not resolve whether a deviation was properly authorized internally before signature
- Contracting policy governs signatory authority, approval thresholds, and any required escalation for departures from the approved form
- The negotiation record can confirm agreed edits, show unresolved points, or reveal a silent change introduced at execution
- Materiality turns on whether the deviation changes economics, scope, operational burden, indemnity/risk allocation, confidentiality, IP ownership, remedies, or termination leverage
- Common remediation paths include a correcting amendment, a side letter, internal ratification, re-execution, or, in exceptional cases, reformation or rescission
- If the source documents identify a governing authority, use that authority as the basis for the authorization analysis; do not state a legal conclusion without the rule or policy provision that supports it

## 4. Analytical scaffolds

- Build the review provision-by-provision from the final draft to the executed form, capturing every substantive textual difference and noting whether the change is insertion, deletion, substitution, or omission
- Treat the comparison as issue-based, not summary-based: each deviation should be independently analyzed for text change, approval status, negotiation support, and practical effect
- For each deviation, ask four questions in order: what changed, what policy or approval gate applies, what the negotiation record says, and what the client consequence is
- Classify each issue on a uniform ordinal severity scale defined once at the top of the report, and apply the same scale consistently across all entries
- Close each issue with three moves: tie it to the relevant scale or transaction context from the source documents, cross-reference the clause or document it interacts with, and state the downstream consequence for the client
- Where the record is mixed, mark the authorization status as uncertain rather than forcing a binary answer, and explain what further confirmation is needed
- Where more than one provision, party, date, or approval path is in play, enumerate the relevant items explicitly before analyzing them so each receives its own row or entry
- Use the email chain as a validation layer: confirm whether the deviation was discussed, expressly accepted, conditioned, deferred, or never mentioned
- Separate drafting clean-up issues from true risk issues; only the latter should drive severity, while the former should be noted as lower-priority corrections unless they affect interpretation

## 5. Vertical / structural / temporal relationships

- Compare the executed agreement against the last pre-execution draft, then check whether the same change is reflected in the approval chain or was introduced after approval
- Reconcile three timelines: draft evolution, policy approval timing, and signature timing
- If a deviation aligns with a later email but conflicts with an earlier approval limit, flag the gap between negotiated intent and execution authority
- If the final executed text is consistent with the email chain but outside the contracting policy, distinguish external enforceability from internal compliance risk
- If the executed version adds a post-approval change, assess whether the change could have been caught before signature or now requires post-signature remediation
- Where the source set contains multiple drafts or comments, identify the last clean approval point and measure deviations against that baseline rather than against earlier negotiating versions

## 6. Output structure conventions

- Start with a brief executive summary that states the overall risk posture, whether any deviations appear unauthorized, and which items require immediate attention
- Define the severity scale once at the top, using an ordinal format such as Critical / High / Medium / Low, and apply it uniformly
- Provide a deviation table or issue list with one row per deviation, including: provision, draft text, executed text, deviation description, authorization status, negotiation support, severity, consequence, and remedial recommendation
- Keep the issue analysis clause-specific; do not merge separate deviations into a single composite entry unless the source documents make them inseparable
- Include a prioritized issues section that orders items by severity and remediation urgency
- End with a Recommended Actions section that gives concrete next steps, identifies the responsible role from the source documents where possible, and ties each action to a timing anchor or milestone
- Include a remediation roadmap that distinguishes corrections feasible by amendment or ratification from matters requiring broader renegotiation or escalation
- If the report is to be delivered as `deviation-report.docx`, ensure the document contains the operative analysis itself and not only a summary or cover note
