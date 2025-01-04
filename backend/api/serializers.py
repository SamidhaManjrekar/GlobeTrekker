from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='get_full_name', read_only=True)

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

    def update(self, instance, validated_data):
        name = validated_data.pop("name", None)
        if name:
            first_name, *last_name = name.split(" ", 1)
            last_name = last_name[0] if last_name else ""
            instance.first_name = first_name
            instance.last_name = last_name
        
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)

        password = validated_data.get("password", None)
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance