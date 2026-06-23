---
name: draft-data-room-population-plan-s01
task_id: corporate-ma/draft-data-room-population-plan/scenario-01
description: Guides preparation of a data room population plan from deal materials, requiring critical review of the request list for errors, separate tracking of contracts with assignment or change-of-control restrictions, distinction between copyleft and permissive open-source licenses, board minute redaction protocol, and resolution of instruction conflicts.
activates_for: [planner, solver, checker]
---

# Skill: Draft Data Room Population Plan (Scenario 01)

## 1. Subject-matter triage
- Treat the assignment as a sell-side VDR population plan for an acquisition, not a generic document checklist.
- Start from the DDRL, org chart, contract inventory, prior deal indices, and partner instructions; reconcile them against each other before drafting the plan.
- If the materials point to multiple entity levels, business lines, or document owners, enumerate them first and assign collection responsibility separately rather than using one blended pass.
- Preserve the deal team’s practical objectives: populate the room, surface corrections, and flag pre-closing process items that need separate tracking.

## 2. Failure modes the skill is correcting
- Following the request list mechanically without checking whether an item is misstated, misplaced, or inconsistent with the transaction.
- Collapsing consent-sensitive contracts into the main collection workflow instead of maintaining a separate consent-tracking workstream.
- Treating open-source risk as a single bucket instead of separating copyleft components from permissive-license components.
- Uploading board minutes without a pre-upload redaction review for privileged, strategic, or otherwise sensitive content.
- Ignoring conflicts between partner instructions and the request list instead of flagging them for resolution before the VDR opens.
- Missing shareholder-consent coordination as a deal-execution item that must be tracked alongside, but not inside, the document-population plan.
- Writing a generic upload list without assigning owners, deadlines, and priority order tied to the expected opening and closing sequence.

## 3. Legal frameworks / domain conventions that apply
- Request-list validation: the request list is a starting point, not an error-free source; review it critically and correct obvious factual or deal-structure mismatches before collection begins.
- Anti-assignment and change-of-control restrictions: contracts containing consent requirements should be tracked separately because they may require third-party approvals before closing; use a dedicated consent tracker with owner, outreach step, and deadline.
- Open-source licensing: distinguish copyleft licenses from permissive licenses; where proprietary software may be combined with copyleft components, require an audit to identify source-disclosure or distribution-trigger risk, while permissive licenses are generally lower-friction.
- Board-minute privilege and sensitivity review: board minutes often contain merger discussions, legal advice, litigation strategy, and projections; they should be reviewed and redacted by counsel before upload.
- Instruction hierarchy: if a supervising lawyer directs that a document be withheld or handled specially, that instruction controls over a rote request-list item until the conflict is resolved.
- Shareholder consent rights: consent solicitation is a transaction-management task, not merely a collection task; assign a responsible person and a timing plan.
- Standard VDR taxonomy: organize by conventional M&A folders, typically corporate, financial, intellectual property, material contracts, employment, real estate, regulatory and environmental, litigation, insurance, and transaction-specific supplements.

## 4. Analytical scaffolds
- Build the plan in two layers:
  1. the folder architecture and collection schedule; and
  2. a separate issues / exceptions tracker.
- For each requested category, test whether the item is:
  - correctly described for this deal,
  - complete for all relevant entities or periods,
  - sensitive enough to require redaction or withholding,
  - subject to consent, approval, or external rights,
  - better handled in a separate tracker rather than the main room.
- For each contract that may require consent, capture:
  - contract identifier and business owner,
  - why consent may be needed,
  - who must pursue the consent,
  - what needs to happen before upload versus before closing,
  - whether the item should be listed in the room pending consent or withheld until cleared.
- For software / technology materials, run a targeted license screen:
  - inventory relevant codebases, libraries, and dependencies,
  - identify copyleft items separately from permissive items,
  - flag any mixed-use area where proprietary and open-source components interact,
  - note whether a follow-up technical/legal review is needed before disclosure.
- For board minutes, create a redaction protocol:
  - identify custodian and reviewing lawyer,
  - specify that redactions are approved before upload,
  - distinguish redaction from withholding,
  - keep an audit trail of the basis for redaction.
- For instruction conflicts, state:
  - the instruction,
  - the conflicting request-list item,
  - the proposed resolution path,
  - whether the item should be deferred, redacted, or withheld.
- For each issue or exception, attach a severity level using one consistent ordinal scale defined at the outset, and include the practical consequence for the VDR plan.

## 5. Vertical / structural / temporal relationships
- Separate pre-upload tasks from pre-closing tasks; do not let consent solicitation, counterparty outreach, or shareholder approvals disappear into the document-collection schedule.
- Track entity-level documents by relevant vertical: parent, subsidiaries, and business units, with special attention to any non-domestic entities or gaps in the org chart.
- Preserve the sequence: validate request list, assign collection owners, screen for sensitive materials, run consent and open-source reviews, then finalize the upload sequence.
- If the expected VDR opening date is known, work backward from it to set collection deadlines, review deadlines, and escalation points.
- If a document is both responsive and sensitive, identify the governing action order: review first, redact or clear next, upload last.

## 6. Output structure conventions
- Use an industry-conventional plan, not a rubric-shaped checklist.
- Begin with a concise summary of the VDR approach, scope assumptions, and any request-list corrections.
- Include a folder architecture section organized by standard M&A categories.
- Include a collection matrix or schedule showing document category, owner, reviewer, deadline, and status.
- Include a separate exceptions / issues section with an ordinal severity label for each entry.
- Include a dedicated consent-tracking subsection for anti-assignment, change-of-control, and shareholder-consent items.
- Include a dedicated open-source subsection that distinguishes copyleft from permissive components.
- Include a board-minutes redaction protocol subsection before the upload plan.
- Include an instruction-conflict subsection identifying any partner-instruction conflicts and proposed resolution.
- End with an action list that assigns next steps to specific roles and ties them to the VDR-opening or closing timeline.
- Keep the plan operational: every flagged item should tell the team what to do next, who owns it, and when it must happen.
