# {{PROJECT_NAME}} Security Contract

This document defines how security is reviewed, proven, and maintained in this project. The project-specific profile, commands, trust boundaries, and capability budget are recorded during initialization and kept current by every later change.

## 1. Security setup

- Security profile: {{SECURITY_PROFILE}}
- Dependency audit command: {{AUDIT_COMMAND}}
- Outdated dependency check: {{OUTDATED_COMMAND}}
- Secrets scan command: {{SECRETS_SCAN_COMMAND}}
- Dependency review procedure: {{DEPENDENCY_REVIEW_COMMAND}}
- Release gate (published packages): {{RELEASE_SECURITY_CHECK}}

Unavailable commands are written as `unavailable` with a reason. A command is never implied by a tool name.

Profiles set the depth, never the duty to report:

- `published-package`: full contract - capability budget, exfiltration proof, supply-chain and lifecycle-script review before every release.
- `backend`: trust boundaries, input validation, secrets, auth surfaces, dependency audit; exfiltration proof only for shipped artifacts.
- `internal-tool`: secrets, dependencies, configuration; exfiltration proof is skipped with a recorded reason.
- `minimal`: dependency audit command only; the rest of the axes stay listed and marked not applicable with reasons.

Independent of the profile, every security problem found during any task is reported immediately (see section 8).

## 2. Trust boundaries and capability budget

Trust boundaries of this project: {{TRUST_BOUNDARIES}}

A capability is any way the code or its dependencies can reach outside the process boundary or act on the host:

- network access: fetch, http/https, net, dgram, dns, WebSocket;
- child processes: exec, spawn, execFile, fork, shell invocations;
- filesystem writes outside the declared working paths;
- environment reads beyond the declared variables;
- dynamic execution: eval, new Function, WebAssembly, vm modules;
- install-time execution: preinstall, postinstall, prepare scripts;
- native addons and postinstall binaries.

The capability budget below is the complete list of allowed capabilities. Each entry names the capability, where it lives, and why it exists:

{{CAPABILITY_BUDGET}}

Rules:

1. Code or a dependency that exercises an undeclared capability is a Blocker finding until declared or removed.
2. A new capability enters this file together with a `.docs/DECISIONS.md` entry before it merges.
3. A capability that stops being used leaves this file in the same task.

Annotated examples (remove if not used; keep as format reference):

```text
- network: fetch to api.github.com via GitHub MCP Server (src/api/github.api.ts) - release notes sync; rate-limited, no auth token in query
- network: HTTPS to notion.so via Notion MCP (scripts/notion-sync.ts) - docs export; write-only, no secrets in body
- process: spawn playwright (test/e2e/*.test.ts) - browser verification of UI claims; headless only, no shell
- filesystem: write to docs/api/ (project-documentation skill) - generated docs; does not overwrite .docs/
```

Any of the above that the project does not actually use is deleted, not left as a placeholder. Examples exist only to show the required fields: capability, location, and justification.

## 3. Audit axes

Every axis is evaluated on each security pass and marked `covered` with evidence, `not applicable` with a reason, `deferred` with a return condition, or `unavailable` with a reason. Full-axis review is mandatory; invented findings are not.

- `dependency-supply-chain`: CVEs, dependency confusion, typosquatting, lockfile integrity, transitive reachability, lifecycle scripts of dependencies.
- `secrets`: keys, tokens, passwords, connection strings in source, fixtures, logs, docs, git history; leaked credential rotation state.
- `code-injection`: command injection, XSS sinks, eval and dynamic imports with computed specifiers, unsafe deserialization.
- `prototype-pollution`: `__proto__`, `constructor`, unsafe merges into plain objects from external input.
- `path-traversal`: `..`, absolute-path injection, symlink following on user-influenced paths.
- `filesystem`: write targets, temp file permissions, race-prone read-modify-write, cleanup of sensitive files.
- `process-execution`: shell construction from variables, argument escaping, inherited privileges.
- `network-ssrf`: requests built from user input, redirects followed blindly, DNS rebinding surface, internal-address reachability.
- `auth-access`: authentication checks, authorization decisions, session and token lifetime and storage.
- `input-validation`: every entry point from an untrusted source validated before use; internal representation stays typed.
- `output-sanitization`: data leaving to logs, responses, files, or third parties is intentional and minimized.
- `logging-security`: secrets and PII redaction, log injection through newlines and control characters, serialization of untrusted objects.
- `crypto-usage`: approved primitives, random generation sources, hashing and encryption parameters, key handling.
- `race-condition`: TOCTOU on permission and existence checks, concurrent writes to shared state and files.
- `dos-resources`: ReDoS patterns, unbounded payloads, memory exhaustion, loops without limits on external input.
- `serialization`: JSON, YAML, binary parsers fed by external data; parser limits and schema validation.
- `configuration`: unsafe defaults, debug features reachable in production, environment variable handling.
- `build-pipeline`: build scripts executing code, generated artifacts carrying secrets, dependency install steps.
- `ci-workflows`: workflow permissions, secret exposure to forks and pull requests, untrusted input in run expressions.
- `git-hygiene`: .gitignore coverage, committed credentials or archives, hook integrity.
- `privacy-data`: what user data is collected, stored, sent; retention and deletion paths.

### Checklist supplement (quick pre-commit checks)

Borrowed as a supplement to the axes, not a replacement:

