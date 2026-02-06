@echo off
rem Install dependencies for the local admin API
echo Installing Node dependencies...
npm install

echo.
echo Installation complete.
echo To run the admin server locally:
echo Set the admin token (example):
echo    setx ADMIN_TOKEN "your-secret-token"
echo Then start the server:
echo    start-admin.bat
pause
