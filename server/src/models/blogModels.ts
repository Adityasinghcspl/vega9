import mongoose, { Schema, Document } from 'mongoose';
import Joi from 'joi';
import { BlogInput, Category } from '../types/blogTypes';


export interface IBlog extends Document, BlogInput {}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    category: {
      type: String,
      enum: Object.values(Category),
      required: [true, 'Category is required'],
    },
    tags: {
      type: String,
      required: [true, 'Tags are required'],
    },
    published: {
      type: Boolean,
      required: [true, 'Published status is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Blog = mongoose.model<IBlog>('Blog', blogSchema);

// Joi validator
export const validateBlog = (data: BlogInput) => {
  const schema = Joi.object<BlogInput>({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(3).required(),
    author: Joi.string().required(),
    category: Joi.string()
      .valid(...Object.values(Category))
      .required(),
    tags: Joi.string().required(),
    published: Joi.boolean().required(),
  });

  return schema.validate(data);
};

export default Blog;
