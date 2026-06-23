---
name: hls-compare-privacy-policy-hipaa
task_id: healthcare-life-sciences/compare-privacy-policy-against-hipaa-requirements
description: Conducts an element-by-element privacy-rule gap analysis of a privacy notice and related privacy policy, addressing marketing authorization concepts, dual compliance-role obligations, and data-sharing agreement coverage gaps.
activates_for: [planner, solver, checker]
---

# Skill: Compare Privacy Policy Against HIPAA Requirements

## 1. Subject-matter triage (only if applicable)

- Treat this as a privacy-rule compliance comparison between a policy/notice and the source documents, not a general privacy-risk narrative.
- Identify whether the entity acts in multiple regulated roles; if so, separate notice obligations from agreement, safeguarding, and operational obligations by role.
- If the source set includes amendments, incident materials, or a transaction context, account for notice redistribution, incident review, and deadline-sensitive remediation.
- If multiple covered relationships, communication channels, or data-sharing relationships appear in the record, enumerate them before analysis and analyze each one separately.

## 2. Failure modes the skill is correcting

- Reviewers focus on the policy text alone and miss the need to cross-check agreements, incident materials, and data-sharing arrangements.
- Missing notice elements are described generally instead of being tied to the specific required provision and the downstream operational consequence.
- Marketing, fundraising, and authorization issues are treated as generic “privacy concerns” rather than analyzed under the HIPAA definitions and exceptions.
- Dual-role entities are analyzed as if a single compliance regime applies to every function.
- Remediation is stated abstractly rather than as an implementable action tied to the responsible role and timing pressure.
- Findings are not consistently prioritized, making it hard to separate critical compliance defects from lower-order drafting issues.

## 3. Legal frameworks / domain conventions that apply

- Analyze the notice against the Privacy Rule notice requirements in 45 C.F.R. § 164.520, including the required content, statement of duties, contact information, effective date, and redistribution obligations.
- Treat each missing or deficient required notice element as a separate compliance issue; do not collapse multiple omissions into a single general deficiency.
- If fundraising communications are used, assess the notice against the fundraising disclosure and opt-out requirements in 45 C.F.R. § 164.520(b)(1)(iii) and related Privacy Rule provisions.
- If protected health information is used to encourage purchase of a product or service, analyze the communication under the HIPAA marketing definition and authorization rules in 45 C.F.R. § 164.501 and 45 C.F.R. § 164.508(a), including the narrow treatment and face-to-face exceptions where relevant.
- Where remuneration is involved, test whether an exception still applies under the marketing and authorization rules.
- If the entity receives protected health information from other covered entities or business associates, check for the required contractual and operational arrangements under the Privacy Rule and any supporting agreement inventory.
- If the record includes a security event, incident, or breach analysis, evaluate whether the required risk assessment and related documentation were performed under the applicable HIPAA and security-rule framework.
- Use the source documents’ terminology where available, but do not state conclusions without citing the controlling regulation or other identified authority.

## 4. Analytical scaffolds

1. Build an inventory of every required notice element and every related operational obligation implicated by the source set.
2. For each item in the inventory, state whether it is present, absent, or incomplete, and anchor the conclusion to the controlling section of the Privacy Rule or supporting authority.
3. For every omission or defect, explain why the cited rule applies, how the source document diverges, and what compliance consequence follows.
4. Test all communications that reference health-related products, services, programs, or member/patient outreach against the marketing and fundraising rules, including any authorization requirement and any exception invoked.
5. If the entity performs more than one regulated function, separate the analysis by function and do not assume a deficiency in one function resolves or cures another.
6. Cross-check the policy against agreements, exhibits, schedules, incident materials, and any data-sharing inventory; flag missing alignments even if the notice text appears facially complete.
7. If a change to the notice is recommended, state whether redistribution to existing individuals is required and what event triggers it.
8. Frame the memo as a legal comparison with practical remediation, not as a pure document summary.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track dependencies between the privacy notice, underlying agreements, operational practices, and any incident or breach documentation.
- Where the source set reflects layered roles, analyze obligations vertically: entity role, downstream recipient or processor role, and notice-facing obligations each need separate treatment.
- Where a material amendment, launch, acquisition, or other change is in play, identify the temporal sequence for updating the notice, retraining stakeholders, and redistributing the revised version.
- If the record contains multiple communications or disclosures, analyze them chronologically so later materials do not obscure earlier noncompliance.

## 6. Output structure conventions

- Produce a formal legal memo with an executive summary, issue-by-issue analysis, and a prioritized list of compliance gaps.
- Use an ordinal severity scale defined once at the top and apply it consistently to each finding, with a short rationale for the level assigned.
- For each gap, use a repeatable format: issue description, controlling authority, analysis, consequence, and remediation.
- Each issue should close with the practical consequence to the client, not just the doctrinal defect.
- Include a separate section for immediate priorities and another for recommended actions.
- Every recommendation must state the action to take, the responsible role, and the timing anchor or urgency driver.
- If the source set includes more than one covered entity, relationship, communication type, or time period, list them explicitly before the analysis and address each one in turn.
- Keep the memo outcome-oriented and suitable for delivery as `hipaa-gap-analysis-memo.docx`, using conventional legal-memo organization rather than a checklist dump.
