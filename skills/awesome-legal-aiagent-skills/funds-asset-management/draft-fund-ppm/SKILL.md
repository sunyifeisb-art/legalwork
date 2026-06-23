---
name: draft-fund-ppm
task_id: funds-asset-management/draft-fund-ppm
description: Draft a private placement memorandum for a fund offering using a prior offering memorandum as a structural template, resolving cross-document inconsistencies and producing a complete, accurate offering document for prospective investors.
activates_for: [planner, solver, checker]
---

# Skill: Draft Private Placement Memorandum

## 1. Subject-matter triage
- Treat the governing fund documents as controlling; use the prior PPM only as a structure and style guide.
- Identify all source documents first, then sort them by authority for each term before drafting.
- If the request is only to draft the PPM, the primary deliverable is the PPM file; do not let any issues summary substitute for the document itself.
- Before finishing, confirm the PPM exists, is non-empty, and reads as an operative offering memorandum rather than a notes file or outline.

## 2. Failure modes the skill is correcting
- Copying a prior memorandum forward without updating fund-specific terms, causing stale or internally inconsistent disclosure.
- Missing conflicts between the term sheet, governing documents, and prior PPM, or failing to decide which source controls.
- Omitting strategy-specific risks, tax risks, regulatory disclosures, or conflicts that should appear in a real offering document.
- Describing economic terms loosely instead of matching the governing documents on fees, carry, waterfalls, key person mechanics, removal rights, and governance.
- Leaving biography or track-record statements unverified against source materials.
- Failing to include the required forward-looking statements cautionary language and adviser disclosure language where material.

## 3. Legal frameworks / domain conventions that apply
- A private placement memorandum is a securities disclosure document for an exempt private offering; it must be accurate, complete, and not materially misleading under the applicable private-offering regime.
- Material omissions or inconsistencies can create liability exposure under the securities laws applicable to the offering.
- Governing documents control fund economics and governance; the PPM must conform to them, not replace them.
- The PPM should clearly distinguish binding terms from descriptive narrative, and should not overstate commitments, targets, or discretion.
- Forward-looking statements and projections must be presented as non-guaranteed, subject to uncertainty, and not promises of performance.
- Adviser status, registration posture, or exemption status should be stated consistently with disclosure obligations and any requested form availability.
- Risk disclosure should reflect the actual strategy, investor base, leverage profile, tax footprint, and structural features of the fund.
- Conflicts disclosure should cover affiliated transactions, principal or affiliate compensation, allocation policies, co-investment practices, and any sponsor obligations that may affect the fund.

## 4. Analytical scaffolds
- Read the governing documents first, then compare the term sheet and prior PPM term-by-term against them.
- For each economic or governance term, verify the controlling source, identify any discrepancy, and resolve it in the draft.
- When multiple sources differ on the same point, state the controlling source in drafting notes and align the PPM to that source.
- Enumerate all source documents and all fund terms that can vary before drafting, so no term is handled by implication.
- Draft the summary, strategy, economics, governance, risk factors, regulatory matters, and conflicts sections from the verified sources rather than from memory.
- Build the biographies from source materials only; verify names, titles, education, and prior experience before insertion.
- Present track record information with careful distinction among realized, unrealized, and any other category used in the source set, and avoid unsupported aggregation.
- Include all material risk categories the strategy suggests, including liquidity, leverage, market, valuation, tax, regulatory, operational, key person, and conflict risks.
- Include the forward-looking statements caution prominently in the front matter and summarize it again where projections or targets appear.
- If an issue memo or drafting notes are prepared, close each issue with the governing source, the drafting consequence, and the recommended resolution.

## 5. Vertical / structural / temporal relationships
- The governing documents are the authoritative source for present fund terms; if a prior PPM conflicts with them, the governing documents control.
- A term sheet may be earlier in time than the final governing documents; do not preserve an outdated formulation once a later controlling document supersedes it.
- Use the prior PPM to preserve organizational flow, not to preserve stale text.
- Where the source set contains multiple versions of a term, align the narrative so the temporal sequence is clear and the final draft reflects the operative version.
- For any term with multiple moving parts, keep the description internally consistent across the cover, summary, detailed economics, and risk sections.

## 6. Output structure conventions
- Single deliverable: `ppm.docx`
- Draft the PPM as a conventional private offering memorandum with a clear cover, legends, and disclosure hierarchy.
- Use a standard institutional structure: cover and legends; cautionary statements; fund overview; strategy; terms and economics; management team and sponsor; governance and service providers; risks; regulatory and tax matters; conflicts; reporting; subscription and transfer mechanics; and any required appendix or summary tables.
- Keep economic terms precise and self-consistent across all sections, including fee base, offsets, distribution mechanics, carried interest, recycling, suspension rights, and removal or dissolution mechanics if applicable.
- Make risk disclosure tailored rather than generic, and align it to the actual investment program and investor profile.
- Include adviser availability disclosure and any representation about access to Form ADV or equivalent materials if required by the source set.
- If the task also asks for issue-spotting or a companion memo, treat that as secondary; the PPM itself remains the primary deliverable and must be completed first.
