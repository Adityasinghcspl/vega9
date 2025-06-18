import React, { useState } from "react";
import {
  X,
  Calendar,
  User,
  Tag,
  MessageCircle,
  Send,
} from "lucide-react";
import { Blog, CommentFormData } from "../types/Blog";

interface BlogViewModalProps {
  blog: Blog;
  onClose: () => void;
}

const BlogViewModal: React.FC<BlogViewModalProps> = ({
  blog,
  onClose,
}) => {
  const [newComment, setNewComment] = useState<CommentFormData>({
    author: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.content.trim()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      // onAddComment(blog.id, newComment);
      setNewComment({ author: "", content: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
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
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold">
                  {blog.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                {blog.content}
              </div>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600">
                    Tags:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {blog.tags}
                  </span>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t pt-8">
              <div className="flex items-center space-x-2 mb-6">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                {/* <h3 className="text-xl font-bold text-gray-900">
                  Comments ({blogComments.length})
                </h3> */}
              </div>

              {/* Add Comment Form */}
              <form
                onSubmit={handleCommentSubmit}
                className="mb-8 bg-gray-50 rounded-xl p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={newComment.author}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <textarea
                  placeholder="Write your comment..."
                  value={newComment.content}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Post Comment</span>
                </button>
              </form>

              {/* Comments List */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogViewModal;
