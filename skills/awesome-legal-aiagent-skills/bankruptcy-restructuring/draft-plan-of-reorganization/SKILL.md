---
name: draft-plan-of-reorganization
task_id: bankruptcy-restructuring/draft-plan-of-reorganization
description: Ensures a Chapter 11 plan of reorganization contains complete class definitions for the relevant creditor and equity categories, treatment provisions using terms drawn from the source documents, and a companion confirmability issues memo identifying structural risks and inconsistencies.
activates_for: [planner, solver, checker]
---

# Skill: Draft Chapter 11 Plan of Reorganization

## 1. Subject-matter triage
- Treat the plan as the primary deliverable and the confirmability memo as secondary. Draft the plan first, confirm it is populated with operative provisions, then prepare the issues memo.
- Identify all stakeholder groups, claims, interests, facilities, and transaction milestones that appear in the source set before drafting treatment language.
- If the source set contains multiple possible class schemes, valuation paths, financing structures, or release packages, enumerate the candidate structures first and then select or reconcile them.

## 2. Failure modes the skill is correcting
- The plan omits a class, leaves a claim category uncaptured, or uses labels that are inconsistent across documents.
- Treatment provisions are generic, do not track the source materials, or fail to state consideration, timing, impairment, and voting consequences for each class.
- Confirmation vulnerabilities are not surfaced in the memo, especially where the source documents conflict on valuation, priority, cure amounts, governance, releases, or exit mechanics.
- The draft assumes a clean capital structure when the source materials show disputed claims, intercompany balances, or contingent liabilities.
- The plan states legal conclusions without tying them to the governing Bankruptcy Code provisions, Federal Rules, or recognized confirmation doctrines.
- The memo diagnoses issues without pairing each one with a concrete resolution path and timing-sensitive next step.
- The drafting leaves out operational details needed to implement the reorganization, such as effective-date conditions, distribution mechanics, contract assumptions, or tax handling.
- The output reads like a summary of the reorganization rather than a usable plan and companion risk memo.

## 3. Legal frameworks / domain conventions that apply
- Use Chapter 11 plan architecture under the Bankruptcy Code, especially 11 U.S.C. §§ 1122, 1123, 1126, 1129, 1141, and, where relevant, §§ 365, 503, 507, 510, 524, and 1125.
- Classify claims and interests by legal nature and treatment, not by convenience; separately address secured claims, priority claims, general unsecured claims, intercompany claims, equity interests, and any other classes supported by the source materials.
- For each class, state whether it is impaired, what it receives, when it receives it, and whether it votes; if a class is unimpaired, say so with the statutory rationale.
- Include at least one impaired accepting class if the source set supports it, and frame any acceptance analysis by reference to the Bankruptcy Code’s acceptance rules rather than by implication.
- Where junior stakeholders retain value, analyze absolute priority under 11 U.S.C. § 1129(b)(2) and any new value theory or contribution structure the plan relies on.
- If the plan contemplates a litigation trust, asset trust, or causes-of-action reserve, define the corpus, trustee selection, beneficiary rights, and distribution waterfall with internal consistency.
- If management incentive equity is included, specify dilution source, vesting, allocation, and who bears the dilution, and test it against the confirmed capital structure.
- Address cancellation of debt income, tax attribute treatment, ownership-change limits, and related bankruptcy tax consequences where the source materials indicate tax sensitivity.
- Conditions precedent to effectiveness should be concrete, objective, and tied to a milestone, order, or closing deliverable rather than left aspirational.
- Any release, exculpation, injunction, or discharge concept should be tied to recognized confirmation and post-effective-date authority and drafted narrowly enough to survive scrutiny.

## 4. Analytical scaffolds
- Draft the plan in conventional bankruptcy order: definitions; classification and treatment; means of implementation; financing or exit facility if applicable; executory contracts and unexpired leases; releases, exculpation, and discharge; conditions to effectiveness; governance; distributions; tax; miscellaneous.
- For each class, map: claim or interest description, source-document support, treatment, impairment, voting consequence, and implementation mechanics.
- When source documents diverge, identify the divergence, choose the operative formulation only if supported, and flag the unresolved point in the issues memo.
- For each issue in the memo, state: what the issue is, why it matters under the governing confirmation rule, and what resolution would cure or reduce the risk.
- Treat timing as substantive: file date, solicitation date, effective date, cure objection deadlines, distribution timing, and closing conditions should be aligned across the plan and memo.
- Use source-document terminology where possible, but normalize inconsistent labels so the plan reads as a coherent operative document.
- If multiple stakeholder groups or claim pools are in play, analyze them separately rather than collapsing them into a single blended treatment.

## 5. Vertical / structural / temporal relationships
- Preserve the hierarchy from estate-level restructuring to class-level treatment to holder-level mechanics.
- Keep vertical consistency between the plan, disclosure materials, support agreements, financing documents, and any exhibits or schedules referenced in the source set.
- Track how treatment changes over time: petition date rights, record date rights, effective-date rights, deferred distributions, and post-effective-date governance should be distinct.
- Where the plan shifts value down the capital structure, make the ordering explicit and test whether any junior recovery depends on senior consent, contribution, or litigation settlement.
- If the plan uses a trust or reserve, define the flow from estate property into the vehicle, then from the vehicle to beneficiaries, and separate administrative expenses from distributable proceeds.
- If distributions depend on future determinations, specify the adjudicative or administrative process and identify who bears interim uncertainty.
- Where contract cures, assumed liabilities, or allowed claims affect distributions, connect those mechanics to the relevant timing and objection process.

## 6. Output structure conventions
- Produce two standalone deliverables: a plan of reorganization and a companion plan issues memo.
- The plan should read as an operative Chapter 11 plan, not a narrative summary, and should contain complete provisions capable of insertion into a filed document.
- The memo should use a numbered issue format with a defined severity scale stated up front and applied uniformly to each item.
- Each memo entry should include: issue description, confirmability risk, controlling authority or governing rule, and recommended resolution.
- End the memo with a concise Recommended Actions section that assigns an action, the responsible role, and a timing anchor tied to the filing, solicitation, confirmation, or effective-date timeline.
- Use ordinary bankruptcy-plan headings and subheadings; do not mirror any hidden checklist structure.
- Before finishing, verify that the plan file is populated with operative clauses and that the memo file identifies the principal risks and fixes rather than merely describing them.
