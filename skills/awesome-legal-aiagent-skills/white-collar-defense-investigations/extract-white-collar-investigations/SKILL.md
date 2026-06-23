---
name: extract-doj-preservation-notice-obligations
task_id: white-collar-defense-investigations/extract-white-collar-investigations
description: Prioritized compliance gap report extracting preservation obligations from a government preservation notice and any supplemental correspondence, identifying document categories, enumerated technology systems, auto-deletion suspension requirements, and any imaging or collection deadlines, with recommended remedial steps.
activates_for: [planner, solver, checker]
---

# Skill: Extract Obligations from Government Preservation Notice — Compliance Gap Report

## 1. Subject-matter triage (only if applicable)

- Treat the notice set as a document-preservation and data-retention compliance exercise, not a merits analysis.
- First identify whether the source set includes: a primary preservation notice, supplemental correspondence, and internal implementation materials.
- If more than one notice or letter exists, treat the broadest applicable scope as controlling unless a later document clearly narrows a prior obligation.
- If the source set references personal devices, collaboration tools, or auto-delete settings, treat those as implementation-critical, not peripheral.

## 2. Failure modes the skill is correcting

- The time period is taken from only one document instead of the full notice set, causing the report to miss the controlling start or end boundary.
- Supplemental correspondence that adds categories, systems, or deadlines is ignored.
- Specific technology platforms are summarized generically, leaving IT without a usable implementation list.
- Platform-level hold requirements are not separated from ordinary user-level preservation steps.
- Cloud or collaboration auto-deletion risk is described abstractly rather than as an immediate control issue.
- Imaging or collection deadlines are paraphrased instead of calendared as hard obligations.
- BYOD scope is overlooked even when the notice reaches business-use personal devices.
- The report describes gaps but does not convert them into prioritized remedial actions.

## 3. Legal frameworks / domain conventions that apply

**Government preservation notice conventions**
- A preservation notice may demand preservation of documents, ESI, communications, metadata, and device or system data relevant to an investigation.
- Supplemental letters can expand the preservation universe; each later document must be read for added categories, extended dates, and implementation instructions.
- The operative scope is the union of all applicable notice documents, subject to any express narrowing language.

**Preservation implementation conventions**
- A legally meaningful hold typically requires both legal instruction and technical implementation.
- Company-wide instructions are not enough if the source set identifies specific systems, custodians, or deletion settings that require administrative action.
- When cloud or collaboration tools are implicated, preservation must address platform settings that can continue deleting or expiring content absent intervention.
- If the notice reaches business-use personal devices, the organization must evaluate whether existing BYOD controls can capture or preserve responsive data.

**Calendarized obligations**
- Any deadline stated as a number of days from notice date, collection date, or receipt date should be converted into a concrete calendar date.
- Collection, imaging, and suspension steps should be tracked separately if the notice distinguishes them.

**Authority citation convention**
- When the source documents identify a rule, policy, or instruction by name, quote the naming convention used there in substance, not verbatim.
- If the report refers to a legal or compliance proposition, anchor it to the operative notice language or the governing preservation principle being applied.

## 4. Analytical scaffolds

1. **Enumerate the source documents**
   - List each notice, supplement, and internal implementation document.
   - If only one notice exists, state that affirmatively and proceed on that basis.

2. **Control the scope by document**
   - Derive the controlling period from the full set of documents.
   - Identify which document supports each boundary and whether any later document expands the scope.

3. **Compile obligations by category**
   - Separate document categories, technology systems, custodians, device types, and retention settings.
   - Group obligations by type so legal and IT readers can see what must be preserved, where, and by whom.

4. **Check technical preservation controls**
   - Identify whether the implementation materials include a platform-level hold or equivalent suspension control.
   - Flag any default deletion, retention, recycle-bin, or expiry setting that must be disabled or overridden.

5. **Calendar all deadlines**
   - Translate every deadline into a calendar date.
   - Distinguish imaging, collection, hold implementation, certification, and follow-up deadlines if they differ.

6. **Assess BYOD and off-system coverage**
   - Test whether the notice reaches personal devices, home systems, ephemeral messaging, or other non-corporate repositories.
   - Compare that scope against the implementation plan and identify any coverage gap.

7. **Rank the gaps**
   - Prioritize by preservation risk, deadline proximity, and difficulty of remediation.
   - Convert each gap into a specific remedial recommendation with an owner and timing anchor.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Preserve the hierarchy between the primary notice and any supplemental letter: later correspondence may broaden categories, extend dates, or add systems.
- Keep separate the relationship between legal scope and technical execution: a broad instruction without system-level controls is still incomplete.
- Track timing vertically from notice receipt to hold implementation to collection or imaging completion.
- If the implementation documents show partial action taken, distinguish completed steps from residual exposure rather than treating the hold as binary.
- Where a system depends on an admin console, license tier, or retention policy setting, identify that dependency as the operational bottleneck.

## 6. Output structure conventions

- Deliver as a prioritized compliance gap report.
- Define one ordinal severity scale at the top and apply it consistently to each gap or recommendation.
- Use an industry-conventional, memo-style structure rather than the rubric’s internal checklist language.
- Organize the report into concise sections such as:
  - Executive takeaway
  - Controlling scope and time period
  - Preservation categories and systems
  - Deadline-driven actions
  - Gap analysis
  - Recommended remediation
- For each gap, include:
  - severity
  - what the notice requires
  - what the implementation materials show
  - why the shortfall matters
  - the corrective step
- End with a distinct Recommended Actions block that assigns each action to a role or function and ties it to a concrete deadline or urgency marker.
- Keep the report operational: the reader should be able to hand it to legal, IT, and records teams without further translation.
