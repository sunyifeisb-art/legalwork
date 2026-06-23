---
name: extract-rw-from-sale-and-contribution-agreement
task_id: structured-finance-securitization/extract-representations-and-warranties-from-sale-and-contribution-agreement
description: Mapping representations and warranties in a sale and contribution agreement against a tiered compliance framework to identify required representations that are absent, analyze the effects of knowledge qualifiers on risk allocation and enforceability, and identify pool-data characteristics that create existing breach risk.
activates_for: [planner, solver, checker]
---

# Skill: Extract R&Ws from Sale and Contribution Agreement — Compliance Matrix

## 1. Subject-matter triage
- Treat this as a source-document comparison plus issue-spotting exercise, not a pure summary.
- Build the matrix against the framework first, then test the agreement text, then use diligence files only to contextualize gaps, qualifiers, and day-one breach risk.
- Separate three buckets: express matches, partial matches or qualifier changes, and omissions.
- If multiple sellers, asset groups, pools, or closing dates exist, enumerate them first and analyze each separately; do not collapse distinct scopes into one pass.

## 2. Failure modes the skill is correcting
- Reading only the agreement’s affirmative statements and missing framework-required representations that never appear, which are often the most material defects.
- Treating a knowledge-qualified or “to the seller’s knowledge” formulation as equivalent to an absolute representation; the qualifier changes both proof burden and risk allocation.
- Confusing a representation that is merely softened with one that is absent, or vice versa.
- Failing to tie a gap to the source-set facts that show whether the issue is theoretical or already live at closing.
- Describing a defect without stating its severity, transactional effect, and the controlling legal or contract rule that makes it meaningful.

## 3. Legal frameworks / domain conventions that apply
- Use the framework document as the master checklist and the sale-and-contribution agreement as the operative source to test compliance.
- In securitization and whole-loan transfer agreements, representations are often tiered by importance; higher-tier items typically protect title, enforceability, eligibility, and credit quality, while lower-tier items capture operational, documentation, and compliance matters.
- Absence of a high-priority representation is usually more consequential than a missing lower-priority item because it may leave no contractual backstop for a core transaction assumption.
- Knowledge qualifiers, materiality qualifiers, and “no notice” constructions narrow the statement; they may be acceptable in some contexts but should be flagged where the framework calls for an unqualified covenant-style warranty.
- If the source documents identify governing law, bankruptcy principles, consumer-credit requirements, anti-money-laundering rules, sanctions rules, usury limits, or transfer formalities, cite those authorities by name and section or comparable citation form in the analysis.
- For common legal propositions, name the supporting authority rather than stating a conclusion bare; tie the proposition to the contract language and any cited statute, regulation, or doctrine in the source set.

## 4. Analytical scaffolds
- Start with a complete checklist of framework representations and mark each item as:
  - present and conforming,
  - present but qualified or narrowed,
  - partially covered,
  - absent.
- For each item, compare:
  - the framework requirement,
  - the agreement language,
  - any supporting diligence fact that bears on whether the representation is accurate at closing.
- Where a representation is qualified, explain the legal effect of the qualifier:
  - who must know what,
  - whether the statement remains factual or becomes conditional,
  - whether the change affects enforceability, remedy scope, or cure prospects.
- Where a framework item is absent, state whether the omission creates:
  - a pure compliance gap,
  - a gap with potential day-one breach exposure,
  - a risk-allocation gap that shifts losses to the buyer or trust.
- Where diligence facts suggest a breach at closing, identify the factual trigger and explain how it interacts with the specific representation and any related schedule or disclosure item.
- Use the source documents to anchor materiality where possible: loan counts, pool composition, delinquency bands, origination periods, jurisdictional spread, or other transaction metrics found in the record.
- For each issue, include:
  - an ordinal severity label,
  - a concise rationale,
  - the controlling legal or contractual authority,
  - the downstream consequence if the gap is not fixed.
- If only one asset pool or one seller population is in scope, say so explicitly before analyzing; if more than one exists, separate the analysis by scope and by closing-sensitive date.

## 5. Vertical / structural / temporal relationships
- Distinguish signing-date statements from closing-date bring-down concepts and from post-closing survival or indemnity mechanics.
- Note whether a representation is made at the seller level, asset level, loan-level, pool-level, or transfer-level; the same wording can have different consequences depending on the vertical scope.
- Track whether a diligence issue predates signing, exists at closing, or arises only from post-closing performance; do not treat these as interchangeable.
- If the source set includes schedules, exceptions, disclosure exhibits, or loan tapes, cross-reference them where they explain the same issue or reveal a carveout.
- Day-one breach analysis should focus on whether the pool facts already conflict with the representation as of the effective date, not on later servicing performance unless the warranty is forward-looking.

## 6. Output structure conventions
- Produce the compliance matrix in a table-like structure with one row per framework item and columns for:
  - framework requirement,
  - agreement treatment,
  - match status,
  - severity,
  - authority / source anchor,
  - diligence support,
  - consequence.
- Use a stated ordinal severity scale once at the top and apply it consistently.
- Keep “no issue” rows brief but explicit; silence is not a finding.
- For every gap or material qualifier, close the entry with the three required moves: scale it with a source-set figure or scope marker, tie it to another relevant source document or clause, and state the practical consequence.
- End the memo with a short Recommended Actions block that gives imperative next steps, assigns the responsible role, and ties timing to the transaction milestone or the next diligence cutoff.
- Do not rely on formatting alone to convey findings; the written row content must stand on its own.
