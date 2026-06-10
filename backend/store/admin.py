from django.contrib import admin
from .models import Category, Product, ProductImage, Order, OrderItem, Customer

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'brand', 'price', 'stock', 'in_stock', 'is_active', 'created_at')
    list_filter = ('category', 'brand', 'in_stock', 'is_active')
    search_fields = ('name', 'brand')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('in_stock', 'is_active', 'price', 'stock')
    inlines = [ProductImageInline]
    actions = ['make_active', 'make_inactive']

    @admin.action(description="Активировать выбранные товары (показывать на сайте)")
    def make_active(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description="Деактивировать выбранные товары (скрыть с сайта)")
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('price',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'client_name', 'phone', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'client_name', 'phone', 'telegram')
    inlines = [OrderItemInline]
    readonly_fields = ('order_number', 'total_amount', 'created_at')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('phone', 'user', 'raw_password')
    search_fields = ('phone', 'user__username')
