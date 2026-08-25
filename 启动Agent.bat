@echo off
cd /d "%~dp0"
echo ==========================================
echo   Embedded Interview Agent - starting...
echo ==========================================
echo.
set "PY_EXE="
if exist "E:\APP\python 3.14.7\python.exe" set "PY_EXE=E:\APP\python 3.14.7\python.exe"
if not defined PY_EXE set "PY_EXE=python"
"%PY_EXE%" agent.py
echo.
echo ==========================================
echo  Program exited. Press any key to close.
echo ==========================================
pause >nul
