---
name: credit-agreement-covenant-extraction
task_id: banking-finance/credit-agreement-covenant-extraction
description: Extracts and compares financial covenants across multiple credit agreements in a multi-tranche capital structure, verifies compliance certificate arithmetic, and assesses cross-agreement change-of-control and cross-default interplay.
activates_for: [planner, solver, checker]
---

# Skill: Financial Covenant Extraction Memo — Multi-Agreement Acquisition Due Diligence

## 1. Subject-matter triage
- Treat the assignment as a multi-document covenant extraction and diligence review, not a generic summary.
- Identify every credit agreement, amendment, joinder, compliance certificate, and related operative document in the record before analyzing any covenant.
- If the source set contains multiple borrowing groups, tranches, or facilities, enumerate them first and analyze each separately before synthesizing cross-document effects.
- If there is only one operative agreement or one covenant package in scope, state that explicitly and explain why no broader comparison is needed.

## 2. Failure modes the skill is correcting
- Extracting covenants from one agreement without comparing EBITDA definitions, addback mechanics, and caps across the full capital structure.
- Accepting compliance certificate calculations without independently verifying the stated ratios from the underlying financial data and the governing definition of the denominator.
- Missing definitional drift where the same term is defined one way in the general definitions and differently in a covenant or schedule.
- Treating change-of-control, permitted-holder, and assignment concepts as interchangeable across agreements without checking the actual trigger language.
- Overlooking cross-default or cross-acceleration links that can cause a breach in one document to cascade into others.
- Ignoring amendment history and therefore analyzing an outdated covenant package rather than the current operative terms.
- Failing to connect an issue to its practical consequence for closing, refinancing, or acquisition integration.

## 3. Legal frameworks / domain conventions that apply
- Financial covenant analysis turns on the operative definitions section, the covenant article, and any compliance certificate or reporting exhibit; the controlling text may differ across agreements.
- EBITDA is typically built from net income plus specified adjustments, but the adjustment set, ordering, and cap structure are agreement-specific and must be read as drafted.
- Common addbacks include interest, taxes, depreciation and amortization, non-cash charges, stock-based compensation, restructuring items, transaction costs, purchase accounting items, pro forma savings, and similar adjustments; each must be tested against the actual text.
- Addback caps, time limits, and evidence requirements are not boilerplate; compare them across agreements and note which document is most restrictive on each point.
- A covenant threshold is assessed against the defined metric actually used in the agreement, not a market-standard proxy or a management presentation version.
- Compliance certificates are not conclusive if the arithmetic, inputs, or methodology conflict with the governing provisions.
- If an agreement contains an interpretive hierarchy, conflict rule, or specific-over-general instruction, that rule controls ambiguity between definitions and covenant text.
- Change-of-control analysis should focus on the stated trigger mechanics, including ownership, voting power, board control, or merger concepts, as drafted in each agreement.
- Cross-default analysis should identify whether a default under one instrument is itself an event of default under another, and whether any grace periods, materiality qualifiers, or carveouts break the chain.
- Amendment and waiver history can reset covenant levels, expand exclusions, or narrow triggers; the current operative state must reflect all amendments and supplemental documents.

## 4. Analytical scaffolds
1. Document inventory and hierarchy
   - List each operative document, amendment, and certificate.
   - Identify which document controls if the record includes conflicting versions or incorporated exhibits.

2. Covenant-by-covenant extraction
   - For each agreement, extract leverage, interest coverage, fixed charge, liquidity, or other financial covenants actually present.
   - Capture the test frequency, measurement date, calculation period, cure rights, and any step-down or step-up mechanics.

3. EBITDA and denominator comparison
   - Build a side-by-side comparison of the EBITDA definition and all addbacks.
   - Note each cap, timeout, evidence requirement, and condition precedent to inclusion.
   - Identify the most and least restrictive formulation by feature, not only by headline ratio.

4. Compliance verification
   - Recalculate each stated ratio from the financial inputs and the governing definition.
   - Compare the stated result to the independently derived result and flag any variance.
   - If the calculation depends on disputed or missing inputs, state that the certificate is not fully verifiable on the record.

5. Definitional consistency check
   - Compare general definitions, covenant provisions, schedules, and certificates for inconsistent usage of the same term.
   - Apply any stated hierarchy or specific-over-general rule.
   - Explain the interpretive risk if the agreement does not resolve the inconsistency.

6. Change-of-control and cross-default review
   - Map each trigger and default cascade across the documents.
   - Test whether the proposed acquisition structure fits within any permitted-transfer, permitted-holder, or consent framework.
   - Identify sequencing risk where one default could accelerate another or impair closing.

7. Amendment impact review
   - Confirm whether amendments changed thresholds, calculation mechanics, addback caps, or event-of-default triggers.
   - Do not rely on pre-amendment language unless the amendment clearly leaves it intact.

8. Closing diligence synthesis
   - Tie each issue to its closing impact, covenant headroom, default status, or refinancing consequence.
   - Separate pure extraction findings from recommendations that require transaction action.

## 5. Vertical / structural / temporal relationships
- Analyze the agreements vertically: definitions, covenant text, reporting mechanics, and default provisions must be read together.
- Analyze the structure horizontally across all facilities and tranches: compare the same covenant type across each document to identify the most restrictive package.
- Analyze temporally: distinguish current operative terms, prior versions, pending amendments, future step-downs, and measurement dates.
- If one document references another by incorporation, note whether the incorporated text changes the covenant result or only the background framework.
- If a covenant is tested periodically, align the test date, measurement period, and delivery deadline to determine whether the borrower is in or approaching breach.

## 6. Output structure conventions
- Write the memo as an acquisition diligence memorandum organized by document and then by covenant type.
- Open with a short scope statement identifying the documents reviewed and any limits on the source set.
- Include a document map or comparison table for the operative agreements and amendments.
- Include a covenant comparison table that captures: covenant name, governing definition, test level, measurement period, addback features, caps, and any cure or equity cure mechanics.
- Include a compliance status table that states the current status, headroom or breach condition, and the basis for the conclusion.
- Include a separate section for definitional inconsistencies, amendment impacts, change-of-control implications, and cross-default risks.
- For each issue, state a severity level using a consistent ordinal scale defined once at the top of the memo.
- For each issue, include the governing authority by name and section as stated in the documents, or the controlling contractual provision if the source set identifies it.
- Close each issue with the practical consequence for the transaction and the specific document interaction that drives it.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible role, and ties each action to a closing or signing milestone.
- Keep the prose concise and operational; the deliverable should read as a diligence memo, not a narrative summary.
