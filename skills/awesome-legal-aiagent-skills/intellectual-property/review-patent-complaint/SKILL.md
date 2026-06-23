---
name: review-patent-complaint-defense-issues
task_id: intellectual-property/review-patent-complaint
description: Reviewing a patent and related IP infringement complaint from the defense perspective to identify issues, assess severity, and develop responsive strategies.
activates_for: [planner, solver, checker]
---

# Skill: Review Patent and IP Complaint — Defense Perspective

## 2. Failure modes the skill is correcting

- Reading the pleading in isolation instead of testing each allegation against the cited exhibits, agreements, logs, and other supporting materials
- Treating broad labeling of “confidential” or “proprietary” information as enough without checking whether the pleading actually identifies protectable trade secrets with particularity
- Missing defenses that arise from the plaintiff’s own documents, including consent, ordinary-course access, waiver, estoppel, or a narrower contractual scope than the complaint implies
- Focusing only on merits and overlooking pleading, jurisdictional, venue, and remedy defenses
- Accepting forensic summaries at face value without probing methodology, chain of custody, alternative explanations, and the actual source data

## 3. Legal frameworks / domain conventions that apply

- Trade secret claims generally require a protectable trade secret, reasonable secrecy measures, and misappropriation by improper acquisition, disclosure, or use; each pleaded fact should be measured against those elements under the applicable statute, such as the Defend Trade Secrets Act, 18 U.S.C. § 1836, and any parallel state law
- Trade secret identification must be specific enough to give fair notice; vague references to categories of know-how, source code, workflows, or business processes may be attackable for lack of particularity under the governing pleading standard
- Patent infringement theories should be tested claim by claim, with attention to infringement allegations tied to each claim element, the accused product or feature, and any prosecution-history or claim-construction issues apparent from the complaint materials
- Software-access theories often turn on whether access was unauthorized, exceeded authorization, or occurred using valid credentials in the ordinary course; the governing statute and the pleaded facts should be reconciled carefully
- Contract-based claims depend on the actual scope of the cited confidentiality, employment, invention-assignment, or restrictive-covenant provisions, as enforced under the applicable state law and any statutory limits
- Requests for emergency or preliminary relief should be tested against the applicable injunction factors, including likelihood of success, irreparable harm, balance of equities, and public interest; the cited authorities should be named explicitly
- Venue, personal jurisdiction, standing, and pleading sufficiency are threshold defenses and should be assessed before or alongside merits defenses
- If the complaint relies on forensic artifacts, electronic logs, or device data, evaluate reliability, completeness, provenance, and whether the same data supports innocent explanations
- Where the source materials reference notice letters, cease-and-desist correspondence, preservation demands, or settlement communications, assess their effect on notice, mitigation, waiver, estoppel, and remedial posture
- Cite controlling authority for each legal proposition relied upon in the memo, including statutes, rules, and leading cases where applicable

## 4. Analytical scaffolds

1. Enumerate the asserted claims and the accused acts or products before analysis; if multiple defendants, counts, time periods, or documents are in play, analyze each one separately rather than by representative sample
2. For each count, map the pleaded facts to each required element, identify the missing or weak links, and note whether the deficiency is legal, factual, or evidentiary
3. For each alleged trade secret, test specificity, secrecy measures, and plausibility of misappropriation; identify any overbroad or conclusory descriptions
4. For patent counts, align the allegations with the asserted claim features and the accused functionality; note any claim-element gaps, construction issues, or unsupported doctrine-of-equivalents theories
5. For contract and duty-based claims, parse the actual language of the cited agreement and compare it to the alleged conduct, obligations, and timeline
6. For computer-access and data-extraction theories, test authorization, scope of access, account credentials, device ownership, and whether the complaint pleads improper means rather than mere access
7. Review forensic references for what the records actually prove, what they do not prove, and what alternative explanations remain consistent with the source materials
8. If emergency relief is sought, analyze the injunction standard separately and identify the weakest factor
9. Rate each issue on a uniform ordinal severity scale defined once at the outset, and use the same scale throughout
10. For each issue, include the factual scale or exposure implied by the source documents, the interaction with another cited document or claim, and the concrete downstream consequence for the client
11. Close each issue with a responsive strategy recommendation that pairs the defense theory with a practical next step

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track relationships among the complaint, exhibits, supporting declarations, attached agreements, and forensic materials; the defense analysis should show how one document narrows, contradicts, or reframes another
- Separate pre-termination, post-termination, and litigation-period conduct, because obligations and exposure may change across those periods
- Distinguish access, copying, retention, disclosure, and use, since different claims and remedies attach to different conduct
- If multiple devices, accounts, repositories, or product versions are referenced, analyze each category separately and note any gaps in attribution
- When the pleadings combine trade secret, patent, contract, and unfair-competition theories, explain how success or weakness on one theory affects leverage, remedies, and settlement posture on the others

## 6. Output structure conventions

- Begin with a short severity legend using a uniform ordinal scale such as Critical / High / Medium / Low, defined once
- Organize the memo by claim type and then by issue; do not merge distinct legal theories into a single entry
- For each issue, include: the claim or theory, the element or defense at issue, the supporting allegation or document, the defense argument, the severity rating, the controlling authority, and the recommended responsive strategy
- Use concise, practitioner-style issue statements that identify the defect and why it matters
- Include a separate section for threshold defenses such as jurisdiction, venue, standing, and pleading adequacy
- Include a separate section for injunctive or other extraordinary relief, if sought
- End with an explicit Recommended Actions section that uses imperative verbs, assigns the responsible role where inferable, and gives a timing anchor tied to the litigation posture or any stated deadline
