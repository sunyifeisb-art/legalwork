---
name: compare-job-requirements-against-candidate-credentials
task_id: immigration/compare-job-requirements-against-candidate-credentials
description: Multi-candidate credential gap analysis for immigration compliance where agents assess the job requirements against each candidate’s credentials, separate filing-blocking deficiencies from gaps that may be documented or cured, and produce prioritized corrective actions by candidate.
activates_for: [planner, solver, checker]
---

# Skill: Compare Job Requirements Against Candidate Credentials

## 1. Subject-matter triage

Identify every candidate, every petition or filing track, and the job requirement set tied to each before analyzing anything else. Keep each candidate’s record separate from the start through the final recommendations. If the source set includes more than one filing path for the same person, compare each path independently rather than merging them into one blended assessment.

State whether the record set contains one or multiple candidates, and whether any candidate appears across multiple filings. If more than one candidate or filing path is present, enumerate them first and analyze each one in turn.

## 2. Failure modes the skill is correcting

- The analysis turns into a general narrative of “good fit” or “gap” instead of a requirement-by-requirement comparison.
- Findings are not separated by candidate, so one person’s evidence is mistakenly treated as another person’s support.
- Education, experience, certifications, licenses, and special requirements are mixed together, obscuring which requirement is actually unmet.
- The analysis treats all deficiencies as equally serious, rather than distinguishing filing blockers from issues that can be cured with additional evidence.
- The analysis recommends supplementation before checking whether the filing framework allows the requirement to be satisfied that way.
- Prioritized follow-up steps are omitted, leaving the user without a sequencing plan.
- Legal conclusions are stated without identifying the controlling immigration framework or authority that supports the conclusion.
- Missing evidence is described abstractly without stating the concrete downstream effect on filing eligibility, evidentiary sufficiency, or regulatory risk.

## 3. Legal frameworks / domain conventions that apply

- Analyze each filing under the governing immigration category and its specific eligibility framework as stated in the source documents and, where necessary, the controlling statute, regulation, or form instructions.
- Separate the position-side requirement from the beneficiary-side qualification analysis whenever the filing framework requires both.
- Treat the employer’s stated role requirements as fixed as of the filing record unless the source documents show a legitimate amendment or alternative filing path.
- For education analyses, examine degree level, field of study, and any equivalency theory supported by formal evaluation evidence.
- For experience analyses, test whether the source record shows the right type, duration, recency, and employer-source corroboration.
- For certification, license, language, or specialty-skill requirements, verify that the credential matches the exact requirement stated in the filing record, not merely a similar credential.
- Where the record relies on equivalency, cross-check the equivalency theory against the controlling category requirements and the evidence used to support it.
- A deficiency that cannot be cured within the existing filing posture is Critical; a deficiency that can be cured with pre-filing supplementation is High; a deficiency that can be addressed through follow-up documentation or clarification is Moderate. Apply the label to each individual issue.
- Cite the governing authority for each material conclusion using the statute, regulation, form instruction, policy source, or other controlling reference that supports the proposition.

## 4. Analytical scaffolds

1. Candidate and filing inventory
   - List each candidate, the filing track, and the related job description or support letter.
   - If one candidate appears in multiple filings, analyze each filing separately.

2. Requirement extraction
   - Extract every stated requirement by category: education, experience, certification/licensure, language, specialty knowledge, supervisory history, and any other job-specific condition.
   - Note whether the requirement is stated as mandatory, preferred, alternative, or equivalency-eligible.

3. Credential mapping
   - Match each requirement to the evidence in the record.
   - Identify the specific document or record source for each matched credential.

4. Gap identification
   - For each unmet or only partially met requirement, state the precise mismatch.
   - Distinguish absence of evidence from affirmative inconsistency in the evidence.

5. Severity classification
   - Assign a severity label to each deficiency based on whether it blocks filing, can be cured before filing, or can be supplemented later.
   - Keep the severity tied to the specific deficiency, not the overall record.

6. Legal basis and consequence
   - For each material issue, state the controlling requirement, the evidence problem, and the practical consequence for the filing.
   - If a different filing path, amendment, or equivalency theory may solve the issue, identify that path and explain why it is or is not available on the current record.

7. Remedial path analysis
   - Convert each gap into a concrete action: obtain missing evidence, revise the role description, secure an evaluation, change the filing strategy, or gather corroboration.
   - Prioritize actions that determine eligibility before actions that merely strengthen the file.

8. Sequencing
   - Order actions so that threshold eligibility issues come before documentary cleanup and later-stage support.

## 5. Vertical / structural / temporal relationships

When the source set spans multiple candidates, multiple filings, or multiple support documents, compare them in a consistent matrix so that each requirement is checked against the correct person and filing. If the documents contain earlier and later versions of the role requirements or credentials, treat the most relevant filing-time record as controlling unless the documents show a valid amendment path.

Where the analysis depends on timing, check whether the credential existed before the filing point, whether the experience period was complete, and whether any certification or license was active at the relevant time. Distinguish pre-filing defects from post-filing follow-up issues.

## 6. Output structure conventions

- Open with a short inventory of the candidates and filings reviewed.
- Then present the analysis by candidate, and within each candidate by credential category.
- Use a clear severity field for every issue, with one consistent ordinal scale defined once.
- For each issue, include: the requirement, the evidence reviewed, the gap or inconsistency, the legal or regulatory basis, the severity, and the downstream consequence.
- Keep findings separate by candidate and do not collapse multiple deficiencies into one combined statement.
- Include a prioritized action list for each candidate, ordered so that filing-blocking items come first.
- End with an explicit Recommended Actions section that names the action, the responsible role if identifiable from the record, and the timing urgency tied to the filing posture.
- Use conventional immigration compliance language and avoid unsupported generalities.
