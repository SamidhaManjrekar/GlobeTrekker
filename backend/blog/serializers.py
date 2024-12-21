from .models import Blog, Tag
from rest_framework import serializers

class TagsSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Tag
        fields = ["id", "name"]
        
class BlogSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all())  

    class Meta: 
        model = Blog
        fields = ['id', 'title', 'content', 'created_at', 'tags', 'author', 'gallery']
        extra_kwargs = {"author": {"read_only": True}}  
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])  
        blog = Blog.objects.create(**validated_data)
        blog.tags.set(tags_data) 
        return blog