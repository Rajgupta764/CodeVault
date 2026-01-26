from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.utils import timezone

from .models import Problem, Solution, Collection
from .serializers import ProblemSerializer, ProblemListSerializer, SolutionSerializer, UserSerializer, CollectionSerializer, CollectionListSerializer
from .services import execute_code, run_test_cases


class RegisterView(APIView):
    """
    User registration endpoint.
    Allows any user to register with username, email, and password.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Register a new user.
        
        Expected POST data:
        {
            "username": "string",
            "email": "string",
            "password": "string"
        }
        
        Returns:
            201 Created: User created successfully with user data
            400 Bad Request: Validation errors
        """
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Validate all required fields are provided
        if not username or not email or not password:
            return Response(
                {
                    'error': 'username, email, and password are required',
                    'username': 'required' if not username else None,
                    'email': 'required' if not email else None,
                    'password': 'required' if not password else None,
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': f'Username "{username}" is already taken'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': f'Email "{email}" is already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate password length
        if len(password) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters long'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create user with hashed password
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # Serialize and return user data
            serializer = UserSerializer(user)
            return Response(
                {
                    'message': 'User registered successfully',
                    'user': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': f'An error occurred during registration: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ProblemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Problem model.
    - Filters problems to show only those belonging to the logged-in user
    - Auto-assigns the current user on problem creation
    - Provides statistics on problem difficulty distribution
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['difficulty', 'platform', 'status']
    search_fields = ['problem_name', 'tags']
    ordering_fields = ['created_at', 'difficulty', 'solved_count']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        """Filter problems to only show those belonging to the current user."""
        return Problem.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Use simplified serializer for list view, detailed serializer for other actions."""
        if self.action == 'list':
            return ProblemListSerializer
        return ProblemSerializer
    
    def perform_create(self, serializer):
        """
        Automatically assign the current user when creating a problem.
        Sets initial next_revision_date to today so problem appears in revisions immediately.
        """
        from django.utils import timezone
        problem = serializer.save(
            user=self.request.user,
            next_revision_date=timezone.now().date()  # Set to today so it appears in revisions
        )
    
    def perform_update(self, serializer):
        """Ensure user can only update their own problems."""
        problem = self.get_object()
        if problem.user != self.request.user:
            raise PermissionError("You can only update your own problems")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Ensure user can only delete their own problems."""
        if instance.user != self.request.user:
            raise PermissionError("You can only delete your own problems")
        instance.delete()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def stats(self, request):
        """
        Get statistics about the current user's problems.
        
        Returns:
            {
                "total_count": integer,
                "easy_count": integer,
                "medium_count": integer,
                "hard_count": integer,
                "solved_count": integer,
                "attempted_count": integer,
                "to_revise_count": integer,
                "by_platform": {
                    "LEETCODE": integer,
                    "GFG": integer,
                    "CODEFORCES": integer
                }
            }
        """
        user_problems = self.get_queryset()
        
        # Difficulty statistics
        easy_count = user_problems.filter(difficulty='EASY').count()
        medium_count = user_problems.filter(difficulty='MEDIUM').count()
        hard_count = user_problems.filter(difficulty='HARD').count()
        
        # Status statistics
        solved_count = user_problems.filter(status='SOLVED').count()
        attempted_count = user_problems.filter(status='ATTEMPTED').count()
        to_revise_count = user_problems.filter(status='TO_REVISE').count()
        
        # Platform statistics
        leetcode_count = user_problems.filter(platform='LEETCODE').count()
        gfg_count = user_problems.filter(platform='GFG').count()
        codeforces_count = user_problems.filter(platform='CODEFORCES').count()
        
        stats_data = {
            'total_count': user_problems.count(),
            'difficulty': {
                'easy': easy_count,
                'medium': medium_count,
                'hard': hard_count,
            },
            'status': {
                'solved': solved_count,
                'attempted': attempted_count,
                'to_revise': to_revise_count,
            },
            'by_platform': {
                'leetcode': leetcode_count,
                'gfg': gfg_count,
                'codeforces': codeforces_count,
            }
        }
        
        return Response(stats_data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def submit_solution(self, request, pk=None):
        """
        Custom action to submit a solution for a problem.
        Expected POST data: 
        {
            'approach': 'OPTIMAL',
            'language': 'PYTHON',
            'code': '...',
            'time_complexity': 'O(n)',
            'space_complexity': 'O(1)',
            'notes': '...'
        }
        """
        problem = self.get_object()
        serializer = SolutionSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(problem=problem)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def solutions(self, request, pk=None):
        """Get all solutions for a specific problem."""
        problem = self.get_object()
        solutions = problem.solutions.all()
        serializer = SolutionSerializer(solutions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_revised(self, request, pk=None):
        """
        Mark a problem as revised using spaced repetition algorithm.
        Updates solved_count, last_solved, and calculates next_revision_date.
        
        POST /api/problems/{id}/mark_revised/
        
        Returns:
            200 OK: Problem marked as revised with updated data
            404 Not Found: Problem not found
        """
        problem = self.get_object()
        
        # Ensure user can only mark their own problems
        if problem.user != request.user:
            return Response(
                {'error': 'You can only mark your own problems as revised'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Call the mark_revised method on the problem
        problem.mark_revised()
        
        # Serialize and return updated problem data
        serializer = self.get_serializer(problem)
        return Response({
            'message': 'Problem marked as revised successfully',
            'problem': serializer.data,
            'next_revision_date': problem.next_revision_date,
            'solved_count': problem.solved_count
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def revision_due(self, request):
        """
        Get all problems that are due for revision (next_revision_date <= today).
        
        GET /api/problems/revision_due/
        
        Returns:
            200 OK: List of problems due for revision
        """
        today = timezone.now().date()
        
        # Filter problems where next_revision_date is today or in the past
        due_problems = self.get_queryset().filter(
            next_revision_date__lte=today
        ).order_by('next_revision_date')
        
        # Serialize and return the problems
        serializer = self.get_serializer(due_problems, many=True)
        
        return Response({
            'count': due_problems.count(),
            'problems': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def run_tests(self, request, pk=None):
        """
        Run code against problem's test cases (LeetCode-style).
        
        POST /api/problems/{id}/run_tests/
        
        Expected POST data:
        {
            "language": "PYTHON",
            "code": "def solution():\\n    return 42"
        }
        
        Returns:
            200 OK: Test results with pass/fail status
            400 Bad Request: Missing required fields or no test cases
            403 Forbidden: User doesn't own the problem
        """
        problem = self.get_object()
        
        # Check if problem has test cases
        if not problem.test_cases:
            return Response(
                {'error': 'This problem has no test cases defined'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get language and code from request
        language = request.data.get('language')
        code = request.data.get('code')
        
        if not language or not code:
            return Response(
                {'error': 'Both language and code are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Run test cases
        try:
            results = run_test_cases(language, code, problem.test_cases)
            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Failed to run tests: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SolutionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Solution model.
    - Filters solutions to only show those for the current user's problems
    - Supports filtering by problem_id query parameter
    - On creation: increments problem's solved_count, updates last_solved, and sets status to Solved
    """
    serializer_class = SolutionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    
    filterset_fields = ['language', 'approach']
    search_fields = ['code', 'notes']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filter solutions to only show those for the current user's problems.
        Also supports optional problem_id query parameter for filtering by specific problem.
        """
        # Get user's problems
        user_problems = Problem.objects.filter(user=self.request.user)
        
        # Start with solutions for user's problems
        queryset = Solution.objects.filter(problem__in=user_problems)
        
        # Optional filter by problem_id query parameter
        problem_id = self.request.query_params.get('problem_id', None)
        if problem_id is not None:
            try:
                problem_id = int(problem_id)
                # Verify the problem belongs to the current user
                if not user_problems.filter(id=problem_id).exists():
                    return Solution.objects.none()
                queryset = queryset.filter(problem_id=problem_id)
            except (ValueError, TypeError):
                return Solution.objects.none()
        
        return queryset
    
    def perform_create(self, serializer):
        """
        Create a new solution and update the associated problem:
        - Increment solved_count
        - Update last_solved to current datetime
        - Set problem status to 'SOLVED'
        """
        # Get the problem from the request data
        problem_id = self.request.data.get('problem')
        
        if not problem_id:
            raise ValueError("problem field is required")
        
        try:
            problem = Problem.objects.get(id=problem_id, user=self.request.user)
        except Problem.DoesNotExist:
            raise PermissionError("Problem not found or does not belong to you")
        
        # Save the solution
        solution = serializer.save(problem=problem)
        
        # Update problem statistics
        problem.solved_count += 1
        problem.status = 'SOLVED'
        problem.last_solved = solution.created_at
        problem.save()
    
    def perform_update(self, serializer):
        """Ensure user can only update solutions for their own problems."""
        solution = self.get_object()
        if solution.problem.user != self.request.user:
            raise PermissionError("You can only update solutions for your own problems")
        serializer.save()
    
    def perform_destroy(self, instance):
        """
        Ensure user can only delete solutions for their own problems.
        Optionally decrement the problem's solved_count if needed.
        """
        if instance.problem.user != self.request.user:
            raise PermissionError("You can only delete solutions for your own problems")
        instance.delete()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_solutions(self, request):
        """Get all solutions submitted by the current user."""
        solutions = self.get_queryset()
        serializer = self.get_serializer(solutions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def by_approach(self, request):
        """
        Get solutions grouped by approach.
        
        Returns:
            {
                "BRUTE_FORCE": [solution objects],
                "BETTER": [solution objects],
                "OPTIMAL": [solution objects]
            }
        """
        queryset = self.get_queryset()
        
        grouped_solutions = {
            'BRUTE_FORCE': SolutionSerializer(queryset.filter(approach='BRUTE_FORCE'), many=True).data,
            'BETTER': SolutionSerializer(queryset.filter(approach='BETTER'), many=True).data,
            'OPTIMAL': SolutionSerializer(queryset.filter(approach='OPTIMAL'), many=True).data,
        }
        
        return Response(grouped_solutions, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def by_language(self, request):
        """
        Get solutions grouped by programming language.
        
        Returns:
            {
                "PYTHON": integer,
                "JAVA": integer,
                "CPP": integer,
                "JAVASCRIPT": integer
            }
        """
        queryset = self.get_queryset()
        
        language_stats = {
            'PYTHON': queryset.filter(language='PYTHON').count(),
            'JAVA': queryset.filter(language='JAVA').count(),
            'CPP': queryset.filter(language='CPP').count(),
            'JAVASCRIPT': queryset.filter(language='JAVASCRIPT').count(),
        }
        
        return Response(language_stats, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def run_code(request):
    """
    Execute code using Judge0 API.
    
    POST /api/execute/
    
    Request Body:
    {
        "language": "PYTHON",  // JAVA, PYTHON, CPP, JAVASCRIPT
        "code": "print('Hello World')",
        "input": ""  // optional stdin input
    }
    
    Response:
    {
        "output": "Hello World\n",
        "error": "",
        "status": "Accepted",
        "status_id": 3,
        "time": "0.001",
        "memory": 4096,
        "compile_output": ""
    }
    """
    # Extract request data
    language = request.data.get('language', '').upper()
    code = request.data.get('code', '')
    input_data = request.data.get('input', '')
    
    # Validate required fields
    if not language:
        return Response(
            {'error': 'language field is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not code or not code.strip():
        return Response(
            {'error': 'code field is required and cannot be empty'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate language
    supported_languages = ['JAVA', 'PYTHON', 'CPP', 'JAVASCRIPT']
    if language not in supported_languages:
        return Response(
            {
                'error': f'Unsupported language: {language}',
                'supported': supported_languages
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Execute code
        result = execute_code(language, code, input_data)
        return Response(result, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {
                'error': f'Code execution failed: {str(e)}',
                'output': '',
                'status': 'Error'
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class CollectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Collection model.
    - Filters collections to show only those belonging to the logged-in user
    - Auto-assigns the current user on collection creation
    - Provides custom action to add problems to collections
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter collections to only show those belonging to the current user."""
        return Collection.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Use simplified serializer for list view, detailed serializer for other actions."""
        if self.action == 'list':
            return CollectionListSerializer
        return CollectionSerializer
    
    def perform_create(self, serializer):
        """Automatically assign the current user when creating a collection."""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Ensure user can only update their own collections."""
        collection = self.get_object()
        if collection.user != self.request.user:
            raise PermissionError("You can only update your own collections")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Ensure user can only delete their own collections."""
        if instance.user != self.request.user:
            raise PermissionError("You can only delete your own collections")
        instance.delete()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_problem(self, request, pk=None):
        """
        Add a problem to this collection.
        
        POST /api/collections/{id}/add_problem/
        
        Expected POST data:
        {
            "problem_id": integer
        }
        
        Returns:
            200 OK: Problem added to collection successfully
            400 Bad Request: Invalid problem_id or problem already in collection
            403 Forbidden: User doesn't own the collection or problem
            404 Not Found: Collection or problem not found
        """
        collection = self.get_object()
        
        # Ensure user owns the collection
        if collection.user != request.user:
            return Response(
                {'error': 'You can only add problems to your own collections'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get problem_id from request
        problem_id = request.data.get('problem_id')
        
        if not problem_id:
            return Response(
                {'error': 'problem_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get the problem
            problem = Problem.objects.get(id=problem_id, user=request.user)
        except Problem.DoesNotExist:
            return Response(
                {'error': f'Problem with id {problem_id} not found or does not belong to you'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if problem is already in collection
        if collection.problems.filter(id=problem_id).exists():
            return Response(
                {'error': 'Problem is already in this collection'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add problem to collection
        collection.problems.add(problem)
        
        # Serialize and return updated collection
        serializer = self.get_serializer(collection)
        return Response({
            'message': f'Problem "{problem.problem_name}" added to collection "{collection.name}"',
            'collection': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_problem(self, request, pk=None):
        """
        Remove a problem from this collection.
        
        POST /api/collections/{id}/remove_problem/
        
        Expected POST data:
        {
            "problem_id": integer
        }
        
        Returns:
            200 OK: Problem removed from collection successfully
            400 Bad Request: Invalid problem_id
            403 Forbidden: User doesn't own the collection
            404 Not Found: Collection or problem not found
        """
        collection = self.get_object()
        
        # Ensure user owns the collection
        if collection.user != request.user:
            return Response(
                {'error': 'You can only remove problems from your own collections'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get problem_id from request
        problem_id = request.data.get('problem_id')
        
        if not problem_id:
            return Response(
                {'error': 'problem_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get the problem
            problem = Problem.objects.get(id=problem_id)
        except Problem.DoesNotExist:
            return Response(
                {'error': f'Problem with id {problem_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if problem is in collection
        if not collection.problems.filter(id=problem_id).exists():
            return Response(
                {'error': 'Problem is not in this collection'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Remove problem from collection
        collection.problems.remove(problem)
        
        # Serialize and return updated collection
        serializer = self.get_serializer(collection)
        return Response({
            'message': f'Problem "{problem.problem_name}" removed from collection "{collection.name}"',
            'collection': serializer.data
        }, status=status.HTTP_200_OK)
