@echo off
echo ========================================
echo   AI Event Manager - Database Setup
echo ========================================
echo.
echo Option 1: MongoDB Atlas (Free Cloud DB)
echo ----------------------------------------
echo 1. Go to https://www.mongodb.com/atlas/database
echo 2. Click "Try Free" and sign up
echo 3. Create Free (M0) cluster in Mumbai region
echo 4. Go to Database Access -> Add New User
echo    Username: eventadmin
echo    Password: EventPass123
echo 5. Go to Network Access -> Add IP -> Allow All (0.0.0.0/0)
echo 6. Go to Database -> Connect -> Connect your application
echo 7. Copy the connection string
echo 8. Open server\.env and replace MONGODB_URI value
echo.
echo Option 2: Install MongoDB Locally
echo ----------------------------------------
echo Download from: https://www.mongodb.com/try/download/community
echo Install with default settings, then run this script again.
echo.
echo ========================================
echo Press any key to check MongoDB status...
pause > nul
mongod --version 2>nul
if %errorlevel%==0 (
    echo MongoDB is installed! Starting...
    net start MongoDB
) else (
    echo MongoDB not found locally. Please use MongoDB Atlas.
    echo.
    echo After setting up Atlas, edit server\.env with your connection string.
)
echo.
pause
