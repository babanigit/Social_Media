export interface IGetTweets {
  tweets: ITweet[];
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ITweet {
  id: string
  content: string
  image: any
  created_at: string
  likes_count: number
  comments_count: number
  retweets_count: number
  is_liked: boolean
  liked_by_user_ids: string[]
  user: IUser
}

export interface IUser {
  id: string;
  username: string;
  name: string;
  profile_image?: string;
  followers_count: number;
  following_count: number;
}


export interface IGetTweetById {
  id: string
  content: string
  image: any
  created_at: string
  likes_count: number
  comments_count: number
  retweets_count: number
  is_liked: boolean
  liked_by_user_ids: string[]
  comments_ids: string[]
  user: IUser
}
