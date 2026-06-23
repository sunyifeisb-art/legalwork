---
name: extract-document-requests-from-regulatory-inquiry-letter
task_id: data-privacy-cybersecurity/extract-document-requests-from-regulatory-inquiry-letter
description: Regulatory response tracker construction benefits from reconciling requests across multiple regulatory inquiries into a unified tracker that accounts for overlapping requests, privilege implications, and preservation scope for each request.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Categorize Document Requests into a Unified Regulatory Response Tracker

## 1. Subject-matter triage

This task is a multi-instrument extraction and reconciliation exercise. Treat each inquiry as a distinct request set, then merge them into one operational tracker that shows where the same material answers more than one request.

Start by identifying:
- each request-bearing instrument and its legal context;
- each numbered demand, interrogatory, or information request;
- any preservation or hold notice that defines the available universe of documents;
- any internal materials that indicate privilege, confidentiality, or collection status.

If multiple instruments are in scope, enumerate them first and build the tracker once per instrument before merging overlaps. Do not compress separate request sets into a single undifferentiated list.

## 2. Failure modes the skill is correcting

- Extracting requests separately and leaving the response team with parallel, non-reconciled lists instead of one unified tracker.
- Treating the preservation notice as background only, rather than using it to define what is already preserved, what may require collection, and what remains outside scope.
- Missing privilege-sensitive categories such as counsel communications, internal legal analysis, or work product, which need review before any production decision.
- Producing a flat request dump with no functional grouping, making it hard to assign custodians, owners, deadlines, and collection paths.
- Failing to show where one document category answers multiple requests, which leads to duplicate work and inconsistent responses across regulators.
- Omitting the practical response posture: what is already covered, what is still outstanding, and what needs legal review before release.

## 3. Legal frameworks / domain conventions that apply

- Regulatory inquiry response mechanics: identify the response obligation, any objection or production protocol, and the applicable due date or timing anchor stated in the instrument.
- Parallel-regulator coordination: keep factual descriptions and document labels consistent across instruments to avoid conflicting narratives or mismatched productions.
- Preservation and hold practice: use the hold notice to map document categories to custodians, systems, and date ranges that are already under preservation.
- Privilege and confidentiality review: flag categories likely to contain attorney-client communications, attorney work product, or other protected material, and route them for legal review before production.
- Response tracker convention: the operational tracker should capture request source, request reference, request text summary, document category, custodian/source, deadline, preservation status, privilege flag, owner, and current status.
- If the source materials identify a governing statutory or regulatory basis, preserve that citation in the tracker so the response team can align scope and timing to the controlling authority named in the record.

## 4. Analytical scaffolds

- Read each inquiry in full and extract every discrete request unit.
- For each request unit, identify:
  - the exact request reference;
  - the request type;
  - the document category or information category sought;
  - the relevant custodian, repository, or business function;
  - the stated deadline or response timing;
  - any scope qualifiers, carve-outs, or limitations.
- Review the preservation notice and internal supporting documents to determine whether the category is already preserved, partially preserved, or needs additional collection.
- Mark likely privilege-bearing categories separately from ordinary business records.
- When two or more requests seek materially the same category, create one consolidated tracker row and cross-reference all applicable request references.
- When requests overlap only in part, keep the shared portion together but note the distinct residual scope for each source.
- Group the tracker by functional area or document family so the response team can assign work without duplicating collection efforts.
- Include a short summary at the top that states the request universe, overlap areas, preservation coverage, privilege exposure, and the primary response timeline.

## 5. Vertical / structural / temporal relationships

Use the document hierarchy to preserve traceability:
- instrument level: which inquiry or notice the request came from;
- request level: the specific numbered demand or question;
- document family level: the category being collected or reviewed;
- source level: custodian, system, or business unit;
- status level: preserved, collecting, under legal review, production-ready, or produced.

Use the time structure to avoid confusion:
- keep each stated deadline attached to its originating request;
- if deadlines differ across instruments, do not normalize them away;
- where the hold notice predates or overlaps the inquiry, note that relationship in the tracker so the team understands what should already be preserved;
- if internal documents show later updates, note whether they expand, confirm, or complicate the original request scope.

## 6. Output structure conventions

Produce a unified response tracker in a clean tabular format. Use conventional operational fields such as:
- Request Source
- Request Reference
- Request Summary
- Document / Information Category
- Custodians / Sources
- Deadline / Timing
- Preservation Coverage
- Privilege / Confidentiality Flag
- Owner
- Status
- Notes / Cross-References

Include a brief header summary above the table covering:
- regulatory context;
- the major request families;
- overlap areas;
- preservation coverage;
- privilege-sensitive categories;
- immediate next steps.

Keep the tracker usable by a response team: concise entries, consistent labels, and explicit cross-references wherever a single category satisfies multiple requests.

If the task requires a file output, the deliverable should be the tracker document named in the instructions, with the tracker content as the operative substance of the file.
