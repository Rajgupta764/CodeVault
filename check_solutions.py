"""
Check existing solutions to see time/space complexity data
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.models import Solution

solutions = Solution.objects.all()[:5]

print(f"Total solutions: {Solution.objects.count()}")
print("\n" + "="*60)

for sol in solutions:
    print(f"\nSolution ID: {sol.id}")
    print(f"Problem: {sol.problem.title}")
    print(f"Language: {sol.language}")
    print(f"Approach: {sol.approach}")
    print(f"Time Complexity: '{sol.time_complexity}' (empty: {not sol.time_complexity})")
    print(f"Space Complexity: '{sol.space_complexity}' (empty: {not sol.space_complexity})")
    print("-"*60)

if Solution.objects.count() == 0:
    print("\n❌ No solutions found in database!")
    print("The complexity boxes are empty because users haven't filled them when adding solutions.")
else:
    empty_count = Solution.objects.filter(time_complexity='', space_complexity='').count()
    print(f"\n📊 Solutions with empty complexity fields: {empty_count}/{Solution.objects.count()}")
