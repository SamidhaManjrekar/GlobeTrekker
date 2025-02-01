from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Itinerary
from .serializers import ItinerarySerializer, DestinationSerializer
from django.utils.timezone import now

class ItineraryListCreateView(generics.ListCreateAPIView):
    serializer_class = ItinerarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user).order_by('departure_date')


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class ItineraryListView(generics.RetrieveAPIView):
    serializer_class = ItinerarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        today = now().date() 
        return Itinerary.objects.filter(user=self.request.user, departure_date__gte=today).order_by('departure_date').first() 

class ItineraryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ItinerarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user)
    
class ItineraryDestinationsView(generics.ListAPIView):
    serializer_class = DestinationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user).only('destination_location')
    