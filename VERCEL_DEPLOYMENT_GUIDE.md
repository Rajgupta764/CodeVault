# React/Vite Frontend Deployment Guide - Vercel

Complete step-by-step guide to deploy CodeVault frontend to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub account with repository pushed
- Production backend URL (from Railway/Render deployment)
- Node.js 18+ installed locally

## Configuration Status

✅ **package.json**: Production-ready with optimized build scripts
- Build command: `npm run build` (Vite builds to `dist/`)
- Framework detection: Vite configured
- ESLint integrated for code quality

✅ **vercel.json**: Configuration file created with:
- Build and output directories properly set
- SPA routing with fallback rewrites (handles React Router)
- Environment variable placeholders

✅ **api.js**: Dynamic backend URL from environment
- Uses `import.meta.env.VITE_API_URL` for backend connection
- No hardcoded URLs in production code

## Deployment Method 1: GitHub Integration (Recommended)

### Step 1: Push Code to GitHub

```bash
cd codevault-frontend
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Connect GitHub to Vercel

1. Visit https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for your repository (e.g., `codevault`)
5. Click **"Import"**

### Step 3: Configure Project Settings

Vercel will auto-detect Vite:
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (pre-filled)
- **Output Directory**: `dist` (pre-filled)
- **Install Command**: `npm install` (pre-filled)

### Step 4: Set Environment Variables

1. In the Vercel project settings, find **Environment Variables**
2. Add the following variable:

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_API_URL` | `https://your-backend-url/api` | Production, Preview, Development |

**Replace `https://your-backend-url/api` with:**
- Railway: `https://codevault-backend-xxxx.railway.app/api`
- Render: `https://codevault-backend.onrender.com/api`
- Local testing: `http://localhost:8000/api`

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build the project (`npm run build`)
   - Deploy to `codevault.vercel.app` (or your custom domain)
3. Deployment URL appears in 60-90 seconds

### Step 6: Verify Deployment

