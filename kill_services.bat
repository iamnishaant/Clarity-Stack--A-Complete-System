@echo off
title CLARITY TERMINATOR
echo ===================================================
echo             CLARITY STACK TERMINATOR
echo ===================================================
echo.
echo [!] This will kill all processes running on the standard sequential ports:
echo     8000 (Backend), 8001 (SRS), 8002 (ThreatLens)
echo     8003 (Satellite), 8004 (Editor), 8005 (UML API)
echo     8006 (UI), 8007 (UML UI)
echo.
set /p confirm="Are you sure you want to terminate all services? (y/n): "
if /i "%confirm%" neq "y" exit

echo.
echo Terminating processes...

:: Function to kill process by port (8000-8007)
for %%p in (8000 8001 8002 8003 8004 8005 8006 8007) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%p ^| findstr LISTENING') do (
        echo Killing process on port %%p (PID: %%a)...
        taskkill /F /PID %%a /T
    )
)

echo.
echo ===================================================
echo All ClarityStack services have been stopped.
echo ===================================================
pause
exit
