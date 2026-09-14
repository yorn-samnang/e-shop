from rest_framework import serializers

from .models import Banner


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'title', 'subtitle', 'image', 'button_label', 'button_link', 'is_active', 'order']


class BannerCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['title', 'subtitle', 'image', 'button_label', 'button_link', 'is_active', 'order']
