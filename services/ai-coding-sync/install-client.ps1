param(
    [string]$ConfigPath = "$env:LOCALAPPDATA\FyuoCodingSync\config.json"
)
$ErrorActionPreference = 'Stop'
$syncDir = Join-Path $env:LOCALAPPDATA 'FyuoCodingSync'
New-Item -ItemType Directory -Path $syncDir -Force | Out-Null
if (!(Test-Path -LiteralPath $ConfigPath)) { throw 'Create the private config.json before installing.' }
$nodePath = (Get-Command node).Source
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'client.mjs'),(Join-Path $PSScriptRoot 'schema.mjs') -Destination $syncDir -Force
if ([IO.Path]::GetFullPath($ConfigPath) -ne (Join-Path $syncDir 'config.json')) {
    Copy-Item -LiteralPath $ConfigPath -Destination (Join-Path $syncDir 'config.json') -Force
}
$identity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
icacls $syncDir /inheritance:r /grant:r "${identity}:(OI)(CI)F" 'SYSTEM:(OI)(CI)F' | Out-Null
$launcher = @'
$ErrorActionPreference = 'Stop'
$mutex = New-Object Threading.Mutex($false, 'Local\FyuoCodingSync')
if (!$mutex.WaitOne(0)) { exit }
try {
    Set-Location -LiteralPath $PSScriptRoot
    $log = Join-Path $PSScriptRoot 'sync.log'
    if ((Test-Path $log) -and (Get-Item $log).Length -gt 5MB) { Move-Item $log "$log.previous" -Force }
    & '__NODE__' (Join-Path $PSScriptRoot 'client.mjs') (Join-Path $PSScriptRoot 'config.json') *>> $log
    exit $LASTEXITCODE
} finally { $mutex.ReleaseMutex(); $mutex.Dispose() }
'@
$launcher = $launcher.Replace('__NODE__', $nodePath.Replace("'", "''"))
$launcherPath = Join-Path $syncDir 'run.ps1'
[IO.File]::WriteAllText($launcherPath, $launcher)
$arguments = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $launcherPath + '"'
$powershellPath = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
# A per-user Startup shortcut runs with the same filesystem access as Token Monitor.
$startup = [Environment]::GetFolderPath('Startup')
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut((Join-Path $startup 'FyuoCodingSync.lnk'))
$shortcut.TargetPath = $powershellPath
$shortcut.Arguments = $arguments
$shortcut.WorkingDirectory = $syncDir
$shortcut.WindowStyle = 7
$shortcut.Save()
Start-Process -FilePath $powershellPath -ArgumentList $arguments -WorkingDirectory $syncDir -WindowStyle Hidden
Write-Output 'FyuoCodingSync installed and started. Logs: %LOCALAPPDATA%\FyuoCodingSync\sync.log'
