param([switch]$Watch)
$ErrorActionPreference = 'Stop'
$backupRoot = Join-Path $env:LOCALAPPDATA 'FyuoBlogBackups'
New-Item -ItemType Directory -Force $backupRoot | Out-Null
function Pull-Backup {
    $name = (& ssh -o BatchMode=yes -o ConnectTimeout=15 aliyun-light "sudo find /data/blog-backups -maxdepth 1 -type f -name 'blog-*.tar.cms' -printf '%f\n' | sort | tail -1").Trim()
    if ($LASTEXITCODE -ne 0 -or $name -notmatch '^blog-\d{8}T\d{6}Z\.tar\.cms$') { throw 'Cannot locate a valid encrypted backup' }
    $target = Join-Path $backupRoot $name
    if (-not (Test-Path -LiteralPath $target)) {
        $remoteHash = (& ssh -o BatchMode=yes -o ConnectTimeout=15 aliyun-light "sudo sha256sum /data/blog-backups/$name").Split(' ')[0]
        if ($LASTEXITCODE -ne 0 -or $remoteHash -notmatch '^[a-f0-9]{64}$') { throw 'Cannot verify remote backup checksum' }
        $info = [System.Diagnostics.ProcessStartInfo]::new('ssh')
        $info.UseShellExecute = $false; $info.RedirectStandardOutput = $true; $info.RedirectStandardError = $true; $info.CreateNoWindow = $true
        foreach ($argument in @('-o','BatchMode=yes','-o','ConnectTimeout=15','aliyun-light',"sudo cat /data/blog-backups/$name")) { $info.ArgumentList.Add($argument) }
        $process = [System.Diagnostics.Process]::Start($info)
        $partial = "$target.partial"
        $stream = [System.IO.File]::Create($partial)
        try { $process.StandardOutput.BaseStream.CopyTo($stream) } finally { $stream.Dispose() }
        $process.WaitForExit()
        if ($process.ExitCode -ne 0) { throw 'Encrypted backup transfer failed' }
        if ((Get-FileHash -LiteralPath $partial -Algorithm SHA256).Hash.ToLowerInvariant() -ne $remoteHash) { throw 'Backup checksum mismatch' }
        Move-Item -LiteralPath $partial -Destination $target
    }
    $status = & ssh -o BatchMode=yes -o ConnectTimeout=15 aliyun-light 'sudo cat /data/blog/security-status.json'
    if ($LASTEXITCODE -ne 0) { throw 'Cannot read security health status' }
    $state = $status | ConvertFrom-Json
    $status | Set-Content -LiteralPath (Join-Path $backupRoot 'security-status.json')
    if (-not $state.ok) { throw ('Server health requires attention: ' + ($state.issues -join '; ')) }
    "$(Get-Date -Format o) verified $name" | Add-Content -LiteralPath (Join-Path $backupRoot 'pull.log')
}
do {
    try { Pull-Backup } catch { "$(Get-Date -Format o) ERROR $($_.Exception.Message)" | Add-Content -LiteralPath (Join-Path $backupRoot 'pull.log'); if (-not $Watch) { throw } }
    if ($Watch) { Start-Sleep -Seconds 3600 }
} while ($Watch)
