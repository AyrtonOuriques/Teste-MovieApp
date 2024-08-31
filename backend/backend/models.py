from django.db import models
from django.contrib.auth.models import User

class FavoriteMovieList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_movies')
    title = models.CharField(max_length=100, blank=True , null = True)
    release_date = models.DateField(blank=True, null = True)
    poster_path= models.CharField(max_length=200, blank=True)  # URL for the cover image
    added_at = models.DateTimeField(auto_now_add=True)
    movieId = models.IntegerField(blank=True, null = True)

    def __str__(self):
        return self.title