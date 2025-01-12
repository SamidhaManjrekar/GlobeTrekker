from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Tag(models.Model):
    tags = [
        ('adventure', 'adventure'),
        ('culture', 'culture'),
        ('budget', 'budget'),
        ('luxury', 'luxury'),
        ('backpacking', 'backpacking'),
        ('sightseeing', 'sightseeing'),
        ('nature', 'nature'),
        ('food', 'food'),
        ('beach', 'beach'),
        ('city', 'city'),
        ('mountain', 'mountain'),
        ('historical', 'historical'),
        ('solo', 'solo'),
        ('family', 'family'),
        ('romantic', 'romantic'),
        ('road_trip', 'road_trip'),
        ('eco_tourism', 'eco_tourism'),
        ('wildlife', 'wildlife'),
        ('festivals', 'festivals'),
        ('adventure_sports', 'adventure_sports'),
        ('urban_exploration', 'urban_exploration')
    ]
    name = models.CharField(max_length=20, choices=tags, unique=True)

    def __str__(self):
        return self.name

class Blog(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField() 
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')
    gallery = models.ImageField(upload_to='gallery/', blank=True, null=True)
    
    def __str__(self):
        return self.title
    
class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content