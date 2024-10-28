import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  styleUrls: ['./logged-in-user.component.css']
})
export class LoggedInUserComponent implements OnInit {
  userInfo: UserInfo | null = null;
  currentPage: number = 1;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserInfo(this.currentPage);
  }

  loadUserInfo(page: number): void {
    this.http.get("http://127.0.0.1:8000/api/user?page=1", { withCredentials: true })
    .subscribe(
        (response) => console.log("User info:", response),
        (error) => console.error("Error fetching user info", error)
    );

  }

  loadPreviousPage(): void {
    if (this.userInfo && this.userInfo.has_previous) {
      this.loadUserInfo(this.currentPage - 1);
    }
  }

  loadNextPage(): void {
    if (this.userInfo && this.userInfo.has_next) {
      this.loadUserInfo(this.currentPage + 1);
    }
  }
}
