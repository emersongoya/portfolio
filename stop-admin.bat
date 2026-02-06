@echo off
rem Stop the admin server using PID stored in server.pid
cd /d "%~dp0"
if not exist "server.pid" (
  echo PID file not found: server.pid
  echo Server may not be running or started differently.
  pause
  exit /b 1
)

set /p PID=<"server.pid"
if "%PID%"=="" (
  echo PID file empty or invalid.
  del /f /q "server.pid" 2>nul
  pause
  exit /b 1
)

echo Attempting to stop process ID %PID% ...
powershell -NoProfile -Command "try { Stop-Process -Id %PID% -Force -ErrorAction Stop; Remove-Item -Path 'server.pid' -ErrorAction SilentlyContinue; Write-Output ('Stopped ' + %PID%) } catch { Write-Output ('Could not stop process ' + %PID% + ': ' + $_.Exception.Message); exit 1 }"
echo Done.
