---
name: extract-oss-license-obligations-software-disclosure
task_id: intellectual-property/extract-open-source-license-obligations-from-targets-software-disclosure-schedule
description: Reviewing a target's software disclosure schedule, software composition analysis scan, software bill of materials, IP representations, architecture documentation, and internal emails to produce a compliance risk report focused on open source license obligations.
activates_for: [planner, solver, checker]
---

# Skill: Extract Open Source License Obligations from Target's Software Disclosure Schedule

## 1. Subject-matter triage

Treat the disclosure schedule as the contractual disclosure layer and the SCA scan, SBOM, architecture memo, and emails as the operational reality. Compare them directly to identify omitted components, inconsistent license labels, and any statements in the IP reps that become fragile once the technical inventory is reconciled.

Build the review around the specific deployment and integration facts. The same component can be low risk in one architecture and materially risky in another, so do not analyze licenses in the abstract.

## 2. Failure modes the skill is correcting

- Reading the disclosure schedule in isolation and missing components that appear only in the technical sources
- Treating all open source as interchangeable and failing to distinguish permissive, weak copyleft, strong copyleft, and network copyleft obligations
- Ignoring the integration model, distribution path, or service deployment facts that determine whether copyleft duties are actually triggered
- Overstating or understating risk because the architecture is not tied back to the relevant license trigger
- Failing to connect technical discrepancies to IP reps, compliance exposure, and transaction consequences
- Ending with diagnosis only, without a concrete remediation path tied to timing and ownership

## 3. Legal frameworks / domain conventions that apply

- SCA scans and SBOMs are technical evidence of component presence; they often identify software not captured in the disclosure schedule and should be treated as the primary inventory for component-level analysis
- Open source obligations usually vary by license family: permissive licenses impose notice and attribution-style conditions, weak copyleft licenses impose source-sharing obligations on covered modifications or linked portions, strong copyleft licenses can expand obligations more broadly upon distribution, and network copyleft licenses may attach obligations when software is made available as a service
- Distribution, copying, modification, combining, and conveying are the factual triggers that matter; internal use alone is often not enough for many copyleft obligations, but deployment model and license text control the analysis
- Architecture matters: static linking, library inclusion, and code incorporation generally raise more copyleft risk than loose runtime calls or separate-process interfaces, but the actual license terms and facts control
- IP representations commonly address completeness of disclosure, ownership, compliance with third-party code restrictions, and absence of undisclosed open source obligations; inconsistencies between technical inventory and reps can create disclosure and covenant risk
- Internal emails may evidence awareness, waiver requests, remediation attempts, or unresolved compliance concerns; those facts matter for diligence, indemnity, and post-closing enforcement exposure
- When a conclusion turns on license text, quote or paraphrase the controlling license language carefully and tie the conclusion to the specific obligation in that license, rather than to generic OSS assumptions

## 4. Analytical scaffolds

1. Compile a master component list from the SCA scan, SBOM, architecture memo, disclosure schedule, and emails; treat the technical sources as the working inventory and the disclosure schedule as the disclosure baseline
2. Separate the inventory into disclosed and undisclosed components, then categorize each component by license family and apparent role in the product stack
3. For each component that may impose obligations, identify the factual trigger: modification, distribution, combination, static inclusion, dynamic use, service deployment, or source availability
4. For each copyleft or network copyleft component, map the obligation to the architecture and determine whether the trigger is actually present on the facts
5. Cross-check the technical inventory against IP reps and any compliance statements to determine whether the discrepancy changes the diligence or closing picture
6. Review the email chain for acknowledgments of missing notices, unresolved scan findings, exception requests, or known deviations from stated compliance practices
7. Rate each issue by transaction impact on an ordinal scale stated once up front, and tie that rating to the engineering and legal fix required
8. For each issue, state the practical remediation path, including whether the fix is likely to be a notice update, code replacement, architecture change, source-release process, or a targeted waiver

## 5. Vertical / structural / temporal relationships

Architecture governs license exposure: component presence alone is not enough. The analysis should move from inventory to integration to trigger to obligation, then to representation impact and remediation.

Temporal posture matters as well. A past disclosure omission may be a diligence or rep issue even if the current technical architecture is clean, while a current distribution model may create immediate release obligations even if the component was originally introduced innocently.

Where multiple products, releases, or deployment modes are in scope, analyze each separately rather than collapsing them into a single blended conclusion.

## 6. Output structure conventions

- Use a compliance risk report format with a short methodology section, a component inventory summary, a disclosure-gap analysis, a license-family classification section, and separate architecture-based analyses for copyleft and network copyleft items
- Define one ordinal severity scale at the top and apply it consistently to every flagged issue
- For each issue, include: the component or fact pattern, the controlling license rule or other authority, the trigger analysis, the IP rep or disclosure impact, the downstream consequence, and the recommended remediation
- Include a concise issue matrix with one row per flagged component or fact pattern and columns for license family, integration method, trigger status, severity, disclosure/reps impact, consequence, and remediation
- End with a Recommended Actions block that assigns each action to a role inferred from the source set and anchors it to the relevant transaction milestone or urgent follow-up point
- Keep the report operational: state the conclusion, the supporting authority or license term, and the business consequence in each entry rather than relying on generalized OSS risk language
