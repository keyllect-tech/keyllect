from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0006_category_name_uz_product_characteristics_uz_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='colors',
            field=models.CharField(blank=True, help_text='Например: Черный, Белый, Красный', max_length=255, null=True, verbose_name='Цвета (через запятую)'),
        ),
        migrations.AlterField(
            model_name='product',
            name='name_uz',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='Название (Узб)'),
        ),
    ]
