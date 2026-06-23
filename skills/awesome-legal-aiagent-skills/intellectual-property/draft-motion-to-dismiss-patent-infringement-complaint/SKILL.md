---
name: draft-motion-dismiss-patent-101-alice
task_id: intellectual-property/draft-motion-to-dismiss-patent-infringement-complaint
description: Rule 12(b)(6) motion to dismiss a patent infringement complaint on subject matter eligibility grounds under patent-law eligibility doctrine using the Alice/Mayo two-step framework.
activates_for: [planner, solver, checker]
---

# Skill: Draft Motion to Dismiss Patent Infringement Complaint — Alice/Mayo § 101

## 1. Subject-matter triage (only if applicable)

- Use this skill when the requested filing is a Rule 12(b)(6) motion attacking patent eligibility under 35 U.S.C. § 101.
- Triage the asserted claims by claim type and legal theory before drafting: method, system, media, apparatus, and any dependent claims that add only implementation detail.
- Identify whether the source set contains the complaint, the asserted patent, prosecution history, and technical materials; those materials are the core inputs for both eligibility and pleading-stage framing.
- If multiple independent claims are asserted, treat them separately unless the same abstract idea and same alleged inventive concept analysis cleanly applies across a claim family.

## 2. Failure modes the skill is correcting

- Stating Alice/Mayo at a slogan level without pinning down the precise abstract idea, natural law, or other ineligible concept the claims recite.
- Collapsing step one and step two into a single conclusory paragraph instead of walking the court through directionality first, then inventive concept.
- Ignoring how the patent’s own specification frames the invention, especially where the patentee characterizes the advance as a technical improvement or, conversely, describes only generic automation of a known process.
- Treating prosecution history as background only, rather than using amendments and arguments to test whether the applicant distinguished prior art on technical grounds or on ineligible abstraction.
- Failing to connect technical materials to the pleadings record; the motion should explain why the court may consider publicly filed patent materials, incorporated documents, and undisputed technical context at Rule 12(b)(6).
- Assuming one claim category controls all others; method and apparatus claims can rise or fall differently depending on claim language and ordered combination.
- Making a broad invalidity pitch without matching the challenged claim elements to the asserted advance and the cited authority.
- Presenting eligibility as an abstract patent-policy critique instead of a doctrinal motion grounded in controlling § 101 precedent and the district’s pleading-stage practice.

## 3. Legal frameworks / domain conventions that apply

- Apply 35 U.S.C. § 101 and the Alice Corp. v. CLS Bank Int’l / Mayo Collaborative Servs. v. Prometheus Labs. two-step framework.
- Step one asks whether the claims are directed to an abstract idea, law of nature, or natural phenomenon; the opinion should identify the specific ineligible concept with precision, not at a high level of generality.
- Step two asks whether the claim elements, individually and as an ordered combination, supply an inventive concept—i.e., something significantly more than routine, conventional, or generic computer implementation.
- Generic computer components, generic networking, storage, display, and data processing ordinarily do not supply the inventive concept where they merely automate the abstract idea.
- Improvements to computer functionality or to a technical process may support eligibility when the claim language and intrinsic record show a concrete technological solution rather than a result-oriented abstraction.
- Use the patent specification as intrinsic evidence of what the patentee says the invention is and is not; compare those statements to the claims to test whether the purported advance is technical or functional.
- Use prosecution history to identify admissions, narrowing amendments, or arguments that bear on whether the claims are directed to a technical improvement or instead to the prior art’s abstract implementation.
- At the pleading stage, rely on Federal Rule of Civil Procedure 12(b)(6), Rule 8, and the district’s precedent on when § 101 can be resolved without claim construction, especially where the asserted materials are intrinsic or judicially noticeable.
- Cite controlling authority for each proposition rather than relying on broad policy language; every eligibility statement should be tethered to a case, statute, or rule.

## 4. Analytical scaffolds

- Start with the motion standard: Rule 12(b)(6), the court’s ability to resolve § 101 on the pleadings when appropriate, and the scope of materials the court may consider.
- Frame the asserted claims by family and function: what each independent claim says, what it achieves, and what the specification says the advance is.
- For step one, identify the claimed focus in concrete terms and compare it to controlling precedent addressing similar claim structures.
- For step two, isolate each alleged extra element and ask whether it is merely generic implementation, conventional ordering, or a real technological improvement tied to a specific machine, data structure, or process.
- When the patent contains multiple independent claims, run the Alice/Mayo analysis claim family by claim family and note where one claim’s limitations do or do not rescue the others.
- If the complaint leans on technical-sounding language, separate label from substance: ask whether the claim actually recites how the improvement is achieved or only the result.
- Use the prosecution history to support either side of the argument: admissions that the invention is not technical help the motion; contrary statements must be distinguished or explained.
- Where helpful, organize the argument as: claim text, intrinsic record, step one authority, step two authority, and pleading-stage result.
- Close each legal proposition with a named authority; do not assume the court will supply the rule from context.
- Conclude with a clear requested disposition, typically dismissal with prejudice if amendment would be futile under the intrinsic record and governing precedent.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track claim dependencies vertically: if an independent claim is abstract, identify whether dependent claims add only conventional implementation or instead recast the invention in a materially different technical form.
- Track intrinsic record temporally: prosecution amendments, applicant arguments, and specification descriptions may evolve the framing of the invention, and those shifts matter to eligibility.
- Track pleadings context horizontally across source documents: complaint allegations, patent claims, specification, prosecution history, and technical materials should be read together, not in isolation.
- If the complaint asserts several claim categories, analyze whether the same alleged inventive concept is reused across categories or whether one category introduces a distinct technical feature.
- When the record contains competing descriptions of the invention, address the hierarchy of sources: claims first, then specification, then prosecution history, then extrinsic technical context as appropriate.

## 6. Output structure conventions

- Draft a polished motion to dismiss with an integrated memorandum of law, suitable for filing as `motion-to-dismiss.docx`.
- Use conventional sections: introduction, relevant background, legal standard, argument, conclusion, and requested relief.
- Within the argument, use separate subsections for step one and step two, and separate claim-family analysis where needed.
- Make the motion read as a legal filing, not a notes outline; the prose should be complete, citation-ready, and organized around the governing doctrine.
- Include a final requested-relief paragraph that states the specific dismissal sought and any prejudice requested, consistent with the record and applicable law.
- Preserve the filing’s practical posture: the document should affirmatively seek dismissal based on § 101 ineligibility under Rule 12(b)(6), not merely preserve the issue.
