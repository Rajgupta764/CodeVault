# CodeVault 🏆

A full-stack web application for competitive programmers to track, organize, and master coding problems with integrated code execution, revision scheduling, and collection management.

## Table of Contents

1. [Project Overview](#project-overview-and-features)
2. [Tech Stack](#tech-stack)
3. [Installation Instructions](#installation-instructions-local-setup)
4. [Environment Variables](#environment-variables-setup)
5. [Running the Project](#running-the-project)
6. [API Endpoints](#api-endpoints-documentation)
7. [Screenshots & UI](#screenshots-and-ui)
8. [Future Enhancements](#future-enhancements)
9. [Contributing](#contributing-guidelines)
10. [License](#license)

---

## Project Overview and Features

CodeVault is a comprehensive platform designed for competitive programmers to:

### Core Features

**📊 Problem Tracking**
- Track coding problems from multiple platforms (LeetCode, GeeksforGeeks, CodeForces)
- Organize by difficulty level (Easy, Medium, Hard)
- Support multiple problem statuses (Solved, Attempted, To Revise)
- Tag-based categorization for efficient organization
- Direct links to problem statements

**💾 Solution Management**
- Store multiple solutions per problem
- Support for multiple programming languages
- Rich code editing with syntax highlighting (Monaco Editor)
- View, edit, and delete solutions
- Solution versioning and tracking

**⏰ Spaced Repetition & Revision Scheduling**
- Intelligent revision scheduling based on spaced repetition algorithm
- Next revision dates calculated automatically
- Track revision history with timestamps
- Schedule revisions for: 1 day, 3 days, 7 days, 14 days, 30 days
- Never miss an important problem revision

**🗂️ Collections Management**
- Create custom problem collections (e.g., "Binary Trees", "Dynamic Programming")
- Organize problems into logical groups
- ManyToMany relationships for flexible organization
- Quick access to related problems
- Share collection ideas with community

**⚡ Live Code Execution**
- Execute code directly in browser without installation
- Support for 80+ programming languages
- Real-time output and error feedback
- Powered by Judge0 API
- Test solutions instantly before submission

**🔍 Search & Filtering**
- Full-text search across problems and solutions
- Filter by platform, difficulty, status
- Tag-based filtering
- Search in dashboard with instant results

**🔐 User Authentication**
- Secure registration and login
- JWT-based authentication
- Password-protected user data
- User-specific problem tracking

### Key Benefits

- **Comprehensive Tracking**: Never lose a problem or solution again
- **Optimized Learning**: Spaced repetition ensures better retention
- **Better Organization**: Collections help group related problems
- **Instant Testing**: Built-in code execution saves time
- **Cloud-Based**: Access from anywhere, on any device

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Django** | 4.2.7 | Web framework |
| **Django REST Framework** | 3.14.0 | API development |
| **PostgreSQL** | (supported) | Database |
| **SQLite** | (included) | Local development DB |
| **Gunicorn** | 21.2.0 | WSGI application server |
| **WhiteNoise** | 6.6.0 | Static file serving |
| **python-decouple** | Latest | Environment management |
| **django-filter** | 24.1 | Advanced filtering |
| **simplejwt** | 5.5.1 | JWT authentication |
| **django-cors-headers** | Latest | CORS configuration |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **Vite** | 7.2.4 | Build tool & dev server |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS |
| **React Router** | 7.12.0 | Client-side routing |
| **Axios** | 1.13.2 | HTTP client |
| **Monaco Editor** | 4.7.0 | Code editor component |
| **ESLint** | 9.39.1 | Code quality |

### Deployment

| Platform | Purpose |
|----------|---------|
| **Railway/Render** | Backend hosting |
| **Vercel** | Frontend hosting |
| **Judge0 API** | Code execution |
| **PostgreSQL** | Production database |

---

## Installation Instructions (Local Setup)

### Prerequisites

- **Python** 3.11+ (tested with 3.14.2)
- **Node.js** 18+ with npm
- **Git**
- **PostgreSQL** 12+ (optional for production, SQLite used by default)

### Backend Setup

#### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/codevault.git
cd codevault
```

#### Step 2: Create Virtual Environment

```bash
# Windows
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 4: Database Setup

```bash
# Apply migrations
python manage.py migrate

# Create superuser (for admin panel)
python manage.py createsuperuser
# Enter username, email, password when prompted
```

#### Step 5: Create Static Files (Production)

```bash
python manage.py collectstatic --noinput
```

#### Step 6: Run Backend Server

```bash
python manage.py runserver
```

✅ Backend running at: `http://localhost:8000`
✅ Admin panel at: `http://localhost:8000/admin`
✅ API at: `http://localhost:8000/api`

### Frontend Setup

#### Step 1: Navigate to Frontend Directory

```bash
cd codevault-frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Development Server

```bash
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

### Verification

1. **Backend API**
   ```bash
   curl http://localhost:8000/api/problems/
   # Should return: {"detail":"Authentication credentials were not provided."}
   ```

2. **Frontend**
   - Open http://localhost:5173 in browser
   - Should see CodeVault login page

---

## Environment Variables Setup

### Backend Environment Variables

Create `.env` file in project root:

```env
# Database Configuration
DATABASE_URL=sqlite:///db.sqlite3
# For PostgreSQL: postgresql://user:password@localhost:5432/codevault

# Security
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Judge0 API (for code execution)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-rapidapi-key

# Email Configuration (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**Get Judge0 API Key:**
1. Visit https://rapidapi.com/judge0-official/api/judge0-ce
2. Subscribe to free tier
3. Copy API key from dashboard
4. Add to `.env` as `JUDGE0_API_KEY`

### Frontend Environment Variables

Create `.env.local` in `codevault-frontend/`:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api
```

### Environment Variables by Environment

| Variable | Development | Production |
|----------|-------------|-----------|
| `DEBUG` | `True` | `False` |
| `VITE_API_URL` | `http://localhost:8000/api` | `https://your-backend-url/api` |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Your domain |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | `https://your-frontend-url` |

---

## Running the Project

### Local Development (All in One)

#### Option 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd codevault
.\.venv\Scripts\Activate.ps1  # Windows
source .venv/bin/activate     # macOS/Linux
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd codevault-frontend
npm run dev
```

**Result:**
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- API: `http://localhost:8000/api`

### Production Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for backend deployment to Railway/Render.

See [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md) for frontend deployment to Vercel.

### Useful Commands

**Backend**
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Run tests
python manage.py test

# Shell (interactive Python)
python manage.py shell
```

**Frontend**
```bash
# Development server with HMR
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint code with fixes
npm run lint
```

---

## API Endpoints Documentation

### Base URL

- **Development**: `http://localhost:8000/api`
- **Production**: `https://your-backend-url/api`

### Authentication Endpoints

#### Register User
```
POST /api/register/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: 201 Created
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Obtain Token (Login)
```
POST /api/token/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}

Response: 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

#### Refresh Token
```
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response: 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Problem Endpoints

All problem endpoints require JWT authentication (Bearer token).

#### List Problems (with Filtering)
```
GET /api/problems/?platform=LEETCODE&difficulty=MEDIUM&status=SOLVED&search=binary

Headers: Authorization: Bearer <access_token>

Response: 200 OK
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "problem_name": "Binary Search",
      "platform": "LEETCODE",
      "difficulty": "MEDIUM",
      "status": "SOLVED",
      "tags": ["binary-search", "arrays"],
      "problem_link": "https://leetcode.com/problems/...",
      "solved_count": 2,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:00Z"
    }
  ]
}
```

#### Get Single Problem
```
GET /api/problems/{id}/

Headers: Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": 1,
  "problem_name": "Binary Search",
  "platform": "LEETCODE",
  "difficulty": "MEDIUM",
  "status": "SOLVED",
  "tags": ["binary-search"],
  "problem_link": "https://leetcode.com/problems/...",
  "solved_count": 2,
  "solutions": [
    {
      "id": 1,
      "language": "python",
      "code": "def search(nums, target):\n    ..."
    }
  ],
  "revisions": [
    {
      "id": 1,
      "revised_on": "2024-01-20T14:45:00Z",
      "next_revision": "2024-01-27T00:00:00Z"
    }
  ]
}
```

#### Create Problem
```
POST /api/problems/
Content-Type: application/json
Headers: Authorization: Bearer <access_token>

{
  "problem_name": "Binary Search",
  "platform": "LEETCODE",
  "difficulty": "MEDIUM",
  "status": "SOLVED",
  "tags": ["binary-search", "arrays"],
  "problem_link": "https://leetcode.com/problems/binary-search/"
}

Response: 201 Created
{
  "id": 1,
  "problem_name": "Binary Search",
  ...
}
```

#### Update Problem
```
PUT /api/problems/{id}/
Content-Type: application/json
Headers: Authorization: Bearer <access_token>

{
  "status": "TO_REVISE",
  "tags": ["binary-search", "arrays", "practice"]
}

Response: 200 OK
{
  "id": 1,
  "status": "TO_REVISE",
  ...
}
```

#### Delete Problem
```
DELETE /api/problems/{id}/
Headers: Authorization: Bearer <access_token>

Response: 204 No Content
```

### Solution Endpoints

#### List Solutions
```
GET /api/solutions/?problem={problem_id}

Headers: Authorization: Bearer <access_token>

Response: 200 OK
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "problem": 1,
      "language": "python",
      "code": "def search(nums, target):\n    ...",
      "approach": "Binary search algorithm",
      "time_complexity": "O(log n)",
      "space_complexity": "O(1)",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Create Solution
```
POST /api/solutions/
Content-Type: application/json
Headers: Authorization: Bearer <access_token>

{
  "problem": 1,
  "language": "python",
  "code": "def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
  "approach": "Binary search algorithm",
  "time_complexity": "O(log n)",
  "space_complexity": "O(1)"
}

Response: 201 Created
{
  "id": 1,
  "problem": 1,
  "language": "python",
  ...
}
```

### Collections Endpoints

#### List Collections
```
GET /api/collections/

Headers: Authorization: Bearer <access_token>

Response: 200 OK
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "name": "Binary Search",
      "description": "Problems related to binary search",
      "problems": [1, 2, 3],
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Create Collection
```
POST /api/collections/
Content-Type: application/json
Headers: Authorization: Bearer <access_token>

{
  "name": "Binary Search",
  "description": "Problems related to binary search",
  "problems": [1, 2, 3]
}

Response: 201 Created
{
  "id": 1,
  "name": "Binary Search",
  ...
}
```

### Code Execution Endpoint

#### Execute Code
```
POST /api/execute/
Content-Type: application/json
Headers: Authorization: Bearer <access_token>

{
  "language_id": 71,
  "source_code": "print('Hello, World!')",
  "stdin": ""
}

Response: 200 OK
{
  "token": "abc123def456",
  "status_id": 3,
  "stdout": "Hello, World!\n",
  "stderr": null,
  "time": "0.123",
  "memory": "12288",
  "exit_code": 0,
  "message": "Accepted"
}
```

**Common Language IDs:**
- Python: `71`
- JavaScript: `63`
- Java: `62`
- C++: `54`
- C: `50`
- Go: `60`
- Rust: `73`

---

## Screenshots and UI

### Key Pages to Include in Portfolio

1. **Login & Registration Page** - Clean, modern authentication form with input validation
2. **Dashboard** - Problem statistics, quick filters, search functionality, and problems table
3. **Add/Edit Problem Page** - Comprehensive form with all fields (platform, difficulty, status, tags, link)
4. **Problem Detail Page** - Full problem view with solutions, code editor, and revision history
5. **Code Editor & Execution** - Monaco Editor with syntax highlighting and output display
6. **Collections Page** - Organized collections management with problem counts
7. **Revisions Page** - Problems due for revision with scheduling UI

---

## Future Enhancements

### Phase 2 Features

- **Practice Mode**: Timed contests and mock interviews
- **Discussion Forum**: Community discussions for each problem
- **Solution Ratings**: Vote and rate community solutions
- **Progress Analytics**: Detailed charts and performance insights
- **Streak Tracking**: Daily coding streaks and gamification
- **Achievements/Badges**: Unlock badges for milestones

### Phase 3 Features

- **Team Collaboration**: Share problems with team members and track progress
- **Interview Prep**: Curated interview problem sets with difficulty progression
- **Mobile App**: Native iOS/Android applications with offline support
- **Video Tutorials**: Embedded video solutions and explanations
- **API Integrations**: Auto-sync with LeetCode API and other platforms

### Technical Improvements

- **Search Optimization**: Elasticsearch integration for lightning-fast search
- **Caching**: Redis caching for frequently accessed data
- **Rate Limiting**: API throttling and rate limiting
- **GraphQL**: GraphQL API alternative to REST for flexible queries
- **Microservices**: Scalable microservices architecture
- **CI/CD**: Automated testing, linting, and deployment pipelines
- **Monitoring**: Application performance monitoring (APM) and error tracking
- **Webhooks**: Real-time notifications for important events

---

## Contributing Guidelines

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**: `git clone https://github.com/yourusername/codevault.git`
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes** and commit with conventional commits
5. **Push to your fork** and create a Pull Request

### Code Style & Quality

**Backend (Python)**
```bash
# Follow PEP 8 style guide
# Run linting before committing
flake8 problems/
black problems/
```

**Frontend (JavaScript/React)**
```bash
# Run ESLint to check code quality
npm run lint

# Fix formatting issues automatically
npm run lint:fix
```

### Commit Message Conventions

```bash
git commit -m "feat: Add new feature description"
git commit -m "fix: Fix bug or issue description"
git commit -m "docs: Update documentation"
git commit -m "refactor: Refactor code section"
git commit -m "test: Add or update tests"
git commit -m "style: Fix formatting and style"
```

### Pull Request Process

1. Update relevant documentation (README, API docs, etc.)
2. Add or update tests for new features
3. Ensure all tests pass and linting is clean
4. Request review from maintainers
5. Address feedback and suggestions
6. Merge after final approval

### Reporting Issues

- **Bugs**: Create detailed issue with reproduction steps
- **Features**: Propose features in discussions before creating PR
- **Questions**: Use GitHub Discussions for questions

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

✅ **You can:**
- Use for commercial purposes
- Modify the source code
- Distribute the software
- Use privately

❌ **You cannot:**
- Sublicense without permission
- Hold liable the original authors
- Use the project's trademarks

📄 **You must:**
- Include license and copyright notice
- Document changes made to code

---

## Support & Resources

### Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide for fast setup
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed step-by-step setup instructions
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Backend deployment guide (Railway/Render)
- [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md) - Frontend deployment guide (Vercel)
- [API_EXAMPLES.md](API_EXAMPLES.md) - Practical API usage examples
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete project architecture overview

### External Resources

- [Django Official Documentation](https://docs.djangoproject.com/)
- [Django REST Framework Guide](https://www.django-rest-framework.org/)
- [React Official Documentation](https://react.dev/)
- [Vite Build Tool Guide](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Judge0 Code Execution API](https://ce.judge0.com/)

### Getting Help

- **Report Bugs**: [GitHub Issues](https://github.com/yourusername/codevault/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/codevault/discussions)
- **Email Support**: contact@codevault.dev

---

## Acknowledgments

- **Judge0**: For providing the powerful code execution API
- **Django Community**: For building and maintaining an excellent web framework
- **React Community**: For modern, component-based UI library
- **All Contributors**: Amazing developers contributing to improve CodeVault

---

## Project Status

✅ **Backend**: Production ready with all features implemented
✅ **Frontend**: Production ready with responsive design
🚀 **Deployment**: Ready for production deployment to Railway/Render + Vercel

**Current Version**: 1.0.0
**Last Updated**: January 2025
**Maintained By**: CodeVault Team

---

## Quick Links

- **Live Demo**: [Coming Soon]
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/codevault/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/codevault/discussions)
- **Documentation**: [All Docs](https://github.com/yourusername/codevault#documentation)

---

**Happy coding! 🎉**

Made with ❤️ by the CodeVault team
