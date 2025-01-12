from django.urls import path
from . import views

urlpatterns = [
    path('itineraries/', views.ItineraryListCreateView.as_view() , name='itinerary-list-create'), 
    path('itineraries/upcoming/', views.ItineraryListView.as_view() , name='itinerary-list-first'),   
    path('itineraries/<int:pk>/', views.ItineraryDetailView.as_view() , name='itinerary-detail'), 
    path('itineraries/destinations/', views.ItineraryDestinationsView.as_view() , name='itinerary-destinations'), 
]