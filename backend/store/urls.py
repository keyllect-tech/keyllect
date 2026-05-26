from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, OrderViewSet, RegisterView, LoginView, GoogleLoginView, CheckoutAPIView, MyOrdersAPIView, SubmitReviewAPIView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('checkout/', CheckoutAPIView.as_view(), name='checkout'),
    path('orders/my-orders/', MyOrdersAPIView.as_view(), name='my_orders'),
    path('submit-review/', SubmitReviewAPIView.as_view(), name='submit_review'),
    path('', include(router.urls)),
]
