---
name: extract-labor-employment-multi-plaintiff-complaint
task_id: employment-labor/extract-labor-employment
description: Guides extraction and categorization of allegations in a multi-plaintiff employment complaint, with attention to plaintiff-specific claims, pleaded facts, and potential legal deficiencies across the asserted theories.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Categorize Key Allegations from Multi-Plaintiff Employment Complaint

## 1. Subject-matter triage

- Treat the complaint as the primary pleading and the agreements, handbook excerpts, and email chain as controlling comparison documents for defense analysis.
- First identify all plaintiffs, all counts, and all documents referenced or incorporated; then map which facts belong to which plaintiff and which facts are common to all plaintiffs.
- If the pleading spans multiple time periods, roles, pay structures, or termination events, separate them before analysis rather than collapsing them into one narrative.
- Surface any document categories that may require preservation review or litigation hold escalation.

## 2. Failure modes the skill is correcting

- Analyst extracts allegations by count without organizing them by plaintiff, so the memo obscures which facts support which claims and which defenses are individualized.
- Analyst summarizes claims but omits the pleaded facts, emails, policy references, and contract language that create or undermine each theory.
- Analyst identifies wage-and-hour or misclassification issues without checking whether the pleaded facts support the claimed job duties, compensation structure, or exemption status.
- Analyst quotes the complaint’s conclusions without testing them against the employment agreement’s termination language, handbook procedure, or the email chronology.
- Analyst treats all statutory remedies as interchangeable and misses that different claims may carry different damages, fee, or exhaustion consequences.
- Analyst fails to separate direct claims from derivative theories, making the defense assessment incomplete.
- Analyst gives narrative analysis without a usable extraction format, making it hard to convert the memo into litigation tasks.

## 3. Legal frameworks / domain conventions that apply

- Multi-plaintiff pleadings require plaintiff-by-plaintiff tracking because each person’s tenure, duties, compensation, protected activity, and damages may differ.
- Pleading analysis should be tied to the elements of each asserted claim; conclusions alone do not satisfy extraction.
- Retaliation and whistleblower theories should be tested against the pleaded protected activity, employer knowledge, causal link, and the nature of the reported conduct.
- Wage-and-hour claims should be checked against the pleaded hours, rate, classification, job duties, and any exemption or independent-contractor issue apparent from the source documents.
- Employment agreement analysis should compare any “cause” or termination standard in the contract against the factual grounds pleaded for discharge or discipline.
- Handbook analysis should compare stated policies, investigation steps, discipline procedures, complaint channels, and at-will disclaimers against the alleged employer conduct.
- Administrative exhaustion should be checked where a claim depends on a charge, notice, grievance, or other pre-suit process.
- Damages analysis should track remedies claim-by-claim because back pay, front pay, liquidated damages, statutory penalties, fees, emotional-distress recovery, and equitable relief do not necessarily travel together.
- For every legal proposition stated, cite the governing authority by name and section, or by the controlling rule or doctrine if the source documents do not supply a citation.

## 4. Analytical scaffolds

- Build a plaintiff-by-plaintiff inventory:
  1. plaintiff identity and role;
  2. employment period and stated status;
  3. pleaded conduct, dates, and actors;
  4. asserted counts;
  5. documents tied to that plaintiff;
  6. damages and relief sought.
- Build a count-by-count extraction:
  1. legal theory;
  2. elements as pleaded;
  3. specific factual allegations supporting each element;
  4. omitted or weak facts;
  5. contract, handbook, or email contradictions;
  6. defenses and bars.
- For each allegation set, separate:
  - pleaded fact,
  - inference or characterization,
  - legal conclusion,
  - document support,
  - defense implication.
- For termination-related allegations, compare the pleaded facts against the governing contractual or policy standard and identify any mismatch between alleged misconduct and the stated basis for discipline or discharge.
- For wage-related allegations, extract the alleged work period, role, schedule, and pay method, then assess whether the pleading itself supports the asserted classification or damages theory.
- For retaliation or discrimination allegations, extract the protected activity or protected trait, the adverse action, the decisionmaker, and the timing narrative; then note whether the complaint pleads nonconclusory causal facts.
- For handbook and policy allegations, compare the alleged employer conduct to the described procedure and note whether the complaint supports pretext, breach, or inconsistency arguments.
- For email-chain allegations, extract sender, recipient, date, subject matter, and any admissions, instructions, warnings, or inconsistencies that matter to liability or damages.
- Identify document categories that should be preserved: personnel records, payroll, schedules, internal complaints, investigation materials, termination records, and communications about the disputed events.

## 5. Vertical / structural / temporal relationships

- Track the same event across plaintiffs when it affects them differently; do not assume a common event has a common legal effect.
- Preserve chronology: pre-complaint events, internal reporting, employer response, discipline, termination, post-termination communications, and filing sequence should remain distinct.
- If the complaint references earlier warnings, prior discipline, or a progressive-discipline sequence, place those in order and compare them to any stated policy.
- If the source set contains multiple versions of a policy or agreement term, identify the operative version and note the timing of any change.
- Where one plaintiff’s facts depend on another plaintiff’s facts, state the dependency explicitly and distinguish primary from derivative allegations.

## 6. Output structure conventions

- Write as a defense-oriented allegation-extraction memorandum, not as a summary of the complaint.
- Use conventional memo organization:
  - overview of parties and source documents;
  - plaintiff-by-plaintiff factual extraction;
  - count-by-count analysis;
  - document cross-reference;
  - defense issues and weaknesses;
  - damages and remedies assessment;
  - preservation and next-step actions.
- For each count and plaintiff, include:
  - legal theory;
  - key allegations;
  - supporting documents;
  - weaknesses or missing elements;
  - defense angles;
  - remedy exposure.
- Where multiple plaintiffs assert the same count, give separate subentries for each plaintiff rather than a single combined treatment.
- Include a concise table or matrix that maps each plaintiff to each asserted claim and the principal remedy framework implicated by that claim.
- Include an action-items section with immediate litigation-hold and evidence-preservation steps, plus a short recommendation list tied to the defense assessment.
- Keep the writing usable for litigation; avoid paraphrase that loses chronology, attribution, or document linkage.
