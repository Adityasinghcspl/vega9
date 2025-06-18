import express from 'express';
import { createBlog, getBlogs, updateBlog, deleteBlog, getBlogById, } from '../controllers/blogController';
import validateToken from '../middlewares/validateTokenHandler';

const router = express.Router();

// GET all blogs
router.get('/', validateToken, getBlogs);

// POST create new blog
router.post('/', validateToken, createBlog);

// PUT update blog by ID
router.put('/:id', validateToken, updateBlog);

// GET blog by ID
router.get('/:id', validateToken, getBlogById);

// DELETE blog by ID
router.delete('/:id', validateToken, deleteBlog);

export default router;
