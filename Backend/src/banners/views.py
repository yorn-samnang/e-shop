from rest_framework import viewsets, permissions
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiResponse,
)

from .models import Banner
from .serializers import BannerSerializer, BannerCreateUpdateSerializer
from .permissions import IsAdminOrReadOnly


@extend_schema_view(
    list=extend_schema(
        tags=["Banners"],
        summary="List banners",
        description=(
            "Returns a list of active banners for public users. "
            "Admin users see all banners regardless of active status."
        ),
        responses={
            200: OpenApiResponse(
                description="Banner list",
                response=BannerSerializer(many=True),
            )
        },
    ),
    retrieve=extend_schema(
        tags=["Banners"],
        summary="Retrieve a banner",
        description="Returns full details for a single banner by its ID.",
        responses={
            200: OpenApiResponse(description="Banner detail", response=BannerSerializer),
            404: OpenApiResponse(description="Banner not found"),
        },
    ),
    create=extend_schema(
        tags=["Banners"],
        summary="Create a banner (admin only)",
        description="Creates a new banner. Requires admin/staff authentication.",
        request=BannerCreateUpdateSerializer,
        responses={
            201: OpenApiResponse(description="Banner created", response=BannerSerializer),
            400: OpenApiResponse(description="Validation error"),
            403: OpenApiResponse(description="Not authorized — admin only"),
        },
    ),
    update=extend_schema(
        tags=["Banners"],
        summary="Update a banner (admin only)",
        description="Fully replaces a banner's data. Requires admin/staff authentication.",
        request=BannerCreateUpdateSerializer,
        responses={
            200: OpenApiResponse(description="Banner updated", response=BannerSerializer),
            400: OpenApiResponse(description="Validation error"),
            403: OpenApiResponse(description="Not authorized — admin only"),
            404: OpenApiResponse(description="Banner not found"),
        },
    ),
    partial_update=extend_schema(
        tags=["Banners"],
        summary="Partially update a banner (admin only)",
        description="Updates one or more fields of an existing banner. Requires admin/staff authentication.",
        request=BannerCreateUpdateSerializer,
        responses={
            200: OpenApiResponse(description="Banner partially updated", response=BannerSerializer),
            400: OpenApiResponse(description="Validation error"),
            403: OpenApiResponse(description="Not authorized — admin only"),
            404: OpenApiResponse(description="Banner not found"),
        },
    ),
    destroy=extend_schema(
        tags=["Banners"],
        summary="Delete a banner (admin only)",
        description="Permanently deletes a banner. Requires admin/staff authentication.",
        responses={
            204: OpenApiResponse(description="Banner deleted"),
            403: OpenApiResponse(description="Not authorized — admin only"),
            404: OpenApiResponse(description="Banner not found"),
        },
    ),
)
@extend_schema(tags=["Banners"])
class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return BannerCreateUpdateSerializer
        return BannerSerializer

    def get_queryset(self):
        # Admin users see all banners; public users only see active banners
        if self.action in ["list", "retrieve"] and not (
            self.request.user and self.request.user.is_staff
        ):
            return Banner.objects.filter(is_active=True)
        return Banner.objects.all()
