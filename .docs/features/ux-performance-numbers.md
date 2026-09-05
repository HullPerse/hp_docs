# UX and performance numbers in the template

## Status

- Implementation: implemented.
- Documentation: this feature file and DECISIONS.md.
- Source: hp_docs audit session 2026-09-05.

## Idea

Classify the UX, accessibility, and performance numbers that appear in audits into three explicit levels in the template docs:

1. Normative: WCAG 2.2 contrast 4.5:1 for normal text and 3:1 for large text; WCAG 2.2 target-size minimum 24x24 CSS px where applicable; 44x44 px documented as the comfort target for touch, not as the WCAG minimum.
2. Heuristics: about 100 ms (instant feedback), 1 s (thought stays uninterrupted), 10 s (attention limit, needs progress and cancellation); 45-90 characters per line; transition timings (about 200-300 ms snappy, 300-500 ms deliberate).
3. Reference only: frame envelopes of 8.3 ms at 120 Hz and 16.7 ms at 60 Hz, with a note that they are timing envelopes, not guaranteed JavaScript budgets.

The Jeff Dean latency table (L1 0.5 ns through a 150 ms transcontinental packet) is kept only as a dated educational reference with a disclaimer: historical approximate values for reasoning about orders of magnitude, never a project threshold or benchmark.

## Comment

The current template already has the correct evidence rule: numbers come only from executed commands and recorded artifacts. The gap is that shared reference numbers (frame times, response limits, touch targets, line length) are sometimes stated as if they were universal requirements. The three-level split keeps WCAG rules binding, marks UX values as heuristics, and quarantines historical hardware numbers from any acceptance criteria. The user chose the three-level split and the reference-with-disclaimer for the Jeff Dean table.

## Pros

- WCAG compliance values stay correct and current (24x24 minimum, 44x44 comfort).
- No invented or outdated number becomes a pass/fail rule.
- Frame timing and latency tables remain available as educational material without contaminating budgets.
- Consistent with the no-unmeasured-numbers rule.

## Cons

- Requires touching DESIGN.md and the performance notes in AGENT_PROMPT.md and TESTING.md.
- Heuristic labels need concrete wording so agents do not treat them as hard gates.

## Approved decisions

- Normative: WCAG 2.2 contrast and 24x24 px minimum target; 44x44 px is the comfort target.
- Heuristics: 100 ms / 1 s / 10 s response boundaries, 45-90 character line length, transition timings.
- Reference: frame envelopes and the Jeff Dean table with a dated disclaimer.
