---
name: draft-response-to-government-information-request
task_id: corporate-governance/draft-response-to-government-information-request
description: Agents review a response draft to a government civil investigative demand by independently checking privilege claims, distinguishing full withholding from partial redaction for mixed-purpose documents, spotting internal inconsistencies in the privilege log or production counts, and identifying production gaps or other issues that should be corrected proactively.
activates_for: [planner, solver, checker]
---

# Skill: Review Memorandum for Civil Investigative Demand Response — Privilege Log and Production Gap Analysis

## 1. Subject-matter triage
- Treat the source set as a CID-response package: cover letter, draft production index, privilege log, deficiency letter or analogous government correspondence, and supporting documents.
- First determine whether the package reflects one dispute or multiple independent issue families: privilege basis, scope of production, log completeness, count reconciliation, and response posture.
- If multiple documents or log entries are in play, enumerate the discrete items before analysis; do not collapse distinct documents, custodians, or withholding reasons into one representative review.
- If the materials show only one disputed document or one issue family, say so expressly and analyze that single item on its own terms.

## 2. Failure modes the skill is correcting
- The review simply tracks the government’s objections and misses over-withheld documents that should be produced or redacted in part.
- The review treats every mixed-purpose document as fully privileged instead of separating legal advice content from nonprotected business content.
- The review accepts privilege descriptions at face value even when they are too generic to support the claim.
- The review overlooks mismatches between the stated withheld-document totals and the actual log entries or production index.
- The review fails to identify gaps, duplicates, or inconsistent treatment across the response package.
- The review stops at diagnosis and does not give a concrete correction path for production, redaction, relogging, or supplementation.
- The review omits a privilege strategy for downstream disclosure risk, including possible sharing between government bodies or agencies.

## 3. Legal frameworks / domain conventions that apply
- **Attorney-client privilege:** Applies only to confidential communications for the purpose of seeking or giving legal advice; business communications are not privileged merely because counsel is copied or involved.
- **Work product doctrine:** Covers documents prepared because of anticipated litigation; routine compliance or ordinary-course business materials remain outside the doctrine even if litigation is foreseeable in the abstract.
- **Mixed-purpose materials:** If a document contains both protected and nonprotected content, the preferred cure is often targeted redaction rather than full withholding.
- **Privilege log adequacy:** Each withheld entry should identify the document, date, author, recipients, and a description sufficient to test the privilege claim without revealing the substance.
- **Waiver and confidentiality risks:** Broad internal circulation, operational use, or sharing outside the privilege circle can undercut confidentiality and should be evaluated before claiming protection.
- **Non-lawyer communications:** Communications among non-lawyers can still be privileged if made at counsel’s direction for the purpose of obtaining or relaying legal advice facts.
- **Government-response hygiene:** A response should be internally consistent, defensible on the record, and calibrated to reduce follow-on challenges by correcting obvious defects proactively.

## 4. Analytical scaffolds
- Review each withheld or redacted document against three questions: whether the asserted privilege fits the document’s purpose, whether the document was circulated or used in a way that undermines confidentiality, and whether the right treatment is full withholding, partial redaction, or production.
- For mixed-purpose items, separate the legal-advice or litigation-preparation content from the operational or business content and recommend the narrower response where feasible.
- Audit the privilege log for completeness and internal consistency: compare the summary count, cover letter statements, index totals, and individual entries.
- Check whether descriptions are specific enough to support the claim. Generic “legal advice” or “prepared for litigation” labels are usually not enough without context.
- Compare the draft response against any deficiency letter or government comments and flag both: (a) issues the government raised, and (b) issues the company should fix even if the government did not spot them.
- Identify repeat patterns across custodians, dates, or document types that suggest a systemic drafting issue rather than an isolated mistake.
- For each issue, state the preferred correction path: produce, redact, relog, supplement, revise the description, or preserve withholding with a stronger explanation.

## 5. Vertical / structural / temporal relationships
- Track the relationship among the cover letter, production index, and privilege log; a mismatch in any one can undermine the whole submission.
- Distinguish documents created before an investigation from those created after escalation, because timing often determines whether work product is plausible.
- Distinguish legal-advice communications from business implementation materials that follow the advice; later execution documents are often only partially protected or not protected at all.
- Where the package suggests possible downstream sharing with another authority, analyze how disclosure posture should be structured to preserve confidentiality to the extent possible.

## 6. Output structure conventions
- Write a priority-ranked memorandum, not a narrative summary.
- Open with a short severity key using a uniform ordinal scale such as Critical / High / Medium / Low.
- Organize the memo by issue family, with a separate entry for each distinct document set, inconsistency, or response defect.
- For every issue entry include:
  - severity,
  - concise issue statement,
  - why it matters,
  - recommended fix,
  - and a short privilege-analysis rationale tied to the controlling privilege or work-product rule.
- For any issue involving mixed-purpose material, state whether the recommended cure is full production, redacted production, or continued withholding with a stronger log entry.
- Include a standalone privilege strategy section addressing confidentiality, waiver risk, and any precautionary steps for disclosures to government recipients.
- End with an explicit Recommended Actions block that assigns each action to a role and ties it to the response deadline or filing milestone in the materials.
