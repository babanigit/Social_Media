# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Base endpoints
    path('', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('user/', views.get_user_info, name='user'),
    
    # Tweet operations
    path('tweets/', views.get_tweets, name='get_tweets'),
    path('tweets/create/', views.create_tweet, name='create_tweet'),
    path('tweets/<int:tweet_id>/', views.update_tweet, name='update_tweet'),
    path('tweets/<int:tweet_id>/delete/', views.delete_tweet, name='delete_tweet'),
    path('tweets/<int:tweet_id>/like/', views.like_tweet, name='like_tweet'),
    path('tweets/<int:tweet_id>/retweet/', views.retweet, name='retweet'),
    
    # Comment operations
    path('tweets/<int:tweet_id>/comments/', views.comment_on_tweet, name='comment_on_tweet'),
    
    # User operations
    path('users/', views.get_Users_and_Tweets , name='get_user_and_tweets'),
    path('users/<str:username>/', views.get_user_profile, name='get_user_profile'),
    path('users/<str:username>/tweets/', views.get_user_tweets, name='get_user_tweets'),
    path('users/<int:user_id>/follow/', views.follow_user, name='follow_user'),
    path('profile/update/', views.update_profile, name='update_profile'),
    
    # Search and notifications
    path('search/', views.search, name='search'),
    path('notifications/', views.get_notifications, name='get_notifications'),
]