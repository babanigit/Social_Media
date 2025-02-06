import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetApiService } from '../../services/get-api.service';
import { IGetCommentById, IGetComments } from '../../models/Comments';
import { IGetTweetById } from '../../models/GetTweets';
import { ILoggedInUser } from '../../models/LoggedInUser';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-open-comments',
  templateUrl: './open-comments.component.html',
  styleUrl: './open-comments.component.css',
})
export class OpenCommentsComponent implements OnInit {
  postId: string | null = null;
  commentsData: IGetComments | undefined;
  tweetById_Data: IGetTweetById | undefined;
  commentById_Data: IGetCommentById | undefined
  user: ILoggedInUser | undefined;
  isLoading = false;

  showLoading() {
    this.isLoading = true; // Show the spinner
  }

  hideLoading() {
    this.isLoading = false; // Hide the spinner
  }

  constructor(
    private route: ActivatedRoute,
    private apiSerV: GetApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.postId = params.get('id'); // Access the 'id' parameter
      if (this.postId) {
        this.fetchCommentAndTweetById(this.postId);
      }
      this.getLoggedInUser();
    });
  }

  getLoggedInUser() {
    this.showLoading();
    this.apiSerV.getLoggedInUser().subscribe({
      next: (data: ILoggedInUser) => {
        this.user = data;
        this.hideLoading();
      },
      error: (err) => {
        this.hideLoading();
        const statusCode = err.status;
        const errorMessage = err.error?.error || 'An unexpected error occurred';

        // Show an error toast
        // this.toastr.error(errorMessage, `Error ${statusCode}`);
      },
    });
  }

  fetchCommentAndTweetById(postId: string) {

    // get tweet by id
    this.showLoading();
    this.apiSerV.getTweetById(postId).subscribe({
      next: (data) => {
        this.tweetById_Data = data;
        this.hideLoading(); // Hide the loading spinner in case of error
      },
      error: (err) => {
        this.hideLoading(); // Hide the loading spinner in case of error
        const statusCode = err.status;
        const errorMessage = err.error?.error || 'An unexpected error occurred';

        // Show an error toast
        // this.toastr.error(errorMessage, `Error ${statusCode}`);
      },
    });

    // get comments by tweet id
    this.showLoading();
    this.apiSerV.getTweetComments(postId).subscribe({
      next: (data) => {
        this.commentsData = data;
        this.hideLoading(); // Hide the loading spinner
      },
      error: (err) => {
        this.hideLoading(); // Hide the loading spinner in case of error
        const statusCode = err.status;
        const errorMessage = err.error?.error || 'An unexpected error occurred';

        // Show an error toast
        this.toastr.error(errorMessage, `Error ${statusCode}`);
      },
    });

    //bab
     // get comment by id
     this.showLoading();
     this.apiSerV.getCommentById("4bcfa6f3-3644-4d25-bb83-9abbdf75ada3").subscribe({
       next: (data: IGetCommentById) => {
         this.commentById_Data = data;
         this.hideLoading(); // Hide the loading spinner
       },
       error: (err) => {
         this.hideLoading(); // Hide the loading spinner in case of error
         const statusCode = err.status;
         const errorMessage = err.error?.error || 'An unexpected error occurred';

         // Show an error toast
         this.toastr.error(errorMessage, `Error ${statusCode}`);
       },
     });

  }

  //@bab
  toggleLikeComment(commentId: string): void {
    if (this.commentById_Data!.liked_by_user_ids.includes(this.user!.id)) {
      // Unlike the comment
      // this.apiSerV.unlikeComment(commentId).subscribe({
      //   next: () => {
      //     // Remove user ID from liked_by_user_ids
      //     const index = this.commentById_Data.liked_by_user_ids.indexOf(this.user.id);
      //     if (index !== -1) {
      //       this.commentById_Data.liked_by_user_ids.splice(index, 1);
      //     }
      //   },
      //   error: (err) => {
      //     const errorMessage = err.error?.error || 'Failed to unlike comment';
      //     this.toastr.error(errorMessage, `Error`);
      //   },
      // });
    } else {
      // Like the comment
      this.apiSerV.likeComment(commentId).subscribe({
        next: () => {
          // Add user ID to liked_by_user_ids
          this.commentById_Data!.liked_by_user_ids.push(this.user!.id);
        },
        error: (err) => {
          const errorMessage = err.error?.error || 'Failed to like comment';
          this.toastr.error(errorMessage, `Error`);
        },
      });
    }
  }


  getLikeFun(idNum: string) {
    this.showLoading(); // Show the loading spinner

    this.apiSerV.likeTweet(idNum).subscribe({
      next: (response) => {
        if (this.postId) {
          this.fetchCommentAndTweetById(this.postId);
        }

        this.hideLoading(); // Hide the loading spinner
        const message = response.message;

        // Success toast
        this.toastr.success(message, 'Success', {
          timeOut: 1200,
        });
      },
      error: (err) => {
        this.hideLoading(); // Hide the loading spinner in case of error
        const statusCode = err.status;
        const errorMessage = err.error?.error || 'An unexpected error occurred';

        // Show an error toast
        this.toastr.error(errorMessage, `Error ${statusCode}`);
      },
      complete: () => {
        console.log('API request completed.');
      },
    });
  }

  getLikeComment(tweetId: string) {
    this.showLoading(); // Show the loading spinner

    this.apiSerV.likeComment(tweetId).subscribe({
      next: (response) => {
        if (this.postId) {
          this.fetchCommentAndTweetById(this.postId);
        }

        this.hideLoading(); // Hide the loading spinner
        const message = response.message;

        // Success toast
        this.toastr.success(message, 'Success', {
          timeOut: 1200,
        });
      },
      error: (err) => {
        this.hideLoading(); // Hide the loading spinner in case of error
        const statusCode = err.status;
        const errorMessage = err.error?.error || 'An unexpected error occurred';

        // Show an error toast
        this.toastr.error(errorMessage, `Error ${statusCode}`);
      },
      complete: () => {
        console.log('API request completed.');
      },
    });
  }

  getDisLikeComment(tweetId: string) {
    this.showLoading(); // Show the loading spinner

    this.apiSerV.dislikeComment(tweetId).subscribe({
      next: (response) => {
        if (this.postId) {
          this.fetchCommentAndTweetById(this.postId);
        }

        this.hideLoading(); // Hide the loading spinner
        const message = response.message;

        // Success toast
        this.toastr.success(message, 'Success', {
          timeOut: 1200,
        });
      },
      error: (err) => {
        this.hideLoading(); // Hide the loading spinner in case of error
        const statusCode = err.status;
        const errorMessage = err.error?.error || 'An unexpected error occurred';

        // Show an error toast
        this.toastr.error(errorMessage, `Error ${statusCode}`);
      },
      complete: () => {
        console.log('API request completed.');
      },
    });
  }

  comments: any[] = [];
  newComment = '';

  addComment(): void {
    if (!this.newComment.trim()) {
      this.toastr.warning('Comment cannot be empty');
      return;
    }

    const data = {
      content: this.newComment,
      user_id: this.user!.id,
    };

    this.apiSerV.createComment(this.postId!, data).subscribe({
      next: (response) => {
        this.comments.push(response.comment);
        this.toastr.success('Comment added successfully');
        this.newComment = '';

        if (this.postId) {
          this.fetchCommentAndTweetById(this.postId);
        }
      },
      error: (err) => {
        const statusCode = err.status;
        const errorMessage = err.error?.error || 'An unexpected error occurred';

        // Show an error toast
        this.toastr.error(errorMessage, `Error ${statusCode}`);
      },
    });
  }
}
