---
name: assess-breach-notification-obligations-across-affected-jurisdictions
task_id: data-privacy-cybersecurity/assess-breach-notification-obligations-across-affected-jurisdictions
description: Multi-jurisdiction breach notification memos fail when the agent applies only federal frameworks and omits state-by-state notification deadlines, business-associate reporting chains, and cyber-insurance reporting obligations that may be triggered by the same incident.
activates_for: [planner, solver, checker]
---

# Skill: Assess Breach Notification Obligations Across Affected Jurisdictions — Incident Response Memorandum

## 1. Subject-matter triage
- Confirm the incident is a notification analysis, not a root-cause report or pure remediation plan.
- Separate the discovery date, confirmation date, and incident timeline; deadline computation usually runs from discovery, while scope and sequencing come from the timeline.
- Identify the data types implicated, the jurisdictions of affected persons, and the entities in the reporting chain before analyzing notice duties.
- If the record is incomplete, flag what is confirmed versus what remains preliminary, but still assess whether precautionary notice is prudent under the governing rules.

## 2. Failure modes the skill is correcting
- The agent addresses only federal notice rules and omits state-by-state deadlines, recipients, content requirements, and regulator filings.
- The agent ignores that different parties may have independent reporting duties under contracts, vendor terms, business-associate arrangements, or service-provider commitments.
- The agent conflates forensic validation with notice timing, instead of using the discovery trigger and the chronology in the investigative materials.
- The agent overlooks cyber-insurance reporting and cooperation terms that may be triggered even when statutory notice is not yet due.
- The agent states conclusions without tying them to the governing statute, regulation, or policy language that controls the result.
- The agent gives analysis without a clear follow-on action plan, leaving counsel and operations without next-step ownership.

## 3. Legal frameworks / domain conventions that apply
- HIPAA Breach Notification Rule: apply the covered-entity, business-associate, and media-notice framework; use the breach-risk assessment factors and the discovery-based timing rule in 45 C.F.R. §§ 164.400–414.
- State breach notification statutes: identify each affected jurisdiction separately and apply that jurisdiction’s trigger, deadline, notice recipients, content requirements, and any attorney general or regulator filing obligation.
- Federal privacy and sector rules: consider whether the incident also implicates FTC Act unfairness/deception theories, GLBA-related notice obligations, or other sector-specific reporting regimes if the affected population or data category makes them relevant.
- EU/EEA or UK breach rules, if applicable: assess controller/processor reporting duties, supervisory-authority notice timing, and data-subject notification standards under GDPR Articles 33 and 34 or the UK GDPR equivalents.
- Contractual reporting obligations: review the governing incident-response, data-processing, vendor, and customer agreements for notice chains, cooperation clauses, and any enhanced content or timing requirements.
- Cyber-insurance policy terms: review notice, consent, cooperation, and panel-counsel requirements alongside statutory deadlines.

## 4. Analytical scaffolds
- Start by enumerating the affected jurisdictions, then analyze each jurisdiction on its own terms; do not collapse multiple states or countries into a single generalized rule.
- For each jurisdiction, identify: the triggering data type, the applicable deadline, the required notice recipients, any regulator or media notice, the content elements, and the party responsible for sending notice.
- Tie each conclusion to the controlling authority by name and citation form used in the source materials or, if absent, by the generally recognized statute, regulation, or policy provision.
- If the breach-risk standard is relevant, walk through the statutory or regulatory factors and anchor the assessment in the investigative record.
- Cross-check the incident timeline against the discovery date to determine whether any notice clock has already started or expired.
- Review the reporting chain in the source documents to determine whether a vendor, processor, business associate, or other intermediary must notify first or simultaneously.
- Review the cyber-insurance policy for separate notice and cooperation deadlines, then reconcile those with the statutory notice timetable.
- Where media notification depends on volume or audience thresholds, verify the threshold against the affected-population evidence before treating media notice as required.
- If the evidence is still developing, distinguish between mandatory notice, prudential notice, and items that can wait for confirmation.

## 5. Vertical / structural / temporal relationships
- Reporting chain first, external notice second: internal or upstream notice may be a prerequisite to downstream statutory notice.
- Discovery date drives clock calculations; forensic completeness drives confidence in scope, not necessarily the start of the legal deadline.
- The same incident may trigger overlapping obligations with different clocks, different recipients, and different content sets; analyze the shortest applicable deadline first.
- Contractual and insurance deadlines may be shorter than statutory deadlines, so they should be checked in parallel rather than after the legal memo is complete.
- Preliminary findings should be labeled as such, but counsel should still assess whether the legal risk of delay outweighs the risk of over-notification.

## 6. Output structure conventions
- Draft a privileged breach-notification memorandum with a concise incident overview, a data and population summary, and a jurisdiction-by-jurisdiction notice analysis.
- Use a matrix or table for each jurisdiction with columns for recipient, trigger, deadline, content requirements, responsible party, and current status.
- Include a separate section for reporting-chain analysis, a separate section for insurance notice and cooperation terms, and a separate section for recommended immediate actions.
- Organize the memo so that each legal conclusion is followed by the authority supporting it and the practical consequence for the client.
- End with an explicit Recommended Actions section using imperative verbs, named responsible roles, and timing anchors tied to the incident timeline or applicable deadline.
- Deliver the file exactly as instructed: `breach-notification-memo.docx`.
