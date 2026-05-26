from rest_framework import viewsets, permissions
from .models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['category__slug', 'brand', 'in_stock']

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action in ['create', 'metadata']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Customer
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone')
        password = request.data.get('password')
        if not phone or not password:
            return Response({'error': 'Телефон и пароль обязательны'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=phone).exists() or Customer.objects.filter(phone=phone).exists():
            return Response({'error': 'Пользователь с таким телефоном уже существует'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create(username=phone, password=make_password(password))
        Customer.objects.create(user=user, phone=phone, raw_password=password)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Токен обязателен'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            import requests
            import os
            os.environ.pop('SSLKEYLOGFILE', None)
            response = requests.get(f'https://oauth2.googleapis.com/tokeninfo?id_token={token}')
            if response.status_code != 200:
                return Response({'error': 'Неверный токен Google'}, status=status.HTTP_400_BAD_REQUEST)
            
            data = response.json()
            email = data.get('email')
            if not email:
                return Response({'error': 'Email не найден в токене'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists, else create
            user, created = User.objects.get_or_create(username=email, defaults={'email': email})
            if created:
                user.set_unusable_password()
                user.save()
                Customer.objects.create(user=user, phone=email, raw_password="Google Login")
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'phone': email,
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone')
        password = request.data.get('password')
        try:
            customer = Customer.objects.get(phone=phone)
            user = authenticate(username=customer.user.username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({'error': 'Неверный пароль'}, status=status.HTTP_401_UNAUTHORIZED)
        except Customer.DoesNotExist:
            return Response({'error': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)

class CheckoutAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        try:
            # Try to get the customer if user is authenticated
            customer = None
            if request.user.is_authenticated:
                try:
                    from .models import Customer
                    customer = Customer.objects.get(user=request.user)
                except:
                    pass

            # Create order without strict item foreign key validation
            order = Order.objects.create(
                order_number=data.get('order_number'),
                customer=customer,
                client_name=data.get('client_name'),
                phone=data.get('phone'),
                address=data.get('address'),
                total_amount=data.get('total_amount', 0),
            )
            
            # We skip creating OrderItems in DB because frontend uses mock data
            # Instead, we directly parse items for Telegram
            items = data.get('items', [])
            items_text = "\n".join([f"• {item.get('name', 'Товар')} × {item.get('quantity', 1)}" for item in items])
            
            # Send Telegram notification
            import os
            import requests
            import html
            from django.conf import settings
            os.environ.pop('SSLKEYLOGFILE', None)
            
            token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
            chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
            
            if token and chat_id:
                safe_client = html.escape(str(order.client_name))
                safe_phone = html.escape(str(order.phone))
                safe_address = html.escape(str(order.address))
                
                text = f"🛒 <b>Новый заказ #{html.escape(order.order_number)}</b>\n\n" \
                       f"👤 <b>Клиент:</b> {safe_client}\n" \
                       f"📞 <b>Телефон:</b> {safe_phone}\n" \
                       f"📍 <b>Адрес:</b> {safe_address}\n\n" \
                       f"📦 <b>Товары:</b>\n{items_text}\n\n" \
                       f"💰 <b>Сумма:</b> {order.total_amount:,.0f} сум"
                
                # Check if we have an image
                image_url = items[0].get('image') if items else None
                
                try:
                    if image_url:
                        requests.post(
                            f"https://api.telegram.org/bot{token}/sendPhoto",
                            json={"chat_id": chat_id, "photo": image_url, "caption": text, "parse_mode": "HTML"},
                            timeout=10
                        )
                    else:
                        requests.post(
                            f"https://api.telegram.org/bot{token}/sendMessage",
                            json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
                            timeout=10
                        )
                except Exception as tg_error:
                    print(f"Telegram notification failed: {tg_error}")
            return Response({"status": "ok", "order_number": order.order_number})
            
        except Exception as e:
            print(f"Checkout Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MyOrdersAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            from .models import Customer
            customer = Customer.objects.get(user=request.user)
            orders = Order.objects.filter(customer=customer).order_by('-created_at')
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SubmitReviewAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        try:
            import os
            import requests
            import html
            from django.conf import settings
            os.environ.pop('SSLKEYLOGFILE', None)
            
            token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
            chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
            
            if token and chat_id:
                product_name = html.escape(str(data.get('product_name', 'Неизвестный товар')))
                rating = data.get('rating', 5)
                name = html.escape(str(data.get('name', 'Аноним')))
                review_text = html.escape(str(data.get('review', '')))
                
                stars = "⭐" * int(rating)
                
                text = f"📝 <b>Новый отзыв о товаре!</b>\n\n" \
                       f"🛒 <b>Товар:</b> {product_name}\n" \
                       f"👤 <b>От:</b> {name}\n" \
                       f"⭐️ <b>Оценка:</b> {stars}\n\n" \
                       f"💬 <b>Отзыв:</b>\n{review_text}"
                
                requests.post(
                    f"https://api.telegram.org/bot{token}/sendMessage",
                    json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
                    timeout=5
                )
            
            return Response({"status": "ok"})
            
        except Exception as e:
            print(f"Review Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
