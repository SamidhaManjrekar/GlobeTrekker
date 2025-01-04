from rest_framework import generics, permissions
from .models import Blog, Tag
from .serializers import BlogSerializer, TagsSerializer
from rest_framework.exceptions import PermissionDenied 

class BlogListCreateView(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Blog.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Blog.objects.all() 

    def get_object(self):
        obj = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE'] and self.request.user != obj.author:
            raise PermissionDenied("You do not have permission to modify this blog.")
        return obj

class BlogByTagView(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tag_id = self.kwargs['tag_id']
        return Blog.objects.filter(tags__id=tag_id)

class AllBlogView(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Blog.objects.all()
    
class TagCreateView(generics.CreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagsSerializer