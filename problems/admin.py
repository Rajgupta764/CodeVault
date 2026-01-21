from django.contrib import admin
from .models import Problem, Solution, Collection


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    """Admin interface for Problem model with advanced filtering and search."""
    
    list_display = ('problem_name', 'user', 'difficulty', 'platform', 'status', 'solved_count')
    list_filter = ('difficulty', 'platform', 'status')
    search_fields = ('problem_name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Problem Information', {
            'fields': ('user', 'problem_name', 'problem_link', 'platform', 'difficulty', 'tags')
        }),
        ('Tracking', {
            'fields': ('status', 'solved_count', 'last_solved', 'next_revision_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    """Admin interface for Solution model with filtering and search capabilities."""
    
    list_display = ('problem', 'approach', 'language', 'created_at')
    list_filter = ('approach', 'language')
    search_fields = ('problem__problem_name', 'code')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Solution Information', {
            'fields': ('problem', 'approach', 'language', 'code')
        }),
        ('Complexity Analysis', {
            'fields': ('time_complexity', 'space_complexity')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    """Admin interface for Collection model with filtering and search capabilities."""
    
    list_display = ('name', 'user', 'problem_count', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('name', 'description', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('problems',)  # Makes it easier to add/remove problems
    
    fieldsets = (
        ('Collection Information', {
            'fields': ('user', 'name', 'description')
        }),
        ('Problems', {
            'fields': ('problems',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def problem_count(self, obj):
        """Display problem count in list view."""
        return obj.problems.count()
    
    problem_count.short_description = 'Problems'
