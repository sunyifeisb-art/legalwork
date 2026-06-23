---
name: compare-homeowners-filing-washington-state-regulatory
task_id: insurance/compare-insurance-application-filing-against-state-regulatory-requirements
description: Agents reviewing an insurance product filing package against state regulatory requirements identify potential compliance gaps, verify internal calculations, and check for required disclosures, notices, timing provisions, and consistency across documents without relying on task-specific citations or scenario-specific numeric thresholds.
activates_for: [planner, solver, checker]
---

# Skill: Compliance Gap Analysis — Insurance Product Filing Against State Regulatory Requirements

## 1. Subject-matter triage
- Treat the filing package as a multi-document regulatory submission, not a single form.
- Identify the document types first: policy form, endorsements, declarations, underwriting guidelines, rate/supporting actuarial materials, disclosures, notices, and any application or acknowledgement materials.
- If only one relevant policy form is present, say so affirmatively; otherwise enumerate the documents and analyze each against the others.
- Prioritize provisions that affect insurability, cancellation/nonrenewal, coverage scope, claim administration, and mandatory consumer disclosures.

## 2. Failure modes the skill is correcting
- Gaps are described without tying them to the governing Washington requirement, leaving the memo non-actionable.
- The filing is accepted at face value instead of independently checking calculations, internal references, triggers, and timing language.
- Disclosures, notices, cancellation rules, proof-of-loss deadlines, claims-payment timing, and coverage-reduction statements are missed because they are scattered across forms and supporting materials.
- Cross-document inconsistencies are overlooked when one document narrows, expands, or conflicts with another.
- Issues are identified, but the memo fails to rank them by severity or explain the practical filing risk.
- Recommendations are absent or too generic to support a resubmission or cure plan.

## 3. Legal frameworks / domain conventions that apply
- Washington insurance forms and rates must be reviewed for consistency with the applicable state insurance code and administrative regulations governing form content, unfair discrimination, and consumer disclosures.
- Nonrenewal timing: compare the policy’s advance notice language to the governing Washington notice standard for the relevant line.
- Cancellation return premium: verify whether insurer-initiated cancellation uses the required pro rata treatment or another permitted method under Washington law.
- Suit-limitation period: compare the contractual limitation period and accrual trigger against the governing Washington minimum standard.
- Proof-of-loss period: compare the stated deadline and trigger event to the applicable Washington standard.
- Claims-payment timing: review any provision governing payment of undisputed or completed claims against the applicable Washington timing rule.
- First-period cancellation: assess whether cancellation during the initial policy term uses only permitted grounds, notice, and procedure.
- Earthquake exclusion disclosure and other coverage-reduction notices: check whether the filing includes the disclosure or acknowledgement the Washington framework requires when coverage is excluded or materially reduced.
- Mold or other sublimits: assess whether a coverage-reducing sublimit is disclosed consistently and, where required, accompanied by a notice that the reduction is conspicuous and understandable.
- Percentage deductibles and similar variable deductibles: assess whether the structure is clearly described, internally consistent, and not overbroad as applied to geography, peril, or trigger.
- Underwriting exclusions, including breed-specific exclusions or similar classifications, must be checked for unfair-discrimination risk and supporting justification if the filing uses them.
- Credit-based underwriting references require review for adverse-action notice procedures, recordkeeping, and reconsideration workflow if the filing implicates credit scoring.
- Actuarial support and rate-support materials must be checked for internal arithmetic consistency and for alignment with the filed form language.

## 4. Analytical scaffolds
1. Start by enumerating the filing components, then run the same comparison pass across each component and between components.
2. For each provision or disclosure, identify: the filed language, the Washington requirement at the category level, the mismatch or omission, and the practical filing consequence.
3. When a timing rule is implicated, identify the trigger event, the stated period, and whether the trigger is defined consistently across the package.
4. When a return-premium or rating assumption is stated, independently check the supporting math or methodology and flag any inconsistency with the filed form or actuarial support.
5. When a coverage restriction appears, test whether it is clearly drafted, conspicuous, and repeated consistently across the policy, declarations, endorsements, and notices.
6. When a classification or underwriting restriction appears, test whether the filing supplies a lawful rationale and whether any related notice workflow is addressed.
7. When a disclosure is required, confirm it appears in the correct document set, in the correct location, and in language that matches the operative coverage terms.
8. Assign a severity level to every issue using a fixed ordinal scale: Critical, High, Medium, Low.
9. Close each issue by stating the applicable authority category, the cross-document inconsistency or support problem, and the downstream consequence for filing approval, consumer exposure, or resubmission risk.
10. If the record does not contain enough information to verify a point, flag the gap as a review deficiency rather than assuming compliance.

## 5. Vertical / structural / temporal relationships
- Compare policy form text against declarations, endorsements, underwriting guidance, and supporting memoranda for contradictions in scope, timing, exclusions, or calculation method.
- Check whether a restriction in one document is softened, omitted, or contradicted in another.
- Verify that notice periods, limitation periods, and claim deadlines are internally aligned across all documents.
- For initial term, renewal, and cancellation provisions, distinguish the operative period and confirm the drafting does not blur the timing of rights or obligations.
- If a required disclosure depends on another form or acknowledgement, confirm the forms reference each other consistently and use the same defined terms.

## 6. Output structure conventions
- Write a prioritized compliance-gap memo in a conventional legal memo shape, not a checklist dump.
- Open with a short executive summary stating overall risk level and the most material filing problems.
- Then present issues in descending severity, each with:
  - Severity
  - Issue title
  - Filing language or document reference
  - Governing Washington requirement at the category level
  - Gap / inconsistency / missing support
  - Why it matters
  - Recommended cure
- Use precise, non-overlapping issue labels so that similar defects are not collapsed into one entry unless they are truly the same defect.
- Surface cross-document conflicts explicitly, rather than burying them in a general observation.
- Include a compact severity summary if helpful, but do not replace the issue-by-issue analysis.
- End with a Recommended Actions section that assigns each fix to a responsible role and ties it to the filing-resubmission timeline or other practical urgency.
- Keep recommendations operational: revise, add, confirm, reconcile, disclose, delete, or support, rather than merely “review.”
- Cite the controlling Washington authority or regulatory source for each legal proposition relied on, using the governing statute, regulation, or recognized authority category rather than unsupported conclusions.
