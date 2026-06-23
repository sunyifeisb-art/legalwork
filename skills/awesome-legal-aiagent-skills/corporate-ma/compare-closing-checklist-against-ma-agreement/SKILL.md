---
name: compare-closing-checklist-vs-ma-agreement
task_id: corporate-ma/compare-closing-checklist-against-ma-agreement
description: Guides a two-directional comparison between an acquisition agreement and a closing checklist to identify missing items, inaccurate terms, and miscategorized deliverables, with verification of stated figures against the agreement’s formulas and defined terms.
activates_for: [planner, solver, checker]
---

# Skill: Compare Closing Checklist Against M&A Agreement

## 1. Subject-matter triage

- Confirm the source set includes both the APA and the closing checklist; if any related closing deliverable schedule, exhibit, or defined-term sheet is attached, treat it as part of the same comparison set.
- Identify whether the checklist is organized by party, condition type, document type, or closing step; preserve that structure while checking it against the agreement.
- Determine whether the agreement contains multiple closing conditions, multiple deliverable buckets, or multiple payment mechanics; analyze each separately rather than as a blended summary.
- If the checklist states amounts, dates, parties, or payment mechanics, treat those as verification targets, not assumptions.

## 2. Failure modes the skill is correcting

- Checking only whether checklist entries appear somewhere in the agreement, without also checking whether required agreement items are missing from the checklist.
- Treating generic closing language as sufficient when the agreement requires a specific deliverable, form, recipient, condition, or party identification.
- Missing category-specific deliverables that are embedded in particular provisions and commonly omitted from standard checklists.
- Accepting stated amounts, timing, or net payment descriptions without independently testing them against the agreement’s formulas and defined terms.
- Failing to distinguish an omitted item from a miscategorized item or a materially inaccurate item.
- Collapsing multiple closing conditions, properties, counterparties, or deliverables into a single representative finding.

## 3. Legal frameworks / domain conventions that apply

- Transactional closing deliverables are controlled by the APA’s express condition, covenant, exhibit, and schedule language; the checklist should mirror the agreement’s actual closing obligations, not an industry template.
- If the agreement requires certificates, consents, releases, payoff statements, estoppels, insurance items, transfer documents, or similar third-party deliverables, the checklist should reflect each required item at the same level of specificity.
- If the agreement uses defined terms for purchase price, adjustments, escrow, holdback, or net payment mechanics, the checklist should use those same mechanics and not paraphrase them into a different commercial result.
- Title, real-property, lease, lender, and other third-party deliverables often attach to specific assets, parcels, locations, or counterparties; the checklist must preserve those linkages.
- Any numerical statement in the checklist should be tested against the agreement’s defined terms, formulas, offsets, and timing triggers before it is reported as accurate.

## 4. Analytical scaffolds

Conduct the comparison in two passes.

### Pass 1 — Agreement to checklist
- Read the agreement’s closing conditions, required deliverables, and any schedule- or exhibit-based obligations.
- Separate mandatory closing items from post-closing covenants and from background transaction provisions.
- For each required item, confirm whether the checklist contains a corresponding entry.
- If a required item is absent, classify it as a missing item and note the agreement section that creates the obligation.
- If a required item is present but placed in the wrong category, treat it as a categorization deviation, not a pure omission.

### Pass 2 — Checklist to agreement
- For each checklist line item, verify that the description matches the governing agreement provision.
- Check whether the checklist states the correct party, recipient, form, timing, condition, or asset/counterparty linkage.
- Verify all stated amounts, formulas, offsets, and net figures against the agreement’s defined terms and closing mechanics.
- If the checklist combines multiple agreement requirements into one entry, determine whether that combination obscures a substantive difference.
- If the checklist states a deliverable that is not found in the agreement, report it as an unsupported or overbroad checklist item.

### Evaluation discipline
- Make each finding self-contained: identify the checklist text, the controlling agreement reference, the nature of the deviation, and the practical effect.
- Where the agreement admits multiple applicable items, enumerate them before analysis and report each separately.
- Do not infer compliance from similarity of wording alone; check the operative obligation, not the label.

## 5. Vertical / structural / temporal relationships

- Track how a closing item relates to the agreement’s condition-precedent architecture: buyer conditions, seller conditions, and mutual conditions may impose different deliverables and timing.
- Preserve any hierarchy between master deliverables and sub-deliverables, such as a global consent requirement that depends on asset-level or counterparty-level consents.
- Distinguish pre-closing, closing, and post-closing deliverables; a checklist entry is inaccurate if it moves a deliverable into the wrong temporal bucket.
- If an obligation depends on a defined closing date, funding date, or effective time, test the checklist’s timing language against that trigger.
- Where multiple assets, properties, leases, or counterparties are implicated, assess each distinct vertical thread separately rather than treating them as fungible.

## 6. Output structure conventions

- Produce a deviation report organized by severity using an ordinal scale defined once at the top, such as Critical / High / Medium / Low.
- Include a short severity rationale for each entry so the reader can see why the item sits in that tier.
- Group findings by deviation type, at minimum:
  - missing items required by the agreement
  - inaccurate checklist items
  - miscategorized or mis-timed items
  - unsupported checklist items not grounded in the agreement
  - numerical or mechanics mismatches
- For each finding, include:
  - severity
  - checklist entry or omitted deliverable
  - controlling agreement reference
  - concise description of the deviation
  - why it matters in transaction terms
  - recommended correction
- Where numbers appear in the checklist, show the calculation path or defined-term basis used to test them, but do not invent scenario-specific figures.
- End with a Recommended Actions block that assigns each action to a role and a timing anchor tied to the closing process.
- Keep the write-up concise, but ensure every finding closes the loop from deviation to agreement reference to transaction consequence to fix.
