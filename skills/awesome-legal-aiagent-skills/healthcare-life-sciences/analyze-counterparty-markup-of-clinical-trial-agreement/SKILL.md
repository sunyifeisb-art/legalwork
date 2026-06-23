---
name: hls-analyze-counterparty-markup-cta
task_id: healthcare-life-sciences/analyze-counterparty-markup-of-clinical-trial-agreement
description: Reviews a site’s redline of a sponsor clinical trial agreement against a negotiation playbook to classify changes by risk level and recommend negotiating positions, with attention to intellectual property, indemnification, insurance, audit rights, publication, assignment, and program-wide precedent effects.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Clinical Trial Agreement

## 1. Subject-matter triage

- Treat the site markup, sponsor template, negotiation playbook, and supporting deal context as one integrated record set; do not assess edits in a vacuum.
- Identify whether the markup is site-specific or likely to affect a broader study program; if multiple counterparties or versions are in scope, enumerate them before analysis and assess each separately.
- If the source set contains a single site and a single redline, state that explicitly and explain why no broader comparison set exists.
- Anchor the memo in the actual clause-by-clause markup, but keep the focus on negotiation leverage, legal consequence, and precedent risk.

## 2. Failure modes the skill is correcting

- Changes are summarized provision-by-provision without connecting them to sponsor risk, operational burden, or program-wide precedent.
- Interactions among intellectual property, publication, indemnity, insurance, audit, and assignment are treated as isolated edits rather than a risk cluster.
- The analysis describes what changed but not why the change matters under the governing legal framework or playbook posture.
- The memo fails to distinguish concession-worthy edits from positions that should be resisted because they would distort the sponsor template for future sites.
- The review stops at issue identification and does not end with a concrete recommendation tied to the deal timeline and responsible actor.
- Redline commentary depends only on formatting instead of making the change readable in plain text.

## 3. Legal frameworks / domain conventions that apply

- Clinical trial agreements are typically negotiated against a sponsor template and site playbook; deviations should be classified by their effect on study conduct, liability allocation, data rights, and future site leverage.
- Intellectual property provisions should be read for inventorship, ownership default, license scope, and any language that could dilute sponsor control over trial-generated improvements or derivative uses.
- Publication terms should be assessed for prior-art and patent-filing timing risk, including whether the site can disclose results or data before sponsor filing strategy is complete.
- Indemnification clauses should be tested for carve-outs, fault allocation, defense control, and whether the edit expands exposure beyond protocol-deviation, negligence, or misconduct boundaries.
- Insurance terms should be read together with indemnity and subject-injury allocation; a shift in one often changes the practical value of the other.
- Audit and inspection rights must preserve sponsor oversight and compliance functionality under applicable good-clinical-practice expectations and regulator-facing obligations.
- Assignment and change-of-control restrictions should be tested against ordinary sponsor transaction planning and the need to preserve transferability of the agreement within a corporate reorganization.
- Any legal conclusion should be tied to a controlling authority or recognized practice convention, whether that authority is statutory, regulatory, doctrinal, or contract-standard for the relevant jurisdiction.
- Use the governing law, clinical research regulations, and any cited policy language in the source set as the primary interpretive frame; do not generalize beyond the source record.

## 4. Analytical scaffolds

1. Read the sponsor template, site redline, playbook, and context together before drafting any issue.
2. For each substantive edit, identify:
   - the original sponsor position,
   - the counterparty change,
   - the legal or operational consequence,
   - the playbook classification,
   - the recommended response.
3. Close each issue with three moves:
   - scale the issue using an actual transaction fact, contract term, enrollment timing, study phase, patient-risk feature, or other source-based measure;
   - cross-reference the clause or document it interacts with;
   - state the downstream consequence for the sponsor.
4. When an edit touches intellectual property, analyze ownership and exploitation implications under the relevant default rule and note any effect on sponsor exclusivity or downstream development.
5. When an edit touches publication, analyze patent timing and cross-border disclosure consequences if the source set suggests non-domestic filings or multinational use.
6. When an edit narrows indemnity or expands insurance reliance, analyze the combined effect; do not evaluate either provision in isolation.
7. When an edit limits audit, inspection, or records access, assess both compliance risk and practical trial-management impact.
8. When an edit changes assignment or transfer language, test it against likely sponsor-side transactions and internal restructuring scenarios.
9. If deal communications or context show urgency, enrollment pressure, site importance, or similar leverage, use that context in the recommendation without overstating it.
10. Mark redline changes in a way that survives plain-text export, not just visual formatting; every substantive edit should be legible from the text alone.
11. Classify each issue on a uniform ordinal severity scale defined once in the memo, and apply that scale consistently.
12. End with explicit next-step recommendations that assign responsibility and timing.

## 5. Vertical / structural / temporal relationships

- IP, publication, and filing timing form a sequence; a disclosure issue can create downstream patent loss or reduce strategic filing options.
- Indemnification, insurance, and audit rights form a risk-management cluster; relaxing one term often weakens the value of the others.
- Assignment, change of control, and program-wide precedent should be considered together because a local concession can become a template constraint for later sites.
- Payment timing, budget provisions, and any holdback language should be read in relation to operational milestones and subject enrollment cadence.
- Concessions that appear minor at a single site can have temporal spillover if the study is ongoing or if the same template will be reused.

## 6. Output structure conventions

- Write a redline analysis memo in descending severity order, using an ordinal scale defined at the start (for example: Critical, High, Medium, Low).
- For each issue, use a compact issue entry with these elements in conventional memo form:
  - provision reference
  - change description
  - legal / operational analysis
  - severity classification
  - recommendation
- Where helpful, include a short plain-text notation of the markup change so the reader can see the edit without relying on document styling.
- Surface the clause interaction and sponsor consequence within the issue entry rather than leaving them for a separate catch-all discussion.
- Include a short strategic considerations section on precedent, site leverage, and any deal-context factors that should shape the response.
- End with a Recommended Actions block that states the action verb, responsible role, and timing anchor for each next step.
- Keep the memo concise, but do not omit the operative analysis needed to support each recommendation.
