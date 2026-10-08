@echo off
title FitTrack APK Wireless Download Server
echo ============================================================
echo   FitTrack Mobile APK Download Server (Zero Cables Needed)
echo ============================================================
echo.
echo 1. Ensure your Android phone and this laptop are connected
echo    to the SAME Wi-Fi network.
echo.
echo 2. Open Chrome (or any browser) on your phone and visit:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo      http://%%b:8080/FitTrack-debug.apk
    )
)
echo.
echo 3. The APK will begin downloading immediately.
echo    Once downloaded, tap it in your Downloads folder to install!
echo ============================================================
echo Starting local web server on port 8080... (Press Ctrl+C to stop)
echo.
python -m http.server 8080 --directory "%~dp0apk"
pause
