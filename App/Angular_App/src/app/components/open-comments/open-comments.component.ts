import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetApiService } from '../../services/get-api.service';
import { IGetComments } from '../../models/Comments';
import { IGetTweetById } from '../../models/GetTweets';

@Component({
  selector: 'app-open-comments',
  templateUrl: './open-comments.component.html',
  styleUrl: './open-comments.component.css',
})
export class OpenCommentsComponent implements OnInit {
  postId: string | null = null;
  commentsData: IGetComments | undefined;
  tweetById: IGetTweetById | undefined;

  constructor(
    private route: ActivatedRoute,
    private commentService: GetApiService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.postId = params.get('id'); // Access the 'id' parameter
      console.log('Post ID:', this.postId);
      // Add logic here to load comments or perform actions based on the ID
      if (this.postId) {
        this.fetchById(this.postId);
      }
    });
  }

  fetchById(postId: string) {
    this.commentService.getTweetComments(postId).subscribe({
      next: (data) => {
        this.commentsData = data;
        console.log('The fetched comments data is:', this.commentsData);
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
      },
    });

    this.commentService.getTweetById(postId).subscribe({
      next: (data) => {
        this.tweetById = data;
        console.log('The fetched tweetbyid is :', this.tweetById);
      },
      error: (error) => {
        console.error('Error fetching tweetbyid:', error);
      },
    });
  }
}
