from django.urls import path
from . import views

urlpatterns = [
    path('itineraries/<int:itinerary_id>/expenses/', views.ExpenseListCreateView.as_view(), name='expense-list-create'),
]