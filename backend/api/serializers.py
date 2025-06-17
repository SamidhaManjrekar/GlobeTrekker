from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "first_name", "last_name", "email"]
        extra_kwargs = {
            "password": {"write_only": True}, 
        }

    def validate_username(self, value):
        if self.instance:
            if self.instance.username == value:
                return value
            if User.objects.exclude(pk=self.instance.pk).filter(username=value).exists():
                raise serializers.ValidationError("Username already exists.")
        else: 
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if self.instance:
            if self.instance.email == value:
                return value
            if User.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                raise serializers.ValidationError("Email already exists.")
        else:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None) 
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        instance.save()
        return instance