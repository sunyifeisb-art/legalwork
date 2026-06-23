---
name: extract-document-requests-from-tax-authority-summons
task_id: tax/extract-document-requests-from-tax-authority-summons
description: Consolidating document requests from multiple tax-authority summonses requires assigning a response recommendation to every request, such as produce, withhold with privilege log entry, or narrow, and identifying any summons that warrants a challenge based on the governing summons-enforcement framework.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Consolidate Document Requests from Tax-Authority Summonses

## 1. Subject-matter triage

- Triage all attached materials together: summonses, extensions, matter summary, and motion filing.
- First identify how many separate summonses are in scope, then map each request to its source document and deadline.
- Treat the output as a compliance checklist, not a narrative memo: the client needs a request-by-request action plan tied to each summons.
- If the record shows an extension, confirm whether it is written, who granted it, what it covers, and whether it changes any production date.

## 2. Failure modes the skill is correcting

- Inventorying requests without assigning a response recommendation to each one; the extraction is not useful unless it tells counsel and the client how to handle each request.
- Failing to identify which summons each request originates from; when multiple summonses overlap, the response strategy may differ by summons, and one missed deadline can create a compliance problem.
- Collapsing distinct requests into a single blended issue instead of preserving the request-by-request structure needed for production tracking.
- Treating overbroad requests as valid without analyzing whether the temporal or subject-matter scope exceeds what the summons framework supports, and without proposing specific narrowing language.
- Omitting privilege treatment for withheld materials; every withheld item should be matched to a privilege basis and an adequate log entry.
- Missing the interaction between prior productions, extension communications, and the summons return date.
- Stating conclusions about enforceability or privilege without tying them to the governing authority that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply

- **Multiple summonses — source identification:** Each summons must be treated as its own compliance instrument because response timing, subject matter, and strategic posture may differ.
- **IRS summons enforcement framework:** A challenge to enforcement generally turns on legitimate purpose, relevance, lack of prior possession, and compliance with administrative steps under the governing summons authority.
- **Overbreadth — temporal and subject-matter scope:** Requests reaching beyond the audited period or beyond the stated inquiry may be narrowed or challenged depending on how far they exceed the stated purpose.
- **Attorney-client privilege:** Confidential legal communications for the purpose of obtaining legal advice are protected; underlying facts and ordinary business records are not.
- **Work product doctrine:** Materials prepared in anticipation of litigation may be withheld if they reflect counsel’s or a party’s litigation preparation; routine business materials generally are not protected.
- **Privilege log convention:** A withheld document should be logged with date, author, recipient, type, privilege basis, and a non-revealing description sufficient for review.
- **Return-date discipline:** The operative deadline is the summons return date as extended in writing, if at all; confirm any extension before relying on it.

## 4. Analytical scaffolds

- **Enumerate first.** List each summons separately before analyzing requests; for each summons, capture issuer, service date, return date, subject area, and any extension.
- For each summons, number each request exactly as it appears or assign a stable internal identifier if the source lacks one.
- For each request, record:
  - source summons,
  - request text or faithful paraphrase,
  - date range or subject matter demanded,
  - response recommendation,
  - privilege or challenge basis if relevant,
  - deadline sensitivity.
- Use a uniform response taxonomy:
  - produce,
  - produce subject to prior production reference,
  - withhold with privilege log entry,
  - narrow with proposed language,
  - challenge through the appropriate enforcement process.
- For any withheld item, apply the applicable privilege doctrine and draft a log entry that is sufficient without revealing privileged substance.
- For any overbroad request, identify the specific defect, draft narrowing language, and state whether informal negotiation or formal challenge is the better path.
- For any request that may be challengeable, test the summons against each enforcement element and identify the weak link.
- If prior productions already cover part of a request, note that overlap and state whether a fresh production, a pinpoint reference, or no action is appropriate.
- If the source materials contain a motion or extension correspondence, use them to infer litigation posture, but do not treat them as a substitute for the summons text.

## 5. Vertical / structural / temporal relationships

- Preserve the relationship between the summons, the extension, and the motion filing; these documents may explain why a deadline moved or why a challenge is contemplated.
- Track whether any request is temporally mismatched to the tax period at issue or to a position that no longer applies in the years covered.
- If the set includes successive requests covering overlapping time periods, reconcile them so the checklist shows what is unique versus duplicative.
- Where the matter summary identifies prior disclosures, align the checklist to avoid duplicate production and to flag any remaining gaps.
- If a formal challenge is contemplated, note that it can affect the compliance timeline and should be weighed against cost, timing, and likelihood of relief.

## 6. Output structure conventions

- Lead with a brief executive summary that states the overall compliance posture, the number of summonses addressed, and the main deadline risks.
- Then present a consolidated checklist organized by summons, and within each summons by request identifier.
- For each request entry, include:
  - request identifier,
  - concise description,
  - response recommendation,
  - source summons,
  - notes on overlap or prior production,
  - privilege or narrowing notes if applicable,
  - deadline or timing flag.
- Include a separate privilege section for withheld materials, with log-ready entries.
- Include a separate overbreadth / challenge section for requests that should be narrowed or contested, with the controlling enforcement basis stated.
- Note all return dates prominently and flag any extension that is uncertain, oral-only, or not yet memorialized in writing.
- End with an explicit Recommended Actions block that assigns next steps to counsel or the responsible business owner and ties each step to the relevant deadline.
