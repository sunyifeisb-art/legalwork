---
name: hls-identify-msa-issues
task_id: healthcare-life-sciences/identify-issues-in-management-services-agreement
description: Reviews a draft management services agreement and supporting materials to identify common healthcare regulatory and drafting risks, including corporate practice of medicine concerns, fee arrangement issues under fraud-and-abuse principles, physician self-referral issues where applicable, independence flaws in valuation support, restrictive covenant enforceability issues, fee-splitting concerns, assignment asymmetry, and liability cap adequacy.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Healthcare Management Services Agreement

## 1. Subject-matter triage

- Treat the management services agreement as a healthcare regulatory and risk-allocation document, not a generic commercial contract.
- First identify whether the materials show one jurisdiction or multiple jurisdictions, and whether the physician group provides ancillary services, receives referral-based revenue, or operates through any operational support entity structure that may change the analysis.
- If multiple jurisdictions or counterparties appear in the source set, enumerate them before analysis and apply the framework separately to each relevant jurisdiction, entity, or arrangement.
- Distinguish clinical control issues, compensation design issues, and transactional risk-allocation issues; do not collapse them into a single generic “compliance” conclusion.

## 2. Failure modes the skill is correcting

- Corporate-practice risks are missed because the review focuses on business terms and not on who controls staffing, scheduling, service lines, or clinical judgment.
- Compensation terms are accepted without testing whether any fee, bonus, or incentive tracks business volume, collections, referrals, or other utilization measures that can raise fraud-and-abuse concerns.
- Self-referral issues are omitted even though the physician group’s service mix may make a financial relationship materially relevant.
- Valuation support is treated as adequate without checking independence, objectivity, and whether any contingent economics undermine the reliability of the commercial rationale.
- Restrictive covenants are assumed enforceable without checking reasonableness and physician-specific limitations under the governing law.
- Fee-splitting concerns are overlooked where the structure may resemble a prohibited sharing of professional fees or revenue.
- Assignment provisions are reviewed one-sidedly, leaving the physician group bound to a successor it never evaluated.
- Liability caps are left generic even where data incidents, administrative failures, or operational disruption call for tailored carve-outs or separate limits.

## 3. Legal frameworks / domain conventions that apply

- Corporate practice of medicine doctrine: assess whether a non-physician entity may employ physicians, direct clinical decisions, or control medical staffing and operations under the governing state law; confirm that medical judgment is expressly reserved to licensed clinicians.
- Fraud-and-abuse compensation principles: evaluate whether compensation terms are consistent with applicable anti-kickback and fee-arrangement concepts, including whether payment varies with volume, value, collections, or referrals in a way that may create risk under the Anti-Kickback Statute, 42 U.S.C. § 1320a-7b(b), and any relevant safe harbor in 42 C.F.R. § 1001.952.
- Physician self-referral rules: if the physician group refers or furnishes designated ancillary services, assess whether any financial relationship implicates the Stark Law, 42 U.S.C. § 1395nn, and whether a recognized exception could apply.
- Valuation support: evaluate whether any appraisal or fairness support is independent and commercially credible, including whether the advisor has contingent economics that could undermine objectivity.
- Restrictive covenants: test any non-compete or similar covenant against the governing state law, including physician-specific enforceability limits and reasonableness of scope, geography, duration, and activity restriction.
- Fee-splitting and professional-fee sharing: analyze whether the payment architecture could be characterized under applicable state law or ethics rules as an impermissible division of clinical fees with a nonlicensed entity.
- Assignment and successor risk: review whether consent rights, permitted assigns, and transfer mechanics allocate successor risk symmetrically and preserve the physician group’s ability to evaluate the counterparty.
- Liability limitation: assess whether the cap and carve-outs align with foreseeable categories of loss, including privacy or data incidents, negligent administration, indemnity exposure, and operational interruption.

## 4. Analytical scaffolds

1. **Clinical control review**
   - Identify provisions on staffing, scheduling, hiring/firing, service lines, policies, supervision, and escalation rights.
   - Ask whether any language lets the MSO influence medical judgment, clinical protocols, or physician compensation in a way that suggests impermissible control.
   - Anchor each concern to the governing state doctrine and the specific agreement language that creates the risk.

