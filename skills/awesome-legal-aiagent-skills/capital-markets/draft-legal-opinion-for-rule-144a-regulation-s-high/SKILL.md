---
name: draft-legal-opinion-rule-144a-reg-s
task_id: capital-markets/draft-legal-opinion-for-rule-144a-regulation-s-high
description: Closing opinion letter for a Rule 144A / Regulation S offering where the baseline adapts a model template but does not resolve cross-document discrepancies embedded in the opinion's assumptions or address missing closing deliverables.
activates_for: [planner, solver, checker]
---

# Skill: Draft Legal Opinion Letter for Rule 144A / Regulation S High-Yield Offering

## 2. Failure modes the skill is correcting

- The draft mirrors the model opinion mechanically and fails to reconcile the operative documents with the offering materials, so term mismatches, delivery mechanics, or defined-term differences survive into the final opinion without qualification.
- The draft uses standard assumptions as boilerplate even when the source set discloses facts that make them inaccurate, especially assumptions about litigation, authority, or absence of undisclosed matters.
- The draft overstates coverage for a party whose closing authorization package is incomplete; where an obligor lacks required resolutions or certificates, the opinion must be conditioned, narrowed, or deferred.
- The draft omits bracketed issue flags for cross-document inconsistencies, leaving the reviewer without a clear path to final resolution.
- The draft reaches legal conclusions without anchoring them to the governing law or the specific statutory, regulatory, or doctrinal basis that supports the opinion.

## 3. Legal frameworks / domain conventions that apply

- Use the conventional closing-opinion structure for a Rule 144A / Regulation S high-yield note offering: addressees, introductory scope, assumptions, qualifications, opinion paragraphs, and closing reliance language.
- Separate opinion coverage by governing law: organizational existence, formation, and authority under each entity’s jurisdiction of organization; enforceability under the selected contract law; securities-law conclusions under the Securities Act and related private-offering exemptions.
- For the securities-law portion, frame the conclusion around Securities Act registration requirements and the private-offering path reflected in Rule 144A and Regulation S, rather than using generic “no registration” language untethered to the exemption analysis.
- Address Trust Indenture Act treatment in the manner reflected by the documents: note whether compliance is by qualification or by incorporation of the relevant statutory provisions into the indenture.
- Modify any no-litigation assumption to match the disclosed record; if litigation is disclosed, the assumption must expressly except the disclosed matter instead of denying its existence wholesale.
- If closing deliverables are incomplete, do not silently assume them; either carve out the affected party, condition the opinion on receipt, or state that supplemental coverage will follow.
- Treat any cross-document inconsistency as a closing issue to be flagged in the draft and resolved before issuance.

## 4. Analytical scaffolds

- Build the opinion from the model template, then test each paragraph against the transaction documents and offering materials to confirm the factual predicates are still true.
- For each opinion clause, identify the governing law, the precise legal proposition, and the source document that supplies the needed facts.
- Cross-check the principal debt documents, the offering materials, the organizational documents, and the closing checklist together; if one document uses a different term, amount, mechanic, party description, or condition, flag it in brackets for resolution.
- Review disclosures for litigation, liens, sanctions, or other exceptions that alter standard assumptions or qualifications.
- Confirm that each entity covered by the opinion has the closing authority and evidence required for the coverage the draft purports to give.
- When a document set suggests more than one issuer, guarantor, or closing-law variation, enumerate the covered parties and treat each one separately rather than using a single blanket pass.
- Ensure that every substantive legal conclusion is tied to a named authority, rule, statute, regulation, or recognized doctrine.

## 5. Vertical / structural / temporal relationships

- Map the transaction vertically from offering materials to operative notes documents to organizational approvals to closing certificates; the opinion should not rely on a lower-tier fact if an upstream document contradicts it.
- Sequence the drafting temporally: pre-closing assumptions, closing deliverables, issuance of the opinion, and any post-closing supplementation must be distinguished in the wording.
- Where a discrepancy exists between documents, place the bracketed note at the point in the draft where the affected clause appears so the issue is visible in context.
- If coverage differs among entities or jurisdictions, present the opinion in entity-specific and law-specific blocks so the reader can see which conclusion attaches to which party.

## 6. Output structure conventions

- Produce a single closing opinion letter as the deliverable.
- Use a standard legal-opinion layout: heading and date line, addressee block, introductory scope, assumptions, qualifications, opinions, and closing signature block.
- Include bracketed issue notes in the draft for each unresolved cross-document discrepancy, using concise comments that identify the inconsistency and the need for resolution before final issuance.
- Keep the opinion text conventional and professional; do not convert it into a memorandum or checklist.
- Do not leave broad assumptions unqualified where the source documents show a relevant exception.
- Before completion, verify that the generated `closing-opinion-letter.docx` is the operative artifact and that it contains the full opinion text, not a summary or commentary.
