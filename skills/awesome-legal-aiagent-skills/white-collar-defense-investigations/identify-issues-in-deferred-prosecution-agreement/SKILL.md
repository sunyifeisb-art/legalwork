---
name: identify-issues-in-dpa-anti-kickback
task_id: white-collar-defense-investigations/identify-issues-in-deferred-prosecution-agreement
description: Issue memorandum analyzing a draft deferred prosecution agreement, identifying discrepancies between agreement terms and the investigation record, monitoring cost and selection deficiencies, self-reporting window operational infeasibility, conflicts with existing financial obligations, and related breach/cure concerns.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Draft Deferred Prosecution Agreement — Issue Memorandum

## 1. Subject-matter triage

- Treat the draft deferred prosecution agreement as the operative text and the investigation materials as the verification record.
- Identify all materially affected provisions, but organize the memo by issue severity rather than by document order.
- If the source set contains only one candidate concern in a category, say so explicitly; otherwise enumerate each affected item before analyzing it.
- Surface verbatim quotes from internal documents only when necessary to preserve a disputed phrasing, and keep quotations narrow.

## 2. Failure modes the skill is correcting

- Factual mismatches in the statement of facts are treated as stylistic issues instead of legal risk drivers; they can expand parallel civil exposure or create an opening for the government to claim additional misconduct was concealed.
- Quantitative or categorical assertions in the agreement are accepted without checking them against the investigative record.
- Monitor provisions are reviewed for existence only, not for selection fairness, budget discipline, or fee-control mechanics.
- The self-reporting deadline is described as “short” without separately evaluating over-reporting pressure and inadvertent-breach risk from compressed internal review cycles.
- Existing financing covenants and other contractual commitments are not cross-checked for consent, default, notice, or timing conflicts.
- Term length is not assessed against severity, cooperation, and remediation credit.
- Breach and cure language is left vague, making compliance obligations difficult to administer and cure periods impractical to use.

## 3. Legal frameworks / domain conventions that apply

- The statement of facts is the factual predicate for the deferred prosecution agreement; every material factual assertion should be checked against the investigation record and supporting materials.
- Where the agreement includes a monitor, market practice favors a process that gives the company at least limited input on selection and some guardrails on fees, budget approval, or dispute resolution.
- Self-reporting obligations should be evaluated under a practical administration standard: the relevant question is whether informed company decision-makers can reasonably recognize, route, and assess the issue before the deadline.
- Contractual obligations in the agreement should be compared against existing financing documents and material agreements for covenant, consent, and default conflicts.
- The term should be assessed for proportionality to the alleged misconduct and to any cooperation or remediation credit reflected in the draft.
- Breach definitions should be objective and administrable; cure periods should be long enough to permit meaningful corrective action in light of the imposed obligations.
- Where the memo states a legal effect, identify the governing authority or contractual source supporting that proposition if it appears in the record; avoid unsupported conclusory statements.

## 4. Analytical scaffolds

1. **Statement-of-facts accuracy**
   - Compare each material assertion in the draft against the investigation record.
   - For every discrepancy, describe both the draft formulation and the conflicting source description.
   - State why the mismatch matters: civil exposure, government credibility argument, or scope inflation/understatement risk.

2. **Monitor fee controls**
   - Check for a fee cap, budget approval, reporting cadence, dispute mechanism, or comparable control.
   - If absent, identify the economic risk and propose a concrete guardrail.

3. **Monitor selection process**
   - Determine whether the company has any input into selection, objection rights, or narrowed-slate participation.
   - If the process is one-sided, flag departure from market practice and propose a structured selection path.

4. **Self-reporting window — over-reporting risk**
   - Ask whether the deadline pressures the company to report immaterial or unverified matters defensively.
   - Explain how that pressure can distort internal triage and create unnecessary compliance noise.

5. **Self-reporting window — inadvertent breach risk**
   - Ask whether legal, operational, and management review can realistically occur within the window.
   - Evaluate the risk at the point informed internal decision-makers become aware, not at a purely instantaneous discovery moment.

6. **Financial covenant conflicts**
   - Compare reporting, restriction, or remediation obligations against financing covenants and other material agreements.
   - Identify any consent, default, acceleration, notice, or amendment consequences.

7. **DPA term**
   - Compare the term to the seriousness of the misconduct and any cooperation/remediation credit.
   - If the term appears excessive or thinly supported, recommend a shorter or more calibrated period.

8. **Breach and cure provisions**
   - Test breach triggers for objective standards and administrative clarity.
   - Test cure periods for practical sufficiency given the compliance tasks the agreement requires.

## 5. Vertical / structural / temporal relationships

- Track how one issue cascades into another: a short reporting window can amplify breach risk, which can in turn trigger cure timing pressure.
- Treat financial covenant conflicts as time-sensitive because notice and consent obligations may arise before the DPA deadline or before a reporting event matures.
- Distinguish immediate operational burdens from longer-term structural burdens; a monitor cost issue affects budget planning, while a breach definition issue affects day-to-day compliance administration.
- If multiple provisions interact, note the interaction explicitly rather than describing each clause in isolation.

## 6. Output structure conventions

- Deliver a memorandum in priority order using a conventional issue-spotting format.
- Open with a short legend defining a uniform ordinal severity scale, and apply it consistently to every issue.
- For each issue, include:
  - Issue title
  - Severity
  - Source document(s)
  - What the conflict or defect is
  - Why it matters, including the legal, operational, economic, or litigation consequence
  - The document comparison or cross-reference that creates the issue
  - A concrete negotiation recommendation
- Every issue entry should close with the practical consequence and a proposed fix; do not leave an issue at description alone.
- When a source provides a number, deadline, term, cap, threshold, or other scale, anchor the analysis to that figure rather than using vague language.
- End with a standalone Recommended Actions section listing the highest-priority negotiation steps, each in imperative form and tied to the responsible role and any applicable timing anchor from the source set.
- Use an issue memorandum style suitable for `dpa-issue-memorandum.docx`; do not mimic a redline, contract draft, or generic research note.
