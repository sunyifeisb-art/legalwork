---
name: sec-cybersecurity-disclosure-incident-response-gap
task_id: corporate-governance/assess-impact-of-sec-cybersecurity-disclosure-rule-on-incident-response-procedures
description: Gap analysis of incident response procedures and governance disclosures against cybersecurity disclosure requirements, with attention to materiality analysis, filing timing, and incident-response structure.
activates_for: [planner, solver, checker]
---

# Skill: Cybersecurity Disclosure Rule Impact on Incident Response Procedures

## 1. Subject-matter triage

- Treat the source set as potentially containing separate but interacting strands: incident facts, disclosure filings, governance documents, response plans, and external notification obligations.
- First determine whether there is a single incident or multiple incident instances, then analyze each incident-path separately if the documents present distinct dates, systems, or disclosure triggers.
- If the materials include both public filings and internal response documents, compare them as contemporaneous records rather than assuming one supersedes the other.

## 2. Failure modes the skill is correcting

- Applying only quantitative loss metrics to materiality while omitting qualitative factors that may independently support a materiality finding under the federal securities laws.
- Treating board- or committee-level cybersecurity oversight statements as accurate without checking whether the governing charter actually authorizes or describes that oversight.
- Assuming any delay mechanism is available without verifying a qualifying written request from the appropriate governmental authority.
- Missing external notice obligations in customer agreements, insurance policies, or transaction documents that may mature sooner than the public disclosure deadline.
- Neglecting litigation-hold and record-preservation steps when an incident is reasonably likely to lead to litigation or regulatory inquiry.
- Collapsing response, disclosure, governance, and contractual-notice issues into one conclusion instead of isolating each compliance track.
- Stating a legal conclusion without identifying the governing SEC rule, disclosure standard, or contractual source that supports it.
- Drafting remediation as a light edit when the source plan lacks core rule-relevant elements and needs structural revision.

## 3. Legal frameworks / domain conventions that apply

- Securities Act and Exchange Act disclosure framework: cybersecurity incident disclosure turns on materiality, timing, and the accuracy of periodic and current disclosures.
- Materiality standard: under the Supreme Court’s substantial-likelihood test, information is material if a reasonable investor would consider it important; quantitative impact is relevant but not exclusive.
- SEC cybersecurity disclosure rule: current-report disclosure is required within the applicable filing window after a material incident is determined, and periodic disclosure obligations separately cover risk management, strategy, and governance.
- Delay exception: the disclosure deadline may be delayed only where the applicable governmental authority has requested delay in writing; informal outreach alone is not enough.
- Governance disclosure accuracy: board and committee oversight disclosures must match the actual charter, delegated responsibilities, and reporting structure reflected in governance records.
- Incident response design: a compliant program should include a formal materiality-assessment process, escalation to legal and business leadership, written preservation steps, and a path for public-disclosure decisioning.
- Contractual notice duties: customer or vendor agreements may impose incident-notice obligations on shorter timelines than securities-law disclosure.
- Insurance notice duties: cyber policies often require prompt or timely notice of circumstances or claims; late notice can impair coverage and affect the company’s exposure analysis.
- Transaction disclosure duties: if a material incident arises in a pending deal context, the agreement’s disclosure covenants, bring-down conditions, and risk-allocation provisions may be implicated.
- Preservation duties: when litigation or regulatory inquiry is reasonably anticipated, standard preservation obligations support a litigation hold and suspension of routine deletion.

## 4. Analytical scaffolds

- Begin with a document inventory that separates incident chronology, filing chronology, governance materials, contract notice provisions, and insurance notice provisions.
- For each incident identified in the record, analyze: materiality, disclosure timing, delay availability, and downstream contractual or insurance notice consequences.
- For each filing or governance statement, test whether the stated oversight structure, incident description, and timing are supported by the underlying source documents.
- Use a two-step materiality analysis: first assess quantitative exposure; then assess qualitative indicators such as operational disruption, customer concentration, reputational harm, regulatory sensitivity, and transaction impact.
- Cross-check the incident timeline against the public-filing timeline and any internal escalation timeline; flag whether disclosure appears overdue, imminent, or still contingent.
- Verify the delay exception only if the source set contains a written request from the relevant authority; if not, treat delay as unavailable.
- Compare the incident-response plan to the disclosure-rule requirements: escalation path, cross-functional decision-makers, written materiality framework, record preservation, and disclosure coordination.
- Compare committee charter language to the most recent governance disclosure; if the disclosure exceeds the charter, treat the mismatch as a corrective-disclosure issue.
- Check external notification provisions in parallel with securities-law disclosure, because contractual deadlines may expire before public filing obligations.
- Check insurance notice provisions separately, because coverage prejudice may create a distinct financial exposure even where the public filing is timely.
- Where the materials suggest a pending transaction, assess whether the incident should have been disclosed under transaction covenants or diligence obligations and whether omission creates anti-fraud risk.
- When a plan predates the rule or omits core elements, treat the fix as a structural overhaul rather than a narrow amendment.

## 5. Vertical / structural / temporal relationships

- Track obligations on parallel clocks: internal escalation, legal review, customer notice, insurer notice, public disclosure, periodic governance disclosure, and any deal-related disclosure.
- If multiple incidents are present, map each incident to its own notice and filing sequence rather than using one consolidated timeline unless the documents themselves merge them.
- A governance disclosure problem can persist even if the incident disclosure is otherwise timely; corrective disclosure should be analyzed on its own track.
- A delayed public filing does not excuse missed contract notice or insurance notice deadlines.
- A pre-existing incident-response manual may need reorganization if it lacks rule-specific escalation and preservation mechanics; incremental wording changes are usually insufficient.

## 6. Output structure conventions

- Use an issue-led memorandum format with an ordinal severity scale defined once at the outset, then applied consistently to each finding.
- Organize the body by operational priority: immediate actions, near-term remediation, and longer-term governance or control changes.
- For each issue entry, state: severity, issue summary, supporting source comparison, governing authority, and practical consequence.
- Each issue should close with the rule or source that controls it and the business or regulatory impact if the gap remains open.
- Include a short section distinguishing confirmed compliance, probable gap, and unresolved question where the source record is incomplete.
- End with a Recommended Actions section that gives imperative next steps, identifies the responsible role, and ties each step to a deadline, filing window, or other timing anchor.
- If the source set does not support a conclusion on a point, say so expressly and identify what document or data would resolve it.
