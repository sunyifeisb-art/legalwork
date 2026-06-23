---
name: extract-reporting-obligations-from-advisory-agreement
task_id: funds-asset-management/extract-reporting-obligations-from-advisory-agreement
description: Extract all reporting obligations from an investment advisory agreement and companion documents into a consolidated reporting obligation matrix, and identify structural and compliance issues including sequencing dependencies, deadline ambiguities, and gaps between the adviser's ongoing obligations and the agreement's periodic reporting cadence.
activates_for: [planner, solver, checker]
---

# Skill: Systematic Reporting Obligation Extraction and Issue Identification

## 1. Subject-matter triage

- Treat the advisory agreement, all exhibits and schedules, and any side letters or addenda as a single reporting-obligation source set.
- Identify whether the documents concern ongoing fund reporting, investor-specific reporting, regulatory filing references, tax reporting, or operational monitoring, because each may use different timing logic and recipients.
- Separate obligations that are expressly contractual from obligations that are only referenced by incorporation, cross-reference, or regulatory shorthand.
- If dates or periods are available, convert abstract timing language into the first workable reporting deadline; if not, preserve the contractual timing and note what date inputs are missing.

## 2. Failure modes the skill is correcting

- Analyst extracts reporting obligations only from the main agreement body, omitting obligations in exhibits, schedules, or investor-specific side letters that may impose more burdensome or more frequent reporting.
- Analyst does not translate deadline language into an actual first-period date where the needed dates are available, instead leaving the obligation only in abstract form.
- Analyst misses sequencing dependencies, leaving the compliance team with an unworkable reporting schedule.
- Analyst does not flag the gap between an ongoing monitoring obligation and a periodic contractual reporting cadence.
- Analyst collapses multiple reporting regimes into one generic summary instead of separating each source, recipient, cadence, and trigger.
- Analyst states a compliance concern without tying it to the controlling contract language, the interacting provision, and the operational consequence.
- Analyst gives conclusions without making the resulting compliance or reporting action explicit.

## 3. Legal frameworks / domain conventions that apply

- **Systematic extraction across all sources:** Read the main agreement, all attachments, and any investor-specific amendments as a unified obligations set. An obligation in a schedule or side letter is not secondary merely because it is outside the main body.
- **Contract hierarchy and cross-reference logic:** If documents have precedence language, use it to reconcile inconsistent reporting terms; if they do not, identify the inconsistency and treat the more specific or more burdensome term as a potential operational constraint.
- **Timing conversion:** Turn “within X days after” and “as of each period end” language into a concrete first deadline when the period dates are available. Preserve the counting method used by the contract, including whether the trigger runs from a period end, delivery date, notice, or event.
- **Business-day and holiday sensitivity:** If a deadline is stated in calendar days or a fixed date, check whether it lands on a non-business day and whether the contract supplies a fallback rule.
- **Reporting cadence vs. monitoring duty:** A periodic report may not satisfy a continuous monitoring obligation. Where the agreement requires ongoing oversight, identify whether the contract also requires interim notice on a threshold breach or event.
- **Investor-specific enhancements:** Side letters may impose more detailed or more frequent reporting than the base agreement. Compare the enhanced term against the baseline and note whether the enhancement may cascade through MFN or similar election rights if those concepts appear in the source set.
- **Regulatory filing references:** If the agreement references a filing by name but not by frequency or deadline category, note that the filing cadence may depend on the adviser’s regulatory profile and should be mapped to the applicable filing rule before implementation.
- **Disclosure scope controls:** Where the agreement requires disclosure of agent involvement, allocation methodology, valuation, or compliance matters without detailing content, treat the scope as incomplete and flag it for clarification.

## 4. Analytical scaffolds

- **Source-by-source inventory:** Enumerate every reporting obligation by document, then by section, before synthesizing.
- **Obligation capture fields:** For each obligation, capture:
  - source document and section
  - recipient or beneficiary
  - what must be reported
  - trigger or reporting period
  - deadline language
  - delivery form or medium
  - any qualifier, exception, or condition
  - any dependency on another report, statement, audit, valuation, or certification
- **First-deadline conversion:** Where the date inputs exist, calculate the first due date from the contractual wording and preserve the counting convention used by the agreement.
- **Comparison pass:** Compare each non-base-source obligation against the base agreement to identify more frequent, more detailed, narrower, or more burdensome requirements.
- **Issue pass:** For each issue, identify the clause pair or document interaction, explain the conflict or gap, and state the practical consequence for compliance, operations, or investor relations.
- **Ambiguity pass:** Flag drafting defects that impair implementation, including undefined terms, missing frequency detail, circular timing, missing fallback rules, and unclear document hierarchy.
- **Operationalization pass:** Where the agreement implies a schedule but does not make it executable, state the missing implementation step rather than merely describing the uncertainty.

## 5. Vertical / structural / temporal relationships

- Map the reporting stack vertically: master agreement, then exhibit or schedule, then side letter or investor-specific addendum, then any incorporated regulatory reference.
- Track temporal order across related obligations: valuation or financial statement preparation may need to occur before capital account reporting, which may need to occur before investor delivery.
- Identify whether one report is conditioned on completion of another, whether a report depends on third-party inputs, and whether the dependency creates a timing conflict.
- Preserve the difference between event-driven, period-end, and anniversary-based reporting.
- If a source creates ongoing monitoring but the reporting clause is periodic, flag the mismatch as a compliance-design issue and note the need for event-triggered escalation.

## 6. Output structure conventions

- Produce one consolidated reporting-obligation matrix as the primary deliverable, using an industry-conventional table format.
- Organize the matrix so each row represents one distinct reporting obligation or one clearly separable cadence/recipient combination.
- Use clear column headings that cover source, obligation, recipient, timing, first due date if derivable, format, dependencies, and implementation notes.
- Preserve source citations at the row level so each obligation can be traced back quickly.
- Follow the matrix with a separate issues section that groups drafting, timing, dependency, scope, and compliance risks by category.
- For each issue entry, include:
  - an ordinal severity label using a consistent scale stated once at the top
  - the source clause(s) or document interaction
  - the specific defect or conflict
  - the practical consequence
  - the recommended fix or implementation step
- Keep recommendations operational and tied to the responsible role or function named in the source documents where possible.
- End with a concise Recommended Actions block that converts the findings into next steps for counsel, compliance, or the relevant business owner.
- Do not omit side letters or attachments even if they repeat the base obligation; note duplication, enhancement, or divergence explicitly.
- Do not compress separate obligations into a single narrative summary when the timing, recipient, or content differs in a material way.
