---
name: review-corporate-insider-trading-policy-for-compliance-gaps
task_id: capital-markets/review-corporate-insider-trading-policy-for-compliance-gaps
description: Insider trading policy compliance review focused on identifying gaps in a corporate policy against the applicable insider trading rule set and related public-disclosure obligations, without assuming the baseline analysis is complete.
activates_for: [planner, solver, checker]
---

# Skill: Review Corporate Insider Trading Policy for Compliance Gaps

## 2. Failure modes the skill is correcting

- Baseline identifies a cooling-off period issue for Rule 10b5-1 plans but may apply only one prong of the cooling-off requirement without addressing the alternative prong tied to the next periodic report filing date.
- Baseline identifies issues without citing the specific rule or regulatory provision creating the obligation, which is required for a compliance review memo that will be used to support policy remediation.
- Baseline does not assess whether the policy satisfies the company's disclosure obligation in its annual proxy statement and annual report under the applicable public-company disclosure item for insider trading policies and procedures.
- Baseline may collapse distinct policy defects into one generalized comment; this task requires discrete issue treatment, an explicit severity label for each issue, and a recommendation tied to each gap.
- Baseline may omit the interaction between the policy text and related plan documentation, disclosure statements, or exception procedures; review the full source set before concluding the policy is adequate.
- Baseline may describe a gap without anchoring it to the practical consequence for the issuer, insiders, or disclosure record; the memo should explain why the gap matters operationally or regulatorily.

## 3. Legal frameworks / domain conventions that apply

- Rule 10b5-1 cooling-off period: For directors and officers, the cooling-off period after adopting a plan is the later of a specified number of days after adoption or the filing of the next periodic report after adoption; a policy that addresses only the calendar-day prong misses the filing-date prong, which may in practice be the later date.
- Single-trade plan limitation: The amended insider-trading plan regime limits directors and officers to a specified number of single-trade plans per rolling period; a policy that does not address this limitation should be reviewed for completeness.
- Tipping prohibition scope: Insider-trading liability extends to tippees who receive material non-public information from an insider and then trade; the policy's tipping prohibition should address not just direct disclosure to immediate tippees but also knowing downstream disclosure.
- Post-termination trading restriction: An employee who possesses material non-public information at termination remains prohibited from trading until the information is no longer material and non-public; an artificial time-based limit on post-termination restrictions may expire while the information remains material.
- Gifts and bequests: Transfers of issuer securities as gifts or charitable bequests may be treated as reportable transactions and may implicate short-swing profit rules; the policy should address whether pre-clearance is required for such transfers.
- Pre-existing plan grandfathering: For plans adopted before the relevant amendments took effect, the company should assess whether any grandfathering provision applies and what transition steps are required to bring the plan into compliance with the amended regime.
- Public-company disclosure item: Listed companies are required to describe their insider trading policies and procedures in their annual proxy statement and annual report; the policy should be sufficiently detailed and current to serve as the basis for that required disclosure.
- Sanctions disclosure: The sanctions section of the policy should describe both internal disciplinary consequences and the federal civil and criminal penalties applicable to insider trading violations; omission of the federal penalty framework may understate the policy's protective function.
- Analysis should be tied to the controlling source text and applicable SEC rules; do not rely on generalized policy critique when a cited rule or disclosure item is available.

## 4. Analytical scaffolds

- Begin by inventorying the source set: policy, any board or committee materials, related plan forms, disclosure drafts, FAQs, acknowledgments, and exception procedures.
- If the source set contains more than one policy variant, plan type, audience, or time period, analyze each variant separately rather than blending them into a single pass.
- For each identified gap:
  - identify the exact policy provision or state that no provision exists,
  - cite the controlling rule, disclosure item, or statutory provision,
  - state the severity using a uniform ordinal scale defined once in the memorandum,
  - explain the downstream consequence for compliance, disclosure, enforcement risk, or administration,
  - propose a concrete fix that can be implemented in policy language or procedure.
- Analyze the Rule 10b5-1 cooling-off period for directors and officers against both prongs of the waiting-period rule; confirm whether the policy captures the later-in-time requirement.
- Analyze whether the policy covers single-trade plan limits, including any exceptions or transition treatment for existing plans.
- Analyze tipping restrictions for both direct and downstream disclosure, including whether the policy tracks knowledge-based limits.
- Analyze post-termination restrictions for adequacy, focusing on whether the trigger is information status rather than a fixed calendar period alone.
- Analyze gifts, charitable transfers, and other non-open-market dispositions for pre-clearance and reporting treatment.
- Review sanctions language for completeness, including internal discipline and federal civil/criminal penalty framing.
- Assess whether the policy is current and sufficiently specific to support the company’s public-company disclosure obligation regarding insider trading policies and procedures.
- Where the source documents reference amendments, effective dates, or transition provisions, test the policy against those dates and note any grandfathering or update gap.
- Do not assume silence is acceptable; if a rule is implicated and the policy is silent, treat the absence as a potential gap and explain why.
- Quantify or anchor each issue using the document’s own dates, audiences, plan categories, or procedural thresholds when available; if no numerical anchor exists in the source, state that explicitly and use the operative compliance milestone instead.

## 6. Output structure conventions

- Draft a policy review memorandum, not a checklist.
- Open with a brief executive summary and a short legend defining the severity scale used in the memo.
- Include a compact summary table listing each issue, severity, authority, and one-line remediation.
- Organize the body by numbered issues, one issue per discrete gap.
- For each issue, use a consistent mini-structure:
  - Policy reference or absence
  - Gap description
  - Controlling authority
  - Severity
  - Consequence
  - Recommended fix
- Use neutral, transactional language suitable for counsel-facing remediation.
- Preserve issue separation; do not merge cooling-off, disclosure, sanctions, and plan-transition defects into one umbrella comment.
- End with a clearly labeled Recommended Actions section that converts each issue into an imperative step, assigns the responsible role if the source identifies one, and ties timing to the next compliance, filing, or policy-update milestone.
- Keep the memorandum self-contained and ready to convert into `policy-review-memorandum.docx`.
