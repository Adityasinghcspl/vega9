import React, { useState } from 'react';
import { Search, SortAsc, SortDesc, Calendar, User, BookOpen, Plus } from 'lucide-react';
import { Blog } from '../types/Blog';
import BlogItem from './BlogItem';

interface BlogListProps {
  blogs: Blog[] | null;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, onEdit, onDelete, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'author'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Safely get unique categories
  const categories = Array.from(
    new Set((blogs || []).map(blog => blog.category))
  ).sort();

  // Filter and sort blogs only if not null
  const filteredBlogs = (blogs || [])
    .filter(blog => {
      const matchesSearch =
        blog?.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        blog?.content?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        blog?.author?.toLowerCase().includes(searchTerm?.toLowerCase());

      const matchesCategory = !filterCategory || blog.category === filterCategory;
      const matchesStatus =
        !filterStatus ||
        (filterStatus === 'published' && blog?.published) ||
        (filterStatus === 'draft' && !blog?.published);

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (field: 'date' | 'title' | 'author') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
            <p className="text-gray-600 mt-1">
              {filteredBlogs.length} of {blogs ? blogs.length : 0} posts
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Post</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex space-x-2">
            {['date', 'title', 'author'].map((field) => (
              <button
                key={field}
                onClick={() => toggleSort(field as 'date' | 'title' | 'author')}
                className={`flex-1 px-3 py-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-1 ${
                  sortBy === field 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                title={`Sort by ${field}`}
              >
                {field === 'date' && <Calendar className="w-4 h-4" />}
                {field === 'title' && <BookOpen className="w-4 h-4" />}
                {field === 'author' && <User className="w-4 h-4" />}
                {sortBy === field && (sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog List */}
      {!blogs ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading blogs...</h3>
          <p className="text-gray-500">Please wait while we fetch your blog posts.</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {blogs.length === 0 ? 'No blog posts yet' : 'No posts match your filters'}
          </h3>
          <p className="text-gray-500 mb-6">
            {blogs.length === 0
              ? 'Create your first blog post to get started!'
              : 'Try adjusting your search terms or filters.'}
          </p>
          {blogs.length === 0 && (
            <button
              onClick={onCreateNew}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Post</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogItem
              key={blog._id}
              blog={blog}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
