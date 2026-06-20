from rest_framework import viewsets, permissions
from .models import Category, Product, Order, ProductDriver
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, ProductDriverSerializer

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
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['category__slug', 'brand', 'in_stock']

class ProductDriverViewSet(viewsets.ModelViewSet):
    queryset = ProductDriver.objects.all()
    serializer_class = ProductDriverSerializer
    permission_classes = [IsAdminOrReadOnly]

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
        lang = request.headers.get('Accept-Language', 'ru')
        
        try:
            items = data.get('items', [])
            if not items:
                error_msg = "Savat bo'sh" if lang == 'uz' else "Корзина пуста"
                return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)
            
            from django.db import transaction
            from .models import Product, OrderItem
            
            validated_items = []
            
            # Start database transaction to lock rows and validate stock
            with transaction.atomic():
                for item in items:
                    product_id = item.get('product_id')
                    qty = int(item.get('quantity', 1))
                    
                    if not product_id:
                        error_msg = "Noto'g'ri mahsulot IDsi" if lang == 'uz' else "Некорректный ID товара"
                        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)
                    
                    try:
                        product = Product.objects.select_for_update().get(id=product_id)
                    except Product.DoesNotExist:
                        error_msg = "Mahsulot topilmadi" if lang == 'uz' else "Товар не найден"
                        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)
                    
                    if product.stock < qty or not product.in_stock or product.stock <= 0:
                        product_name = product.name_uz if lang == 'uz' and product.name_uz else product.name
                        if lang == 'uz':
                            if product.stock <= 0 or not product.in_stock:
                                error_msg = f"'{product_name}' mahsuloti omborda qolmagan."
                            else:
                                error_msg = f"Omborda '{product_name}' mahsulotidan yetarli emas. Mavjud: {product.stock} ta."
                        else:
                            if product.stock <= 0 or not product.in_stock:
                                error_msg = f"Товара '{product_name}' нет в наличии."
                            else:
                                error_msg = f"Недостаточно товара '{product_name}' на складе. Доступно: {product.stock} шт."
                        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)
                    
                    validated_items.append((product, qty, item))
                
                # If all items are valid, create the Order
                # Try to get the customer if user is authenticated
                customer = None
                if request.user.is_authenticated:
                    try:
                        from .models import Customer
                        customer = Customer.objects.get(user=request.user)
                    except:
                        pass
                
                order = Order.objects.create(
                    order_number=data.get('order_number'),
                    customer=customer,
                    client_name=data.get('client_name'),
                    phone=data.get('phone'),
                    address=data.get('address'),
                    total_amount=data.get('total_amount', 0),
                )
                
                items_list = []
                for idx, (product, qty, item) in enumerate(validated_items, start=1):
                    # Decrement stock
                    product.stock -= qty
                    if product.stock <= 0:
                        product.stock = 0
                        product.in_stock = False
                    product.save()
                    
                    # Create OrderItem in DB so it shows up in Django admin
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=qty,
                        price=item.get('price', product.price)
                    )
                    
                    name = item.get('name', product.name)
                    color = item.get('selectedColor')
                    color_text = f" ({color})" if color else ""
                    items_list.append(f"{idx}. {name}{color_text} × {qty}")
                
                items_text = "\n".join(items_list)
            
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
                
                # Get unique images, max 10
                image_urls = []
                for product, qty, item in validated_items:
                    img = item.get('image')
                    if img and img not in image_urls:
                        image_urls.append(img)
                image_urls = image_urls[:10]
                
                try:
                    if len(image_urls) > 1:
                        media = []
                        for i, img in enumerate(image_urls):
                            media_item = {"type": "photo", "media": img}
                            if i == 0:
                                media_item["caption"] = text
                                media_item["parse_mode"] = "HTML"
                            media.append(media_item)
                            
                        requests.post(
                            f"https://api.telegram.org/bot{token}/sendMediaGroup",
                            json={"chat_id": chat_id, "media": media},
                            timeout=15
                        )
                    elif len(image_urls) == 1:
                        requests.post(
                            f"https://api.telegram.org/bot{token}/sendPhoto",
                            json={"chat_id": chat_id, "photo": image_urls[0], "caption": text, "parse_mode": "HTML"},
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
