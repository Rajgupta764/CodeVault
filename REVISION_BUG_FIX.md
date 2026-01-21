# ✅ BUG FIX: Revisions Not Showing Problems

## Problem
When adding problems to collections, they were **not appearing in the Revisions page**.

## Root Cause
When problems are created, the `next_revision_date` field was `null` by default. The revisions page only shows problems where:
```python
next_revision_date <= today
```

So problems with `null` revision dates were **invisible** to the revision system.

## Solution Implemented

### 1. Fixed Backend (problems/views.py)
Updated `ProblemViewSet.perform_create()` to automatically set `next_revision_date` to today when a problem is created:

```python
def perform_create(self, serializer):
    """
    Automatically assign the current user when creating a problem.
    Sets initial next_revision_date to today so problem appears in revisions immediately.
    """
    from django.utils import timezone
    problem = serializer.save(
        user=self.request.user,
        next_revision_date=timezone.now().date()  # Set to today
    )
```

### 2. Fixed Existing Problems
Ran migration script that updated **4 existing problems** that had null revision dates:
```
✅ Updated 4 problems - they will now appear in revisions!
```

## How It Works Now

### When You Add a New Problem:
1. Create problem with any details
2. **Automatically** gets `next_revision_date = today`
3. **Immediately appears** in Revisions page
4. You can mark it as revised to start the spaced repetition schedule

### Spaced Repetition Schedule:
After marking as revised, the system schedules future revisions:
- 1st revision: +1 day
- 2nd revision: +3 days
- 3rd revision: +7 days
- 4th revision: +14 days
- 5th+ revision: +30 days

## Test It Now

1. **Go to Revisions page** - Your 4 existing problems should now be visible
2. **Add a new problem** - It will appear in revisions immediately
3. **Mark as revised** - It will be scheduled for future revision

## Files Modified

- ✅ [problems/views.py](problems/views.py#L127-L133) - Added auto-set next_revision_date
- ✅ [fix_revision_dates.py](fix_revision_dates.py) - Migration script (already run)

---

**Your revision system is now working correctly!** 🎉
