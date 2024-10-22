import { Component, OnInit } from '@angular/core';
import { User, TweetResponse } from '../../../models/UsersTweets';
import { GetApiService } from '../../../services/get-api.service';

@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrl: './demo1.component.css'
})
export class Demo1Component implements OnInit {
  users: User[] = [];
  currentPage = 1;
  totalPages = 1;
  hasNext = false;
  hasPrevious = false;
  loading = false;
  error: string | null = null;

  constructor(private tweetService: GetApiService) {}

  ngOnInit(): void {
    this.loadTweets();
  }

  loadTweets(page: number = 1, userId?: number, followingOnly: boolean = false): void {
    this.loading = true;
    this.error = null;

    this.tweetService.getTweets(page, 10, userId, followingOnly)
      .subscribe({
        next: (response: TweetResponse) => {
          this.users = response.users;
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
}
