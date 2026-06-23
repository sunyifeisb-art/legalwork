---
name: draft-dpa-markup-defense-counsel
task_id: white-collar-defense-investigations/draft-markup-of-deferred-prosecution-agreement
description: Section-by-section markup of a government-drafted deferred prosecution agreement with defense counsel redlines and comments, addressing penalty reduction, criminal charge scope, monitor provisions, and agreement term in light of applicable enforcement policy.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Government DPA — Defense Counsel

## 1. Subject-matter triage (only if applicable)

- Treat the draft as a negotiated enforcement instrument, not a generic contract: identify which provisions are legally operative, which are policy-driven, and which are merely settlement mechanics.
- If the source set contains multiple iterations, comments, or negotiation notes, compare the government draft against the latest defense position and any supporting facts before proposing text.
- If the matter implicates a self-disclosure posture, first determine whether the available materials support a penalty reduction, a narrower charge scope, shorter term, or no monitor at all.

## 2. Failure modes the skill is correcting

- A books-and-records or internal-controls count included among the charged provisions is miscategorized or omitted from analysis; the possibility of negotiating the treatment of such counts in exchange for enhanced compliance commitments is not recognized or proposed.
- A voluntary self-disclosure-based penalty reduction is not reflected in the redlined penalty provision, and the applicable policy authority is not cited to support the defense position.
- The markup discusses monitorship in abstract terms but does not press for elimination, narrowing, fee controls, term limits, or company input on selection and oversight.
- The statement of facts is accepted wholesale instead of being narrowed to admitted, supportable language that minimizes downstream risk.
- The proposed term is left unchanged even where the posture and remediation record support a shorter duration.
- Changes are shown only by formatting, so the redline is not legible after export or conversion.
- Issues are described without an explicit defense recommendation, priority, or legal basis.

## 3. Legal frameworks / domain conventions that apply

**Charges in a deferred prosecution agreement:**
- Identify each charged theory separately and distinguish among anti-bribery, books-and-records, internal-controls, and any other alleged provisions.
- Consider whether the markup should seek to narrow, reframe, or remove particular counts in exchange for enhanced compliance commitments, depending on the posture of the matter and the language in the draft.
- Tie any charge-scope proposal to the governing enforcement framework reflected in the source materials and, where relevant, the statutory elements of the charged theory.

**Voluntary self-disclosure — penalty calculation under enforcement policy:**
- If the draft contemplates a penalty despite voluntary self-disclosure, fully cooperation, and timely remediation, the markup should reflect the applicable policy-based reduction in the penalty provision and cite the policy authority by name.
- Ensure any referenced sentencing or penalty worksheet is internally consistent, with the applicable inputs, adjustments, and mitigation reflected in the draft or attached materials.
- Where the draft uses policy terms of art, use them consistently and do not concede more than the supportable policy position warrants.

**Monitor provisions:**
- If a compliance monitor is proposed, assess whether policy considerations support opposing monitorship altogether or narrowing it.
- If monitorship cannot be avoided, negotiate for a limited scope, a defined term, fee controls, and a process for company input on selection and oversight.
- Anchor objections to monitorship in the remediation record, the company’s compliance enhancements, and any cited policy considerations.

**DPA term:**
- Review the proposed term against the company’s cooperation and remediation posture and consider whether the markup should seek a shorter duration with policy support.
- Align the term proposal with the practical burden of the reporting and certification obligations that remain after signing.

**Statement of Facts:**
- Scrutinize every phrase in the statement of facts; language describing conduct can affect parallel proceedings and any future breach analysis.
- Limit the statement to conduct that is admitted and supportable, avoiding broader characterizations where possible.
- Narrow adjectives, mental-state language, and sweeping conduct descriptions wherever they exceed what is necessary to resolve the matter.

**General authority use:**
- For every substantive legal or policy proposition, cite the controlling authority by name and section when known, or the best-recognized authority reflected in the materials.
- Do not state a legal conclusion without naming the rule, statute, regulation, policy, or doctrine that supports it.

## 4. Analytical scaffolds

1. **Penalty reduction in markup**: Does the redlined penalty provision reflect any available self-disclosure or cooperation reduction? Is the applicable policy cited?
2. **Penalty worksheet**: Is the calculation internally consistent, including the base amount, adjustments, and mitigation reflected in the draft materials?
3. **Charge-by-charge analysis**: Is each count separately identified? Is a compromise regarding one or more counts in exchange for enhanced compliance commitments proposed where appropriate?
4. **Monitor provisions**: Does the markup oppose or limit monitorship based on policy considerations for a company that voluntarily self-disclosed? If monitorship is unavoidable, are scope, term, fee controls, and selection process negotiated?
5. **DPA term**: Does the markup propose a shorter term with policy support where the facts warrant it?
6. **Remediation credit**: Are specific remediation steps cited to support narrower monitorship or a shorter term?
7. **Statement of Facts language**: Does the markup propose limiting factual characterizations to what is admitted and supportable?

When more than one charge, provision, or factual cluster is in play, enumerate each item first and analyze it separately rather than collapsing distinct issues into a single pass.

For each issue raised in the markup commentary, include:
- a severity level using a consistent ordinal scale defined once at the top of the memo,
- the governing authority or policy basis,
- the practical consequence of leaving the draft unchanged,
- the specific defense position and proposed textual change.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track how the penalty provision, charge scope, monitorship, and term interact; do not negotiate them as isolated clauses when one concession is the lever for another.
- Reconcile the statement of facts with any admissions, cooperation obligations, certification language, or breach triggers elsewhere in the draft.
- Check whether compliance enhancements, reporting covenants, or remediation commitments are already doing the work that a monitor or longer term would otherwise justify.
- Preserve chronology where it matters: conduct, disclosure, remediation, negotiation posture, and post-signing obligations should not be blended.
- If the source materials identify multiple periods or factual phases, keep the markup tied to the relevant phase rather than using a single generalized recitation.

## 6. Output structure conventions

- Produce the primary deliverable first: the markup memo in a form suitable for conversion to `dpa-markup-memo.docx`, with the operative redline language embedded in the memo.
- Use a tracked-changes style that survives plain-text conversion: every substantive deletion, insertion, or replacement must be marked explicitly in text, not only by formatting.
- Use a consistent convention such as:
  - `[DELETED: …]`
  - `[INSERTED: …]`
  - `[REPLACED: old → new]`
  - `[Rationale: …]`
- Attach a short defense comment to each redline block explaining why the change is sought and what authority or policy supports it.
- Organize the memo by agreement section, then by subissue, and rank issues from highest negotiation leverage to lower-leverage cleanup points.
- Use a conventional severity scale at the top of the memo, then apply it uniformly to each section comment.
- For each issue entry, state the defense ask, the redline language, and the reason the change matters to exposure, operations, or future proceedings.
- Conclude with a concise Recommended Actions block that assigns each next step to a role and a timing anchor drawn from the negotiation posture or signing timetable.
- Do not rely on styling alone for redlines; the text itself must show every substantive change.
- If the source materials support one primary proposal over another, state the preferred fallback position as well.
