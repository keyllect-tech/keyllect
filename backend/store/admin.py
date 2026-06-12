from django import forms
from django.contrib import admin, messages
from django.urls import path
from django.shortcuts import render, redirect
from .models import Category, Product, ProductImage, ProductDriver, Order, OrderItem, Customer
import re
import csv
import io

def cyrillic_slugify(text):
    rus = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z',
        'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    }
    translit = "".join(rus.get(char, char) for char in text)
    slug = translit.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug

class MultipleFileInput(forms.FileInput):
    allow_multiple_selected = True

class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput(attrs={'multiple': True}))
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            return [single_file_clean(d, initial) for d in data]
        return single_file_clean(data, initial)

class ProductAdminForm(forms.ModelForm):
    additional_images = MultipleFileField(
        required=False,
        label="Добавить несколько изображений",
        help_text="Вы можете выбрать и загрузить сразу несколько картинок за раз. Они добавятся к списку ниже."
    )

    class Meta:
        model = Product
        fields = '__all__'

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductDriverInline(admin.TabularInline):
    model = ProductDriver
    extra = 0

@admin.register(ProductDriver)
class ProductDriverAdmin(admin.ModelAdmin):
    list_display = ('name', 'product', 'url')
    search_fields = ('name', 'product__name')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ('name', 'category', 'brand', 'price', 'stock', 'in_stock', 'is_active', 'created_at')
    list_filter = ('category', 'brand', 'in_stock', 'is_active')
    search_fields = ('name', 'brand')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('in_stock', 'is_active', 'price', 'stock')
    inlines = [ProductImageInline, ProductDriverInline]
    actions = ['make_active', 'make_inactive']

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('bulk-add/', self.admin_site.admin_view(self.bulk_add), name='store_product_bulk_add'),
        ]
        return custom_urls + urls

    def bulk_add(self, request):
        if request.method == 'POST':
            action_type = request.POST.get('action_type')
            
            if action_type == 'text_list':
                category_id = request.POST.get('category')
                brand = request.POST.get('brand')
                price = request.POST.get('price')
                stock = request.POST.get('stock')
                names_text = request.POST.get('names', '')
                
                category = Category.objects.get(id=category_id)
                names = [n.strip() for n in names_text.split('\n') if n.strip()]
                
                created_count = 0
                for name in names:
                    base_slug = cyrillic_slugify(name)
                    slug = base_slug
                    counter = 1
                    while Product.objects.filter(slug=slug).exists():
                        slug = f"{base_slug}-{counter}"
                        counter += 1
                        
                    Product.objects.create(
                        category=category,
                        name=name,
                        slug=slug,
                        brand=brand,
                        price=price,
                        stock=stock,
                        description=name,
                        in_stock=int(stock) > 0
                    )
                    created_count += 1
                
                messages.success(request, f"Успешно создано {created_count} товаров.")
                return redirect('admin:store_product_changelist')
                
            elif action_type == 'csv_file':
                csv_file = request.FILES.get('csv_file')
                if not csv_file.name.endswith('.csv'):
                    messages.error(request, "Пожалуйста, загрузите файл формата CSV.")
                    return redirect(request.path)
                    
                try:
                    file_data = csv_file.read().decode('utf-8')
                    csv_data = csv.reader(io.StringIO(file_data), delimiter=',')
                    
                    # Skip header
                    try:
                        header = next(csv_data)
                    except StopIteration:
                        messages.error(request, "CSV файл пуст.")
                        return redirect(request.path)
                    
                    created_count = 0
                    for row in csv_data:
                        if len(row) < 5:
                            continue
                        name = row[0].strip()
                        category_slug = row[1].strip()
                        brand = row[2].strip()
                        price = row[3].strip()
                        stock = row[4].strip()
                        description = row[5].strip() if len(row) > 5 else name
                        
                        try:
                            category = Category.objects.get(slug=category_slug)
                        except Category.DoesNotExist:
                            try:
                                category = Category.objects.get(name__iexact=category_slug)
                            except Category.DoesNotExist:
                                category = Category.objects.first()
                                if not category:
                                    continue
                        
                        base_slug = cyrillic_slugify(name)
                        slug = base_slug
                        counter = 1
                        while Product.objects.filter(slug=slug).exists():
                            slug = f"{base_slug}-{counter}"
                            counter += 1
                            
                        Product.objects.create(
                            category=category,
                            name=name,
                            slug=slug,
                            brand=brand,
                            price=price,
                            stock=stock,
                            description=description,
                            in_stock=int(stock) > 0
                        )
                        created_count += 1
                        
                    messages.success(request, f"Успешно импортировано {created_count} товаров из CSV.")
                    return redirect('admin:store_product_changelist')
                except Exception as e:
                    messages.error(request, f"Ошибка при разборе CSV: {str(e)}")
                    return redirect(request.path)

        categories = Category.objects.all()
        context = {
            **self.admin_site.each_context(request),
            'opts': self.model._meta,
            'categories': categories,
            'title': 'Массовое добавление товаров',
        }
        return render(request, 'admin/store/product/bulk_add.html', context)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        files = request.FILES.getlist('additional_images')
        for f in files:
            ProductImage.objects.create(product=obj, image=f)

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
