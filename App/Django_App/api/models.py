from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import secrets
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(unique=True, error_messages={"unique": "A user with this email already exists."})
    bio = models.TextField(blank=True, null=True)
    token = models.CharField(max_length=128, blank=True, null=True, unique=True)
    profile_image = models.ImageField(upload_to="media/profile_images/", blank=True, null=True)
    followers = models.ManyToManyField("self", symmetrical=False, related_name="following", blank=True)
    
    # Use unique related_name to avoid conflict with auth.User
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_groups",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions",
        blank=True,
    )

    def save(self, *args, **kwargs):
        if not self.username or not self.email:
            raise ValidationError("Username and email are required")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

    def set_password(self, raw_password):
        super().set_password(raw_password)
        self.save()

    def generate_token(self):
        self.token = secrets.token_hex(16)
        self.save()

class Tweet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tweets")
    content = models.TextField()
    image = models.ImageField(upload_to="media/tweet_images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name="liked_tweets", blank=True)

    def __str__(self):
        return f"Tweet by {self.user.username}: {self.content[:20]}"

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name="comments", null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name="liked_comments", blank=True)
    dislikes = models.ManyToManyField(User, related_name="disliked_comments", blank=True)  # New field for dislikes

    def __str__(self):
        return f"Comment by {self.user.username}: {self.content[:20]}"

class Retweet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    original_tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name="retweets")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Retweet by {self.user.username} of tweet {self.original_tweet.id}"