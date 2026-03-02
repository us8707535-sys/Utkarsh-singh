@echo off
title Allegro X - PCB Maker Server
echo ===========================================================
echo   ALLEGRO X -- Starting PCB Maker...
echo   Backend + Frontend will open automatically!
echo ===========================================================
cd /d "%~dp0"
node app_ai_server.js
pause
