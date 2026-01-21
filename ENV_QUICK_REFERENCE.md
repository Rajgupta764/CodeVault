# Environment Variables Quick Reference

## Backend (.env)
```bash
# Copy and customize
cp .env.example .env

# Required Variables
SECRET_KEY=django-insecure-change-this-to-random-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
JUDGE0_API_KEY=your_rapidapi_key_here

# Optional (Production)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

## Frontend (.env)
```bash
# Copy and customize
cp .env.example .env

# Required Variable
VITE_API_URL=http://localhost:8000/api
```

## Usage Examples

### Django (settings.py)
```python
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY', 'default-fallback')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')
```

### React + Vite (api.js)
```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})
```

## Important Notes

✅ **DO:**
- Use `.env.example` as template (commit to git)
- Keep `.env` files in `.gitignore`
- Use `VITE_` prefix for Vite (not `REACT_APP_`)
- Restart dev server after changing .env
- Use strong, unique keys in production

❌ **DON'T:**
- Commit `.env` files to git
- Use same SECRET_KEY across environments
- Expose sensitive keys in frontend code
- Use DEBUG=True in production

## Get Judge0 API Key
1. Visit: https://rapidapi.com/judge0-official/api/judge0-ce
2. Sign up / Login
3. Subscribe (free tier available)
4. Copy API key from dashboard
5. Add to `.env`: `JUDGE0_API_KEY=your_key_here`

## Verify Setup

### Backend
```bash
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('SECRET_KEY:', os.getenv('SECRET_KEY')[:20] + '...')"
```

### Frontend
```javascript
// In any component
console.log('API URL:', import.meta.env.VITE_API_URL)
```
