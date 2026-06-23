---
name: its-extract-national-security-factors-cfius
task_id: international-trade-sanctions/extract-national-security-factors-from-transaction-summary
description: Produces a CFIUS risk assessment memorandum for a foreign acquisition that identifies filing obligations, assesses the adequacy of proposed mitigation instruments, evaluates restricted-party and government-subsidy connections, and incorporates comparable foreign-regulatory precedent as a signal of likely review outcomes.
activates_for: [planner, solver, checker]
---

# Skill: Extract National Security Risk Factors for CFIUS Assessment

## 1. Subject-matter triage

- Treat the assignment as a CFIUS-oriented risk assessment, not a generic M&A summary.
- First identify the transaction structure, the foreign acquiror path, the target’s U.S. nexus, and any defense, critical technology, sensitive data, or supply-chain exposure.
- If the source set contains multiple entities, jurisdictions, filing paths, or mitigation proposals, enumerate them before analyzing so each is assessed on its own facts.
- Separate mandatory-filing questions from discretionary mitigation, and separate transaction risk from compliance-history risk.

## 2. Failure modes the skill is correcting

- Analyzing a mitigation concept before confirming whether the filing path and security posture make that concept plausible.
- Treating target sensitivity alone as dispositive without testing the foreign acquiror’s country-risk profile, ownership chain, and state-linked connections.
- Missing restricted-party, subsidy, or state-direction indicators that change the CFIUS posture even where the target business appears ordinary.
- Failing to connect comparable foreign review outcomes to likely U.S. review pressure points.
- Treating prior disclosures, enforcement matters, or remediation history as background noise instead of evidence bearing on controls maturity.
- Summarizing risks without tying each one to the governing legal framework and the downstream transaction consequence.
- Issuing conclusions without balanced non-issues analysis or concrete next steps.

## 3. Legal frameworks / domain conventions that apply

- CFIUS jurisdiction and filing analysis should be organized around the foreign-investment review framework in the Defense Production Act, as amended by FIRRMA, and the implementing regulations in 31 C.F.R. Part 800 and, where relevant, Part 802.
- Mandatory-filing analysis should test whether the deal is within a compulsory notice category based on the target’s business, the sensitivity of the U.S. nexus, and the acquiror’s ownership and control profile.
- Sensitive-technology analysis should use the applicable export-control classification framework reflected in the source documents, including any ECCN, ITAR, or other controlled-technology identifier if provided.
- Mitigation adequacy should be evaluated against the foreign acquiror’s country profile, access rights, governance rights, information-access design, and any personnel or cybersecurity restrictions commonly used in CFIUS settlements.
- Restricted-party nexus analysis should examine ownership, control, advisory, financing, supply, or data pathways linking the acquiror or its affiliates to sanctioned, denied, or otherwise restricted persons.
- Government-subsidy or state-support indicators should be treated as potential evidence of strategic technology acquisition objectives where they are tied to controlled technologies or defense-relevant capabilities.
- Comparable foreign-regulatory precedent is relevant as a practical review signal, but it is persuasive rather than controlling; identify the underlying screening authority and the feature that makes the comparator useful.
- Prior voluntary disclosures, enforcement matters, or remediation history should be treated as compliance-maturity evidence and linked to the credibility of proposed mitigation and internal controls.
- Sole-source or mission-critical government contract exposure should be tied to continuity-of-supply and national-security concerns, with attention to any termination, step-in, or substitution risk.

## 4. Analytical scaffolds

1. Identify the transaction and filing posture.
   - State the acquisition form, ownership path, and the intended filing strategy.
   - Test whether the intended approach fits the applicable CFIUS filing obligation and whether any mandatory notice risk exists.
   - If multiple filing paths are possible, analyze each path separately and state which is safer and why.

2. Classify the target’s sensitivity.
   - Identify the target’s technology, data, facilities, products, and end uses using the classification framework reflected in the documents.
   - Distinguish ordinary commercial operations from defense, critical-technology, or sensitive-data exposure.
   - Tie the classification to the filing and mitigation analysis rather than treating it as a standalone label.

3. Assess the acquiror’s risk profile.
   - Map ownership, control, board rights, financing, governance, and affiliate relationships.
   - Flag any restricted-party overlap, indirect ownership chain, or state-linked support.
   - Evaluate whether the acquiror’s profile suggests heightened scrutiny, more restrictive mitigation, or a need for deeper diligence.

4. Evaluate mitigation realism.
   - Test the proposed mitigation against the parties’ actual access and control rights.
   - Ask whether the instrument is proportionate to the identified risk, whether it is administrable, and whether it addresses the relevant technology, personnel, physical-security, and data-transfer vectors.
   - If a more restrictive arrangement appears necessary, identify the gap and the operational consequence.

5. Compare external review signals.
   - Identify comparable foreign or allied screening outcomes and the specific reason they matter.
   - Use them as signals for likely concern themes, not as substitutes for U.S. law.
   - State whether the precedent cuts toward approval, conditioning, delay, or prohibition.

6. Test for compliance-history indicators.
   - Review any prior disclosures, investigations, remediation plans, or policy failures.
   - Explain whether they support or weaken confidence in internal controls, auditability, and mitigation compliance.

7. Assess supply-continuity and operational risk.
   - Where the target performs work under government or mission-critical contracts, assess whether a change in ownership could interrupt performance, create clearance or access problems, or trigger substitution issues.
   - Connect any continuity concern to the likely review posture and mitigation burden.

8. Close every issue analytically.
   - For each risk factor, state the scale or significance from the source record, identify the interacting document or fact pattern, and explain the transaction consequence.
   - Do not leave issues as labels; each must end in a practical CFIUS implication.

## 5. Vertical / structural / temporal relationships

- The transaction summary controls the deal architecture and intended filing strategy; the acquiror materials control ownership, control, and restricted-party nexus; the target materials control technology, data, contracts, and operational sensitivity.
- Where those sources conflict, give priority to the fact pattern that creates the higher national-security risk and explain the inconsistency.
- Temporal sequence matters: pre-signing diligence, signing, filing, waiting period, mitigation negotiation, and closing should be analyzed as distinct stages with distinct risk points.
- If the documents show a post-signing remediation plan or conditional closing structure, assess whether it is realistically timed to satisfy the filing and mitigation burden before closing.

## 6. Output structure conventions

- Write a memorandum in conventional legal style with a short executive summary, issue-by-issue risk analysis, balanced non-issues, and a practical filing-strategy section.
- Use an ordinal severity scale defined once at the top of the memo and apply it uniformly to each risk factor.
- For each risk factor, include:
  - the severity label,
  - the governing authority or practice principle supporting the analysis,
  - the key facts from the source set,
  - the review consequence for CFIUS posture,
  - and the transaction consequence.
- Include a separate section for non-issues or low-risk factors to show a balanced assessment.
- End with an explicit Recommended Actions section that gives concrete next steps, uses imperative verbs, identifies the responsible role, and ties each step to a timing anchor from the deal process or regulatory timeline.
- If the source documents provide a deadline, filing milestone, or closing condition, use it; otherwise anchor the recommendation to the next transactional step.
- Keep the memo self-contained and readable without assuming access to the underlying documents.
