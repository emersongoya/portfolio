@echo off
rem Start the admin server in the background and write PID to server.pid
cd /d "%~dp0"
echo Starting admin server (node server.js) in %CD% ...

rem Start using PowerShell and save PID to server.pid
powershell -NoProfile -Command "$p = Start-Process -FilePath 'node' -ArgumentList 'server.js' -WorkingDirectory (Get-Location).Path -PassThru; $p.Id | Out-File -FilePath 'server.pid' -Encoding ascii; Write-Output ('Started PID: ' + $p.Id)"

if exist server.pid (
	echo Server started. PID saved to %~dp0server.pid
	echo To stop: stop-admin.bat
) else (
	echo Failed to start server. Check that Node.js is installed and in PATH.
)
