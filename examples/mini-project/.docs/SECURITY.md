# todo-cli Security Contract

Security profile chosen at initialization: internal tool. Exfiltration proof is skipped: the project publishes nothing and ships no artifacts; revisit if that changes.

## 1. Security setup

- Security profile: internal-tool
- Dependency audit command: `bun audit`
- Outdated dependency check: `bun outdated`
- Secrets scan command: unavailable - no scanning tool configured; covered by review passes and git hygiene.
- Dependency review procedure: manual check of release notes for added network, process, or install-script behavior on every bump.
- Release gate: not applicable - no releases beyond the local repository.

## 2. Trust boundaries and capability budget

Trust boundaries: CLI arguments from the invoking user; the JSON storage file in `~/.todo-cli/`; package installation via Bun.

Capability budget:

- Filesystem read/write of `~/.todo-cli/` only - task storage; the single declared purpose of the tool.
- Process-internal file IO only: no network access, no child processes, no dynamic execution, no install scripts, no native addons.

Rules apply as written in the template: an undeclared capability is a Blocker until removed or declared through DECISIONS.md.

## 3. Audit axes

Last full pass: 2026-08-24 at initial documentation setup.

- dependency-supply-chain: covered - zero runtime dependencies; devDependencies limited to TypeScript and ultracite preset; no lifecycle scripts in manifests.
- secrets: covered - no credentials exist in scope; sweep clean; `.gitignore` covers `.env*`.
- code-injection: covered - arguments parsed by the CLI library, never passed to a shell; no eval or dynamic imports.
- prototype-pollution: covered - external JSON input narrowed through a type guard before use; no object merging of untrusted data.
- path-traversal: covered - storage path is fixed (`~/.todo-cli/`), never built from user input.
- filesystem: covered - single fixed write target; atomic write via temp file plus rename inside the same directory.
- process-execution: not applicable - no process spawning exists.
- network-ssrf: not applicable - no network calls exist.
- auth-access: not applicable - no auth surface.
- input-validation: covered - every argument and stored record validated at the boundary; corrupted file produces a clear error, never a partial write.
- output-sanitization: covered - output is task text to stdout only.
- logging-security: not applicable - no logger; stdout only.
- crypto-usage: not applicable - no crypto in use.
- race-condition: deferred - concurrent invocations can interleave writes; return condition: multi-process usage appears.
- dos-resources: covered - file size bounded by task count of a single user; no loops over unbounded input.
- serialization: covered - JSON parse wrapped in try/catch with typed error path.
- configuration: covered - no environment-dependent behavior beyond HOME resolution.
- build-pipeline: covered - build runs tsc locally; no postinstall steps.
- ci-workflows: not applicable - no CI configured.
- git-hygiene: covered - no committed archives or credentials; history checked once at init.
- privacy-data: covered - tasks stay in the user directory; nothing is sent anywhere.

## 4. Static evidence protocol

Sweep result at last pass: clean. No fetch/http/dns/WebSocket, no child_process, no eval/new Function/WASM, no computed import specifiers, no base64 blobs, no lifecycle scripts in any manifest. Recorded per revision in DECISIONS.md when rerun.

## 5. Exfiltration proof for published packages

Skipped: profile internal-tool publishes nothing. Return condition: any npm publish decision.

## 6. npm-package and logger profile

Not applicable: nothing is published and there is no logger. If cloud sync (rejected feature) ever returns, this section becomes mandatory before design work starts.

## 7. Threat model

- Assets: user task data in `~/.todo-cli/`.
- Actors considered: malicious dependency, hostile task-file content, local attacker with repo access.
- Entry points: CLI arguments; JSON file parsing.
- Last reviewed: 2026-08-24 (initial documentation revision).

Hostile file content is mitigated by the type guard and clear-error policy. A malicious dependency would find no network capability in the runtime budget; supply-chain checks stay mandatory on every bump.

## 8. Findings and fixes

Severity scale and fix flow follow the template: evidence first, root cause at the shared place, regression test where technically possible, rerun affected axes and `bun audit`.

## 9. Regression and change discipline

Every dependency bump reruns `bun audit`, checks release notes for new capabilities, and updates the capability budget if needed. The zero-dependency rule makes most axes structurally quiet; they stay listed with their reasons.

## 10. Required review passes

Audit, adversarial attack, and verification passes run per the template. For this profile the adversarial question usually reduces to: what did the newest devDependency start doing?

## 11. Security report

Follows the template structure. Closing question:

```text
What data could leave this project without anyone noticing?
```

Answer at last pass: nothing - no outbound channel exists in source or dependencies.
