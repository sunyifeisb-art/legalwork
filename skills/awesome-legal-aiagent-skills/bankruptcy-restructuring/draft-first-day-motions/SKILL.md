---
name: draft-first-day-motions
task_id: bankruptcy-restructuring/draft-first-day-motions
description: Ensures a first-day motions package applies relevant bankruptcy-practice requirements and cross-document consistency checks, including priority-claim, utility, executory-contract, and financing analyses, while flagging discrepancies across filings.
activates_for: [planner, solver, checker]
---

# Skill: Draft First-Day Motions Package

## 1. Subject-matter triage

- Treat the package as a coordinated set of bankruptcy pleadings plus a sworn officer declaration, not isolated drafts.
- Identify the debtor’s operating model, immediate cash needs, workforce exposure, vendor dependencies, utilities, and financing posture before drafting any motion.
- If the record contains multiple dates, providers, budgets, claims pools, or milestones, enumerate them first and then draft against each item separately.
- If the source set supports only one answer for a category, say so explicitly and explain why the other possibilities are not in scope.

## 2. Failure modes the skill is correcting

- Draft omits motion-specific bankruptcy requirements that commonly arise in a first-day package, including priority-claim treatment, utility adequate-assurance mechanics, executory-contract issues, and financing-related relief.
- Draft fails to connect facts across documents, such as a cash-flow assumption that conflicts with the motion budget, a milestone that conflicts with the case schedule, or a declaration statement that differs from the motion record.
- Draft states a conclusion without grounding it in the controlling Bankruptcy Code provision, rule, or other authority.
- Draft does not separate category-level requests from case-specific facts, making the court record harder to follow.
- Draft misses operational knock-on issues that should be flagged early, including tax-withholding exposure, reclamation exposure, lien-priority concerns, or workforce-reduction timing.

## 3. Legal frameworks / domain conventions that apply

- Priority wages and benefits: apply the Bankruptcy Code’s priority scheme, including 11 U.S.C. § 507(a), when addressing employee-related relief, unpaid prepetition amounts, and any excess or nonpriority portion.
- Administrative expense concepts: distinguish prepetition obligations from postpetition administrative obligations under 11 U.S.C. § 503(b) where the source facts require it.
- Utilities: analyze adequate assurance under 11 U.S.C. § 366 and the statutory timing window for utility objections or terminations.
- Critical vendor and trade support: frame relief as business necessity tied to continued operations, while checking for recent-delivery, reclamation, setoff, or other seller-right issues under the Bankruptcy Code and applicable nonbankruptcy law.
- Executory contracts and licenses: consider 11 U.S.C. § 365, including ipso facto issues, assumption/rejection timing, and any consent or cure issues that may affect relief.
- Cash management and bank accounts: use Bankruptcy Code and case-law conventions governing ordinary-course use of cash collateral, bank-account access, and account-control mechanics as relevant to the source facts.
- DIP financing: analyze financing authority under 11 U.S.C. §§ 364(c) and 364(d) where priming, superpriority, lien grants, or milestones are requested; identify any lien-priority or consent issues.
- First-day relief generally: draft requests in a form that aligns with ordinary Chapter 11 practice, including background, legal standard, requested relief, and fact support.
- CRO declaration: present sworn factual support for the filing, including qualifications, engagement terms, company overview, capital structure, distress causes, liquidity, hearing timing, and any workforce or tax issues.
- Rule-level support: where the motion relies on a procedural or evidentiary proposition, cite the controlling Bankruptcy Rule, local practice, or other authority by name and section where applicable.

## 4. Analytical scaffolds

- For each motion, build the analysis from: what relief is sought, what statutory or rule authority supports it, what case-specific facts justify it, what operational risk it addresses, and what relief the proposed order should authorize.
- Identify and separate: prepetition vs. postpetition obligations; ordinary-course vs. extraordinary relief; debtor’s estimate vs. actual operating history; and secured-creditor issues vs. trade-creditor issues.
- Employee/wage motion:
  - identify the relevant priority framework,
  - address any wage, benefit, vacation, bonus, commission, or reimbursement buckets separately if the facts distinguish them,
  - note tax-withholding and payroll-deduction implications where the officers or managers may face exposure.
- Critical vendor motion:
  - state the requested authorization in case-specific terms,
  - tie the request to ongoing operations and specific vendor dependencies,
  - address recent deliveries, potential reclamation assertions, and any offsets or cure obligations suggested by the source materials.
- Cash management motion:
  - describe the debtor’s bank structure and cash flows,
  - explain why current accounts, locks, sweeps, or controls must be preserved or modified,
  - identify any inconsistencies among account lists, signatories, balances, or budget assumptions.
- DIP motion:
  - identify each milestone, each condition precedent, and each use restriction separately,
  - compare any milestone dates to the proposed hearing or case schedule,
  - flag any lien subordination, priming, release, consent, or budget-variance issue that bears on enforceability.
- Utility motion:
  - list each utility provider and the proposed adequate-assurance treatment for each category of service if the record differentiates them,
  - compare proposed assurance to the debtor’s actual usage or budgeted utility spend,
  - anchor the request to the statutory window for protection.
- Joint-administration motion:
  - explain the procedural efficiency rationale,
  - preserve substantive separateness unless the source facts justify a broader request,
  - flag any entity-specific mismatch in captions, schedules, service lists, or corporate relationships.
- CRO declaration:
  - use a sworn, first-person factual narrative,
  - keep qualifications, retention terms, operational overview, liquidity, and case milestones distinct,
  - identify any facts that would help reconcile discrepancies among the package documents.

## 5. Vertical / structural / temporal relationships

- Track entity-by-entity differences if the package involves more than one debtor or affiliate; do not assume identical relief or facts across entities.
- Track date-by-date differences between petition date, first-day hearing date, payment dates, cure dates, objection deadlines, and financing milestones.
- Track document-to-document consistency on:
  - debtor names and case captions,
  - employee counts and payroll periods,
  - vendor lists and payment ceilings,
  - utility providers and assurance amounts,
  - bank accounts and signatories,
  - DIP milestones and budget assumptions,
  - factual statements in the declaration versus the motions.
- If any discrepancy appears, flag it in the motion where it matters and in the declaration if the discrepancy affects sworn facts.

## 6. Output structure conventions

- Produce each requested document as a standalone draft with bankruptcy-conventional headings and internal logic.
- Use a standard motion structure: Introduction or Relief Requested, Background, Legal Standard, Argument, and Proposed Order, with case-specific facts integrated where they belong.
- Include proposed orders as exhibits within each motion package, drafted to track the relief requested and to avoid unexplained overbreadth.
- For the CRO declaration, use a declaration format with numbered paragraphs, sworn factual statements, and a signature block suitable for filing.
- Keep the relief language precise and order-ready; avoid narrative summaries in place of operative text.
- Surface cross-document discrepancies explicitly, using a short note in the relevant document rather than relying on a separate omnibus list.
- When a legal proposition is used, cite the controlling authority by name and section in the body of the draft.
- Before finalizing, verify that each deliverable exists, is non-empty, and contains operative drafting rather than a description of what the motion would say.
- The package should read as a coordinated first-day filing set, not as seven unrelated memoranda.
