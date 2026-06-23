---
name: extract-fiduciary-duty-provisions-scenario-01
task_id: corporate-governance/extract-fiduciary-duty-provisions/scenario-01
description: Agents extract individual fiduciary provisions from each document in isolation, then compare corresponding provisions across documents to identify differences in fiduciary standards, exculpation, indemnification, information access, and conflict-oversight mechanics; assess whether any contractual modification is permissible under the applicable governing law and whether any investment-adviser duty standard is consistent with the applicable fiduciary framework; and evaluate whether an oversight body’s information access and consent mechanics enable meaningful review of conflict transactions, including any independence concern created by a dual-hat compliance role.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Map Fiduciary Duty Provisions Across Fund Governing Documents

## 1. Subject-matter triage

Identify each fund vehicle and each governing document before comparing anything across the set. Keep vehicles separate unless the source documents expressly integrate them.

Enumerate the document pool by vehicle and document type first, then extract provisions within each vehicle in isolation. Treat the following as distinct unless the record shows otherwise:
- governing agreement or constituent instrument;
- investment management or advisory agreement;
- oversight, compliance, or consent charter;
- side letter or amendment that changes fiduciary, exculpation, indemnification, or access terms.

If a single vehicle is the only one in scope, say so explicitly and explain why no cross-vehicle comparison is needed.

## 2. Failure modes the skill is correcting

- Extracts fiduciary language but does not compare corresponding provisions across documents for inconsistency in standards, scope, procedure, or recipients.
- Misses whether a contractual modification is permitted by the applicable entity statute and whether the implied covenant or other non-waivable duties limit the modification.
- Recites an advisory agreement’s duty language without testing it against the non-waivable adviser fiduciary framework.
- Describes an oversight body without checking whether the body can actually see conflict information or meaningfully consent.
- Treats indemnification as a single concept instead of separating eligibility, advancement, approval mechanics, exclusions, and post-approval review.
- Fails to flag structural independence concerns where compliance monitoring and legal advocacy are combined in one role.
- Summarizes provisions without naming the controlling authority for the proposition being stated.

## 3. Legal frameworks / domain conventions that apply

- **Investment-adviser fiduciary duty:** Under the Investment Advisers Act of 1940 and SEC fiduciary principles, an adviser owes duties of care and loyalty that cannot be waived by contract. Any hedge clause, liability limitation, or disclaimer must be tested against that baseline.
- **Contractual modification of entity fiduciary duties:** Governing entity statutes may permit modification or elimination of certain fiduciary duties, but not duties that the statute preserves, including the implied covenant of good faith and fair dealing. Identify the statute invoked and the duties actually modified.
- **Corporate opportunity and conflict waivers:** If a document addresses opportunities, competing investments, or related-party transactions, determine whether there is an express waiver and whether its scope matches the vehicle’s activities. If absent, note the residual exposure under the governing law governing loyalty duties.
- **Exculpation and indemnification limits:** Exculpation generally addresses liability; indemnification addresses reimbursement or advancement. Separate the two and verify carve-outs for bad faith, willful misconduct, fraud, knowing violation of law, or similar standards as stated in the source.
- **Information access and consent mechanics:** Oversight bodies must receive enough information, with enough independence, to evaluate conflict transactions. A manager-controlled information gate can undermine the function even if consent language appears facially broad.
- **Covered-person scope:** Any expansion of who may be indemnified or advanced expenses should be identified, because broader coverage may exceed the intended risk allocation or diverge across documents.
- **Dual-hat role independence:** A person serving as both compliance officer and general counsel presents a structural independence issue; note the role split and whether the documents or governance structure mitigate it.
- **Authority naming convention:** State the legal source supporting each proposition, using the statute, regulation, rule, or recognized doctrine that governs the point.

## 4. Analytical scaffolds

- **Vehicle-by-vehicle provision map:** For each vehicle, list every fiduciary, exculpation, indemnification, access, and conflict-approval provision, with document name, section reference, and a faithful paraphrase of the operative rule.
- **Cross-document comparison:** Compare like provisions across documents within the same vehicle and, where relevant, across vehicles. Focus on differences in duty standard, exculpation scope, advancement triggers, approval requirements, consent thresholds, and information rights.
- **Authority check:** For each provision that alters or limits fiduciary exposure, identify the legal authority that permits or constrains the modification and state whether the provision appears consistent with that authority.
- **Investment-adviser review:** For every advisory agreement, test the duty language, liability carve-outs, and hedge clauses against the adviser fiduciary baseline. Flag any clause that could be read to dilute the baseline.
- **Oversight effectiveness review:** For each oversight or consent mechanism, assess whether the body receives sufficient information, whether the approval path is independent enough, and whether the consent threshold allows meaningful review of conflict transactions.
- **Indemnification mechanics review:** Separate eligibility, exclusion, advancement, approval body, and repayment obligations. Note any inconsistency between documents that could create uneven protection or uneven gating.
- **Issue ranking:** Prioritize the most legally consequential provisions first, especially those affecting fiduciary standards, adviser duties, and conflict approvals.

## 5. Vertical / structural / temporal relationships

- Track the same concept across levels of the structure: entity statute, governing agreement, advisory contract, oversight charter, and side letter or amendment.
- Flag any provision whose operation depends on another document, consent right, or approval body, and explain the dependency plainly.
- If the source set reflects an active fund formation, amendment, or fundraising process, note any disclosure or consistency issue that should be addressed before execution or circulation.

## 6. Output structure conventions

- Produce a client-ready memorandum with a short executive overview, followed by a provision map and then an issues section.
- Use an ordinal severity label for each issue, with a single scale stated once and applied consistently throughout the memorandum.
- For each issue, include: affected vehicle(s), affected document(s), provision reference, the governing rule or authority, the inconsistency or risk, the practical consequence, and a recommended fix or disclosure step.
- Every issue discussion should tie the provision to at least one other source document in the set when a cross-document inconsistency exists.
- End with a dedicated Recommended Actions section that gives imperative next steps, identifies the responsible role or function, and ties timing to the next drafting, approval, or closing milestone.
- Keep the memo in a form suitable for direct transfer into `fiduciary-duty-memorandum.docx`; do not rely on unstated context, and do not merge separate vehicles or separate provisions into one undifferentiated summary.
