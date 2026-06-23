---
name: hls-extract-regulatory-permits-diligence
task_id: healthcare-life-sciences/extract-regulatory-permits-from-diligence-documents
description: Extracts and catalogs regulatory permits from healthcare acquisition diligence documents, including change-of-ownership analysis by regulatory body, operating-without-permit risk identification, facility-level compounding risk assessment, and deal-phase-organized remediation recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Catalog Regulatory Permits from Healthcare Acquisition Diligence Documents

## 1. Subject-matter triage

- Treat the document set as a diligence extraction task, not a legal memo: identify every permit, license, registration, certification, accreditation, notice, application, renewal, deficiency, lapse, and open matter tied to regulated operations.
- Separate entity-level permissions from facility-level permissions, and separate operating authority from reimbursement-adjacent or accreditation status.
- When the source set contains multiple facilities, jurisdictions, or regulatory bodies, enumerate them first and analyze each one separately before synthesizing portfolio risk.
- If the documents are sparse or ambiguous, preserve uncertainty explicitly rather than inferring compliance.

## 2. Failure modes the skill is correcting

- Permits are undercounted because the review stops at the headline license and misses ancillary or location-specific authorizations.
- Expiration, renewal, and interim-continuation status are not tracked in a way that reveals near-term operational exposure.
- Change-of-ownership obligations are treated generically instead of being analyzed by the specific regulator and permit type.
- Operating-without-permit risk is described without tying it to the relevant source record, regulatory consequence, and transaction impact.
- Facility-level compounding risk is missed when multiple permit issues converge at the same site.
- Management-facing descriptions are repeated without checking against underlying diligence records.
- Recommendations are not sequenced by deal phase, leaving remediation timing unclear.

## 3. Legal frameworks / domain conventions that apply

- Permits may be non-transferable, entity-specific, or location-specific; assess whether closing triggers a new application, amendment, notice, or pre-approval under the governing regime.
- Change-of-ownership obligations can arise at more than one regulator at once; identify the governing authority, filing sequence, and any approval condition tied to continued operations.
- Renewal rules differ by jurisdiction; determine whether timely filing preserves authority during pendency or whether operations lapse absent express continuation.
- Facility expansion, service-line changes, compounding activity, or scope changes may require separate approval beyond the basic operating license.
- Accreditation, certification, and licensure are distinct; do not treat private accreditation as a substitute for governmental authority unless the source documents or governing regime make that relationship explicit.
- The controlling rule should be named when stating a regulatory consequence, using the statute, regulation, or agency rule reflected in the documents or generally recognized for the jurisdiction.
- Where the source materials discuss the regulator’s process, use that process description as the baseline for sequencing and timing.

## 4. Analytical scaffolds

1. Build a master inventory of every permit-related item in the source set.
   - Capture permit type, issuing body, legal entity or site covered, location, status, expiration, renewal posture, and open matter status.
   - Separate current, expired, pending, suspended, conditional, and unknown statuses.

2. For each permit or permit family, analyze operational authority.
   - Identify whether the record shows current authority, a recent lapse, a pending renewal, or a gap in coverage.
   - State the source basis for that conclusion and the downstream effect on operations, reimbursement, or closing readiness.

3. For each regulator with jurisdiction, perform change-of-ownership analysis.
   - Identify the filing or consent needed, the sequence relative to closing, and any dependency among filings.
   - Distinguish pre-closing approval, notice-only regimes, and post-closing notice or amendment regimes.

4. For each lapse, near-expiration, or pending renewal, assess risk.
   - Classify severity on a uniform ordinal scale defined once at the top of the deliverable.
   - Explain why the item is material by reference to timing, coverage scope, or operational dependence.

5. For each facility, test for compounding exposure.
   - If multiple permit issues converge at the same site, analyze the combined operational burden rather than treating each item in isolation.
   - Note whether immediate remediation, service restriction, or sequencing changes may be necessary.

6. Compare management presentation against source records.
   - Flag discrepancies, omissions, or overstatements.
   - Do not restate management characterizations without indicating whether the underlying records support them.

7. Close every issue with three elements:
   - the scale of the issue as shown in the source documents,
   - the interacting document, schedule, or permit record,
   - the practical consequence for the buyer or target.

8. Organize recommendations by transaction phase.
   - Pre-signing: diligence follow-up, clarification requests, gap confirmation.
   - Pre-closing: filings, consents, condition satisfaction, remediation steps.
   - Post-closing: transfers, renewals, notices, corrective applications, and monitoring.

## 5. Vertical / structural / temporal relationships

- Track the relationship among parent entities, operating subsidiaries, and individual facilities when permits are issued at different levels.
- Track whether one permit depends on another, whether one filing triggers another regulator’s review, and whether a single site has multiple open matters that escalate risk together.
- Track temporal sequence: expiration, renewal filing, grace period, closing date, and any post-closing cure window.
- If the source set covers more than one facility or regulator, present them in a structured sequence so the reader can follow portfolio-wide and site-specific implications without collapsing distinct regimes.

## 6. Output structure conventions

- Produce a regulatory permit extraction report that reads like a diligence work product, with a concise opening methodology, a permit inventory, risk analysis, change-of-ownership analysis, and recommendations.
- Begin with a short severity legend using an ordinal scale such as Critical / High / Medium / Low, and apply it consistently to every issue entry.
- Use table form for the inventory where possible, with one row per permit or permit-related matter.
- For each row, include the governing authority or rule reference when the legal consequence depends on a specific regime.
- For each issue entry, include: item, source basis, severity, timing, interacting record, and consequence.
- Preserve uncertainty explicitly with labels such as confirmed, likely, disclosed, pending verification, or not stated.
- End with a Recommended Actions block that gives the action, the responsible role, and the timing anchor tied to signing, closing, or the regulatory deadline.
- Do not compress distinct permits, regulators, facilities, or open matters into a single summary sentence when the source documents permit separate treatment.
