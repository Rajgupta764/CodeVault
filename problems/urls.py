from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import ProblemViewSet, SolutionViewSet, CollectionViewSet, RegisterView, run_code

# Create router and register viewsets
router = DefaultRouter()
router.register(r'problems', ProblemViewSet, basename='problem')
router.register(r'solutions', SolutionViewSet, basename='solution')
router.register(r'collections', CollectionViewSet, basename='collection')

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Code execution endpoint
    path('execute/', run_code, name='execute_code'),
    
    # ViewSet routes
    path('', include(router.urls)),
]
