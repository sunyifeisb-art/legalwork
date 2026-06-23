---
name: its-extract-transaction-entity-details
task_id: international-trade-sanctions/extract-transaction-entity-details
description: Produces a structured entity extraction report for a multi-party trade finance transaction that flags name transliteration variants and entity form discrepancies as inconclusive rather than clearing matches, applies the applicable indirect ownership test to trace ownership through intermediate entities, screens vessel historical ownership, and identifies letter-of-credit routing anomalies as transshipment risk indicators.
activates_for: [planner, solver, checker]
---

# Skill: Extract Entity Details for Sanctions Screening

## 1. Subject-matter triage

This is a multi-party sanctions-screening extraction task, not a single-counterparty name check. Separate the parties by role before analyzing them: trade counterparties, banks and other intermediaries, vessels, and natural persons. Treat each role as a distinct screening object because the governing identifiers, ownership questions, and risk indicators differ by category.

Enumerate every named entity and every vessel or transport reference in the source set first, then run the screening logic once per item. Do not collapse multiple parties into a single “overall match” analysis.

## 2. Failure modes the skill is correcting

- Clearing a potential match merely because the transaction document and sanctions entry use different transliterations, spelling conventions, or transliterated diacritics
- Ignoring entity-form or jurisdiction discrepancies that may be clerical, while also failing to test whether other identifiers resolve the uncertainty
- Screening only the direct counterparty and missing ownership traced through intermediate entities or layered holding structures
- Treating ownership as a binary direct-holding question instead of tracing aggregate sanctions-attributable ownership across all paths
- Checking only the vessel’s current owner and missing prior owners, operators, or registration history tied to the permanent vessel identifier
- Treating route details in a letter of credit as logistics only, rather than as potential transshipment indicators requiring enhanced diligence
- Concluding “clear” where the document set contains incomplete ownership, opaque beneficial ownership, or inconsistent party identifiers

## 3. Legal frameworks / domain conventions that apply

- Name transliteration is a non-distinguishing variation: multiple accepted transliterations may refer to the same person or entity, so differences in romanization, vowel clusters, or diacritics do not by themselves resolve a match
- Entity-form discrepancies must be analyzed as identity clues, not dispositive answers: suffix, jurisdiction, and registration form may indicate either a clerical variation or a genuinely different legal person
- Indirect ownership must be traced through intermediate entities to determine whether sanctions attribution applies under the applicable ownership test; ownership analysis must aggregate all relevant paths rather than stopping at the first layer
- Beneficial ownership opacity in low-disclosure jurisdictions is itself a screening issue: limited registry transparency can mask sanctioned owners and warrants enhanced due diligence rather than clearance
- Vessel screening attaches to the vessel’s permanent identifier, not to a mutable name or flag; current and historical ownership, operation, and registry history are relevant to diversion risk
- Trade-routing anomalies in a letter of credit can indicate transshipment risk; loading, discharge, and any intermediate ports must be assessed against the stated origin and destination
- Apply the controlling sanctions authority, ownership threshold, or trade-control rule identified in the source materials; if the source set does not specify one, state the governing rule relied upon from generally recognized sanctions-screening practice and cite it consistently

## 4. Analytical scaffolds

1. Extract all named entities, role labels, jurisdictions, and identifiers from the documents.
2. For each person or entity, list the exact names used in the source set and any alternate transliterations or naming variants that appear plausible.
3. Compare the source-set identifiers against the sanctions-screening record using the totality of identifiers, not name alone.
4. If an ownership chain is present or implied, trace every layer from the named counterparty through intermediate owners and calculate whether sanctions attribution is triggered under the applicable ownership test.
5. If a corporate form or jurisdiction appears inconsistent, test whether the inconsistency is clerical or material by comparing registration data, addresses, officers, and other identifiers.
6. For any entity in a low-transparency jurisdiction, flag beneficial ownership opacity and treat the disclosure gap as a diligence issue.
7. For each vessel, screen the permanent identifier, then review current and historical owners, operators, and registry history for sanctions or diversion links.
8. For any letter of credit or routing instruction, identify origin, loading, transshipment, discharge, and final destination references; flag routing through high-risk transshipment jurisdictions or other anomalies that could indicate diversion.
9. Distinguish confirmed matches, potential matches, and inconclusive records; do not convert uncertainty into clearance.

## 5. Vertical / structural / temporal relationships

Where the source set includes layered ownership, distinguish vertical control from horizontal counterparties. Track the sequence from parent to intermediate entity to operating entity, and keep the timing of ownership changes separate from the current snapshot.

Where the source set includes vessel history, treat ownership and operation as temporal states. A prior owner, prior operator, or prior flag may be relevant even if no longer current.

Where the source set includes financing routes, treat the LC or shipping route as a temporal chain of movement. Loading, transshipment, and discharge points must be assessed in order, not as isolated waypoints.

## 6. Output structure conventions

- Produce a structured entity extraction report suitable for a sanctions go/no-go decision.
- Organize the report by party type: trade counterparties, financial institutions, vessels, and natural persons.
- For each entity, include: name as stated, role, jurisdiction, identifiers, screening basis, transliteration or form discrepancies, ownership or control notes, vessel or routing notes if relevant, risk flag, and recommended action.
- For any ownership issue, include the ownership chain in narrative form and state the applicable sanctions-attribution conclusion tied to the governing rule.
- For any vessel issue, include the permanent identifier, current and historical ownership/operation findings, and the relevance of any prior sanctions connection.
- For any routing issue, identify the loading, transshipment, and discharge points and explain why the routing is or is not a red flag.
- Use an explicit severity field for each risk entry with a uniform ordinal scale defined once at the top of the report.
- Close each issue entry with a concise action recommendation that names the responsible role and the timing pressure or milestone driving the next step.
- Keep the report file as the primary deliverable and ensure it is complete and non-empty before any ancillary summary is prepared.
