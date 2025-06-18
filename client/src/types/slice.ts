import { Blog, BlogFormData } from "./Blog";
import type { AccessToken } from "./type";

export interface authState {
  signUpUser: {
    data: string | null;
    loading: boolean;
    error: any | null;
  };
  signInUser: {
    data: AccessToken | null;
    loading: boolean;
    error: any | null;
  };
}

export interface BlogState {
  blogsList: {
    data: Blog[] | null;
    loading: boolean;
    error: string | null;
  };
  blog: {
    data: BlogFormData | null;
    loading: boolean;
    error: string | null;
  };
  editingBlog: Blog | null;
  viewingBlog: Blog | null;
}