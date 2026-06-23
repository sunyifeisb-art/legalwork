---
name: draft-bid-procedures-motion
task_id: bankruptcy-restructuring/draft-bid-procedures-motion
description: Ensures a bid procedures motion includes the core procedural elements commonly addressed in a chapter 11 sale process — a free-and-clear sale basis, stalking horse protections, bidder assurance requirements, and a cure-claims handling mechanism — and is accompanied by a separate issues memorandum with severity-rated findings.
activates_for: [planner, solver, checker]
---

# Skill: Draft Bid Procedures Motion

## 1. Subject-matter triage
- Confirm the source set supports a chapter 11 sale process, the requested auction timetable, and any sale-order conditions that affect bid procedures.
- Draft the motion as the primary deliverable first; draft the issues memorandum only after the motion file is complete and non-empty.
- If the source set contains multiple transaction parties, assets, or timelines, enumerate them before drafting so each procedure is tied to the correct deal component.

## 2. Failure modes the skill is correcting
- Agent produces only a memo and omits the operative motion and proposed order.
- Agent leaves out standard section 363 sale mechanics: sale authority, free-and-clear relief, bidding protections, bidder qualification standards, cure handling, notice, auction mechanics, and back-up bid mechanics.
- Agent narrows bidder protections or assurance requirements to one bidder class instead of applying them across all qualified bidders.
- Agent states conclusions about sale protections or free-and-clear relief without naming the statutory or case authority supporting them.
- Agent drafts the issues memorandum without severity labels, concrete recommendations, or transaction-specific risk analysis.

## 3. Legal frameworks / domain conventions that apply
- Section 363(b) and Section 363(f) of the Bankruptcy Code govern use of sale authority and sale free and clear of interests; the motion should identify the statutory basis or bases for the requested relief.
- Section 105(a), Section 363(k), and Sections 365(b), 365(f), and 365(u) often inform sale procedures, credit-bid treatment, assignment mechanics, and cure handling.
- Stalking horse protections should be framed as process protections justified under the business judgment standard and supported by the case record, not as automatic entitlements.
- Bidder qualification standards should be objective, commercially reasonable, and applied to all bidders; adequate assurance should be required from each qualified bidder where relevant.
- Overbid increments, deposit requirements, and bid deadlines should be calibrated to preserve competitive tension without chilling participation.
- Credit-bid limitations or conditions must be treated cautiously and tied to statutory authority and any requested court findings.
- Pre-closing third-party approvals, antitrust clearance, and consent conditions should be built into the procedures timeline when the source documents make them relevant.
- Any proposed cure-claim process should distinguish undisputed amounts, disputed amounts, and the mechanism for resolving disagreement before assumption or assignment.
- Any proposed auction cancellation, adjournment, or back-up bidder provision should be anchored to the transaction timeline and the proposed order.

## 4. Analytical scaffolds
- Motion organization should follow a conventional sale-procedures arc: background and transaction context; jurisdiction and legal basis; requested relief; proposed bidding procedures; stalking horse protections; notice and objection mechanics; cure-claim process; auction and sale hearing mechanics; and proposed order.
- For each requested procedure, identify the transaction function it serves, the legal basis supporting it, and any interaction with another sale term or timeline event.
- When more than one bidder class, consent set, contract group, or milestone exists, treat each as a distinct procedural lane and draft procedures that work across all lanes.
- In the issues memorandum, pair each risk with: the governing authority; the source-document hook that creates the risk; the practical effect on timing, value, or closing certainty; and a concrete fix.
- Use ordinal severity labels consistently across the issues memorandum:
  - Critical: likely blocks approval or closing absent revision.
  - High: material litigation, timing, or value risk.
  - Medium: meaningful drafting or process risk that should be corrected.
  - Low: refinement or cleanup item with limited downside.
- Close each issue with the transaction consequence and the recommended fix; do not leave issues as abstract drafting observations.
- If the source documents give specific economic inputs, deadline dates, or deal milestones, tie the analysis to those inputs; otherwise anchor the discussion to the relevant sale hearing, auction, or closing milestone identified in the source set.

## 5. Vertical / structural / temporal relationships
- Track the sale process in sequence: motion filing, notice period, bid deadline, qualification review, auction, sale hearing, order entry, and closing.
- Make each procedure temporally coherent with the others; the bid deadline, objection deadline, and auction date should not conflict, and back-up bidder or deposit provisions should fit within the same sequence.
- If a cure process depends on assumption/assignment timing, show that relationship explicitly so the procedures do not force premature contract treatment.
- If a stalking horse protection extends past auction or hearing dates, confirm the proposed duration matches the closing timeline and any interim financing or approval milestones.
- If multiple asset groups or contract sets are being sold, state whether the procedures operate jointly or separately and whether one timetable controls all sale components.

## 6. Output structure conventions
- Produce two files: `bid-procedures-motion.docx` and `issues-memorandum.docx`.
- Draft the motion in conventional sections, using operative sale language rather than a project summary.
- Include a proposed order as an exhibit or appended order text in the motion package.
- In the motion, state the relief requested with the governing authority named in the text; do not rely on generic references alone.
- In the issues memorandum, use one entry per issue with this structure: Problem, Governing Authority, Impact, Recommendation, Severity.
- End the issues memorandum with an explicit Recommended Actions block that assigns each action to a responsible role and ties it to a filing, auction, hearing, or closing milestone.
- Before finishing, verify by name that each required file exists, is non-empty, and contains the operative drafting rather than a description of the drafting.
