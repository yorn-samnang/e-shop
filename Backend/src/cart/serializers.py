from typing import Optional

from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(required=True)
    name = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['product_id', 'name', 'price', 'quantity', 'image_url']
    
    def get_name(self, obj) -> str:
        return obj.product.name
    
    def get_price(self, obj) -> float:
        return float(obj.product.price)

    def get_image_url(self, obj) -> Optional[str]:
        return obj.product.image_url or None


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(required=True, min_value=1)
    
    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value)
            if product.in_stock <= 0:
                raise serializers.ValidationError("This product is out of stock.")
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found.")


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(required=True, min_value=1)
