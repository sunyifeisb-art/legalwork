---
name: draft-responses-discovery-patent
task_id: intellectual-property/draft-responses-to-discovery-requests
description: Responses to interrogatories and requests for production in patent infringement litigation, applying a standard objection framework and aligning substantive answers with the pleadings and litigation record.
activates_for: [planner, solver, checker]
---

# Skill: Draft Responses to Discovery Requests in Patent Infringement Litigation

## 1. Subject-matter triage
- Confirm whether the requests are interrogatories, requests for production, or both, and draft each response set separately.
- Identify the governing forum rules, any local discovery rules, the protective order if one exists, and any answer or other pleading positions that constrain the responses.
- Determine whether the requests seek party knowledge, non-party records, technical facts, licensing/royalty information, conception/reduction-to-practice facts, validity positions, damages facts, or document categories requiring collection review.
- If multiple responding parties, custodians, time periods, products, patents, or subject areas are in scope, enumerate them first and then draft each response against that specific item set rather than using a blended answer.
- If the prompt includes source materials, use them as the factual anchor and do not invent uncited specifics.

## 2. Failure modes the skill is correcting
- Using boilerplate objections that are not tied to the request’s wording, temporal scope, burden, privilege risk, or relevance.
- Drafting substantive answers that drift from the filed answer, counterclaims, invalidity positions, infringement contentions, or internal fact memo.
- Treating an objection as a complete response when the rules require answering to the extent not objectionable.
- Failing to state whether responsive materials will be produced, withheld, or identified by category.
- Giving an interrogatory answer that should instead be stated as records-based because the answer is available from documents or business records.
- Omitting privilege, confidentiality, or work-product limitations where the request reaches protected material.
- Drafting responses without a supplementation reservation consistent with the discovery rules.
- Overstating certainty where the correct response is that, after reasonable inquiry, information is incomplete or not yet known.

## 3. Legal frameworks / domain conventions that apply
- Interrogatories under Federal Rule of Civil Procedure 33: answers must be in writing, under oath, and objections must be stated with specificity.
- Requests for production under Federal Rule of Civil Procedure 34: the response must state inspection/production terms or the basis for objection, and any withholding must be clear.
- Federal Rule of Civil Procedure 26(b)(1): relevance and proportionality govern the permissible scope of discovery.
- Federal Rule of Civil Procedure 26(b)(3): work-product protection may limit disclosure of attorney impressions, mental impressions, and litigation-prepared materials.
- Federal Rule of Civil Procedure 26(b)(5): privilege claims must be preserved and described with enough specificity to support the assertion.
- Federal Rule of Civil Procedure 26(e): discovery responses must be supplemented or corrected when materially incomplete or inaccurate.
- Patent-litigation conventions: align discovery positions with the operative pleadings, infringement/invalidity contentions, damages disclosures, and any court orders governing discovery sequencing.
- Common objection categories: overbreadth, undue burden, lack of proportionality, vagueness, ambiguity, relevance, privilege, work product, confidentiality, and cumulative/duplicative scope.
- Standard discovery practice: object specifically, answer the non-objectionable portion, and avoid conclusory recitations untethered to the request.

## 4. Analytical scaffolds
- Request-by-request review: identify the exact information sought, the time frame, the subjects implicated, and the likely source materials before drafting.
- Objection tailoring: for each objection, tie the ground to the request’s actual phrasing, scope, and burden; avoid abstract objection language that could fit any request.
- Partial-answer discipline: if only part of a request is objectionable, state the objection, limit it to the problematic portion, and answer the remainder.
- Records-based response analysis: where the answer can be derived from identified documents or business records, say so and identify the materials with enough clarity to show the basis for the answer.
- Pleadings alignment check: compare each substantive answer against the answer, counterclaims, infringement positions, invalidity positions, and internal fact memo to catch inconsistencies before service.
- Production mapping: for each production request, determine whether responsive documents will be produced, whether they are withheld subject to objection, and whether a privilege log or confidentiality treatment is required.
- Preservation check: confirm the response is consistent with the existing preservation and collection scope; if a gap exists, flag it for follow-up rather than silently narrowing the answer.
- Supplementation discipline: when facts are developing, draft the response to preserve accuracy while making clear it will be supplemented as discovery continues.

## 5. Vertical / structural / temporal relationships
- Keep interrogatory and production responses in separate, parallel tracks so that admissions, objections, and production commitments do not bleed across request types.
- Track temporal limits carefully; if a request spans multiple periods, decide whether the response is date-limited, ongoing, or confined to the pleaded period.
- For entity relationships, distinguish the responding party from affiliates, subsidiaries, inventors, employees, counsel, and custodians; do not attribute knowledge or possession without a factual basis.
- When a request intersects with privilege or work-product, separate non-protected factual materials from protected attorney analysis.
- Where the request touches both technical and commercial issues, answer each dimension independently to avoid under- or over-inclusive responses.
- If the request seeks “all documents” or similarly broad categories, assess the phrase against proportionality, custodial burden, and duplication before drafting any narrowing language.
- If more than one request turns on the same factual predicate, ensure the responses are internally consistent and use the same defined terms where appropriate.

## 6. Output structure conventions
- Draft interrogatory responses in a formal response format with a short general-objections section only if needed, followed by numbered responses matching the interrogatories.
- For each interrogatory response, include: any specific objection; a concise statement whether the request is answered in whole or in part; and the substantive answer or records-based identification.
- Draft production responses in a formal response format with a short general-objections section only if needed, followed by numbered responses matching the requests.
- For each production response, include: any specific objection; whether responsive documents will be produced, are being withheld, or are not presently known after reasonable inquiry; and any confidentiality or privilege handling required.
- Use precise, litigation-appropriate language: “subject to and without waiving,” “to the extent not objectionable,” and “after reasonable inquiry” only where the legal position actually supports them.
- Keep answers faithful to the pleadings and source record; if the record does not support a fact, do not supply it.
- End with a clear indication of any intended supplementation or rolling production where that is consistent with the discovery posture.
- Write the deliverables as document-ready responses, not as commentary about how to respond.
