import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Save,
  X,
  Tag,
  User,
  BookOpen,
  FileText,
} from "lucide-react";
import { Blog, BlogFormData } from "../types/Blog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  getAllBlogs,
  updateBlog,
} from "../redux/features/blog/blogSlice";

interface BlogFormProps {
  blog?: Blog;
  onSubmit: (blogData: BlogFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
  blog,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    published: false,
  });

  const [errors, setErrors] = useState<Partial<BlogFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        author: blog.author,
        category: blog.category,
        tags: blog.tags,
        published: blog.published,
      });
    }
  }, [blog]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BlogFormData> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.tags.trim()) newErrors.tags = "Tags is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = { ...formData };

      if (isEditing && blog?._id) {
        await dispatch(
          updateBlog({ id: blog._id, blogData: payload })
        ).unwrap();
        await dispatch(getAllBlogs());
      }

      onSubmit(payload); // Call parent handler
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof BlogFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const categories = [
    "Technology",
    "Lifestyle",
    "Travel",
    "Food",
    "Health",
    "Business",
    "Education",
    "Entertainment",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <Edit3 className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
              <h2 className="text-2xl font-bold">
                {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>Blog Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.title ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Enter an engaging title for your blog post..."
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Author</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.author ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Author name"
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Category</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.category ? "border-red-300" : "border-gray-200"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.category ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Enter tags separated by commas (e.g., react, javascript, web development)"
              />
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Edit3 className="w-4 h-4" />
                <span>Content</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none ${
                  errors.content ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Write your blog content here..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Publish immediately
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? "Update Blog" : "Create Blog"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
