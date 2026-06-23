---
name: scenario-02
task_id: real-estate/extract-psa-key-terms/scenario-02
description: Guides extraction of key terms from a commercial property purchase and sale agreement into a structured term sheet by reading the agreement carefully, cross-referencing supporting documents for issues, and organizing output by topic for client and partner use.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Commercial Property Purchase and Sale Agreement

## 1. Subject-matter triage

- Treat the PSA as the primary source and the supporting diligence materials as issue-amplifiers, not replacements for the deal documents.
- Confirm whether the record set includes one property, multiple parcels, or layered ownership/occupancy interests; if multiple are present, separate the analysis by asset or interest before drafting the term sheet.
- Distinguish core economic terms from diligence-driven risk terms, then from mechanics and closing logistics.
- If the file includes client instructions or issue lists, treat them as controlling priorities for what to surface and flag.

## 2. Failure modes the skill is correcting

- Extraction is done from the PSA alone, so diligence findings that affect title, environmental risk, use restrictions, or closing risk are missed.
- The output is a flat recap instead of a topic-based term sheet that a real estate lawyer can use for underwriting and negotiation.
- Key terms are stated without section citations, exhibit references, or schedule cross-references, making verification difficult.
- Unusual, seller-favorable, ambiguous, or internally inconsistent provisions are described but not flagged as issues.
- Supporting documents are summarized generically rather than tied back to the specific PSA provisions they affect.
- The draft reads like a narrative memo instead of a deal term sheet with clear headings and issue calls.
- The work assumes one set of terms when the file may contain multiple properties, parties, contingencies, or closing tracks that must be separated.

## 3. Legal frameworks / domain conventions that apply

- Use standard PSA topic groupings: parties and transaction structure; property description and included/excluded assets; purchase price and deposit mechanics; due diligence and inspection rights; title, survey, and objection process; representations, warranties, and disclaimers; covenants between signing and closing; conditions to closing; casualty, condemnation, default, and remedies; prorations, closing costs, and closing deliverables.
- Cross-reference the PSA with any exhibits, schedules, addenda, disclosures, title commitments, surveys, environmental reports, lease abstracts, estoppels, or other diligence materials when they alter the meaning or risk profile of a PSA term.
- Read defined terms in the context of their definitions and any incorporated schedules; do not extract a term in isolation if its content is materially shaped by a definition or exhibit.
- Issue-spotting should focus on deviations from market expectations, ambiguity, internal inconsistency, missing protections, or mismatches between diligence findings and contract allocation of risk.
- When a provision depends on a legal standard or market convention, identify the governing doctrine or document-based authority in the analysis rather than implying a conclusion without support.
- When the agreement allocates obligations across periods or entities, note the operative timing and the responsible party.

## 4. Analytical scaffolds

- Read the entire PSA first, then the supporting documents, then return to the PSA to extract terms in light of the diligence record.
- Build the term sheet by topic, not by article order, but preserve each controlling section reference and any exhibit or schedule citation.
- For each topic, state the operative business term in plain language, then note the contractual source, then identify any issue or inconsistency.
- If the same concept appears in multiple places, synthesize it into one topic entry and cite all relevant locations.
- If the file contains more than one property, party, closing condition, date, or diligence issue, list the full set explicitly before analysis and keep the rows separate.
- For each identified issue, explain why it matters in transaction terms, how it interacts with another provision or document, and what the likely consequence is for the client.
- Give special attention to timing provisions, cure periods, election rights, notice mechanics, and survival/liability limits, because these often control the practical effect of the deal.
- Treat omissions as issues when a standard PSA topic is absent but should be present to understand risk allocation or closing mechanics.

## 5. Vertical / structural / temporal relationships

- Track the sequence from signing through due diligence, title/survey objections, cure periods, closing conditions, closing, and post-closing survival.
- Note how an issue in one document can change the operation of another provision later in the timeline, especially where diligence findings affect closing conditions, indemnities, or termination rights.
- If the PSA contains layered obligations that depend on a later event or election, make the dependency explicit so the reader can see the trigger, the actor, and the consequence.
- Where a term is shared across schedules, exhibits, and body provisions, identify which document controls if there is a conflict.
- If multiple assets or counterparties are involved, keep their rights and obligations separate so the term sheet does not blur distinctions that matter at closing or after closing.

## 6. Output structure conventions

- Deliver the output as a term sheet organized by topic with concise headings and subheadings that mirror a real estate attorney’s review path.
- Under each topic, include:
  - the extracted term in plain English,
  - the controlling PSA section and any related exhibit or schedule reference,
  - any issue flag with a short explanation of the concern.
- Use a consistent, readable format so each topic can be scanned quickly; do not bury source references inside prose.
- Make issue flags visually distinct from the extracted term, using a separate line or label.
- Where a topic is not expressly addressed in the PSA but is important for deal understanding, note the omission as an issue rather than inventing a term.
- Keep the document practical and client-facing: concise enough for use, but detailed enough to support negotiation and diligence review.
- Name the deliverable exactly as instructed: `psa-term-sheet.docx`.
