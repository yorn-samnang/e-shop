import re

from django.conf import settings
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiExample,
    OpenApiResponse,
    inline_serializer,
)
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers as drf_serializers
from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, GoogleAuthSerializer, AdminUserSerializer, UpdateProfileSerializer

User = get_user_model()


@extend_schema(tags=["Authentication"])
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Register a new user",
        description="Creates a new user account and returns a JWT access token.",
        request=RegisterSerializer,
        responses={
            201: OpenApiResponse(
                description="User created successfully",
                response=inline_serializer(
                    name="RegisterResponse",
                    fields={
                        "id": drf_serializers.IntegerField(),
                        "username": drf_serializers.CharField(),
                        "email": drf_serializers.EmailField(),
                        "token": drf_serializers.CharField(),
                    },
                ),
                examples=[
                    OpenApiExample(
                        "Success",
                        value={
                            "id": 1,
                            "username": "johndoe",
                            "email": "john@example.com",
                            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                    )
                ],
            ),
            400: OpenApiResponse(description="Validation error (e.g. duplicate email)"),
        },
        examples=[
            OpenApiExample(
                "Register request",
                request_only=True,
                value={"username": "johndoe", "email": "john@example.com", "password": "Str0ng!Pass"},
            )
        ],
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "token": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Authentication"])
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Log in and obtain a JWT token",
        description="Authenticates a user with email and password, returning a JWT access token.",
        request=LoginSerializer,
        responses={
            200: OpenApiResponse(
                description="Login successful",
                response=inline_serializer(
                    name="LoginResponse",
                    fields={"token": drf_serializers.CharField()},
                ),
                examples=[
                    OpenApiExample(
                        "Success",
                        value={"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."},
                    )
                ],
            ),
            401: OpenApiResponse(description="Invalid credentials"),
            400: OpenApiResponse(description="Validation error"),
        },
        examples=[
            OpenApiExample(
                "Login request",
                request_only=True,
                value={"email": "john@example.com", "password": "Str0ng!Pass"},
            )
        ],
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            matching_user = User.objects.filter(
                email__iexact=serializer.validated_data["email"]
            ).first()
            user = None
            if matching_user:
                user = authenticate(
                    request=request,
                    email=matching_user.email,
                    password=serializer.validated_data["password"],
                )

            if user:
                refresh = RefreshToken.for_user(user)
                return Response({"token": str(refresh.access_token)})
            return Response(
                {"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _google_username(email):
    base = re.sub(r"[^a-zA-Z0-9_]", "", email.split("@", 1)[0]) or "googleuser"
    candidate = base[:255]
    suffix = 1
    while User.objects.filter(username=candidate).exists():
        suffix_text = str(suffix)
        candidate = f"{base[:255 - len(suffix_text)]}{suffix_text}"
        suffix += 1
    return candidate


@extend_schema(tags=["Authentication"])
class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Sign in with Google",
        description="Verifies a Google ID token, then creates or signs in the matching customer account.",
        request=GoogleAuthSerializer,
        responses={
            200: OpenApiResponse(
                description="Google sign-in successful",
                response=inline_serializer(
                    name="GoogleLoginResponse",
                    fields={"token": drf_serializers.CharField(), "user": UserSerializer()},
                ),
            ),
            400: OpenApiResponse(description="Invalid Google credential"),
            403: OpenApiResponse(description="Account is inactive"),
            503: OpenApiResponse(description="Google OAuth is not configured"),
        },
    )
    def post(self, request):
        if not settings.GOOGLE_OAUTH_CLIENT_ID:
            return Response(
                {"error": "Google OAuth is not configured on the server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            identity = id_token.verify_oauth2_token(
                serializer.validated_data["credential"],
                google_requests.Request(),
                settings.GOOGLE_OAUTH_CLIENT_ID,
            )
        except (ValueError, GoogleAuthError):
            return Response({"error": "Invalid or expired Google credential."}, status=status.HTTP_400_BAD_REQUEST)

        if identity.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
            return Response({"error": "Invalid Google credential issuer."}, status=status.HTTP_400_BAD_REQUEST)
        if not identity.get("email_verified") or not identity.get("email"):
            return Response({"error": "Google account email is not verified."}, status=status.HTTP_400_BAD_REQUEST)

        google_sub = identity.get("sub")
        if not google_sub:
            return Response(
                {"error": "Google did not provide a valid account identifier."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = identity["email"].strip().lower()
        user = User.objects.filter(google_sub=google_sub).first()

        if not user:
            user = User.objects.filter(email__iexact=email).first()
            if user:
                if user.google_sub and user.google_sub != google_sub:
                    return Response(
                        {"error": "This email is already linked to another Google account."},
                        status=status.HTTP_409_CONFLICT,
                    )
                user.google_sub = google_sub
                update_fields = ["google_sub"]
                if not user.first_name and identity.get("given_name"):
                    user.first_name = identity["given_name"]
                    update_fields.append("first_name")
                if not user.last_name and identity.get("family_name"):
                    user.last_name = identity["family_name"]
                    update_fields.append("last_name")
                user.save(update_fields=update_fields)
            else:
                user = User.objects.create_user(
                    email=email,
                    username=_google_username(email),
                    password=None,
                    google_sub=google_sub,
                    first_name=identity.get("given_name", ""),
                    last_name=identity.get("family_name", ""),
                )
        if not user.is_active:
            return Response({"error": "This account is inactive."}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({"token": str(refresh.access_token), "user": UserSerializer(user).data})


@extend_schema(tags=["Authentication"])
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get current user profile",
        description="Returns the authenticated user's profile information. Requires Bearer token.",
        responses={
            200: OpenApiResponse(
                description="User profile",
                response=UserSerializer,
                examples=[
                    OpenApiExample(
                        "Profile",
                        value={
                            "id": 1,
                            "username": "johndoe",
                            "email": "john@example.com",
                            "first_name": "John",
                            "last_name": "Doe",
                        },
                    )
                ],
            ),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
        },
    )
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @extend_schema(
        summary="Update current user profile",
        description="Partially updates the authenticated user's profile (username, first_name, last_name, profile_image).",
        request=UpdateProfileSerializer,
        responses={
            200: OpenApiResponse(description="Profile updated", response=UserSerializer),
            400: OpenApiResponse(description="Validation error"),
            401: OpenApiResponse(description="Authentication required"),
        },
    )
    def patch(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Admin – Users"])
class AdminUserListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        summary="List all users (staff only)",
        description="Returns a paginated list of all registered users. Accessible only by staff/admin users.",
        responses={
            200: AdminUserSerializer,
            403: OpenApiResponse(description="Not authorized — staff only"),
        },
    )
    def get(self, request):
        """List all users — staff only."""
        users = User.objects.all().order_by("id")
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)


@extend_schema(tags=["Admin – Users"])
class AdminUserDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        summary="Retrieve a user (staff only)",
        description="Returns the full details of a specific user by ID. Accessible only by staff/admin users.",
        responses={
            200: OpenApiResponse(
                description="User details",
                response=AdminUserSerializer,
                examples=[
                    OpenApiExample(
                        "User detail",
                        value={
                            "id": 3,
                            "username": "janedoe",
                            "email": "jane@example.com",
                            "first_name": "Jane",
                            "last_name": "Doe",
                            "is_active": True,
                            "is_staff": False,
                            "date_joined": "2024-02-20T08:30:00Z",
                        },
                    )
                ],
            ),
            403: OpenApiResponse(description="Not authorized — staff only"),
            404: OpenApiResponse(description="User not found"),
        },
    )
    def get(self, request, pk):
        """Retrieve a single user — staff only."""
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = AdminUserSerializer(user)
        return Response(serializer.data)

    @extend_schema(
        summary="Update a user (staff only)",
        description=(
            "Partially updates a user's profile fields such as is_active, is_staff, "
            "first_name, last_name, etc. Accessible only by staff/admin users."
        ),
        request=AdminUserSerializer,
        responses={
            200: OpenApiResponse(description="User updated successfully", response=AdminUserSerializer),
            400: OpenApiResponse(description="Validation error"),
            403: OpenApiResponse(description="Not authorized — staff only"),
            404: OpenApiResponse(description="User not found"),
        },
        examples=[
            OpenApiExample(
                "Deactivate user",
                request_only=True,
                value={"is_active": False},
            ),
            OpenApiExample(
                "Promote to staff",
                request_only=True,
                value={"is_staff": True},
            ),
        ],
    )
    def patch(self, request, pk):
        """Partially update a user — staff only."""
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
