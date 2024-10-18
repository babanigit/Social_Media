from django.urls import path
from .views import (
    register,
    login,
    add_post,
    update_post,
    delete_post,
    view_posts,
    comment_on_post,
    index
)

urlpatterns = [
    path("", index, name="index"),  # Root URL for the default route
    path("register/", register, name="register"),
    path("login/", login, name="login"),
    path("posts/", view_posts, name="view_posts"),
    path("posts/add/", add_post, name="add_post"),
    path("posts/<int:post_id>/update/", update_post, name="update_post"),
    path("posts/<int:post_id>/delete/", delete_post, name="delete_post"),
    path("posts/<int:post_id>/comment/", comment_on_post, name="comment_on_post"),
]
