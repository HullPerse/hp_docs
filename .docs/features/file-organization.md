# File organization: naming and folder ownership

## Status

- Implementation: implemented.
- Documentation: this feature file and DECISIONS.md.
- Source: hp_docs audit session 2026-09-05.

## Idea

Change naming and folder rules in the hp_docs template:

1. Naming: the directory carries the domain, the basename carries one concept, the suffix carries the role. Examples: `button.component.tsx`, `user.api.ts`, `api.config.ts`. Literal single-word enforcement is rejected; camelCase stems like `userProfile` stay valid when the concept needs two words.
2. Ownership: local types, helpers, and constants stay next to their owner until a second real consumer appears. Then they move to `types/`, `lib/`, `config/`, `hooks/`, or `api/`.
3. Types: ordinary module types use `types/*.types.ts`; `*.d.ts` is reserved for ambient declarations.

## Comment

Current template text pushes all shared code into global folders unconditionally and names module types `types/*.d.ts`. Evidence from luhaanime (D:\Projects\dev\iluhaAnime) shows the intended model in practice: domain folders own their topic end to end, files inside use `{stem}.{role}.{ext}` with a max-two-dots rule, and tests mirror sources as `{source}.test.ts`. luhaanime still stores module types in `*.d.ts`, which the third rule above fixes in the template and later in consumers.

## Pros

- Prevents global dumping grounds and speculative sharing.
- Filenames stay short and searchable.
- `.types.ts` matches TypeScript semantics for exported module types.
- Aligns template rules with the real convention of luhaanime, risovach, and hp_logger.

## Cons

- Requires updating DEVELOPMENT.md, AGENT_PROMPT.md, CHECKLIST.md, hp-docs SKILL naming table, and docs-refactor compliance rows.
- Existing initialized projects keep `*.d.ts` until their next template update; luhaanime itself needs a rename pass later.
- Owner-first rules need a clear definition of "second consumer" so agents do not argue about placement.

## Approved decisions

- Naming: folder = domain, basename = one concept (camelCase, no hyphens), suffix = role.
- Ownership: local stays local until real reuse appears.
- Types: `types/*.types.ts` for module types, `.d.ts` only for ambient declarations.

## Alternatives

- Strict one-word basenames: rejected, forces awkward names.
- Strict always-global folders: rejected, creates dumping grounds.
- Keep `*.d.ts`: rejected, wrong semantics for exported module types.
