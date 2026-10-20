# TypeScript type usage

Source: iluhaAnime `.docs/DEVELOPMENT.md` "TypeScript utility types" (2026-10-15) and its 70-item catalog decision, generalized for the template on 2026-10-20.

## Problem

Idea: the template only forbids `any` and leaked `unknown`; it says nothing about using the type system well.

Comment: the iluhaAnime section already encoded the useful practice: a consumer gate for shared types, a home for them, an adopted list, a standard list, and a rejected list. That knowledge lived in one project.

Pros: agents stop hand-writing the same shape twice, stop using `Record<string, unknown>` as a domain model, and stop adding utility types nobody uses.

Cons: typing advice can turn into type gymnastics; the limits bullet and the consumer gate are the guard.

## Rules

Idea: eight rules in `DEVELOPMENT.md`, TypeScript variant only.

Comment: derive instead of duplicating; discriminated unions with exhaustive switch; `Record` for finite key maps with derived keys; `as const` plus `satisfies` tables; branded ids at boundaries only; interface for object contracts, type for unions, no new `enum`; consumer gate plus a type-test pin; no type-level programming and no types as runtime validation.

Pros: the rules fit on one screen and can be checked in review.

Cons: another 30 lines in `DEVELOPMENT.md`; a project without TypeScript drops the block at initialization.

## Record

Idea: `Record<K, V>` is the default for finite key maps, not `Record<string, V>`.

Comment: `Record<string, V>` still compiles after a key rename; `Record<Union, V>` fails at compile time on a missing key, which is the reason to use it. `Partial<Record<K, V>>` covers sparse maps; `Map` covers dynamic or non-string keys.

Pros: a key rename or a new variant surfaces at typecheck instead of in review.

Cons: deriving `K` needs a source union or an `as const` table; a project without one does a small refactor first.

## Audit and tests

Idea: `review-audit` gets a type-usage checklist and a triage list; `TESTING.md` records type tests.

Comment: the checklist covers duplicated shapes, non-exhaustive switches, `Record<string>` with known keys, brand sprawl, consumer-less types, and missing pins. The triage list keeps the decision consistent between sessions.

Pros: the same decision in every session without re-litigating TypeScript lore.

Cons: the lists age with the language; they are defaults, and a project convention wins.

## Rejected

A standalone `.docs/TYPES.md`: typing rules are short and matter only for TypeScript; a separate file adds template pipeline and a second place to drift.

The full 70-item catalog in the template: most entries have no consumer and the list ages.

Type-level programming as a style: it reads as clever and reviews badly. No consumer, no type.

`Brand` everywhere: branding is for runtime-identical values at boundaries, not decoration.
