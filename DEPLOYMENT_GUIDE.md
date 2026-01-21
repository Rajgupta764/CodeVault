# Django Deployment Guide - Railway & Render

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Railway Deployment](#railway-deployment)
3. [Render Deployment](#render-deployment)
4. [Post-Deployment](#post-deployment)
5. [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Deployment Checklist

### 1. Verify Project Files

Ensure these files exist in your project root:

✅ **requirements.txt** - All Python dependencies
```bash
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
djangorestframework-simplejwt==5.5.1
django-filter==24.1
python-dotenv==1.0.0
requests==2.31.0
dj-database-url==2.1.0
psycopg2-binary==2.9.9
gunicorn==21.2.0
whitenoise==6.6.0
sqlparse==0.4.4
tzdata==2023.3
```

✅ **runtime.txt** - Python version
```
python-3.14.2
```

✅ **Procfile** - Start command
```
web: gunicorn config.wsgi --log-file -
```

✅ **.env.example** - Environment variable template
```bash
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://...
CORS_ALLOWED_ORIGINS=https://your-frontend.com
JUDGE0_API_KEY=your-rapidapi-key
```

### 2. Update settings.py

Verify these configurations are present:

```python
# WhiteNoise middleware (second in list, right after SecurityMiddleware)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # ← Add this
    # ... rest of middleware
]

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Database with dj-database-url
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    import dj_database_url
    DATABASES = {'default': dj_database_url.parse(DATABASE_URL)}
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# CORS settings
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True
```

### 3. Test Locally with Gunicorn

```bash
# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Test with gunicorn
gunicorn config.wsgi --bind 0.0.0.0:8000
```

Visit `http://localhost:8000` - if it works, you're ready to deploy!

---

## 🚂 Railway Deployment

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your repositories

**Screenshot Description**: Railway homepage with "Login" button in top right, clean purple/black interface

### Step 2: Create New Project

1. Click "+ New Project" button
2. Select "Deploy from GitHub repo"
3. Choose your `codevault` repository
4. Click "Deploy Now"

**Screenshot Description**: Dashboard with "+ New Project" button, dropdown showing "Deploy from GitHub repo", "Deploy from template", etc.

### Step 3: Add PostgreSQL Database

1. In your project, click "+ New" button
2. Select "Database" → "Add PostgreSQL"
3. Wait for database to provision (30 seconds)

**Screenshot Description**: Project view with "+ New" button, database options popup showing PostgreSQL, MySQL, MongoDB, Redis

### Step 4: Configure Environment Variables

1. Click on your Django service (not database)
2. Go to "Variables" tab
3. Click "+ New Variable" and add each:

```bash
SECRET_KEY=<generate-strong-key>
DEBUG=False
ALLOWED_HOSTS=${{RAILWAY_PUBLIC_DOMAIN}}
DATABASE_URL=${{DATABASE_URL}}
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
JUDGE0_API_KEY=your_rapidapi_key_here
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

**Important Notes:**
- `${{DATABASE_URL}}` - Railway auto-fills this from your PostgreSQL database
- `${{RAILWAY_PUBLIC_DOMAIN}}` - Railway auto-fills this with your app's domain
- Generate SECRET_KEY: Run `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`

**Screenshot Description**: Variables tab showing list of key-value pairs, "+ New Variable" button at top, each variable has edit/delete icons

### Step 5: Configure Build & Deploy

1. Go to "Settings" tab
2. Find "Start Command" section
3. Verify it shows: `gunicorn config.wsgi --log-file -`
4. If not, add it manually
5. Click "Deploy" button

**Screenshot Description**: Settings page with various sections like "Build Command", "Start Command", "Root Directory", etc.

### Step 6: Run Database Migrations

1. Go to "Deploy" tab
2. Wait for build to complete (green checkmark)
3. Click "View Logs" to see deployment process
4. Once deployed, go to "Settings" → "Generate Domain"
5. Note your Railway domain: `your-app.up.railway.app`

Now run migrations:
1. Click service → "..." menu → "Run Command"
2. Enter: `python manage.py migrate`
3. Press Enter

**Alternatively, use Railway CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run python manage.py migrate

# Create superuser (optional)
railway run python manage.py createsuperuser
```

**Screenshot Description**: Deploy tab showing build logs with timestamps, green "Build Successful" message, deployment status

### Step 7: Create Superuser (Optional)

Using Railway CLI:
```bash
railway run python manage.py createsuperuser
```

Or using one-liner:
```bash
railway run python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'your-password')"
```

### Step 8: Test Your Deployment

1. Get your Railway URL: `https://your-app.up.railway.app`
2. Test API endpoints:
   - `https://your-app.up.railway.app/api/` - Should show API root
   - `https://your-app.up.railway.app/admin/` - Django admin
   - `https://your-app.up.railway.app/api/register/` - Test POST endpoint

3. Update your frontend `.env`:
```bash
VITE_API_URL=https://your-app.up.railway.app/api
```

---

## 🎨 Render Deployment

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started" → Sign up with GitHub
3. Authorize Render to access repositories

**Screenshot Description**: Render homepage with "Get Started" button, modern blue/white interface

### Step 2: Create PostgreSQL Database

1. Click "+ New" → "PostgreSQL"
2. Configure database:
   - **Name**: `codevault-db`
   - **Database**: `codevault_db`
   - **User**: `codevault_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
3. Click "Create Database"
4. Wait for database to be ready (1-2 minutes)
5. **Important**: Copy "Internal Database URL" from database dashboard

**Screenshot Description**: New PostgreSQL form with fields for Name, Database, User, Region dropdown, Instance Type (Free selected)

### Step 3: Create Web Service

1. Click "+ New" → "Web Service"
2. Connect your `codevault` repository
3. Configure service:

**Basic Settings:**
- **Name**: `codevault-backend`
- **Region**: Same as database
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Runtime**: Python 3
- **Build Command**: 
  ```bash
  pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
  ```
- **Start Command**: 
  ```bash
  gunicorn config.wsgi:application
  ```

**Screenshot Description**: Web Service form with fields for Name, Environment (Python selected), Region, Branch, Build/Start commands

### Step 4: Add Environment Variables

Scroll down to "Environment Variables" section, click "Add Environment Variable":

```bash
PYTHON_VERSION=3.14.2
SECRET_KEY=<generate-strong-key>
DEBUG=False
ALLOWED_HOSTS=.onrender.com
DATABASE_URL=<paste-internal-database-url-from-step-2>
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
JUDGE0_API_KEY=your_rapidapi_key_here
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

**Screenshot Description**: Environment Variables section with "+ Add Environment Variable" button, list of key-value inputs

### Step 5: Deploy

1. Scroll to bottom → Click "Create Web Service"
2. Wait for deployment (3-5 minutes first time)
3. Watch build logs in real-time
4. Once complete, you'll see green "Live" badge

**Screenshot Description**: Deployment logs showing installation progress, database migrations, static file collection, green "Live" status

### Step 6: Create Superuser

1. Go to your service dashboard
2. Click "Shell" tab (in left sidebar)
3. Run commands:
```bash
python manage.py createsuperuser
# Follow prompts to create admin user
```

**Screenshot Description**: Shell interface with black terminal, command prompt showing "python manage.py" commands

### Step 7: Test Your Deployment

1. Your Render URL: `https://codevault-backend.onrender.com`
2. Test endpoints (same as Railway Step 8)
3. Update frontend `.env`:
```bash
VITE_API_URL=https://codevault-backend.onrender.com/api
```

---

## 🔧 Post-Deployment

### Configure Custom Domain (Optional)

**Railway:**
1. Go to service → "Settings" → "Domains"
2. Click "Generate Domain" or "Custom Domain"
3. Add CNAME record in your DNS: `your-app.up.railway.app`

**Render:**
1. Go to service → "Settings" → "Custom Domain"
2. Add your domain
3. Add CNAME record in your DNS: `<your-service>.onrender.com`

### Update CORS Settings

After deploying frontend, update backend environment variable:
```bash
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

Railway: Variables tab → Edit `CORS_ALLOWED_ORIGINS`
Render: Environment → Edit variable → Save Changes (triggers redeploy)

### Monitor Application

**Railway:**
- "Metrics" tab: CPU, Memory, Network usage
- "Deployments" tab: Deployment history
- "Logs" tab: Real-time application logs

**Render:**
- "Metrics" tab: Response time, CPU, Memory
- "Events" tab: Deployment history
- "Logs" tab: Live log streaming

### Set Up Automatic Deployments

Both platforms auto-deploy on git push by default!

**To disable:**
- Railway: Settings → Auto Deploy → Toggle off
- Render: Settings → Auto-Deploy → Toggle off

---

## 🐛 Troubleshooting

### Issue: Build Fails - "No module named 'config'"

**Solution:**
- Check `Procfile` points to correct WSGI: `config.wsgi`
- Verify your Django project structure has `config/` folder with `wsgi.py`

### Issue: Static Files Not Loading (404)

**Solution:**
```bash
# Add to settings.py
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Verify WhiteNoise in MIDDLEWARE (second position)
# Verify 'whitenoise' in requirements.txt
```

### Issue: Database Connection Error

**Solution:**
- Railway: Check `DATABASE_URL` variable is set to `${{DATABASE_URL}}`
- Render: Verify you used "Internal Database URL" not "External"
- Check `psycopg2-binary` is in requirements.txt
- Verify `dj-database-url` is installed and used in settings.py

### Issue: CORS Errors from Frontend

**Solution:**
```python
# settings.py
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True

# .env (update with your actual frontend URL)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app
```

### Issue: 500 Internal Server Error

**Solution:**
1. Check logs:
   - Railway: "Logs" tab
   - Render: "Logs" in left sidebar
2. Set `DEBUG=True` temporarily to see error details
3. Run `python manage.py check --deploy` locally
4. Verify all environment variables are set
5. Check `ALLOWED_HOSTS` includes your domain

### Issue: Migrations Not Applied

**Solution:**
```bash
# Railway CLI
railway run python manage.py migrate

# Render Shell
python manage.py migrate

# Or add to build command (Render)
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

### Issue: Application Sleeps (Render Free Tier)

**Behavior:** First request after 15 minutes takes 30-60 seconds (cold start)

**Solutions:**
1. Upgrade to paid plan ($7/month) - no sleeping
2. Use external uptime monitor: [UptimeRobot](https://uptimerobot.com/) (free)
   - Pings your app every 5 minutes
   - Keeps it awake
3. Accept cold starts (fine for development/portfolio)

### Issue: Secret Key Warning

**Error:** `django.core.exceptions.ImproperlyConfigured: The SECRET_KEY setting must not be empty.`

**Solution:**
Generate new key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
Copy output and set as `SECRET_KEY` environment variable.

---

## 📊 Comparison: Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| **Free Tier** | $5 credit/month | 750 hours/month |
| **Cold Starts** | No | Yes (after 15 min idle) |
| **Deploy Speed** | Faster | Slower |
| **Interface** | Modern, intuitive | Clean, detailed |
| **CLI Tool** | Excellent | Good |
| **PostgreSQL** | Free 100MB | Free 1GB |
| **Best For** | Development, startups | Hobby projects |

**Recommendation:**
- **Railway**: Better for production, no cold starts, faster deploys
- **Render**: Better for learning, free tier more generous, good for portfolio

---

## ✅ Deployment Checklist

### Before Pushing to GitHub:
- [ ] `requirements.txt` has all dependencies with versions
- [ ] `runtime.txt` specifies Python version
- [ ] `Procfile` exists with gunicorn command
- [ ] `settings.py` updated for production (WhiteNoise, dj-database-url)
- [ ] `.env.example` created (don't commit actual `.env`)
- [ ] `.gitignore` includes `.env`, `*.pyc`, `__pycache__/`, `db.sqlite3`
- [ ] Test locally with `gunicorn config.wsgi`

### After Deployment:
- [ ] Database provisioned (PostgreSQL)
- [ ] All environment variables set
- [ ] `python manage.py migrate` executed
- [ ] Superuser created
- [ ] Test all API endpoints
- [ ] CORS configured for frontend domain
- [ ] Static files loading correctly
- [ ] Judge0 API key working (test code execution)
- [ ] Update frontend `VITE_API_URL`

---

## 🎓 Learning Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [Railway Docs](https://docs.railway.app/)
- [Render Django Guide](https://render.com/docs/deploy-django)
- [WhiteNoise Documentation](http://whitenoise.evans.io/)
- [dj-database-url](https://github.com/jazzband/dj-database-url)

---

**🎉 Congratulations!** Your Django backend is now live and accessible from anywhere!

Next step: Deploy your React frontend to Vercel/Netlify and connect it to this backend.
