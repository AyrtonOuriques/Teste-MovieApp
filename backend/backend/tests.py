from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import FavoriteMovieList
from rest_framework_simplejwt.tokens import RefreshToken

class AuthTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_register_user(self):
        url = reverse('register')
        data = {'username': 'newuser', 'password': 'newpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

    def test_add_favorite_movie(self):
        url = reverse('favorite-movie-list')
        data = {
            'title': 'test',
            'release_date': '2010-07-16',
            'poster_path': '/test.jpg',
            'movieId': 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FavoriteMovieList.objects.count(), 1)
        self.assertEqual(FavoriteMovieList.objects.get().title, 'test')

    def test_get_favorite_movies(self):
        FavoriteMovieList.objects.create(user=self.user, title='test', movieId=1)
        url = reverse('favorite-movie-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'test')

    def test_remove_favorite_movie(self):
        movie = FavoriteMovieList.objects.create(user=self.user, title='test', movieId=1)
        url = reverse('favorite-movie-detail', kwargs={'pk': movie.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(FavoriteMovieList.objects.count(), 0)