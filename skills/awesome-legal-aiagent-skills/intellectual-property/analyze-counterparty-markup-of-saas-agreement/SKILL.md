---
name: analyze-counterparty-markup-saas-agreement
task_id: intellectual-property/analyze-counterparty-markup-of-saas-agreement
description: Priority-ranked redline analysis memorandum for a vendor-marked SaaS subscription agreement evaluated against the company's template, playbook, order form, and negotiation correspondence. Focus on comparing the operative draft against reference materials, identifying deviations, and organizing issues by business impact and negotiation significance.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of SaaS Agreement

## 1. Subject-matter triage

Identify the operative redline, then map the governing hierarchy across the draft, template, playbook, order form, and negotiation emails before analyzing any clause. If the same topic appears in multiple sources, treat the most specific deal document as controlling unless the correspondence clearly records a later agreement.

If more than one counterparty version, term sheet, or email thread is in play, enumerate the full set first and analyze each separately. If only one operative markup exists, state that explicitly and proceed on that basis.

## 2. Failure modes the skill is correcting

- Reading a SaaS markup as a generic commercial contract instead of a risk-allocation document with recurring operational, data, and support issues
- Missing that negotiation emails can override template language or clarify intended exceptions
- Failing to connect customer-data ownership, vendor data-use rights, and acceptable-use restrictions as a single control package
- Treating service credits as the whole remedy picture without checking exclusivity, termination rights, and cap interaction
- Overlooking how liability cap structure changes meaning when paired with security, IP, indemnity, or confidentiality carve-outs
- Summarizing deviations without ranking them by business significance and negotiation leverage
- Describing a problem without tying it to the source documents, the operative scale, and the client consequence
- Concluding on legal effect without naming the contract principle or authority that supports the conclusion

## 3. Legal frameworks / domain conventions that apply

- SaaS contracts are usually read through document hierarchy: order form, amendment, MSA/template, playbook, and negotiated emails may each modify the operative position
- Uptime commitments turn on the definition of availability, measurement method, exclusions, service-credit mechanics, and whether credits are exclusive
- Data provisions typically separate ownership of customer data, permitted vendor use, retention, export, and deletion obligations
- IP provisions should distinguish customer content, configurations, feedback, integration code, vendor platform IP, and any derivative rights
- Security, confidentiality, and incident-response terms often interact with indemnity, limitation of liability, and notice obligations
- Liability analysis should check cap amount, basket structure if any, carve-outs, and whether the contract leaves a meaningful recovery path
- Term, renewal, suspension, and termination-for-convenience terms affect migration risk and commercial lock-in
- Common contract interpretation principles apply: specific controls over general, later-in-time deal terms can supersede templates, and negotiated deviations should be read in context of the full source set

## 4. Analytical scaffolds

- Start with document hierarchy: identify which source controls each disputed point and whether the markup departs from the template, playbook, order form, or email-agreed position
- For each deviation, state the clause, the counterparty position, the preferred position, and whether the difference is legal, economic, operational, or drafting-only
- For SaaS operational terms, analyze uptime, support, maintenance windows, credits, suspension rights, data export, deletion, and disaster-recovery or continuity obligations as a linked package
- For data and IP terms, separate ownership, license scope, permitted analytics use, anonymization, retention, portability, and post-termination handling
- For liability, test how the cap and carve-outs interact with the most likely exposure channels in the transaction, then assess whether the result is commercially acceptable
- For renewals and termination, assess notice periods, auto-renewal mechanics, and the customer’s practical ability to exit or migrate
- For each issue, close the analysis by stating: the scale of the point in the source documents, the related clause or document it interacts with, and the downstream consequence for the client
- Cite the governing authority or contract principle for each legal proposition you rely on; do not state a conclusion without identifying the rule or source that supports it
- If a point is not supported by the source set, flag it as an assumption or open question rather than filling the gap with speculation

## 5. Vertical / structural / temporal relationships

Trace how provisions work over time: onboarding, service commencement, live service, incident response, renewal, suspension, termination, data return, and deletion. Identify provisions that shift meaning at different stages, such as trial periods, pilot use, post-termination retention, or survival clauses.

Also trace vertical dependencies: a clause in the order form may narrow a template right; an email may carve out a deal-specific exception; a support or security schedule may control operational obligations that the main agreement states only generally. Resolve conflicts by reading the sources in order of specificity and later agreement.

## 6. Output structure conventions

Use a prioritized memorandum format with a defined severity scale applied uniformly to every issue.

- Begin with a short executive summary that states the overall risk posture and the most material deviations
- Include a source hierarchy note identifying which documents controlled the analysis
- Use an issue table or comparable issue matrix with columns for:
  - provision or topic
  - current markup position
  - preferred / playbook position
  - severity
  - why it matters
  - recommended revision or fallback
- Apply an ordinal severity label to every entry, with the scale defined once near the top and used consistently
- Group issues by topic in a conventional SaaS order: governance / hierarchy, commercial terms, SLA and support, data, security and privacy, IP, liability and indemnity, term and termination, misc. drafting
- Distinguish hard asks from fallback positions where the record supports one
- Flag open items from negotiation correspondence separately from pure markup deviations
- End with a Recommended Actions block that assigns each next step to a responsible role and ties it to a deal milestone or immediate turnaround need
- Write the deliverable so a reader can understand every issue from the plain text alone, even if exported without formatting
