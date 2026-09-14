from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0002_add_category_to_product"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="image_url",
            field=models.URLField(blank=True, max_length=2048, null=True),
        ),
    ]
