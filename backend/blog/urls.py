from django.urls import path
from . import views

urlpatterns = [
    path('your-blogs/', views.BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', views.BlogDetailView.as_view(), name='blog-detail'),
    path('tags/', views.TagCreateView.as_view(), name='tag-create'),
    path('tags/<int:tag_id>/blogs/', views.BlogByTagView.as_view(), name='blogs-by-tag'),
    path('all-blogs/', views.AllBlogView.as_view(), name='all-blogs'),
]