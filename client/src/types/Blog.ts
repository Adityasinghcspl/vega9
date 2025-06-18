export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface BlogFormData {
  id?: string;
  title: string;
  content: string;
  author: string;
  category: string;
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