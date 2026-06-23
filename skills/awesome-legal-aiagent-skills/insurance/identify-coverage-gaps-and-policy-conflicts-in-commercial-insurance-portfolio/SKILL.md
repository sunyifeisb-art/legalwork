---
name: identify-coverage-gaps-commercial-insurance-portfolio
task_id: insurance/identify-coverage-gaps-and-policy-conflicts-in-commercial-insurance-portfolio
description: Agents reviewing a commercial insurance portfolio for coverage gaps should test time-sensitive acquisition-related coverage periods, compare broker summaries against governing policy language, and identify whether newly acquired assets, entities, or exposures are outside the operative terms of the relevant policies.
activates_for: [planner, solver, checker]
---

# Skill: Identify Coverage Gaps and Policy Conflicts in Commercial Insurance Portfolio — Issue Memorandum

## 1. Subject-matter triage

- Treat the portfolio as a coverage-mapping exercise, not a generic document summary.
- Identify every policy, endorsement, schedule, broker placement note, and compliance requirement that can change coverage status.
- Separate acquisition-driven issues from pre-existing portfolio issues, then test whether the new facts changed the insured population, locations, vehicles, limits, or required carrier characteristics.
- If the source set includes multiple acquisitions, policy years, or coverage towers, enumerate them first and analyze each separately; do not collapse distinct policies or transactions into a single pass.

## 2. Failure modes the skill is correcting

- Automatic acquisition coverage periods are not checked against closing dates, renewal dates, or notice deadlines; if a coverage window is expiring or expired, treat it as a time-sensitive gap.
- Broker summaries are accepted without reconciling them to the actual policy forms, endorsements, and schedules; placement language may overstate what the operative policy grants.
- Newly acquired entities, locations, vehicles, or other assets are assumed to be covered without testing the definitions, schedules, or endorsement mechanics that control inclusion.
- Excess or umbrella coverage is assumed to mirror primary coverage even where the follow-form language, exclusions, or insured definitions differ.
- Property and auto mechanics are conflated; liability treatment may be broader than first-party or scheduled coverage.
- External purchase requirements, financing covenants, and carrier qualification standards are overlooked even when the policy itself is technically in force.
- Retroactive-date or prior-acts restrictions are not compared to known loss, contamination, or trigger dates across the portfolio.

## 3. Legal frameworks / domain conventions that apply

- Automatic acquisition coverage windows: temporary coverage may apply for a defined period after an acquisition, but only for the exposures and notice mechanics the policy actually specifies.
- Insured and subsidiary definitions: coverage may be limited to entities existing at inception or to entities added by endorsement, schedule, or notice.
- Follow-form and excess alignment: umbrella and excess policies must be tested against the underlying forms for each affected insuring agreement, exclusion, and insured definition.
- Blanket limits and schedule adequacy: aggregate exposure from new locations, assets, or inventory must be compared to the operative limit and any sublimits.
- Shared sublimits: a sublimit that applies across locations or coverage parts can be exhausted by one loss and reduce availability elsewhere.
- Mandatory purchase and lender requirements: some assets or operations may require specified coverages, minimum limits, or carrier characteristics as a matter of covenant or financing condition.
- Scheduled versus unscheduled auto coverage: liability may attach broadly to owned autos while physical damage or similar first-party coverage depends on specific scheduling.
- Carrier qualification covenants: if a contract requires a carrier to satisfy a stated financial standard, compare the carrier’s status to that standard and flag any mismatch.
- Retroactive date and prior-acts limitations: compare the operative date limitations to known triggering events at all locations, including newly acquired ones.

## 4. Analytical scaffolds

1. Acquisition timeline review: identify each closing date, then test whether any automatic coverage period has expired, is near expiration, or requires prompt notice or endorsement.
2. Entity coverage review: identify the operative insured or subsidiary definition in each policy, then determine whether post-acquisition entities fall inside or outside that definition.
3. Tower alignment review: compare primary, excess, and umbrella forms for the same exposure; flag any mismatch in insured definitions, exclusions, or follow-form language.
4. Property exposure review: compare the operative property limits and sublimits to the aggregate exposure introduced by newly acquired or newly identified locations, assets, or inventory.
5. Broker-summary reconciliation: compare placement summaries to the actual policy forms, endorsements, declarations, and schedules; flag any discrepancy between what was represented and what is operative.
6. Sublimit concentration review: determine whether any sublimit is shared or aggregate-based and whether a single loss could materially reduce availability for other locations or coverages.
7. External requirement review: identify properties or operations subject to mandatory purchase rules, lender covenants, or carrier standards, then test the portfolio against those requirements.
8. Vehicle scheduling review: identify vehicles tied to acquired entities and test whether they appear on any relevant schedule; distinguish liability coverage from physical damage or other first-party coverage.
9. Carrier-status review: compare the insurer, surety, or other carrier’s status to any contractual minimum standard and flag any compliance issue if the standard is not met.
10. Retroactive-date review: compare retroactive dates or prior-acts dates to known loss, contamination, or triggering dates, including at acquired locations.
11. Cross-document consistency check: reconcile exclusions, schedules, notices, and covenants across the portfolio so that the issue analysis is consistent with the source set as a whole.

## 5. Vertical / structural / temporal relationships

- Anchor each issue to the governing policy year, endorsement date, acquisition date, or notice deadline that controls the analysis.
- When multiple documents interact, state the operative hierarchy: policy form, endorsement, schedule, broker summary, covenant, and external requirement.
- Distinguish coverage that is temporary from coverage that is permanent, and distinguish coverage that attaches automatically from coverage that requires affirmative action.
- For each issue, connect the trigger, the controlling document, and the downstream effect so the client can see why the issue matters now.
- Where a source document quantifies exposure or required coverage, compare the relevant figure to that benchmark rather than describing the problem abstractly.

## 6. Output structure conventions

- Produce a client-ready issue memorandum organized by issue, with a short executive overview followed by issue-by-issue analysis.
- Use an explicit ordinal severity scale defined once at the top of the memo and apply it consistently to every issue.
- Surface time-sensitive items first and pair them with immediate next steps.
- For each issue, include: the governing policy or requirement; the conflicting or missing term; the operational or compliance consequence; and a concrete remediation path.
- Every issue should close with the controlling source reference, the relevant quantitative or temporal anchor from the record, and the client impact.
- Include a separate reconciliation section for discrepancies between broker summary representations and the operative policy language.
- End with a Recommended Actions block that assigns each step to the relevant role and ties it to the applicable milestone, deadline, or urgency.
- Keep the tone practical and client-facing; do not recite law without tying it to the portfolio issue it governs.
