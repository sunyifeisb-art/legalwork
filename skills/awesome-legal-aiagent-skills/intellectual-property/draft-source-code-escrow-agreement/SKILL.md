---
name: draft-source-code-escrow-agreement
task_id: intellectual-property/draft-source-code-escrow-agreement
description: Draft a beneficiary-oriented source code escrow agreement and a negotiation issues memo for a software-as-a-service license transaction, using the escrow agent's template and the deal documents as inputs.
activates_for: [planner, solver, checker]
---

# Skill: Draft Source Code Escrow Agreement

## 1. Subject-matter triage

- Identify the governing license architecture first: who is licensor, who is beneficiary, who is escrow agent, what software stack is covered, and whether the escrow is for production access, continuity, or transition support.
- Read the license and escrow template together; any release right, use restriction, or verification mechanic in one document must be harmonized with the other.
- Determine whether the transaction is one software product, one suite, or multiple deployments; draft separate schedules or defined terms only where the source documents support that structure.
- For the issues memo, treat the agreement draft as the primary work product and the memo as secondary; the agreement must be written first and fully populated before the memo is finalized.

## 2. Failure modes the skill is correcting

- Drafting off the template mechanically without testing whether the beneficiary actually receives usable source materials, operational continuity, and realistic access upon a release event.
- Treating escrow as a formality instead of a negotiated risk-allocation mechanism tied to service continuity, business interruption, and transition leverage.
- Leaving deposit requirements vague, so the released package may be incomplete, unbuildable, or unusable in production or maintenance environments.
- Narrowing release triggers to insolvency only and omitting business cessation, chronic nonperformance, security failure, or other transaction-specific loss-of-service events.
- Failing to align post-release rights with the license grant, support obligations, and any agreed transition assistance.
- Omitting verification mechanics, cure periods, update cadence, cost allocation, and the process for disputes over completeness.
- Producing an issues memo that lists concerns but does not identify likely objections, beneficiary priorities, fallback positions, and practical next steps.
- Drafting positions without checking the source set for the controlling contractual language, then overstating or understating what the documents actually permit.
- Writing conclusions about obligations, triggers, or rights without tying them back to the relevant contract language or generally recognized escrow practice.

## 3. Legal frameworks / domain conventions that apply

- Source code escrow is typically tripartite: licensor deposits, beneficiary receives conditional access, and escrow agent administers custody and release mechanics.
- The agreement should specify the deposited materials with enough precision that the software can be reconstructed, tested, and maintained if released; build artifacts, scripts, dependencies, documentation, and acquisition instructions may matter as much as source files.
- Release conditions should be drafted to reduce disputes by using objective events and clear notice/cure mechanics where appropriate.
- Verification provisions should state whether completeness is checked by the escrow agent, a technical verifier, or a neutral third party, how often verification occurs, and who bears the cost.
- The post-release license to the beneficiary must be consistent with the underlying software license, including scope of use, internal modification rights, support obligations, and limits on disclosure or commercial exploitation.
- Common transactional authorities that often matter include the operative license agreement, any escrow exhibit, the deposit schedule, and any transition-services or support provisions; use the actual source documents to determine which controls.
- Where the source documents identify a governing law, notice rule, or defined release event, draft to that authority rather than substituting generic language.

## 4. Analytical scaffolds

- License review: extract the clauses on escrow, access rights, permitted uses, support, termination, source-delivery obligations, and any restriction on reverse engineering or disclosure.
- Deposit specification: define the deposit package as a complete, operational set of materials; include source code, build and deployment instructions, interface documentation, keys or credentials only if the source documents permit, and a completeness certification.
- Release conditions: identify the set of events that justify release and separate them from ordinary service issues; include notice, cure, and evidence requirements where the source documents support them.
- Verification mechanism: specify the verifier, test standard, update cycle, and dispute path for incomplete or stale deposits.
- Beneficiary access rights upon release: draft use rights narrowly enough to fit the license structure but broadly enough to allow continuity, maintenance, bug fixes, security patches, and transition.
- Risk allocation: address who pays escrow fees, verification costs, shipping or storage charges, and any cost of supplementing a deficient deposit.
- Issues memo: for each substantive point, state the beneficiary goal, the likely counterparty objection, the preferred drafting position, and a fallback position that still preserves continuity value.
- Document control: if the source set contains competing forms or inconsistent exhibits, prefer the operative transaction documents and flag any internal inconsistencies in the memo.
- Authority support: each legal assertion in the draft or memo should be anchored to the governing contract language, governing law, or recognized escrow practice reflected in the source set.

## 5. Vertical / structural / temporal relationships

- Map the relationship among the license agreement, escrow agreement, and any support or transition obligation so that release rights do not exceed the beneficiary’s post-termination use rights unless the source documents expressly permit that result.
- Track the temporal sequence of deposit, verification, refresh, notice, cure, release, and post-release access; draft deadlines and intervals so they are administrable rather than aspirational.
- If multiple products, environments, or deployment instances are implicated, distinguish which materials belong in the base deposit and which belong in refresh or supplemental deposits.
- If the source documents impose milestone-based updates or verification windows, reflect those dates precisely and avoid generic periodicity.
- Where the business deal anticipates change in control, service failure, or termination for convenience, test whether those events should affect deposit refresh, release rights, or transition assistance.
- Make sure any post-release maintenance rights line up with the beneficiary’s practical need to operate the software after the triggering event, including access to updates or fixes if the transaction documents contemplate them.

## 6. Output structure conventions

- Draft the source code escrow agreement first as a complete operative agreement, not as a summary or form note.
- Include the core commercial mechanics in conventional agreement form: parties, recitals, defined terms, deposit obligations, verification, release events, notice/cure mechanics, post-release rights, confidentiality, fees, liability allocation, dispute handling, and miscellaneous boilerplate as appropriate to the source documents.
- Use schedules or exhibits for the deposit package and any verification or release process details when that is the cleanest way to make the deposit administrable.
- Draft the negotiation issues memo as a separate advisory deliverable after the agreement exists; organize it by issue with the beneficiary position, likely objection, fallback, and practical recommendation.
- If there are multiple plausible drafting choices, choose the beneficiary-favorable position that still fits the source documents and note the tradeoff in the memo.
- Keep the memo concise but action-oriented; it should tell the deal team where the pressure points are and what to ask for next.
- Before finishing, confirm that the agreement file contains operative drafting and that the memo file contains substantive negotiation guidance, not merely placeholders or descriptions.
- Use conventional legal drafting style and terminology; avoid inventing unusual labels where standard escrow terminology will do.
