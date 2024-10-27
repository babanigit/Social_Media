export interface IRegisterResponse {
  message: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  profile_image?: string; // Optional since it might be null
}

export interface ILoginResponse {
  message: string;
  username: string;
  email: string;
  bio: string;
  profile_image?: string; // Optional since it might be null
}
