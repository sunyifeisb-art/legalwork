---
name: scenario-02
task_id: data-privacy-cybersecurity/audit-privacy-policy-compliance/scenario-02
description: Privacy policy compliance audits for fintech apps fail when the agent reviews the policy as a standalone document rather than reconciling it against the data inventory, sharing agreement, breach log, and investor due-diligence memo for cross-document consistency gaps.
activates_for: [planner, solver, checker]
---

# Skill: Privacy Policy Compliance Audit — Issue Identification Memorandum for Fintech App

## 1. Subject-matter triage

- Confirm the governing privacy regime for the user base and the product footprint before analyzing drafting quality.
- Treat the privacy policy as one source, not the source of truth; reconcile it against the data inventory, sharing terms, breach history, and diligence materials.
- If the materials reflect more than one jurisdiction, user segment, product line, or processing activity, analyze each separately rather than collapsing them into a single pass.

## 2. Failure modes the skill is correcting

- The policy is reviewed in isolation, so the agent misses mismatches between disclosed practices and actual collection, use, sharing, retention, or security practices.
- The data inventory is not treated as the ground truth for what is actually processed, causing omissions in the issue list.
- The sharing agreement is not used to classify the third-party relationship, so the policy may misdescribe the counterparty as a vendor, service provider, controller, or other recipient.
- The breach log is ignored, so prior incidents that should inform disclosure, security, or notification analysis are omitted.
- The investor due-diligence memo is not used as a risk-spotting frame, so material issues flagged by investors are not elevated or tied to remediation.
- Findings are stated generically without tying each issue to the specific law, the specific document evidence, and the downstream compliance consequence.

## 3. Legal frameworks / domain conventions that apply

- Consumer privacy law for the relevant population: evaluate required disclosures of categories of personal information, sources, purposes, disclosures to third parties, rights mechanisms, and sensitive-data handling under the controlling statute and implementing regulations.
- General data protection law for the relevant population: evaluate lawful basis, retention, rights notices, contact information, complaint avenues, and cross-border transfer mechanics under the controlling regulation and local implementing rules.
- State breach-notification and security statutes: assess whether prior incidents reveal disclosure, notice, or security obligations that remain reflected or unreflected in the current policy.
- Financial-services privacy and security conventions: fintech data practices may trigger sector-specific notice, safeguarding, and records obligations in addition to general consumer privacy requirements.
- Third-party relationship characterization: verify whether the relationship is accurately described in the policy and in the contract terms, using the labels and concepts the source materials employ.
- Data inventory control principle: the inventory is the authoritative source for actual data categories, processing purposes, and recipient mapping; the policy must match it.

## 4. Analytical scaffolds

- Build the analysis by issue theme: disclosure accuracy, third-party sharing, breach response, consumer rights, security, retention, and cross-border processing where applicable.
- For each data category in the inventory, check whether the policy discloses it with accurate collection source, use purpose, and disclosure path.
- For each recipient or sharing channel in the source set, check whether the policy and the contract describe the same relationship and whether the consent/notice consequences align.
- For each prior incident in the breach log, assess whether the current policy and security description account for the incident type, the affected data, and the corrective actions.
- For each investor concern, determine whether the issue is still live, whether the policy or practices already addressed it, and whether it merits elevation in the memo.
- Use a uniform issue template for every entry:
  - controlling authority
  - gap description
  - evidence source
  - severity
  - business/regulatory consequence
  - recommended remediation
- When legal conclusions depend on a proposition, name the controlling authority by statute, regulation, rule, or recognized doctrine rather than stating the conclusion in shorthand.
- When the source materials provide a threshold, timeline, volume, or other measurable context, tie the issue to that context and then cross-reference the other document that makes the gap material.
- If multiple documents speak to the same practice, reconcile them directly and identify the inconsistency, not just the omission.

## 5. Vertical / structural / temporal relationships

- Read the documents vertically: policy language, operational practices, incident history, and diligence commentary should be compared against each other rather than summarized independently.
- Give priority to the most recent operational evidence where it conflicts with older drafting, and flag any lag between changed practices and unchanged policy language.
- If a prior breach or incident predates the current policy version, assess whether the policy now cures the issue or whether the history shows a persistent gap.
- If a diligence memo identifies a concern that is absent from the policy, treat the absence as potentially material even if no express violation is obvious.
- If the materials are internally inconsistent, identify which document appears operationally current and which appears stale, then explain why that matters for risk.

## 6. Output structure conventions

- Produce a memorandum, not a checklist: begin with a short executive summary, then organized issue sections, then concise recommendations.
- Define a severity scale once and use it consistently for every issue; every issue must carry one severity label from that scale.
- Organize the body by theme or issue cluster, and within each issue include the legal authority, the evidence source, the risk consequence, and the fix.
- Keep issue descriptions concrete and document-linked; avoid generic statements that do not identify the mismatch or omission.
- End with a Recommended Actions section that lists the next steps in imperative form, names the responsible role drawn from the materials when available, and anchors timing to the nearest regulatory, transactional, or operational milestone.
- Use the requested filename for the deliverable.
