from django.db import models
from itinerary.models import Itinerary
# Create your models here.

class Expense(models.Model):
    category_choices = [
        ("Food", "Food"),
        ("Transport", "Transport"), 
        ("Accommodation", "Accommodation"),
        ("Entertainment", "Entertainment"),
        ("Shopping", "Shopping"),
        ("Others", "Others"),
    ]

    payment_method_choices = [
        ("Cash", "Cash"),
        ("Card", "Card"),
        ("UPI", "UPI"),
        ("Bank Transfer", "Bank Transfer"),
    ]

    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name="expenses")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=category_choices)
    payment_method = models.CharField(max_length=20, choices=payment_method_choices)
    description = models.TextField()
    date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"Expense for {self.category}"
    
class Report(models.Model):
    itinerary = models.OneToOneField(Itinerary, on_delete=models.CASCADE, related_name="report")
    generated_at = models.DateTimeField(auto_now_add=True)
    breakdown = models.JSONField(default=dict) 

    def __str__(self):
        return f"Report for Itinerary {self.itinerary.id}"