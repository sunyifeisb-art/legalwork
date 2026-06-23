---
name: scenario-01
task_id: data-privacy-cybersecurity/audit-privacy-policy-compliance/scenario-01
description: Privacy policy compliance audits for fintech apps fail when the agent reviews the policy as a standalone document rather than reconciling it against the data inventory, sharing agreement, breach log, and investor due-diligence memo for cross-document consistency gaps.
activates_for: [planner, solver, checker]
---

# Skill: Privacy Policy Compliance Audit — Issue Identification Memorandum for Fintech App

## 2. Failure modes the skill is correcting

- The agent treats the privacy policy as self-contained and misses that the authoritative facts are spread across the data inventory, sharing agreement, breach log, and investor counsel email.
- The agent reports only disclosure defects and fails to tie each defect to the governing privacy, security, breach-notification, or fintech-specific requirement that makes the defect legally material.
- The agent overlooks that the inventory is the ground truth for actual collection, processing, retention, and sharing, so the memo never tests whether policy language matches operations.
- The agent fails to reconcile the sharing arrangement with the policy’s third-party description, leaving misclassification risk unresolved.
- The agent ignores prior incidents in the breach log, missing evidence of recurring control gaps, response failures, or inconsistent current disclosures.
- The agent treats investor counsel’s questions as background noise instead of a signal for likely diligence-sensitive compliance gaps.
- The agent writes generalized observations without a severity ranking, a concrete cross-document citation trail, and a practical remediation path.
- The agent concludes with diagnosis only, leaving the reader without a prioritized action list.

## 3. Legal frameworks / domain conventions that apply

- Apply the consumer privacy statute or privacy regulations governing the user population, including required notice content on categories collected, sources, purposes, sharing, retention, opt-out rights, sensitive data handling, and contact mechanisms.
- Apply the data-protection regime governing the relevant jurisdiction, including lawful basis, data subject rights, retention limits, notice obligations, and cross-border transfer disclosures where relevant.
- Apply breach-notification and security-program requirements implicated by the breach log, including duties to assess, document, notify, and remediate incidents.
- Apply fintech-specific privacy and information-security expectations that may layer onto general consumer privacy law for financial data and payment-related processing.
- Apply the controlling authority for any legal proposition stated in the memo; cite the statute, regulation, rule, or other recognized authority by name and section or part.
- Treat the data inventory as the factual baseline for what is collected, used, retained, and shared; treat the privacy policy as the public-facing disclosure against that baseline.
- Characterize the sharing relationship using the contractual terms reflected in the agreement and then test whether the policy’s disclosure accurately matches that characterization.

## 4. Analytical scaffolds

- Start by enumerating the discrete issue families implicated by the source set: disclosure accuracy, data collection alignment, retention, third-party sharing, rights notice, security, incident response, and investor-flagged gaps.
- For each issue family, reconcile the documents in this order: inventory first, then policy, then sharing agreement, then breach log, then investor counsel email.
- Use the inventory to identify what data categories, sources, purposes, recipients, and retention periods actually exist; then compare each to what the policy says and note any omission, overstatement, or mismatch.
- Use the sharing agreement to determine whether the counterparty is functioning as a service provider, processor, joint controller, independent recipient, broker, or other third party; then test the policy’s terminology and disclosures against that role.
- Use the breach log to determine whether prior incidents show unsupported security claims, incomplete incident handling, inaccurate historical disclosures, or an unresolved pattern of similar failures.
- Use the investor counsel email to identify diligence questions or flagged concerns that may indicate material compliance weakness even if the policy is technically facially compliant.
- For every issue, record the controlling authority, the exact mismatch, the source documents that prove it, the severity, and the practical fix.
- Keep each issue closed: cite the legal rule, identify the documentary conflict, and state the operational or regulatory consequence for the client.
- If the source set reveals only one instance of a given issue family, say so expressly; if there are multiple instances or multiple periods/incidents, separate them and analyze each on its own terms.
- Use ordinal severity consistently and define the scale once at the outset of the memo.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Treat earlier incidents in the breach log as temporally relevant to later policy language: a later disclosure can still be inaccurate if it omits a pattern established by prior events.
- Treat the sharing agreement as vertically subordinate to the policy for public disclosure purposes, but superior on operational facts about the actual relationship and data flow.
- Treat investor counsel’s comments as downstream diligence evidence, not as governing law, but do not ignore them where they reveal inconsistencies the legal review should have surfaced.
- Where the documents span different dates, note whether the policy was current at the time of the incident or whether a later revision may have attempted to cure the gap.
- Where a single issue appears in multiple documents, identify the highest-authority factual source and the most legally salient contradiction rather than repeating the same point in different wording.

## 6. Output structure conventions

- Produce an issues memorandum, not a contract, not a redline, and not a generic summary.
- Open with a brief executive summary that states the overall compliance posture, the top risks, and the most urgent remediation themes.
- Define the severity scale once near the top and apply it uniformly to every issue entry.
- Organize the body by issue theme using conventional headings such as disclosure accuracy, sharing and transfer disclosures, incident response and security, rights and notices, and investor diligence concerns.
- For each issue, include in a compact, repeatable format:
  - Severity
  - Controlling authority
  - Issue summary
  - Source documents showing the mismatch
  - Why the issue matters
  - Recommended fix
- Make each issue entry self-contained and specific; do not rely on cross-references that force the reader to reconstruct the problem.
- Include a final Recommended Actions block with imperative steps, the responsible role where inferable from the source documents, and a timing anchor tied to the next compliance or transaction milestone.
- Use the filename specified in the task instructions for the deliverable.
