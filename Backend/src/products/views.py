from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
    OpenApiExample,
    OpenApiResponse,
)
from drf_spectacular.types import OpenApiTypes

from .models import Product
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
)
from .permissions import IsAdminOrReadOnly


@extend_schema_view(
    list=extend_schema(
        tags=["Products"],
        summary="List products",
        description=(
            "Returns a list of all products. "
            "Optionally filter by name/description using `search`, or by category using `category`."
        ),
        parameters=[
            OpenApiParameter(
                name="search",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Search products by name or description (case-insensitive).",
                required=False,
                examples=[
                    OpenApiExample("Search by name", value="widget"),
                ],
            ),
            OpenApiParameter(
                name="category",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Filter products by their category.",
                required=False,
            ),
        ],
        responses={
            200: OpenApiResponse(
                description="Paginated product list",
                response=ProductListSerializer(many=True),
                examples=[
                    OpenApiExample(
                        "Product list",
                        value=[
                            {
                                "id": 1,
                                "name": "Widget A",
                                "price": "29.99",
                                "image_url": "https://example.com/img/widget-a.jpg",
                                "in_stock": 50,
                            }
                        ],
                    )
                ],
            )
        },
    ),
    retrieve=extend_schema(
        tags=["Products"],
        summary="Retrieve a product",
        description="Returns full details for a single product by its ID.",
        responses={
            200: OpenApiResponse(
                description="Product detail",
                response=ProductDetailSerializer,
                examples=[
                    OpenApiExample(
                        "Product detail",
                        value={
                            "id": 1,
                            "name": "Widget A",
                            "description": "A high-quality widget.",
                            "price": "29.99",
                            "image_url": "https://example.com/img/widget-a.jpg",
                            "in_stock": 50,
                        },
                    )
                ],
            ),
            404: OpenApiResponse(description="Product not found"),
        },
    ),
    create=extend_schema(
        tags=["Products"],
        summary="Create a product (admin only)",
        description="Creates a new product. Requires admin/staff authentication.",
        request=ProductCreateUpdateSerializer,
        responses={
            201: OpenApiResponse(description="Product created", response=ProductDetailSerializer),
            400: OpenApiResponse(description="Validation error"),
            403: OpenApiResponse(description="Not authorized — admin only"),
        },
        examples=[
            OpenApiExample(
                "New product",
                request_only=True,
                value={
                    "name": "Gadget Pro",
                    "description": "The professional-grade gadget.",
                    "price": "99.99",
                    "image_url": "https://example.com/img/gadget-pro.jpg",
                    "in_stock": 100,
                },
            )
        ],
    ),
    update=extend_schema(
        tags=["Products"],
        summary="Update a product (admin only)",
        description="Fully replaces a product's data. Requires admin/staff authentication.",
        request=ProductCreateUpdateSerializer,
        responses={
            200: OpenApiResponse(description="Product updated", response=ProductDetailSerializer),
            400: OpenApiResponse(description="Validation error"),
            403: OpenApiResponse(description="Not authorized — admin only"),
            404: OpenApiResponse(description="Product not found"),
        },
    ),
    partial_update=extend_schema(
        tags=["Products"],
        summary="Partially update a product (admin only)",
        description="Updates one or more fields of an existing product. Requires admin/staff authentication.",
        request=ProductCreateUpdateSerializer,
        responses={
            200: OpenApiResponse(description="Product partially updated", response=ProductDetailSerializer),
            400: OpenApiResponse(description="Validation error"),
            403: OpenApiResponse(description="Not authorized — admin only"),
            404: OpenApiResponse(description="Product not found"),
        },
        examples=[
            OpenApiExample(
                "Update stock",
                request_only=True,
                value={"in_stock": 75},
            ),
            OpenApiExample(
                "Update price",
                request_only=True,
                value={"price": "24.99"},
            ),
        ],
    ),
    destroy=extend_schema(
        tags=["Products"],
        summary="Delete a product (admin only)",
        description="Permanently deletes a product. Requires admin/staff authentication.",
        responses={
            204: OpenApiResponse(description="Product deleted"),
            403: OpenApiResponse(description="Not authorized — admin only"),
            404: OpenApiResponse(description="Product not found"),
        },
    ),
)
@extend_schema(tags=["Products"])
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        elif self.action in ["create", "update", "partial_update"]:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        queryset = self.queryset

        # Handle search parameter
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )

        # Handle category parameter
        category = self.request.query_params.get("category", None)
        if category:
            queryset = queryset.filter(category=category)

        return queryset
