---
name: map-gdpr-data-subject-rights-requirements-to-existing-internal-controls
task_id: data-privacy-cybersecurity/map-gdpr-data-subject-rights-requirements-to-existing-internal-controls
description: Data subject rights gap analyses are strongest when the agent maps the applicable rights framework against operational evidence showing how requests are actually handled in practice, rather than relying only on written policies or procedures.
activates_for: [planner, solver, checker]
---

# Skill: Map GDPR Data Subject Rights Requirements to Existing Internal Controls — Gap Analysis Report

## 2. Failure modes the skill is correcting

- Treating policy language as proof of compliance instead of testing whether rights requests are actually handled within the required process, timing, and escalation paths.
- Missing the regulator’s stated concerns, inquiry themes, or complaint allegations, which define the operative scope for prioritizing rights and controls.
- Ignoring complaint, incident, and ticket evidence that shows where a request failed in practice, how long it took, and what remediation was attempted.
- Assessing the rights platform abstractly instead of against the concrete workflows it must support: intake, identity verification, retrieval, correction, deletion, restriction, objection, portability, and automation review.
- Failing to distinguish controller obligations from processor-support dependencies, which can make an otherwise sound policy operationally impossible.
- Writing a gap report that describes issues but does not rank them, assign owners, or convert findings into a remediation sequence.

## 3. Legal frameworks / domain conventions that apply

- GDPR Chapter III data subject rights, including access, rectification, erasure, restriction of processing, portability, objection, and rights related to automated decision-making.
- GDPR Articles 12 through 23, including concise and transparent communication, identity verification, response timing, extension handling, and the right-specific conditions and limits.
- GDPR controller and processor allocation rules, including the need for processor assistance where third-party systems or vendors are necessary to fulfil a request.
- GDPR accountability and governance norms: documented controls matter, but operational evidence determines whether the control environment is effective.
- Rights-request handling conventions: the request workflow should be assessed end-to-end, from intake and triage through verification, execution, response, and closure.
- Evidence hierarchy for this task: regulatory notice or audit letter, complaint or incident records, operational dashboards or ticket metrics, SOPs and policies, system capability descriptions, and processor-arrangement summaries.
- When a legal conclusion is drawn, anchor it to the controlling GDPR provision rather than stating the conclusion abstractly.

## 4. Analytical scaffolds

- Start by identifying the specific rights, systems, teams, and time periods in scope. If the source set contains multiple request types or channels, enumerate them explicitly before analyzing each one.
- Read the regulator’s notice, inquiry, or complaint first; use it to prioritize the rights and failure modes under scrutiny.
- Extract operational performance evidence next: volumes, response times, overdue items, extension usage, closure rates, escalation patterns, and repeated complaint themes.
- For each right, test the actual process against the legal requirement and the system capability:
  - right statement and legal trigger,
  - internal policy or SOP,
  - technical capability and workflow support,
  - operational evidence of how requests were handled,
  - gap description,
  - severity,
  - remediation.
- Treat complaint or incident records as direct evidence of a control failure when they identify a specific request, a missed step, a delay, or an incomplete outcome.
- Assess whether the platform can support the right operationally, not merely whether the organization says it intends to do so.
- Check whether processor or vendor dependencies can block or delay fulfilment; where they do, assess whether the contractual and operational support is adequate.
- Distinguish isolated misses from systemic weaknesses by comparing issue frequency, recurrence, and breadth across request types or channels.
- Where the documents provide facts about duration, volume, or backlog, use those facts to calibrate importance and severity without inventing new figures.

## 5. Vertical / structural / temporal relationships

- Prioritize issues that affect rights with impending review, audit, or regulatory attention ahead of lower-risk process refinements.
- Treat upstream dependencies as gating items: identity verification, data mapping, and vendor support must exist before downstream fulfilment can be reliable.
- Analyze the flow of the request over time: intake → verification → search/retrieval → decisioning → execution → response → closure.
- If one control depends on another team or processor, assess the dependency chain and whether delays at one stage propagate into rights breaches.
- Separate pre-existing design gaps from execution failures, because remediation differs: redesign, retraining, tooling, or governance escalation.
- When multiple periods appear in the source set, compare them consistently rather than blending them into one averaged narrative.

## 6. Output structure conventions

- Produce a report that reads like a professional gap analysis, not a narrative summary.
- Open with a brief executive summary covering overall compliance posture, top risk areas, and the most urgent remediation themes.
- Define an ordinal severity scale once at the top and apply it consistently to every issue entry.
- Organize the body by right, request type, control domain, or another industry-standard grouping that fits the source set.
- For each issue entry, include:
  - affected GDPR right or process,
  - controlling GDPR provision,
  - internal control mapped to policy / SOP / system / vendor support,
  - operational evidence,
  - gap description,
  - severity,
  - downstream consequence,
  - recommended remediation.
- Make the gap analysis comparative: state what exists, what is missing, and why the difference matters in practice.
- Convert findings into an actionable remediation roadmap with near-term fixes, medium-term control improvements, and longer-term governance or tooling work.
- Include a clear Recommended Actions section with imperative actions, responsible roles drawn from the source materials, and timing tied to the regulatory or operational context.
- Use concise legal citation throughout; every legal proposition should be tied to a named GDPR provision or other controlling authority relevant to the source set.
- Keep the filename and deliverable naming aligned with the instruction to produce `gdpr-dsr-gap-analysis-report.docx`.
