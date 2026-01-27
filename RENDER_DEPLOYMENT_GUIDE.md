# Render Deployment Guide for CodeVault Backend

## Quick Deploy Steps

### Option 1: Auto-Deploy with render.yaml (Recommended)

1. **Push code to GitHub:**
   ```bash
   git add -A
   git commit -m "Add Render deployment configuration"
   git push
   ```

2. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com/
   - Click **New +** → **Blueprint**
   - Connect your GitHub repository: `Rajgupta764/CodeVault`
   - Render will detect `render.yaml` and configure everything automatically
   - Click **Apply**

3. **Set Environment Variables (Important!):**
   After blueprint is created, go to **Environment** tab and add:
   
   | Key | Value |
   |-----|-------|
   | `ALLOWED_HOSTS` | `.onrender.com,code-vault-3vp6.vercel.app` |
   | `CORS_ALLOWED_ORIGINS` | `https://code-vault-3vp6.vercel.app` |
   | `DEBUG` | `False` |
   | `SECRET_KEY` | Auto-generated (leave as is) |
   | `DATABASE_URL` | Auto-configured from PostgreSQL database |

4. **Deploy:** Click **Manual Deploy** → **Deploy latest commit**

---

### Option 2: Manual Deploy

1. **Create Web Service:**
   - Go to https://dashboard.render.com/
   - Click **New +** → **Web Service**
   - Connect GitHub: Select `Rajgupta764/CodeVault` repository
   
2. **Configure Service:**
   - **Name:** `codevault-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** Leave empty (root of repo)
   - **Runtime:** Python 3
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn config.wsgi:application`
   - **Plan:** Free

3. **Add PostgreSQL Database:**
   - In your service dashboard, go to **Environment** → **Add Database**
   - Create new PostgreSQL database
   - Name: `codevault-db`
   - Plan: Free
   - Render will auto-add `DATABASE_URL` to your environment

4. **Add Environment Variables:**
   Go to **Environment** tab:
   
   ```
   PYTHON_VERSION=3.12.0
   SECRET_KEY=[Generate random key]
   DEBUG=False
   ALLOWED_HOSTS=.onrender.com,code-vault-3vp6.vercel.app
   CORS_ALLOWED_ORIGINS=https://code-vault-3vp6.vercel.app
   DATABASE_URL=[Auto-set from database]
   ```

5. **Deploy:** Render will automatically deploy when you save

---

## Important Configuration Notes

### 1. ALLOWED_HOSTS
Must include:
- `.onrender.com` (for your Render domain)
- `code-vault-3vp6.vercel.app` (your frontend domain)

### 2. CORS_ALLOWED_ORIGINS
Must include your exact Vercel frontend URL:
```
https://code-vault-3vp6.vercel.app
```
**NO trailing slash!**

### 3. SECRET_KEY
Generate a secure secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. DATABASE_URL
Automatically provided by Render PostgreSQL database. Format:
```
postgresql://user:password@host:5432/database
```

---

## After Deployment

### 1. Get Your Backend URL
After deployment completes, your backend will be at:
```
https://codevault-backend.onrender.com
```

### 2. Update Vercel Environment Variable
Go to Vercel Dashboard → CodeVault project → Settings → Environment Variables:
- **Name:** `VITE_API_URL`
- **Value:** `https://codevault-backend.onrender.com/api`
- **Environment:** All (Production, Preview, Development)
- Click **Save**
- **Redeploy** frontend on Vercel

### 3. Test Your Backend
Visit these URLs to verify:
- `https://codevault-backend.onrender.com/api/` - Should show REST framework browsable API
- `https://codevault-backend.onrender.com/admin/` - Django admin login

---

## Troubleshooting

### Build Fails
- Check **Logs** in Render dashboard
- Verify `build.sh` has execute permissions (should be automatic)
- Check Python version matches `runtime.txt`

### Database Connection Error
- Ensure `DATABASE_URL` environment variable is set
- Check PostgreSQL database is created and running
- Verify `psycopg2-binary` is in requirements.txt

### Static Files Not Loading
- Check `STATIC_ROOT` and `STATIC_URL` in settings.py
- Verify `whitenoise` is in MIDDLEWARE
- Run `python manage.py collectstatic` manually in Render shell

### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` includes exact frontend URL (no trailing slash)
- Check `corsheaders` middleware is before `CommonMiddleware`
- Ensure DEBUG=False in production

---

## Free Tier Limitations

**Render Free Tier:**
- Web service spins down after 15 minutes of inactivity
- First request after sleep takes 30-50 seconds (cold start)
- PostgreSQL database: 90 days retention, then expires
- 750 hours/month free

**Solutions:**
- Use a service like UptimeRobot to ping your backend every 14 minutes
- Upgrade to paid plan ($7/month) for always-on service
- Or accept the cold start delay on free tier

---

## Files Created for Render

✅ `build.sh` - Build script (install deps, collect static, migrate)
✅ `render.yaml` - Blueprint configuration for auto-deploy
✅ `runtime.txt` - Python version (3.12.0 for Render compatibility)
✅ `Procfile` - Already exists (Heroku compatible, works on Render too)
✅ `requirements.txt` - Already exists with all dependencies

Your backend is **READY TO DEPLOY** on Render! 🚀
