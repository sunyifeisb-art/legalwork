---
name: extract-intercreditor-agreement-key-term-extraction
task_id: bankruptcy-restructuring/extract-intercreditor-agreement-key-term-extraction
description: Ensures an intercreditor key terms memo identifies conflicts between multiple intercreditor agreements and determines the controlling provision, analyzes standstill mechanics and purchase option economics, and provides strategic observations drawn from the source documents.
activates_for: [planner, solver, checker]
---

# Skill: Extract Intercreditor Agreement Key Terms

## 1. Subject-matter triage (only if applicable)

- Treat the source set as a comparison exercise, not a single-document summary, whenever more than one intercreditor agreement or related credit document is present.
- Identify which documents govern the same lender priority stack, which provisions are duplicated across documents, and which provisions appear to compete.
- If a requested analysis depends on dates, thresholds, or multiple parties, enumerate the relevant items first and then analyze each one separately.

## 2. Failure modes the skill is correcting

- Extracting terms from each intercreditor agreement in isolation without comparing overlapping provisions and resolving which language controls.
- Stopping at descriptive extraction instead of tying each issue to the practical consequence for the second lien group.
- Missing timing mechanics that drive strategy, including standstill periods, exercise windows, discharge points, and any consent deadlines.
- Treating bankruptcy consequences as generic rather than analyzing them under the actual priority, collateral, and waiver language in the documents.
- Failing to identify the controlling authority for any legal conclusion drawn from the source materials or applicable bankruptcy framework.

## 3. Legal frameworks / domain conventions that apply

- Multiple-document hierarchy: when several agreements address the same topic, the memo must compare the provisions, identify conflicts, and state the governing rule selected by the documents.
- Standstill mechanics: extract trigger conditions, duration, enforcement restrictions, and any event that shortens or extends the restraint on junior remedies.
- Purchase option economics: identify the right, price formula, exercise mechanics, and any conditions precedent; then assess the practical economics using the collateral and debt framing disclosed in the materials.
- Discharge and release provisions: determine when senior debt is deemed discharged, because that moment can change junior rights and obligations.
- DIP and plan restrictions: identify any consent thresholds, plan filing limits, or support restrictions that affect junior leverage in a restructuring.
- Post-petition interest and oversecurity: if the source documents raise allocation of proceeds or entitlement to interest, analyze under the governing bankruptcy framework and the agreement language that allocates recoveries.
- Credit bid waivers and related bankruptcy limitations: if the agreements waive junior credit-bid rights or similar remedies, identify the waiver language and test it against the controlling bankruptcy authority.
- Adequate protection and insurance proceeds: extract any payment, collateral, or proceeds waterfall terms that self-limit junior recoveries.

## 4. Analytical scaffolds

- Build a terms table for each intercreditor agreement before drawing conclusions.
- For each topic that appears in more than one agreement, use the same sequence:
  1. state each formulation as written in the source materials;
  2. identify the conflict or overlap;
  3. determine the controlling provision under the document hierarchy or express priority language;
  4. explain the practical difference for the second lien lender group.
- Organize the comparison around the provisions that usually drive strategy: standstill length and triggers, purchase option, discharge definition, DIP consent, plan restrictions, payment waterfalls, proceeds allocation, and any waiver of remedies.
- Where the source set contains a date-dependent right, list the relevant dates or periods first, then compute the strategic deadline from the triggering event stated in the documents.
- If a legal conclusion depends on bankruptcy law, name the controlling statute, rule, or case authority that supports the proposition rather than stating the conclusion in bare form.
- If the documents do not contain enough information to compute an amount or deadline, state the missing input and the resulting limitation explicitly.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track how rights change across time: pre-default, post-default, post-petition, post-discharge, and post-release if the documents distinguish those states.
- Distinguish senior/junior, secured/unsecured, and lien-priority relationships whenever the source set uses those categories to allocate control.
- When a provision is conditioned on the status of collateral, debt balance, or petition timing, treat that status as a gating fact and cross-reference it to the relevant source document.
- If multiple documents set different timing rules for the same event, identify the operative date first and then explain whether the later or more specific language displaces the earlier one.

## 6. Output structure conventions

- Produce a concise advisory memo for the second lien lender group.
- Use industry-conventional headings, such as: document summary, key terms by agreement, conflicts and controlling provisions, timing and deadline summary, bankruptcy / enforceability observations, and strategic implications.
- Include a comparison table or bulletized matrix that shows each major term across the relevant agreements and flags the controlling language.
- For every substantive issue, include the practical impact on the junior group and tie the point to the relevant source text and controlling authority where a legal proposition is involved.
- End with a clear recommendations section that assigns follow-up actions to the appropriate role and anchors them to a document milestone, signing step, petition-related date, or other source-based timing cue.
