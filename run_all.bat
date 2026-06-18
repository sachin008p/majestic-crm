@echo off
echo ========================================================
echo Majestic CRM - 1-Click Startup Sequence
echo ========================================================

echo.
echo [1/3] Starting Database and Backend API via Docker Compose...
docker compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Docker Compose. Is Docker Desktop running?
    pause
    exit /b %errorlevel%
)

echo.
echo Waiting for PostgreSQL to be healthy...
:db_check
docker exec majestic-crm-postgres pg_isready -U majestic -d majestic_crm >nul 2>nul
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto db_check
)
echo PostgreSQL is running and accessible.

echo.
echo [2/3] Building Backend (Maven) if needed...
echo Since we ran "docker compose up -d", the backend API container is already starting.
echo (If you prefer to run it locally via Maven instead of Docker, run: mvn spring-boot:run)

echo.
echo [3/3] Starting Frontend (React / Vite)...
cd frontend
echo Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install npm dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo Starting Vite Dev Server...
echo The frontend will open in your default browser at http://localhost:3000
start cmd /k "npm run dev"

echo.
echo ========================================================
echo All services launched!
echo - API Backend: http://localhost:8080/api/health
echo - Frontend:    http://localhost:3000
echo - Database:    localhost:5432 (User: majestic)
echo ========================================================
pause
