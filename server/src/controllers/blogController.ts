import { Request, Response } from 'express';
import Blog, { validateBlog } from '../models/blogModels';

// @desc    Create a new blog
// @route   POST /api/blog
export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = validateBlog(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const blog = await Blog.create(req.body);
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to create blog' });
  }
};

// @desc    Update a blog by ID
// @route   PUT /api/blog/:id
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = validateBlog(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const blog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    res.status(200).json({ message: 'Blog updated successfully'});
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update blog' });
  }
};

// @desc    Get all blogs
// @route   GET /api/blog
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to fetch blogs' });
  }
};

// @desc    Get blog by id
// @route   GET /api/blog/id
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    res.status(200).json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch blog' });
  }
};

// @desc    Delete a blog by ID
// @route   DELETE /api/blog/:id
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to delete blog' });
  }
};
