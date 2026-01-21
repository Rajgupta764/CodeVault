from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Problem, Solution, Collection


class UserSerializer(serializers.ModelSerializer):
    """Serializer for basic user information."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        read_only_fields = ['id']


class SolutionSerializer(serializers.ModelSerializer):
    """Serializer for Solution model with all fields."""
    
    class Meta:
        model = Solution
        fields = [
            'id',
            'problem',
            'approach',
            'language',
            'code',
            'time_complexity',
            'space_complexity',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProblemSerializer(serializers.ModelSerializer):
    """Serializer for Problem model with nested solutions and solution count."""
    
    # Nested read-only solutions
    solutions = SolutionSerializer(many=True, read_only=True)
    
    # User information
    user = UserSerializer(read_only=True)
    
    # Custom field for solution count
    solution_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Problem
        fields = [
            'id',
            'user',
            'problem_name',
            'problem_link',
            'platform',
            'difficulty',
            'tags',
            'status',
            'solved_count',
            'last_solved',
            'next_revision_date',
            'created_at',
            'updated_at',
            'solutions',
            'solution_count',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_solution_count(self, obj):
        """Return the count of solutions for this problem."""
        return obj.solutions.count()


class ProblemListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Problem list view (without nested solutions)."""
    
    user = UserSerializer(read_only=True)
    solution_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Problem
        fields = [
            'id',
            'user',
            'problem_name',
            'platform',
            'difficulty',
            'status',
            'solved_count',
            'created_at',
            'solution_count',
        ]
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_solution_count(self, obj):
        """Return the count of solutions for this problem."""
        return obj.solutions.count()


class CollectionSerializer(serializers.ModelSerializer):
    """Serializer for Collection model with problem details."""
    
    # User information
    user = UserSerializer(read_only=True)
    
    # Nested problems with simplified data
    problems = ProblemListSerializer(many=True, read_only=True)
    
    # Custom field for problem count
    problem_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Collection
        fields = [
            'id',
            'user',
            'name',
            'description',
            'problems',
            'problem_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_problem_count(self, obj):
        """Return the count of problems in this collection."""
        return obj.problems.count()


class CollectionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Collection list view (without nested problems)."""
    
    user = UserSerializer(read_only=True)
    problem_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Collection
        fields = [
            'id',
            'user',
            'name',
            'description',
            'problem_count',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_problem_count(self, obj):
        """Return the count of problems in this collection."""
        return obj.problems.count()
