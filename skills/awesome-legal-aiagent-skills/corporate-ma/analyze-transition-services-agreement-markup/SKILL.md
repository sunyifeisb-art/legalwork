---
name: analyze-tsa-markup
task_id: corporate-ma/analyze-transition-services-agreement-markup
description: Guides seller-side analysis of a buyer's transition services agreement markup, evaluating liability cap exposure, IP license scope creep, service-level penalty accumulation, and interaction with the purchase agreement's indemnification and earnout provisions.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Transition Services Agreement Markup

## 2. Failure modes the skill is correcting

- Reading the buyer markup as a stand-alone TSA instead of testing it against the seller form, playbook positions, operational constraints, APA terms, and cost model together
- Treating liability caps in isolation and missing that TSA liability may sit alongside separate APA indemnity exposure, creating additive seller risk
- Overlooking how service-level commitments, penalty mechanics, or cure rights can create uncapped or compounding exposure over the service term
- Missing scope creep in IP, systems access, work product, or step-in language that reaches beyond what is needed to perform the transition services
- Failing to connect TSA economics and operational burden to the earnout period, including fee changes, staffing demands, or volume obligations that can distort performance metrics
- Drafting issue notes that describe the problem but do not quantify it, tie it to interacting provisions, or state the concrete seller-side consequence
- Producing recommendations that are generic instead of issue-specific, role-specific, and timed to the transaction milestone

## 3. Legal frameworks / domain conventions that apply

- Transition-services analysis is clause-by-clause, but the operative question is whether the buyer’s markup shifts risk, control, cost, or access beyond the seller’s form and agreed operating model
- Liability cap provisions should be tested against the TSA cap text, any fee-based ceiling, any period-based ceiling, and any separate indemnification regime in the APA; evaluate combined exposure, not each cap in a vacuum
- Service-level regimes should be reviewed for penalty stacking, fee credits, service failures, cure mechanics, and whether penalties are capped in the aggregate or only per incident
- Standard-of-care language should be checked for tension between a general diligence standard and more specific service-level obligations; overlapping standards can create a double default path
- IP license grants should be limited to what is necessary to deliver the services; language covering IP “used in connection with” service delivery, broader business systems, or retained-business tools may create access risk
- Work product and derivative-improvement language should be read for ownership shifts that could sweep in seller know-how, system enhancements, templates, or process improvements
- Step-in rights and control rights can interfere with the seller’s retained operations, personnel allocation, cybersecurity posture, and plant or back-office continuity
- Force majeure and suspension rights should be checked for duration, fee abatement, and exit consequences; an open-ended suspension right can leave the seller bearing stranded costs
- Personnel restrictions, non-solicit concepts, and service staffing commitments should be reviewed for conflicts with the seller’s retained business needs and shared-resource constraints
- Earnout interaction requires mapping TSA economics and operational load to the measurement window so the seller-side impact on revenue, EBITDA, or other metrics is understood in context

## 4. Analytical scaffolds

1. **Issue inventory and ranking**
   - Identify each substantive deviation from the seller form and playbook.
   - Assign an ordinal severity label once at the top of the memo and apply it uniformly to each issue.
   - Sort issues from highest to lowest practical seller-side risk.

2. **Clause-level comparison**
   - For each issue, compare the buyer markup to the seller form and to any relevant APA or operational constraint.
   - Quote only sparingly and never reproduce confidential text verbatim unless the task expressly requires surfacing source language.
   - Track whether the change is a deletion, insertion, narrowing, expansion, or relocation of risk.

3. **Closed issue analysis**
   - For every issue, state the scale or threshold implicated using the source documents: fee base, term, service volume, exposure ceiling, staffing burden, or measurement period.
   - Cross-reference the interacting clause, schedule, or document that changes the risk profile.
   - State the downstream consequence for the seller, such as added cost, retained-business interference, exposure stacking, reduced earnout performance, or operational lock-in.

4. **Liability cap analysis**
   - Identify the TSA cap formulation and test it against the seller form.
   - Determine whether the cap is per claim, aggregate, per service, or tied to fees or term.
   - Compare it with any APA indemnity cap or basket to assess total seller-side exposure.

5. **Service-level and operational risk analysis**
   - Enumerate each service standard, credit, penalty, cure right, and termination trigger.
   - Assess whether penalties can accumulate without an aggregate cap.
   - Check whether buyer step-in, audit, approval, or staffing controls interfere with retained business operations.

6. **IP, work product, and access analysis**
   - Identify all granted rights to software, data, systems, documentation, and work product.
   - Test whether the language is limited to what is needed to provide the TSA services.
   - Flag any language that could be used to extend access to seller proprietary systems or ownership of improvements.

7. **Earnout interaction analysis**
   - Identify service-fee changes, incremental workload, cost shifts, or staffing reallocations that occur during the earnout measurement period.
   - Analyze how those changes could affect the earnout metric directly or indirectly.
   - Distinguish temporary transition friction from persistent metric distortion.

8. **Authority and convention support**
   - Ground each legal proposition in the governing TSA, APA, and any cited deal documents.
   - Where a proposition depends on a recognized legal or market convention, state the convention explicitly rather than presenting it as assumption-free conclusion.
   - Do not state a risk conclusion without naming the clause logic that supports it.

## 5. Vertical / structural / temporal relationships

- Track the relationship between the TSA and the APA first, then between the TSA and the seller’s form, then between the TSA and the operating model or cost analysis
- Separate pre-closing integration issues from post-closing transition obligations, because the same clause may be tolerable in one period and harmful in another
- Distinguish one-time transition costs from recurring service charges, because repeated burdens matter differently for exposure, staffing, and earnout impact
- If multiple services, sites, or business units are implicated, analyze each separately rather than collapsing them into a single representative service
- Where a provision applies over time, note whether the risk scales with term length, service volume, or event count
- If the markup creates a hierarchy between the TSA, the APA, schedules, or exhibits, identify which document controls and whether that hierarchy is seller-favorable or seller-adverse

## 6. Output structure conventions

- Produce a seller-side deviation memorandum in an industry-standard issue format, organized by severity
- Define the severity scale once at the top and apply it consistently across all issues
- For each issue, use a compact field structure:
  - Provision reference
  - Buyer markup change
  - Seller-form / playbook position
  - Severity
  - Impact analysis
  - Recommended counter-position
- Include a combined exposure summary where liability under the TSA is analyzed alongside any separate APA indemnity exposure
- Include a service-level / penalty section that addresses accrual, aggregation, cure mechanics, and any missing cap
- Include an IP / access / work-product section if any grant, use, or ownership language is broadened
- Include an earnout interaction section that ties TSA economics and operational burden to the measurement window
- End with a Recommended Actions block stating the next step, the responsible role, and the timing anchor tied to the deal workflow
- Keep recommendations practical and seller-leaning: narrow the clause, add a cap, align with the form, preserve retained-business access boundaries, or confirm operational assumptions
