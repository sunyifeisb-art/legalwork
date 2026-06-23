---
name: identify-issues-in-litigation-hold-preservation-notice
task_id: corporate-governance/identify-issues-in-litigation-hold-preservation-notice
description: Agents identify surface-level preservation notice gaps by checking whether the stated preservation window captures the earliest preservation trigger, whether the notice covers complaint-implicated topic categories, whether routine deletion or retention cycles create urgency, whether delay between trigger and issuance creates spoliation risk, and whether interim preservation steps are documented.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in a Draft Litigation Hold Preservation Notice — Review Memorandum

## 2. Failure modes the skill is correcting

- Reviews stay generic and fail to anchor the duty-to-preserve start date to the earliest reasonable anticipation of litigation reflected in the source set.
- Reviews do not map complaint allegations to the notice’s subject-matter scope, so claim-specific record categories are omitted.
- Reviews miss retention-driven urgency, including ordinary deletion cycles, backup overwrite schedules, and cloud or system purge windows.
- Reviews ignore the lag between the preservation trigger and issuance, leaving spoliation exposure and interim steps unaddressed.
- Reviews overlook ESI source coverage gaps, custodian coverage gaps, and the need to evidence who received and acknowledged the hold.
- Reviews identify issues without grading severity, tying each point to controlling authority, or closing with concrete actions.

## 3. Legal frameworks / domain conventions that apply

- **Duty to preserve:** The preservation duty arises when litigation is reasonably anticipated, not only when a complaint is filed. Use the earliest trigger shown in the source documents to test whether the draft notice reaches back far enough. See generally *Zubulake v. UBS Warburg LLC*, 220 F.R.D. 212 (S.D.N.Y. 2003), and *Pension Committee of Univ. of Montreal Pension Plan v. Banc of Am. Sec., LLC*, 685 F. Supp. 2d 456 (S.D.N.Y. 2010).
- **Scope of preservation:** The hold should track the claims, defenses, and factual allegations in the complaint, with attention to the document types needed to evaluate each element. A broad topic label is not enough if it fails to capture complaint-driven categories.
- **Retention and deletion controls:** Routine retention policies do not excuse loss once the duty attaches. If the source materials show scheduled deletion, rotation, or purge dates, the notice must either suspend them or flag immediate intervention.
- **ESI source coverage:** An ESI data map controls the universe of likely repositories. The notice should address each relevant data source, including shared drives, email, chat, mobile, cloud, and other identified systems, where implicated.
- **Custodian coverage:** The org chart and complaint allegations control who should be named or captured by function. Include likely custodians, named witnesses, supervisors, recipients of key communications, and functional owners of the relevant records.
- **Acknowledgment and tracking:** A litigation hold is operationally incomplete without a process to confirm receipt, track acknowledgments, and monitor compliance.
- **Interim preservation documentation:** If there is a gap between trigger and issuance, document the preservation steps taken during that gap to support good-faith compliance and reduce spoliation risk.

## 4. Analytical scaffolds

1. **Enumerate the relevant trigger windows.**
   - Identify each date in the source set that could start the duty to preserve.
   - Select the earliest reasonable trigger and test the draft notice against it.
   - If only one trigger is supported, state that expressly and explain why.

2. **Map complaint allegations to preservation topics.**
   - Break the complaint into claims, factual themes, and document categories.
   - For each category, confirm whether the notice expressly or functionally covers it.
   - Flag any category that is missing, narrowed, or only implied.

3. **Test retention urgency.**
   - Review the retention policy, deletion schedules, and system overwrite or purge cycles.
   - Identify any item that may be destroyed before preservation is fully implemented.
   - Treat imminent destruction as a separate priority item, not a general comment.

4. **Cross-check ESI and custodian coverage.**
   - Compare the notice’s list of systems and custodians against the ESI data map and org chart.
   - Note each source or person that should be included but is not.
   - Distinguish between coverage by name, by role, and by data repository.

5. **Assess delay and interim steps.**
   - Measure the period between the trigger and the proposed notice date.
   - Identify whether potentially relevant material may already have been lost under ordinary operations.
   - State what interim preservation steps are documented and what remains to be documented.

6. **Close each issue completely.**
   - State the issue.
   - Tie it to a severity level.
   - Anchor the issue to the governing authority.
   - Include the specific gap in the draft notice.
   - Note the practical consequence.
   - End with a recommended correction.

## 5. Vertical / structural / temporal relationships

- Treat the source set as a hierarchy: complaint allegations define scope; retention policy defines risk; ESI map defines repositories; org chart defines custodians; the preservation email and draft notice show implementation status.
- Evaluate timing vertically and temporally: earliest trigger, current issuance date, future destruction dates, and any intervening preservation actions.
- When a record category is nested within a broader topic, test the nested category separately if its preservation risk or source location differs.
- When a custodian is also a supervisor, recipient, or functional owner, note that relationship because it can expand the practical hold audience.

## 6. Output structure conventions

- Produce a detailed issues memorandum in conventional legal memo form.
- Begin with a short severity key using an ordinal scale such as:
  - Critical: immediate risk of loss, incomplete coverage of a central issue, or urgent preservation action needed.
  - High: material gap requiring correction before issuance or implementation.
  - Medium: meaningful omission or ambiguity that should be corrected promptly.
  - Low: refinement, documentation, or process improvement.
- Organize the body by priority, moving from pre-issuance blockers to corrections needed before circulation, then process improvements, then documentation of interim preservation steps.
- For each issue, include:
  - **Severity**
  - **Issue**
  - **Source gap**
  - **Authority**
  - **Why it matters**
  - **Recommended correction**
- Use explicit citations to the controlling rule, doctrine, or recognized authority for each legal proposition relied on.
- For each issue, tie the analysis to the source documents by comparing the notice against the complaint, retention policy, ESI data map, preservation email, and org chart.
- If a source document implies a specific destruction window or operational deadline, treat that timing as the anchor for urgency.
- End with a **Recommended Actions** section that states the action in imperative form, assigns the responsible role drawn from the source materials, and supplies a timing anchor tied to the trigger, issuance, or destruction window.
- Keep the memorandum focused on issues and fixes; do not rewrite the notice unless requested.
