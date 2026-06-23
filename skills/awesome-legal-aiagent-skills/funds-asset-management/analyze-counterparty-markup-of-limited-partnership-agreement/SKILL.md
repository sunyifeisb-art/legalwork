---
name: analyze-counterparty-markup-of-limited-partnership-agreement
task_id: funds-asset-management/analyze-counterparty-markup-of-limited-partnership-agreement
description: Review a counterparty markup of a limited partnership agreement against the applicable negotiation playbook, term sheet, and relevant precedent documents to produce a classified redline review memorandum with financial impact analysis and negotiation guidance.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Limited Partnership Agreement

## 1. Subject-matter triage

- Identify the governing document set before analysis: the fund’s form LPA, the counterparty markup, the negotiation playbook, the instruction email, the term sheet, and any cited precedent or side letter context.
- Confirm whether the markup is a full-form revision, a limited issue set, or a mixed redline; then scope the memo to the actual change set rather than the entire agreement.
- Separate provisions that are economic, governance, disclosure, transfer, tax, fiduciary, or operational in nature, because each category is typically negotiated under different playbook rules.

## 2. Failure modes the skill is correcting

- Treating all markup changes as equally material instead of classifying them by playbook status and economic or control impact.
- Failing to analyze management-fee changes separately across relevant periods and then summarize the combined effect.
- Collapsing temporary suspension concepts into permanent removal or termination concepts when evaluating governance requests.
- Missing how a low approval threshold can convert an oversight right into de facto transaction approval authority.
- Ignoring how a concession to one investor may trigger broader MFN consequences across the investor base.
- Omitting precedent comparison when the source set contains a prior vintage, a related fund, or a practice document that constrains the negotiation response.
- Describing issues without stating their scale, the cross-clause interaction, and the downstream consequence.
- Producing commentary that cannot survive export because the redline is only visible through formatting rather than plain-text change markers.

## 3. Legal frameworks / domain conventions that apply

**Playbook control**
- Treat the negotiation playbook as the primary classification authority.
- Use the term sheet and instruction email to resolve ambiguity only where the playbook is silent or expressly flexible.
- If a provision falls outside the playbook’s permitted range, classify it according to the playbook’s economic or governance posture, not by drafting style.

**Redline classification**
- Classify each change as Red-line, Yellow-zone, or Acceptable using the playbook’s substantive thresholds.
- Reserve Red-line for terms the playbook treats as non-starter items or outside delegation.
- Use Yellow-zone for terms that may be negotiated within bounded limits, tailored exceptions, or defined policy constraints.
- Use Acceptable only where the markup matches the approved position or is within clearly permitted variance.

**Management-fee economics**
- Analyze investment-period fees and post-investment-period fees separately, because the applicable base, rate logic, or duration may differ.
- For any proposed change, compare baseline versus proposed treatment using the relevant period base, then explain the directional effect and the cumulative effect across periods.
- If the markup changes fee timing, waiver mechanics, offsets, step-downs, or expense allocation, treat each as part of the same economic package.

**No-fault governance changes**
- Distinguish permanent removal or termination from temporary suspension or standstill concepts.
- State whether reinstatement is possible, and if so, what voting or cure condition governs it.
- Analyze no-fault removal, suspension, and replacement mechanics as separate governance questions even when they appear in one draft.

**LPAC / approval-threshold mechanics**
- Compare any approval threshold against the expected transaction distribution and decision cadence for the strategy.
- Flag thresholds that would likely require approval for a meaningful portion of ordinary transactions or that would operate like a deal committee rather than an oversight body.
- Assess whether the proposal shifts authority from monitoring to pre-clearance.

**ESG / excuse-right mechanics**
- Evaluate whether an excuse right is tied to a published, narrow, sector-specific policy or is framed as a broad opt-out.
- Classify broad discretionary opt-outs more cautiously than constrained policy-based carveouts.
- Check whether the excuse right is operationally workable without undermining fund-level execution.

**MFN implications**
- Consider whether any concession made in the markup could be electable by other investors under MFN or similar parity rights.
- Note whether a concession is likely to scale, remain isolated, or force parallel adjustments across the side-letter stack.

**Controlling authority**
- For every legal or contractual proposition, identify the controlling source: the playbook clause, term-sheet point, instruction email, form language, or cited precedent.
- Do not state a conclusion without naming the authority that supports it.

## 4. Analytical scaffolds

1. Read the playbook first and extract the applicable classification rules, reserved positions, and any investor-tier exceptions.
2. Identify the investor’s commitment level and any threshold-based treatment that changes the allowable position.
3. Enumerate the marked provisions or issue clusters before analysis; if only one issue is present, say so explicitly.
4. For each enumerated issue:
   - classify it as Red-line, Yellow-zone, or Acceptable;
   - identify the controlling authority;
   - assess any financial, control, operational, or disclosure impact;
   - cross-reference the relevant clause, schedule, definition, or companion document;
   - state the downstream consequence for the client.
5. For management-fee issues, analyze each applicable period separately and then state the combined economic effect.
6. For governance issues, distinguish permanent from temporary mechanics, and identify any reinstatement or cure path.
7. For approval-threshold issues, test whether the proposed threshold would function as oversight or as approval authority in practice.
8. For ESG excuse rights, test scope, policy constraint, and operational viability.
9. For precedent-sensitive issues, compare the markup against prior accepted positions and note any MFN cascade risk.
10. Close each issue with a recommended negotiation position tied to the playbook.

## 5. Vertical / structural / temporal relationships

- The playbook controls classification; the term sheet and instruction email refine the intended business position; precedent documents may support or limit the ask.
- Fund economics may change across the investment period, post-investment period, and wind-down, so analyze each period under its own base and timing logic.
- Governance rights may operate differently at the fund, GP, advisory body, or investor-consent level; do not assume the same threshold has the same function across all levels.
- A concession that is tolerable in isolation may become material when combined with MFN, parallel-fund, or side-letter mechanics.

## 6. Output structure conventions

- Deliver a redline review memorandum suitable for conversion to `redline-review-memo.docx`.
- Use robust plain-text change markers for any substantive markup analysis so the reader can identify changes even if formatting is stripped:
  - `[DELETED: ...]`
  - `[INSERTED: ...]`
  - `[REPLACED: old → new]`
  - Include a short `[Rationale: ...]` note for each substantive change or grouped change.
- Use a uniform ordinal severity field for every issue entry, defined once at the top, such as:
  - `Severity: Critical / High / Medium / Low`
- Organize the memorandum in a conventional advisory shape rather than mirroring any hidden checklist.
- Include, for each issue entry:
  - the issue title;
  - severity;
  - classification;
  - controlling authority;
  - brief analysis;
  - cross-reference to the interacting provision or document;
  - downstream consequence;
  - recommended position.
- Where helpful, use a short table for issue tracking and a separate table for financial impacts.
- End with an explicit Recommended Actions section that assigns an imperative next step, the responsible role, and a timing anchor tied to the deal process.
- If the primary deliverable is a redline file, ensure the marked-up file is created and non-empty before treating the memo as complete.
