---
name: extract-key-terms-from-section-16-filings
task_id: capital-markets/extract-key-terms-from-section-16-filings
description: Section 16 filing extraction where the baseline captures reported transaction data, but the workflow also checks arithmetic consistency, ownership computations, timing, indirect ownership, derivative terms, and potential short-swing exposure at a procedural level.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Section 16 Filings

## 1. Subject-matter triage

When multiple reporting persons, dates, or filing types appear, enumerate them first and organize the record set by reporting person, then chronologically within each person. Treat any compliance memo, cover letter, or narrative summary as context only; verify every filing independently against the source set.

## 2. Failure modes the skill is correcting

- Report extraction may capture the stated trade terms but miss internal consistency checks; compare prior holdings, reported transaction quantity, and ending holdings to identify mismatches.
- Report extraction may repeat stated ownership figures without computing the full beneficial ownership position from the available holdings and derivative interests.
- Report extraction may omit derivative-security detail buried in footnotes; capture exercise features, vesting, expiration, performance conditions, and any other qualifiers that affect economic exposure.
- Report extraction may ignore indirect ownership through entities or shared arrangements; separate direct from indirect holdings and identify the ownership channel.
- Report extraction may note filing dates without assessing whether the filing timing aligns with the applicable reporting window.
- Report extraction may describe trades in isolation without checking for a six-month purchase-sale or sale-purchase pairing that could raise short-swing profit exposure.
- Report extraction may summarize disclosures without flagging discrepancies between tables, footnotes, cover-page data, and narrative explanations.

## 3. Legal frameworks / domain conventions that apply

- Section 16 reporting requires attention to the transaction date, filing date, and the applicable business-day reporting window.
- Beneficial ownership analysis includes direct holdings, indirect holdings, and interests attributable to currently exercisable or otherwise countable derivative positions, as disclosed in the materials.
- Short-swing exposure analysis under Section 16(b) turns on matching purchases and sales within a six-month period, without regard to intent.
- Derivative disclosures should be read together with the transaction table and any footnotes describing vesting, settlement, conversion, exercise, or expiration mechanics.
- Indirect ownership disclosures should preserve the form of holding, the intermediary, and any control or attribution language used in the source materials.
- Any trading-plan disclosure should be reviewed for timing and relation to other disclosed events that may bear on the compliance review.

## 4. Analytical scaffolds

- First list every reporting person and every filing/date combination in scope; if only one person is involved, state that explicitly and explain why.
- For each reporting person, extract all reported transactions in chronological order with date, form type, transaction type, security class, quantity, price or other consideration, and post-transaction holdings.
- Check arithmetic for each transaction by comparing the pre-transaction position, the reported trade size, and the post-transaction position; flag any inconsistency.
- Compute the beneficial ownership picture from the record as a whole, including direct, indirect, and derivative-related holdings where the source materials support inclusion.
- Extract all derivative-security terms from the relevant table and footnotes, including vesting or performance conditions, settlement mechanics, expiration, and any special qualifiers.
- Identify all indirect ownership positions and describe the holding chain or arrangement that creates them.
- Compare transaction dates and filing dates to assess timeliness under the applicable reporting window.
- Scan the transaction history for purchase-sale and sale-purchase pairings within any six-month period that could create short-swing profit exposure.
- Note any discrepancies between the cover page, transaction tables, footnotes, and memo disclosures; do not reconcile away conflicts unless the sources clearly permit it.

## 5. Vertical / structural / temporal relationships

Treat the filing record as layered: cover-page totals, transaction tables, derivative tables, and footnotes may each supply different pieces of the same ownership picture. Use the most specific source for transaction mechanics, but keep cover-page data and memo statements available for cross-checking. Preserve chronology rigorously: transaction date, filing date, and any plan-adoption or event timing should be analyzed in that order so that reporting compliance and short-swing exposure are not conflated. When a single person has multiple transactions, evaluate them as a sequence rather than as isolated entries.

## 6. Output structure conventions

- Use a structured extraction report organized by reporting person.
- Include a short scope and source inventory up front.
- For each person, provide a transaction table with date, form type, transaction type, security class, quantity, price/consideration, and post-transaction holdings.
- Provide a derivative-securities table for each person with security type, vesting or performance terms, expiration or settlement mechanics, and any relevant footnote qualifiers.
- Provide an ownership summary for each person distinguishing direct holdings, indirect holdings, and derivative-related interests.
- Provide a timeliness check for each filing and a short-swing exposure assessment tied to the transaction sequence.
- Include a discrepancy list that flags arithmetic issues, table-to-footnote conflicts, missing data points, and any other internal inconsistencies.
- If no issue is found in a category, say so affirmatively rather than leaving the category blank.
- End with concise follow-up actions directed to the reviewer or filer, using imperative language and tying each action to the relevant reporting deadline or filing milestone.
