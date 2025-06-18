import type { JwtPayload } from "jwt-decode";

export type SignUpUserForm = {
  name: string;
  email: string;
  password: string;
  retype_password: string;
  profile_url: FileList;
};

export type SignInUserForm = {
  email: string;
  password: string;
};

export type AccessToken = {
  accessToken: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profile_url: string;
  createdAt: string;
  updatedAt: string;
}

// Define a custom interface for the expected token structure
export interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  profile_url: string;
}

export interface Comment {
  id: string;
  blogId: string;
  author: string;
  content: string;
  createdAt: Date;
  parentId?: string;
}