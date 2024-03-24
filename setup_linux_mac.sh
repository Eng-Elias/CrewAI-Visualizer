#!/bin/bash

# Install npm packages
echo "Installing npm packages..."
npm i

# Create Python virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Install Python packages using pip
echo "Installing Python dependencies..."
./venv/bin/python ./venv/bin/pip install -r requirements.txt

# Prisma Migrations
echo "Applying Prisma Migrations..."
npx prisma generate
npx prisma migrate deploy

# Building the project
echo "Building the project..."
npm run build

# Building is finished
echo "Building is finished"
pause