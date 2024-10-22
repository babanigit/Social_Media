from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import secrets
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(unique=True, error_messages={"unique": "A user with this email already exists."})
    bio = models.TextField(blank=True, null=True)
    token = models.CharField(max_length=128, blank=True, null=True, unique=True)

    # Override related_name for groups and user_permissions to avoid conflict with auth.User
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_set",  # Custom related_name to avoid clashes
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions_set",  # Custom related_name to avoid clashes
        blank=True,
    )

    def save(self, *args, **kwargs):
        # Ensure required fields are filled
        if not self.username or not self.email:
            raise ValidationError("Username and email are required")
        # Call parent save method
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

    def set_password(self, raw_password):
        """Hashes the password before saving it."""
        super().set_password(raw_password)
        self.save()

    def generate_token(self):
        """Generates a unique token for the user."""
        self.token = secrets.token_hex(16)
        self.save()

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set when the object is created
    updated_at = models.DateTimeField(auto_now=True)  # Automatically updated on save

    def __str__(self):
        return f"Post by {self.user.username}: {self.content[:20]}"

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set when the object is created
    updated_at = models.DateTimeField(auto_now=True)  # Automatically updated on save

    def __str__(self):
        return f"Comment by {self.user.username}: {self.content[:20]}"
