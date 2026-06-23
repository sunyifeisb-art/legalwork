---
name: identify-issues-in-counterpartys-proposed-apa
task_id: bankruptcy-restructuring/identify-issues-in-counterpartys-proposed-asset-purchase-agreement
description: Ensures an APA issue memo identifies buyer-favorable deviations from § 363 sale market standards, including sale-order approval conditions, marketing restrictions, outside-date feasibility, environmental successor-liability allocation, knowledge-qualified representations, governing-forum provisions, and purchase-price allocation issues, and supports each with a proceeds waterfall showing creditor recovery.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Counterparty's Proposed Asset Purchase Agreement

## 1. Subject-matter triage

- This skill applies to a proposed asset purchase agreement and supporting sale materials in a bankruptcy § 363 context.
- Treat the secured creditor’s recovery and the estate’s sale-process risk as the primary lenses.
- If the materials contain multiple proposed closing scenarios, approval paths, or liability allocations, analyze each distinct variant separately rather than blending them.

## 2. Failure modes the skill is correcting

- The memo flags contract issues but never ties them to the creditor’s actual recovery path through a proceeds waterfall.
- The analysis identifies risk but omits the operative statutory or doctrinal authority supporting the concern.
- The analysis notes a clause is buyer-favorable without explaining how it interacts with the sale order, bidding procedures, disclosure package, or other transaction documents.
- The memo treats a single issue as representative when the documents contain multiple dates, parties, liabilities, or allocation mechanics that require separate treatment.
- The memo describes a problem but does not quantify its scale using the figures, thresholds, dates, or obligations stated in the source materials.
- The memo omits a severity hierarchy, making it hard to distinguish closing blockers from lesser deviations.
- The memo gives diagnoses without concrete next steps, timing, or responsible party.

## 3. Legal frameworks / domain conventions that apply

- Sale-order approval condition: In a § 363 sale, test whether closing is conditioned on entry of the sale order, finality, or other appellate risk controls; analyze the practical leverage any additional condition creates under 11 U.S.C. § 363 and the applicable sale procedures.
- Debtor marketing obligation: Compare any exclusivity, no-shop, or solicitation restriction against the estate’s duty to maximize value in a court-supervised sale process under 11 U.S.C. §§ 363 and 1129 principles as relevant to the posture of the transaction.
- Bid protection and matching mechanics: Review breakup fees, expense reimbursement, matching rights, and similar protections for consistency with the approved bidding procedures and the bankruptcy court’s authority over the sale process.
- Governing law and venue: Check whether the dispute forum and governing-law provisions preserve bankruptcy-court control over core sale issues and do not improperly divert estate controversies.
- Asset sale tax treatment: Evaluate whether transaction structure and purchase-price allocation may create estate-level tax consequences that reduce net proceeds distributable to the secured creditor.
- Outside date feasibility: Test the outside date against the full approval and closing timeline, including notice, objection, hearing, cure, assumption, and any post-order implementation period.
- Environmental successor-liability allocation: Assess whether free-and-clear language and indemnity mechanics adequately address environmental exposure and whether residual risk remains under the Bankruptcy Code and applicable nonbankruptcy law.
- Knowledge-qualified representations: Identify representations limited by knowledge qualifiers and assess the risk that narrowed warranties leave the estate with little practical recourse.
- Controlling authority: Cite the relevant Bankruptcy Code provisions, Federal Rules, sale-order authorities, and any other controlling statute, regulation, or case law when stating a legal proposition.

## 4. Analytical scaffolds

- Walk the APA and supporting documents clause by clause from the secured creditor’s perspective.
- Separate issues by document and by operative risk: sale process, closing conditions, covenants, representations, assumed/excluded liabilities, indemnities, tax, venue, and post-closing claims.
- For each issue, do all of the following before moving on:
  - state the clause or concept at issue;
  - identify the governing authority or market-standard rule supporting the concern;
  - quantify the issue using a document-based figure, deadline, exposure amount, term, or other threshold;
  - cross-reference the interacting clause, schedule, order term, or ancillary document;
  - explain the downstream effect on recovery, process timing, leverage, or liability.
- If the source set supplies enough information, convert the issue into a proceeds waterfall:
  - starting sale consideration;
  - less assumed liabilities;
  - less cure amounts;
  - less fees, taxes, and administrative expenses;
  - less any transaction-specific deductions;
  - equals net proceeds available to the secured creditor or other relevant constituency.
- If the documents do not permit a precise arithmetic result, state that the waterfall is incomplete and identify the missing inputs.
- Compare the proposed language against § 363 market norms and flag buyer-favorable deviations that would be unusual in a court-approved sale.
- Treat knowledge qualifiers, conditional approvals, and carveouts as risk multipliers when they narrow the estate’s contractual leverage.
- Assign a severity level to every issue and use the same scale consistently throughout the memo.

## 5. Vertical / structural / temporal relationships

- Track how the APA, sale order, disclosure package, bid procedures, schedules, and any side letters interact; a term that is benign in isolation may become material when read with an assumed-liabilities schedule or a separate approval condition.
- Map the timeline from signing to objection deadline, hearing, order entry, appeal finality if required, and outside date.
- If a clause shortens the marketing window, compresses diligence, or delays closing, explain the vertical effect on the estate’s ability to maximize value.
- Where the documents allocate liabilities across pre-closing and post-closing periods, distinguish historic exposure from successor exposure and identify who bears each bucket.
- If multiple asset groups, facilities, or liability classes are involved, analyze them separately before drawing a transaction-level conclusion.

## 6. Output structure conventions

- Produce an issue memorandum in a conventional legal memo shape, not a checklist.
- State the severity scale once at the outset and apply it uniformly, for example: Critical, High, Medium, Low.
- For each issue, use a consistent substructure:
  - Issue title
  - Severity
  - Description
  - Authority / market standard
  - Document interaction
  - Scale or quantitative impact
  - Risk / downstream consequence
  - Recommendation
- Include a proceeds waterfall section if the documents permit one; if not, state the missing inputs needed to complete it.
- End with a Recommended Actions block that gives concrete next steps, the responsible role, and timing tied to the sale process milestone or other document deadline.
- Keep recommendations action-oriented and specific; diagnoses alone are incomplete.
- Do not invent facts, dates, or amounts not contained in the materials.
- Surface verbatim quotes from internal documents only when necessary to anchor a critical issue, and keep quoted material minimal.
