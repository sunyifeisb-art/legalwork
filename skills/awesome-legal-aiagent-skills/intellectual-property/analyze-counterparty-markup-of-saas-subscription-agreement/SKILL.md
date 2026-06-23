---
name: analyze-counterparty-markup-saas-subscription
task_id: intellectual-property/analyze-counterparty-markup-of-saas-subscription-agreement
description: Deviation report with risk classifications and counter-language recommendations for a vendor-marked SaaS subscription agreement evaluated against the company's standard form and available performance history.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of SaaS Subscription Agreement

## 2. Failure modes the skill is correcting

- Treating the markup as a generic commercial review instead of a clause-by-clause comparison against the controlling standard SaaS form and any deal-specific instructions.
- Describing deviations without tying each one to the operative clause text, the side of the redline, and the practical effect on risk allocation.
- Classifying service-level changes without checking whether the proposed threshold is consistent with the available performance history or whether credits become illusory.
- Missing how service credits, exclusive-remedy language, and damages exclusions interact to narrow recovery for outages or chronic underperformance.
- Analyzing liability caps in the abstract rather than against the contract’s revenue profile, remedy stack, and likely downside exposure.
- Failing to trace pricing changes, renewals, escalators, minimum commitments, or fee triggers through the full term and renewal cycle.
- Overlooking security, data-handling, audit, breach-notice, export, and deletion changes that may be embedded outside the main body of the SaaS terms.
- Omitting a clear redline path: what to strike, what to insert, and why the counter-language better preserves the company’s position.
- Stopping at diagnosis without a recommendation, implementation owner, and timing anchor.

## 3. Legal frameworks / domain conventions that apply

- SaaS subscription agreements allocate performance risk through service levels, financial risk through caps and damages exclusions, and operational risk through security, support, and continuity obligations.
- Service credits, when drafted as the sole or exclusive remedy for SLA failures, can materially narrow damages recovery; assess this together with consequential, incidental, special, and punitive damages exclusions.
- Liability caps must be read with carve-outs, indemnity buckets, confidentiality and data-security exceptions, and any separate remedies in exhibits or order forms.
- SLA thresholds should be measured against actual performance history where available; historical uptime, incident frequency, and remediation patterns are the relevant baseline for evaluating whether the proposed commitment is commercially meaningful.
- Pricing provisions must be analyzed across the initial term, renewal periods, auto-renewal mechanics, uplifts, seat true-ups, usage overages, and minimum purchase commitments.
- Data-processing, security, and support exhibits may supersede or modify the main agreement; conflict rules and precedence language matter.
- Termination-for-cause rights, cure periods, transition assistance, export rights, and deletion timing determine whether a theoretical remedy is operationally usable.
- For any legal or interpretive proposition, state the governing authority by name and section where available; do not state a conclusion without identifying the rule, statute, regulation, or doctrine supporting it.

## 4. Analytical scaffolds

- Start with the governing baseline: identify the version of the standard form, the markup source, and any business or legal instructions that override the form.
- Enumerate the discrete deviations before analysis. If only one item is truly in scope, say so; otherwise treat each materially different clause, exhibit, schedule, fee mechanic, or remedy bucket as a separate item.
- For each deviation, analyze in a fixed sequence: clause text, nature of change, severity, economic or operational magnitude, interaction with other provisions, client consequence, and proposed counter-language.
- Anchor each issue to at least one concrete measure from the source set, such as contract value, term, renewal period, support hours, service-history record, notice window, cap amount, or exposure bucket.
- Compare SLA edits to the performance record, if provided, and explain whether the proposed level is a true improvement, a status-quo codification, or a dilution of the customer’s leverage.
- When service credits are involved, test whether they remain meaningful if the vendor’s underperformance repeats and whether the remedy stack still leaves the customer with a practical path to compensation.
- When the cap changes, test the cap together with the liability carve-outs, indemnity structure, and any separate security or confidentiality obligations.
- When pricing or renewal terms change, translate the redline into total contract cost over the expected lifecycle, including renewals and mandatory true-ups if the agreement contemplates them.
- When security, privacy, or audit terms change, isolate whether the redline weakens notice timing, access rights, testing rights, subprocessor controls, or export/deletion commitments.
- Markup analysis should include a proposed fallback or counter-language that is commercially tighter than the counterparty edit but still realistic for negotiation.
- Use explicit, plain-text redline markup in the recommendation so the change is readable even if formatting is stripped; pair each proposed change with a brief rationale.
- Close every issue by stating the scale of the impact, the interacting clause or document, and the downstream consequence for the client.
- If the source set includes a cover email or transmittal, compare its characterizations against the actual markup and call out any mismatch only where material.

## 5. Vertical / structural / temporal relationships

- Track provisions that cascade across the agreement: main body, order form, exhibits, data processing addendum, security addendum, SLA schedule, and any incorporated policies.
- Apply precedence language where a schedule or exhibit conflicts with the master terms; note which document controls and whether the markup changes that hierarchy.
- Follow remedies over time: notice, cure, suspension, credit issuance, termination, data export, deletion, and post-termination assistance.
- Follow money over time: initial fees, ramp, renewal price, escalators, overages, credits, refunds, offsets, and final reconciliation.
- Follow risk over time: pre-signing commitments, go-live obligations, steady-state operations, incident response, renewal leverage, and exit assistance.
- If multiple periods, parties, or scenarios are present, treat them separately rather than blending them into a single representative analysis.

## 6. Output structure conventions

- Produce a deviation report suitable for a Word document.
- Use a short title, followed by a severity legend with a uniform ordinal scale defined once at the top.
- Provide an executive summary that identifies the most material deviations and the overall risk posture.
- For each issue, include:
  - severity
  - provision / location
  - deviation description
  - risk rationale
  - interaction with other clauses or exhibits
  - financial or operational impact
  - recommended counter-language
- Use robust plain-text redline notation for proposed edits, such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new], plus a short rationale for each change.
- Distinguish between legal risk, operational risk, and financial impact, but keep the analysis tied to the actual clause text.
- Include a dedicated section for SLA and performance-history analysis if service levels are modified.
- Include a dedicated section for financial impact analysis if any fee, renewal, escalation, or remedy term changes economics.
- End with a Recommended Actions block that assigns an action, a responsible role, and a timing anchor for each material item.
- Keep the report concise but complete; prefer issue-specific analysis over generalized commentary.
