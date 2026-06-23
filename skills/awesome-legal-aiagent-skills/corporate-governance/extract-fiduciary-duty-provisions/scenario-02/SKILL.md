---
name: extract-fiduciary-duty-provisions-scenario-02
task_id: corporate-governance/extract-fiduciary-duty-provisions/scenario-02
description: Agents extract fiduciary-duty, exculpation, indemnification, and governance provisions across multiple fund documents, comparing how each vehicle allocates duties, limits liability, structures information rights, and handles conflict-approval mechanics.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Map Fiduciary Duty Provisions Across Fund Governing Documents

## 1. Subject-matter triage

Identify each distinct fund vehicle and its governing documents before extracting any provisions. Group documents by vehicle, then map each duty, exculpation, indemnification, conflict, and oversight provision to the correct vehicle and source document. Do not collapse multiple vehicles into one blended summary.

If the record contains more than one vehicle, enumerate each vehicle first, then analyze each one separately across the same issue categories. If only one vehicle is present, state that explicitly and proceed document-by-document.

## 2. Failure modes the skill is correcting

- Extracting fiduciary language document-by-document without comparing the same concept across vehicles, which hides material divergence.
- Treating a hedge clause as a generic liability cap instead of testing whether it is consistent with the governing fiduciary framework.
- Missing when a document lowers the operative duty standard from a higher investor-protective formulation to a more permissive one.
- Summarizing exculpation or indemnification without checking carve-outs, conditions, procedures, and who is covered.
- Ignoring whether LPAC or similar consent mechanics are paired with enough information for meaningful oversight.
- Overlooking inconsistency between offering, operating, advisory, and governance documents that could require remediation or disclosure.
- Stating a legal conclusion without naming the controlling doctrine, statute, rule, or other authority that supports it.

## 3. Legal frameworks / domain conventions that apply

- **Investment adviser fiduciary duty:** A registered investment adviser owes duties of care and loyalty that cannot be waived away. A clause is suspect if it purports to reduce those duties rather than allocate remedies consistently with the fiduciary baseline.
- **Contractual modification of entity duties:** Where entity law permits modification of fiduciary duties, preserve mandatory baseline duties and any implied-covenant-type constraint that cannot be eliminated.
- **Duty-standard hierarchy:** “Best interests” language is more demanding than a professional-standard formulation; good-faith-only language is typically narrower still. Treat downward shifts in the standard as legally meaningful, not stylistic.
- **Exculpation carve-outs:** Fraud and securities-law carve-outs should be checked for narrowing qualifiers, including materiality limitations or subjective framing that reduces the carve-out’s reach.
- **Corporate opportunity waiver:** Absence of an express waiver may preserve a duty to present fund-scope opportunities to the vehicle before pursuing them elsewhere.
- **No-reliance clauses:** A no-reliance clause can affect extra-contractual claims depending on governing law and context; flag its practical effect rather than assuming it is dispositive.
- **Information rights and conflict oversight:** Limited-information LPAC approval mechanics can weaken conflict review if the approving body cannot independently assess the transaction.
- **Indemnification scope:** Broader covered-person definitions, broader advancement rights, or fewer procedural conditions can materially expand protection and should be compared across documents.
- **Dual compliance/legal roles:** A combined compliance-and-legal function may create governance tension where the same role is asked to police and advocate simultaneously.

## 4. Analytical scaffolds

- **Vehicle-by-vehicle extraction:** For each vehicle, extract every fiduciary, exculpation, indemnification, conflict-approval, information-rights, and corporate-opportunity provision with document and section citation.
- **Standard-of-care comparison:** Compare the operative duty standard across vehicles and flag any formulation that appears below the applicable fiduciary baseline or inconsistent across documents.
- **Hedge-clause review:** Test each limitation clause against the relevant fiduciary-duty framework and state whether it allocates liability or impermissibly narrows duty.
- **Exculpation analysis:** Identify each carve-out, any narrowing qualifier, and any mismatch between the carve-out and the surrounding liability language.
- **Waiver audit:** Confirm whether each vehicle includes an express corporate-opportunity waiver or equivalent reservation.
- **Oversight-effectiveness review:** Assess whether LPAC or similar approval rights are supported by sufficient information access for meaningful conflict review.
- **Indemnification comparison:** Map who is covered, when indemnification applies, what procedures are required, and whether advancement or reimbursement mechanics differ across vehicles.
- **Cross-document inconsistency check:** Compare provisions across the full document set and identify conflicts, duplicative drafting, or silent gaps that create different governance outcomes.
- **Remediation analysis:** For each issue, identify the affected vehicle(s), the governing provision(s), the practical consequence, and the cleanest amendment path.

## 5. Vertical / structural / temporal relationships

- Treat the fund complex as a multi-vehicle structure in which documents may have been drafted at different times and by different counsel; apparent inconsistencies may be deliberate, but they still require flagging.
- Where the governance package is used in fundraising or investor diligence, assess whether a material divergence needs disclosure or harmonization before closing or launch.
- If a conflict-approval mechanism depends on investor consent, analyze how the information flow and approval threshold interact in practice.

## 6. Output structure conventions

- Produce a client-ready memorandum rather than a generic issue list.
- Organize the memo by vehicle first, then by provision type, with a clear comparison section for inconsistencies across documents.
- Use an ordinal severity scale defined once near the start of the memo and apply it consistently to each issue.
- For each issue, include: affected vehicle(s), provision citation, why the provision matters, the governing authority or doctrine supporting the concern, the downstream consequence, and a concrete remediation step.
- Include a prioritized recommendations section at the end with imperative action items, the responsible role, and a timing anchor tied to the transaction, filing, consent, or fundraising milestone.
- Close each issue by tying the provision to the relevant legal rule, the interacting document or clause, and the practical consequence for the client.
- Use conventional memorandum headings and an exhibit or table for cross-document inconsistencies; do not mirror any hidden checklist format.
