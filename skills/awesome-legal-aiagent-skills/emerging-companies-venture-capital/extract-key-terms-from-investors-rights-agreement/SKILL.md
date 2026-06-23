---
name: ecvc-extract-key-terms-ira
task_id: emerging-companies-venture-capital/extract-key-terms-from-investors-rights-agreement
description: A term extraction report for an investors' rights agreement should cross-check share-count references against the cap table or other capitalization records, explain the economic effect of any anti-dilution mechanism using a hypothetical example, flag enforceability issues for restrictive covenants under the applicable employment or contract law, and assess the restrictiveness of any drag-along by reviewing the triggering mechanics and founder-protective carve-outs.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Investors' Rights Agreement

## 1. Subject-matter triage

- Treat the IRA as the anchor document, but read it together with the side letter, cap table, and email threads before extracting any term.
- Separate provisions that are standard venture terms from provisions that are bespoke, amended by side letter, or functionally modified by emails.
- Where the same economic concept appears in multiple documents, identify the controlling text and note any inconsistency or later-in-time override.
- If a term appears only in a side letter or email thread, state whether it appears to modify, supplement, or conflict with the IRA.

## 2. Failure modes the skill is correcting

- Share-count references are extracted without checking the cap table or other capitalization records, allowing stale or inconsistent references to pass unnoticed.
- A protective mechanism is named but not translated into its economic effect, leaving the diligence reader unable to assess practical impact.
- Restrictive covenants are described without identifying the governing law or enforceability sensitivities that matter to the covered person or jurisdiction.
- Drag-along terms are summarized without testing the trigger mechanics, economic guardrails, and carve-outs that determine how coercive the provision is.
- Side letters and email-based modifications are ignored even when they alter rights, obligations, or interpretation.
- Provisions are summarized in isolation rather than as a coordinated package across the transaction documents.

## 3. Legal frameworks / domain conventions that apply

- Read the IRA as a rights allocation agreement: registration, information, pro rata, transfer, voting, protective provisions, indemnity-related rights, and similar investor protections should be extracted by category.
- Cross-check any numerical reference against the cap table, capitalization schedules, and any later-issued issuer records that may supersede the IRA’s internal figures.
- For anti-dilution language, identify the mechanism used, explain how a down-round issuance affects conversion economics, and describe who absorbs the dilution under that mechanism.
- For restrictive covenants, identify the governing law, scope, duration, geography, and covered persons; then flag likely enforceability issues under the applicable employment, contract, or restrictive-covenant doctrine.
- For drag-along provisions, assess who can trigger the drag, what approval threshold is required, what consideration standard applies, and whether founders or other holders receive protective exceptions.
- For MFN or amendment mechanics, identify whether the clause captures later investor-side concessions, whether consent or notice is required, and whether integration language limits later informal modifications.
- For any term changed by email or side letter, apply ordinary contract-modification principles reflected in the documents and explain whether the modification appears formal, informal, or disputed.

## 4. Analytical scaffolds

- Start with a numbered inventory of all distinct terms to be extracted, grouped by right or provision type.
- For each provision, use the same four-part structure:
  - exact term summary
  - plain-English explanation
  - cross-document consistency check
  - key risk, ambiguity, or diligence note
- For every share count or threshold:
  - compare the stated figure to the cap table or equivalent record
  - identify whether the count appears current, stale, rounded, or inconsistent
  - explain the likely diligence significance of any mismatch
- For every anti-dilution term:
  - identify the mechanism and affected security class
  - explain the conversion impact with a simple hypothetical lower-price issuance
  - state the dilution consequence for common holders, preferred holders, or both
- For every restrictive covenant:
  - identify governing law and covered party category
  - extract scope, duration, and geography
  - assess enforceability sensitivity using the governing doctrine named in the documents or the generally applicable rule
- For every drag-along:
  - identify the trigger group and approval threshold
  - note any price floor, fiduciary-style limitation, or equality-of-consideration guardrail
  - identify founder-protective carve-outs, notice rights, or participation limits
  - characterize the provision as relatively narrow or broad based on those mechanics
- For every MFN, side letter, or amendment right:
  - identify what later benefit is captured
  - note whether the provision is automatic or consent-based
  - flag integration, waiver, or amendment risk if the documents point in different directions
- If only one party, one series, or one governing-law regime is in scope, say so affirmatively before analyzing it.

## 5. Vertical / structural / temporal relationships

- Track how the IRA interacts vertically with the side letter and any later email-based concessions.
- Identify whether later documents narrow, expand, or merely clarify the baseline IRA rights.
- Distinguish provisions that are evergreen from those that only matter at financing close, a later issuance, a liquidity event, or an enforcement dispute.
- Where a right depends on a future threshold or triggering event, explain the trigger sequence in chronological order.
- If the source set contains more than one potential interpretation, state which document appears controlling and why, based on timing and specificity.

## 6. Output structure conventions

- Produce a term extraction report organized by right and provision type, not as a narrative memo.
- Use concise subsections for each major right, with sub-bullets for source text, business meaning, consistency check, and diligence concern.
- Include a cross-document consistency table that compares the IRA, side letter, cap table, and email threads for each material term.
- Include a separate share-count cross-reference table wherever the agreement states numerical ownership, issuance, or threshold figures.
- For anti-dilution terms, include a worked hypothetical showing the economic direction of the adjustment without preloading transaction-specific arithmetic.
- Cite the controlling legal authority or doctrine for each enforceability or interpretation point you rely on, using the authority named in the documents when provided, or the generally recognized rule when not.
- End with a Recommended Actions section that assigns each action to a responsible role and ties it to a transaction milestone or document deadline.
- Ensure the final file is the primary deliverable and contains the operative term extraction content, not a placeholder or outline.
