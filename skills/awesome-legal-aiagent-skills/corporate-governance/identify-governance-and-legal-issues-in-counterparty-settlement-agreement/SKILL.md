---
name: identify-governance-and-legal-issues-in-counterparty-settlement-agreement
task_id: corporate-governance/identify-governance-and-legal-issues-in-counterparty-settlement-agreement
description: Agents identify major settlement terms, compare them to the underlying project or liability baseline in the source materials, flag the absence of appropriate carve-outs from broad release language, identify required regulatory approvals for any transfer or assumption of obligations, and assess time-bar risk on ancillary claims that may affect settlement leverage.
activates_for: [planner, solver, checker]
---

# Skill: Issues Memorandum for a Counterparty Settlement Agreement — Audit Committee Review

## 1. Subject-matter triage
- Determine whether the source set contains one settlement path or multiple alternative settlement structures, multiple counterparties, or multiple claim buckets. If more than one is present, enumerate each before analysis and keep them separate throughout.
- Identify the governing baseline first: the underlying cost, exposure, remediation, liability allocation, or disputed obligation that the settlement is intended to resolve.
- Confirm whether the committee is being asked to approve only the settlement terms or also any related transfer, assumption, release, dismissal, waiver, or governance action.

## 2. Failure modes the skill is correcting
- The memo describes the settlement terms but does not anchor them to the underlying exposure baseline in the source materials, so adequacy cannot be judged.
- The memo misses that a transfer or assumption of obligations may require regulatory, agency, or similar approval before effectiveness.
- The memo accepts a broad release or covenant not to sue without testing for missing carve-outs for fraud, intentional misrepresentation, or willful misconduct.
- The memo fails to identify whether unknown claims are being released, and whether that breadth is intentional or overreaching.
- The memo ignores separate limitation periods on ancillary claims that may independently expire and weaken leverage.
- The memo notes representations and warranties but does not test their survival period against the likely discovery window and applicable limitations period.
- The memo states a legal risk conclusion without tying it to the governing doctrine, statute, regulation, or approval standard.
- The memo gives diagnosis only and omits a concrete next step for counsel, management, or the responsible officer.

## 3. Legal frameworks / domain conventions that apply
- **Settlement adequacy against baseline.** Compare the proposed settlement economics to the relevant exposure, cost, or liability baseline in the source documents; where the documents allocate responsibility, test the proposed allocation against that baseline rather than against the face amount alone.
- **Transfer / assumption approval.** If the settlement shifts obligations, assume liabilities, or substitutes a party, check the governing instrument and any applicable regulatory or agency approval requirement before effectiveness.
- **Release and covenant scope.** Broad release language may cover known and unknown claims depending on governing law and wording; identify whether the agreement uses a general release, mutual release, covenant not to sue, or dismissal structure and whether the release is intentionally expansive.
- **Fraud carve-out.** A release or covenant not to sue should be tested for an express carve-out for fraud, intentional misrepresentation, or willful misconduct where later discovery of misconduct would matter.
- **Limitations / leverage analysis.** Separate claims may have their own statutes of limitations; approaching deadlines can impair leverage even if the primary settlement remains open.
- **Representations and survival.** Settlement representations usually live or die by an express survival clause; compare that period to the likely time needed to discover and prove a breach.
- **Governance authority.** Confirm the Audit Committee’s authority under the company’s charter, bylaws, delegated authority matrix, and applicable corporate law; if thresholds are exceeded, note whether board or stockholder approval is also required.

## 4. Analytical scaffolds
- **Issue enumeration.** List each settlement feature, claim bucket, or counterparty separately before analysis. Do not collapse distinct releases, transfers, approvals, or limitation risks into one paragraph.
- **Settlement adequacy test.** Identify the baseline amount or exposure from the source materials; identify the proposed settlement consideration and allocation; compare them in relation to the underlying obligation; state whether the settlement appears proportionate, discounted, or potentially overbroad.
- **Approval / condition-precedent test.** Identify every consent, approval, decree, or agency sign-off implicated by the settlement; determine whether it is a condition precedent, closing deliverable, or post-closing obligation; flag any missing approval as a risk to effectiveness.
- **Release scope test.** Extract the release, waiver, and covenant language; identify whether it covers known claims, unknown claims, future claims, and affiliates; test for a fraud carve-out and any express reservation of rights.
- **Limitations test.** For each ancillary claim, identify the claimant, the claim type, the relevant accrual point, and the governing limitations period; flag claims that are near expiry or already time-barred.
- **Survival test.** Extract any reps and warranties and their survival periods; compare survival to expected discovery timing and the practical window for enforcement.
- **Governance test.** Map the requested action to the approving body’s delegated authority and identify any escalation triggers to the full board or stockholders.
- **Authority support.** State the rule, statute, regulation, or recognized corporate-governance principle supporting each legal conclusion; do not present a bare conclusion without naming the authority.

## 5. Vertical / structural / temporal relationships
- Track the relationship between the settlement agreement and the related deal documents: if one document defines obligations, another may define the baseline, and a third may impose approvals or survival terms.
- Track sequencing: approvals, consents, and conditions precedent should be resolved before effectiveness; releases and dismissals should be aligned with closing; survival and limitation periods continue after execution.
- If the documents involve multiple counterparties or claims, keep the analysis party-by-party and claim-by-claim so that release breadth and leverage effects are not overstated or understated.
- Identify whether any obligation transfer or release is conditioned on a later event; if so, state the timing risk and whether interim performance is exposed.

## 6. Output structure conventions
- Produce an Audit Committee issues memorandum organized by descending severity, with the most significant governance and legal risks first.
- Define an ordinal severity scale once at the top and apply it uniformly to every issue.
- For each issue, include: severity; issue summary; source document or provision; controlling legal or governance authority; why it matters; and the recommended modification or action.
- Every issue should connect the source text to the baseline or threshold implicated, cross-reference the related clause or document that interacts with it, and state the downstream consequence for the company.
- Use concise issue headings that read like board-level risk statements, not descriptive notes.
- End with an explicit Recommended Actions block that assigns each action to a responsible role and ties it to a milestone, deadline, or relative urgency.
- If only one settlement path or claim bucket is in scope, say so affirmatively; otherwise, enumerate all in-scope items before analyzing them.
- Keep the memorandum self-contained and practical for the Audit Committee: issue-focused, decision-oriented, and written to support immediate review.
