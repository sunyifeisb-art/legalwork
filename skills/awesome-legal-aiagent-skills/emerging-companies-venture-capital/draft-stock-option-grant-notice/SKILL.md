---
name: ecvc-draft-stock-option-grant-notice
task_id: emerging-companies-venture-capital/draft-stock-option-grant-notice
description: Drafting a stock option grant notice requires confirming that the valuation support is current, checking the applicable annual incentive stock option limit for the grantee, addressing fractional share rounding in the vesting schedule, and reviewing attached form agreements for any employment restrictions that may be unenforceable for the grantee's jurisdiction.
activates_for: [planner, solver, checker]
---

# Skill: Draft Stock Option Grant Notice

## 1. Subject-matter triage

- Treat the grant notice as the primary deliverable and the cover memo as secondary.
- Read all six source documents first, then identify the governing grant terms, the form documents, and any deal-specific deviations.
- Separate: (i) grantee identity and role, (ii) plan and award terms, (iii) valuation support, (iv) tax designation, (v) vesting mechanics, and (vi) local-law restrictions in any attached form agreement.
- If multiple grants, multiple valuation dates, or multiple jurisdictions appear in the packet, enumerate them explicitly before drafting or issue spotting.

## 2. Failure modes the skill is correcting

- The valuation support is assumed rather than verified against the grant date, and stale support is not flagged when the latest report predates a material company event.
- The exercise price is copied without checking that it tracks the grant-date fair market value used for the award.
- The incentive stock option treatment is stated without checking whether the annual statutory limit is implicated for the same grantee in the same calendar year.
- Vesting is drafted with rounding ambiguity when the share count does not divide cleanly across vesting installments.
- The form option agreement is not reviewed for restrictive covenants that may be unenforceable in the grantee’s jurisdiction.
- Cross-document inconsistencies are left buried in the draft instead of being isolated in the cover memo with a concrete follow-up list.
- The primary draft is not completed before the memo, or the memo is treated as a substitute for the operative notice.

## 3. Legal frameworks / domain conventions that apply

- Grant-date pricing: the exercise price should track the fair market value used for the grant date, and the valuation support must be current enough for the intended tax treatment and any reliance position reflected in the source set.
- Incentive stock option limits: confirm the statutory annual limit applicable to the grantee for stock options first becoming exercisable in the relevant calendar year; if the source set pushes the award beyond that limit, the excess portion must be identified and labeled consistently with nonqualified treatment.
- Vesting mechanics: a vesting schedule should state exact share counts, vesting dates, and the rounding approach for any remainder so the grant notice is mechanically executable.
- Restrictive covenants: review any attached form agreement for non-compete, non-solicitation, or similar restrictions and flag language that may not be enforceable for the grantee’s work location or governing law.
- Document hierarchy: where the plan, grant notice, and form agreement differ, identify which document controls under the source set and note the discrepancy rather than silently reconciling it.

## 4. Analytical scaffolds

- Build a source inventory before drafting:
  - grant notice template or form
  - equity plan and related definitions
  - board/committee approval materials, if any
  - valuation support
  - employment or offer materials tied to the award
  - form option agreement or restrictive covenant addendum
- For each source, extract the operative fields: grantee, grant date, number of shares, exercise price, expiration, vesting start date, vesting cadence, and award type.
- Compare the extracted terms across documents and flag mismatches in:
  - award type or designation
  - share count
  - grant date
  - exercise price
  - vesting commencement date
  - vesting cadence or cliff
  - expiration term
  - governing law or local-law carveouts
  - post-termination or restrictive covenant language
- Confirm whether any valuation report is tied to the correct grant date and whether the source packet indicates a later event that may make the valuation stale.
- If the annual limit could be implicated, assess the award and any related grants to the same person in the same calendar year together, then classify any excess consistently with the source materials and governing tax framing.
- Draft the vesting schedule as an executable table with exact share amounts on each date; state the rounding rule if the shares do not divide evenly.
- Prepare the cover memo as an issue list: identify the discrepancy, explain where it appears, and state the drafting or factual follow-up needed before finalization.

## 5. Vertical / structural / temporal relationships

- Draft around the sequence of events, not just the final form:
  - approval date
  - grant date
  - valuation date
  - vesting commencement
  - first vesting date
  - any cliff period
  - recurring vesting dates
  - expiration
- Where documents use different labels for the same concept, normalize the terminology in the draft and mention the label mismatch in the memo.
- If a restriction depends on location, role, or governing law, tie it to the grantee’s jurisdiction as reflected in the source set and flag any ambiguity about the applicable location.
- If multiple awards or tranches exist, keep the time sequence separate so each tranche’s economics and tax treatment remain traceable.

## 6. Output structure conventions

- Produce the operative stock option grant notice as a complete, self-contained drafting artifact in doc-ready form.
- Populate all essential fields with source-consistent text: grantee name, award type, number of shares, exercise price, grant date, expiration date, vesting schedule, and any tax designation.
- Use a table for vesting when dates and share counts are material; make the rounding method explicit if needed.
- Do not leave placeholders in the primary draft unless the source packet itself leaves the item unresolved; if unresolved, flag it in the memo.
- In the cover memo, list each cross-document discrepancy and each open item separately, with the source locations or document references described in conventional terms.
- Close the memo with concrete recommended actions, naming the responsible role and an urgency tied to the closing, grant, or approval milestone.
- Ensure the final package contains both files with substantive content: the grant notice draft first, then the issues memo.
