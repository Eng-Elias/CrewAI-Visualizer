REM Run the project
echo Starting development server...
start call npm run dev

REM Wait for a few seconds to ensure the server is up and running
timeout /t 2

REM Open browser
echo Opening browser...
start http://localhost:3000
