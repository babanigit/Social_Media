export interface IGetTweets {
  tweets: Tweet[]
  total_pages: number
  current_page: number
  has_next: boolean
  has_previous: boolean
}

export interface Tweet {
  id: number
  content: string
  image: any
  created_at: string
  likes_count: number
  comments_count: number
  retweets_count: number
  user: User
}

export interface User {
  id: number
  username: string
  name: string
  profile_image: any
  followers_count: number
  following_count: number
}
