---
name: extract-change-of-control-provisions
task_id: corporate-ma/extract-change-of-control-provisions
description: Guides systematic extraction and risk assessment of change-of-control provisions across a target's material contract portfolio in a merger or similar control transaction.
activates_for: [planner, solver, checker]
---

# Skill: Change-of-Control Provision Extraction and Risk Assessment

## 1. Subject-matter triage
- Treat the task as a contract-by-contract diligence review of a target’s material agreements in a control transaction.
- Separate provisions that are expressly labeled change-of-control from provisions triggered by merger, consolidation, assignment, transfer, ownership, voting power, board composition, or similar structural events.
- Map the proposed transaction mechanics first, then test each contract against those mechanics; do not assume a single “merger” trigger analysis covers all documents.
- If the source set contains only one contract, say so explicitly and analyze that contract alone; otherwise enumerate the full contract set before analysis.

## 2. Failure modes the skill is correcting
- Reviewing only provisions that use the phrase change of control and missing broader structural triggers that operate the same way in practice.
- Collapsing termination rights, consent rights, notice obligations, repayment triggers, repurchase options, vesting accelerations, and covenant breaches into one undifferentiated risk label.
- Failing to test assignment and transfer restrictions separately from control-change language, especially where the transaction does not involve a literal assignment but still changes control.
- Missing downstream transaction costs in employment, incentive, benefit, financing, and insurance arrangements.
- Describing a risk without tying it to the operative contract language, the transaction structure, and the practical consequence for signing, closing, integration, or post-closing operations.
- Omitting a clear action recommendation for each material issue.

## 3. Legal frameworks / domain conventions that apply
- Change-of-control provisions are contract-specific; common formulations turn on acquisition of voting power, a shift in board composition, a merger or consolidation, or a transfer of substantially all assets or equity.
- In a reverse triangular merger, analyze whether control changes at the target or its parent, and whether the contract’s trigger is keyed to ownership of the target, the surviving entity, or an acquirer entity.
- Assignment restrictions and change-of-control provisions are distinct; a transaction may avoid one trigger while still implicating the other.
- Counterparty rights commonly fall into defined categories: termination, consent, notice, purchase option, right of first refusal, default, repayment, or compensation acceleration.
- Credit documents often have special mechanics for mandatory prepayment, acceleration, default, collateral release, or lender consent; coordinate those provisions with funding and closing steps.
- Employment, equity, and benefit arrangements may create severance, bonus, retention, acceleration, tax gross-up, or forfeiture consequences that are transaction costs rather than mere notices.
- Insurance and coverage arrangements may require consent, notice, amendment, or replacement coverage; continuity should be tested before closing and at integration.
- Any legal conclusion should be tied to the operative authority in the source documents, including the contract’s defined terms, any cited statute or regulation, or other controlling text identified in the file set.

## 4. Analytical scaffolds
- For each contract, identify: the relevant provision text, the defined term used for the trigger, the transaction mechanics implicated, the counterparty right or consequence, and the likely deal impact.
- Test the provision against the proposed structure in three steps: what event the clause covers, whether the transaction falls within that event, and what follows if it does.
- Classify each issue using a uniform severity scale stated once at the top of the report, such as Critical / High / Medium / Low, and apply it consistently.
- For each issue, close the analysis by doing all of the following: identify the source-document scale that makes the issue material, cross-reference any interacting clause or related document, and state the downstream consequence for the transaction or operations.
- Where the source materials provide timing, thresholds, ownership percentages, consent mechanics, cure rights, or notice periods, use them to anchor the analysis; avoid generic conclusions detached from the text.
- Distinguish between an issue that blocks closing, one that requires pre-closing action, one that creates post-closing cost or operational risk, and one that is administrative only.
- If a provision is ambiguous, note the ambiguity, the competing reading, and the practical safest path for the deal team.
- End with concrete recommendations that assign an owner and timing anchor for each material issue.

## 5. Vertical / structural / temporal relationships
- Analyze how the control transaction affects the contract before closing, at closing, and after closing; some provisions are triggered by signing, some by consummation, and some by subsequent ownership changes.
- Track vertical relationships among parent, target, surviving entity, subsidiary, lender, employee, insurer, or other counterparty where the clause keys off a specific level in the organizational stack.
- Where multiple contracts reference the same event, treat them as linked even if the language differs; coordinated action may be required across agreements.
- If the source set includes schedules, exhibits, definitions, or amendments, read them with the base agreement and treat later-dated documents as potentially modifying the earlier trigger analysis.
- In a reverse triangular merger, separately test whether the surviving subsidiary, the target equity, and any parent-level ownership change each satisfy the clause’s trigger language.
- Consider whether notice, consent, payoff, waiver, amendment, or replacement coverage must happen in a specific sequence to avoid an unintended trigger.

## 6. Output structure conventions
- Produce a single extraction report in the requested file format.
- Begin with a brief methodology note identifying the transaction type, the review scope, and the severity scale used.
- Include an executive summary that distinguishes critical blockers from non-blocking but material items.
- Provide a contract-by-contract table with at least these fields: agreement name, counterparty, provision type, trigger analysis, counterparty right or consequence, severity, and recommended action.
- Follow the table with short narrative entries for each contract that explain the operative language, the transaction fit, the interaction with related provisions, and the deal impact.
- Group related agreements where appropriate, but keep each contract’s risk conclusion distinct.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible role, and ties each action to a timing milestone such as pre-signing, pre-closing, closing, or immediate post-closing.
- Keep quotations minimal and avoid reproducing long verbatim contract text; extract only the language necessary to support the analysis.
