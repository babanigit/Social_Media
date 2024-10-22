import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as django_login
from .models import User, Post, Comment

from django.contrib.auth.hashers import check_password


def index(request):
    return JsonResponse({"message": "Server is running"})


@csrf_exempt
def register(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        bio = data.get("bio", "")

        if not username or not email or not password:
            return JsonResponse(
                {"error": "All fields (username, email, password) are required"},
                status=400,
            )

        # Check for existing user with the same username or email
        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

        try:
            user = User(username=username, email=email, bio=bio)
            user.set_password(password)  # Hash the password before saving
            user.save()
            user.generate_token()  # Generate token on registration

            return JsonResponse({"username": user.username}, status=201)
        except Exception as e:
            return JsonResponse(
                {"error": f"An error occurred during registration: {str(e)}"},
                status=500,
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "Both username and password are required"}, status=400
            )

        try:
            user = User.objects.get(username=username)

            # Check if the entered password matches the hashed password
            if check_password(password, user.password):
                # Log the user in (using session or token management)
                user.generate_token()  # Optionally generate a new token

                response = JsonResponse(
                    {
                        "message": "Login successful",
                        "username": user.username,
                    },
                    status=200,
                )

                # Set the token in cookies
                response.set_cookie(
                    key="auth_token",
                    value=user.token,
                    httponly=True,  # Prevents JavaScript access to the cookie
                    secure=False,  # Set to True if you're using HTTPS
                    samesite="Lax",  # Prevents CSRF attacks to some extent
                )

                return response
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)
        except Exception as e:
            return JsonResponse(
                {"error": f"An unexpected error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def add_post(request):
    if request.method == "POST":
        # Get the token from the cookies
        token = request.COOKIES.get("auth_token")

        if not token:
            return JsonResponse(
                {"error": "Authentication required. Please login first."}, status=401
            )

        try:
            # Retrieve the user based on the token
            user = User.objects.get(token=token)
            
            print("user is after token: ", user)
            
            # Parse the request body
            data = json.loads(request.body)
            content = data.get("content")

            if not content:
                return JsonResponse({"error": "Content is required"}, status=400)

            # Create the post using the authenticated user
            post = Post.objects.create(user=user, content=content)
            
            return JsonResponse(
                {
                    "message": "Post created successfully",
                    "post_id": post.id,
                    "user": user.username,  # Return the username instead of the whole user object
                },
                status=201,
            )

        # Handle case where the token does not match any user
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "Invalid or expired token. Please login again."}, status=401
            )
        
        # Catch any unexpected errors
        except Exception as e:
            return JsonResponse(
                {"error": f"An unexpected error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def update_post(request, post_id):
    if request.method == "PUT":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in"}, status=401)

        try:
            post = Post.objects.get(id=post_id, user=request.user)
            data = json.loads(request.body)
            content = data.get("content")

            if not content:
                return JsonResponse({"error": "Content is required"}, status=400)

            post.content = content
            post.save()
            return JsonResponse({"message": "Post updated successfully"}, status=200)
        except Post.DoesNotExist:
            return JsonResponse(
                {"error": "Post not found or you're not the owner"}, status=404
            )

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
            return JsonResponse(
                {"error": "Post not found or you're not the owner"}, status=404
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def view_posts(request):
    if request.method == "GET":
        posts = Post.objects.all().values(
            "id", "content", "created_at", "user__username"
        )
        return JsonResponse({"posts": list(posts)}, status=200)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def comment_on_post(request, post_id):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in"}, status=401)

        data = json.loads(request.body)
        content = data.get("content")

        if not content:
            return JsonResponse({"error": "Comment content is required"}, status=400)

        try:
            post = Post.objects.get(id=post_id)
            Comment.objects.create(post=post, user=request.user, content=content)
            return JsonResponse({"message": "Comment added successfully"}, status=201)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found"}, status=404)

    return JsonResponse({"error": "Method not allowed"}, status=405)
