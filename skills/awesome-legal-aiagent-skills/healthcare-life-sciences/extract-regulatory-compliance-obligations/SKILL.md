---
name: hls-extract-regulatory-compliance-obligations-telehealth
task_id: healthcare-life-sciences/extract-regulatory-compliance-obligations
description: Produces a structured regulatory obligations register and narrative memo for a digital health telehealth platform launch, covering data-use agreements, clinical decision support analysis, telehealth prescribing rules, biometric privacy laws, remote monitoring billing requirements, and open vendor audit findings.
activates_for: [planner, solver, checker]
---

# Skill: Extract Regulatory Compliance Obligations for Telehealth Platform Launch

## 1. Subject-matter triage (only if applicable)

- First map the platform launch by state, product feature, data flow, and patient/user population before evaluating obligations.
- Identify every jurisdiction implicated by patient location, device use, prescribing activity, billing, or health-data collection.
- Treat vendor access to protected health information, wearable-device inputs, and any consumer-health-data processing as distinct compliance lanes, even if they overlap operationally.
- If the source set does not support a category, state that it is not evidenced rather than inferring compliance.

## 2. Failure modes the skill is correcting

- The obligations matrix is omitted, under-specified, or not organized as a usable register for remediation tracking.
- Open vendor audit findings are summarized generally instead of extracted as discrete obligations with owners, status, and deadlines.
- Features that may qualify as clinical decision support are not tested against the applicable exemption framework feature-by-feature.
- Telehealth prescribing is treated as a single rule set instead of being checked by controlled-substance scenario and current rule source.
- State privacy obligations are collapsed into a generic health-privacy discussion, missing state-specific biometric and consumer-health-data triggers.
- Remote monitoring billing and documentation obligations are not tied to the billing code, monitoring period, consent, and recordkeeping requirements that create exposure.
- Device reporting obligations are not separately tracked where wearable devices may be regulated medical devices.
- The memo states conclusions without naming the governing authority or rule supporting each conclusion.
- The analysis stops at issue identification and does not convert findings into concrete remediation actions with timing.

## 3. Legal frameworks / domain conventions that apply

- Data-use and business associate agreements: confirm whether each vendor with access to protected health information has an executed agreement under the applicable privacy framework, and treat a missing agreement for a critical vendor as a high-severity pre-launch issue.
- Clinical decision support: apply the governing medical-device exemption test to each platform feature that recommends, ranks, or interprets clinical information; if any element of the exemption is not met, treat the feature as potentially subject to device oversight.
- Telehealth prescribing: evaluate controlled-substance prescribing under the current federal and state telehealth rules, including any temporary or transitional exceptions that may have changed before launch.
- Biometric privacy: assess whether wearable-device data or similar identifiers trigger consent, notice, retention, disclosure, and private-enforcement exposure under applicable state biometric laws.
- Consumer health data privacy: identify each state with patients or data subjects and check whether a state consumer-health-data regime applies beyond general health-privacy rules.
- Remote patient monitoring billing: verify the coding, minimum monitoring, consent, and documentation requirements tied to any remote-monitoring claims; treat unsupported billing as reimbursement and fraud-and-abuse exposure.
- Medical-device reporting: if a wearable or connected device is regulated as a medical device, track adverse-event and malfunction reporting duties under the applicable reporting regime.
- Administrative and recordkeeping rules: where source documents impose audit, notice, documentation, escalation, or retention requirements, treat them as independent obligations even if they arise from the same program.
- Governing authority: cite the controlling statute, regulation, guidance, or rule for each conclusion instead of using generic labels.

## 4. Analytical scaffolds

1. Build an inventory of all vendors, processors, service providers, and operational partners with access to protected health information or analogous regulated data.
2. For each inventory item, determine whether the required agreement exists, whether it covers the relevant use case, and whether any exception or carve-out is documented.
3. Break the platform into discrete features that could constitute clinical decision support, prescribing, biometric collection, remote monitoring, or device reporting, and test each feature separately.
4. Enumerate every controlled-substance prescribing scenario by product flow, patient setting, and jurisdiction before assessing the governing rule set.
5. Enumerate each state implicated by patient location, user location, device use, or biometric collection, then assess privacy triggers state by state.
6. Extract each open audit finding as a separate obligation, not as a paragraph inside a narrative summary.
7. For every obligation, record the source, current status, risk severity, responsible owner, remediation deadline, and why the obligation matters operationally or legally.
8. Tie each issue to the downstream consequence of noncompliance, including launch delay, enforcement risk, reimbursement risk, device-reporting exposure, or private litigation exposure.
9. Use an ordinal severity scale consistently across all obligations and define the scale once at the outset.
10. Where the source documents identify timing, use that timing; where they do not, assign a relative urgency linked to the launch milestone.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Organize the analysis by regulatory category first, then by jurisdiction or business process where a category spans multiple states or workflows.
- Separate pre-launch remediation items from post-launch monitoring items so the platform team can distinguish launch blockers from ongoing controls.
- If multiple states or product lines are involved, create one entry per state or scenario rather than aggregating into a single row.
- Where one obligation depends on another, state the dependency explicitly so sequencing is clear in the remediation plan.
- If a feature depends on vendor readiness, note the vendor control as a prerequisite to platform go-live.
- For open findings, preserve their original operational sequence only if the source documents make that sequence material; otherwise rank them by severity and launch impact.

## 6. Output structure conventions

- Produce two deliverables: a narrative regulatory obligations memo and a structured obligations matrix.
- The memo should be organized by regulatory category and should read as an advisory analysis, not a checklist.
- Each obligation discussed in the memo should be traceable to a corresponding matrix row.
- Use an ordinal severity field for every obligation and define the scale once near the beginning of the memo or matrix.
- The matrix should include, at minimum, source or authority, obligation description, status, severity, owner, deadline, and remediation note.
- Keep obligations granular enough that a reviewer can assign work without re-reading the underlying source set.
- End the memo with a concise Recommended Actions section that assigns each action to a role and timing anchor tied to launch or a stated deadline.
- If a conclusion depends on a legal rule, cite the governing authority by name and section or part in the memo and matrix notes.
- Before finalizing, confirm that the matrix captures every identified obligation and that the memo does not rely on uncited legal conclusions.
