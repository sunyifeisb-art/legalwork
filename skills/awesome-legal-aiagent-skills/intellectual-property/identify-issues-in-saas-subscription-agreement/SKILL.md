---
name: identify-issues-saas-subscription-agreement
task_id: intellectual-property/identify-issues-in-saas-subscription-agreement
description: Reviewing a SaaS subscription agreement package from the customer’s perspective, cross-referencing related technical, privacy, and commercial documents, and internal correspondence, to identify risk allocation and compliance gaps.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in SaaS Subscription Agreement

## 1. Subject-matter triage
- Treat the subscription agreement package as a connected set: master terms, order form, privacy or data-processing terms, security exhibits, service levels, acceptable use, and any internal correspondence that reveals customer expectations or red lines.
- Read from the customer’s perspective and separate legal risk from commercial nuisance; the memorandum should surface both, but prioritize provisions that can create operational, regulatory, financial, or data-loss exposure.
- If the package contains multiple versions or inconsistent drafts, identify the operative document hierarchy before analyzing individual clauses.
- If the package covers more than one service, region, entity, or deployment model, enumerate each scope item first and assess issues against each one separately rather than blending them into a generic review.

## 2. Failure modes the skill is correcting
- Reviewing the subscription agreement in isolation instead of reconciling it with the order form, privacy or data-processing addendum, security materials, and internal correspondence.
- Missing customer-facing risks that are common in vendor-form SaaS contracts, including unilateral change rights, broad disclaimers, narrow remedies, and overreaching liability caps.
- Treating service credits as meaningful compensation without testing whether they are exclusive and whether they actually match the operational harm caused by downtime or degraded service.
- Overlooking data rights failures, including weak portability, delayed deletion, vague retention, or unclear ownership of customer content and metadata.
- Missing gaps between contractual security promises and the vendor’s actual security posture or incident-response commitments.
- Failing to tie each issue to a concrete downstream consequence for the customer.

## 3. Legal frameworks / domain conventions that apply
- SaaS agreements commonly allocate availability, support, data handling, and security through layered documents; the governing-order clause must be read with the order form and addenda to determine which term controls in a conflict.
- Service-level clauses should be tested for target uptime, measurement method, exclusions, cure period, credit calculation, and exclusivity of credits as a remedy; credits may be inadequate where the business impact is broader than the credit scheme.
- Unilateral modification provisions are high risk when they allow the vendor to change terms, policies, features, security standards, or pricing on notice without customer consent.
- Data ownership, portability, export format, deletion timing, retention on termination, and backup handling are core customer protections; ambiguity in these provisions can impair migration and post-termination compliance.
- Privacy and data-processing terms should align with confidentiality, security, audit, subprocessor, breach-notice, and cross-border transfer language; inconsistencies create interpretive and compliance gaps.
- Limitation-of-liability clauses typically exclude indirect or consequential damages and cap direct damages; assess whether the cap and carve-outs leave the customer without a realistic remedy for service failure, confidentiality breach, IP infringement, or data loss.
- Security commitments should be compared against industry-recognized controls and the vendor’s own security materials, including access control, encryption, logging, vulnerability management, business continuity, and incident notification.
- Common contract doctrines and statutory regimes may be implicated depending on the package, including contract interpretation, confidentiality obligations, data-protection requirements, and vendor security representations; cite the controlling authority or governing contractual section for any legal proposition stated.

## 4. Analytical scaffolds
1. Identify the operative document stack and the precedence clause, then map which document governs pricing, service levels, data, security, indemnity, warranty, termination, and liability.
2. Enumerate each distinct issue or risk topic before analysis; do not merge unrelated concerns into a single catchall observation.
3. For each issue, identify the clause or document, the customer-facing problem, the practical business or compliance impact, and the negotiation objective.
4. For service levels, test whether the promised metric is measurable, whether exclusions swallow the commitment, whether credits are exclusive, and whether the remedy is proportionate to the harm.
5. For change-rights provisions, isolate what the vendor may modify, who receives notice, whether the customer can object or terminate, and whether changes can apply retroactively or to material terms.
6. For data and privacy provisions, check ownership, use limitations, retention, deletion, export, subprocessing, incident notice, audit rights, and transfer restrictions against any related addendum or security exhibit.
7. For security commitments, compare the contract language against internal customer concerns and the vendor’s security disclosures; flag any gap between promised controls and actual obligations.
8. For liability and indemnity, identify exclusions, caps, carve-outs, and claim procedure requirements; assess whether the allocation is workable from the customer’s perspective.
9. For each issue, state the scale of the problem using figures, thresholds, durations, or other source-document specifics when available, and cross-reference any interacting clause or document.
10. Tie every issue to its downstream consequence: operational interruption, regulatory exposure, migration risk, payment leverage, dispute risk, or loss of bargaining power.
11. Where the source set is silent on a critical point, say so explicitly and frame the absence as a gap, not as a neutral omission.
12. If only one service, one agreement package, or one counterparty is in scope, say that affirmatively; otherwise, analyze each item separately.

## 5. Vertical / structural / temporal relationships
- Track how the documents relate vertically: master agreement, order form, addenda, exhibits, policies incorporated by reference, and internal emails or notes.
- Track temporal risk: onboarding, go-live, renewal, suspension, incident response, termination, transition assistance, post-termination deletion, and any notice periods tied to those events.
- Where obligations change over time, identify the trigger, the actor responsible, and the resulting customer burden.
- If a clause interacts with a later operational event, describe the relationship explicitly rather than treating the clause in isolation.
- If multiple customer entities, regions, or business units are affected, preserve that relationship in the issue framing so the memorandum reflects where the exposure lands.

## 6. Output structure conventions
- Prepare an issues memorandum organized from highest to lower customer risk.
- Define an ordinal severity scale once at the top and apply it consistently to every issue entry.
- For each issue, include: severity, clause or document reference, concise issue statement, customer risk, scale or trigger from the documents, interacting document or clause, and recommended negotiation position.
- Include a separate section for document conflicts or hierarchy problems when the same topic is addressed inconsistently across the package.
- Use concise, practitioner-style prose; do not quote internal documents verbatim unless necessary to surface the operative point, and do not reproduce unnecessary private text.
- End with a Recommended Actions section that gives imperative next steps, identifies the responsible role, and uses a realistic timing anchor tied to the deal or review process.
- The memorandum should read as a decision aid, not a recital: every issue entry should support a concrete negotiation or redline ask.
