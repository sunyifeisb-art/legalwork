---
name: extract-key-allegations-from-sec-referral
task_id: white-collar-defense-investigations/extract-key-allegations-from-sec-enforcement-referral-notice
description: Structured allegation summary extracted from an SEC enforcement referral notice, with cross-document attribution of quantitative data, reconciliation of trade count discrepancies across source documents, and identification of compliance policy sections the referral characterizes as violated.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Allegations from SEC Enforcement Referral Notice

## 1. Subject-matter triage

- Treat the referral as an allegation source, not a finding of fact.
- Identify each distinct theory of misconduct, each named actor, and each discrete time period before synthesizing.
- If the source set contains more than one alleged scheme, theory, or reporting period, enumerate them first and analyze each separately.
- Separate what the referral says from what the supporting exhibits show; preserve both without collapsing them into one narrative.

## 2. Failure modes the skill is correcting

- Quantitative figures are repeated without tracing each figure to the specific exhibit, log, or analysis document that supplies it.
- Different source documents use different trade counts, date ranges, or allocation totals, and the discrepancy is not surfaced.
- The allegation summary stays too high-level, omitting the named parties, exact time period, and precise conduct for each theory.
- Compliance provisions are cited from the referral without checking whether the cited manual section actually says what the referral claims.
- Defense-relevant inconsistencies are buried inside narrative prose instead of being isolated as discrete points.
- Multiple theories, accounts, or periods are merged into one blended summary, obscuring scope and priority.

## 3. Legal frameworks / domain conventions that apply

**SEC enforcement referral:**
- A referral typically summarizes the Division’s investigative theory, identifies the subjects, describes the relevant conduct, and cites the statutory or regulatory provisions believed to be implicated.
- Characterizations in the referral are advocacy, not adjudication; defense review should frame them as allegations and test them against the source exhibits.

**Trading-allocation and cherry-picking theories:**
- Where the referral alleges allocation abuse, the key defense issues are timing, account selection logic, outcome knowledge, and whether the source data actually supports the asserted pattern.
- Numerical assertions about trade allocation, profitability, or account treatment should be matched to the underlying tables, logs, or analysis summaries.

**Compliance-policy verification:**
- When the referral cites internal policy provisions, verify the actual policy text and numbering.
- A misdescribed or overextended policy citation is a meaningful defense point because it can undermine the referral’s narrative of rule breach.

**Allegation extraction conventions:**
- For each theory, capture: who is accused, what is alleged, when it allegedly occurred, what documents support the allegation, and what numbers are used to support the narrative.
- Distinguish between direct allegations, inferential conclusions, and background context.

## 4. Analytical scaffolds

1. **Issue enumeration**
   - List each distinct allegation, theory, or scheme separately before analysis.
   - If only one theory is present, say so expressly and explain why the rest are background or supporting facts.

2. **Per-theory allegation summary**
   - For each theory, capture the named parties, relevant period, alleged conduct, and the referral’s stated evidentiary hook.
   - Keep the theory-level summary bounded to that theory; do not mix in unrelated allegations.

3. **Document-by-document attribution**
   - For every numerical figure, date range, or factual statistic, identify the source document supplying it.
   - If the referral and supporting materials differ, note both figures and preserve the source of each.

4. **Discrepancy identification**
   - Compare the referral’s figures against supporting exhibits, logs, or analysis summaries.
   - Flag differences in counts, date ranges, scope, terminology, or account treatment.
   - Explain whether the difference appears to be a scope issue, methodology issue, or narrative overstatement.

5. **Compliance citation check**
   - For each policy or rule cited by the referral, verify the cited section against the actual internal policy text.
   - Note whether the citation is accurate, incomplete, or potentially overstated.

6. **Defense-priority assessment**
   - Rank issues by their likely importance to response planning: scope, identity, timeline, quantitative mismatch, or policy mischaracterization.
   - Tie each priority point to the concrete source inconsistency it depends on.

7. **Cross-document synthesis**
   - Use the referral as the organizing document, but test each allegation against the exhibits.
   - Surface any missing linkage between the referral’s conclusion and the underlying source material.

## 5. Vertical / structural / temporal relationships

- Preserve the chronology for each scheme separately; do not merge overlapping periods unless the documents themselves do.
- If multiple subjects or accounts appear, map which allegation attaches to which person or account.
- If a figure changes across documents, show the source-to-source movement rather than reporting a single blended number.
- Where the referral relies on a sequence of events, note whether the sequence is actually supported by the exhibits or is inferential.
- Track whether the alleged conduct is isolated to a single period or repeated across multiple windows.

## 6. Output structure conventions

- Deliver a structured allegation summary organized by allegation, theory, or scheme.
- Open with a short source set overview: referral, exhibits reviewed, and any obvious limitations in the record.
- For each allegation section, include:
  - named parties;
  - precise time period;
  - alleged conduct;
  - supporting documents and the key facts each supplies;
  - numerical assertions with source attribution;
  - any discrepancy or inconsistency;
  - compliance provisions cited and verification result;
  - defense-relevant observations.
- Use a separate discrepancies table or equivalent section to list every material mismatch between the referral and supporting documents, with both figures and both sources.
- End with a concise defense-priority summary highlighting the points most likely to matter for Wells-response or investigation planning.
- Keep the output in allegation-summary form; do not turn it into a brief, memo, or argumentative letter.
