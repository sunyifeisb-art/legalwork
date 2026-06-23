---
name: review-inbound-nda-company-playbook
task_id: intellectual-property/review-inbound-nda-against-company-playbook
description: Reviewing an inbound NDA draft against a company playbook and related deal-context materials to produce a prioritized deviation report with redline recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Review Inbound NDA Against Company Playbook

## 1. Subject-matter triage

- Treat the inbound NDA, the internal playbook, and any counterparty counsel email as a single review set.
- If the exchange is one-directional, test whether a mutual form is being used where a unilateral form better matches the disclosure flow.
- If there is only one NDA draft, say so and review it as the sole operative agreement; if multiple versions or tracked changes exist, enumerate them before comparison.
- Do not read the draft in isolation: deal context can explain why a deviation is strategic rather than accidental.

## 2. Failure modes the skill is correcting

- Reviewing the NDA without using the email context to calibrate leverage, urgency, and the practical significance of a deviation.
- Collapsing material and immaterial differences into one bucket instead of prioritizing what changes real risk.
- Missing provisions that quietly dilute protection, especially broad use rights, residual knowledge language, or weak return/destruction mechanics.
- Treating the playbook as optional guidance rather than the baseline against which each clause must be checked.
- Drafting comments that describe the issue but do not give a concrete redline path.
- Failing to make the report usable in plain text or exported form because the redline changes are only visible through styling.

## 3. Legal frameworks / domain conventions that apply

- Anchor the review to the company’s preferred NDA positions on scope of confidential information, exclusions, permitted disclosures, term, return/destruction, remedies, governing law, venue, and any non-solicitation or use restrictions.
- Confidential information definitions should be broad enough to cover written, oral, visual, and other transmitted information the company will disclose, while preserving standard exclusions for prior knowledge, public information, independent development, and third-party sources.
- Residual knowledge or unaided-memory carveouts can materially weaken protection and should be treated as a significant deviation when present.
- A confidentiality period shorter than the playbook baseline can leave disclosed information underprotected.
- Return or destruction obligations should be tested for timing, certification, backups, and retention exceptions.
- Permitted disclosures should be limited to those necessary for representatives bound by confidentiality obligations and to disclosures required by law, with notice mechanics where customary.
- Remedies should be checked for injunctive relief or specific performance language where the playbook expects them.
- Governing law, forum, and dispute mechanics should be checked against the playbook’s preferred jurisdictional category.
- If legal conclusions are stated, tie them to the controlling authority or doctrine reflected in the source materials or in standard NDA practice; do not assert a conclusion without a legal basis.

## 4. Analytical scaffolds

1. Compare each NDA provision against the playbook position and mark every deviation.
2. Use the counterparty counsel email to explain whether a deviation is a negotiation signal, an oversight, or a concession already discussed.
3. For each issue, assess: what the clause does, how far it departs from the playbook, and whether the deviation is likely to matter in the actual deal.
4. Prioritize by practical risk to the company, not by clause order in the draft.
5. Treat broad use rights, residual knowledge, weak exclusions, short duration, and weak return/destruction mechanics as likely higher-value review points.
6. Where the draft contains mutuality, reciprocity, carveouts, or disclosure-for-business-purpose language, test whether it is consistent with the disclosure path described in the email.
7. For each issue, prepare a clean redline recommendation that can be inserted into the draft.
8. Mark every substantive textual change in a way that remains legible after export, using explicit inserted/deleted/replaced conventions in addition to any styling.
9. End each issue with a concrete recommendation, not just a diagnosis.

## 5. Vertical / structural / temporal relationships

- Check whether defined terms pull other sections with them, especially where the confidentiality definition affects exclusions, permitted use, disclosure mechanics, and return/destruction.
- Track cross-references among the confidentiality term, survival language, remedies, and any incorporated policies or exhibit-based obligations.
- If the draft uses “term” in more than one sense, distinguish the effective date, disclosure period, confidentiality survival period, and termination-triggered obligations.
- For return/destruction provisions, distinguish immediate obligations from delayed backup retention or archival exceptions.
- If the NDA has multiple tiers of recipients or multiple disclosure paths, assess each path separately rather than as a single bucket.
- If the email suggests an urgent commercial process, weigh whether the draft’s mechanics create avoidable delay in signing or disclosure.

## 6. Output structure conventions

- Deliver a prioritized deviation report with higher-risk deviations first.
- Open with a short note on the review inputs and the deal-context takeaway from the counterparty counsel email.
- State the severity scale once at the top and apply it uniformly to every issue, using an ordinal label such as Critical, High, Medium, or Low.
- For each entry, include:
  - the NDA section or clause reference,
  - the playbook position,
  - the deviation,
  - the severity,
  - the practical consequence to the company,
  - the recommended redline language.
- When redlining, use explicit textual markings that survive format conversion, such as [DELETED: ...], [INSERTED: ...], and [REPLACED: old → new], with a short rationale note tied to the specific change.
- Tie each issue to any related clause or context that changes its significance.
- Where a clause is acceptable as drafted, say so briefly and move on; do not pad with neutral observations.
- End with a concise recommended actions block that assigns an action, the responsible role, and the timing urgency tied to the deal process.
- The final file should be suitable for direct conversion to `nda-deviation-report.docx`.
