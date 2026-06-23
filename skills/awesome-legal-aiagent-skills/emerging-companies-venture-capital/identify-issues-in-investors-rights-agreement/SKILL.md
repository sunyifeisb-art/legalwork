---
name: ecvc-identify-issues-ira
task_id: emerging-companies-venture-capital/identify-issues-in-investors-rights-agreement
description: Identifying issues in an investors’ rights agreement for a preferred stock financing requires checking for provisions carried over from an earlier form without updating them for the post-closing investor base, assessing the practical effect of any board observer on attorney-client privilege, reviewing restrictive covenants under the applicable law for each bound party, and comparing any repeated defined thresholds for consistency across the agreement.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Investors' Rights Agreement

## 1. Subject-matter triage
- Use this skill for an IRA review that compares a draft Series B agreement against the term sheet, prior Series A IRA, certificate of incorporation, and review instructions.
- Treat the term sheet and charter as controlling deal constraints; treat the prior IRA as a carryover baseline; treat the review instructions as the lens for prioritization.
- If the draft appears to be an amendment-and-restatement or otherwise reusing earlier forms, assume stale provisions are possible until checked against the post-closing investor base and current rights package.

## 2. Failure modes the skill is correcting
- Provisions copied from the prior form are left in place even though the Series B closing changes the investor base, ownership mix, or rights thresholds.
- Registration-rights mechanics, investor-qualification mechanics, or information-rights thresholds appear in multiple places with different numbers or conditions.
- A board observer issue is described as a theoretical privilege point without stating how counsel’s ability to give legal advice at meetings is affected in practice.
- Restrictive covenants are analyzed without identifying the governing law for each bound person and without testing duration and scope under that law.
- Reporting cadence is reduced or otherwise changed from the prior form without tying the change to a deal reason or the current information needs.
- Issues are described only abstractly, without comparing the draft against the other source documents and without stating the downstream effect on the company or investors.

## 3. Legal frameworks / domain conventions that apply
- Compare the draft first to the term sheet, then to the prior IRA, then to the charter; when provisions conflict, identify which document appears to drive the point and why.
- For carried-over thresholds, test whether the original calibration still makes sense after the Series B closing and whether any threshold should be reset to reflect the new investor mix.
- For registration rights, confirm the demand threshold, initiation mechanics, and termination trigger together; a threshold that was sensible in the prior round may be under- or over-inclusive after the financing.
- For investor-qualification concepts, look for the same concept in the definitional section, information rights, pro rata rights, or other benefit grants; inconsistent formulations create ambiguity about who qualifies.
- For board observers, assess whether the observer is affiliated with an investor whose interests could diverge from the company’s; if so, analyze attorney-client privilege under the practical meeting context and the need to exclude the observer from privileged discussions.
- For restrictive covenants, identify the governing law applicable to each bound party and test enforceability under that law’s rules on scope, duration, and employee restraints.
- For reporting provisions, compare the draft frequency and scope to the prior form and the business rationale supplied in the term sheet or instructions.
- Cite the legal authority that supports each proposition you rely on, using the controlling statute, regulation, rule, or generally recognized doctrinal source.

## 4. Analytical scaffolds
- Build a source-by-source comparison matrix: term sheet, prior IRA, charter, and review instructions.
- For each provision that may have been carried over, ask three questions: what changed from the prior form, what in the current deal still supports the language, and what risk arises if it is left untouched.
- For each issue entry, include: provision, what is wrong, the controlling authority or governing deal source, why it matters in the transaction, severity, and the fix.
- When a threshold or count appears more than once, list every occurrence before assessing it; do not analyze one occurrence as a proxy for the others.
- For board-observer questions, identify the observer, the observer’s affiliation, the meeting context, and the specific privilege consequence.
- For restrictive covenants, run the analysis separately for each bound party and each governing-law bucket if different parties are subject to different laws.
- If the draft reduces any recurring disclosure or reporting obligation, compare the cadence against the prior form and explain whether the reduction is justified by the current financing structure.
- Close each issue by tying together scale or threshold, cross-document interaction, and downstream consequence; a description alone is not enough.
- Prioritize issues that affect control of the rights package, privilege, enforceability of covenants, or consistency of investor eligibility.

## 5. Vertical / structural / temporal relationships
- Track how rights evolve across the Series A IRA, the Series B draft, and the charter; later documents should be read for whether they intentionally supersede earlier mechanics or accidentally preserve them.
- Distinguish between pre-closing and post-closing states when evaluating thresholds, investor counts, and qualification tests.
- Distinguish between provisions that bind the company, investors, employees, directors, or observers; the governing law and enforceability analysis may differ by bound party.
- Distinguish between a defined term and each operative clause that uses it; if the same concept is restated differently, flag the mismatch even if the definition itself looks acceptable.
- If a provision has timing effects, note whether the issue arises at signing, closing, during board meetings, or upon a later financing or liquidity event.

## 6. Output structure conventions
- Produce a prioritized issue memorandum in conventional memo form.
- State severity using an ordinal scale at the top and apply it uniformly to every issue entry: Critical, High, Medium, Low.
- Open with a short executive summary that identifies the most important mismatches and stale carryovers.
- Then provide issue entries in priority order, each in this shape: provision → issue description → governing authority or deal source → transaction impact → severity → recommended fix.
- For each issue, expressly compare the draft to the relevant source document(s) and identify the concrete divergence.
- Include a comparison table for repeated thresholds or investor-qualification concepts, with one row per occurrence and the stated threshold or condition.
- Include a carried-over-provisions table for items likely imported from the prior form, showing the prior treatment, current treatment, and whether the language should be retained, revised, or deleted.
- End with a Recommended Actions section that assigns the action to the relevant role and ties it to the closing or markup timeline.
- Keep the memo focused on issues, not clean-form recitation; quote sparingly and only when necessary to pinpoint the clause at issue.
