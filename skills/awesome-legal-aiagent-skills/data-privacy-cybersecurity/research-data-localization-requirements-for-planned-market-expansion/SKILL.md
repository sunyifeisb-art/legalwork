---
name: research-data-localization-requirements-for-planned-market-expansion
task_id: data-privacy-cybersecurity/research-data-localization-requirements-for-planned-market-expansion
description: Data localisation memos for multi-country market expansions fail when the agent applies generic cross-border transfer analysis without addressing each target jurisdiction's specific localisation or residency requirements and without assessing whether the current cloud and infrastructure architecture can be adapted to satisfy those requirements.
activates_for: [planner, solver, checker]
---

# Skill: Research Data Localization Requirements for Planned Market Expansion into Brazil, Indonesia, Turkey, Nigeria, and Vietnam

## 1. Subject-matter triage

This task is a multi-jurisdiction compliance review with an architecture-to-law fit question. Treat each target jurisdiction as a separate regulatory workstream unless the source materials show the same rule applies in the same way across all covered operations.

Before analysis, identify the data types, processing locations, and hosting model implicated by the expansion plan. Distinguish among personal data, sensitive data, operational logs, backup copies, and regulated sector data, because localization rules often attach differently to each.

If the source set includes more than one planned market, business line, or hosting arrangement, enumerate them explicitly first and analyze each one separately. Do not collapse distinct countries or architectures into a single general transfer analysis.

## 2. Failure modes the skill is correcting

- The memo discusses privacy generally but never answers the localization or residency question.
- The analysis assumes a cross-border transfer framework is enough, even where in-country storage, processing, or establishment requirements may apply.
- The writer relies on one internal memo or counsel note without testing it against the current plan, the cloud agreement, or the infrastructure documents.
- The writer ignores how backups, mirroring, disaster recovery, support access, and administrative access can create residency problems even when primary production data is hosted locally.
- The writer gives a binary compliant / noncompliant answer without identifying the exact legal hook, the scope of data covered, and the operational gap.
- The writer omits enforcement and implementation risk, even where the law is clear but practice is uneven.
- The writer recommends legal steps without pairing them with the technical changes needed to make compliance real.
- The writer states conclusions without naming the controlling statute, regulation, guidance, or other authority for the proposition.

## 3. Legal frameworks / domain conventions that apply

For each jurisdiction, identify the controlling localization or residency regime and state the legal basis by name and section, article, part, regulation, or equivalent authority.

- Brazil: distinguish between localization, transfer restrictions, adequacy-style permissions, contractual safeguards, and any sector-specific storage rules that may affect hosted personal data.
- Indonesia: assess whether electronic system operator rules, data classification rules, and any sector overlays require in-country storage, processing, or establishment.
- Turkey: assess transfer rules alongside any in-country handling, retention, or storage expectations that affect cloud deployment design.
- Nigeria: assess whether the applicable data protection framework, sectoral rules, or critical-infrastructure requirements impose storage or localization duties.
- Vietnam: assess cybersecurity and data protection rules for localization, local presence, filing, or impact-assessment obligations, including any trigger-based requirements.

When localization is not mandatory, identify the lawful transfer mechanism category that supports offshoring, such as adequacy, contractual clauses, consent, or equivalent safeguards. Do not assume a mechanism is available unless the controlling authority supports it.

Treat “data localization” as potentially meaning one of three different obligations: local copy, exclusive local storage, or primary in-country processing. State which one applies, because each has different technical consequences.

## 4. Analytical scaffolds

For each jurisdiction, run the same sequence:

1. Identify the controlling legal rule.
2. Define the scope of data, entities, and activities covered.
3. Map the planned expansion data flows to that scope.
4. Test the current architecture against the rule.
5. State the exact gap, if any.
6. Assess enforcement and implementation risk.
7. Recommend the minimum technical and legal changes needed.

Ground the legal analysis in the source documents. Cross-check the expansion proposal against the client MSA, cloud provider agreement, outside counsel memo, audit summary, and infrastructure documents before stating any conclusion about coverage, exceptions, or feasibility.

Use the audit and infrastructure materials to assess whether current controls support a localization argument or instead reveal dependence on offshore processing, shared tenancy, foreign backups, remote admin access, or other non-local features.

Use the customer-facing agreement only for obligations that may be triggered by promised residency, hosting geography, support model, or data handling commitments.

For each jurisdiction, include an ordinal severity assessment using a uniform scale defined once in the memo, such as Critical / High / Medium / Low. Base the severity on legal certainty, operational impact, and feasibility of remediation.

Where the legal source allows more than one compliant architecture, compare them and state the preferred route for the planned expansion.

At the end, convert the analysis into a roadmap that ties each recommendation to an owner, a sequence, and a practical compliance milestone.

## 5. Vertical / structural / temporal relationships

Treat localization as a layered design issue, not a single hosting decision. Check the vertical relationship among:

- primary production storage,
- backup and disaster-recovery copies,
- administrative and support access,
- analytics, monitoring, and logging,
- vendor subprocessors and cloud regions,
- onward transfers within the corporate group.

A solution that localizes one layer but leaves another layer offshore may still fail. State where the current stack sits, what must move, and what can remain remote if the controlling rule permits it.

Also check temporal sequence. Some regimes require local setup before launch; others allow launch with later filings, registrations, or impact assessments. The memo should state whether compliance must be achieved pre-launch, concurrently with launch, or within a post-launch period tied to a filing or notification.

If a rule depends on scale, threshold, or activity trigger, say so and explain whether the planned expansion appears to cross it based on the source documents without doing unnecessary arithmetic.

## 6. Output structure conventions

Produce a formal compliance memo in conventional legal format, with a clear title, short executive summary, and a jurisdiction-by-jurisdiction analysis.

Use a consistent section for each country that includes:
- controlling authority;
- scope and applicability to the planned operations;
- current-state gap against the existing architecture;
- severity rating with one-line rationale;
- recommended legal and technical actions.

Include a concise comparison section that separates mandatory-localization regimes from transfer-restriction-only regimes and highlights the practical implication for the expansion plan.

Include a gap analysis summary that ties the legal rules to the current cloud and infrastructure setup.

End with a Recommended Actions section that states each action in imperative form, identifies the responsible role or team from the source materials where possible, and anchors timing to the launch plan, remediation window, filing deadline, or other milestone reflected in the record.

Use plain, lawyerly prose. Cite the controlling authority for each legal proposition. Do not state a conclusion without identifying the rule that supports it.

Deliverable filename must match the instruction exactly: `data-localization-memo.docx`.
