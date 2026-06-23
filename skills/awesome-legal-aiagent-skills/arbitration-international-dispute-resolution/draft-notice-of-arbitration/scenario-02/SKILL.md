---
name: draft-notice-of-arbitration-scenario-02
task_id: arbitration-international-dispute-resolution/draft-notice-of-arbitration/scenario-02
description: Ensures a notice of arbitration treats service availability and data-loss allegations as distinct claims, states an accurate incident timeline, includes the governing law, and references the filing fee.
activates_for: [planner, solver, checker]
---

# Skill: ICDR Notice of Arbitration (Cloud Services SLA Breach)

## 1. Subject-matter triage (only if applicable)

- Draft a standalone notice of arbitration, not a memo or issue list.
- Treat the service outage allegation and any data-loss allegation as potentially distinct claims unless the source documents clearly collapse them into one theory.
- Use the operative contract, correspondence, damages memo, and data records as the hierarchy of facts; if they conflict, privilege the most authoritative operational record.
- If the source set contains one incident only, say so expressly and frame all claims around that single event rather than implying multiple incidents.

## 2. Failure modes the skill is correcting

- Merges uptime failure and data-loss harm into one undifferentiated claim, obscuring different liability theories, proof, and damages.
- States the incident chronology loosely instead of anchoring it to the monitoring record and related correspondence.
- Omits the agreement’s governing law or treats it as background rather than a required notice element.
- Fails to reference the concurrent filing fee submission.
- Mixes contractual breach allegations with damages assumptions without tying each to a source document.
- Uses broad narrative instead of a clean arbitration initiation that identifies the parties, contract, dispute, relief, and arbitrator proposal.

## 3. Legal frameworks / domain conventions that apply

- ICDR notice practice: identify the parties, the arbitration agreement, the contract at issue, the nature of the dispute, the relief sought, and the requested arbitrator configuration.
- Contract interpretation: plead the claims under the agreement’s express service levels, remedies, limitation clauses, and governing law, rather than generic service complaints.
- Distinct harm framing: service availability breach and data-loss breach may be separate contractual injuries measured by different standards; plead them separately when the record supports that distinction.
- Timeline accuracy: use the monitoring data and any incident log as the primary source for start time, duration, scope, and restoration; avoid rounded or inconsistent times.
- Governing law citation: state the governing law clause from the master agreement or equivalent operative contract.
- Arbitrability and notice sufficiency: the notice should be specific enough to put the respondent and administering institution on notice of the contractual dispute and the relief demanded.
- Liability framing: acknowledge any contractual liability cap or damages limitation only to the extent it is relevant to the notice and consistent with the source documents.
- Supporting authority: cite the rule or clause that supports each procedural statement you make; do not state procedural or substantive points without naming the governing source.

## 4. Analytical scaffolds

- Identify the parties exactly as they appear in the contract and notice them in their capacity under the agreement.
- State the arbitration agreement and administering rules invoked, then identify the contract(s) and provisions in dispute.
- Plead the service-availability claim by linking the outage facts to the contractual uptime or performance commitment.
- If data was lost or corrupted, plead that as a separate claim only if the source documents support a distinct data-protection, backup, restoration, or recovery commitment.
- Use the authoritative incident record for:
  - start time
  - end time or restoration time
  - total duration
  - affected services or accounts
  - any separately affected data sets or records
- Track each claimed harm to its own factual predicate and damages theory.
- When the damages memo gives ranges, assumptions, or valuation-based figures, carry them forward as qualified estimates rather than converting them into hard facts.
- If the contract contains a recovery objective or similar data-restoration standard, frame the breach against that standard rather than against uptime metrics.
- State the requested relief in arbitration terms: monetary damages, fees and costs, and any other relief the contract permits.
- State the number of arbitrators requested and any appointment proposal only if the contract or rules require or permit it.
- Include the governing law clause verbatim only if necessary for accuracy; otherwise summarize it faithfully.
- Include the filing-fee reference in the notice so the filing is procedurally complete.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Separate the chronology into pre-incident baseline, outage period, restoration period, and post-incident consequences.
- Distinguish service interruption from downstream data effects; do not infer data loss merely from downtime.
- If multiple systems, regions, customer cohorts, or data categories are implicated, describe them separately rather than as a single aggregate event.
- If the damages memo distinguishes direct loss, mitigation cost, and projected or lifetime value effects, keep those categories separate and qualify any forward-looking assumption.
- If the contract’s liability cap or exclusion clause applies differently to service credits, direct damages, or data incidents, note that structure without performing arithmetic in the notice.

## 6. Output structure conventions

- Produce a formal Notice of Arbitration suitable for ICDR filing.
- Include, in conventional order:
  - caption / party identification
  - arbitration agreement and governing contract
  - brief statement of the dispute
  - separate claim sections for service availability and, if supported, data-loss or restoration failures
  - incident chronology
  - damages summary with clearly qualified figures from the memo
  - governing law
  - requested relief
  - arbitrator proposal
  - filing-fee statement
  - signature block and service language as appropriate
- Keep the notice factual, concise, and source-driven; avoid argument that belongs in a later statement of claim.
- Preserve internal consistency across the narrative, dates, service names, and claimed harms.
- Before finalizing, verify that the draft includes every operative filing element and that the claims are separated only to the extent the record supports separation.
