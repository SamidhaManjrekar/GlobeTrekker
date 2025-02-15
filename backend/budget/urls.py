from django.urls import path
from . import views

urlpatterns = [
    path('itineraries/<int:itinerary_id>/expenses/', views.ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', views.ExpenseUpdateDeleteView.as_view(), name='expense-update-delete'),
    path('itineraries/<int:itinerary_id>/generate-report/', views.GenerateReportView.as_view(), name='generate-report'),
    path('itineraries/<int:itinerary_id>/report/', views.RetrieveReportView.as_view(), name='retrieve-report'),
]