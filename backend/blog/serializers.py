from .models import Blog, Tag, Comment
from rest_framework import serializers
from .utils import upload_to_imagekit
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
    gallery = serializers.ImageField(write_only=True, required=False)
    gallery_url = serializers.URLField(read_only=True)
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'created_at', 'tags', 
                 'author', 'gallery', 'gallery_url', 'comments', 'likes']
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        # Extract gallery and tags
        gallery = validated_data.pop('gallery', None)
        tags_data = validated_data.pop('tags', [])

        try:
            # Create blog instance
            blog = Blog.objects.create(**validated_data)
            
            # Set tags
            blog.tags.set(tags_data)

            # Handle image upload
            if gallery:
                logger.info(f"Processing gallery upload for blog {blog.id}")
                try:
                    gallery_url = upload_to_imagekit(gallery)
                    blog.gallery_url = gallery_url
                    blog.save()
                except Exception as e:
                    logger.error(f"Failed to upload image: {str(e)}")
                    blog.delete()
                    raise serializers.ValidationError({
                        "gallery": f"Image upload failed: {str(e)}"
                    })

            return blog

        except Exception as e:
            logger.error(f"Error creating blog: {str(e)}")
            raise serializers.ValidationError(str(e))

    def update(self, instance, validated_data):
        gallery = validated_data.pop('gallery', None)
        
        if gallery:
            try:
                gallery_url = upload_to_imagekit(gallery)
                validated_data['gallery_url'] = gallery_url
            except Exception as e:
                logger.error(f"Failed to update image: {str(e)}")
                raise serializers.ValidationError({
                    "gallery": f"Image upload failed: {str(e)}"
                })

        return super().update(instance, validated_data)
    
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
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'likes']
        
    def get_likes(self, obj):
        return obj.likes.count()