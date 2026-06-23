---
name: compare-nda-versions-corporate-playbook
task_id: intellectual-property/compare-mutual-and-unilateral-nda-versions-against-corporate-playbook
description: Deviation report comparing mutual and unilateral NDA drafts against an internal playbook, with version-by-version redline recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Compare Mutual and Unilateral NDA Versions Against Corporate Playbook

## 1. Subject-matter triage

Mutual and unilateral NDAs are not interchangeable. A mutual NDA should be read as reciprocal protection; a unilateral NDA should be read as asymmetric protection for the disclosing party. Start by identifying which draft governs which information flow, then test each against the playbook and deal context on its own terms before comparing them.

Treat the counterparty drafts as separate instruments, unless the source materials show they are alternative forms for the same transaction. If more than one draft, version, or scenario is in scope, enumerate each one first and analyze each pass independently rather than blending them.

## 2. Failure modes the skill is correcting

- Treating mutual and unilateral NDAs as equivalent and missing how reciprocity changes disclosure risk, carve-outs, and enforcement posture
- Applying the playbook mechanically without distinguishing provisions that matter differently in a bilateral versus one-way confidentiality structure
- Skipping the deal context and failing to ask whether the commercial relationship supports mutuality, unilateral protection, or a hybrid position
- Missing standard playbook items that are often omitted or softened in counterparty paper, including return-or-destruction, injunctive relief, use restrictions, and any non-solicit or non-circumvention concept tied to the NDA
- Failing to separate true deviations from drafting choices that are consistent with the underlying structure
- Writing comments that describe the issue but do not state why it matters, what it interacts with, and how it affects the client’s position
- Producing markup comments that are visually obvious but not textually recoverable after export

## 3. Legal frameworks / domain conventions that apply

- Confidential information should usually be defined broadly, with customary exclusions for public information, prior knowledge, independently developed information, and third-party information lawfully received
- Non-use and non-disclosure obligations should track the sensitivity and commercial life of the information at issue
- Residuals language can weaken protection, especially where technical know-how or trade secrets are involved; assess whether the playbook permits it at all
- Return, destruction, and certification obligations often matter more at termination than during active discussions
- Injunctive relief language is a common enforcement backstop; its absence can materially reduce leverage
- Term, survival, and duration of confidentiality obligations should align with the expected lifespan of the disclosed information
- Governing law, venue, and dispute resolution should be checked against the playbook’s preferred framework
- Any legal conclusion should be tied to the controlling authority or drafting convention that supports it, rather than stated as a bare conclusion

## 4. Analytical scaffolds

- Mutual NDA pass: identify the provisions that matter in a reciprocal disclosure setting, then classify each deviation from the playbook as favorable, neutral, or adverse
- Unilateral NDA pass: identify whether the asymmetry properly protects the disclosing party, then classify each deviation from the playbook
- Cross-version comparison: compare the two drafts clause by clause to identify where one version departs more sharply from the playbook than the other
- Deal-context pass: assess whether the business relationship calls for a mutual form, a unilateral form, or a negotiated hybrid; explain why the chosen structure matters
- Issue-close for each deviation: state the practical scale of the point, identify the clause or term it interacts with elsewhere in the draft or source materials, and explain the downstream consequence for the client
- Severity assignment: label every issue with a uniform ordinal severity scale and use that scale consistently throughout
- Redline recommendation: for each deviation, give a concrete counter-position or replacement text direction, with a short rationale that can be carried into markup
- Change marking: if drafting markup recommendations, make each substantive change identifiable in plain text as well as by styling, so the instruction survives conversion to .docx

## 5. Vertical / structural / temporal relationships

- Analyze each draft as a whole and then clause-by-clause; do not assume the same edit should be made in both versions
- Track vertical dependencies within each NDA: definition, operative restriction, exceptions, term, survival, remedies, and boilerplate should be checked in sequence
- Check temporal effects separately: what applies during discussions, at signing, during the confidentiality term, and after termination
- If the draft contains alternative formulations, fallback language, or bracketed options, state which one is preferred and why
- If multiple documents or versions interact, identify the controlling document and any provisions that are cross-referenced or overridden

## 6. Output structure conventions

- Produce a classified deviation report, not a generic summary
- Use a clear severity legend at the top and apply it uniformly to every issue entry
- Organize the report by draft version, then by clause or topic, then by recommended edit
- For each issue, include: severity, short issue label, why it deviates from the playbook, the relevant interaction or dependency, the practical consequence, and the recommended redline direction
- Use robust textual redline notation for any proposed edits, such as explicit deletion and insertion markers, so the change can be read without visual formatting
- End with a concise recommended-actions block that assigns the next step to the appropriate role and ties it to the deal timetable or review milestone
- Keep the tone as a legal working paper: precise, comparative, and action-oriented
