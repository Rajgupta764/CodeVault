"""
Fix existing problems that have no next_revision_date set.
This migration will set next_revision_date to today for all problems that have null value.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from problems.models import Problem

# Find all problems with null next_revision_date
problems_without_date = Problem.objects.filter(next_revision_date__isnull=True)
count = problems_without_date.count()

print(f"Found {count} problems without next_revision_date")

if count > 0:
    # Set next_revision_date to today for all such problems
    today = timezone.now().date()
    updated = problems_without_date.update(next_revision_date=today)
    
    print(f"✅ Updated {updated} problems - they will now appear in revisions!")
    print("\nThese problems will show up in your Revisions page immediately.")
else:
    print("✅ All problems already have revision dates set!")
