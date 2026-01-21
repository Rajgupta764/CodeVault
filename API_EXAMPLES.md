# API Usage Examples - CodeVault

## 🔑 Getting Authentication Token

### Using curl:
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

Save the `access` token for authenticated requests.

---

## 📚 Problem Management

### 1. List All Problems (No Auth Required)

```bash
curl http://127.0.0.1:8000/api/problems/
```

**Response:**
```json
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "title": "Two Sum",
            "difficulty": "EASY",
            "tags": "array,hash-table",
            "created_by": {
                "id": 1,
                "username": "admin",
                "email": "admin@example.com"
            },
            "created_at": "2026-01-20T10:30:00Z",
            "solutions_count": 3
        }
    ]
}
```

### 2. Get Specific Problem

```bash
curl http://127.0.0.1:8000/api/problems/1/
```

**Response:**
```json
{
    "id": 1,
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target...",
    "difficulty": "EASY",
    "tags": "array,hash-table",
    "created_by": {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z",
    "solutions": [],
    "solutions_count": 0
}
```

### 3. Create New Problem (Auth Required)

```bash
curl -X POST http://127.0.0.1:8000/api/problems/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    "difficulty": "EASY",
    "tags": "array,hash-table"
  }'
```

**Response (201 Created):**
```json
{
    "id": 1,
    "title": "Two Sum",
    "description": "Given an array of integers nums...",
    "difficulty": "EASY",
    "tags": "array,hash-table",
    "created_by": {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "first_name": "",
        "last_name": ""
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z",
    "solutions": [],
    "solutions_count": 0
}
```

### 4. Update Problem (Auth Required, Owner Only)

```bash
curl -X PUT http://127.0.0.1:8000/api/problems/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum - Updated",
    "description": "Updated description...",
    "difficulty": "MEDIUM",
    "tags": "array,hash-table,sorting"
  }'
```

### 5. Delete Problem (Auth Required, Owner Only)

```bash
curl -X DELETE http://127.0.0.1:8000/api/problems/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Filter Problems by Difficulty

```bash
# Get only EASY problems
curl http://127.0.0.1:8000/api/problems/?difficulty=EASY

# Get only HARD problems
curl http://127.0.0.1:8000/api/problems/?difficulty=HARD
```

### 7. Search Problems

```bash
# Search for "array" in title or description
curl "http://127.0.0.1:8000/api/problems/?search=array"

# Search for "sorting"
curl "http://127.0.0.1:8000/api/problems/?search=sorting"
```

### 8. Order Problems

```bash
# Order by newest first (default)
curl http://127.0.0.1:8000/api/problems/?ordering=-created_at

# Order by oldest first
curl http://127.0.0.1:8000/api/problems/?ordering=created_at

# Order by difficulty
curl http://127.0.0.1:8000/api/problems/?ordering=difficulty
```

---

## 💾 Solution Management

### 1. Submit Solution (Auth Required)

```bash
curl -X POST http://127.0.0.1:8000/api/problems/1/submit_solution/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i",
    "language": "python"
  }'
```

**Response:**
```json
{
    "id": 1,
    "problem": 1,
    "code": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i",
    "language": "python",
    "submitted_by": {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com"
    },
    "submitted_at": "2026-01-20T10:35:00Z"
}
```

### 2. Get All Solutions for Problem

```bash
curl http://127.0.0.1:8000/api/problems/1/solutions/
```

**Response:**
```json
[
    {
        "id": 1,
        "problem": 1,
        "code": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i",
        "language": "python",
        "submitted_by": {
            "id": 1,
            "username": "admin",
            "email": "admin@example.com"
        },
        "submitted_at": "2026-01-20T10:35:00Z"
    }
]
```

### 3. List All Solutions (Auth Required)

```bash
curl http://127.0.0.1:8000/api/solutions/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Get Your Solutions (Auth Required)

```bash
curl http://127.0.0.1:8000/api/solutions/my_solutions/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Filter Solutions by Language

```bash
curl "http://127.0.0.1:8000/api/solutions/?language=python" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔄 Token Refresh

When your access token expires:

```bash
curl -X POST http://127.0.0.1:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 📊 Pagination Example

Problems are paginated with 10 items per page:

```bash
# Get page 1 (default)
curl http://127.0.0.1:8000/api/problems/

# Get page 2
curl http://127.0.0.1:8000/api/problems/?page=2

# Get page 3
curl http://127.0.0.1:8000/api/problems/?page=3
```

---

## 🛠️ Python Examples

### Using requests library:

```python
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

# Get token
response = requests.post(
    f"{BASE_URL}/token/",
    json={"username": "admin", "password": "your_password"}
)
token = response.json()["access"]

# Create problem
headers = {"Authorization": f"Bearer {token}"}
problem_data = {
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "difficulty": "EASY",
    "tags": "array"
}
response = requests.post(
    f"{BASE_URL}/problems/",
    headers=headers,
    json=problem_data
)
print(response.json())

# Get all problems
response = requests.get(f"{BASE_URL}/problems/")
problems = response.json()
print(json.dumps(problems, indent=2))

# Submit solution
solution_data = {
    "code": "def twoSum(nums, target): ...",
    "language": "python"
}
response = requests.post(
    f"{BASE_URL}/problems/1/submit_solution/",
    headers=headers,
    json=solution_data
)
print(response.json())
```

---

## ⚠️ Common Error Responses

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```
**Solution:** Add `Authorization: Bearer YOUR_TOKEN` header

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```
**Solution:** Only the owner can update/delete

### 404 Not Found
```json
{
    "detail": "Not found."
}
```
**Solution:** Problem/Solution ID doesn't exist

### 400 Bad Request
```json
{
    "title": ["This field may not be blank."],
    "difficulty": ["\"INVALID\" is not a valid choice."]
}
```
**Solution:** Check your request data

---

## 📝 Complete Workflow Example

```bash
#!/bin/bash

BASE_URL="http://127.0.0.1:8000/api"

# 1. Get token
echo "Getting authentication token..."
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/token/" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}')

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# 2. Create problem
echo "Creating problem..."
PROBLEM_RESPONSE=$(curl -s -X POST "$BASE_URL/problems/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Two Sum",
    "description":"Find two numbers",
    "difficulty":"EASY",
    "tags":"array"
  }')

PROBLEM_ID=$(echo $PROBLEM_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Problem ID: $PROBLEM_ID"

# 3. List all problems
echo "Listing problems..."
curl -s "$BASE_URL/problems/" | jq

# 4. Submit solution
echo "Submitting solution..."
curl -s -X POST "$BASE_URL/problems/$PROBLEM_ID/submit_solution/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code":"def twoSum(nums, target): return [0, 1]",
    "language":"python"
  }' | jq

# 5. Get problem with solutions
echo "Getting problem with solutions..."
curl -s "$BASE_URL/problems/$PROBLEM_ID/" | jq
```

---

## 🎯 Quick Reference Commands

```bash
# List problems (no auth)
curl http://127.0.0.1:8000/api/problems/

# Get token
curl -X POST http://127.0.0.1:8000/api/token/ \
  -d '{"username":"admin","password":"pass"}' \
  -H "Content-Type: application/json"

# Create problem (with token)
curl -X POST http://127.0.0.1:8000/api/problems/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Problem","description":"Desc","difficulty":"EASY"}'

# Submit solution (with token)
curl -X POST http://127.0.0.1:8000/api/problems/1/submit_solution/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"code here","language":"python"}'
```

---

## Happy Testing! 🚀

For more details, see the POSTMAN_COLLECTION.json file or visit the API in your browser at:
- http://127.0.0.1:8000/api/problems/
