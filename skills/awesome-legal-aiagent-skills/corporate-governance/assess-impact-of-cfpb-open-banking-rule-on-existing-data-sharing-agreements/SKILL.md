---
name: cfpb-open-banking-rule-impact
task_id: corporate-governance/assess-impact-of-cfpb-open-banking-rule-on-existing-data-sharing-agreements
description: Regulatory impact memorandum assessing each existing data sharing agreement against the applicable consumer financial data access and sharing rule, identifying disclosure, authorization, data-use, revocation, deletion, interface, and implementation-gaps across the agreement portfolio.
activates_for: [planner, solver, checker]
---

# Skill: CFPB Section 1033 Open Banking Rule Impact on Data Sharing Agreements

## 1. Subject-matter triage

- Treat the assignment as a portfolio review of agreements plus surrounding governance materials, not a single-contract summary.
- Start by sorting the source set into: data sharing agreements, assignment or strategy memo, meeting minutes, and compliance checklist.
- Identify whether each agreement is individually negotiated, renewed automatically, or tied to a broader program so the memorandum can distinguish contract-level fixes from program-level fixes.
- If the source set contains multiple agreements, analyze each agreement separately before drafting any portfolio-level synthesis.

## 2. Failure modes the skill is correcting

- Treating the portfolio as broadly compliant or noncompliant without checking each agreement against the governing checklist item by item.
- Missing downstream data-use restrictions by focusing only on initial authorization language and ignoring later internal analytics, onward sharing, marketing, or vendor use.
- Overlooking revocation, deletion, and cessation mechanics after consumer withdrawal of consent.
- Missing periodic reauthorization requirements or allowing indefinite access language to pass unflagged.
- Ignoring disclosure timing defects where authorization terms are buried in general terms rather than presented at or before consent.
- Failing to connect compliance gaps to renewal, amendment, or renegotiation timing that creates practical leverage for remediation.
- Underweighting implementation issues such as developer-interface buildout, engineering planning, budget cycles, and standards alignment.
- Drawing conclusions without tying each legal proposition to the controlling rule or authority that supports it.

## 3. Legal frameworks / domain conventions that apply

- Consumer financial data access and sharing rule under Section 1033: use the governing rule to assess access, authorization, disclosure, data-use, revocation, deletion, interface, and implementation requirements.
- Authorization disclosure: verify that the consumer-facing disclosure identifies the data categories, the receiving parties, and the purpose of use with enough specificity to make the consent meaningful.
- Disclosure timing: confirm the disclosure is delivered at or before authorization, not merely incorporated into general account terms or layered into unrelated notices.
- Periodic reauthorization: flag arrangements that permit ongoing or open-ended access without a recurring consumer refresh mechanism when the rule requires one.
- Data-use limitation: test whether internal use, analytics, onward transfers, or other secondary uses exceed the disclosed scope.
- Revocation and deletion: assess whether consumers can revoke authorization and whether the agreement requires prompt cessation, deletion, or equivalent downstream termination steps.
- Developer interface obligations: for covered institutions above the applicable threshold, assess whether a standardized interface must be maintained and whether the implementation timeline is being addressed.
- Standards coordination: where useful, consider engagement with recognized standards bodies or interface frameworks as an implementation aid.
- Contract lifecycle convention: renewal dates, amendment windows, and termination rights are practical leverage points for achieving compliance updates without waiting for a dispute.

## 4. Analytical scaffolds

- Build a document inventory first, then map each issue back to the specific agreement, exhibit, checklist item, or meeting-note reference that surfaces it.
- Use a per-agreement review template and apply the same checklist to each item in the portfolio.
- For each agreement, determine:
  - whether the authorization disclosure is specific enough;
  - whether the receiving parties are identified clearly;
  - whether the use purpose is limited to what was disclosed;
  - whether reauthorization is required and built in;
  - whether revocation and deletion rights are operationalized;
  - whether secondary sharing or internal use broadens the permission;
  - whether implementation timing affects compliance;
  - whether renewal or amendment timing creates a practical fix window.
- If one issue implicates more than one source document, explain how the documents interact rather than analyzing them in isolation.
- Where the agreement set contains only one relevant agreement, say so explicitly before proceeding; otherwise enumerate each agreement and analyze each in turn.
- For every issue, state the applicable rule or authority by name and section or part, then identify the deficient term or omission, then state the consequence for compliance or operations.
- For every issue, include an ordinal severity label using one consistent scale across the memorandum; define the scale once at the outset and apply it uniformly.
- For every issue, close the analysis by tying the problem to the source-document facts, the related provision or document, and the practical consequence for the client.
- Distinguish immediate remediation from strategic implementation: some gaps require contract edits now, while others require engineering, policy, or governance work on a longer path.
- If the source materials provide a deadline, milestone, or renewal date, anchor the recommendation to that timing rather than using a generic prompt.

## 5. Vertical / structural / temporal relationships

- Disclosure defects often cascade into secondary-use problems: if the authorization is vague about recipients or purposes, later sharing or analytics may sit outside the disclosed scope.
- Revocation, deletion, and cessation obligations should be read together; a paper revocation right without an operational deletion workflow is incomplete.
- Interface compliance depends on internal sequencing: legal interpretation, product specification, engineering resourcing, testing, and launch timing must align.
- Renewal or amendment windows can be more effective than unilateral demands where the counterparty controls the next contract cycle.
- Portfolio-wide remediation should prioritize agreements with the broadest permissions, earliest rollover dates, or the largest implementation gap.
- If multiple documents describe the same arrangement, treat the minutes, memo, and checklist as interpretive context that may narrow or broaden the reading of the operative agreement.

## 6. Output structure conventions

- Open with a short executive summary that states the portfolio-level conclusion, the main risk themes, and the recommended remediation posture.
- Include a defined severity scale near the front of the memorandum and use it consistently for each issue.
- Present the body as a per-agreement issue analysis, with one issue entry per discrete compliance gap.
- For each issue entry, include:
  - the agreement or source document;
  - the severity label;
  - the governing rule or authority;
  - the deficient term or omission;
  - the interaction with any related document or clause;
  - the downstream consequence;
  - the recommended fix.
- Include a compact matrix or table that shows, for each agreement, whether the core compliance dimensions are satisfied, uncertain, or deficient.
- Separate immediate compliance actions from strategic implementation considerations.
- End with a Recommended Actions section that assigns each action to a responsible role and ties it to a concrete timing anchor from the source materials or, if none exists, to the next practical regulatory or transactional milestone.
- Keep the memorandum self-contained and written as a regulatory impact analysis, not as a contract summary or a generic policy memo.
