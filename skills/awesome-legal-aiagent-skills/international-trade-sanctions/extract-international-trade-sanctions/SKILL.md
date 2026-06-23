---
name: its-extract-trade-sanctions-entity-details
task_id: international-trade-sanctions/extract-international-trade-sanctions
description: Produces an entity extraction risk report from a trade finance transaction package that screens all parties across the deal chain, analyzes screening discrepancies including birth-date mismatches, flags free-zone opacity risks, and identifies shipping term anomalies indicative of transshipment diversion.
activates_for: [planner, solver, checker]
---

# Skill: Extract Entity Details from International Trade and Sanctions Transaction Request

## 1. Subject-matter triage

Treat the package as a chain-of-parties exercise, not a single-counterparty review. Extract every entity visible in the request, screening results, transfer instructions, invoices, packing materials, and shipping documents, then separate them by role and document source.

Prioritize entities that create indirect sanctions exposure: primary buyer/seller roles, applicant/beneficiary and any payment-side institutions, named shippers/carriers/agents, and upstream or downstream suppliers or manufacturers disclosed in supporting trade documents.

If the package is incomplete or contradictory, preserve the uncertainty in the extraction rather than resolving it silently. Distinguish what is stated, what is inferred, and what remains unverified.

## 2. Failure modes the skill is correcting

- Screening only the named counterparties and omitting banks, intermediaries, agents, or suppliers that appear elsewhere in the package
- Merging multiple similarly named entities into one record instead of extracting each separately with its own identifiers and source document
- Treating partial identifier mismatches as dispositive clears without comparing the full identifier set across documents
- Overlooking ownership, control, registration, or jurisdiction clues that can change sanctions relevance
- Missing opacity risks where an entity is registered in a free zone or similar limited-disclosure jurisdiction
- Ignoring route, origin, destination, or Incoterms inconsistencies that may indicate diversion or transshipment risk
- Writing a narrative summary without a structured party-by-party risk view and action-oriented flags

## 3. Legal frameworks / domain conventions that apply

- Sanctions screening is entity-specific: each named or reasonably identifiable party should be evaluated separately against applicable restrictions, ownership/control concepts, and list-based matches.
- Matching analysis is holistic: a discrepancy in one field, including date of birth, does not end the inquiry if other identifiers still align; compare name, aliases, nationality, address, registration data, vessel or bank identifiers, and document context.
- Beneficial ownership opacity is a due-diligence risk factor: limited disclosure regimes, free-zone registrations, nominee structures, or sparse corporate data warrant escalation for ownership confirmation before reliance.
- Trade-chain screening extends beyond the direct counterparty: banks, shippers, carriers, freight forwarders, insurers, and disclosed suppliers may create sanctions nexus or routing risk even if not the contractual seller or buyer.
- Trade-routing anomalies matter: inconsistent origin, routing, transit points, port calls, or shipping terms may suggest transshipment, diversion, or a concealed end destination and should be flagged for enhanced review.
- The report should follow the source documents’ legal and commercial framing where available, but should not invent missing facts or assume that a screening result is definitive absent full identifier comparison.

## 4. Analytical scaffolds

1. Build a complete party inventory from the entire package, grouping by role while keeping each entity separate.
2. For each entity, record the exact name, role, document source, jurisdiction, identifiers, and any ownership or control clues available.
3. Separate banking institutions from commercial counterparties and screen each institution individually using the identifiers provided in the package.
4. Compare every potential match against all available identifiers before classifying it as clear, possible, or likely; explain why any mismatch does or does not matter.
5. Treat free-zone or similarly opaque registrations as an independent risk flag even if no list match is confirmed.
6. Review shipping terms, route, origin, destination, and document consistency for diversion indicators; flag any unexplained transit or routing mismatch.
7. Capture the transaction value and other commercial terms if stated, but do not force missing financial arithmetic into the report.
8. If more than one entity is present in scope, enumerate them explicitly before analysis and keep one row or entry per entity.

## 5. Vertical / structural / temporal relationships

Map the transaction vertically from origin to destination and horizontally across all intermediaries. Keep the extraction aligned to document sequence so that later documents can confirm, refine, or contradict earlier ones.

Track time-sensitive changes where the package shows multiple dates, amendments, revised screening results, or updated shipping instructions. Do not collapse earlier and later records into a single snapshot unless the documents clearly supersede prior information.

Preserve chain-of-custody context where a party appears in one document as a supplier, in another as a shipper, and in another as a payment beneficiary. Those role shifts can be analytically material and should be visible in the report.

## 6. Output structure conventions

- Write a risk-flagging entity extraction report in a conventional compliance-review format, organized by party category and then by individual entity.
- Include a short transaction overview with the governing deal terms, stated value if provided, and any route or origin/destination anomalies.
- For each entity, include: role, source document, identifiers, screening result, risk flag, and brief rationale.
- Use an ordinal severity label consistently for each issue or entity flag, with the scale defined once at the outset and applied uniformly.
- Keep conclusions tied to the source package; do not overstate certainty where the documents support only a potential match or an incomplete screen.
- End with concise next-step recommendations that assign the action to the relevant business or compliance owner and tie it to the transactional milestone or screening event.
