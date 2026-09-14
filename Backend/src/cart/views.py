# cart/views.py

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
    OpenApiResponse,
    inline_serializer,
)
from rest_framework import serializers as drf_serializers

from products.models import Product
from .models import Cart, CartItem
from .serializers import CartItemSerializer, AddToCartSerializer, UpdateCartItemSerializer


@extend_schema(tags=["Cart"])
class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get cart contents",
        description="Returns all items currently in the authenticated user's cart.",
        responses={
            200: CartItemSerializer,
            401: OpenApiResponse(description="Authentication required"),
        },
    )
    def get(self, request):
        """Get user's cart items"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Add item to cart",
        description=(
            "Adds a product to the authenticated user's cart. "
            "If the product is already in the cart, the quantity is incremented."
        ),
        request=AddToCartSerializer,
        responses={
            201: OpenApiResponse(
                description="Item added to cart",
                response=inline_serializer(
                    name="AddToCartResponse",
                    fields={"message": drf_serializers.CharField()},
                ),
                examples=[
                    OpenApiExample("Added", value={"message": "Added to cart"}),
                ],
            ),
            400: OpenApiResponse(
                description="Validation error or insufficient stock",
                examples=[
                    OpenApiExample(
                        "Out of stock",
                        value={"error": "Only 2 items available in stock."},
                    ),
                    OpenApiExample(
                        "Invalid product",
                        value={"product_id": ["Product not found."]},
                    ),
                ],
            ),
            401: OpenApiResponse(description="Authentication required"),
        },
        examples=[
            OpenApiExample(
                "Add to cart",
                request_only=True,
                value={"product_id": 2, "quantity": 3},
            )
        ],
    )
    def post(self, request):
        """Add item to cart"""
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            product_id = serializer.validated_data["product_id"]
            quantity = serializer.validated_data["quantity"]

            product = get_object_or_404(Product, id=product_id)

            # Check if quantity is available
            if product.in_stock < quantity:
                return Response(
                    {"error": f"Only {product.in_stock} items available in stock."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cart, created = Cart.objects.get_or_create(user=request.user)

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={"quantity": quantity},
            )

            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            return Response({"message": "Added to cart"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Cart"])
class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Update cart item quantity",
        description=(
            "Sets the quantity of a specific product in the authenticated user's cart. "
            "Fails if the requested quantity exceeds available stock."
        ),
        request=UpdateCartItemSerializer,
        responses={
            200: OpenApiResponse(
                description="Cart item updated",
                response=inline_serializer(
                    name="UpdateCartItemResponse",
                    fields={"message": drf_serializers.CharField()},
                ),
                examples=[OpenApiExample("Updated", value={"message": "Cart updated"})],
            ),
            400: OpenApiResponse(
                description="Validation error or insufficient stock",
                examples=[
                    OpenApiExample(
                        "Out of stock",
                        value={"error": "Only 1 items available in stock."},
                    )
                ],
            ),
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(description="Product or cart item not found"),
        },
        examples=[
            OpenApiExample(
                "Set quantity to 5",
                request_only=True,
                value={"quantity": 5},
            )
        ],
    )
    def put(self, request, product_id):
        """Update cart item quantity"""
        serializer = UpdateCartItemSerializer(data=request.data)
        if serializer.is_valid():
            quantity = serializer.validated_data["quantity"]

            cart = get_object_or_404(Cart, user=request.user)
            product = get_object_or_404(Product, id=product_id)
            cart_item = get_object_or_404(CartItem, cart=cart, product=product)

            # Check if quantity is available
            if product.in_stock < quantity:
                return Response(
                    {"error": f"Only {product.in_stock} items available in stock."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cart_item.quantity = quantity
            cart_item.save()

            return Response({"message": "Cart updated"})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Remove item from cart",
        description="Removes a specific product from the authenticated user's cart entirely.",
        responses={
            200: OpenApiResponse(
                description="Item removed",
                response=inline_serializer(
                    name="RemoveCartItemResponse",
                    fields={"message": drf_serializers.CharField()},
                ),
                examples=[
                    OpenApiExample("Removed", value={"message": "Item removed from cart"})
                ],
            ),
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(
                description="Item not found in cart",
                examples=[
                    OpenApiExample("Not found", value={"error": "Item not found in cart"})
                ],
            ),
        },
    )
    def delete(self, request, product_id):
        """Remove item from cart"""
        cart = get_object_or_404(Cart, user=request.user)
        product = get_object_or_404(Product, id=product_id)

        try:
            cart_item = CartItem.objects.get(cart=cart, product=product)
            cart_item.delete()
            return Response({"message": "Item removed from cart"})
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND
            )