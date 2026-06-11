from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductDriver, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'color']

    def get_image(self, obj):
        return obj.image.url if obj.image else None

class ProductDriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDriver
        fields = ['id', 'name', 'url']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    drivers = ProductDriverSerializer(many=True, read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)
    category_slug = serializers.SlugRelatedField(
        source='category', slug_field='slug', read_only=True
    )

    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_details', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
            
        # Send Telegram notification
        try:
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
                
                items_text = "\n".join([f"• {html.escape(item.product.name)} × {item.quantity}" for item in order.items.all()])
                text = f"🛒 <b>Новый заказ #{html.escape(order.order_number)}</b>\n\n" \
                       f"👤 <b>Клиент:</b> {safe_client}\n" \
                       f"📞 <b>Телефон:</b> {safe_phone}\n" \
                       f"📍 <b>Адрес:</b> {safe_address}\n\n" \
                       f"📦 <b>Товары:</b>\n{items_text}\n\n" \
                       f"💰 <b>Сумма:</b> {order.total_amount:,.0f} сум"
                       
                requests.post(
                    f"https://api.telegram.org/bot{token}/sendMessage",
                    json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
                    timeout=5
                )
        except Exception as e:
            print(f"Telegram Error: {e}")
            
        return order
