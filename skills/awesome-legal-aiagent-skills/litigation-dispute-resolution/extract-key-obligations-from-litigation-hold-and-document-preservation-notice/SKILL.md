---
name: extract-key-obligations-from-litigation-hold-and-document-preservation-notice
task_id: litigation-dispute-resolution/extract-key-obligations-from-litigation-hold-and-document-preservation-notice
description: Extract obligations from a preservation notice by mapping each obligation to the relevant custodial groups, data sources, and operational controls, then summarize the required preservation steps in an actionable memorandum.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Obligations from Litigation Hold and Document Preservation Notice — Obligation Summary Memorandum

## 2. Failure modes the skill is correcting

- Summarizing the preservation notice at a high level without mapping each obligation to the corresponding custodial group, data environment, and operational control
- Missing the practical interaction between the preservation notice and any simultaneous migration, system retirement, mailbox cleanup, or records transfer that could delete or overwrite covered material
- Ignoring any prior destruction confirmation, backup rotation, or purge event that may require immediate legal escalation and a preservation-risk assessment
- Treating retention schedules as background instead of identifying the automated deletion rules, custodial exceptions, and system-level overrides that the notice must supersede
- Collapsing distinct obligations into one generic “preserve everything” statement instead of separating custodians, repositories, formats, third parties, and deadlines
- Failing to anchor each extracted obligation to the controlling source language and the legal or policy authority that makes it operative
- Producing a memo that lists issues without converting them into concrete operational steps for legal, IT, records, and business owners

## 3. Legal frameworks / domain conventions that apply

- A government preservation notice should be treated like a litigation hold: once received, it can suspend ordinary deletion, overwrite, recycling, and disposal practices for potentially relevant information
- Preservation scope is driven by subject matter, time period, custodians, and data types, and may extend across paper, email, ESI, collaboration tools, databases, devices, and cloud repositories
- Routine retention or auto-delete practices should not continue for covered material after the hold attaches; IT and records personnel may need affirmative instructions to disable or override them
- Potentially responsive destruction after notice can create serious exposure and should be flagged for prompt counsel review under the governing preservation and spoliation standards
- The hold scope should be mapped from the organizational structure and business function of the people involved in the covered events, not merely from job titles
- Third parties in possession of potentially relevant material may require separate preservation instructions or collection requests
- Where the source documents identify a policy, regulation, statute, rule, or internal control, cite that authority by name and section rather than stating the obligation in conclusory form

## 4. Analytical scaffolds

- Read the preservation notice end to end and extract, in separate passes, the subject matter, date range, document categories, custodians, systems, deadlines, and compliance instructions
- Enumerate every distinct obligation category before analysis; do not merge multiple custodians, systems, or time periods into one representative treatment
- Map each obligation to the responsible role, the affected source of data, the required action, and the timing trigger
- Cross-check the notice against retention policies, records schedules, litigation-hold instructions, and any technology-change materials to identify deletion, transfer, or migration conflicts
- Review any destruction confirmation, cleanup report, or backup policy for evidence that potentially covered material may already have been deleted or placed at risk
- For each extracted obligation, tie the notice language to the governing legal or policy authority that supports the preservation step
- Distinguish direct obligations from supporting controls: custodial acknowledgment, legal review, system suspension, search protocol, collection sequencing, and third-party notice
- If the source set indicates only one custodian group, system, or data environment, say so expressly and explain why the scope is singular rather than assumed

## 5. Vertical / structural / temporal relationships (only if applicable)

- Organize the memo by obligation category rather than by document chronology alone so the reader can see how the notice allocates duties across people, systems, and vendors
- Preserve the temporal sequence where it matters: notice receipt, hold attachment, suspension of deletion, collection, confirmation, and follow-up monitoring
- Show the vertical relationship between the legal directive, the compliance owner, the operational implementer, and the downstream data store
- Where a migration, retirement, or cleanup effort intersects with the hold, identify the overlap window and explain the preservation risk created by the overlap
- Where the notice reaches beyond employees to contractors, advisors, or other third parties, separate those obligations from internal custodial duties
- Flag any prior or ongoing destruction event as a time-sensitive preservation issue requiring immediate escalation

## 6. Output structure conventions

- Produce a memorandum format with a short issue summary, an obligation matrix, a risk/escalation section, and a concise action list
- For each obligation entry, include: Source Reference | Obligation | Responsible Party | Data Sources Affected | Immediate Operational Step | Timing / Trigger | Controlling Authority
- Use an ordinal severity field for each obligation entry, with one scale defined once at the top and applied consistently throughout
- Keep each entry operational: identify who must do what, to which data, by when, and under what policy or legal authority
- Include a separate section for technology-transition, destruction, and retention-risk items that need immediate counsel attention
- End with a Recommended Actions block that states the next step, the responsible role, and the urgency or deadline tied to the source documents
- Avoid generic restatements; each paragraph should convert the notice into a concrete preservation instruction or risk flag suitable for an internal implementation team
