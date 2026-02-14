@echo off
setlocal

set ROOT_DIR=%~dp0\..
set AGENT_TMP_DIR=%TEMP%\portable-agent
set AGENT_LOW_RAM=1

if not exist "%ROOT_DIR%\node_modules" (
  call npm install
)

cd /d "%ROOT_DIR%"
node src\main.js
endlocal
