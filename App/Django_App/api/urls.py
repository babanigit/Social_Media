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
    
    path("profile-image/", views.manage_profile_image, name="manage_profile_image"),

    
    # Tweet operations
    path('tweets/', views.get_tweets, name='get_tweets'),
    path('tweets/create/', views.create_tweet, name='create_tweet'),
    path('tweets/<str:tweet_id>/', views.update_tweet, name='update_tweet'),
    path('tweets/<str:tweet_id>/delete/', views.delete_tweet, name='delete_tweet'),
    #like tweet
    path('tweets/<str:tweet_id>/like/', views.like_tweet, name='like_tweet'),
    path('tweets/<str:tweet_id>/retweet/', views.retweet, name='retweet'),
    path('tweet/<str:tweet_id>/tweet', views.get_tweet_by_id, name='get_tweet_by_id'),

        
    # Comment operations
    path('tweets/<str:tweet_id>/getPostPutDeleteComment/', views.post_get_put_delete_tweet_comments, name='get__post_put_delete_tweet_comments'),
    path('tweets/<str:comment_id>/likeComment/', views.like_comment, name='like_comment'),
    path('tweets/<str:comment_id>/dislikeComments/', views.dislike_comment, name='dislike_comment'),
    path('comments/<str:comment_id>/', views.get_comment_by_id, name='get_comment_by_id'),


    #get all Users operations
    path('users/', views.get_Users_and_Tweets , name='get_user_and_tweets'),
    path('getUsers/', views.get_Users , name='get_Users'),
    
    #get user
    path('user/<str:username>/', views.get_user_profile, name='get_user_profile'), 
    #get tweets of user
    path('user/<str:username>/tweets/', views.get_user_tweets, name='get_user_tweets'),
    
    #follow user
    path('user/<str:user_id>/follow/', views.follow_user, name='follow_user'),
    #update user profile
    path('userProfile/update/', views.update_profile, name='update_profile'),
    
    # Search and notifications
    path('search/', views.search, name='search'),
    path('notifications/', views.get_notifications, name='get_notifications'),
]