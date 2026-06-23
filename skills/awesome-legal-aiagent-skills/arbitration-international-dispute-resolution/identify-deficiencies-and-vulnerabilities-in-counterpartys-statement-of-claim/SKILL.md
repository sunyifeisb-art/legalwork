---
name: identify-deficiencies-in-counterpartys-statement-of-claim
task_id: arbitration-international-dispute-resolution/identify-deficiencies-and-vulnerabilities-in-counterpartys-statement-of-claim
description: Ensures a defense-oriented issues memo checks the claim for arithmetic integrity, applies any contractual liability cap, tests the pleaded fraud theory against the governing fraud standard, and identifies disclosure-based and notice-based defenses.
activates_for: [planner, solver, checker]
---

# Skill: Defense-Side Statement of Claim Issues Memorandum

## 1. Subject-matter triage

- Treat the claimant’s filing set as the primary source, then map each pleaded claim, remedy request, and factual allegation to the governing contract, notice, disclosure, and arbitration materials.
- If multiple claims, periods, transaction layers, or damage theories are pleaded, enumerate them first and analyze each separately before drawing aggregate conclusions.
- Where the record supports only one live theory or one relevant cap regime, state that affirmatively and explain why the other possibilities are not in scope.

## 2. Failure modes the skill is correcting

- Accepts pleaded damages figures without independently checking each subtotal, cross-check, and total, allowing arithmetic drift to contaminate the overall exposure analysis.
- Identifies a liability cap but does not convert the cap formula into the applicable monetary measure, compare it to the aggregate claim, and isolate any excess exposure.
- Treats a fraud allegation as sufficient without testing it against the governing fraud standard, including the required mental state and reliance allegations where applicable.
- Fails to test whether any fraud exception to a cap is actually available once the pleading deficiencies are identified.
- Overlooks disclosure materials that may undercut specific warranty-breach allegations through fair disclosure or equivalent transaction-specific defenses.
- Misses contractual notice provisions, timing conditions, and content requirements that can bar or narrow indemnity-style recovery.
- Ignores recoverability limits on non-standard damages or other pleaded heads of loss under the governing law.
- Omits mitigation analysis where the claimant’s own conduct may have reduced or increased recoverable loss.

## 3. Legal frameworks / domain conventions that apply

- Arithmetic integrity: verify every stated subtotal, cross-foot, and total; a defect at one step can propagate into the overall claim and any cap comparison.
- Liability cap analysis: identify the operative cap language, any formula or reference value, and any carve-outs; compare the properly stated aggregate claim against the cap.
- Fraud pleading standard: apply the controlling pleading rule for fraud in the forum or governing-law context, including the elements that must be alleged with specificity if required by the applicable authority.
- Cap carve-out doctrine: if the contract excludes fraud or similar conduct from the cap, assess whether the pleaded facts satisfy the governing standard for invoking that carve-out.
- Fair disclosure / disclosure defense: compare each alleged warranty breach to the disclosure materials and determine whether the asserted issue was disclosed with sufficient specificity.
- Notice and time-bar provisions: evaluate whether notice was timely, whether it identified the claim with sufficient detail, and whether the correct communication satisfies the contractual condition.
- Damages recoverability: test consequential, punitive, remote, or otherwise non-standard heads of loss against the governing law and the contract’s remedial architecture.
- Mitigation: assess whether the claimant took reasonable steps to avoid avoidable loss, consistent with the governing common-law or contractual standard.

## 4. Analytical scaffolds

- Build an issue register by claim and remedy. For each entry, state the issue, the governing authority, the operative source passage, severity, and the consequence for the defense.
- Verify every pleaded number against the source documents. Recompute subtotals, totals, and any downstream comparison to a cap or threshold; identify the corrected figure and the impact on exposure.
- Identify the operative cap provision and any carve-outs. Translate the cap into the relevant monetary measure using only source-document inputs, then compare it to the corrected aggregate claim.
- For each fraud theory, identify the controlling pleading authority, list the missing or weak elements, and assess whether the alleged facts actually trigger any fraud-based exception to a contractual limitation.
- For each warranty-breach theory, cross-check the disclosure record item by item to determine whether disclosure defeats or narrows the pleaded breach.
- For each indemnity-style claim, test notice timing, notice content, and notice recipient/route against the contract’s requirement, and flag ambiguity only where the source documents support it.
- Assess whether each non-standard damages category is recoverable under the governing law and whether the contract narrows or excludes it.
- Test mitigation by asking what reasonable steps were available, what the claimant did instead, and how that affects recoverable loss.
- Close each issue by tying it to scale, source cross-reference, and downstream consequence. If the issue is purely legal, anchor it to the relevant contractual threshold, pleaded amount, or procedural deadline from the record.

## 5. Vertical / structural / temporal relationships

- Track how an error at one level affects later levels: line-item figures feed subtotals, subtotals feed the aggregate claim, and the aggregate claim feeds cap and exception analysis.
- Distinguish claim-level defects from element-level defects, and do not let a defect in one theory be assumed to cure or infect a separate theory without record support.
- If notice, disclosure, or mitigation issues turn on dates, build the chronology first and then test compliance against the contractual or procedural deadline.
- When multiple filings speak to the same claim, reconcile them chronologically and identify whether later pleadings, amendments, or submissions changed the theory or the amount sought.

## 6. Output structure conventions

- Produce a defense-oriented issue memorandum in conventional memo form, not a narrative case summary.
- Include a short severity legend at the top using a uniform ordinal scale, and apply that scale to every issue entry.
- Use an issue register organized by claim or remedy, with one row or subsection per issue.
- For each issue entry, include: severity, issue statement, governing authority, source reference, scale/amount/deadline, cross-reference to interacting provision or document, and downstream consequence.
- Include a separate arithmetic verification section that lists stated figures, corrected figures, and the effect of any discrepancy on the total claim and cap comparison.
- Include a separate cap analysis section that states the operative cap language, the translated cap measure, the corrected aggregate claim, and any portion arguably outside the cap.
- Include separate legal-analysis sections for fraud pleading, disclosure defenses, notice/timing defenses, damages recoverability, and mitigation.
- End with a Recommended Actions block that gives concrete next steps in imperative form, identifies the responsible role, and ties each step to an available deadline or the next procedural milestone.
- Where the source documents identify a controlling statute, rule, treaty article, arbitral rule, or case, cite it by name and section or equivalent identifier in the analysis.
