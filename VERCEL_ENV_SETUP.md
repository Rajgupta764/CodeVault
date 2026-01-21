# Vercel Environment Variables Reference

## Production Environment Setup

### For Frontend (React/Vite)

Create these variables in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_URL
└─ Production Value: https://your-backend-url/api
└─ Preview Value: https://your-backend-url/api
└─ Development Value: http://localhost:8000/api
```

**Examples:**
- Railway backend: `https://codevault-backend-xxxx.railway.app/api`
- Render backend: `https://codevault-backend.onrender.com/api`
- Local development: `http://localhost:8000/api`

### Step-by-Step in Vercel Dashboard

1. **Go to Project Settings**
   - Vercel Dashboard → Select "codevault" project
   - Click "Settings" tab

2. **Navigate to Environment Variables**
   - Left sidebar → "Environment Variables"

3. **Add New Variable**
   - Click "Add New Environment Variable"
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url/api`
   - **Environments**: Check all three:
     - ✓ Production
     - ✓ Preview
     - ✓ Development

4. **Save**
   - Click "Save"
   - You'll see: "✓ Environment variable added"

5. **Trigger Redeployment**
   - All future deployments use this variable
   - Or manually redeploy: Dashboard → Deployments → latest → "Redeploy"

## Verify Environment Variables

### Option 1: Check in Deployment
1. Vercel Dashboard → Deployments
2. Click latest deployment
3. Scroll to "Environment Variables"
4. Should show `VITE_API_URL` ✓

### Option 2: Test in Browser
After deployment, open browser console and run:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Should output: `https://your-backend-url/api`

## Troubleshooting

### "API returns 404" after deployment
- Check `VITE_API_URL` is correctly set in Vercel
- Verify backend URL is accessible from browser
- Check backend CORS allows your Vercel domain

### "Blank page after deployment"
- Open DevTools (F12) → Console tab
- Look for errors
- Check if `VITE_API_URL` is undefined

### "Environment variable not loading"
- Redeploy after setting variable: Dashboard → latest deployment → "Redeploy"
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private window

## Backend CORS Configuration

Update backend `config/settings.py` to allow Vercel frontend:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://codevault.vercel.app",  # Add your Vercel URL
    "https://your-custom-domain.com",  # Add custom domain (if any)
]
```

**Redeploy backend after changes:**
```bash
git push origin main
```
(If using Railway/Render with GitHub integration)

## Local Development

### .env.local File (Never commit)

Create `.env.local` in `codevault-frontend/`:
```
VITE_API_URL=http://localhost:8000/api
```

Start dev server:
```bash
npm run dev
```

Frontend will use local backend at localhost:8000.

---

## Quick Reference Table

| Environment | Variable | Value |
|-------------|----------|-------|
| Vercel Production | `VITE_API_URL` | `https://your-backend-url/api` |
| Vercel Preview | `VITE_API_URL` | `https://your-backend-url/api` |
| Local Dev | `VITE_API_URL` | `http://localhost:8000/api` |

---

All set! Your frontend will now connect to the correct backend in each environment. 🚀
