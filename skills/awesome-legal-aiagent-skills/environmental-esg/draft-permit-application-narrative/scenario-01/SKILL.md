---
name: draft-permit-application-narrative-scenario-01
task_id: environmental-esg/draft-permit-application-narrative/scenario-01
description: Guides drafting of an air permit application narrative by ensuring the required topics are addressed with internally consistent emissions and modeling data, and by documenting discrepancies and data gaps in a companion issues memorandum.
activates_for: [planner, solver, checker]
---

# Skill: Draft Brownfield Redevelopment Air Quality Permit Application Narrative

## 2. Failure modes the skill is correcting

- Drafting a generic plan-approval narrative that omits permit-specific topics raised in the source materials and pre-application materials
- Failing to reconcile emission calculations, equipment lists, engineering descriptions, and modeling inputs before drafting
- Treating the narrative as the only deliverable and omitting the companion memorandum that records discrepancies, omissions, and unresolved data gaps
- Missing the emergency generator or other auxiliary combustion source from the application scope
- Overstating compliance where brownfield status, remediation restrictions, or use limitations constrain the proposed operation
- Writing conclusions without tying them to the governing air-permitting framework or the source document that supports them
- Listing issues as observations only, without severity, downstream impact, or a concrete next step

## 3. Legal frameworks / domain conventions that apply

- Pennsylvania air permitting framework for plan approvals, including the requirement to describe the project, affected emission units, controls, emissions, and basis for approval
- Applicable state and federal air emissions requirements for stationary sources, including criteria pollutants, VOC, HAPs, and combustion-related emissions as relevant to the project
- Brownfield redevelopment constraints, including deed restrictions, activity-use limitations, remediation status, and any site-use conditions that bear on the proposed operations
- Dispersion modeling conventions, including consistency between modeled emission rates, source parameters, meteorology, receptors, and building downwash assumptions
- Control technology conventions for coating, solvent, and process VOC sources, including capture and control efficiency assumptions and their support in the source record
- Emergency generator permitting conventions, including whether the unit is included in the project description, emissions inventory, and control assumptions
- Emissions inventory conventions, including throughput assumptions, operating schedules, emission factors, and annualization logic for each source
- Pre-application or agency correspondence conventions, where stated agency concerns should be carried through into the narrative if they remain relevant
- Governing authority should be stated by name and section or part whenever a legal or regulatory proposition is asserted

## 4. Analytical scaffolds

- Start by enumerating the narrative topics and source documents in scope; if only one topic or one source set exists, state that affirmatively rather than implying breadth
- Read the agency correspondence, project description, engineering materials, calculations, and modeling inputs as a single record; identify every place where they must match
- For each source category, compare the stated equipment, capacity, operating mode, and control method across all documents
- For each emissions-bearing unit, verify that the calculation basis, unit inventory, and modeled assumptions describe the same physical source and the same operating profile
- For each modeled pollutant or release point, verify consistency in source parameters, emission rates, stack characteristics, receptor setup, and any downwash inputs
- For each control device or pollution-prevention measure, confirm that the narrative does not exceed what the specification sheets or calculation basis support
- For the brownfield record, identify any restrictions that affect where the source may operate or what activities are permissible on site, and ensure the narrative does not contradict them
- For the emergency generator, confirm whether it appears in the source inventory, whether its emissions are calculated, and whether it is discussed in the narrative
- When a discrepancy is found, record the affected source documents, the significance of the mismatch, and what must be resolved before submission
- Draft the narrative only after the source set has been reconciled; where a gap remains, state the gap neutrally rather than inventing missing facts
- In the issues memorandum, treat each item as a discrete issue with a defined severity level, a source citation, an explanation of the impact, and a recommended fix
- Frame recommendations as concrete next steps assigned to the responsible project role or document owner, with timing anchored to the filing process or the next information request

## 5. Vertical / structural / temporal relationships

- Application narrative should track the project from site condition and existing constraints through proposed construction, operations, emissions, and control measures
- If the source materials describe phased development, temporary operations, startup, or future equipment, separate those from the base-case project description
- If the project includes both process equipment and auxiliary units, address them as distinct source groups so that omissions are visible
- If a requirement appears in one document but is absent from another, treat the later, narrower document as incomplete unless the record clearly explains the omission
- If a brownfield limitation affects a portion of the property, the narrative should distinguish site-wide statements from area-specific statements
- If agency comments or pre-application notes conflict with project materials, identify whether the conflict is factual, interpretive, or simply unresolved

## 6. Output structure conventions

- Draft the permit narrative as an operative application narrative, not as a summary of drafting choices or an outline of topics
- Organize the narrative in a conventional permitting sequence: project description, site/location context, emission units, control measures, emissions basis, modeling or compliance demonstration, and any special site constraints
- Use clear cross-references to the source documents or tabs relied on for each statement; do not present unsupported conclusions as settled facts
- Where a fact is uncertain or missing, mark it as a data gap or qualifier rather than smoothing it over
- Prepare the issues memorandum as a separate advisory document with a defined severity scale, a short rationale for each issue, the source documents implicated, the consequence of the mismatch, and a concrete recommended action
- Include a recommendation section in the memorandum that assigns each follow-up item to the appropriate project role and ties it to filing or resubmission timing
- Ensure the named output files are the operative products: `plan-approval-narrative.docx` for the narrative and `issues-memorandum.docx` for the discrepancy memo
