export interface IGetComments {
  comments: IComment[]
}

export interface IComment {
  id: string
  content: string
  created_at: string
  user: IUser
  likes_count: number
  liked_by_user_ids: string[]
  dislikes_count: number
  disliked_by_user_ids: string[]
}

export interface IUser {
  id: string
  username: string
  name: string
  profile_image: string
}

export interface IGetCommentById {
  id:                   string;
  content:              string;
  created_at:           Date;
  tweet_id:             string;
  user:                 IUser;
  likes_count:          number;
  liked_by_user_ids:    string[];
  dislikes_count:       number;
  disliked_by_user_ids: any[];
}