2. **Compensation and fraud-and-abuse review**
   - Parse the base fee, variable fee, bonus, true-up, offset, or reimbursement mechanics.
   - Test whether the payment formula is tied to volume, value, collections, referrals, productivity, or utilization.
   - If the source materials contain a valuation or rate-setting memo, compare the agreement economics against that support and explain whether the support actually matches the fee mechanics.

3. **Self-referral and ancillary-services review**
   - Identify whether the physician group orders, furnishes, or bills for regulated ancillary services.
   - Determine which ownership, compensation, or referral relationships create Stark issues and whether an exception analysis is needed.
   - Tie the analysis to the actual service line and referral pathways shown in the diligence materials.

4. **Valuation support review**
   - Check whether the advisor appears independent and whether the engagement terms are contingent, success-based, or otherwise outcome-linked.
   - Assess whether the comparable data, assumptions, and scope are sufficiently objective to support the commercial terms.
   - Flag any mismatch between the valuation narrative and the agreement’s actual payment or allocation mechanics.

5. **Restrictive covenant review**
   - Evaluate any non-compete, non-solicit, exclusivity, or notice restriction for enforceability under the governing law.
   - Focus on whether the restriction is ancillary to the transaction, narrowly tailored, and reasonable in duration, geography, and activity.
   - Note physician-specific restrictions or public-policy limits where applicable.

6. **Fee-splitting review**
   - Analyze whether the economics look like a share of professional fees rather than bona fide compensation for management services.
   - Separate compensation for administrative services from compensation that depends on clinical revenue or professional collections.
   - Identify any drafting that could blur the line between administrative services and clinical fee sharing.

7. **Assignment and transfer review**
   - Identify all assignment, change-of-control, permitted transferee, and consent provisions.
   - Determine whether one side can transfer freely while the other cannot, and whether a successor could materially alter the risk profile.
   - Note any mismatch between assignment rights and termination rights.

8. **Liability and risk-allocation review**
   - Read the cap, basket, carve-outs, indemnities, and exclusive-remedy language together.
   - Test whether high-risk events need separate caps, uncapped remedies, or narrower exclusions from the cap.
   - Evaluate whether operational or compliance failures are under-remedied relative to the expected exposure.

9. **Issue framing for the memorandum**
   - For each issue, state the agreement section, describe the concern, identify the controlling authority, assign an ordinal severity, and give a concrete revision path.
   - Where the source documents provide a threshold, term, amount, or other measurable context, use that context to show why the issue matters.
   - Cross-reference any related clause or diligence material that changes the risk analysis.
   - State the downstream consequence for the client in regulatory, operational, economic, or transaction terms.

## 5. Vertical / structural / temporal relationships

- Read the MSA together with any term sheet, valuation support, diligence questionnaire, draft side letter, policy exhibit, or pricing schedule; do not analyze the MSA in isolation where another document supplies the missing commercial premise.
- If a control provision is softened in one section but reintroduced through a side letter, schedule, or operating policy, treat the combined effect as the operative deal.
- Track whether obligations shift over time, such as upon launch, expansion, renewal, change of control, default, audit, or termination.
- Compare pre-closing expectations, post-closing operations, and termination mechanics to see whether the risk profile changes at each stage.

## 6. Output structure conventions

- Write a memorandum organized by severity, using a stated ordinal scale such as Critical / High / Medium / Low defined once at the start.
- Group issues in a conventional issues-memo format rather than a checklist dump.
- For each issue, include:
  - agreement section or exhibit reference
  - concise description of the concern
  - controlling legal authority by name and section or other recognized citation
  - severity
  - why it matters, including the concrete consequence to the client
  - recommended revision or diligence follow-up
- Close each issue with an actionable recommendation that names the responsible role and the timing anchor that makes sense in the transaction.
- End with a concise Recommended Actions block that sequences the highest-priority fixes before signing or diligence close.
