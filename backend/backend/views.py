from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics, status
from .models import FavoriteMovieList
from .serializers import FavoriteMovieListSerializer, RegisterSerializer
from rest_framework.decorators import api_view

class FavoriteMovieListViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteMovieListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteMovieList.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = []

@api_view(['GET'])
def public_favorite_movies(request, username):
    user = get_object_or_404(User, username=username)
    favorite_movies = FavoriteMovieList.objects.filter(user=user)
    serializer = FavoriteMovieListSerializer(favorite_movies, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)