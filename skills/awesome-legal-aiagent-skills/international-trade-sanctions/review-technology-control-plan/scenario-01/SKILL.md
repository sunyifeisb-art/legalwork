---
name: its-review-tcp-scenario-01
task_id: international-trade-sanctions/review-technology-control-plan/scenario-01
description: Produces an export-compliance issues memorandum for a Technology Control Plan review in connection with a manufacturing license renewal that identifies unauthorized deemed exports, jurisdiction-coverage gaps, agreement-scope violations, dual-national concerns, cloud migration compliance failures, and structural TCP deficiencies.
activates_for: [planner, solver, checker]
---

# Skill: Review Technology Control Plan for ITAR Compliance Gaps and Deficiencies

## 2. Failure modes the skill is correcting

- Treating the TCP as a standalone policy document instead of testing it against the supporting record set, including access logs, onboarding files, authorization status, committee materials, training records, cloud materials, and audit evidence
- Missing active unauthorized access by focusing on paper controls rather than actual foreign-national access status, scope, and timing
- Failing to distinguish between a covered foreign national and a dual national whose nationality mix may trigger separate restrictions
- Overlooking jurisdiction or classification uncertainty for items near the boundary of controlled regimes, leaving the TCP too vague to support renewal
- Ignoring cloud migration and shared-system access risks for controlled technical data
- Reading voluntary self-disclosure language too narrowly when the TCP should require prompt escalation at discovery of a potential violation
- Omitting a severity judgment, a governing authority citation, or a concrete next step for each issue

## 3. Legal frameworks / domain conventions that apply

- Deemed export analysis under the applicable export-control regulations: disclosure of controlled technical data or technology to a foreign national can be treated as an export to that person's home country; this includes visual, verbal, electronic, and remote-access disclosure
- Authorization-scope analysis: access is permissible only when the person's nationality, role, location, activity, and technical data all fit within the scope of the governing authorization, license, exemption, or other lawful basis
- Dual-national analysis: a person with more than one nationality must be assessed against each relevant nationality and any nationality-based restriction, not just the most convenient one
- Jurisdiction and classification analysis: where the item or technical data may fall near a regime boundary, the TCP should require a jurisdiction or classification determination before access is expanded
- Cloud and remote-access controls: controlled technical data stored or accessed through cloud systems must be subject to export-control review, role-based access limits, logging, and approval before migration or broader sharing
- Compliance-governance cadence: if the TCP calls for periodic committee or officer review, missed meetings or absent minutes are procedural deficiencies that matter to renewal readiness
- Recordkeeping and training conventions: export-compliance programs commonly require documented training, periodic refreshers, and retention of access and approval records sufficient to show that controls operate in practice
- Regulatory disclosure practice: voluntary self-disclosure trigger language should require escalation upon discovery of a potential violation, not only after internal confirmation or investigation completion

## 4. Analytical scaffolds

1. Enumerate the full universe of foreign nationals, dual nationals, covered technologies, access channels, committee periods, cloud environments, and training cohorts that appear in the source record set before analyzing them; if only one item exists in a category, say so expressly
2. For each foreign national, compare access status, employer, location, nationality profile, and authorization scope against the TCP and supporting records; identify any current access lacking a valid basis or extending beyond scope
3. For each technology or data set, determine whether the record shows a jurisdiction or classification decision; if the record is silent or equivocal where the item is close to the boundary, flag the gap as a renewal risk
4. For each dual national, test all relevant nationalities and any restricted-country tie against the authorization language and access controls; do not stop at a single nationality match
5. For each committee or governance obligation, compare the required cadence to the actual meeting record and minutes; count missed sessions and assess whether the lapse undermines control effectiveness
6. For cloud migrations or shared-system deployments, verify that export-control review occurred before implementation and that the current access model blocks unauthorized foreign-national access
7. For training records, match role-based obligations to completion status and refresh timing; identify personnel with responsibilities who were not trained or were trained too late
8. For self-disclosure language, test whether the trigger is discovery of a possible issue rather than post-confirmation; flag delay-creating phrasing
9. For every issue, state the source-record mismatch, the governing authority, the practical consequence for the renewal posture, and the remedial action needed

## 5. Vertical / structural / temporal relationships

The TCP is the primary document under review, but it must be read vertically against the supporting compliance record. Use the source materials to test whether the written control design matches actual operational practice, and use time-based relationships to identify expired authorizations, missed meetings, late training, post-migration access changes, and any gap that existed before renewal submission.

## 6. Output structure conventions

- Write an issues memorandum organized by numbered issue entries
- Define a single ordinal severity scale near the top, then assign one severity label to each issue consistently
- For each issue, include:
  - issue title
  - severity
  - description of the gap or deficiency
  - governing authority with a specific citation to the applicable regulation, part, or other controlling authority
  - source-record citation or pinpoint reference to the supporting document
  - why the issue matters for ITAR renewal or compliance posture
  - recommendation or remediation step
- Frame each issue as an operational compliance problem, not just a drafting flaw; where the records show a live unauthorized access concern, say so directly and treat it as urgent
- Include a balanced closing section identifying controls that appear compliant or adequately documented, but only after the issues analysis
- End with a Recommended Actions section that assigns the action to the relevant role and ties it to the renewal timeline or another concrete urgency anchor
