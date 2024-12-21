from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Blog, Tag
from .serializers import BlogSerializer, TagsSerializer
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([AllowAny])
def top_blogs(request):
    if request.method == "GET":
        blogs = Blog.objects.all().order_by('-created_at')[:5]
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def all_blogs(request):
    if request.method == "GET":
        blogs = Blog.objects.all().order_by('-created_at')
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def blog_content(request, pk):
    try:
        blog = Blog.objects.get(pk=pk)
    except Blog.DoesNotExist:
        return Response({'error': 'Blog not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method in ['PUT', 'DELETE'] and blog.author != request.user:
        return Response({'error': 'You are not authorized to modify this blog.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        serializer = BlogSerializer(blog)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        serializer = BlogSerializer(blog, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        blog.delete()
        return Response({'message': 'Blog deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)