---
name: identify-dd-request-list-issues-scenario-01
task_id: capital-markets/identify-dd-request-list-issues/scenario-01
description: DD request list gap analysis for a pre-IPO company where the baseline identifies generic omissions but does not connect each gap to the specific disclosure obligation or underwriter diligence standard it is meant to satisfy.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in DD Request List — Pre-IPO Due Diligence

## 1. Subject-matter triage
- Confirm the company profile, cap table, IPO timetable, and email chain before spotting gaps in the request list.
- Separate items that are merely generic from items that are legally material for a public offering.
- If the source set shows multiple regulatory, ownership, technology, or commercial risk threads, analyze each thread separately rather than collapsing them into one umbrella concern.

## 2. Failure modes the skill is correcting
- The review flags missing document categories but does not tie each omission to the disclosure obligation, due diligence purpose, or underwriter defense it is meant to support.
- Regulatory diligence is treated as one bucket even where different agency actions, inspections, correspondence, or remedial steps have different offering-document implications.
- Governance issues are identified at a high level without tracing how the cap table, board rights, voting control, or shareholder agreements affect related-party exposure and disclosure.
- The analysis notes “more diligence needed” without specifying the documents, the reason they matter, and the IPO consequence of not obtaining them.
- The memo states conclusions without anchoring them to the source documents’ timing, scope, or interactions with other deal materials.

## 3. Legal frameworks / domain conventions that apply
- IPO diligence is aimed at supporting the underwriters’ Securities Act due diligence defense; the request list should cover the categories needed to verify material statements and omissions in the registration statement.
- Public-company disclosure analysis distinguishes between business description, risk factors, MD&A, related-party transactions, legal proceedings, and material contracts; requests should map to those distinct disclosure buckets.
- In a regulated biopharmaceutical company, FDA correspondence, inspection history, clinical or development-stage communications, and remediation materials are separately significant and should not be merged into a generic “regulatory” request.
- Material contract diligence under Item 601 of Regulation S-K requires focus on agreements outside the ordinary course that are material to the business, with enough specificity to identify scope, term, termination, exclusivity, change-of-control, and performance obligations.
- Related-party and control analysis should be tested against Exchange Act and Regulation S-K disclosure expectations for transactions with substantial shareholders, directors, and affiliates.
- Core technology diligence for a biopharmaceutical issuer should capture foundational licensing, ownership, field-of-use limits, sublicensing rights, milestone obligations, royalties, and termination triggers, because those terms can affect product rights and offering risk disclosure.
- If the source materials show international operations, third-party intermediaries, government-facing activity, or cross-border compliance exposure, anti-corruption diligence should be requested separately from general compliance.
- If the source materials show cybersecurity or data privacy exposure, those requests should be separated into distinct diligence tracks rather than bundled into one IT inquiry.
- If the source materials show a joint venture or other shared-control arrangement, the JV agreement and governance package should be requested as a separate diligence category.

## 4. Analytical scaffolds
- Start by identifying the company’s regulatory profile, development stage, ownership structure, and offering timeline from the source documents.
- For each issue, state:
  - the missing category of documents or information;
  - why the omission matters for IPO disclosure or underwriter diligence;
  - the controlling legal or disclosure framework;
  - the specific additional requests that should be added.
- When the source set contains more than one relevant risk thread, enumerate the threads first and analyze each one on its own terms.
- Tie every issue to the source documents by using the company’s disclosed facts, timelines, counterparties, governance structure, and regulatory correspondence.
- For every issue, close the analysis by noting the scale of the gap using facts from the source set, identifying any related source document or diligence bucket that interacts with it, and stating the consequence if the request is not added.
- Use a uniform ordinal severity label for each issue, and apply the same scale consistently across the memo.
- When citing legal or regulatory propositions, name the controlling authority or disclosure framework rather than describing the rule abstractly.

## 5. Vertical / structural / temporal relationships
- Treat the IPO timeline as a sequencing tool: items that could affect registration statement accuracy, comfort, or closing readiness should be surfaced ahead of lower-priority background requests.
- Distinguish between historical events, current status, and forward-looking obligations; a past FDA letter, a current remediation plan, and a near-term inspection or filing deadline do not carry the same diligence weight.
- Where ownership rights, board rights, or investor protections overlap with contract rights, analyze the interaction rather than listing each in isolation.
- If the source materials show a chain of regulatory communications, preserve the sequence so the request list captures the full record rather than a single snapshot.
- If multiple documents cover the same topic at different levels of detail, request the base agreement plus the schedules, amendments, side letters, and implementation materials that make the primary document meaningful.

## 6. Output structure conventions
- Write an issues memorandum organized by materiality and IPO relevance, not as a raw checklist.
- Define the severity scale once near the top, then apply it to every issue entry.
- For each issue, use a compact structure:
  - Severity
  - Issue summary
  - Why it matters for the IPO
  - Legal / disclosure basis
  - Recommended additional requests
  - Source-document tie-in and consequence
- Include a short opening summary that identifies the main diligence themes from the source materials.
- End with a Recommended Actions block that gives imperative next steps, names the responsible role, and ties timing to the IPO process or another source-based milestone.
- Include a concise table or grouped list of recommended additions by diligence category if it improves readability.
- Keep requests specific enough that a business team or counsel can act on them without translating generic diligence language into document asks.
