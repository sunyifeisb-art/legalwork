---
name: identify-issues-reinsurance-treaty
task_id: insurance/identify-issues-in-reinsurance-treaty
description: Agents reviewing a reinsurance treaty identify drafting issues, including collateral adequacy, insolvency-clause payment mechanics, intermediary-risk allocation, exclusion gaps for emerging contaminants, commutation mechanics, and notice/prejudice provisions.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Reinsurance Treaty — Issue Memorandum

## 1. Subject-matter triage

- Treat the draft treaty, trust/collateral materials, broker/intermediary terms, claims-handling provisions, and any related deal documents as an integrated set.
- Identify whether the cedant is dealing with admitted or non-admitted reinsurance, whether collateral support is intended to satisfy credit-for-reinsurance concerns, and whether any insolvency, commutation, or notice provision changes the risk allocation in the base treaty.
- If the source materials address more than one treaty layer, tranche, or period, enumerate each one before analysis and keep the issues tied to the correct layer.

## 2. Failure modes the skill is correcting

- Flagging a problem in the insolvency clause without stating the specific trigger that undermines the clause’s protective function.
- Treating intermediary language as boilerplate without identifying which side bears the risk of premium receipt, remittance, or intermediary insolvency under the governing law.
- Reading collateral support in isolation instead of comparing the ceded exposure reflected in the documents against the available trust or other security actually promised.
- Missing gaps where pollution, contamination, or emerging-contaminant language in exclusions does not match the underlying risk allocation reflected elsewhere in the documents.
- Approving commutation language that leaves actuarial method, discounting, expense allocation, and dispute resolution unspecified.
- Overlooking late-notice risk where the reporting threshold is low, the deadline is short, and no prejudice standard limits forfeiture.
- Writing issues as descriptions only, without severity, cross-reference, or downstream consequence.

## 3. Legal frameworks / domain conventions that apply

- Credit-for-reinsurance and collateral adequacy: compare the treaty’s ceded exposure and security provisions against the collateral actually provided under the related trust or security arrangement; flag any apparent shortfall on the face of the documents before loss-development assumptions.
- Insolvency clause mechanics: test whether the payment clause preserves the reinsurance insolvency-protection function by requiring payment to the liquidator or receiver without conditioning payment on prior payment of policyholder claims; use the governing reinsurance insolvency rule or the clause’s stated controlling law if identified in the source set.
- Intermediary risk allocation: identify the law governing the intermediary relationship and determine whether the intermediary acts for the reinsurer or cedant for premium-receipt purposes; use that law to assess who bears the risk between receipt and remittance.
- Setoff and insolvency: review any offset or netting provision for an insolvency carve-out; insolvency law may restrict or condition setoff against an estate, so the clause should be tested against the governing insolvency regime.
- Pollution / emerging-contaminant exclusions: compare exclusion wording against the contaminant category implicated by the deal documents; if the treaty language and underlying-policy language diverge, assess whether the resulting gap creates ambiguity or unintended coverage.
- Commutation for long-tail business: commutation language should address valuation methodology, discounting, open losses, defense expenses, allocation of costs, and dispute resolution; omissions can skew the economic fairness of settlement.
- Claims reporting and prejudice: compare the reporting threshold and notice deadline against any prejudice standard; a short reporting trigger without a prejudice safeguard can create technical-default exposure.
- Use the governing treaty article, statute, regulation, case, or clause text when the source documents identify controlling authority; do not state a legal conclusion without naming the rule supporting it.

## 4. Analytical scaffolds

1. Collateral adequacy
   - Identify the exposure or ceded amount shown in the documents.
   - Identify the collateral amount, trust balance, or other security promised.
   - Compare the two and flag any facial shortfall or mismatch.
   - Tie the shortfall to the related collateral, trust, or security document and state the practical consequence for reinsurance credit or collectability.

2. Insolvency clause
   - Identify the payment trigger, recipient, and any condition precedent.
   - Cross-check the clause against any insolvency, claims-payment, or follow-the-fortunes language elsewhere in the set.
   - State whether the wording preserves or weakens the intended insolvency protection and what that means for recoverability or credit treatment.

3. Intermediary clause
   - Identify the governing law and the agency allocation in the intermediary provisions.
   - Determine whose agent the intermediary is for premium receipt and remittance.
   - State who bears the loss if the intermediary fails before remitting and the consequence for the cedant or reinsurer.

4. Offset / netting
   - Identify any setoff language.
   - Check whether the clause preserves or limits setoff in insolvency.
   - State the estate-priority or recovery consequence if the carve-out is missing or unclear.

5. Exclusion gap
   - Identify the exclusion text and the risk description elsewhere in the deal documents.
   - Compare the wording for mismatch, omission, or ambiguity around emerging contaminants or analogous hazards.
   - State the resulting coverage, dispute, or drafting risk.

6. Commutation
   - Identify the commutation mechanism and the scope of claims it would settle.
   - Check whether methodology, discounting, expense allocation, and dispute resolution are specified.
   - State whether the clause is commercially workable or likely to invite valuation disputes.

7. Notice / prejudice
   - Identify the reporting threshold, deadline, and any cure or prejudice language.
   - Compare the burden to the claims process reflected elsewhere in the documents.
   - State whether late notice can defeat recovery without a showing of prejudice and the resulting litigation or coverage risk.

8. For each issue, state the governing authority if it is identified in the materials; otherwise cite the controlling doctrine or standard from recognized reinsurance or insurance-insolvency practice.

## 5. Vertical / structural / temporal relationships

- Track how one provision modifies another: for example, collateral support may interact with insolvency payment mechanics, while notice provisions may interact with claims cooperation or commutation.
- Distinguish pre-loss structural risk from post-loss settlement risk.
- Note whether the problem arises at inception, during premium flow, at loss reporting, during insolvency, or at commutation.
- If multiple documents speak to the same risk, resolve the hierarchy by contract order, schedule, exhibit, or stated precedence.
- When the same issue appears in more than one place, consolidate it into one issue entry and explain the interaction rather than repeating it.

## 6. Output structure conventions

- Write an issue memorandum, not a narrative summary.
- Define a uniform ordinal severity scale at the top and apply it to every issue entry.
- For each issue, include:
  - Issue heading
  - Severity
  - Short description of the drafting or transaction defect
  - Quantification or scale reference drawn from the source documents
  - Cross-reference to the other clause, schedule, or document that interacts with it
  - Downstream consequence for the client
  - Recommended drafting or review step
- Organize issues by topic in a clean professional memo format suitable for counsel review.
- Include a concise closing section listing prioritized recommended actions, each with an imperative verb, the responsible role from the materials, and a timing anchor tied to the transaction or regulatory milestone.
- Use plain English, but keep legal terminology precise and anchored to the governing authority or contract language identified in the source set.
