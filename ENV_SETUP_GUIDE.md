# Environment Variables Setup Guide

## Overview
This guide explains how to configure environment variables for both the Django backend and React (Vite) frontend.

---

## Backend (Django) Setup

### 1. Create `.env` file
Copy the example file and customize it:
```bash
cp .env.example .env
```

### 2. Required Environment Variables

**SECRET_KEY** (Required for production)
```bash
SECRET_KEY=your-super-secret-random-key-here
```
Generate a secure key:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**DEBUG** (Security: Set to False in production)
```bash
DEBUG=False
```

**ALLOWED_HOSTS** (Required in production)
```bash
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

**DATABASE_URL** (Optional - for production databases)
```bash
# PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

# MySQL
DATABASE_URL=mysql://username:password@localhost:3306/dbname
```

**JUDGE0_API_KEY** (Required for code execution)
1. Go to: https://rapidapi.com/judge0-official/api/judge0-ce
2. Subscribe to a plan (free tier available)
3. Copy your API key
```bash
JUDGE0_API_KEY=your_rapidapi_key_here
```

**CORS_ALLOWED_ORIGINS** (Required for frontend communication)
```bash
# Development
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Production
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 3. How It Works in Django

The `settings.py` uses `python-dotenv` to load variables:

```python
from dotenv import load_dotenv
import os

load_dotenv()  # Loads .env file

SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-default-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')
```

### 4. Install Required Package

If not already installed:
```bash
pip install python-dotenv dj-database-url
```

Add to `requirements.txt`:
```
python-dotenv==1.0.0
dj-database-url==2.1.0
```

---

## Frontend (React + Vite) Setup

### 1. Create `.env` file
Copy the example file:
```bash
cd codevault-frontend
cp .env.example .env
```

### 2. Required Environment Variables

**VITE_API_URL** (Backend API endpoint)
```bash
# Development
VITE_API_URL=http://localhost:8000/api

# Production
VITE_API_URL=https://api.yourdomain.com/api
```

### 3. How It Works in React (Vite)

The `api.js` uses `import.meta.env` to access variables:

```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})
```

**Important Notes:**
- Vite uses `VITE_` prefix (NOT `REACT_APP_`)
- Variables are embedded at build time
- Must restart dev server after changing .env
- Only variables starting with `VITE_` are exposed to client

### 4. Environment-Specific Files

Create multiple environment files:
- `.env` - Default (committed to git)
- `.env.local` - Local overrides (gitignored)
- `.env.development` - Development-specific
- `.env.production` - Production-specific

Priority order: `.env.production.local` > `.env.production` > `.env.local` > `.env`

---

## Security Best Practices

### 1. Never Commit Secrets
Ensure `.gitignore` includes:
```
.env
.env.local
.env.*.local
```

### 2. Use Different Keys per Environment
- Development: Can use simple keys
- Staging: Use strong keys, different from production
- Production: Use cryptographically strong, unique keys

### 3. Rotate Keys Regularly
- Change SECRET_KEY periodically
- Update API keys when exposed
- Revoke old keys after rotation

### 4. Validate Required Variables
Add startup checks in Django:
```python
required_vars = ['SECRET_KEY', 'JUDGE0_API_KEY']
missing = [var for var in required_vars if not os.getenv(var)]
if missing and not DEBUG:
    raise ImproperlyConfigured(f"Missing required environment variables: {missing}")
```

---

## Deployment Checklist

### Backend (Django)
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS` with actual domain
- [ ] Set strong `SECRET_KEY`
- [ ] Configure `DATABASE_URL` for production database
- [ ] Add `JUDGE0_API_KEY`
- [ ] Update `CORS_ALLOWED_ORIGINS` with frontend domain
- [ ] Run `python manage.py collectstatic`
- [ ] Run migrations: `python manage.py migrate`

### Frontend (React + Vite)
- [ ] Set `VITE_API_URL` to production backend URL
- [ ] Build for production: `npm run build`
- [ ] Test environment variables: `console.log(import.meta.env.VITE_API_URL)`
- [ ] Deploy `dist/` folder to hosting

---

## Troubleshooting

### Backend Issues

**Problem**: `SECRET_KEY` not loading
```bash
# Check .env file exists
ls -la .env

# Test loading
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv('SECRET_KEY'))"
```

**Problem**: Database connection fails
```bash
# Verify DATABASE_URL format
echo $DATABASE_URL

# Test database connection
python manage.py check --database default
```

### Frontend Issues

**Problem**: `VITE_API_URL` is undefined
```bash
# Restart dev server after changing .env
npm run dev

# Check if variable is loaded
# Add to your component:
console.log('API URL:', import.meta.env.VITE_API_URL)
```

**Problem**: CORS errors
- Backend: Check `CORS_ALLOWED_ORIGINS` includes frontend URL
- Frontend: Check `VITE_API_URL` matches backend domain
- Verify backend is running and accessible

---

## Example Production Setup

### Backend (.env)
```bash
SECRET_KEY=prod-super-secret-key-generated-with-django-utils
DEBUG=False
ALLOWED_HOSTS=api.codevault.com,codevault.com
DATABASE_URL=postgresql://dbuser:dbpass@db.server.com:5432/codevault_prod
CORS_ALLOWED_ORIGINS=https://codevault.com,https://www.codevault.com
JUDGE0_API_KEY=your_actual_rapidapi_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

### Frontend (.env)
```bash
VITE_API_URL=https://api.codevault.com/api
```

---

## Additional Resources

- [Django Settings Best Practices](https://docs.djangoproject.com/en/4.2/topics/settings/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [The Twelve-Factor App - Config](https://12factor.net/config)
- [Judge0 API Documentation](https://rapidapi.com/judge0-official/api/judge0-ce)

---

## Quick Start Commands

```bash
# Backend
cd codevault
cp .env.example .env
# Edit .env with your values
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd codevault-frontend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```
