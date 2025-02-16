from django.db import models
from django.contrib.auth.models import User

# Create your models here.
  
class Hotel(models.Model):
    hotel_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    price_per_night = models.CharField(max_length=100)
    rating = models.CharField(max_length=50)
    description = models.TextField()
    general_info = models.TextField()
    amenities = models.JSONField()
    
    def __str__(self):
        return self.hotel_name
    
class Activity(models.Model):
    day = models.PositiveIntegerField()
    date = models.DateField()
    city = models.CharField(max_length=50, default="Null")
    location = models.CharField(max_length=255)
    activity_name = models.CharField(max_length=255)
    description = models.TextField()
    ticket_price = models.CharField(max_length=100)
    best_time_to_visit = models.CharField(max_length=50)
    
    def __str__(self):
        return self.activity_name
    
class TravelOption(models.Model):
    title = models.CharField(max_length=50, default="Null")
    method = models.CharField(max_length=50)
    details = models.TextField()
    
    def __str__(self):
        return self.method
    
class Flight(models.Model):
    airline = models.CharField(max_length=255)
    departure_time = models.CharField(max_length=100)
    arrival_time = models.CharField(max_length=100)
    price = models.CharField(max_length=100)
    
    def __str__(self):
        return self.airline

class ImportantNote(models.Model):
    title = models.CharField(max_length=100) 
    notes = models.TextField()
    
    def __str__(self):
        return self.title
    
class Itinerary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="itineraries")
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    source_location = models.CharField(max_length=400)
    destination_location = models.CharField(max_length=400)
    arrival_date = models.DateField()
    departure_date = models.DateField()
    total_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True)
    budget_used = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True)
    budget_type = models.CharField(max_length=50, choices=[('Economy', 'Economy'), ('Standard', 'Standard'), ('Luxury', 'Luxury')],)
    number_of_adults = models.PositiveIntegerField(default=1)
    number_of_children = models.PositiveIntegerField(default=0)
    hotel = models.ManyToManyField(Hotel, related_name='itineraries', blank=True)
    activities = models.ManyToManyField(Activity, related_name='itineraries', blank=True)
    travel_options = models.ManyToManyField(TravelOption, related_name='itineraries', blank=True)
    flight = models.ManyToManyField(Flight, related_name='itineraries', blank=True)
    note = models.ManyToManyField(ImportantNote, related_name='itineraries', blank=True)

    def __str__(self):
        return f"Itinerary from {self.source_location} to {self.destination_location}"