---
name: compare-auction-ndas-s01
task_id: corporate-ma/compare-auction-ndas/scenario-01
description: Guides auction-process NDA review by comparing each bidder's markup against the seller's form and playbook, assessing standstill, representatives scope, enforcement mechanics, and data room admission recommendation for each bidder.
activates_for: [planner, solver, checker]
---

# Skill: Compare Auction NDAs

## 1. Subject-matter triage

- Treat the seller’s form NDA and playbook as the baseline; analyze each bidder’s markup against that baseline, not against other bidders except for aggregate risk ranking.
- First enumerate the bidder NDAs in scope, then review each bidder separately and consistently.
- If the source set includes side letters, emails, or non-form acceptance language, test them for procedural validity and whether they alter the operative NDA package.
- If only one bidder is in scope, state that expressly before analysis; do not assume comparators.

## 2. Failure modes the skill is correcting

- Reviewing provisions in isolation without connecting the bidder’s changes to the seller’s baseline, the playbook, and any side letters that may affect enforceability.
- Missing that several moderate-seeming changes can combine to reduce practical protection more than any single edit viewed alone, especially around confidentiality, standstill, and remedies.
- Treating the report as a narrative summary instead of a bidder-by-bidder issue list with a uniform severity assessment and a clear admission recommendation.
- Failing to translate legal deviation into transaction impact: what becomes harder to enforce, what information becomes less controlled, and why the seller should care now.
- Overlooking that a bidder may be acceptable only with conditions, rather than fully admitted or excluded.

## 3. Legal frameworks / domain conventions that apply

- Confidential information definition: compare scope, carve-outs, and any exclusions from the seller’s form; broader carve-outs reduce protection and may permit freer downstream use.
- Representatives and permitted recipients: assess whether the bidder expanded access to affiliates, portfolio companies, financing sources, or other broad categories beyond the intended control group.
- Use restriction: test whether the bidder added any permitted uses beyond evaluating the transaction or received information.
- Standstill: assess whether it remains intact, is narrowed, or is removed; any fall-away trigger should be tied to a clear event and evaluated for timing and hostile-activity exposure.
- Non-solicitation restrictions: note any deletion or narrowing as a change in employee or customer protection.
- Don’t ask, don’t waive: if present, assess whether it asks for advance waiver commitments that may create governance or enforceability concerns in a contested process.
- Residuals or unaided-memory rights: evaluate whether they create a practical backdoor for reuse of sensitive information.
- Injunctive relief, cure periods, and liability caps: assess how each affects actual deterrence and litigation leverage, not just formal breach language.
- Governing law and forum language: identify any change that affects remedies, injunction practice, or interpretive risk.
- Uncountersigned side letters: treat them as potentially relevant only if they are procedurally effective and consistent with the formal submission package.
- Corporate-governance and enforcement analysis should be anchored to the governing law and the standard equitable and contractual principles cited in the source set or otherwise generally applicable.

## 4. Analytical scaffolds

For each bidder, review the NDA in this order and close each issue with three moves: identify the deviation, measure its practical significance against the source documents, and state the downstream consequence for admission or enforcement.

1. Confidential information definition
   - Identify added carve-outs, narrowed categories, or missing protections.
   - State what information becomes harder to keep inside the perimeter.
   - Explain the transaction consequence if the bidder receives broader access.

2. Representatives definition
   - Compare the recipient universe to the seller’s form.
   - Flag expansions that broaden disclosure risk or dilute control.
   - Tie the scope change to the bidder’s likely information flow and enforcement burden.

3. Use restriction
   - Identify any added permitted purposes or removed limitations.
   - Explain whether the bidder can use information outside evaluation of the transaction.
   - State the resulting confidentiality and misuse risk.

4. Standstill
   - Note whether the clause is present, narrowed, deleted, or subject to a fall-away.
   - If a trigger exists, analyze the timing and the event that ends the restriction.
   - State the hostile-activity or process integrity consequence.

5. Non-solicitation of employees and customers
   - Mark any omission, carve-out expansion, or narrowing.
   - Connect the change to hiring, retention, or relationship risk.
   - Explain the resulting competitive exposure.

6. Don’t ask, don’t waive
   - Identify whether the bidder seeks advance commitments or waiver mechanics.
   - Explain any fiduciary-duty or contestability tension.
   - State whether the clause should affect admission.

7. Residuals / memory carve-out
   - Determine whether retained-memory use rights exist and how broad they are.
   - Assess the practical effect on information security and policing misuse.
   - Translate that effect into transaction risk.

8. Remedies and enforcement mechanics
   - Review any cure period, injunction limitation, exclusivity of damages, or liability cap.
   - Compare the mechanism to the sensitivity of the information and the ease of proving harm.
   - State whether the seller’s ability to obtain fast and meaningful relief is weakened.

9. Governing law and forum
   - Flag any change from the seller’s baseline.
   - Explain whether the change matters for equitable relief, interpretation, or procedure.
   - State the enforcement consequence.

10. Side letters and non-form communications
   - Confirm whether they are consistent with the formal NDA package.
   - Assess whether they are signed, accepted, or otherwise operative under the source materials.
   - State whether they should be treated as modifying the admission analysis.

11. Overall bidder assessment
   - Aggregate the deviations, not just their count.
   - Explain whether the package is close to market, conditionally acceptable, or too risky for the data room.
   - Tie the recommendation to the highest-risk provisions, not to generic caution.

Use a uniform ordinal severity scale for every issue entry: Critical, High, Medium, Low. Define the scale once and apply it consistently.

When more than one bidder is in scope, compare them after the individual analyses and rank the bidders by aggregate risk profile, noting which deviations drive the ranking.

## 5. Vertical / structural / temporal relationships

- Track whether a fallback or fall-away mechanism is tied to an event that may occur earlier than the seller intends.
- Track whether a remedy restriction in one clause undermines another clause’s practical value.
- Track whether representative scope, residual use, and standstill changes interact to create a broader combined disclosure or hostile-action risk.
- Track whether side letters, emails, or markup comments temporally alter the operative package before a formal signature event.
- Track whether enforcement limitations matter most at the front end of the process, when access to the data room is being decided.

## 6. Output structure conventions

- Organize the report by bidder, with a short opening table or matrix showing bidder, key deviations, severity, and admission recommendation.
- Within each bidder section, use provision-by-provision analysis in a consistent sequence.
- For each issue, include:
  - the deviation identified,
  - the severity label,
  - why it matters in practical terms,
  - any interaction with another clause or source document,
  - the admission recommendation impact.
- End with a cross-bidder ranking that identifies the highest-risk bidders and the provisions driving that result.
- Include a clear data room admission recommendation for each bidder: admit, admit with conditions, or exclude.
- If conditions are recommended, state the operational condition plainly and tie it to the offending deviation.
- Close with a Recommended Actions block that tells the reader what to do next, who should do it, and when relative to the bid process or access decision.
