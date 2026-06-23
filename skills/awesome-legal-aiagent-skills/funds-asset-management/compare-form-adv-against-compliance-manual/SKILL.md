---
name: compare-form-adv-against-compliance-manual
task_id: funds-asset-management/compare-form-adv-against-compliance-manual
description: Compare a registered investment adviser's public disclosure against its compliance manual and supporting documents to produce a gap analysis memorandum organized by disclosure item, with severity ratings and remediation timelines.
activates_for: [planner, solver, checker]
---

# Skill: Compare Form ADV Against Compliance Manual

## 2. Failure modes the skill is correcting

- Treating the exercise as a high-level consistency check instead of a disclosure-to-controls comparison that must test what the firm says publicly against what its manuals and supporting records actually require or permit
- Assigning severity before testing materiality, operational significance, regulatory exposure, and whether the inconsistency is likely to require prompt amendment rather than ordinary-cycle remediation
- Collapsing distinct item-level issues into one narrative, which obscures whether the gap sits in business-description disclosure, fee disclosure, conflict disclosure, custody, proxy voting, personal trading, or delivery mechanics
- Missing that supporting documents may show actual practice differs from both the public brochure and the compliance manual
- Failing to distinguish a disclosure gap from a controls gap, even though both may coexist and require different fixes
- Overlooking timing mismatches, especially where a policy says one thing but the filing or manual requires earlier reporting, review, or delivery
- Missing special-treatment items when the underlying documents implicate soft dollars, proxy voting, custody, wrap-fee arrangements, side-by-side management, or supervised-person brochure-supplement delivery
- Stating a conclusion without tying it to the controlling rule or regulatory framework that makes the discrepancy consequential

## 3. Legal frameworks / domain conventions that apply

**Form ADV Part 2A item structure**
- Item 4: advisory business, services, minimum account size, and assets under management
- Item 5: fees and compensation, including fee schedules and termination provisions
- Item 6: performance-based fees and side-by-side management conflicts
- Item 11: code of ethics, personal trading, and client transaction conflicts
- Item 12: brokerage practices, including soft-dollar practices and related disclosure concepts
- Item 13: account review frequency
- Item 15: custody concepts, including qualified custodian handling, notice practices, and any audit or exam procedures described in the documents
- Item 17: proxy voting policy and related client-access disclosure concepts

**Regulatory and operational comparisons**
- Compare public disclosure to the compliance manual first, then test supporting documents for evidence of actual practice
- Treat a material mismatch between disclosure and controls as both a disclosure-risk issue and an implementation-risk issue
- If the firm relies on a limited custody theory, test whether the disclosure and procedures align with that theory and with the actual custodial mechanics described in the source set

**Soft-dollar disclosures**
- Compare the disclosed soft-dollar description with the internal description of actual practices
- Treat a material mismatch as a serious disclosure issue and assess whether it warrants prompt correction under the applicable brokerage-practices framework

**Proxy voting**
- If the adviser votes client securities, compare the public proxy-voting disclosure with the written policy and procedures
- Check whether the disclosure explains client access to voting information or records when the source documents describe that feature
- Use the proxy-voting rule framework referenced in the source materials or, if absent, the generally recognized advisory proxy-voting framework

**Custody**
- Compare custody-related disclosure with the internal policy for safeguarding client assets, qualified custodian use, notice practices, and any audit or examination procedures
- If the firm uses a fee-deduction-only custody theory, verify that both disclosure and procedures are consistent with that theory

**Personal trading and code of ethics**
- Compare the public disclosure and the code of ethics on reporting timelines for personal securities transactions and holdings
- Check whether the internal policy includes a current-holdings currency requirement if the disclosure contemplates holdings reporting
- If the CCO also manages portfolios, test whether the manual includes procedures that address the resulting oversight conflict

**Item 6 conflicts**
- Compare the disclosure of performance-based fee conflicts and side-by-side management conflicts with the internal controls described in the manual
- Verify that both the conflict description and mitigation procedures are addressed

**Wrap fee programs**
- If the firm participates in a wrap-fee program, confirm whether the relevant wrap-fee brochure disclosure or equivalent delivery step is present for the affected client population

**Part 2B and supervised persons**
- If supervised personnel or client-facing responsibilities have changed, compare the personnel records against any brochure-supplement delivery obligations described in the documents

**Valuation policies**
- If the source set addresses valuation, compare the public disclosure with the manual for consistency in methodology, governance, and escalation

## 4. Analytical scaffolds

1. Organize the memorandum by ADV Item number; do not blend multiple items into one pass where the documents permit item-specific analysis
2. For each item, compare the public disclosure, the compliance manual, and any supporting documents that bear on actual practice
3. Record every discrepancy, even if it is ultimately low severity, and distinguish disclosure gaps from control-design gaps
4. Assign each issue an explicit ordinal severity rating using one uniform scale stated once at the outset; apply the same scale to every issue
5. For each issue, state why the issue matters by linking it to the source-set scale or scope, the interacting document or provision, and the downstream consequence for the adviser or clients
6. Identify whether the issue appears to need prompt correction, an in-cycle policy update, or an ordinary annual ADV amendment cycle
7. When the source set implicates soft dollars, proxy voting, custody, personal trading, side-by-side management, wrap-fee delivery, or brochure-supplement delivery, apply the specific regulatory framework associated with that topic rather than treating it as a generic consistency problem
8. If a topic appears only once in the source set, state that it is a single-issue item and explain why no parallel comparison set exists
9. When multiple personnel, accounts, programs, or periods are relevant, enumerate them before analysis and then address them one by one
10. End each issue with a concise remediation view that names the needed change, the responsible role if discernible from the source documents, and the timing anchor implied by the regulatory cycle or internal deadline
11. Support every legal proposition with the controlling authority or recognized regulatory framework that makes the proposition meaningful; do not state a compliance conclusion without naming the rule, part, or doctrine that supports it
12. Build a final summary table that captures the issue, item number, severity, remediation action, and timing anchor

## 5. Vertical / structural / temporal relationships

The Form ADV is a filed external disclosure; the compliance manual is an internal operating document; supporting documents may evidence how the firm actually functions. A material inconsistency can therefore create both public-disclosure risk and internal-control risk. Temporal sequencing matters: a newly changed policy, personnel responsibility, or business practice may require immediate internal correction even if the public brochure update follows the next filing cycle. Where the source set shows a more restrictive internal rule than the brochure, that may be a controls issue; where the brochure is more restrictive than the manual, that may still indicate a disclosure mismatch if the operational record does not match the filing.

## 6. Output structure conventions

Single deliverable: a gap-analysis memorandum.

Use an industry-conventional memorandum shape, not a rubric-shaped checklist. Include:
- A short executive summary with the highest-priority issues, whether any require prompt correction, and the general update cadence that appears to apply
- A defined severity scale near the front of the memo
- An item-by-item analysis organized by ADV Item number, with each issue stated, analyzed, and concluded in a compact substructure
- A closing summary table listing the issue, related item, severity, remediation action, and timing anchor
- A final Recommended Actions section that uses imperative verbs, identifies the responsible role or function if the source documents indicate one, and ties each recommendation to a deadline or regulatory milestone when available

Keep the memo substantive and analytical; do not merely restate the source documents.
