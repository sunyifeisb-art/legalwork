---
name: hls-identify-fda-presub-issues
task_id: healthcare-life-sciences/identify-issues-in-fda-pre
description: Reviews a pre-submission package for a novel medical device to identify issues in product classification, biocompatibility categorization, software concern classification, electromagnetic compatibility testing gaps, investigational study requirements, predicate selection, imaging-compatibility claims, drug-use instructions, and clinical study design deficiencies.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in FDA Pre-Submission Package for Novel Thrombectomy Device

## 2. Failure modes the skill is correcting

- Product classification, combination-product pathway, and intended-use framing are accepted too quickly, causing the submission to be routed under the wrong regulatory theory.
- Biocompatibility scope is keyed to the wrong contact type or duration, so the proposed test set does not match the device’s actual patient-contact profile.
- Software concern level is understated relative to the device’s clinical function, especially where software failure can affect treatment decisions, device control, or procedural safety.
- Electromagnetic compatibility testing is omitted or treated as optional even though a catheter-based hospital-use device may face standard EMC expectations.
- Imaging-compatibility claims are stated without the bench, safety, or performance support needed to sustain them.
- Clinical investigation planning fails to account for investigational-device requirements, oversight obligations, adverse-event reporting, follow-up adequacy, and exclusion criteria.
- Predicate selection is too narrow, relying on a single comparator when intended use or technological characteristics suggest a split or secondary predicate discussion is needed.
- Instructions for use do not adequately address drug co-use, handling, delivery, compatibility, or user steps where the device is intended to work with therapeutic agents.
- Issues are described narratively without prioritization, regulatory grounding, or concrete recommendations.

## 3. Legal frameworks / domain conventions that apply

- Product classification and pathway: assess whether the device is a stand-alone device, part of a combination product, or otherwise subject to a different center-led review framework; if drug or biologic elements are present, confirm that the primary mode of action analysis is documented under the applicable combination-product consultation framework.
- Biocompatibility: classify patient contact by tissue/contact type and duration, then match that classification to the appropriate biocompatibility test battery under accepted device-biological evaluation principles.
- Software concern: evaluate the clinical consequence of software failure under the FDA software documentation framework and do not accept a low concern classification if the software can materially affect diagnosis, therapy, or procedural control.
- EMC: confirm that the test plan addresses applicable electromagnetic compatibility expectations for hospital and clinical environments under the relevant FDA and consensus-standard framework.
- Imaging compatibility: if the device claims imaging compatibility, verify that the claim is tied to a test plan that actually supports the claimed performance and safety under relevant imaging-related standards and FDA expectations.
- Investigational use: if the draft contemplates a clinical study of a significant-risk device or a noncleared use, assess whether an investigational authorization and associated IDE framework apply before initiation.
- Predicate selection: for substantial-equivalence analysis, the comparator should share intended use and enough technological similarity to support the claimed comparison; where the comparison is mixed, a secondary or split-predicate discussion may be necessary.
- Drug-use instructions: where the device is intended to be used with drugs, the IFU should address handling, delivery, compatibility, preparation, and operator directions consistent with the relevant drug-device use context.
- Clinical study design: review the protocol for independent oversight, adverse-event reporting, monitoring, duration of follow-up, and exclusion criteria under the applicable human-subjects and device-investigation framework.

## 4. Analytical scaffolds

1. Regulatory pathway triage: identify whether the package is describing a device-only submission, a combination-product scenario, or a device with drug-adjacent claims; then test whether the pathway analysis is complete and internally consistent.
2. Contact-profile check: identify the patient-contact surface, tissue type, and duration category used in the package; compare it to the intended clinical use and flag any mismatch in the biocompatibility plan.
3. Software-risk check: identify the stated software concern level, the software functions implicated, and the clinical consequence of failure; if the classification appears understated, identify the more defensible level and the reason.
4. EMC and environmental testing check: identify the proposed bench and environmental testing set; verify whether EMC is expressly included and whether the planned conditions match the intended use environment.
5. Imaging-claim check: if the package asserts imaging compatibility or imaging visibility, test whether the claim is supported by specific performance and safety testing rather than labeling alone.
6. Predicate analysis: identify the proposed predicate, the intended use, and the core technological differences; assess whether a single predicate is sufficient or whether a secondary or split-predicate explanation would better support the comparison.
7. Investigational-study check: identify whether a clinical study is proposed, whether the device and use scenario appear significant-risk, and whether the package addresses the investigational authorization path before study start.
8. Drug-use instruction check: if drugs or therapeutic agents are part of the use case, assess whether the IFU and user training materials address preparation, compatibility, delivery, and failure-handling steps.
9. Clinical protocol adequacy check: assess oversight, safety monitoring, adverse-event reporting, stopping criteria, follow-up length, and exclusion criteria for fit with the device’s risk profile and study objectives.
10. Prioritization rule: rank issues by whether they threaten the submission pathway, the legitimacy of clinical evidence, or the credibility of a core performance claim.

## 5. Vertical / structural / temporal relationships

- Separate threshold issues from downstream implementation issues: pathway/classification defects come first, because they can invalidate the rest of the package.
- Treat testing gaps as upstream of claim support: if a claim lacks the testing needed to sustain it, the claim issue should be linked to the missing test plan, not discussed in isolation.
- When clinical evidence depends on regulatory status, address investigational authorization before protocol sufficiency.
- If one deficiency affects multiple sections of the package, note the interaction once and then anchor the issue to the section where the omission is most visible.
- Where the package spans device description, nonclinical testing, labeling, and protocol materials, analyze each layer against the same intended-use statement to expose internal inconsistency.
- If the document set suggests more than one comparator, pathway, or study scenario, enumerate the alternatives explicitly before evaluating them.

## 6. Output structure conventions

- Produce a prioritized issue memorandum suitable for a regulatory review audience.
- Start with a brief executive summary that states the overall risk picture and a concise issue tally by severity using a stated ordinal scale such as Critical / High / Medium / Low.
- Define the severity scale once, then apply it uniformly to every issue entry.
- For each issue, use an industry-conventional issue format with:
  - document section or source location
  - issue description
  - governing regulatory or standards basis
  - severity
  - recommended fix
- Make each issue actionable: identify the problem, state why it matters under the governing authority, and specify the practical correction needed.
- When the package’s documents cross-reference one another, note the interaction so the reader can see whether one omission undermines multiple sections.
- End with a Recommended Actions block that assigns each next step to a role and gives a timing anchor tied to the submission or study milestone.
- Use clear legal and regulatory citations for every proposition relied on; name the controlling rule, guidance, part, or framework rather than stating conclusions without authority.
- Keep the memorandum focused on issues, not a restatement of the whole package.
