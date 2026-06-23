---
name: identify-issues-in-counterpartys-document-production-requests
task_id: arbitration-international-dispute-resolution/identify-issues-in-counterpartys-document-production-requests
description: Ensures a document production request issues memo distinguishes privileged attorney-client communications from non-privileged non-attorney communications, applies the applicable control test for documents held by non-parties, and identifies overlapping requests for consolidation.
activates_for: [planner, solver, checker]
---

# Skill: Document Production Request Issues Memorandum

## 2. Failure modes the skill is correcting

- Treats any email or meeting note copied to counsel as privileged without checking whether the communication was actually between client and lawyer for the purpose of legal advice
- States a privilege objection without identifying the governing privilege rule or the doctrinal element that fails
- Objects to third-party materials without analyzing possession, custody, or control under the applicable evidentiary framework
- Misses when a narrower request is already covered by a broader one, leaving unnecessary duplication in the response set
- Raises burden or data volume as a talking point without tying it to proportionality, relevance, and the procedural consequence for production
- Treats pre-contractual or negotiation materials as categorically outside scope without acknowledging that admissibility and relevance are often contested
- Describes an issue in the abstract and stops short of the operational consequence and the recommended response

## 3. Legal frameworks / domain conventions that apply

- Attorney-client privilege applies only to confidential communications between client and lawyer made for the purpose of obtaining or providing legal advice; the mere presence of counsel as a copy recipient does not transform a non-lawyer communication into privileged material
- Work-product protection, if implicated by the materials, requires analysis of whether the document was prepared because of litigation or for trial; do not conflate this with attorney-client privilege
- Control for production turns on whether the responding party has the practical legal right or ability to obtain the document from a non-party; materials held by an unaffiliated entity are not automatically within the producing party’s obligation
- Request overlap should be analyzed by comparing the subject matter, custodians, time period, and document types; if a broader request fully covers a narrower one, note the consolidation path and avoid redundant objections
- Proportionality and burden require a concrete assessment of scope, volume, search effort, and likely utility against the needs of the case under the applicable arbitration rules and evidence principles
- Pre-contractual negotiations, draft exchanges, and related materials may be relevant to intent, formation, interpretation, or defenses, but tribunals vary on how far that relevance extends; objections should be framed with appropriate hedging
- The memo should track the governing procedural order, tribunal directions, arbitration rules, and any cited evidence-rule provisions when advancing objections or production recommendations

## 4. Analytical scaffolds

- Start by enumerating each request in order and assigning it a severity level using a uniform ordinal scale defined once at the outset
- For each request, assess: scope, relevance, privilege, control, burden, overlap, and a recommended response
- Where more than one request is implicated by the same document set, compare them directly and identify whether one request is subsumed by another
- For any privilege objection, identify the document relationship, the role of each participant, the privilege element that is satisfied or missing, and the controlling authority
- For any control objection, identify the custodian, the respondent’s relationship to the holder, the source of any asserted access right, and the authority supporting the control analysis
- For any burden objection, tie the objection to the actual breadth of the request, the search universe, the likely production load, and the proportionality framework
- For pre-contractual materials, separate relevance from admissibility and state the objection as conditional if the record may support some limited use
- Close each issue with three moves: anchor it to a concrete scale or document-set feature, cross-reference any interacting request or source material, and state the downstream consequence for the client
- End each issue with a procedural recommendation such as produce, produce with limitations, object, narrow, consolidate, or seek clarification

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare requests vertically from broad to narrow to determine whether one request fully absorbs another
- Compare documents horizontally across custodians, entities, and repositories to test privilege and control assertions
- Compare temporal reach across pre-contractual, execution, performance, and dispute periods, especially where the request captures negotiation history or evolving communications
- Where the source materials show multiple custodians, entities, or document sets, enumerate them first and then analyze each separately rather than blending them into a single general objection
- If only one request, custodian, or time slice is actually in scope, say so affirmatively and explain why no broader comparison is needed

## 6. Output structure conventions

- Write an issues memorandum, not a discovery chart and not a brief
- Use a request-by-request format with a clear heading for each request and a severity field for each entry
- For each request, include:
  - scope and relevance assessment
  - privilege analysis with the governing authority named
  - control analysis for third-party materials, if applicable
  - burden / proportionality analysis, if applicable
  - overlap / consolidation assessment, if applicable
  - recommended response
- Include a short section identifying requests that are duplicated, subsumed, or candidates for consolidation
- Cite controlling authority by name and section or rule wherever a legal proposition is stated
- Conclude with an explicit Recommended Actions block that assigns an imperative action to a responsible role and gives a timing anchor tied to the arbitration schedule or a stated deadline
- Keep the response operational and document-specific; avoid abstract legal commentary detached from the requests
