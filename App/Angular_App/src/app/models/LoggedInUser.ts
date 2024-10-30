export interface ILoggedInUser {
  id: string
  username: string
  email: string
  bio: string
  profile_image: string
  followers_count: number
  following_count: number
  date_joined: string
  tweets: ITweet[]
  total_pages: number
  current_page: number
  has_next: boolean
  has_previous: boolean
}

export interface ITweet {
  id: string
  content: string
  image: any
  created_at: string
  likes_count: number
  comments_count: number
  retweets_count: number
}
