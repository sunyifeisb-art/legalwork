---
name: compare-ip-tech-transactions-term-sheet
task_id: intellectual-property/compare-ip-tech-transactions
description: Deviation report comparing a transaction term sheet against an engagement letter, identifying deviations and inconsistencies flagged by general counsel.
activates_for: [planner, solver, checker]
---

# Skill: Compare IP & Tech Transaction Term Sheet Against Engagement Letter

## 2. Failure modes the skill is correcting

- Treating the term sheet and engagement letter as interchangeable commercial documents instead of separating deal terms from scope-of-representation terms
- Reviewing only the GC’s flagged points and missing independent inconsistencies, omissions, or cross-document ambiguities
- Failing to distinguish binding provisions in the term sheet from non-binding business terms, especially where carve-outs or survival language change legal effect
- Missing IP-and-tech-specific allocation issues such as ownership, license scope, confidentiality, use restrictions, work product, representations, and post-closing constraints
- Describing a deviation without tying it to the relevant clause language in both documents, the interaction between them, and the practical consequence for the client
- Collapsing multiple issues into one general narrative instead of comparing each material point separately and consistently
- Writing a report that lists problems but does not convert them into usable GC action items

## 3. Legal frameworks / domain conventions that apply

- A transaction term sheet often blends non-binding business points with select binding provisions; its stated effect controls, and any binding carve-outs must be analyzed on their own terms
- An engagement letter governs the lawyer-client relationship, scope of services, fees, conflicts, confidentiality, responsibility boundaries, and termination mechanics; it does not itself set the transaction’s commercial deal
- Consistency review requires checking whether a term sheet provision is mirrored, narrowed, expanded, or omitted in the engagement letter, and whether the difference changes authority, scope, or risk allocation
- In IP and tech matters, compare provisions affecting chain of title, developed IP, license grants, data use, access rights, escrow or handoff obligations, infringement risk allocation, and post-closing restrictions
- Where a term sheet contains binding operational or conduct obligations, confirm whether the engagement letter creates any conflicting instruction, limitation, or role ambiguity
- General legal conclusions should be anchored to the governing document language and, where a proposition depends on a legal rule, the controlling rule or customary practice for the relevant point

## 4. Analytical scaffolds

- Document-function check: state what each document is meant to do before comparing them, so business terms are not mistaken for representation terms
- Clause inventory: identify every substantive topic in the term sheet, then test whether the engagement letter addresses it, omits it, or conflicts with it
- GC-concern mapping: address each flagged concern directly, but also note any related issue that the flagged concern reveals elsewhere in the documents
- Binding-effect test: isolate any term sheet language that is intended to be binding and test it against the engagement letter for consistency in scope, authority, and obligations
- Deviation classification: for each issue, label whether it is a gap, contradiction, narrowing, expansion, or alignment issue, and explain why the classification matters
- Consequence analysis: explain the downstream effect of each deviation on negotiation posture, authority to act, disclosure obligations, execution risk, or post-closing conduct
- Single-pass consistency review: compare the same issue across all relevant provisions before concluding, rather than treating each clause in isolation

## 5. Vertical / structural / temporal relationships (only if applicable)

- If the source set contains multiple versions, riders, amendments, or ancillary attachments, compare them in document-date order and note which text is later-in-time or expressly controlling
- If a topic appears in one document but is split across multiple sections or schedules in the other, reconcile the whole topic before drawing a deviation conclusion
- If timing language matters, distinguish pre-signing, signing, closing, and post-closing obligations, because a mismatch may be material even when the substantive topic appears similar
- If authority or responsibility changes over time, note whether one document assigns decision-making power, approval rights, or operational control differently from the other

## 6. Output structure conventions

- Write a deviation report suitable for GC review, using an executive summary followed by a structured comparison and then action-oriented recommendations
- Define a simple ordinal severity scale once at the top and apply it consistently to every issue entry
- Include a table for each material issue with these elements: subject, term sheet treatment, engagement letter treatment, nature of deviation, severity, and client consequence
- For each issue, include a concise comparison paragraph that cites the relevant provisions from both documents and explains the practical effect of the mismatch
- Separate binding-provision analysis from ordinary business-term comparison so the reader can see which deviations may carry immediate legal effect
- End with a Recommended Actions section that assigns each action to an appropriate role and ties it to a sensible timing anchor or transaction milestone
- Keep the report focused on operative discrepancies and avoid generic restatement of the documents
- Save the final deliverable as `deviation-report.docx`
