---
name: identify-insurance-issues-acquisition-agreement
task_id: insurance/identify-insurance
description: Agents identifying insurance issues in an acquisition agreement flag headline coverage gaps, connect those gaps to supporting evidence in the record, identify standalone uninsured exposures, and address closing deliverables that support post-closing insurance placement.
activates_for: [planner, solver, checker]
---

# Skill: Identify Insurance-Related Issues in Acquisition Agreements

## 2. Failure modes the skill is correcting

- The analysis lists insurance terms in isolation but does not tie each gap to the target’s operations, claims history, or other record evidence showing why the gap matters.
- The review treats coverage absence as a generic drafting point instead of a standalone business risk that may remain uninsured after closing.
- The memo flags problems but does not rank them by severity or explain why some items are materially more urgent than others.
- The memo omits the practical effect of the agreement’s indemnity, cooperation, survival, and closing-deliverable mechanics on post-closing insurance recovery and claims handling.
- The memo identifies exposures without ending each issue with a concrete recommendation, responsible owner, and timing tied to the transaction.

## 3. Legal frameworks / domain conventions that apply

- D&O runoff / tail coverage: in an acquisition, pre-closing acts can generate post-closing claims; a tail or runoff extension is the standard mechanism for preserving reporting coverage after the policy period ends. Evaluate whether the agreement makes tail procurement a condition to closing, who funds it, and whether the coverage period is long enough for the expected claim horizon.
- Net-of-insurance indemnity: indemnification language that offsets recoveries by insurance proceeds can shift sequencing and allocation risk when coverage is disputed, delayed, or unavailable. Analyze the clause against the agreement’s claims process and any provisions that preserve or require pursuit of insurance.
- Claims cooperation and access rights: where claims may be asserted or defended after closing, the buyer needs seller cooperation, records access, and witness availability. Review whether the agreement obligates cooperation and whether the obligation survives closing long enough to be useful.
- Pre-/post-closing claims allocation: insurance proceeds for claims spanning the signing or closing date may need explicit allocation rules. If the agreement is silent, note the risk of dispute over who controls the claim and who keeps the recovery.
- Environmental risk and survival: environmental liabilities often outlast ordinary reps and warranties, and insurance placement may not track that duration. Compare the survival period, exclusions, and any environmental-specific coverage to the likely tail of the exposure.
- Workers’ compensation experience rating: an elevated experience modification rate is both a loss-history signal and a renewal-risk indicator under workers’ compensation rating rules. Use it to assess whether the current program is stable and whether premium or placement pressure may follow.
- Flood and catastrophe sublimits: a sublimit must be assessed against the full facility footprint and geographic exposure, not a single location snapshot. A low sublimit can leave a materially exposed portfolio even where a policy exists.
- Cyber liability and technology risk: businesses with material data, automation, control systems, customer information, or digital operations ordinarily warrant standalone cyber review. The absence of dedicated cyber coverage is a separate issue, not just a note on the insurance schedule.
- Product recall / contamination / similar specialty coverage: when the business profile suggests a loss category that is commonly excluded from general liability or property forms, confirm whether specialized coverage exists or whether the risk is intentionally uninsured.
- Insurance representations and survival: short survival periods, narrow indemnity caps, or weak disclosure mechanics reduce the value of insurance reps. Assess whether the drafting gives the buyer enough time and leverage to discover coverage misstatements.
- Closing-deliverable practice: loss runs, policy copies, endorsements, certificates, claim notices, and renewal correspondence are typical materials needed to underwrite post-closing placement and evaluate open claims. Missing deliverables should be treated as actionable gaps.

## 4. Analytical scaffolds

1. Inventory every insurance-related provision, schedule entry, and closing deliverable in the acquisition record before evaluating adequacy.
2. If more than one facility, line of business, policy period, claim, or coverage type is implicated, enumerate each item separately and analyze each on its own facts rather than using a single representative pass.
3. For each issue, identify: the relevant policy or agreement provision, the coverage gap or ambiguity, the supporting record that shows the operational exposure, and the downstream effect on the buyer.
4. Apply severity ordering using a uniform ordinal scale, with the highest severity reserved for issues that create uninsured or hard-to-remedy exposure at or near closing.
5. For D&O tail issues, check whether tail procurement is a closing condition, whether the duration aligns with the likely claim window, and whether funding mechanics are specified.
6. For indemnity language, test whether “net of insurance” or similar wording creates sequencing problems, claim-control disputes, or double-recovery concerns.
7. For cooperation and claims-handling provisions, verify that they require access to files, books, records, notices, and personnel after closing, and flag any gap where open claims exist.
8. For environmental, flood, workers’ compensation, cyber, recall, or other specialty exposures, compare the policy structure to the target’s actual risk profile and identify any uninsured pocket.
9. For closing deliverables, confirm that the package includes the materials needed for post-closing placement, claim review, and renewal underwriting; add any missing categories that are standard for the risk profile.
10. End every issue with a concrete recommended action, naming the responsible role and tying the timing to signing, closing, or another transaction milestone.
11. Use controlling legal or insurance authority where a proposition depends on a doctrine, rule, or standard; do not state a conclusion without the rule supporting it.

## 5. Vertical / structural / temporal relationships

- Distinguish signing, closing, and post-closing timing when discussing tail coverage, survival, claim notice obligations, and deliverable timing.
- Track whether a policy expires before, at, or after closing, and whether the agreement requires action before the expiration date.
- Distinguish existing claims, threatened claims, and latent exposures; each may require a different insurance response.
- Where coverage depends on a notice deadline, reporting period, or renewal window, treat the deadline as part of the risk analysis rather than a footnote.
- If the target operates multiple sites or business lines, assess coverage adequacy across the full operational footprint, not only the largest or most visible location.

## 6. Output structure conventions

- Produce an insurance issues memo organized by issue and ranked by severity using a clear ordinal scale defined at the outset.
- For each issue, include: severity, the agreement provision or record reference, the gap or ambiguity, why it matters, the relevant supporting authority or standard, and the practical consequence for the buyer.
- Separate true coverage gaps from drafting ambiguities and from uninsured operational risks; do not collapse them into one bucket.
- When multiple facilities, policy periods, claims, or coverage types are implicated, use separate entries for each rather than aggregating them.
- Include a closing-deliverables subsection that identifies missing insurance materials needed for placement or claims review.
- End with an explicit Recommended Actions block. Each recommendation must use an imperative verb, identify the responsible role or party, and include a timing anchor tied to signing, closing, or immediate post-closing work.
