---
name: its-identify-issues-export-license-application
task_id: international-trade-sanctions/identify-issues-in-export-license-application
description: Produces a comprehensive issues memorandum for a draft export license application that compares stated technical parameters against source materials, evaluates screening and denial-risk considerations for restricted-party transactions, reviews personnel and publication relationships for diversion indicators, assesses remote-access and technical-data-transfer pathways, and checks whether current export-control parameters have been applied.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in an Export License Application

## 1. Subject-matter triage

- Treat the package as an export-control review of a draft license application, not a merits memo on the business deal.
- Map the application against the source set in layers: item description, technical specs, end user / end use, routing and intermediaries, personnel access, technical-data handling, and contemporaneous internal communications.
- If more than one end user, facility, technical configuration, or shipment scenario appears, enumerate each separately before analysis and avoid collapsing them into one representative review.
- If the source set contains only one configuration or one transaction path, state that explicitly and explain why no separate scenario split is needed.

## 2. Failure modes the skill is correcting

- Reviewing the narrative without checking each technical parameter against the product datasheet or equivalent source material, which misses misstatement risk.
- Treating a restricted-party transaction as a generic license application instead of analyzing the applicable heightened-review or presumption-of-denial framework.
- Missing diversion indicators created by senior technical personnel ties, co-publications, or concurrent affiliations.
- Overlooking remote diagnostics, software updates, or technical-data transmission paths that can function as deemed-export channels.
- Using stale semiconductor-control parameters instead of the current control thresholds and license triggers.
- Ignoring internal communications that show awareness of omitted disqualifying facts.
- Ending at issue description without stating severity, source-text support, cross-document interaction, and practical consequence.
- Giving recommendations that are not tied to a responsible role and timing anchor.

## 3. Legal frameworks / domain conventions that apply

- False or misleading statements in an export license application can create export-control exposure even when the mismatch is unintended; compare every stated technical parameter against the underlying source document and flag any discrepancy as a disclosure and accuracy issue.
- Where the transaction touches a restricted party, apply the relevant denial or heightened-review framework under the governing export-control regime and assess whether the application affirmatively addresses legitimate end use, diversion risk, and prohibited connections.
- Senior technical personnel ties to restricted entities, including prior employment, co-publications, or concurrent affiliations, are classic diversion indicators that should be surfaced and addressed in the application record.
- Co-authored publications with a party of concern may evidence collaboration or access pathways relevant to diversion analysis; review publication databases and treat documented co-publication relationships as material facts.
- Remote diagnostics, software updates, and technical-data transmissions can create controlled-information transfer issues where persons located in controlled jurisdictions may access the data; analyze the access pathway as a separate compliance question.
- Semiconductor exports must be assessed under current control parameters, not the thresholds in effect when an earlier draft was prepared; any regulatory update that changes classification or licensing status must be noted.
- Internal emails or draft materials showing awareness of an omitted disqualifying fact can convert a disclosure gap into a knowing-omission risk.
- Cite the governing authority for each legal proposition relied on, using the controlling statute, regulation, rule, or other identified authority from the source set or standard export-control authorities as applicable.

## 4. Analytical scaffolds

1. Technical-spec comparison
   - For each stated parameter in the application, compare it to the source document.
   - Record the application representation, the accurate source information, the discrepancy, the severity, and the remedial correction.
   - Note the downstream consequence: classification risk, licensing risk, or disclosure risk.

2. Restricted-party and denial-risk analysis
   - Identify each restricted party implicated by the transaction chain.
   - State the applicable review standard and whether the application supplies facts that satisfy it.
   - Cross-reference the end use, routing, and any intermediary relationships that bear on diversion or denial risk.
   - Close with the practical effect on licensability, processing risk, or need for supplemental disclosures.

3. Personnel and publication review
   - Review senior technical personnel for prior employment, co-affiliations, and co-publications with entities of concern.
   - Treat each documented tie as a separate issue if it involves a distinct person or entity relationship.
   - Explain why the tie matters for technology transfer or diversion analysis and what corrective disclosure or mitigation would be needed.

4. Remote-access and data-transfer analysis
   - Identify any remote access, diagnostics, software support, update channel, cloud link, or document exchange.
   - Assess whether controlled technical data could be accessed by persons in controlled jurisdictions.
   - Cross-reference the support arrangement, access controls, and any confidentiality or segmentation measures.
   - State the operational or authorization consequence if the channel is treated as a controlled transfer.

5. Current-control-parameter check
   - Apply the present export-control thresholds to the item’s capabilities and intended use.
   - Compare them to any older description, draft, or legacy assumption in the package.
   - Flag any change in classification, licensing requirement, or eligibility that flows from updated parameters.

6. Internal-knowledge review
   - Read internal communications for awareness of omitted facts or inconsistent framing.
   - Identify whether the omission appears inadvertent or knowing.
   - Tie the finding to the disclosure risk and the need for correction before submission.

7. Issue-closing requirements
   - Each issue should identify the relevant source figure or threshold, the other document or clause it interacts with, and the consequence for the client.
   - If the source set does not provide a number or threshold, state that the comparison is qualitative and explain the practical materiality instead of inventing arithmetic.
   - Do not leave an issue as a bare observation; pair it with a concrete application fix.

8. Severity calibration
   - Use a uniform ordinal severity scale defined once at the top of the memo.
   - Calibrate severity by whether the defect is fatal to filing as submitted, likely to require supplemental disclosure, or a lower-grade drafting correction.

## 5. Vertical / structural / temporal relationships

- Track how the item description, end use statement, technical appendix, and support arrangements fit together; a mismatch between any two is a material issue even if each looks acceptable in isolation.
- Distinguish the current application from earlier drafts or prior regulatory baselines; temporal mismatch itself is an issue when the package relies on outdated control assumptions.
- Treat personnel, publication, and access issues as vertical relationships that connect the applicant, the end user, and the technical-data pathway.
- Where a source document and an internal email conflict, prioritize the conflict itself as an issue and explain whether the inconsistency affects disclosure completeness or credibility.
- If a single fact pattern gives rise to both classification and denial-risk concerns, analyze both, but keep them as separate issue entries.

## 6. Output structure conventions

- Produce a concise issues memorandum organized by risk category, with a short executive summary up front.
- Define the severity scale once near the top, then apply it consistently to every issue entry.
- For each issue, include:
  - severity
  - issue headline
  - application representation
  - source-document comparison
  - gap or risk identified
  - governing authority
  - cross-reference to the interacting document or fact
  - consequence for filing, licensing, or operations
  - recommended correction
- Use plain, memo-style prose; do not mirror the source package section-by-section unless that is the clearest way to present the defect.
- End with an explicit Recommended Actions block that assigns each action to a responsible role and ties it to a filing or regulatory milestone.
- If the task requires a document deliverable, ensure the memo is complete, internally consistent, and ready to be saved as the named output file.
