---
name: extract-key-terms-from-counterparty-complaint
task_id: litigation-dispute-resolution/extract-key-terms-from-counterparty-complaint
description: Preparing a litigation summary memorandum from a newly served complaint requires extracting the complaint’s claims, parties, operative facts, requested relief, and key procedural facts from the complaint and service materials, while integrating the client’s initial description of the dispute to identify discrepancies and defense-relevant issues.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Counterparty Complaint — Litigation Summary Memorandum

## 1. Subject-matter triage
- Treat the complaint, proof of service, and client email as a single intake record.
- Prioritize documents in this order: service materials for deadline control, complaint for allegations and relief, client email for correction and defense context.
- If any key source is missing or unreadable, say so and note the resulting limitation rather than guessing.

## 2. Failure modes the skill is correcting
- Summarizing claims without extracting the factual allegations that support each claim, which leaves the memo too thin for an initial defense review.
- Missing the service date or proof of service, which can distort the response deadline and case-handling urgency.
- Omitting core procedural facts such as court, case number, judge, filing date, jurisdictional basis, and venue allegations.
- Failing to separate what the plaintiff alleges from what the client says happened.
- Collapsing multiple claims, parties, or forms of relief into a single narrative instead of preserving the pleading structure.
- Identifying issues in conclusory terms without tying them to the governing rule, statute, or pleading standard that makes them relevant.
- Offering diagnoses without next-step guidance for counsel or the client team.

## 3. Legal frameworks / domain conventions that apply
- A newly served complaint should be assessed immediately for response timing under the governing procedural rules of the forum.
- Service materials matter because they control or inform the deadline analysis; if service is disputed or incomplete, flag that expressly.
- Jurisdictional analysis should address subject matter jurisdiction, personal jurisdiction, and venue as pled or apparent on the face of the papers.
- The pleading standard relevant to the forum governs whether the complaint alleges enough facts to state a claim; identify the standard rather than merely calling the pleading “weak.”
- The prayer for relief should be parsed by category: monetary, equitable, declaratory, punitive, fee-shifting, and costs.
- The client’s account is not a substitute for the complaint; it is a comparison point for inconsistencies, omissions, and defense themes.
- Any legal proposition stated in the memo should be anchored to a controlling authority by name, rule, statute, regulation, or doctrine.

## 4. Analytical scaffolds
- Extract procedural data first: court, docket or case number, judge if stated, filing date, service date, method of service if stated, and the response deadline or deadline-triggering facts.
- Enumerate the parties and roles before analysis: plaintiff, defendant, affiliates or signatories if named, and each party’s stated capacity.
- For each claim, capture the count number, legal theory, key factual allegations, and relief requested for that count.
- For each claim, note the legal hook the pleading appears to invoke and the rule or doctrine that makes the count recognizable.
- Extract the prayer for relief separately from the body of the complaint so the requested remedies are not lost in the count analysis.
- Compare the complaint with the client email in parallel: identify overlaps, direct contradictions, facts the client supplies that the complaint omits, and facts the complaint asserts that the client disputes.
- If the complaint implicates multiple parties, claims, transactions, contracts, events, or time periods, enumerate each before synthesizing; do not analyze them as a single blended dispute.
- Flag apparent defenses or case-management issues that are visible from the face of the papers, including limitations, jurisdiction, venue, pleading sufficiency, standing, service defects, and preservation needs.
- When noting an issue, state the governing authority or doctrinal basis and the practical consequence for the defense posture.

## 5. Vertical / structural / temporal relationships
- Preserve the sequence of the litigation timeline: underlying events, filing, service, response deadline, and any stated pre-suit communications.
- Distinguish between allegations directed to liability, allegations directed to damages, and allegations directed to procedure.
- Track whether facts are pleaded as direct events, background context, or exhibits; the placement often signals how much weight the allegation carries.
- If the complaint references multiple agreements, transactions, or business relationships, show how they relate vertically rather than flattening them into one narrative.
- If the service record and complaint dates create tension, note the timing issue and its downstream effect on answer, motion, or appearance strategy.

## 6. Output structure conventions
- Use a memorandum format with clear headings in an industry-conventional order, such as:
  - Procedural Overview
  - Parties
  - Claims and Allegations
  - Relief Requested
  - Client Account Comparison
  - Issues for Immediate Attention
  - Next Steps
- Keep each section concise but information-dense; the memo should let supervising counsel locate the deadline, the claims, the requested relief, and the key discrepancies quickly.
- Within the claims section, organize by count and preserve the pleading’s own labels where possible.
- In the comparison section, present agreement, disagreement, and missing information as separate subparts.
- In the issues section, distinguish legal defects from factual disputes and from operational needs.
- End with a short Recommended Actions block that assigns each action to a responsible role and ties it to the applicable deadline or near-term milestone.
- Do not include filler, narrative scene-setting, or conclusions untethered to the source materials.
