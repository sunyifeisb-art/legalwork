---
name: identify-rwi-policy-issues
task_id: corporate-ma/identify-rwi-policy-issues
description: Guides preparation of a prioritized RWI policy gap analysis identifying coverage exclusions, definition mismatches, and underwriting limitations that create uninsured exposure relative to the acquisition agreement representations.
activates_for: [planner, solver, checker]
---

# Skill: RWI Policy Gap Analysis

## 1. Subject-matter triage (only if applicable)

- Treat this as a comparative coverage analysis, not a generic policy summary.
- Identify the agreement, the policy form, endorsements, schedules, disclosure materials, and any diligence or underwriting statements that bear on coverage.
- If the materials include more than one representation category, coverage carve-out, period, party, or insured entity, enumerate them before analysis and run the same coverage check for each.
- If only one category is actually in scope, say so and explain why the remaining categories are not implicated.

## 2. Failure modes the skill is correcting

- The analysis assumes the policy is broadly responsive without mapping each representation in the acquisition agreement to the policy’s covered terms, exclusions, and carve-outs.
- The review flags exclusions at a high level but does not test whether the factual record places the risk inside or outside the exclusion, leaving the uninsured portion unclear.
- The comparison misses definition mismatches between the agreement and the policy even though those differences can narrow coverage materially.
- The no-claims declaration and related knowledge statements are treated as boilerplate without checking whether the signing position is consistent with the deal team’s information.
- The memo identifies problems but stops short of stating severity, transactional consequence, and the concrete fix that would close the gap.

## 3. Legal frameworks / domain conventions that apply

- RWI policies are construed as loss-shifting contracts tied to breaches of representations and warranties in the acquisition agreement; coverage must be tested against the policy’s insuring grant, exclusions, retention, limits, and policy period.
- The governing comparison is agreement-to-policy alignment: every material representation should be matched to the policy definition of covered matters and then screened for exclusions and endorsements.
- Common RWI limitations include known issues, forward-looking statements, tax, environmental, intellectual property, regulatory, and similar carve-outs; the actual wording controls the scope.
- Exclusions that depend on diligence findings must be read against the diligence record, because the factual scope of the investigation can expand or contract the excluded zone.
- Defined terms such as knowledge, materiality, ordinary course, disclosure, and actual awareness often diverge between documents; those divergences can shift whether a breach is covered, excluded, or subject to a higher attachment.
- The policy’s no-claims statement is a coverage-critical representation; accuracy must be assessed against the information available at signing and any contrary facts disclosed in the materials.
- Retention, sublimits, and the policy period govern the practical value of coverage and may leave longer-lived or smaller claims economically uninsured.
- When citing a coverage conclusion, anchor it to the policy language or the controlling contract term, not to a free-standing assertion about what RWI policies “usually” do.

## 4. Analytical scaffolds

- Start with a numbered inventory of the representations and warranties, grouped by topic, and a separate numbered inventory of policy exclusions, endorsements, and special conditions that may affect them.
- For each representation group, test: whether the policy affirmatively covers it, whether an exclusion or endorsement removes or narrows it, whether any definition mismatch changes the result, and whether the retention or period makes the exposure effectively uninsured.
- For each identified issue, state: the scale of the exposure using the transaction-specific figure, term, limit, or other metric visible in the source set; the intersecting clause, schedule, or disclosure that creates or resolves the issue; and the downstream consequence for the client.
- Rank issues by likely claim impact and closeness to closing or post-signing prejudice, not by document order.
- If the agreement contains disclosure schedules or exceptions, test whether those disclosures cure the gap or simply confirm that the matter is known and therefore excluded.
- If a diligence memorandum or environmental report is provided, check whether the exclusion tracks the findings precisely or sweeps more broadly than the facts support.
- If the policy includes an insurer consent, notice, condition precedent, or survival term, treat it as a coverage gate and assess the practical enforcement risk.
- Use controlling policy language and generally recognized insurance-construction principles where needed; avoid unsupported conclusions that do not tie back to the text.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare the agreement’s survival periods with the policy period and note any representation that survives longer than the policy responds.
- Compare the policy’s attachment and limit structure with the likely size and timing of the loss to determine whether the issue is fully covered, partially covered, or outside practical recovery.
- If multiple entities, steps, or closing phases are involved, analyze coverage at each level where the policy’s definitions or exclusions change.
- Where a matter moves from diligence to disclosure to underwriting, trace the sequence so the memo shows how the final policy position was formed.

## 6. Output structure conventions

- Produce a prioritized issues memorandum in a conventional legal-memo format, not a bare checklist.
- Open with a short executive summary that identifies the highest-risk coverage gaps and the principal uninsured exposures.
- Then provide a coverage map organized by representation group, using a uniform severity scale stated once at the top and applied consistently to each issue.
- For each issue entry, include: severity, issue statement, policy/agreement mismatch, source-language anchor, scale or exposure metric from the record, interacting provision, consequence, and recommendation.
- Add separate sections for exclusion analysis, definition mismatches, no-claims declaration risk, and any retention/period limitations that materially affect recoverability.
- End with a Recommended Actions block that assigns each fix to a responsible role and ties it to a transactional milestone, signing deadline, or immediate pre-close timing if no deadline is stated.
- Where the source materials support a clear remedial path, state it concretely, such as seeking an endorsement, revising disclosure, clarifying a definition, or obtaining an underwriting confirmation.
- Keep the memo self-contained and internally cross-referenced so the reader can move from issue to remedy without re-reading the source package.
