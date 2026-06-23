---
name: analyze-escrow-agreement-markup
task_id: corporate-ma/analyze-escrow-agreement-markup
description: Guides buyer-side review of an escrow agreement markup by cross-referencing the acquisition agreement and internal playbook to identify procedural traps, release-timing mismatches, and conflicts with the agreed deal terms.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Escrow Agreement Markup

## 2. Failure modes the skill is correcting

- Reviewing the escrow markup in isolation instead of checking it against the buyer-form draft, the signed acquisition agreement, and the escrow playbook
- Missing provisions that shift bargaining risk through release timing, fee allocation, investment policy, dispute mechanics, or indemnity administration
- Treating procedural language as boilerplate when it can extinguish a claim on technical grounds or delay access to collateral
- Overlooking whether the escrow structure matches the deal’s survival, indemnity, and special-risk architecture
- Failing to identify deviations that require express consent because they conflict with the agreed acquisition-agreement exhibit form or integrated escrow mechanics
- Not converting redline observations into a prioritized recommendation set with concrete counter-language

## 3. Legal frameworks / domain conventions that apply

- The escrow agreement is an implementation document: it should track the acquisition agreement’s agreed economics, claim procedures, and survival structure unless the deal papers expressly permit deviation
- General escrow release timing should be tested against the applicable representation survival period; a release before survival expires can leave the buyer without collateral for late-arising claims
- Any separate escrow for a known or specific risk should be assessed against the claim period for that risk, not assumed to follow the general escrow timetable
- Claim notice mechanics matter: provisions that void claims for form defects, missing attachments, or failure to state a loss amount can operate as forfeitures of substantive indemnity rights
- Escrow-agent fee allocation is both an economic and leverage issue and should be matched to the buyer-form and acquisition agreement
- Investment mandates should preserve principal and liquidity; permissive investment language that increases loss risk is a substantive deviation, not a housekeeping point
- Governing law and dispute mechanics should align with the acquisition agreement and the escrow playbook; a mismatch can create interpretive conflict and enforcement friction
- For any legal conclusion, identify the governing authority or controlling contract provision supporting it rather than stating the conclusion in bare form

## 4. Analytical scaffolds

1. Inventory the document set first:
   - buyer-form escrow draft
   - seller markup
   - signed acquisition agreement
   - firm escrow playbook
   If only one escrow arrangement is in scope, say so expressly and explain why.
2. Review the markup provision by provision, but organize the analysis by deal function:
   - escrow amount and funding mechanics
   - release timing
   - claim submission and notice formalities
   - dispute resolution and agent authority
   - fee allocation and indemnification of the agent
   - permitted investments and cash management
   - governing law and interpretive hierarchy
3. For each changed provision, state:
   - what changed from the buyer form
   - whether it deviates from the signed acquisition agreement or playbook
   - the legal or economic effect on the buyer
   - the recommended counter-language
4. When a provision interacts with another document, name the interaction explicitly:
   - escrow release versus survival period
   - special escrow versus specific indemnity period
   - notice cure deadlines versus claim preservation
   - fee allocation versus transaction cost allocation in the deal papers
5. Treat any provision that can silently waive rights, shorten claim windows, or redirect control over disputed funds as priority material, even if it appears procedural.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare the general escrow release date to the representation survival end date to identify any gap in collateral coverage
- If multiple escrows exist, analyze each separately: general indemnity escrow, purchase price adjustment escrow, and any special-purpose or risk-specific escrow
- Check whether any special escrow is co-terminus with the specific indemnity period it supports
- Test any notice cure period, deemed-invalid provision, or objection deadline against the practical time needed to discover, quantify, and submit a claim
- Confirm whether the document hierarchy or conflict clause gives the acquisition agreement primacy over the escrow agreement where the two diverge
- Note whether the dispute process preserves access to withheld funds during a claim dispute or shifts leverage to the seller or escrow agent

## 6. Output structure conventions

- Produce a prioritized issues memo in a conventional legal memo format, not a bare issue list
- Define the severity scale once at the top and use it consistently for every issue: Critical / High / Medium / Low
- For each issue, include:
  - provision reference
  - original language
  - seller change
  - severity
  - conflict status
  - legal or economic impact
  - recommended counter-language
- Each issue should be closed with three elements:
  - a quantified or bounded reference drawn from the source documents, where available
  - a cross-reference to the interacting clause or document
  - the downstream consequence for the buyer
- Include a short acquisition-agreement conflict section identifying every deviation that requires consent or express harmonization
- Include a closing Recommended Actions section with imperative steps, assigned to the responsible role, and tied to the transaction timeline or another source-based urgency anchor
- When giving counter-language, make it redline-ready and plain-text legible; if quoting or revising text, preserve enough context that the reader can implement the change directly
- Do not describe the issue without stating why it matters commercially and how the buyer should respond
