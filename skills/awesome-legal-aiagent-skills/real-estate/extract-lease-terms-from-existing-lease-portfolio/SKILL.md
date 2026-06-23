---
name: extract-lease-terms-from-existing-lease-portfolio
task_id: real-estate/extract-lease-terms-from-existing-lease-portfolio
description: Guides lease abstraction for a multi-tenant portfolio acquisition by extracting key terms from each lease instrument, cross-checking against the rent roll and any lender or buyer instructions, and producing a structured abstraction report with a portfolio-level executive summary.
activates_for: [planner, solver, checker]
---

# Skill: Extract Lease Terms from Existing Lease Portfolio — Lease Abstraction Report for Portfolio Acquisition

## 1. Subject-matter triage

This task is a multi-document lease abstraction exercise. Identify every lease instrument in the packet, including amendments, riders, guaranties, estoppels, subleases, occupancy agreements, and any related credit support or side letters, then map each document to the correct tenant and rent-roll line.

Start by enumerating the full portfolio set:
1. Each lease and amendment chain.
2. Each tenant appearing on the rent roll.
3. Each instruction source that imposes required fields or formatting.
4. Each discrepancy candidate across lease, rent roll, and instructions.

Confirm whether the set is complete; if not, state what is missing and whether the omission blocks a reliable abstraction.

## 2. Failure modes the skill is correcting

- Abstracting one lease at a time without reconciling all sources, which hides stale rent-roll data, side deals, or an amendment that controls economics.
- Treating the original lease as controlling when later amendments, riders, or exhibits alter term, rent, use, renewal, or expense obligations.
- Omitting guaranties, subleases, or related occupancy documents and thereby understating credit or occupancy risk.
- Failing to tie each tenant to a single source set, which creates duplicate mappings, orphaned rent-roll entries, or unexplained document gaps.
- Repeating a generic template without flagging lease-specific underwriting risks such as early termination, co-tenancy, exclusivity, abatement, or assignment restrictions.
- Ignoring the engagement letter or buyer/lender instructions and therefore omitting required fields, certifications, or formatting items.
- Presenting discrepancies as narrative commentary instead of clearly identifying which source appears to govern and why.
- Concluding that a term is “standard” without identifying the lease provision, amendment, or market convention that supports that reading.

## 3. Legal frameworks / domain conventions that apply

- Lease abstraction is an underwriting and diligence exercise, not a pure summary exercise; the output should organize income, expense, occupancy, and credit terms in a way a buyer or lender can review quickly.
- The controlling document is the lease as amended; later amendments, riders, and incorporated exhibits govern over inconsistent original language.
- A guaranty must be read together with the lease and any later amendments to determine scope, duration, carveouts, and burn-down mechanics.
- A sublease must be abstracted alongside the prime lease because the subtenant’s rights depend on the head lease and any consent or recognition arrangement.
- Government, institutional, or other special-credit tenants may have nonstandard termination, renewal, notice, or approval mechanics that should be called out expressly.
- Early termination, expansion, contraction, exclusivity, co-tenancy, and rent-abatement rights can materially change projected cash flow and should be elevated in the abstraction.
- Assignment, subletting, casualty, condemnation, repair, insurance, and restoration clauses can affect control of the asset and should not be reduced to boilerplate if they depart from ordinary commercial practice.
- The rent roll reflects the owner’s current operating view; any mismatch between lease and rent roll should be treated as a diligence issue requiring source reconciliation.

## 4. Analytical scaffolds

For each tenant, work through the same abstraction sequence and do not skip a step because a lease appears familiar:
- Identify the tenant, landlord, guarantor, premises, and any related document chain.
- Read the entire source package, including amendments, exhibits, schedules, and referenced attachments.
- Extract the lease economics: commencement, expiration, renewal options, base rent, step-ups, abatements, additional rent, CAM/operating expense treatment, tax and insurance allocations, and security deposit.
- Extract the occupancy and use terms: permitted use, exclusivity, radius restrictions, co-tenancy, hours, signage, access, and any use limitations.
- Extract the control terms: assignment, subletting, recapture, consent standards, SNDA or recognition rights if present, casualty, condemnation, default, cure periods, and termination rights.
- Extract the credit support terms: guaranty scope, duration, exceptions, and any burn-down or release triggers.
- Compare each material economic and operational term against the rent roll and note whether the lease, amendment, or rent roll appears to control.
- If a field is silent, ambiguous, or defined only by reference, flag it rather than inferring a number or term.
- If the instruction letter demands a field not clearly present in the lease materials, list it as not located and note the source gap.

For discrepancies, use a tight three-part treatment:
- State the discrepancy precisely.
- Identify the interacting source documents or clauses.
- Explain the portfolio consequence, such as income timing, occupancy risk, recoverability, or closing diligence follow-up.

For the portfolio executive summary:
- Synthesize the portfolio’s term profile, rollover exposure, major credit issues, and the most material economic or control discrepancies.
- Surface patterns across the portfolio, including repeated amendment risk, inconsistent rent-roll entries, concentration in critical tenancies, or recurring ambiguity in expense or term provisions.
- Call out any item that should be escalated to the buyer, seller, or counsel before reliance is placed on the abstraction.

When a proposition depends on a legal or interpretive rule, state the governing authority or contractual source explicitly rather than relying on an unstated assumption. Use the lease text, incorporated amendment, or generally recognized real-estate abstraction convention as the basis for each conclusion.

## 5. Vertical / structural / temporal relationships

- Amendment hierarchy: later dated amendments, riders, and exhibits control over inconsistent earlier lease language; abstract the operative deal as of the latest controlling document.
- Document hierarchy: incorporated exhibits, schedules, and referenced addenda form part of the lease package when the lease incorporates them.
- Guaranty hierarchy: a guaranty must be tested against the latest lease version to confirm whether the guarantor’s exposure tracks amended obligations.
- Temporal hierarchy: commencement, rent commencement, notice periods, option exercise windows, and termination rights must be tracked against the current lease term and any renewal or extension path.
- Economic hierarchy: base rent, additional rent, abatements, and reimbursements should be reconciled in the order they affect cash flow, with the rent roll used as a check rather than a substitute for the lease.
- Portfolio hierarchy: tenant-by-tenant findings should roll up into portfolio-level themes, but the report should preserve the underlying lease-level detail needed for diligence review.

## 6. Output structure conventions

- Produce a portfolio abstraction report organized by tenant or lease package, not as a free-form memo.
- Use a consistent abstraction template for each tenant package, covering identification, term, economics, expenses, use, control rights, credit support, and notable risks.
- Include a portfolio executive summary that orients the reviewer to the major income, occupancy, and credit themes before the individual abstractions.
- Include a clear discrepancy and open-items section identifying document gaps, rent-roll variances, and any unresolved instruction-item omissions.
- Use concise, diligence-oriented prose; avoid restating entire clauses when a precise abstraction will do.
- Where the source set contains multiple tenants or periods, present them in separate rows or subsections so the reviewer can trace each source set to each conclusion.
- End with an action-oriented follow-up section identifying items that need source clarification, document retrieval, or business-team confirmation before final reliance.
- Name the file exactly as instructed in the engagement and ensure the deliverable is the completed report itself, not a description of it.
