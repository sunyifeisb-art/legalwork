---
name: draft-permit-application-narrative-scenario-02
task_id: environmental-esg/draft-permit-application-narrative/scenario-02
description: Guides drafting of an air quality permit application narrative by ensuring each required topic is addressed with internally consistent emissions and modeling data, and by documenting discrepancies and data gaps in a companion issues memorandum.
activates_for: [planner, solver, checker]
---

# Skill: Draft Brownfield Redevelopment Air Quality Permit Application Narrative (PA DEP Plan Approval)

## 1. Subject-matter triage

- Treat the application narrative and the issues memorandum as separate deliverables; draft the narrative first, then prepare the memo once the narrative content can be checked against the source set.
- Read the agency-facing prompt materials first, especially any pre-application correspondence, then the engineering, emissions, modeling, and site-constraint documents.
- Identify whether the source set contains one project configuration or multiple variants; if multiple versions, enumerate them before analysis and reconcile each against the narrative scope.
- For brownfield projects, confirm whether remediation constraints, deed restrictions, or activity-use limitations affect the proposed operations before drafting any affirmative statement of site suitability.

## 2. Failure modes the skill is correcting

- Drafts a generic air permit narrative without answering the specific topics expected for a plan approval submission.
- Fails to reconcile emission calculations, dispersion modeling, equipment specifications, and engineering descriptions before writing the narrative.
- Omits auxiliary sources or support equipment from the permit scope because they are easy to overlook in redevelopment projects.
- Treats the issues memorandum as optional or as a summary instead of a separate advisory deliverable.
- Flags discrepancies without identifying their practical significance, the source conflict, or the corrective path.
- States regulatory conclusions without tying them to the controlling air permitting framework or the source documents that support them.
- Repeats a source document’s numbers or assumptions without checking whether they are internally consistent across the full record.

## 3. Legal frameworks / domain conventions that apply

- Pennsylvania air permitting practice for plan approvals governs the narrative structure, source coverage, and technical showing expected for new or modified emissions sources.
- Applicable federal and state air standards govern the treatment of combustion units, emergency generators, coating operations, and control devices.
- Brownfield redevelopment constraints may limit operations by area, use, or activity; the narrative should describe those limits only to the extent supported by the source set.
- Dispersion modeling conventions require consistent inputs for emissions, meteorology, receptors, downwash, and configuration assumptions.
- Emissions inventories generally rely on throughput, operating hours, emission factors, and control efficiencies that must match the engineering description and modeling inputs.
- Control technology discussion should reflect the described equipment and its stated performance basis rather than generalized best practices.
- Where the source documents identify a standard, permit condition, or regulatory citation, use that authority as the basis for the narrative and for any issue flag.

## 4. Analytical scaffolds

- Build a source map before drafting: project description, equipment list, emissions calculations, modeling file or summary, site plan, remediation constraints, and any agency meeting notes.
- For each required topic, compare the narrative draft against the underlying documents and flag any mismatch in scope, terminology, assumptions, or units.
- Reconcile the emissions story end-to-end: equipment inventory, operating assumptions, control assumptions, calculated emissions, and modeled emission rates.
- Check whether every source with air-emission relevance appears in both the narrative and the emissions inventory; if a source appears in one but not the other, treat that as a discrepancy.
- For modeling, verify that the modeled case tracks the same equipment configuration, emission assumptions, and site layout described elsewhere in the source set.
- For brownfield constraints, confirm that the proposed use description does not overstate permissions beyond what the remediation documents support.
- For each issue identified, capture: what conflicts, where it appears, why it matters, and what document or confirmation would resolve it.
- If the source set does not support a point needed for the narrative, mark it as a data gap rather than inferring the missing fact.

## 5. Vertical / structural / temporal relationships

- Keep the narrative aligned with the chronology in the source set: existing conditions, proposed redevelopment, permitting status, and any remediation milestones.
- If an agency pre-application memo exists, mirror its topic order only to the extent needed to show each topic is addressed; do not omit a topic just because it is discussed elsewhere.
- When multiple source documents describe the same equipment or control device, treat the most specific technical description as controlling unless another source expressly supersedes it.
- If a discrepancy affects both the narrative and the permit-supporting calculations, note the cross-document impact in the issues memorandum rather than in only one place.
- Distinguish between a true conflict, an unresolved gap, and a drafting choice; do not label all three the same way.

## 6. Output structure conventions

- Produce `plan-approval-narrative.docx` as the primary deliverable and ensure it contains operative narrative text, not placeholders or a table of contents only.
- Produce `issues-memorandum.docx` as a separate advisory deliverable after the narrative exists.
- In the narrative, use conventional section headings for a permit submission: project overview, source and equipment description, emissions basis, control measures, modeling or compliance demonstration, and site-constraint discussion as applicable.
- Draft the narrative in a permit-ready tone: factual, complete, and internally consistent, with clear references to the source documents used.
- In the issues memorandum, define a simple ordinal severity scale once at the top and apply it consistently to each entry.
- For each issue entry, state the source conflict or gap, identify the interacting document or assumption, and explain the practical consequence for permit preparation or review.
- End the issues memorandum with a short Recommended Actions section stating the next step, the responsible role, and the timing anchor drawn from the source set or the permitting milestone.
- Where the source documents identify a controlling statute, regulation, permit condition, or agency requirement, cite it by name and section in the relevant narrative or memo discussion.
- Before finalizing, confirm that both filenames match the task instructions exactly and that the narrative and memo are internally consistent with each other.
