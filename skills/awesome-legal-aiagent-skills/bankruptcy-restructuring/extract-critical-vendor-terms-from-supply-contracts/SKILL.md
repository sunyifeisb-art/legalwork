---
name: extract-critical-vendor-terms-from-supply-contracts
task_id: bankruptcy-restructuring/extract-critical-vendor-terms-from-supply-contracts
description: Ensures a vendor contract extraction memo identifies the key economic and legal terms relevant to chapter 11 assumption/rejection analysis, evaluates cure obligations from the available payment records, analyzes anti-assignment and bankruptcy-related provisions, and provides a structured assumption/rejection assessment with estimated rejection exposure for each contract.
activates_for: [planner, solver, checker]
---

# Skill: Extract Critical Vendor Terms from Supply Contracts

## 1. Subject-matter triage
- Treat this as a multi-document comparison and issue-spotting exercise across each vendor contract, the aging report, and the critical vendor memo.
- First identify the full vendor set in scope, then analyze each contract separately before synthesizing any cross-vendor budget or authorization impact.
- If a source document is missing, contradictory, or internally inconsistent, flag the gap and avoid inventing cure or exposure figures.

## 2. Failure modes the skill is correcting
- Agent recites contract boilerplate but omits the payment-record analysis needed to support cure, rejection exposure, or priority treatment.
- Agent merges all vendors into one general discussion instead of running a contract-by-contract assessment.
- Agent states assignability or bankruptcy-effects conclusions without identifying the governing clause and controlling bankruptcy rule.
- Agent lists issues without tying them to the amount at stake, the relevant interacting document, and the practical consequence for assumption, rejection, or critical-vendor treatment.
- Agent treats the critical-vendor memo as background only and fails to test whether aggregate cure demands or payment demands affect the available authorization or budget.
- Agent concludes on rejection or assumption without stating the factual basis, the legal standard, and the downstream economic or operational effect.
- Agent omits a clear recommendation section directed to the appropriate business or legal owner.

## 3. Legal frameworks / domain conventions that apply
- Assumption of executory contracts: analyze cure obligations, compensation for actual pecuniary loss where applicable, and adequate assurance of future performance under Bankruptcy Code section 365(b).
- Rejection consequences: treat rejection as a prepetition breach under Bankruptcy Code section 365(g) and estimate resulting damages under applicable nonbankruptcy law, subject to any bankruptcy-law limitations that may apply to the contract category.
- Anti-assignment: identify transfer restrictions and test them against Bankruptcy Code section 365(f), while separately checking whether a contract type falls within an applicable-law or other statutory exception under section 365(c).
- Ipso facto / bankruptcy-termination clauses: identify provisions triggered by insolvency, filing, or similar events and assess them under Bankruptcy Code sections 365(e) and related provisions.
- Cure computation: derive cure from the available payment records and aging data; include only amounts supported by the records and the contract’s pricing, default interest, fees, or similar charges.
- Possessory and retention rights: for custodial, logistics, warehousing, or carrier arrangements, assess lien, hold, or retention rights that may affect estate leverage or turnover.
- Foreign law and dispute provisions: flag governing-law, forum-selection, arbitration, or foreign-law features that could complicate assumption, rejection, or enforcement.
- Critical vendor context: reconcile contract-level demands against the critical-vendor memo and any stated budget or approval cap; identify where one vendor’s demand may constrain others.

## 4. Analytical scaffolds
- For the overall memo, begin with a compact summary table of all vendors showing: contract date, governing law, pricing structure, payment status/cure posture, key assignment or bankruptcy issues, preliminary assumption/rejection view, and estimated rejection exposure if rejected.
- Before analyzing, enumerate the vendor contracts explicitly and then run the same extraction framework for each one; do not collapse multiple vendors into a single representative analysis.
- For each contract, extract in sequence:
  - execution date, term, renewal mechanics, and governing law;
  - pricing components, volume or minimum purchase commitments, and payment terms;
  - defaults or arrears supported by the payment records, with a line-by-line cure build;
  - anti-assignment language and the applicable bankruptcy-law effect;
  - bankruptcy-trigger, termination, setoff, or remedy provisions;
  - unique issues such as liens, retention-of-title, intellectual property, foreign-law, forum, or arbitration features;
  - assumption/rejection assessment with a short rationale;
  - estimated rejection exposure if rejected, grounded in the contract remedy framework and governing law.
- When an issue is identified, close it by tying it to the relevant amount or contractual threshold, cross-referencing the other source document that affects it, and stating the concrete consequence for the estate or negotiation posture.
- If multiple accrual dates, payment periods, or vendor demands appear, keep them separate; do not net them into one blended figure unless the source documents require that treatment.
- If the source materials do not support a precise figure, state the range or the unresolved component rather than forcing precision.
- Where the legal conclusion depends on a specific statutory rule, identify the controlling authority by name and section rather than using a bare conclusion.
- Where the record supports it, distinguish between cure needed for assumption, exposure if rejected, and any separate budget or authorization pressure from critical-vendor treatment.

## 5. Vertical / structural / temporal relationships
- Analyze each vendor on its own timeline: contract execution, prepetition performance, payment aging, cure date, and the projected assumption or rejection endpoint.
- Compare each contract’s payment posture against the aging report and note whether any arrears appear prepetition, postpetition, disputed, or unsupported.
- Track how contract rights interact vertically: pricing and volume commitments affect arrears; arrears affect cure; cure and future assurance affect assumption; remedy clauses affect rejection exposure; budget constraints affect critical-vendor leverage.
- If a provision operates only upon a specific triggering event, identify that trigger and the temporal sequence in which it matters.
- If a clause may be overridden or preserved by bankruptcy law, identify both the contract term and the bankruptcy rule that controls the relationship.

## 6. Output structure conventions
- Produce a structured memo in conventional legal-memo form, with a brief executive summary, a vendor-by-vendor analysis, a cross-vendor synthesis, and a concluding recommendation section.
- Use a dedicated subsection for each vendor contract; each subsection should present key terms, cure analysis, legal issues, assumption/rejection assessment, and rejection exposure in that order.
- Include a summary table with one row per vendor and consistent columns across rows.
- Use concise, source-grounded prose; distinguish clearly between extracted facts, legal analysis, and recommendations.
- End with a Recommended Actions block that assigns each action to the relevant role and anchors it to the transaction timeline or an immediate next step.
- Do not rely on conclusory labels alone; every legal conclusion should be tied to the governing rule or statutory provision supporting it.
