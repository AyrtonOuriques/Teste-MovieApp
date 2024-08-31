from rest_framework import serializers
from .models import FavoriteMovieList
from django.contrib.auth.models import User

class FavoriteMovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteMovieList
        fields = ['id', 'user', 'title', 'release_date', 'poster_path', 'added_at', 'movieId']
        read_only_fields = ['id', 'user', 'added_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user