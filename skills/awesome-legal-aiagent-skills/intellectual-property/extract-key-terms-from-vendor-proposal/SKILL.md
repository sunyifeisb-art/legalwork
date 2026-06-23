---
name: extract-key-terms-vendor-proposal
task_id: intellectual-property/extract-key-terms-from-vendor-proposal
description: Reviewing a vendor proposal package against a request-for-proposal package to produce a structured term sheet summary with risk assessments, requiring comparison across responding vendors and identification of gaps versus stated requirements.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Vendor Proposal

## 1. Subject-matter triage

When source documents include an RFP, one or more vendor proposals, pricing exhibits, security appendices, and procurement guidance, organize extraction by requirement category: scope, implementation, service levels, pricing, security, legal terms, insurance, data handling, term/termination, and transition assistance. Keep each vendor separate; if multiple vendors respond, enumerate them first and then analyze each against the same requirement set. Treat the proposal as a commercial risk document, not as a substitute for the governing agreement.

## 2. Failure modes the skill is correcting

- Extracting terms from the proposal without comparing them to the RFP and procurement baseline
- Collapsing multiple vendor responses into one blended summary
- Missing silent gaps, carveouts, or reservation language that undercut headline commitments
- Failing to distinguish proposal language from binding contract language
- Stating deviations without tying them to the affected requirement and practical consequence
- Omitting an ordinal severity assessment for each issue
- Giving conclusions without naming the controlling contractual or legal principle being applied

## 3. Legal frameworks / domain conventions that apply

- A vendor proposal is typically an offer-stage document; legal effect depends on the executed agreement and any incorporated attachments
- Scope and deliverables should be read against the RFP’s minimum requirements and any assumptions or exclusions in the proposal
- Commercial terms require comparison of headline pricing, pass-through charges, implementation fees, change-order mechanics, and termination or exit costs
- Service-level commitments should be checked for uptime, service credits, response times, escalation paths, exclusions, and credit caps
- Security and privacy commitments should be checked against stated certifications, audit rights, encryption, incident notification, subcontracting controls, and data-use restrictions
- Intellectual property and data rights should be reviewed for ownership of custom work, pre-existing materials, derivative works, outputs, and usage rights
- Liability, indemnity, insurance, and termination provisions should be compared to the procurement baseline and any required risk allocation
- Where the proposal references external standards, the specific standard or authority should be identified rather than summarized loosely
- Risk ratings should reflect commercial importance, implementation impact, and the degree of mismatch between the proposal and the RFP baseline

## 4. Analytical scaffolds

1. Enumerate the vendor(s) and the governing source documents before analysis.
2. Build a requirement matrix with columns for RFP requirement, vendor response, deviation or silence, cross-reference, consequence, and severity.
3. For each requirement category, extract the operative proposal language into paraphrase, then compare it to the RFP baseline and procurement guidance.
4. Flag any assumption, exclusion, exception, conditionality, or “subject to” qualifier that narrows the commitment.
5. If more than one vendor is in scope, run the same matrix for each vendor and keep the rows separate.
6. For pricing, identify each cost component and any non-obvious charge triggers; do not rely on the headline number alone.
7. For service levels, compare the commitment package as a whole: metric, measurement period, exclusions, remedies, and caps.
8. For security, privacy, and compliance, extract the commitment, the evidentiary support cited by the vendor, and any limitation on the commitment.
9. For legal terms, compare indemnity, liability cap, IP ownership, data rights, audit rights, assignment, and termination to the procurement baseline.
10. For each issue, state severity on an ordinal scale and pair it with the downstream operational, economic, regulatory, or negotiation consequence.
11. Close each issue by tying it to the relevant proposal section and any related exhibit, schedule, or incorporated document.
12. End with concrete next steps identifying who should act and what should be negotiated, confirmed, or escalated.

## 5. Vertical / structural / temporal relationships

Where the source set contains multiple vendors, distinguish:
- proposal-level statements versus draft-agreement terms;
- master terms versus order form, SOW, pricing schedule, or appendix;
- current commitment versus future milestone or renewal term;
- baseline requirement versus conditional exception;
- initial term, renewal period, and termination-exit obligations as separate time periods.

If a proposal term appears favorable but is not carried through to the draft agreement or incorporated appendix, flag the gap as a negotiation issue. If one document narrows another, identify which document controls on its face.

## 6. Output structure conventions

- Start with a short document inventory and vendor enumeration.
- Define the severity scale once, then apply it uniformly throughout.
- Use a term-sheet style summary organized by category, with one row per requirement issue or matched term.
- For each row, include: source requirement, vendor response, deviation or match, cross-reference, severity, and consequence.
- Separate “matched terms” from “issues and gaps” so the reader can see both accepted provisions and risk items.
- Use concise risk labels, but always anchor them to the ordinal severity scale.
- Include a final recommendations section with action-oriented next steps, the responsible internal role, and an urgency anchor tied to the procurement timeline or negotiation stage.
- Keep the output suitable for a Word document titled `vendor-term-sheet-summary.docx`; the term sheet summary itself is the primary deliverable.
