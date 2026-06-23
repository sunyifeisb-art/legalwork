---
name: identify-target-org-docs-issues
task_id: corporate-ma/identify-target-org-docs-issues
description: Guides preparation of a pre-closing charter document review memo for an acquisition target where capitalization, governance, stockholder rights, and subsidiary organizational documents must all be assessed for transaction-readiness.
activates_for: [planner, solver, checker]
---

# Skill: Pre-Closing Target Organizational Document Review

## 1. Subject-matter triage
- Treat the target’s organizational package as a transaction-readiness review, not a document inventory.
- Triage by entity level and document type: top-tier charter documents first, then equity-holder arrangements, then capitalization instruments, then subsidiary governance documents.
- If multiple target entities or subsidiaries are in scope, enumerate them before analysis and keep the issues entity-specific.
- Separate true closing blockers from clean-up items, but do not assume any item is immaterial just because it is customary.

## 2. Failure modes the skill is correcting
- The review confirms documents exist without testing whether the approval mechanics, notice periods, quorum rules, or consent thresholds can actually be satisfied for the proposed acquisition.
- Anti-takeover provisions, transfer restrictions, drag/tag mechanics, and veto rights are not tested for whether they impede the transaction or require waivers.
- Equity-holder agreements are reviewed one by one without checking their combined effect on transferability, voting control, and clean title to the equity.
- Capitalization is checked against authorized shares but not against the equity plan, option/warrant coverage, conversion features, and other diluted-capital items.
- Subsidiary governance documents are overlooked even though a parent-level acquisition may trigger lower-tier consent or approval requirements.
- The memo identifies issues but stops short of stating why each issue matters for signing, closing, allocation of consideration, or post-closing control.
- The memo states conclusions without anchoring them to the controlling charter provision, agreement term, statute, or governance rule.
- The memo lacks a practical closing path: who must act, when they must act, and what must be obtained before closing.

## 3. Legal frameworks / domain conventions that apply
- Charter review requires analysis of the certificate of incorporation, bylaws, stockholder agreements, voting agreements, investor rights arrangements, equity incentive plans, award agreements, and any subsidiary organizational documents.
- Authority to approve the acquisition is governed by the charter, bylaws, and applicable corporate law; identify any supermajority or class-consent requirement and the procedural steps that activate it.
- Stockholder approval mechanics depend on the governing documents and applicable state corporate statute; assess quorum, notice, written-consent mechanics, and any separate class vote.
- Transfer restrictions and consent rights in equity-holder agreements may require waiver, joinder, or prior approval before equity can be transferred or exchanged.
- Anti-takeover and deal-protection provisions may alter the vote needed, the timing for approval, or the feasibility of the proposed consideration structure.
- Preferred rights, liquidation preferences, participation features, conversion mechanics, and protective provisions must be understood in the context of who gets what at closing.
- Outstanding options, warrants, RSUs, phantom equity, or conversion instruments affect the fully diluted capitalization and may require treatment terms in the transaction documents.
- Secretary’s certificate and officer authority issues commonly arise at closing and should be tested against the governing documents and resolutions.

## 4. Analytical scaffolds
- Start with the top-level charter documents: identify authorized capital, class rights, preferred rights, voting thresholds, board composition rules, and any anti-takeover provisions.
- Then review the bylaws: identify board approval requirements, stockholder action mechanics, notice periods, quorum, special meeting rights, written-consent limits, and officer authority.
- Next review equity-holder and voting agreements: identify transfer restrictions, co-sale/drag provisions, consent rights, preemptive rights, and any provisions that could delay or block the transaction.
- Cross-check the cap table against the charter and all equity instruments: confirm issued, outstanding, reserved, convertible, and exercisable amounts are internally consistent.
- Review the equity incentive plan and award documentation: confirm whether acceleration, cancellation, cash-out, or rollover is triggered and whether the plan permits the contemplated treatment.
- Review each subsidiary’s organizational documents for consent or approval provisions that could be triggered by a change of control at the parent level.
- For each issue, identify the governing document or rule, the relevant threshold or condition, the interaction with another document or clause, and the closing consequence if unresolved.
- Distinguish between issues that require action before signing, issues that must be satisfied at closing, and issues that can be cured post-closing.

## 5. Vertical / structural / temporal relationships
- Analyze the documents vertically: charter overrides bylaws, bylaws govern mechanics, and side agreements may impose additional private ordering constraints.
- Treat parent and subsidiary documents as linked but distinct; a parent-level transaction can trigger lower-tier approvals even if the target entity itself is not directly transferring ownership.
- Trace temporal sequencing carefully: some consents must be obtained before signing, others before closing, and some are only effective if delivered with the closing set.
- Where a provision depends on a prior event, state the dependency explicitly rather than assuming the transaction can be papered through at closing.
- If multiple equity classes, holder groups, or subsidiaries are implicated, analyze each one separately before synthesizing the deal-level effect.

## 6. Output structure conventions
- Produce a single issues memorandum suitable for insertion into `org-doc-issue-memo.docx`.
- Begin with a brief executive summary on transaction-readiness, then organize the body by document category and entity level.
- Use a clear ordinal severity scale defined once at the top and apply it consistently to every issue entry.
- For each issue, include: the controlling authority, the document or provision at issue, the severity, the interaction with other documents, and the practical consequence for closing or post-closing control.
- Close each issue with a concrete action path: who should address it, what must be obtained or confirmed, and when it is needed relative to signing or closing.
- Keep the memo analytical and action-oriented; do not merely list provisions.
- End with a Recommended Actions section that converts the issues into imperative next steps tied to the relevant officer, counsel, or business owner and a transaction milestone.
