# deslop modes from anti-slop

## Status

- Implementation: implemented.
- Documentation: this feature file and DECISIONS.md.
- Source: hp_docs audit session 2026-09-05.

## Idea

Extend the single deslop skill with the useful structure from miqdadbadjuber/anti-slop, without copying its whole UI-oriented rule set:

1. Three rule tiers: hard gate (never fails), purpose gate (allowed only with a written reason), quality lock (consistency).
2. Two usage modes: During (rules applied while producing output) and After (audit of finished text with a numbered findings list and approval before edits).
3. A Delivery Gate: final evidence report on what was checked, what passed, what failed, and what was not verified.
4. A code-comment audit mode (patterned on antislop-code): remove decorative comments, restatements, and vague TODOs; keep comments that carry causes, invariants, security, and workarounds; never touch code.
5. Provenance checks: no fabricated numbers, testimonials, names, security claims, or performance claims; placeholders are explicitly marked.

## Comment

The current deslop catalog already covers word tags, structural tells, punctuation limits, and voice preservation. What it lacks is the enforcement mechanism: the tier split, the During/After choice, the final evidence gate, and explicit provenance rules. The user selected all five borrowings and rejected the Python contrast checker from antislop-human (it would pull a Python dependency into the template; WCAG ratios can be checked by formula or a script the consumer already has). The user chose to keep everything inside the one deslop skill rather than create separate skills.

## Pros

- Hard gate versus purpose gate removes false bans and fake "reasons" for kept slop.
- During/After gives a real audit workflow for finished text.
- Delivery Gate makes the result verifiable instead of asserted.
- Comment and provenance modes cover the two highest-value gaps in the current skill.
- No new skill count, no Python dependency.

## Cons

- The skill file grows and needs careful structure to stay readable.
- During/After and the Delivery Gate add process steps to every deslop invocation.
- The tier labels must be explained plainly so they do not become jargon.

## Approved decisions

- Add the three-tier classification, During/After modes, Delivery Gate, comment mode, and provenance checks to the deslop skill.
- Keep brief excerpts in DEVELOPMENT.md and AGENT_PROMPT.md; full detail lives in the skill.
- Reject the Python contrast checker; document WCAG ratios as checkable values instead.
