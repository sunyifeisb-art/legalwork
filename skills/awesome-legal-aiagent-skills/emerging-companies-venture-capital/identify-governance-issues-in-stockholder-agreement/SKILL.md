---
name: ecvc-identify-governance-issues-stockholder-agreement
task_id: emerging-companies-venture-capital/identify-governance-issues-in-stockholder-agreement
description: A governance issues memo for a stockholder agreement must identify common drafting and consistency issues in voting thresholds, investor-status definitions, indebtedness covenants, drag-along mechanics, and transfer/co-sale provisions, and compare related terms across linked transaction documents for internal consistency.
activates_for: [planner, solver, checker]
---

# Skill: Identify Governance Issues in Stockholder Agreement

## 1. Subject-matter triage (only if applicable)

- Treat the stockholder agreement as one document in a linked set; read it against the term sheet, existing agreement, cap table, and any ancillary governance documents before flagging an issue.
- Build a party map first: identify founders, investors, holders with consent rights, and any classes or series whose approval rights or transfer rights differ.
- If only one investor or one special holder appears in scope, state that explicitly; otherwise enumerate each relevant holder or class before analyzing rights, thresholds, and consent blocks.
- Confirm whether the task is purely issue-spotting and comparison. If so, do not draft new deal terms except to propose targeted fixes for each issue.

## 2. Failure modes the skill is correcting

- Individual governance issues are identified in isolation; the cumulative control concentration effect of one investor holding blocking positions across multiple provisions is not analyzed.
- Thresholds are read without reconciling the denominator, the defined investor class, and the linked document set.
- The interaction between permitted transfer carve-outs and co-sale right evasion is not identified as a structural gap.
- Operational covenants are treated as generic boilerplate rather than tested against the company’s actual financing and working-capital needs.
- Drafting problems are described, but the memo stops short of a concrete consequence and a practical fix.
- Issues are ranked informally rather than on a consistent ordinal severity scale.
- The memo compares provisions within one agreement but misses inconsistent treatment across the related transaction documents.

## 3. Legal frameworks / domain conventions that apply

- Fully diluted ownership and voting thresholds must be read using the agreement’s own defined denominator; if the definition excludes classes of dilutive securities that the text otherwise contemplates, the effective trigger may be understated.
- Investor-status definitions often drive more than one right; compare every use of the same label across the document set to test whether the same holder qualifies for voting, information, or consent rights in each place.
- Indebtedness covenants should be checked for customary operating carve-outs, including ordinary-course trade payables, purchase-money debt, equipment financing, capital leases, and similar routine obligations where relevant to the business model.
- Drag-along mechanics should be tested for valuation guardrails, including any price floor, minimum return, or comparable economic safeguard; absent a guardrail, minority holders may be forced into a sale at any price the majority accepts.
- Transfer and co-sale mechanics must be read together; a permitted transfer carve-out that omits a joinder requirement for affiliates, family trusts, controlled entities, or other transferees can create a bypass around co-sale rights.
- Protective provisions should be aggregated across the full transaction set to assess cumulative blocking power, not clause by clause in isolation.
- Apply the agreement’s own governing-law and interpretation conventions when identifying whether a term should be harmonized or narrowed; if the source materials identify a controlling authority or defined term, use that authority and definition consistently.

## 4. Analytical scaffolds

- For each voting or consent provision, identify the triggering holder, the denominator, the threshold, and the document where the same concept appears elsewhere.
- For each investor-status definition, compare the definition text with every downstream right that depends on it; flag any mismatch in eligibility or threshold.
- For each debt covenant, test the carve-outs against the company’s ordinary operating and financing activities; flag any gap that would constrain routine business.
- For drag-along language, identify who can initiate the sale, who must participate, and whether the economics include any floor or equivalent protection; if absent, note the resulting downside exposure.
- For transfer provisions, trace the path of a permitted transfer and ask whether the transferee is bound by the same transfer, drag, and co-sale obligations.
- For each issue, close the analysis with three elements: scale it using a figure or threshold from the source set, cross-reference the interacting clause or document, and state the client consequence.
- For each Critical or High issue, include a specific recommended fix that is narrow enough to be implemented in markup or a follow-on draft.
- Aggregate all investor consent and veto rights into a single control map so the memo reflects cumulative control concentration, not just isolated clauses.
- Rank issues by practical importance to the transaction, then by legal or drafting severity.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare the stockholder agreement against the term sheet and existing agreement in parallel; if a term is repeated with different thresholds or mechanics, treat the divergence as an issue rather than assuming one document controls.
- Reconcile the stockholder agreement with the cap table where ownership percentages, class composition, or investor status drive the analysis.
- If the source materials show multiple closing stages, amendments, or restatements, identify which rights apply before closing, at closing, and after closing.
- When a right can be exercised at multiple moments, note whether the timing creates leverage, waiver risk, or a sequencing problem with another document.
- When a provision depends on a future financing, sale, or conversion event, state whether the trigger is immediate, conditional, or deferred.

## 6. Output structure conventions

- Use an issues memo format with a short severity legend at the top: Critical, High, Medium, Low.
- Give each issue a clear header with: provision, problem, consequence, severity, and recommended fix.
- For each issue entry, include the relevant threshold, ownership figure, or other scale from the source documents where available.
- Tie each issue to the interacting clause, schedule, or related document that creates or worsens the mismatch.
- Include a dedicated cumulative control analysis that identifies which holder or investor group controls the most decisions across the protective provisions and related consent rights.
- Include a comparison table for any investor-status or Major Investor definition that appears differently across the document set.
- End with a Recommended Actions block that lists each action in imperative form, identifies the responsible role or owner from the source materials, and gives a timing anchor tied to the transaction timeline.
- Keep the memo concise but decision-useful; avoid restating the full agreement and focus on the provisions that change economics, control, transferability, or closing risk.
