# views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as django_login
from django.core.paginator import Paginator
from django.db.models import Count, Q
from .models import User, Tweet, Comment, Retweet
from django.contrib.auth.hashers import check_password
from django.core.files.storage import default_storage


def index(request):
    return JsonResponse({"message": "Twitter Clone API is running"})


@csrf_exempt
def register(request):
    if request.method == "POST":
        try:
            if request.content_type == "application/json":
                data = json.loads(request.body)
            else:
                data = request.POST

            name = data.get("name")
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            bio = data.get("bio", "")
            profile_image = (
                request.FILES.get("profile_image") if request.FILES else None
            )

            if not all([username, email, password, name]):
                return JsonResponse(
                    {"error": "Username, email, name and password are required"},
                    status=400,
                )

            if User.objects.filter(Q(username=username) | Q(email=email)).exists():
                return JsonResponse(
                    {"error": "Username or email already exists"}, status=400
                )

            user = User(name=name, username=username, email=email, bio=bio)
            if profile_image:
                user.profile_image = profile_image
            user.set_password(password)
            user.save()
            user.generate_token()

            return JsonResponse(
                {
                    "message": "Registration successful",
                    "name": user.name,
                    "username": user.username,
                    "email": user.email,
                    "bio": user.bio,
                    "profile_image": (
                        user.profile_image.url if user.profile_image else None
                    ),
                },
                status=201,
            )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = (
                json.loads(request.body)
                if request.content_type == "application/json"
                else request.POST
            )
            username = data.get("username")
            password = data.get("password")

            if not all([username, password]):
                return JsonResponse(
                    {"error": "Username and password are required"}, status=400
                )

            try:
                user = User.objects.get(username=username)
                if check_password(password, user.password):
                    user.generate_token()
                    response = JsonResponse(
                        {
                            "message": "Login successful",
                            "username": user.username,
                            "email": user.email,
                            "bio": user.bio,
                            "profile_image": (
                                user.profile_image.url if user.profile_image else None
                            ),
                            "token": user.token,  # Include token for local storage
                        },
                        status=200,
                    )

                    response.set_cookie(
                        key="auth_token",
                        value=user.token,
                        httponly=True,
                        secure=True,  # Set True for HTTPS environments
                        samesite="None",  # Allows cross-site cookies
                        max_age=7 * 24 * 60 * 60,  # 7 days
                    )
                    return response
                return JsonResponse({"error": "Invalid credentials"}, status=401)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def logout(request):
    if request.method == "POST":
        response = JsonResponse({"message": "Logged out successfully"})
        response.delete_cookie("auth_token")
        return response
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def create_tweet(request):
    if request.method == "POST":
        # Attempt to retrieve the token from the cookie first
        token = request.COOKIES.get("auth_token")

        # If no cookie is present, check the Authorization header for the token
        if not token:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Token "):
                token = auth_header.split(" ")[1]  # Extract the token part
            else:
                return JsonResponse({"error": "Authentication required"}, status=401)

        try:
            # Verify the user by matching the token
            user = User.objects.get(token=token)

            # Check content type and parse the data accordingly
            if request.content_type == "application/json":
                data = json.loads(request.body)
                content = data.get("content", "")
            else:
                # For form-data or URL-encoded requests
                content = request.POST.get("content", "")

            image = request.FILES.get("image")

            # Ensure either content or image is provided
            if not content and not image:
                return JsonResponse(
                    {"error": "Content or image is required"}, status=400
                )

            # Create the tweet
            tweet = Tweet.objects.create(user=user, content=content)

            # Attach the image if provided
            if image:
                tweet.image = image
                tweet.save()

            return JsonResponse(
                {
                    "message": "Tweet created successfully",
                    "tweet_id": tweet.id,
                    "content": tweet.content,
                    "image": tweet.image.url if tweet.image else None,
                    "created_at": tweet.created_at,
                },
                status=201,
            )

        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def update_tweet(request, tweet_id):
    if request.method in ["PUT", "PATCH"]:
        token = request.COOKIES.get("auth_token")
        if not token:
            return JsonResponse({"error": "Authentication required"}, status=401)

        try:
            user = User.objects.get(token=token)
            tweet = Tweet.objects.get(id=tweet_id, user=user)

            # Check the content type and parse the data accordingly
            if request.content_type == "application/json":
                data = json.loads(request.body)
            else:
                data = request.POST

            # Get content or return an error if no data provided
            content = data.get("content", None)

            if not content:
                return JsonResponse(
                    {"error": "Content is required to update the tweet"}, status=400
                )

            # Update the tweet content and save
            tweet.content = content
            tweet.save()

            return JsonResponse(
                {
                    "message": "Tweet updated successfully",
                    "tweet_id": tweet.id,
                    "content": tweet.content,
                    "updated_at": tweet.updated_at,
                },
                status=200,
            )

        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid authentication token"}, status=401)
        except Tweet.DoesNotExist:
            return JsonResponse(
                {
                    "error": "Tweet not found or you're not authorized to update this tweet"
                },
                status=404,
            )
        except Exception as e:
            return JsonResponse(
                {"error": f"An unexpected error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def delete_tweet(request, tweet_id):
    if request.method == "DELETE":
        token = request.COOKIES.get("auth_token")
        if not token:
            return JsonResponse({"error": "Authentication required"}, status=401)

        try:
            user = User.objects.get(token=token)
            tweet = Tweet.objects.get(id=tweet_id, user=user)
            tweet.delete()
            return JsonResponse({"message": "Tweet deleted successfully"}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid authentication token"}, status=401)

        except Tweet.DoesNotExist:
            return JsonResponse(
                {"error": "Tweet not found or unauthorized"}, status=404
            )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_Users_and_Tweets(request):
    if request.method == "GET":
        try:
            page = int(request.GET.get("page", 1))
            per_page = int(request.GET.get("per_page", 10))
            user_id = request.GET.get("user_id")
            following_only = request.GET.get("following_only") == "true"

            # Start with users query
            users = User.objects.annotate(
                followers_count=Count("followers"), following_count=Count("following")
            )

            # Filter users if needed
            if user_id:
                users = users.filter(id=user_id)

            token = request.COOKIES.get("auth_token")
            if following_only and token:
                try:
                    current_user = User.objects.get(token=token)
                    following_ids = current_user.following.values_list("id", flat=True)
                    users = users.filter(id__in=following_ids)
                except User.DoesNotExist:
                    return JsonResponse(
                        {"error": "Invalid authentication token"}, status=401
                    )

            # Paginate users instead of tweets
            paginator = Paginator(users.order_by("id"), per_page)
            page_obj = paginator.get_page(page)

            users_data = []
            for user in page_obj:
                # Get tweets for each user with annotations
                user_tweets = (
                    Tweet.objects.filter(user=user)
                    .annotate(
                        like_count=Count("likes"),
                        comment_count=Count("comments"),
                        retweet_count=Count("retweets"),
                    )
                    .order_by("-created_at")
                )

                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "name": user.name,
                    "profile_image": (
                        user.profile_image.url if user.profile_image else None
                    ),
                    "followers_count": user.followers_count,
                    "following_count": user.following_count,
                    "tweets": [
                        {
                            "id": tweet.id,
                            "content": tweet.content,
                            "image": tweet.image.url if tweet.image else None,
                            "created_at": tweet.created_at,
                            "likes_count": tweet.like_count,
                            "comments_count": tweet.comment_count,
                            "retweets_count": tweet.retweet_count,
                        }
                        for tweet in user_tweets
                    ],
                }
                users_data.append(user_data)

            return JsonResponse(
                {
                    "users": users_data,
                    "total_pages": paginator.num_pages,
                    "current_page": page,
                    "has_next": page_obj.has_next(),
                    "has_previous": page_obj.has_previous(),
                },
                status=200,
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_tweets(request):
    if request.method == "GET":
        try:
            page = int(request.GET.get("page", 1))
            per_page = int(request.GET.get("per_page", 10))
            user_id = request.GET.get("user_id")
            following_only = request.GET.get("following_only") == "true"

            # Start with tweets query with annotations
            tweets = (
                Tweet.objects.annotate(
                    like_count=Count("likes"),
                    comment_count=Count("comments"),
                    retweet_count=Count("retweets"),
                )
                .select_related("user")
                .order_by("-created_at")
            )

            # Add user annotations to avoid N+1 queries
            tweets = tweets.annotate(
                user_followers_count=Count("user__followers"),
                user_following_count=Count("user__following"),
            )

            # Filter tweets if needed
            if user_id:
                tweets = tweets.filter(user_id=user_id)

            token = request.COOKIES.get("auth_token")
            if following_only and token:
                try:
                    current_user = User.objects.get(token=token)
                    following_ids = current_user.following.values_list("id", flat=True)
                    tweets = tweets.filter(user_id__in=following_ids)
                except User.DoesNotExist:
                    return JsonResponse(
                        {"error": "Invalid authentication token"}, status=401
                    )

            # Paginate tweets
            paginator = Paginator(tweets, per_page)
            page_obj = paginator.get_page(page)

            tweets_data = []
            for tweet in page_obj:
                tweet_data = {
                    "id": tweet.id,
                    "content": tweet.content,
                    "image": tweet.image.url if tweet.image else None,
                    "created_at": tweet.created_at,
                    "likes_count": tweet.like_count,
                    "comments_count": tweet.comment_count,
                    "retweets_count": tweet.retweet_count,
                    "user": {
                        "id": tweet.user.id,
                        "username": tweet.user.username,
                        "name": tweet.user.name,
                        "profile_image": (
                            tweet.user.profile_image.url
                            if tweet.user.profile_image
                            else None
                        ),
                        "followers_count": tweet.user_followers_count,
                        "following_count": tweet.user_following_count,
                    },
                }
                tweets_data.append(tweet_data)

            return JsonResponse(
                {
                    "tweets": tweets_data,
                    "total_pages": paginator.num_pages,
                    "current_page": page,
                    "has_next": page_obj.has_next(),
                    "has_previous": page_obj.has_previous(),
                },
                status=200,
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def like_tweet(request, tweet_id):
    if request.method == "POST":
        token = request.COOKIES.get("auth_token")
        if not token:
            return JsonResponse({"error": "Authentication required"}, status=401)

        try:
            user = User.objects.get(token=token)
            tweet = Tweet.objects.get(id=tweet_id)

            if user in tweet.likes.all():
                tweet.likes.remove(user)
                action = "unliked"
            else:
                tweet.likes.add(user)
                action = "liked"

            return JsonResponse(
                {
                    "message": f"Tweet {action} successfully",
                    "likes_count": tweet.likes.count(),
                },
                status=200,
            )

        except Tweet.DoesNotExist:
            return JsonResponse({"error": "Tweet not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def comment_on_tweet(request, tweet_id):
    if request.method == "POST":
        token = request.COOKIES.get("auth_token")
        if not token:
            return JsonResponse({"error": "Authentication required"}, status=401)

        try:
            user = User.objects.get(token=token)
            tweet = Tweet.objects.get(id=tweet_id)

            data = (
                json.loads(request.body)
                if request.content_type == "application/json"
                else request.POST
            )
            content = data.get("content")

            if not content:
                return JsonResponse(
                    {"error": "Comment content is required"}, status=400
                )

            comment = Comment.objects.create(tweet=tweet, user=user, content=content)

            return JsonResponse(
                {
                    "message": "Comment added successfully",
                    "comment_id": comment.id,
                    "content": comment.content,
                    "created_at": comment.created_at,
                    "username": user.username,
                },
                status=201,
            )

        except Tweet.DoesNotExist:
            return JsonResponse({"error": "Tweet not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "GET":
        try:
            tweet = Tweet.objects.get(id=tweet_id)
            comments = Comment.objects.filter(tweet=tweet).select_related("user")

            comments_data = [
                {
                    "id": comment.id,
                    "content": comment.content,
                    "created_at": comment.created_at,
                    "user": {
                        "id": comment.user.id,
                        "username": comment.user.username,
                        "profile_image": (
                            comment.user.profile_image.url
                            if comment.user.profile_image
                            else None
                        ),
                    },
                }
                for comment in comments
            ]

            return JsonResponse({"comments": comments_data}, status=200)

        except Tweet.DoesNotExist:
            return JsonResponse({"error": "Tweet not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def retweet(request, tweet_id):
    if request.method == "POST":
        token = request.COOKIES.get("auth_token")
        if not token:
            return JsonResponse({"error": "Authentication required"}, status=401)

        try:
            user = User.objects.get(token=token)
            tweet = Tweet.objects.get(id=tweet_id)

            # Check if user already retweeted
            existing_retweet = Retweet.objects.filter(
                user=user, original_tweet=tweet
            ).first()

            if existing_retweet:
                existing_retweet.delete()
                action = "unretweeted"
            else:
                Retweet.objects.create(user=user, original_tweet=tweet)
                action = "retweeted"

            return JsonResponse(
                {
                    "message": f"Tweet {action} successfully",
                    "retweets_count": tweet.retweets.count(),
                },
                status=200,
            )

        except Tweet.DoesNotExist:
            return JsonResponse({"error": "Tweet not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def follow_user(request, user_id):
    if request.method == "POST":
        token = request.COOKIES.get("auth_token")
        if not token:
            return JsonResponse({"error": "Authentication required"}, status=401)

        try:
            current_user = User.objects.get(token=token)
            user_to_follow = User.objects.get(id=user_id)

            if current_user == user_to_follow:
                return JsonResponse({"error": "Cannot follow yourself"}, status=400)

            if user_to_follow in current_user.following.all():
                current_user.following.remove(user_to_follow)
                action = "unfollowed"
            else:
                current_user.following.add(user_to_follow)
                action = "followed"

            return JsonResponse(
                {
                    "message": f"Successfully {action} user",
                    "followers_count": user_to_follow.followers.count(),
                    "following_count": user_to_follow.following.count(),
                },
                status=200,
            )

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_user_profile(request, username):
    if request.method == "GET":
        try:
            user = User.objects.get(username=username)

            # Get follower and following counts
            followers_count = user.followers.count()
            following_count = user.following.count()
            tweets_count = Tweet.objects.filter(user=user).count()

            # Check if the requesting user follows this profile
            is_following = False
            if request.COOKIES.get("auth_token"):
                try:
                    current_user = User.objects.get(
                        token=request.COOKIES.get("auth_token")
                    )
                    is_following = current_user.following.filter(id=user.id).exists()
                except User.DoesNotExist:
                    pass

            return JsonResponse(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "bio": user.bio,
                    "profile_image": (
                        user.profile_image.url if user.profile_image else None
                    ),
                    "followers_count": followers_count,
                    "following_count": following_count,
                    "tweets_count": tweets_count,
                    "is_following": is_following,
                    "joined_date": user.date_joined,
                },
                status=200,
            )

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def update_profile(request):
    if request.method in ["PUT", "PATCH"]:
        token = request.COOKIES.get("auth_token")
        if not token:
            return JsonResponse({"error": "Authentication required"}, status=401)

        try:
            user = User.objects.get(token=token)

            if request.content_type == "application/json":
                data = json.loads(request.body)
            else:
                data = request.POST

            # Update fields if provided
            if "bio" in data:
                user.bio = data["bio"]

            if request.FILES and "profile_image" in request.FILES:
                # Delete old profile image if it exists
                if user.profile_image:
                    default_storage.delete(user.profile_image.path)
                user.profile_image = request.FILES["profile_image"]

            user.save()

            return JsonResponse(
                {
                    "message": "Profile updated successfully",
                    "username": user.username,
                    "bio": user.bio,
                    "profile_image": (
                        user.profile_image.url if user.profile_image else None
                    ),
                },
                status=200,
            )

        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_user_tweets(request, username):
    if request.method == "GET":
        try:
            user = User.objects.get(username=username)
            page = int(request.GET.get("page", 1))
            per_page = int(request.GET.get("per_page", 10))

            tweets = (
                Tweet.objects.filter(user=user)
                .select_related("user")
                .prefetch_related("likes", "comments", "retweets")
                .annotate(
                    like_count=Count("likes"),
                    comment_count=Count("comments"),
                    retweet_count=Count("retweets"),
                )
                .order_by("-created_at")
            )

            paginator = Paginator(tweets, per_page)
            page_obj = paginator.get_page(page)

            tweets_data = [
                {
                    "id": tweet.id,
                    "content": tweet.content,
                    "image": tweet.image.url if tweet.image else None,
                    "created_at": tweet.created_at,
                    "likes_count": tweet.like_count,
                    "comments_count": tweet.comment_count,
                    "retweets_count": tweet.retweet_count,
                }
                for tweet in page_obj
            ]

            return JsonResponse(
                {
                    "tweets": tweets_data,
                    "total_pages": paginator.num_pages,
                    "current_page": page,
                    "has_next": page_obj.has_next(),
                    "has_previous": page_obj.has_previous(),
                },
                status=200,
            )

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


def search(request):
    if request.method == "GET":
        try:
            query = request.GET.get("q", "").strip()
            type = request.GET.get("type", "all")  # tweets, users, or all
            page = int(request.GET.get("page", 1))
            per_page = int(request.GET.get("per_page", 10))

            if not query:
                return JsonResponse({"error": "Search query is required"}, status=400)

            results = []

            if type in ["tweets", "all"]:
                tweets = (
                    Tweet.objects.filter(Q(content__icontains=query))
                    .select_related("user")
                    .prefetch_related("likes", "comments", "retweets")
                    .annotate(
                        like_count=Count("likes"),
                        comment_count=Count("comments"),
                        retweet_count=Count("retweets"),
                    )
                )

                tweets_data = [
                    {
                        "type": "tweet",
                        "id": tweet.id,
                        "content": tweet.content,
                        "image": tweet.image.url if tweet.image else None,
                        "created_at": tweet.created_at,
                        "user": {
                            "id": tweet.user.id,
                            "username": tweet.user.username,
                            "profile_image": (
                                tweet.user.profile_image.url
                                if tweet.user.profile_image
                                else None
                            ),
                        },
                        "likes_count": tweet.like_count,
                        "comments_count": tweet.comment_count,
                        "retweets_count": tweet.retweet_count,
                    }
                    for tweet in tweets
                ]

                results.extend(tweets_data)

            if type in ["users", "all"]:
                users = User.objects.filter(
                    Q(username__icontains=query) | Q(bio__icontains=query)
                ).annotate(
                    followers_count=Count("followers"),
                    following_count=Count("following"),
                )

                users_data = [
                    {
                        "type": "user",
                        "id": user.id,
                        "username": user.username,
                        "bio": user.bio,
                        "profile_image": (
                            user.profile_image.url if user.profile_image else None
                        ),
                        "followers_count": user.followers_count,
                        "following_count": user.following_count,
                    }
                    for user in users
                ]

                results.extend(users_data)

            # Paginate results
            paginator = Paginator(results, per_page)
            page_obj = paginator.get_page(page)

            return JsonResponse(
                {
                    "results": list(page_obj),
                    "total_pages": paginator.num_pages,
                    "current_page": page,
                    "has_next": page_obj.has_next(),
                    "has_previous": page_obj.has_previous(),
                },
                status=200,
            )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_notifications(request):
    if request.method == "GET":
        token = request.COOKIES.get("auth_token")
        if not token:
            return JsonResponse({"error": "Authentication required"}, status=401)

        try:
            user = User.objects.get(token=token)

            # Get likes on user's tweets
            likes = Tweet.objects.filter(user=user, likes__isnull=False).select_related(
                "likes"
            )

            # Get comments on user's tweets
            comments = Comment.objects.filter(tweet__user=user).select_related(
                "user", "tweet"
            )

            # Get retweets of user's tweets
            retweets = Retweet.objects.filter(original_tweet__user=user).select_related(
                "user", "original_tweet"
            )

            # Get new followers
            followers = user.followers.all()

            notifications = []

            # Process likes
            for tweet in likes:
                for like_user in tweet.likes.all():
                    if like_user != user:
                        notifications.append(
                            {
                                "type": "like",
                                "user": like_user.username,
                                "tweet_id": tweet.id,
                                "created_at": tweet.created_at,
                            }
                        )

            # Process comments
            for comment in comments:
                if comment.user != user:
                    notifications.append(
                        {
                            "type": "comment",
                            "user": comment.user.username,
                            "tweet_id": comment.tweet.id,
                            "comment_id": comment.id,
                            "created_at": comment.created_at,
                        }
                    )

            # Process retweets
            for retweet in retweets:
                if retweet.user != user:
                    notifications.append(
                        {
                            "type": "retweet",
                            "user": retweet.user.username,
                            "tweet_id": retweet.original_tweet.id,
                            "created_at": retweet.created_at,
                        }
                    )

            # Process new followers
            for follower in followers:
                notifications.append(
                    {
                        "type": "follow",
                        "user": follower.username,
                        "created_at": follower.date_joined,
                    }
                )

            # Sort notifications by date
            notifications.sort(key=lambda x: x["created_at"], reverse=True)

            return JsonResponse({"notifications": notifications}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)
