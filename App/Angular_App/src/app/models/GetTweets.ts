export interface IGetTweets {
  tweets: ITweet[]
  total_pages: number
  current_page: number
  has_next: boolean
  has_previous: boolean
}

export interface ITweet {
  id: number
  content: string
  image: string | undefined
  created_at: string
  likes_count: number
  comments_count: number
  retweets_count: number
  user: IUser
}

export interface IUser {
  id: number
  username: string
  name: string
  profile_image?: string
  followers_count: number
  following_count: number
}
