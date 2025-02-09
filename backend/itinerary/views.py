from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Itinerary
from .serializers import ItinerarySerializer, DestinationSerializer, BudgetSerializer
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
    
class BudgetUpdateView(generics.UpdateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Itinerary, pk=self.kwargs['pk'], user=self.request.user)

    def patch(self, request, *args, **kwargs):
        itinerary = self.get_object()
        serializer = self.get_serializer(itinerary, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Budget updated successfully!", "total_budget": serializer.data['total_budget']},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)