import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { IGetTweets, ITweet } from '../../models/GetTweets';
import { GetApiService } from '../../services/get-api.service';
import { ILoggedInUser } from '../../models/LoggedInUser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { IGetAllUsers, IGetAllUsersData } from '../../models/UsersTweets';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css',
})
export class MainContentComponent implements OnInit {
  tweets: ITweet[] = []; // Now it's an array of tweets
  currentPage = 1;
  totalPages = 1;
  hasNext = false;
  hasPrevious = false;
  loading = false;
  error: string | null = null;
  image: any; // Add a new property to store the user's profile image

  user: ILoggedInUser | undefined;
  users: IGetAllUsersData[] = []; // Array of users

  reciveUserData(str: ILoggedInUser) {
    this.user = str;
    console.log('the user is ', this.user);
  }

  constructor(
    private tweetService: GetApiService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTweets();
    this.loadUsers();
  }

  loadTweets(
    page: number = 1,
    userId?: number,
    followingOnly: boolean = false
  ): void {
    this.loading = true;
    this.error = null;

    this.tweetService.getTweets(page, 10, userId, followingOnly).subscribe({
      next: (response: IGetTweets) => {
        this.tweets = response.tweets;
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
      },
    });
  }

  loadUsers(page: number = 1, followingOnly: boolean = false): void {
    this.loading = true;
    this.error = null;

    this.tweetService
      .getAllUsers(page, 10, undefined, followingOnly)
      .subscribe({
        next: (response: IGetAllUsers) => {
          this.users = response.users; // Store the fetched users
          this.currentPage = response.current_page;
          this.totalPages = response.total_pages;
          this.hasNext = response.has_next;
          this.hasPrevious = response.has_previous;
          this.loading = false;

          console.log(' the users are :- ', this.users);
        },
        error: (err) => {
          this.error = 'Failed to load users. Please try again later.';
          this.loading = false;
          console.error('Error loading users:', err);
        },
      });
  }

  nextPageTweets(): void {
    if (this.hasNext) {
      this.loadTweets(this.currentPage + 1);
    }
  }

  previousPageTweets(): void {
    if (this.hasPrevious) {
      this.loadTweets(this.currentPage - 1);
    }
  }

  nextPageUsers(): void {
    if (this.hasNext) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  previousPageUsers(): void {
    if (this.hasPrevious) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  toggleFollowingOnlyTweets(): void {
    this.loadTweets(1, undefined, true);
  }

  toggleFollowingOnlyUsers(): void {
    this.loadUsers(1, true);
  }

  getLikeFun(idNum: string) {
    this.tweetService.likeTweet(idNum).subscribe((response) => {
      console.log('Like tweet response ', response);
      this.loadTweets(); // You can update the tweets array here as well if you want to reflect the like count immediately.
    });
  }

  openComments(postId: string): void {
    this.router.navigate(['/posts', postId]);
  }

  openProfile(postId: string): void {
    this.router.navigate(['/profile', postId]);
  }
}
