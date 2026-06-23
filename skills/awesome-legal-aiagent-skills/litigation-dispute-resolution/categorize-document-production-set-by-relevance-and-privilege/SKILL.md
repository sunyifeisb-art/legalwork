---
name: categorize-document-production-set-by-relevance-and-privilege
task_id: litigation-dispute-resolution/categorize-document-production-set-by-relevance-and-privilege
description: Reviewing a production set for relevance and privilege requires making document-by-document classifications under attorney-client privilege, work product, and related confidentiality doctrines, while producing a privilege log that is sufficiently detailed to withstand challenge.
activates_for: [planner, solver, checker]
---

# Skill: Categorize Document Production Set by Relevance and Privilege — Privilege Log and Relevance Classification Report

## 1. Subject-matter triage

- Treat each document as its own classification unit unless the record shows a clear email chain, attachment set, or duplicate family that must be analyzed together.
- Separate pure legal communications from business, operational, or mixed-purpose materials at the outset; do not assume that confidentiality alone creates privilege.
- For chained communications, analyze each hop and each attachment independently, since later forwarding can change the protection analysis.
- If the source set contains multiple distinct document families, enumerate them first and then apply the same analysis to each family without collapsing them into one representative example.

## 2. Failure modes the skill is correcting

- Treating business-sensitive or confidential documents as privileged without testing the elements of the asserted protection
- Classifying dual-purpose communications without separately evaluating legal and non-legal purposes
- Drafting privilege log entries so vague that they do not let the receiving party assess the claim without exposing protected content
- Overlooking that some privilege or common-interest assertions depend on a documented sharing or coordination framework
- Mixing relevance and privilege analysis so that a document is withheld when it is merely non-relevant, or produced when it is protected
- Failing to distinguish full withholding from partial redaction when only a portion of a document is protected
- Stating conclusions without identifying the doctrine or rule that supports the classification

## 3. Legal frameworks / domain conventions that apply

- Attorney-client privilege requires a communication, made in confidence, between privileged participants, for the purpose of seeking or rendering legal advice; inclusion of non-lawyers is not disqualifying if they are necessary to the legal communication.
- Work product doctrine protects materials prepared because of anticipated litigation or comparable adversarial proceedings; factual work product and opinion work product receive different levels of protection.
- Dual-purpose communications require the governing primary-purpose or dominant-purpose analysis for the jurisdiction and document type at issue, with careful attention to whether legal advice or business advice predominates.
- Common-interest or joint-defense assertions require a real coordination arrangement or aligned legal interest covering the communication.
- Inadvertent disclosure analysis turns on the reasonableness of precautions, the speed of corrective action, and any applicable clawback mechanism.
- Non-waiver orders and clawback agreements may preserve protection even after production if the governing procedure recognizes them.
- Subject-matter waiver depends on whether a voluntary disclosure fairly opens the same subject to further inquiry.
- Crime-fraud analysis requires a sufficient factual basis under the governing standard before privilege can be denied on that ground, and any in camera procedure must follow the applicable rule.
- Relevance is tied to the claims, defenses, or issues identified by the pleadings and the discovery order, not to general curiosity or business importance.

## 4. Analytical scaffolds

- For each document, decide first whether it is relevant, then whether it is privileged, partially privileged, or neither; a document can be relevant and still protected.
- For privilege claims, identify the sender, recipient(s), date, intended confidentiality, and the legal purpose asserted, then test each element against the document itself and the surrounding context.
- For work product claims, focus on when the document was created and whether protected litigation was reasonably anticipated at that time; later use in litigation does not itself create protection.
- For dual-purpose documents, isolate the legal component from the business component and determine whether the legal purpose controls under the governing test.
- For communications involving business personnel, assess whether each participant was necessary to the legal advice or merely present for business convenience.
- For common-interest claims, confirm the existence and scope of the coordination framework before relying on it.
- For redaction candidates, identify the protected portion precisely and confirm that the remainder can be produced without revealing the privileged substance.
- For each withheld or redacted document, describe it with enough specificity to assess the claim while avoiding disclosure of the privileged matter itself.

## 5. Vertical / structural / temporal relationships

- Documents created before protected litigation was reasonably anticipated generally do not qualify for work product protection, even if they later become relevant.
- A later email in a chain does not inherit privilege automatically if a non-privileged participant is added or the subject shifts away from legal advice.
- Attachments should be evaluated on their own content and context; an attached business record may be unprivileged even if sent with a privileged cover email.
- A partial waiver or disclosure issue may affect later documents on the same topic, so cross-check the timeline for earlier voluntary disclosures and later follow-on communications.
- Where the source set shows repeated communications on the same matter, compare dates, participants, and purpose to determine whether a consistent privilege theory actually holds.

## 6. Output structure conventions

- Privilege log: one row per withheld document with Date | Author | Recipient(s) | Description | Privilege Type | Basis
- Use a description that is specific enough to test the claim but does not reveal the protected advice, analysis, or strategy.
- Relevance classification report: organize the production set document-by-document and assign each item a relevance classification with a brief rationale tied to the pleadings or discovery scope.
- Distinguish among at least: relevant and responsive; relevant but privileged; partially protected and suitable for redaction; and not relevant.
- If a document is withheld only in part, say so explicitly and identify the redaction basis at a high level.
- If no document supports a privilege assertion, say so rather than forcing a withheld entry.
- Produce the requested output files using the filenames specified in the task instructions, and ensure each file is populated with the operative log or report rather than a summary of it.
