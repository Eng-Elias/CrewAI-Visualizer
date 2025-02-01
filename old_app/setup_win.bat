@echo off

REM Install npm packages
echo Installing npm packages...
call npm i

echo Creating Python virtual environment...
call python -m venv venv

REM Install Python packages using pip
echo Installing Python dependencies...
call "./venv/scripts/python.exe" "./venv/scripts/pip.exe" install -r requirements.txt

REM Prisma Migrations
echo Applying Prisma Migrations...
call npx prisma generate
call npx prisma migrate deploy

REM Building the project
echo Building the project
call npm run build

REM Building is finished
echo Building is finished
pause
