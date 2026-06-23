---
name: extract-lien-and-debt-information-from-ucc-filings
task_id: banking-finance/extract-lien-and-debt-information-from-ucc-filings
description: Reviews UCC filings, lien search certificates, and related documents and produces a comprehensive lien search summary report for a secured credit facility.
activates_for: [planner, solver, checker]
---

# Skill: Lien Search Summary Report — Secured Credit Facility

## 1. Subject-matter triage

- Treat the source set as a lien-priority and perfection review, not a generic document summary.
- Separate filings by category before analysis: UCC financing statements, tax liens, judgment-related records, amendments/continuations, terminations/releases, and search-certificate results.
- Screen for debtor-identity issues first; a filing against the wrong entity is a false positive and should not be carried forward as an encumbrance.
- If the records include multiple debtors, entities, or filing jurisdictions, analyze each separately and do not merge them into a single exposure bucket.
- If the deliverable is a secured-credit summary, the operative question is whether each item affects closing, collateral coverage, or post-closing perfection.

## 2. Failure modes the skill is correcting

- Missing tax liens that appear in separate tax lien searches rather than in UCC searches and may outrank a consensual lien if earlier in time.
- Treating a UCC filing connected to a judgment as an effective Article 9 perfection when the underlying enforcement path may require a different filing regime.
- Overlooking debtor-name variants that are still discoverable under filing-office search logic.
- Assuming a purchase-money filing cannot prime an earlier all-assets lien.
- Failing to check whether the named debtor and collateral description actually reach subsidiary assets.
- Treating lapsed financing statements as still effective when continuation is absent or unclear.
- Carrying forward search hits that are actually for a different entity with a similar name.
- Describing a problem without stating its priority effect and its impact on the proposed facility.

## 3. Legal frameworks / domain conventions that apply

- Tax liens: state and federal tax liens are often recorded outside Article 9 and may appear in separate search products; if filed first, they can have priority over later consensual security interests.
- Article 9 perfection by UCC filing: a financing statement generally perfects a consensual security interest if it is filed against the correct debtor, in the correct office, and remains effective.
- Judgment-related filings: a judgment creditor’s rights are not perfected by a UCC filing unless the applicable law recognizes that method; distinguish the judgment itself from the perfection instrument.
- Standard search logic / debtor name accuracy: a minor name error may not defeat effectiveness if the filing would still be found under the filing office’s standard search logic.
- Purchase-money security interests: a PMSI may enjoy superpriority in qualifying collateral if the applicable perfection timing and collateral nexus are satisfied.
- Entity-scope limitations: a filing against one entity does not automatically reach affiliates or subsidiaries absent an adequate debtor name and collateral description.
- Lapse and continuation: a financing statement ceases to be effective after the applicable duration unless continued on time.
- Governing authority should be stated with each conclusion by naming the relevant statute, regulation, or controlling practice rule used for the proposition.

## 4. Analytical scaffolds

1. Build an inventory of all search hits and classify each item by type, debtor, filing date, secured party, collateral, and jurisdiction.
2. For each UCC filing, determine whether it is effective, whether it is still live, and whether it perfects the stated collateral.
3. For each tax lien, determine whether it is a priority concern and whether it requires payoff, subordination, or a closing condition.
4. For any judgment-related record, separate the underlying judgment from any UCC filing and assess whether the UCC filing actually perfects anything under Article 9.
5. For any debtor-name variant, apply the standard search logic test and state whether the filing remains discoverable and therefore effective.
6. For any purchase-money item, assess whether the record supports PMSI treatment and whether it can prime an earlier blanket lien in the relevant collateral.
7. For any filing against a parent or related entity, confirm whether the collateral language or debtor identity reaches subsidiary assets.
8. For any lapsed filing, identify the lapse date, the missing continuation, and the resulting effect on perfection.
9. For any apparent false positive, explain why it is not attributable to the target debtor and exclude it from the encumbrance analysis.

## 5. Vertical / structural / temporal relationships

- If the deal involves a parent and subsidiaries, analyze lien coverage vertically: parent-level filings, subsidiary-level assets, and any structural gap between them.
- If filings occur across multiple dates, compare them temporally to determine priority, lapse, continuation, and later-perfected superpriority claims.
- If the record set includes amendments or continuations, analyze the chain in order so the current status of each filing is clear.
- If the documents include both search certificates and underlying filings, treat the search result as an index and the underlying filing as the source of operative terms.
- If the source set contains competing liens, state the relative ordering only after checking filing date, collateral scope, and any special-priority rule.

## 6. Output structure conventions

- Produce a lien search summary report in conventional report form, with an executive overview followed by categorized findings.
- Start with a short definition of the severity scale you will use, and apply it uniformly to every issue entry.
- Include a compact summary table for each relevant filing or search hit with: category, debtor, secured party or claimant, collateral, filing date, current status, effectiveness, priority, severity, and disposition.
- Group results by practical treatment: clear items, items requiring confirmation, and items requiring action.
- For every issue entry, state the applicable authority or rule, the reason it matters, the priority or perfection consequence, and the recommended next step.
- When more than one filing or claimant is in scope, enumerate them first and analyze each item separately; do not collapse multiple records into one generic finding.
- End with a dedicated Recommended Actions section that assigns an imperative action, the responsible role, and a timing anchor tied to closing, payoff, continuation, release, or subordination.
- If the primary deliverable is a file, ensure the file itself is complete and contains the operative report, not a placeholder or outline.
