from django.urls import path
from . import views

urlpatterns = [
    path('your-blogs/', views.BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', views.BlogDetailView.as_view(), name='blog-detail'),
    path('tags/', views.TagListCreateView.as_view(), name='tag-list-create'),
    path('tags/<int:tag_id>/blogs/', views.BlogByTagView.as_view(), name='blogs-by-tag'),
    path('all-blogs/', views.AllBlogView.as_view(), name='all-blogs'),
    path('blogs/<int:blog_id>/comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
]