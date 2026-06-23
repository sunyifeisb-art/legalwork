---
name: summarize-research-sec-beneficial-ownership-rule-changes
task_id: corporate-governance/summarize-research-sec-beneficial-ownership-rule-changes
description: Agents summarize amended beneficial ownership filing deadlines by applying the relevant filing regime, accounting for business-day calculations where required, verifying timeliness against the triggering event, and distinguishing individual reporting obligations from any group-formation analysis.
activates_for: [planner, solver, checker]
---

# Skill: SEC Beneficial Ownership Rule Changes — Board Memorandum

## 1. Subject-matter triage (only if applicable)

- Confirm whether the source set concerns beneficial ownership reporting under a filing regime that uses a triggering event and a deadline measured in business days or calendar days.
- Separate any distinct shareholder holdings, transactions, or filing events before analysis; do not merge different classes, holders, or reporting triggers into one pass.
- Identify whether the memo must address only rule changes, or also timeliness, group formation, and implications for the company’s monitoring posture.

## 2. Failure modes the skill is correcting

- Stating amended deadlines in general terms without calculating the deadline from the actual triggering event.
- Counting business days incorrectly by including weekends or holidays, or by using a shortcut instead of an event-by-event count.
- Treating all securities holdings as one pool when the filing regime requires a class-by-class analysis.
- Collapsing individual reporting obligations into a presumed group analysis without testing coordination evidence.
- Accepting an internal “timely” or “late” label without independently verifying the deadline against the filing date.
- Giving a board-facing summary that explains the rule change but does not connect it to monitoring, disclosure, and preparedness implications.

## 3. Legal frameworks / domain conventions that apply

- **Beneficial ownership reporting rules:** State the applicable reporting framework and the governing deadline rule in plain terms, with the controlling SEC rule or statutory authority named where available.
- **Deadline computation:** When the deadline is measured in business days, count forward from the triggering event date using the applicable business-day convention and exclude non-business days.
- **Threshold and class analysis:** Evaluate ownership thresholds on a security-class basis where the reporting regime requires class-specific measurement.
- **Amendment obligations:** For any prompt-amendment duty, identify the change event, the reporting trigger, and the deadline for updating the filing under the governing rule.
- **Group formation analysis:** Assess whether facts support coordinated action sufficient to treat holders as a group under the relevant securities-law standard; distinguish actual coordination from parallel conduct.
- **Compliance consequences:** If a filing appears late or incomplete, describe the compliance implications at a high level without overstating remedies that depend on venue, posture, or undisclosed facts.
- **Controlling authority discipline:** Every legal proposition should be tied to the applicable rule, statute, regulation, or recognized doctrine rather than stated as a bare conclusion.

## 4. Analytical scaffolds

- **Rule-change summary:** Describe the current deadline framework, then contrast it with the prior framework in the same category so the board can see what changed and why it matters.
- **Event-to-deadline method:** For each filing event, identify the trigger date, compute the deadline under the applicable rule, compare it to the actual filing date, and classify the filing as timely, early, or late.
- **Independent reconciliation:** If a source document reaches its own timeliness conclusion, verify that conclusion independently and correct it if the date calculation does not support it.
- **Multiple-item handling:** If there is more than one holder, filing, class, amendment, or coordination theory in scope, analyze each separately and present the result separately; if only one is in scope, say so expressly.
- **Group-analysis method:** Identify the facts indicating coordination, then test those facts against the legal standard for group formation before stating any combined-ownership implication.
- **Board implication method:** Translate the filing and rule-change analysis into monitoring, disclosure, governance, and preparedness consequences relevant to the board.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Address the current shareholder situation from the company’s perspective: what the amended rules mean now, what has changed in the filing history reviewed, and what ongoing monitoring the board should expect.
- If the materials include a sequence of filings or transactions, preserve chronology and show how earlier events affect later deadlines or amendment duties.
- If the rule change affects response timing, highlight the temporal link between the triggering event, the deadline, and the company’s practical window for action.

## 6. Output structure conventions

- Write a board memorandum in conventional memo form with these sections: overview of the current beneficial ownership reporting framework; filing deadline reference guide; timeliness analysis of identified filings; group formation analysis; implications for the company’s current shareholder situation; and recommended actions.
- Use a tabular format for the deadline reference guide where helpful, and show the date-counting logic for any business-day deadline instead of only stating the final date.
- For any filing analysis, include the triggering event, the calculated deadline, the actual filing date, and the timeliness conclusion in each row or subsection.
- For any group-formation discussion, state the facts relied on, the governing standard, and the resulting combined-ownership implication, if any.
- End with an explicit Recommended Actions section that assigns each action to the appropriate board-level or management role and ties it to a filing, monitoring, or governance milestone.
