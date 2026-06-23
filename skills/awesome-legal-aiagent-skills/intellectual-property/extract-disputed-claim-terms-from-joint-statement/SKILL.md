---
name: extract-disputed-claim-terms-joint-statement
task_id: intellectual-property/extract-disputed-claim-terms-from-joint-statement
description: Preparing a claim construction chart from a joint statement and related patent materials, requiring intrinsic record analysis, means-plus-function screening, prosecution history analysis, and priority ranking for hearing preparation.
activates_for: [planner, solver, checker]
---

# Skill: Extract Disputed Claim Terms from Joint Construction Statement

## 1. Subject-matter triage

- Start by identifying the actual disputed terms, the claims they appear in, and whether any term appears in more than one claim or in both independent and dependent claims.
- Use the joint statement as the term index, but confirm each term against the claims chart, specification, prosecution history, scheduling order, and strategy email before treating it as fully in scope.
- Separate true construction disputes from phrasing disputes, indefiniteness arguments, and means-plus-function questions; each requires a different level of attention in the chart.
- If the source set contains multiple versions of a proposed construction, preserve the version tied to the latest joint filing or strategy direction unless another source expressly supersedes it.

## 2. Failure modes the skill is correcting

- Listing disputed terms without mapping each term to the exact claim language and claim number.
- Treating each claim in isolation and missing that the same term should usually be construed consistently across the patent.
- Failing to screen functional or nonce-language terms for means-plus-function treatment.
- Ignoring prosecution history arguments, narrowing amendments, or disclaimer language that can control scope.
- Omitting claim differentiation analysis when a disputed term appears in both independent and dependent claims.
- Producing a chart that reports constructions but does not explain which construction is more likely to be adopted and why it matters.
- Failing to distinguish high-impact hearing issues from low-impact definitional disputes.
- Writing a chart that reads like a summary instead of a litigation-ready construction matrix.

## 3. Legal frameworks / domain conventions that apply

- Claim terms are construed according to their ordinary and customary meaning to a person of ordinary skill in the art, read in light of the intrinsic record.
- The intrinsic record is primary: claim language first, then specification, then prosecution history; extrinsic sources are secondary and cannot override clear intrinsic evidence.
- Means-plus-function analysis applies when claim language recites function without sufficient structure, including certain functional formulations and nonce terms; if triggered, identify the claimed function and the corresponding structure in the specification.
- Prosecution history can narrow scope through amendment, argument, or surrender, and that limitation can bind later construction.
- Claim differentiation informs scope, especially where a disputed term appears in an independent claim and a dependent claim that adds related language.
- Specification disavowal or definitional language can limit otherwise broad claim wording.
- Cross-term consistency matters: the same claim term should not be given different meanings absent a clear intrinsic basis.
- Construction should be tied to the infringement and validity consequences that drive hearing preparation.

## 4. Analytical scaffolds

1. Enumerate every disputed term from the joint statement before analysis begins; keep the numbering aligned to the joint statement and preserve that numbering throughout the chart.
2. For each term, identify all claims where it appears and quote only the minimum claim language needed to locate the dispute.
3. For each term, set out each side’s proposed construction and the core citations they rely on.
4. Analyze the term in intrinsic-record order:
   - claim language
   - specification
   - prosecution history
   - only then any persuasive extrinsic support
5. Test whether the term is being used consistently across claims, including reuse in dependent claims, parallel claims, or related phrases.
6. If the term is functional, generic, or structurally thin, determine whether means-plus-function treatment is plausible; if so, identify the claimed function and the corresponding structure disclosed in the specification.
7. If prosecution history contains narrowing language, amendment, or argument, state the likely scope effect and whether the dispute is partly or wholly governed by estoppel or disclaimer.
8. If a dependent claim appears to narrow or confirm the scope of the disputed term, analyze that relationship expressly rather than folding it into the general discussion.
9. For each term, state a recommended construction that is litigation-usable, not merely descriptive; if the best answer is that the term needs no construction, say so with a reason.
10. For each term, include a short risk assessment addressing which construction is more likely to be adopted and the likely effect on infringement or validity.
11. Rank hearing importance by practical impact: means-plus-function issues, prosecution-history-driven limitations, terms central to infringement, and terms that materially affect validity come first.
12. If the source materials point in different directions, reconcile them by hierarchy rather than averaging them.

## 5. Vertical / structural / temporal relationships

- A construction that applies to a term in an independent claim generally carries to the same term in dependent claims unless the claim text or intrinsic record requires a narrower reading.
- Dependent claims are relevant not only for narrowing scope but also for confirming what the independent claim does not already contain.
- Prosecution history statements made during examination can affect all later uses of the same term, regardless of which party is now advancing them.
- When a term appears in multiple places, analyze whether each occurrence is truly identical or whether the surrounding claim language supplies a different context that justifies a distinct reading.
- Hearing ordering should reflect dependency: a foundational construction that controls several downstream terms should be treated as more important than a standalone term with limited reach.

## 6. Output structure conventions

- Draft a claim construction chart as the primary deliverable and make it complete before any ancillary notes.
- Use one row per disputed term.
- For each row, include the term, the claims where it appears, each party’s proposed construction with citations, the intrinsic-record analysis, any means-plus-function determination, any prosecution-history limitation, a recommended construction, a risk assessment, and a hearing priority designation.
- Use concise but complete language; each row should be usable in a hearing-prep binder without further editing.
- Include a separate cross-term dependency section for terms whose constructions are logically linked or whose interpretation should be coordinated.
- Include a hearing-priority section ordered from highest to lowest strategic importance.
- If a term requires no construction, mark it explicitly and explain why the ordinary meaning or intrinsic record makes that result appropriate.
- Keep constructions and analysis internally consistent across the chart; do not let a later row silently override an earlier one.
