---
name: analyze-change-of-control-provisions
task_id: corporate-ma/analyze-change-of-control-provisions-across-targets-material-contracts
description: Guides systematic review of change-of-control and anti-assignment clauses across a portfolio of material contracts, capturing trigger type, required action, notice timing, and cascading risk across the full document set.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Change of Control Provisions Across Target's Material Contracts

## 1. Subject-matter triage

This task covers a portfolio of heterogeneous contracts. First separate the documents into functional buckets such as commercial agreements, financing documents, real property instruments, and compensation or employment arrangements, because each bucket commonly uses different change-of-control mechanics, remedies, and notice structures.

If the deal structure is not fully specified, state the assumed transaction form before analyzing individual clauses and test the provision against the relevant structure rather than treating all ownership changes as the same event.

When multiple contracts are in scope, enumerate the set of documents and analyze each one individually; do not collapse distinct counterparty or document-specific risks into a single generalized pass.

## 2. Failure modes the skill is correcting

- Treating anti-assignment language and explicit change-of-control language as equivalent without testing whether the transaction structure may avoid or trigger an assignment concept under general contract doctrine
- Noting a consent requirement without checking the notice deadline against the anticipated closing timeline or identifying whether a waiver or termination window has already closed
- Overlooking financing-default triggers, which may operate independently of consent mechanics and may cross-default into other facilities
- Failing to address deferred compensation and employment agreements, which may carry both operational continuity risk and potential tax consequences under change-of-control compensation rules
- Describing an issue without closing it against the operative contract language, the interacting document, and the practical consequence for the deal team

## 3. Legal frameworks / domain conventions that apply

- Change-of-control clauses often appear in several forms: automatic termination upon a change of control, consent required, a counterparty right to terminate, and deemed-assignment triggers embedded in anti-assignment language
- Transaction structure matters: some merger structures may not constitute a legal assignment under general contract principles, but explicit definitions that reference ownership, control, merger, consolidation, asset sale, or similar concepts may still capture the transaction
- Financing documents often contain a separate change-of-control default distinct from any consent requirement; the remedy is typically acceleration or another financing remedy, not termination of the underlying commercial relationship
- Auto-renewal and evergreen provisions create notice windows that must be mapped against the anticipated closing timeline; a missed notice window during the deal process may extend the contract beyond the intended term
- Compensation arrangements triggered by a change of control may require separate review for severance, acceleration, bonus, or tax-related consequences; identify employment and deferred compensation agreements containing such provisions
- When the source documents identify a controlling rule, definition, or standard, use that authority as the anchor for the analysis; otherwise cite the governing contract language or the generally recognized contract principle supporting the conclusion

## 4. Analytical scaffolds

For each contract in the document set, extract and record:

1. Change-of-control trigger language: identify the defined event, including ownership, board composition, merger, asset sale, control, or similar concepts
2. Transaction-structure analysis: apply the described deal structure to determine whether the trigger is activated or avoided
3. Required action: consent before closing, post-closing notice only, right to terminate within a window, or automatic termination
4. Notice deadline: map any timing requirement against the anticipated closing date and flag deadlines that fall before closing or shortly after closing
5. Remedy if not obtained: termination, acceleration, loss of exclusivity, suspension of performance, default, or another contractual remedy
6. M&A carve-out: identify carve-out language and assess whether the current deal structure falls within it
7. Conflicting provisions: flag internal tension within the same agreement, such as a carve-out in the change-of-control clause but no corresponding carve-out in the anti-assignment clause, or vice versa
8. Employment and deferred compensation: identify good-reason definitions that enumerate post-closing operational changes as triggers and assess potential tax or timing consequences for each affected individual or class
9. Cross-document interaction: test whether the provision interacts with a financing package, consent matrix, equity plan, or related agreement in a way that changes the practical risk rating

For each issue, do not stop at description. Tie it to the scale of the risk, the interacting clause or document, and the downstream consequence for the client.

## 5. Vertical / structural / temporal relationships

Financing-document change-of-control defaults may cross-default into other financing arrangements; analyze all related financing documents together before concluding on financial covenant risk. Employment agreements with accelerated vesting or severance may interact with equity plan documents; confirm whether the equity plan separately defines a change of control and whether the definitions are aligned.

Temporal sequencing matters. Compare any notice, consent, or termination window to the expected signing and closing path, then note whether the relevant action must occur pre-signing, pre-closing, immediately after closing, or within a post-closing cure period.

If the same counterparty appears in multiple agreements, assess whether the provisions operate cumulatively, independently, or with priority rules that change the practical remedy.

## 6. Output structure conventions

- Begin with a short methodology note stating the assumed transaction form, the document universe reviewed, and any material information gaps
- Include a summary table with columns for Contract, Trigger Type, Required Action, Notice Timing, Severity, and Practical Risk
- Define the severity scale once, then apply it uniformly across all entries using an ordinal label set such as Critical / High / Medium / Low
- Organize the body by risk tier or another clear priority sequence, with one row or subsection per contract or issue
- For each issue, state the operative trigger, the interacting clause or document, the legal or contractual authority supporting the conclusion, and the downstream effect on closing, financing, operations, or leverage
- Where several documents are implicated, include a separate cross-document matrix or grouped discussion so the reader can see cumulative exposure
- End with a Recommended Actions section using imperative verbs, naming the responsible role and a timing anchor tied to signing, closing, or another transaction milestone
- If the deliverable is to be produced as a file, ensure the target file is the operative report itself and not merely a summary of it
