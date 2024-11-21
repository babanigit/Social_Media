
export interface ITweet {
  id: string;
  content: string;
  image: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  retweets_count: number;
}

export interface IUser {
  id: string;
  username: string;
  name:string;
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

export interface IGetAllUsers {
  users: User[]
  total_pages: number
  current_page: number
  has_next: boolean
  has_previous: boolean
}

export interface User {
  id: string
  username: string
  name: string
  profile_image: string
  followers_count: number
  following_count: number
}

