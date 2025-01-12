from rest_framework import serializers
from .models import Itinerary, Hotel, Activity, TravelOption, Flight, ImportantNote


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class TravelOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelOption
        fields = '__all__'


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class ImportantNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImportantNote
        fields = '__all__'
        
class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['destination_location']
        extra_kwargs = {'user': {'read_only': True}}

class ItinerarySerializer(serializers.ModelSerializer):
    hotel = HotelSerializer(many=True, required=False)
    activities = ActivitySerializer(many=True, required=False)
    travel_options = TravelOptionSerializer(many=True, required=False)
    flight = FlightSerializer(many=True, required=False)
    note = ImportantNoteSerializer(many=True, required=False)

    class Meta:
        model = Itinerary
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        hotel_data = validated_data.pop('hotel', [])
        activities_data = validated_data.pop('activities', [])
        travel_options_data = validated_data.pop('travel_options', [])
        flight_data = validated_data.pop('flight', [])
        note_data = validated_data.pop('note', [])

        itinerary = Itinerary.objects.create(**validated_data)

        if hotel_data:
            for hotel in hotel_data:
                hotel_instance = Hotel.objects.create(**hotel)
                itinerary.hotel.add(hotel_instance)

        if activities_data:
            for activity in activities_data:
                activity_instance = Activity.objects.create(**activity)
                itinerary.activities.add(activity_instance)

        if travel_options_data:
            for travel_option in travel_options_data:
                travel_option_instance = TravelOption.objects.create(**travel_option)
                itinerary.travel_options.add(travel_option_instance)

        if flight_data:
            for flight in flight_data:
                flight_instance = Flight.objects.create(**flight)
                itinerary.flight.add(flight_instance)

        if note_data:
            for note in note_data:
                note_instance = ImportantNote.objects.create(**note)
                itinerary.note.add(note_instance)
                
        return itinerary

    def update(self, instance, validated_data):
        hotel_data = validated_data.pop('hotel', [])
        activities_data = validated_data.pop('activities', [])
        travel_options_data = validated_data.pop('travel_options', [])
        flight_data = validated_data.pop('flight', [])
        note_data = validated_data.pop('note', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if hotel_data:
            instance.hotel.clear()
            for hotel in hotel_data:
                hotel_instance = Hotel.objects.create(**hotel)
                instance.hotel.add(hotel_instance)

        if activities_data:
            instance.activities.clear()
            for activity in activities_data:
                activity_instance = Activity.objects.create(**activity)
                instance.activities.add(activity_instance)

        if travel_options_data:
            instance.travel_options.clear()
            for travel_option in travel_options_data:
                travel_option_instance = TravelOption.objects.create(**travel_option)
                instance.travel_options.add(travel_option_instance)

        if flight_data:
            instance.flight.clear()
            for flight in flight_data:
                flight_instance = Flight.objects.create(**flight)
                instance.flight.add(flight_instance)

        if note_data:
            instance.note.clear()
            for note in note_data:
                note_instance = ImportantNote.objects.create(**note)
                instance.note.add(note_instance)

        return instance