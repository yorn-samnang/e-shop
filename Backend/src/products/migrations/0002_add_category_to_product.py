from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.CharField(
                blank=True,
                choices=[
                    ('electronics', 'Electronics'),
                    ('clothing', 'Clothing'),
                    ('accessories', 'Accessories'),
                    ('home', 'Home & Kitchen'),
                ],
                max_length=50,
                null=True,
            ),
        ),
    ]
