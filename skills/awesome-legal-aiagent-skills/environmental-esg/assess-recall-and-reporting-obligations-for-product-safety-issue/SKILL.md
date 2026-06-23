---
name: assess-recall-and-reporting-obligations-for-product-safety-issue
task_id: environmental-esg/assess-recall-and-reporting-obligations-for-product-safety-issue
description: Guides incident response analysis for a product safety issue by mapping recall and reporting obligations across regulatory reporting, public-company disclosure, supply-chain contract, and litigation-hold dimensions rather than treating the matter as a single-agency compliance question.
activates_for: [planner, solver, checker]
---

# Skill: Assess Recall and Reporting Obligations for Product Safety Issue — Incident Response Memorandum

## 2. Failure modes the skill is correcting

- Treating the incident as a single-agency compliance question instead of a coordinated response across product-safety reporting, recall actions, securities disclosure, contract notice, insurance notice, and preservation duties
- Failing to separate what is known from what is still unverified, which leads to overstatement of hazard scope, affected population, timing, or causal attribution
- Missing the different triggers, deadlines, and recipients that govern mandatory reporting, voluntary corrective action, and customer-facing recall communications
- Overlooking tiered responsibility across manufacturer, importer, distributor, retailer, and component supplier, including independent notice and cooperation duties
- Neglecting the immediate preservation duty once litigation is reasonably anticipated, even before liability is confirmed
- Ignoring insurance notice and cooperation requirements that can be forfeited by delay or incomplete reporting
- Presenting conclusions without identifying the governing authority, operative trigger, responsible party, and immediate consequence
- Collapsing multiple agreements or regulatory strands into one generic recommendation instead of tracking each obligation separately

## 3. Legal frameworks / domain conventions that apply

- Product-safety reporting regime: identify the governing statute, regulation, or agency rule for the relevant jurisdiction; determine whether the event is a reportable defect, hazard, nonconformance, or serious incident under the controlling standard
- Recall and corrective action rules: distinguish voluntary corrective action from mandatory recall, stop-sale, consumer notice, remedy, and remediation procedures under the applicable product-safety framework
- Public-company disclosure: assess materiality and disclosure timing under the applicable securities law and exchange-filing regime, including the duty to avoid misleading partial disclosure
- Supply-chain contracts: review notice, cooperation, inspection, quality assurance, traceability, indemnity, and recall-cost allocation provisions in the governing agreements
- Distribution and retailer obligations: assess notice, shelf-pull, quarantine, replacement, and customer-contact duties that may be triggered by downstream possession of affected units
- Litigation hold and preservation: once litigation is reasonably foreseeable, preserve relevant documents, test data, complaints, design history, communications, and supplier records under the applicable preservation doctrine and court-rule framework
- Insurance notice: review notice, consent, cooperation, defense, and coverage-allocation provisions; distinguish product-liability coverage from recall-expense coverage and exclusion issues
- Privilege and internal investigation: preserve the ability to investigate while maintaining legal privilege where available, and separate factual preservation from legal analysis
- Causation and scope assessment: use complaint volume, incident severity, batch or lot traceability, and distribution footprint to define the reporting universe and remediation priority

## 4. Analytical scaffolds

- Begin with source-document triage:
  - identify the product, defect mode, injury or hazard type, affected units, geography, and timeline
  - distinguish confirmed facts, allegations, testing results, and open questions
  - list the agreements, notices, reports, insurance forms, and internal materials that may be implicated
- Enumerate the relevant entities before analysis:
  - the primary operating entity
  - upstream suppliers or component providers
  - downstream distributors or retailers
  - any insureds, additional insureds, or notice recipients
  - any public reporting entity or parent entity
- For each entity and document set, identify:
  - the legal or contractual trigger
  - the governing authority or clause
  - the deadline or timing anchor
  - the responsible person or role
  - the practical consequence of compliance or delay
- Analyze reporting obligations separately from recall obligations:
  - reporting asks whether the incident must be notified and to whom
  - recall asks what corrective action, notice, replacement, repair, refund, stop-sale, or retrieval is required
  - do not assume that a reportable issue automatically requires the same form of recall
- Test whether the issue is likely to be treated as mandatory or voluntary:
  - mandatory pathways usually hinge on statutory thresholds, agency direction, or defined safety criteria
  - voluntary pathways still require disciplined scope control, regulator coordination, and consumer messaging
- Assess securities disclosure with caution:
  - determine whether the incident is likely material in context
  - check whether the disclosure duty arises from periodic reporting, current reporting, antifraud concerns, or an existing public statement that must be corrected
- Assess preservation immediately:
  - preserve complaint data, design files, test protocols, supplier communications, batch records, corrective-action deliberations, and insurance communications subject to privilege planning
  - identify custodians and implement a litigation-hold notice before routine deletion cycles resume
- Assess insurance and indemnity in parallel:
  - notice to insurers can be required even when liability is disputed
  - indemnity and reimbursement rights against counterparties may coexist with insurance recovery
- For each issue, close the analysis by stating:
  - the governing authority
  - the party that must act
  - the deadline or urgency trigger
  - the downstream operational, regulatory, litigation, disclosure, or cost consequence

## 5. Vertical / structural / temporal relationships

- Supply-chain hierarchy matters:
  - reporting and recall duties may run independently at multiple tiers
  - a retailer’s shelf-pull obligations do not eliminate the manufacturer’s reporting duties
  - upstream indemnity rights do not suspend immediate notice duties downstream
- Temporal sequencing matters:
  - preservation duties can arise before any external notice is filed
  - insurance notice may be due before internal causation analysis is complete
  - public disclosure may need to be coordinated with, but not delayed by, regulatory submissions if materiality is present
- Scope must be dynamic:
  - initial scope may be based on a limited lot, model, or shipment
  - later testing or complaint data may expand the affected population
  - the memorandum should reflect that scope can change as evidence develops
- Multiple obligations can coexist:
  - a single incident may trigger reporting, corrective action, consumer notice, contract notice, insurance notice, and legal hold at the same time
  - analyze them as parallel tracks, not as alternatives unless the source materials clearly require a choice
- Where the documents show more than one affected product line, geography, or contract set, analyze each separately rather than using one representative path

## 6. Output structure conventions

- Draft as a formal incident response memorandum in an industry-conventional structure, using headings that cover:
  - Executive Summary
  - Facts and Scope of the Incident
  - Regulatory Reporting Analysis
  - Recall / Corrective Action Analysis
  - Contractual and Supply-Chain Obligations
  - Securities Disclosure and Public Statements
  - Insurance Notice and Recovery
  - Litigation Hold and Preservation
  - Recommended Action Plan
- State the governing authority for every legal proposition relied on, by statute, regulation, rule, or recognized doctrine; do not state a conclusion without tying it to the applicable authority
- Where the source documents identify a clause, regulation, or form requirement, quote or paraphrase it carefully without relying on unsupported shorthand
- Separate confirmed facts from assumptions, and identify any material information gaps that affect the recommendation
- For each obligation or issue, include:
  - severity using a consistent ordinal scale defined once at the top
  - legal basis
  - triggering facts
  - responsible role
  - timing anchor
  - consequence of delay or noncompliance
- If multiple parties, products, or periods are implicated, list them explicitly before analyzing them
- End with an explicit Recommended Action Plan that assigns each action to a role and ties it to a deadline, regulatory milestone, or immediate-risk urgency
- Keep the memorandum suitable for delivery as `incident-response-memorandum.docx`
