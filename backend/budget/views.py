from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Expense
from itinerary.models import Itinerary
from .serializers import ExpenseSerializer
from django.shortcuts import get_object_or_404

# Create your views here.
class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        itinerary_id = self.kwargs["itinerary_id"] 
        return Expense.objects.filter(itinerary_id=itinerary_id)
    
    def perform_create(self, serializer):
        itinerary_id = self.kwargs.get("itinerary_id")
        itinerary = get_object_or_404(Itinerary, id=itinerary_id, user=self.request.user)

        expense = serializer.save(itinerary=itinerary)
        itinerary.budget_used += expense.amount
        itinerary.save()
    
    
