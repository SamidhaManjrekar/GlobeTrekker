from django.urls import path
from . import views

urlpatterns = [
    path('top_blogs/', views.top_blogs, name='top_blogs'),  
    path('all_blogs/', views.all_blogs, name='all_blogs'), 
    path('blog_content/<int:pk>/', views.blog_content, name='blog_content'),  
]