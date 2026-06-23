---
name: draft-markup-of-executive-employment-agreement
task_id: employment-labor/draft-markup-of-executive-employment-agreement
description: Guides the drafter in producing a section-by-section redlined markup of an executive employment agreement anchored to the approved term sheet, internal compensation guidance, and applicable regulatory requirements.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Executive Employment Agreement

## 1. Subject-matter triage

- Treat the approved term sheet, compensation playbook, clawback policy, and engagement instructions as the controlling source set; if they conflict, identify the governing document hierarchy before drafting changes.
- Identify the agreement’s substantive sections first, then map each section to the source documents that govern it.
- If the draft contains multiple compensation, severance, change-in-control, or restrictive-covenant variants, enumerate each variant before analysis rather than analyzing a representative clause.
- If a requested change is outside the source set, mark it as a judgment call and distinguish it from a required conformity fix.

## 2. Failure modes the skill is correcting

- Markup is proposed without tying each change to the term sheet or internal guidance, leaving unsupported edits and missed departures from approved economics.
- Compensation provisions are left above internal ceilings or outside the approved structure, especially salary, target bonus, equity, severance, and change-in-control benefits.
- Good Reason is left open-ended, subjective, or overbroad, instead of being limited to objective triggers with a notice-and-cure process.
- Severance and other post-termination payments are drafted without checking deferred-compensation timing rules, payment delays, and release-timing interactions.
- Clawback language is narrower than the governing policy or omits the restatement-based framework required for public-company compliance.
- Changes are described in prose only, but the redline is not independently machine-readable or export-safe.
- The commentary identifies an issue but does not state its relative severity, the interacting clause or document, and the practical consequence to the client.
- The draft is reviewed without clear recommendations that assign responsibility and timing.

## 3. Legal frameworks / domain conventions that apply

- Use the approved term sheet as the primary economic and business baseline; use the compensation playbook to test whether the draft fits approved ranges, role bands, and benefit formulas.
- For salary, bonus, severance, equity, and related protections, compare the draft to the applicable internal cap or maximum permitted structure for the role and mark any excess back to the approved ceiling.
- Draft Good Reason definitions as objective and enumerated; common convention is to include material reduction in base compensation, material diminution in duties or authority, mandatory relocation, and material breach, together with notice and a cure period.
- Review severance and other post-termination amounts for deferred-compensation timing issues under applicable tax rules, including delayed payment requirements for specified employees of public companies and release-window timing that can create compliance problems.
- Review change-in-control benefits for excess parachute payment risk and specify the intended cutback or gross-up treatment if the issue is implicated.
- Align the agreement’s clawback provision with the governing clawback policy and applicable public-company standards, especially where a restatement-based trigger is required.
- Where a legal proposition underlies a change, identify the governing authority by name and section or comparable citation from the source set or generally recognized authority.

## 4. Analytical scaffolds

- Review the draft section by section in the order it appears, and for each substantive provision ask: does it conform to the term sheet, does it fit the compensation playbook, and does it comply with the governing policy or law?
- For each compensation item, identify the relevant source figure or structure, compare the draft to that baseline, and state whether the provision should be conformed, narrowed, expanded, or left unchanged.
- For each deviation, state: the provision, the governing source, the specific departure, the recommended correction, the severity, the interacting clause or document, and the client consequence.
- For Good Reason, extract every trigger, test each for objectivity and breadth, and recommend deletion or narrowing of any catch-all or subjective formulation.
- For deferred-compensation review, list each severance or deferred payment trigger, test whether it creates timing issues, and flag any release execution or payment-date structure that needs adjustment.
- For clawback review, compare the agreement’s language to the policy standard and identify whether the scope, trigger, recovery mechanism, or administration provisions need revision.
- For each redline, include a plain-text change marker that survives export, plus a brief rationale so the revision is identifiable without formatting.
- If a term is unchanged, say why it is retained rather than silently omitting it.

## 5. Vertical / structural / temporal relationships

- Preserve the agreement’s section order and show how each revision fits within the surrounding provisions rather than rewriting isolated clauses out of context.
- Link compensation provisions vertically to defined terms, bonus formulas, equity plans, severance definitions, and termination mechanics elsewhere in the agreement.
- Link termination provisions to post-termination payment timing, release obligations, restrictive covenants, and clawback obligations.
- Track temporal dependencies explicitly, including commencement date, service periods, payment windows, notice-and-cure periods, release deadlines, and any delayed payment period triggered by tax or regulatory rules.
- When a clause affects multiple parts of the agreement, reconcile all affected sections so the markup does not create internal inconsistency.

## 6. Output structure conventions

- Produce a redlined markup commentary document suitable for circulation to the deal team or compensation committee.
- Start with a short severity legend using a uniform ordinal scale, and apply that severity field to every issue entry.
- Include a front-loaded deviation summary that lists each issue, the governing source, the recommended correction, severity, and the affected section.
- Organize the body section-by-section in the draft’s order, with commentary under each section and redline language embedded or immediately adjacent.
- Use robust textual change notation in addition to any styling, such as [DELETED: …], [INSERTED: …], and [REPLACED: old → new], and attach a short [Rationale: …] note to each substantive change.
- For every issue entry, include the provision, the governing standard, the deviation, the downstream consequence, and the cross-reference to any interacting clause or document.
- End with a Recommended Actions block that assigns each next step to a responsible role and includes a timing anchor tied to signing, finalization, or another relevant milestone.
- Keep the commentary concise and operative; do not reproduce entire source documents, and do not rely on formatting alone to convey the change.
