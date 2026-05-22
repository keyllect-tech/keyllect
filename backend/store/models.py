from django.db import models
from cloudinary.models import CloudinaryField

class Category(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    slug = models.SlugField(max_length=255, unique=True)
    image = CloudinaryField('image', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, verbose_name="Категория")
    name = models.CharField(max_length=255, verbose_name="Название")
    slug = models.SlugField(max_length=255, unique=True)
    brand = models.CharField(max_length=255, verbose_name="Бренд")
    description = models.TextField(verbose_name="Описание")
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Цена")
    old_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Старая цена")
    in_stock = models.BooleanField(default=True, verbose_name="В наличии")
    rating = models.FloatField(default=0.0, verbose_name="Рейтинг")
    characteristics = models.JSONField(default=dict, blank=True, verbose_name="Характеристики")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('image')

    class Meta:
        verbose_name = "Изображение товара"
        verbose_name_plural = "Изображения товара"

    def __str__(self):
        return f"Image for {self.product.name}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('NEW', 'Новый'),
        ('PROCESSING', 'В обработке'),
        ('CONFIRMED', 'Подтверждён'),
        ('SHIPPED', 'Отправлен'),
        ('DELIVERED', 'Доставлен'),
        ('CANCELLED', 'Отменён'),
    )
    
    order_number = models.CharField(max_length=50, unique=True, verbose_name="Номер заказа")
    client_name = models.CharField(max_length=255, verbose_name="Имя клиента")
    phone = models.CharField(max_length=50, verbose_name="Телефон")
    telegram = models.CharField(max_length=255, blank=True, null=True, verbose_name="Telegram username")
    address = models.TextField(verbose_name="Адрес")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Итоговая сумма")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW', verbose_name="Статус заказа")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Заказ #{self.order_number} от {self.client_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.PROTECT, verbose_name="Товар")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Цена за единицу")

    class Meta:
        verbose_name = "Товар в заказе"
        verbose_name_plural = "Товары в заказе"

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