Once deployed:
1. Visit your Vercel URL (https://codevault.vercel.app)
2. Test login functionality
3. Check browser console (F12) for any API errors
4. Verify API calls reach your backend URL

### Automatic Redeployment

Every push to `main` branch automatically redeploys:
```bash
git push origin main
```

Updates go live within 1-2 minutes.

---

## Deployment Method 2: Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Authenticate

```bash
vercel login
```

Follow prompts to authenticate with GitHub/GitLab/Bitbucket.

### Step 3: Deploy

Navigate to project directory and run:

```bash
cd codevault-frontend
vercel
```

On first deployment, you'll be prompted:

```
? Set up and deploy "~/codevault-frontend"? [Y/n] y
? Which scope do you want to deploy to? [your-username]
? Link to existing project? [y/N] N
? What's your project's name? codevault
? In which directory is your code located? ./
? Want to modify these settings before deploying? [y/N] N
```

### Step 4: Set Environment Variables

```bash
vercel env add VITE_API_URL
```

Enter your production backend URL when prompted.

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

### Step 6: View Live Deployment

```bash
vercel --prod
```

Returns your deployment URL.

---

## API Configuration

### Update Backend URL After Deployment

Once your Vercel URL is live (e.g., `https://codevault.vercel.app`):

1. **Update backend CORS settings** to allow Vercel domain:

   In backend `config/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://your-backend-url",
       "https://codevault.vercel.app",  # Add this
       "http://localhost:3000",
   ]
   ```

2. **Verify API connectivity** by checking Network tab in browser DevTools

### Testing API Connection

In browser console:
```javascript
fetch(`${import.meta.env.VITE_API_URL}/problems/`)
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

---

## Build Optimization

### 1. **Vite Configuration** (Already Optimized)

✅ Current [vite.config.js](vite.config.js):
- Rollup optimization enabled by default
- Automatic code splitting for lazy routes
- Minification enabled in production

### 2. **React Router Code Splitting**

Implement lazy loading for routes in `src/App.jsx`:

```javascript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AddProblem = lazy(() => import('./pages/AddProblem'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Your routes */}
    </Suspense>
  );
}
```

### 3. **Image Optimization**

For any images in `public/`:
- Use WebP format for modern browsers
- Provide fallbacks for older browsers

### 4. **Bundle Analysis**

Analyze final build size:

```bash
npm install --save-dev rollup-plugin-visualizer
```

Update [vite.config.js](vite.config.js):
```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true })
  ]
});
```

Run build:
```bash
npm run build
```

Opens interactive visualization of bundle contents.

### 5. **Current Bundle Size Expectations**

With current dependencies:
- React + React Router: ~42 KB
- Tailwind CSS: ~15 KB (with @tailwindcss/vite optimizations)
- Monaco Editor: ~200 KB (lazy-loaded for code execution pages)
- Total optimized: ~300-400 KB gzipped

**Target**: Keep under 500 KB gzipped for fast loading.

---

## Monitoring & Debugging

### Check Deployment Logs

In Vercel Dashboard:
1. Select your project
2. Click **"Deployments"**
3. Click latest deployment
4. View **"Build Logs"** and **"Function Logs"**

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 errors on page refresh | ✅ Handled by SPA rewrites in [vercel.json](vercel.json) |
| API 404 errors | Verify `VITE_API_URL` in Vercel env vars; check backend CORS |
| Blank page | Check browser console (F12) for JavaScript errors |
| Slow performance | Run bundle analysis; check Monaco Editor lazy loading |
| Auth token not persisting | Verify JWT stored in localStorage; check CORS headers |

### Enable Performance Analytics

In Vercel Dashboard:
1. Select project
2. **Settings** → **Analytics** → **Enable Analytics**
3. View real-time performance metrics

---

## Custom Domain (Optional)

### Add Custom Domain

1. In Vercel Dashboard, go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `codevault.com`)
4. Follow DNS configuration instructions

### Update Backend CORS

Once domain is active, update backend `CORS_ALLOWED_ORIGINS`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://your-backend-url",
    "https://codevault.vercel.app",
    "https://codevault.com",  # Add custom domain
]
```

---

## Continuous Deployment Workflow

```
Local Development
    ↓
    git push to main
    ↓
GitHub triggers Vercel
    ↓
Vercel runs: npm install → npm run build
    ↓
Deploy to vercel.app domain
    ↓
Live update (1-2 minutes)
```

### Disable Auto-Deploy (if needed)

Vercel Dashboard → **Settings** → **Git** → Toggle deployments off

---

## Rollback to Previous Version

If deployment has issues:

1. Vercel Dashboard → **Deployments**
2. Find stable previous deployment
3. Click **"..."** → **"Promote to Production"**

Instantly reverts to that version.

---

## Next Steps

1. ✅ Create vercel.json (done)
2. ✅ Update package.json (done)
3. Deploy via GitHub Integration or CLI
4. Set environment variables on Vercel
5. Test frontend ↔ backend communication
6. Monitor performance with Vercel Analytics
7. Set up custom domain (optional)

---

## Verification Checklist

- [ ] GitHub repository created and pushed
- [ ] Vercel account connected to GitHub
- [ ] Project imported into Vercel
- [ ] `VITE_API_URL` environment variable set
- [ ] Deployment completed successfully
- [ ] Frontend loads without errors
- [ ] Login page accessible
- [ ] API calls return data
- [ ] JWT authentication working
- [ ] Code execution feature functional
- [ ] Search/filtering on dashboard works
- [ ] Collections feature operational

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [React Router SPA Configuration](https://reactrouter.com/docs/start/concepts)
- [Tailwind CSS Performance](https://tailwindcss.com/docs/optimizing-for-production)

---

**Your frontend is now production-ready on Vercel! 🚀**

For backend deployment, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) and [DEPLOYMENT_COMMANDS.md](DEPLOYMENT_COMMANDS.md).
