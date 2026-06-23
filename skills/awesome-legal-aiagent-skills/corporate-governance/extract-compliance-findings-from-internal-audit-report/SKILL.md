---
name: extract-compliance-findings-from-internal-audit-report
task_id: corporate-governance/extract-compliance-findings-from-internal-audit-report
description: Agents summarize audit findings while also assessing audit independence, limitations in transaction-monitoring testing, sanctions-disclosure considerations, customer classification risks, and the basis for any disagreement over management severity adjustments.
activates_for: [planner, solver, checker]
---

# Skill: Compliance Findings Memorandum from a BSA/AML Internal Audit Record

## 2. Failure modes the skill is correcting

- Baseline summarizes findings without first testing whether the audit process itself was pressured, filtered, or independently supported.
- Baseline treats alert-based testing as if it measured overall monitoring effectiveness, missing the untested population that never generated alerts.
- Baseline converts delayed suspicious-activity reporting into a routine issue, instead of recognizing when the delay signals broader program failure.
- Baseline omits sanctions and customer-classification exposure when the source set flags counterparties, jurisdictions, or digital-asset-related customers.
- Baseline accepts severity adjustments without showing the board both sides of any disagreement.

## 3. Legal frameworks / domain conventions that apply

- **Audit independence and documentation integrity:** Internal audit findings should not be suppressed, re-rated, or reframed because of management preference unless the file contains an auditable basis. Where the record shows excluded or downgraded issues, the memo must identify the independence concern and the effect on reliability of the audit conclusion.
- **BSA/AML monitoring limits:** Transaction-monitoring tests that review only alerted activity do not establish the rate of missed alerts or false negatives. Alert-only testing is inherently incomplete unless paired with independent model validation or other population-based testing.
- **AML model validation:** Where an AML monitoring model exists, independent validation is a separate control expectation and a separate gap if absent, incomplete, or stale.
- **SAR timeliness and escalation:** Suspicious activity reporting timelines are set by governing BSA/AML requirements and should be analyzed as a timeliness failure when the delay is material, not merely as a documentation issue.
- **Structuring and referral risk:** Patterns consistent with cash-reporting evasion raise potential criminal exposure beyond the compliance finding and may warrant a referral analysis.
- **Sanctions exposure and voluntary disclosure:** Counterparty, jurisdiction, or name-screening hits should be evaluated under the applicable sanctions regime and any voluntary self-disclosure framework before deciding whether the issue is closed as an ordinary audit matter.
- **MSB / digital-asset customer classification:** Customers that function as money transmitters or digital-asset businesses may carry enhanced BSA obligations, registration questions, and related due-diligence risk if not properly identified.
- **Severity disputes:** If management seeks a downgrade and audit rejects it, the memo should present the audit rationale and management’s position side by side so the board can evaluate the dispute independently.

## 4. Analytical scaffolds

- **Start with audit integrity:** Identify whether any finding was excluded, softened, or conditionally retained; state what support the file gives for that treatment and what the downstream effect is on the overall audit confidence.
- **Enumerate before analysis:** If the record contains multiple findings, management comments, or counterparties, list them first in a clean sequence and then analyze each one in the same order. If only one item is in scope for a category, say so expressly.
- **Finding-by-finding extraction:** For each retained finding, capture the issue, the source basis, the severity level, management’s response, any severity dispute, and the additional legal or regulatory exposure beyond the program defect.
- **Use a uniform ordinal severity scale:** Define the scale once at the top of the memo and apply it consistently across all findings.
- **Close each issue fully:** For each issue, tie it to the relevant scale or magnitude in the record, cross-reference any other document or section that affects it, and state the practical consequence for the bank.
- **Treat alert-only testing as limited:** If the audit sampled only alerted transactions, expressly state that the false-negative population cannot be measured from that testing alone and recommend forward-looking validation.
- **Separate sanctions and MSB analysis:** Do not bury sanctions or customer-classification issues inside a generic compliance paragraph; analyze them as distinct risk categories with their own legal consequences.

## 5. Vertical / structural / temporal relationships

- Distinguish between the audit period, the management response period, any later remediation plan, and any supervisory correspondence so the board can see whether the facts changed over time.
- Distinguish the underlying control failure from the response failure: a late filing, incomplete review, or poor escalation process may be a distinct issue from the original transaction pattern.
- Distinguish enterprise-wide control weakness from isolated case-level findings; if the record suggests a programmatic gap, say so directly.
- If the record contains a supervisory letter or external correspondence, treat it as a later-stage signal that may confirm or sharpen the audit concern, not as a substitute for the audit analysis.

## 6. Output structure conventions

- Write a privileged board-level compliance findings memorandum.
- Use conventional memo headings rather than a rubric-shaped checklist.
- Open with an **Audit Integrity Assessment** before the substantive findings.
- Include a **Findings Summary** section that presents each finding in a compact table or matrix with: finding description, severity, management response, dispute status, and legal/regulatory exposure.
- Include a separate **Heightened Legal Risks** section for sanctions, criminal referral, SAR timeliness, and customer-classification issues.
- Include a distinct **Model Validation Gap** discussion if the file does not show independent validation of the AML monitoring system.
- End with a **Recommended Board Actions** section using imperative recommendations tied to the responsible role and the fastest source-based timing anchor available.
- Where the source set identifies controlling law, regulation, or supervisory authority, cite it by name and section or part in the memo text.
- Keep the memo privilege-protective, factual, and decision-useful; do not overstate conclusions beyond the source record.
