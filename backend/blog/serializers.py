from .models import Blog, Tag, Comment
from rest_framework import serializers

class TagsSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Tag
        fields = ["name"]
        
class CommentsSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'author']

    def get_author(self, obj):
        return obj.author.username
        
class BlogSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(slug_field='name', queryset=Tag.objects.all(), many=True)
    author = serializers.SerializerMethodField()
    comments = CommentsSerializer(many=True, read_only=True) 
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'created_at', 'tags', 'author', 'gallery', 'comments']
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])  
        blog = Blog.objects.create(**validated_data)
        blog.tags.set(tags_data)
        return blog
    
    def get_author(self, obj):
        full_name = f"{obj.author.first_name} {obj.author.last_name}".strip()
        return full_name if full_name else obj.author.username