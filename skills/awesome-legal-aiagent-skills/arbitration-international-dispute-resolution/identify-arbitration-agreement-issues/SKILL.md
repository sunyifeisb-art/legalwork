---
name: identify-arbitration-agreement-issues
task_id: arbitration-international-dispute-resolution/identify-arbitration-agreement-issues
description: Ensures a multi-document arbitration provisions review maps governing law conflicts across agreements, identifies arbitrator selection and tribunal-constitution defects, and determines the procedural law for the seat.
activates_for: [planner, solver, checker]
---

# Skill: Arbitration Provisions Issue Identification (Multi-Document)

## 2. Failure modes the skill is correcting

- Reviews each dispute-resolution clause in isolation and misses how provisions interact across the full document set, including the main agreement, side letters, amendments, and ancillary instruments
- Treats an integration clause as boilerplate without testing whether it displaces or preserves separately executed dispute-resolution terms in another document
- Confuses substantive governing law with the procedural law of the seat, leaving the supervision regime, court support, and procedural defaults unidentified
- Accepts an appointment mechanism without stress-testing whether it can deadlock, stall tribunal constitution, or require a default appointing authority
- Overlooks seat / venue drafting drift and fails to explain the practical consequences of ambiguous terminology
- Flags a restriction on evidence, time limits, or challenge rights without tying the point to the controlling arbitration statute, institutional rules, or other authority
- Describes problems abstractly instead of stating how the conflict changes enforcement risk, forum control, cost, delay, or claim viability
- Omits a concrete remediation path, leaving the reader with defects but no sequencing or ownership

## 3. Legal frameworks / domain conventions that apply

- Distinguish substantive governing law from procedural law at the seat; the seat ordinarily determines the procedural framework and supervisory court jurisdiction, while the contract’s chosen law governs substantive rights
- Read arbitration clauses together with any integration, supremacy, amendment, survival, and no-oral-modification language to determine whether multiple instruments can coexist
- Test tribunal-constitution language against the default appointment machinery in the applicable arbitration statute or institutional rules, including any fallback authority that cures a deadlock
- Assess any seat designation against the arbitration act, model-law framework, or other seat-based procedural regime that governs interim relief, set-aside, and court assistance
- Measure time-bar, evidence, waiver, and challenge provisions against the controlling statute, institutional rules, and non-waivable public-policy constraints
- Treat limitations on disclosure, document production, and witness evidence as potentially qualified by mandatory institutional discretion or mandatory procedural norms
- Treat blanket waivers cautiously where the applicable law preserves non-waivable objections, including arbitrability and public policy
- Use the arbitration clause, any related agreement, and any defined terms as a single interpretive set unless the text clearly preserves separateness

## 4. Analytical scaffolds

1. Identify each document in the suite and map the dispute-resolution provisions for that document only.
2. Build a cross-document matrix for governing law, seat, venue language, appointment mechanism, evidentiary limits, time limits, challenge waivers, and any supremacy or integration language.
3. Determine whether any clause is intended to override another clause, and whether the drafting actually accomplishes that result.
4. For each conflict, state:
   - the governing or procedural rule that resolves it,
   - the affected document(s),
   - the degree of operational risk,
   - the practical consequence for the client.
5. Test the appointment mechanism for deadlock, missing fallback, or dependence on cooperation that may fail in a dispute.
6. Read the seat language as a procedural anchor, and flag any separate reference to venue, hearing place, or location that may not match the legal seat.
7. Check whether any limits on evidence, time, appeals, or challenges are enforceable under the controlling arbitration law and institutional rules.
8. Distinguish provisions that are merely unusual from provisions that are likely pathological, void, or incapable of performance.
9. Where the documents conflict, identify the most likely hierarchy or reconciliation path before recommending any fix.

## 5. Vertical / structural / temporal relationships (only if applicable)

- When multiple agreements are in play, analyze them in sequence and by hierarchy: primary agreement, later-executed side document, amendment, then ancillary documents
- Give priority to later express modifications only if the text and execution structure support that reading
- Treat a seat clause as temporally and structurally upstream of procedural questions such as appointment, interim relief, disclosure, and set-aside
- If one document incorporates another by reference, analyze both the incorporated terms and the extent of incorporation
- If a conflict turns on timing, identify whether the later clause is a true amendment, a parallel covenant, or an independently surviving exception
- When the clause architecture is multi-layered, separate substantive overlap from procedural conflict so that the memo does not merge distinct problems into one

## 6. Output structure conventions

- Produce a severity-rated issues memo, not a prose essay
- Define an ordinal severity scale once at the top and apply it consistently to every issue
- Open with a compact governing-law / seat map for each document in the suite
- Then present an issue register in a conventional memo format, with one row or entry per discrete issue
- For each issue, include:
  - severity
  - the affected document(s)
  - the controlling authority or rule
  - the conflict or defect
  - why it matters across the document set
  - the downstream consequence for the client
  - a concrete recommendation
- Tie each issue to the relevant source text and any interacting provision elsewhere in the suite
- End with a Recommended Actions section that sequences next steps by urgency and owner
- Use clear, business-readable headings; do not mirror a hidden rubric checklist
- Keep the memo self-contained and operational, so a reader can act on it without re-reading the source package
