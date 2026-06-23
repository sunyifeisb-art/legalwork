---
name: build-deal-points-library-s01
task_id: corporate-ma/build-deal-points-library/scenario-01
description: Guides construction of a structured M&A deal points library from a set of executed agreements, capturing key economic, indemnification, covenant, and closing-term provisions for benchmarking and precedent research.
activates_for: [planner, solver, checker]
---

# Skill: Build Deal Points Library (Scenario 01)

## 1. Subject-matter triage

- Treat the seven executed agreements as separate precedent records, not one blended dataset.
- Read each agreement for its actual operative terms; do not infer missing fields from market memory when the document is silent.
- Because the task asks for both a library and a partner memo, complete the library first and then synthesize trends, outliers, and drafting implications.
- When multiple deals, escrows, earnouts, or covered persons appear, enumerate each one explicitly before comparing them.

## 2. Failure modes the skill is correcting

- Collapsing multi-component consideration into one deal value instead of recording each economic component with its own terms.
- Merging distinct escrows, baskets, caps, or survival periods into a single entry.
- Mixing precise extracted terms with approximations, ranges, or “market” guesses that make the library unusable.
- Missing a transaction-specific provision because the reviewer scanned for headline economics only.
- Treating one precedent as representative when the seven deals show meaningful variation by structure, industry, or seller group.
- Writing the memo as a narrative summary without isolating true trends, clear outliers, and structuring implications for future drafting.

## 3. Legal frameworks / domain conventions that apply

- A deal points library is a precedent database: each field should capture the agreement’s actual term, not a paraphrase.
- Private M&A consideration often includes multiple economic layers that must be separated: cash at closing, deferred consideration, rollover equity, notes, and contingent payments.
- Indemnification terms must be captured as a package: basket form, basket amount, cap structure, survival period, and any carve-outs or special regimes.
- If multiple escrows exist, each one must be treated as a distinct economic and risk-allocation device with its own purpose, size, and release mechanics.
- Earnouts require the measurement framework, trigger, time window, cap, and operating restrictions that make the contingent payment meaningful.
- Non-compete and related restrictive covenants should be captured by covered person, scope, duration, and geography where applicable.
- Governing law, closing conditions, and buyer/seller-specific deal protections are part of the precedent value and should not be relegated to miscellaneous notes.
- For the partner memo, legal significance comes from patterns in term allocation, not from restating every term in every deal.

## 4. Analytical scaffolds

- Build one transaction record per agreement, then complete the same field set for every record to preserve comparability.
- Start with transaction identification and structure, then move from economics to risk allocation to closing mechanics:
  1. Transaction date and deal type
  2. Industry or business segment
  3. Structure and governing law
  4. Deal size / value metrics as stated in the agreement materials
  5. Consideration components
  6. Purchase price adjustment or contingent consideration mechanism
  7. Indemnification package
  8. Escrows and holdbacks
  9. Restrictive covenants
  10. RWI or similar risk-transfer features
  11. Closing conditions and special covenants
  12. Other transaction-specific protections or deviations
- For each consideration component, record the component and its operative terms separately rather than combining them into one blended price line.
- For each earnout or deferred payment feature, capture the metric, measurement period, threshold, cap, and any conduct restrictions that affect payment.
- For each indemnity regime, record the basket type, basket size, cap, special cap carve-outs, and survival periods by claim category where the agreement differentiates them.
- For each escrow, record purpose, amount, duration, release timing, and whether it applies to general indemnity, specific indemnity, tax, purchase price adjustment, or another function.
- For restrictive covenants, record each covered person separately if the terms differ across individuals or groups.
- After extracting all fields, compare the seven records side by side to identify repeat provisions, negotiated departures, and any unusual risk allocations.
- In the memo, distinguish true market patterns from single-deal anomalies and explain why the outlier matters for structuring or negotiation.

## 5. Vertical / structural / temporal relationships

- Preserve the hierarchy between the transaction-level record and the clause-level detail; do not let a single clause overwrite the deal’s overall structure.
- Where a term depends on another term, capture the dependency explicitly:
  - escrow release timing depends on claim survival and notice mechanics;
  - earnout payment depends on measurement period and operating covenants;
  - indemnity cap analysis depends on basket type and carve-outs;
  - restrictive covenant scope depends on the identity of the covered person.
- When a deal has multiple temporal regimes, keep them separate: signing-to-closing conditions, post-closing survival periods, escrow release dates, earnout measurement windows, and covenant durations are not interchangeable.
- If the source documents contain multiple periods or thresholds, list them in chronological or logical order before drawing conclusions.
- In the partner memo, separate deal-by-deal observations from cross-portfolio trends so the reader can see what is transaction-specific versus market-significant.

## 6. Output structure conventions

- Draft the deal points library as a clean comparison table or spreadsheet-style matrix with one row per transaction and one column per field.
- Use consistent field names across all rows so that differences reflect deal terms, not formatting drift.
- Keep comments concise and term-specific; avoid narrative prose inside library cells unless the template requires it.
- Where a field does not apply, use a clear non-applicability marker rather than leaving ambiguity.
- Use separate entries for separate escrows, notes, earnouts, covenant groups, and special indemnity regimes.
- The executive summary memo should open with the main market takeaways, then cover:
  - recurring terms;
  - meaningful deviations;
  - drafting or negotiation implications;
  - any deal-specific caution points for future precedents.
- End the memo with direct recommendations for how the precedent set should influence future deal drafting, diligence focus, or negotiation posture.
- Before finalizing, confirm that the library file is complete and populated, and that the memo contains substantive trend analysis rather than a restatement of the table.
