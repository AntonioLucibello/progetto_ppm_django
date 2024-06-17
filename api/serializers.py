from rest_framework import serializers
from .models import User, Post, Comment, Like

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.IntegerField(source='followers.count', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'following', 'followers_count']
        extra_kwargs = {
            'password': {'write_only': True},
        }

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']

class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'created_at']
