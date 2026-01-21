# Piston API Integration Guide (FREE Alternative to Judge0)

## What is Piston?
Piston is a **completely free**, open-source code execution engine that requires **NO API key** or credit card. It's perfect for Indian developers who can't access Judge0 due to payment restrictions.

## ✅ What Changed

Your CodeVault project now supports **both Piston and Judge0**. The system will automatically use Piston (free) by default.

### Updated Files:
1. **`.env`** - Changed to use Piston API
2. **`problems/services.py`** - Added Piston support with automatic fallback
3. **`config/settings.py`** - Added configuration for both APIs

## 🚀 Quick Start

### Your current `.env` settings:
```env
# Code Execution API - Choose 'piston' (FREE) or 'judge0'
CODE_EXECUTION_API=piston

# Piston API Configuration (FREE - No API key required!)
PISTON_API_URL=https://emkc.org/api/v2/piston
```

**That's it!** No API key needed. Just restart your Django server.

## 🧪 Testing the Integration

### Option 1: Run the test script
```bash
python test_piston.py
```

### Option 2: Test via Django shell
```python
python manage.py shell

# In the shell:
from problems.services import execute_code

# Test Python
result = execute_code('PYTHON', 'print("Hello!")')
print(result['output'])  # Should print: Hello!

# Test JavaScript
result = execute_code('JAVASCRIPT', 'console.log("Hello!")')
print(result['output'])  # Should print: Hello!
```

### Option 3: Test via your frontend
1. Start the backend: `python manage.py runserver`
2. Start the frontend: `cd codevault-frontend && npm run dev`
3. Try running code in your code editor!

## 📊 Comparison: Piston vs Judge0

| Feature | Piston (FREE) | Judge0 (Paid) |
|---------|---------------|---------------|
| **Cost** | ✅ 100% Free | 💳 Requires payment |
| **API Key** | ❌ Not needed | ✅ Required |
| **Rate Limit** | Generous free tier | Based on subscription |
| **Languages** | 50+ | 60+ |
| **Execution Time** | ✅ Provided | ✅ Provided |
| **Memory Usage** | ❌ Not provided | ✅ Provided |
| **Setup** | Instant | Need RapidAPI account |

## 🌐 Supported Languages (Piston)

- ✅ Python
- ✅ JavaScript (Node.js)
- ✅ Java
- ✅ C++
- ✅ C
- Plus 45+ more languages!

## 🔄 Switching Back to Judge0

If you get a Judge0 API key later, simply change your `.env`:

```env
CODE_EXECUTION_API=judge0
JUDGE0_API_KEY=your_api_key_here
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

## 🛠️ Other FREE Alternatives

### 1. **JDoodle API** (Free tier available)
- Website: https://www.jdoodle.com/compiler-api
- Free tier: 200 calls/day
- Requires API key (free signup)

### 2. **Sphere Engine** (Free tier)
- Website: https://sphere-engine.com/
- Free tier: 10 compilations/day
- Requires API key

### 3. **Self-hosted Judge0** (Advanced)
If you want unlimited usage, you can host Judge0 yourself using Docker:

```bash
# Clone Judge0 CE
git clone https://github.com/judge0/judge0.git
cd judge0

# Start with Docker Compose
docker-compose up -d

# Your own Judge0 instance will run at http://localhost:2358
```

Then update `.env`:
```env
CODE_EXECUTION_API=judge0
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=
JUDGE0_API_HOST=localhost:2358
```

## ⚠️ Important Notes

### Rate Limiting
Piston's public instance is free but has reasonable rate limits:
- **Fair use policy**: Don't abuse the service
- If you need higher limits, consider self-hosting

### Error Handling
The updated code handles errors gracefully:
- ✅ Invalid code → Shows compilation errors
- ✅ Runtime errors → Shows error messages
- ✅ API timeout → Shows timeout message
- ✅ Network issues → Shows connection errors

## 🐛 Troubleshooting

### Issue: "API Error: Connection timeout"
**Solution**: Check your internet connection. Piston requires internet access.

### Issue: "Unsupported language"
**Solution**: Make sure you're using: PYTHON, JAVASCRIPT, JAVA, CPP, or C (uppercase)

### Issue: Code doesn't execute
**Solution**: 
1. Restart Django server: `python manage.py runserver`
2. Clear browser cache
3. Check browser console for errors

## 📞 Support

### Piston API Issues:
- GitHub: https://github.com/engineer-man/piston
- Discord: https://discord.gg/engineer-man

### Your CodeVault Issues:
Check the execution response in your Django logs:
```bash
python manage.py runserver
# Watch the terminal for API call logs
```

## 🎉 Success!

You now have a **completely free code execution system** without needing any credit card or Indian payment method restrictions!

**Next Steps:**
1. Restart your Django server
2. Test code execution in your app
3. Start coding! 🚀
