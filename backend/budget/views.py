from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status 
from .models import Expense, Report
from itinerary.models import Itinerary
from .serializers import ExpenseSerializer, ReportSerializer
from django.shortcuts import get_object_or_404
from agent.expense_agent import generate_spending_report
import json 

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
        
class ExpenseUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Expense.objects.filter(itinerary__user=self.request.user)
        
class GenerateReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, itinerary_id):
        itinerary = get_object_or_404(Itinerary, id=itinerary_id, user=request.user)
        generated_report_json_string = generate_spending_report(itinerary_id)
        generated_report_dict = json.loads(generated_report_json_string)
        report, created = Report.objects.update_or_create(
            itinerary=itinerary,
            defaults={"breakdown": generated_report_dict} 
        )

        serializer = ReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
class RetrieveReportView(generics.RetrieveAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        itinerary_id = self.kwargs["itinerary_id"]
        itinerary = get_object_or_404(Itinerary, id=itinerary_id, user=self.request.user)
        return get_object_or_404(Report, itinerary=itinerary)