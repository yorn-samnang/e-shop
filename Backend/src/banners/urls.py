from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BannerViewSet

router = DefaultRouter()
router.register('', BannerViewSet, basename='banners')

urlpatterns = router.urls
