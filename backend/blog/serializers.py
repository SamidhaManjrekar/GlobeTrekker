from .models import Blog, Tag, Comment
from rest_framework import serializers
import logging

logger = logging.getLogger(__name__)

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
    gallery_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    tags = serializers.SlugRelatedField(slug_field='name', queryset=Tag.objects.all(), many=True)
    author = serializers.SerializerMethodField()
    comments = CommentsSerializer(many=True, read_only=True)
    likes = serializers.SerializerMethodField()
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'created_at', 'tags', 'author', 'gallery_url', 'comments', 'likes']
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])

        blog = Blog.objects.create(**validated_data)
        blog.tags.set(tags_data)

        return blog

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)
        if tags_data is not None:
            instance.tags.set(tags_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def get_author(self, obj):
        return {
            "id": obj.author.id,
            "name": f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username,
        }

    def get_likes(self, obj):
        return obj.likes.count()
    
class LikeSerializer(serializers.ModelSerializer):
    liked = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)

    class Meta:
        model = Blog
        fields = ["id", "liked", "likes_count"]

    def get_liked(self, obj):
        user = self.context.get("request").user
        return user in obj.likes.all()
    

class TopBlogSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField() 
    gallery_url = serializers.URLField(read_only=True)
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'likes', 'gallery_url']
        
    def get_likes(self, obj):
        return obj.likes.count()