---
name: analyze-sellers-counsel-markup-spa
task_id: corporate-ma/analyze-sellers-counsel-markup-of-stock-purchase-agreement
description: Guides buyer-side analysis of a seller-side markup of a stock purchase agreement by requiring a two-pass review that separates disclosed changes from silent ones and assesses the combined economic effect of interacting indemnification revisions.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Seller's Counsel Markup of Stock Purchase Agreement

## 1. Subject-matter triage (only if applicable)

- Treat the seller markup as a comparison exercise across the seller markup, the buyer’s draft, the executed LOI, and the negotiation playbook.
- Confirm whether the markup is a full-form revision or a limited issue list with embedded edits; if both are present, analyze both.
- Identify whether one seller version or multiple revised rounds are in scope; if more than one, analyze each round separately before synthesizing.
- If the transaction documents include multiple sellers, financing sources, or alternative closing structures, separate those tracks before evaluating risk allocation.

## 2. Failure modes the skill is correcting

- Analyzing edits clause-by-clause without testing how multiple indemnification changes can combine to reduce practical buyer recovery.
- Missing substantive edits that were not disclosed in the seller cover note and therefore require heightened scrutiny as silent changes.
- Treating a change as cosmetic when it alters the economic allocation of risk, enforceability, closing conditions, or post-closing remedies.
- Reviewing the seller markup without tying each deviation back to the LOI and the playbook, which can cause loss of negotiated leverage.
- Failing to distinguish between buyer-favorable, market, and seller-offensive positions when recommending a response.

## 3. Legal frameworks / domain conventions that apply

- Purchase price mechanics: identify whether the markup changes fixed consideration, rollover treatment, escrow funding, purchase-price adjustment mechanics, or contingent consideration.
- Basket mechanics: a tipping basket is materially more buyer-protective than a deductible basket; any conversion away from a tipping construct is economically adverse.
- Materiality scrape: a scrape broadens indemnity by disregarding qualifiers for specified purposes; narrowing or removing it increases proof burden and can reduce recoverable losses.
- Interplay of basket and scrape: evaluate whether the combined edits shift small-to-mid claims below recovery thresholds while also increasing proof burden.
- Cap and survival regime: note differences between fundamental and non-fundamental representations, survival periods, and any special caps or uncapped carveouts.
- Disclosure-based exclusions: provisions barring recovery for schedule-disclosed matters can eliminate claims even where the disclosed item later proves worse than represented.
- Seller liability structure: joint and several liability is buyer-protective; several-only liability creates allocation and collectability risk.
- Escrow and holdback economics: amount, release timing, dispute mechanics, and sole-exposure language can materially alter available recovery.
- Closing conditions and bring-downs: assess whether new seller-favorable conditions weaken closing certainty or allow opportunistic refusal.
- Restrictive covenants: scope, duration, geography, and enforceability should be checked against market and the deal thesis.
- Regulatory and filing analysis: contingent consideration, voting arrangements, or other structure changes may affect transaction-level filing or regulatory review; assess using the governing antitrust or securities framework identified in the source set.
- Governing authority: where the source documents invoke specific statutory, regulatory, or case authority, cite that authority by name and section in the analysis rather than relying on general characterization.

## 4. Analytical scaffolds

Use a two-pass process.

### Pass 1 — Substantive deviation review
For each material article or provision:
1. Identify the buyer-draft language, the seller change, and the LOI/playbook anchor.
2. State whether the change is favorable, neutral, or adverse to the buyer.
3. Tie the issue to a scale from the source documents: deal size, escrow size, survival term, claim threshold, covenant duration, or other concrete measure available in the record.
4. Cross-reference any interacting clause, schedule, definition, disclosure letter item, or ancillary agreement that changes the effect of the edit.
5. State the downstream consequence for the buyer: economic, operational, regulatory, or litigation exposure.
6. Assign severity using a uniform ordinal scale and explain the label in one line.

### Pass 2 — Silent-changes audit
- Separate changes disclosed in the seller cover communication from changes that were not disclosed.
- List silent changes as a distinct set requiring heightened scrutiny, even if the substantive position is only moderately adverse.
- Flag whether the silent change appears to be a drafting cleanup, a negotiated concession, or a hidden risk-shift.

### Core issue areas to test
- Consideration and purchase-price mechanics
- Representations and warranties
- Indemnification, baskets, scrapes, caps, survival, and special escrows
- Disclosure schedule carveouts and exceptions
- Closing conditions, bring-downs, and termination rights
- Restrictive covenants, non-solicit, non-compete, and confidentiality
- Liability allocation among sellers and any recovery limitations
- Regulatory, antitrust, securities, or other filing consequences
- Ancillary agreements that reallocate economics or remedies

### Compounding-risk analysis
- Test whether multiple seller-favorable edits interact to create a larger practical effect than any single edit suggests.
- Give special attention to combinations that reduce claim access, increase proof burden, shorten survival, or cap recoveries.
- If one clause changes the economics and another changes the enforcement pathway, evaluate the combined effect as a single risk cluster.

### Severity scale
- Critical: likely to defeat a core buyer protection, materially impair closing certainty, or shift a major economic risk.
- High: materially adverse but not necessarily deal-breaking.
- Medium: meaningful risk or leverage loss that should be negotiated.
- Low: drafting, clarity, or limited market-position issue.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track the order of documents: LOI first, then buyer draft, then seller markup, then any later clarification.
- If a provision depends on defined terms elsewhere, analyze the definition first and then the operative clause.
- If a risk depends on timing, separate pre-closing, closing, and post-closing effects.
- If one edit narrows a right in the agreement while another edit in an ancillary document partially restores it, analyze the vertical interaction rather than each document in isolation.
- When multiple parties or entities are involved, distinguish which obligations are joint, several, guaranteed, capped, or excluded.

## 6. Output structure conventions

- Open with a short executive summary stating the overall seller posture and the most important negotiation themes.
- Use an issue-by-issue deviation report organized by article/provision, with each entry containing:
  - Provision name
  - Buyer draft baseline
  - Seller markup change
  - LOI/playbook alignment or deviation
  - Severity
  - Economic/legal impact
  - Interaction with other clauses or documents
  - Recommended buyer response
- Include a separate silent-changes section for undisclosed edits.
- Include a compounding-effect section for interacting indemnity or remedy changes.
- Include a negotiation memo that ranks issues by priority and gives a proposed response and fallback for each material point.
- Every substantive legal proposition should be tied to the governing authority, contract provision, or source-document anchor supporting it.
- End with an explicit Recommended Actions block that assigns the next step to the relevant role and ties it to the transaction timetable or the next negotiation milestone.
- Use robust change notation in the analysis when describing edits so the reader can identify the substance of each change even if formatting is lost in export.
