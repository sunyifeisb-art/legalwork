---
name: extract-renewal-termination-dates-contract-portfolio
task_id: intellectual-property/extract-renewal-and-termination-dates-from-contract-portfolio
description: Building a compliance tracker and summary memo from a contract portfolio audit, requiring deadline urgency flagging, auto-renewal risk identification, and prioritized recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Extract Renewal and Termination Dates from Contract Portfolio

## 1. Subject-matter triage

Treat the portfolio as a document-by-document extraction task first and a cross-portfolio prioritization task second. Review each agreement on its own terms, then map any inter-document dependencies, amendments, order forms, schedules, or incorporated policies that modify renewal or termination mechanics.

Before analysis, enumerate the agreements in scope and any related documents that alter notice, term, or termination language. If only one agreement is present, say so explicitly. Do not blend dates, notice windows, or obligations across counterparties.

## 2. Failure modes the skill is correcting

- Extracting renewal and termination dates without identifying the operative notice deadline that prevents unwanted auto-renewal
- Confusing renewal dates, expiration dates, termination-for-convenience notice deadlines, and effective termination dates
- Missing evergreen language, option-to-renew mechanics, or automatic extension provisions
- Omitting cure periods, written-notice requirements, delivery methods, or designated notice addresses that control whether notice is effective
- Ignoring downstream obligations that survive termination and therefore remain relevant to compliance tracking
- Failing to prioritize by urgency and leaving the tracker without a clear action hierarchy
- Collapsing related documents into a single record when a master agreement governs separate orders or statements of work
- Providing a summary that describes issues but does not convert them into concrete next steps

## 3. Legal frameworks / domain conventions that apply

- Auto-renewal provisions turn the notice deadline into the operative risk date; the business consequence is loss of the chance to stop renewal if the deadline is missed.
- Termination-for-convenience clauses usually require advance notice, so the notice deadline must be tracked separately from the termination effective date.
- Evergreen arrangements renew indefinitely until terminated and should be tracked by rolling notice windows rather than fixed expiration dates.
- Material breach termination provisions often require notice and a cure period; both must be captured because termination is not immediate unless the contract says otherwise.
- Minimum commitment, volume, or spend obligations create non-date compliance pressure and should be tracked alongside renewal deadlines.
- Notice provisions may specify method, recipient, and address; those mechanics affect whether the notice is valid under the contract.
- Post-termination obligations such as data return, transition support, confidentiality, non-solicitation, audit rights, and survival clauses can extend beyond the termination date and should be captured as continuing obligations.
- Governing law and dispute resolution provisions matter when the contract makes notice effectiveness or enforcement sensitive to formal requirements.

## 4. Analytical scaffolds

1. For each agreement, extract the key timing items:
   - effective date
   - initial term start and end
   - renewal type and renewal length
   - non-renewal notice deadline
   - termination-for-convenience notice deadline
   - cure period, if any
   - any measurement period tied to minimum commitments or volume thresholds
2. Identify the operative action date for each agreement: the earliest deadline that requires action to preserve flexibility or avoid automatic extension.
3. Classify each agreement by urgency using a simple ordinal scale defined once in the tracker or memo, and apply it consistently across all records.
4. Where timing is unclear, resolve the ambiguity by checking defined terms, schedules, amendments, exhibits, and incorporated policies before inferring a deadline.
5. If the agreement references a master relationship and related orders, determine whether termination or renewal at one level affects the subordinate documents.
6. Capture post-termination obligations as separate tracker fields so the termination date is not treated as the end of all duties.
7. Draft recommendations only after the deadlines are identified; tie each recommendation to a responsible internal role and a concrete timing anchor.
8. Organize the memo and tracker by urgency so the nearest operative deadline appears first.

## 5. Vertical / structural / temporal relationships

Watch for layered contractual structures: a master agreement may control multiple order forms, statements of work, renewals, or service modules. A termination or renewal deadline in the master can cascade to subordinate documents, while a standalone order form may carry its own notice period. Record those dependencies explicitly so the tracker shows both the parent deadline and any downstream effect.

Also separate three different moments in time:
- the last date to give notice
- the date the current term ends or termination becomes effective
- the date any continuing obligations end, if they do at all

## 6. Output structure conventions

- Produce two deliverables: a compliance tracker spreadsheet and a summary memo.
- Draft the spreadsheet first, then the memo after the tracker is complete and populated.
- Tracker rows should be one agreement per row unless a document structure requires a parent-and-subrecord view; in that case, preserve the relationship clearly.
- Include a severity or urgency field using a defined ordinal scale such as Critical / High / Medium / Low, and apply it uniformly.
- Include columns for counterparty, agreement type, effective date, term end date, renewal type, renewal term length, non-renewal notice deadline, termination-for-convenience notice deadline, cure period, minimum commitment or threshold, post-termination obligations, urgency rating, and recommended action.
- Sort the tracker by urgency, then by earliest operative deadline.
- In the memo, group items by urgency tier and state for each item: the agreement, the deadline, why it matters, and the recommended next step.
- End the memo with a concise Recommended Actions section that assigns an action, a responsible role, and a timing anchor for each priority item.
- Keep the write-up operational: use direct, deadline-centered language and avoid narrative filler.
