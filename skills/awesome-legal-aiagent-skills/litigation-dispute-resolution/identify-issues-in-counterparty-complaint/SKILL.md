---
name: identify-issues-in-counterparty-complaint
task_id: litigation-dispute-resolution/identify-issues-in-counterparty-complaint
description: Identifying issues in a counterparty's verified complaint requires cross-referencing the complaint's factual allegations against the governing contract documents, termination notices, and pre-suit correspondence to identify pleading deficiencies, contractual defenses, and potential counterclaims.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Counterparty Complaint — Issue Identification Memorandum

## 1. Subject-matter triage

- Treat the complaint as an allegation map, not a self-contained fact record; verify each material allegation against the deal documents, notices, amendments, and correspondence.
- Separate counts that depend on different contractual provisions, different dates, or different parties; do not analyze them as one generalized breach theory.
- Flag any verified allegation that turns on a document quote, notice content, or chronology before moving to legal conclusions.
- If the source set contains multiple termination notices, multiple amendments, multiple cure communications, or multiple challenged transactions, enumerate them first and analyze each separately.

## 2. Failure modes the skill is correcting

- Reading only the pleading and missing document-driven defenses that contradict the complaint’s description of the agreement or the alleged breach.
- Collapsing distinct termination pathways into one analysis, even though notice, cure, timing, and remedy requirements may differ.
- Ignoring pre-suit objection letters, reservation-of-rights correspondence, or similar communications that may show dispute, non-waiver, or failure of a contractual process.
- Overlooking lis pendens or similar filings as separate procedural pressure points with their own challenge path.
- Treating amendments as background when they may supersede, qualify, or replace the original terms on the disputed issues.
- Stating a defense in conclusion form without anchoring it to the controlling contract language, procedural rule, statute, or governing doctrine.

## 3. Legal frameworks / domain conventions that apply

- Verified complaint: a sworn complaint may function as evidence for interim relief, so test whether the verification supports the requested remedy under the applicable injunction standard.
- Pleading sufficiency: assess whether each count states the required elements under the governing civil procedure standard, including whether the facts plausibly support each element.
- Contract interpretation: read the complaint against the operative agreement, any amendments, and any incorporated schedules; later amendments control over inconsistent earlier terms on the subjects they address.
- Notice and cure: where the contract requires a notice period, cure period, dispute notice, or written election among remedies, test strict compliance with the invoked provision.
- Termination claims: distinguish termination for cause, termination for convenience, and any special exit right; each may have distinct predicates, timing, and consequences.
- Lis pendens / property-clouding filings: analyze under the applicable expungement, cancellation, or discharge procedure rather than treating it as only a merits issue.
- Limitations and accrual: compare each claim’s accrual date to the applicable statute of limitations and any tolling or relation-back argument.
- Affirmative defenses: waiver, estoppel, failure of condition precedent, prior material breach, noncompliance with notice requirements, and inadequate cure are common defenses where the documents support them.

## 4. Analytical scaffolds

- Start with a numbered inventory of the complaint’s counts, the operative agreements, the key notices, and the key correspondence; if only one item exists in a category, say so expressly.
- For each count, identify: the legal theory, the elements, the pleaded facts, the source documents that confirm or undercut those facts, and the missing factual allegations if any.
- For each disputed contract provision, quote or paraphrase the operative language in substance, then compare it to the complaint’s characterization and identify any mismatch.
- For each termination notice, analyze separately: the invoked contractual basis, whether the required prerequisites were met, whether timing was correct, whether the notice was effective, and whether the counterparty’s response matters.
- For each pre-suit objection or response letter, assess whether it preserved objections, triggered a cure process, waived rights, or undermined the plaintiff’s theory of surprise or irreparable harm.
- For any allegation dependent on a timeline, reconstruct the chronology and test whether the pleading omits a date, misstates sequence, or blurs distinct events.
- For any potentially time-barred claim, compare the accrual event to the limitations period and any document-based tolling or delayed-accrual argument.
- For any lis pendens, identify the property interest asserted, the litigation nexus, and the procedural basis for immediate challenge or narrowing.
- Close each issue with three moves: tie it to a concrete figure, date, term, or threshold in the source set; cross-reference the other document or clause that interacts with it; and state the client consequence if the issue is not addressed.
- Do not present a bare issue list; every issue must end with a defense implication, a litigation risk, or a proposed next step.

## 5. Vertical / structural / temporal relationships

- Track how the complaint, amendment history, termination notices, and correspondence relate over time; later documents may supersede earlier ones or change the legal effect of prior conduct.
- Distinguish document hierarchy: master agreement, amendment, notice, then correspondence, then pleading allegation; use the highest-order operative document on the disputed point.
- Where the complaint alleges a continuing breach or recurring harm, test whether the contract and facts instead reflect a single actionable event with later consequences.
- Where the dispute concerns multiple parties or business units, identify which actor took which step and whether the complaint attributes conduct to the correct entity.
- If a right depended on a deadline, notice window, or cure period, state the trigger date and whether the response fell inside or outside the operative window.

## 6. Output structure conventions

- Write as a prioritized defense memorandum, not as narrative prose.
- Use an ordinal severity scale defined once at the top, and apply it uniformly to every issue.
- Organize issues under conventional headings such as pleading defects, contract defenses, notice/cure issues, timing defenses, procedural motions, and counterclaim candidates.
- For each issue, use a compact entry with: Issue ID | Severity | Issue | Source support | Legal basis | Client impact | Recommended next step.
- Cite controlling authority for every legal proposition relied on, including pleading standards, contract doctrines, notice rules, limitations rules, and any lis pendens procedure.
- If the source documents name a governing statute, rule, or contractual procedure, use that authority as written; otherwise cite the generally recognized authority for the proposition.
- End with an explicit Recommended Actions block that assigns an action, responsible role, and timing anchor for each step.
- Keep the memo operational: prioritize issues by litigation leverage, preserve follow-up tasks, and avoid unsupported conclusions or generic summaries.
