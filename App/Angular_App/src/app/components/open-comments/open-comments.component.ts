import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetApiService } from '../../services/get-api.service';
import { IGetComments } from '../../models/Comments';
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
