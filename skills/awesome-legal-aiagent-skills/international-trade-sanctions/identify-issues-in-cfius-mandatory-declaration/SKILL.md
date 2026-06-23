---
name: its-identify-issues-cfius-mandatory-declaration
task_id: international-trade-sanctions/identify-issues-in-cfius-mandatory-declaration
description: Produces a comprehensive issue memorandum for a draft CFIUS mandatory declaration that identifies subsidiary omissions, technology-class specificity gaps, foreign government substantial interest threshold errors, control definition misapplications, personal identification deficiencies, and FOCI mitigation instrument inadequacies.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in a CFIUS Mandatory Declaration

## 1. Subject-matter triage

- Treat the declaration, transaction agreement, ownership chart, officer/board materials, technology descriptions, and mitigation drafts as one integrated record.
- Map each declaration statement to the supporting document it purports to summarize; if a statement is unsupported, flag it as a gap rather than inferring facts.
- Enumerate every relevant entity, owner, nominee, and technology bucket before analysis so omissions are visible.
- If only one target entity, one board nominee set, or one technology category is actually in scope, say so affirmatively and note why no broader set applies.

## 2. Failure modes the skill is correcting

- Applying an ownership threshold that is inconsistent with the governing foreign government substantial interest analysis, which can lead to an incorrect conclusion about whether a mandatory declaration trigger exists.
- Describing the target's technology in general terms without identifying the specific controlled technology category and applicable entry, which is required for a valid declaration.
- Assessing control based only on voting ownership percentage without evaluating the full regulatory definition, including rights to appoint officers, veto major decisions, and access sensitive information.
- Omitting a significant subsidiary that bears on national security review because it holds a clearance, classified contract, or defense-agency relationship.
- Failing to include board-nominee identity details that must be disclosed in full.
- Using inconsistent value figures across sections without reconciling them.
- Treating mitigation as adequate without testing whether it matches the acquiror’s country, ownership profile, and foreign-government relationship posture.
- Omitting prior state-owned enterprise employment for key technical personnel or board nominees.

## 3. Legal frameworks / domain conventions that apply

- Subsidiary disclosure: identify all target subsidiaries that are independently relevant to national security analysis; if a subsidiary holds a security clearance, classified contract, or defense-agency relationship, disclose it specifically and explain why it matters. Omission is a filing deficiency.
- Technology specificity: identify the controlled technology category and the applicable entry or control basis, not merely a broad business description. General references to defense, advanced, or sensitive technology are insufficient.
- Control definition: apply the full regulatory definition of control under the CFIUS rules; majority voting power is only one path. Also test appointment and removal rights, veto rights over major matters, and rights to obtain sensitive information. See 31 C.F.R. part 800, including the control definition provisions.
- Foreign government substantial interest: trace direct and indirect ownership through intermediate entities and apply the governing threshold under the CFIUS mandatory-declaration rules. Do not substitute a simplified default threshold. See 31 C.F.R. part 800 and the mandatory-declaration provisions applicable to foreign government substantial interests.
- Board nominee identification: disclose the full legal name, nationality, and date of birth for each board nominee; nationality is not interchangeable with residence. See 31 C.F.R. part 800 disclosure requirements.
- Value consistency: enterprise value and equity value must be stated consistently across the declaration and supporting materials; any mismatch should be reconciled.
- FOCI mitigation adequacy: evaluate whether the proposed mitigation instrument is calibrated to the acquiror’s country, ownership chain, and intelligence-relationship risk. If the instrument appears underinclusive, flag the need to evaluate a more restrictive alternative under the applicable industrial security framework.
- Prior state-owned enterprise employment: prior employment at a state-owned enterprise by a key technical officer or board nominee can signal residual foreign-government ties and should be disclosed and analyzed.
- Source control: do not assume facts beyond the transaction record; if a required element is missing from the declaration or support set, identify the omission and the resulting risk.

## 4. Analytical scaffolds

1. **Entity-by-entity review**
   - List each target entity and any subsidiary that is relevant to the national security profile.
   - For each, check whether the declaration identifies the entity, its function, and any security-sensitive relationship.

2. **Technology and export-control review**
   - Identify the precise controlled technology category, the governing control basis, and the applicable entry or classification.
   - Compare the declaration’s description to the support materials and flag any overbroad or under-specific wording.

3. **Control analysis**
   - Apply the full control definition to the rights being acquired: voting rights, board or officer appointment rights, veto rights, governance rights, and access rights.
   - State whether control exists under any prong, not just under majority ownership.

4. **Foreign-government interest analysis**
   - Trace ownership from the acquiror to ultimate foreign-government interests through each intermediate layer.
   - Test the declaration’s stated threshold against the applicable CFIUS standard and identify any misstatement.

5. **Individual identification review**
   - For each nominee or covered individual, verify full legal name, nationality, and date of birth.
   - Note when the declaration substitutes residence for nationality or omits birth data.

6. **Value and economics consistency check**
   - Compare enterprise value, equity value, and any other transaction-size figure used in the declaration.
   - Flag unexplained inconsistencies and identify where the mismatch affects filing analysis.

7. **Mitigation adequacy review**
   - Compare the proposed mitigation package against the acquiror’s ownership profile, country nexus, and government-related ties.
   - Identify whether the draft appears too permissive, incomplete, or structurally mismatched.

8. **Personnel history review**
   - Check disclosed biographies for prior state-owned enterprise employment or comparable government-linked service.
   - Flag omissions and explain why the omission matters to the national security narrative.

9. **Issue-closing discipline**
   - For each issue, state the source document or declaration location, the governing standard with authority, the specific gap, the scale or magnitude where the record permits, the interacting document or clause, and the practical consequence for the filing or transaction.

## 5. Vertical / structural / temporal relationships

- Read the declaration vertically against schedules, ownership charts, officer lists, and technology descriptions; a statement can be technically complete in one section and contradicted elsewhere.
- Track temporal changes: pre-signing structure, signing, closing, post-closing governance, and any interim covenant periods may affect whether a disclosure is accurate at the filing date.
- Where the declaration relies on a future mitigation step or post-closing board change, distinguish present facts from planned future facts.
- If a figure or status changes across drafts or exhibits, reconcile the chronology rather than treating the latest statement as automatically controlling.

## 6. Output structure conventions

- Write an issue memorandum, not a narrative summary.
- Open with a short standard of review that states the severity scale used for the memo, such as Critical / High / Medium / Low, and apply it uniformly.
- Organize issues by deficiency category using conventional headings such as entity disclosure, control, ownership/foreign-government interest, technology classification, individual disclosures, valuation consistency, and mitigation adequacy.
- For each issue, include:
  - Severity
  - Source language or absence identified in the record
  - Governing authority, cited by name and section or part
  - Gap identified
  - Why the issue matters, including filing, regulatory, or transaction consequence
  - Recommended correction
- Tie each issue to the supporting document(s) it conflicts with or fails to reflect.
- Where the record allows, quantify the issue by the relevant transaction scale, ownership layer, term, or disclosure population, without inventing numbers.
- End with a Recommended Actions block that gives imperative next steps, assigns each to a responsible role drawn from the record when available, and ties timing to the filing deadline, pre-filing correction window, or immediate closing risk.
- Use concise legal drafting; do not paste long quotations from source documents, and do not rely on formatting alone to show the defect.
