---
name: compare-draft-eb-petition
task_id: immigration/compare-draft-eb
description: Gap analysis review of a draft petition package where exhibit completeness, sequential numbering integrity, and form currency are prone to being overlooked when the filing checklist is reconciled against the petition body.
activates_for: [planner, solver, checker]
---

# Skill: Compare Draft EB-1A Petition Against Filing Checklist

## 1. Subject-matter triage

- Treat the petition body, exhibit index, filing checklist, and internal email chain as one reconciled filing package.
- Identify whether the package is a true comparison task, a completeness review, or a currency check; if only one document class is actually in scope, say so and analyze that class exhaustively.
- Separate what is expressly in the source set from what is inferred; do not fill gaps with assumed filing practice unless it is necessary to explain a deficiency.

## 2. Failure modes the skill is correcting

- Agents verify that named exhibits are physically present but do not check whether every exhibit referenced by letter or number in the petition body appears in the exhibit index, leaving omissions invisible.
- When an exhibit is missing from the package, agents note it as a single gap rather than tracing the cascading renumbering effect on every subsequent exhibit referenced in the petition narrative.
- Agents overlook form edition currency, accepting any version of the required immigration form without verifying that it matches the edition currently accepted for filing.
- Supporting research materials are assessed for substantive relevance but not for document staleness relative to filing date, a dimension practitioners routinely flag in pre-filing reviews.
- Checklist reconciliation is sometimes treated as clerical, so cross-document inconsistencies, draft-stage instructions in email, and unresolved revisions remain unprioritized.

## 3. Legal frameworks / domain conventions that apply

- Petition filings of this kind are typically submitted on the applicable immigration form; verify the currently accepted edition date before filing and treat superseded editions as a filing risk.
- The petition letter may reference exhibits sequentially; the exhibit index should mirror that sequence; any missing exhibit can create a gap that shifts later exhibit labels and produces mismatched cross-references throughout the narrative.
- There may be no codified mandatory freshness period for supporting research, but practitioners commonly apply a reasonableness standard tied to the filing date; materials that substantially pre-date filing may require updating or explanation.
- The filing checklist serves as the reconciliation instrument; each item on the checklist should be matched to a physical document in the package, and any item marked complete but absent from the package is a deficiency requiring corrective action before submission.
- Internal email chains and case communications may surface attorney or client instructions about exhibits that have not yet been incorporated into the draft; these should be reconciled against the current state of the package.
- For immigration filing packages, compliance is driven by the accepted form edition, the final exhibit sequence, and the consistency of the cover materials with the assembled record; a mismatch in any one can undermine filing readiness.

## 4. Analytical scaffolds

1. Scope enumeration: list each document stream in scope—petition body, exhibit index, checklist, and email chain—then analyze each stream against the others.
2. Petition body survey: read the petition letter and record every exhibit reference in the order it appears.
3. Exhibit index reconciliation: compare the surveyed references against the exhibit index; identify any reference that has no corresponding index entry.
4. Physical package verification: confirm each indexed exhibit is present as a document; flag any indexed item that is missing.
5. Cascading renumbering analysis: for each missing exhibit, note which subsequent exhibits are affected and state the corrective renumbering required.
6. Form currency check: verify the edition date on the required immigration form against the currently accepted edition.
7. Document staleness review: for each research or data exhibit, record the print or access date and assess whether it falls within an acceptable pre-filing window.
8. Email-chain reconciliation: extract instructions, edits, and open questions from the internal email chain and compare them to the draft package to find unresolved or contradicted items.
9. Checklist reconciliation: run through the filing checklist line by line; mark each item as present, missing, or requires revision; produce a prioritized deficiency list.
10. Issue closing: for each deficiency, state what in the source set creates the issue, what other document it affects, and why it matters for filing readiness.

## 5. Vertical / structural / temporal relationships

- Track the petition narrative, exhibit index, and checklist as vertically dependent layers: a change in the exhibit list can require updates in the narrative, index, and checklist together.
- Treat temporal freshness as filing-date anchored: a document that was acceptable when drafted may become stale by the intended filing date and should be flagged accordingly.
- When the email chain post-dates the draft, use it to identify superseding instructions or unresolved edits that should override earlier draft language.
- If a missing exhibit forces renumbering, trace the effect forward through every later exhibit reference rather than limiting the note to the absent item.
- If the checklist and exhibit index disagree, identify which source appears to be the operative control and which needs revision.

## 6. Output structure conventions

- Produce a gap analysis memorandum in a standard legal-memo format with a concise heading, brief issue summary, and a prioritized deficiency register.
- Define one ordinal severity scale at the top and apply it uniformly to every entry.
- For each deficiency entry, include: the issue, where it appears, severity, the document interaction that creates it, the filing consequence, and the corrective action.
- Organize the register by category, typically missing or misnumbered exhibits, form currency issues, stale materials, checklist mismatches, and unresolved email-driven revisions.
- Include a compact reconciliation table mapping checklist items to Present, Missing, or Requires Revision.
- Close with an explicit Recommended Actions section that assigns each action to a role reflected in the source set and ties it to the filing deadline or the next filing milestone.
- Keep the memorandum self-contained and file-ready for export as `gap-analysis-memo.docx`; if the primary document is incomplete, state that plainly and do not mask it with a summary-only response.
