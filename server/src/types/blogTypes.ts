export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  category: Category;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface BlogInput {
  title: string;
  content: string;
  author: string;
  category: Category;
  tags: string;
  published: boolean;
}

export interface Comment {
  id: string;
  blogId: string;
  author: string;
  content: string;
  createdAt: Date;
  parentId?: string; // For replies
  replies?: Comment[];
}

export interface CommentFormData {
  author: string;
  content: string;
}

export enum Category {
  Technology = "Technology",
  Lifestyle = "Lifestyle",
  Travel = "Travel",
  Food = "Food",
  Health = "Health",
  Business = "Business",
  Education = "Education",
  Entertainment = "Entertainment",
}