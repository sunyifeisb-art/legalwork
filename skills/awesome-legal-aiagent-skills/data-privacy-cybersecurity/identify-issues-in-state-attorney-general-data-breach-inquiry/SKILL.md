---
name: identify-issues-in-state-attorney-general-data-breach-inquiry
task_id: data-privacy-cybersecurity/identify-issues-in-state-attorney-general-data-breach-inquiry
description: AG data breach CID issue memos fail when the agent identifies compliance gaps in the abstract rather than connecting each gap to the specific requests in the CID and the evidence (or absence of evidence) in the company’s own documents.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in State Attorney General Data Breach Inquiry — Issue Memorandum

## 1. Subject-matter triage
- Treat the CID as the organizing document; extract each request, interrogatory, attachment demand, and defined term before analyzing substance.
- Group requests by investigation theme when the CID clusters issues, but preserve the request-level hook for each issue.
- If the materials include only one breach event or one consumer-rights process, say so explicitly and analyze that single path rather than implying multiple scenarios.
- Track all relevant time periods, affected populations, notice deadlines, response windows, and vendor touchpoints before drawing conclusions.

## 2. Failure modes the skill is correcting
- The memo states abstract compliance concerns without tying each concern to a specific CID request and the source evidence bearing on that request.
- The memo ignores operational records that directly show how consumer requests, notices, escalations, or remediation steps were handled.
- The memo treats the forensic narrative as background rather than using it to test whether security controls, access governance, monitoring, or incident response were reasonable.
- The memo misses mismatches between public-facing privacy disclosures and actual operational practice, especially where third-party sharing or processing is described differently across documents.
- The memo identifies problems but stops short of severity, cross-document linkage, and client consequence.
- The memo relies on legal conclusions without naming the governing statutory, regulatory, or doctrinal basis.
- The memo lists issues without a practical next step for the CID response.

## 3. Legal frameworks / domain conventions that apply
- State attorney general CID practice: the scope of analysis follows the CID’s specific demands; every issue should answer what the agency asked for and what the documents show.
- State data breach notification statutes: assess whether notice to individuals and regulators was timely, complete, and consistent with any statutory timing or content requirements.
- State data security laws and enforcement theories: evaluate whether the company implemented and maintained reasonable security measures, including governance, technical controls, vendor oversight, and incident response.
- Consumer rights and privacy request handling obligations: if the file includes request logs or case management records, they are primary evidence of timeliness, completeness, and consistency.
- Unfair or deceptive practices principles: compare privacy policy promises, internal practices, and vendor arrangements to identify possible misrepresentation or omission theories.
- Incident response norms: test whether the response plan existed, was followed, and was calibrated to the event.
- If the source documents identify the governing law or a cited regulation, use that authority; otherwise cite the generally recognized state-law or privacy/security authority applicable to the issue.

## 4. Analytical scaffolds
- Build an issue map from the CID first: request, topic, requested documents, and the likely legal theory each request supports.
- For each issue, identify:
  - the CID request or theme it responds to;
  - the governing authority and section or rule;
  - the document evidence supporting or undermining the issue;
  - the severity on a uniform ordinal scale defined in the memo;
  - the downstream consequence for the company in the CID response or enforcement posture.
- Use the forensic report to trace cause, scope, controls failure, and remediation status; do not summarize technical findings without asking whether they imply unreasonable security.
- Use incident response communications and plans to test chronology, escalation, containment, remediation, and notice decisions.
- Use consumer request logs or analogous records to assess timeliness, closure quality, escalation patterns, and systemic process defects.
- Use privacy policy, notices, vendor terms, and related operational documents together to detect inconsistencies in disclosure or practice.
- Where a point depends on a timeline, quantify it with the dates, intervals, or durations in the file rather than with generalized language.
- Where a point depends on interaction between documents, cross-check the controlling operational document against the public disclosure, the forensic narrative, and the CID demand.
- Where a point depends on harm or risk, state the regulatory, litigation, operational, or reputational consequence that follows.

## 5. Vertical / structural / temporal relationships
- Preserve the chronology of the breach, discovery, escalation, containment, notification, and remediation; later documents may cure or worsen earlier gaps.
- Distinguish among pre-incident controls, incident-period response, and post-incident remediation; a weakness in one phase should not be attributed to another without support.
- Distinguish between company-level policy and actual practice at the business-unit, system, or vendor level.
- Distinguish internal awareness from external notice; the timing gap is often the key issue in a breach inquiry.
- Distinguish consumer-facing disclosures from backend contractual arrangements and operational implementation.
- If multiple business lines, systems, or request types are present, analyze each separately rather than collapsing them into one generic finding.

## 6. Output structure conventions
- Use a concise executive summary followed by issue entries organized by CID request or investigation theme.
- Define a uniform ordinal severity scale once at the top of the memo and apply it to every issue.
- For each issue, include:
  - CID request or theme;
  - severity;
  - governing authority;
  - evidence from the documents;
  - why the evidence matters;
  - downstream consequence for the CID response or enforcement risk;
  - recommended response approach.
- Close every issue by tying the documents to the applicable authority and to the practical effect on the company.
- End with a Recommended Actions block that gives imperative next steps, assigns the responsible role named in the materials where possible, and uses a deadline or urgency tied to the CID or regulatory response timeline.
- Use plain-English issue headings that track the request or theme, not generic labels like “compliance” or “privacy.”
- Keep the memo analytical and action-oriented; do not recite document contents unless they support an issue.
- The deliverable filename should match the instruction exactly: `issue-identification-memo.docx`.
