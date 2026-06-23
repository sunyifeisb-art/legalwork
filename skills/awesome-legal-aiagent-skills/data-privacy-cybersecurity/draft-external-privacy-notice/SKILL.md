---
name: draft-external-privacy-notice
task_id: data-privacy-cybersecurity/draft-external-privacy-notice
description: External privacy notice drafts for digital health platforms fail when the agent does not anchor the notice's disclosures in the current data processing inventory and does not address additional jurisdiction-specific expansion and AI product integration obligations as distinct disclosure workstreams.
activates_for: [planner, solver, checker]
---

# Skill: Draft External Privacy Notice for Digital Health Platform

## 1. Subject-matter triage

- Treat the privacy notice as the primary deliverable and the compliance memorandum as secondary.
- Build the notice from the current processing inventory, not from the legacy notice.
- Separate baseline notice content from jurisdiction-specific expansion, AI/product-feature disclosures, vendor-sharing analysis, retention disclosures, and health-data sensitivity treatment.
- If multiple jurisdictions, products, or processing streams appear in the source set, enumerate them first and then draft each disclosure block against the corresponding source.
- If the source set does not support a jurisdiction-specific statement, say so in the memorandum and do not invent local detail.

## 2. Failure modes the skill is correcting

- Agent drafts disclosures from an outdated notice instead of the current processing inventory, leaving new data uses, new recipient classes, and new product features undisclosed.
- Agent treats international or local expansion as a generic geography issue, missing separate notice content, local contact channels, and location-specific rights or cookie/marketing disclosures.
- Agent omits retention periods, uses vague “as needed” language, or fails to align retention language with the retention memo.
- Agent fails to classify vendors correctly, so disclosures to service providers, processors, and third parties are collapsed into one undifferentiated category.
- Agent ignores AI-enabled processing, automated decision-making, profiling, or model-training uses that require distinct disclosure treatment.
- Agent drafts a compliant-looking notice but does not surface the mismatch between the notice and actual operations in the companion memorandum.
- Agent leaves the update mechanics unclear, including effective date, version control, archive handling, and any required change-notice workflow.

## 3. Legal frameworks / domain conventions that apply

- Use the controlling privacy-notice framework for the target markets: identity of the controller/business, contact information, purposes and legal bases, categories of personal data, sources, recipients or recipient classes, transfer mechanisms, retention, rights, and complaint channels.
- Treat health, wellness, biometric, and other sensitive data as a special category requiring explicit notice treatment and narrow purpose framing.
- If the platform operates in a regulated healthcare context, include the applicable health-privacy notice content or a clearly separated health-privacy layer.
- Apply consumer privacy notice conventions where relevant: categories collected, sources, purposes, third-party disclosure categories, consumer rights, opt-out or preference controls, and update/effective-date language.
- Apply AI disclosure conventions where automated processing, profiling, or materially significant decisions are involved; disclose the role of the system, the categories of data used, and the available user controls or review rights where required.
- Apply cookie, analytics, and electronic marketing conventions where the source documents show tracking, preference management, or marketing outreach.
- Treat cross-border transfers, hosting, and support access as disclosure and transfer issues that may require mechanism-specific language.
- Use the source documents as the only factual basis for business practices, recipients, retention, and product behavior; do not generalize beyond them.

## 4. Analytical scaffolds

- Start by mapping the processing inventory into four buckets: what data is collected, from whom, for what purpose, and with whom it is shared.
- Reconcile the inventory against the legacy notice and mark every new, removed, or materially revised practice.
- Extract every retention period from the retention memo and assign it to the corresponding data category or activity.
- Review the product specifications for AI functions, automated outputs, inference generation, or secondary data uses that require disclosure beyond ordinary service delivery.
- Review vendor agreements to determine whether each counterparty is a processor/service provider, shared controller, independent third party, or transfer recipient.
- Review the expansion checklist to identify local notice add-ons, supervisory contact references, local rights language, and any market-specific cookie/marketing content.
- If a source document uses a term inconsistently, preserve the operational meaning but normalize the public-facing notice language.
- Draft the memorandum as a gap analysis: what the notice says, what the operations actually do, why the difference matters, and what must change before publication.
- Where the source set supports more than one jurisdiction or product line, draft separate sub-sections rather than blending them into one generic paragraph.

## 5. Vertical / structural / temporal relationships

- Present the notice in layered form: a short summary layer followed by detailed disclosures organized by processing purpose or data category.
- Put the highest-level relationship first: controller identity, scope, and effective date; then data collection and use; then sharing, transfers, retention, and rights.
- If one disclosure depends on another document or operational process, make that dependency explicit in the memorandum.
- Tie every update to a temporal anchor: new effective date, prior notice replacement, archival handling, and any go-live dependency.
- For expansion work, separate baseline global language from local addenda so the reader can see which obligations are universal and which are jurisdiction-specific.
- If the source set includes multiple processing lifecycles, keep collection, use, disclosure, retention, and deletion distinct so the notice does not flatten them into a single lifecycle statement.

## 6. Output structure conventions

- Produce two Word documents: `privacy-notice.docx` and `compliance-memorandum.docx`.
- The privacy notice should use a clean, consumer-facing structure with an opening summary, detailed sections by processing activity or data category, rights and contact information, and an effective-date/version block.
- Include a clear statement that the prior notice is superseded only if the source materials support that update, and note archive handling.
- Use precise, source-anchored terminology for data categories, recipients, retention, and product features; avoid aspirational or generic boilerplate.
- The compliance memorandum should be an advisory gap analysis, not a restatement of the notice.
- In the memorandum, state the risk level for each issue using a uniform ordinal scale defined once at the top, and explain the business or regulatory consequence of each gap.
- End the memorandum with a concise Recommended Actions section that assigns each action to a role and ties it to a publication or launch milestone.
- Do not include invented legal citations, factual assumptions, or unsupported operational claims.
- Before finishing, confirm that both files are drafted, non-empty, and contain operative notice and memo content rather than summaries of what should be drafted.
