# Quick Deployment Commands

## 🚀 Railway Deployment

### Install Railway CLI
```bash
npm install -g @railway/cli
```

### Login & Link Project
```bash
railway login
railway link
```

### Run Migrations
```bash
railway run python manage.py migrate
```

### Create Superuser
```bash
railway run python manage.py createsuperuser
```

### View Logs
```bash
railway logs
```

### Open Dashboard
```bash
railway open
```

---

## 🎨 Render Deployment

### Access Shell
1. Go to Render Dashboard
2. Select your service
3. Click "Shell" in left sidebar
4. Run commands:

```bash
# Migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Django shell
python manage.py shell
```

---

## 🧪 Local Testing with Gunicorn

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables (create .env)
SECRET_KEY=test-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3

# Collect static files
python manage.py collectstatic --noinput

# Test with gunicorn
gunicorn config.wsgi --bind 0.0.0.0:8000 --reload

# Visit: http://localhost:8000
```

---

## 📝 Generate Django SECRET_KEY

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## 🔍 Check Deployment Configuration

```bash
# Check for deployment issues
python manage.py check --deploy

# Check database connection
python manage.py check --database default

# Show migrations status
python manage.py showmigrations

# Test database query
python manage.py shell -c "from django.contrib.auth import get_user_model; print(get_user_model().objects.count())"
```

---

## 🔧 Environment Variables (Copy-Paste)

### Railway/Render
```bash
SECRET_KEY=<run-generate-command-above>
DEBUG=False
ALLOWED_HOSTS=${{RAILWAY_PUBLIC_DOMAIN}}
DATABASE_URL=${{DATABASE_URL}}
CORS_ALLOWED_ORIGINS=https://your-frontend.com
JUDGE0_API_KEY=your_rapidapi_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

### Local Development (.env file)
```bash
SECRET_KEY=django-insecure-local-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
JUDGE0_API_KEY=your_rapidapi_key
```

---

## 🐛 Quick Fixes

### Static Files Not Loading
```bash
# Run collectstatic
python manage.py collectstatic --noinput

# Verify settings.py has:
# STATIC_ROOT = BASE_DIR / 'staticfiles'
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Database Not Connected
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Test connection
python manage.py check --database default
```

### CORS Errors
```bash
# Update CORS_ALLOWED_ORIGINS with your frontend URL
# Example: CORS_ALLOWED_ORIGINS=https://myapp.vercel.app
```

---

## 📦 Build Commands

### Railway (auto-detected)
```bash
pip install -r requirements.txt
```

### Render (configure in dashboard)
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
```

---

## 🎯 Start Commands

### Railway (Procfile)
```bash
web: gunicorn config.wsgi --log-file -
```

### Render (configure in dashboard)
```bash
gunicorn config.wsgi:application
```

---

## 🔗 Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Render Dashboard: https://dashboard.render.com/
- Django Deployment Docs: https://docs.djangoproject.com/en/stable/howto/deployment/
- Judge0 API: https://rapidapi.com/judge0-official/api/judge0-ce
