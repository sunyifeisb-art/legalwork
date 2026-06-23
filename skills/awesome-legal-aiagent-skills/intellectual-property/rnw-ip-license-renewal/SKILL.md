---
name: rnw-ip-license-renewal
task_id: intellectual-property/rnw-ip-license-renewal
description: Analyze IP license renewal proposals from the licensee’s perspective by comparing proposed renewal terms, commercial need, patent validity and enforceability considerations, sublicense implications, and financial impact to produce a renewal analysis memorandum.
activates_for: [planner, solver, checker]
---

# Skill: IP License Renewal Analysis

## 1. Subject-matter triage

Treat the source set as a renewal decision package, not a standalone contract review. First map each license to its renewal proposal and then read the financial analysis, sublicense documents, and patent landscape against that license.

When multiple licenses or proposals are present, enumerate them first and analyze each on its own before drawing cross-license conclusions. If only one license is actually at issue, say so and explain why.

Prioritize hard deadlines, auto-renewal mechanics, and notice mechanics before commercial analysis. A missed notice date can determine the outcome before any merits assessment.

## 2. Failure modes the skill is correcting

- Analyzing proposed renewal terms without measuring them against the existing license, leaving fee changes, scope changes, and term changes untested
- Treating patent landscape material as background instead of the core validity/enforceability check that determines whether renewal has value
- Ignoring the sublicense chain, especially where upstream lapse may impair downstream rights or revenue
- Missing renewal notice dates or automatic renewal mechanics that create irreversible consequences
- Evaluating economics in the abstract instead of tying renewal cost, non-renewal cost, design-around cost, and infringement risk to the source financial analysis
- Collapsing multiple licenses into one blended recommendation and obscuring license-specific leverage
- Stating conclusions about renewal value without naming the controlling license provision, patent-law principle, or notice rule that supports the conclusion

## 3. Legal frameworks / domain conventions that apply

- Renewal analysis is a comparative exercise: existing license terms, proposed renewal terms, patent status, commercial need, and available alternatives must be assessed together
- Renewal notice provisions control timing; auto-renewal and non-renewal provisions can be dispositive if the notice period has run
- Patent validity and enforceability inform the economic value of renewal; expired patents, weak claims, or substantial prior-art risk reduce leverage and may support negotiation or declination
- Sublicense survival depends on the sublicense grant, the upstream license, and any express continuation or termination provisions; do not assume downstream rights survive the upstream lapse
- Most favored licensee concepts, if present in the source documents, may affect the benchmark for renewal terms and negotiating leverage
- Financial impact analysis should be read for relative rather than absolute value alone: direct fees, avoided litigation exposure, transition costs, substitute technology costs, and sublicense revenue all matter
- Any legal proposition used in the memo should be anchored to the controlling authority stated in the source materials or to the relevant governing document provision

## 4. Analytical scaffolds

1. For each license, identify the renewal deadline, notice period, and any automatic renewal or expiration consequence
2. Compare the proposal to the current license on fee, term, scope, field of use, royalty base, territory, sublicense rights, termination mechanics, and any other material commercial term
3. Assess whether the licensed technology still fits the licensee’s current operations, product roadmap, and dependency profile
4. Review the patent landscape for each licensed patent family or claim set and evaluate validity, enforceability, and expiration timing
5. Cross-check the financial analysis for the economic cost of renewal versus non-renewal, including transition, substitute sourcing, litigation exposure, and lost sublicense economics
6. Review any sublicense instrument for survival, consent, transfer, termination, or pass-through obligations that affect the renewal decision
7. Identify any contractual leverage points, including most favored licensee language, improvement rights, or renewal pricing mechanics
8. State a license-specific recommendation using commercially conventional categories such as renew as proposed, renew only with changes, preserve rights while negotiating, or decline and transition
9. For each issue identified, include the scale or magnitude shown in the source documents, the interacting document or clause, and the downstream consequence for the licensee

## 5. Vertical / structural / temporal relationships

Track the documents vertically: upstream license, renewal proposal, downstream sublicense, and patent landscape. If a downstream agreement depends on an upstream right, explain the dependency explicitly and note whether renewal preserves that chain.

Track the timeline horizontally: initial grant, notice window, renewal date, patent expiry or challenge timing, and any business milestone tied to product launch, commercialization, or transition. A temporal mismatch can matter more than the nominal economics.

Where the sources contain more than one license or product line, keep the analysis separated by license, then add a short cross-license dependency section only if the documents show commercial linkage or shared IP dependence.

## 6. Output structure conventions

- Write a renewal analysis memorandum from the licensee’s perspective
- Organize the memo by license, not as a generic issue list
- For each license, address: notice timing, proposed term changes, patent landscape implications, financial impact, sublicense implications, and recommended course
- Use short issue labels followed by a concise analysis paragraph; do not bury the decision point
- When relying on a legal proposition, name the controlling authority, governing clause, or patent-law principle that supports it
- End with a clear recommendation for each license and a separate Recommended Actions block that assigns the next step to the responsible business or legal owner with a timing anchor
- Include a short cross-license dependency section only if the source documents show an actual relationship among the licenses
- Draft the memo itself as the operative deliverable; do not substitute an outline or summary of what the memo would say
