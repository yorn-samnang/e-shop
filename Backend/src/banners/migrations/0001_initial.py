from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Banner",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("subtitle", models.TextField(blank=True, null=True)),
                ("image", models.URLField(max_length=2048)),
                ("button_label", models.CharField(blank=True, max_length=100, null=True)),
                ("button_link", models.CharField(blank=True, max_length=500, null=True)),
                ("is_active", models.BooleanField(default=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["order", "-created_at"]},
        ),
    ]
