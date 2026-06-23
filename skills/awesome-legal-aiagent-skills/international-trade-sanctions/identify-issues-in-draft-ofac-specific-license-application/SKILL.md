---
name: its-identify-issues-ofac-specific-license-application
task_id: international-trade-sanctions/identify-issues-in-draft-ofac-specific-license-application
description: Produces an issues memorandum for a draft sanctions-specific license application that identifies potentially disqualifying defects in party screening and payment routing, analyzes whether any general authorization may already cover part of the proposed activity, flags shipping-chain disclosure issues, addresses stale due diligence, and assesses prior licensing-history disclosure obligations.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in a Draft OFAC Specific License Application

## 2. Failure modes the skill is correcting

- Reviewing the application narrative and party descriptions without verifying all identified banks and payment intermediaries against the current sanctions-designation list, which can leave an application exposed to a transaction-vitiating defect and a likely denial
- Failing to analyze whether any general authorization in the applicable sanctions program regulations already covers part of the proposed transaction, which can make the specific-license request incomplete or overbroad
- Failing to assess whether due diligence conducted before a counterparty's designation reflects the current designation status, resulting in stale screening that misses an interim designation
- Omitting disclosure of vessel, shipping-chain, ownership, charter, affiliated-entity, or intermediary connections that may matter to OFAC’s transaction review
- Missing inaccuracies in board resolutions, program references, jurisdictional references, or transaction scope
- Omitting prior licensing history or outcomes involving the same or similar parties or transactions
- Failing to include a practical resubmission path that tells the client what must change before filing

## 3. Legal frameworks / domain conventions that apply

- Sanctions program-specific license standard: a specific license request must fit the governing sanctions program and the actual transaction structure; if a required party or payment path is prohibited under the applicable regulations, the request should identify and cure the issue before filing
- Designated-payment-intermediary defect: if any receiving, correspondent, intermediary, or other payment bank identified for the transaction is designated under the applicable sanctions list, the routing path is defective and may foreclose the transaction absent redesign under a non-designated route
- General authorization analysis: before seeking a specific license, the applicant should determine whether any general authorization in the applicable sanctions regulations already covers part of the proposed activity; common categories include remittances, agricultural and humanitarian goods, medicine, journalistic activities, and legal services; the application should then describe only the residual conduct requiring authorization and cite the controlling regulatory provision, such as the relevant part of 31 C.F.R. Chapter V or the sanctions-program part at issue
- Shipping-chain disclosure: vessel ownership, operation, chartering, or other logistics ties to a designated person, or to a previously designated person whose designation status has changed, can be material to OFAC’s review and should be disclosed with the relevant regulatory context
- Ownership and affiliation disclosure: beneficial ownership, affiliate, branch, or intermediary relationships can create indirect sanctions risk even where the direct counterparty is not designated
- Board-resolution accuracy: a corporate authorization should match the actual sanctions program, jurisdiction, parties, and transaction scope; an incorrect program reference is a procedural defect that should be corrected before submission
- Current-screening requirement: due diligence must be current as of filing; screening done before a designation event is stale and should be refreshed immediately before submission, with dates compared against any intervening designation dates
- Re-export or onward-transfer restriction language: where the transaction involves goods or shipping, the application should consider whether to request or acknowledge re-export, resale, or onward-transfer restrictions consistent with OFAC practice
- Prior licensing-history disclosure: prior applications, denials, withdrawals, approvals, or enforcement outcomes involving the same or similar parties, goods, routes, or counterparties should be disclosed where material, because OFAC may compare the filing against prior positions and facts
- Governing authority should be cited in the memo by name and section, including the relevant sanctions program provisions, so each issue is anchored to the controlling rule rather than stated as a bare conclusion

## 4. Analytical scaffolds

1. Enumerate the universe of parties and routing nodes in the draft before analysis: applicant, beneficiary, suppliers, counterparties, vessel interests, receiving bank, correspondent bank, intermediary bank, freight or logistics participants, affiliates, branches, and any other disclosed person or entity
2. Screen each identified party against the current sanctions-designation lists and the specific sanctions program implicated by the draft; treat any designated payment intermediary or other prohibited participant as a severity-defining defect
3. Test whether any general authorization or exempt activity already covers all or part of the proposed conduct; if so, isolate the covered portion, identify the remaining licensed portion, and cite the applicable regulatory part
4. Review the shipping chain for ownership, charter, operation, control, prior designation, or other ties that should be disclosed
5. Compare the due-diligence date to any designation dates in the source set; if screening predates a designation, mark the diligence as stale and require re-screening
6. Check the board resolution and internal approvals for the correct program name, jurisdiction, parties, and transaction description
7. Review the application for re-export, resale, diversion, and onward-transfer language where the goods or route make that issue relevant
8. Identify prior OFAC license filings, denials, approvals, or related enforcement matters tied to the same transaction pattern and confirm they are disclosed or distinguished
9. Where the source materials provide dates, amounts, shipment details, or counterparties, use them to calibrate severity and show why the defect matters in this file
10. For each issue, tie the defect to the specific regulatory authority, the interacting document or section, and the downstream consequence to the client

## 5. Vertical / structural / temporal relationships (only if applicable)

- Map the application from origin to destination to payment to shipment to post-shipment controls; issues often arise only when the full path is viewed as a chain rather than as isolated facts
- Track changes over time: screening date, designation date, draft date, approval date, and filing date should be compared in sequence to catch stale diligence or newly arising sanctions risk
- Distinguish direct participants from indirect participants; an indirect bank, affiliate, charterer, or owner may still be material if it affects OFAC’s assessment of the transaction
- Separate the conduct potentially covered by a general authorization from the conduct that still requires a specific license; do not merge them into one undifferentiated approval request

## 6. Output structure conventions

- Write the deliverable as an issues memorandum, not as a transaction summary
- Open with a short severity legend using an ordinal scale defined once at the top, and apply that scale uniformly to every issue
- Organize issues from most serious to least serious, with the highest-risk defects first
- For each issue, include: severity, issue title, what the draft says or omits, the controlling authority, why it matters, and the recommended correction
- Each issue analysis should be concrete and tied to the source record; note the relevant party, date, routing node, or document clause where available
- Include enough context to show the issue’s scale or scope using the record supplied, but do not invent figures or facts not present in the source materials
- Close with a Recommended Actions section that assigns each action to the responsible business owner, compliance lead, or counsel and ties it to the filing or resubmission milestone
- If the draft can be fixed by revision, say so; if it appears to require redesign of the transaction or routing path, say that clearly
- Use conventional memorandum headings rather than a rubric-like checklist
