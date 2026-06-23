---
name: draft-ppm
task_id: funds-asset-management/draft-ppm
description: Draft a private placement memorandum for a fund offering using a prior fund's PPM as a structural template, reconciling all source documents into a single consistent offering document with the required disclosure sections for a private fund offering.
activates_for: [planner, solver, checker]
---

# Skill: Draft Fund Private Placement Memorandum

## 1. Subject-matter triage

- Treat the prior fund PPM as a template only; the governing fund documents and current offering materials control every substantive term.
- First reconcile the current fund’s economics, governance, disclosures, and legends across all source documents before drafting prose.
- If source documents conflict, the disclosure must follow the controlling document hierarchy and reflect the actual operative terms, not the prior fund’s language.
- Draft the completed PPM as the primary deliverable; any accompanying summary or cover note is secondary and must never substitute for the memorandum itself.

## 2. Failure modes the skill is correcting

- The drafter mirrors the prior fund PPM section by section and leaves stale economics, governance mechanics, or names in place.
- The summary of terms omits core offering economics, governance mechanics, or the investor protections that make the disclosure usable.
- The waterfall, catch-up, and carried-interest language is summarized loosely instead of matching the governing fund terms precisely.
- The key-person section is generic, incomplete, or inconsistent with the time commitments, trigger events, reinstatement mechanics, and vote timing in the source documents.
- The management team section uses boilerplate biographies instead of specific role, employer, education, and representative experience disclosures.
- The risk factor and conflicts sections omit fund-specific risks, side-by-side management issues, affiliate arrangements, board seats, or co-investment allocation concerns.
- The fees and expenses section fails to disclose broken deal expenses and the way they are allocated.
- The cover page and legends do not match the current fund name, offering size, and forward-looking statement language.

## 3. Legal frameworks / domain conventions that apply

- A private placement memorandum is the principal disclosure document for a private fund offering and must be internally consistent with the fund’s operative documents.
- The PPM must accurately disclose material economics, governance rights, risks, conflicts, and subscription mechanics to reduce misrepresentation exposure and investor confusion.
- The cover page should present the fund name, sponsor or manager, offering size, and the required legends, including the forward-looking statements disclaimer if used in the source set.
- The summary of terms should present the offering in a standardized, investor-facing format that allows quick comparison of the current fund’s economics and governance.
- The investment strategy section should describe mandate, asset class focus, geographic or sector scope, use of leverage if applicable, and principal portfolio construction features.
- The risk section should cover market, liquidity, valuation, leverage, concentration, key person, regulatory, tax, and strategy-specific risks, plus any risks unique to the current offering.
- The management team section should identify each key person and provide role, prior employer history, education, and representative investment or operating experience as disclosed.
- The conflicts section should describe material conflicts and mitigation procedures, including multiple vehicle management, affiliate dealings, board service, and allocation processes.
- The fees and expenses section should accurately state management fee mechanics, carried interest, expense allocations, and fundborne costs, including broken deal expenses.
- The distribution waterfall must track the governing fund documents exactly, including tiers, preferred return if any, catch-up mechanics, and residual split.
- If the governing documents use a GP catch-up, describe it as a target allocation until the general partner reaches the agreed profit share, not as an arbitrary standalone split.
- Key-person disclosures must include the relevant persons, the applicable time commitment threshold, trigger events, suspension effect, reinstatement process, voting threshold, and vote timing.
- Subscription and regulatory sections should cover investor eligibility, subscription process, transfer restrictions, ERISA or retirement-plan matters if relevant, tax considerations, and any registration or exemption language reflected in the source materials.

## 4. Analytical scaffolds

- Reconcile first: build a source-by-source map of current fund terms, governing provisions, bios, compliance disclosures, and prior-template carryovers that must be updated or removed.
- Normalize economics: confirm the fund size, term, investment period, fee base, carry, preferred return, recycling, expense allocation, and distribution mechanics are consistent across all materials.
- Align governance: verify key-person mechanics, advisory committee or investor committee references, voting thresholds, suspension consequences, and reinstatement mechanics.
- Draft the offering summary as an investor-facing table or similar compact summary that captures the current fund’s essential economics and governance in one place.
- Draft the waterfall in sequential tiers and ensure each tier is described in the same order and with the same terminology used in the operative documents.
- Draft key-person language with the actual threshold, trigger, effect, vote, and reinstatement timing; avoid leaving these mechanics implicit.
- Draft management biographies using named prior employers, educational background, current responsibilities, and representative transactions or investments disclosed in the source materials.
- Draft conflicts disclosures by identifying each material conflict and then pairing it with the mitigation or allocation practice used by the adviser or sponsor.
- Draft risk factors in a fund-specific way; generic market-risk boilerplate is insufficient where the offering documents identify more specific exposures.
- Draft the cover page and legends last, after the operative economics and governance terms are locked.

## 5. Vertical / structural / temporal relationships

- Treat the PPM as a hierarchy of disclosures: cover and legends first, then offering summary, then strategy and risks, then management and conflicts, then economics, then waterfall, then regulatory and subscription matters.
- Keep all cross-references synchronized across the document; a change in carry, fee base, term, or key-person trigger must propagate through every affected section.
- Preserve temporal logic:
  - investment period mechanics should match the fund term and any suspension periods;
  - key-person suspension should affect the investment period exactly as described in the source documents;
  - reinstatement should occur only through the stated process and within the stated voting window;
  - distribution mechanics should align with the sequence of capital return, preferred return, catch-up, and residual allocation.
- If multiple key persons, conflicts, or investor eligibility categories exist, list and reconcile them explicitly rather than compressing them into a single representative description.
- Do not let the prior PPM’s section order override the current fund’s operative chronology where the source documents require a different presentation.

## 6. Output structure conventions

- Produce a single, polished PPM in conventional fund-offering form, suitable for conversion to `ppm.docx`.
- Use industry-standard headings and subheadings rather than mirroring any hidden checklist.
- Include a concise cover page with the current fund name, sponsor or manager, and required legends.
- Include a clear summary of terms section that captures the principal economic and governance terms in one readable block or table.
- Include separate sections for strategy, risks, management team, conflicts, fees and expenses, distribution waterfall, key-person provisions, regulatory matters, and subscription procedures.
- Ensure every disclosed term is consistent with the governing source documents and with every other section of the PPM.
- Use specific biography disclosures for each key person, not generalized descriptions.
- Include broken deal expense disclosure in the fees and expenses discussion.
- End with subscription mechanics and any investor eligibility or transfer restrictions reflected in the source materials.
- Before finalizing, confirm the document is complete, internally consistent, and reflects the current fund rather than the prior template.
