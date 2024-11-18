# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Base endpoints
    path('', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('user/', views.get_loggedIn_user, name='user'),
    
    # Tweet operations
    path('tweets/', views.get_tweets, name='get_tweets'),
    path('tweets/create/', views.create_tweet, name='create_tweet'),
    path('tweets/<str:tweet_id>/', views.update_tweet, name='update_tweet'),
    path('tweets/<str:tweet_id>/delete/', views.delete_tweet, name='delete_tweet'),
    path('tweets/<str:tweet_id>/like/', views.like_tweet, name='like_tweet'),
    path('tweets/<str:tweet_id>/retweet/', views.retweet, name='retweet'),
    path('tweet/<str:tweet_id>/tweet', views.get_tweet_by_id, name='get_tweet_by_id'),

        
    # Comment operations
    path('tweets/<str:tweet_id>/postGetComments/', views.post_get_tweet_comments, name='get_tweet_comments'),
    path('tweets/<str:comment_id>/likeComment/', views.like_comment, name='like_comment'),
    path('tweets/<str:comment_id>/dislikeComments/', views.dislike_comment, name='dislike_comment'),


    # User operations
    path('users/', views.get_Users_and_Tweets , name='get_user_and_tweets'),
    path('getUsers/', views.get_Users , name='get_Users'),
    
    path('users/<str:username>/', views.get_user_profile, name='get_user_profile'), 
    path('users/<str:username>/tweets/', views.get_user_tweets, name='get_user_tweets'),
    path('users/<str:user_id>/follow/', views.follow_user, name='follow_user'),
    path('profile/update/', views.update_profile, name='update_profile'),
    
    # Search and notifications
    path('search/', views.search, name='search'),
    path('notifications/', views.get_notifications, name='get_notifications'),
]