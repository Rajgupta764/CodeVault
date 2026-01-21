#!/usr/bin/env python
"""
Pre-Deployment Checklist Script
Run this before deploying to catch common issues
"""

import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if Path(filepath).exists():
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description} MISSING: {filepath}")
        return False

def check_file_content(filepath, required_strings, description):
    """Check if file contains required strings"""
    if not Path(filepath).exists():
        print(f"❌ {description}: File not found - {filepath}")
        return False
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    missing = []
    for string in required_strings:
        if string not in content:
            missing.append(string)
    
    if missing:
        print(f"❌ {description}: Missing in {filepath}")
        for item in missing:
            print(f"   - {item}")
        return False
    else:
        print(f"✅ {description}")
        return True

def check_env_example():
    """Check .env.example has required variables"""
    required = [
        'SECRET_KEY',
        'DEBUG',
        'ALLOWED_HOSTS',
        'DATABASE_URL',
        'CORS_ALLOWED_ORIGINS',
        'JUDGE0_API_KEY'
    ]
    return check_file_content('.env.example', required, ".env.example has required variables")

def check_gitignore():
    """Check .gitignore has important entries"""
    required = ['.env', '__pycache__', 'db.sqlite3']
    return check_file_content('.gitignore', required, ".gitignore has required entries")

def check_requirements():
    """Check requirements.txt has production packages"""
    required = ['gunicorn', 'whitenoise', 'psycopg2-binary', 'dj-database-url']
    return check_file_content('requirements.txt', required, "requirements.txt has production packages")

def check_settings():
    """Check settings.py has production configurations"""
    required = [
        'whitenoise',
        'dj_database_url',
        'STATIC_ROOT',
        'STATICFILES_STORAGE'
    ]
    return check_file_content('config/settings.py', required, "settings.py has production config")

def main():
    print("=" * 60)
    print("🔍 DJANGO DEPLOYMENT CHECKLIST")
    print("=" * 60)
    print()
    
    results = []
    
    # Check essential files exist
    print("📁 Checking Essential Files...")
    results.append(check_file_exists('requirements.txt', 'requirements.txt'))
    results.append(check_file_exists('runtime.txt', 'runtime.txt'))
    results.append(check_file_exists('Procfile', 'Procfile'))
    results.append(check_file_exists('.env.example', '.env.example'))
    results.append(check_file_exists('.gitignore', '.gitignore'))
    results.append(check_file_exists('config/settings.py', 'settings.py'))
    results.append(check_file_exists('config/wsgi.py', 'wsgi.py'))
    print()
    
    # Check file contents
    print("📝 Checking File Contents...")
    results.append(check_requirements())
    results.append(check_settings())
    results.append(check_env_example())
    results.append(check_gitignore())
    print()
    
    # Check Procfile content
    print("🚀 Checking Procfile...")
    if Path('Procfile').exists():
        with open('Procfile', 'r') as f:
            procfile_content = f.read()
        if 'gunicorn config.wsgi' in procfile_content:
            print("✅ Procfile has correct gunicorn command")
            results.append(True)
        else:
            print("❌ Procfile missing 'gunicorn config.wsgi' command")
            results.append(False)
    print()
    
    # Summary
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"📊 RESULTS: {passed}/{total} checks passed")
    print("=" * 60)
    
    if passed == total:
        print("🎉 All checks passed! Ready to deploy!")
        print()
        print("Next steps:")
        print("1. Commit your changes: git add . && git commit -m 'Prepare for deployment'")
        print("2. Push to GitHub: git push origin main")
        print("3. Deploy to Railway or Render (see DEPLOYMENT_GUIDE.md)")
        return 0
    else:
        print("⚠️  Some checks failed. Please fix the issues above before deploying.")
        print("See DEPLOYMENT_GUIDE.md for detailed instructions.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
