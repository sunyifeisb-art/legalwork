---
name: draft-sec-comment-letter-response
task_id: capital-markets/draft-sec-comment-letter-response
description: SEC comment letter response drafting where the baseline addresses each comment narratively but omits the standard representation, draft-ready proposed disclosure language, and the privileged internal strategy memo.
activates_for: [planner, solver, checker]
---

# Skill: Draft SEC Comment Letter Response

## 1. Subject-matter triage

- Treat this as a two-deliverable drafting task: a public SEC response letter and a separate privileged internal strategy memo.
- Draft the public letter first, then the internal memo after the letter is complete and non-empty.
- If the comment letter raises multiple topics, handle them one by one in the order presented; do not collapse distinct comments into a single generic response.
- If a comment can be answered only by reference to source filings, accounting papers, board materials, or disclosure drafts, confirm the governing source before drafting any language.

## 2. Failure modes the skill is correcting

- The response stops at narrative reassurance and does not give draft-ready disclosure text for any comment that will be addressed through enhanced future disclosure.
- The response omits the customary SEC representation or places it in an awkward location that makes the letter look unfinished.
- The response mixes public-facing advocacy with privileged legal analysis, litigation risk, or internal disagreement about the best response.
- The response answers accounting, form, non-GAAP, segment, or cybersecurity comments at too high a level and fails to tie the answer to the governing rule or framework.
- The response gives a commitment to “improve disclosure” without showing the actual language that will appear in the next filing.
- The internal memo is treated as a summary only and does not surface risk, unresolved questions, and recommended positioning for the client team.

## 3. Legal frameworks / domain conventions that apply

- SEC comment responses should read as formal correspondence to staff, with each comment addressed directly and in sequence.
- Include the standard closing representation commonly used in comment response letters, consistent with current SEC practice for the matter at hand.
- For disclosure comments, cite the controlling SEC rule, form item, interpretive guidance, or accounting authority that supports the response.
- For non-GAAP issues, address both the non-GAAP presentation framework in Regulation G and the applicable Item 10(e) / form-specific guidance when relevant.
- For segment issues, anchor the response in ASC 280 and the CODM’s internal reporting and aggregation process.
- For cybersecurity issues, separate incident-reporting analysis from annual risk-management and governance disclosure analysis; do not treat them as the same obligation.
- For accounting comments, use the relevant accounting literature and the filing context rather than a generic “consistent with GAAP” statement.
- For form or filing-structure comments, cite the specific form item or instruction that governs the disclosure format.
- The public letter should remain factual, restrained, and implementation-focused; privilege, mental impressions, and litigation posture belong in the internal memo.

## 4. Analytical scaffolds

- Identify each comment’s subject matter before drafting the answer so the controlling authority can be matched to the issue.
- For every comment, do three things in the response:
  - answer the staff’s point directly;
  - cite the governing authority or framework by name;
  - include draft-ready disclosure language if the company is changing or expanding disclosure.
- When the company is not changing disclosure, explain why the existing disclosure is adequate under the cited authority, without over-arguing.
- When a comment touches financial figures, verify the figures against the source documents and confirm any arithmetic before using them.
- When a comment may implicate more than one disclosure regime, split the analysis so each governing framework is addressed separately.
- In the internal memo, evaluate the risk of the proposed public response, note any internal disagreement or open judgment call, and recommend a position that the legal and finance team can implement.
- Keep the public letter and the memo aligned on substance, but do not repeat privileged risk analysis in the public letter.

## 5. Vertical / structural / temporal relationships

- Preserve the sequence of the staff comments and mirror that sequence in both deliverables.
- Distinguish between current-period filing disclosure, future-period enhanced disclosure, and any one-time remediation commitment.
- If the response depends on an internal reporting structure, explain the operational hierarchy only to the extent needed to support the disclosure position.
- If multiple business units, reporting lines, or disclosure owners are involved, identify the responsible function in the memo and reflect only the necessary public-facing facts in the letter.
- If a proposed disclosure will affect a future filing, make the temporal anchor explicit so the reader knows when the revised language will appear.
- Keep any privileged discussion of litigation exposure, negotiation leverage, or internal disagreement out of the public letter and confined to the memo.

## 6. Output structure conventions

- Produce exactly two documents: a public SEC comment response letter and a privileged internal strategy memo.
- The response letter should be formatted as a formal letter and organized comment-by-comment, with proposed disclosure language embedded where relevant.
- The standard representation should appear in the closing section or another conventional location that is clearly part of the letter.
- The memo should be labeled privileged and confidential, written for the client’s legal and finance team, and organized comment-by-comment.
- The memo should include a brief risk assessment, the key decision points, and a recommended course of action for each comment.
- End the memo with a concise Recommended Actions section that assigns the next step to a role and ties it to the next filing or response deadline.
- Before finishing, ensure the primary deliverable is complete and non-empty, and that the memo is secondary to the letter rather than a substitute for it.
