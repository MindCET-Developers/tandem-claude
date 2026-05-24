# Run once after closing Cursor/VS Code (folder must not be in use).
# Replaces this OneDrive folder with a junction to the local project at C:\dev\buildpilot.

$ErrorActionPreference = "Stop"
$link = $PSScriptRoot
$target = "C:\dev\buildpilot"

if (-not (Test-Path $target)) {
    Write-Error "Target not found: $target"
}

$parent = Split-Path $link -Parent
$linkName = Split-Path $link -Leaf
$backup = Join-Path $parent "$linkName.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

Write-Host "Moving current folder to backup..."
Rename-Item -LiteralPath $link -NewName (Split-Path $backup -Leaf)

Write-Host "Creating junction -> $target"
cmd /c "mklink /J `"$link`" `"$target`""

Write-Host "Done. Open this folder in Cursor — you will see the full app + docs."
Write-Host "Dev server: cd `"$target`"; pnpm dev"
