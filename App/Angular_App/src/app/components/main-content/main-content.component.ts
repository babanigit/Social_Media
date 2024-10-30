import { Component, OnInit } from '@angular/core';
import { IGetTweets, ITweet } from '../../models/GetTweets';
import { GetApiService } from '../../services/get-api.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements OnInit {
  tweets: ITweet[] = [];  // Now it's an array of tweets
  currentPage = 1;
  totalPages = 1;
  hasNext = false;
  hasPrevious = false;
  loading = false;
  error: string | null = null;
  image: any;  // Add a new property to store the user's profile image

  constructor(private tweetService: GetApiService) { }

  ngOnInit(): void {
    this.loadTweets();
  }

  loadTweets(page: number = 1, userId?: number, followingOnly: boolean = false): void {
    this.loading = true;
    this.error = null;

    this.tweetService.getTweets(page, 10, userId, followingOnly)
      .subscribe({
        next: (response: IGetTweets) => {
          // console.log("the get tweets are ", response  )
          // this.image = response.tweets.
          this.tweets = response.tweets;  // Update to use tweets
          this.currentPage = response.current_page;
          this.totalPages = response.total_pages;
          this.hasNext = response.has_next;
          this.hasPrevious = response.has_previous;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load tweets. Please try again later.';
          this.loading = false;
          console.error('Error loading tweets:', err);
        }
      });
  }

  nextPage(): void {
    if (this.hasNext) {
      this.loadTweets(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.loadTweets(this.currentPage - 1);
    }
  }

  toggleFollowingOnly(): void {
    this.loadTweets(1, undefined, true);
  }

  getLikeFun(idNum: string) {
    this.tweetService.likeTweet(idNum).subscribe((response) => {
      console.log("Like tweet response ", response);
      this.loadTweets(); // You can update the tweets array here as well if you want to reflect the like count immediately.
    })

  }
}
