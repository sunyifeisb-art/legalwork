---
name: its-extract-product-specs-export-classification
task_id: international-trade-sanctions/extract-product-specifications-from-technical-data-sheet
description: Produces an export classification memorandum that extracts product specifications from technical data sheets, analyzes whether technical characteristics may implicate export-control jurisdiction, compares stated end-use descriptions across transaction documents for inconsistencies, and outlines when a jurisdictional determination or enhanced diligence may be appropriate.
activates_for: [planner, solver, checker]
---

# Skill: Extract Product Specifications from Technical Data Sheet for Export Classification

## 2. Failure modes the skill is correcting

- Treating an issuer’s self-classification as dispositive without independently extracting the technical features that drive jurisdiction and control analysis
- Reading a technical data sheet in isolation instead of comparing it against the memo, purchase order, end-use statements, and screening outputs for mismatches or risk signals
- Missing layered ownership, indirect control, or restricted-party issues where the counterparty is a holding company or otherwise structurally opaque
- Overlooking routing, transshipment, free-zone, or similar path markers that may suggest diversion risk
- Failing to distinguish jurisdiction questions from de minimis questions, or applying a foreign-content concept to a U.S.-produced item as if it were a jurisdictional escape hatch
- Producing a narrative summary that does not tell the reader what issue exists, how serious it is, what document conflict drives it, and what to do next

## 3. Legal frameworks / domain conventions that apply

- Export-control jurisdiction turns on the item’s technical characteristics, not the label in the supplier’s memo; extract specifications such as performance, precision, wavelength, sensitivity, materials, operating modes, integration features, and intended platform fit, then map them to the relevant control regime and ECCN/CCL-style logic if applicable
- For dual-use, navigation, imaging, sensing, guidance, and related equipment, small shifts in range, accuracy, resolution, environmental tolerance, or software functionality can change the classification analysis; treat uncertainty as a reason to escalate for formal determination under the applicable export-control framework
- End-use analysis is document-comparative: a civilian or scientific stated use should be tested against commercial messaging, purchase-order language, technical integration descriptions, and any screening or diligence notes that suggest military, security, surveillance, strategic, or restricted-platform use
- Beneficial ownership and control screening matters where the buyer, ship-to, or end user is a holding company, nominee, intermediary, or layered entity; identify sanctions, restricted-party, and control concerns before concluding the file is clean
- De minimis analysis applies only where the item is foreign-produced and the rule’s controlled-content attribution framework is actually in play; it is not a substitute for jurisdictional analysis and does not by itself remove U.S.-origin items from U.S. export-control reach
- Routing through free zones, transshipment hubs, freight forwarders with opaque instructions, or otherwise indirect paths is a diversion indicator and should be evaluated together with the final destination and end user
- Where the source set omits re-export, retransfer, or end-use restriction language, that omission is a documentation issue to note for follow-up, not a basis to assume the transaction is unrestricted
- Any legal conclusion in the memorandum should be anchored to the governing rule, regulation, or framework being applied rather than stated as a bare label

## 4. Analytical scaffolds

1. Build an item-by-item inventory of the products in scope before analyzing them; if only one item is present, say so and explain why no broader inventory is needed
2. For each item, extract the operative technical specifications from the datasheet and separate objective parameters from marketing language or aspirational descriptions
3. Compare the extracted features against the stated classification memo and identify whether the memo’s conclusion remains supportable on the face of the specifications
4. Test the end-use description across all transaction documents for consistency; note any mismatch between civilian, commercial, scientific, military, security, surveillance, or platform-integration language
5. Review ownership, control, sanctions, and restricted-party information for each relevant counterparty and trace through intermediary entities where the structure is not transparent
6. Review routing and destination information for diversion indicators, including transshipment points, free zones, intermediary consignees, and unusual freight instructions
7. Separate jurisdictional analysis from de minimis analysis; only run the latter where the source documents make foreign-produced content and controlled-content attribution relevant
8. Flag missing restriction language, missing technical details, or unresolved ambiguities as diligence follow-up items rather than silently filling gaps
9. For each issue identified, state the scale of the concern using the figures or descriptors available in the source set, cross-reference the document that creates the tension, and explain the practical consequence for clearance, licensing, screening, or transaction closing
10. If the record does not support a confident conclusion, recommend escalation for a formal jurisdictional determination or enhanced diligence instead of overcommitting to a classification

## 6. Output structure conventions

- Prepare a concise export classification memorandum in a conventional legal-advisory format
- Start with a short executive summary, then proceed item by item through the products
- For each product, include: extracted specifications, classification implications, jurisdictional assessment, end-use consistency check, screening/routing observations, and a clear risk conclusion
- Use an ordinal severity scale defined once at the outset and apply it consistently to each issue identified
- Present issues in a way that makes each one independently reviewable; do not merge distinct classification, end-use, ownership, and routing concerns into a single paragraph
- End with a Recommended Actions section that gives imperative next steps, identifies the responsible role, and ties each recommendation to a timing anchor or transaction milestone
- If the source set includes multiple products or counterparties, organize the memorandum so each row or subsection corresponds to one item; do not collapse multiple items into a generic summary
- Use conventional headings and legal prose; do not reproduce the source document’s section labels verbatim
