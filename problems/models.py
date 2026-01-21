from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.utils import timezone


class Problem(models.Model):
    """Model for tracking coding problems from various platforms."""
    
    PLATFORM_CHOICES = [
        ('LEETCODE', 'LeetCode'),
        ('GFG', 'GeeksforGeeks'),
        ('CODEFORCES', 'CodeForces'),
    ]
    
    DIFFICULTY_CHOICES = [
        ('EASY', 'Easy'),
        ('MEDIUM', 'Medium'),
        ('HARD', 'Hard'),
    ]
    
    STATUS_CHOICES = [
        ('SOLVED', 'Solved'),
        ('ATTEMPTED', 'Attempted'),
        ('TO_REVISE', 'To Revise'),
    ]
    
    # User and Basic Info
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='problems')
    problem_name = models.CharField(max_length=255)
    problem_link = models.URLField(max_length=500, blank=True, null=True)
    
    # Problem Details
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, default='LEETCODE')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='MEDIUM')
    tags = models.JSONField(default=list, help_text="Array of problem tags")
    
    # Tracking Info
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='ATTEMPTED')
    solved_count = models.PositiveIntegerField(default=0)
    last_solved = models.DateTimeField(null=True, blank=True)
    next_revision_date = models.DateField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Problem'
        verbose_name_plural = 'Problems'
    
    def __str__(self):
        return f"{self.problem_name} ({self.platform})"
    
    def mark_revised(self):
        """
        Mark problem as revised using spaced repetition algorithm.
        Updates solved_count, last_solved, and calculates next_revision_date.
        
        Spaced repetition intervals:
        - 1st revision: +1 day
        - 2nd revision: +3 days
        - 3rd revision: +7 days
        - 4th revision: +14 days
        - 5th+ revision: +30 days
        """
        # Increment solved count
        self.solved_count += 1
        
        # Update last solved timestamp
        self.last_solved = timezone.now()
        
        # Calculate next revision date based on spaced repetition
        intervals = {
            1: 1,    # Day 1
            2: 3,    # Day 4 (1+3)
            3: 7,    # Day 11 (1+3+7)
            4: 14,   # Day 25 (1+3+7+14)
        }
        
        # Get interval days based on solved_count
        if self.solved_count in intervals:
            days_to_add = intervals[self.solved_count]
        else:
            days_to_add = 30  # Default to 30 days for 5+ revisions
        
        # Calculate next revision date
        today = timezone.now().date()
        self.next_revision_date = today + timedelta(days=days_to_add)
        
        # Update status to TO_REVISE to indicate it needs future revision
        self.status = 'TO_REVISE'
        
        self.save()
        return self


class Solution(models.Model):
    """Model for storing different solutions to a problem."""
    
    APPROACH_CHOICES = [
        ('BRUTE_FORCE', 'Brute Force'),
        ('BETTER', 'Better'),
        ('OPTIMAL', 'Optimal'),
    ]
    
    LANGUAGE_CHOICES = [
        ('JAVA', 'Java'),
        ('PYTHON', 'Python'),
        ('CPP', 'C++'),
        ('JAVASCRIPT', 'JavaScript'),
    ]
    
    # Relationship
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='solutions')
    
    # Solution Details
    approach = models.CharField(max_length=20, choices=APPROACH_CHOICES, default='OPTIMAL')
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='PYTHON')
    code = models.TextField(help_text="Full solution code")
    
    # Complexity Analysis
    time_complexity = models.CharField(max_length=100, blank=True, help_text="e.g., O(n log n)")
    space_complexity = models.CharField(max_length=100, blank=True, help_text="e.g., O(n)")
    
    # Notes
    notes = models.TextField(blank=True, null=True, help_text="Additional notes or explanation")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Solution'
        verbose_name_plural = 'Solutions'
    
    def __str__(self):
        return f"{self.get_approach_display()} {self.get_language_display()} - {self.problem.problem_name}"


class Collection(models.Model):
    """Model for organizing problems into collections/groups."""
    
    # User and Basic Info
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collections')
    name = models.CharField(max_length=255, help_text="Collection name")
    description = models.TextField(blank=True, null=True, help_text="Optional collection description")
    
    # Many-to-Many relationship with Problems
    problems = models.ManyToManyField(Problem, related_name='collections', blank=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Collection'
        verbose_name_plural = 'Collections'
        unique_together = [['user', 'name']]  # Prevent duplicate collection names per user
    
    def __str__(self):
        return f"{self.name} ({self.user.username})"
    
    def problem_count(self):
        """Return the number of problems in this collection."""
        return self.problems.count()
