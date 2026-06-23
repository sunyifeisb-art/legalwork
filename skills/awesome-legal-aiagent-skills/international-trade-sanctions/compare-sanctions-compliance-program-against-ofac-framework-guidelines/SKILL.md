---
name: its-compare-scp-against-ofac-framework
task_id: international-trade-sanctions/compare-sanctions-compliance-program-against-ofac-framework-guidelines
description: Produces a gap analysis memorandum organized by the principal pillars of the applicable sanctions compliance framework, identifying program deficiencies, assessing their severity, and providing remediation recommendations tailored to the organization’s risk profile.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis — Sanctions Compliance Program vs. Compliance Framework

## 1. Subject-matter triage

- Determine which program documents are in scope, then identify whether the organization is a single entity or a multi-entity group with affiliates, subsidiaries, or acquired businesses that must be assessed separately.
- Confirm the governing sanctions framework to be used as the comparison baseline and whether any supplemental local-law or regulator-specific guidance is implicated by the source set.
- If multiple legal entities, business lines, jurisdictions, or transaction channels are involved, analyze each one distinctly before synthesizing group-level gaps.

## 2. Failure modes the skill is correcting

- Comparing the program to a generic checklist instead of mapping each principal framework pillar to specific program provisions and identifying the exact gap, if any, under the controlling authority.
- Treating a high-level policy as sufficient when the documents do not show operational controls, escalation paths, ownership, testing, or evidence of implementation.
- Missing that the adequacy standard changes with the organization’s geographic, customer, product, and transaction risk profile.
- Overlooking governance defects, including weak reporting lines, inadequate independence, or dual-hat roles that impair escalation.
- Failing to distinguish between a missing document, a document that exists but is not operationalized, and a control that exists but is not demonstrably effective.
- Collapsing different entities or periods into one pass where the source documents require separate treatment.
- Stating a deficiency without closing it with the rule, the source-document interaction, the practical consequence, and a specific remediation path.

## 3. Legal frameworks / domain conventions that apply

- Use the OFAC Framework for Compliance Commitments as the organizing baseline, and anchor each gap to the relevant framework pillar or sub-principle.
- Risk assessment: evaluate whether the program contains a documented, auditable sanctions risk assessment that is current, searchable, and aligned to the organization’s actual geographic, customer, product, and transaction exposure.
- Internal controls: evaluate list-screening coverage, interdiction/escalation mechanics, alert triage, false-positive handling, documentation retention, and blocked/rejected transaction procedures.
- Governance and management commitment: evaluate whether responsibility is defined, senior leadership oversight is real, and the compliance function can escalate without business interference.
- Testing and auditing: evaluate whether independent testing exists, whether it is periodic and risk-based, and whether identified findings are tracked to closure.
- Training: evaluate whether training is role-based, timely, and refreshed at an interval consistent with risk and personnel turnover.
- M&A / integration: if the source set includes acquired or newly integrated businesses, evaluate whether they are brought into the compliance program within a reasonable period and covered by the parent’s controls.
- Cite the controlling authority for each legal proposition or framework statement relied on, using the framework, guidance, regulation, or other authority as identified in or supported by the source set.

## 4. Analytical scaffolds

1. Build a pillar-by-pillar comparison table: for each framework pillar, identify the source-document provision, classify it as adequate, partially adequate, or absent, and state the basis for that classification.
2. For each gap, state the governing requirement, the existing provision or omission, the resulting exposure, and the recommended remediation.
3. Tie each deficiency to the organization’s actual risk footprint: where the documents show a narrower scope than the business footprint, identify the mismatch expressly.
4. Where the source set contains multiple entities or business lines, first list them explicitly and then analyze each separately before giving a consolidated view.
5. For any control relating to screening, escalation, blocking, or rejecting activity, verify whether the documents specify ownership, timing, documentation, and reporting obligations.
6. For any training, testing, or audit provision, verify whether the documents specify frequency, scope, population covered, and follow-up on findings.
7. Distinguish a policy gap from an implementation gap; if the control exists on paper but not in evidence, say so and explain why that matters.
8. Assign each issue a severity rating using a single ordinal scale defined once at the outset, and use that scale consistently across the memo.
9. Close every issue with: the relevant quantitative or scope anchor from the source documents, the related document or clause interaction, and the downstream legal, operational, or regulatory consequence.
10. End with a concrete action plan that assigns an owner and timing to each recommendation.

## 5. Vertical / structural / temporal relationships

- Analyze control coverage vertically from policy to procedure to evidence of operation; a higher-level policy does not cure the absence of implementing procedures or records.
- Treat governance, testing, training, and remediation as time-sensitive and sequential: identify whether the program creates a cadence for review, escalation, completion, and follow-up.
- Where a source document references another document, policy, schedule, or appendix, assess the relationship explicitly and note whether the incorporated material fills or leaves a gap.
- If the compliance program changed over time, evaluate the pre-change and post-change state separately when the source set supports that distinction.
- If an acquisition or integration occurred, assess pre-integration coverage, post-integration onboarding, and the transition period as separate temporal states.

## 6. Output structure conventions

- Produce a memorandum titled as a sanctions compliance gap analysis against the OFAC framework.
- Start with a short executive summary that identifies the overall risk posture and the highest-severity gaps.
- Define the severity scale once at the top, then apply it uniformly to every issue.
- Include a summary table or matrix by pillar, with columns for pillar, current coverage, gap, severity, and recommended remediation.
- For each issue entry, use an issue-block structure: framework requirement, source-document coverage, gap analysis, severity, consequence, and recommendation.
- When multiple entities, lines of business, or periods are in scope, include separate rows or subsections for each before any consolidated conclusion.
- End with a Recommended Actions section that lists imperative next steps, the responsible role, and a timing anchor tied to the document set or the next compliance milestone.
- Use clear, industry-conventional headings rather than the source rubric’s internal section labels.
- Deliver the memo as the named Word file: `ofac-gap-analysis-memorandum.docx`.
