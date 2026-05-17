@echo off
REM FREYRAUM - Update Gallery (Windows)
REM
REM Double-click this file to import the pictures you placed in
REM customer-artworks\inbox\ into the gallery preview.

cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js was not found on this computer.
  echo Please install Node.js LTS from https://nodejs.org and run this again.
  pause
  exit /b 1
)

node scripts\import-artworks.mjs
set EXITCODE=%errorlevel%

if exist "customer-artworks\last-import-report.txt" (
  start "" notepad "customer-artworks\last-import-report.txt"
)

if %EXITCODE% neq 0 (
  echo.
  echo Update Gallery finished with errors. See the report for details.
  pause
)

exit /b %EXITCODE%
