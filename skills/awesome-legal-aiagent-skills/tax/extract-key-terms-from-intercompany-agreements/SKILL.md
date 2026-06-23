---
name: extract-key-terms-from-intercompany-agreements
task_id: tax/extract-key-terms-from-intercompany-agreements
description: Extracting key terms from intercompany agreements requires populating structured tables for each agreement type and flagging issues such as auto-renewals at stale pricing, percentage inconsistencies across related documents, missing benchmarking support, and deadlines that affect the timing of the response.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Intercompany Agreements for Transfer Pricing Compliance

## 1. Subject-matter triage
- Identify each agreement, amendment, annex, schedule, benchmark support item, and cross-referenced document before extracting terms.
- Determine whether the set includes one agreement type or multiple; if multiple, separate them cleanly and do not merge terms across documents.
- Preserve the contractually specified currency, percentages, dates, notice periods, and margin language exactly as expressed in the source set.
- Note any response deadline or filing deadline first, then carry it through the extraction and issues narrative.

## 2. Failure modes the skill is correcting
- Extracting headline commercial terms without capturing renewal mechanics, notice windows, and amendment dates that affect whether pricing is stale.
- Converting amounts into a different currency or unit and thereby losing the figure that is actually used in the agreement or in related tax reporting.
- Collapsing original and amended terms into one blended summary, which hides changes in margin, royalty, allocation, or true-up mechanics.
- Missing cross-document inconsistencies in percentages, shares, or allocation keys across related materials.
- Failing to flag the absence of benchmarking support where the agreement indicates arm’s-length support should exist.
- Omitting deadlines that shape the urgency or completeness of the extraction.

## 3. Legal frameworks / domain conventions that apply
- Transfer pricing extraction is document-led: capture the contractual terms first, then test them against related materials for consistency and support.
- For manufacturing, distribution, license, services, and cost-sharing arrangements, the controlling fields are the ones that determine price setting, allocation, or compensation mechanics.
- Renewal clauses, opt-out deadlines, and amendment effective dates are material because they can change whether a stated pricing term is current or stale.
- Benchmarking references matter where the agreement relies on an arm’s-length standard; if the support is absent from the production set or clearly not tied to the relevant transaction, flag it.
- Percentage allocations must be compared across all source documents that rely on them; divergent figures are treated as a documentation issue unless the documents explain the difference.
- If the source set uses a local currency denomination, extract that denomination as written and do not normalize it away in the summary.

## 4. Analytical scaffolds
1. Enumerate the agreements and related support documents in scope before analysis.
2. For each agreement, extract the core commercial terms into a structured table using the fields relevant to that agreement type.
3. If the agreement has an amendment history, extract original and amended terms side by side with their effective dates.
4. If the agreement contains renewal or notice mechanics, extract the term, renewal cycle, notice deadline, and any lapse in the notice period.
5. If the agreement uses percentages, shares, margins, or allocations, extract the exact figures and compare them against related materials in the source set.
6. If the agreement references benchmarking or valuation support, note whether the support is present, absent, partial, or seemingly mismatched to the transaction.
7. Convert extracted observations into an issues-and-observations narrative that ties each issue to the document text and its compliance significance.
8. Treat each agreement type as requiring its own row set, not a generic catchall summary.

## 5. Vertical / structural / temporal relationships
- Extract the relationship between original terms and later amendments as a vertical sequence, not as one blended state.
- Track the timing chain: effective date, renewal date, notice deadline, amendment date, and any response deadline for the extraction task.
- Where percentages or margins appear in multiple documents, compare them across the same time period before treating them as inconsistent.
- If a renewal deadline has already passed or is close, note the operational consequence for pricing review and follow-up.
- If multiple documents describe the same arrangement at different times, preserve the chronology so the reader can see how the terms evolved.

## 6. Output structure conventions
- Produce a document titled as a transfer pricing extraction summary and organize it with a short intro, structured extraction tables, and an issues-and-observations narrative.
- Use one table per agreement type or transaction family, with columns for parties, dates, term, pricing or compensation mechanism, support documents, and notable drafting points.
- Include a separate comparison table where the same percentage, share, or margin appears across multiple documents.
- Include an issues-and-observations section that groups items by topic and states the practical significance of each item.
- Use clear severity labels for issues, applied consistently across the document.
- Close with a concise recommendations block that identifies the next action, the responsible business or legal owner, and the timing anchor drawn from the source set.
- Keep the response deadline visible near the beginning and again at the end so the work’s timing remains obvious.
