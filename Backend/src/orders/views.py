from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal
from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
    OpenApiResponse,
    inline_serializer,
)
from rest_framework import serializers as drf_serializers

from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    OrderDetailSerializer,
    CreateOrderSerializer,
    AdminOrderSerializer,
    OrderStatusUpdateSerializer,
)
from cart.models import Cart, CartItem


@extend_schema(tags=["Orders"])
class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="List current user's orders",
        description="Returns a list of all orders placed by the authenticated user, newest first.",
        responses={
            200: OrderSerializer,
            401: OpenApiResponse(description="Authentication required"),
        },
    )
    def get(self, request):
        """Get user's order history"""
        orders = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Create a new order from cart",
        description=(
            "Converts the current user's cart into an order. "
            "Stock is decremented and the cart is cleared on success."
        ),
        request=CreateOrderSerializer,
        responses={
            201: OpenApiResponse(
                description="Order created successfully",
                response=inline_serializer(
                    name="CreateOrderResponse",
                    fields={
                        "order_id": drf_serializers.IntegerField(),
                        "status": drf_serializers.CharField(),
                        "total": drf_serializers.FloatField(),
                        "items": drf_serializers.ListField(
                            child=inline_serializer(
                                name="OrderItemResponse",
                                fields={
                                    "product_id": drf_serializers.IntegerField(),
                                    "name": drf_serializers.CharField(),
                                    "quantity": drf_serializers.IntegerField(),
                                    "price": drf_serializers.FloatField(),
                                },
                            )
                        ),
                    },
                ),
                examples=[
                    OpenApiExample(
                        "Success",
                        value={
                            "order_id": 5,
                            "status": "pending",
                            "total": 89.98,
                            "items": [
                                {"product_id": 2, "name": "Widget A", "quantity": 2, "price": 44.99}
                            ],
                        },
                    )
                ],
            ),
            400: OpenApiResponse(
                description="Cart is empty or insufficient stock",
                examples=[
                    OpenApiExample("Empty cart", value={"error": "Your cart is empty."}),
                    OpenApiExample(
                        "Out of stock",
                        value={"error": "Not enough stock for Widget A. Available: 1"},
                    ),
                ],
            ),
            401: OpenApiResponse(description="Authentication required"),
        },
        examples=[
            OpenApiExample(
                "Create order",
                request_only=True,
                value={"address": "123 Main St, Springfield, IL 62701"},
            )
        ],
    )
    def post(self, request):
        """Create a new order from cart"""
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            # Get user's cart
            try:
                cart = Cart.objects.get(user=request.user)
            except Cart.DoesNotExist:
                return Response(
                    {"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST
                )

            # Check if cart has items
            cart_items = CartItem.objects.filter(cart=cart)
            if not cart_items.exists():
                return Response(
                    {"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST
                )

            # Calculate total
            total = Decimal("0.00")
            for item in cart_items:
                total += item.product.price * item.quantity

            with transaction.atomic():
                # Create order
                order = Order.objects.create(
                    user=request.user,
                    address=serializer.validated_data["address"],
                    total=total,
                    status="pending",
                )

                # Create order items
                order_items = []
                for cart_item in cart_items:
                    # Check if item is still in stock
                    if cart_item.product.in_stock < cart_item.quantity:
                        transaction.set_rollback(True)
                        return Response(
                            {
                                "error": f"Not enough stock for {cart_item.product.name}. "
                                f"Available: {cart_item.product.in_stock}"
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    # Create order item
                    order_item = OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        name=cart_item.product.name,
                        price=cart_item.product.price,
                        quantity=cart_item.quantity,
                    )
                    order_items.append(order_item)

                    # Update stock
                    cart_item.product.in_stock -= cart_item.quantity
                    cart_item.product.save()

                # Clear cart
                cart_items.delete()

            # Prepare response
            response_data = {
                "order_id": order.id,
                "status": order.status,
                "total": float(order.total),
                "items": [
                    {
                        "product_id": item.product.id,
                        "name": item.name,
                        "quantity": item.quantity,
                        "price": float(item.price),
                    }
                    for item in order_items
                ],
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Orders"])
class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Retrieve order details",
        description="Returns full details (including items) for a specific order belonging to the authenticated user.",
        responses={
            200: OpenApiResponse(
                description="Order detail",
                response=OrderDetailSerializer,
                examples=[
                    OpenApiExample(
                        "Order detail",
                        value={
                            "order_id": 1,
                            "status": "shipped",
                            "address": "123 Main St, Springfield, IL 62701",
                            "total": "89.98",
                            "created_at": "2024-03-10T14:22:00Z",
                            "items": [
                                {"product_id": 2, "name": "Widget A", "quantity": 2, "price": "44.99"}
                            ],
                        },
                    )
                ],
            ),
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(description="Order not found"),
        },
    )
    def get(self, request, pk):
        """Get detailed information about a specific order"""
        order = get_object_or_404(Order, id=pk, user=request.user)
        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)


@extend_schema(tags=["Admin – Orders"])
class AdminOrderListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        summary="List all orders across all users (staff only)",
        description=(
            "Returns all orders in the system, including each order's user email. "
            "Ordered newest first. Accessible only by staff/admin users."
        ),
        responses={
            200: AdminOrderSerializer,
            403: OpenApiResponse(description="Not authorized — staff only"),
        },
    )
    def get(self, request):
        """List all orders across all users — staff only."""
        orders = Order.objects.select_related("user").prefetch_related("items__product").order_by("-created_at")
        serializer = AdminOrderSerializer(orders, many=True)
        return Response(serializer.data)


@extend_schema(tags=["Admin – Orders"])
class AdminOrderUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        summary="Retrieve a single order (staff only)",
        description="Returns full details for a specific order. Accessible only by staff/admin users.",
        responses={
            200: AdminOrderSerializer,
            403: OpenApiResponse(description="Not authorized — staff only"),
            404: OpenApiResponse(description="Order not found"),
        },
    )
    def get(self, request, pk):
        """Get details of a specific order — staff only."""
        order = get_object_or_404(
            Order.objects.select_related("user").prefetch_related("items__product"),
            pk=pk,
        )
        serializer = AdminOrderSerializer(order)
        return Response(serializer.data)

    @extend_schema(
        summary="Update order status (staff only)",
        description=(
            "Allows staff to update the status of any order. "
            "Valid statuses: pending, processing, shipped, delivered, cancelled."
        ),
        request=OrderStatusUpdateSerializer,
        responses={
            200: OpenApiResponse(
                description="Order status updated",
                response=AdminOrderSerializer,
                examples=[
                    OpenApiExample(
                        "Status updated",
                        value={
                            "order_id": 7,
                            "user_email": "jane@example.com",
                            "status": "shipped",
                            "address": "456 Oak Ave, Chicago, IL",
                            "total": "120.00",
                            "created_at": "2024-04-01T09:00:00Z",
                            "items": [],
                        },
                    )
                ],
            ),
            400: OpenApiResponse(
                description="Invalid status value",
                examples=[
                    OpenApiExample(
                        "Bad status",
                        value={"status": ["Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled"]},
                    )
                ],
            ),
            403: OpenApiResponse(description="Not authorized — staff only"),
            404: OpenApiResponse(description="Order not found"),
        },
        examples=[
            OpenApiExample(
                "Ship an order",
                request_only=True,
                value={"status": "shipped"},
            ),
            OpenApiExample(
                "Cancel an order",
                request_only=True,
                value={"status": "cancelled"},
            ),
        ],
    )
    def patch(self, request, pk):
        """Update the status of any order — staff only."""
        order = get_object_or_404(Order, pk=pk)
        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(AdminOrderSerializer(order).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

