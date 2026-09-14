from django.urls import path
from .views import OrderListCreateView, OrderDetailView, AdminOrderListView, AdminOrderUpdateView

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='orders'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order_detail'),
    # Admin endpoints
    path('admin/', AdminOrderListView.as_view(), name='admin_order_list'),
    path('admin/<int:pk>/', AdminOrderUpdateView.as_view(), name='admin_order_update'),
]