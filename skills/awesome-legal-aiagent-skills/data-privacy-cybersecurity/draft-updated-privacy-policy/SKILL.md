---
name: draft-updated-privacy-policy
task_id: data-privacy-cybersecurity/draft-updated-privacy-policy
description: Privacy policy updates for AI-powered health tools fail when the agent does not ground new disclosures in the product description and the privacy impact assessment, and does not separately memo the legal risks arising from the new product's data uses.
activates_for: [planner, solver, checker]
---

# Skill: Draft Updated Privacy Policy for AI-Powered Mental Health Screening Tool Launch

## 1. Subject-matter triage

- Treat the privacy policy as the primary consumer-facing deliverable and the issues memorandum as a separate advisory deliverable.
- Read the existing policy, product requirements, privacy impact assessment, vendor/data-processing terms, regulatory guidance, and any legal or business email thread before drafting.
- Map the new product’s actual data flows first: what is collected, why it is collected, where it is sent, what the AI does, what it outputs, and who can see or use the outputs.
- If the source set contains multiple jurisdictions, user populations, data types, or processing purposes, enumerate them before drafting and disclose each one distinctly; do not collapse them into a generic “we may collect/use/share” statement.
- Where the source documents leave a gap, flag it in the memo rather than inventing a disclosure that may overstate or misstate the product.

## 2. Failure modes the skill is correcting

- The policy is revised from the old template alone, without anchoring new disclosures to the product description and privacy impact assessment, so the disclosure does not match the actual product.
- AI-specific processing is described vaguely, leaving out the model’s purpose, input categories, output type, accuracy limits, human oversight, or challenge/override path where relevant.
- The third-party provider relationship is mischaracterized because the vendor agreement was not used to understand what data is shared and for what role.
- Sensitive mental health data is treated like ordinary data, causing the draft to understate heightened protections, consent expectations, or regional notice requirements.
- The policy and the memorandum are blended together, so the consumer document becomes too legalistic and the memo fails to isolate legal risk and recommendations.
- The draft omits the practical user-facing consequences of the new processing, such as how disclosures, rights requests, opt-outs, or review mechanisms change.
- The memo identifies problems but does not end with concrete actions tied to the right owner and timing.
- Legal propositions are stated as conclusions without naming the authority or regulatory rule that supports them.

## 3. Legal frameworks / domain conventions that apply

- General privacy notice principles: disclose categories of data collected, purposes of processing, categories of recipients, retention, and user rights in a manner that is accurate, specific, and not misleading.
- Sensitive data rules: mental health and related screening data may be treated as sensitive personal information or special-category data under applicable law; the policy should reflect heightened handling, consent, and limitation principles where applicable.
- AI and automated processing rules: if the tool makes or materially informs automated decisions, disclose the existence of automated processing, the logic or meaningful information about it, the significance of the processing, and the user’s ability to obtain human review or challenge an outcome where required.
- Vendor/processor rules: describe the third-party provider relationship in functional terms consistent with the governing data-processing terms and the applicable controller/processor framework.
- Cross-notice coordination: if the product also implicates a separate health notice, consent form, or service terms, the policy should coordinate with those documents rather than duplicating or contradicting them.
- Jurisdiction-specific AI-in-health guidance: any regulatory memo or internal guidance on healthcare AI should be reflected in both the policy’s disclosures and the memo’s risk analysis.
- Best-practice AI disclosures: explain what the tool does, what inputs it uses, whether it is for screening rather than diagnosis, the limits of accuracy, the role of human oversight, and whether model improvement or retraining uses personal data.
- Privileged issue spotting: the memorandum should identify legal risk, map it to the governing authority, and recommend mitigations; it should not read like a customer-facing policy.

## 4. Analytical scaffolds

- Start with a data-flow inventory: collect, infer, generate, share, retain, review, and delete.
- For each data practice introduced by the new product, ask five questions: what data, for what purpose, on what legal basis or disclosure theory, with whom shared, and what user control exists.
- Separate pre-existing processing from new processing so the updated policy only changes what the launch actually changes.
- For AI features, separately analyze: model purpose, inputs, outputs, human oversight, limitations, training or improvement use, and whether the output can affect access to services or support.
- For the memo, convert each material gap into an issue statement, explain the legal exposure, identify any source-document conflict or missing assumption, and recommend a mitigation or decision.
- When source materials support multiple interpretations, present the narrower defensible disclosure in the policy and flag the broader unresolved point in the memo.
- Preserve plain-language readability in the policy; use the memo for legal nuance, uncertainty, and fallback positions.

## 5. Vertical / structural / temporal relationships

- Draft the updated policy so the most important launch changes appear near the top in a short “What’s New” or “Summary of Changes” section, followed by the operative notice text.
- Preserve the existing policy architecture where accurate, but revise any section touched by the new product so the old and new disclosures remain internally consistent.
- Track data handling across the product lifecycle: collection at onboarding or screening, internal use during assessment, sharing with the vendor, storage and retention, downstream use for improvement, and deletion or de-identification.
- If the product uses outputs to influence future interactions, explain that vertical relationship in the policy and analyze whether it creates a heightened automated-decision-making or consumer-protection risk in the memo.
- Where different documents speak to different stages or audiences, prefer the most specific source for the relevant stage and note any inconsistency for escalation.
- If the launch timing, go-live date, or consent flow is material, align the effective date, notice timing, and recommendation timing to that milestone.

## 6. Output structure conventions

- Produce two separate Word-ready deliverables: a consumer-facing updated privacy policy and a privileged issues memorandum.
- The policy should use clear headings, short paragraphs, and direct disclosures; avoid litigation-style discussion.
- The policy should include an effective date and a concise summary of material changes at or near the front.
- The memorandum should open with a brief issue summary, then address each risk with a severity label from a stated ordinal scale used consistently throughout.
- For each memorandum issue, state the governing authority by name and section or part where available, explain the risk, note any document conflict or factual gap, and end with a concrete recommendation.
- Every recommendation in the memorandum should use an imperative verb, identify the responsible role, and include a timing anchor tied to launch, review, filing, or another relevant milestone.
- Use industry-conventional sectioning rather than copying any internal checklist or rubric layout.
- Ensure the file names match the instructions exactly: `updated-privacy-policy.docx` and `issues-memorandum.docx`.
- Before finishing, confirm that the policy file exists and contains operative notice text, and that the memorandum file exists and contains actual analysis and recommendations, not placeholders or summaries.
