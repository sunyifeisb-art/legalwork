---
name: map-beneficial-ownership-reporting-requirements-to-corporate-entity-structure
task_id: corporate-governance/map-beneficial-ownership-reporting-requirements-to-corporate-entity-structure
description: Agents apply the large operating company exemption using all required prongs, trace beneficial ownership through layered ownership structures to identify individual beneficial owners, analyze foreign joint venture partners by tracing through to individuals where feasible, and assess substantial control for governance-rights holders who do not own equity.
activates_for: [planner, solver, checker]
---

# Skill: BOI Compliance Gap Analysis — Beneficial Ownership Reporting Across Corporate Entity Structure

## 1. Subject-matter triage
- Treat the engagement as an entity-by-entity BOI coverage review, not a single-company check.
- First separate entities that are plainly exempt from entities that require full beneficial ownership and substantial control analysis.
- Enumerate every entity in the structure before analyzing it; if the source set contains only one entity, say so expressly and explain why no broader list exists.
- Distinguish ownership analysis from control analysis; do not let one substitute for the other.
- For every conclusion, anchor it to the controlling CTA/FinCEN authority and to the relevant facts in the source materials.

## 2. Failure modes the skill is correcting
- Treating the large operating company exemption as satisfied without testing each required element in full.
- Missing reporting-company status for a lower-tier entity because attention stayed on the top parent only.
- Stopping at the named holder in the cap table instead of tracing through intermediate entities, trusts, or foreign layers to the individual natural persons.
- Treating a foreign joint venture partner as the end of the inquiry instead of tracing reasonably available ownership information through that partner.
- Overlooking substantial control where the person has governance authority but no equity.
- Collapsing distinct entities, periods, or filing obligations into one generic discussion.
- Stating that an entity is exempt or reportable without naming the rule that drives the result.
- Providing diagnosis without a concrete next-step recommendation tied to the responsible role and timing.

## 3. Legal frameworks / domain conventions that apply
- Apply the Corporate Transparency Act and FinCEN’s BOI regulations, including the reporting-company definition, exemptions, beneficial owner definition, substantial control standard, and update obligations.
- For exemption analysis, use the full large operating company test and confirm every prong before calling an entity exempt; if the entity is a disregarded entity or otherwise tax-related edge case, analyze the tax-filing prong carefully rather than assuming it is met.
- For ownership analysis, trace through LLCs, corporations, trusts, nominee-like arrangements, and foreign entities to the individual natural persons at the end of the chain to the extent reasonably available.
- For trust-held interests, identify the relevant human actors who can exercise dispositive or control authority over trust assets, in addition to the trustee/beneficiary labels used in the documents.
- For substantial control, analyze senior officers, appointment/removal authority, and authority over important decisions as separate pathways from equity ownership.
- For foreign investors and foreign JV partners, document reasonable efforts and information limits when the ownership chain cannot be fully resolved.
- For filing posture, analyze initial report timing and any update trigger from material changes since the last filing.

## 4. Analytical scaffolds
- **Entity-by-entity exemption screen:** For each entity, state whether it is a reporting company or exempt, identify the claimed exemption if any, and test each required prong against the source facts.
- **Ownership-chain trace:** For each non-exempt entity, walk from the entity through every intermediate layer to the natural person owners; record each link in the chain and note where the chain is indirect, partial, or information-limited.
- **Trust-focused review:** Where a trust appears in the chain, identify the people who can exercise control over trust property or beneficial enjoyment, and distinguish them from the trust vehicle itself.
- **Foreign-entity tracing:** Where the chain runs through a foreign entity or foreign JV partner, identify the ultimate individuals if reasonably available and note any unresolved gaps.
- **Substantial-control review:** For each entity, identify every person who may exercise substantial control, including officers, directors, managers, veto holders, appointment/removal rights holders, and persons with decision rights over major matters.
- **Filing-status review:** Determine whether the entity needed an initial BOI filing, whether it appears filed, and whether later changes likely require an update.

## 5. Vertical / structural / temporal relationships
- In a multi-tier structure, the BOI analysis should move vertically from the reporting company up through each ownership layer and laterally across governance rights that may create control.
- A lower-tier subsidiary may be reportable even if an upper-tier parent is exempt; do not assume parent status resolves the subsidiary.
- If the same person appears through both ownership and control pathways, analyze both pathways and then state the combined reporting consequence.
- If the structure changes over time, separate the analysis by relevant filing period or post-change state rather than merging pre- and post-change facts.
- Where a JV partner has board rights, veto rights, or consent rights over important decisions, analyze whether those rights amount to substantial control even if equity is minority.

## 6. Output structure conventions
- Produce a memo organized entity by entity, with a short introductory methodology section and a clear conclusion on reporting posture for each entity.
- Include a concise status table for each entity covering reporting-company status, claimed exemption, exemption analysis, beneficial owners identified, substantial control holders, filing posture, and gaps or uncertainties.
- Define an ordinal severity scale once near the front of the memo and apply it consistently to each gap or issue.
- For each gap, state the controlling authority, the factual basis in the source materials, the compliance consequence, and the practical reason it matters.
- Separate ownership-based beneficial owners from substantial-control beneficial owners so the reader can see both analyses clearly.
- Include a deadlines or timing section that identifies initial filing and update obligations using the applicable regulatory timing rules.
- End with a Recommended Actions section that uses imperative verbs, names the responsible role, and ties each action to a concrete timing anchor or regulatory milestone.
