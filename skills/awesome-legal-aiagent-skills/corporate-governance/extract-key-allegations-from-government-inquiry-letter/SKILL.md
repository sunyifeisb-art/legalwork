---
name: extract-key-allegations-from-government-inquiry-letter
task_id: corporate-governance/extract-key-allegations-from-government-inquiry-letter
description: Agents summarize allegations in a government inquiry letter at a high level, identify additional liability theories embedded in document-request sections, analyze disclosure-triggering events and their sequencing, and flag potential individual representation conflicts for named witnesses.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Allegations from a Government Inquiry Letter — Structured Allegation Extraction Report

## 1. Subject-matter triage
- Treat the inquiry letter as a multi-theory enforcement document, not a single-issue narrative.
- Separate explicit allegations from theories implied by requests for records, testimony, trading data, communications, and transaction materials.
- Identify every named person, entity, date range, transaction, disclosure event, and request category before analysis.
- If only one alleged event or one named individual exists, say so affirmatively and analyze that singleton explicitly rather than implying a broader pattern.

## 2. Failure modes the skill is correcting
- Summarizing the inquiry at a high level without extracting each named individual’s alleged conduct and the chronology the agency is building.
- Reading only the allegation paragraphs and missing distinct liability theories embedded in document requests.
- Describing the matter without isolating the disclosure-triggering event, the information conveyed, the recipient, and the sequencing relative to trading or market activity.
- Failing to map the alleged facts against the governing securities-law theory the request appears to invoke.
- Omitting representation-conflict analysis for witnesses whose exposure may diverge from the company’s interests.
- Presenting conclusions without anchoring them to the controlling statutory, regulatory, or ethics authority.

## 3. Legal frameworks / domain conventions that apply
- **Government inquiry-letter structure:** Analyze the background section, allegation language, document requests, testimony requests, and any appendices as separate interpretive sources. Each may support a different theory.
- **Securities fraud theory:** Map allegations to the operative elements typically implicated in SEC enforcement, including material misstatement or omission, connection with a purchase or sale, scienter, reliance, and loss causation under Exchange Act § 10(b) and Rule 10b-5.
- **Disclosure-based liability theory:** If the letter suggests selective disclosure or nonpublic-information disclosure issues, identify the disclosure event, the content disclosed, the audience, and any public corrective disclosure.
- **Trading / information-flow theory:** If the requests trace information from an insider or source to a trader, analyze source, recipient, timing, and use of the information as a separate theory from direct misstatement liability.
- **Offering-related liability:** If the requests target offering materials, registration materials, or investor communications, treat that as a separate liability lane and distinguish it from Exchange Act-style fraud.
- **Ethics and representation conflict:** Where named individuals may face personal exposure, assess potential divergence from the company’s interests under applicable professional conduct principles, including ABA Model Rule 1.7 and, where interviewing witnesses, the need to avoid misleading-no-counsel assumptions under Upjohn Co. v. United States.
- **Limitations / timing:** Identify the earliest alleged conduct date and test whether any portion appears to predate the applicable lookback period under the relevant enforcement statute or limitation rule.
- **Parallel proceedings:** Where a parallel agency or regulator is implicated, treat cross-use of disclosures and productions as a coordination risk, not a footnote.

## 4. Analytical scaffolds
- **Theory-by-theory extraction:** For each distinct theory suggested by the letter, identify the source section, the alleged conduct, the actors, the requested documents that support the theory, and the legal provision implicated.
- **Chronological event map:** Build a single timeline that sequences alleged conduct, disclosure events, trading activity, receipt of information, and any corrective public disclosure.
- **Per-individual review:** For each named person, extract the specific conduct, the documents or data sought about that person, the apparent exposure path, and the representation-conflict assessment.
- **Request-to-theory mining:** For each request category, state what factual question or legal theory it is designed to test, and whether it suggests an unstated theory beyond the express allegations.
- **Authority anchoring:** For each legal proposition stated in the report, cite the controlling authority by name and section or rule, rather than giving a bare conclusion.
- **Threshold-aware analysis:** When the source gives dates, time spans, volumes, or other measurable markers, use them to frame scope and sequencing; do not invent arithmetic or fill missing numbers.

## 5. Vertical / structural / temporal relationships
- Present conduct, disclosure, trading, and corrective disclosure in one chronological structure so counsel can see gaps, overlaps, and sequencing problems.
- If the materials suggest parallel regulatory or criminal exposure, flag the risk that disclosures to one authority may be reused elsewhere and recommend coordinated production strategy.
- If the letter spans multiple persons or periods, analyze each person or period separately before synthesizing any cross-cutting pattern.
- Distinguish between the date of a communication, the date information was received, the date of any trade or filing, and the date of any public disclosure; those dates may differ and drive the analysis.

## 6. Output structure conventions
- Produce a structured allegation-extraction report with separate sections for each legal theory actually implicated by the source materials.
- Include a chronology section that sequences the alleged conduct, disclosure events, trading activity, and any corrective public disclosures.
- Include a per-individual table covering name, alleged conduct, requested document categories, exposure assessment, and representation recommendation.
- Include a cross-reference index tying each extracted allegation or theory back to the specific letter section or attachment from which it came.
- End with a short recommended-actions section that uses imperative verbs, assigns the action to a role, and ties timing to the investigation or response milestone.
- Use conventional legal section headings; do not mirror any hidden rubric labels or promise a minimum issue count.
