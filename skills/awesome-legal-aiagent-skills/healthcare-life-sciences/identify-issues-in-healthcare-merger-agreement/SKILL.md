---
name: hls-identify-healthcare-merger-agreement-issues
task_id: healthcare-life-sciences/identify-issues-in-healthcare-merger-agreement
description: Reviews a healthcare merger agreement and supporting diligence materials to identify structural, regulatory, valuation, restrictive-covenant, reimbursement, earnout, indemnity, and operational issues that may affect closing, integration, and post-closing performance.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Healthcare Merger Agreement

## 1. Subject-matter triage
- Treat the merger agreement, disclosure schedules, diligence reports, regulatory materials, and financial exhibits as one integrated record.
- Separate issues that affect signing, closing, post-closing integration, and indemnity/earnout administration; do not mix timing buckets.
- Where the materials implicate multiple entities, facilities, practices, licenses, payors, or governing-law regimes, identify each affected item before analysis and avoid collapsing distinct risks into one generalized comment.

## 2. Failure modes the skill is correcting
- Regulatory filing analysis is omitted even though the deal documents may contain enough information to assess whether a pre-closing notification or similar filing obligation is triggered and what consequences may follow from noncompliance.
- Enrollment, licensing, and billing-transition obligations are not addressed even though physician-practice transactions can require closing covenants and timing coordination to avoid a gap in reimbursement or operating authority.
- Structural issues are described without tying them to the specific professional-entity, ownership, or control feature that creates the risk.
- Financial and operational discrepancies are noted without comparing them to the agreement’s stated assumptions, adjustment mechanics, or earnout architecture.
- Restrictive covenants are discussed without naming the governing law or the enforceability doctrine that controls the restraint.
- Healthcare-specific risk allocation is analyzed without checking whether the MAE definition properly allocates reimbursement, regulatory, and industry-wide change risk.
- Earnout, indemnity, and transition provisions are analyzed without asking who controls the relevant inputs, records, or approvals and what that means for the client.

## 3. Legal frameworks / domain conventions that apply
- Corporate practice of medicine doctrine: many jurisdictions restrict non-physician ownership, control, or direction of clinical decisions; if a transaction contemplates a conversion of a professional entity or other structural change, evaluate whether the structure preserves compliance or instead requires an alternative arrangement such as a management-services model or other compliant professional-entity structure.
- Financial statement discrepancy: if diligence materials produce a materially different performance or earnings figure from the transaction documents' stated assumptions, identify the discrepancy as a valuation issue and analyze whether the purchase-price mechanics, closing statement, or related adjustment provisions adequately address it.
- Pre-merger notification: where transaction value and the parties' size metrics exceed the applicable thresholds, assess whether pre-closing notification is required under the applicable merger-control regime and whether the deal timetable and covenants properly account for filing preparation, waiting-period clearance, and noncompliance exposure.
- Physician non-compete enforceability: some jurisdictions limit or prohibit physician restrictive covenants by statute or case law; identify the governing law, assess enforceability at a category level, and consider whether the agreement should rely on narrower confidentiality, non-solicit, non-disparagement, or similar protections instead.
- Earnout dispute resolution independence: if one party controls the operating or accounting inputs for earnout calculation, analyze whether the dispute-resolution mechanism includes a sufficiently independent decision-maker or review process, and flag the need for a neutral-accountant or similar framework where appropriate.
- Co-management or similar incentive arrangement: if the target has a hospital-facing management or incentive arrangement, evaluate whether the compensation structure is tied to referrals, volume, or other impermissible incentives and whether the arrangement is documented to fit within any applicable fraud-and-abuse safe-harbor framework.
- Healthcare-specific MAE carve-outs: identify whether the MAE definition includes category-level carve-outs for industry-wide reimbursement changes, broad regulatory changes, and other healthcare-sector risks, and assess whether any exclusions are overbroad or under-inclusive from a risk-allocation perspective.
- Enrollment transition requirements: if a physician practice, clinic, or similar provider is changing ownership or control, identify any change-of-ownership, enrollment, or revalidation steps that may be needed and evaluate whether the agreement addresses filing timing, interim billing authority, and responsibility for any transition gap.
- Ancillary liabilities: identify whether guarantees, leases, licenses, or similar obligations are retained, assigned, or released by the transaction structure and analyze any consent or novation issues.

## 4. Analytical scaffolds
1. Corporate structure: identify the entity conversion or ownership change at issue; explain how it interacts with professional-practice restrictions; evaluate whether a compliant alternative structure is needed.
2. Financial comparison: identify any discrepancy between diligence-based performance metrics and the agreement's assumptions; assess the likely effect on valuation or consideration mechanics; determine whether the documents contain an adequate adjustment process.
3. Regulatory filing: assess whether transaction size and party-size metrics trigger a pre-closing notification or similar filing requirement; check whether the agreement allocates filing responsibility, timing, and noncompliance risk.
4. Restrictive covenants: identify the governing law for any physician non-compete or similar restraint; analyze enforceability at a high level; consider alternative covenants if the restraint is doubtful.
5. Fraud-and-abuse: analyze any co-management, referral, incentive, or similar arrangement for compensation features that may create fraud-and-abuse risk.
6. MAE definition: identify missing or one-sided healthcare-specific carve-outs; explain the risk-allocation implications of each omission or inclusion.
7. Earnout: assess whether the calculation and dispute-resolution mechanics are sufficiently independent of one party's unilateral control; recommend a neutral review framework if needed.
8. Enrollment and billing transition: identify any change-of-ownership, enrollment, or revalidation obligations; evaluate whether the agreement addresses filing timing, interim operations, and responsibility for transition risk.
9. Ancillary liabilities: identify whether guarantees, leases, licenses, or similar obligations are retained, assigned, or released by the transaction structure and analyze any consent or novation issues.

## 5. Vertical / structural / temporal relationships
- For each issue, tie the document clause to the diligence fact pattern and then to the transaction stage it affects: signing, interim period, closing condition, post-closing covenant, or indemnity administration.
- If the issue turns on a threshold, deadline, notice period, waiting period, consent condition, or measurement period, state that anchor explicitly and compare it to the relevant clause language.
- Where one provision depends on another, cross-reference the interacting section rather than analyzing the provision in isolation.
- If multiple facilities, payer contracts, ownership layers, or management arrangements are involved, identify the affected subset and distinguish system-wide risk from asset-specific risk.

## 6. Output structure conventions
- Produce an issue-identification memo organized by severity using an explicit ordinal scale defined once at the top.
- For each issue, use a consistent row or subsection with: agreement section, issue summary, legal basis with controlling authority named, severity, scale/threshold context, cross-reference to related provisions or documents, downstream consequence, and recommended resolution.
- Every legal proposition must be supported by a named controlling authority, statute, regulation, rule, doctrine, or leading case as applicable; do not state legal conclusions in conclusory form.
- Every issue must be closed with a concrete consequence for the client and a specific fix or drafting direction.
- Include an explicit Recommended Actions section at the end with imperative action items, the responsible role, and a timing anchor tied to signing, closing, filing, or another transaction milestone.
- Recommendations should prioritize disclosure, covenant tightening, structure revision, filing planning, and transition controls where those remedies fit the issue.
- Use industry-conventional memo headings; do not mirror an internal checklist or rubric-specific section list.
