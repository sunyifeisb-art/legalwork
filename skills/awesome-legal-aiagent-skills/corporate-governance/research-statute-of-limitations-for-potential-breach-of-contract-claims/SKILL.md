---
name: research-statute-of-limitations-for-potential-breach-of-contract-claims
task_id: corporate-governance/research-statute-of-limitations-for-potential-breach-of-contract-claims
description: Agents state the applicable limitation period without analyzing whether a contractual shortening clause is enforceable under the governing law, calculating deadline dates from each potential accrual date, addressing equitable tolling or estoppel doctrines based on counterparty conduct in the source documents, or confirming which claims remain timely.
activates_for: [planner, solver, checker]
---

# Skill: Statute of Limitations Analysis for Breach of Contract Claims

## 1. Subject-matter triage
- Confirm the governing jurisdiction before analyzing timeliness.
- Identify whether the claim set is singular or whether the facts present multiple possible breach events, notice-and-cure periods, amendments, tolling periods, or separate performance failures.
- If more than one accrual date is plausible, enumerate each one up front and analyze each separately rather than collapsing them into a single representative date.
- If the source set contains a contractual limitation clause, tolling agreement, amendment, or notice-and-cure mechanism, treat it as potentially dispositive and analyze it before giving a bottom-line timeliness view.

## 2. Failure modes the skill is correcting
- Stating the general limitation period without first identifying the controlling law and the specific cause-of-action rule for written contract claims.
- Ignoring a contractual shortening clause, or assuming it is enforceable without checking the governing law and its limits.
- Using one accrual date where the facts support multiple trigger dates, including missed milestones, failed acceptance, abandonment, or later failure to cure.
- Omitting deadline calculations from each materially different accrual path.
- Failing to test whether equitable estoppel, fraudulent concealment, discovery-based accrual, or other tolling doctrines change the deadline.
- Giving a global conclusion that some claims are timely without mapping timeliness claim by claim or period by period.
- Offering legal conclusions without naming the authority that supports them.
- Recommending action without tying it to a responsible role and an urgency anchor.

## 3. Legal frameworks / domain conventions that apply
- **Governing law and limitation period.** Identify the choice-of-law clause, then confirm the jurisdiction’s statute of limitations for written contract claims and the accrual rule that jurisdiction applies. Cite the controlling statute or leading case governing the limitations period.
- **Contractual limitation clauses.** If the contract shortens or extends the filing period, assess enforceability under the governing law, including any requirements of reasonableness, disclosure, and consistency with public policy. Cite the authority that governs enforceability.
- **Accrual rules.** Determine when the claim accrued under the governing law: on breach, on completion of a failed cure period, on rejection/acceptance failure, on project abandonment, or on another contractual trigger if the agreement displaces the default rule.
- **Multiple breaches in phased performance.** Separate discrete failures from continuing performance issues; a series of deliverables or milestones may generate separate limitation periods. Cite the authority supporting separate accrual treatment if relied on.
- **Tolling and estoppel.** Evaluate equitable estoppel, fraudulent concealment, and any agreed tolling period only if the source facts support them. Distinguish active concealment or inducement from mere breach. Cite the governing doctrine and any statutory or case authority.
- **Claim-specific timeliness.** Timeliness must be assessed for each claim, counterclaim, and damages period that could be time-barred on a different date.
- **Amendments and tolling agreements.** A later amendment may reset performance obligations; a tolling agreement may suspend the clock. Analyze both only to the extent they alter the deadline under the governing law.

## 4. Analytical scaffolds
- **Authority first.** State the governing law and the authority for the base limitation period before drawing conclusions.
- **Accrual timeline.** Build a chronological sequence of every potentially relevant breach event, notice, cure window, rejection, abandonment, amendment, or tolling period. For each event, state the legal trigger, the date it occurred or is alleged to have occurred, and the resulting deadline.
- **Shortened-period check.** If a contractual limitation clause exists, test enforceability and then recalculate the deadline under the contractual period if enforceable.
- **Alternative accrual passes.** Run the analysis once for each plausible accrual theory, including the most claimant-friendly and most defense-friendly view, and identify which claims survive under each.
- **Equitable-doctrine pass.** Examine the source materials for statements or conduct that could support tolling, estoppel, or concealment arguments, and then assess whether those doctrines alter the deadline under controlling authority.
- **Viability matrix.** For each claim or damages slice, state whether it is timely, potentially timely, or time-barred, and identify the date basis used for that conclusion.
- **Urgency check.** If any claim appears near deadline, flag the operational consequence and the immediate filing or preservation steps that follow from that timing.

## 5. Vertical / structural / temporal relationships
- **Amendments and change orders.** If the project documentation was amended, separate pre-amendment obligations from post-amendment obligations and analyze whether the amendment creates new breach dates or resets performance deadlines.
- **Notice-and-cure sequencing.** If notice is required before breach matures, use the end of the cure period as the accrual date, not the initial notice event.
- **Partial performance and continuing conduct.** Distinguish a one-time repudiation from recurring nonperformance or recurring invoice issues; do not assume a single clock if the facts support multiple clocks.
- **Tolling periods.** If any tolling agreement or suspension period exists, exclude the tolled interval from the deadline calculation and identify the resulting adjusted end date.
- **Discovery-related facts.** If concealment or delayed discovery is implicated, analyze when the claimant knew or should have known of the claim under the governing doctrine.

## 6. Output structure conventions
- Write a memorandum suitable for an internal general counsel audience.
- Use conventional sections such as:
  - Governing Law and Applicable Limitation Period
  - Contractual Limitation Clause
  - Accrual Analysis and Deadline Calculations
  - Tolling, Estoppel, and Concealment
  - Claim-by-Claim Timeliness Assessment
  - Recommended Immediate Actions
- Include a chronology or table that maps each potentially relevant event to the controlling legal trigger and deadline.
- State the controlling authority for each major legal proposition by name and section, rule, or case where available.
- If multiple possible accrual dates exist, present them as separate rows or subsections rather than combining them.
- End with an explicit Recommended Actions block that assigns each action to a role and ties it to a deadline, milestone, or urgency level.
- Keep the memo practical: identify which claims are safest to file, which require preservation work, and which appear time-barred under the most likely accrual rule.
