import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as django_login
from .models import User, Post, Comment

def index(request):
    return JsonResponse({'message': 'Server is running'})

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        bio = data.get('bio', '')

        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password, bio=bio)
        return JsonResponse({"message": "User registered successfully"}, status=201)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            django_login(request, user)
            return JsonResponse({"message": "Login successful"}, status=200)
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def add_post(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in"}, status=401)

        data = json.loads(request.body)
        content = data.get('content')

        if not content:
            return JsonResponse({"error": "Content is required"}, status=400)

        post = Post.objects.create(user=request.user, content=content)
        return JsonResponse({"message": "Post created successfully", "post_id": post.id}, status=201)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def update_post(request, post_id):
    if request.method == "PUT":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in"}, status=401)

        try:
            post = Post.objects.get(id=post_id, user=request.user)
            data = json.loads(request.body)
            content = data.get('content')

            if not content:
                return JsonResponse({"error": "Content is required"}, status=400)

            post.content = content
            post.save()
            return JsonResponse({"message": "Post updated successfully"}, status=200)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found or you're not the owner"}, status=404)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def delete_post(request, post_id):
    if request.method == "DELETE":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in"}, status=401)

        try:
            post = Post.objects.get(id=post_id, user=request.user)
            post.delete()
            return JsonResponse({"message": "Post deleted successfully"}, status=200)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found or you're not the owner"}, status=404)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def view_posts(request):
    if request.method == "GET":
        posts = Post.objects.all().values('id', 'content', 'created_at', 'user__username')
        return JsonResponse({"posts": list(posts)}, status=200)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def comment_on_post(request, post_id):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in"}, status=401)

        data = json.loads(request.body)
        content = data.get('content')

        if not content:
            return JsonResponse({"error": "Comment content is required"}, status=400)

        try:
            post = Post.objects.get(id=post_id)
            Comment.objects.create(post=post, user=request.user, content=content)
            return JsonResponse({"message": "Comment added successfully"}, status=201)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found"}, status=404)

    return JsonResponse({"error": "Method not allowed"}, status=405)
