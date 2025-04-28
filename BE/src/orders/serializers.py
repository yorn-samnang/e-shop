from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id')
    
    class Meta:
        model = OrderItem
        fields = ['product_id', 'name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_id = serializers.IntegerField(source='id', read_only=True)
    
    class Meta:
        model = Order
        fields = ['order_id', 'status', 'total', 'created_at']


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_id = serializers.IntegerField(source='id', read_only=True)
    
    class Meta:
        model = Order
        fields = ['order_id', 'status', 'address', 'total', 'items', 'created_at']


class CreateOrderSerializer(serializers.Serializer):
    address = serializers.CharField(required=True)