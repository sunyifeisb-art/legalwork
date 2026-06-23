---
name: draft-underwriting-agreement
task_id: capital-markets/draft-underwriting-agreement
description: Firm-commitment underwriting agreement drafting for an IPO where the baseline populates economic terms but omits deal-specific provisions required by the transaction structure and source documents, and does not produce the companion issues memo.
activates_for: [planner, solver, checker]
---

# Skill: Draft Underwriting Agreement for IPO

## 1. Subject-matter triage

- Treat the underwriting agreement as the primary deliverable and the issues memorandum as secondary; complete the agreement first, then prepare the memo from the finished document set.
- Confirm whether the offering includes only primary shares, any secondary/selling securityholder component, an over-allotment option, lock-up letters, exchange listing approval, or other transaction-specific mechanics before drafting.
- If the source set contains one seller group only, say so explicitly; if multiple seller groups or periods exist, enumerate them before comparing terms.

## 2. Failure modes the skill is correcting

- Baseline drafting populates headline economics but omits deal-specific structural provisions required by the transaction documents, including selling securityholder arrangements, lock-up mechanics, and issuer-specific representations.
- Baseline drafting leaves closing conditions generic instead of tying each condition to the specific deliverables, certificates, approvals, and legal opinions required for the offering.
- Baseline drafting fails to align the underwriting agreement with the registration statement, term sheet, lock-up letters, comfort letter package, and listing materials, creating inconsistencies that later block execution.
- Baseline drafting does not produce the companion issues memorandum identifying cross-document discrepancies, unresolved points, and execution risks before signature.

## 3. Legal frameworks / domain conventions that apply

- Draft the agreement as a firm-commitment IPO underwriting contract under the ordinary capital-markets convention for public offerings, with the operative terms keyed to the final prospectus and execution version of the registration statement.
- Include the market-conduct provisions customarily used in IPO underwriting agreements, including restrictions on stabilization, purchases that could distort the market, and other distribution-related conduct governed by applicable securities law and underwriting practice.
- Use the securities-law disclosure framework consistently: underwriting representations must track the filed disclosure record, and any post-signing disclosure change should be treated as a potential amendment or bringdown issue.
- If the securities are to list on an exchange or market, include a listing representation and a closing condition that the relevant approval remains effective through closing.
- If a comfort letter is required, require an initial letter and a closing bringdown letter covering the negative-assurance period through the closing date.
- For selling securityholders, preserve the customary asymmetry: their representations and indemnities should be limited to the information they furnish about themselves and should not assume issuer-level disclosure responsibility.
- If the transaction includes lock-up agreements, make the lock-up covenant, duration, extension mechanics, and release mechanics internally consistent across the underwriting agreement and the ancillary lock-up letters.
- For overallotment mechanics, specify the option grant, exercise period, source of shares, and per-share economics precisely enough to operate without external assumptions.

## 4. Analytical scaffolds

- Start from the term sheet and source documents, then populate the agreement with all operative economics: primary and secondary share counts, pricing mechanics, underwriting discount, option size, option period, and any allocation between company and selling holders.
- Draft representations and warranties against the disclosure record, but only include company-specific reps that are supported by the source documents and transaction structure.
- Draft selling securityholder provisions only for the shares and statements attributable to those holders, and segregate them from company representations and company indemnity obligations.
- Build closing conditions as a document checklist: legal opinions, comfort letters, good standing, officer certificates, exchange approvals, lock-up confirmations, and any regulatory or corporate approvals identified in the source set.
- Compare the agreement against each operative source document and flag every mismatch in economics, party roles, definitions, timing, conditions, and ancillary letter terms.
- For the issues memorandum, record each issue with a severity label using a fixed ordinal scale stated at the top, then explain the discrepancy, the controlling source, the affected provision, and the recommended fix.
- When an issue depends on multiple parties, periods, or alternative terms, break it out by item rather than collapsing it into a single generalized observation.
- For each legal proposition used in the drafting or memo, anchor the proposition to the relevant authority or standard that supports the drafting choice, including the governing securities-law rule, market-practice convention, or document-specific instruction reflected in the source set.

## 5. Vertical / structural / temporal relationships

- Treat the registration statement, preliminary prospectus, final prospectus, term sheet, underwriting agreement, comfort letter, opinions, officer certificates, and lock-up letters as a single coordinated package; a mismatch in one can render another inaccurate or unenforceable.
- Draft representations to match the disclosure state at signing, and draft bringdown mechanics to address changes between signing and closing.
- Sequence the operative timing provisions so that pricing, allocation, signing, mailing/final prospectus delivery, option exercise, and closing each have a clear trigger and relationship to the others.
- Make sure any automatic extension or early release of lock-up restrictions is harmonized across all documents that mention transfer restrictions.

## 6. Output structure conventions

- Produce two DOCX-ready documents: the underwriting agreement first, then the issues memorandum.
- The underwriting agreement should read as a complete execution version with conventional article structure, defined terms, parties, recitals, operative covenants, conditions, indemnification, contribution, termination, and miscellaneous provisions; do not leave blanks or placeholder text.
- Do not rely on commentary in lieu of operative drafting; the agreement must contain the actual contractual language needed to sign.
- The issues memorandum should be a practical closing memo, not a narrative summary: define the severity scale once, then provide numbered entries that identify the discrepancy or open item, the controlling source, the impacted provision, the downstream consequence, and the recommended resolution.
- End the memo with a concise Recommended Actions section that assigns each action to the appropriate role and ties it to the signing, pricing, closing, or filing milestone.
- Before finalizing, verify by name that `underwriting-agreement.docx` and `issues-memorandum.docx` are both populated with substantive content, not merely descriptions of the deliverables.
