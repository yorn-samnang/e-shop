from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Order, OrderItem

User = get_user_model()


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id")
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["product_id", "name", "quantity", "price", "image_url"]

    def get_image_url(self, obj: OrderItem) -> str | None:
        return obj.product.image_url or None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_id = serializers.IntegerField(source="id", read_only=True)
    total = serializers.FloatField(read_only=True)

    class Meta:
        model = Order
        fields = ["order_id", "status", "total", "items", "created_at"]


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_id = serializers.IntegerField(source="id", read_only=True)
    total = serializers.FloatField(read_only=True)

    class Meta:
        model = Order
        fields = ["order_id", "status", "address", "total", "items", "created_at"]


class CreateOrderSerializer(serializers.Serializer):
    address = serializers.CharField(required=True)


class AdminOrderSerializer(serializers.ModelSerializer):
    """Serializer for admin order list — includes the user's email."""

    items = OrderItemSerializer(many=True, read_only=True)
    order_id = serializers.IntegerField(source="id", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    total = serializers.FloatField(read_only=True)

    class Meta:
        model = Order
        fields = ["order_id", "user_email", "status", "address", "total", "items", "created_at"]


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for admin status-only order updates."""

    class Meta:
        model = Order
        fields = ["status"]

    def validate_status(self, value):
        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        return value
