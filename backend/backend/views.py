from django.shortcuts import render

from rest_framework import viewsets, permissions, generics
from .models import FavoriteMovieList
from .serializers import FavoriteMovieListSerializer, RegisterSerializer

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