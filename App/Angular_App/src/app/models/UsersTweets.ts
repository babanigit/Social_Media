// src/app/interfaces/tweet.interface.ts

export interface Tweet {
  id: number;
  content: string;
  image: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  retweets_count: number;
}

export interface User {
  id: number;
  username: string;
  profile_image: string | null;
  followers_count: number;
  following_count: number;
  tweets: Tweet[];
}

export interface TweetResponse {
  users: User[];
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
}
