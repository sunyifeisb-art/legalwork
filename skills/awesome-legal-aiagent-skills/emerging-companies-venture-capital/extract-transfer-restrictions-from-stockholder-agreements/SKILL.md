---
name: ecvc-extract-transfer-restrictions
task_id: emerging-companies-venture-capital/extract-transfer-restrictions-from-stockholder-agreements
description: A transfer restriction analysis for a proposed secondary sale must identify whether transfer restrictions apply to the relevant classes of equity, characterize the consequence of transferring without any required joinder, explain drag-along obligations that bind transferees upon joinder, and confirm whether any common-stock holder has registration rights eligibility.
activates_for: [planner, solver, checker]
---

# Skill: Extract Transfer Restrictions from Stockholder Agreements

## 1. Subject-matter triage
- Treat the secondary sale as a document-set analysis: identify each equity holder, each equity class, and each agreement that may restrict transfer or impose joinder, matching rights, lockups, or registration-rights consequences.
- Separate primary transfer restrictions from ancillary provisions that change transfer mechanics, including joinder requirements, deemed waivers, drag-along, voting commitments, consent rights, and lock-up periods.
- If multiple holders, classes, or agreements are in play, enumerate them first and analyze each separately before drawing any aggregate conclusion.

## 2. Failure modes the skill is correcting
- Transfer-restriction coverage analysis can focus on one class of equity without checking whether the same restriction also applies to other classes that may be included in the agreement.
- The consequence of completing a transfer without any required joinder is not clearly stated.
- Drag-along or similar obligations are often summarized without stating what a transferee actually becomes bound to do after joinder.
- Registration-rights analysis can miss whether the relevant securities definition excludes common stock, restricted stock, options, or other non-qualifying equity.
- Matching-right or consent provisions can be overlooked, even where they control closing mechanics or create a deemed waiver.
- Lock-up provisions can be omitted even though they may prohibit or delay the proposed sale.
- Conclusions are sometimes stated without identifying the governing agreement language or controlling legal concept that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply
- Restriction coverage by class: identify which holders and which classes of equity are within the scope of each transfer restriction, and confirm whether the restriction applies uniformly across classes or only to a defined subset.
- Joinder consequence: where an agreement requires a transferee to execute a joinder as a condition of transfer, state the consequence of failing to do so in the agreement's own terms, using the agreement language to distinguish between invalidity of the transfer and release from contractual obligations.
- Drag-along obligation binding on transferees: if a transferee becomes bound through joinder to a voting or similar agreement, explain the obligations that follow from that joinder and whether they extend to sale-related voting or similar actions.
- Registration rights eligibility: identify the securities that qualify for registration-rights treatment under the relevant agreement definition, determine which holders in the proposed secondary transaction own qualifying securities, and flag any holder whose equity does not appear to qualify.
- Right of first refusal or similar matching right: identify the applicable notice, exercise, and waiver mechanics, then state whether the proposed transfer can close only after the matching period expires or waives.
- Lock-up or similar transfer restriction: confirm whether any temporal or event-based transfer prohibition applies to the shares being sold and whether the restriction is absolute or subject to exceptions.
- Use the agreement’s defined terms as written; do not substitute broader market terminology where the contract is narrower.

## 4. Analytical scaffolds
- First, list the agreements to be reviewed, the holder groups implicated, and the equity classes involved.
- For each transfer-restriction agreement:
  - identify the holder classes covered by the restriction;
  - confirm whether any class is excluded;
  - identify all permitted transfer carve-outs and any joinder conditions attached to each;
  - identify any consent, notice, or matching-right mechanics;
  - identify any lock-up provision and its duration or trigger;
  - state the effect of noncompliance on the attempted transfer.
- For each voting, drag-along, or similar agreement:
  - state the joinder requirement;
  - characterize the consequence of transferring without a joinder;
  - identify any obligations that will bind a transferee who executes a joinder;
  - state whether those obligations relate to sale approval, vote support, proxy delivery, or comparable actions.
- For each registration-rights agreement:
  - confirm the definition of the securities that qualify;
  - identify which holders in the proposed secondary sale hold qualifying securities and which do not;
  - flag any holder who would lack registration-rights coverage.
- For each agreement, identify the controlling provision by section or defined term and tie each conclusion back to that provision.
- Where the source documents give dates, thresholds, or timing windows, state them specifically and connect them to the transfer analysis.
- If the source set supports more than one plausible reading, present the competing reading and the operational consequence of each.

## 5. Vertical / structural / temporal relationships
- Map the transfer from seller to buyer against the document hierarchy: the stockholder agreement may govern baseline transfer permissions, while a separate voting or rights agreement may govern post-transfer obligations.
- Track whether obligations run with the shares, bind only current holders, or attach only after joinder by the transferee.
- Identify whether restrictions are triggered before closing, at closing, or after closing through a post-closing joinder or notice process.
- Distinguish direct prohibition on transfer from conditions precedent to recognition of the transfer, recordation, or contractual release.
- If the same holder appears in multiple agreements, reconcile any tension between them rather than analyzing each in isolation.

## 6. Output structure conventions
- Write a transfer restriction analysis memo organized by agreement.
- Include a coverage table showing restriction type, applicable holder classes, and whether coverage is full, partial, or excluded.
- State the joinder consequence explicitly for each agreement that requires a joinder.
- Include a registration-rights eligibility table showing holder class, eligibility, and consequence for the secondary sale.
- Include a short matching-right / notice / waiver section if any such provision appears.
- Include a lock-up section if any transfer prohibition by time or event appears.
- Use concise issue statements, then a short conclusion and practical consequence for each.
- End with a Recommended Actions section that identifies the next drafting or diligence step, the responsible role, and the relevant closing milestone or deadline.
- Cite the controlling agreement section, defined term, statute, regulation, or other authority for each legal proposition relied on; do not state a transfer conclusion without the supporting authority.
