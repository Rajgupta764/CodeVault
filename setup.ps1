# CodeVault Django Setup Script for Windows PowerShell
# Usage: .\setup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CodeVault Django REST API Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[OK] Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[1/6] Creating virtual environment..." -ForegroundColor Yellow
try {
    python -m venv venv
    Write-Host "[OK] Virtual environment created" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to create virtual environment" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/6] Activating virtual environment..." -ForegroundColor Yellow
try {
    & .\venv\Scripts\Activate.ps1
    Write-Host "[OK] Virtual environment activated" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to activate virtual environment" -ForegroundColor Red
    Write-Host "Tip: If you get execution policy error, run:" -ForegroundColor Yellow
    Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[3/6] Upgrading pip..." -ForegroundColor Yellow
try {
    python -m pip install --upgrade pip
    Write-Host "[OK] pip upgraded" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] pip upgrade failed, continuing anyway..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[4/6] Installing dependencies..." -ForegroundColor Yellow
try {
    pip install -r requirements.txt
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[5/6] Running database migrations..." -ForegroundColor Yellow
try {
    python manage.py migrate
    Write-Host "[OK] Migrations completed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to run migrations" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[6/6] Creating superuser account..." -ForegroundColor Yellow
Write-Host ""
python manage.py createsuperuser

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run the development server:" -ForegroundColor White
Write-Host "   python manage.py runserver" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Visit the admin panel:" -ForegroundColor White
Write-Host "   http://127.0.0.1:8000/admin/" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Test the API:" -ForegroundColor White
Write-Host "   http://127.0.0.1:8000/api/problems/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
Write-Host ""
