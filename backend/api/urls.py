from django.urls import path
from .views import UserDetailView, UserListView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/me/', UserDetailView.as_view(), name='user-detail'),
]