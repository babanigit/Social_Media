import { GetApiService } from './../../services/get-api.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILoggedInUser } from '../../models/LoggedInUser';
import { Router } from '@angular/router';

interface UserInfo {
  username: string;
  email: string;
  bio: string;
  profile_image: string | null;
  followers_count: number;
  following_count: number;
  tweets: Array<{
    id: number;
    content: string;
    image: string | null;
    created_at: string;
    likes_count: number;
    comments_count: number;
    retweets_count: number;
  }>;
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
}

@Component({
  selector: 'app-logged-in-user',
  templateUrl: './logged-in-user.component.html',
  styleUrls: ['./logged-in-user.component.css'],
})
export class LoggedInUserComponent implements OnInit {
  @Output() userData = new EventEmitter<ILoggedInUser>();

  user: ILoggedInUser | undefined;
  loading = true;
  error: string | null = null;

  constructor(
    private getApiService: GetApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getLoggedIn();
  }

  getLoggedIn() {
    this.getApiService.getLoggedInUser().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
        this.userData.emit(this.user);
      },
      error: (err) => {
        this.error = 'Failed to load user data. Please try again later.';
        this.loading = false;
        console.error('Error loading user data:', err);
        // this.router.navigate(['/login']);
      },
    });
  }
}
