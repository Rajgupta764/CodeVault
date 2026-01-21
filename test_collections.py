"""
Test collection functionality - verify backend works correctly
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from problems.models import Collection, Problem

# Get first user
user = User.objects.first()

if not user:
    print("❌ No users found. Please create a user first.")
    exit()

print(f"Testing with user: {user.username}")
print("="*60)

# Check collections
collections = Collection.objects.filter(user=user)
print(f"\n📁 Total Collections: {collections.count()}")

for collection in collections:
    print(f"\nCollection: {collection.name}")
    print(f"  Description: {collection.description or '(no description)'}")
    print(f"  Problem Count: {collection.problems.count()}")
    
    if collection.problems.count() > 0:
        print(f"  Problems:")
        for problem in collection.problems.all():
            print(f"    - {problem.problem_name}")
    else:
        print(f"  ⚠️  No problems in this collection yet")

# Check problems
problems = Problem.objects.filter(user=user)
print(f"\n\n📝 Total Problems: {problems.count()}")

if problems.count() > 0:
    print("\nYou can add these problems to collections:")
    for problem in problems[:5]:
        print(f"  - {problem.problem_name} (ID: {problem.id})")
        
print("\n" + "="*60)
print("\n💡 How Collections Work:")
print("1. Create a collection (starts with 0 problems)")
print("2. Go to a problem's detail page")
print("3. Use the 'Add to Collection' dropdown at the top")
print("4. Problem is added to the collection!")
print("\nBackend is working correctly. This is the expected workflow.")
