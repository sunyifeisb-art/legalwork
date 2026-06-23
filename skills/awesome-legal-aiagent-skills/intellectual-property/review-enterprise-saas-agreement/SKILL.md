---
name: review-enterprise-saas-agreement
task_id: intellectual-property/review-enterprise-saas-agreement
description: Reviewing an enterprise SaaS agreement from the customer’s perspective against diligence materials to produce a risk-tiered issues memorandum.
activates_for: [planner, solver, checker]
---

# Skill: Review Enterprise SaaS Agreement

## 1. Subject-matter triage
- Treat the customer-side review as a contract-risk exercise, not a general product summary.
- Read the agreement together with the vendor diligence set and any support exhibits, then reconcile what the paper promises with what the vendor actually says it can do.
- If the source set includes more than one service line, environment, data category, or operational population, separate them before analysis and keep the risk discussion itemized by subject.
- If the service touches regulated or sensitive information, elevate the compliance review to the governing regime for that data type and test the contract against it.

## 2. Failure modes the skill is correcting
- Reviewing the SaaS agreement in isolation and missing gaps between contractual promises and vendor diligence disclosures.
- Treating vendor boilerplate as commercially neutral instead of testing it from the customer’s risk position.
- Missing where security, availability, or support commitments are aspirational rather than enforceable.
- Failing to connect limitation-of-liability language to the customer’s actual operational dependence on the platform.
- Describing issues without tying them to the relevant source clause, the supporting diligence material, and the practical consequence for the customer.

## 3. Legal frameworks / domain conventions that apply
- Enterprise SaaS agreements are typically judged by customer-side allocation of risk across data security, service levels, data rights, support, indemnity, compliance, termination, and modification rights.
- Security review should compare the agreement’s commitments to the vendor’s disclosed controls, certifications, policies, and exception lists; a promise that exceeds demonstrated practice is a negotiation gap.
- Service levels should be specific, measurable, and paired with usable remedies; broad exclusions, vague credits, or exclusive remedies often undercut the stated uptime promise.
- Data ownership should remain with the customer, while export, deletion, and transition assistance should be usable in practice and not merely acknowledged in principle.
- Unilateral change rights should be tested for scope, notice, and termination protection when the change is material.
- Liability allocation should be assessed against the service’s business criticality, the data at issue, and the failure modes identified in diligence.
- For regulated data, map the contractual language to the governing privacy, security, or sector-specific obligations before concluding the allocation is acceptable.
- For any legal proposition relied on in the memo, state the governing authority or contract rule by name rather than asserting the conclusion alone.

## 4. Analytical scaffolds
1. Read the agreement section by section from the customer’s perspective and extract provisions that expand vendor discretion, narrow remedies, or shift risk outward.
2. Compare each security promise in the agreement to the diligence materials:
   - identify mismatches, unsubstantiated commitments, exceptions, and missing implementation detail;
   - note whether the contract is stronger than the diligence record or whether the diligence record reveals a hidden weakness.
3. Compare representations, warranties, and support statements against technical, operational, and sales diligence responses for consistency.
4. Review the service-level package:
   - uptime definition;
   - measurement window;
   - excluded downtime;
   - maintenance carveouts;
   - credit mechanics;
   - whether credits are the sole remedy;
   - whether chronic failure triggers termination or other relief.
5. Review unilateral modification rights:
   - what can change;
   - whether the vendor may change features, policies, security posture, or pricing construct;
   - what notice applies;
   - whether the customer can terminate or preserve prior terms if the change is material.
6. Review data ownership, use restrictions, export, retention, and deletion provisions for practical portability and transition support.
7. Review indemnity and defense obligations for intellectual property, data breach, privacy, and misuse claims, and test any exclusions or conditions precedent.
8. Review liability caps, indirect-damages waivers, and carveouts in light of the service’s operational criticality and the diligence record.
9. Assign a customer-side risk tier to each issue and explain the tier in one line.
10. Where the source set contains more than one relevant service, environment, or data class, run the same analysis separately for each and do not merge the results.

## 5. Vertical / structural / temporal relationships
- Track how changes in one clause alter the effect of another clause; for example, a strong security warranty may be hollow if the liability cap excludes the likely breach losses.
- Note whether pre-contract diligence statements are later contradicted by the agreement or whether the agreement silently omits a diligence commitment the customer relied on.
- Pay attention to time-based features: notice periods, cure windows, renewal timing, suspension triggers, retention periods, and post-termination assistance.
- If a provision’s impact depends on a threshold, scale, or exception, state the relevant figure or trigger from the source materials before stating the risk.
- If multiple documents address the same topic, identify which document controls, which supplements, and which creates tension.

## 6. Output structure conventions
- Produce a risk-tiered issues memorandum from the customer’s perspective.
- Use a clear ordinal severity scale defined once at the top, then apply it consistently to every issue.
- Organize the memo from highest risk to lowest risk as viewed by the customer.
- For each issue, include:
  - the contract section or source document reference;
  - the issue statement;
  - the supporting diligence evidence, if any;
  - the customer risk and downstream consequence;
  - the recommended negotiation position;
  - the severity label.
- Close each issue with the three required moves: the relevant scale or threshold from the sources, the clause or document cross-reference, and the practical consequence to the customer.
- End with a Recommended Actions section that gives concrete next steps, assigns them to the appropriate role, and ties them to a transaction or response deadline.
- Keep the memo usable for negotiation: concise, specific, and written as if it will be sent to commercial and legal stakeholders.
