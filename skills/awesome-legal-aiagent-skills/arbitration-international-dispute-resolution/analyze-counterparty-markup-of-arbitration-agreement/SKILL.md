---
name: analyze-counterparty-markup-of-arbitration-agreement
task_id: arbitration-international-dispute-resolution/analyze-counterparty-markup-of-arbitration-agreement
description: Ensures a counterparty arbitration agreement redline is analyzed for interaction effects between changes, gap-filling rules under the relevant governing law, non-signatory enforceability, and multi-agreement consolidation risks.
activates_for: [planner, solver, checker]
---

# Skill: Counterparty Arbitration Agreement Redline Analysis

## 1. Subject-matter triage
- Treat the redline as an arbitration-clause comparison exercise, not a generic contract review.
- First determine whether the source set contains one governing law, multiple plausible governing laws, or any fallback regime; analyze each identified regime separately.
- Identify whether the clause is standalone or embedded in a broader transaction document set, because consolidation, joinder, incorporation by reference, and affiliate-extension issues depend on the surrounding contracts.
- If the record contains a playbook, prior arbitration summary, and internal instructions, use them as the client’s controlling positions and compare the markup against all three.

## 2. Failure modes the skill is correcting
- Reviews each change in isolation and misses interaction effects between governing law, remedy scope, limitation periods, forum mechanics, and consolidation language.
- Flags a deletion or addition without stating the legal consequence under the relevant arbitration and contract-law framework.
- Fails to separate permissive drafting from enforceable drafting, especially where non-signatories, affiliates, related disputes, or multi-contract aggregation are implicated.
- Omits the client’s internal position and therefore misses when the markup departs from the playbook or prior summary.
- Treats a “clean” redline as unremarkable even when the change reallocates leverage, forum control, or remedial exposure.
- Uses generic risk labels without an ordinal severity rating.
- States legal conclusions without naming the governing authority that supports them.
- Describes issues without giving a practical recommendation tied to responsibility and timing.

## 3. Legal frameworks / domain conventions that apply
- Federal arbitration review is constrained by the Federal Arbitration Act, including 9 U.S.C. §§ 2, 4, 9–11, so any attempt to broaden judicial review or alter confirmation/vacatur standards must be tested against the statute.
- Enforceability of arbitration terms depends on contract formation and consent principles under the governing law, including whether a non-signatory can be bound through assumption, agency, alter ego, incorporation by reference, estoppel, or third-party-beneficiary theories.
- The chosen governing law can affect limitation periods, damages availability, fee shifting, remedies, and background contract defenses; a law change must be analyzed as a bundle, not a single edit.
- Deleting a contractual limitation period restores the relevant gap-filling period under the applicable law and claim type; identify the legal source for that default period before describing exposure.
- Remedial limitations must be read together: damages waivers, liability caps, consequential-damages exclusions, attorneys’ fees provisions, and carve-outs can compound or offset one another.
- Consolidation, joinder, class-style aggregation, and multi-contract arbitration provisions shift procedural leverage and may affect consent, efficiency, and enforceability.
- Multi-party and multi-contract clauses should be tested for tactical asymmetry: any change that expands one side’s ability to aggregate claims, select forums, or extend deadlines must be flagged as one-sided if the source documents show a negotiated baseline.
- Apply the client’s playbook positions as the reference point; deviations should be identified as departures, not merely alternative drafting.

## 4. Analytical scaffolds
- Walk the markup clause by clause and classify each edit as insertion, deletion, substitution, or relocation.
- For each substantive edit, state: what changed, why it matters legally, how it interacts with other provisions, and whether it deviates from the client’s stated position.
- For every issue, include an ordinal severity rating using a single scale defined once at the top of the memo, and use that scale consistently.
- For every legal proposition, cite the controlling authority by name and section, article, or rule; if the source documents provide the authority, use that citation format, otherwise cite the generally recognized source.
- Where the source set offers more than one governing law, limitation regime, or dispute scenario, enumerate the applicable alternatives explicitly before analyzing consequences.
- When a provision is deleted, identify the default rule that fills the gap and the resulting effect on the client’s exposure or leverage.
- When a provision is added, test whether it expands the clause’s scope, shifts consent requirements, or creates a procedural path the client did not accept in the original draft.
- When multiple edits interact, analyze the compound effect rather than repeating the single-issue analysis.
- Close each issue with three elements: a concrete scale or threshold from the source set, the cross-reference that changes the result, and the downstream consequence for the client.
- Treat the analysis as advisory: every diagnosis should end in a recommendation, not just a critique.

## 5. Vertical / structural / temporal relationships
- Track how the arbitration clause sits within the broader document stack: master agreement, schedules, ancillary agreements, and any incorporated terms.
- Identify vertical effects where a clause in the arbitration agreement alters rights in another document, or where another document supplies definitions, remedies, or claim categories that affect the arbitration analysis.
- Track temporal effects where an edit changes when a claim may be brought, how long a demand can wait, or whether rights survive termination or expiration.
- If the markup shifts venue, seat, institution, or procedural rules, test whether that change also affects governing law, interim relief, consolidation, or confirmation pathways.
- If the markup extends obligations to affiliates, representatives, successors, or related entities, analyze consent and enforceability vertically across the full transaction structure.
- If the markup aggregates disputes from multiple contracts or transactions, identify which instruments are pulled into the same proceeding and who gains procedural leverage.

## 6. Output structure conventions
- Write a senior-associate style redline analysis memorandum.
- Open with a short executive summary identifying the most material deviations from the original draft and the items that require negotiation.
- State the severity scale once near the top, then apply it uniformly to each issue entry.
- Use issue-by-issue analysis as the main body; each entry should include:
  - the edited clause or concept at issue,
  - the change made in the redline,
  - the governing authority supporting the analysis,
  - the direct risk,
  - any interaction effect with another clause or document,
  - the client consequence,
  - the severity rating,
  - and the recommendation.
- Include a separate interaction-effects discussion for compound risks that only emerge when multiple edits are read together.
- Include a playbook-comparison section that pairs the client position, the counterparty markup, and the recommended response.
- End with a Recommended Actions block that assigns each action to a role named in the source documents and gives a practical timing anchor tied to the deal or dispute timeline.
- If the source set includes a marked-up arbitration agreement, ensure the analysis tracks every substantive edit; do not omit a change simply because it appears stylistic.
- If the deliverable is produced as a memorandum, keep it analytical and directive; do not recite the full contract except where needed to explain a change.
