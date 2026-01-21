# Quick Start Guide - CodeVault API

## ⚠️ Prerequisites

- **Python 3.12 or 3.13** (Recommended; Python 3.14+ is supported but some packages may have compatibility issues)
- Windows PowerShell

## 🚀 Get Started in 5 Minutes

### 1️⃣ Setup Virtual Environment (Windows PowerShell)

```powershell
# Navigate to project
cd C:\Users\HP\oneDrive\Desktop\django\codevault

# Create & activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install packages
pip install -r requirements.txt
```

### 2️⃣ Setup Database

```powershell
# Create migrations and database
python manage.py migrate

# Create admin account
python manage.py createsuperuser
```

### 3️⃣ Run Server

```powershell
python manage.py runserver
```

Visit: **http://127.0.0.1:8000/**

---

## 📝 API Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/problems/` | List all problems |
| `POST` | `/api/problems/` | Create new problem |
| `GET` | `/api/problems/{id}/` | Get problem details |
| `PUT` | `/api/problems/{id}/` | Update problem |
| `DELETE` | `/api/problems/{id}/` | Delete problem |
| `POST` | `/api/problems/{id}/submit_solution/` | Submit solution |
| `GET` | `/api/problems/{id}/solutions/` | Get all solutions |
| `GET` | `/api/token/` | Get access token |

---

## 🔑 Authentication Example

**Get Token:**
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

**Use Token:**
```bash
curl http://127.0.0.1:8000/api/problems/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛠️ Useful Commands

```powershell
# Access Django shell
python manage.py shell

# Run tests
python manage.py test

# Create new app
python manage.py startapp app_name

# Check for issues
python manage.py check

# Access admin panel
# http://127.0.0.1:8000/admin/
```

---

## 📚 Full Documentation

See `SETUP_GUIDE.md` for complete setup instructions and troubleshooting.
