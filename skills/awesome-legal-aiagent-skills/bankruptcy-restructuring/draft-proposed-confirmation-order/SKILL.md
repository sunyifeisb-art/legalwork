---
name: draft-proposed-confirmation-order
task_id: bankruptcy-restructuring/draft-proposed-confirmation-order
description: Ensures a proposed confirmation order contains explicit findings for the applicable confirmation elements, correct voting results by class, properly distinguished consensual and non-consensual releases, and a comprehensive retained jurisdiction provision.
activates_for: [planner, solver, checker]
---

# Skill: Draft Proposed Confirmation Order

## 1. Subject-matter triage
- Confirm whether the requested order is for a chapter 11 plan confirmation and whether the record supports a court-entered order with findings, conclusions, and decretal relief.
- Identify whether the plan is consensual or requires non-consensual release findings, whether any impaired classes voted, and whether any class is deemed to accept or reject.
- Identify any plan mechanics that require express implementation findings, including exit financing, new equity issuance, assumption/rejection of executory contracts, treatment of DIP or other postpetition financing, and post-confirmation governance.

## 2. Failure modes the skill is correcting
- The order states confirmation in conclusory form without tying the result to the statutory confirmation elements and the specific record.
- Voting results are summarized vaguely, without class-by-class findings from the ballot and voting materials.
- Consensual releases are blended with non-consensual releases, or release findings are included without separating their sources, opt-in/opt-out mechanics, and supporting authority.
- Exculpation is drafted too broadly, covers the wrong actors, or is not limited to acts and omissions during the case.
- Implementation terms are omitted from the decretal section, leaving financing, equity issuance, contract treatment, or other post-effective-date mechanics uncertain.
- Retained jurisdiction is underbroad and fails to track the disputes and enforcement matters the court will actually need to resolve.
- The discharge injunction is not stated expressly or is not integrated with the plan’s survival and case-closure mechanics.

## 3. Legal frameworks / domain conventions that apply
- Anchor the findings in the Bankruptcy Code and Rules, including confirmation requirements under 11 U.S.C. § 1129, discharge under 11 U.S.C. § 1141, and notice/balloting under the Federal Rules of Bankruptcy Procedure and applicable local rules.
- For each confirmation element, draft a separate factual finding where the issue typically requires individualized treatment, including feasibility, good faith, best interests, impairment and acceptance, priority treatment, classification, and means of implementation.
- Where a class rejects or is deemed to reject, include the cramdown basis under 11 U.S.C. § 1129(b) and the specific non-discrimination and fair-and-equitable support reflected in the record.
- Distinguish contractual or solicitation-based consensual releases from any non-consensual third-party release or injunction findings; do not collapse them into one provision.
- If non-consensual releases are included, state the legal authority the court is relying on and the factual predicates supporting necessity, fairness, and estate value preservation, as reflected in the plan record and governing law.
- Exculpation should be limited to case-related acts and omissions and should identify the covered parties with bankruptcy-standard precision, including the debtor, reorganized debtor, fiduciaries, plan administrator or similar estate functionaries, and retained professionals to the extent supported by the record.
- If the plan contemplates financing payoff, replacement financing, new equity, governance changes, or contract assumptions/rejections, the order should make those actions effective in decretal form and tie them to the effective date or other stated condition precedent.
- Retained jurisdiction should cover the categories that commonly survive confirmation: claim objections, allowance and priority disputes, fee applications, plan interpretation and enforcement, avoidance and estate causes, contract and lease disputes, tax matters, implementation disputes, and disputes over releases, exculpation, and the discharge injunction.

## 4. Analytical scaffolds
- Use a confirmation-check framework: jurisdiction and venue; notice and due process; plan classification and treatment; voting and acceptances; compliance with each statutory confirmation element; feasibility; means of implementation; fee and expense treatment; releases and exculpation; discharge; and retained jurisdiction.
- For voting, organize the findings by class and state the class status, the relevant ballot result, and whether the class accepted, was deemed to accept, or was deemed to reject under the plan and the applicable rules.
- For each confirmation element, write a standalone finding that identifies the governing rule and the record support. Do not rely on a single omnibus finding to cover multiple statutory elements.
- For any rejecting class, separate the cramdown analysis from the ordinary confirmation findings and state why confirmation is still available under the statute.
- For releases, write two distinct findings blocks: one for consensual releases supported by the solicitation mechanics and record, and one for any non-consensual release supported by the applicable authority and factual record.
- If the deal includes implementation mechanics, address them in the decretal section with operative verbs, conditions precedent, and effective-date linkage rather than narrative description.
- Avoid drafting by inference. If a fact, payment term, party category, or authority is not in the source materials, leave a bracketed placeholder for counsel to confirm rather than inventing it.

## 5. Vertical / structural / temporal relationships
- Draft the order in conventional bankruptcy order form: caption, recitals, findings of fact, conclusions of law, decretal paragraphs, and signature block.
- Separate pre-effective-date findings from effective-date implementation directions so the order reads cleanly as both an adjudication and an operating instrument.
- Where multiple classes, releases, or implementation steps exist, treat each as a distinct subpart and keep the sequence consistent with the plan’s temporal mechanics.
- Make the retained-jurisdiction list follow the same lifecycle as the plan: confirmation disputes first, implementation issues next, then post-confirmation administration, and finally enforcement and closure matters.

## 6. Output structure conventions
- Produce a single proposed confirmation order suitable for conversion to `proposed-confirmation-order.docx`.
- Use conventional headings: caption, recitals, findings of fact, conclusions of law, decretal paragraphs, and judge signature block.
- Each major confirmation element should have its own paragraph or subparagraph, with findings written as affirmative adjudications rather than explanatory notes.
- State legal authority where the order relies on it; do not leave conclusions unsupported by the governing statute, rule, or controlling case law.
- Make the decretal paragraphs operative and implementation-ready: confirm the plan, approve the release and exculpation provisions as supported, direct consummation on the effective date, authorize any required implementation steps, and retain jurisdiction over the defined post-confirmation matters.
- Ensure the final document is self-contained, internally consistent, and ready for filing without a separate explanatory memorandum.
