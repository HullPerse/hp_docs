# Rebuilds canonical templates and local skill mirrors from live files.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/sync-templates.ps1
# Byte-exact Copy-Item only: no text transcoding, no encoding risks.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

$pairs = @(
    @("AGENTS.md",                       "AGENTS.md"),
    @("first-run.md",                    "first-run.md"),
    @(".docs\AGENT_PROMPT.md",           "AGENT_PROMPT.md"),
    @(".docs\DEVELOPMENT.md",            "DEVELOPMENT.md"),
    @(".docs\DESIGN.md",                 "DESIGN.md"),
    @(".docs\CHECKLIST.md",              "CHECKLIST.md"),
    @(".docs\REVIEWER.md",               "REVIEWER.md"),
    # DECISIONS.md excluded on purpose: live journal holds repo-specific decisions,
    # shipped template must stay an empty journal. Edit it manually if the format changes.
    @(".docs\ROADMAP.md",                "ROADMAP.md"),
    @(".docs\agents-audit.prompt.md",    "agents-audit.prompt.md"),
    @(".docs\features\README.md",        "features\README.md"),
    @(".docs\reviews\README.md",         "reviews\README.md"),
    @(".docs\answers\README.md",         "answers\README.md")
)

foreach ($p in $pairs) {
    $src = Join-Path $root $p[0]
    $dst = Join-Path $root ("skills\ai-docs\templates\" + $p[1])
    if (-not (Test-Path -LiteralPath $src)) { throw "Missing source: $src" }
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dst) | Out-Null
    Copy-Item -LiteralPath $src -Destination $dst -Force
}

# Local mirror so coding agents auto-discover skills in this repo
$mirror = Join-Path $root ".agents\skills"
Remove-Item -LiteralPath $mirror -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $mirror | Out-Null
Copy-Item -Path (Join-Path $root "skills\*") -Destination "$mirror\" -Recurse -Force

# Verify byte-exactness
$failed = 0
foreach ($p in $pairs) {
    $src = Join-Path $root $p[0]
    $dst = Join-Path $root ("skills\ai-docs\templates\" + $p[1])
    $a = (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash
    $b = (Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash
    if ($a -ne $b) { Write-Output "HASH MISMATCH: $($p[0])"; $failed++ }
}
if ($failed -gt 0) { throw "$failed template file(s) failed hash verification" }

Write-Output "OK: $($pairs.Count) templates rebuilt, mirrors synced, hashes verified."
