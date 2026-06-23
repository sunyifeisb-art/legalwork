---
name: ecvc-extract-key-terms-merger-agreement
task_id: emerging-companies-venture-capital/extract-key-terms-from-merger-agreement
description: Extract key terms from a merger agreement by reading definitions and operative provisions together, checking internal consistency across articles, and noting missing protections or unusual conditions that may matter to preferred stockholders.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Merger Agreement

## 1. Subject-matter triage (only if applicable)

- Treat the merger agreement as the primary source, then reconcile it against schedules, exhibits, ancillary agreements, disclosure letters, and any supporting board or stockholder materials.
- Identify all economic, governance, closing, post-closing, and employee-related terms that affect the preferred stockholder group.
- If only one class, tranche, or holder group is actually implicated, say so; otherwise enumerate each affected group before analysis.

## 2. Failure modes the skill is correcting

- Escrow, holdback, reserve, and release mechanics are summarized from operative provisions without checking defined terms across the agreement for internal consistency or mismatched labels.
- Consideration is extracted without tracing timing, conditions, offsets, and interactions with closing adjustments or post-closing claims.
- Indemnification is summarized without separating basket structure, cap structure, survival, special carve-outs, and procedural claim mechanics.
- Earnout or contingent-value provisions are described without testing whether the agreement supplies the protections needed for a buyer-controlled post-closing business.
- Closing conditions and ancillary deliverables are treated as boilerplate even when they shift leverage, allocate risk, or create practical closing blockers.
- Key employee restrictions are stated without mapping who is bound, what law governs, and whether the restriction may be enforceable as written.
- The stockholder representative role is described without surfacing conflicts, authority limits, or decision-making mechanics that matter in disputes.
- The memo lists terms in isolation instead of cross-checking how one provision affects another provision’s operation or economics.

## 3. Legal frameworks / domain conventions that apply

- Read defined terms, operative sections, schedules, and exhibits together; a term is not fully extracted until its definition and use are reconciled across the document set.
- For merger consideration, identify the form of consideration, payment mechanics, adjustment mechanics, escrow or holdback overlays, and any conditions to receipt.
- For indemnification, capture the basket type, basket amount, cap structure, survival period, claim procedure, setoff rights, special indemnities, and any representation-specific carve-outs.
- For contingent consideration, capture the triggering metric, measurement period, calculation formula, payer discretion, accounting conventions, and any dispute mechanism.
- For stockholder representative provisions, note authority, expense reimbursement, indemnity, decision standards, and any features that may create a divergence between representative and constituency interests.
- For employee restrictive covenants, identify governing law, duration, scope, and whether the restriction is tied to closing, employment, or transition services.
- For closing conditions, distinguish seller conditions, buyer conditions, mutual conditions, and post-signing covenants that function as practical conditions to closing.
- For preferred stockholder analysis, watch for liquidation preference treatment, conversion mechanics, class-based allocation, treatment of dividends, and whether merger consideration is distributed differently across equity classes.
- Treat unusual definitions, inconsistent terminology, and cross-references as substantive risk indicators because they can change payout, claim, or release mechanics.

## 4. Analytical scaffolds

- Build a deal-term inventory first: consideration, escrow or reserve, indemnification, contingent consideration, closing conditions, employee matters, governance or representative mechanics, and any preferred-specific economics.
- For each term, extract: exact source location, operative rule, practical effect, and any cross-reference that modifies or limits it.
- For each economic term, state what is payable, when it becomes payable, what can reduce it, and what event or approval is required before payment.
- For any escrow-like construct, compare every defined label and every operative label; note whether the same pool is described consistently and whether release conditions align with the definition.
- For indemnification, separate the economic structure from the procedure: who can assert claims, against whom, how claims are noticed, what proof is required, when claims expire, and how proceeds are collected.
- For any contingent payment feature, assess whether the buyer controls the business, records, or accounting inputs that determine the payout, and flag any missing protection that could affect economics.
- For each key employee restriction, identify the covered person, the restriction trigger, duration, geography or activity scope, and any jurisdictional enforceability concern.
- For the stockholder representative, identify the representative, what powers it has, what limits exist, and whether conflicts or incentives should be flagged for the client group.
- When a provision refers to multiple parties, tranches, dates, or periods, enumerate them separately before summarizing them in the memo.
- For every issue or unusual term, include: what the term says, how it interacts with another provision, and why it matters to the preferred stockholder group.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Map the sequence from signing to closing to post-closing claim period to final release, because preferred stockholder rights can shift at each stage.
- Track which rights survive closing and which are cut off by release, waiver, cancellation, or conversion mechanics.
- Track vertical relationships among the cap table, liquidation waterfall, class conversion rights, and distribution mechanics so the memo reflects who gets paid first and on what basis.
- If the agreement uses multiple funds, reserves, or adjustment buckets, show how they sit relative to each other and whether one can reduce another.
- If the agreement contains post-closing dispute procedures, place them in temporal order: notice, objection, response, determination, setoff, and final distribution.
- If supporting documents modify the merger agreement, state whether they precede, supplement, or override the operative text.

## 6. Output structure conventions

- Produce a term-extraction memo organized by deal category rather than by document order.
- Use a clear hierarchy such as: transaction overview, consideration, escrow / reserve mechanics, indemnification, contingent consideration, closing conditions, employee matters, stockholder representative, and preferred-stockholder-specific observations.
- For each category, use a consistent mini-format: source term or clause → plain-English meaning → cross-reference check → client impact.
- Include a separate consistency check section for defined terms that affect payout, holdback, reserve, release, or claim mechanics.
- Include a separate protections section for contingent consideration or buyer-controlled post-closing economics, noting whether protective covenants, access rights, ordinary-course obligations, and dispute resolution mechanisms are present or absent.
- Include a separate section for any closing-risk items, especially conditions tied to deliverables, consents, or employee undertakings.
- Where multiple parties or periods are relevant, present them in a table or numbered list so each item is handled distinctly.
- End with a concise recommendations section that states the next steps for counsel and the business team, tied to the transaction timeline or any stated deadline.
- Keep the memo in operative, deal-facing language; do not quote at length unless a precise phrase is necessary to resolve a term.
