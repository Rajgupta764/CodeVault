# Django REST API Project Setup Guide

## Project Overview
**Project Name:** CodeVault  
**Purpose:** A Django REST API for managing coding problems and solutions  
**Main App:** problems (Handles problems and solutions CRUD)

---

## Project Structure

```
codevault/
├── manage.py                 # Django management script
├── requirements.txt          # Project dependencies
├── .env                      # Environment variables (don't commit to git)
│
├── config/                   # Main project configuration
│   ├── __init__.py
│   ├── settings.py          # Django settings (database, apps, etc.)
│   ├── urls.py              # Main URL routing
│   ├── asgi.py              # ASGI configuration (async support)
│   └── wsgi.py              # WSGI configuration (deployment)
│
└── problems/                 # Main app for problems/solutions
    ├── migrations/          # Database migrations
    ├── __init__.py
    ├── admin.py             # Django admin interface
    ├── apps.py              # App configuration
    ├── models.py            # Database models (Problem, Solution)
    ├── serializers.py       # DRF serializers for API responses
    ├── views.py             # API views and business logic
    ├── urls.py              # App-specific URL routing
    └── tests.py             # Unit tests
```

---

## Step-by-Step Setup Instructions

### Step 1: Create Virtual Environment

**Windows (PowerShell):**
```powershell
# Navigate to your project directory
cd C:\Users\HP\oneDrive\Desktop\django\codevault

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1
```

If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 2: Install Dependencies

```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install all packages from requirements.txt
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Django-4.2.7 djangorestframework-3.14.0 ...
```

### Step 3: Initialize Database

```powershell
# Create initial migrations
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate
```

### Step 4: Create Superuser (Admin Account)

```powershell
python manage.py createsuperuser
```

You'll be prompted to enter:
- Username: `admin` (or your preferred username)
- Email: `admin@example.com`
- Password: (enter a secure password)

### Step 5: Create Static Files Directory

```powershell
# Create staticfiles directory
python manage.py collectstatic --noinput
```

### Step 6: Run Development Server

```powershell
python manage.py runserver
```

**Output should show:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

---

## Testing Your API

### 1. Access Admin Panel
- URL: `http://127.0.0.1:8000/admin/`
- Username: Your superuser username
- You can add problems and solutions through the admin interface

### 2. Get JWT Token
Send a POST request to:
```
http://127.0.0.1:8000/api/token/
```

Request body (JSON):
```json
{
    "username": "admin",
    "password": "your_password"
}
```

Response:
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 3. API Endpoints

**Get All Problems:**
```
GET http://127.0.0.1:8000/api/problems/
```

**Create Problem:**
```
POST http://127.0.0.1:8000/api/problems/
Headers: Authorization: Bearer <your_access_token>
Body:
{
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "difficulty": "EASY",
    "tags": "array,math"
}
```

**Submit Solution:**
```
POST http://127.0.0.1:8000/api/problems/{id}/submit_solution/
Headers: Authorization: Bearer <your_access_token>
Body:
{
    "code": "def solution(nums, target): ...",
    "language": "python"
}
```

**Get Problem Solutions:**
```
GET http://127.0.0.1:8000/api/problems/{id}/solutions/
```

---

## Useful Commands Reference

```powershell
# Deactivate virtual environment
deactivate

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Create app migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Create new app (if needed)
python manage.py startapp app_name

# Run tests
python manage.py test

# Access Django shell (interactive)
python manage.py shell

# Freeze current dependencies
pip freeze > requirements.txt

# Uninstall all packages
pip freeze | xargs pip uninstall -y
```

---

## Key Features Included

✅ **JWT Authentication** - Secure token-based authentication  
✅ **CORS Support** - Cross-Origin Resource Sharing enabled  
✅ **Problem Management** - Create, read, update, delete problems  
✅ **Solution Tracking** - Track solutions with user attribution  
✅ **Admin Interface** - Built-in Django admin for easy management  
✅ **Filtering & Search** - Filter by difficulty, tags, and search  
✅ **Pagination** - Paginated responses for large datasets  
✅ **Environment Variables** - Configuration via .env file  

---

## Troubleshooting

### Port Already in Use
```powershell
python manage.py runserver 8001
```

### Database Errors
```powershell
# Delete old migrations and db
Remove-Item db.sqlite3
Remove-Item problems/migrations/* -Exclude __init__.py

# Recreate from scratch
python manage.py makemigrations
python manage.py migrate
```

### Import Errors
```powershell
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## Next Steps

1. ✅ Complete the setup using these instructions
2. Test the API endpoints using Postman or curl
3. Add more apps as needed: `python manage.py startapp app_name`
4. Customize models in `problems/models.py`
5. Deploy to production (Heroku, AWS, DigitalOcean, etc.)

---

## Helpful Resources

- Django Documentation: https://docs.djangoproject.com/en/4.2/
- Django REST Framework: https://www.django-rest-framework.org/
- JWT Authentication: https://django-rest-framework-simplejwt.readthedocs.io/
- CORS Support: https://github.com/adamchainz/django-cors-headers

Happy coding! 🚀
