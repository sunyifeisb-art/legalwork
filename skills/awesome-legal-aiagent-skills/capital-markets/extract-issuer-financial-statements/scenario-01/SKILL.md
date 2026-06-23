---
name: extract-issuer-financial-statements-scenario-01
task_id: capital-markets/extract-issuer-financial-statements/scenario-01
description: Financial statement extraction for a debt offering where the baseline extracts individual line items but does not cross-reference them against the offering materials and financing documents to surface discrepancies and required disclosure enhancements.
activates_for: [planner, solver, checker]
---

# Skill: Extract Issuer Financial Statements — Offering Memorandum Cross-Reference

## 1. Subject-matter triage

Identify the primary reference period first, then anchor every extraction to that period before moving to any interim or prior-period support. Treat the most recent audited annual period as the baseline, and use interim statements only where they are needed for trailing calculations, period-over-period trends, or covenant testing. Treat earlier-dated materials as background unless they supply the controlling definition, limitation, or historical comparator.

When more than one period, metric basis, or document source is in scope, enumerate them explicitly before analysis so the report does not blur annual, interim, and pro forma figures. If only one period is actually relevant for a metric, say so and explain why.

## 2. Failure modes the skill is correcting

- The extraction stops at raw line items and does not reconcile those figures against the offering materials, so inconsistent balance sheet, income statement, or cash flow presentation remains hidden.
- The analysis compares numbers without checking whether the offering materials and financing documents use different definitions for the same concept, especially for adjusted earnings, leverage, debt, and liquidity.
- The draft notes a risk exposure but fails to tie it to the disclosure package, so the offering memorandum omits a needed accounting-policy, risk-factor, or related-party disclosure.
- The work identifies a covenant metric but does not test the calculation against the source definition, the supporting schedule, and the stated period, leaving covenant headroom and compliance status unresolved.
- The report describes an issue qualitatively but does not state its size, its interaction with another source document, or the downstream impact on the offering or disclosure process.

## 3. Legal frameworks / domain conventions that apply

- Trailing financial metric presentation: Debt offering materials commonly present trailing financial performance using annual and interim data together; the calculation must be reconstructed from the source statements rather than assumed from a summary table.
- Debt and capitalization reconciliation: Every debt item appearing in the financial statements that is material to capitalization, liquidity, or covenant compliance should be checked against the offering disclosure and the financing document’s debt concepts.
- Definition alignment: A term sheet or credit agreement may define adjusted earnings, consolidated indebtedness, permitted debt, restricted payments, or leverage differently from the offering memorandum; the report must identify the governing definition and the practical effect of any divergence.
- Disclosure completeness convention: If the financial statements reveal concentration risk, contingent obligations, non-standard revenue recognition, goodwill sensitivity, related-party dealings, or other material accounting judgments, the offering materials should address the point in accounting policy, risk factor, or related-party disclosure form.
- Covenant testing convention: Where the source documents contain a leverage, interest coverage, fixed-charge, or basket calculation, the analysis should recompute the metric from the stated definition and supporting inputs, then note whether the presentation is internally consistent.
- Source hierarchy convention: The financial statements control the reported historical facts; the offering memorandum controls what is being represented to investors; the financing document controls covenant and definitional mechanics. Conflicts among them should be identified, not harmonized silently.

## 4. Analytical scaffolds

- Extract the core financial metrics by period: revenue, gross profit, EBITDA or comparable earnings measure, net income, operating cash flow, capital expenditures, total debt by category, and any pension, tax, litigation, environmental, or other contingent obligation disclosed in the notes.
- Build a period-by-period comparison table so each material figure can be tied to its source page and compared across the financial statements, offering memorandum, and financing document.
- Reconstruct any trailing metric from the underlying annual and interim figures using the source document periods and definitions; show the computation steps in plain language and flag any assumption that is not expressly stated.
- For each covenant metric disclosed in the financing document, test the calculation against the stated definition, the supporting financial statement line items, and any stated exclusions or add-backs.
- For each material discrepancy or omission, identify the source document location, state the size or practical magnitude of the issue using the source figures, explain how another document interacts with it, and state the consequence for disclosure quality, covenant compliance, or investor understanding.
- Compare accounting-policy descriptions, risk factors, and use-of-proceeds language in the offering memorandum against the financial statement notes for gaps that should be surfaced to investors.
- Where the source documents permit more than one plausible treatment, prefer the one that is textually supported by the governing definition and note the alternative as a drafting or diligence point.

## 5. Vertical / structural / temporal relationships

Map each figure to its place in the reporting stack: statement of financial position, income statement, cash flow statement, notes, summary capitalization, offering disclosure, and covenant definition. Do not treat a note disclosure as interchangeable with a face-statement figure unless the source documents make that equivalence explicit.

Track temporal relationships carefully. Distinguish historical annual figures, interim figures, trailing calculations, and any forward-looking disclosure. If a covenant or offering metric uses a different measurement date from the financial statements, state the date mismatch and explain whether the difference affects the result.

Where a debt, liquidity, or earnings concept appears in more than one document, show the relationship among them rather than collapsing them into a single number. Separate reported history, adjusted presentation, and covenant-defined presentation.

## 6. Output structure conventions

- Produce a structured extraction report suitable for direct insertion into the named deliverable file.
- Use conventional sections, not a rigid rubric mirror: brief source overview; period and document map; key financial metrics table; trailing or covenant calculation table where relevant; discrepancy and disclosure-gap analysis; recommendations for disclosure or calculation cleanup.
- For each issue entry, include:
  - an ordinal severity label using a single scale stated once at the top of the report,
  - the source documents and page references,
  - the quantitative size or scope of the issue,
  - the related document or definition that must be read together with it,
  - the consequence for the offering memorandum, covenant compliance, or investor interpretation,
  - a concise recommended fix.
- Keep issue entries self-contained and complete; do not leave them as bare observations.
- End with a Recommended Actions section that states the operative next steps in imperative form, assigns them to the relevant role named in the source materials when available, and ties them to the offering or closing timeline.
- If the analysis relies on a legal or definitional proposition, identify the controlling authority or governing source by name and section, rather than asserting the point abstractly.
- Write the report so that the plain text alone preserves every substantive conclusion, even if tables are reformatted in the .docx file.
