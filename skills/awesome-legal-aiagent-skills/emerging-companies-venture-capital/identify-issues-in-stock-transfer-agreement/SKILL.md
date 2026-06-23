---
name: ecvc-identify-issues-stock-transfer-agreement
task_id: emerging-companies-venture-capital/identify-issues-in-stock-transfer-agreement
description: Identifying issues in a secondary stock transfer agreement requires confirming transfer-restriction notice and waiver timing, checking for conflicts in company approval under the applicable corporate statute, assessing whether ownership-restriction representations are too broad, and evaluating whether any secondary-sale pricing may create compensation-tax or valuation follow-on issues.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Stock Transfer Agreement

## 1. Subject-matter triage
- Treat the task as an issue-spotting and cross-document consistency review for a secondary stock sale, not as a drafting exercise.
- First determine the governing document set and the transaction sequence: transfer notice, waiver or consent requests, board or holder approvals, closing mechanics, legend removal, and any post-closing notices.
- Enumerate the relevant parties, approvals, and timing points before analyzing defects; if the record shows only one transfer path, state that expressly and explain why no alternate path is in scope.
- If the source set includes multiple tranches, sellers, transferees, classes of stock, or approval dates, analyze each separately and do not collapse them into one pass.

## 2. Failure modes the skill is correcting
- Transfer-restriction compliance is often treated as complete once a waiver exists, without checking whether notice, exercise periods, and transfer timing align with the controlling documents.
- Company approval is often accepted without testing whether any approving director or holder is interested, affiliated, or otherwise disqualified under the governing corporate statute or charter-based cleansing rules.
- “Free and clear” seller language is often read too broadly and fails to account for contractual transfer limits that are not traditional liens.
- Secondary-sale pricing is often reviewed in isolation, without considering whether it creates valuation tension for equity compensation, future grants, or tax-sensitive admin steps.
- Securities-law and legend-removal steps are often omitted even where the transfer cannot practically close without them.
- Cross-document inconsistencies are often missed when the stock purchase agreement, cap table, waiver, consent, board materials, and closing deliverables do not match on parties, dates, share counts, or conditions.

## 3. Legal frameworks / domain conventions that apply
- Transfer restrictions: analyze any right of first refusal, co-sale, drag-along, lock-up, consent right, or similar restriction under the applicable charter, bylaws, investors’ rights agreement, stockholders’ agreement, ROFR/co-sale agreement, or comparable governing instrument.
- Corporate approval and conflicted approvals: test board or holder consent against the governing corporate statute, the charter, bylaws, and any required disinterested approval standard; if an approving person is interested, affiliated, or financially connected to the transferee, analyze voidability or cleansing under the applicable statute and governance documents.
- Representations and title: review “free and clear,” authority, no conflicts, and no encumbrances statements for overbreadth where contractual transfer limits survive as non-lien restrictions.
- Securities-law transfer mechanics: confirm the available private-transfer exemption, any investor qualification or reliance basis, and the legend-removal or stop-transfer process required for the certificate or book-entry transfer.
- Valuation and compensation follow-on: compare the secondary transfer price to the most recent fair-market-value or valuation reference used for equity compensation administration, and assess whether an updated valuation, memo, or board action is prudent before future grants or 409A-sensitive actions.
- Common authority should be cited by section or rule where applicable, including the governing corporate statute, securities-law exemption, and any valuation-related tax or compensation rule relevant to the issue identified.

## 4. Analytical scaffolds
- Build a transaction timeline: notice date, response or election deadline, waiver or consent date, approval date, signing date, closing date, and any legend-removal or post-closing notice date.
- For each restriction or approval right, identify the controlling source, the required sequence, and the actual sequence reflected in the documents.
- Test each approval for conflicts: identify who voted, whether the person had a relationship to the transferee or an economic interest, and whether any cleansing path was followed.
- Read each transfer and closing representation against the whole document set; flag any statement that is technically incomplete, internally inconsistent, or missing an exception for contractual restrictions.
- Compare the secondary price and transaction structure against any existing valuation materials; flag whether the spread raises a follow-on administration, tax, or investor-relations concern.
- Check whether the transfer documents, board materials, cap table, and closing instructions all describe the same shares, holders, purchaser, dates, and conditions.
- For every issue, provide: the operative fact or clause, the controlling authority, the risk created, the downstream consequence for the client, the severity, and a concrete fix.
- Use an ordinal severity scale defined once in the memo and apply it consistently:
  - Critical: likely blocks or invalidates closing, consent, or transfer effectiveness
  - High: material legal or transaction risk requiring prompt correction
  - Medium: important inconsistency or exposure that is fixable without immediate deal failure
  - Low: minor drafting, notice, or housekeeping issue
- End the memo with explicit recommendations that assign responsibility and timing.

## 5. Vertical / structural / temporal relationships
- Trace horizontal document dependencies: the stock transfer agreement should not be read alone; it must be reconciled with the notice, waiver or consent, board approval, cap table, legends, and any ancillary certificates.
- Trace vertical authority: charter and bylaws may be supplemented or overridden by stockholder agreements, investor rights, transfer restrictions, and then by statutory default rules.
- Treat timing as substantive, not clerical: a waiver delivered after the exercise window, a consent granted before required notice, or a closing before satisfaction of a condition may be a legal defect even if all documents exist.
- If the transaction involves multiple closing steps, confirm that conditions precede signing or closing in the correct order and that later deliverables do not purport to cure a noncompliant earlier step unless the governing documents allow it.

## 6. Output structure conventions
- Prepare an issue memorandum in a conventional legal memo shape with a short opening summary, an issues section, issue-by-issue analysis, and a closing recommendations section.
- Open with the severity scale, then present the issues in descending order of seriousness.
- For each issue, use a consistent format:
  - Issue title
  - Severity
  - Source provision or fact pattern
  - Analysis
  - Controlling authority
  - Cross-document interaction
  - Downstream consequence
  - Recommended fix
- Include a transfer-restriction timeline table when timing is relevant, with columns for notice, election or exercise deadline, waiver or consent delivery, signing, closing, and compliance status.
- Include a short cross-document consistency table when the record contains multiple transaction documents or approval materials.
- Do not rely on conclusory labels alone; each legal conclusion must be tied to a named authority or governing document provision.
- Use only industry-conventional headings; do not mirror any internal checklist or rubric language.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible actor from the record or a generic deal role if none is named, and ties each action to a deadline, closing milestone, or immediate follow-up.
