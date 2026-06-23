---
name: identify-government-subpoena-issues
task_id: litigation-dispute-resolution/identify-government-subpoena-issues
description: Advising on a government subpoena in a criminal or regulatory investigation requires analyzing the subpoena's scope against the available documents, assessing privilege and self-incrimination implications, identifying potential individual exposure from responsive communications and records, and recommending a response strategy.
activates_for: [planner, solver, checker]
---

# Skill: Government Subpoena Issue Identification — Memorandum to Partner on Grand Jury Subpoena for Insider Trading Investigation

## 2. Failure modes the skill is correcting

- Reading the subpoena in isolation instead of testing each request against the client materials to determine what is actually responsive, what is potentially inculpatory, and what is missing from the file.
- Treating an organizational subpoena as purely corporate when the record may also create exposure for identifiable individuals through trading, messaging, email, calendar, approval, or policy documents.
- Failing to separate ordinary privilege questions from any crime-fraud or similar exception analysis that may narrow protection for communications tied to the alleged misconduct.
- Missing that preservation obligations can arise before or alongside subpoena compliance and may cover a broader universe of custodians, devices, and backups than the specific production request.
- Stating legal conclusions without tying them to the governing subpoena, privilege, Fifth Amendment, act-of-production, or insider-trading authorities.
- Omitting a concrete recommendation for next steps, timing, and ownership, leaving the memo descriptive rather than action-oriented.

## 3. Legal frameworks / domain conventions that apply

- A grand jury subpoena is compulsory process; objections typically must be timely and grounded in a recognized basis such as privilege, undue burden, overbreadth, ambiguity, constitutional protection, or improper scope under the governing criminal procedure rules.
- The attorney-client privilege protects confidential communications for legal advice; the work-product doctrine protects materials prepared in anticipation of litigation or for a litigation purpose. Either protection can be waived or limited, and a crime-fraud exception may defeat privilege where the communication was used to further misconduct.
- The Fifth Amendment privilege against self-incrimination is generally personal to natural persons, not entities; the act-of-production doctrine can matter where the testimonial aspects of production would themselves be incriminating.
- Insider-trading exposure is commonly analyzed under the theories reflected in Exchange Act Section 10(b), Rule 10b-5, and any applicable fiduciary-duty, misappropriation, or tipping principles recognized by governing precedent; the memo should frame the document review around knowledge, duty, access, timing, and state of mind.
- Material nonpublic information is information a reasonable investor would view as important before public disclosure; communications, trading records, drafts, and meeting materials often supply the best evidence of access and use.
- Preservation obligations are separate from production obligations and may be triggered by a litigation hold, regulator notice, or internal investigation notice; the memo should assess whether the hold instructions align with the subpoena’s date range and custodians.

## 4. Analytical scaffolds

- Start by parsing the subpoena request-by-request: identify the requested categories, time period, custodians, definitions, return date, production format, and any instructions about rolling production or certification.
- Build an enumerated inventory of the source documents and custodians in scope before analysis; if more than one person, account, device, business unit, or period is implicated, analyze each separately rather than collapsing them into one general impression.
- Cross-reference each request category against the available records to determine:
  - whether responsive documents exist,
  - what specific facts they tend to show,
  - whether they reveal trading, communications, approvals, or access to sensitive information.
- Review trading records together with event timing, communications, and calendar materials to identify possible links between nonpublic events and trades, recommendations, or communications.
- Review communications for subject-matter references, coded language, forwarding patterns, attachment sharing, and discussion of earnings, forecasts, deals, approvals, or other potentially sensitive information.
- Evaluate privilege document by document, distinguishing legal advice from business advice, and separately assess whether any exception or waiver issue could apply.
- Assess personal exposure by person, not just by file set: note who traded, who communicated, who received information, and who may have supervised or approved the conduct.
- Treat preservation as a distinct compliance track: confirm whether the hold covered all responsive custodians, devices, messaging platforms, and archives; identify any gap between the hold and the subpoena.
- For each issue, state the governing rule or doctrine by name and tie it to the concrete document set before giving the consequence for the client.
- End with a response strategy that assigns ownership and timing for collection, review, privilege logging, hold expansion, and any objections.

## 5. Vertical / structural / temporal relationships

- Separate company-level issues from individual-level issues; a subpoena may require corporate production while simultaneously revealing facts that support target or witness exposure for one or more people.
- Track chronology carefully: the subpoena date, preservation notice date, trading windows, event dates, and document creation dates may not align, and the mismatch itself can be important.
- Distinguish pre-event, event-period, and post-event materials because the evidentiary value and privilege posture often differ across those phases.
- If multiple custodians or repositories are implicated, list them expressly and assess them one by one; do not assume that one custodian’s production will satisfy the whole request.
- If the file includes both legal and business communications, analyze the relationship among them rather than treating the entire chain as privileged or non-privileged.
- Note whether responsive documents are held in centralized systems, personal devices, message platforms, or archived backups, because collection burden and completeness may differ materially by location.

## 6. Output structure conventions

- Write a partner-facing issues memo, not a narrative summary of the subpoena.
- Use a conventional issue-memo format with clear headings such as:
  - Subpoena Scope
  - Responsive Materials and Gaps
  - Individual Exposure
  - Privilege and Protection
  - Preservation / Hold Compliance
  - Response Strategy and Next Steps
- Include a severity label for each issue using a consistent ordinal scale defined once at the top of the memo.
- For each issue, state the governing authority by name and section or rule where applicable, then explain the document-specific implication and the practical consequence.
- Where the source set contains multiple custodians, periods, or document classes, use separate subheadings or numbered entries so each is addressed distinctly.
- Close each issue with a concrete action tied to a role and timing anchor, even if the source documents do not specify an exact deadline.
- End with a distinct Recommended Actions section that assigns immediate next steps to the appropriate lawyer, business lead, or records owner.
- The filename must match the task instruction exactly: `subpoena-issues-memo.docx`.
