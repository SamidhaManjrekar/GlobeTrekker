from rest_framework import serializers
from .models import Expense, Report

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__' 

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["itinerary", "generated_at", "breakdown"] 

    itinerary = serializers.PrimaryKeyRelatedField(read_only=True)  