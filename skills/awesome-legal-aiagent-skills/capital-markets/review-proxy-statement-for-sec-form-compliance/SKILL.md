---
name: review-proxy-statement-for-sec-form-compliance
task_id: capital-markets/review-proxy-statement-for-sec-form-compliance
description: Proxy statement form-compliance review where the baseline identifies visible disclosure gaps but may miss recently required disclosures, shareholder-proposal handling requirements, and procedural notice obligations.
activates_for: [planner, solver, checker]
---

# Skill: Review Proxy Statement for SEC Form Compliance

## 1. Subject-matter triage
- Treat the task as a section-by-section proxy-form compliance review, not a merits review of the solicitation.
- First identify the proxy sections that are actually in scope for the issuer and the meeting context, then test each section against the checklist and supporting documents.
- If the source set contains multiple disclosure variants, filing periods, equity plans, proposal items, or compensation arrangements, enumerate them before analysis and run the compliance check separately for each.
- If a topic is absent from the source set, say so only if needed to explain why no deficiency is flagged; otherwise focus on deficiencies, errors, and inconsistencies.

## 2. Failure modes the skill is correcting
- Baseline reviews often spot obvious disclosure gaps but miss required elements that appear only in certain circumstances.
- Baseline may not verify whether pay-related disclosures are complete in form, internally consistent, and tied to the required supporting tables or narratives.
- Baseline may not catch when a shareholder proposal is altered, summarized, or otherwise not reproduced as required.
- Baseline may ignore procedural notices and ancillary disclosures that are easy to overlook but still required when triggered.
- Baseline may describe a defect without tying it to the controlling rule, its source-document cross-reference, and the practical consequence.
- Baseline may present issues without a clear severity ranking, making the memo harder to use for remediation.

## 3. Legal frameworks / domain conventions that apply
- Proxy-statement compliance must be tested against the governing federal proxy rules, the form-specific disclosure requirements, and any checklist or instruction set supplied with the source documents.
- Pay-related disclosure should be checked for completeness against the required proxy tables, narratives, and cross-references applicable to the issuer’s compensation disclosure regime.
- Shareholder-proposal handling should be checked for faithful reproduction, procedural compliance, and consistency with any governing submission requirements.
- Insider-reporting disclosure should be checked for completeness and specificity under the applicable Exchange Act disclosure framework.
- Equity-plan disclosure should be checked for any plan or amendment that requires separate description because shareholder approval was not obtained.
- Related-person transaction disclosure should include both transaction-level disclosure and the required policy/process description where triggered.
- Any required notice to stockholders, including householding or similar materials-delivery notices, must be tested against the applicable proxy-distribution rules.
- Any legal conclusion should be anchored to the controlling authority by name and section or rule, not stated as a bare assertion.

## 4. Analytical scaffolds
- Read the proxy section by section and map each section to the checklist item or rule it is meant to satisfy.
- For each potential deficiency, identify: the missing, altered, or inconsistent disclosure; the exact section or table affected; the governing authority; and the remedy needed.
- Where the source documents provide a cross-reference, confirm that the cross-reference actually points to the supporting disclosure and that the supporting disclosure matches the statement made.
- Where the issue depends on an external trigger or condition, confirm the trigger from the source set before flagging the issue.
- For each issue, include:
  - the affected proxy section;
  - a concise description of the defect;
  - the controlling authority;
  - an explicit severity classification using a stated ordinal scale;
  - the practical consequence of leaving the defect uncorrected;
  - a recommended corrective action.
- Use the source documents to identify whether the issue is isolated or recurring across multiple sections, and note that relationship when relevant.
- Check internal consistency of numbers, dates, names of categories, and whether referenced tables or narratives align with one another, but do not invent missing arithmetic from the record.
- If the source set supports it, cross-check the same disclosure point across the proxy, the checklist, and any supporting exhibit or filing history.
- Keep the analysis issue-focused: flag deficiencies, errors, and inconsistencies only.

## 5. Vertical / structural / temporal relationships
- Track whether disclosure in one section depends on a later table, incorporated exhibit, or referenced filing and verify the dependency is satisfied.
- Track whether a required statement is triggered only by a particular board action, prior vote, filing period, or plan status, and confirm the timing trigger from the source set.
- Track whether a disclosure must match another document verbatim or substantively; if the text diverges, flag the divergence and identify both locations.
- Track whether a section is complete only if read together with a referenced notice, appendix, schedule, or incorporated document.

## 6. Output structure conventions
- Write a form-check memorandum organized by proxy section or disclosure topic.
- Start with a short severity legend using one ordinal scale and apply it uniformly throughout the memo.
- Include a compact issues summary table, then follow with section-by-section issue entries.
- For each entry, use a consistent format:
  - Section / topic
  - Severity
  - Issue
  - Authority
  - Why it matters
  - Recommended correction
- Each entry should be self-contained and should cite the governing rule or authority by name and section or rule number.
- End with a Recommended Actions block that assigns the next step to the appropriate role and ties it to the filing or distribution milestone.
- Do not provide a generic compliance narrative; keep the memo limited to deficiencies, errors, and inconsistencies.
