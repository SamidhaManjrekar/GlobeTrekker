from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)  

    class Meta:
        model = User
        fields = ["id", "username", "password", "name", "email"] 
        extra_kwargs = {
            "password": {"write_only": True},  
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        name = validated_data.pop("name", "")
        first_name, *last_name = name.split(" ", 1)
        last_name = last_name[0] if last_name else ""  
        
        user = User.objects.create_user(
            **validated_data,
            first_name=first_name,
            last_name=last_name
        )
        return user