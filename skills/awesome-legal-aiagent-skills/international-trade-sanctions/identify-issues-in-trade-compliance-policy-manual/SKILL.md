---
name: its-identify-issues-trade-compliance-policy-manual
task_id: international-trade-sanctions/identify-issues-in-trade-compliance-policy-manual
description: Produces a gap analysis memorandum for a trade compliance policy manual that identifies substantive regulatory gaps, procedural deficiencies, and governance issues in areas such as deemed export controls, anti-boycott reporting, foreign-produced item analysis, sanctions coverage, product classification, and compliance-function independence.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in a Trade Compliance Policy Manual

## 1. Subject-matter triage

- Treat the source set as a trade-compliance program review, not a generic policy edit.
- Identify whether the manual governs exports, reexports, deemed exports, sanctions, boycotts, classification, screening, investigations, or escalation; only analyze topics actually addressed or clearly implicated.
- Where multiple regimes or controls overlap, isolate each regime and test the policy against the specific control path rather than collapsing them into one general compliance statement.
- If the documents reference more than one business unit, product line, geography, or control owner, analyze each distinct lane separately before synthesizing enterprise-wide findings.

## 2. Failure modes the skill is correcting

- Assessing the deemed export section without checking whether access to controlled technology is tied to an affirmative licensing or access-control analysis rather than a standalone confidentiality commitment
- Treating anti-boycott compliance as a single reporting obligation when the policy may need separate reporting workflows, triggers, records, and escalation paths for each applicable authority
- Reviewing governance language without testing whether the compliance function has structural independence, direct escalation authority, and protection from business override
- Not checking whether the policy gives users an operational method for foreign-produced item analysis instead of merely naming the concept
- Missing gaps in sanctions coverage when screening, ownership restrictions, sectoral restrictions, export-control restrictions, and services restrictions are blended into one generic statement
- Failing to identify whether suspension or hold provisions require immediate operational action, exception approval, and documentation when a transaction is paused
- Not spotting product-classification or boundary-determination gaps where items, technologies, or services may fall within overlapping regimes

## 3. Legal frameworks / domain conventions that apply

- Deemed export compliance: test whether the policy requires an export-eligibility determination, access restriction, or technology-control process before foreign national access to controlled technology; confidentiality language alone is not a substitute for a control framework
- Technology control plans: verify that any plan describes the controlled technology, physical and logical access controls, screening or vetting at onboarding or access request, and escalation when circumstances change
- Anti-boycott reporting: review whether the policy separately addresses reporting triggers, timing, content, and recordkeeping for each required pathway, rather than presenting boycott reporting as a single undifferentiated duty
- Foreign-produced item analysis: confirm the policy provides a usable nexus methodology for determining in-scope foreign-produced items based on U.S.-origin inputs, controlled technology, equipment, or other relevant connections
- Suspension and hold controls: if the policy contemplates suspending a customer or transaction during investigation, verify that it requires a prompt hold on outstanding orders, defines exception authority, and specifies documentation and escalation steps
- Sanctions coverage: confirm that the policy separately addresses screening, ownership-based restrictions, sectoral restrictions, export-control restrictions, and services restrictions where applicable; broad references to “sanctions” may be underinclusive
- Product classification: verify that the policy requires classification determinations, assigns ownership, and sets a remediation workflow for unclassified items
- Boundary determinations: check for procedures addressing items or services that may fall within multiple regulatory regimes and require escalation for jurisdictional classification
- Compliance-function independence: assess whether reporting lines, authority, and escalation rights support independent compliance judgment and timely issue elevation

## 4. Analytical scaffolds

1. Map the manual by topic and owner; if the source set contains more than one relevant business area, policy chapter, or control population, analyze each separately before drawing conclusions.
2. For deemed export provisions, test the trigger, approval logic, access-control mechanics, and foreign-national screening; identify any place where a confidentiality promise is used in place of a control decision.
3. For technology-control content, verify the plan includes the controlled item description, the access perimeter, the vetting or screening step, and the change-management or escalation process.
4. For anti-boycott provisions, separate the reporting obligations by authority, trigger, timing, content, and records; note any provision that compresses distinct obligations into one generic step.
5. For foreign-produced item language, identify whether the policy gives a method, not just a label, for determining scope; flag any omission of a practical test or work instruction.
6. For sanctions provisions, distinguish screening, ownership or sectoral restrictions, export-control issues, and services prohibitions; confirm each is addressed on its own terms.
7. For classification and boundary procedures, check whether the manual assigns responsibility, requires classification before use or shipment, and provides a remediation path for exceptions or unknowns.
8. For suspension or investigation holds, check whether the policy requires immediate operational holds, defines exception approvers, and requires documentation of decisions.
9. For governance, test whether the compliance function can escalate issues without business veto and whether the reporting line supports independence.

## 5. Vertical / structural / temporal relationships

- Where one section depends on another, state the dependency explicitly; for example, access-control language may depend on classification, classification may depend on screening, and suspension may depend on investigation escalation.
- Compare cross-references across chapters, annexes, forms, and procedures to see whether the manual is internally consistent or whether a control is mentioned in one place and omitted in the operating section.
- If the manual uses time-based triggers, deadlines, review cycles, or renewal concepts, check that the timing is operationally workable and aligned across sections.
- When the policy allocates authority among business, legal, and compliance personnel, identify whether the hierarchy permits prompt escalation and preserves compliance independence.

## 6. Output structure conventions

- Write a board-ready gap analysis memorandum with a short executive summary, an issues section, and a prioritized remediation roadmap.
- Define one ordinal severity scale at the top and apply it consistently to every finding.
- For each issue, state: the affected policy area, the policy text or omission at issue, the governing standard or authority by name and section, the gap, the consequence, and the recommended fix.
- Close each issue with three moves: tie it to a concrete document-based scale, cross-reference the interacting section or control, and state the downstream regulatory, operational, or governance consequence.
- Use issue language that distinguishes regulatory violation risk from best-practice deficiency.
- Include an explicit Recommended Actions section at the end with imperative steps, the responsible role, and a timing anchor tied to the next compliance, audit, filing, launch, or remediation milestone.
- If the source set identifies a specific statute, regulation, or control authority, cite it by name and section; do not state legal conclusions without the supporting authority.
- Keep the remediation roadmap prioritized by severity and implementation sequence, not by topic alone.