- headers present where the stack serves HTTP: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy; CORS allowlist explicit, no wildcard with credentials;
- auth: login throttling, session expiry, token storage not in URL, privilege check at every boundary, not only at UI;
- input: reject unexpected shape at the boundary that receives it, validate length and charset before use, do not rely on client validation;
- dependencies: lockfile committed, `{{AUDIT_COMMAND}}` clean, no lifecycle script in direct deps unless justified in section 2.

## 4. Static evidence protocol

Evidence is collected by reading code and recording exact locations (`file:line`). The standard sweep covers:

- network APIs: `fetch(`, `require("http`) / `from "http"`, `https`, `net`, `dgram`, `dns`, `WebSocket`;
- process APIs: `child_process`, `exec`, `spawn`, `execFile`, `fork`, shell template literals;
- dynamic execution: `eval(`, `new Function`, `WebAssembly`, `vm.` ;
- import tricks: `import(` with a computed specifier, `require(` with a non-literal argument;
- obfuscation markers: long base64 or hex literals, string arrays with decoder functions, vendored minified blobs;
- environment reads beyond declared variables;
- lifecycle scripts in every `package.json`, including dependencies' published manifests.

Every hit maps to a declared capability in section 2 or becomes a finding. Absence of hits is recorded as "sweep clean at revision X", never as silent omission.

## 5. Exfiltration proof for published packages

Any package published to a registry or shipped to users carries a proof obligation: demonstrate that it cannot send data anywhere except documented endpoints.

The proof consists of:

1. channel inventory from the static sweep (section 4), each hit resolved against the capability budget;
2. transitive dependency check: every direct dependency inspected for its own network, process, and install-script reachability; a clean source tree does not excuse dirty dependencies;
3. manifest audit: no lifecycle scripts, or each script justified and recorded;
4. telemetry decision: no analytics or phone-home unless declared in `.docs/DECISIONS.md` and in the package README;
5. command evidence: output of {{AUDIT_COMMAND}} and {{DEPENDENCY_REVIEW_COMMAND}} at the released version.

The conclusion is written as either "no undeclared outbound channel found at revision X" plus the evidence, or the list of findings. A claim without inventory and command output is not a proof and must not be reported as one.

## 6. npm-package and logger profile

Applies when the repository publishes a package or contains a logger.

Package rules:

- exports surface minimal; no undocumented entry points or deep imports relied upon;
- least privilege: only the system capabilities actually needed, per the budget;
- no telemetry, analytics, update pings, or crash reporting unless declared and documented.

Logger rules:

- secrets, tokens, passwords, API keys, cookies, and personal identifiers are redacted before write; redaction failures are High severity at minimum;
- log injection resisted wherever structured single-line output is promised: newlines, carriage returns, ANSI escapes, and control characters from message content or metadata;
- transports limited to declared destinations; adding a transport that opens a socket or a remote endpoint requires a capability-budget entry;
- huge messages, circular metadata, and `Error` serialization handled without crashing or silently dropping the redaction step.

## 7. Threat model

Kept lightweight and current in this file; refreshed when entry points change.

- Assets: {{ASSETS}}
- Actors considered: external network, malicious or compromised dependency, malicious user input, compromised CI, local attacker with repo access.
- Entry points: {{ENTRY_POINTS}}
- Last reviewed: {{THREAT_MODEL_REVIEWED}} (revision)

An actor times entry point without a named mitigation is a Gap finding.

## 8. Findings and fixes

Severity reuses the REVIEWER scale: Blocker, Critical, High, Medium, Low, Gap, Optimization, Cleanup. Two standing rules:

- undeclared outbound capability or exposed live secret: Blocker;
- a found problem is reported even when discovered outside the current task scope; small items enter the task report as Risk or Gap, surface-crossing items stop the touched scope until dispositioned.

Fix flow mirrors regression-first testing: record evidence, fix the root cause at the shared place, add a regression test where technically possible, rerun affected axes and commands. A security fix without a test states the unavailable reason explicitly. Weakened or removed guarantees require a `.docs/DECISIONS.md` entry.

## 9. Regression and change discipline

- Any change touching trust boundaries, dependencies, or published surfaces reruns the affected axes plus {{AUDIT_COMMAND}} before done.
- Dependency bumps: release notes or diff of the new version checked for added network, process, or install-script behavior when feasible; lockfiles are always committed.
- New dependencies pass the packages-first rule (DEVELOPMENT.md) and inherit their own supply-chain obligations here.
- After every security incident or near miss: threat model refreshed, missing axis added if one existed.

## 10. Required review passes

### Pass 1: audit

Walk every axis from section 3, collect static evidence per section 4, run the recorded commands. Record statuses.

### Pass 2: adversarial attack

Assume a bypass exists and hunt for it: which outbound channel did the sweep miss; which input reaches a sink without crossing a validation boundary; which dependency gained a new capability in the last bump; what would an attacker do first with the entry-point list. An unproven assumption stays an open question, not a conclusion.

### Pass 3: verification

Run typecheck, lint, tests relevant to fixes, and every recorded security command from section 1. Report passed, failed, skipped, not applicable, and unavailable separately with reasons.

## 11. Security report

The report includes:

- scope and revision;
- profile and any capability-budget changes;
- axis statuses with evidence pointers;
- sweep result ("clean" or findings) and command outputs summary;
- findings ordered by severity;
- remaining risks and return conditions;
- threat model deltas.

The final question is always:

```text
What data could leave this project without anyone noticing?
```

A pass counts as done only when this question has a concrete answer backed by the channel inventory.
