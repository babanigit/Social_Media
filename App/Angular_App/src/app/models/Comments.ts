export interface IGetComments {
  comments: IComment[]
}

export interface IComment {
  id: string
  content: string
  created_at: string
  user: IUser
}

export interface IUser {
  id: string
  username: string
  profile_image: string
}
