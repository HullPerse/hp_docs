---
name: security-audit
version: 1.0.0
description: Audits project security end to end across dependency supply chain, secrets, injection, prototype pollution, path traversal, filesystem, process execution, SSRF, auth, input validation, logging, crypto, races, DoS, config, build, CI, git, and privacy modes, with exfiltration-proof verification for published npm packages and loggers. Use for "security audit", "security review", "проверь безопасность", "аудит безопасности", "эксфильтрация", before publishing a package, or when a change touches trust boundaries.
---

# Security Audit

Use this skill when auditing project security, reviewing a diff or release from the security position, proving that a published package cannot exfiltrate data, or investigating a suspected vulnerability.

## Ownership

Specialist security domains are modes of this one skill, not separate installed skills. This skill reads `.docs/SECURITY.md` first (profile, trust boundaries, capability budget, recorded commands), then agent rules, decisions, module README, package manifest, lockfile, source, CI workflows, and build configuration.

It is read-only by default: findings and fix proposals go to the report; code changes follow the normal disposition gate. It never pastes secrets into reports and never claims a command ran without its output.

## Required workflow

### 1. Reconstruct the context

Read the profile from `.docs/SECURITY.md`, the trust boundaries, the current capability budget, recent decisions touching dependencies or boundaries, and the diff or scope under review. If SECURITY.md is missing or stale against the code, that mismatch is itself a finding.

### 2. Walk every axis

Evaluate each axis from SECURITY.md section 3: dependency-supply-chain, secrets, code-injection, prototype-pollution, path-traversal, filesystem, process-execution, network-ssrf, auth-access, input-validation, output-sanitization, logging-security, crypto-usage, race-condition, dos-resources, serialization, configuration, build-pipeline, ci-workflows, git-hygiene, privacy-data.

Mark every axis `covered` with evidence, `not applicable` with a reason, `deferred` with a return condition, or `unavailable` with a reason. Full-axis review is mandatory even when most axes are not applicable; invented findings are not.

### 3. Collect static evidence

Run the sweep from SECURITY.md section 4 and record exact locations:

- network APIs: fetch, http/https, net, dgram, dns, WebSocket;
- process APIs: child_process, exec, spawn, execFile, fork, shell template literals;
- dynamic execution: eval, new Function, WebAssembly, vm modules;
- computed import specifiers and non-literal require arguments;
- obfuscation markers: long base64/hex literals, decoder string arrays, vendored minified blobs;
- lifecycle scripts in every reachable package.json, including dependencies' manifests;
- environment reads beyond declared variables and writes outside declared paths.

Every hit resolves against the capability budget or becomes a finding. Record "sweep clean at revision X" explicitly instead of staying silent.

### 4. Run the recorded commands

Execute the audit commands written in SECURITY.md section 1 (dependency audit, outdated check, secrets scan) and capture real output. A missing tool is reported as unavailable with a reason, never skipped silently. Never install new tools just to look thorough without permission.

### 5. Exfiltration proof

For published packages, shipped artifacts, and loggers, apply section 5 of SECURITY.md in full:

1. channel inventory where every static hit is resolved against the budget;
2. transitive dependency check for network, process, and install-script reachability;
3. manifest audit of lifecycle scripts;
4. telemetry decision check against DECISIONS.md and the package README;
5. command evidence at the audited revision.

An undeclared outbound channel is a Blocker until it is removed or declared through a decision. The conclusion names the revision and carries the evidence; a claim without inventory and command output must not be reported as proof.

### 6. Adversarial pass

Assume a bypass exists: which channel did the sweep miss; which input reaches a sink without crossing a validation boundary; which dependency gained a capability in the last bump; what would an attacker try first against the entry-point list. Unproven suspicions stay open questions in the report.

## Modes

The mode names below group recurring focus areas. Any of them can be requested directly; none is a separate skill:

- `dependency-audit`: CVEs, confusion, typosquatting, lockfile integrity, transitive reachability;
- `secrets-audit`: keys, tokens, connection strings in source, fixtures, logs, history; rotation state;
- `injection-audit`: command injection, XSS sinks, eval, unsafe deserialization;
- `prototype-pollution`: `__proto__`, `constructor`, unsafe merges of external input;
- `path-traversal`: `..`, absolute paths, symlink following on user-influenced paths;
- `filesystem-security`: write targets, temp permissions, TOCTOU on files, sensitive cleanup;
- `process-execution-security`: shell construction, argument escaping, inherited privilege;
- `network-security`: SSRF, blind redirects, DNS rebinding, internal-address reachability;
- `auth-security`: authentication, authorization, session and token handling;
- `input-validation`: untrusted entries validated at the boundary they enter;
- `output-sanitization`: intentional, minimized egress to logs, responses, third parties;
- `logging-security`: redaction, log injection, serialization of untrusted objects;
- `crypto-security`: primitives, randomness, parameters, key handling;
- `race-condition-audit`: TOCTOU checks, concurrent writes to shared state;
- `dos-audit`: ReDoS, unbounded payloads, resource exhaustion on external input;
- `serialization-security`: parser limits and schema validation for JSON/YAML/binary;
- `config-security`: defaults, debug surfaces in production, environment handling;
- `build-ci-security`: build scripts, workflow permissions, secret exposure;
- `git-security`: ignore coverage, committed credentials, hook integrity;
- `privacy-audit`: collected, stored, and sent user data; retention paths;
- `threat-modeling`: assets, actors, entry points refresh per SECURITY.md section 7;
- `logger-package-boundary`: the npm-package/logger profile from SECURITY.md section 6 - redaction, telemetry ban, least privilege, minimal exports;
- `security-regression`: rerun affected axes and commands after changes so old fixes stay fixed.

Security-focused tests, fuzzing, and mutation belong to `test-architect`; this skill defines what must be tested and verifies the results.

## Evidence discipline

- Exact file paths, symbols, revisions, commands, and observed output for every claim.
- No certainty beyond the evidence: "no undeclared channel found at revision X" is a statement about the sweep, not about intent of maintainers of transitive dependencies.
- Never expose secret values in the report; reference their location instead.
- Findings reuse the REVIEWER severity scale; Blocker stops the touched surface pending disposition.

## Output

Report:

- scope, revision, and profile;
- axis statuses with evidence pointers;
- sweep result and command outputs summary;
- exfiltration-proof conclusion when in scope;
- findings ordered by severity with locations and impact;
- capability-budget deltas needed if new capabilities are justified;
- remaining risks, open questions, and return conditions;
- exact commands with passed, failed, skipped, not applicable, and unavailable results.

The closing question is always:

```text
What data could leave this project without anyone noticing?
```

The audit is done only when this question has a concrete answer backed by the channel inventory.
