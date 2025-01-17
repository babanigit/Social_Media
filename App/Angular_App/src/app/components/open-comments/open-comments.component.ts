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
  tweetById: IGetTweetById | undefined;
  isLoading: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private apiSerV: GetApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.postId = params.get('id'); // Access the 'id' parameter
      this.getLoggedIn();
    });
  }

  fetchById(postId: string) {
    this.apiSerV.getTweetComments(postId).subscribe({
      next: (data) => {
        this.commentsData = data;
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
      },
    });

    this.apiSerV.getTweetById(postId).subscribe({
      next: (data) => {
        this.tweetById = data;
      },
      error: (error) => {
        console.error('Error fetching tweetbyid:', error);
      },
    });
  }

  user: ILoggedInUser | undefined;
  loading = true;
  error: string | null = null;

  getLoggedIn() {
    this.apiSerV.getLoggedInUser().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
        if (this.postId) {
          this.fetchById(this.postId);
        }
      },
      error: (err) => {
        this.error = 'Failed to load user data. Please try again later.';
        this.loading = false;
        console.error('Error loading user data:', err);
      },
    });
  }

  getLikeFun(idNum: string) {
    this.apiSerV.likeTweet(idNum).subscribe((response) => {
      console.log('Like tweet response ', response);

      if (this.postId) {
        this.fetchById(this.postId);
      }
    });
  }


  getLikeComment(tweetId: string) {
    this.isLoading = true;

    this.apiSerV.likeComment(tweetId).subscribe({
      next: (response) => {
        if (this.postId) {
          this.fetchById(this.postId);
        }

        this.isLoading = false;
        const message = response.message;

        // Success toast
        this.toastr.success(message, 'Success', {
          timeOut: 1200,
        });
      },
      error: (err) => {
        this.isLoading = false;
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
    console.log('comment DisLiked');

    if (this.postId) {
      this.fetchById(this.postId);
    }
  }
}
