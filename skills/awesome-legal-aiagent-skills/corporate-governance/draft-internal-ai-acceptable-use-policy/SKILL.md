---
name: draft-internal-ai-acceptable-use-policy
task_id: corporate-governance/draft-internal-ai-acceptable-use-policy
description: Agents produce an AI acceptable use policy that addresses overlapping legal, labor, privacy, data handling, and insurance considerations and surfaces unresolved items as open action items in the accompanying executive memo.
activates_for: [planner, solver, checker]
---

# Skill: Internal AI Acceptable Use Policy

## 1. Subject-matter triage (only if applicable)

- Inventory every AI tool, pilot, plugin, or embedded feature referenced in the source documents before drafting policy text.
- Separate tools used for employee-facing work, patient-facing work, and decision-support work, because the applicable controls differ by use case.
- Identify whether any tool touches sensitive health information, biometric data, employee data, or data subject to residency constraints.
- Identify whether any tool affects hiring, scheduling, discipline, access, or other consequential decisions.
- Identify whether any affected workforce is covered by a collective bargaining agreement or similar notice regime.
- Treat the policy as an internal governance document first; the executive memo is secondary and should track unresolved items, not replace policy drafting.
- If the source set contains only one tool or one use case, state that expressly and analyze that single item without implying broader coverage.

## 2. Failure modes the skill is correcting

- Drafts use generic “follow the law” language without turning each applicable framework into a concrete workflow, owner, and escalation path.
- Drafts omit a usable tool inventory and instead speak in platform-level generalities that do not tell employees what is approved, restricted, or prohibited.
- Drafts fail to distinguish patient data controls, employee-data controls, and biometric-data controls, even though the required permissions and retention rules differ.
- Drafts ignore insurance conditions that function as prerequisites to coverage and leave those conditions buried in commercial attachments rather than in governance language.
- Drafts overlook collective bargaining sequencing and rollout timing for tools affecting bargaining-unit employees.
- Drafts describe prior incidents as background only, rather than converting the incident into a specific control, approval gate, or escalation step.
- Executive summaries list issues without prioritizing them, naming a responsible party, or giving a practical timing anchor for follow-up.
- Drafts state conclusions about compliance without naming the governing authority or the policy basis that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply

- **Healthcare privacy and confidentiality:** Where AI tools process protected health information or other sensitive health records, align the policy with HIPAA Privacy Rule and Security Rule concepts, including permitted use, minimum necessary handling, access controls, and authorization where general treatment consent is insufficient.
- **State privacy and biometric laws:** If a tool processes voiceprints, facial geometry, or comparable biometric identifiers, account for applicable biometric consent, retention, notice, and destruction obligations under governing state law.
- **Employment and workplace AI rules:** If a tool is used for screening, evaluation, scheduling, discipline, productivity scoring, or other employment decisions, address applicable automated decision-making, bias, notice, and human-review requirements under the relevant state or local framework.
- **Collective bargaining and labor law:** Where bargaining-unit employees are affected, sequence policy rollout to satisfy contractual notice obligations and preserve any bargaining or effects-bargaining process required by the governing labor framework.
- **Data residency and transfer constraints:** If vendor terms restrict processing location, the policy must specify approved jurisdictions and prohibit processing in non-approved locations.
- **Insurance conditions precedent:** If cyber, E&O, or similar coverage includes AI-related conditions, the policy should mirror those conditions to the extent feasible and identify any unmet condition as an open item.
- **Incident-driven controls:** A prior adverse pilot or deployment should be translated into operational safeguards, approval thresholds, or prohibited uses tied to the failure mode identified in the record.
- **General governance conventions:** A usable internal policy should define scope, approvals, acceptable use, prohibited use, monitoring, escalation, recordkeeping, training, and enforcement in plain operational terms.

## 4. Analytical scaffolds

- **Tool inventory:** Build a table or equivalent inventory listing each tool, its business purpose, user group, data types involved, whether it is patient-facing or employee-facing, and whether it is subject to special approval or prohibition.
- **Use-case classification:** For each tool, classify the intended use as approved, restricted, prohibited, or pending review, and state the reason tied to the governing framework or source-document facts.
- **Obligation matrix:** For each applicable framework, identify the trigger, required control, responsible role, and where the control should live in the policy.
- **Consent verification workflow:** Draft a step-by-step verification process requiring the business owner to confirm that the relevant consent, authorization, or notice covers the specific AI use before deployment or data sharing.
- **Human oversight workflow:** For any tool that may affect clinical, employment, or other consequential decisions, require human review, escalation criteria, and override authority.
- **Insurance alignment check:** Compare policy controls against each cited insurance condition and identify any mismatch that must be resolved outside the policy text.
- **Incident-to-control translation:** Convert each prior failure mode into a concrete safeguard, approval requirement, monitoring obligation, or prohibited practice.
- **Open-item register for the memo:** Capture every unresolved issue with the responsible party, practical deadline, and the policy section it affects.

## 5. Vertical / structural / temporal relationships (only if applicable)

- **Rollout sequencing:** If labor notice or other advance notice applies, the policy should not be presented as effective for covered employees until the required notice window has run.
- **Approval interdependency:** If a tool requires vendor diligence, privacy review, or insurance sign-off before use, the policy should make that precondition explicit.
- **Hierarchy of controls:** Use a layered structure: baseline rule, tool-specific exception, required review, and escalation path.
- **Temporal sequencing:** State when review must occur before first use, on renewal, after a material change, and after any incident.
- **Cross-document consistency:** Ensure the policy’s definitions, exceptions, and approvals are consistent with the executive summary memo so unresolved items are not inadvertently treated as resolved.

## 6. Output structure conventions

- **AI Acceptable Use Policy document:** Use a conventional policy format with an introductory purpose statement, scope, definitions, approved and prohibited uses, review and approval procedures, data handling rules, privacy and consent requirements, human oversight, incident reporting, training, recordkeeping, enforcement, and amendment mechanics.
- **Policy drafting style:** Write as an operative internal policy, not as commentary about what the policy should say. Use clear mandates, prohibitions, and conditional permissions.
- **Executive summary memo:** Address the memo to the General Counsel or equivalent legal lead; organize open items by urgency; identify the responsible role for each item; include a short recommendation and the policy section affected; and make clear which items block launch, which can proceed with safeguards, and which need follow-up.
- **Priority handling:** Draft the policy first, then the memo after the policy text is complete, and confirm both files contain operative content rather than summaries of missing content.
- **Authority support:** For every legal or compliance proposition stated in the policy or memo, tie it to the controlling statute, regulation, contract provision, or governance source reflected in the materials or generally accepted in the domain.
- **Recommended actions block:** End the memo with a concise action list using imperative verbs, responsible roles, and a deadline or milestone for each item.
