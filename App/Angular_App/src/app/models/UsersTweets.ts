// src/app/interfaces/tweet.interface.ts

export interface ITweet {
  id: number;
  content: string;
  image: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  retweets_count: number;
}

export interface IUser {
  id: number;
  username: string;
  profile_image: string | null;
  followers_count: number;
  following_count: number;
  tweets: ITweet[];
}

export interface ITweetResponse {
  users: IUser[];
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
}
