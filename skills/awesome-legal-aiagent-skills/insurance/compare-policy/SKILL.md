---
name: compare-insurance-proposal-coverage-specifications
task_id: insurance/compare-policy
description: Agents comparing an insurance proposal against coverage specifications should analyze compounded coverage gaps across policies, check for maritime-worker coverage obligations, and calibrate severity to the practical exposure presented by each issue.
activates_for: [planner, solver, checker]
---

# Skill: Insurance Coverage Gap Analysis — Proposed Policy Package vs. Coverage Specifications

## 1. Subject-matter triage

- Treat the proposal, coverage specs, contractual covenants, broker notes, and claims history as a single integrated record.
- Identify the insured’s actual operations, loss drivers, worker classes, transportation profile, and any special worksite exposures before comparing forms.
- If multiple policies, endorsements, or periods are in play, enumerate them first and analyze each against the same exposure set before drawing conclusions.
- Separate true coverage defects from mere drafting or administration issues; the former are operationally material, the latter usually are not.

## 2. Failure modes the skill is correcting

- Two independent coverage gaps that affect the same loss scenario are analyzed separately rather than as a combined exposure that is more severe than either gap individually.
- Maritime or offshore worker coverage is overlooked even though the applicable framework may require a separate workers’ compensation or similar maritime-specific cover.
- Severity ratings are assigned inconsistently, with smaller administrative gaps rated higher than larger structural coverage gaps.
- Issues are described without tying them to the insured’s actual exposure, the interacting policy language, and the downstream operational or financial consequence.
- Contractual insurance requirements are checked only in the proposal abstract and not against the actual covenants that govern the insured relationship.

## 3. Legal frameworks / domain conventions that apply

- Pollution coverage for environmental remediation businesses: standard general liability forms often exclude pollution; businesses whose core operations involve remediation should check whether the proposal includes a pollution buyback endorsement or a separate contractors pollution liability policy, and whether the absence of pollution coverage leaves the core business activity uninsured.
- Contractors pollution liability and transportation sublimits: contractors pollution liability policies covering pollution arising from contractor operations often include sublimits for particular categories such as hazardous materials transportation; compare any transportation sublimit to the insured’s known transportation exposure and prior loss history.
- Auto pollution gap: the general liability form’s auto exclusion and the auto form’s pollution exclusion can together create a gap for pollution events arising during vehicle operation; assess whether more than one form may fail to respond to the same loss.
- Compounding gap mechanics: two independent gaps compound when the same loss implicates both; a chemical spill during transport may trigger more than one exclusion or sublimit and leave the insured without full coverage above any applicable cap.
- Maritime-worker coverage: if the business has employees performing maritime or offshore work, confirm whether the proposal includes the workers’ compensation or similar coverage required for that worksite and worker class; standard land-based workers’ compensation may not be enough.
- Professional liability scope restriction: if a professional liability policy covers only consulting services, claims arising from remediation design or construction management may fall outside the policy’s scope even if the policy is otherwise applicable.
- Emerging-contaminant exclusion: exclusions targeting newly identified contaminants may appear in renewals; for insureds with existing exposure of that kind, assess whether the exclusion creates a backward-looking gap.
- Retroactive-date restriction: losses arising from conditions predating the policy’s retroactive date are excluded; compare the retroactive date to the dates of each known condition or alleged loss trigger.
- Cancellation notice for additional insureds: if an additional insured endorsement does not require notice of cancellation or material change to the additional insured, that party may lose protection without warning.
- Contractual compliance: compare each gap against any master service agreement, lender covenant, certificate requirement, or other contractually mandated insurance term governing the risk transfer package.

## 4. Analytical scaffolds

1. For each gap, explain the practical operational risk for the specific type of business at issue, not merely the dollar shortfall.
2. Pollution buyback: identify the absence; explain that for an environmental remediation company, the gap may leave a core business activity uninsured.
3. Auto pollution gap: identify the combination of the general liability auto exclusion and the auto form’s pollution exclusion; analyze it as a compounding gap with any contractors pollution liability transportation sublimit shortfall; compare the combined uninsured exposure to the insured’s loss record when the source materials support that comparison.
4. Contractors pollution liability transportation sublimit: compare the sublimit to the insured’s prior transportation loss values from the claims record; flag inadequacy.
5. Emerging-contaminant exclusion: identify the exclusion; assess against any existing exposure of that type; flag the resulting coverage gap if present.
6. Retroactive date: compare to dates of known conditions or other trigger events; flag any gap.
7. Maritime-worker coverage: identify whether the proposal includes the coverage needed for maritime or offshore operations; flag absence as a compliance risk.
8. Professional liability scope: identify the covered services; flag if design or construction management work is excluded.
9. Cancellation notice for additional insureds: assess whether the endorsement includes notice obligations; flag absence.
10. Severity calibration: rate the maritime-worker coverage gap and compounding auto/pollution gap at the highest severity tier; do not rate them below administrative or documentary issues.
11. For each gap: verify compliance with contractual insurance requirements in any master service agreement, lender agreement, or similar contract.
12. For each issue, close the analysis by stating the scale of the exposure, the interacting policy or contract provision, and the concrete consequence if the gap remains open.

## 5. Vertical / structural / temporal relationships

- Map the hierarchy from contract requirement to promised coverage to endorsement to exclusion to sublimit; the controlling document is usually the narrowest operative wording.
- Compare renewal language against prior-year forms where the broker notes or claims history suggest a change in risk transfer.
- Track temporal sequencing: historical loss events, retroactive dates, policy inception, endorsement effective dates, notice periods, and cancellation triggers.
- Where multiple forms address the same risk, analyze whether they overlap, leave a hole, or cap the same loss twice.
- If the insured has different classes of operations or worker categories, analyze coverage by class rather than as a single blended package.
- Treat an issue as more serious when it affects the core operating activity, a recurring loss pattern, or a mandatory contractual covenant.

## 6. Output structure conventions

- Use a memorandum format with a short executive summary, an issue-by-issue analysis, a compounding-gaps section, a contractual compliance section, and a closing action section.
- Define one ordinal severity scale at the outset and apply it uniformly to every issue; tie each severity label to actual exposure and not to drafting inconvenience.
- For each issue, include:
  - the policy or covenant point at issue,
  - the relevant exposure or loss history,
  - the interacting provision or other document that changes the analysis,
  - the practical consequence to the insured,
  - the severity label,
  - the recommended fix.
- When discussing a gap, anchor the discussion in the source record; avoid abstract criticism untethered to the insured’s operations.
- Include a dedicated section for compounding gaps that require multi-policy analysis, especially where exclusions and sublimits operate together.
- Include a dedicated section for contractual compliance, checking each material gap against any mandatory insurance covenant or additional insured obligation.
- End with an explicit Recommended Actions block. For each recommendation, state the imperative action, the responsible role or stakeholder, and the timing anchor based on the transaction, renewal, notice, or compliance milestone in the record.
- Keep the memo readable for business stakeholders: concise headings, short issue summaries, and plain-language consequences with enough legal precision to support decision-making.
