import React, { useState } from "react";
import {
  Edit3,
  Trash2,
  Calendar,
  User,
  Tag,
  Eye,
  EyeOff
} from "lucide-react";
import { Blog } from "../types/Blog";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch } from "../redux/store";
import {
  deleteBlog,
  getAllBlogs,
} from "../redux/features/blog/blogSlice";

interface BlogItemProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

const BlogItem: React.FC<BlogItemProps> = ({
  blog,
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showFullContent, setShowFullContent] = useState(false);

  const handleDelete = async (id: string) => {
    const data = await dispatch(deleteBlog(id)).unwrap();
    toast.success(data) ;
    dispatch(getAllBlogs());
  };

  const formatDate = (date: string | Date) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
      return "Invalid date"; // or return ''
    }

    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(parsedDate);
  };

  const getContentPreview = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  blog.published
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {blog.published ? "Published" : "Draft"}
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                {blog.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {blog.title}
            </h3>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(blog)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit blog"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete blog"
            >
                <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-600 leading-relaxed">
            {showFullContent ? blog.content : getContentPreview(blog.content)}
          </p>
          {blog.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center space-x-1 transition-colors"
            >
              {showFullContent ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Read more</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-600">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors">
                {blog.tags}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
          {blog.createdAt !== blog.updatedAt && (
            <div className="text-xs text-gray-400">
              Updated: {formatDate(blog.updatedAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
